"""Regression tests for scientific edge scope and unknown evidence, no Mongo server."""

import copy
import gzip
import hashlib
import json
from pathlib import Path
import sys

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import candidate_evidence as scientific
import phenotype_associations as hpo


def source(hpo_id="HP:0000001", gene="GENE1", disease="OMIM:123456"):
    return {"hpo_id": hpo_id, "hpo_name": "Example phenotype", "gene_symbol": gene,
            "disease_id": disease, "ncbi_gene_id": "123", "source_url": hpo.SOURCE_URL,
            "source_sha256": "a" * 64, "association_kind": hpo.ASSOCIATION_KIND,
            "variant_specific": False}


@pytest.fixture
def records():
    return {
        "severity_rows": [{"hpo_id": "HP:0000001", "hpo_name": "Example phenotype",
                           "severity_score_gpt": 45, "congenital_onset": 1}],
        "cell_rows": [{"hpo_id": "HP:0000001", "celltype_name": "Neuron", "q": 0.01}],
        "gene_rows": [{"gene": "GENE1", "celltype": "Neuron", "expression_specificity": 0.4},
                      {"gene": "UNSUPPORTED", "celltype": "Neuron", "expression_specificity": 0.99}],
        "associations": [source()],
    }


def calculate(records, **kwargs):
    options = dict(db_type="DescartesHuman", severity_min=20, congenital_onset_max=1,
                   q_threshold=0.05, expression_specificity_min=0.1)
    options.update(kwargs)
    return scientific.candidate_associations(**records, **options)


def test_expression_cannot_create_a_phenotype_gene_edge(records):
    result = calculate(records)
    assert [row["gene"] for row in result] == ["GENE1"]
    assert result[0]["disease_id"] == "OMIM:123456"
    assert result[0]["phenotype_gene_evidence"]["source_sha256"] == "a" * 64


def test_source_support_is_specific_to_phenotype_and_disease(records):
    records["associations"].extend([source(disease="ORPHA:42"), source("HP:9999999", "UNSUPPORTED")])
    result = calculate(records)
    assert {(row["gene"], row["disease_id"]) for row in result} == {
        ("GENE1", "OMIM:123456"), ("GENE1", "ORPHA:42")}


def test_no_source_does_not_become_predicted_therapeutic_suitability(records):
    records["associations"] = []
    assert calculate(records) == []


def test_unsourced_associations_are_not_accepted(records):
    records["associations"][0].pop("source_sha256")
    assert calculate(records) == []


def test_all_source_supported_genes_survive_arbitrary_top_five_cutoff(records):
    for number in range(7):
        gene = f"OTHER{number}"
        records["associations"].append(source(gene=gene))
        records["gene_rows"].append({"gene": gene, "celltype": "Neuron", "expression_specificity": 0.3})
    assert len(calculate(records)) == 8


@pytest.mark.parametrize("collection,field,value", [
    ("cell_rows", "q", None), ("cell_rows", "q", float("nan")),
    ("cell_rows", "q", -0.1), ("cell_rows", "q", True),
    ("severity_rows", "severity_score_gpt", None),
    ("severity_rows", "severity_score_gpt", float("inf")),
    ("severity_rows", "congenital_onset", None),
    ("gene_rows", "expression_specificity", None),
])
def test_missing_invalid_scores_cannot_pass_numeric_thresholds(records, collection, field, value):
    records[collection][0][field] = value
    assert calculate(records) == []


def test_reported_zero_q_preserved_without_infinite_certainty(records):
    records["cell_rows"][0]["q"] = 0
    result = calculate(records)[0]
    assert result["q"] == 0
    assert "rounded" in result["q_value_note"]
    assert result["cell_type_evidence_status"] == "enrichment_prediction_not_causal_validation"


def test_unknown_suitability_stays_unknown(records):
    row = calculate(records)[0]
    for field in ["cargo_compatibility", "aav_tractability", "best_serotype",
                  "terminally_differentiated", "mechanism", "has_approved_therapy"]:
        assert row[field] is None
    assert row["therapeutic_suitability"] == "not_assessed"
    assert calculate(records, require_terminally_differentiated=True) == []


