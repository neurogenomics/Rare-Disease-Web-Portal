/* eslint-disable react/prop-types */
import { useCallback, useMemo } from 'react';
import { downloadData } from '../../lib/evidenceModel';
import { endpointOutcomeLabel, getEndpointAssessment, getEndpointObservations, getEndpointResults, matchesTreatmentContext } from '../../lib/endpointModel';
import { EmptyState, EntityLink, ExplorerLink, SectionLabel, SourceLinks, StatusBadge } from './EvidenceCommon';
import { geneTokens } from './evidenceUtils';
import AtlasAssociations from './AtlasAssociations';

const clinicalLabel = { benefit: 'Benefit reported', null: 'Primary endpoint not met', harm: 'Harm / worse outcome', mixed: 'Mixed or limited result', surrogate: 'Biomarker / surrogate response' };

function CellEvidence({ assessment, phenotype, predictions, atlasIndex, endpointEvidence, disease, sources }) {
  const cells = assessment.cells || {};
  const engaged = cells.engaged || [];
  const observations = getEndpointObservations(endpointEvidence, assessment.id, phenotype?.hpoId, disease);
  return <section id="ev-cell-evidence" className="ev-section">
    <SectionLabel number="03">Cell evidence</SectionLabel>
    <h3>What cell evidence belongs to this endpoint?</h3>
    <p className="ev-note">Clinical benefit does not prove the predicted cell mediated it. Exposure, molecular engagement, functional rescue and a bypass mechanism are separate observations.</p>
    {observations.map(observation => <article className="ev-trial-card" key={observation.id}>
      <div className="ev-inline-heading"><h4>{observation.cells.join(' · ') || 'Cell identity not established'}</h4><StatusBadge status={observation.direction}>{observation.evidenceType.replaceAll('_', ' ')}</StatusBadge></div>
      <p>{observation.claim}</p>
      <div className="ev-detail-grid">{[
        ['Species / experimental system', observation.species], ['Population / genotype', observation.population],
        ['Route / delivery', observation.route], ['Assay', observation.assay], ['Time / stage', observation.timeFrame],
      ].map(([label, value]) => <div key={label}><span className="ev-field-label">{label}</span>{value}</div>)}</div>
      {observation.studyRelationship && <p className="ev-note"><strong>Relationship to the clinical results:</strong> {observation.studyRelationship}</p>}
      <p className="ev-note">Clinical mediation: not established. A model-cell experiment, regulatory mechanism or tissue assay is not proof that an exact atlas cell mediated the endpoint. No atlas identity crosswalk is asserted.</p>
      <SourceLinks ids={observation.sourceIds} sources={sources} />
    </article>)}
    {!observations.length && <p className="ev-notice">No structured cellular observation has been reviewed for this endpoint and population. Whole-treatment mechanistic background below cannot fill that gap. Missing evidence is not a negative cell finding.</p>}
    <details className="ev-outcome"><summary>Whole-treatment cell background · not an endpoint-specific result</summary><div className="ev-outcome-body"><div className="ev-cell-ledger">{[
      ['Disease-relevant cells', cells.diseaseRelevant], ['Exposure / delivery', cells.exposed], ['Molecular engagement', engaged], ['Functional cellular rescue', cells.rescue], ['Compensation / bypass', cells.bypass],
    ].map(([label, values]) => <div className="ev-cell-ledger-row" key={label}><span className="ev-field-label">{label}</span><div>{values?.length ? values.map((cell) => <span key={cell} className="ev-cell-tag">{cell}</span>) : <span className="ev-muted">Not established by this curation</span>}</div></div>)}</div>
    {cells.notes && <p className="ev-note">{cells.notes}</p>}</div></details>
    <div className="ev-prediction-block"><AtlasAssociations hpoId={phenotype?.hpoId} atlasIndex={atlasIndex} predictions={predictions} /></div>
  </section>;
}

