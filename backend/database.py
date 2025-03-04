import pprint
from pymongo import MongoClient
from config import MONGODB_URI
from typing import Dict, Optional

# Establish a connection to the MongoDB server
client = MongoClient(MONGODB_URI)

# Access specific collections within the RareDiseaseData database
celltype1 = client["RareDiseaseData"]["hpo_celltype_DescartesHuman"]
celltype2 = client["RareDiseaseData"]["hpo_celltype_HumanCellLandscape"]
severity = client["RareDiseaseData"]["hpo_severity_score"]
gene1 = client["RareDiseaseData"]["celltype_gene_DescartesHuman"]
gene2 = client["RareDiseaseData"]["celltype_gene_HumanCellLandscape"]
hpoADJ_full = client["RareDiseaseData"]["hpoADJ_full"]


def fetch_hpoADJ_full():
    """
    Fetch all documents from the hpoADJ_full collection.

    Returns:
        List of documents with '_id' field removed.
    """
    cursor = hpoADJ_full.find()
    results = []
    for document in cursor:
        document.pop("_id")
        results.append(document)
    return results

def fetch_hpoADJ_filtered(hpoids: list):
    """
    Fetch filtered documents from the hpoADJ_full collection. Filters entries
    based on output from `get_cell_data`.

    Args:
        hpoids (list): The list of hpo ids to query.

    Returns:
        List of documents with '_id' field removed.
    """
    query = {
        "$or": [
            {"source": {"$in": hpoids}},
            {"target": {"$in": hpoids}}
        ]
    }
    cursor = hpoADJ_full.find(query)
    results = []
    for document in cursor:
        document.pop("_id")
        results.append(document)
    return results


def fetch_gene1(
    celltype: str,
    db_type: str,
    expression_specificity_threshold: float = 0.001,
):
    """
    Fetch documents from the gene1 collection based on the celltype and db_type.

    Args:
        celltype (str): The name of the gene to query.
        db_type (str): The type of database to query.
        expression_specificity_threshold (float): Minimum expression specificity threshold.

    Returns:
        List of documents matching the query.
    """
    query = {"celltype": celltype, "expression_specificity": {"$gt": expression_specificity_threshold},}
    if celltype == "All":
        query = {}
    if db_type == "DescartesHuman":
        cursor = gene1.find(query)
        results = []
        for document in cursor:
            document["id"] = str(document.pop("_id"))
            results.append(document)
        return results
    elif db_type == "HumanCellLandscape":
        results = []
        cursor2 = gene2.find(query)
        for document in cursor2:
            document["id"] = str(document.pop("_id"))
            results.append(document)
        return results


def fetch_gene(
    Gene_name: str,
    db_type: str,
):
    """
    Fetch documents from the gene1 or gene2 collection based on the Gene_name and db_type.

    Args:
        Gene_name (str): The name of the gene to query.
        db_type (str): The type of database to query.

    Returns:
        List of documents matching the query.
    """
    query = {"gene": Gene_name}
    if db_type == "DescartesHuman":
        cursor = gene1.find(query)
        results = []
        for document in cursor:
            document["id"] = str(document.pop("_id"))
            results.append(document)
        return results
    elif db_type == "HumanCellLandscape":
        results = []
        cursor2 = gene2.find(query)
        for document in cursor2:
            document["id"] = str(document.pop("_id"))
            results.append(document)
        return results


def fetch_cell_data(db_type: str, query: dict, dry_run: bool = False):
    """
    Fetch documents from the celltype1 or celltype2 collection based on the celltype_name and db_type.

    Args:
        celltype_name (str): The name of the cell type to query.
        db_type (str): The type of database to query.
        dry_run (bool): Just check id data exists.

    Returns:
        List of documents matching the query, or just a boolean value if dry_run
        is True.
    """
    if db_type == "DescartesHuman":
        if dry_run:
            return celltype1.count_documents(query) > 0
        cursor = celltype1.find(query).sort("p", 1)
        results = []
        for document in cursor:
            document["id"] = str(document.pop("_id"))
            query1 = {"hpo_id": document["hpo_id"]}
            item = severity.find(query1).limit(1)
            for itemSub in item:
                document["severity_score_gpt"] = itemSub["severity_score_gpt"]
                document["hpo_name"] = itemSub["hpo_name"]
                document["severity_class"] = itemSub["severity_class"]
            results.append(document)
        return results
    elif db_type == "HumanCellLandscape":
        if dry_run:
            return celltype1.count_documents(query) > 0
        cursor1 = celltype2.find(query).sort("p", 1)
        if dry_run:
            return cursor.count() > 0
        results = []
        for document1 in cursor1:
            document1["id"] = str(document1.pop("_id"))
            query1 = {"hpo_id": document1["hpo_id"]}
            item = severity.find(query1).limit(1)
            for itemSub in item:
                document1["severity_score_gpt"] = itemSub["severity_score_gpt"]
                document1["hpo_name"] = itemSub["hpo_name"]
                document1["severity_class"] = itemSub["severity_class"]
                results.append(document1)
        return results


