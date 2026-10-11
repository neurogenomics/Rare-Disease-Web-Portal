#!/usr/bin/env python3
"""Version normalized public snapshots as lossless, checksummed gzip bundles.

Run after evidence imports. npm's publisher restores these files on a clean
checkout; the frontend's URLs and JSON remain unchanged. Raw retrieval caches
are not included. Bundle identity is reproducible for identical source files.
"""
import gzip
import hashlib
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'frontend/public/data/evidence'
TARGET = ROOT / 'data/evidence/published'
GROUPS = ('associations', 'variants', 'trials')


def pack_group(source, destination, group):
    files = sorted((source / group).glob('*.json'))
    if not files:
        raise ValueError(f'No {group} snapshots to publish')
    temporary = destination.with_suffix('.tmp')
    raw_bytes, snapshots = 0, []
    with temporary.open('wb') as output:
        with gzip.GzipFile(filename='', mode='wb', fileobj=output, mtime=0) as compressed:
            with io.TextIOWrapper(compressed, encoding='utf-8', newline='\n') as text:
                for path in files:
                    encoded = path.read_bytes()
                    content = encoded.decode('utf-8')
                    json.loads(content)  # Reject invalid snapshots before publishing.
                    raw_bytes += len(encoded)
                    record = {'path': path.relative_to(source).as_posix(),
                              'sha256': hashlib.sha256(encoded).hexdigest(),
                              'content': content}
                    text.write(json.dumps(record, ensure_ascii=False, separators=(',', ':')) + '\n')
                    snapshots.append({'path': record['path'], 'sha256': record['sha256'], 'bytes': len(encoded)})
    temporary.replace(destination)
    packed = destination.read_bytes()
    return {'group': group, 'file': destination.name, 'count': len(files),
            'uncompressedBytes': raw_bytes, 'bytes': len(packed),
            'sha256': hashlib.sha256(packed).hexdigest(), 'snapshots': snapshots}


def main():
    TARGET.mkdir(parents=True, exist_ok=True)
    archives = [pack_group(PUBLIC, TARGET / f'{group}.ndjson.gz', group) for group in GROUPS]
    manifest = {'schemaVersion': 1, 'format': 'gzip_ndjson_path_sha256_content',
                'scope': 'Normalized public atlas, ClinVar/transcript and registry snapshots. '
                         'Raw caches and private requirement notes are excluded.',
                'archives': archives}
    path = TARGET / 'manifest.json'
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    temporary.replace(path)
    print(json.dumps({'files': sum(a['count'] for a in archives),
                      'uncompressedBytes': sum(a['uncompressedBytes'] for a in archives),
                      'packedBytes': sum(a['bytes'] for a in archives)}))


if __name__ == '__main__':
    main()
