import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  endpointEvidenceCounts, getEndpointAssessment, getEndpointObservations, getEndpointResults,
  matchesTreatmentContext, matchesTreatmentDisease,
} from '../src/lib/endpointModel.js';

const data = JSON.parse(readFileSync(new URL('../src/data/evidence/endpointEvidence.json', import.meta.url)));
const curated = JSON.parse(readFileSync(new URL('../src/data/evidence/curatedEvidence.json', import.meta.url)));
const results = (id, hpo, disease) => getEndpointResults(data, id, hpo, disease);

test('CEP290 early BCVA observation and randomized primary result retain study-specific scope and citations', () => {
  const [early, randomized] = results('sepofarsen-cep290', 'HP:0007663');
  assert.equal(early.trialRefs[0].nctId, 'NCT03140969');
  assert.deepEqual(early.sourceIds, ['sepofarsen-phase12']);
  assert.equal(early.role, 'secondary_exploratory');
  assert.match(early.analysis, /Safety and tolerability were primary/);
  assert.match(early.comparator, /untreated fellow eye/);
  assert.equal(randomized.trialRefs[0].nctId, 'NCT03913143');
  assert.equal(randomized.role, 'primary');
  assert.equal(randomized.outcome, 'null');
  assert.match(randomized.population, /36 participants/);
  assert.match(randomized.comparator, /Randomized sham/);
  for (const result of [early, randomized]) {
    assert.equal(result.scopeReview, 'endpoint_specific');
    assert.match(result.timeFrame, /month 12/);
  }
});

test('STRIVE lung function scope is reviewed and uses absolute percentage-point difference', () => {
  const result = results('ivacaftor-cf', 'HP:0032342')[0];
  assert.equal(result.scopeReview, 'endpoint_specific');
  assert.equal(result.role, 'primary');
  assert.match(result.population, /G551D/);
  assert.match(result.timeFrame, /through week 24/);
  assert.match(result.summary, /10\.6 percentage points/);
  assert.deepEqual(result.sourceIds, ['ivacaftor-rct']);
});

test('eplontersen cardiomyopathy cannot inherit neuropathy efficacy', () => {
  assert.deepEqual(results('eplontersen-attr', 'HP:0001638').map(r => [r.trialRefs[0].nctId, r.outcome]), [['NCT04136171', 'null']]);
  assert.deepEqual(results('eplontersen-attr', 'HP:0001271').map(r => [r.trialRefs[0].nctId, r.outcome]), [['NCT04136184', 'benefit']]);
});

test('tiratricol neurological co-primary failure remains separate from T3 and exploratory heart-rate results', () => {
  assert.deepEqual(results('tiratricol-mct8', 'HP:0001263').map(r => [r.trialRefs[0].nctId, r.outcome]), [['NCT02396459', 'null']]);
  const peripheral = results('tiratricol-mct8', 'HP:0001649');
  assert.ok(peripheral.every(r => r.trialRefs[0].nctId !== 'NCT02396459'));
  assert.match(peripheral[0].summary, /not tachycardia/);
  assert.match(peripheral[1].analysis, /secondary.*uncontrolled/i);
});

test('same Fabry trial has distinct pain and mixed renal observations', () => {
  assert.equal(results('agalsidase-alfa-fabry', 'HP:0012531')[0].outcome, 'benefit');
  const renal = results('agalsidase-alfa-fabry', 'HP:0000083')[0];
  assert.equal(renal.outcome, 'mixed');
  assert.match(renal.summary, /P=\.19/);
  assert.match(renal.summary, /P=\.02/);
});

test('tafamidis cardiac success cannot replace neuropathy ITT coprimary results', () => {
  assert.deepEqual(results('tafamidis-attr', 'HP:0001638').map(r => r.trialRefs[0].nctId), ['NCT01994889']);
  const peripheral = results('tafamidis-attr', 'HP:0009830')[0];
  assert.equal(peripheral.trialRefs[0].nctId, 'NCT00409175');
  assert.equal(peripheral.outcome, 'mixed');
  assert.match(peripheral.summary, /ITT coprimary.*not meet/);
});

