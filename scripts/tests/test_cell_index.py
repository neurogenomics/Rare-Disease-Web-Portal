"""Reverse-cell indexing must retain every significant signed association."""
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from build_cell_index import build_index


class CellIndexTests(unittest.TestCase):
    def test_all_positive_rows_signed_separation_zero_q_and_exact_cell_identity(self):
        def row(cell, q, estimate, atlas='DescartesHuman'):
            return {'cell': cell, 'q': q, 'estimate': estimate, 'atlas': atlas}
        with tempfile.TemporaryDirectory() as directory:
            public = Path(directory)
            (public / 'associations').mkdir()
            rows = [row('Top cell', 1e-120, 2), row('Non-top cell', 0.02, 1),
                    row('Reported zero q', 0, 0.3), row('Negative cell', 0.001, -1),
                    row('Top cell', 0.01, 0.2, 'HumanCellLandscape'),
                    row('Top cell ', 0.03, 0.5), row('At threshold', 0.05, 3),
                    row('Unknown q', None, 2), row('Boolean q', True, 2),
                    row('Unknown direction', 0.01, None), row('Boolean direction', 0.01, True),
                    row('Zero direction', 0.01, 0), row('Negative q', -0.1, 1),
                    row('NaN direction', 0.01, float('nan')), row('Infinite direction', 0.01, float('inf'))]
            snapshot = {'hpo_id': 'HP:0001250', 'rows': rows}
            (public / 'associations/HP_0001250.json').write_text(json.dumps(snapshot))
            index = {'_metadata': {'qThreshold': 0.05}, 'phenotypes': {'HP:0001250': {
                'file': '/data/evidence/associations/HP_0001250.json',
                'atlases': {'DescartesHuman': {'top': {'cell': 'Top cell', 'q': 1e-120}}},
            }}}
            value = build_index(index, public)['cells']
            self.assertEqual(set(value['DescartesHuman']), {'Top cell', 'Non-top cell', 'Reported zero q', 'Negative cell', 'Top cell '})
            for name in ('Top cell', 'Non-top cell', 'Reported zero q', 'Top cell '):
                self.assertEqual(value['DescartesHuman'][name], {'positiveHpoIds': ['HP:0001250'], 'negativeHpoIds': []})
            self.assertEqual(value['DescartesHuman']['Negative cell'], {'positiveHpoIds': [], 'negativeHpoIds': ['HP:0001250']})
            self.assertEqual(value['HumanCellLandscape']['Top cell']['positiveHpoIds'], ['HP:0001250'])

    def test_source_hpo_mismatch_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            public = Path(directory)
            (public / 'associations').mkdir()
            (public / 'associations/wrong.json').write_text(json.dumps({'hpo_id': 'HP:0002015', 'rows': []}))
            index = {'_metadata': {'qThreshold': 0.05}, 'phenotypes': {'HP:0001250': {'file': '/data/evidence/associations/wrong.json'}}}
            with self.assertRaisesRegex(ValueError, 'HPO mismatch'):
                build_index(index, public)


if __name__ == '__main__':
    unittest.main()