def fetch_cell_type(db_type: str, query: dict):
    """
    Fetch distinct cell type names from the specified database type based on the query.

    Args:
        db_type (str): The type of database to query.
        query (dict): The query conditions.

    Returns:
        List of distinct cell type names matching the query.
    """
    if db_type == "DescartesHuman":
        cursor = celltype1.find(query, {"_id": 0, "celltype_name": 1}).distinct(
            "celltype_name"
        )
        results = []
        results.extend(cursor)
        return results
    elif db_type == "HumanCellLandscape":
        cursor1 = celltype2.find(query, {"_id": 0, "celltype_name": 1}).distinct(
            "celltype_name"
        )
        results = []
        results.extend(cursor1)
        pprint.pprint(results)
        return results


def fetch_severity_data(
    intellectual_disability: str,
    death: str,
    impaired_mobility: str,
    physical_malformations: str,
    blindness: str,
    sensory_impairments: str,
    immunodeficiency: str,
    cancer: str,
    reduced_fertility: str,
    congenital_onset: str,
    severity_class: str,
    pageSize: int,
    current: int,
    with1: bool,
    without: bool,
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
        with1 (bool): Flag to include certain data.
        without (bool): Flag to exclude certain data.
        skip_values (int): Number of documents to skip.
        limit_values (int): Limit on the number of documents to return.

    Returns:
        List of documents matching the query conditions.
    """
    skip_values = (current - 1) * pageSize
    limit_values = pageSize
    query = {
        "intellectual_disability": {
            "$lte": [int(item) for item in intellectual_disability.split(",")][1],
            "$gte": [int(item) for item in intellectual_disability.split(",")][0],
        },
        "death": {
            "$lte": [int(item) for item in death.split(",")][1],
            "$gte": [int(item) for item in death.split(",")][0],
        },
        "impaired_mobility": {
            "$lte": [int(item) for item in impaired_mobility.split(",")][1],
            "$gte": [int(item) for item in impaired_mobility.split(",")][0],
        },
        "physical_malformations": {
            "$lte": [int(item) for item in physical_malformations.split(",")][1],
            "$gte": [int(item) for item in physical_malformations.split(",")][0],
        },
        "blindness": {
            "$lte": [int(item) for item in blindness.split(",")][1],
            "$gte": [int(item) for item in blindness.split(",")][0],
        },
        "sensory_impairments": {
            "$lte": [int(item) for item in sensory_impairments.split(",")][1],
            "$gte": [int(item) for item in sensory_impairments.split(",")][0],
        },
        "immunodeficiency": {
            "$lte": [int(item) for item in immunodeficiency.split(",")][1],
            "$gte": [int(item) for item in immunodeficiency.split(",")][0],
        },
        "cancer": {
            "$lte": [int(item) for item in cancer.split(",")][1],
            "$gte": [int(item) for item in cancer.split(",")][0],
        },
        "reduced_fertility": {
            "$lte": [int(item) for item in reduced_fertility.split(",")][1],
            "$gte": [int(item) for item in reduced_fertility.split(",")][0],
        },
        "congenital_onset": {
            "$lte": [int(item) for item in congenital_onset.split(",")][1],
            "$gte": [int(item) for item in congenital_onset.split(",")][0],
        },
        "severity_class": {
            "$lte": [int(item) for item in severity_class.split(",")][1],
            "$gte": [int(item) for item in severity_class.split(",")][0],
        },
    }
    if with1 and not without:
        query = {
            **query,
            "$and": [
                {"celltype_name": {"$ne": ""}}, # Non-empty field
                {"celltype_name": {"$exists": True}},  # Field exists
            ],
        }
    if not with1 and without:
        query = {
            **query,
            "$or": [
                {"celltype_name": ""}, # Empty field
                {"celltype_name": {"$exists": False}},  # Field does not exist
            ],
        }
    cursor = (
        severity.find(query)
        .sort("severity_score_gpt", 1)
        .skip(skip_values)
        .limit(limit_values)
    )
    total_count = severity.count_documents(query)
    results = []
    for document in cursor:
        document["id"] = str(document.pop("_id"))
        results.append(document)

    if len(results) > 0:
        results[0]["total"] = total_count

    return results


def fetch_severity_dataByHpoIdNew(hpoId: str):
    """
    Fetch severity data based on the HPO ID.

    Args:
        hpoId (str): The HPO ID to query.

    Returns:
        List of documents matching the query conditions.
    """
    query = {"hpo_id": hpoId}
    cursor = severity.find(query)
    results = []
    for document in cursor:
        document["id"] = str(document.pop("_id"))
        results.append(document)
    return results


def fetch_severity_scores():
    """
    Fetch all severity scores.

    Returns:
        List of all the severity scores.
    """
    cursor = severity.find(projection={"severity_score_gpt": 1})
    scores = [float(document["severity_score_gpt"]) for document in cursor]
    return scores