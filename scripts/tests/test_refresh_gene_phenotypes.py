"""Counterexamples for expanded, frozen disease-context gene panels."""
import gzip
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from refresh_gene_phenotypes import project_gene_phenotypes, refresh


class GenePanelProjectionTests(unittest.TestCase):
    def fixture(self, directory):
        raw = ('hpo_id\thpo_name\tncbi_gene_id\tgene_symbol\tdisease_id\n'
               'HP:0001250\tSeizure\t123\tNEW\tOMIM:123456\n'
               'HP:0001250\tSeizure\t123\tNEW\tORPHA:321\n'
               'HP:0000006\tAutosomal dominant inheritance\t123\tNEW\tOMIM:123456\n'
               'HP:0001250\tSeizure\t456\tOTHER\tOMIM:654321\n').encode()
        source = Path(directory) / 'source.tsv.gz'
        with gzip.open(source, 'wb') as stream:
            stream.write(raw)
        return source, {'sha256': hashlib.sha256(raw).hexdigest(), 'retrieved_at': 'frozen-date'}, {
            'HP:0001250': {'isPhenotypicAbnormality': True},
            'HP:0000006': {'isPhenotypicAbnormality': False},
        }

    def test_exact_gene_and_disease_identity_are_retained_without_allele_claims(self):
        with tempfile.TemporaryDirectory() as directory:
            source, meta, terms = self.fixture(directory)
            result = project_gene_phenotypes(source, ['NEW', 'ABSENT'], terms, meta)
        self.assertEqual(result['genes']['ABSENT'], [])
        self.assertEqual([row['disease_id'] for row in result['genes']['NEW'][:2]], ['OMIM:123456', 'ORPHA:321'])
        self.assertEqual(result['genes']['NEW'][0]['ncbi_gene_id'], '123')
        self.assertTrue(result['genes']['NEW'][0]['isPhenotypicAbnormality'])
        self.assertFalse(result['genes']['NEW'][2]['isPhenotypicAbnormality'])
        self.assertNotIn('variant', result['genes']['NEW'][0])
        self.assertEqual(result['metadata']['retrieved_at'], 'frozen-date')
        self.assertEqual(result['metadata']['coverage'], {'requested_genes': 2, 'genes_with_associations': 1, 'association_rows': 3})

    def test_changed_source_release_is_rejected_instead_of_silently_replacing_evidence(self):
        with tempfile.TemporaryDirectory() as directory:
            source, meta, terms = self.fixture(directory)
            with self.assertRaisesRegex(ValueError, 'checksum mismatch'):
                project_gene_phenotypes(source, ['NEW'], terms, {**meta, 'sha256': 'wrong'})

    def test_missing_ontology_term_is_not_classified_as_a_nonclinical_phenotype(self):
        with tempfile.TemporaryDirectory() as directory:
            source, meta, terms = self.fixture(directory)
            del terms['HP:0000006']
            with self.assertRaisesRegex(ValueError, 'absent from the frozen ontology'):
                project_gene_phenotypes(source, ['NEW'], terms, meta)

    def test_duplicate_and_nonexact_symbols_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            source, meta, terms = self.fixture(directory)
            for panel in (['NEW', 'NEW'], [' NEW'], ['']):
                with self.subTest(panel=panel), self.assertRaisesRegex(ValueError, 'unique exact symbols'):
                    project_gene_phenotypes(source, panel, terms, meta)

    def test_panel_extension_preserves_existing_records_and_display_order(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source, meta, terms = self.fixture(directory)
            data = root / 'frontend/src/data/evidence'
            backend = root / 'backend/data'
            data.mkdir(parents=True)
            backend.mkdir(parents=True)
            (backend / 'phenotype_to_genes.tsv.gz').write_bytes(source.read_bytes())
            prior = project_gene_phenotypes(source, ['NEW'], terms, meta)
            prior['genes']['NEW'].reverse()
            (data / 'genePhenotypes.json').write_text(json.dumps(prior))
            (data / 'geneList.json').write_text('["NEW", "OTHER"]')
            (data / 'hpoTerms.json').write_text(json.dumps({'terms': terms}))
            refresh(root)
            result = json.loads((data / 'genePhenotypes.json').read_text())
        self.assertEqual(result['genes']['NEW'], prior['genes']['NEW'])
        self.assertEqual(result['genes']['OTHER'][0]['ncbi_gene_id'], '456')
        self.assertEqual(result['metadata']['coverage']['association_rows'], 4)
