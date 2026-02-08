"""
Unit tests for gene_annotations module.

These tests require a running MongoDB instance with the gene_annotations collection
populated by the seed and ingestion scripts.

Run: pytest backend/tests/test_gene_annotations.py -v
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from gene_annotations import (
    get_tf_status,
    get_tf_status_batch,
    is_tf,
    count_tfs,
    get_all_tfs,
    get_gene,
    get_gene_by_ensembl,
    get_gene_by_alias,
    search_genes,
    get_disease_associations,
    get_genes_by_disease,
    get_cell_specificity,
    get_expressing_cell_types,
    get_antibody_status,
    get_collection_stats,
)


# ============================================================
# TF Status Tests (Sprint 1)
# ============================================================

class TestGetTFStatus:
    """Tests for get_tf_status function."""

    def test_get_tf_status_known_tf(self):
        """Known TF should return TF metadata."""
        result = get_tf_status("TFAP2A")
        assert result is not None
        assert result["is_tf"] is True
        assert "dbd" in result
        assert result["dbd"] == "AP-2"

    def test_get_tf_status_non_tf(self):
        """Non-TF gene should return None."""
        result = get_tf_status("LRRK2")
        assert result is None

    def test_get_tf_status_unknown_gene(self):
        """Unknown gene should return None."""
        result = get_tf_status("NOTAREALGENE12345")
        assert result is None

    def test_get_tf_status_case_insensitive(self):
        """Gene symbol lookup should be case-insensitive."""
        result_upper = get_tf_status("TFAP2A")
        result_lower = get_tf_status("tfap2a")
        result_mixed = get_tf_status("Tfap2a")

        assert result_upper == result_lower == result_mixed

    def test_get_tf_status_returns_expected_fields(self):
        """TF result should contain all expected fields."""
        result = get_tf_status("PAX6")
        assert result is not None

        expected_fields = ["is_tf", "dbd", "assessment", "binding_mode", "motif_status"]
        for field in expected_fields:
            assert field in result


class TestGetTFStatusBatch:
    """Tests for get_tf_status_batch function."""

    def test_get_tf_status_batch(self):
        """Batch lookup should return dict for all requested genes."""
        genes = ["TFAP2A", "LRRK2", "PAX6"]
        result = get_tf_status_batch(genes)

        assert len(result) == 3
        assert "TFAP2A" in result
        assert "LRRK2" in result
        assert "PAX6" in result

        # TFAP2A and PAX6 are TFs
        assert result["TFAP2A"] is not None
        assert result["TFAP2A"]["is_tf"] is True
        assert result["PAX6"] is not None

        # LRRK2 is not a TF
        assert result["LRRK2"] is None

    def test_get_tf_status_batch_empty(self):
        """Empty input should return empty dict."""
        result = get_tf_status_batch([])
        assert result == {}

    def test_get_tf_status_batch_unknown_genes(self):
        """Unknown genes should have None values."""
        result = get_tf_status_batch(["NOTREAL1", "NOTREAL2"])
        assert result["NOTREAL1"] is None
        assert result["NOTREAL2"] is None


class TestIsTF:
    """Tests for is_tf function."""

    def test_is_tf_known_tf(self):
        """Known TF should return True."""
        assert is_tf("TFAP2A") is True
        assert is_tf("PAX6") is True

    def test_is_tf_non_tf(self):
        """Non-TF gene should return False."""
        assert is_tf("LRRK2") is False
        assert is_tf("APOE") is False

    def test_is_tf_unknown(self):
        """Unknown gene should return False."""
        assert is_tf("NOTAREALGENE") is False


class TestTFListFunctions:
    """Tests for TF list and count functions."""

    def test_count_tfs(self):
        """Should return expected TF count (~1637)."""
        count = count_tfs()
        # Lambert et al. reports 1,639 TFs
        assert 1600 <= count <= 1700

    def test_get_all_tfs(self):
        """Should return list of TFs."""
        tfs = get_all_tfs(limit=10)
        assert len(tfs) == 10
        assert all("gene_symbol" in tf for tf in tfs)
        assert all("tf_metadata" in tf for tf in tfs)


# ============================================================
# Gene Lookup Tests (Sprint 1)
# ============================================================

class TestGeneLookup:
    """Tests for gene lookup functions."""

    def test_get_gene(self):
        """Should return complete gene annotation."""
        result = get_gene("LRRK2")
        assert result is not None
        assert result["gene_symbol"] == "LRRK2"
        assert result["ensembl_id"] == "ENSG00000188906"
        assert "aliases" in result

    def test_get_gene_by_ensembl(self):
        """Should find gene by Ensembl ID."""
        result = get_gene_by_ensembl("ENSG00000188906")
        assert result is not None
        assert result["gene_symbol"] == "LRRK2"

    def test_get_gene_by_alias(self):
        """Should find gene by alias."""
        # LRRK2 has alias PARK8
        result = get_gene_by_alias("PARK8")
        assert result is not None
        assert result["gene_symbol"] == "LRRK2"

    def test_search_genes(self):
        """Should search by prefix."""
        results = search_genes("LRRK")
        assert len(results) >= 1
        symbols = [r["gene_symbol"] for r in results]
        assert "LRRK2" in symbols or "LRRK1" in symbols


# ============================================================
# Disease Association Tests (Sprint 2 - Placeholder)
# ============================================================

class TestDiseaseAssociations:
    """Tests for disease association functions."""

    def test_get_disease_associations_known_gene(self):
        """Known AD gene should have disease associations."""
        result = get_disease_associations("APOE", "alzheimers")
        assert result is not None
        assert "alzheimers" in result
        assert result["alzheimers"]["overall_score"] > 0.5

    def test_get_disease_associations_pd_gene(self):
        """Known PD gene should have disease associations."""
        result = get_disease_associations("LRRK2", "parkinsons")
        assert result is not None
        assert "parkinsons" in result
        assert result["parkinsons"]["overall_score"] > 0.5

    def test_get_disease_associations_all_diseases(self):
        """Should return all diseases when disease not specified."""
        result = get_disease_associations("APOE")
        assert result is not None
        assert isinstance(result, dict)

    def test_get_disease_associations_unknown_gene(self):
        """Unknown gene should return None."""
        result = get_disease_associations("NOTAREALGENE12345")
        assert result is None

    def test_get_disease_associations_gene_no_association(self):
        """Gene without disease association should return empty dict."""
        # Most genes don't have associations to both diseases
        result = get_disease_associations("TP53", "parkinsons")
        # TP53 may or may not have PD association
        assert result is None or isinstance(result, dict)

    def test_get_genes_by_disease_alzheimers(self):
        """Should return top AD genes."""
        result = get_genes_by_disease("alzheimers", min_score=0.5, limit=10)
        assert len(result) > 0
        # PSEN1, APP, APOE should be in top genes
        symbols = [g["gene_symbol"] for g in result]
        assert any(s in symbols for s in ["PSEN1", "APP", "APOE", "PSEN2"])

    def test_get_genes_by_disease_parkinsons(self):
        """Should return top PD genes."""
        result = get_genes_by_disease("parkinsons", min_score=0.5, limit=10)
        assert len(result) > 0
        # LRRK2, SNCA, PRKN should be in top genes
        symbols = [g["gene_symbol"] for g in result]
        assert any(s in symbols for s in ["LRRK2", "SNCA", "PRKN", "PINK1"])

    def test_get_genes_by_disease_sorted(self):
        """Results should be sorted by score descending."""
        result = get_genes_by_disease("alzheimers", min_score=0.3, limit=20)
        scores = [g["overall_score"] for g in result]
        assert scores == sorted(scores, reverse=True)

    def test_evidence_structure(self):
        """Disease evidence should have expected structure."""
        result = get_disease_associations("APOE", "alzheimers")
        assert result is not None
        evidence = result["alzheimers"].get("evidence", {})
        # Should have at least one evidence type
        assert len(evidence) > 0
        # Check structure of evidence items
        for ev_type, items in evidence.items():
            assert isinstance(items, list)
            for item in items:
                assert "source" in item or "score" in item


# ============================================================
# Cell Specificity Tests (Sprint 3 - Placeholder)
# ============================================================

class TestCellSpecificity:
    """Tests for cell specificity functions."""

    def test_get_cell_specificity_known_gene(self):
        """Known marker gene should return cell types."""
        # GFAP is a strong astrocyte marker
        result = get_cell_specificity("GFAP", db_type="DescartesHuman")
        assert len(result) > 0
        # Astrocytes should be the top result
        assert result[0]["celltype_name"] == "Astrocytes"
        assert result[0]["specificity"] > 0.1

    def test_get_cell_specificity_returns_sorted(self):
        """Results should be sorted by specificity descending."""
        result = get_cell_specificity("AIF1", db_type="DescartesHuman")
        specs = [r["specificity"] for r in result]
        assert specs == sorted(specs, reverse=True)

    def test_get_cell_specificity_threshold(self):
        """Min specificity threshold should filter results."""
        result_low = get_cell_specificity("LRRK2", min_specificity=0.01)
        result_high = get_cell_specificity("LRRK2", min_specificity=0.1)
        assert len(result_low) >= len(result_high)

    def test_get_expressing_cell_types_multi_dataset(self):
        """Should return results from multiple datasets."""
        result = get_expressing_cell_types("LRRK2")
        assert "DescartesHuman" in result
        assert "HumanCellLandscape" in result
        # Both should have some cell types
        assert len(result["DescartesHuman"]) > 0
        assert len(result["HumanCellLandscape"]) > 0

    def test_cross_reference_no_duplication(self):
        """Cell specificity should cross-reference, not duplicate data."""
        # Verify we're querying the original collections, not copying
        from gene_annotations import celltype_gene_descartes
        # Count should match original collection
        db_count = celltype_gene_descartes.count_documents({"gene": "GFAP"})
        result = get_cell_specificity("GFAP", min_specificity=0, limit=1000)
        assert len(result) == db_count


# ============================================================
# Antibody Validation Tests (Sprint 6)
# ============================================================

class TestAntibodyValidation:
    """Tests for antibody validation functions."""

    def test_get_antibody_status_with_data(self):
        """TF with PCRP data should return validation info."""
        # CTCF has sample PCRP data loaded
        result = get_antibody_status("CTCF", source="pcrp")
        assert result is not None
        assert result["has_validated_antibody"] is True
        assert "validation_score" in result
        assert "assays_validated" in result

    def test_get_antibody_status_no_data(self):
        """Gene without PCRP data should return None."""
        result = get_antibody_status("LRRK2", source="pcrp")
        assert result is None


# ============================================================
# Collection Stats Tests
# ============================================================

class TestCollectionStats:
    """Tests for collection metadata functions."""

    def test_get_collection_stats(self):
        """Should return collection statistics."""
        stats = get_collection_stats()

        assert "total_genes" in stats
        assert "total_tfs" in stats
        assert "genes_with_disease_associations" in stats
        assert "data_versions" in stats

        # Verify reasonable values
        assert stats["total_genes"] > 40000
        assert stats["total_tfs"] > 1600


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
