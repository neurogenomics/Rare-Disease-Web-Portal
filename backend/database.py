import pprint
import json
import os
from pymongo import MongoClient
from config import MONGODB_URI
from typing import Dict, Optional, List
from candidate_evidence import ATLAS_NAMES, candidate_associations
from phenotype_associations import get_phenotype_gene_associations

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
    """Query the selected atlas, preserving predictions with unknown severity."""
    if db_type not in ATLAS_NAMES:
        raise ValueError("Unknown cell atlas")
    collection = celltype1 if db_type == "DescartesHuman" else celltype2
    if dry_run:
        return collection.count_documents(query) > 0
    results = []
    for document in collection.find(query).sort("p", 1):
        document["id"] = str(document.pop("_id", ""))
        annotation = severity.find_one({"hpo_id": document["hpo_id"]}) or {}
        document["severity_score_gpt"] = annotation.get("severity_score_gpt")
        document["hpo_name"] = annotation.get("hpo_name", document.get("hpo_name"))
        document["severity_class"] = annotation.get("severity_class")
        results.append(document)
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


def fetch_gene_therapy_candidates(
    congenital_onset_max: int,
    severity_min: float,
    q_threshold: float,
    db_type: str,
    cell_types: list,
    expression_specificity_min: float,
    pageSize: int,
    current: int,
    require_terminally_differentiated: bool = False,
    hpo_ids: Optional[List[str]] = None,
):
    """Source-supported disease/gene/phenotype research associations.

    Shared expression never creates a gene–phenotype edge. The official HPO
    association snapshot supplies that edge and its disease scope. Cell-type
    enrichment is predictive; mechanism, delivery and cargo remain unassessed.
    All filtering occurs before pagination, including CNS ontology scope.
    """
    if db_type not in ATLAS_NAMES:
        raise ValueError("Unknown cell atlas")
    if pageSize < 1 or current < 1:
        raise ValueError("Pagination values must be positive")
    if hpo_ids is not None and not hpo_ids:
        return []
    # No clinically validated terminal-differentiation evidence is loaded.
    if require_terminally_differentiated:
        return []
    cell_collection = celltype1 if db_type == "DescartesHuman" else celltype2
    gene_collection = gene1 if db_type == "DescartesHuman" else gene2
    severity_query = {
        "congenital_onset": {"$gte": 0, "$lte": congenital_onset_max},
        "severity_score_gpt": {"$gte": severity_min, "$lte": 100},
    }
    if hpo_ids is not None:
        severity_query["hpo_id"] = {"$in": list(hpo_ids)}
    severity_rows = list(severity.find(severity_query))
    phenotype_ids = [row["hpo_id"] for row in severity_rows if row.get("hpo_id")]
    if not phenotype_ids:
        return []
    associations = get_phenotype_gene_associations(hpo_ids=phenotype_ids)
    if not associations:
        return []
    cell_query = {"hpo_id": {"$in": phenotype_ids}, "q": {"$gte": 0, "$lt": q_threshold}}
    if cell_types and "All" not in cell_types:
        cell_query["celltype_name"] = {"$in": cell_types}
    cell_rows = list(cell_collection.find(cell_query))
    cells = sorted({row["celltype_name"] for row in cell_rows if row.get("celltype_name")})
    genes = sorted({row["gene_symbol"] for row in associations})
    if not cells or not genes:
        return []
    gene_rows = list(gene_collection.find({
        "celltype": {"$in": cells}, "gene": {"$in": genes},
        "expression_specificity": {"$gte": expression_specificity_min, "$lte": 1},
    }))
    results = candidate_associations(
        severity_rows, cell_rows, gene_rows, associations,
        db_type=db_type, severity_min=severity_min,
        congenital_onset_max=congenital_onset_max, q_threshold=q_threshold,
        expression_specificity_min=expression_specificity_min,
        cell_types=cell_types, hpo_ids=hpo_ids,
    )
    start = (current - 1) * pageSize
    page = results[start:start + pageSize]
    if page:
        page[0]["total"] = len(results)
    return page


def fetch_distinct_cell_types(db_type: str):
    """
    Fetch distinct cell type names from the specified database.

    Args:
        db_type (str): The type of database to query.

    Returns:
        List of distinct cell type names.
    """
    collection = celltype1 if db_type == "DescartesHuman" else celltype2
    return collection.distinct("celltype_name")


