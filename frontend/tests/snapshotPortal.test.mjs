import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createSnapshotPortal, atlasTermAvailability, cellSnapshotPath, cellSnapshotFilename, SnapshotUnavailable } from '../src/lib/snapshotPortal.js';
import { updatedExplorerUrl, urlSetter } from '../src/scripts/urlHandlers.js';
import { appendSignificantCellRows } from '../../scripts/publish_cell_snapshots.mjs';

const fixture = {
  '/data/evidence/geneIdentifiers.json': { 6323: 'SCN1A', 54363: 'HAO1' },
  '/data/evidence/hpoTerms.json': { metadata: {}, terms: {
    'HP:0000118': { label: 'Phenotypic abnormality', parents: [], obsolete: false, isPhenotypicAbnormality: false },
    'HP:0001250': { label: 'Seizure', parents: ['HP:0000118'], synonyms: ['Seizures'], obsolete: false, isPhenotypicAbnormality: true },
    'HP:0000006': { label: 'Autosomal dominant inheritance', parents: [], obsolete: false, isPhenotypicAbnormality: false },
    'HP:9999998': { label: 'Obsolete seizure', parents: [], obsolete: true, isPhenotypicAbnormality: false },
  } },
  '/data/evidence/genePhenotypes.json': { metadata: { scope: 'disease_context_only' }, genes: { SCN1A: [
    { hpo_id: 'HP:0001250', ncbi_gene_id: '6323', disease_id: 'OMIM:607208', isPhenotypicAbnormality: true },
    { hpo_id: 'HP:0001250', ncbi_gene_id: '6323', disease_id: 'ORPHA:33069', isPhenotypicAbnormality: true },
    { hpo_id: 'HP:0000006', ncbi_gene_id: '6323', disease_id: 'OMIM:607208', isPhenotypicAbnormality: false },
  ], HAO1: [] } },
  '/data/evidence/cellIndex.json': { cells: { DescartesHuman: { Exact_cell: {} }, HumanCellLandscape: { Other_cell: {} } } },
  '/data/evidence/geneExpression.json': { genes: { SCN1A: { DescartesHuman: [{ cell: 'Exact_cell', specificity: 3e-12 }, { cell: 'Measured_zero', specificity: 0 }] }, HAO1: { DescartesHuman: [{ cell: 'Exact_cell', specificity: 0.12 }] } } },
  '/data/evidence/hpoSeverity.json': [],
  '/data/evidence/atlasIndex.json': { phenotypes: { 'HP:0001250': { file: '/fixture-associations.json', coverage: 'all_tested_rows', atlases: { DescartesHuman: { testedRows: 3, storedRows: 3, positiveSignificant: 1, negativeSignificant: 1 } } } } },
  '/fixture-associations.json': { hpo_id: 'HP:0001250', _metadata: { coverage: 'all_tested_rows' }, rows: [
    { atlas: 'DescartesHuman', cell: 'Exact_cell', q: 0, estimate: 0.1, direction: 'positive', sourceRecordId: 'positive' },
    { atlas: 'DescartesHuman', cell: 'Negative_cell', q: 3e-12, estimate: -0.2, direction: 'negative', sourceRecordId: 'negative' },
    { atlas: 'DescartesHuman', cell: 'Measured_zero', q: 0.9, estimate: 0, direction: 'zero', sourceRecordId: 'zero' },
  ] },
  [cellSnapshotPath('DescartesHuman', 'Exact_cell')]: { rows: [
    { atlas: 'DescartesHuman', cell: 'Exact_cell', hpo_id: 'HP:0001250', q: 0, estimate: 0.1, direction: 'positive' },
    { atlas: 'DescartesHuman', cell: 'Exact_cell', hpo_id: 'HP:0000006', q: 3e-12, estimate: -0.2, direction: 'negative' },
  ] },
};
function adapter(source = fixture) {
  return createSnapshotPortal(async path => {
    if (!Object.hasOwn(source, path)) throw new SnapshotUnavailable(`Missing fixture source ${path}`);
    return structuredClone(source[path]);
  });
}

test('frozen HPO search and ancestry use active exact IDs and source hierarchy', async () => {
  const portal = adapter();
  const search = await portal.request('/api/hp/search?q=HP:0001250');
  assert.equal(search.terms[0].id, 'HP:0001250');
  assert.deepEqual((await portal.request('/api/hp/terms/HP:0000118/children')).map(row => row.id), ['HP:0001250']);
  for (const id of ['HP:9999999', 'HP:9999998']) await assert.rejects(portal.request(`/api/network/annotation/${id}`), SnapshotUnavailable);
});