test('COMET active-control noninferiority and nominal walking remain distinct', () => {
  const lung = results('avalglucosidase-pompe', 'HP:0002093')[0];
  const walking = results('avalglucosidase-pompe', 'HP:0001324')[0];
  assert.match(lung.summary, /noninferiority met.*superiority failed/);
  assert.equal(walking.role, 'secondary');
  assert.match(walking.analysis, /hierarchical testing stopped/);
});

test('PROPEL failed primary walking test does not inherit the nominal respiratory comparison', () => {
  assert.equal(results('cipaglucosidase-miglustat-pompe', 'HP:0001324')[0].outcome, 'null');
  assert.equal(results('cipaglucosidase-miglustat-pompe', 'HP:0002093')[0].outcome, 'mixed');
});

test('functional CFTR benefit does not become an observed structural bronchiectasis reversal', () => {
  const structural = results('eti-cystic-fibrosis', 'HP:0002110');
  assert.equal(structural.length, 3);
  assert.ok(structural.every(r => r.outcome === 'not_measured'));
  assert.ok(results('eti-cystic-fibrosis', 'HP:0002093').every(r => r.outcome === 'benefit'));
});

test('ASMD anatomical spleen benefit cannot erase the neutral symptom score', () => {
  const spleen = results('olipudase-asmd', 'HP:0001744')[0];
  assert.equal(spleen.outcome, 'mixed');
  assert.match(spleen.summary, /P=\.64/);
  assert.equal(results('olipudase-asmd', 'HP:0002093')[0].outcome, 'benefit');
});

test('Casgevy SCD and thalassemia diagnosis filters have separate endpoint and trial scopes', () => {
  assert.deepEqual(results('exacel-scd', 'HP:0012531', 'OMIM:603903').map(r => r.trialRefs[0].nctId), ['NCT03745287', 'NCT05329649']);
  assert.equal(results('exacel-scd', 'HP:0001903', 'OMIM:603903').length, 0);
  assert.deepEqual(results('exacel-scd', 'HP:0001903', 'OMIM:613985').map(r => r.trialRefs[0].nctId), ['NCT03655678', 'NCT05356195']);
});

test('disease, HPO and exact-cell phenotype requirements must meet in one scope', () => {
  const phenotypes = curated.assessments.find(a => a.id === 'exacel-scd').phenotypes;
  assert.equal(matchesTreatmentContext(data, 'exacel-scd', phenotypes, { disease: 'OMIM:603903', cellHpoIds: ['HP:0001903'] }), false);
  assert.equal(matchesTreatmentContext(data, 'exacel-scd', phenotypes, { disease: 'OMIM:603903', cellHpoIds: ['HP:0012531'] }), true);
  assert.equal(matchesTreatmentContext(data, 'exacel-scd', phenotypes, { hpo: 'HP:0001903', disease: 'OMIM:603903' }), false);
});

test('unreviewed diagnosis and missing endpoint data remain unknown, without fuzzy matches', () => {
  for (const disease of ['OMIM:000000', 'OMIM:219700 ', '219700', 'Cystic fibrosis']) {
    assert.equal(matchesTreatmentDisease(data, 'ivacaftor-cf', disease), false);
  }
  assert.equal(matchesTreatmentDisease(undefined, 'ivacaftor-cf', 'OMIM:219700'), false);
  assert.equal(getEndpointAssessment(data, 'missing'), null);
  assert.deepEqual(results('missing', 'HP:0001250'), []);
  assert.deepEqual(getEndpointResults(data, 'ivacaftor-cf', null), []);
});