function EndpointResult({ result, onTrial, sources }) {
  return <article className="ev-trial-card">
    <div className="ev-inline-heading"><h4>{result.endpoint}</h4><StatusBadge status={result.outcome}>{endpointOutcomeLabel[result.outcome] || 'Outcome not established in this scope'}</StatusBadge></div>
    {result.scopeReview === 'single_mapped_endpoint' && <p className="ev-notice"><strong>Detailed scope review pending.</strong> This result carries forward the existing adjudication for the treatment’s sole mapped phenotype. Missing population, time and analysis details stay unknown; this is not a new endpoint or subgroup reanalysis.</p>}
    <p>{result.summary}</p>
    <div className="ev-detail-grid">{[
      ['Studied population', result.population], ['Comparator', result.comparator], ['Time point', result.timeFrame],
      ['Endpoint / analysis role', result.role.replaceAll('_', ' ')],
    ].map(([label, value]) => <div key={label}><span className="ev-field-label">{label}</span>{value}</div>)}</div>
    <p className="ev-note"><strong>Analysis boundary:</strong> {result.analysis}</p>
    <SourceLinks ids={result.sourceIds} sources={sources} />
    <ul className="ev-limitations">{result.limits.map(limit => <li key={limit}>{limit}</li>)}</ul>
    <div className="ev-action-row">{result.trialRefs.filter(trial => trial.nctId).map(trial => <button key={trial.nctId} className="ev-button ev-button--quiet" onClick={() => onTrial(trial.nctId)}>Inspect registry results · {trial.nctId} →</button>)}</div>
  </article>;
}

function HistoricalRecord({ row, onTrial, updateFilters }) {
  return <>
    <div className="ev-notice"><strong>Historical catalogue entry — evidence review pending.</strong> Approval, endpoint mappings and cell targeting were imported as claims. This entry is retained for discovery and has no adjudicated clinical or cell-mechanism conclusion.</div>
    <section className="ev-section"><SectionLabel number="01">Endpoint mapping candidates</SectionLabel><h3>Check the original mappings</h3>{row.mappings?.length ? row.mappings.map((mapping, i) => <article className="ev-mapping-card" key={`${mapping.hpoId}-${i}`}><div className="ev-inline-heading"><button className="ev-text-button" onClick={() => updateFilters({ hpo: mapping.hpoId, therapy: row.id })}>{mapping.referenceLabel || mapping.historicalLabel} <span className="ev-mono">{mapping.hpoId}</span></button><StatusBadge status="needs_review" /></div><p>{mapping.endpoint || 'Endpoint not recorded'}</p>{mapping.labelAgrees === false && <p className="ev-notice">Historical label “{mapping.historicalLabel}” disagrees with the current reference label “{mapping.referenceLabel}”. Review this crosswalk before use.</p>}{mapping.warning && <p className="ev-note">{mapping.warning}</p>}{mapping.nctId && <button className="ev-button ev-button--quiet" onClick={() => onTrial(mapping.nctId)}>Inspect {mapping.nctId} →</button>}{mapping.sourceUrls?.map((url) => <a className="ev-small-link" key={url} href={url} target="_blank" rel="noopener noreferrer">Original linked source ↗</a>)}</article>) : <p className="ev-note">No endpoint crosswalk was retained.</p>}</section>
    <section className="ev-section"><SectionLabel number="02">Linked trials</SectionLabel><h3>Inspect the trial records</h3>{(row.trials || []).map((trial) => <button key={trial.nct_id} className="ev-trial-link" onClick={() => onTrial(trial.nct_id)}><span><strong>{trial.trial_name || trial.nct_id}</strong><small>{trial.nct_id} · {trial.phase || 'Phase unknown'}</small></span><span aria-hidden="true">↗</span></button>)}</section>
  </>;
}

