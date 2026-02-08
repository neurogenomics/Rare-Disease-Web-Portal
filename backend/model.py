from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ============================================================
# Gene Annotation Models
# ============================================================

class TFMetadata(BaseModel):
    """Transcription factor metadata from Lambert et al. 2018."""
    dbd: Optional[str] = Field(None, description="DNA binding domain type")
    assessment: Optional[str] = Field(None, description="TF assessment category")
    binding_mode: Optional[str] = Field(None, description="Binding mode (monomer/dimer)")
    motif_status: Optional[str] = Field(None, description="Motif characterization status")
    interpro_ids: Optional[List[str]] = Field(None, description="InterPro domain IDs")
    entrez_id: Optional[str] = Field(None, description="Entrez Gene ID")


class DiseaseEvidenceItem(BaseModel):
    """Single piece of disease association evidence."""
    study_id: Optional[str] = None
    source: Optional[str] = None
    pvalue: Optional[float] = None
    beta: Optional[float] = None
    odds_ratio: Optional[float] = None
    confidence_interval: Optional[List[float]] = None


class DiseaseEvidence(BaseModel):
    """Structured evidence for a disease association."""
    common_variants: List[DiseaseEvidenceItem] = Field(default_factory=list)
    rare_variants: List[DiseaseEvidenceItem] = Field(default_factory=list)
    expression_qtl: List[DiseaseEvidenceItem] = Field(default_factory=list)
    literature: List[DiseaseEvidenceItem] = Field(default_factory=list)


class DiseaseAssociation(BaseModel):
    """Disease association with overall score and evidence."""
    overall_score: float = Field(..., ge=0, le=1, description="OpenTargets overall association score")
    evidence: DiseaseEvidence = Field(default_factory=DiseaseEvidence)


class AntibodyValidation(BaseModel):
    """Antibody validation status from PCRP or other sources."""
    has_validated_antibody: bool = False
    best_antibody: Optional[str] = None
    validation_score: Optional[str] = None
    assays_validated: List[str] = Field(default_factory=list)


class DataVersions(BaseModel):
    """Version tracking for data sources."""
    hgnc: Optional[str] = None
    lambert_tf: Optional[str] = None
    opentargets: Optional[str] = None
    pcrp: Optional[str] = None


class GeneAnnotation(BaseModel):
    """Complete gene annotation document."""
    gene_symbol: str = Field(..., description="HGNC gene symbol")
    ensembl_id: Optional[str] = Field(None, description="Ensembl gene ID")
    hgnc_id: Optional[str] = Field(None, description="HGNC ID")
    name: Optional[str] = Field(None, description="Gene name")
    locus_group: Optional[str] = Field(None, description="HGNC locus group")
    locus_type: Optional[str] = Field(None, description="HGNC locus type")
    aliases: List[str] = Field(default_factory=list, description="Gene symbol aliases")

    # TF status
    is_tf: bool = Field(False, description="Is this gene a transcription factor")
    tf_metadata: Optional[TFMetadata] = None

    # Disease associations
    disease_associations: Optional[Dict[str, DiseaseAssociation]] = None

    # Antibody validation
    antibody_validation: Optional[Dict[str, AntibodyValidation]] = None

    # Metadata
    last_updated: Optional[datetime] = None
    data_versions: Optional[DataVersions] = None

    class Config:
        arbitrary_types_allowed = True


class GeneAnnotationSummary(BaseModel):
    """Summary view of gene annotation for list endpoints."""
    gene_symbol: str
    ensembl_id: Optional[str] = None
    is_tf: bool = False
    has_disease_association: bool = False
    has_antibody_validation: bool = False


class CellSpecificity(BaseModel):
    """Cell type specificity for a gene."""
    celltype_name: str
    specificity: float
    mean_expression: Optional[float] = None
    percentile_rank: Optional[float] = None


class GeneMetadata(BaseModel):
    """Metadata about the gene_annotations collection."""
    total_genes: int
    total_tfs: int
    genes_with_disease_associations: int
    genes_with_antibody_validation: int
    data_versions: Dict[str, str]


# ============================================================
# Severity Data Models (existing)
# ============================================================

class SeverityData(BaseModel):
    id: Optional[str] = None
    hpo_name: str
    hpo_id: str
    intellectual_disability: str
    intellectual_disability_justification: str
    death: str
    death_justification: str
    impaired_mobility: str
    impaired_mobility_justification: str
    physical_malformations: str
    physical_malformations_justification: str
    blindness: str
    blindness_justification: str
    sensory_impairments: str
    sensory_impairments_justification: str
    immunodeficiency: str
    immunodeficiency_justification: str
    cancer: str
    cancer_justification: str
    reduced_fertility: str
    reduced_fertility_justification: str
    congenital_onset: str
    congenital_onset_justification: str

    class Config:
        arbitrary_types_allowed = True
