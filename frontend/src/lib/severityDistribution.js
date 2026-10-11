const finiteNumber = value => typeof value === 'number' && Number.isFinite(value);

/** Summarize only actual finite numeric values returned by the source. */
export function readSeverityDistribution(payload) {
  const unavailable = reason => ({ status: 'source_unavailable', reason, values: [], count: 0, stats: null });
  if (!Array.isArray(payload)) return unavailable('The severity score source did not return a usable distribution.');
  const values = payload.filter(finiteNumber).sort((a, b) => a - b);
  if (!values.length) return unavailable('The source returned no finite severity scores. Distribution statistics are unavailable.');
  const count = values.length;
  const midpoint = Math.floor(count / 2);
  const scale = Math.max(Math.abs(values[0]), Math.abs(values[count - 1]));
  const left = values[Math.max(0, midpoint - 1)];
  const right = values[midpoint];
  return {
    status: 'available', values, count, excludedCount: payload.length - count,
    stats: {
      min: values[0], max: values[count - 1],
      mean: scale === 0 ? 0 : (values.reduce((sum, value) => sum + value / scale, 0) / count) * scale,
      median: count % 2 ? right : Math.sign(left) === Math.sign(right) ? left + (right - left) / 2 : left / 2 + right / 2,
    },
  };
}

/** Empirical cumulative share: finite source values at or below the score. */
export function severityPercentile(distribution, score) {
  if (distribution?.status !== 'available' || !distribution.count || !finiteNumber(score)) return null;
  const values = distribution.values;
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (values[middle] <= score) low = middle + 1;
    else high = middle;
  }
  return (low / values.length) * 100;
}
