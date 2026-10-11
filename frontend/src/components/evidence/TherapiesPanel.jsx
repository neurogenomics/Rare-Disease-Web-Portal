/* eslint-disable react/prop-types */
import { useCallback, useMemo } from 'react';
import { downloadData } from '../../lib/evidenceModel';
import { EmptyState, EntityLink, SectionLabel, SourceLinks, StatusBadge } from './EvidenceCommon';
import { geneTokens } from './evidenceUtils';
import AtlasAssociations from './AtlasAssociations';

const clinicalLabel = { benefit: 'Benefit reported', null: 'Primary endpoint not met', harm: 'Harm / worse outcome', mixed: 'Mixed or limited result', surrogate: 'Biomarker / surrogate response' };

function CellEvidence({ assessment, phenotype, predictions, atlasIndex }) {
  const cells = assessment.cells || {};
  const engaged = cells.engaged || [];
  return <section id="ev-cell-evidence" className="ev-section">
    <SectionLabel number="03">Cell evidence</SectionLabel>
    <h3>Which cells were affected?</h3>
    <p className="ev-note">Clinical benefit does not prove the predicted cell mediated it. Exposure, molecular engagement, functional rescue and a bypass mechanism are separate observations.</p>
    <div className="ev-cell-ledger">{[
      ['Disease-relevant cells', cells.diseaseRelevant], ['Exposure / delivery', cells.exposed], ['Molecular engagement', engaged], ['Functional cellular rescue', cells.rescue], ['Compensation / bypass', cells.bypass],
    ].map(([label, values]) => <div className="ev-cell-ledger-row" key={label}><span className="ev-field-label">{label}</span><div>{values?.length ? values.map((cell) => <span key={cell} className="ev-cell-tag">{cell}</span>) : <span className="ev-muted">Not established by this curation</span>}</div></div>)}</div>
    {cells.notes && <p className="ev-note">{cells.notes}</p>}
    <div className="ev-prediction-block"><AtlasAssociations hpoId={phenotype?.hpoId} atlasIndex={atlasIndex} predictions={predictions} engaged={engaged} /></div>
  </section>;
}

function HistoricalRecord({ row, onTrial, updateFilters }) {
  return <>
    <div className="ev-notice"><strong>Historical catalogue entry — evidence review pending.</strong> Approval, endpoint mappings and cell targeting were imported as claims. This entry is retained for discovery and has no adjudicated clinical or cell-mechanism conclusion.</div>
    <section className="ev-section"><SectionLabel number="01">Endpoint mapping candidates</SectionLabel><h3>Check the original mappings</h3>{row.mappings?.length ? row.mappings.map((mapping, i) => <article className="ev-mapping-card" key={`${mapping.hpoId}-${i}`}><div className="ev-inline-heading"><button className="ev-text-button" onClick={() => updateFilters({ hpo: mapping.hpoId })}>{mapping.referenceLabel || mapping.historicalLabel} <span className="ev-mono">{mapping.hpoId}</span></button><StatusBadge status="needs_review" /></div><p>{mapping.endpoint || 'Endpoint not recorded'}</p>{mapping.labelAgrees === false && <p className="ev-notice">Historical label “{mapping.historicalLabel}” disagrees with the current reference label “{mapping.referenceLabel}”. Review this crosswalk before use.</p>}{mapping.warning && <p className="ev-note">{mapping.warning}</p>}{mapping.nctId && <button className="ev-button ev-button--quiet" onClick={() => onTrial(mapping.nctId)}>Inspect {mapping.nctId} →</button>}{mapping.sourceUrls?.map((url) => <a className="ev-small-link" key={url} href={url} target="_blank" rel="noopener noreferrer">Original linked source ↗</a>)}</article>) : <p className="ev-note">No endpoint crosswalk was retained.</p>}</section>
    <section className="ev-section"><SectionLabel number="02">Linked trials</SectionLabel><h3>Inspect the trial records</h3>{(row.trials || []).map((trial) => <button key={trial.nct_id} className="ev-trial-link" onClick={() => onTrial(trial.nct_id)}><span><strong>{trial.trial_name || trial.nct_id}</strong><small>{trial.nct_id} · {trial.phase || 'Phase unknown'}</small></span><span aria-hidden="true">↗</span></button>)}</section>
  </>;
}

