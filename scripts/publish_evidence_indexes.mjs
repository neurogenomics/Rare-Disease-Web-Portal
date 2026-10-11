// Large indexes are fetched as data, so they do not inflate the executable bundle.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { restoreSnapshots } from './restore_evidence_snapshots.mjs';
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
writeFileSync(new URL('geneIdentifiers.json', source), JSON.stringify(identifiers) + '\n');
console.log('Published eight evidence datasets and gene identifier bridge.');