export default function TherapiesPanel({ rows, curated, endpointEvidence, predictions, atlasIndex, geneList = [], filters, cellHpoIds = null, updateFilters, onTrial }) {
  const rowGenes = useCallback((row) => [...new Set([...(row.assessment?.diseaseGenes || []), ...(row.assessment?.therapeuticTargets || []), ...geneTokens(row.gene)].filter((gene) => geneList.includes(gene)))], [geneList]);
  const sources = useMemo(() => Object.fromEntries([...(curated.sources || []), ...(endpointEvidence?.sources || [])].map((source) => [source.id, source])), [curated, endpointEvidence]);
  const matches = useMemo(() => rows.filter((row) => {
    const query = (filters.search || '').trim().toLowerCase();
    const phenotypes = row.assessment?.phenotypes || row.mappings || [];
    return (!query || [row.name, row.gene, row.disease, row.modality, ...phenotypes.map((p) => `${p.label || p.referenceLabel || ''} ${p.hpoId}`)].join(' ').toLowerCase().includes(query)) &&
      (!filters.gene || rowGenes(row).includes(filters.gene)) &&
      matchesTreatmentContext(endpointEvidence, row.id, phenotypes, { hpo: filters.hpo, disease: filters.disease, cellHpoIds }) &&
      (!filters.evidence || row.status === filters.evidence);
  }), [rows, filters, rowGenes, cellHpoIds, endpointEvidence]);
  const selected = matches.find((row) => row.id === filters.therapy) || (filters.therapy ? null : matches[0]);
  const assessment = selected?.assessment;
  const requirementsGene = assessment?.diseaseGenes?.[0];
  const phenotypes = assessment?.phenotypes || [];
  const scopedPhenotypes = phenotypes.filter(p => (!filters.disease || getEndpointResults(endpointEvidence, assessment?.id, p.hpoId, filters.disease).length) && (cellHpoIds === null || cellHpoIds.includes(p.hpoId)));
  const activePhenotype = scopedPhenotypes.find((p) => p.hpoId === filters.hpo) || scopedPhenotypes[0];
  const endpointRecord = getEndpointAssessment(endpointEvidence, assessment?.id);
  const endpointResults = getEndpointResults(endpointEvidence, assessment?.id, activePhenotype?.hpoId, filters.disease);
  return <div className="ev-record-layout">
    <aside className="ev-record-sidebar" aria-label="Therapy catalogue"><div className="ev-sidebar-heading"><div><span className="ev-eyebrow">Evidence catalogue</span><h2>{matches.length} therapies</h2></div><select aria-label="Whole-treatment mechanism filter" value={filters.evidence || ''} onChange={(event) => updateFilters({ evidence: event.target.value, therapy: null })}><option value="">All whole-treatment mechanisms</option><option value="supports">Supports mechanism</option><option value="indirect">Indirect</option><option value="mixed">Mixed</option><option value="unresolved">Unresolved</option><option value="unreviewed">Review pending</option></select></div>
      {filters.disease && <p className="ev-note">Exact diagnosis filter: {filters.disease}. Only manually reviewed endpoint-population crosswalks qualify. Unmapped records remain unknown.</p>}
      <div className="ev-record-list">{matches.map((row) => <button key={row.id} className={`ev-record ${selected?.id === row.id ? 'is-selected' : ''}`} aria-pressed={selected?.id === row.id} onClick={() => updateFilters({ therapy: row.id })}><span className="ev-record-gene">{row.gene}</span><strong>{row.name}</strong><span className="ev-record-disease">{row.disease}</span><StatusBadge status={row.status}>{row.reviewed ? row.status === 'supports' ? 'Mechanism supported' : row.status : 'Review pending'}</StatusBadge></button>)}</div>
      {!matches.length && <EmptyState title={filters.disease ? 'No reviewed endpoint in this exact disease scope' : 'No matching records'} onReset={() => updateFilters({ search: null, gene: null, hpo: null, disease: null, cell: null, atlas: null, evidence: null, therapy: null })}>{filters.disease ? 'No exact diagnosis-to-endpoint-population join qualifies here. This does not establish lack of a treatment, effect or eligible allele.' : undefined}</EmptyState>}
    </aside>
    <div className="ev-record-detail">{!selected ? <EmptyState title={filters.therapy ? rows.some((row) => row.id === filters.therapy) ? 'This therapy is outside the active filters' : 'This treatment record is unavailable' : 'Choose a therapy'} onReset={() => updateFilters({ therapy: rows.some((row) => row.id === filters.therapy) ? filters.therapy : null, gene: null, hpo: null, disease: null, cell: null, atlas: null, search: null, evidence: null })}>Clear filters to recover the selected record, or choose another therapy.</EmptyState> : <>
      <header className="ev-detail-header"><div className="ev-inline-heading"><span className="ev-eyebrow">Treatment → endpoint → cell</span><button className="ev-text-button" onClick={() => downloadData(`${selected.id}-evidence.json`, { assessment: assessment || selected, endpointScope: endpointRecord, activeEndpoint: activePhenotype?.hpoId, disease: filters.disease || null })}>Download record ↓</button></div><h2>{selected.name}</h2><p className="ev-lead-small">{selected.disease}</p><p className="ev-note"><strong>Gene / therapeutic target:</strong> {selected.gene}</p>{assessment?.geneRoleNotes && <p className="ev-note">{assessment.geneRoleNotes}</p>}<div className="ev-inline-tags">{rowGenes(selected).map((gene) => <span key={gene}><EntityLink tab="variants" gene={gene} hpo={activePhenotype?.hpoId}>{gene} variants →</EntityLink>{' · '}<ExplorerLink kind="gene" selection={gene} hpo={activePhenotype?.hpoId}>{gene} associations →</ExplorerLink></span>)}<span className="ev-pill">{selected.modality}</span></div>{endpointRecord?.diseaseIds?.length > 0 && <details className="ev-outcome"><summary>Reviewed diagnosis identifiers · discovery links, not allele eligibility</summary><div className="ev-outcome-body">{endpointRecord.diseaseIds.map(disease => <article key={disease.id}><EntityLink tab="therapies" disease={disease.id} therapy={selected.id}>{disease.label} · {disease.id} →</EntityLink><p className="ev-note">{disease.rationale}</p><SourceLinks ids={disease.sourceIds} sources={sources} /></article>)}</div></details>}</header>
      {assessment && <nav className="ev-evidence-path" aria-label="Follow this evidence">{[['endpoints', 'Phenotype endpoint'], ['clinical', 'Trial outcome'], ['cell-evidence', 'Cell mechanism'], ['sources', 'Supporting sources']].map(([section, label], i) => <a key={section} href={`${window.location.pathname}${window.location.search}#ev-${section}`} onClick={(event) => { event.preventDefault(); document.getElementById(`ev-${section}`)?.scrollIntoView({ block: 'start' }); }}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>)}</nav>}
      {!assessment ? <HistoricalRecord row={selected} onTrial={onTrial} updateFilters={updateFilters} /> : <>
        <details className="ev-outcome"><summary>Whole-treatment mechanism background · {assessment.conclusion.status}</summary><div className="ev-outcome-body"><p>{assessment.conclusion.summary}</p><p className="ev-note">This assessment-wide conclusion is not the outcome of the selected endpoint or population and does not validate an atlas prediction. Endpoint results below are scoped separately.</p></div></details>
        <section id="ev-endpoints" className="ev-section"><SectionLabel number="01">Phenotype endpoint</SectionLabel><h3>What was actually measured?</h3><div className="ev-endpoint-list">{phenotypes.map((phenotype, i) => <article key={`${phenotype.hpoId}-${i}`} className={`ev-mapping-card ${activePhenotype === phenotype ? 'is-selected' : ''}`}><div className="ev-inline-heading"><button className="ev-text-button" aria-pressed={activePhenotype === phenotype} onClick={() => updateFilters({ hpo: phenotype.hpoId, therapy: selected.id })}>{phenotype.label} <span className="ev-mono">{phenotype.hpoId}</span></button><StatusBadge status={phenotype.mapping}>{phenotype.mapping} crosswalk</StatusBadge></div><p><strong>Measured endpoint:</strong> {phenotype.endpoint}</p><p className="ev-note">{phenotype.rationale}</p><SourceLinks ids={phenotype.sourceIds} sources={sources} /><div className="ev-action-row">{requirementsGene && <EntityLink tab="modalities" gene={requirementsGene} hpo={phenotype.hpoId}>Explore therapeutic requirements →</EntityLink>}<ExplorerLink className="ev-small-link" kind="phenotype" selection={phenotype.hpoId}>Phenotype explorer →</ExplorerLink></div></article>)}</div>{!phenotypes.length && <p className="ev-note">No reviewed phenotype crosswalk is available.</p>}</section>
        <section id="ev-clinical" className="ev-section"><SectionLabel number="02">Clinical outcome</SectionLabel><h3>What happened to the selected endpoint?</h3><p className="ev-note"><strong>{activePhenotype?.label || 'No applicable endpoint'} {activePhenotype?.hpoId}</strong>. Results below retain their own trial, population, comparator, time and analysis. Benefit in another organ or indication is not inherited.</p>{endpointResults.map(result => <EndpointResult key={result.id} result={result} onTrial={onTrial} sources={sources} />)}{!endpointResults.length && <p className="ev-notice">No endpoint-specific result has been reviewed in this scope. An assessment-wide trial badge cannot substitute for this missing join.</p>}
          <details className="ev-outcome"><summary>All whole-trial summaries · includes other endpoints and populations</summary><div className="ev-outcome-body">{(assessment.trials || []).map((trial, i) => <article className="ev-trial-card" key={`${trial.nctId}-${i}`}><div className="ev-inline-heading"><h4>{trial.name || trial.nctId}</h4><StatusBadge status={trial.outcome}>{clinicalLabel[trial.outcome] || 'Outcome unestablished'}</StatusBadge></div><p>{trial.summary}</p><SourceLinks ids={trial.sourceIds} sources={sources} />{trial.nctId && <button className="ev-button ev-button--quiet" onClick={() => onTrial(trial.nctId)}>Inspect numerical results · {trial.nctId} →</button>}</article>)}</div></details>
          {assessment.regulatory && <details className="ev-outcome"><summary>Regulatory context, jurisdiction and date</summary><div className="ev-outcome-body"><p>{assessment.regulatory.status}</p><p className="ev-note">{assessment.regulatory.jurisdiction} · status as described by sources on {assessment.regulatory.asOf || curated.reviewedAt}</p><SourceLinks ids={assessment.regulatory.sourceIds} sources={sources} /></div></details>}
        </section>
        <CellEvidence assessment={assessment} phenotype={activePhenotype} predictions={predictions} atlasIndex={atlasIndex} endpointEvidence={endpointEvidence} disease={filters.disease} sources={sources} />
        <section id="ev-sources" className="ev-section"><SectionLabel number="04">Evidence ledger</SectionLabel><h3>Whole-treatment sources and limitations</h3><p className="ev-note">This ledger includes evidence from other endpoints, indications and experimental systems. Its directions apply to each written claim; they are not an endpoint-specific score or a causal-cell verdict. Use the scoped result and observation source links above for the selected phenotype.</p><div className="ev-evidence-ledger">{(assessment.evidence || []).map((evidence, i) => <article key={evidence.id || i}><div><StatusBadge status={evidence.direction} /><span className="ev-evidence-level">{evidence.level?.replaceAll('_', ' ')}</span></div><p>{evidence.claim}</p><SourceLinks ids={evidence.sourceIds} sources={sources} /></article>)}</div><h4>Limits of the inference</h4><ul className="ev-limitations">{(assessment.limitations || []).map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
          {selected.legacy?.length > 0 && <details className="ev-outcome"><summary>Historical catalogue mappings retained for audit</summary><div className="ev-outcome-body"><p className="ev-note">These imported crosswalks may disagree with the reviewed endpoint mapping above.</p>{selected.legacy.map((legacy) => <div key={legacy.id}><strong>{legacy.name}</strong>{legacy.mappings?.map((mapping, i) => <p key={i}><span className="ev-mono">{mapping.hpoId}</span> · {mapping.historicalLabel} → {mapping.referenceLabel || 'No reference label'}{mapping.labelAgrees === false && <StatusBadge status="needs_review">Label mismatch</StatusBadge>}</p>)}</div>)}</div></details>}
        </section>
      </>}
    </>}</div>
  </div>;
}