def test_duplicate_predictions_do_not_duplicate_rows_or_change_ids(records):
    first = calculate(records)[0]
    records["cell_rows"].append(dict(records["cell_rows"][0], q=0.03))
    result = calculate(records)
    assert len(result) == 1
    assert result[0]["id"] == first["id"]
    assert result[0]["q"] == 0.01


class FakeCollection:
    """Tiny query-aware collection: exercises actual joins without a DB server."""

    def __init__(self, rows):
        self.rows = rows
        self.queries = []

    def find(self, query=None, projection=None):
        query = query or {}
        self.queries.append(copy.deepcopy(query))
        def matches(row):
            for key, expected in query.items():
                value = row.get(key)
                if not isinstance(expected, dict):
                    if value != expected:
                        return False
                else:
                    for operator, operand in expected.items():
                        if operator == "$in" and value not in operand:
                            return False
                        if operator in {"$lt", "$lte", "$gte"}:
                            if value is None:
                                return False
                            if operator == "$lt" and not value < operand:
                                return False
                            if operator == "$lte" and not value <= operand:
                                return False
                            if operator == "$gte" and not value >= operand:
                                return False
            return True
        return [copy.deepcopy(row) for row in self.rows if matches(row)]


def test_database_scopes_before_pagination_and_never_uses_other_atlas(monkeypatch, records):
    import database
    other = dict(records["severity_rows"][0], hpo_id="HP:9999999", severity_score_gpt=99)
    records["severity_rows"].append(other)
    records["cell_rows"].append(dict(records["cell_rows"][0], hpo_id="HP:9999999"))
    records["associations"].append(source("HP:9999999"))
    monkeypatch.setattr(database, "severity", FakeCollection(records["severity_rows"]))
    selected = FakeCollection(records["cell_rows"])
    wrong = FakeCollection([])
    monkeypatch.setattr(database, "celltype1", selected)
    monkeypatch.setattr(database, "celltype2", wrong)
    monkeypatch.setattr(database, "gene1", FakeCollection(records["gene_rows"]))
    monkeypatch.setattr(database, "get_phenotype_gene_associations", lambda **kwargs: records["associations"])
    result = database.fetch_gene_therapy_candidates(1, 20, 0.05, "DescartesHuman", ["All"], 0.1,
                                                    pageSize=1, current=1, hpo_ids=["HP:0000001"])
    assert len(result) == 1
    assert result[0]["hpo_id"] == "HP:0000001"
    assert result[0]["total"] == 1
    assert wrong.queries == []


def test_cell_name_cannot_establish_aav_delivery():
    import database
    for label in ["Excitatory_neurons", "Microglia", "Unknown cell"]:
        value = database.get_aav_tractability_score(label)
        assert value["tractability_score"] is None
        assert value["best_serotype"] is None
        assert value["terminally_differentiated"] is None


def test_human_cell_landscape_existence_uses_selected_atlas(monkeypatch):
    import database
    class Collection:
        def __init__(self, count):
            self.count = count
        def count_documents(self, query):
            return self.count
    monkeypatch.setattr(database, "celltype1", Collection(1))
    monkeypatch.setattr(database, "celltype2", Collection(0))
    assert database.fetch_cell_data("DescartesHuman", {}, dry_run=True) is True
    assert database.fetch_cell_data("HumanCellLandscape", {}, dry_run=True) is False


def test_prediction_without_severity_is_preserved_as_unknown(monkeypatch):
    import database
    class Cursor(list):
        def sort(self, *args):
            return self
    class Predictions:
        def find(self, query):
            return Cursor([{"_id": "123", "hpo_id": "HP:0000001", "q": 0.01}])
    class MissingSeverity:
        def find_one(self, query):
            return None
    monkeypatch.setattr(database, "celltype2", Predictions())
    monkeypatch.setattr(database, "severity", MissingSeverity())
    rows = database.fetch_cell_data("HumanCellLandscape", {})
    assert len(rows) == 1
    assert rows[0]["severity_score_gpt"] is None


