#!/usr/bin/env python3
"""Snapshot the official ClinGen dosage download without inferring allele effects."""
import csv
from datetime import datetime, timezone
import hashlib
import io
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://ftp.clinicalgenome.org/ClinGen_gene_curation_list_GRCh38.tsv'

def parse_dosage(text):
    lines = text.splitlines()
    start = next(i for i, line in enumerate(lines) if line.startswith('#Gene Symbol\t'))
    rows = csv.DictReader(io.StringIO('\n'.join([lines[start][1:], *lines[start+1:]])), delimiter='\t')
    result = {}
    for row in rows:
        gene = row['Gene Symbol']
        if gene in result:
            raise ValueError('Duplicate dosage gene: ' + gene)
        def assertion(prefix):
            score = row[prefix + ' Score']
            return {'score': int(score) if score.isdigit() else None,
                    'sourceScore': score, 'description': row[prefix + ' Description'],
                    'diseaseId': row.get(prefix + ' Disease ID') or None,
                    'pmids': [row[prefix + ' PMID' + str(i)] for i in range(1, 7) if row.get(prefix + ' PMID' + str(i))]}
        result[gene] = {'gene': gene, 'ncbiGeneId': row['Gene ID'], 'cytoband': row['cytoBand'],
            'location': row['Genomic Location'], 'assembly': 'GRCh38',
            'lastEvaluated': row['Date Last Evaluated'], 'haploinsufficiency': assertion('Haploinsufficiency'),
            'triplosensitivity': assertion('Triplosensitivity'),
            'url': 'https://search.clinicalgenome.org/kb/gene-dosage/' + gene}
    return result

def refresh():
    with urllib.request.urlopen(URL, timeout=90) as response:
        raw = response.read()
        modified = response.headers.get('Last-Modified')
    text = raw.decode('utf-8')
    genes = parse_dosage(text)
    metadata = {'sourceUrl': URL, 'retrievedAt': datetime.now(timezone.utc).isoformat(),
        'sourceLastModified': modified, 'sourceHeaderDate': text.splitlines()[1].removeprefix('#'),
        'sha256': hashlib.sha256(raw).hexdigest(), 'assembly': 'GRCh38', 'geneCount': len(genes),
        'scoreMeaning': {'0': 'No evidence available; not evidence of dosage tolerance.',
            '1': 'Little evidence', '2': 'Emerging evidence', '3': 'Sufficient evidence for dosage pathogenicity',
            '30': 'Associated with an autosomal recessive phenotype; not a haploinsufficiency score.',
            '40': 'Dosage sensitivity unlikely', 'null': 'Not yet evaluated or otherwise unscored'},
        'scope': 'All genes in the official curated-gene download. Absence from this file means no downloaded curation, not a negative finding.',
        'limitations': ['Dosage evidence applies to the stated condition and curation scope; it does not establish every allele effect.',
            'MONDO condition identifiers are preserved; no unverified crosswalk to OMIM or HPO is asserted.',
            'X-linked dosage ratings require sex and disease context; a score of 3 is not an automatic endogenous-upregulation recommendation.']}
    output = ROOT / 'frontend/src/data/evidence/dosageEvidence.json'
    temporary = output.with_suffix('.json.tmp')
    temporary.write_text(json.dumps({'metadata': metadata, 'genes': genes}, separators=(',', ':'), allow_nan=False) + '\n')
    temporary.replace(output)
    cache = ROOT / 'data/evidence/raw/clingen-dosage-GRCh38.tsv'
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_bytes(raw)
    print(json.dumps({'curatedGenes': len(genes), 'sha256': metadata['sha256']}))

if __name__ == '__main__':
    refresh()
