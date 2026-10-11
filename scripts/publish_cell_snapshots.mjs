import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { cellSnapshotFilename } from '../frontend/src/lib/snapshotPortal.js';

/** Preserve exact source values and both estimate signs; only q bounds scope. */
export function appendSignificantCellRows(groups, snapshot) {
  for (const row of snapshot.rows || []) {
    if (typeof row.q !== 'number' || !Number.isFinite(row.q) || row.q < 0 || row.q >= 0.05) continue;
    const key = `${row.atlas}\u0000${row.cell}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ ...row, hpo_id: snapshot.hpo_id });
  }
}

/** A reproducible reverse view of the existing signed per-HPO corpus. */
export function publishCellSnapshots(destination) {
  const atlasIndex = JSON.parse(readFileSync(new URL('atlasIndex.json', destination), 'utf8'));
  const cellIndex = JSON.parse(readFileSync(new URL('cellIndex.json', destination), 'utf8'));
  const groups = new Map();
  const associationDir = new URL('associations/', destination);
  for (const name of readdirSync(associationDir).filter(name => name.endsWith('.json')).sort()) {
    appendSignificantCellRows(groups, JSON.parse(readFileSync(new URL(name, associationDir), 'utf8')));
  }
  // This directory contains derived, ignored outputs only. Replace it so old
  // filename schemes or former source cell labels cannot survive publication.
  rmSync(new URL('cells/', destination), { recursive: true, force: true });
  let count = 0;
  for (const [atlas, cells] of Object.entries(cellIndex.cells)) {
    const dir = new URL(`cells/${encodeURIComponent(atlas)}/`, destination);
    mkdirSync(dir, { recursive: true });
    for (const cell of Object.keys(cells).sort()) {
      const rows = (groups.get(`${atlas}\u0000${cell}`) || []).sort((a, b) => a.hpo_id.localeCompare(b.hpo_id));
      const snapshot = {
        metadata: {
          generatedAt: atlasIndex._metadata.generatedAt,
          derivedFrom: 'Published signed per-HPO atlas snapshots; no independent analysis or renormalization.',
          coverage: 'all_published_significant_rows', qThreshold: 0.05,
          cellFilenameEncoding: 'utf8-lowercase-hex',
          sources: atlasIndex._metadata.sources.filter(source => source.atlas === atlas && source.kind === 'phenotype_cell_associations'),
          interpretation: 'Both positive and negative estimates retained. q=0 preserves source underflow; no causal, clinical or variant interpretation is added. Wider q thresholds require the full atlas API.',
        }, atlas, cell, rows,
      };
      writeFileSync(new URL(cellSnapshotFilename(cell), dir), JSON.stringify(snapshot) + '\n');
      count += rows.length;
    }
  }
  return count;
}
