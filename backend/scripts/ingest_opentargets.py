#!/usr/bin/env python3
"""
Ingest disease association data from OpenTargets Platform.

Fetches gene-disease associations for Alzheimer's and Parkinson's disease
using the OpenTargets GraphQL API.

Run: python backend/scripts/ingest_opentargets.py
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import time
import requests
from typing import Dict, List, Any, Optional
from pymongo import MongoClient
from config import MONGODB_URI
from datetime import datetime, timezone

# OpenTargets GraphQL endpoint
OPENTARGETS_API = "https://api.platform.opentargets.org/api/v4/graphql"

# Disease IDs for AD and PD
DISEASE_IDS = {
    "alzheimers": "MONDO_0004975",  # Alzheimer disease
    "parkinsons": "MONDO_0005180",  # Parkinson disease
}

# Database setup
client = MongoClient(MONGODB_URI)
db = client["RareDiseaseData"]
gene_annotations = db["gene_annotations"]


class OpenTargetsClient:
    """Client for OpenTargets GraphQL API with retry logic."""

    def __init__(self, max_retries: int = 3, base_delay: float = 1.0):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.session = requests.Session()

    def query(self, query: str, variables: Dict = None) -> Dict:
        """Execute GraphQL query with retry logic."""
        payload = {"query": query}
        if variables:
            payload["variables"] = variables

        for attempt in range(self.max_retries):
            try:
                response = self.session.post(
                    OPENTARGETS_API,
                    json=payload,
                    timeout=60
                )

                if response.status_code == 429:
                    # Rate limited - exponential backoff
                    delay = self.base_delay * (2 ** attempt)
                    print(f"  Rate limited, waiting {delay}s...")
                    time.sleep(delay)
                    continue

                response.raise_for_status()
                return response.json()

            except requests.exceptions.RequestException as e:
                if attempt < self.max_retries - 1:
                    delay = self.base_delay * (2 ** attempt)
                    print(f"  Request error, retrying in {delay}s: {e}")
                    time.sleep(delay)
                else:
                    raise

        return {}


def build_disease_query(disease_id: str, page_size: int = 500) -> str:
    """Build GraphQL query to get genes associated with a disease."""
    return f"""
    query DiseaseTargets($page: Pagination!) {{
      disease(efoId: "{disease_id}") {{
        id
        name
        associatedTargets(page: $page) {{
          count
          rows {{
            target {{
              id
              approvedSymbol
            }}
            score
            datatypeScores {{
              id
              score
            }}
          }}
        }}
      }}
    }}
    """


def parse_evidence(datatype_scores: List[Dict]) -> Dict[str, List[Dict]]:
    """Parse datatype scores into evidence categories."""
    evidence = {
        "common_variants": [],
        "rare_variants": [],
        "expression_qtl": [],
        "literature": [],
        "pathway": [],
    }

    for dt in datatype_scores:
        dt_id = dt.get("id", "")
        score = dt.get("score", 0)

        item = {"source": dt_id, "score": score}

        if dt_id == "genetic_association":
            evidence["common_variants"].append(item)
        elif dt_id in ["genetic_literature"]:
            evidence["rare_variants"].append(item)
        elif dt_id == "expression":
            evidence["expression_qtl"].append(item)
        elif dt_id == "literature":
            evidence["literature"].append(item)
        elif dt_id in ["affected_pathway", "known_drug"]:
            evidence["pathway"].append(item)

    # Remove empty categories
    return {k: v for k, v in evidence.items() if v}


def fetch_disease_associations(
    client: OpenTargetsClient,
    disease_id: str,
    disease_name: str
) -> Dict[str, Dict]:
    """
    Fetch all gene-disease associations for a disease.

    Returns dict mapping Ensembl ID -> association data.
    """
    print(f"\nFetching {disease_name} associations...")
    associations = {}

    page_size = 500
    page_index = 0
    total_count = None

    query = build_disease_query(disease_id, page_size)

    while True:
        variables = {"page": {"index": page_index, "size": page_size}}
        result = client.query(query, variables)

        if "errors" in result:
            print(f"  Error: {result['errors']}")
            break

        disease_data = result.get("data", {}).get("disease")
        if not disease_data:
            print(f"  No data found for disease {disease_id}")
            break

        assoc_data = disease_data.get("associatedTargets", {})
        if total_count is None:
            total_count = assoc_data.get("count", 0)
            print(f"  Total associations: {total_count}")

        rows = assoc_data.get("rows", [])
        if not rows:
            break

        for row in rows:
            target = row.get("target", {})
            ensembl_id = target.get("id")
            symbol = target.get("approvedSymbol")
            score = row.get("score", 0)
            dt_scores = row.get("datatypeScores", [])

            if ensembl_id:
                associations[ensembl_id] = {
                    "symbol": symbol,
                    "overall_score": score,
                    "evidence": parse_evidence(dt_scores)
                }

        page_index += 1
        print(f"  Page {page_index}: {len(associations)} genes so far")

        # Rate limit protection
        time.sleep(0.2)

        # Stop if we've fetched all
        if len(associations) >= total_count:
            break

        # Safety limit
        if page_index > 100:
            print("  Reached page limit")
            break

    return associations


def upsert_disease_associations(
    disease_key: str,
    associations: Dict[str, Dict]
) -> tuple[int, int]:
    """
    Upsert disease associations into gene_annotations collection.

    Returns (updated_count, not_found_count).
    """
    print(f"\nUpserting {disease_key} associations to database...")
    updated = 0
    not_found = 0

    for ensembl_id, assoc in associations.items():
        # First, ensure disease_associations is an object, not null
        # We need to use a two-step update to handle null -> object conversion
        gene_annotations.update_one(
            {"ensembl_id": ensembl_id, "disease_associations": None},
            {"$set": {"disease_associations": {}}}
        )

        # Now update with the disease data
        result = gene_annotations.update_one(
            {"ensembl_id": ensembl_id},
            {
                "$set": {
                    f"disease_associations.{disease_key}": {
                        "overall_score": assoc["overall_score"],
                        "evidence": assoc["evidence"]
                    },
                    "last_updated": datetime.now(timezone.utc),
                    "data_versions.opentargets": "24.12",
                }
            }
        )

        if result.matched_count > 0:
            updated += 1
        else:
            not_found += 1

        if (updated + not_found) % 1000 == 0:
            print(f"  Progress: {updated} updated, {not_found} not found")

    return updated, not_found


def main():
    """Main entry point."""
    print("=" * 60)
    print("OpenTargets Disease Association Ingestion")
    print("=" * 60)

    client = OpenTargetsClient()
    total_updated = 0
    total_not_found = 0

    for disease_key, disease_id in DISEASE_IDS.items():
        associations = fetch_disease_associations(
            client, disease_id, disease_key.title()
        )

        updated, not_found = upsert_disease_associations(
            disease_key, associations
        )

        total_updated += updated
        total_not_found += not_found

        print(f"\n{disease_key.title()}: {updated} genes updated, {not_found} not in HGNC")

    print()
    print("=" * 60)
    print("Summary:")
    print(f"  Total genes with disease associations: {total_updated}")
    print(f"  Genes not found in HGNC: {total_not_found}")

    # Verify
    ad_count = gene_annotations.count_documents({
        "disease_associations.alzheimers.overall_score": {"$gt": 0}
    })
    pd_count = gene_annotations.count_documents({
        "disease_associations.parkinsons.overall_score": {"$gt": 0}
    })

    print()
    print(f"  Genes with Alzheimer's associations: {ad_count}")
    print(f"  Genes with Parkinson's associations: {pd_count}")
    print("=" * 60)


if __name__ == "__main__":
    main()
