import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { restoreSnapshots } from '../restore_evidence_snapshots.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const sha = value => createHash('sha256').update(value).digest('hex');
const dirUrl = path => pathToFileURL(path + '/');
const record = (path, content = '{"finite":1e-120,"zero":0,"label":"β"}\n') => ({ path, content, sha256: sha(content) });

async function fixture(t, records = [record('associations/HP:0001250.json')], alterArchive = value => value) {
  const directory = await mkdtemp(join(tmpdir(), 'evidence-bundles-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const bundle = join(directory, 'bundle');
  const publicDir = join(directory, 'public');
  await Promise.all([mkdir(bundle), mkdir(publicDir)]);
  const compressed = gzipSync(records.map(value => JSON.stringify(value)).join('\n') + '\n');
  await writeFile(join(bundle, 'associations.ndjson.gz'), compressed);
  const archive = alterArchive({ group: 'associations', file: 'associations.ndjson.gz', count: records.length,
    bytes: compressed.length, sha256: sha(compressed), uncompressedBytes: records.reduce((n, value) => n + Buffer.byteLength(value.content), 0),
    snapshots: records.map(value => ({ path: value.path, sha256: value.sha256, bytes: Buffer.byteLength(value.content) })) });
  const manifest = { schemaVersion: 1, format: 'gzip_ndjson_path_sha256_content', archives: [archive] };
  await writeFile(join(bundle, 'manifest.json'), JSON.stringify(manifest));
  return { directory, bundle, publicDir, compressed, manifest,
    restore: () => restoreSnapshots(dirUrl(bundle), dirUrl(publicDir)) };
}

async function unstamped(publicDir) {
  await assert.rejects(access(join(publicDir, '.snapshot-manifest-sha256')), { code: 'ENOENT' });
}

test('Python publisher and Node restore preserve exact bytes and deterministic archive identities', async t => {
  const f = await fixture(t);
  const source = join(f.directory, 'source');
  const contents = new Map([
    ['associations/HP:0001250.json', Buffer.from('{\r\n  "q": 1.23456789e-120, "estimate": -0.5, "label": "β 🧬"\r\n}\r\n')],
    ['associations/HP:0002015.json', Buffer.from('{ "q": 0, "p": null, "rows": [] }')],
    ['variants/SCN1A.json', Buffer.from('{"metadata":{"complete":true},"variants":[]}\n')],
    ['trials/NCT00000001.json', Buffer.from('{"hasResults":false,"reportedOutcomes":[]}\n')],
  ]);
  for (const [path, bytes] of contents) {
    await mkdir(dirname(join(source, path)), { recursive: true });
    await writeFile(join(source, path), bytes);
  }
  const producer = `import json,sys\nfrom pathlib import Path\nsys.path.insert(0,sys.argv[1])\nfrom pack_evidence_snapshots import pack_group\nsrc,dst=map(Path,sys.argv[2:4])\narchives=[pack_group(src,dst/(g+'.ndjson.gz'),g) for g in ('associations','variants','trials')]\n(dst/'manifest.json').write_text(json.dumps({'schemaVersion':1,'format':'gzip_ndjson_path_sha256_content','archives':archives}))\n`;
  const pack = () => execFileSync('python3', ['-c', producer, join(root, 'scripts'), source, f.bundle]);
  pack();
  const firstManifest = await readFile(join(f.bundle, 'manifest.json'));
  pack();
  assert.deepEqual(await readFile(join(f.bundle, 'manifest.json')), firstManifest);
  await f.restore();
  for (const [path, bytes] of contents) assert.deepEqual(await readFile(join(f.publicDir, path)), bytes, path);
  const parsed = JSON.parse(await readFile(join(f.publicDir, 'associations/HP:0001250.json'), 'utf8'));
  assert.equal(parsed.q, 1.23456789e-120);
  assert.equal(parsed.estimate, -0.5);
});

test('restore repairs missing and modified snapshots even when the manifest is unchanged', async t => {
  const records = [record('associations/HP:0001250.json'), record('associations/HP:0002015.json', '{"q":0}\n')];
  const f = await fixture(t, records);
  await f.restore();
  await rm(join(f.publicDir, records[0].path));
  await writeFile(join(f.publicDir, records[1].path), '{"q":0.99}\n');
  await f.restore();
  for (const value of records) assert.equal(await readFile(join(f.publicDir, value.path), 'utf8'), value.content);
});

test('compressed archive checksum mismatch fails without a successful restore stamp', async t => {
  const f = await fixture(t);
  await writeFile(join(f.bundle, 'associations.ndjson.gz'), Buffer.concat([f.compressed, Buffer.from('tampered')]));
  await assert.rejects(f.restore(), /checksum/i);
  await unstamped(f.publicDir);
});

test('inner snapshot checksum mismatch fails despite a valid outer archive checksum', async t => {
  const f = await fixture(t, [{ ...record('associations/HP:0001250.json'), sha256: '0'.repeat(64) }]);
  await assert.rejects(f.restore(), /snapshot|checksum/i);
  await unstamped(f.publicDir);
});

for (const path of ['../escaped.json', 'associations/../escaped.json', 'variants/SCN1A.json', 'associations/sub/file.json', 'associations/file.txt']) {
  test(`unsafe or wrong-group record path rejected: ${path}`, async t => {
    const f = await fixture(t, [record(path)]);
    await assert.rejects(f.restore(), /path/i);
    await unstamped(f.publicDir);
    await assert.rejects(access(join(f.directory, 'escaped.json')), { code: 'ENOENT' });
  });
}

test('duplicate snapshot paths cannot silently replace earlier evidence', async t => {
  const f = await fixture(t, [record('associations/HP:0001250.json'), record('associations/HP:0001250.json', '{"q":0.8}')],
    archive => ({ ...archive, count: 1, snapshots: archive.snapshots.slice(0, 1) }));
  await assert.rejects(f.restore(), /duplicate|path/i);
  await unstamped(f.publicDir);
});

test('manifest archive paths cannot escape the bundle directory', async t => {
  const f = await fixture(t, undefined, archive => ({ ...archive, file: '../associations.ndjson.gz' }));
  await assert.rejects(f.restore(), /path/i);
  await unstamped(f.publicDir);
});

test('manifest count is checked against records actually restored', async t => {
  const f = await fixture(t, undefined, archive => ({ ...archive, count: 2 }));
  await assert.rejects(f.restore(), /count/i);
  await unstamped(f.publicDir);
});

test('invalid JSON content cannot be published as a successfully restored snapshot', async t => {
  const f = await fixture(t, [record('associations/HP:0001250.json', '{"q":')]);
  await assert.rejects(f.restore(), SyntaxError);
  await unstamped(f.publicDir);
});

test('corrupt gzip with a matching outer checksum fails the restore process', async t => {
  const f = await fixture(t);
  const corrupt = Buffer.from('this is not a gzip stream');
  await writeFile(join(f.bundle, 'associations.ndjson.gz'), corrupt);
  f.manifest.archives[0].sha256 = sha(corrupt);
  await writeFile(join(f.bundle, 'manifest.json'), JSON.stringify(f.manifest));
  const consumer = `import {restoreSnapshots} from ${JSON.stringify(pathToFileURL(join(root, 'scripts/restore_evidence_snapshots.mjs')).href)};\nawait restoreSnapshots(new URL(process.argv[1]),new URL(process.argv[2]));`;
  assert.throws(() => execFileSync(process.execPath, ['--input-type=module', '-e', consumer, dirUrl(f.bundle).href, dirUrl(f.publicDir).href], { stdio: 'pipe' }), error => error.status !== 0);
  await unstamped(f.publicDir);
});
