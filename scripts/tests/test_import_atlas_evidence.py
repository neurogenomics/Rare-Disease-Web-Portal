"""Offline counterexamples for streaming and signed atlas retention.

Run with: python3 -m unittest discover -s scripts/tests -p 'test_*.py'
"""
import contextlib
import hashlib
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from import_atlas_evidence import ATLASES, finite, import_evidence, iter_json_array


class StreamingArrayTests(unittest.TestCase):
    def parse(self, content, chunk_size):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.json'
            path.write_text(content, encoding='utf-8')
            return list(iter_json_array(path, chunk_size=chunk_size))

    def test_chunk_boundaries_preserve_nested_strings_unicode_and_precision(self):
        rows = [{'text': 'braces } ], comma, quote " and backslash \\ Ω',
                 'nested': {'values': [None, True, {'q': 1.234567890123456e-200}]}},
                {'q': 0, 'estimate': -0.000000000001}]
        source = '\n  ' + json.dumps(rows, ensure_ascii=False, indent=2) + '\n'
        for size in (1, 2, 3, 7, 16, 1024):
            with self.subTest(chunk_size=size):
                self.assertEqual(self.parse(source, size), rows)

    def test_empty_array_is_valid_at_one_character_chunks(self):
        self.assertEqual(self.parse(' \n[ \t ]\n', 1), [])

    def test_malformed_arrays_fail_at_every_small_chunk_size(self):
        invalid = ['[{},]', '[{}, \n]', '[{} {}]', '[{}] trailing',
                   '[{}][{}]', '[{}', '[', '', '{}', '[1]', '[{},null]']
        for source in invalid:
            for size in (1, 2, 7):
                with self.subTest(source=source, chunk_size=size):
                    with self.assertRaises((ValueError, json.JSONDecodeError)):
                        self.parse(source, size)

    def test_finite_excludes_missing_boolean_string_nonfinite_and_out_of_range(self):
        for value in (None, True, False, '0.01', float('nan'), float('inf'),
                      float('-inf'), -0.001, 1.001):
            with self.subTest(value=value):
                self.assertIsNone(finite(value, 0, 1))
        for value in (0, 1, 1.234567890123456e-200):
            self.assertEqual(finite(value, 0, 1), value)
        self.assertEqual(finite(-2.3), -2.3)


