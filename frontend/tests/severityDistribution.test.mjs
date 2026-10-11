import test from 'node:test';
import assert from 'node:assert/strict';
import { readSeverityDistribution, severityPercentile } from '../src/lib/severityDistribution.js';

test('missing, malformed and empty score sources have no fabricated statistics', () => {
  for (const payload of [null, undefined, {}, 'scores', [], [null, undefined, '0', false, NaN, Infinity, -Infinity]]) {
    const distribution = readSeverityDistribution(payload);
    assert.equal(distribution.status, 'source_unavailable');
    assert.equal(distribution.stats, null);
    assert.equal(severityPercentile(distribution, 10), null);
  }
});

test('statistics and denominator use finite numeric source values and retain true zero', () => {
  const source = [10, null, 0, '20', 20, NaN, Infinity, 30];
  const distribution = readSeverityDistribution(source);
  assert.deepEqual(distribution.values, [0, 10, 20, 30]);
  assert.equal(distribution.count, 4);
  assert.equal(distribution.excludedCount, 4);
  assert.deepEqual(distribution.stats, { min: 0, max: 30, mean: 15, median: 15 });
  assert.equal(severityPercentile(distribution, 10), 50);
  assert.equal(source[0], 10, 'source order is unchanged');
});

test('percentile includes ties and correctly handles scores below and above source extrema', () => {
  const distribution = readSeverityDistribution([10, 20, 20, 30]);
  assert.equal(severityPercentile(distribution, 9), 0);
  assert.equal(severityPercentile(distribution, 10), 25);
  assert.equal(severityPercentile(distribution, 20), 75);
  assert.equal(severityPercentile(distribution, 25), 75);
  assert.equal(severityPercentile(distribution, 30), 100);
  assert.equal(severityPercentile(distribution, 31), 100);
});

test('a missing or nonnumeric selected score never becomes a percentile', () => {
  const distribution = readSeverityDistribution([0, 10, 20]);
  for (const score of [null, undefined, '', '10', false, NaN, Infinity, -Infinity]) {
    assert.equal(severityPercentile(distribution, score), null);
  }
});

test('single values, odd medians and large finite scores remain actual source statistics', () => {
  const zero = readSeverityDistribution([0]);
  assert.deepEqual(zero.stats, { min: 0, max: 0, mean: 0, median: 0 });
  assert.equal(severityPercentile(zero, 0), 100);
  assert.equal(readSeverityDistribution([1, 7, 3]).stats.median, 3);
  const large = readSeverityDistribution([1e308, 1e308]);
  assert.equal(large.stats.mean, 1e308);
  assert.equal(large.stats.median, 1e308);
});
