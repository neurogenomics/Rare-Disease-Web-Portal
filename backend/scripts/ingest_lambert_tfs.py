#!/usr/bin/env python3
"""
Ingest Lambert et al. 2018 TF data into gene_annotations collection.

Parses the Human TFs.xlsx file and updates gene documents with TF metadata.

Source: Lambert et al. (2018) "The Human Transcription Factors"
        Cell, 172(4), 650-665. https://doi.org/10.1016/j.cell.2018.01.029

Run: python backend/scripts/ingest_lambert_tfs.py
"""

import sys
import os

# Add backend to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pandas as pd
from pymongo import MongoClient
from pymongo.collation import Collation
from config import MONGODB_URI
from datetime import datetime, timezone

# Path to Human TFs.xlsx
TF_FILE = "/Users/nathanskene/Documents/Obsidian/Nathan/Human TFs.xlsx"

# Database setup
client = MongoClient(MONGODB_URI)
db = client["RareDiseaseData"]
gene_annotations = db["gene_annotations"]

# Case-insensitive collation
CASE_INSENSITIVE = Collation(locale="en", strength=2)


def load_tf_data() -> pd.DataFrame:
    """Load and parse the Human TFs Excel file."""
    print(f"Loading TF data from: {TF_FILE}")
    df = pd.read_excel(TF_FILE, sheet_name="Sheet1")
    print(f"Loaded {len(df)} TF records")
    return df


def parse_interpro_ids(value) -> list[str]:
    """Parse InterPro IDs from the Excel field."""
    if pd.isna(value) or not value:
        return []
    return [x.strip() for x in str(value).split(",") if x.strip()]


def ingest_tfs():
    """Update gene_annotations with TF metadata."""
    df = load_tf_data()

    updated = 0
    not_found = 0
    skipped = 0

    for _, row in df.iterrows():
        gene_symbol = row.get("HGNC symbol")
        if pd.isna(gene_symbol) or not gene_symbol:
            skipped += 1
            continue

        ensembl_id = row.get("Ensembl ID")

        # Build TF metadata
        tf_metadata = {
            "dbd": row.get("DBD") if pd.notna(row.get("DBD")) else None,
            "assessment": row.get("TF assessment") if pd.notna(row.get("TF assessment")) else None,
            "binding_mode": row.get("Binding mode") if pd.notna(row.get("Binding mode")) else None,
            "motif_status": row.get("Motif status") if pd.notna(row.get("Motif status")) else None,
            "interpro_ids": parse_interpro_ids(row.get("Interpro ID(s)")),
            "entrez_id": str(int(row.get("EntrezGene ID"))) if pd.notna(row.get("EntrezGene ID")) else None,
        }

        # Try to find the gene by symbol first, then by Ensembl ID
        query = {"gene_symbol": gene_symbol}

        result = gene_annotations.update_one(
            query,
            {
                "$set": {
                    "is_tf": True,
                    "tf_metadata": tf_metadata,
                    "last_updated": datetime.now(timezone.utc),
                    "data_versions.lambert_tf": "2018-01-29",  # Publication date
                }
            },
            collation=CASE_INSENSITIVE
        )

        if result.matched_count > 0:
            updated += 1
        else:
            # Try by Ensembl ID if symbol not found
            if pd.notna(ensembl_id):
                result2 = gene_annotations.update_one(
                    {"ensembl_id": ensembl_id},
                    {
                        "$set": {
                            "is_tf": True,
                            "tf_metadata": tf_metadata,
                            "last_updated": datetime.now(timezone.utc),
                            "data_versions.lambert_tf": "2018-01-29",
                        }
                    }
                )
                if result2.matched_count > 0:
                    updated += 1
                    print(f"  Found by Ensembl ID: {gene_symbol} -> {ensembl_id}")
                else:
                    not_found += 1
                    print(f"  NOT FOUND: {gene_symbol} ({ensembl_id})")
            else:
                not_found += 1
                print(f"  NOT FOUND: {gene_symbol} (no Ensembl ID)")

        if (updated + not_found + skipped) % 200 == 0:
            print(f"Progress: {updated} updated, {not_found} not found, {skipped} skipped")

    return updated, not_found, skipped


def verify_counts():
    """Verify the TF counts in the database."""
    total_tfs = gene_annotations.count_documents({"is_tf": True})

    # Sample some TFs to verify data
    samples = list(gene_annotations.find(
        {"is_tf": True},
        projection={"gene_symbol": 1, "tf_metadata.dbd": 1}
    ).limit(5))

    return total_tfs, samples


def main():
    """Main entry point."""
    print("=" * 60)
    print("Lambert TF Ingestion Script")
    print("=" * 60)
    print()

    # Check file exists
    if not os.path.exists(TF_FILE):
        print(f"ERROR: TF file not found: {TF_FILE}")
        sys.exit(1)

    updated, not_found, skipped = ingest_tfs()

    print()
    print("=" * 60)
    print("Ingestion Summary:")
    print(f"  Updated: {updated}")
    print(f"  Not found in HGNC: {not_found}")
    print(f"  Skipped (no symbol): {skipped}")
    print()

    # Verify
    total_tfs, samples = verify_counts()
    print(f"Total TFs in database: {total_tfs}")
    print()
    print("Sample TFs:")
    for s in samples:
        dbd = s.get("tf_metadata", {}).get("dbd", "N/A")
        print(f"  {s['gene_symbol']}: DBD={dbd}")

    print("=" * 60)


if __name__ == "__main__":
    main()
