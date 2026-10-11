/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { StatusBadge } from './EvidenceCommon';
import { useEvidenceJson, sourceDate, humanize, downloadJson } from './evidenceUtils';

function OutcomeTable({ outcome }) {
  const groups = Object.fromEntries((outcome.groups || []).map((g) => [g.id, g.title]));
  const rows = (outcome.classes || []).flatMap((cls) => (cls.categories || []).flatMap((category) => (category.measurements || []).map((measurement) => ({
    ...measurement,
    section: [cls.title, category.title].filter(Boolean).join(' · ') || 'Reported measurement',
    n: (cls.denoms || outcome.denoms || []).flatMap((d) => (d.counts || []).map((count) => ({ ...count, units: d.units }))).filter((count) => count.groupId === measurement.groupId).map((count) => `${count.value} ${count.units || ''}`).join('; '),
  }))));
  return <details className="ev-outcome" open={outcome.type === 'PRIMARY'}>
    <summary><StatusBadge status={outcome.type === 'PRIMARY' ? 'indirect' : 'unknown'}>{humanize(outcome.type)} endpoint</StatusBadge><strong>{outcome.title}</strong></summary>
    <div className="ev-outcome-body"><div className="ev-detail-grid"><div><span className="ev-field-label">Time point</span>{outcome.timeFrame || 'Not supplied'}</div><div><span className="ev-field-label">Reported statistic</span>{humanize(outcome.paramType)} · {outcome.unitOfMeasure || 'Unit not supplied'}</div></div>
      {outcome.description && <p>{outcome.description}</p>}
      {outcome.populationDescription && <p className="ev-note"><strong>Analysis population:</strong> {outcome.populationDescription}</p>}
      {rows.length ? <div className="ev-table-scroll"><table className="ev-table"><caption className="ev-sr-only">Reported outcome values by arm and time point</caption><thead><tr><th>Time / stratum</th><th>Arm / comparator</th><th>Value</th><th>{outcome.dispersionType || 'Uncertainty'}</th><th>Denominator</th></tr></thead><tbody>{rows.map((row, i) => <tr key={i}><td>{row.section}</td><td>{groups[row.groupId] || row.groupId}</td><td className="ev-numeric">{row.value ?? 'Not reported'}</td><td className="ev-numeric">{row.spread ?? ([row.lowerLimit, row.upperLimit].filter((v) => v != null).join('–') || 'Not reported')}</td><td>{row.n || 'Not reported'}</td></tr>)}</tbody></table></div> : <p className="ev-note">No arm-level measurements are supplied in this registry outcome record.</p>}
      {(outcome.analyses || []).map((analysis, i) => <article className="ev-analysis" key={i}><h4>Reported statistical analysis {outcome.analyses.length > 1 ? i + 1 : ''}</h4><p><strong>Groups compared:</strong> {(analysis.groupIds || []).map((id) => groups[id] || id).join(' vs ') || 'Not supplied'}</p><div className="ev-detail-grid"><div><span className="ev-field-label">Effect estimate</span>{analysis.paramValue ?? 'Not reported'}<small>{analysis.paramType || 'Estimate type not supplied'}</small></div><div><span className="ev-field-label">Confidence interval</span>{analysis.ciLowerLimit != null || analysis.ciUpperLimit != null ? `${analysis.ciLowerLimit ?? '?'} to ${analysis.ciUpperLimit ?? '?'}` : 'Not reported'}<small>{analysis.ciPctValue ? `${analysis.ciPctValue}% · ${humanize(analysis.ciNumSides)}` : 'Confidence level not supplied'}</small></div><div><span className="ev-field-label">p value</span>{analysis.pValue ?? 'Not reported'}<small>{analysis.pValueComment || analysis.nonInferiorityType?.replaceAll('_', ' ').toLowerCase()}</small></div><div><span className="ev-field-label">Method</span>{analysis.statisticalMethod || 'Not supplied'}<small>{analysis.statisticalComment || analysis.paramValueComment}</small></div></div>{analysis.estimateComment && <p>{analysis.estimateComment}</p>}<details className="ev-outcome"><summary>All supplied analysis fields</summary><pre className="ev-json">{JSON.stringify(analysis, null, 2)}</pre></details></article>)}
      {!outcome.analyses?.length && <p className="ev-note">No comparative statistical analysis is supplied for this outcome. Arm values alone do not establish a treatment effect.</p>}
    </div>
  </details>;
}

