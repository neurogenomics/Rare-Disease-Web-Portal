"""Offline regressions: missing enrichment is not a negative biological finding."""

import copy
import importlib.util
from pathlib import Path
import re
import sys
from unittest.mock import patch

import pytest

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))


def nested(document, key):
    for part in key.split("."):
        if not isinstance(document, dict):
            return None
        document = document.get(part)
    return document


def matches(document, query):
    for key, expected in query.items():
        if key == "$or":
            if not any(matches(document, branch) for branch in expected):
                return False
            continue
        actual = nested(document, key)
        if isinstance(expected, re.Pattern):
            if not isinstance(actual, str) or not expected.search(actual):
                return False
        elif isinstance(expected, dict):
            for operation, value in expected.items():
                if operation == "$type" and not isinstance(actual, str):
                    return False
                if operation == "$regex" and (not isinstance(actual, str) or not re.search(value, actual)):
                    return False
                if operation == "$gte" and (actual is None or actual < value):
                    return False
                if operation == "$ne" and actual == value:
                    return False
                if operation == "$in" and (actual.casefold() if isinstance(actual, str) else actual) not in [item.casefold() if isinstance(item, str) else item for item in value]:
                    return False
        elif isinstance(actual, str) and isinstance(expected, str):
            if actual.casefold() != expected.casefold():
                return False
        elif actual != expected:
            return False
    return True


class Cursor(list):
    def sort(self, *_):
        return self

    def skip(self, value):
        return Cursor(self[value:])

    def limit(self, value):
        return Cursor(self[:value])


class Collection:
    def __init__(self, documents=(), aggregate_result=()):
        self.documents = list(documents)
        self.aggregate_result = aggregate_result
        self.error = None
        self.last_query = None

    def find(self, query, projection=None, **_):
        self.last_query = copy.deepcopy(query)
        return Cursor(copy.deepcopy(document) for document in self.documents if matches(document, query))

    def find_one(self, query, **kwargs):
        rows = self.find(query, **kwargs)
        return rows[0] if rows else None

    def count_documents(self, query):
        return len(self.find(query))

    def estimated_document_count(self):
        return len(self.documents)

    def aggregate(self, _):
        if self.error:
            raise self.error
        return copy.deepcopy(self.aggregate_result)


@pytest.fixture
def annotations(monkeypatch):
    # Loading the production module must not create a live Mongo client.
    spec = importlib.util.spec_from_file_location("annotation_unknown_fixture", BACKEND / "gene_annotations.py")
    module = importlib.util.module_from_spec(spec)
    with patch("pymongo.MongoClient"):
        spec.loader.exec_module(module)
    monkeypatch.setattr(module, "gene_annotations", Collection())
    monkeypatch.setattr(module, "celltype_gene_descartes", Collection())
    monkeypatch.setattr(module, "celltype_gene_hcl", Collection())
    return module


def reference(symbol, **fields):
    return {"_id": symbol, "gene_symbol": symbol, **fields}


def test_tf_seed_defaults_missing_and_malformed_enrichment_stay_unknown(annotations):
    for fields in [{}, {"is_tf": False}, {"is_tf": True},
                   {"is_tf": False, "data_versions": {"hgnc": "2026-01-01"}},
                   {"is_tf": False, "data_versions": {"lambert_tf": "  "}},
                   {"is_tf": "false", "data_versions": {"lambert_tf": "2018-01-29"}}]:
        annotations.gene_annotations = Collection([reference("GENE1", **fields)])
        assessment = annotations.get_tf_status("GENE1")
        assert assessment["is_tf"] is None
        assert assessment["evidence_status"] == "unknown"
        assert annotations.is_tf("GENE1") is None
        assert annotations.get_gene("GENE1")["is_tf"] is None
    assert annotations.get_tf_status("ABSENT") is None
    assert annotations.is_tf("ABSENT") is None


def test_tf_source_backed_positive_negative_and_batch_case_are_preserved(annotations):
    annotations.gene_annotations = Collection([
        reference("POS", is_tf=True, tf_metadata={"dbd": "Homeodomain"}, data_versions={"lambert_tf": "2018-01-29"}),
        reference("NEG", is_tf=False, data_versions={"lambert_tf": "2018-01-29"}),
        reference("UNKNOWN", is_tf=False, data_versions={"hgnc": "2026-01-01"}),
    ])
    result = annotations.get_tf_status_batch(["pos", "NEG", "unknown", "ABSENT"])
    assert set(result) == {"pos", "NEG", "unknown", "ABSENT"}
    assert result["pos"]["is_tf"] is True
    assert result["pos"]["dbd"] == "Homeodomain"
    assert result["NEG"]["is_tf"] is False
    assert result["NEG"]["evidence_status"] == "assessed_negative"
    assert result["unknown"]["is_tf"] is None
    assert result["ABSENT"] is None


def test_non_tf_browser_filter_excludes_unknown_and_preserves_disease_scope(annotations):
    disease = {"disease_associations": {"parkinsons": {"overall_score": 0.8}}}
    annotations.gene_annotations = Collection([
        reference("SEED", is_tf=False, **disease),
        reference("NEG", is_tf=False, data_versions={"lambert_tf": "2018-01-29"}, **disease),
        reference("POS", is_tf=True, data_versions={"lambert_tf": "2018-01-29"}, **disease),
        reference("OUTSIDE", is_tf=False, data_versions={"lambert_tf": "2018-01-29"}),
    ])
    result = annotations.browse_genes(is_tf=False, min_disease_score=0.5, min_specificity=0)
    assert [gene["gene_symbol"] for gene in result["genes"]] == ["NEG"]
    assert result["total"] == 1
    assert result["genes"][0]["tf_evidence_status"] == "assessed_negative"
    assert result["genes"][0]["hpo_count"] is None
    assert annotations.gene_annotations.last_query["is_tf"] is False
    assert "$or" in annotations.gene_annotations.last_query
    result = annotations.browse_genes(is_tf=True, min_specificity=0)
    assert [gene["gene_symbol"] for gene in result["genes"]] == ["POS"]


