import test from 'node:test';
import assert from 'node:assert/strict';
import { biologicalContext, buildEvidenceHref, buildExplorerHref, conditionDiseaseIds, evidenceDestination, updateEvidenceParams } from '../src/lib/evidenceNavigation.js';

const genes = { 6323: 'SCN1A', 1080: 'CFTR' };
const paramsOf = href => new URL(href, 'https://portal.example').searchParams;

test('evidence entity links retain exact biology while clearing unrelated view filters and records', () => {
  const href = buildEvidenceHref({ tab: 'variants', gene: 'SCN1A' }, '?tab=therapies&hpo=HP:0001250&disease=OMIM:607208&atlas=HumanCellLandscape&cell=Adult_Inhibitory_neuron&therapy=trial-1&search=trial&variant=old&candidate=other&evidence=supports');
  assert.deepEqual(Object.fromEntries(paramsOf(href)), { hpo: 'HP:0001250', disease: 'OMIM:607208', atlas: 'HumanCellLandscape', cell: 'Adult_Inhibitory_neuron', tab: 'variants', gene: 'SCN1A' });
});

test('tab transitions retain gene, phenotype, disease and exact atlas cell, but no stale view-specific selections', () => {
  const previous = new URLSearchParams('tab=variants&gene=CFTR&hpo=HP:0002205&disease=OMIM:219700&atlas=DescartesHuman&cell=Ionocytes&variant=7120&vclass=Pathogenic&search=G551D&candidate=old&therapy=old');
  const next = updateEvidenceParams(previous, { tab: 'therapies' });
  assert.equal(previous.get('variant'), '7120', 'Original browser state is not mutated');
  for (const key of ['gene', 'hpo', 'disease', 'atlas', 'cell']) assert.equal(next.get(key), previous.get(key));
  for (const key of ['variant', 'vclass', 'search', 'candidate', 'therapy']) assert.equal(next.has(key), false);
});

test('aliased entry routes clear view filters using their effective current tab', () => {
  const next = updateEvidenceParams('gene=CFTR&variant=7120&search=G551D', { tab: 'therapies' }, { currentTab: 'variants' });
  assert.equal(next.get('gene'), 'CFTR');
  assert.equal(next.has('variant'), false);
  assert.equal(next.has('search'), false);
});

test('changing genes invalidates an allele selection and transcript filters but same-gene updates retain them', () => {
  const original = 'tab=variants&gene=CFTR&variant=7120&location=exonic&consequence=missense_variant&hpo=HP:0002205';
  const same = updateEvidenceParams(original, { gene: 'CFTR' });
  assert.equal(same.get('variant'), '7120');
  const next = updateEvidenceParams(original, { gene: 'SCN1A' });
  for (const key of ['variant', 'location', 'consequence']) assert.equal(next.has(key), false);
  assert.equal(next.get('hpo'), 'HP:0002205', 'Phenotype context is retained without asserting a variant cause');
});

test('changing phenotype clears stale candidate and therapy unless an exact record is explicitly requested', () => {
  const original = 'tab=therapies&hpo=HP:0001250&therapy=therapy-A&candidate=context-A';
  assert.equal(updateEvidenceParams(original, { hpo: 'HP:0001290' }).has('therapy'), false);
  const exact = updateEvidenceParams(original, { hpo: 'HP:0001290', therapy: 'therapy-A' });
  assert.equal(exact.get('therapy'), 'therapy-A');
  assert.equal(exact.has('candidate'), false);
});

test('gene explorer uses NCBI identifiers and returns to the same durable evidence context', () => {
  const start = '?gene=SCN1A&hpo=HP:0001250&disease=OMIM:607208&atlas=HumanCellLandscape&cell=Adult_Inhibitory_neuron';
  const explorer = buildExplorerHref('gene', 'SCN1A', start, { geneIdentifiers: genes });
  assert.equal(paramsOf(explorer).get('jump'), '6323');
  assert.equal(paramsOf(explorer).get('db_type'), 'HumanCellLandscape');
  const returned = evidenceDestination('/gene', paramsOf(explorer), { geneIdentifiers: genes });
  assert.deepEqual(Object.fromEntries(paramsOf(returned)), Object.fromEntries(biologicalContext(start)));
  assert.equal(buildExplorerHref('gene', 'UNKNOWN_SYMBOL', start, { geneIdentifiers: genes }), null);
});

test('cell identity is exact, encoded and always paired with its source atlas', () => {
  const label = 'Adult_CD4+ T_cells / activated';
  const href = buildExplorerHref('celltype', label, '?gene=CFTR&hpo=HP:0002205&atlas=HCL');
  assert.equal(paramsOf(href).get('jump'), label);
  assert.equal(paramsOf(href).get('cell'), label);
  assert.equal(paramsOf(href).get('atlas'), 'HumanCellLandscape');
  assert.equal(buildExplorerHref('celltype', label, '?gene=CFTR'), null, 'Unknown atlas must not become a guessed Descartes label');
  assert.equal(paramsOf(evidenceDestination('/celltype', '?jump=Astrocytes')).has('atlas'), false);
});

test('phenotype explorer rejects labels or malformed IDs instead of fabricating an HPO jump', () => {
  for (const input of ['Seizure', 'HP:1', 'HP:0001250<script>']) assert.equal(buildExplorerHref('phenotype', input), null);
  const href = buildExplorerHref('phenotype', 'HP:0001250', '?gene=SCN1A&atlas=DescartesHuman');
  assert.equal(paramsOf(href).get('hpo'), 'HP:0001250');
  assert.equal(paramsOf(href).get('gene'), 'SCN1A');
});

test('explicit null context clears an inherited phenotype for a disease-only condition link', () => {
  const href = buildEvidenceHref({ tab: 'modalities', hpo: null, disease: 'OMIM:219700' }, '?gene=CFTR&hpo=HP:0001250&atlas=DescartesHuman&cell=Ionocytes');
  assert.equal(paramsOf(href).has('hpo'), false);
  assert.equal(paramsOf(href).get('gene'), 'CFTR');
  assert.equal(paramsOf(href).get('disease'), 'OMIM:219700');
  assert.equal(paramsOf(href).get('cell'), 'Ionocytes');
});

test('submitted condition links use explicit source identifiers without label-based disease or phenotype crosswalks', () => {
  const condition = { trait_name: 'Cystic fibrosis', trait_xrefs: [{ db_source: 'OMIM', db_id: '219700' }, { db_source: 'MONDO', db_id: 'MONDO:0009061' }, { db_source: 'Orphanet', db_id: '586' }, { db_source: 'MedGen', db_id: 'C0010674' }, { db_source: 'OMIM', db_id: '219700' }, { db_source: 'OMIM', db_id: 'name-only' }] };
  assert.deepEqual(conditionDiseaseIds(condition), ['OMIM:219700', 'MONDO:0009061', 'ORPHA:586']);
  assert.deepEqual(conditionDiseaseIds({ trait_name: 'Cystic fibrosis' }), []);
});
