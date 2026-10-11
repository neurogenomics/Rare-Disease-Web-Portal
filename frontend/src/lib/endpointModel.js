/** Explicit curator joins. Shared source documents, gene names and labels never create a join. */
export function getEndpointAssessment(data, assessmentId) {
  return (data?.assessments || []).find(record => record.assessmentId === assessmentId) || null;
}

export function getEndpointResults(data, assessmentId, hpoId, diseaseId = null) {
  if (!hpoId) return [];
  const record = getEndpointAssessment(data, assessmentId);
  return (record?.endpointResults || []).filter(result => result.hpoId === hpoId &&
    (!diseaseId || (result.diseaseIds || []).includes(diseaseId)));
}

export function matchesTreatmentDisease(data, assessmentId, diseaseId, hpoId = null) {
  if (!diseaseId) return true;
  const record = getEndpointAssessment(data, assessmentId);
  return (record?.endpointResults || []).some(result => (!hpoId || result.hpoId === hpoId) &&
    (result.diseaseIds || []).includes(diseaseId));
}

export function matchesTreatmentContext(data, assessmentId, phenotypes, { hpo, disease, cellHpoIds = null } = {}) {
  if (!hpo && !disease && cellHpoIds === null) return true;
  return (phenotypes || []).some(phenotype => (!hpo || phenotype.hpoId === hpo) &&
    (cellHpoIds === null || cellHpoIds.includes(phenotype.hpoId)) &&
    matchesTreatmentDisease(data, assessmentId, disease, phenotype.hpoId));
}

export function getEndpointObservations(data, assessmentId, hpoId, diseaseId = null) {
  const record = getEndpointAssessment(data, assessmentId);
  const results = new Set(getEndpointResults(data, assessmentId, hpoId, diseaseId).map(result => result.id));
  return (record?.cellObservations || []).filter(observation =>
    (observation.hpoIds || []).includes(hpoId) &&
    (observation.endpointResultIds || []).some(id => results.has(id)) &&
    (!diseaseId || (observation.diseaseIds || []).includes(diseaseId)));
}

export function endpointEvidenceCounts(data) {
  const records = data?.assessments || [];
  const results = records.flatMap(record => record.endpointResults || []);
  return {
    assessments: records.length,
    endpointResults: results.length,
    reviewedResults: results.filter(result => result.scopeReview === 'endpoint_specific').length,
    pendingResultReviews: results.filter(result => result.scopeReview !== 'endpoint_specific').length,
    cellObservations: records.reduce((sum, record) => sum + (record.cellObservations || []).length, 0),
    assessmentsWithCellObservations: records.filter(record => record.cellObservations?.length).length,
    diseaseCrosswalks: records.reduce((sum, record) => sum + (record.diseaseIds || []).length, 0),
    conditionReferenceSources: (data?.sources || []).filter(source => source.kind === 'condition_identifier').length,
  };
}

export const endpointOutcomeLabel = {
  benefit: 'Favourable observation on this endpoint',
  null: 'Benefit not established on this endpoint',
  harm: 'Worse outcome on this endpoint',
  mixed: 'Mixed or analysis-dependent result',
  surrogate: 'Biochemical / surrogate response',
  unknown: 'Outcome not established in this scope',
  not_measured: 'This phenotype was not directly measured',
};
