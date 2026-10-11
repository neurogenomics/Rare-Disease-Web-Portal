"""Offline ontology ancestry and source-query tests; no MongoDB or network."""
import gzip
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
sys.path.insert(0, str(ROOT / 'backend'))
from refresh_hpo_terms import parse_obo
import phenotype_associations as hpo
from candidate_evidence import candidate_associations


OBO = '''format-version: 1.2
data-version: hp/releases/fixture

[Term]
id: HP:0001250
name: Seizure
synonym: "Fits" EXACT []
is_a: HP:0000707 ! Abnormality of the nervous system

[Term]
id: HP:0000006
name: Autosomal dominant inheritance
is_a: HP:0000005 ! Mode of inheritance

[Term]
id: HP:0000707
name: Abnormality of the nervous system
is_a: HP:0000118 ! Phenotypic abnormality

[Term]
id: HP:0000200
name: Finding with two parents
is_a: HP:0000005 ! Nonclinical first parent
is_a: HP:0000707 ! Clinical second parent

[Term]
id: HP:0000201
name: obsolete Clinical finding
is_a: HP:0000707 ! Clinical parent
is_obsolete: true

[Term]
id: HP:0000202
name: Part-of relationship only
relationship: part_of HP:0000118
is_a: HP:0000001 ! All

[Term]
id: HP:0000118
name: Phenotypic abnormality
is_a: HP:0000001 ! All

[Term]
id: HP:0000005
name: Mode of inheritance
is_a: HP:0000001 ! All

[Term]
id: HP:0000001
name: All

[Typedef]
id: HP:9999999
name: Not an ontology term
'''


class HpoOntologyTests(unittest.TestCase):
    def test_isa_descendants_preserve_multiple_parents_and_ignore_typedef(self):
        terms, version = parse_obo(OBO)
        self.assertEqual(version, 'hp/releases/fixture')
        self.assertEqual(terms['HP:0000200']['parents'], ['HP:0000005', 'HP:0000707'])
        self.assertTrue(terms['HP:0000200']['isPhenotypicAbnormality'])
        self.assertTrue(terms['HP:0001250']['isPhenotypicAbnormality'])
        self.assertEqual(terms['HP:0001250']['synonyms'], ['Fits'])
        self.assertNotIn('HP:9999999', terms)

    def test_roots_inheritance_obsolete_and_non_isa_relationships_are_not_endpoints(self):
        terms, _ = parse_obo(OBO)
        for identifier in ('HP:0000001', 'HP:0000118', 'HP:0000005', 'HP:0000006', 'HP:0000201', 'HP:0000202'):
            with self.subTest(identifier=identifier):
                self.assertFalse(terms[identifier]['isPhenotypicAbnormality'])

    def test_real_sqlite_query_attaches_ontology_flags_and_candidate_join_excludes_metadata(self):
        raw = ('hpo_id\thpo_name\tncbi_gene_id\tgene_symbol\tdisease_id\n'
               'HP:0001250\tSeizure\t123\tGENE1\tOMIM:123456\n'
               'HP:0000006\tAutosomal dominant inheritance\t123\tGENE1\tOMIM:123456\n'
               'HP:9999999\tUnknown term\t123\tGENE1\tOMIM:123456\n').encode()
        with tempfile.TemporaryDirectory() as directory:
            data = Path(directory)
            source, manifest_path, database = [data / name for name in ('source.tsv.gz', 'manifest.json', 'index.sqlite')]
            with gzip.open(source, 'wb') as stream:
                stream.write(raw)
            manifest = {'sha256': hashlib.sha256(raw).hexdigest(), 'source_url': hpo.SOURCE_URL,
                        'retrieved_at': '2026-10-11T00:00:00+00:00'}
            manifest_path.write_text(json.dumps(manifest))
            with gzip.open(data / 'phenotypic_abnormality_ids.json.gz', 'wt') as stream:
                json.dump({'knownIds': ['HP:0001250', 'HP:0000006'], 'ids': ['HP:0001250'],
                           'metadata': {'sha256': 'b' * 64}}, stream)
            hpo.get_phenotype_branch.cache_clear()
            try:
                with patch.object(hpo, 'DATA_DIR', data), patch.object(hpo, 'SOURCE_PATH', source), \
                     patch.object(hpo, 'MANIFEST_PATH', manifest_path), patch.object(hpo, 'DATABASE_PATH', database):
                    rows = hpo.get_phenotype_gene_associations(gene_symbols=['GENE1'])
                by_id = {row['hpo_id']: row for row in rows}
                self.assertIs(by_id['HP:0001250']['isPhenotypicAbnormality'], True)
                self.assertIs(by_id['HP:0000006']['isPhenotypicAbnormality'], False)
                self.assertIsNone(by_id['HP:9999999']['isPhenotypicAbnormality'])
                self.assertEqual(by_id['HP:0001250']['ontology_source_sha256'], 'b' * 64)
                selected = [by_id['HP:0001250'], by_id['HP:0000006']]
                candidates = candidate_associations(
                    severity_rows=[{'hpo_id': row['hpo_id'], 'severity_score_gpt': 99, 'congenital_onset': 0} for row in selected],
                    cell_rows=[{'hpo_id': row['hpo_id'], 'celltype_name': 'Neuron', 'q': 0.001, 'estimate': 2} for row in selected],
                    gene_rows=[{'gene': 'GENE1', 'celltype': 'Neuron', 'expression_specificity': 0.9}],
                    associations=selected, db_type='DescartesHuman', severity_min=20,
                    congenital_onset_max=1, q_threshold=0.05, expression_specificity_min=0.1)
                self.assertEqual([row['hpo_id'] for row in candidates], ['HP:0001250'])
                self.assertEqual(candidates[0]['therapeutic_suitability'], 'not_assessed')
            finally:
                hpo.get_phenotype_branch.cache_clear()


if __name__ == '__main__':
    unittest.main()