test('gene phenotype rows join diseases and deduplicate clinical endpoints without creating variant causality', async () => {
  const source = await adapter().request('/api/network/annotation/NCBIGene:6323');
  assert.deepEqual(source.phenotypes, [{ id: 'HP:0001250', name: 'Seizure' }]);
  assert.deepEqual(source.diseases.map(row => row.id), ['OMIM:607208', 'ORPHA:33069']);
  assert.ok(source.diseases.every(row => row.label_status === 'source_unavailable'));
  assert.match(source.scope, /disease-context/);
  assert.ok(!Object.hasOwn(source, 'variants'));
  assert.deepEqual((await adapter().request('/api/network/annotation/HP:0001250')).genes, [{ id: 'NCBIGene:6323', name: 'SCN1A' }]);
});

test('zero-HPO target remains searchable and has expression while unknown genes remain unavailable', async () => {
  const portal = adapter();
  assert.equal((await portal.request('/api/network/search/gene?q=HAO1')).results[0].id, 'NCBIGene:54363');
  assert.deepEqual((await portal.request('/api/network/annotation/HAO1')).phenotypes, []);
  assert.equal((await portal.request('/gene/54363/DescartesHuman'))[0].expression_specificity, 0.12);
  await assert.rejects(portal.request('/gene/UNKNOWN/DescartesHuman'), SnapshotUnavailable);
});

test('exact expression specificity preserves tiny and zero values and missing atlas is unavailable', async () => {
  const portal = adapter();
  assert.deepEqual((await portal.request('/gene/SCN1A/DH')).map(row => row.expression_specificity), [3e-12, 0]);
  const cell = await portal.request('/gene1/Exact_cell/DescartesHuman');
  assert.deepEqual(cell.map(row => row.gene), ['SCN1A', 'HAO1']);
  await assert.rejects(portal.request('/gene/SCN1A/HumanCellLandscape'), SnapshotUnavailable);
  await assert.rejects(portal.request('/gene1/exact_cell/DescartesHuman'), SnapshotUnavailable);
});

test('HPO atlas rows preserve signed directions, exact source values and all-tested scope', async () => {
  const source = await adapter().request('/api/cellByHpoid1?hpo_id=HP:0001250&db_type=DH');
  assert.deepEqual(source.map(row => row.direction), ['positive', 'negative', 'zero']);
  assert.deepEqual(source.map(row => row.q), [0, 3e-12, 0.9]);
  assert.ok(source.every(row => row.snapshot_coverage === 'all_tested_rows' && row.severity_score_gpt === null));
  await assert.rejects(adapter().request('/api/cellByHpoid1?hpo_id=HP:0001250&db_type=HCL'), SnapshotUnavailable);
  await assert.rejects(adapter().request('/api/cellByHpoid1?hpo_id=HP:9999999&db_type=DH'), SnapshotUnavailable);
});

test('atlas availability separates unavailable coverage from measured no qualifying rows', () => {
  assert.equal(atlasTermAvailability(null, 'DH'), null);
  assert.equal(atlasTermAvailability({ coverage: 'all_significant_rows', atlases: { DescartesHuman: { testedRows: 12 } } }, 'DH'), null);
  assert.equal(atlasTermAvailability({ coverage: 'all_tested_rows', atlases: { DescartesHuman: { testedRows: 12 } } }, 'DH'), false);
  assert.equal(atlasTermAvailability({ coverage: 'all_tested_rows', atlases: { DescartesHuman: { testedRows: 12, negativeSignificant: 1 } } }, 'DH'), true);
});

test('reverse cell lookup never widens bounded coverage or aliases a cell label', async () => {
  const portal = adapter();
  const response = await portal.request('/api/cell?celltype_name=Exact_cell&q=0.05&db_type=DH');
  assert.deepEqual(response.map(row => row.q), [0, 3e-12]);
  assert.deepEqual(response.map(row => row.direction), ['positive', 'negative']);
  assert.deepEqual(await portal.request('/api/cell?celltype_name=Exact_cell&q=0&db_type=DH'), []);
  for (const url of [
    '/api/cell?celltype_name=Exact_cell&q=0.06&db_type=DH',
    '/api/cell?celltype_name=All&q=0.05&db_type=DH',
    '/api/cell?celltype_name=Exact%20cell&q=0.05&db_type=DH',
    '/api/cell?celltype_name=Exact_cell&q=0.05&db_type=HCL',
  ]) await assert.rejects(portal.request(url), SnapshotUnavailable);
  assert.equal(cellSnapshotPath('HCL', 'Cell/with space'), '/data/evidence/cells/HumanCellLandscape/cell-43656c6c2f77697468207370616365.json');
});