def test_lookup_search_and_tf_counts_do_not_silently_turn_unknown_into_false(annotations):
    annotations.gene_annotations = Collection([
        reference("GENE1", is_tf=False),
        reference("GENE2", is_tf=True, data_versions={"lambert_tf": "2018-01-29"}),
        reference("GENE3", is_tf=False, data_versions={"lambert_tf": "2018-01-29"}),
    ])
    search = annotations.search_genes("GENE")
    assert {row["gene_symbol"]: row["is_tf"] for row in search} == {"GENE1": None, "GENE2": True, "GENE3": False}
    assert [row["gene_symbol"] for row in annotations.get_all_tfs()] == ["GENE2"]
    stats = annotations.get_collection_stats()
    assert (stats["total_tfs"], stats["tf_assessed_negative"], stats["tf_unknown"]) == (1, 1, 1)


def test_absent_reference_corpus_is_unavailable_not_an_available_empty_filter_result(annotations):
    assert annotations.browse_genes(min_specificity=0)["evidence_status"] == "source_unavailable"
    assert annotations.get_browse_options()["evidence_status"] == "source_unavailable"
    annotations.gene_annotations = Collection([reference("GENE1", is_tf=False)])
    filtered = annotations.browse_genes(is_tf=True, min_specificity=0)
    assert filtered["evidence_status"] == "available"
    assert filtered["genes"] == []
    assert filtered["total"] == 0


def test_antibody_missing_and_uncovered_assertions_are_truthy_unknown_responses(annotations):
    for fields in [{}, {"antibody_validation": None},
                   {"antibody_validation": {"pcrp": {"has_validated_antibody": False}}},
                   {"antibody_validation": {"pcrp": {"has_validated_antibody": True}}, "data_versions": {"hgnc": "2026-01-01"}}]:
        annotations.gene_annotations = Collection([reference("GENE1", **fields)])
        for symbol in ["GENE1", "ABSENT"]:
            result = annotations.get_antibody_status(symbol)
            assert result  # The API's legacy `result or false` fallback cannot fire.
            assert result["has_validated_antibody"] is None
            assert result["evidence_status"] == "unknown"


def test_antibody_negative_is_limited_to_the_declared_source_and_full_lookup_matches(annotations):
    original = reference("GENE1", is_tf=False, antibody_validation={
        "pcrp": {"has_validated_antibody": False}, "other": {"has_validated_antibody": True}},
        data_versions={"pcrp": "2021-08"})
    annotations.gene_annotations = Collection([original])
    negative = annotations.get_antibody_status("GENE1", "pcrp")
    assert negative["has_validated_antibody"] is False
    assert negative["evidence_status"] == "assessed_negative"
    assert "not a global absence claim" in negative["reason"]
    assert annotations.get_antibody_status("GENE1", "other")["has_validated_antibody"] is None
    full = annotations.get_gene("GENE1")
    assert full["antibody_validation"]["pcrp"] == negative
    assert full["is_tf"] is None
    assert original["is_tf"] is False  # Read normalization never modifies stored source data.
    original["antibody_validation"]["pcrp"]["has_validated_antibody"] = True
    assert annotations.get_antibody_status("GENE1")["evidence_status"] == "assessed_positive"


def test_percentile_outage_empty_sample_and_recovery_never_use_default_thresholds(annotations):
    source = annotations.celltype_gene_descartes
    for result in [[], [{"values": []}], [{"values": [None, True, -0.1, 1.1, float("nan"), float("inf")]}]]:
        source.aggregate_result = result
        response = annotations.get_specificity_percentiles("DescartesHuman")
        assert response["evidence_status"] == "source_unavailable"
        assert response["thresholds"] == {}
    source.error = RuntimeError("Fixture source unavailable")
    assert annotations.get_specificity_percentiles("DescartesHuman")["thresholds"] == {}
    source.error = None
    source.aggregate_result = [{"values": [0, 0, 0, None, float("nan"), True]}]
    recovered = annotations.get_specificity_percentiles("DescartesHuman")
    assert recovered["evidence_status"] == "available"
    assert recovered["sample_count"] == 3
    assert set(recovered["thresholds"].values()) == {0.0}
    source.aggregate_result = [{"values": [3e-12]}]
    precise = annotations.get_specificity_percentiles("DescartesHuman")
    assert set(precise["thresholds"].values()) == {3e-12}


def test_percentiles_use_only_the_selected_atlas_and_report_sample_scope(annotations):
    annotations.celltype_gene_descartes.aggregate_result = [{"values": [0.1]}]
    annotations.celltype_gene_hcl.aggregate_result = [{"values": [0.2, 0.8]}]
    result = annotations.get_specificity_percentiles("HumanCellLandscape", "Exact cell")
    assert result["atlas"] == "HumanCellLandscape"
    assert result["cell_type"] == "Exact cell"
    assert result["sample_count"] == 2
    assert result["method"] == "sampled_empirical_quantiles"
    assert result["thresholds"][50] == 0.8
    assert annotations.get_specificity_percentiles("UnknownAtlas")["evidence_status"] == "source_unavailable"


def test_response_models_default_unassessed_booleans_to_null():
    from model import AntibodyValidation, GeneAnnotation, GeneAnnotationSummary
    assert GeneAnnotation(gene_symbol="GENE1").is_tf is None
    assert GeneAnnotationSummary(gene_symbol="GENE1").is_tf is None
    assert AntibodyValidation().has_validated_antibody is None
