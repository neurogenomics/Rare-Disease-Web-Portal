import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareCellIdentity, formatQ, getPredictions, getTherapyRows,
  variantLocation, locateVariant, toCsv, downloadData,
} from '../src/lib/evidenceModel.js';

test('exact naming aliases do not equate lineage, cell subtypes or effectors', () => {
  assert.equal(compareCellIdentity('Retinal_pigment_cells', 'retinal pigment epithelium'), 'same_label');
  for (const [first, second] of [
    ['Photoreceptor_cells', 'retinal pigment epithelium'],
    ['Hepatoblasts', 'Hepatocytes'],
    ['Satellite_cells', 'Skeletal_muscle_cells'],
    ['Dopaminergic neurons', 'Excitatory_neurons'],
    ['T cells', 'CD19-positive B cells'],
    ['Adult_Oligodendrocyte', 'Oligodendrocyte precursor cell'],
    ['Motor neurons', 'Neurons'],
  ]) assert.equal(compareCellIdentity(first, second), 'different_labels');
});

test('absent and blank cell labels cannot establish identity', () => {
  assert.equal(compareCellIdentity(null, 'Neuron'), 'unknown');
  assert.equal(compareCellIdentity('', ''), 'unknown');
  assert.equal(compareCellIdentity('   ', '\n'), 'unknown');
});

test('reported zero q preserves its precision limit and invalid q stays missing', () => {
  assert.match(formatQ(0), /precision unknown/i);
  assert.equal(formatQ(0.00001), '1.00e-5');
  for (const q of [null, undefined, NaN, Infinity, -0.01, 1.01, '0', false]) {
    assert.equal(formatQ(q), 'Not available');
  }
});

test('prediction q values remain aligned when a cell label is absent', () => {
  const result = getPredictions('HP:1', {'HP:1': {
    cell_types: [null, 'Motor_neurons', '', 'Fetal_astrocytes'],
    q_values: [0.9, 0.01, 0.8, 0.02], n_significant_cell_types: 6,
  }});
  assert.deepEqual(result.rows.map(row => [row.cell, row.q]), [
    ['Motor_neurons', 0.01], ['Fetal_astrocytes', 0.02],
  ]);
  assert.equal(result.truncated, true);
  assert.equal(result.rows[1].developmentalStage, 'Fetal label');
});

test('missing predictions and missing q do not manufacture significance', () => {
  assert.equal(getPredictions('HP:missing').status, 'not_in_snapshot');
  const result = getPredictions('HP:1', {'HP:1': {cell_types: 'Neuron', q_values: null}});
  assert.equal(result.rows[0].q, null);
  assert.equal(result.rows[0].label, 'Not available');
  assert.match(result.provenance, /not a causal/i);
});

test('one curated assessment can cover multiple historical product labels without duplicate pending rows', () => {
  const catalog = {therapies: [{legacyId: 1}, {legacyId: 2}, {legacyId: 3}]};
  const curated = {assessments: [{id: 'same-intervention', legacyTherapyIds: [1, 2], conclusion: {status: 'mixed'}}]};
  const result = getTherapyRows(catalog, curated);
  assert.equal(result.length, 2);
  assert.equal(result[0].legacy.length, 2);
  assert.equal(result[1].status, 'unreviewed');
});

const reference = () => ({assembly: 'GRCh38', chromosome: '1', canonicalTranscript: {
  start: 100, end: 500, exons: [{id: 'E1', start: 100, end: 150}, {id: 'E2', start: 250, end: 300}, {id: 'E3', start: 450, end: 500}],
}});
const variant = (start, stop = start, extra = {}) => ({alleles: [{locations: [{assembly_name: 'GRCh38', chr: '1', start, stop, ...extra}]}]});

