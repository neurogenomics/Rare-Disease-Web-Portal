#!/usr/bin/env python3
"""Project the explicit gene panel from the checksummed, frozen HPO export.

Expanding a treatment catalogue must not invent variant–phenotype associations
or refresh the underlying HPO release implicitly. Run before the atlas import.
"""
import argparse
import csv
from collections import Counter
from datetime import datetime, timezone
import gzip
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def project_gene_phenotypes(source, panel, terms, metadata):
    digest = hashlib.sha256()
    with gzip.open(source, 'rb') as stream:
        while chunk := stream.read(1024 * 1024):
            digest.update(chunk)
    if digest.hexdigest() != metadata['sha256']:
        raise ValueError('Frozen HPO association checksum mismatch; select and review a new release explicitly.')
    if len(panel) != len(set(panel)) or any(not gene or gene != gene.strip() for gene in panel):
        raise ValueError('Gene panel must contain unique exact symbols.')
    genes = {gene: [] for gene in panel}
    with gzip.open(source, 'rt', encoding='utf-8', newline='') as stream:
        reader = csv.DictReader(stream, delimiter='\t')
        if not {'hpo_id', 'hpo_name', 'ncbi_gene_id', 'gene_symbol', 'disease_id'}.issubset(reader.fieldnames or []):
            raise ValueError('HPO export columns are missing.')
        for row in reader:
            gene = row['gene_symbol']
            if gene not in genes:
                continue
            if row['hpo_id'] not in terms:
                raise ValueError(f"HPO term {row['hpo_id']} is absent from the frozen ontology.")
            genes[gene].append({key: row[key] for key in ('hpo_id', 'hpo_name', 'ncbi_gene_id', 'disease_id')} | {
                'isPhenotypicAbnormality': terms[row['hpo_id']]['isPhenotypicAbnormality'],
            })
    return {'metadata': {**metadata,
        'normalizedAt': datetime.now(timezone.utc).isoformat(),
        'coverage': {'requested_genes': len(panel), 'genes_with_associations': sum(bool(rows) for rows in genes.values()),
                     'association_rows': sum(len(rows) for rows in genes.values())}}, 'genes': genes}


def refresh(root=ROOT):
    data = root / 'frontend/src/data/evidence'
    output = data / 'genePhenotypes.json'
    previous = json.loads(output.read_text())
    result = project_gene_phenotypes(root / 'backend/data/phenotype_to_genes.tsv.gz',
        json.loads((data / 'geneList.json').read_text()), json.loads((data / 'hpoTerms.json').read_text())['terms'],
        previous['metadata'])
    # This command changes panel membership, not the frozen source or the
    # interpretation of rows already published for an existing panel gene.
    for gene, rows in previous['genes'].items():
        if gene in result['genes']:
            canonical = lambda records: Counter(json.dumps(row, sort_keys=True) for row in records)
            if canonical(rows) != canonical(result['genes'][gene]):
                raise ValueError(f'Existing {gene} associations differ from the frozen source projection.')
            result['genes'][gene] = rows  # Preserve prior display ordering too.
    result['genes'] = {**{gene: result['genes'][gene] for gene in previous['genes'] if gene in result['genes']},
                       **{gene: rows for gene, rows in result['genes'].items() if gene not in previous['genes']}}
    temporary = output.with_suffix('.tmp')
    temporary.write_text(json.dumps(result, indent=2) + '\n')
    temporary.replace(output)
    print(json.dumps(result['metadata']['coverage']))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    refresh(parser.parse_args().root)
