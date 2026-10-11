/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Layout, Tabs } from 'antd';
import CustomHeader from '../components/utilities/Header';
import CustomFooter from '../components/utilities/Footer';
import TherapiesPanel from '../components/evidence/TherapiesPanel';
import VariantsPanel from '../components/evidence/VariantsPanel';
import ModalitiesPanel from '../components/evidence/ModalitiesPanel';
import TrialDrawer from '../components/evidence/TrialDrawer';
import { EntityLink, SectionLabel } from '../components/evidence/EvidenceCommon';
import { number, sourceDate, useEvidenceIndex } from '../components/evidence/evidenceUtils';
import { evidenceCoverage, getTherapyRows, downloadData } from '../lib/evidenceModel';
import catalog from '../data/evidence/legacyCatalog.json';
import curated from '../data/evidence/curatedEvidence.json';
import variantIndex from '../data/evidence/variantIndex.json';
import geneList from '../data/evidence/geneList.json';
import contexts from '../data/evidence/mechanismContexts.json';
import variantFunctionalEvidence from '../data/evidence/variantFunctionalEvidence.json';
import predictions from '../data/hpoCellTypePredictions.json';
import '../styles/evidence.css';

const tabs = [
  { id: 'therapies', label: 'Treatment evidence', step: '01', description: 'Intervention, trial endpoint and cell mechanism' },
  { id: 'variants', label: 'Genes & variants', step: '02', description: 'Clinical assertions and transcript coordinates' },
  { id: 'modalities', label: 'Modality requirements', step: '03', description: 'Disease context, feasibility and missing evidence' },
  { id: 'methods', label: 'Methods & coverage', step: '04', description: 'Sources, dates and the limits of each connection' },
];

function PhenotypePicker({ hpo, onSelect, hpoTerms }) {
  const [query, setQuery] = useState(hpo || '');
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setQuery(hpo || ''); setInvalid(false); }, [hpo]);
  const matches = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return [];
    return Object.entries(hpoTerms.terms).filter(([id, term]) => !term.obsolete && term.isPhenotypicAbnormality !== false && (id.toLowerCase().includes(text) || term.label.toLowerCase().includes(text) || term.synonyms?.some((synonym) => synonym.toLowerCase().includes(text)))).slice(0, 60);
  }, [query, hpoTerms]);
  const submit = (event) => {
    event.preventDefault();
    const exactId = query.trim().toUpperCase();
    const exact = matches.find(([id, term]) => id === exactId || term.label.toLowerCase() === query.trim().toLowerCase() || term.synonyms?.some((synonym) => synonym.toLowerCase() === query.trim().toLowerCase()));
    if (!query.trim()) onSelect(null);
    else if (exact) onSelect(exact[0]);
    else setInvalid(true);
  };
  return <form className="ev-phenotype-picker" onSubmit={submit}>
    <label htmlFor="ev-hpo-filter">Phenotype</label>
    <div><input id="ev-hpo-filter" list="ev-hpo-options" value={query} aria-invalid={invalid || undefined} onChange={(event) => { const value = event.target.value; setQuery(value); setInvalid(false); if (hpoTerms.terms[value]?.label) onSelect(value); if (!value) onSelect(null); }} placeholder="Name or HP identifier" autoComplete="off" /><button type="submit" className="ev-picker-apply" aria-label="Apply exact phenotype name or identifier">↵</button></div>
    <datalist id="ev-hpo-options">{matches.map(([id, term]) => <option key={id} value={id}>{term.label}</option>)}</datalist>
    {invalid && <p className="ev-note" role="status">Choose a suggested term or enter an exact HPO identifier.</p>}
  </form>;
}

