/** Read-only compatibility views over the published evidence snapshots.
 * Missing source coverage throws; it never becomes a biological negative.
 */
export const SNAPSHOT_SCOPE = {
  genePanel: 92,
  maxCellQ: 0.05,
  label: 'Published evidence snapshots',
  interpretation: 'Gene–phenotype links are disease-context associations in the 92-gene evidence panel. Cell rows are signed atlas associations, not proof of causality; gene expression does not establish variant effect or treatment response.',
};

export function normalizeAtlas(value) {
  return ({ DH: 'DescartesHuman', HCL: 'HumanCellLandscape' })[value] || value || 'DescartesHuman';
}

export class SnapshotUnavailable extends Error {
  constructor(message) { super(message); this.name = 'SnapshotUnavailable'; this.evidence_status = 'source_unavailable'; }
}

export function cellSnapshotPath(atlas, cell) {
  return `/data/evidence/cells/${encodeURIComponent(normalizeAtlas(atlas))}/${cellSnapshotFilename(cell)}`;
}

export function cellSnapshotFilename(cell) {
  // Exact labels can differ only in case. Literal/percent-encoded filenames
  // collide on macOS, so use a reversible, case-insensitive-filesystem-safe
  // encoding of the original UTF-8 bytes, without normalizing the cell label.
  const hex = Array.from(new TextEncoder().encode(cell), byte => byte.toString(16).padStart(2, '0')).join('');
  return `cell-${hex}.json`;
}

export function atlasTermAvailability(entry, atlas) {
  const source = entry?.atlases?.[normalizeAtlas(atlas)];
  if (!source) return null;
  if ((source.positiveSignificant || 0) + (source.negativeSignificant || 0) + (source.zeroDirectionSignificant || 0) + (source.unknownDirectionSignificant || 0) > 0) return true;
  return entry.coverage === 'all_tested_rows' && source.testedRows > 0 ? false : null;
}

export function legacyCellRow(row, hpoId, terms = {}, severity = {}) {
  return {
    ...row,
    id: row.sourceRecordId || `${row.atlas}:${hpoId}:${row.cell}`,
    hpo_id: hpoId,
    hpo_name: terms[hpoId]?.label || hpoId,
    celltype_name: row.cell,
    celltype_database: row.atlas,
    // A compatibility field name; the displayed value remains the frozen,
    // unvalidated legacy score, not a fresh clinical severity assessment.
    severity_score_gpt: severity[hpoId]?.severity_score ?? null,
    severity_class: severity[hpoId]?.severity_class ?? 'unknown',
  };
}

function knownAtlas(atlas, cells) {
  if (!Object.hasOwn(cells, atlas)) throw new SnapshotUnavailable(`Atlas ${atlas} is not in the published snapshots.`);
}

