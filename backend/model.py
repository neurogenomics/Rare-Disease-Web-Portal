from pydantic import BaseModel
from typing import Optional


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
