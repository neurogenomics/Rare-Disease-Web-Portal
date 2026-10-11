// Retain historical annotations for review, never as verified outcomes.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('frontend/src/data/approvedGeneTherapies.js', root), 'utf8');
const literal = source.split('export const approvedGeneTherapies = ')[1].split('// Helper functions')[0].trim().replace(/;$/, '');
const therapies = runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
const hpo = new Map(JSON.parse(readFileSync(new URL('frontend/src/data/hpoSeverity.json', root))).map(x => [x.hpo_id, x]));
const target = new URL('frontend/src/data/evidence/', root);
mkdirSync(target, { recursive: true });
const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const catalog = therapies.map(t => ({
  id: `legacy-${t.id}`, legacyId: t.id, name: t.brand_name, gene: t.gene_symbol,
  disease: t.disease_name, modality: t.modality, category: t.category,
  route: t.delivery_route, historicalApproval: { year: t.approval_year, agency: t.approval_agency, status: 'unverified_historical' },
  trials: t.pivotal_trials || [],
  mappings: (t.hpo_evidence || []).map(m => ({
    hpoId: m.hpo_id, historicalLabel: m.hpo_label, referenceLabel: hpo.get(m.hpo_id)?.hpo_name || null,
    labelAgrees: normalize(m.hpo_label) === normalize(hpo.get(m.hpo_id)?.hpo_name),
    status: 'needs_review', endpoint: m.evidence?.endpoint_measure, nctId: m.evidence?.trial_nct_id,
    sourceUrls: (m.sources || []).map(s => s.url),
    warning: 'Legacy machine annotation. Label agreement does not validate endpoint equivalence, efficacy or cell identity.'
  }))
}));
writeFileSync(new URL('legacyCatalog.json', target), JSON.stringify({
  metadata: { sourceCommit: '6820916', historicalAsOf: '2026-01', status: 'quarantined_for_review',
    note: 'Historical catalog, not a current regulatory list. Review is per intervention, indication and endpoint. Brands may share an intervention.' },
  therapies: catalog
}, null, 2) + '\n');
const extra = 'SMN2 SCN1A SYNGAP1 SCN2A SCN8A STXBP1 CHD2 KCNQ2 MECP2 UBE3A FOXG1 TCF4 SHANK3 GRIN2B SLC6A1 OPA1 USH2A CEP290 ABCA4 PCDH15 MYO7A CFTR HTT SOD1 FUS DMPK C9orf72 FMR1 DMD TTR TPP1 GAA GBA1 ATP7B PAH MFSD8 WAS ITGB2 OTOF G6PC1 SGSH'.split(' ');
// Preserve the reviewed panel and include typed disease/target identities. A
// historical re-export must never discard subsequently curated genes.
const existingGenes = JSON.parse(readFileSync(new URL('geneList.json', target), 'utf8'));
const curated = JSON.parse(readFileSync(new URL('curatedEvidence.json', target), 'utf8'));
const typedGenes = curated.assessments.flatMap(a => [...(a.diseaseGenes || []), ...(a.therapeuticTargets || [])]);
const genes = [...new Set([...existingGenes, ...typedGenes, ...therapies.map(t => t.gene_symbol).filter(g => /^[A-Z][A-Z0-9]+$/.test(g)), ...extra])].sort();
writeFileSync(new URL('geneList.json', target), JSON.stringify(genes, null, 2) + '\n');
console.log(JSON.stringify({ therapies: catalog.length, mappings: catalog.flatMap(t => t.mappings).length, genes: genes.length }));
