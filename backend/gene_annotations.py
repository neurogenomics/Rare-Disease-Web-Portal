"""
Gene Annotations Module

Provides functions for querying gene annotation data including:
- Transcription factor (TF) status from Lambert et al. 2018
- Disease associations from OpenTargets
- Cell type specificity from existing atlases
- Antibody validation from PCRP

Usage:
    from gene_annotations import get_tf_status, get_disease_associations

    # Check if a gene is a TF
    tf_info = get_tf_status("TFAP2A")

    # Get disease associations
    disease_info = get_disease_associations("LRRK2", "parkinsons")
"""

from typing import Optional, Dict, List, Any
from pymongo import MongoClient
from pymongo.collation import Collation
from config import MONGODB_URI

# Establish MongoDB connection (reuse existing client pattern)
client = MongoClient(MONGODB_URI)
db = client["RareDiseaseData"]

# Collection references
gene_annotations = db["gene_annotations"]

# Existing cell type gene collections for cross-reference
celltype_gene_descartes = db["celltype_gene_DescartesHuman"]
celltype_gene_hcl = db["celltype_gene_HumanCellLandscape"]

# Case-insensitive collation for gene symbol lookups
CASE_INSENSITIVE_COLLATION = Collation(locale="en", strength=2)


def get_db():
    """Return database reference for testing."""
    return db


# ============================================================
# Transcription Factor Functions (Sprint 1)
# ============================================================

def get_tf_status(gene_symbol: str) -> Optional[Dict[str, Any]]:
    """
    Get transcription factor status for a gene.

    Args:
        gene_symbol: HGNC gene symbol (case-insensitive)

    Returns:
        Dict with TF metadata if gene is a TF, None if not a TF.
        Returns None if gene not found.

        Example return value:
        {
            "is_tf": True,
            "dbd": "Homeodomain",
            "assessment": "Known motif",
            "binding_mode": "Monomer or homomultimer",
            "motif_status": "High-throughput in vitro"
        }
    """
    doc = gene_annotations.find_one(
        {"gene_symbol": gene_symbol},
        collation=CASE_INSENSITIVE_COLLATION
    )

    if doc is None:
        return None

    if not doc.get("is_tf", False):
        return None

    tf_meta = doc.get("tf_metadata", {}) or {}
    return {
        "is_tf": True,
        "dbd": tf_meta.get("dbd"),
        "assessment": tf_meta.get("assessment"),
        "binding_mode": tf_meta.get("binding_mode"),
        "motif_status": tf_meta.get("motif_status"),
    }


