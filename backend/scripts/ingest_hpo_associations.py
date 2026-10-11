"""Refresh the official HPO disease-context gene/phenotype source snapshot.

Run from any directory: python backend/scripts/ingest_hpo_associations.py
The full compressed source and manifest are versioned; the SQLite query cache is
rebuildable. A frontend subset is exported for the explicit evidence gene list.
"""

import argparse
import gzip
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import shutil
import sys
import tempfile
import urllib.request

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from phenotype_associations import (ASSOCIATION_KIND, DATA_DIR, SOURCE_PATH,
    SOURCE_URL, MANIFEST_PATH, DATABASE_PATH, build_index, get_phenotype_gene_associations)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--export-only", action="store_true")
    parser.add_argument("--genes", type=Path, default=Path(__file__).resolve().parents[2] / "frontend/src/data/evidence/geneList.json")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[2] / "frontend/src/data/evidence/genePhenotypes.json")
    args = parser.parse_args()
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not args.export_only:
        with urllib.request.urlopen(SOURCE_URL, timeout=120) as response, tempfile.TemporaryDirectory() as directory:
            raw = Path(directory) / "source.tsv"
            with raw.open("wb") as handle:
                shutil.copyfileobj(response, handle)
            digest = hashlib.sha256(raw.read_bytes()).hexdigest()
            manifest = {
                "source": "Human Phenotype Ontology phenotype_to_genes export",
                "source_url": SOURCE_URL,
                "source_last_modified": response.headers.get("Last-Modified"),
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
                "sha256": digest,
                "source_bytes": raw.stat().st_size,
                "association_kind": ASSOCIATION_KIND,
                "scope": "A gene and phenotype linked through an annotated disease; not variant-specific causality, inheritance, mechanism or cell-type causality.",
            }
            temporary = Path(directory) / "source.tsv.gz"
            with raw.open("rb") as source, temporary.open("wb") as output:
                with gzip.GzipFile(fileobj=output, mode="wb", mtime=0, filename="") as compressed:
                    shutil.copyfileobj(source, compressed)
            build_index(temporary, DATABASE_PATH, manifest)
            shutil.copyfile(temporary, SOURCE_PATH)
            MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    if not args.genes.exists():
        print("HPO snapshot ready; no frontend gene list yet. Run again with --export-only.")
        return
    gene_list = json.loads(args.genes.read_text())
    if isinstance(gene_list, dict):
        gene_list = gene_list.get("genes", list(gene_list))
    symbols = [gene if isinstance(gene, str) else gene["gene_symbol"] for gene in gene_list]
    associations = get_phenotype_gene_associations(gene_symbols=symbols)
    output = {symbol: [] for symbol in symbols}
    terms_path = Path(__file__).resolve().parents[2] / 'frontend/src/data/evidence/hpoTerms.json'
    terms = json.loads(terms_path.read_text()).get('terms', {}) if terms_path.exists() else {}
    for row in associations:
        record = {key: row[key] for key in ["hpo_id", "hpo_name", "ncbi_gene_id", "disease_id"]}
        record['isPhenotypicAbnormality'] = terms.get(row['hpo_id'], {}).get('isPhenotypicAbnormality')
        output[row["gene_symbol"]].append(record)
    manifest = json.loads(MANIFEST_PATH.read_text())
    manifest["coverage"] = {"requested_genes": len(symbols), "genes_with_associations": sum(bool(rows) for rows in output.values()), "association_rows": len(associations)}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({"metadata": manifest, "genes": output}, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest["coverage"]))


if __name__ == "__main__":
    main()