test('variant projection respects assembly and chromosome', () => {
  assert.equal(variantLocation(variant(120), 'GRCh37'), null);
  assert.equal(locateVariant(variant(120, 120, {assembly_name: 'GRCh37'}), reference()).kind, 'unknown');
  assert.equal(locateVariant(variant(120, 120, {chr: '2'}), reference()).kind, 'unknown');
});

test('variant projection distinguishes exon overlap, intron and cross-exon deletion', () => {
  assert.equal(locateVariant(variant(120), reference()).kind, 'exonic');
  assert.equal(locateVariant(variant(170), reference()).kind, 'intronic');
  const span = locateVariant(variant(120, 270), reference());
  assert.equal(span.kind, 'spans_exon_boundary');
  assert.deepEqual(span.exonIds, ['E1', 'E2']);
  assert.equal(locateVariant(variant(600), reference()).kind, 'outside_transcript');
  assert.match(span.reason, /not a functional consequence/i);
});

test('multiple alleles cannot be collapsed to a single causal locus', () => {
  const first = variant(120);
  first.alleles.push(variant(470).alleles[0]);
  assert.equal(locateVariant(first, reference()).kind, 'unknown');
});

test('missing transcript boundaries or exon annotation cannot establish intronic location', () => {
  const noExons = reference();
  delete noExons.canonicalTranscript.exons;
  assert.equal(locateVariant(variant(170), noExons).kind, 'unknown');
  const noBounds = reference();
  delete noBounds.canonicalTranscript.start;
  assert.equal(locateVariant(variant(170), noBounds).kind, 'unknown');
});

test('multiple distinct same-assembly loci cannot silently select the first', () => {
  const ambiguous = variant(120);
  ambiguous.alleles[0].locations.push({assembly_name: 'GRCh38', chr: '1', start: 470, stop: 470});
  assert.equal(locateVariant(ambiguous, reference()).kind, 'unknown');
});

test('uncertain or fractional coordinate bounds stay unprojected', () => {
  for (const [start, end] of [[null, null], [200, 100], [-1, 20], [120.5, 120.5], [true, true]]) {
    assert.equal(locateVariant(variant(start, end), reference()).kind, 'unknown');
  }
});

test('CSV quotes values, preserves missing values and neutralises formula cells', () => {
  const output = toCsv([{id: '=1+1', text: 'a,"b"\nline', missing: null}], ['id', 'text', 'missing']);
  assert.equal(output, '"id","text","missing"\r\n"\'=1+1","a,""b""\nline",""');
});

test('CSV neutralises formulas hidden behind leading control characters', () => {
  for (const text of ['\n=1+1', ' \t@SUM(1)', '\t=1+1', '\r-1+1', '+1+1']) {
    assert.ok(toCsv([{text}], ['text']).split('\r\n').slice(1).join('\r\n').startsWith('"\''), JSON.stringify(text));
  }
});

test('JSON download retains evidence fields and revokes its object URL', () => {
  const previous = {document: globalThis.document, setTimeout: globalThis.setTimeout,
    create: URL.createObjectURL, revoke: URL.revokeObjectURL};
  let captured, clicked = false, revoked;
  const anchor = {click: () => { clicked = true; }};
  try {
    globalThis.document = {createElement: () => anchor};
    globalThis.setTimeout = callback => callback();
    URL.createObjectURL = blob => { captured = blob; return 'blob:fixture'; };
    URL.revokeObjectURL = url => { revoked = url; };
    downloadData('evidence.json', {mechanism: null, sources: ['https://example.org/source']});
    assert.equal(clicked, true);
    assert.equal(anchor.download, 'evidence.json');
    assert.equal(revoked, 'blob:fixture');
    assert.equal(captured.type, 'application/json');
    return captured.text().then(text => assert.deepEqual(JSON.parse(text), {mechanism: null, sources: ['https://example.org/source']}));
  } finally {
    globalThis.document = previous.document;
    globalThis.setTimeout = previous.setTimeout;
    URL.createObjectURL = previous.create;
    URL.revokeObjectURL = previous.revoke;
  }
});