class AtlasRetentionTests(unittest.TestCase):
    def test_signed_significance_all_tested_coverage_and_source_precision(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source, data, public = [root / name for name in ('source', 'data', 'public')]
            source.mkdir()
            data.mkdir()
            (data / 'geneList.json').write_text('["GENE1"]')
            (data / 'genePhenotypes.json').write_text(json.dumps({
                'genes': {'GENE1': [{'hpo_id': 'HP:0000001'}]}}))
            original = [
                {'hpo_id': 'HP:0000001', 'celltype_name': 'Positive', 'q': 1.234567890123456e-200, 'estimate': 2},
                {'hpo_id': 'HP:0000001', 'celltype_name': 'Negative', 'q': 0.001, 'estimate': -3},
                {'hpo_id': 'HP:0000001', 'celltype_name': 'Zero', 'q': 0, 'estimate': 0},
                {'hpo_id': 'HP:0000001', 'celltype_name': 'Unknown direction', 'q': 0.01, 'estimate': None},
                {'hpo_id': 'HP:0000001', 'celltype_name': 'Boundary', 'q': 0.05, 'estimate': 3},
                {'hpo_id': 'HP:0000001', 'celltype_name': 'Nonsignificant', 'q': 0.9, 'estimate': 9},
                {'hpo_id': 'HP:0000001', 'celltype_name': 'Invalid q', 'q': float('nan'), 'estimate': float('inf'), 'p': 2, 'std_error': -1},
                {'hpo_id': 'HP:0000002', 'celltype_name': 'Other negative', 'q': 0.02, 'estimate': -2},
                {'hpo_id': 'HP:0000002', 'celltype_name': 'Other positive', 'q': 0.03, 'estimate': 1},
                {'hpo_id': 'HP:0000002', 'celltype_name': 'Other nonsignificant', 'q': 0.6, 'estimate': 2},
                {'hpo_id': 'HP:0000003', 'celltype_name': 'No significance', 'q': 0.7, 'estimate': 2},
            ]
            for atlas in ATLASES:
                rows = [dict(row, celltype_database=atlas, _id={'$oid': f'{atlas}:{i}'})
                        for i, row in enumerate(original)]
                (source / f'hpo_celltype_{atlas}.json').write_text(json.dumps(rows))
                (source / f'celltype_gene_{atlas}.json').write_text(json.dumps([
                    {'gene': 'gene1', 'celltype': 'Cell A', 'expression_specificity': 0.123456789012345},
                    {'gene': 'GENE1', 'celltype': 'Cell B', 'expression_specificity': 0},
                    {'gene': 'GENE1', 'celltype': 'Missing', 'expression_specificity': None},
                    {'gene': 'UNRELATED', 'celltype': 'Excluded', 'expression_specificity': 1},
                ]))
            with contextlib.redirect_stdout(io.StringIO()):
                import_evidence(source, data_dir=data, public_dir=public)
            index = json.loads((data / 'atlasIndex.json').read_text())
            panel = json.loads((public / 'associations/HP_0000001.json').read_text())
            other = json.loads((public / 'associations/HP_0000002.json').read_text())
            self.assertEqual(panel['_metadata']['coverage'], 'all_tested_rows')
            self.assertEqual(other['_metadata']['coverage'], 'all_significant_rows')
            self.assertEqual(len(panel['rows']), 14)
            self.assertEqual(len(other['rows']), 4)
            self.assertEqual({row['cell'] for row in other['rows']}, {'Other negative', 'Other positive'})
            self.assertIsNone(index['phenotypes']['HP:0000003']['file'])
            for atlas in ATLASES:
                stats = index['phenotypes']['HP:0000001']['atlases'][atlas]
                self.assertEqual(stats['testedRows'], 7)
                self.assertEqual(stats['storedRows'], 7)
                self.assertEqual([stats[key] for key in ('positiveSignificant', 'negativeSignificant',
                    'zeroDirectionSignificant', 'unknownDirectionSignificant')], [1, 1, 1, 1])
                self.assertEqual(stats['missingOrInvalidQ'], 1)
                self.assertEqual(stats['reportedZeroQ'], 1)
                self.assertEqual(stats['top']['cell'], 'Positive')
                rows = {row['cell']: row for row in panel['rows'] if row['atlas'] == atlas}
                self.assertEqual(rows['Positive']['q'], original[0]['q'])
                self.assertEqual(rows['Negative']['direction'], 'negative')
                self.assertEqual(rows['Boundary']['significance'], 'not_significant')
                self.assertEqual(rows['Zero']['q'], 0)
                self.assertEqual(rows['Invalid q']['significance'], 'unknown')
                for key in ('q', 'p', 'estimate', 'std_error'):
                    self.assertIsNone(rows['Invalid q'][key])
                manifest = next(m for m in index['_metadata']['sources']
                                if m['atlas'] == atlas and m['kind'] == 'phenotype_cell_associations')
                self.assertEqual(manifest['sourceRows'], 11)
                self.assertEqual(manifest['retainedRows'], 9)
                self.assertEqual(manifest['sha256'], hashlib.sha256(
                    (source / f'hpo_celltype_{atlas}.json').read_bytes()).hexdigest())
            expression = json.loads((data / 'geneExpression.json').read_text())
            for atlas in ATLASES:
                self.assertEqual(expression['genes']['GENE1'][atlas], [
                    {'cell': 'Cell A', 'specificity': 0.123456789012345},
                    {'cell': 'Cell B', 'specificity': 0},
                    {'cell': 'Missing', 'specificity': None},
                ])
            for path in [*public.rglob('*.json'), data / 'atlasIndex.json', data / 'geneExpression.json']:
                json.loads(path.read_text(), parse_constant=lambda value: self.fail(f'{path}: {value}'))


if __name__ == '__main__':
    unittest.main()
