/** Pure evidence operations: no string containment, no inferred causality. */
export const normalizeCellLabel = value => (value || '').trim().toLowerCase().replaceAll('_', ' ').replace(/\s+/g, ' ');
// Explicit naming aliases only. Developmental states and subtypes stay distinct.
const aliases = new Map([
  ['retinal pigment epithelium', 'retinal pigment epithelial cell'],
  ['retinal pigment cells', 'retinal pigment epithelial cell'],
  ['photoreceptor cells', 'photoreceptor cell'],
  ['hepatocytes', 'hepatocyte'], ['motor neurons', 'motor neuron'],
  ['skeletal muscle cells', 'skeletal muscle cell'],
]);
export function compareCellIdentity(a, b) {
  if (!normalizeCellLabel(a) || !normalizeCellLabel(b)) return 'unknown';
  const canon = x => aliases.get(normalizeCellLabel(x)) || normalizeCellLabel(x);
  return canon(a) === canon(b) ? 'same_label' : 'different_labels';
}

export function formatQ(q) {
  if (q === null || q === undefined || !Number.isFinite(q) || q < 0 || q > 1) return 'Not available';
  if (q === 0) return 'Reported as zero; source precision unknown';
  return q < .001 ? q.toExponential(2) : q.toPrecision(3);
}

export function getPredictions(hpoId, predictions = {}) {
  const p = predictions[hpoId];
  if (!p) return { rows: [], status: 'not_in_snapshot', truncated: false, provenance: 'No cell prediction available in this snapshot.' };
  const cells = Array.isArray(p.cell_types) ? p.cell_types : [p.cell_types];
  const qs = Array.isArray(p.q_values) ? p.q_values : [p.q_values];
  return {
    rows: cells.map((cell, i) => ({ cell, q: qs[i] ?? null, label: formatQ(qs[i]),
      atlas: 'Not recorded', developmentalStage: /fetus|fetal/i.test(cell) ? 'Fetal label' : /adult/i.test(cell) ? 'Adult label' : 'Not recorded' })).filter(row=>normalizeCellLabel(row.cell)),
    status: 'legacy_association', truncated: Number(p.n_significant_cell_types) > cells.length,
    reportedTotal: p.n_significant_cell_types ?? null,
    provenance: 'Historical enrichment association. Atlas/run provenance and unrounded q values were not recorded. Not a causal cell-type claim.'
  };
}

export function getTherapyRows(catalog, curated) {
  const assessments = curated.assessments || [];
  const covered = new Set(assessments.flatMap(a => [a.legacyTherapyId, ...(a.legacyTherapyIds || [])]).filter(x => x != null));
  const reviewed = assessments.map(a => ({ id: a.id, name: a.therapyName, gene: a.gene,
    disease: a.disease, modality: a.modality, status: a.conclusion.status, assessment: a,
    legacy: (catalog.therapies || []).filter(t => [a.legacyTherapyId, ...(a.legacyTherapyIds || [])].includes(t.legacyId)),
    reviewed: true }));
  const pending = (catalog.therapies || []).filter(t => !covered.has(t.legacyId)).map(t => ({...t, status:'unreviewed', reviewed:false, legacy:[t]}));
  return [...reviewed, ...pending];
}

export function evidenceCoverage(catalog, curated, trialIndex, variantIndex) {
  const rows = getTherapyRows(catalog, curated);
  return { assessments: (curated.assessments || []).length,
    unreviewed: rows.filter(r => !r.reviewed).length,
    legacyProducts: (catalog.therapies || []).length,
    trials: Object.keys(trialIndex.trials || {}).length,
    trialFailures: Object.keys(trialIndex.errors || {}).length,
    genes: Object.keys(variantIndex.genes || {}).length,
    completeGenes: Object.values(variantIndex.genes || {}).filter(x => x.complete).length,
    variants: Object.values(variantIndex.genes || {}).reduce((s, x) => s + (x.retrievedCount || 0), 0)
  };
}

export function variantLocation(variant, assembly = 'GRCh38') {
  return (variant.alleles || []).flatMap(a => a.locations || []).find(l => l.assembly_name === assembly) || null;
}

export function locateVariant(variant, reference) {
  if ((variant.alleles || []).length !== 1) return {kind:'unknown',reason:'Multiple or missing constituent alleles; inspect the record rather than projecting one locus.'};
  const assembly=reference?.assembly || 'GRCh38';
  if ((variant.alleles[0].locations || []).filter(l=>l.assembly_name===assembly).length!==1) return {kind:'unknown',reason:'One unambiguous assembly locus is required.'};
  const location = variantLocation(variant, reference?.assembly || 'GRCh38');
  const transcript = reference?.canonicalTranscript;
  if (!location || !transcript) return { kind:'unknown', reason:'Matching assembly and transcript coordinates are required.' };
  const uncertainBounds=['inner_start','inner_stop','outer_start','outer_stop'].some(key=>location[key]!==undefined && location[key]!==null && String(location[key]).trim()!=='');
  if (uncertainBounds || /g\.[^ ]*\?/.test(variant.alleles[0].name || variant.title || '')) return {kind:'unknown',reason:'ClinVar reports uncertain inner/outer or HGVS bounds; the source interval cannot be projected as an exact exon overlap.'};
  if (!Number.isInteger(transcript.start) || !Number.isInteger(transcript.end) || transcript.start<1 || transcript.end<transcript.start) return {kind:'unknown',reason:'Transcript bounds are missing or invalid.'};
  if (typeof location.start==='boolean' || typeof location.stop==='boolean') return {kind:'unknown',reason:'Invalid coordinate type.'};
  const start = Number(location.start), end = Number(location.stop);
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) return {kind:'unknown',reason:'Uncertain or missing variant bounds.'};
  if (String(location.chr) !== String(reference.chromosome)) return {kind:'unknown',reason:'Chromosome differs from the selected transcript reference.'};
  if (end < transcript.start || start > transcript.end) return {kind:'outside_transcript', start, end};
  const exons = transcript.exons || [];
  if (!exons.length || exons.some(e=>!Number.isFinite(e.start)||!Number.isFinite(e.end))) return {kind:'unknown',reason:'Exon reference is missing or invalid.'};
  const overlaps = exons.filter(e => start <= e.end && end >= e.start);
  const contained = overlaps.some(e => start >= e.start && end <= e.end);
  return {kind: contained ? 'exonic' : overlaps.length ? 'spans_exon_boundary' : 'intronic', start, end,
    exonIds: overlaps.map(e => e.id),
    reason:'Coordinate overlap with the Ensembl canonical transcript, not a functional consequence or splice assay.'};
}

export function toCsv(rows, columns) {
  const cell = x => {
    let s = x == null ? '' : typeof x === 'object' ? JSON.stringify(x) : String(x);
    if (/^[\t\r\n]|^\s*[=+@-]/.test(s)) s = "'" + s; // avoid executable spreadsheet cells
    return '"' + s.replaceAll('"', '""') + '"';
  };
  return [columns.map(cell).join(','), ...rows.map(row => columns.map(c => cell(row[c])).join(','))].join('\r\n');
}

export function downloadData(filename, value, type = 'application/json') {
  const body = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  const url = URL.createObjectURL(new Blob([body], {type}));
  const a = document.createElement('a'); a.href=url; a.download=filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
