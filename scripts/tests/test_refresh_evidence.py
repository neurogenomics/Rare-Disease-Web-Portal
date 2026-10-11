"""Mocked public API regressions for completeness and allele/source boundaries."""
import contextlib
import io
import json
from pathlib import Path
from types import SimpleNamespace
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import refresh_evidence as refresh


def entry(data, url='https://example.org/source'):
    return {'sourceUrl': url, 'retrievedAt': '2026-10-11T00:00:00+00:00', 'sha256': 'a' * 64,
            'lastModified': None, 'data': data}


def summary(uid, classification):
    return {'uid': uid, 'germline_classification': {'description': classification,
            'review_status': 'criteria provided, single submitter'},
            'clinical_impact_classification': {'description': 'Somatic assertion'},
            'oncogenicity_classification': {'description': 'Oncogenic assertion'},
            'variation_set': [{'measure_id': uid, 'variation_name': 'Source allele',
                'cdna_change': 'c.10A>G', 'canonical_spdi': 'NC_000001.11:9:A:G',
                'variation_loc': [{'assembly_name': 'GRCh38', 'chr': '1', 'start': '10', 'stop': '10',
                    'ref': '', 'alt': '', 'outer_start': '', 'inner_start': ''}]}]}


class RefreshCompletenessTests(unittest.TestCase):
    def run_refresh(self, total, ids, returned_ids=None, cap=None):
        returned_ids = ids if returned_ids is None else returned_ids
        search = entry({'esearchresult': {'count': str(total), 'idlist': ids, 'querytranslation': 'GENE[Gene Name]'}})
        summary_calls = []
        def batches(requested, refresh=False):
            summary_calls.append(requested)
            uids = [uid for uid in returned_ids if uid in requested]
            yield entry({'result': {'uids': uids, **{uid: summary(uid, 'Benign' if uid == '1' else 'Uncertain significance') for uid in uids}}})
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data, public = root / 'data', root / 'public'
            data.mkdir()
            arguments = SimpleNamespace(gene_symbols='GENE', refresh=False, max_variants=cap)
            with patch.object(refresh, 'DATA', data), patch.object(refresh, 'PUBLIC', public), \
                 patch.object(refresh, 'fetch', return_value=search), patch.object(refresh, 'summary_batches', side_effect=batches), \
                 patch.object(refresh, 'gene_reference', return_value=None), patch.object(refresh.time, 'sleep'), \
                 contextlib.redirect_stdout(io.StringIO()):
                refresh.refresh_genes(arguments)
            index = json.loads((data / 'variantIndex.json').read_text())['genes']['GENE']
            payload = json.loads((public / 'variants/GENE.json').read_text()) if (public / 'variants/GENE.json').exists() else None
            return index, payload, summary_calls

    def test_zero_matches_is_a_complete_empty_snapshot_with_search_provenance(self):
        index, payload, calls = self.run_refresh(0, [])
        self.assertTrue(index['complete'])
        self.assertEqual(index['matchedCount'], 0)
        self.assertEqual(payload['variants'], [])
        self.assertEqual(len(payload['metadata']['searchSources']), 1)
        self.assertEqual(payload['metadata']['sources'], [])
        self.assertEqual(calls, [])

    def test_all_classifications_and_separate_somatic_assertions_survive(self):
        index, payload, _ = self.run_refresh(2, ['1', '2'])
        self.assertTrue(index['complete'])
        self.assertEqual([v['classification'] for v in payload['variants']], ['Benign', 'Uncertain significance'])
        for variant in payload['variants']:
            self.assertEqual(variant['somaticClinicalImpact'], {'description': 'Somatic assertion'})
            self.assertEqual(variant['oncogenicity'], {'description': 'Oncogenic assertion'})
            self.assertEqual(variant['mechanism'], 'not_established_by_consequence')

    def test_declared_cap_preserves_true_matched_denominator_and_partial_status(self):
        index, payload, calls = self.run_refresh(2, ['1', '2'], cap=1)
        self.assertFalse(index['complete'])
        self.assertEqual((index['matchedCount'], index['retrievedCount']), (2, 1))
        self.assertEqual(payload['metadata']['declaredCap'], 1)
        self.assertEqual(calls, [['1']])

    def test_server_truncation_or_missing_summary_cannot_claim_completeness(self):
        for total, ids, returned in [(3, ['1', '2'], ['1', '2']), (2, ['1', '2'], ['1'])]:
            with self.subTest(total=total, returned=returned):
                index, payload, _ = self.run_refresh(total, ids, returned)
                self.assertFalse(index['complete'])
                self.assertEqual(payload['metadata']['retrievedCount'], len(returned))

    def test_allele_spdi_and_uncertain_bounds_are_retained_without_inference(self):
        raw = summary('1', 'Benign')
        record = refresh.variant_record(raw)
        self.assertEqual(record['alleles'][0]['spdi'], 'NC_000001.11:9:A:G')
        self.assertEqual(record['alleles'][0]['locations'], raw['variation_set'][0]['variation_loc'])
        self.assertEqual(record['phenotypeLink'], 'disease_context_only')

    def test_gene_reference_uses_translation_length_and_canonical_transcript(self):
        raw = {'id': 'ENSG1', 'assembly_name': 'GRCh38', 'seq_region_name': '1', 'start': 1, 'end': 10000,
               'strand': -1, 'Transcript': [
                   {'id': 'ENST_OTHER', 'start': 1, 'end': 10000, 'Translation': {'length': 1000}},
                   {'id': 'ENST_CANONICAL', 'version': 7, 'is_canonical': 1, 'start': 10, 'end': 5000,
                    'strand': -1, 'Translation': {'length': 100}, 'Exon': [{'id': 'EXON1', 'start': 10, 'end': 100}]},
               ]}
        with patch.object(refresh, 'fetch', return_value=entry(raw)):
            record = refresh.gene_reference('GENE')
        transcript = record['canonicalTranscript']
        self.assertEqual(transcript['id'], 'ENST_CANONICAL')
        self.assertEqual(transcript['version'], 7)
        self.assertEqual(transcript['strand'], -1)
        self.assertEqual(transcript['codingBasesExcludingStop'], 300)
        self.assertNotEqual(transcript['codingBasesExcludingStop'], record['end'] - record['start'] + 1)
        self.assertEqual(record['provenance']['sha256'], 'a' * 64)

    def test_failed_refresh_preserves_prior_snapshot_and_marks_staleness(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data, public = root / 'data', root / 'public'
            data.mkdir()
            (public / 'variants').mkdir(parents=True)
            previous = {'gene': 'GENE', 'retrievedCount': 1, 'matchedCount': 1, 'complete': True,
                        'generatedAt': '2026-10-01T00:00:00+00:00', 'file': '/data/evidence/variants/GENE.json'}
            (data / 'variantIndex.json').write_text(json.dumps({'genes': {'GENE': previous}}))
            prior_content = '{"priorSnapshot":"preserved"}\n'
            (public / 'variants/GENE.json').write_text(prior_content)
            arguments = SimpleNamespace(gene_symbols='GENE', refresh=True, max_variants=None)
            with patch.object(refresh, 'DATA', data), patch.object(refresh, 'PUBLIC', public), \
                 patch.object(refresh, 'fetch', side_effect=OSError('Fixture retrieval unavailable')), \
                 contextlib.redirect_stdout(io.StringIO()):
                refresh.refresh_genes(arguments)
            current = json.loads((data / 'variantIndex.json').read_text())['genes']['GENE']
            self.assertEqual(current['generatedAt'], previous['generatedAt'])
            self.assertEqual(current['retrievedCount'], 1)
            self.assertTrue(current['stale'])
            self.assertIn('Fixture retrieval unavailable', current['refreshError'])
            self.assertIn('refreshAttemptedAt', current)
            self.assertEqual((public / 'variants/GENE.json').read_text(), prior_content)


class TrialRefreshTests(unittest.TestCase):
    def test_companion_cohorts_from_exact_primary_registry_sources_are_retrieved(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data, public = root / 'data', root / 'public'
            data.mkdir()
            (data / 'legacyCatalog.json').write_text(json.dumps({'therapies': []}))
            (data / 'curatedEvidence.json').write_text(json.dumps({
                'assessments': [{'trials': [{'nctId': 'NCT99990001'}]}],
                'sources': [
                    {'url': 'https://clinicaltrials.gov/study/NCT99990002'},
                    {'url': 'https://clinicaltrials.gov/study/NCT99990002?tab=results'},
                    {'url': 'https://www.clinicaltrials.gov/study/NCT99990003/'},
                    {'url': 'https://clinicaltrials.gov.evil.example/study/NCT99990004'},
                    {'url': 'https://other.example/study/NCT99990005'},
                    {'url': 'https://clinicaltrials.gov/study/NCT99990006/related'},
                ],
            }))
            def registry(url, refresh=False):
                nct = url.rsplit('/', 1)[1]
                return entry({'protocolSection': {'identificationModule': {'nctId': nct},
                    'statusModule': {'overallStatus': 'COMPLETED'},
                    'outcomesModule': {'primaryOutcomes': [{'measure': 'Registered endpoint'}]}},
                    'hasResults': False}, url)
            with patch.object(refresh, 'DATA', data), patch.object(refresh, 'PUBLIC', public), \
                 patch.object(refresh, 'fetch', side_effect=registry) as fetch, \
                 contextlib.redirect_stdout(io.StringIO()):
                refresh.refresh_trials(SimpleNamespace(refresh=False))
            requested = [call.args[0].rsplit('/', 1)[1] for call in fetch.call_args_list]
            self.assertTrue({'NCT99990001', 'NCT99990002', 'NCT99990003'}.issubset(requested))
            self.assertEqual(requested.count('NCT99990002'), 1)
            self.assertFalse({'NCT99990004', 'NCT99990005', 'NCT99990006'}.intersection(requested))
            index = json.loads((data / 'trialIndex.json').read_text())
            self.assertEqual(index['metadata']['retrieved'], len(requested))
            self.assertEqual(index['metadata']['retainedStale'], 0)
            for nct in ('NCT99990001', 'NCT99990002', 'NCT99990003'):
                snapshot = json.loads((public / 'trials' / (nct + '.json')).read_text())
                self.assertEqual(snapshot['status'], 'COMPLETED')
                self.assertFalse(snapshot['hasResults'])
                self.assertEqual(snapshot['reportedOutcomes'], [])
                self.assertEqual(snapshot['registeredOutcomes']['primaryOutcomes'][0]['measure'], 'Registered endpoint')
                self.assertEqual(snapshot['outcomeInterpretation'], 'not_automatically_assessed')

    def test_failed_trial_refresh_retains_dated_evidence_only_when_snapshot_exists(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            data, public = root / 'data', root / 'public'
            data.mkdir()
            (public / 'trials').mkdir(parents=True)
            (data / 'legacyCatalog.json').write_text(json.dumps({'therapies': []}))
            (data / 'curatedEvidence.json').write_text(json.dumps({
                'assessments': [{'trials': [{'nctId': 'NCT99990001'}, {'nctId': 'NCT99990002'}]}], 'sources': [],
            }))
            prior = {'nctId': 'NCT99990001', 'status': 'COMPLETED', 'hasResults': True, 'reportedOutcomeCount': 1,
                     'provenance': {'retrievedAt': '2026-10-01T00:00:00+00:00', 'sha256': 'b' * 64}}
            (data / 'trialIndex.json').write_text(json.dumps({'trials': {
                'NCT99990001': prior, 'NCT99990002': {**prior, 'nctId': 'NCT99990002'},
            }}))
            original = b'{"nctId":"NCT99990001","previousEvidence":"preserved"}\n'
            path = public / 'trials/NCT99990001.json'
            path.write_bytes(original)
            with patch.object(refresh, 'DATA', data), patch.object(refresh, 'PUBLIC', public), \
                 patch.object(refresh, 'fetch', side_effect=OSError('Fixture registry unavailable')), \
                 contextlib.redirect_stdout(io.StringIO()):
                refresh.refresh_trials(SimpleNamespace(refresh=True))
            index = json.loads((data / 'trialIndex.json').read_text())
            retained = index['trials']['NCT99990001']
            for field, value in prior.items():
                self.assertEqual(retained[field], value)
            self.assertTrue(retained['stale'])
            self.assertIn('Fixture registry unavailable', retained['refreshError'])
            self.assertIn('refreshAttemptedAt', retained)
            self.assertEqual(path.read_bytes(), original)
            self.assertNotIn('NCT99990002', index['trials'])
            self.assertIn('NCT99990001', index['errors'])
            self.assertIn('NCT99990002', index['errors'])
            self.assertEqual(index['metadata']['retrieved'], 0)
            self.assertEqual(index['metadata']['retainedStale'], 1)


if __name__ == '__main__':
    unittest.main()