def fetch_cns_phenotype_ids():
    """
    Fetch HPO IDs that are descendants of HP:0000707 (Abnormality of the nervous system).

    Uses the hpoADJ_full collection to traverse the ontology graph.

    Returns:
        List of HPO IDs that are CNS-related phenotypes.
    """
    # HP:0000707 is "Abnormality of the nervous system"
    root_id = "HP:0000707"

    # Build adjacency map from the full HPO graph
    # In hpoADJ_full, "source" is parent, "target" is child
    cursor = hpoADJ_full.find({}, {"source": 1, "target": 1})

    parent_to_children = {}
    for doc in cursor:
        parent = doc.get("source")
        child = doc.get("target")
        if parent and child:
            if parent not in parent_to_children:
                parent_to_children[parent] = []
            parent_to_children[parent].append(child)

    # BFS to find all descendants
    cns_ids = set([root_id])
    queue = [root_id]

    while queue:
        current = queue.pop(0)
        children = parent_to_children.get(current, [])
        for child in children:
            if child not in cns_ids:
                cns_ids.add(child)
                queue.append(child)

    return list(cns_ids)


# Load AAV tractability data from JSON file
_aav_tractability_cache = None

def load_aav_tractability() -> Dict[str, dict]:
    """List legacy cell labels without serving unsupported numeric suitability.

    The historic file contains heuristic values with no species/route/dose or
    primary evidence. Retaining those numbers as clinical scores would give
    false precision, including mouse PHP.eB rankings as human recommendations.
    """
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "aav_tractability.json")
    try:
        with open(data_path) as handle:
            rows = json.load(handle)
    except FileNotFoundError:
        return {}
    return {row["celltype"]: get_aav_tractability_score(row["celltype"]) for row in rows}


def get_aav_tractability_score(celltype_name: str) -> dict:
    """No context-free cell-name lookup can establish human AAV feasibility."""
    return {
        "celltype": celltype_name,
        "tractability_score": None,
        "best_serotype": None,
        "terminally_differentiated": None,
        "evidence_status": "not_assessed",
        "notes": "Requires sourced species, tissue, route, dose, capsid, promoter and age context; legacy heuristic scores were withdrawn.",
    }


# Load approved gene therapies data
_approved_therapies_cache = None

