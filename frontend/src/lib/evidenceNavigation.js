/** Route context is a navigation aid, never an assertion of a biological link. */
const biologicalKeys = ['gene', 'hpo', 'disease', 'atlas', 'cell'];
const viewKeys = ['search', 'therapy', 'candidate', 'variant', 'scenario', 'evidence', 'vclass', 'consequence', 'location', 'stars', 'readiness', 'mechanism', 'severity'];
const atlasAliases = { DH: 'DescartesHuman', HCL: 'HumanCellLandscape' };
const valueOf = value => value == null ? '' : String(value);
const atlasValue = value => atlasAliases[value] || value || '';
const setValue = (params, key, value) => value == null || value === '' ? params.delete(key) : params.set(key, value);
const alleleTabs = new Set(['variants', 'modalities']);
const carriesAllele = (from, to) => alleleTabs.has(from) && alleleTabs.has(to);
const evidenceEntryTabs = { '/evidence': 'therapies', '/gene-therapy': 'modalities', '/variants': 'variants', '/approved-therapies': 'therapies' };

export function evidenceSourceTab(pathname, search = '') {
  const source = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const tab = source.get('tab');
  return ['therapies', 'variants', 'modalities', 'methods'].includes(tab) ? tab : evidenceEntryTabs[pathname] || null;
}

export function biologicalContext(search = '') {
  const source = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const context = new URLSearchParams();
  biologicalKeys.forEach(key => { if (source.get(key)) context.set(key, source.get(key)); });
  const atlas = atlasValue(source.get('atlas') || source.get('db_type'));
  if (atlas) context.set('atlas', atlas);
  return context;
}

export function updateEvidenceParams(previous, updates, { currentTab } = {}) {
  const next = new URLSearchParams(previous);
  const fromTab = currentTab || next.get('tab') || 'therapies';
  if (updates.tab && updates.tab !== fromTab) viewKeys.forEach(key => {
    if (!['variant', 'scenario'].includes(key) || !carriesAllele(fromTab, updates.tab)) next.delete(key);
  });
  const changed = key => Object.hasOwn(updates, key) && valueOf(updates[key]) !== (next.get(key) || '');
  if (changed('gene')) ['therapy', 'candidate', 'variant', 'scenario', 'vclass', 'consequence', 'location', 'stars'].forEach(key => next.delete(key));
  if (changed('variant')) next.delete('scenario');
  if (['hpo', 'disease', 'cell', 'atlas'].some(changed)) ['therapy', 'candidate'].forEach(key => next.delete(key));
  Object.entries(updates).forEach(([key, value]) => setValue(next, key, key === 'atlas' && value ? atlasValue(value) : value));
  return next;
}

export function buildEvidenceHref(updates = {}, currentSearch = '', { pathname, currentTab } = {}) {
  // An explicitly selected allele carries between variant inspection and modality
  // assessment only. Other routes do not imply an allele-specific evidence join.
  const source = currentSearch instanceof URLSearchParams ? currentSearch : new URLSearchParams(currentSearch);
  const fromTab = currentTab || evidenceSourceTab(pathname, source);
  const context = biologicalContext(currentSearch);
  if (carriesAllele(fromTab, updates.tab) && source.get('variant')) {
    context.set('variant', source.get('variant'));
    if (source.get('scenario')) context.set('scenario', source.get('scenario'));
  }
  const next = updateEvidenceParams(context, updates, { currentTab: fromTab });
  return `/evidence${next.size ? `?${next}` : ''}`;
}

export function resolveGeneSelection(selection, geneIdentifiers = {}) {
  const value = String(selection || '').replace(/^NCBIGene:/i, '');
  return geneIdentifiers[value] || Object.values(geneIdentifiers).find(gene => gene.toLowerCase() === value.toLowerCase()) || (/^\d+$/.test(value) ? null : value || null);
}

export function conditionDiseaseIds(condition = {}) {
  return [...new Set((condition.trait_xrefs || []).flatMap(xref => {
    const prefix = { OMIM: 'OMIM', MONDO: 'MONDO', ORPHANET: 'ORPHA', ORPHA: 'ORPHA' }[String(xref.db_source || '').toUpperCase()];
    if (!prefix) return [];
    const id = String(xref.db_id || '').replace(new RegExp(`^${prefix}:`, 'i'), '');
    return /^\d+$/.test(id) ? [`${prefix}:${id}`] : [];
  }))];
}

export function buildExplorerHref(kind, selection, currentSearch = '', { geneIdentifiers = {} } = {}) {
  const params = biologicalContext(currentSearch);
  const value = String(selection || '');
  if (!value) return null;
  if (kind === 'gene') {
    const id = value.replace(/^NCBIGene:/i, '');
    const geneId = /^\d+$/.test(id) ? id : Object.entries(geneIdentifiers).find(([, gene]) => gene.toLowerCase() === id.toLowerCase())?.[0];
    if (!geneId) return null;
    setValue(params, 'gene', resolveGeneSelection(geneId, geneIdentifiers));
    params.set('jump', geneId);
  } else if (kind === 'phenotype') {
    if (!/^HP:\d{7}$/.test(value)) return null;
    params.set('hpo', value);
    params.set('jump', value);
  } else if (kind === 'celltype') {
    // A cell must retain the source atlas. No aliases, broad lineage matches or default atlas are invented.
    if (!params.get('atlas')) return null;
    params.set('cell', value);
    params.set('jump', value);
  } else return null;
  if (params.get('atlas')) params.set('db_type', params.get('atlas'));
  return `/${kind}?${params}`;
}

export function evidenceDestination(pathname, search = '', { geneIdentifiers = {} } = {}) {
  const source = new URLSearchParams(search);
  const params = biologicalContext(source);
  const selection = source.get('jump');
  if (pathname === '/gene' && selection) setValue(params, 'gene', resolveGeneSelection(selection, geneIdentifiers));
  if (pathname === '/phenotype' && /^HP:\d{7}$/.test(selection || '')) params.set('hpo', selection);
  if (pathname === '/celltype' && selection) params.set('cell', selection);
  return buildEvidenceHref({}, params);
}