test('exact cell labels remain distinct on case-insensitive filesystems without changing their bytes', () => {
  for (const [one, two] of [['Adult_Fetal_neuron', 'Adult_Fetal_Neuron'], ['Fetus_Fetal_neuron', 'Fetus_Fetal_Neuron']]) {
    const first = cellSnapshotFilename(one), second = cellSnapshotFilename(two);
    assert.notEqual(first.toLowerCase(), second.toLowerCase());
    assert.equal(Buffer.from(first.slice(5, -5), 'hex').toString('utf8'), one);
    assert.equal(Buffer.from(second.slice(5, -5), 'hex').toString('utf8'), two);
  }
});

test('a failed source load can recover on retry rather than caching unavailable evidence', async () => {
  let fail = true;
  const portal = createSnapshotPortal(async path => { if (fail) throw new SnapshotUnavailable('Offline'); return fixture[path]; });
  await assert.rejects(portal.request('/api/network/search/gene?q=SCN1A'), SnapshotUnavailable);
  fail = false;
  assert.equal((await portal.request('/api/network/search/gene?q=SCN1A')).results[0].name, 'SCN1A');
});

test('unsupported annotation endpoints do not impersonate assessed negative snapshots', async () => {
  for (const path of ['/api/genes/browse', '/api/gene/SCN1A/tf', '/api/severity']) assert.equal(await adapter().request(path), undefined);
});

test('reverse publication independently preserves positive, negative, unknown and source zero q', () => {
  const groups = new Map();
  appendSignificantCellRows(groups, { hpo_id: 'HP:0001250', rows: [
    { atlas: 'A', cell: 'C', q: 0, estimate: 1, direction: 'positive' },
    { atlas: 'A', cell: 'C', q: 1e-15, estimate: -1, direction: 'negative' },
    { atlas: 'A', cell: 'C', q: 0.01, estimate: null, direction: 'unknown' },
    { atlas: 'A', cell: 'C', q: 0.05, estimate: 1 }, { atlas: 'A', cell: 'C', q: null },
    { atlas: 'A', cell: 'C', q: -1 }, { atlas: 'A', cell: 'C', q: NaN },
  ] });
  assert.deepEqual(groups.get('A\u0000C').map(row => [row.q, row.direction, row.hpo_id]), [[0, 'positive', 'HP:0001250'], [1e-15, 'negative', 'HP:0001250'], [0.01, 'unknown', 'HP:0001250']]);
});

test('legacy updates synchronize atlas, invalidate the former cell identity and retain selected phenotype', () => {
  const next = new URL(updatedExplorerUrl('/phenotype', '?jump=HP:0001250&hpo=HP:0001250&atlas=DescartesHuman&db_type=DH&cell=Old_cell&gene=SCN1A', { db_type: 'HCL' }), 'http://portal.test');
  assert.equal(next.searchParams.get('atlas'), 'HumanCellLandscape');
  assert.equal(next.searchParams.get('db_type'), 'HCL');
  assert.equal(next.searchParams.get('cell'), null);
  assert.equal(next.searchParams.get('hpo'), 'HP:0001250');
  assert.equal(next.searchParams.get('gene'), 'SCN1A');
});

test('legacy selection updates replace selected HPO and delete omitted optional values', () => {
  const next = new URL(updatedExplorerUrl('/phenotype', '?jump=HP:0001250&hpo=HP:0001250&q_value=0.05&cell=C', { jump: 'HP:0000505', q_value: null, cell: undefined }), 'http://portal.test');
  assert.equal(next.searchParams.get('hpo'), 'HP:0000505');
  assert.equal(next.searchParams.get('jump'), 'HP:0000505');
  assert.ok(!next.searchParams.has('q_value') && !next.searchParams.has('cell'));
});

