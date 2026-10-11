// Large indexes are fetched as data, so they do not inflate the executable bundle.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { restoreSnapshots } from './restore_evidence_snapshots.mjs';
import { publishCellSnapshots } from './publish_cell_snapshots.mjs';
const root = new URL('../', import.meta.url);
const source = new URL('frontend/src/data/evidence/', root);
const destination = new URL('frontend/public/data/evidence/', root);
mkdirSync(destination, { recursive: true });
const bundleDir = new URL('data/evidence/published/', root);
if (existsSync(new URL('manifest.json', bundleDir))) await restoreSnapshots(bundleDir, destination);
for (const name of ['atlasIndex','genePhenotypes','hpoTerms','geneExpression','dosageEvidence','trialIndex','cellIndex']) {
  copyFileSync(new URL(name + '.json', source), new URL(name + '.json', destination));
}
copyFileSync(new URL('frontend/src/data/hpoSeverity.json', root), new URL('hpoSeverity.json', destination));
const associations = JSON.parse(readFileSync(new URL('genePhenotypes.json', source), 'utf8'));
const identifiers = {};
for (const [symbol, rows] of Object.entries(associations.genes)) {
  for (const row of rows) {
    if (identifiers[row.ncbi_gene_id] && identifiers[row.ncbi_gene_id] !== symbol) throw new Error('Ambiguous gene identifier');
    identifiers[row.ncbi_gene_id] = symbol;
  }
}
// Some therapeutic targets have expression/ClinVar coverage but no HPO export
// rows. Resolve only exact, unambiguous ClinVar gene symbol/id records; never
// infer IDs from names or genomic overlap.
for (const symbol of Object.keys(associations.genes)) {
  if (Object.values(identifiers).includes(symbol)) continue;
  const snapshot = JSON.parse(readFileSync(new URL(`variants/${symbol}.json`, destination), 'utf8'));
  const ids = new Set(snapshot.variants.flatMap(variant => (variant.genes || []).filter(gene => gene.symbol === symbol && /^\d+$/.test(gene.geneid || '')).map(gene => gene.geneid)));
  if (ids.size !== 1) throw new Error(`Missing or ambiguous ClinVar identity bridge for ${symbol}`);
  const [id] = ids;
  if (identifiers[id] && identifiers[id] !== symbol) throw new Error('Ambiguous gene identifier');
  identifiers[id] = symbol;
}
writeFileSync(new URL('geneIdentifiers.json', source), JSON.stringify(identifiers) + '\n');
copyFileSync(new URL('geneIdentifiers.json', source), new URL('geneIdentifiers.json', destination));
const reverseRows = publishCellSnapshots(destination);
console.log(`Published nine evidence datasets, a ${Object.keys(identifiers).length}-gene identifier bridge and ${reverseRows.toLocaleString()} signed reverse cell rows (q < 0.05).`);
