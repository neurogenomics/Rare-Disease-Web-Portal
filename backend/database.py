import pprint
import json
import os
from pymongo import MongoClient
from config import MONGODB_URI
from typing import Dict, Optional, List

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
):
    """
    Fetch gene therapy candidates by joining severity, cell type, and gene data.

    This performs a multi-collection query to find phenotype-cell-gene associations
    suitable for gene therapy prioritization.

    Args:
        congenital_onset_max (int): Maximum congenital_onset value (0-3).
            Use 1 to exclude congenital (post-natal only).
        severity_min (float): Minimum severity_score_gpt (0-100).
        q_threshold (float): Maximum q-value for cell type association significance.
        db_type (str): Cell atlas to use ("DescartesHuman" or "HumanCellLandscape").
        cell_types (list): List of cell type names to include, or ["All"] for all.
        expression_specificity_min (float): Minimum gene expression specificity (0-1).
        pageSize (int): Number of results per page.
        current (int): Current page number (1-indexed).
        require_terminally_differentiated (bool): If True, only include cell types
            that are terminally differentiated (better for AAV durability).

    Returns:
        List of candidate documents with phenotype, cell type, and gene information.
    """
    skip_values = (current - 1) * pageSize

    # Select the appropriate cell type collection
    celltype_collection = celltype1 if db_type == "DescartesHuman" else celltype2
    gene_collection = gene1 if db_type == "DescartesHuman" else gene2

    # Step 1: Build severity filter query
    severity_query = {
        "congenital_onset": {"$lte": congenital_onset_max},
        "severity_score_gpt": {"$gte": severity_min},
    }

    # Get HPO IDs that meet severity criteria
    severity_cursor = severity.find(severity_query, {
        "hpo_id": 1,
        "hpo_name": 1,
        "severity_score_gpt": 1,
        "severity_class": 1,
        "congenital_onset": 1,
        "death": 1,
        "intellectual_disability": 1,
    })

    severity_map = {}
    for doc in severity_cursor:
        severity_map[doc["hpo_id"]] = {
            "hpo_name": doc["hpo_name"],
            "severity_score_gpt": doc["severity_score_gpt"],
            "severity_class": doc["severity_class"],
            "congenital_onset": doc["congenital_onset"],
            "death": doc.get("death"),
            "intellectual_disability": doc.get("intellectual_disability"),
        }

    if not severity_map:
        return []

    # Step 2: Build cell type filter query
    celltype_query = {
        "hpo_id": {"$in": list(severity_map.keys())},
        "q": {"$lt": q_threshold},
    }

    # Add cell type filter if not "All"
    if cell_types and "All" not in cell_types:
        celltype_query["celltype_name"] = {"$in": cell_types}

    # Get cell type associations
    celltype_cursor = celltype_collection.find(celltype_query).sort("q", 1)

    # Build intermediate results: phenotype + cell type
    phenotype_celltype_pairs = []
    for doc in celltype_cursor:
        hpo_id = doc["hpo_id"]
        if hpo_id in severity_map:
            # Get AAV tractability for this cell type
            aav_info = get_aav_tractability_score(doc["celltype_name"])

            # Skip if we require terminally differentiated and this cell type is not
            if require_terminally_differentiated and not aav_info.get("terminally_differentiated", False):
                continue

            phenotype_celltype_pairs.append({
                "hpo_id": hpo_id,
                "hpo_name": severity_map[hpo_id]["hpo_name"],
                "severity_score_gpt": severity_map[hpo_id]["severity_score_gpt"],
                "severity_class": severity_map[hpo_id]["severity_class"],
                "congenital_onset": severity_map[hpo_id]["congenital_onset"],
                "death": severity_map[hpo_id].get("death"),
                "intellectual_disability": severity_map[hpo_id].get("intellectual_disability"),
                "celltype_name": doc["celltype_name"],
                "q": doc["q"],
                "p": doc.get("p"),
                "aav_tractability": aav_info.get("tractability_score", 0.5),
                "best_serotype": aav_info.get("best_serotype", "Unknown"),
                "terminally_differentiated": aav_info.get("terminally_differentiated", False),
            })

    if not phenotype_celltype_pairs:
        return []

    # Step 3: For each cell type, get genes with high expression specificity
    # Get unique cell types from our results
    unique_celltypes = list(set(pair["celltype_name"] for pair in phenotype_celltype_pairs))

    # Query genes for these cell types
    gene_query = {
        "celltype": {"$in": unique_celltypes},
        "expression_specificity": {"$gte": expression_specificity_min},
    }
    gene_cursor = gene_collection.find(gene_query)

    # Build celltype -> genes map
    celltype_genes = {}
    for doc in gene_cursor:
        ct = doc["celltype"]
        if ct not in celltype_genes:
            celltype_genes[ct] = []
        celltype_genes[ct].append({
            "gene": doc["gene"],
            "expression_specificity": doc["expression_specificity"],
        })

    # Step 4: Join everything together and check for approved therapies
    results = []
    for pair in phenotype_celltype_pairs:
        ct = pair["celltype_name"]
        genes = celltype_genes.get(ct, [])

        # Sort genes by expression_specificity descending
        genes_sorted = sorted(genes, key=lambda x: x["expression_specificity"], reverse=True)

        # Take top 5 genes for each phenotype-celltype pair
        for gene_info in genes_sorted[:5]:
            # Check if this gene already has an approved therapy
            has_approved = check_gene_has_approved_therapy(gene_info["gene"])

            result = {
                **pair,
                "gene": gene_info["gene"],
                "expression_specificity": gene_info["expression_specificity"],
                "celltype_database": db_type,
                "has_approved_therapy": has_approved,
            }
            results.append(result)

    # Sort by severity (descending) then by q-value (ascending)
    results.sort(key=lambda x: (-x["severity_score_gpt"], x["q"]))

    # Count total before pagination
    total_count = len(results)

    # Apply pagination
    paginated_results = results[skip_values:skip_values + pageSize]

    # Add id and total to results
    for i, result in enumerate(paginated_results):
        result["id"] = f"gt_{skip_values + i}"

    if paginated_results:
        paginated_results[0]["total"] = total_count

    return paginated_results


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
    """
    Load AAV tractability data from JSON file.

    Returns:
        Dict mapping cell type names to tractability info.
    """
    global _aav_tractability_cache
    if _aav_tractability_cache is not None:
        return _aav_tractability_cache

    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "aav_tractability.json")
    try:
        with open(data_path, "r") as f:
            data = json.load(f)
            _aav_tractability_cache = {item["celltype"]: item for item in data}
            return _aav_tractability_cache
    except FileNotFoundError:
        return {}