def get_tf_status_batch(gene_symbols: List[str]) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Get TF status for multiple genes efficiently.

    Args:
        gene_symbols: List of HGNC gene symbols (case-insensitive)

    Returns:
        Dict mapping gene symbols to their TF status (None if not a TF).

        Example:
        {
            "TFAP2A": {"is_tf": True, "dbd": "bHLH", ...},
            "LRRK2": None,
            "PAX6": {"is_tf": True, "dbd": "Paired box", ...}
        }
    """
    if not gene_symbols:
        return {}

    # Query all genes at once
    cursor = gene_annotations.find(
        {"gene_symbol": {"$in": gene_symbols}},
        collation=CASE_INSENSITIVE_COLLATION
    )

    # Build result dict
    results = {symbol: None for symbol in gene_symbols}

    for doc in cursor:
        symbol = doc["gene_symbol"]
        if doc.get("is_tf", False):
            tf_meta = doc.get("tf_metadata", {}) or {}
            results[symbol] = {
                "is_tf": True,
                "dbd": tf_meta.get("dbd"),
                "assessment": tf_meta.get("assessment"),
                "binding_mode": tf_meta.get("binding_mode"),
                "motif_status": tf_meta.get("motif_status"),
            }

    return results


def is_tf(gene_symbol: str) -> bool:
    """
    Quick check if a gene is a transcription factor.

    Args:
        gene_symbol: HGNC gene symbol (case-insensitive)

    Returns:
        True if gene is a TF, False otherwise.
    """
    doc = gene_annotations.find_one(
        {"gene_symbol": gene_symbol, "is_tf": True},
        projection={"_id": 1},
        collation=CASE_INSENSITIVE_COLLATION
    )
    return doc is not None


def get_all_tfs(limit: int = None) -> List[Dict[str, Any]]:
    """
    Get all transcription factors.

    Args:
        limit: Maximum number of TFs to return (None for all)

    Returns:
        List of TF records with gene_symbol and tf_metadata.
    """
    query = {"is_tf": True}
    projection = {
        "_id": 0,
        "gene_symbol": 1,
        "ensembl_id": 1,
        "tf_metadata": 1
    }

    cursor = gene_annotations.find(query, projection)

    if limit:
        cursor = cursor.limit(limit)

    return list(cursor)


def count_tfs() -> int:
    """Return the total number of TFs in the database."""
    return gene_annotations.count_documents({"is_tf": True})


# ============================================================
# Gene Lookup Functions (Sprint 1)
# ============================================================

def get_gene(gene_symbol: str) -> Optional[Dict[str, Any]]:
    """
    Get complete gene annotation.

    Args:
        gene_symbol: HGNC gene symbol (case-insensitive)

    Returns:
        Complete gene annotation document, or None if not found.
    """
    doc = gene_annotations.find_one(
        {"gene_symbol": gene_symbol},
        collation=CASE_INSENSITIVE_COLLATION
    )

    if doc:
        doc["_id"] = str(doc["_id"])

    return doc


def get_gene_by_ensembl(ensembl_id: str) -> Optional[Dict[str, Any]]:
    """
    Get gene annotation by Ensembl ID.

    Args:
        ensembl_id: Ensembl gene ID (e.g., "ENSG00000188906")

    Returns:
        Gene annotation document, or None if not found.
    """
    doc = gene_annotations.find_one({"ensembl_id": ensembl_id})

    if doc:
        doc["_id"] = str(doc["_id"])

    return doc


def get_gene_by_alias(alias: str) -> Optional[Dict[str, Any]]:
    """
    Find gene by alias symbol.

    Args:
        alias: Gene alias to search for

    Returns:
        Gene annotation document, or None if not found.
    """
    doc = gene_annotations.find_one(
        {"aliases": alias},
        collation=CASE_INSENSITIVE_COLLATION
    )

    if doc:
        doc["_id"] = str(doc["_id"])

    return doc


def search_genes(query: str, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Search for genes by symbol or alias prefix.

    Args:
        query: Search string (matches gene_symbol or aliases)
        limit: Maximum results to return

    Returns:
        List of matching gene summaries.
    """
    import re
    regex = re.compile(f"^{re.escape(query)}", re.IGNORECASE)

    cursor = gene_annotations.find(
        {
            "$or": [
                {"gene_symbol": regex},
                {"aliases": regex}
            ]
        },
        projection={
            "_id": 0,
            "gene_symbol": 1,
            "ensembl_id": 1,
            "name": 1,
            "is_tf": 1,
            "aliases": 1
        }
    ).limit(limit)

    return list(cursor)


# ============================================================
# Disease Association Functions (Sprint 2 - Placeholder)
# ============================================================

def get_disease_associations(
    gene_symbol: str,
    disease: str = None
) -> Optional[Dict[str, Any]]:
    """
    Get disease associations for a gene.

    Args:
        gene_symbol: HGNC gene symbol (case-insensitive)
        disease: Specific disease to filter ("alzheimers", "parkinsons", or None for all)

    Returns:
        Dict of disease associations with evidence, or None if not found.

        Example:
        {
            "alzheimers": {
                "overall_score": 0.72,
                "evidence": {
                    "common_variants": [...],
                    "rare_variants": [...],
                    "expression_qtl": [...]
                }
            }
        }
    """
    doc = gene_annotations.find_one(
        {"gene_symbol": gene_symbol},
        projection={"disease_associations": 1},
        collation=CASE_INSENSITIVE_COLLATION
    )

    if doc is None:
        return None

    associations = doc.get("disease_associations")
    if associations is None:
        return {}

    if disease:
        # Return only the requested disease
        if disease in associations:
            return {disease: associations[disease]}
        return {}

    return associations


