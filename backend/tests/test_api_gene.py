"""
API integration tests for gene annotation endpoints.

These tests use FastAPI TestClient with cache initialization.

Run: pytest backend/tests/test_api_gene.py -v
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from fastapi.testclient import TestClient
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend


# Initialize cache before importing app
@pytest.fixture(scope="module", autouse=True)
def init_cache():
    """Initialize FastAPICache for tests."""
    FastAPICache.init(InMemoryBackend())
    yield


@pytest.fixture(scope="module")
def client():
    """Create test client."""
    from main import app
    return TestClient(app)


class TestGeneEndpoint:
    """Tests for /api/gene/{symbol} endpoint."""

    def test_get_gene_known(self, client):
        """Known gene should return complete annotation."""
        response = client.get("/api/gene/LRRK2")
        assert response.status_code == 200

        data = response.json()
        assert data["gene_symbol"] == "LRRK2"
        assert data["ensembl_id"] == "ENSG00000188906"
        assert "cell_specificity" in data

    def test_get_gene_tf(self, client):
        """TF gene should have TF metadata."""
        response = client.get("/api/gene/TFAP2A")
        assert response.status_code == 200

        data = response.json()
        assert data["is_tf"] is True
        assert data["tf_metadata"] is not None

    def test_get_gene_not_found(self, client):
        """Unknown gene should return 404."""
        response = client.get("/api/gene/NOTAREALGENE12345")
        assert response.status_code == 404

    def test_get_gene_case_insensitive(self, client):
        """Gene lookup should be case-insensitive."""
        response1 = client.get("/api/gene/LRRK2")
        response2 = client.get("/api/gene/lrrk2")

        assert response1.status_code == 200
        assert response2.status_code == 200
        assert response1.json()["gene_symbol"] == response2.json()["gene_symbol"]


class TestGeneTFEndpoint:
    """Tests for /api/gene/{symbol}/tf endpoint."""

    def test_get_tf_known_tf(self, client):
        """Known TF should return TF metadata."""
        response = client.get("/api/gene/TFAP2A/tf")
        assert response.status_code == 200

        data = response.json()
        assert data["is_tf"] is True
        assert "dbd" in data

    def test_get_tf_non_tf(self, client):
        """Non-TF gene should return is_tf: False."""
        response = client.get("/api/gene/LRRK2/tf")
        assert response.status_code == 200

        data = response.json()
        assert data["is_tf"] is False

    def test_get_tf_not_found(self, client):
        """Unknown gene should return 404."""
        response = client.get("/api/gene/NOTAREALGENE/tf")
        assert response.status_code == 404


class TestGeneDiseaseEndpoint:
    """Tests for /api/gene/{symbol}/disease endpoint."""

    def test_get_disease_ad_gene(self, client):
        """AD gene should have alzheimers association."""
        response = client.get("/api/gene/APOE/disease?disease=alzheimers")
        assert response.status_code == 200

        data = response.json()
        assert "alzheimers" in data
        assert data["alzheimers"]["overall_score"] > 0.5

    def test_get_disease_pd_gene(self, client):
        """PD gene should have parkinsons association."""
        response = client.get("/api/gene/LRRK2/disease?disease=parkinsons")
        assert response.status_code == 200

        data = response.json()
        assert "parkinsons" in data
        assert data["parkinsons"]["overall_score"] > 0.5

    def test_get_disease_all(self, client):
        """Should return all diseases without filter."""
        response = client.get("/api/gene/APOE/disease")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, dict)

    def test_get_disease_not_found(self, client):
        """Unknown gene should return 404."""
        response = client.get("/api/gene/NOTAREALGENE/disease")
        assert response.status_code == 404


class TestGeneCellsEndpoint:
    """Tests for /api/gene/{symbol}/cells endpoint."""

    def test_get_cells(self, client):
        """Should return cell specificity data."""
        response = client.get("/api/gene/GFAP/cells")
        assert response.status_code == 200

        data = response.json()
        assert len(data) > 0
        # GFAP should be specific to astrocytes
        celltypes = [c["celltype_name"] for c in data]
        assert "Astrocytes" in celltypes

    def test_get_cells_params(self, client):
        """Should respect query parameters."""
        response = client.get("/api/gene/LRRK2/cells?min_specificity=0.1&limit=5")
        assert response.status_code == 200

        data = response.json()
        assert len(data) <= 5


class TestGenesByDiseaseEndpoint:
    """Tests for /api/genes/by-disease/{disease} endpoint."""

    def test_get_ad_genes(self, client):
        """Should return AD-associated genes."""
        response = client.get("/api/genes/by-disease/alzheimers?min_score=0.5&limit=10")
        assert response.status_code == 200

        data = response.json()
        assert len(data) > 0
        # Top AD genes should include known candidates
        symbols = [g["gene_symbol"] for g in data]
        assert any(s in symbols for s in ["PSEN1", "APP", "APOE", "PSEN2"])

    def test_get_pd_genes(self, client):
        """Should return PD-associated genes."""
        response = client.get("/api/genes/by-disease/parkinsons?min_score=0.5&limit=10")
        assert response.status_code == 200

        data = response.json()
        assert len(data) > 0
        symbols = [g["gene_symbol"] for g in data]
        assert any(s in symbols for s in ["LRRK2", "SNCA", "PRKN", "PINK1"])

    def test_invalid_disease(self, client):
        """Invalid disease should return 400."""
        response = client.get("/api/genes/by-disease/invalid_disease")
        assert response.status_code == 400


class TestBatchEndpoint:
    """Tests for /api/genes/batch endpoint."""

    def test_batch_lookup(self, client):
        """Batch lookup should return data for multiple genes."""
        response = client.post(
            "/api/genes/batch",
            json={"genes": ["LRRK2", "APOE", "TFAP2A"]}
        )
        assert response.status_code == 200

        data = response.json()
        assert "LRRK2" in data
        assert "APOE" in data
        assert "TFAP2A" in data
        assert data["TFAP2A"]["is_tf"] is True

    def test_batch_with_unknown(self, client):
        """Batch should return None for unknown genes."""
        response = client.post(
            "/api/genes/batch",
            json={"genes": ["LRRK2", "NOTREAL"]}
        )
        assert response.status_code == 200

        data = response.json()
        assert data["LRRK2"] is not None
        assert data["NOTREAL"] is None

    def test_batch_limit(self, client):
        """Batch should reject more than 100 genes."""
        response = client.post(
            "/api/genes/batch",
            json={"genes": [f"GENE{i}" for i in range(101)]}
        )
        assert response.status_code == 400


class TestSearchEndpoint:
    """Tests for /api/genes/search endpoint."""

    def test_search(self, client):
        """Should find genes by prefix."""
        response = client.get("/api/genes/search?q=LRRK")
        assert response.status_code == 200

        data = response.json()
        assert len(data) > 0
        symbols = [g["gene_symbol"] for g in data]
        assert any(s.startswith("LRRK") for s in symbols)


class TestMetadataEndpoint:
    """Tests for /api/genes/metadata endpoint."""

    def test_metadata(self, client):
        """Should return collection statistics."""
        response = client.get("/api/genes/metadata")
        assert response.status_code == 200

        data = response.json()
        assert "total_genes" in data
        assert "total_tfs" in data
        assert data["total_genes"] > 40000
        assert data["total_tfs"] > 1600


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
