# Recent pharmacotherapy source review

Reviewed 11 October 2026. The source of truth for the structured observations is
`frontend/src/data/evidence/curatedEvidence.json` and `endpointEvidence.json`.
Nine indication/population assessments cover the seven previously named recent
approval gaps plus older Joenja and Aqneursa comparator indications. Their 55
result records and 21 cell observations are selected primary-source evidence,
not every outcome or an exhaustive inherited-disease medicine inventory.

## Scope corrections retained in the interface

| Evidence | Required distinction |
| --- | --- |
| Zycubo | FDA severe-variant survival analyses use 66 treated patients and 17 external controls. Early 31/17 and late 35/16 comparisons overlap in controls. Registry development uses different earlier/later treated groups, 35/22, without an untreated comparator. Survival cannot supply a motor or seizure endpoint. |
| Wellcovorin | The FOLR1 supplement was approved 9 March and announced 10 March 2026. [The entire NDA and all supplements were withdrawn 10 April](https://www.federalregister.gov/documents/2026/04/10/2026-06911/glaxosmithkline-withdrawal-of-approval-of-a-new-drug-application-for-wellcovorin-leucovorin-calcium), at the sponsor's request because the brand was not marketed. Withdrawal does not establish folinic-acid inefficacy. Generic ANDA/indication status remains unreviewed. |
| Folinic-acid reports | The FDA synthesis contains repeated literature patients. Oral-only neurological response, paired-CSF oral cases, individual sibling observations and late-treated nonresponse are different denominators. Broad neurological totals stay unmapped; specific seizure, ataxia, speech and MRI findings stay individual. Levofolinic-acid reports are not branded racemic-product trials. |
| Yuviwel | Growth velocity supports accelerated approval as a surrogate for adult height. Height, proportionality, radiographic alignment and full-cohort functional results retain separate mappings, roles and positive/null findings. Function totals without a valid HPO crosswalk stay unmapped. |
| Pasatru | OPTIMA lesion counts are favorable, but incidence, volume and patient-reported flare comparisons are nonsignificant. Dose-specific clinician flare findings differ. LUMINA-1's earlier PET primary failed. Mouse progenitor/pathway experiments do not establish human FAP rescue. |
| Atebrioz | Labeling reports a favorable volume result. The original PROGRESS conference abstract's registered-primary incidence comparison was nonsignificant, with 32/30 imaged rather than 32/31 randomized patients. The Hodges–Lehmann estimate is not a difference of means. The integrated FDA review was inaccessible. |
| Joenja | Older randomized efficacy and pediatric PK/safety extrapolation are separate. The 37.30-point B-cell result is an adjusted percentage-point change, not a relative percentage or pediatric response. Eight currently dosed pediatric PK/safety subjects are not all 21 enrolled children. Pediatric numerical efficacy remains unknown. |
| Aqneursa | A-T and NPC trials and regulatory indications are distinct. fSARA, SARA and mSARA estimates are not interchangeable. NPC mDRS/NPC-CSS totals combine neurological domains and stay unmapped to ataxia. The drug's distinct molecular target and clinical cell engagement remain unknown. |

Every observation declares its comparator, population, time and relationship to
the clinical study. The reviewed [NPC mouse/cell study](https://doi.org/10.1093/braincomms/fcaa148)
found no significant purified-L Purkinje preservation in tested lobules, while
racemic DL showed preservation. Purified L affected microglial-marker density
and non-neuronal lysosomal volume. These are distinct formulation and assay
observations; neither DL protection nor NPC mouse findings are credited to
marketed L-only Aqneursa's A-T trial.

## Alleles requiring further source normalization

These primary reports supply leads for exact-allele curation. They do not yet
populate modality requirements or assign a mechanism to every ClinVar record.

- [Kaler 2008](https://pubmed.ncbi.nlm.nih.gov/18256395/) reports legacy ATP7A
  G666R and IVS9 donor +6T→G residual-function assays and different clinical
  responses. Two children sharing G666R had different neurodevelopmental
  outcomes. Modern transcript/assembly and deletion boundaries were not
  established from the reviewed text. Q1385X was predicted, rather than tested.
- [Steinfeld 2009](https://pubmed.ncbi.nlm.nih.gov/19732866/) reports FOLR1
  p.Q118X/p.C175X and p.K44_P49dup, with transcript/protein/localization and
  receptor-transfection assays. Wild-type receptor rescue is not leucovorin
  rescue. Modern source accession/assembly must be recovered explicitly.
- [Potic 2023](https://doi.org/10.1186/s13023-023-02802-6) reports homozygous
  FOLR1 NM_016725.3:c.465_466delinsTG, p.W156G, in two siblings, with exome
  alignment to GRCh37 and Sanger segregation. Same allele, different treatment
  timing and clinical response; no CSF or measured residual-function assay.
- [Brunetti 2021](https://pubmed.ncbi.nlm.nih.gov/34008900/) reports late-treated
  siblings without sizeable overall response. Exact HGVS/accession and the
  post-treatment follow-up interval were not available in the accessible
  abstract/FDA synthesis; neither is invented.

Original abstracts, conference reports and accessible indexed excerpts are
identified as such in source records. Full original A-T supplementary analyses,
the unavailable Atebrioz review and additional human NPC1 fibroblast reports
remain follow-up work. Independent reviews corrected the two broad NPC totals
and checked the high-risk metabolic denominators, regulatory withdrawal and
formulation distinctions before integration. Source consistency checks are
reported in [validation-report.md](validation-report.md); the wider remaining
inventory is in [therapeutic-evidence-coverage.md](therapeutic-evidence-coverage.md).