def load_approved_therapies() -> List[dict]:
    """
    Load approved gene therapies data.

    This data is curated from FDA and EMA approval lists.

    Returns:
        List of approved therapy records.
    """
    global _approved_therapies_cache
    if _approved_therapies_cache is not None:
        return _approved_therapies_cache

    # Inline data for approved therapies (curated list)
    _approved_therapies_cache = [
        {
            "id": 1,
            "brand_name": "Zolgensma",
            "gene_symbol": "SMN1",
            "disease_name": "Spinal Muscular Atrophy (SMA)",
            "indication": "Treatment of pediatric patients with SMA with bi-allelic mutations in the SMN1 gene",
            "modality": "AAV9",
            "company": "Novartis",
            "approval_year": 2019,
            "approval_agency": "FDA, EMA",
            "category": "CNS",
            "delivery_route": "IV",
        },
        {
            "id": 2,
            "brand_name": "Luxturna",
            "gene_symbol": "RPE65",
            "disease_name": "Inherited Retinal Dystrophy",
            "indication": "Treatment of patients with confirmed biallelic RPE65 mutation-associated retinal dystrophy",
            "modality": "AAV2",
            "company": "Spark Therapeutics",
            "approval_year": 2017,
            "approval_agency": "FDA, EMA",
            "category": "Ophthalmology",
            "delivery_route": "Subretinal",
        },
        {
            "id": 3,
            "brand_name": "Upstaza",
            "gene_symbol": "DDC",
            "disease_name": "AADC Deficiency",
            "indication": "Treatment of patients with aromatic L-amino acid decarboxylase (AADC) deficiency",
            "modality": "AAV2",
            "company": "PTC Therapeutics",
            "approval_year": 2022,
            "approval_agency": "EMA",
            "category": "CNS",
            "delivery_route": "Intracranial",
        },
        {
            "id": 4,
            "brand_name": "Skysona",
            "gene_symbol": "ABCD1",
            "disease_name": "Cerebral Adrenoleukodystrophy",
            "indication": "Treatment of early cerebral adrenoleukodystrophy",
            "modality": "Lentivirus",
            "company": "Bluebird Bio",
            "approval_year": 2022,
            "approval_agency": "FDA",
            "category": "CNS",
            "delivery_route": "Ex vivo HSCT",
        },
        {
            "id": 5,
            "brand_name": "Elevidys",
            "gene_symbol": "DMD",
            "disease_name": "Duchenne Muscular Dystrophy",
            "indication": "Treatment of ambulatory pediatric patients with Duchenne muscular dystrophy",
            "modality": "AAVrh74",
            "company": "Sarepta",
            "approval_year": 2023,
            "approval_agency": "FDA",
            "category": "Neuromuscular",
            "delivery_route": "IV",
        },
        {
            "id": 6,
            "brand_name": "Hemgenix",
            "gene_symbol": "F9",
            "disease_name": "Hemophilia B",
            "indication": "Treatment of adults with Hemophilia B",
            "modality": "AAV5",
            "company": "CSL Behring",
            "approval_year": 2022,
            "approval_agency": "FDA, EMA",
            "category": "Hematology",
            "delivery_route": "IV",
        },
        {
            "id": 7,
            "brand_name": "Roctavian",
            "gene_symbol": "F8",
            "disease_name": "Hemophilia A",
            "indication": "Treatment of severe hemophilia A in adults",
            "modality": "AAV5",
            "company": "BioMarin",
            "approval_year": 2023,
            "approval_agency": "FDA, EMA",
            "category": "Hematology",
            "delivery_route": "IV",
        },
        {
            "id": 8,
            "brand_name": "Casgevy",
            "gene_symbol": "BCL11A",
            "disease_name": "Sickle Cell Disease",
            "indication": "Treatment of sickle cell disease and transfusion-dependent beta-thalassemia",
            "modality": "CRISPR/Cas9",
            "company": "Vertex/CRISPR Therapeutics",
            "approval_year": 2023,
            "approval_agency": "FDA, EMA",
            "category": "Hematology",
            "delivery_route": "Ex vivo",
        },
        {
            "id": 9,
            "brand_name": "Libmeldy",
            "gene_symbol": "ARSA",
            "disease_name": "Metachromatic Leukodystrophy",
            "indication": "Treatment of early-onset metachromatic leukodystrophy",
            "modality": "Lentivirus",
            "company": "Orchard Therapeutics",
            "approval_year": 2020,
            "approval_agency": "EMA",
            "category": "CNS/Lysosomal",
            "delivery_route": "Ex vivo HSCT",
        },
        {
            "id": 10,
            "brand_name": "Strimvelis",
            "gene_symbol": "ADA",
            "disease_name": "ADA-SCID",
            "indication": "Treatment of severe combined immunodeficiency due to adenosine deaminase deficiency",
            "modality": "Retrovirus",
            "company": "Orchard Therapeutics",
            "approval_year": 2016,
            "approval_agency": "EMA",
            "category": "Immunology",
            "delivery_route": "Ex vivo HSCT",
        },
    ]
    for therapy in _approved_therapies_cache:
        therapy["snapshot_commit"] = "6820916"
        therapy["current_approval_verified"] = False
        therapy["evidence_status"] = "legacy_reference_requires_regulatory_review"
    return _approved_therapies_cache


def fetch_approved_therapies(
    gene: str = None,
    modality: str = None,
    category: str = None,
) -> List[dict]:
    """
    Fetch approved gene therapies with optional filtering.

    Args:
        gene: Filter by gene symbol (optional).
        modality: Filter by modality type (optional).
        category: Filter by disease category (optional).

    Returns:
        List of approved therapy records.
    """
    therapies = load_approved_therapies()

    if gene:
        therapies = [t for t in therapies if gene.upper() in t["gene_symbol"].upper()]

    if modality:
        therapies = [t for t in therapies if modality.lower() in t["modality"].lower()]

    if category:
        therapies = [t for t in therapies if category.lower() in t["category"].lower()]

    return therapies


def check_gene_has_approved_therapy(gene_symbol: str) -> bool:
    """
    Check if a gene already has an approved gene therapy.

    Args:
        gene_symbol: The gene symbol to check.

    Returns:
        True if an approved therapy exists for this gene.
    """
    therapies = load_approved_therapies()
    gene_upper = gene_symbol.upper()
    return any(t["gene_symbol"].upper() == gene_upper for t in therapies)