# Therapeutic evidence coverage

Reviewed 11 October 2026. The source of truth is `frontend/src/data/evidence/curatedEvidence.json`: **77 assessments and 218 primary regulatory, trial, registry, and identity sources**. Assessment count is not a product or trial count: the same intervention can have two regional brands, two indications, multiple populations, or several publications from one trial.

## What is complete

All **30 legacy catalog products** resolve to an assessment through `legacyTherapyIds`. Kebilidi/Upstaza and Lenmeldy/Libmeldy are grouped by intervention; disease-specific outcomes and regional indications stay visible. Acquired oncology, recurrent respiratory papillomatosis and MacTel cases retain their distinct biology: payload or antigen genes are not assigned as inherited disease genes.

The bounded current FDA inherited gene-therapy inventory contains **20 products**, all mapped in `coverage.fdaInheritedGeneTherapyProducts`. The inventory was checked against the [FDA approved cellular and gene therapy list](https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/approved-cellular-and-gene-therapy-products). EU comparison uses the [June 2026 CAT authorized-ATMP inventory](https://www.ema.europa.eu/en/documents/committee-report/cat-quarterly-highlights-approved-atmps-june-2026_en.pdf), subsequent [Itvisma authorization](https://www.ema.europa.eu/en/medicines/human/EPAR/itvisma), and product-specific records. Strimvelis and historical Glybera extend the EU intervention coverage. A historical authorization list does not establish current commercial availability.

Current safety restrictions, authorization changes and commercial discontinuations are recorded separately. This matters for Elevidys, Skysona, Beqvez, Roctavian, Zynteglo and Glybera: a product license, a regional withdrawal and a sponsor's commercial decision are different facts. Each assessment cites its applicable dated primary record.

## Extended mechanism coverage

RNA cases include SMN2 splicing; TTR suppression with four distinct interventions; SOD1, HTT and GFAP lowering; DMD exon skipping; the variant-specific CEP290 sepofarsen counterexample; the individualized MFSD8 example; SCN1A upregulation; metabolic and coagulation pathway bypass; hereditary angioedema; and APOC3 suppression. Clinical endpoints, indications and populations stay separate even when a mechanism is shared.

Additional comparators include CFTR modulation, ventricular enzyme delivery, an enzyme BBB shuttle, thymic tissue implantation, muscle-directed myostatin inhibition and MCT8-independent thyroid-hormone treatment. These expose producer-versus-affected-cell and pathway-bypass mechanisms that a gene-replacement-only inventory would miss.

Thirteen further assessments cover the requested comparator families: three Pompe replacements; agalsidase alfa, agalsidase beta and migalastat for Fabry disease; imiglucerase and eliglustat for Gaucher disease; olipudase for ASMD; asfotase for hypophosphatasia; emicizumab; tafamidis; and the elexacaftor/tezacaftor/ivacaftor combination. `coverage.reviewedComparatorFamilies` provides the exact assessment IDs. The cases preserve functional, anatomic, hematologic and biochemical evidence separately:

| Family now reviewed | Clinical evidence and boundary |
| --- | --- |
| Pompe replacement | [LOTS](https://pubmed.ncbi.nlm.nih.gov/20393176/) supports pulmonary function and published walking benefit; the current label's walking analysis has a confidence interval crossing zero. [COMET](https://pubmed.ncbi.nlm.nih.gov/34800399/) met respiratory noninferiority, but failed superiority and stopped hierarchical testing. [PROPEL](https://pubmed.ncbi.nlm.nih.gov/34800400/) failed primary walking superiority; secondary and subgroup results remain bounded. |
| Fabry replacement and chaperoning | [Agalsidase-alfa pain](https://pubmed.ncbi.nlm.nih.gov/11386930/) improved in a small randomized trial. Agalsidase-beta endothelial clearance and the [advanced-disease event trial](https://pubmed.ncbi.nlm.nih.gov/17179052/) are distinct: the event trial's adjusted primary analysis had P=.06. [FACETS](https://www.nejm.org/doi/full/10.1056/NEJMoa1510198) failed its full-population primary response analysis; [ATTRACT](https://pmc.ncbi.nlm.nih.gov/articles/PMC5502308/) assessed comparable renal trajectories after ERT, rather than demonstrated major-event superiority. |
| Gaucher replacement and substrate reduction | [Imiglucerase's randomized active comparison](https://pubmed.ncbi.nlm.nih.gov/7985893/) showed similar hematologic and organ-volume improvement to alglucerase. [ENGAGE](https://pmc.ncbi.nlm.nih.gov/articles/PMC4962880/) showed short-term spleen/hematologic benefit; [ENCORE](https://pubmed.ncbi.nlm.nih.gov/25819691/) demonstrated maintenance using a 25% noninferiority margin. Neither establishes neurological rescue. |
| ASMD replacement | [ASCEND](https://pubmed.ncbi.nlm.nih.gov/35471153/) showed lung diffusion and organ-volume improvement, while the splenomegaly-related symptom score did not separate from placebo. Relative DLCO percentage change is not a percentage-point change. |
| Hypophosphatasia replacement | [Asfotase survival evidence](https://pmc.ncbi.nlm.nih.gov/articles/PMC4701846/) compares treated early-onset patients with historical controls. Label and publication denominators differ. Extracellular mineralization can improve respiratory consequences without correcting lung or skeletal-cell genes. |
| Haemophilia antibody bypass | [HAVEN 1](https://www.nejm.org/doi/full/10.1056/NEJMoa1703068) and [HAVEN 3](https://www.nejm.org/doi/abs/10.1056/NEJMoa1803550) show treated-bleed reduction in separate inhibitor populations. Bridging circulating FIXa/FX bypasses F8 deficiency; it does not rescue an F8 producer cell. |
| TTR stabilization | [ATTR-ACT](https://www.nejm.org/doi/full/10.1056/NEJMoa1805689) supports mortality/hospitalization benefit in combined hereditary and wild-type cardiomyopathy. The [Val30Met polyneuropathy trial](https://pubmed.ncbi.nlm.nih.gov/22843282/) did not meet ITT coprimary outcomes; favorable evaluable analyses remain visible. Plasma precursor stabilization is distinct from neuronal/cardiomyocyte rescue. |
| CFTR corrector/potentiator combination | [Single-F508del](https://www.nejm.org/doi/full/10.1056/NEJMoa1908639) and [homozygous-F508del](https://pubmed.ncbi.nlm.nih.gov/31679946/) randomized trials establish genotype-scoped pulmonary benefit. The current label adds a selected non-F508del trial; it does not demonstrate response for every eligible protein-producing allele or structural disappearance of bronchiectasis. |

The current [Cerezyme label](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=df60f030-866b-4374-a31f-8ae3f6b45c38) includes non-CNS type 3 Gaucher manifestations, supported by observational registry evidence. The [Xenpozyme label](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=01a910ee-a33e-4be3-ac41-322d64c34311) explicitly predicts no BBB crossing or CNS modulation. An absent CNS response is therefore a delivery/indication boundary, not evidence against neuronal disease involvement.

Exact allele restrictions matter. [Galafold](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=66dbd928-0f1c-48b1-a832-54e4abd9f1db) requires a disease-causing amenable GLA allele and remains an ongoing US accelerated approval; assay responsiveness does not establish pathogenicity. [Trikafta's March 2026 indication](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f354423a-85c2-41c3-a9db-0f3aee135d8d) includes responsive or CFTR-protein-producing variants, but its label states that in-vitro transport-response magnitude is not correlated with clinical-response magnitude. Safety and age/weight/onset restrictions are cited in each assessment; the expansion is not an individual treatment recommendation.

The evidence retains unfavorable or divergent outcomes. Examples include negative primary clinical endpoints despite biomarkers, neutral cardiomyopathy efficacy alongside approved neuropathy efficacy, and biochemical benefit without demonstrated neurodevelopmental benefit. Same-trial subgroup analyses are labeled as such, not counted as replications. Registry completion is never interpreted as treatment efficacy.

## What is still outside the reviewed endpoint corpus

The corpus is **not comprehensive across every approved inherited-disease medicine**. `coverage.remainingModalityGaps` and `coverage.recentApprovedPharmacotherapyGaps` are the explicit backlog. The [FDA ARC selected rare-disease approvals](https://www.fda.gov/about-fda/accelerating-rare-disease-cures-arc-program/rare-disease-drug-approvals) confirms that recent approvals include additional cofactor, peptide, antibody and kinase-pathway treatments that have not received product-level endpoint curation here. ARC is itself a selected approvals page, not a substitute for a full Drugs@FDA inventory.

| Remaining family | What a complete comparison still needs |
| --- | --- |
| Further enzyme/protein replacements | Other MPS and lysosomal enzymes, Gaucher velaglucerase/taliglucerase, plus all extension and genotype/stage populations for the now-reviewed enzyme families |
| Further coagulation factors and antibodies | FVIII/FIX concentrates, concizumab and marstacimab; product-specific bleed trials and safety beyond reviewed emicizumab/fitusiran |
| Further chaperones, substrate reduction and small molecules | PKU treatments, bile-acid replacement, Gaucher miglustat and investigational venglustat; approved and investigational status remain separate |
| Further TTR stabilizers and CFTR combinations | Other products, including vanzacaftor/tezacaftor/deutivacaftor; separate genotypes and trials beyond reviewed tafamidis/ETI |
| Cofactor, hormone and peptide replacement/modulation | Disease-stage-specific biochemical and functional outcomes; no automatic neurological rescue claim |
| Transplantation, diet and organ replacement | Comparative outcomes and producer/affected-cell separation |
| Other RNA and investigational modalities | A separate inventory for common disease, acquired oncology, mRNA, editing and reprogramming; approval status must be sourced |
| Other jurisdictions and complete oncology labels | Regional regulatory inventory and every indication/line-of-treatment population |

General cord-blood/transplant products, non-genetically-engineered acquired oncology cellular therapies, and other acquired tissue-repair products are explicitly excluded in the coverage metadata. Their exclusion is a scope decision, not a claim that they lack clinical benefit.

## Interpretation contract

`diseaseGenes` identifies etiology; `therapeuticTargets` identifies the intervention's molecular targets. A receptor used for delivery or an antigen targeted by engineered cells must not become an inherited disease gene. Multi-gene syndrome arrays describe recognized etiologies, not evidence that every genotype was enrolled or responded equally.

`phenotypes` contains curated HPO endpoint mappings with `direct`, `proxy` or `unmapped` rationale. Cell fields distinguish disease relevance, exposure, engagement, rescue and bypass. Empty `rescue` arrays deliberately preserve uncertainty when a clinical trial or biomarker does not establish cell-resolved rescue.

A `benefit` trial result and an `indirect` cell conclusion can coexist. Conclusions describe how much the intervention bears on the predicted cell mechanism; approval and functional improvement alone cannot identify the uniquely sufficient cell type. Accelerated approvals based on surrogates retain the need to verify clinical benefit.

## Neurodevelopmental mechanism shortlist scope

`mechanismContexts.json` contains **27 reviewed contexts across 21 genes**, within the larger current panel. The added neurodevelopmental subset covers SLC6A1, STXBP1, FOXG1, SHANK3, TCF4, CHD2, SCN2A and SCN8A. This is a bounded review, not a completed mechanism curation of every panel gene or every allele. All newly added contexts have empty delivery, safety, dose and rescue gate facts.

Dosage-loss support comes from primary human genetic or functional studies and model experiments, rather than constraint scores. The [SLC6A1 variant uptake study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11179425/) supports a broad haploinsufficiency model while earlier model results motivate allele-level checks. [STXBP1 aggregating missense experiments](https://www.nature.com/articles/s41467-018-06507-4) and [TCF4 homologous missense experiments](https://pmc.ncbi.nlm.nih.gov/articles/PMC4736037/) support alternative model mechanisms for subsets of variants; neither is treated as a mechanism assignment to every patient.

[SCN2A patient-derived neurons](https://pmc.ncbi.nlm.nih.gov/articles/PMC10883610/) distinguish R1882Q gain from R853Q loss within the same DEE11 disease context. The [larger functional cohort](https://pmc.ncbi.nlm.nih.gov/articles/PMC11292900/) also found mixed effects and splice-isoform dependence. A disease-only join therefore remains ambiguous when opposite contexts share an identifier. SCN8A gain-channel DEE and loss-channel cognitive-impairment contexts retain distinct disease identifiers; the [systematic isoform study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11383174/) limits binary conclusions from individual channel measurements.

Preclinical restoration is phenotype- and time-dependent. [Early TCF4 restoration in mice](https://elifesciences.org/articles/72290) supports selected rescue, whereas a [December 2025 juvenile-restoration preprint](https://pmc.ncbi.nlm.nih.gov/articles/PMC12776099/) reports limited later rescue and is explicitly identified as a preprint. These observations do not populate human delivery or efficacy requirements. SHANK3 dosage-loss evidence is also kept separate from multigene-deletion effects and harm from overexpression.

Unreviewed disease joins remain unknown. Shared generic epilepsy identifiers, corneal TCF4 disease, FOXG1 duplication, SHANK3 schizophrenia susceptibility, SCN2A ataxia and untested missense alleles are not silently assigned the reviewed neurodevelopmental loss mechanism.
