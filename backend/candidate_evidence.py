"""Conservative joins for research associations, without therapy suitability scores."""

import hashlib
import math
from numbers import Real

from phenotype_associations import ASSOCIATION_KIND

ATLAS_NAMES = {"DescartesHuman", "HumanCellLandscape"}


def finite_number(value, lower=None, upper=None):
    # bool is a subclass of int, but is not a measured score.
    if isinstance(value, bool) or not isinstance(value, Real) or not math.isfinite(value):
        return None
    if lower is not None and value < lower or upper is not None and value > upper:
        return None
    return float(value)


def candidate_associations(severity_rows, cell_rows, gene_rows, associations, *,
                           db_type, severity_min, congenital_onset_max,
                           q_threshold, expression_specificity_min,
                           cell_types=None, hpo_ids=None,
                           require_terminally_differentiated=False):
    """Join only the exact HPO/gene/disease context supplied by source evidence.

    Expression and enrichment remain predictions. No input establishes delivery,
    disease mechanism, cargo capacity or therapeutic suitability. Unknown values
    cannot pass an affirmative feasibility requirement or a numeric threshold.
    """
    if db_type not in ATLAS_NAMES:
        raise ValueError("Unknown cell atlas")
    for name, value, lower, upper in [
        ("severity_min", severity_min, 0, 100),
        ("congenital_onset_max", congenital_onset_max, 0, 3),
        ("q_threshold", q_threshold, 0, 1),
        ("expression_specificity_min", expression_specificity_min, 0, 1),
    ]:
        if finite_number(value, lower, upper) is None:
            raise ValueError(f"Invalid {name}")
    # Historic cell-name heuristics cannot establish this requirement.
    if require_terminally_differentiated:
        return []
    allowed_hpos = None if hpo_ids is None else set(hpo_ids)
    allowed_cells = set(cell_types or []) - {"All"}
    severity_by_hpo = {}
    for row in severity_rows:
        hpo_id = row.get("hpo_id")
        score = finite_number(row.get("severity_score_gpt"), 0, 100)
        onset = finite_number(row.get("congenital_onset"), 0, 3)
        if (not hpo_id or score is None or onset is None or score < severity_min
                or onset > congenital_onset_max or allowed_hpos is not None and hpo_id not in allowed_hpos):
            continue
        severity_by_hpo[hpo_id] = row
    support = {}
    for association in associations:
        if (association.get("association_kind") != ASSOCIATION_KIND
                or association.get('isPhenotypicAbnormality') is False
                or not association.get("disease_id") or not association.get("source_url")
                or not association.get("source_sha256")):
            continue
        hpo_id, gene = association.get("hpo_id"), association.get("gene_symbol")
        if hpo_id not in severity_by_hpo or not gene:
            continue
        support.setdefault((hpo_id, gene), {})[association["disease_id"]] = association
    expression = {}
    for row in gene_rows:
        specificity = finite_number(row.get("expression_specificity"), 0, 1)
        if specificity is None or specificity < expression_specificity_min:
            continue
        gene, cell = row.get("gene"), row.get("celltype")
        if gene and cell:
            # Repeated collection rows must not change ranking or multiplicity.
            expression[(cell, gene)] = max(specificity, expression.get((cell, gene), 0))
    genes_by_hpo = {}
    for hpo_id, gene in support:
        genes_by_hpo.setdefault(hpo_id, set()).add(gene)
    results = {}
    for cell in cell_rows:
        hpo_id, cell_name = cell.get("hpo_id"), cell.get("celltype_name")
        q_value = finite_number(cell.get("q"), 0, 1)
        if (hpo_id not in severity_by_hpo or not cell_name or q_value is None or q_value >= q_threshold
                or allowed_cells and cell_name not in allowed_cells):
            continue
        phenotype = severity_by_hpo[hpo_id]
        for gene in sorted(genes_by_hpo.get(hpo_id, [])):
            specificity = expression.get((cell_name, gene))
            if specificity is None:
                continue
            for disease_id, association in support[(hpo_id, gene)].items():
                identity = (db_type, hpo_id, cell_name, gene, disease_id)
                old = results.get(identity)
                if old and old["q"] <= q_value:
                    continue
                results[identity] = {
                    "id": "association_" + hashlib.sha256("|".join(identity).encode()).hexdigest()[:20],
                    "hpo_id": hpo_id,
                    "hpo_name": association.get("hpo_name") or phenotype.get("hpo_name"),
                    "disease_id": disease_id,
                    "gene": gene,
                    "ncbi_gene_id": association.get("ncbi_gene_id"),
                    "celltype_name": cell_name,
                    "celltype_database": db_type,
                    "severity_score_gpt": float(phenotype["severity_score_gpt"]),
                    "severity_class": phenotype.get("severity_class"),
                    "severity_source": "Legacy GPT phenotype-level annotation; not patient-specific severity",
                    "congenital_onset": phenotype["congenital_onset"],
                    "death": phenotype.get("death"),
                    "intellectual_disability": phenotype.get("intellectual_disability"),
                    "q": q_value,
                    "estimate": finite_number(cell.get('estimate')),
                    "association_direction": 'unknown' if finite_number(cell.get('estimate')) is None else 'positive' if cell['estimate'] > 0 else 'negative' if cell['estimate'] < 0 else 'zero',
                    "p": finite_number(cell.get("p"), 0, 1),
                    "expression_specificity": specificity,
                    "phenotype_gene_evidence": association,
                    "cell_type_evidence_status": "enrichment_prediction_not_causal_validation",
                    "q_value_note": "Reported zero may be rounded or below precision; q is not an effect size" if q_value == 0 else None,
                    "therapeutic_suitability": "not_assessed",
                    "mechanism": None,
                    "cargo_compatibility": None,
                    "aav_tractability": None,
                    "best_serotype": None,
                    "terminally_differentiated": None,
                    "has_approved_therapy": None,
                    "approved_therapy_status": "not_assessed_for_this_indication",
                }
    return sorted(results.values(), key=lambda row: (-row["severity_score_gpt"], row["q"],
                  -row["expression_specificity"], row["hpo_id"], row["gene"], row["disease_id"], row["celltype_name"]))
