"""Offline ClinGen dosage parsing: source ratings and identifiers stay distinct."""
import csv
import io
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from refresh_dosage import parse_dosage


def fixture(rows):
    headers = ['Gene Symbol', 'Gene ID', 'cytoBand', 'Genomic Location', 'Date Last Evaluated']
    for prefix in ('Haploinsufficiency', 'Triplosensitivity'):
        headers += [prefix + ' Score', prefix + ' Description', prefix + ' Disease ID']
        headers += [prefix + ' PMID' + str(i) for i in range(1, 7)]
    out = io.StringIO()
    out.write('#ClinGen gene dosage\n#11 Oct,2026\n')
    writer = csv.DictWriter(out, headers, delimiter='\t', lineterminator='\n')
    out.write('#')
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    return out.getvalue()


class DosageParsingTests(unittest.TestCase):
    def row(self, gene='GENE1', score='0'):
        return {'Gene Symbol': gene, 'Gene ID': '00123', 'cytoBand': '1q1',
                'Genomic Location': 'chr1:10-100', 'Date Last Evaluated': '2025-02-03',
                'Haploinsufficiency Score': score, 'Haploinsufficiency Description': 'Source description',
                'Haploinsufficiency Disease ID': 'MONDO:0012345',
                'Haploinsufficiency PMID1': '12345678', 'Haploinsufficiency PMID6': '23456789',
                'Triplosensitivity Score': '3', 'Triplosensitivity Description': 'Sufficient evidence',
                'Triplosensitivity Disease ID': ''}

    def test_zero_recessive_unlikely_and_unscored_ratings_are_not_collapsed(self):
        pairs = [('0', 0), ('30', 30), ('40', 40), ('', None), ('Not yet evaluated', None)]
        parsed = parse_dosage(fixture([self.row(f'GENE{i}', score) for i, (score, _) in enumerate(pairs)]))
        for i, (source_score, expected) in enumerate(pairs):
            with self.subTest(score=source_score):
                record = parsed[f'GENE{i}']['haploinsufficiency']
                self.assertEqual(record['score'], expected)
                self.assertEqual(record['sourceScore'], source_score)
                self.assertEqual(record['description'], 'Source description')
                self.assertEqual(parsed[f'GENE{i}']['triplosensitivity']['score'], 3)

    def test_disease_gene_and_publication_identifiers_remain_exact_source_values(self):
        record = parse_dosage(fixture([self.row()]))['GENE1']
        self.assertEqual(record['ncbiGeneId'], '00123')
        self.assertEqual(record['assembly'], 'GRCh38')
        self.assertEqual(record['location'], 'chr1:10-100')
        self.assertEqual(record['lastEvaluated'], '2025-02-03')
        self.assertEqual(record['haploinsufficiency']['diseaseId'], 'MONDO:0012345')
        self.assertEqual(record['haploinsufficiency']['pmids'], ['12345678', '23456789'])
        self.assertIsNone(record['triplosensitivity']['diseaseId'])
        self.assertEqual(record['triplosensitivity']['pmids'], [])
        self.assertTrue(record['url'].endswith('/GENE1'))

    def test_duplicate_gene_cannot_silently_overwrite_a_curation(self):
        with self.assertRaisesRegex(ValueError, 'Duplicate dosage gene'):
            parse_dosage(fixture([self.row(score='0'), self.row(score='3')]))


if __name__ == '__main__':
    unittest.main()
