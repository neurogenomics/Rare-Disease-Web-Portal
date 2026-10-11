from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI, Query
from database import (
    fetch_hpoADJ_filtered,
    fetch_severity_data,
    fetch_cell_data,
    fetch_cell_type,
    fetch_severity_dataByHpoIdNew,
    fetch_gene,
    fetch_gene1,
    fetch_hpoADJ_full,
    fetch_severity_scores,
    fetch_gene_therapy_candidates,
    fetch_distinct_cell_types,
    fetch_cns_phenotype_ids,
    fetch_approved_therapies,
    get_aav_tractability_score,
    load_aav_tractability,
)
from gene_annotations import (
    get_tf_status,
    get_tf_status_batch,
    get_gene as get_gene_annotation,
    get_disease_associations,
    get_genes_by_disease,
    get_cell_specificity,
    get_expressing_cell_types,
    get_antibody_status,
    get_collection_stats,
    search_genes,
    browse_genes,
    get_browse_options,
    get_gene_hpo_phenotypes,
    get_specificity_percentiles,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from config import CORS_ORIGINS, HOST, PORT
from typing import AsyncIterator, Optional, List, Literal
from pydantic import BaseModel
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache
import logging

log = logging.getLogger("uvicorn.error")


# Setup in-memory cache
@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    FastAPICache.init(InMemoryBackend())
    yield


# Create an instance of the FastAPI application
app = FastAPI(lifespan=lifespan)

# Add CORS middleware to the FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/hpj")
def hpj():
    """
    Fetch all documents from the hpoADJ_full collection.

    Returns:
        List of documents with '_id' field removed.
    """
    response = fetch_hpoADJ_full()
    if response:
        return response
    return []


@app.get("/api/hpjFiltered")
def hpj_filtered(
    celltype_name: str = Query(...),
    q: float = Query(...),
    db_type: str = Query(...),
):
    """
    Fetch filtered documents from the hpoADJ_full collection. Filters entries
    based on output from `get_cell_data`.

    Args:
        celltype_name (str): The name of the cell type to query.
        q (float): The q value to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents with '_id' field removed.
    """
    cell_data_query = {
        "celltype_name": celltype_name,
        "q": {"$lt": q},
    }
    if celltype_name == "All":
        cell_data_query.pop("celltype_name")
    cell_data = fetch_cell_data(db_type, cell_data_query,)
    if not cell_data:
        return []
    hpo_ids = [entry["hpo_id"] for entry in cell_data]

    response = fetch_hpoADJ_filtered(hpo_ids)
    if response:
        return response
    return []


@app.get("/api/cellByHpoid1")
def get_cell_data_hpoid1(
    hpo_id: str = Query(...),
    db_type: str = Query(...),
    dry_run: Optional[bool] = False,  # Just check if the data exists
):
    """
    Fetch cell data based on HPO ID and database type.

    Args:
        hpo_id (str): The HPO ID to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query conditions.
    """
    query = {
        "hpo_id": hpo_id,
        "q": {"$lt": 0.99999},  # Filter out all cells with practically no association
    }
    response = fetch_cell_data(db_type, query, dry_run)
    if dry_run:
        return response
    if response:
        return response
    return []


@app.get("/api/cellByHpoid")
def get_cell_data_hpoid(
    hpo_id: str = Query(...),
):
    """
    Fetch cell data based on HPO ID from both DescartesHuman and HumanCellLandscape databases.

    Args:
        hpo_id (str): The HPO ID to query.

    Returns:
        List of documents matching the query conditions.
    """
    query = {
        "hpo_id": hpo_id,
    }
    response = fetch_cell_data("DescartesHuman", query)
    res = []
    if response:
        res.extend(response)
    response = fetch_cell_data("HumanCellLandscape", query)
    if response:
        res.extend(response)
        return res


@app.get("/api/cell/type")
def get_cell_type(
    celltype_name: str = Query(...),
    db_type: str = Query(...),
):
    """
    Fetch cell type data based on cell type name and database type.

    Args:
        celltype_name (str): The name of the cell type to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query conditions.
    """
    query = {
        "celltype_name": {"$regex": celltype_name, "$options": "i"},
    }
    response = fetch_cell_type(db_type, query)
    # print(response)
    if response:
        return response
    return []


@app.get("/api/cell")
def get_cell_data(
    celltype_name: str = Query(...),
    q: float = Query(...),
    db_type: str = Query(...),
):
    """
    Fetch cell data based on various query parameters.

    Args:
        celltype_name (str): The name of the cell type to query.
        q (float): The q value to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query conditions.
    """
    query = {
        "celltype_name": celltype_name,
        "q": {"$lt": q},
    }
    if celltype_name == "All":
        query.pop("celltype_name")
    response = fetch_cell_data(db_type, query)
    if response:
        return response
    return []


@app.get("/api/severity")
def get_severity_data(
    intellectual_disability: str = Query(...),
    death: str = Query(...),
    impaired_mobility: str = Query(...),
    physical_malformations: str = Query(...),
    blindness: str = Query(...),
    sensory_impairments: str = Query(...),
    immunodeficiency: str = Query(...),
    cancer: str = Query(...),
    reduced_fertility: str = Query(...),
    congenital_onset: str = Query(...),
    severity_class: str = Query(...),
    pageSize: int = Query(...),
    current: int = Query(...),
    with1: bool = Query(...),
    without: bool = Query(...),
):
    """
    Fetch severity data based on various disease-related indicators.

    Args:
        intellectual_disability (str): Indicator for intellectual disability.
        death (str): Indicator for death.
        impaired_mobility (str): Indicator for impaired mobility.
        physical_malformations (str): Indicator for physical malformations.
        blindness (str): Indicator for blindness.
        sensory_impairments (str): Indicator for sensory impairments.
        immunodeficiency (str): Indicator for immunodeficiency.
        cancer (str): Indicator for cancer.
        reduced_fertility (str): Indicator for reduced fertility.
        congenital_onset (str): Indicator for congenital onset.
        severity_class (str): Indicator for severity class.
        pageSize (int): Number of documents per page.
        current (int): Current page number.
        with1 (bool): Flag to include certain data.
        without (bool): Flag to exclude certain data.

    Returns:
        List of documents matching the query conditions.
    """
    if not with1 and not without:
        return []
    response = fetch_severity_data(
        intellectual_disability,
        death,
        impaired_mobility,
        physical_malformations,
        blindness,
        sensory_impairments,
        immunodeficiency,
        cancer,
        reduced_fertility,
        congenital_onset,
        severity_class,
        pageSize,
        current,
        with1,
        without,
    )
    print(response)
    if response:
        return response
    return []


@app.get("/api/hpo-definitionNew/{hpo_id}")
def hpo_definition_new(hpo_id: str):
    """
    Fetch severity data based on the HPO ID.

    Args:
        hpo_id (str): The HPO ID to query.

    Returns:
        List of documents matching the query conditions.
    """
    hpo_id = hpo_id.replace("%", ":")
    response = fetch_severity_dataByHpoIdNew(hpo_id)
    print(response)
    if response:
        return response
    return []


@app.get("/gene1/{celltype}/{db_type}")
def gene1(celltype: str, db_type: str = None):
    """
    Fetch gene expression data based on the cell type and database type.

    Args:
        celltype (str): The name of the cell type to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query conditions.
    """
    celltype = celltype.replace("%", ":")
    response = fetch_gene1(celltype, db_type)
    if response:
        return response
    return []


@app.get("/gene/{Gene_name}/{db_type}")
def gene(Gene_name: str, db_type: str):
    """
    Fetch gene expression data for associated cells based on the HPO ID and
    database type.

    Args:
        Gene_name (str): The name of the gene to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query conditions.
    """
    Gene_name = Gene_name.replace("%", ":")
    response = fetch_gene(Gene_name, db_type)
    if response:
        return response
    return []


@app.get("/api/severity-scores")
@cache(expire=36000, namespace="severity-scores")  # Cache for 10 hours
def severity_scores():
    """
    Fetch severity scores.

    Returns:
        List of all the severity scores.
    """
    log.info("Fetching severity scores.")
    return fetch_severity_scores()


@app.get("/api/gene-therapy")
def get_gene_therapy_candidates(
    congenital_onset_max: int = Query(1, ge=0, le=3, description="Maximum legacy GPT congenital-onset annotation; not a measured patient age"),
    severity_min: float = Query(20.0, ge=0, le=100, description="Minimum legacy GPT phenotype severity annotation (0-100)"),
    q_threshold: float = Query(0.05, gt=0, le=1, description="Maximum q-value for enrichment prediction"),
    db_type: Literal["DescartesHuman", "HumanCellLandscape"] = Query("DescartesHuman", description="Cell atlas"),
    cell_types: str = Query("All", description="Comma-separated cell types or 'All'"),
    expression_specificity_min: float = Query(0.1, ge=0, le=1, description="Minimum expression specificity (0-1)"),
    cns_only: bool = Query(True, description="Filter to CNS phenotypes only"),
    terminally_differentiated_only: bool = Query(False, description="Require sourced terminal differentiation; currently unavailable, so this filter returns no rows"),
    pageSize: int = Query(20, ge=1, le=500, description="Results per page"),
    current: int = Query(1, ge=1, description="Page number"),
):
    """
    Explore source-supported disease/gene/phenotype research associations with
    atlas enrichment predictions. The HPO source must support the exact gene,
    phenotype and disease combination; expression alone never creates an edge.
    This endpoint does not establish variant causality, a causal cell type,
    mechanism, delivery, cargo compatibility or therapeutic suitability. Unknown
    evidence remains null and does not pass an affirmative feasibility filter.
    """
    # Parse cell_types from comma-separated string to list
    cell_types_list = [ct.strip() for ct in cell_types.split(",")] if cell_types != "All" else ["All"]

    response = fetch_gene_therapy_candidates(
        congenital_onset_max=congenital_onset_max,
        severity_min=severity_min,
        q_threshold=q_threshold,
        db_type=db_type,
        cell_types=cell_types_list,
        expression_specificity_min=expression_specificity_min,
        pageSize=pageSize,
        current=current,
        require_terminally_differentiated=terminally_differentiated_only,
        hpo_ids=fetch_cns_phenotype_ids() if cns_only else None,
    )

    if response:
        return response
    return []


@app.get("/api/gene-therapy/cell-types")
def get_gene_therapy_cell_types(
    db_type: str = Query("DescartesHuman", description="Cell atlas to query"),
):
    """
    Get list of available cell types for gene therapy filtering.

    Returns:
        List of distinct cell type names.
    """
    response = fetch_distinct_cell_types(db_type)
    if response:
        return response
    return []


@app.get("/api/gene-therapy/cns-phenotypes")
@cache(expire=36000, namespace="cns-phenotypes")  # Cache for 10 hours
def get_cns_phenotype_ids():
    """
    Get list of HPO IDs that are CNS-related (descendants of HP:0000707).

    Returns:
        List of HPO IDs for CNS phenotypes.
    """
    log.info("Fetching CNS phenotype IDs.")
    return fetch_cns_phenotype_ids()


@app.get("/api/approved-therapies")
def get_approved_therapies(
    gene: Optional[str] = Query(None, description="Filter by gene symbol"),
    modality: Optional[str] = Query(None, description="Filter by modality (AAV, Lentivirus, etc.)"),
    category: Optional[str] = Query(None, description="Filter by disease category (CNS, Hematology, etc.)"),
):
    """
    Get legacy gene-therapy reference records from commit 6820916.
    Current approval, indication and safety status have not been verified for
    these records. They must not establish current treatment availability.

    Returns:
        List of approved gene therapy records.
    """
    response = fetch_approved_therapies(gene=gene, modality=modality, category=category)
    if response:
        return response
    return []


@app.get("/api/aav-tractability")
@cache(expire=36000, namespace="aav-tractability")  # Cache for 10 hours
def get_aav_tractability():
    """
    Get unassessed delivery-evidence placeholders for legacy cell labels.

    Returns:
        Cell labels with null scores. Unvalidated heuristic rankings are retired.
    """
    log.info("Fetching AAV tractability data.")
    return load_aav_tractability()


@app.get("/api/aav-tractability/{celltype}")
def get_celltype_tractability(celltype: str):
    """
    Get AAV tractability score for a specific cell type.

    Args:
        celltype: The cell type name to look up.

    Returns:
        Tractability data for the cell type.
    """
    celltype = celltype.replace("%", " ").replace("_", " ")
    return get_aav_tractability_score(celltype)


# ============================================================
# Gene Annotation Endpoints
# ============================================================

class BatchGenesRequest(BaseModel):
    """Request body for batch gene lookup."""
    genes: List[str]


@app.get("/api/gene/{symbol}")
@cache(expire=3600, namespace="gene-annotation")
def get_gene_full(symbol: str):
    """
    Get complete gene annotation including TF status, disease associations,
    and cell type specificity.

    Args:
        symbol: HGNC gene symbol (case-insensitive)

    Returns:
        Complete gene annotation, or 404 if not found.
    """
    gene = get_gene_annotation(symbol)
    if gene is None:
        raise HTTPException(status_code=404, detail=f"Gene '{symbol}' not found")

    # Add cell specificity data (cross-reference, not stored)
    gene["cell_specificity"] = {
        "DescartesHuman": get_cell_specificity(symbol, db_type="DescartesHuman", limit=10),
        "HumanCellLandscape": get_cell_specificity(symbol, db_type="HumanCellLandscape", limit=10),
    }

    return gene


@app.get("/api/gene/{symbol}/tf")
@cache(expire=3600, namespace="gene-tf")
def get_gene_tf(symbol: str):
    """
    Get transcription factor status for a gene.

    Args:
        symbol: HGNC gene symbol (case-insensitive)

    Returns:
        TF metadata if gene is a TF, or message if not a TF.
    """
    result = get_tf_status(symbol)
    if result is None:
        # Check if gene exists at all
        gene = get_gene_annotation(symbol)
        if gene is None:
            raise HTTPException(status_code=404, detail=f"Gene '{symbol}' not found")
        return {"is_tf": False, "message": f"'{symbol}' is not a transcription factor"}

    return result


@app.get("/api/gene/{symbol}/disease")
@cache(expire=3600, namespace="gene-disease")
def get_gene_disease(
    symbol: str,
    disease: Optional[str] = Query(None, description="Filter by disease: 'alzheimers' or 'parkinsons'"),
    min_score: Optional[float] = Query(None, description="Minimum overall score threshold"),
):
    """
    Get disease associations for a gene.

    Args:
        symbol: HGNC gene symbol (case-insensitive)
        disease: Optional disease filter
        min_score: Optional minimum score filter

    Returns:
        Disease associations with evidence, or empty dict if none.
    """
    result = get_disease_associations(symbol, disease=disease)

    if result is None:
        raise HTTPException(status_code=404, detail=f"Gene '{symbol}' not found")

    # Apply min_score filter if provided
    if min_score is not None and result:
        result = {
            k: v for k, v in result.items()
            if v.get("overall_score", 0) >= min_score
        }

    return result


@app.get("/api/gene/{symbol}/cells")
@cache(expire=3600, namespace="gene-cells")
def get_gene_cells(
    symbol: str,
    db_type: str = Query("DescartesHuman", description="Cell atlas: DescartesHuman or HumanCellLandscape"),
    min_specificity: float = Query(0.01, description="Minimum expression specificity"),
    limit: int = Query(20, description="Maximum cell types to return"),
):
    """
    Get cell type specificity for a gene.

    Args:
        symbol: HGNC gene symbol
        db_type: Cell atlas to query
        min_specificity: Minimum specificity threshold
        limit: Maximum results

    Returns:
        List of cell types with specificity scores.
    """
    result = get_cell_specificity(
        symbol,
        db_type=db_type,
        min_specificity=min_specificity,
        limit=limit
    )
    return result


@app.get("/api/gene/{symbol}/antibody")
@cache(expire=3600, namespace="gene-antibody")
def get_gene_antibody(
    symbol: str,
    source: str = Query("pcrp", description="Validation source"),
):
    """
    Get antibody validation status for a gene.

    Args:
        symbol: HGNC gene symbol
        source: Validation source (currently 'pcrp')

    Returns:
        Antibody validation info, or null if not available.
    """
    result = get_antibody_status(symbol, source=source)
    return result or {"has_validated_antibody": False}


@app.post("/api/genes/batch")
def get_genes_batch(request: BatchGenesRequest):
    """
    Get annotations for multiple genes in a single request.

    Args:
        genes: List of HGNC gene symbols

    Returns:
        Dict mapping gene symbols to their annotations.
    """
    if len(request.genes) > 100:
        raise HTTPException(
            status_code=400,
            detail="Maximum 100 genes per batch request"
        )

    results = {}
    tf_batch = get_tf_status_batch(request.genes)

    for symbol in request.genes:
        gene = get_gene_annotation(symbol)
        if gene:
            gene["tf_status"] = tf_batch.get(symbol)
            results[symbol] = gene
        else:
            results[symbol] = None

    return results


@app.get("/api/genes/by-disease/{disease}")
@cache(expire=3600, namespace="genes-by-disease")
def get_genes_disease_list(
    disease: str,
    min_score: float = Query(0.3, description="Minimum overall score"),
    limit: int = Query(50, description="Maximum genes to return"),
):
    """
    Get genes associated with a disease, sorted by score.

    Args:
        disease: Disease name ('alzheimers' or 'parkinsons')
        min_score: Minimum score threshold
        limit: Maximum results

    Returns:
        List of genes with disease scores.
    """
    if disease not in ["alzheimers", "parkinsons"]:
        raise HTTPException(
            status_code=400,
            detail="Disease must be 'alzheimers' or 'parkinsons'"
        )

    return get_genes_by_disease(disease, min_score=min_score, limit=limit)


@app.get("/api/genes/tfs")
@cache(expire=3600, namespace="genes-tfs")
def get_genes_tfs(
    limit: int = Query(100, description="Maximum TFs to return"),
):
    """
    Get list of all transcription factors.

    Args:
        limit: Maximum results

    Returns:
        List of TF records.
    """
    from gene_annotations import get_all_tfs
    return get_all_tfs(limit=limit)


@app.get("/api/genes/search")
def search_genes_api(
    q: str = Query(..., description="Search query (gene symbol prefix)"),
    limit: int = Query(20, description="Maximum results"),
):
    """
    Search for genes by symbol or alias prefix.

    Args:
        q: Search query
        limit: Maximum results

    Returns:
        List of matching genes.
    """
    return search_genes(q, limit=limit)


@app.get("/api/genes/metadata")
@cache(expire=3600, namespace="genes-metadata")
def get_genes_metadata():
    """
    Get metadata about the gene_annotations collection.

    Returns:
        Collection statistics and data versions.
    """
    return get_collection_stats()


# ============================================================
# Gene Browser Endpoints
# ============================================================

# NOTE: More specific routes must come BEFORE more general routes in FastAPI
# /api/genes/browse/options must be defined before /api/genes/browse

@app.get("/api/genes/browse/options")
@cache(expire=3600, namespace="browse-options")
def browse_genes_options(
    db_type: str = Query("DescartesHuman", description="Cell atlas for cell type list"),
):
    """
    Get available filter options for the gene browser.

    Returns lists of diseases, DBD types, and cell types.
    """
    return get_browse_options(db_type=db_type)


@app.get("/api/genes/browse/percentiles")
@cache(expire=3600, namespace="browse-percentiles")
def get_specificity_percentiles_api(
    db_type: str = Query("DescartesHuman", description="Cell atlas: DescartesHuman or HumanCellLandscape"),
    cell_type: Optional[str] = Query(None, description="Optional cell type to scope percentiles"),
):
    """
    Get specificity percentile thresholds for the slider.

    Returns thresholds for "Top X%" where X is 1, 5, 10, 25, or 50.
    - "Top 1%" means genes in the 99th percentile of specificity (most specific)
    - "Top 50%" means genes in the top half of specificity

    If cell_type is provided, percentiles are computed within that cell type's distribution.
    """
    return get_specificity_percentiles(db_type, cell_type)


@app.get("/api/genes/browse")
def browse_genes_api(
    disease: Optional[str] = Query(None, description="Filter by disease: 'alzheimers' or 'parkinsons'"),
    min_disease_score: float = Query(0.0, description="Minimum disease association score"),
    has_common_variants: Optional[bool] = Query(None, description="Filter for common variant evidence"),
    has_rare_variants: Optional[bool] = Query(None, description="Filter for rare variant evidence"),
    is_tf: Optional[bool] = Query(None, description="Filter for transcription factors"),
    dbd_type: Optional[str] = Query(None, description="Filter by DNA-binding domain type"),
    db_type: str = Query("DescartesHuman", description="Cell atlas: DescartesHuman or HumanCellLandscape"),
    cell_types: Optional[str] = Query(None, description="Comma-separated cell types to filter by"),
    min_specificity: float = Query(0.01, description="Minimum expression specificity"),
    sort_by: str = Query("disease_score", description="Sort field: disease_score, gene_symbol, is_tf"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    pageSize: int = Query(50, description="Results per page"),
    current: int = Query(1, description="Page number"),
):
    """
    Browse genes with filtering by disease association, TF status, cell type specificity, etc.

    Returns paginated list of genes with disease associations, TF metadata, and top cell types.
    """
    # Parse cell_types from comma-separated string
    cell_types_list = None
    if cell_types:
        cell_types_list = [ct.strip() for ct in cell_types.split(",") if ct.strip()]

    return browse_genes(
        disease=disease,
        min_disease_score=min_disease_score,
        has_common_variants=has_common_variants,
        has_rare_variants=has_rare_variants,
        is_tf=is_tf,
        dbd_type=dbd_type,
        db_type=db_type,
        cell_types=cell_types_list,
        min_specificity=min_specificity,
        sort_by=sort_by,
        sort_order=sort_order,
        page_size=pageSize,
        page=current
    )


@app.get("/api/gene/{symbol}/hpo")
@cache(expire=3600, namespace="gene-hpo")
def get_gene_hpo(
    symbol: str,
    db_type: Literal["DescartesHuman", "HumanCellLandscape"] = Query("DescartesHuman", description="Cell atlas to use"),
    min_specificity: float = Query(0.01, ge=0, le=1, description="Minimum expression specificity for gene-cell"),
    q_threshold: float = Query(0.05, gt=0, le=1, description="Maximum q-value for cell-HPO association"),
):
    """
    Get source-supported gene/phenotype associations with disease context.
    Cell enrichment predictions decorate existing source associations; they do
    not create gene–phenotype causality. These data are not variant-specific.
    """
    return get_gene_hpo_phenotypes(
        gene_symbol=symbol,
        db_type=db_type,
        min_specificity=min_specificity,
        q_threshold=q_threshold
    )


if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