export default function TherapiesPanel({ rows, curated, predictions, atlasIndex, geneList = [], filters, cellHpoIds = null, updateFilters, onTrial }) {
  const rowGenes = useCallback((row) => [...new Set([...(row.assessment?.diseaseGenes || []), ...(row.assessment?.therapeuticTargets || []), ...geneTokens(row.gene)].filter((gene) => geneList.includes(gene)))], [geneList]);
  const sources = useMemo(() => Object.fromEntries((curated.sources || []).map((source) => [source.id, source])), [curated]);
  const matches = useMemo(() => rows.filter((row) => {
    const query = (filters.search || '').trim().toLowerCase();
    const phenotypes = row.assessment?.phenotypes || row.mappings || [];
    return (!query || [row.name, row.gene, row.disease, row.modality, ...phenotypes.map((p) => `${p.label || p.referenceLabel || ''} ${p.hpoId}`)].join(' ').toLowerCase().includes(query)) &&
      (!filters.gene || rowGenes(row).includes(filters.gene)) && (!filters.hpo || phenotypes.some((p) => p.hpoId === filters.hpo)) &&
      (cellHpoIds === null || phenotypes.some((p) => cellHpoIds.includes(p.hpoId) && (!filters.hpo || p.hpoId === filters.hpo))) &&
      (!filters.evidence || row.status === filters.evidence);
  }), [rows, filters, rowGenes, cellHpoIds]);
  const selected = matches.find((row) => row.id === filters.therapy) || (filters.therapy ? null : matches[0]);
  const assessment = selected?.assessment;
  const requirementsGene = assessment?.diseaseGenes?.[0];
  const phenotypes = assessment?.phenotypes || [];
  const activePhenotype = phenotypes.find((p) => p.hpoId === filters.hpo) || phenotypes.find((p) => cellHpoIds?.includes(p.hpoId)) || phenotypes[0];
  return <div className="ev-record-layout">
    <aside className="ev-record-sidebar" aria-label="Therapy catalogue"><div className="ev-sidebar-heading"><div><span className="ev-eyebrow">Evidence catalogue</span><h2>{matches.length} therapies</h2></div><select aria-label="Cell mechanism evidence filter" value={filters.evidence || ''} onChange={(event) => updateFilters({ evidence: event.target.value, therapy: null })}><option value="">All evidence</option><option value="supports">Supports mechanism</option><option value="indirect">Indirect</option><option value="mixed">Mixed</option><option value="unresolved">Unresolved</option><option value="unreviewed">Review pending</option></select></div>
      <div className="ev-record-list">{matches.map((row) => <button key={row.id} className={`ev-record ${selected?.id === row.id ? 'is-selected' : ''}`} aria-pressed={selected?.id === row.id} onClick={() => updateFilters({ therapy: row.id })}><span className="ev-record-gene">{row.gene}</span><strong>{row.name}</strong><span className="ev-record-disease">{row.disease}</span><StatusBadge status={row.status}>{row.reviewed ? row.status === 'supports' ? 'Mechanism supported' : row.status : 'Review pending'}</StatusBadge></button>)}</div>
      {!matches.length && <EmptyState onReset={() => updateFilters({ search: null, gene: null, hpo: null, cell: null, atlas: null, evidence: null, therapy: null })} />}
    </aside>
    <div className="ev-record-detail">{!selected ? <EmptyState title={filters.therapy ? 'This therapy is outside the active filters' : 'Choose a therapy'} onReset={() => updateFilters({ therapy: null, gene: null, hpo: null, cell: null, atlas: null, search: null, evidence: null })}>Clear filters to recover the selected record, or choose another therapy.</EmptyState> : <>
      <header className="ev-detail-header"><div className="ev-inline-heading"><span className="ev-eyebrow">Treatment → endpoint → cell</span><button className="ev-text-button" onClick={() => downloadData(`${selected.id}-evidence.json`, assessment || selected)}>Download record ↓</button></div><h2>{selected.name}</h2><p className="ev-lead-small">{selected.disease}</p><p className="ev-note"><strong>Gene / therapeutic target:</strong> {selected.gene}</p>{assessment?.geneRoleNotes && <p className="ev-note">{assessment.geneRoleNotes}</p>}<div className="ev-inline-tags">{rowGenes(selected).map((gene) => <EntityLink key={gene} tab="variants" gene={gene}>{gene} records →</EntityLink>)}<span className="ev-pill">{selected.modality}</span></div></header>
      {assessment && <nav className="ev-evidence-path" aria-label="Follow this evidence">{[['endpoints', 'Phenotype endpoint'], ['clinical', 'Trial outcome'], ['cell-evidence', 'Cell mechanism'], ['sources', 'Supporting sources']].map(([section, label], i) => <a key={section} href={`${window.location.pathname}${window.location.search}#ev-${section}`} onClick={(event) => { event.preventDefault(); document.getElementById(`ev-${section}`)?.scrollIntoView({ block: 'start' }); }}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>)}</nav>}
      {!assessment ? <HistoricalRecord row={selected} onTrial={onTrial} updateFilters={updateFilters} /> : <>
        <div className={`ev-conclusion ev-conclusion--${assessment.conclusion.status}`}><span className="ev-field-label">Cell-mechanism assessment</span><StatusBadge status={assessment.conclusion.status} /><p>{assessment.conclusion.summary}</p><span className="ev-note">This conclusion assesses the stated mechanism; it does not validate an atlas prediction.</span></div>
        <section id="ev-endpoints" className="ev-section"><SectionLabel number="01">Phenotype endpoint</SectionLabel><h3>What was actually measured?</h3><div className="ev-endpoint-list">{phenotypes.map((phenotype, i) => <article key={`${phenotype.hpoId}-${i}`} className={`ev-mapping-card ${activePhenotype === phenotype ? 'is-selected' : ''}`}><div className="ev-inline-heading"><button className="ev-text-button" aria-pressed={activePhenotype === phenotype} onClick={() => updateFilters({ hpo: phenotype.hpoId })}>{phenotype.label} <span className="ev-mono">{phenotype.hpoId}</span></button><StatusBadge status={phenotype.mapping}>{phenotype.mapping} crosswalk</StatusBadge></div><p><strong>Measured endpoint:</strong> {phenotype.endpoint}</p><p className="ev-note">{phenotype.rationale}</p><SourceLinks ids={phenotype.sourceIds} sources={sources} /><div className="ev-action-row">{requirementsGene && <EntityLink tab="modalities" gene={requirementsGene} hpo={phenotype.hpoId}>Explore therapeutic requirements →</EntityLink>}<a className="ev-small-link" href={`/phenotype?jump=${encodeURIComponent(phenotype.hpoId)}`}>Phenotype explorer ↗</a></div></article>)}</div>{!phenotypes.length && <p className="ev-note">No reviewed phenotype crosswalk is available.</p>}</section>
        <section id="ev-clinical" className="ev-section"><SectionLabel number="02">Clinical outcome</SectionLabel><h3>Did the intervention help?</h3>{(assessment.trials || []).map((trial, i) => <article className="ev-trial-card" key={`${trial.nctId}-${i}`}><div className="ev-inline-heading"><h4>{trial.name || trial.nctId}</h4><StatusBadge status={trial.outcome}>{clinicalLabel[trial.outcome] || 'Outcome unestablished'}</StatusBadge></div><p>{trial.summary}</p><SourceLinks ids={trial.sourceIds} sources={sources} />{trial.nctId && <button className="ev-button ev-button--quiet" onClick={() => onTrial(trial.nctId)}>Inspect numerical results · {trial.nctId} →</button>}</article>)}{!assessment.trials?.length && <p className="ev-note">No trial result has been adjudicated in this curation.</p>}
          {assessment.regulatory && <details className="ev-outcome"><summary>Regulatory context, jurisdiction and date</summary><div className="ev-outcome-body"><p>{assessment.regulatory.status}</p><p className="ev-note">{assessment.regulatory.jurisdiction} · status as described by sources on {assessment.regulatory.asOf || curated.reviewedAt}</p><SourceLinks ids={assessment.regulatory.sourceIds} sources={sources} /></div></details>}
        </section>
        <CellEvidence assessment={assessment} phenotype={activePhenotype} predictions={predictions} atlasIndex={atlasIndex} />
        <section id="ev-sources" className="ev-section"><SectionLabel number="04">Evidence ledger</SectionLabel><h3>Evidence for, against and still missing</h3><div className="ev-evidence-ledger">{(assessment.evidence || []).map((evidence, i) => <article key={evidence.id || i}><div><StatusBadge status={evidence.direction} /><span className="ev-evidence-level">{evidence.level?.replaceAll('_', ' ')}</span></div><p>{evidence.claim}</p><SourceLinks ids={evidence.sourceIds} sources={sources} /></article>)}</div><h4>Limits of the inference</h4><ul className="ev-limitations">{(assessment.limitations || []).map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
          {selected.legacy?.length > 0 && <details className="ev-outcome"><summary>Historical catalogue mappings retained for audit</summary><div className="ev-outcome-body"><p className="ev-note">These imported crosswalks may disagree with the reviewed endpoint mapping above.</p>{selected.legacy.map((legacy) => <div key={legacy.id}><strong>{legacy.name}</strong>{legacy.mappings?.map((mapping, i) => <p key={i}><span className="ev-mono">{mapping.hpoId}</span> · {mapping.historicalLabel} → {mapping.referenceLabel || 'No reference label'}{mapping.labelAgrees === false && <StatusBadge status="needs_review">Label mismatch</StatusBadge>}</p>)}</div>)}</div></details>}
        </section>
      </>}
    </>}</div>
  </div>;
}