export function createSnapshotPortal(loadJson) {
  const cache = new Map();
  function load(path) {
    if (!cache.has(path)) {
      const request = Promise.resolve().then(() => loadJson(path)).catch(error => { cache.delete(path); throw error; });
      cache.set(path, request);
    }
    return cache.get(path);
  }
  const index = name => load(`/data/evidence/${name}.json`);
  async function context() {
    const [hpo, geneHpo, identifiers] = await Promise.all([index('hpoTerms'), index('genePhenotypes'), index('geneIdentifiers')]);
    const ids = { ...identifiers };
    for (const [symbol, rows] of Object.entries(geneHpo.genes)) {
      for (const row of rows) if (row.ncbi_gene_id) ids[row.ncbi_gene_id] = symbol;
    }
    return { terms: hpo.terms, hpo, geneHpo, ids };
  }
  function term(id, terms) {
    const source = terms[id];
    if (!source || source.obsolete) throw new SnapshotUnavailable(`HPO term ${id} is not an active term in this frozen source.`);
    return { id, name: source.label, synonyms: source.synonyms || [], definition: source.definition || '', comment: '', xrefs: [], parents: source.parents || [], isPhenotypicAbnormality: source.isPhenotypicAbnormality };
  }
  async function annotation(selection) {
    const { terms, geneHpo, ids } = await context();
    const ncbi = selection.replace(/^NCBIGene:/, '');
    const symbol = ids[ncbi] || Object.keys(geneHpo.genes).find(gene => gene.toLowerCase() === selection.toLowerCase());
    if (selection.startsWith('HP:')) term(selection, terms);
    if (!selection.startsWith('HP:') && !symbol) throw new SnapshotUnavailable(`Gene ${selection} is outside the 92-gene snapshot panel.`);
    const rows = symbol ? (geneHpo.genes[symbol] || []) : Object.entries(geneHpo.genes).flatMap(([gene, entries]) => entries.filter(row => row.hpo_id === selection).map(row => ({ ...row, gene_symbol: gene })));
    const phenotypeIds = [...new Set(rows.filter(row => row.isPhenotypicAbnormality === true).map(row => row.hpo_id))];
    const genes = [...new Map(rows.map(row => [row.ncbi_gene_id, { id: `NCBIGene:${row.ncbi_gene_id}`, name: symbol || row.gene_symbol }])).values()];
    const diseases = [...new Set(rows.map(row => row.disease_id))].map(id => ({ id, name: id, label_status: 'source_unavailable' }));
    return {
      genes, diseases,
      phenotypes: phenotypeIds.map(id => ({ id, name: terms[id]?.label || rows.find(row => row.hpo_id === id)?.hpo_name || id })),
      evidence_status: 'available', metadata: geneHpo.metadata,
      scope: SNAPSHOT_SCOPE.interpretation,
    };
  }
  async function severityMap() {
    return Object.fromEntries((await index('hpoSeverity')).map(row => [row.hpo_id, row]));
  }
  async function cellRows(atlas, cell, q) {
    if (!Number.isFinite(q) || q < 0 || q > SNAPSHOT_SCOPE.maxCellQ) throw new SnapshotUnavailable('Published reverse cell snapshots cover q < 0.05. Use a threshold at or below 0.05; wider filters need the full atlas API.');
    const cellIndex = await index('cellIndex');
    knownAtlas(atlas, cellIndex.cells);
    if (cell === 'All') throw new SnapshotUnavailable('Choose an exact cell type to browse the published reverse atlas snapshots.');
    if (!Object.hasOwn(cellIndex.cells[atlas], cell)) throw new SnapshotUnavailable(`Cell ${cell} is not recorded in atlas ${atlas}; cells are never matched by label similarity.`);
    const [snapshot, { terms }, severity] = await Promise.all([load(cellSnapshotPath(atlas, cell)), context(), severityMap()]);
    return snapshot.rows.filter(row => typeof row.q === 'number' && Number.isFinite(row.q) && row.q < q)
      .map(row => ({ ...legacyCellRow(row, row.hpo_id, terms, severity), snapshot_coverage: snapshot.metadata?.coverage || 'all_published_significant_rows' })).sort((a, b) => a.q - b.q || a.hpo_id.localeCompare(b.hpo_id));
  }
  async function expression(selection, atlas, byCell = false) {
    const [{ genes }, cells, { ids }] = await Promise.all([index('geneExpression'), index('cellIndex'), context()]);
    knownAtlas(atlas, cells.cells);
    if (byCell) {
      if (!Object.hasOwn(cells.cells[atlas], selection)) throw new SnapshotUnavailable(`Cell ${selection} is not recorded in atlas ${atlas}.`);
      return Object.entries(genes).flatMap(([gene, atlases]) => (atlases[atlas] || []).filter(row => row.cell === selection).map(row => ({ gene, celltype: row.cell, expression_specificity: row.specificity })));
    }
    const symbol = ids[selection.replace(/^NCBIGene:/, '')] || Object.keys(genes).find(gene => gene.toLowerCase() === selection.toLowerCase());
    if (!symbol) throw new SnapshotUnavailable(`Gene ${selection} is outside the expression snapshot panel.`);
    if (!Object.hasOwn(genes[symbol], atlas)) throw new SnapshotUnavailable(`Expression source for ${symbol} in atlas ${atlas} is unavailable.`);
    return genes[symbol][atlas].map(row => ({ gene: symbol, celltype: row.cell, expression_specificity: row.specificity }));
  }
  return {
    async request(input) {
      const url = new URL(input, 'http://snapshot.local');
      const path = decodeURIComponent(url.pathname), params = url.searchParams;
      const atlas = normalizeAtlas(params.get('db_type'));
      let match;
      if ((match = path.match(/^\/api\/hp\/terms\/(HP:\d{7})(\/children)?$/))) {
        const { terms } = await context();
        term(match[1], terms);
        return match[2] ? Object.entries(terms).filter(([, row]) => !row.obsolete && row.parents?.includes(match[1])).map(([id]) => term(id, terms)) : term(match[1], terms);
      }
      if (path === '/api/hp/search') {
        const { terms } = await context(), query = (params.get('q') || '').trim().toLowerCase();
        const results = Object.entries(terms).filter(([id, row]) => !row.obsolete && (id.toLowerCase() === query || row.label.toLowerCase().includes(query) || (row.synonyms || []).some(name => name.toLowerCase().includes(query))))
          .sort(([a], [b]) => (a.toLowerCase() === query ? -1 : b.toLowerCase() === query ? 1 : a.localeCompare(b)));
        const found = results.slice(0, Math.min(100, Math.max(1, Number(params.get('limit')) || 50))).map(([id]) => term(id, terms));
        return { terms: found, results: found };
      }
      if ((match = path.match(/^\/api\/network\/annotation\/(.+)$/))) return annotation(match[1]);
      if (path === '/api/network/search/gene') {
        const { ids } = await context(), query = (params.get('q') || '').trim().toLowerCase();
        const results = Object.entries(ids).filter(([id, symbol]) => !query || query === 'ncbi' || symbol.toLowerCase().includes(query) || id === query || `ncbigene:${id}` === query).map(([id, name]) => ({ id: `NCBIGene:${id}`, name }));
        return { results: results.sort((a, b) => a.name.localeCompare(b.name)) };
      }
      if (path.endsWith('/esummary.fcgi') && params.get('db') === 'gene') {
        const { ids } = await context(), id = params.get('id');
        if (!ids[id]) throw new SnapshotUnavailable(`NCBI gene ${id} is outside the snapshot identity bridge.`);
        return { result: { uids: [id], [id]: { uid: id, name: ids[id] } }, evidence_status: 'identity_only' };
      }
      if (path === '/api/cell/type') {
        const { cells } = await index('cellIndex'); knownAtlas(atlas, cells);
        const query = (params.get('celltype_name') || '').toLowerCase();
        return Object.keys(cells[atlas]).filter(cell => cell.toLowerCase().includes(query)).sort();
      }
      if (path === '/api/cellByHpoid1' || path === '/api/cellByHpoid') {
        const hpoId = params.get('hpo_id'), atlasIndex = await index('atlasIndex'), entry = atlasIndex.phenotypes[hpoId];
        if (!entry) { if (params.get('dry_run') === 'true') return null; throw new SnapshotUnavailable(`HPO term ${hpoId} has no published atlas snapshot.`); }
        if (params.get('dry_run') === 'true') return atlasTermAvailability(entry, atlas);
        if (path === '/api/cellByHpoid1' && !entry.atlases[atlas]) throw new SnapshotUnavailable(`Atlas ${atlas} was not recorded for HPO term ${hpoId}.`);
        if (!entry.file) throw new SnapshotUnavailable(`HPO term ${hpoId} has no retained atlas rows to inspect.`);
        const [source, { terms }, severity] = await Promise.all([load(entry.file), context(), severityMap()]);
        return source.rows.filter(row => path === '/api/cellByHpoid' || row.atlas === atlas).map(row => ({ ...legacyCellRow(row, hpoId, terms, severity), snapshot_coverage: source._metadata.coverage }));
      }
      if (path === '/api/cell') return cellRows(atlas, params.get('celltype_name'), Number(params.get('q')));
      if ((match = path.match(/^\/gene(1?)\/(.+)\/(DescartesHuman|HumanCellLandscape|DH|HCL)$/))) return expression(match[2], normalizeAtlas(match[3]), match[1] === '1');
      if ((match = path.match(/^\/api\/hpo-definitionNew\/(HP:\d{7})$/))) {
        const record = (await severityMap())[match[1]];
        if (!record) throw new SnapshotUnavailable(`Legacy severity record for ${match[1]} is unavailable.`);
        return [{ ...record, severity_score_gpt: record.severity_score }];
      }
      if (path === '/api/hpj' || path === '/api/hpjFiltered') {
        const { terms } = await context();
        const allowed = path.endsWith('Filtered') ? new Set((await cellRows(atlas, params.get('celltype_name'), Number(params.get('q')))).map(row => row.hpo_id)) : null;
        return Object.entries(terms).filter(([id, row]) => !row.obsolete && (!allowed || allowed.has(id))).flatMap(([id, row]) => (row.parents || []).filter(parent => !allowed || allowed.has(parent)).map(parent => ({ source: parent, target: id, relationship: 'is_a' })));
      }
      return undefined; // Unsupported annotation endpoints must still use the API.
    },
  };
}