test('identical URL hydration produces no history entry or router event; changed URL emits one', () => {
  const oldWindow = globalThis.window, oldEvent = globalThis.PopStateEvent;
  const calls = [];
  globalThis.window = { location: { pathname: '/phenotype', search: '?jump=HP%3A0001250&hpo=HP%3A0001250' }, history: { state: null, pushState: (...args) => calls.push(['history', ...args]) }, dispatchEvent: event => calls.push(['event', event.type]) };
  globalThis.PopStateEvent = class { constructor(type) { this.type = type; } };
  try {
    assert.equal(urlSetter({ jump: 'HP:0001250' }), false);
    assert.deepEqual(calls, []);
    assert.equal(urlSetter({ jump: 'HP:0000505' }), true);
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[1], ['event', 'popstate']);
  } finally { globalThis.window = oldWindow; globalThis.PopStateEvent = oldEvent; }
});

test('actual published seizure snapshot links SCN1A with correct exact IDs and signed atlas rows', async () => {
  const portal = createSnapshotPortal(path => readFile(new URL(`../public${path}`, import.meta.url), 'utf8').then(JSON.parse));
  const source = await portal.request('/api/network/annotation/HP:0001250');
  assert.ok(source.genes.some(row => row.name === 'SCN1A' && row.id === 'NCBIGene:6323'));
  const rows = await portal.request('/api/cellByHpoid1?hpo_id=HP:0001250&db_type=DH');
  assert.ok(rows.some(row => row.direction === 'negative') && rows.some(row => row.direction === 'positive'));
  assert.ok(rows.every(row => row.celltype_database === 'DescartesHuman'));
});

test('actual therapeutic targets with zero HPO rows still hydrate source-backed gene identities including a newly added ligand target', async () => {
  const portal = createSnapshotPortal(path => readFile(new URL(`../public${path}`, import.meta.url), 'utf8').then(JSON.parse));
  for (const gene of ['ALAS1', 'CNTF', 'CSF2', 'HAO1', 'IFNA2', 'MAGEA4', 'TNFRSF17', 'UGCG', 'INHBA']) {
    const identity = (await portal.request(`/api/network/search/gene?q=${gene}`)).results.find(row => row.name === gene);
    assert.match(identity.id, /^NCBIGene:\d+$/);
    const expression = await portal.request(`/gene/${identity.id}/DescartesHuman`);
    assert.ok(expression.length > 0 && expression.every(row => row.gene === gene));
    assert.deepEqual((await portal.request(`/api/network/annotation/${identity.id}`)).phenotypes, []);
  }
});

test('actual differently cased atlas neuron labels retrieve their own independent source rows', async () => {
  const portal = createSnapshotPortal(path => readFile(new URL(`../public${path}`, import.meta.url), 'utf8').then(JSON.parse));
  for (const [one, two] of [['Adult_Fetal_neuron', 'Adult_Fetal_Neuron'], ['Fetus_Fetal_neuron', 'Fetus_Fetal_Neuron']]) {
    const first = await portal.request(`/api/cell?celltype_name=${one}&q=0.05&db_type=HCL`);
    const second = await portal.request(`/api/cell?celltype_name=${two}&q=0.05&db_type=HCL`);
    assert.ok(first.length && second.length);
    assert.ok(first.every(row => row.celltype_name === one));
    assert.ok(second.every(row => row.celltype_name === two));
    assert.notDeepEqual(first.map(row => row.sourceRecordId), second.map(row => row.sourceRecordId));
  }
});


test('new indication genes preserve exact disease routes, while ligand targets never inherit the disease allele', async () => {
  const portal = createSnapshotPortal(path => readFile(new URL(`../public${path}`, import.meta.url), 'utf8').then(JSON.parse));
  for (const [gene, disease] of [['ATP7A', 'OMIM:309400'], ['FOLR1', 'OMIM:613068'], ['FGFR3', 'OMIM:100800'], ['ACVR1', 'OMIM:135100'], ['PIK3CD', 'OMIM:615513'], ['PIK3R1', 'OMIM:616005'], ['ATM', 'OMIM:208900'], ['NPC1', 'OMIM:257220'], ['NPC2', 'OMIM:607625']]) {
    const identity = (await portal.request(`/api/network/search/gene?q=${gene}`)).results.find(row => row.name === gene);
    const annotation = await portal.request(`/api/network/annotation/${identity.id}`);
    assert.ok(annotation.diseases.some(row => row.id === disease), `${gene}: ${disease}`);
    assert.ok(annotation.phenotypes.length > 0, gene);
    assert.ok(!Object.hasOwn(annotation, 'variants'));
  }
  assert.deepEqual((await portal.request('/api/network/annotation/INHBA')).diseases, []);
});