test('type 3 Gaucher cannot inherit type 1 trial outcomes or a missing spleen endpoint', () => {
  assert.deepEqual(results('imiglucerase-gaucher', 'HP:0001903', 'OMIM:231000').map(r => r.trialRefs[0].nctId), ['NCT00358943']);
  assert.equal(results('imiglucerase-gaucher', 'HP:0001744', 'OMIM:231000').length, 0);
});

test('fibroblast splice rescue stays scoped to the N-of-1 allele and is not neuronal clinical mediation', () => {
  const observations = getEndpointObservations(data, 'milasen-cln7', 'HP:0001250');
  assert.equal(observations.length, 1);
  assert.deepEqual(observations[0].cells, ['Patient-derived fibroblasts']);
  assert.equal(observations[0].evidenceType, 'human_in_vitro');
  assert.equal(observations[0].clinicalMediation, 'not_established');
  assert.match(observations[0].claim, /not seizure-generating neurons/);
  assert.deepEqual(getEndpointObservations(data, 'milasen-cln7', 'HP:0000505'), []);
});

test('observation links require both the exact endpoint and a qualifying result in the diagnosis scope', () => {
  assert.equal(getEndpointObservations(data, 'ivacaftor-cf', 'HP:0032342', 'OMIM:219700').length, 1);
  assert.equal(getEndpointObservations(data, 'ivacaftor-cf', 'HP:0032342', 'OMIM:277180').length, 0);
  assert.equal(getEndpointObservations(data, 'ivacaftor-cf', 'HP:0001250').length, 0);
});

test('skin biopsy engagement is not attributed to the later VIITAL outcome cohort', () => {
  const observation = getEndpointObservations(data, 'prademagene-rdeb', 'HP:0012531', 'OMIM:226600')[0];
  assert.match(observation.population, /phase 1\/2a.*7 participants/);
  assert.match(observation.studyRelationship, /not a cell assay in the same VIITAL/);
  const pain = results('prademagene-rdeb', 'HP:0012531')[0];
  assert.equal(pain.role, 'co_primary');
  assert.match(pain.population, /42 wound pairs/);
  assert.match(pain.comparator, /Standard wound care/);
});

test('all existing assessments and multi-HPO crosswalks have explicit result records and resolvable sources', () => {
  const sources = new Set([...curated.sources, ...data.sources].map(s => s.id));
  const count = endpointEvidenceCounts(data);
  assert.equal(count.assessments, curated.assessments.length);
  const resultIds = new Set();
  for (const assessment of curated.assessments) {
    const record = getEndpointAssessment(data, assessment.id);
    assert.ok(record, assessment.id);
    for (const phenotype of assessment.phenotypes) assert.ok(record.endpointResults.some(r => r.hpoId === phenotype.hpoId), `${assessment.id}:${phenotype.hpoId}`);
    const diseaseIds = new Set(record.diseaseIds.map(d => d.id));
    for (const result of record.endpointResults) {
      assert.equal(resultIds.has(result.id), false, result.id);
      resultIds.add(result.id);
      assert.ok(result.sourceIds.length > 0, result.id);
      assert.ok(result.sourceIds.every(id => sources.has(id)), result.id);
      assert.ok(result.diseaseIds.every(id => diseaseIds.has(id)), result.id);
      assert.ok(assessment.phenotypes.some(p => p.hpoId === result.hpoId && p.mapping === result.mapping), result.id);
      assert.ok(result.trialRefs.every(t => assessment.trials.some(original => original.nctId === t.nctId && original.name === t.name)), result.id);
    }
    for (const observation of record.cellObservations) {
      assert.ok(observation.endpointResultIds.every(id => record.endpointResults.some(r => r.id === id)), observation.id);
      assert.ok(observation.sourceIds.every(id => sources.has(id)), observation.id);
      assert.equal(observation.atlasIdentity, 'not_crosswalked');
      assert.equal(observation.clinicalMediation, 'not_established');
      assert.ok(observation.studyRelationship, observation.id);
    }
  }
});