def get_aav_tractability_score(celltype_name: str) -> dict:
    """
    Get AAV tractability score for a cell type.

    Uses fuzzy matching to find the best match.

    Args:
        celltype_name: The cell type name to look up.

    Returns:
        Dict with tractability_score, best_serotype, terminally_differentiated.
    """
    aav_data = load_aav_tractability()

    # Direct match
    if celltype_name in aav_data:
        return aav_data[celltype_name]

    # Normalize and try again
    normalized = celltype_name.lower().replace(" ", "_").replace("-", "_")
    for key, value in aav_data.items():
        if key.lower().replace(" ", "_").replace("-", "_") == normalized:
            return value

    # Partial match
    celltype_lower = celltype_name.lower()
    for key, value in aav_data.items():
        key_lower = key.lower()
        if key_lower in celltype_lower or celltype_lower in key_lower:
            return value

    # Keyword-based defaults
    if any(x in celltype_lower for x in ["neuron", "neur"]):
        return {
            "tractability_score": 0.85,
            "best_serotype": "AAV9",
            "terminally_differentiated": True,
        }
    elif any(x in celltype_lower for x in ["astro", "glia"]):
        return {
            "tractability_score": 0.75,
            "best_serotype": "AAV-PHP.eB",
            "terminally_differentiated": True,
        }
    elif "oligo" in celltype_lower:
        return {
            "tractability_score": 0.55,
            "best_serotype": "AAV9",
            "terminally_differentiated": True,
        }
    elif "micro" in celltype_lower:
        return {
            "tractability_score": 0.15,
            "best_serotype": "None",
            "terminally_differentiated": False,
        }
    else:
        # Default for unknown cell types
        return {
            "tractability_score": 0.40,
            "best_serotype": "AAV9",
            "terminally_differentiated": False,
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
            "gene_symbol": "AADC",
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