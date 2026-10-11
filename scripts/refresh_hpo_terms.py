#!/usr/bin/env python3
"""Export HPO labels and ISA membership with a frozen source checksum."""
import argparse
from datetime import datetime, timezone
import gzip
import hashlib
import json
from pathlib import Path
import re
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'frontend/src/data/evidence/hpoTerms.json'
CACHE = ROOT / 'data/evidence/raw/hp.obo.gz'

def parse_obo(text):
    terms, version = {}, None
    for line in text.splitlines():
        if line.startswith('data-version: '): version = line[14:]
    for block in text.split('[Term]')[1:]:
        if '\n[' in block: block = block.split('\n[',1)[0]
        def one(key):
            match = re.search('^' + re.escape(key) + ': (.*)$', block, re.M)
            return match.group(1) if match else None
        identifier = one('id')
        if not identifier or not identifier.startswith('HP:'): continue
        terms[identifier] = {'label': one('name'), 'synonyms': re.findall(r'^synonym: "(.*?)"',block,re.M),
            'obsolete': one('is_obsolete') == 'true', 'parents': re.findall(r'^is_a: (HP:\d{7})',block,re.M)}
    children = {}
    for identifier, term in terms.items():
        for parent in term['parents']: children.setdefault(parent, []).append(identifier)
    phenotypic, stack = set(), ['HP:0000118']
    while stack:
        identifier = stack.pop()
        if identifier in phenotypic: continue
        phenotypic.add(identifier)
        stack.extend(children.get(identifier, []))
    for identifier, term in terms.items():
        term['isPhenotypicAbnormality'] = identifier in phenotypic and identifier != 'HP:0000118' and not term['obsolete']
    return terms, version

def refresh(refresh_source=False):
    prior = json.loads(OUTPUT.read_text())['metadata']
    if refresh_source or not CACHE.exists():
        with urllib.request.urlopen(prior['sourceUrl'], timeout=120) as response: raw = response.read()
        # Do not silently change the frozen ontology while normalizing this build.
        if hashlib.sha256(raw).hexdigest() != prior['sha256']: raise ValueError('Source no longer matches the frozen HPO checksum; select and review an explicit new release.')
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        with gzip.open(CACHE,'wb') as handle: handle.write(raw)
    with gzip.open(CACHE,'rb') as handle: raw = handle.read()
    if hashlib.sha256(raw).hexdigest() != prior['sha256']: raise ValueError('Cached HPO checksum mismatch')
    terms, version = parse_obo(raw.decode('utf-8'))
    metadata = {**prior, 'version': version, 'normalizedAt': datetime.now(timezone.utc).isoformat(),
        'phenotypeBranch': 'ISA descendants of HP:0000118 excluding the branch root and obsolete terms. Inheritance, modifiers and clinical course metadata are not therapeutic phenotype endpoints.'}
    OUTPUT.write_text(json.dumps({'metadata':metadata,'terms':terms},separators=(',',':'))+'\n')
    backend = ROOT / 'backend/data/phenotypic_abnormality_ids.json.gz'
    backend.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(backend,'wt') as handle:
        json.dump({'metadata':metadata,'knownIds':list(terms),'ids':[key for key,term in terms.items() if term['isPhenotypicAbnormality']]},handle,separators=(',',':'))
    print(json.dumps({'terms':len(terms),'phenotypicAbnormalities':sum(term['isPhenotypicAbnormality'] for term in terms.values())}))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh-source',action='store_true')
    refresh(parser.parse_args().refresh_source)
