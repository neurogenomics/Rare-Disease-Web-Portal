// Lossless restore of public evidence files. No Python dependency at build time.
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';

const digest = content => createHash('sha256').update(content).digest('hex');
export async function restoreSnapshots(bundleDir, publicDir) {
  const manifestText = await readFile(new URL('manifest.json', bundleDir), 'utf8');
  const manifest = JSON.parse(manifestText);
  if (manifest.schemaVersion !== 1 || manifest.format !== 'gzip_ndjson_path_sha256_content') throw new Error('Unsupported evidence bundle format');
  const stamp = new URL('.snapshot-manifest-sha256', publicDir);
  const identity = digest(manifestText);
  const base = resolve(fileURLToPath(publicDir));
  const validPath = (group, path) => ['associations', 'variants', 'trials'].includes(group) && new RegExp(`^${group}/[A-Za-z0-9_:.-]+\\.json$`).test(path);
  if (existsSync(stamp) && (await readFile(stamp, 'utf8')).trim() === identity) {
    let intact = true;
    for (const archive of manifest.archives) {
      if (archive.snapshots?.length !== archive.count) { intact = false; break; }
      for (const snapshot of archive.snapshots) {
        if (!validPath(archive.group, snapshot.path)) throw new Error('Invalid manifest snapshot path');
        try {
          const content = await readFile(new URL(snapshot.path, publicDir));
          if (content.length !== snapshot.bytes || digest(content) !== snapshot.sha256) { intact = false; break; }
        } catch { intact = false; break; }
      }
      if (!intact) break;
    }
    if (intact) return;
  }
  for (const archive of manifest.archives) {
    if (!['associations', 'variants', 'trials'].includes(archive.group) || archive.file !== `${archive.group}.ndjson.gz`) throw new Error('Invalid evidence bundle path');
    const archivePath = new URL(archive.file, bundleDir);
    const hash = createHash('sha256');
    for await (const block of createReadStream(archivePath)) hash.update(block);
    if (hash.digest('hex') !== archive.sha256) throw new Error(`Evidence bundle checksum mismatch: ${archive.group}`);
    const expected = new Map((archive.snapshots || []).map(item => [item.path, item]));
    if (expected.size !== archive.count) throw new Error('Invalid bundle manifest snapshot count');
    const seen = new Set();
    const lines = createInterface({ input: createReadStream(archivePath).pipe(createGunzip()), crlfDelay: Infinity });
    for await (const line of lines) {
      const record = JSON.parse(line);
      if (!validPath(archive.group, record.path) || seen.has(record.path) || expected.get(record.path)?.sha256 !== record.sha256) throw new Error('Invalid or duplicate snapshot path');
      const target = resolve(base, record.path);
      if (!target.startsWith(base + sep) || typeof record.content !== 'string' || digest(record.content) !== record.sha256) throw new Error('Invalid evidence snapshot');
      JSON.parse(record.content);
      await mkdir(resolve(base, archive.group), { recursive: true });
      const temporary = target + '.tmp';
      await writeFile(temporary, record.content, 'utf8');
      await rename(temporary, target);
      seen.add(record.path);
    }
    if (seen.size !== archive.count) throw new Error(`Evidence bundle count mismatch: ${archive.group}`);
  }
  await writeFile(stamp, identity + '\n', 'utf8');
  console.log('Restored checksummed public evidence snapshots.');
}
