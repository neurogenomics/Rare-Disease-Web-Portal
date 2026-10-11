/* eslint-disable react/prop-types */
import { Link, useLocation } from 'react-router-dom';
import { biologicalContext, buildEvidenceHref, buildExplorerHref } from '../../lib/evidenceNavigation';
import geneIdentifiers from '../../data/evidence/geneIdentifiers.json';

export function StatusBadge({ status = 'unknown', children }) {
  const tone = ({ supports: 'positive', supported: 'positive', benefit: 'positive', positive: 'positive', harm: 'negative', null: 'negative', negative: 'negative', contradicts: 'negative', contradicted: 'negative', mixed: 'mixed', limits: 'mixed', indirect: 'indirect', proxy: 'indirect', surrogate: 'indirect', direct: 'positive', unresolved: 'unknown', needs_review: 'unknown', unreviewed: 'unknown', unknown: 'unknown', insufficient_evidence: 'unknown', incompatible: 'negative', requirements_supported: 'positive', compatible: 'positive', conditional: 'mixed', pass: 'positive', fail: 'negative' })[status] || 'unknown';
  return <span className={`ev-badge ev-badge--${tone}`}><span aria-hidden="true" className="ev-status-dot" />{children || status.replaceAll('_', ' ')}</span>;
}
export function SourceLinks({ ids = [], sources = {} }) {
  return <span className="ev-source-links">{[...new Set(ids)].map((id) => sources[id] ? <a key={id} href={sources[id].url} target="_blank" rel="noopener noreferrer" title={sources[id].title}>{sources[id].title} <span aria-hidden="true">↗</span></a> : <span key={id}>Source unavailable: {id}</span>)}</span>;
}
export function EmptyState({ title = 'No matching records', children, onReset }) {
  return <div className="ev-empty"><span className="ev-empty-symbol" aria-hidden="true">⌁</span><h3>{title}</h3><p>{children || 'Try another search or clear the active filters.'}</p>{onReset && <button className="ev-button" onClick={onReset}>Clear filters</button>}</div>;
}
export function EntityLink({ children, className = 'ev-entity-link', ...updates }) {
  const location = useLocation();
  return <Link className={className} to={buildEvidenceHref(updates, location.search)}>{children}</Link>;
}
export function ExplorerLink({ children, kind, selection, className = 'ev-entity-link', ...context }) {
  const location = useLocation();
  const params = biologicalContext(location.search);
  Object.entries(context).forEach(([key, value]) => { if (value == null || value === '') params.delete(key); else params.set(key, value); });
  const destination = buildExplorerHref(kind, selection, params, { geneIdentifiers });
  return destination ? <Link className={className} to={destination}>{children}</Link> : null;
}
export function SectionLabel({ number, children }) {
  return <div className="ev-section-label">{number && <span>{number}</span>}{children}</div>;
}
