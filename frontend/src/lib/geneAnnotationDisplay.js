const percentileKeys = ['1', '5', '10', '25', '50'];

export function getTfDisplay(record = {}) {
  const assessment = record.tf_status || record;
  const value = assessment.is_tf;
  const status = assessment.evidence_status || record.tf_evidence_status;
  const sourceVersion = assessment.source_version || record.data_versions?.lambert_tf;
  const hasSource = typeof sourceVersion === 'string' && sourceVersion.trim().length > 0;
  const matchesAssessment = (value === true && status === 'assessed_positive')
    || (value === false && status === 'assessed_negative');

  if (!hasSource || !matchesAssessment) {
    return {
      value: null,
      label: 'Unknown',
      reason: 'Transcription-factor status is unassessed in the available annotation record.',
      sourceVersion: null,
    };
  }

  return {
    value,
    label: value ? 'TF' : 'Assessed non-TF',
    reason: value
      ? 'The source record identifies this gene as a transcription factor.'
      : 'The source record explicitly assesses this gene as a non-transcription factor.',
    sourceVersion,
  };
}

export function readBrowserPercentiles(payload, atlas, cellType = null) {
  const unavailable = reason => ({status: 'source_unavailable', thresholds: {}, reason});
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return unavailable('The API did not return usable percentile thresholds.');
  }
  if (payload.evidence_status && payload.evidence_status !== 'available') {
    return unavailable(payload.reason || 'The selected atlas has no available percentile source.');
  }

  const values = payload.thresholds || payload;
  const thresholds = {};
  for (const key of percentileKeys) {
    const value = values[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
      return unavailable('The API did not return usable percentile thresholds.');
    }
    thresholds[key] = value;
  }
  if (percentileKeys.some((key, index) => index > 0 && thresholds[key] > thresholds[percentileKeys[index - 1]])) {
    return unavailable('The API returned inconsistent percentile thresholds.');
  }

  if (payload.evidence_status === 'available') {
    if (payload.atlas !== atlas || (payload.cell_type ?? null) !== (cellType || null)
      || !Number.isInteger(payload.sample_count) || payload.sample_count <= 0
      || payload.method !== 'sampled_empirical_quantiles') {
      return unavailable('The API did not identify a matching sampled percentile source.');
    }
    return {status: 'available', thresholds, sampleCount: payload.sample_count, reason: null};
  }

  return {
    status: 'provenance_unverified',
    thresholds,
    sampleCount: null,
    reason: 'This API response does not identify percentile provenance; computed values and defaults cannot be distinguished.',
  };
}

export function readGeneBrowserResponse(payload) {
  if (!payload || !Array.isArray(payload.genes) || !Number.isInteger(payload.total) || payload.total < 0
    || payload.total < payload.genes.length
    || payload.genes.some(gene => !gene || typeof gene.gene_symbol !== 'string' || !gene.gene_symbol.trim())
    || (payload.evidence_status && payload.evidence_status !== 'available')) {
    return null;
  }
  return {genes: payload.genes, total: payload.total};
}
