import geneIdentifiers from '../data/evidence/geneIdentifiers.json';
import { buildExplorerHref, evidenceDestination, resolveGeneSelection } from './evidenceNavigation.js';

export function legacyExplorerHref(kind, selection, context = {}) {
  const current = evidenceDestination(window.location.pathname, window.location.search, { geneIdentifiers });
  const params = new URLSearchParams(current.split('?')[1] || '');
  Object.entries(context).forEach(([key, value]) => {
    if (value != null && value !== '') params.set(key, key === 'gene' ? resolveGeneSelection(value, geneIdentifiers) || value : value);
  });
  return buildExplorerHref(kind, selection, params, { geneIdentifiers });
}
