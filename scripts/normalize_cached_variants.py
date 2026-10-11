#!/usr/bin/env python3
"""Rebuild existing snapshots from cached source summaries, with exact ID audits.

No network requests. Useful when normalization changes after a long ingestion.
Missing or mismatched cached provenance aborts rather than silently upgrading scope.
"""
import gzip
import hashlib
import json
from refresh_evidence import DATA, PUBLIC, CACHE, variant_record, save, now

def source_payload(source):
    path = CACHE / (hashlib.sha256(source['sourceUrl'].encode()).hexdigest() + '.json.gz')
    with gzip.open(path, 'rt') as handle:
        cached = json.load(handle)
    if any(cached.get(key) != source.get(key) for key in ('sourceUrl','sha256','retrievedAt')):
        raise ValueError('Cached provenance mismatch: ' + source['sourceUrl'])
    return cached['data']

def normalize():
    index_path = DATA / 'variantIndex.json'
    index = json.loads(index_path.read_text())
    for gene, item in index['genes'].items():
        if not item.get('file'):
            continue
        path = PUBLIC / 'variants' / (gene + '.json')
        document = json.loads(path.read_text())
        metadata = document['metadata']
        identifiers, translations, records = set(), set(), {}
        for source in metadata['searchSources']:
            search = source_payload(source)['esearchresult']
            identifiers.update(search.get('idlist', []))
            translations.add(search.get('querytranslation', metadata['query']))
        for source in metadata['sources']:
            summary = source_payload(source)['result']
            for uid in summary['uids']:
                records[uid] = variant_record(summary[uid])
        existing_ids = {str(row['id']) for row in document['variants']}
        if set(records) != existing_ids:
            raise ValueError('Cached summaries differ from snapshot: ' + gene)
        metadata['complete'] = len(records) == metadata['matchedCount'] and set(records) == identifiers
        metadata['queryTranslation'] = sorted(translations)
        metadata['normalizationAt'] = now()
        metadata['classificationScope'] = 'All ClinVar variation records returned by the gene query. Germline classification is shown where reported; somatic and oncogenicity assertions are separate.'
        sources = metadata['searchSources'] + metadata['sources']
        metadata['retrievalInterval'] = {'first': min(source['retrievedAt'] for source in sources), 'last': max(source['retrievedAt'] for source in sources)}
        document['variants'] = list(records.values())
        save(path, document)
        for field in ('complete','queryTranslation','normalizationAt','classificationScope','retrievalInterval'):
            item[field] = metadata[field]
        print(gene + ': ' + str(len(records)) + ' audited source IDs; complete=' + str(metadata['complete']), flush=True)
    index['metadata']['generatedAt'] = now()
    save(index_path,index)

if __name__ == '__main__':
    normalize()