def get_genes_by_disease(
    disease: str,
    min_score: float = 0.0,
    evidence_types: List[str] = None,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """
    Get genes associated with a disease, sorted by score.

    Args:
        disease: Disease name ("alzheimers" or "parkinsons")
        min_score: Minimum overall score threshold
        evidence_types: Filter by evidence types (e.g., ["common_variants", "rare_variants"])
        limit: Maximum results to return

    Returns:
        List of genes with their disease association scores.
    """
    query = {
        f"disease_associations.{disease}.overall_score": {"$gte": min_score}
    }

    projection = {
        "_id": 0,
        "gene_symbol": 1,
        "ensembl_id": 1,
        "is_tf": 1,
        f"disease_associations.{disease}": 1
    }

    cursor = gene_annotations.find(query, projection).sort(
        f"disease_associations.{disease}.overall_score", -1
    ).limit(limit)

    results = []
    for doc in cursor:
        assoc = doc.get("disease_associations", {}).get(disease, {})

        # Filter by evidence types if specified
        if evidence_types:
            evidence = assoc.get("evidence", {})
            has_evidence = any(
                evidence.get(et, []) for et in evidence_types
            )
            if not has_evidence:
                continue

        results.append({
            "gene_symbol": doc["gene_symbol"],
            "ensembl_id": doc.get("ensembl_id"),
            "is_tf": doc.get("is_tf", False),
            "overall_score": assoc.get("overall_score"),
            "evidence": assoc.get("evidence", {})
        })

    return results


# ============================================================
# Cell Specificity Functions (Sprint 3 - Placeholder)
# ============================================================

# Configuration for specificity thresholds
# These are raw expression_specificity values (not percentiles)
SPECIFICITY_CONFIG = {
    "DescartesHuman": {
        "min_specificity": 0.01,  # ~1% specificity
    },
    "HumanCellLandscape": {
        "min_specificity": 0.01,
    }
}


from functools import lru_cache


@lru_cache(maxsize=100)
def get_specificity_percentiles(db_type: str, cell_type: str = None) -> Dict[int, float]:
    """
    Get specificity thresholds for percentiles.

    The slider shows "Top X%" meaning genes in the top X percentile of specificity.
    - "Top 1%" = only genes in 99th percentile of specificity (highest)
    - "Top 50%" = genes in top half of specificity

    Args:
        db_type: "DescartesHuman" or "HumanCellLandscape"
        cell_type: Optional cell type to scope percentiles (if None, uses global distribution)

    Returns:
        Dict mapping percentile (1, 5, 10, 25, 50) to threshold value.
        E.g., {1: 0.14, 5: 0.05, 10: 0.02, 25: 0.01, 50: 0.001}
    """
    collection = celltype_gene_descartes if db_type == "DescartesHuman" else celltype_gene_hcl

    # Build match stage
    match_stage = {}
    if cell_type:
        match_stage = {"celltype": cell_type}

    # Sample for performance (computing percentiles over millions of docs is slow)
    pipeline = [
        {"$match": match_stage} if match_stage else {"$match": {}},
        {"$sample": {"size": 50000}},
        {"$group": {"_id": None, "values": {"$push": "$expression_specificity"}}}
    ]

    try:
        result = list(collection.aggregate(pipeline))
        if not result or not result[0].get("values"):
            # Fallback defaults based on data analysis
            return {1: 0.14, 5: 0.05, 10: 0.02, 25: 0.01, 50: 0.001}

        values = sorted([v for v in result[0]["values"] if v is not None])
        n = len(values)

        if n == 0:
            return {1: 0.14, 5: 0.05, 10: 0.02, 25: 0.01, 50: 0.001}

        # "Top X%" means the threshold at the (100-X)th percentile
        # E.g., "Top 10%" means we want genes above the 90th percentile
        percentiles = {}
        for p in [1, 5, 10, 25, 50]:
            idx = int(n * (100 - p) / 100)
            idx = min(idx, n - 1)  # Clamp to valid index
            percentiles[p] = round(values[idx], 6)

        return percentiles

    except Exception as e:
        # Log and return fallback
        print(f"Error computing percentiles: {e}")
        return {1: 0.14, 5: 0.05, 10: 0.02, 25: 0.01, 50: 0.001}


def get_cell_specificity(
    gene_symbol: str,
    db_type: str = "DescartesHuman",
    min_specificity: float = None,
    limit: int = 20
) -> List[Dict[str, Any]]:
    """
    Get cell types where a gene is specifically expressed.

    Cross-references existing celltype_gene_* collections.

    Args:
        gene_symbol: HGNC gene symbol (case-sensitive, matches collection)
        db_type: Cell atlas to query ("DescartesHuman" or "HumanCellLandscape")
        min_specificity: Minimum expression_specificity value (default: 0.01)
        limit: Maximum cell types to return

    Returns:
        List of cell types with specificity scores, sorted by specificity descending.

        Example:
        [
            {
                "celltype_name": "Microglia",
                "specificity": 0.045,
                "percentile_rank": None
            }
        ]
    """
    # Select collection
    collection = (
        celltype_gene_descartes if db_type == "DescartesHuman"
        else celltype_gene_hcl
    )

    # Get config defaults if not provided
    config = SPECIFICITY_CONFIG.get(db_type, {})
    if min_specificity is None:
        min_specificity = config.get("min_specificity", 0.01)

    # Query for gene with specificity threshold
    query = {
        "gene": gene_symbol,
        "expression_specificity": {"$gte": min_specificity}
    }

    cursor = collection.find(
        query,
        projection={"_id": 0, "celltype": 1, "expression_specificity": 1}
    ).sort("expression_specificity", -1).limit(limit)

    results = []
    for doc in cursor:
        results.append({
            "celltype_name": doc["celltype"],
            "specificity": doc.get("expression_specificity", 0),
            "percentile_rank": None  # Would need to compute across all genes
        })

    return results


def get_expressing_cell_types(
    gene_symbol: str,
    datasets: List[str] = None,
    require_all: bool = False,
    min_specificity: float = None
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get cell types expressing a gene across datasets.

    Args:
        gene_symbol: HGNC gene symbol
        datasets: List of datasets to query (default: all available)
        require_all: If True, only return cell types present in all datasets
        min_specificity: Minimum specificity threshold (default: 0.01)

    Returns:
        Dict mapping dataset names to cell type lists.
    """
    if datasets is None:
        datasets = ["DescartesHuman", "HumanCellLandscape"]

    results = {}
    for ds in datasets:
        results[ds] = get_cell_specificity(
            gene_symbol, db_type=ds, min_specificity=min_specificity
        )

    if require_all and len(datasets) > 1:
        # Find cell types present in all datasets
        all_celltypes = [
            set(ct["celltype_name"] for ct in results[ds])
            for ds in datasets
        ]
        common = set.intersection(*all_celltypes) if all_celltypes else set()

        for ds in datasets:
            results[ds] = [
                ct for ct in results[ds]
                if ct["celltype_name"] in common
            ]

    return results


# ============================================================
# Antibody Validation Functions (Sprint 6 - Placeholder)
# ============================================================

def get_antibody_status(
    gene_symbol: str,
    source: str = "pcrp"
) -> Optional[Dict[str, Any]]:
    """
    Get antibody validation status for a gene.

    Args:
        gene_symbol: HGNC gene symbol (case-insensitive)
        source: Validation source ("pcrp" currently supported)

    Returns:
        Antibody validation info, or None if not available.

        Example:
        {
            "has_validated_antibody": True,
            "best_antibody": "PCRP-AB-12345",
            "validation_score": "Strong",
            "assays_validated": ["ChIP-seq", "Western"]
        }
    """
    doc = gene_annotations.find_one(
        {"gene_symbol": gene_symbol},
        projection={"antibody_validation": 1},
        collation=CASE_INSENSITIVE_COLLATION
    )

    if doc is None:
        return None

    validation = doc.get("antibody_validation")
    if validation is None:
        return None

    return validation.get(source)


# ============================================================
# Metadata Functions
# ============================================================

def get_collection_stats() -> Dict[str, Any]:
    """
    Get statistics about the gene_annotations collection.

    Returns:
        Dict with collection statistics.
    """
    total = gene_annotations.count_documents({})
    tfs = gene_annotations.count_documents({"is_tf": True})
    with_disease = gene_annotations.count_documents({
        "disease_associations": {"$ne": None}
    })
    with_antibody = gene_annotations.count_documents({
        "antibody_validation": {"$ne": None}
    })

    # Get a sample document for version info
    sample = gene_annotations.find_one({}, projection={"data_versions": 1})
    versions = sample.get("data_versions", {}) if sample else {}

    return {
        "total_genes": total,
        "total_tfs": tfs,
        "genes_with_disease_associations": with_disease,
        "genes_with_antibody_validation": with_antibody,
        "data_versions": versions
    }


# ============================================================
# Gene Browser Functions
# ============================================================

def browse_genes(
    disease: str = None,
    min_disease_score: float = 0.0,
    has_common_variants: bool = None,
    has_rare_variants: bool = None,
    is_tf: bool = None,
    dbd_type: str = None,
    db_type: str = "DescartesHuman",
    cell_types: List[str] = None,
    min_specificity: float = 0.01,
    sort_by: str = "disease_score",
    sort_order: str = "desc",
    page_size: int = 50,
    page: int = 1
) -> Dict[str, Any]:
    """
    Browse genes with filtering by disease, TF status, cell type specificity, etc.

    Args:
        disease: Filter by disease ("alzheimers", "parkinsons", or None for all)
        min_disease_score: Minimum disease association score
        has_common_variants: Filter for genes with common variant evidence
        has_rare_variants: Filter for genes with rare variant evidence
        is_tf: Filter for transcription factors only (True/False/None)
        dbd_type: Filter by DNA-binding domain type
        db_type: Cell atlas for specificity ("DescartesHuman" or "HumanCellLandscape")
        cell_types: List of cell types to filter by (genes must be specific in at least one)
        min_specificity: Minimum expression specificity threshold
        sort_by: Sort field ("disease_score", "gene_symbol", "is_tf")
        sort_order: Sort direction ("asc" or "desc")
        page_size: Results per page
        page: Page number (1-indexed)

    Returns:
        Dict with genes list, total count, and pagination info.
    """
    # Build query
    query = {}

    # Cell type / specificity filtering
    # If min_specificity > 0, filter to genes that meet the threshold in:
    # - Specific cell types (if cell_types provided), OR
    # - ANY cell type (if no cell_types specified)
    gene_filter_by_celltype = None
    if min_specificity > 0:
        collection = celltype_gene_descartes if db_type == "DescartesHuman" else celltype_gene_hcl

        # Build the match stage
        match_criteria = {"expression_specificity": {"$gte": min_specificity}}
        if cell_types and len(cell_types) > 0:
            # Filter to specific cell types
            match_criteria["celltype"] = {"$in": cell_types}

        # Find genes meeting the specificity threshold
        pipeline = [
            {"$match": match_criteria},
            {"$group": {"_id": "$gene"}}
        ]
        matching_genes = [doc["_id"] for doc in collection.aggregate(pipeline)]
        gene_filter_by_celltype = matching_genes

        # If no genes match the specificity filter, return empty result
        if not gene_filter_by_celltype:
            return {
                "genes": [],
                "total": 0,
                "page": page,
                "page_size": page_size
            }

        # Add gene filter to main query
        query["gene_symbol"] = {"$in": gene_filter_by_celltype}

    # Disease filter
    if disease:
        query[f"disease_associations.{disease}.overall_score"] = {"$gte": min_disease_score}
    elif min_disease_score > 0:
        # If no specific disease but min score specified, require either
        query["$or"] = [
            {"disease_associations.alzheimers.overall_score": {"$gte": min_disease_score}},
            {"disease_associations.parkinsons.overall_score": {"$gte": min_disease_score}}
        ]

    # Variant evidence filters
    if has_common_variants is True:
        query["$or"] = query.get("$or", [])
        # Check for non-empty common_variants array in either disease
        if disease:
            query[f"disease_associations.{disease}.evidence.common_variants.0"] = {"$exists": True}
        else:
            common_var_query = {
                "$or": [
                    {"disease_associations.alzheimers.evidence.common_variants.0": {"$exists": True}},
                    {"disease_associations.parkinsons.evidence.common_variants.0": {"$exists": True}}
                ]
            }
            query = {"$and": [query, common_var_query]} if query else common_var_query

    if has_rare_variants is True:
        if disease:
            query[f"disease_associations.{disease}.evidence.rare_variants.0"] = {"$exists": True}
        else:
            rare_var_query = {
                "$or": [
                    {"disease_associations.alzheimers.evidence.rare_variants.0": {"$exists": True}},
                    {"disease_associations.parkinsons.evidence.rare_variants.0": {"$exists": True}}
                ]
            }
            query = {"$and": [query, rare_var_query]} if query else rare_var_query

    # TF filter
    if is_tf is True:
        query["is_tf"] = True
    elif is_tf is False:
        query["$or"] = query.get("$or", [{"is_tf": False}, {"is_tf": {"$exists": False}}])
        query["is_tf"] = {"$ne": True}

    # DBD type filter
    if dbd_type:
        query["tf_metadata.dbd"] = dbd_type

    # Get total count before pagination
    total = gene_annotations.count_documents(query) if query else gene_annotations.estimated_document_count()

    # Build sort
    sort_direction = -1 if sort_order == "desc" else 1
    if sort_by == "disease_score" and disease:
        sort_field = f"disease_associations.{disease}.overall_score"
    elif sort_by == "disease_score":
        # Default to parkinsons score when no specific disease
        sort_field = "disease_associations.parkinsons.overall_score"
    elif sort_by == "is_tf":
        sort_field = "is_tf"
    else:
        sort_field = "gene_symbol"
        sort_direction = 1 if sort_order == "asc" else -1

    # Pagination
    skip = (page - 1) * page_size

    # Execute query
    cursor = gene_annotations.find(
        query,
        projection={
            "_id": 0,
            "gene_symbol": 1,
            "name": 1,
            "ensembl_id": 1,
            "is_tf": 1,
            "tf_metadata": 1,
            "disease_associations": 1
        }
    ).sort(sort_field, sort_direction).skip(skip).limit(page_size)

    # Process results
    genes = []
    gene_symbols = []
    for doc in cursor:
        gene_symbols.append(doc["gene_symbol"])

        # Format disease associations
        disease_assoc = {}
        if doc.get("disease_associations"):
            for d in ["alzheimers", "parkinsons"]:
                assoc = doc["disease_associations"].get(d)
                if assoc:
                    evidence = assoc.get("evidence", {})
                    disease_assoc[d] = {
                        "overall_score": assoc.get("overall_score"),
                        "has_common": bool(evidence.get("common_variants")),
                        "has_rare": bool(evidence.get("rare_variants"))
                    }
                else:
                    disease_assoc[d] = None

        genes.append({
            "gene_symbol": doc["gene_symbol"],
            "name": doc.get("name"),
            "ensembl_id": doc.get("ensembl_id"),
            "is_tf": doc.get("is_tf", False),
            "tf_metadata": doc.get("tf_metadata") if doc.get("is_tf") else None,
            "disease_associations": disease_assoc,
            "top_cell_types": [],  # Will be filled below
            "hpo_count": 0  # Placeholder - computed lazily on expand
        })

    # Add cell type specificity for each gene
    if genes:
        collection = celltype_gene_descartes if db_type == "DescartesHuman" else celltype_gene_hcl

        for gene in genes:
            # Get top cell types for this gene
            cell_query = {
                "gene": gene["gene_symbol"],
                "expression_specificity": {"$gte": min_specificity}
            }

            # If specific cell types requested, filter to those
            if cell_types and len(cell_types) > 0:
                cell_query["celltype"] = {"$in": cell_types}

            cell_cursor = collection.find(
                cell_query,
                projection={"_id": 0, "celltype": 1, "expression_specificity": 1}
            ).sort("expression_specificity", -1).limit(3)

            gene["top_cell_types"] = [
                {"name": c["celltype"], "specificity": c.get("expression_specificity", 0)}
                for c in cell_cursor
            ]

    return {
        "genes": genes,
        "total": total,
        "page": page,
        "page_size": page_size
    }


def get_browse_options(db_type: str = "DescartesHuman") -> Dict[str, Any]:
    """
    Get available filter options for the gene browser.

    Args:
        db_type: Cell atlas to get cell types from

    Returns:
        Dict with lists of available filter values.
    """
    # Get distinct DBD types
    dbd_types = gene_annotations.distinct("tf_metadata.dbd", {"is_tf": True})
    dbd_types = [d for d in dbd_types if d]  # Remove None values

    # Get distinct cell types
    collection = celltype_gene_descartes if db_type == "DescartesHuman" else celltype_gene_hcl
    cell_types = collection.distinct("celltype")

    return {
        "diseases": ["alzheimers", "parkinsons"],
        "dbd_types": sorted(dbd_types),
        "cell_types": sorted(cell_types)
    }


def get_gene_hpo_phenotypes(
    gene_symbol: str,
    db_type: str = "DescartesHuman",
    min_specificity: float = 0.01,
    q_threshold: float = 0.05
) -> Dict[str, Any]:
    """
    Get HPO phenotypes associated with a gene via cell type pathway.

    The pathway is: gene → cell type (where gene is specific) → HPO phenotypes (associated with cell type)

    Args:
        gene_symbol: HGNC gene symbol
        db_type: Cell atlas to use
        min_specificity: Minimum expression specificity for gene-cell association
        q_threshold: Maximum q-value for cell-HPO association

    Returns:
        Dict with gene symbol and list of HPO phenotypes with via_cell_types.
    """
    # Get cell types where gene is specifically expressed
    gene_celltypes = get_cell_specificity(
        gene_symbol,
        db_type=db_type,
        min_specificity=min_specificity,
        limit=50
    )

    if not gene_celltypes:
        return {"gene_symbol": gene_symbol, "phenotypes": []}

    celltype_names = [ct["celltype_name"] for ct in gene_celltypes]

    # Get HPO phenotypes associated with these cell types
    # Use the cell-HPO association collection
    cell_hpo_collection = db[f"celltype_hpo_{db_type}"]

    # Query for all HPO associations with these cell types
    hpo_query = {
        "celltype_name": {"$in": celltype_names},
        "q": {"$lt": q_threshold}
    }

    cursor = cell_hpo_collection.find(
        hpo_query,
        projection={"_id": 0, "hpo_id": 1, "hpo_name": 1, "celltype_name": 1, "q": 1}
    )

    # Group by HPO, collect cell types
    hpo_map = {}
    for doc in cursor:
        hpo_id = doc["hpo_id"]
        if hpo_id not in hpo_map:
            hpo_map[hpo_id] = {
                "hpo_id": hpo_id,
                "name": doc.get("hpo_name", ""),
                "via_cell_types": []
            }
        hpo_map[hpo_id]["via_cell_types"].append(doc["celltype_name"])

    # Convert to list and sort by number of associated cell types
    phenotypes = list(hpo_map.values())
    phenotypes.sort(key=lambda x: len(x["via_cell_types"]), reverse=True)

    return {
        "gene_symbol": gene_symbol,
        "phenotypes": phenotypes[:50]  # Limit to top 50
    }
