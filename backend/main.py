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
)
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS, HOST, PORT
from typing import AsyncIterator, Optional
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


@app.get("/gene/{celltype}/{db_type}")
def gene(celltype: str, db_type: str):
    """
    Fetch gene expression data based on the cell type and database type.

    Args:
        Gene_name (str): The name of the gene to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query conditions.
    """
    celltype = celltype.replace("%", ":")
    response = fetch_gene(celltype, db_type)
    if response:
        return response
    return []


@app.get("/gene1/{Gene_name}/{db_type}")
def gene1(Gene_name: str, db_type: str):
    """
    Fetch gene expression data based on the gene name and database type.

    Args:
        Gene_name (str): The name of the gene to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query conditions.
    """
    Gene_name = Gene_name.replace("%", ":")
    response = fetch_gene1(Gene_name, db_type)
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


if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