export default function TrialDrawer({ nctId, onClose }) {
  const ref = useRef(null);
  const validId = /^NCT\d{8}$/.test(nctId || '');
  const { data, loading, error } = useEvidenceJson(validId ? `/data/evidence/trials/${nctId}.json` : null);
  useEffect(() => {
    const dialog = ref.current;
    if (nctId && dialog && !dialog.open) dialog.showModal();
    if (!nctId && dialog?.open) dialog.close();
  }, [nctId]);
  return <dialog ref={ref} className="ev-drawer" onCancel={onClose} onClose={onClose} aria-labelledby="ev-trial-title">
    <div className="ev-drawer-top"><span className="ev-eyebrow">ClinicalTrials.gov · primary registry</span><button className="ev-icon-button" onClick={onClose} aria-label="Close trial details">×</button></div>
    <h2 id="ev-trial-title">{nctId}</h2>
    {loading && <p role="status" className="ev-loading">Loading the trial snapshot…</p>}
    {(error || !validId) && <p role="alert" className="ev-notice">{error || 'A valid trial identifier is required.'} <a href={`https://clinicaltrials.gov/study/${encodeURIComponent(nctId || '')}`} target="_blank" rel="noopener noreferrer">Open the primary registry ↗</a></p>}
    {data && <><h3 className="ev-trial-heading">{data.title}</h3><div className="ev-inline-tags"><StatusBadge>{humanize(data.status)}</StatusBadge><StatusBadge status={data.hasResults ? 'indirect' : 'unknown'}>{data.hasResults ? 'Results posted' : 'No posted results'}</StatusBadge><span>Updated {sourceDate(data.lastUpdate)}</span></div>
      <p className="ev-note">Recruitment status and posted results do not by themselves establish benefit. Values below are reproduced from the registry; consult the prespecified analysis and publication.</p>
      {data.whyStopped && <p className="ev-notice"><strong>Reason stopped:</strong> {data.whyStopped}</p>}
      <div className="ev-detail-grid"><div><span className="ev-field-label">Design</span>{humanize(data.design?.designInfo?.allocation)} · {humanize(data.design?.designInfo?.maskingInfo?.masking)}</div><div><span className="ev-field-label">Enrolment</span>{data.design?.enrollmentInfo?.count ?? 'Not supplied'} · {humanize(data.design?.enrollmentInfo?.type)}</div></div>
      <details className="ev-outcome"><summary>Interventions, arms & disease context</summary><div className="ev-outcome-body"><p><strong>Registered conditions:</strong> {data.conditions?.join(' · ') || 'Not supplied'}</p>{(data.interventions || []).map((intervention, i) => <article key={i}><h4>{intervention.name} <span className="ev-muted">· {humanize(intervention.type)}</span></h4><p>{intervention.description}</p><p className="ev-note">Arms: {intervention.armGroupLabels?.join(' · ') || 'Not supplied'}</p></article>)}</div></details>
      <div className="ev-action-row"><a className="ev-button" href={`https://clinicaltrials.gov/study/${nctId}`} target="_blank" rel="noopener noreferrer">Registry & protocol ↗</a><button className="ev-button ev-button--quiet" onClick={() => downloadJson(data, `${nctId}-snapshot.json`)}>Download snapshot ↓</button></div>
      <h3>Reported outcomes <span className="ev-count">{data.reportedOutcomes?.length || 0}</span></h3>
      <p className="ev-note">Compare the prespecified primary endpoint with secondary and exploratory measures. Analysis populations, multiplicity, missing data and follow-up duration can change the inference. A small p value is not a measure of clinical importance.</p>
      {(data.reportedOutcomes || []).map((outcome, i) => <OutcomeTable key={i} outcome={outcome} />)}
      {!data.reportedOutcomes?.length && <p className="ev-notice">No numerical result table was returned. This remains unknown, not a negative outcome.</p>}
      <details className="ev-outcome"><summary>Registered endpoints and time points</summary><div className="ev-outcome-body">{Object.entries(data.registeredOutcomes || {}).map(([kind, outcomes]) => <section key={kind}><h4>{kind.replace('Outcomes', ' outcomes')}</h4>{outcomes.map((outcome, i) => <p key={i}><strong>{outcome.measure}</strong><br /><span className="ev-muted">{outcome.timeFrame}</span></p>)}</section>)}</div></details>
      <details className="ev-outcome"><summary>Source provenance</summary><pre className="ev-json">{JSON.stringify(data.provenance, null, 2)}</pre></details>
    </>}
  </dialog>;
}