def test_candidate_api_passes_cns_scope_into_join_before_paging(monkeypatch):
    from fastapi.testclient import TestClient
    import main
    seen = []
    monkeypatch.setattr(main, "fetch_cns_phenotype_ids", lambda: ["HP:0000001"])
    monkeypatch.setattr(main, "fetch_gene_therapy_candidates", lambda **kwargs: seen.append(kwargs) or [])
    with TestClient(main.app) as client:
        assert client.get("/api/gene-therapy?cns_only=true&pageSize=1").status_code == 200
    assert seen[0]["hpo_ids"] == ["HP:0000001"]
    assert seen[0]["pageSize"] == 1


def test_gene_hpo_endpoint_does_not_create_shared_cell_causality(monkeypatch):
    import gene_annotations
    monkeypatch.setattr(gene_annotations, "get_source_manifest", lambda: {"source_url": hpo.SOURCE_URL})
    monkeypatch.setattr(gene_annotations, "get_phenotype_gene_associations", lambda **kwargs: [source()])
    monkeypatch.setattr(gene_annotations, "get_cell_specificity", lambda *args, **kwargs: [{"celltype_name": "Neuron", "specificity": 0.4}])
    collection = FakeCollection([
        {"hpo_id": "HP:0000001", "celltype_name": "Neuron", "q": 0.01},
        {"hpo_id": "HP:9999999", "celltype_name": "Neuron", "q": 0.001},
    ])
    monkeypatch.setattr(gene_annotations, "db", {"hpo_celltype_DescartesHuman": collection})
    result = gene_annotations.get_gene_hpo_phenotypes("GENE1")
    assert [row["hpo_id"] for row in result["phenotypes"]] == ["HP:0000001"]
    assert result["phenotypes"][0]["disease_ids"] == ["OMIM:123456"]
    assert result["phenotypes"][0]["via_cell_types"] == ["Neuron"]
    assert result["variant_specific"] is False


def test_hpo_source_integrity_and_disease_scope(tmp_path, monkeypatch):
    content = b"hpo_id\thpo_name\tncbi_gene_id\tgene_symbol\tdisease_id\nHP:0000001\tExample\t123\tC9orf72\tOMIM:123456\nHP:0000001\tExample\t123\tC9orf72\tORPHA:42\n"
    source_path = tmp_path / "source.tsv.gz"
    source_path.write_bytes(gzip.compress(content))
    manifest = {"source_url": hpo.SOURCE_URL, "sha256": hashlib.sha256(content).hexdigest(), "retrieved_at": "2026-10-11T00:00:00+00:00"}
    manifest_path = tmp_path / "manifest.json"
    manifest_path.write_text(json.dumps(manifest))
    monkeypatch.setattr(hpo, "SOURCE_PATH", source_path)
    monkeypatch.setattr(hpo, "MANIFEST_PATH", manifest_path)
    monkeypatch.setattr(hpo, "DATABASE_PATH", tmp_path / "index.sqlite")
    result = hpo.get_phenotype_gene_associations(gene_symbols=["c9ORF72"])
    assert len(result) == 2
    assert {row["disease_id"] for row in result} == {"OMIM:123456", "ORPHA:42"}
    assert all(row["variant_specific"] is False for row in result)
    assert hpo.get_phenotype_gene_associations(hpo_ids=[], gene_symbols=["C9orf72"]) == []
    with pytest.raises(ValueError, match="checksum"):
        hpo.build_index(source_path, tmp_path / "corrupt.sqlite", dict(manifest, sha256="wrong"))


def test_missing_snapshot_is_unavailable_not_false_association(tmp_path, monkeypatch):
    monkeypatch.setattr(hpo, "MANIFEST_PATH", tmp_path / "absent.json")
    assert hpo.get_phenotype_gene_associations(gene_symbols=["GENE1"]) == []
    assert hpo.get_source_manifest() is None


@pytest.mark.parametrize("query", ["db_type=unrecognised", "q_threshold=nan", "q_threshold=0", "severity_min=-1", "pageSize=0", "current=-1"])
def test_api_rejects_invalid_scientific_filters(query):
    from fastapi.testclient import TestClient
    from main import app
    with TestClient(app) as client:
        assert client.get("/api/gene-therapy?" + query).status_code == 422