function MethodsPanel({ coverage, onTrial, atlasIndex, genePhenotypes, geneExpression, hpoTerms, trialIndex, dosageEvidence }) {
  const metadata = atlasIndex._metadata || {};
  const sourceRows = [
    ['Reviewed treatment cases', `${coverage.assessments} case assessments`, sourceDate(curated.reviewedAt), 'Cited papers, regulatory labels and trial records', 'Selected cases. A mechanism conclusion is separate from the clinical outcome and atlas validation.'],
    ['Historical treatment catalogue', `${coverage.legacyProducts} imported entries; ${coverage.unreviewed} pending review`, catalog.metadata?.historicalAsOf || 'Unknown', 'Original portal catalogue', 'Discovery claims, including imported HPO crosswalks. This is not a current regulatory list.'],
    ['ClinicalTrials.gov snapshots', `${coverage.trials} retrieved; ${coverage.trialFailures} retrieval errors`, sourceDate(trialIndex.metadata?.generatedAt), 'ClinicalTrials.gov API', trialIndex.metadata?.scope],
    ['ClinVar query snapshots', `${number(coverage.variants)} records across ${coverage.genes} genes`, sourceDate(variantIndex.metadata?.generatedAt), 'NCBI ClinVar / E-utilities', variantIndex.metadata?.scope],
    ['HPO disease–gene associations', `${number(genePhenotypes.metadata?.coverage?.association_rows)} association rows`, genePhenotypes.metadata?.source_last_modified || 'Unknown', 'HPO phenotype_to_genes export', genePhenotypes.metadata?.scope],
    ['HPO identifier reference', hpoTerms.metadata?.version || 'Version unavailable', sourceDate(hpoTerms.metadata?.retrievedAt), 'Human Phenotype Ontology', 'Labels resolve identifiers; endpoint crosswalks are separate curator judgments.'],
    ['Phenotype–cell associations', `${number(metadata.phenotypeCount)} tested phenotypes; ${number(metadata.phenotypesWithFiles)} files`, sourceDate(metadata.generatedAt), 'Original atlas import matrices', 'Import date is not the analysis date. Atlas identity and source hashes are preserved; generating model and release lineage are unknown.'],
    ['Cell expression specificity', `${number(geneExpression._metadata?.panelGenes)} panel genes`, sourceDate(geneExpression._metadata?.generatedAt), 'Original atlas expression matrices', geneExpression._metadata?.scope],
    ['ClinGen gene dosage', `${number(Object.keys(dosageEvidence.genes || {}).length)} genes in source table`, sourceDate(dosageEvidence.metadata?.retrievedAt), 'ClinGen Dosage Sensitivity', dosageEvidence.metadata?.scope],
    ['Allele-specific functional cases', `${variantFunctionalEvidence.cases.length} selected examples`, sourceDate(variantFunctionalEvidence.reviewedAt), 'Cited functional and clinical reports', variantFunctionalEvidence.scope],
    ['Phenotype severity', 'Historical machine annotations', 'Generation date unknown', 'Original portal severity export', 'Unvalidated classes. The legacy numeric score is not a calibrated measure of urgency or treatment suitability.'],
  ];
  return <div className="ev-methods-panel">
    <header className="ev-panel-header"><div><span className="ev-eyebrow">Evidence has a scope</span><h2>Know what each connection means.</h2><p>Primary observations, curator crosswalks and statistical associations carry different claims.</p></div><button className="ev-button ev-button--quiet" onClick={() => downloadData('evidence-source-manifest.json', { curated: { reviewedAt: curated.reviewedAt, scope: curated.scope, sources: curated.sources }, variants: variantIndex.metadata, trials: trialIndex.metadata, genePhenotypes: genePhenotypes.metadata, hpo: hpoTerms.metadata, atlas: metadata, expression: geneExpression._metadata, dosage: dosageEvidence.metadata, variantFunctionalCases: { scope: variantFunctionalEvidence.scope, reviewedAt: variantFunctionalEvidence.reviewedAt } })}>Download source manifest ↓</button></header>
    <section className="ev-section"><SectionLabel number="01">Interpretation</SectionLabel><div className="ev-method-principles">
      <article><span className="ev-method-symbol">↗</span><h3>An endpoint is a measured feature.</h3><p>A treatment result maps to a phenotype only through its stated endpoint, time point and population. Direct, proxy and indirect crosswalks remain visible.</p><EntityLink tab="therapies" therapy="nusinersen-sma">Inspect a crosswalk →</EntityLink></article>
      <article><span className="ev-method-symbol">⌁</span><h3>Association is a hypothesis.</h3><p>Atlas enrichment and expression can suggest a cell context. They do not establish cellular causality, delivery, engagement or rescue. Signed negative estimates remain separate.</p><EntityLink tab="modalities" gene="SCN1A" hpo="HP:0001250">Inspect cell evidence →</EntityLink></article>
      <article><span className="ev-method-symbol">∧</span><h3>Requirements need evidence.</h3><p>A scoped modality needs every necessary condition supported together. A missing condition stays unknown; a source-backed contradiction blocks that scenario.</p><EntityLink tab="modalities" gene="SCN1A">Inspect the requirement ledger →</EntityLink></article>
    </div><div className="ev-notice"><strong>No therapeutic accuracy estimate is available.</strong> This portal has no independent, prespecified validation set with endpoint-level positive and negative outcomes, eligible denominator and blinded adjudication. Counting approvals, matching labels or selected examples would not establish prediction accuracy.</div></section>
    <section className="ev-section"><SectionLabel number="02">Coverage & freshness</SectionLabel><h3>What is in this build?</h3><div className="ev-table-scroll"><table className="ev-table ev-coverage-table"><caption>Source snapshots and their limits. Retrieval completeness refers to a stated query, not to complete biological knowledge.</caption><thead><tr><th>Evidence layer</th><th>Coverage</th><th>Source / capture date</th><th>Source type</th><th>Scope & limits</th></tr></thead><tbody>{sourceRows.map(([name, count, date, source, scope]) => <tr key={name}><td><strong>{name}</strong></td><td>{count}</td><td>{date}</td><td>{source}</td><td>{scope}</td></tr>)}</tbody></table></div><p className="ev-note">{coverage.completeGenes} of {coverage.genes} gene-query snapshots report complete retrieval. Missing records, missing coordinates and unreviewed findings remain visible in each evidence layer. Regulatory status belongs to a jurisdiction and source date.</p></section>
    <section className="ev-section"><SectionLabel number="03">Traceable primary evidence</SectionLabel><h3>Open the underlying record.</h3><div className="ev-source-library">{curated.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer"><span className="ev-field-label">{source.kind?.replaceAll('_', ' ') || 'Cited source'}</span><strong>{source.title}<span aria-hidden="true">↗</span></strong><small>Accessed {sourceDate(source.accessedAt)}</small></a>)}</div><details className="ev-outcome"><summary>Registry snapshots available in this build</summary><div className="ev-outcome-body ev-trial-library">{Object.values(trialIndex.trials || {}).map((trial) => <button className="ev-trial-link" key={trial.nctId} onClick={() => onTrial(trial.nctId)}><span><strong>{trial.title}</strong><small>{trial.nctId} · {trial.hasResults ? 'Posted results' : 'No posted results'} · updated {sourceDate(trial.lastUpdate)}</small></span><span aria-hidden="true">↗</span></button>)}</div></details></section>
    <section className="ev-section"><SectionLabel number="04">Source lineage</SectionLabel><h3>Precision is preserved. Validation remains separate.</h3><p className="ev-note">{metadata.precision}</p><div className="ev-source-manifests">{(metadata.sources || []).map((source) => <details className="ev-outcome" key={source.sourceFile}><summary>{source.atlas} · {source.kind?.replaceAll('_', ' ')}</summary><div className="ev-outcome-body"><p>{source.sourceGenerationLineage}</p><p className="ev-note">{source.timestampMeaning} Local timestamp: {sourceDate(source.localFileModifiedAt)}.</p><p>{number(source.sourceRows)} source rows · {number(source.retainedRows)} retained</p><span className="ev-field-label">File & SHA-256</span><p className="ev-mono ev-break">{source.sourceFile}<br />{source.sha256}</p></div></details>)}</div><ul className="ev-limitations">{metadata.limitations?.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></section>
  </div>;
}

export default function EvidenceWorkbench({ initialTab = 'therapies' }) {
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(params);
  const tab = tabs.some((item) => item.id === filters.tab) ? filters.tab : initialTab;
  const atlasState = useEvidenceIndex('atlasIndex', tab !== 'variants');
  const phenotypeState = useEvidenceIndex('genePhenotypes', tab !== 'therapies');
  const expressionState = useEvidenceIndex('geneExpression', ['variants', 'methods'].includes(tab));
  const hpoState = useEvidenceIndex('hpoTerms');
  const severityState = useEvidenceIndex('hpoSeverity', tab === 'modalities');
  const dosageState = useEvidenceIndex('dosageEvidence', ['variants', 'methods'].includes(tab));
  const trialState = useEvidenceIndex('trialIndex', tab === 'methods');
  const cellState = useEvidenceIndex('cellIndex', Boolean(filters.cell));
  const atlasIndex = atlasState.data || { phenotypes: {} };
  const genePhenotypes = phenotypeState.data || { genes: {} };
  const geneExpression = expressionState.data || { genes: {} };
  const hpoTerms = hpoState.data || { terms: {} };
  const severity = severityState.data || [];
  const dosageEvidence = dosageState.data || { genes: {} };
  const trialIndex = trialState.data || { trials: {} };
  const requiredIndices = [...(tab === 'therapies' ? [atlasState, hpoState] : tab === 'variants' ? [phenotypeState, expressionState, dosageState, hpoState] : tab === 'modalities' ? [atlasState, phenotypeState, severityState, hpoState] : [atlasState, phenotypeState, expressionState, hpoState, trialState, dosageState]), ...(filters.cell ? [cellState] : [])];
  const indicesLoading = requiredIndices.some((state) => state.loading || !state.data && !state.error);
  const indexErrors = requiredIndices.filter((state) => state.error);
  const cellRecord = cellState.data?.cells?.[filters.atlas]?.[filters.cell];
  const cellHpoIds = filters.cell ? cellRecord?.positiveHpoIds || [] : null;
  const cellSourceUnavailable = Boolean(filters.cell && cellState.error);
  const [nctId, setNctId] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const rows = useMemo(() => getTherapyRows(catalog, curated), []);
  const coverage = useMemo(() => evidenceCoverage(catalog, curated, trialState.data || {}, variantIndex), [trialState.data]);
  const updateFilters = (updates, replace = false) => setParams((previous) => {
    const next = new URLSearchParams(previous);
    Object.entries(updates).forEach(([key, value]) => value == null || value === '' ? next.delete(key) : next.set(key, value));
    return next;
  }, { replace });
  useEffect(() => { document.title = `${tabs.find((item) => item.id === tab)?.label || 'Evidence'} · Rare Disease Celltyping Portal`; }, [tab]);
  useEffect(() => { setCopyStatus(''); }, [params]);
  const activeChips = [['gene', filters.gene], ['hpo', filters.hpo && `${hpoTerms.terms[filters.hpo]?.label || 'Phenotype'} · ${filters.hpo}`], ['cell', filters.cell && `Cell: ${filters.cell.replaceAll('_', ' ')}`], ['atlas', filters.atlas && `Atlas: ${{ DescartesHuman: 'Descartes Human', HumanCellLandscape: 'Human Cell Landscape' }[filters.atlas] || filters.atlas}`], ['search', filters.search]].filter(([, value]) => value);
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopyStatus('Link copied'); }
    catch { setCopyStatus('Copy the address from your browser'); }
  };
  const content = <>
      {tab !== 'methods' && <div className="ev-global-filters"><label className="ev-search-label" htmlFor="ev-search">Search this view<div><span aria-hidden="true">⌕</span><input type="search" id="ev-search" placeholder={tab === 'variants' ? 'HGVS, condition or consequence…' : 'Therapy, disease, gene or phenotype…'} value={filters.search || ''} onChange={(event) => updateFilters({ search: event.target.value, therapy: null, variant: null, candidate: null }, true)} /></div></label><label className="ev-gene-filter" htmlFor="ev-gene-filter">Gene<select id="ev-gene-filter" value={filters.gene || ''} onChange={(event) => updateFilters({ gene: event.target.value, therapy: null, variant: null, candidate: null })}><option value="">{tab === 'variants' ? 'Default: SCN1A' : 'All panel genes'}</option>{geneList.map((gene) => <option key={gene}>{gene}</option>)}{filters.gene && !geneList.includes(filters.gene) && <option>{filters.gene}</option>}</select></label><PhenotypePicker hpo={filters.hpo} hpoTerms={hpoTerms} onSelect={(hpo) => updateFilters({ hpo, candidate: null })} />{activeChips.length > 0 && <button className="ev-text-button ev-clear-all" onClick={() => updateFilters({ search: null, gene: null, hpo: null, cell: null, atlas: null, therapy: null, variant: null, candidate: null, evidence: null, vclass: null, consequence: null, location: null, stars: null, readiness: null, mechanism: null, severity: null })}>Clear filters</button>}</div>}
      {tab !== 'methods' && activeChips.length > 0 && <div className="ev-active-filters" aria-label="Active filters">{activeChips.map(([key, value]) => <button key={key} onClick={() => updateFilters({ [key]: null, ...(['cell', 'atlas'].includes(key) ? { cell: null, atlas: null, therapy: null } : {}), candidate: null, variant: null })}>{value}<span aria-hidden="true">×</span><span className="ev-sr-only">Remove {key} filter</span></button>)}</div>}
      {filters.cell && !indicesLoading && !cellSourceUnavailable && <aside className="ev-notice ev-cell-context" aria-label="Exact atlas cell context"><strong>Exact atlas cell context:</strong> <span className="ev-mono">{filters.cell}</span> · {filters.atlas || 'Atlas not supplied'}.{cellRecord ? <><p>{number(cellHpoIds.length)} positively associated phenotypes in this atlas source snapshot (positive estimate; source q &lt; {cellState.data?.metadata?.qThreshold ?? 0.05}). Treatment and modality lists include only these phenotypes; a positive association does not establish therapeutic targeting, delivery, cellular causality or treatment benefit. Negative associations are retained separately and do not qualify this filter.</p>{tab === 'variants' && <p>The ClinVar table remains gene-scoped. This cell context does not assign variants to cell types.</p>}</> : <p>No exact cell label matches in the stated atlas source. No broader lineage or naming match is inferred. Clear the cell context to explore other evidence.</p>}<button className="ev-text-button" onClick={() => downloadData('atlas-cell-phenotype-context.json', { atlas: filters.atlas, cell: filters.cell, associations: cellRecord || null, provenance: cellState.data?.metadata })}>Download exact associations & provenance ↓</button></aside>}
      <div id="ev-workspace" className="ev-workspace" tabIndex={-1} aria-label={tabs.find((item) => item.id === tab)?.description}>
        {indicesLoading && <p className="ev-loading" role="status">Loading source indices for this evidence view…</p>}
        {indexErrors.map((state, i) => <p key={i} className="ev-notice" role="alert">{state.error} This source layer is unavailable. Missing source data does not establish a negative finding.</p>)}
        {tab === 'therapies' && !indicesLoading && !cellSourceUnavailable && <TherapiesPanel rows={rows} curated={curated} predictions={predictions} atlasIndex={atlasIndex} geneList={geneList} filters={filters} cellHpoIds={cellHpoIds} updateFilters={updateFilters} onTrial={setNctId} />}
        {tab === 'variants' && !indicesLoading && <VariantsPanel filters={filters} updateFilters={updateFilters} variantIndex={variantIndex} geneList={geneList} genePhenotypes={genePhenotypes} hpoTerms={hpoTerms} geneExpression={geneExpression} dosageEvidence={dosageEvidence} variantFunctionalEvidence={variantFunctionalEvidence} />}
        {tab === 'modalities' && !indicesLoading && !cellSourceUnavailable && <ModalitiesPanel filters={filters} updateFilters={updateFilters} genePhenotypes={genePhenotypes} severity={severity} predictions={predictions} contexts={contexts} variantIndex={variantIndex} atlasIndex={atlasIndex} cellHpoIds={cellHpoIds} />}
        {tab === 'methods' && !indicesLoading && <MethodsPanel coverage={coverage} onTrial={setNctId} atlasIndex={atlasIndex} genePhenotypes={genePhenotypes} geneExpression={geneExpression} hpoTerms={hpoTerms} trialIndex={trialIndex} dosageEvidence={dosageEvidence} />}
      </div>
      <aside className="ev-footer" aria-label="Evidence interpretation limits"><strong>Research evidence and interpretation</strong><button className="ev-text-button" onClick={() => updateFilters({ tab: 'methods' })}>Methods & source coverage →</button><p>Research contexts and requirement assessments do not establish individual treatment suitability. Source dates, experimental scope and missing evidence belong to every conclusion.</p></aside>
    </>;
  const navigationKey = { therapies: 'approved-therapies', variants: 'variants', modalities: 'gene-therapy-targets', methods: 'methods' }[tab];
  return <Layout className="ev-workbench">
    <a className="ev-skip-link" href={`${window.location.pathname}${window.location.search}#ev-workspace`} onClick={(event) => { event.preventDefault(); const workspace = document.getElementById('ev-workspace'); workspace?.focus({ preventScroll: true }); workspace?.scrollIntoView({ block: 'start' }); }}>Skip to evidence</a>
    <CustomHeader activePageKey={navigationKey} />
    <Layout.Content className="ev-main">
      <Breadcrumb className="ev-breadcrumb" items={[{ title: <Link to="/">Home</Link> }, { title: 'Evidence explorer' }]} />
      <Card className="ev-intro-card"><section className="ev-hero"><div><h1>Evidence explorer</h1><p>Follow the chain between a phenotype, its cells and genes, a specific variant, and the approaches tested in people. Inspect the observations behind each connection.</p></div><div className="ev-hero-aside"><span className="ev-aside-label">Source coverage</span><div><b>{number(coverage.assessments)}</b><span>reviewed treatment cases</span></div><div><b>{number(coverage.genes)}</b><span>genes with ClinVar snapshots</span></div><button className="ev-text-button" onClick={() => updateFilters({ tab: 'methods' })}>See coverage & source dates →</button></div></section></Card>
      {copyStatus && <p className="ev-share-status" role="status">{copyStatus}</p>}
      <Tabs className="ev-portal-tabs" activeKey={tab} onChange={(nextTab) => updateFilters({ tab: nextTab })} tabBarExtraContent={<Button onClick={copyLink} aria-label="Copy a link to this evidence view">Share view</Button>} items={tabs.map((item) => ({ key: item.id, label: item.label, children: item.id === tab ? content : null }))} />
    </Layout.Content>
    <CustomFooter />
    <TrialDrawer nctId={nctId} onClose={() => setNctId(null)} />
  </Layout>;
}
