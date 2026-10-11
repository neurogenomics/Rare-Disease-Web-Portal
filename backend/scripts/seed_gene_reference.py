#!/usr/bin/env python3
"""
Seed the gene_annotations collection with all HGNC human genes.

Downloads the complete HGNC gene set and creates documents for each gene
with gene_symbol, ensembl_id, and aliases. Also creates required indexes.

Run: python backend/scripts/seed_gene_reference.py
"""

import sys
import os

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import requests
import pandas as pd
from io import StringIO
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.collation import Collation
from config import MONGODB_URI
from datetime import datetime, timezone

# HGNC complete set URL (Google Cloud Storage)
HGNC_URL = "https://storage.googleapis.com/public-download-files/hgnc/tsv/tsv/hgnc_complete_set.txt"

# Database setup
client = MongoClient(MONGODB_URI)
db = client["RareDiseaseData"]
gene_annotations = db["gene_annotations"]


def download_hgnc_data() -> pd.DataFrame:
    """Download and parse the HGNC complete gene set."""
    print("Downloading HGNC complete set...")
    response = requests.get(HGNC_URL, timeout=120)
    response.raise_for_status()

    df = pd.read_csv(StringIO(response.text), sep="\t", low_memory=False)
    print(f"Downloaded {len(df)} genes from HGNC")
    return df


def parse_aliases(row: pd.Series) -> list[str]:
    """Extract alias symbols and previous symbols from HGNC row."""
    aliases = []

    # Add alias symbols
    if pd.notna(row.get("alias_symbol")):
        aliases.extend([a.strip() for a in str(row["alias_symbol"]).split("|")])

    # Add previous symbols
    if pd.notna(row.get("prev_symbol")):
        aliases.extend([p.strip() for p in str(row["prev_symbol"]).split("|")])

    return [a for a in aliases if a]  # Filter empty strings


def seed_genes():
    """Seed gene_annotations collection with HGNC data."""
    df = download_hgnc_data()

    # Drop the existing collection (fresh start)
    print("Dropping existing gene_annotations collection...")
    gene_annotations.drop()

    # Prepare documents
    documents = []
    for _, row in df.iterrows():
        # Skip withdrawn genes
        if row.get("status") == "Entry Withdrawn":
            continue

        gene_symbol = row.get("symbol")
        if pd.isna(gene_symbol) or not gene_symbol:
            continue

        ensembl_id = row.get("ensembl_gene_id")
        if pd.isna(ensembl_id):
            ensembl_id = None

        doc = {
            "gene_symbol": gene_symbol,
            "ensembl_id": ensembl_id,
            "hgnc_id": row.get("hgnc_id"),
            "name": row.get("name"),
            "locus_group": row.get("locus_group"),
            "locus_type": row.get("locus_type"),
            "aliases": parse_aliases(row),

            # TF fields (to be populated by TF ingestion script)
            "is_tf": False,
            "tf_metadata": None,

            # Disease fields (to be populated by OpenTargets ingestion)
            "disease_associations": None,

            # Antibody fields (to be populated by PCRP ingestion)
            "antibody_validation": None,

            # Metadata
            "last_updated": datetime.now(timezone.utc),
            "data_versions": {
                "hgnc": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            },
        }
        documents.append(doc)

    # Bulk insert
    print(f"Inserting {len(documents)} gene documents...")
    if documents:
        result = gene_annotations.insert_many(documents)
        print(f"Inserted {len(result.inserted_ids)} documents")

    return len(documents)


def create_indexes():
    """Create required indexes for gene_annotations collection."""
    print("Creating indexes...")

    # Case-insensitive collation for gene symbol lookups
    case_insensitive = Collation(locale="en", strength=2)

    # Unique index on gene_symbol (case-insensitive)
    gene_annotations.create_index(
        [("gene_symbol", ASCENDING)],
        unique=True,
        collation=case_insensitive,
        name="gene_symbol_ci_unique"
    )

    # Index on ensembl_id for cross-referencing
    gene_annotations.create_index(
        [("ensembl_id", ASCENDING)],
        name="ensembl_id_idx",
        sparse=True  # Skip docs without ensembl_id
    )

    # Index on is_tf for TF filtering
    gene_annotations.create_index(
        [("is_tf", ASCENDING)],
        name="is_tf_idx"
    )

    # Index on disease association scores
    gene_annotations.create_index(
        [("disease_associations.alzheimers.overall_score", DESCENDING)],
        name="alzheimers_score_idx",
        sparse=True
    )
    gene_annotations.create_index(
        [("disease_associations.parkinsons.overall_score", DESCENDING)],
        name="parkinsons_score_idx",
        sparse=True
    )

    # Index on aliases for alias lookups
    gene_annotations.create_index(
        [("aliases", ASCENDING)],
        name="aliases_idx"
    )

    print("Indexes created:")
    for idx in gene_annotations.list_indexes():
        print(f"  - {idx['name']}")


def main():
    """Main entry point."""
    print("=" * 60)
    print("Gene Annotations Seed Script")
    print("=" * 60)

    count = seed_genes()
    create_indexes()

    # Verify
    total = gene_annotations.count_documents({})
    tfs = gene_annotations.count_documents({"is_tf": True})

    print()
    print("=" * 60)
    print("Summary:")
    print(f"  Total genes: {total}")
    print(f"  TFs: {tfs} (will be updated by TF ingestion script)")
    print("=" * 60)


if __name__ == "__main__":
    main()
