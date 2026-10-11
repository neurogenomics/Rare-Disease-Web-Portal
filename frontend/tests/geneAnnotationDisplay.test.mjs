import test from 'node:test';
import assert from 'node:assert/strict';
import {getTfDisplay, readBrowserPercentiles, readGeneBrowserResponse} from '../src/lib/geneAnnotationDisplay.js';

test('missing, legacy false and unassessed TF annotations remain unknown', () => {
  for (const record of [
    {}, {is_tf: null}, {is_tf: false}, {is_tf: true},
    {is_tf: false, tf_evidence_status: 'unknown'},
    {is_tf: false, tf_evidence_status: 'assessed_negative', tf_metadata: {}},
    {is_tf: false, tf_evidence_status: 'assessed_negative', data_versions: {lambert_tf: ' '}},
    {is_tf: false, tf_evidence_status: 'assessed_positive', data_versions: {lambert_tf: '2018-01-29'}},
    {is_tf: true, tf_status: {is_tf: null, evidence_status: 'unknown'}},
  ]) {
    assert.equal(getTfDisplay(record).value, null);
    assert.equal(getTfDisplay(record).label, 'Unknown');
  }
});

test('source-backed positive and negative TF assessments remain distinct', () => {
  for (const value of [true, false]) {
    const evidence_status = value ? 'assessed_positive' : 'assessed_negative';
    const expectedLabel = value ? 'TF' : 'Assessed non-TF';
    for (const record of [
      {is_tf: value, tf_evidence_status: evidence_status, data_versions: {lambert_tf: '2018-01-29'}},
      {tf_status: {is_tf: value, evidence_status, source_version: '2018-01-29'}},
      {is_tf: value, evidence_status, source_version: '2018-01-29'},
    ]) {
      assert.equal(getTfDisplay(record).value, value);
      assert.equal(getTfDisplay(record).label, expectedLabel);
      assert.equal(getTfDisplay(record).sourceVersion, '2018-01-29');
    }
  }
});

const thresholds = {'1': 0.14, '5': 0.05, '10': 0.02, '25': 0.01, '50': 0};
const sampled = () => ({thresholds, evidence_status: 'available', sample_count: 500, atlas: 'DescartesHuman', method: 'sampled_empirical_quantiles'});

test('source-supported percentiles preserve zero and distinguish legacy unverified values', () => {
  const result = readBrowserPercentiles(sampled(), 'DescartesHuman');
  assert.equal(result.status, 'available');
  assert.equal(result.sampleCount, 500);
  assert.equal(result.thresholds['50'], 0);
  assert.equal(readBrowserPercentiles({...sampled(), cell_type: 'Microglia'}, 'DescartesHuman', 'Microglia').status, 'available');
  const legacy = readBrowserPercentiles(thresholds, 'DescartesHuman');
  assert.equal(legacy.status, 'provenance_unverified');
  assert.deepEqual(legacy.thresholds, thresholds);
  assert.match(legacy.reason, /defaults cannot be distinguished/);
});

test('absent, malformed and wrong-atlas percentile sources never synthesize thresholds', () => {
  for (const payload of [
    null, {}, [], {thresholds: {}, evidence_status: 'source_unavailable'},
    {...sampled(), sample_count: 0}, {...sampled(), atlas: 'HumanCellLandscape'},
    {...sampled(), cell_type: 'Other cell'},
    {...sampled(), method: 'fallback'}, {...thresholds, '10': '0.02'},
    {...thresholds, '10': NaN}, {...thresholds, '10': Infinity},
    {...thresholds, '10': -0.1}, {...thresholds, '10': 1.1},
    {...thresholds, '10': 0.1},
  ]) {
    const result = readBrowserPercentiles(payload, 'DescartesHuman');
    assert.equal(result.status, 'source_unavailable');
    assert.deepEqual(result.thresholds, {});
  }
});

test('an available empty browser result differs from an absent or malformed response', () => {
  assert.deepEqual(readGeneBrowserResponse({genes: [], total: 0}), {genes: [], total: 0});
  assert.deepEqual(readGeneBrowserResponse({genes: [{gene_symbol: 'SCN1A'}], total: 92}), {
    genes: [{gene_symbol: 'SCN1A'}], total: 92,
  });
  for (const payload of [null, {}, {genes: []}, {genes: [], total: '0'},
    {genes: [{}], total: 1}, {genes: [{gene_symbol: 'SCN1A'}], total: 0},
    {genes: [], total: 0, evidence_status: 'source_unavailable'}]) {
    assert.equal(readGeneBrowserResponse(payload), null);
  }
});
