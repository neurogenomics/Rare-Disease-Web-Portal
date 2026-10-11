# Independent audit of the upstream scientific calculations

**Reviewed:** 11 October 2026. **Scope:** source inspection and small deterministic counterexamples, independent extraction of published supplementary Table S11, and a narrow primary-source check of modality-gate semantics. This is an internal technical audit, not a new validation study or a completed reanalysis of the atlases. It does not establish the provenance of the deployed MongoDB records.

The cell-type results can support **candidate cellular context**, conditional on the atlas, input gene evidence and model. Neither the association p/q-values nor the historical therapeutic benchmark establish causal cell types, intervention mechanisms or treatment-success probabilities. Fixing the website cannot silently confer those meanings on existing data.

## Source versions and recovery

GitHub API responses were used to resolve real repository commit SHAs; all source inspection used raw files pinned to those SHAs, not mutable branch names.

| Repository | Inspected commit | Commit date |
|---|---|---|
| `neurogenomics/rare_disease_celltyping` | `fe08bcde7e5287132bdfc5bf9dfd8fcff2dbb6c3` | 2026-02-25 |
| `neurogenomics/MSTExplorer` | `a2560ebab468364f07be518c75eb23a62df84f4d` | 2026-02-25 |
| `neurogenomics/HPOExplorer` | `6ed9ac7a5ce697ab70bba42d8d3a97961b6b4d3e` | 2025-12-01 |
| `neurogenomics/phenomix.core` | `b83926a9a80c68e24296568bd269642f4a620900` | 2025-08-03 |
| `neurogenomics/KGExplorer` | `09010d7da45566527a47582bac20e84c85547054` | 2025-12-01 |

The main source is [manuscript/index.qmd](https://github.com/neurogenomics/rare_disease_celltyping/blob/fe08bcde7e5287132bdfc5bf9dfd8fcff2dbb6c3/manuscript/index.qmd). The original local analysis checkout is older (`1257eef1475e4752f359c93028dc9edc4d90055e`), so it was not substituted for the published source.

The selected source files are preserved locally in `data/evidence/audit/`; their checksum manifest is versioned, while upstream source copies are excluded from this portal release. A clean checkout can retrieve the identified files from the pinned public links below. These files are evidence for the audit, not replacements for the analysis dependencies.

## Verified findings

### 1. The row-based failed-therapy result is structurally biased

**New independently verified defect.** [MSTExplorer `ttd_check.R`, lines 123–139](https://github.com/neurogenomics/MSTExplorer/blob/a2560ebab468364f07be518c75eb23a62df84f4d/R/ttd_check.R#L123) constructs the matched drug set by joining only records with `failed==FALSE` to prioritised genes. It then labels *all* records prioritised if their drug ID belongs to that restricted match set. A drug occurring only in the failed group can never be labelled prioritised, even if its gene is selected. The reported zero row overlap with failed therapies is therefore not evidence of predictive discrimination.

A two-row counterexample (failed drug targeting selected gene A; ongoing drug targeting selected gene B) returns `[False, True]`, although both genes are selected. The independently computed gene hypergeometric table does not share this exact status-filter bug, so the row and gene results must not be conflated.

**Correction:** derive a status-blind match from the same prespecified intervention–target–indication unit for every record, then stratify by outcome. Never use outcome/status to construct the predictor being validated.

### 2. Programme status is not clinical efficacy; denominators differ

The same function's lines 36–40 and 117–121 classify termination, market withdrawal and discontinuation as failure. Remaining statuses are “nonfailed”; no clinical endpoint measurement is required. [The plot](https://github.com/neurogenomics/MSTExplorer/blob/a2560ebab468364f07be518c75eb23a62df84f4d/R/plot_ttd.R#L16) counts rows, while [the hypergeometric function](https://github.com/neurogenomics/MSTExplorer/blob/a2560ebab468364f07be518c75eb23a62df84f4d/R/ttd_hypergeo.R#L13) deduplicates genes. A drug appearing in nine matched rows plus one unmatched drug yields 90% row recovery but 50% distinct-drug recovery. The rendered narrative uses the former kind of fraction.

**Correction:** keep regulatory status, development status, trial endpoint result and failure reason separate. Report exact denominator and assessment unit. A halted programme can fail commercially or for safety; an active programme has unknown efficacy. Validation against approved drugs alone also has survivorship/selection bias.

### 3. Published Table S11 does not substantiate therapeutic accuracy

The [published supplementary workbook](https://static-content.springer.com/esm/art%3A10.1186%2Fs13073-026-01692-0/MediaObjects/13073_2026_1692_MOESM2_ESM.xlsx) was downloaded directly (30,538 bytes; SHA256 `0e4ad710f3c001ab32040aa11db1738744401954605a2d40ecc83b871184a40d`). Its underlying worksheet XML was parsed rather than relying on the malformed sheet dimensions. Table S11 contains:

| Catalogue group | TP | FP | FN | TN | Sensitivity | Specificity | PPV |
|---|---:|---:|---:|---:|---:|---:|---:|
| Gene therapies, nonfailed | 65 | 3,083 | 13 | 1,852 | 0.8333 | 0.3753 | 0.02065 |
| Gene therapies, failed | 0 | 3,148 | 0 | 1,865 | undefined (`#NUM!`) | 0.3720 | 0 |
| All therapies, nonfailed | 591 | 2,557 | 1,664 | 1,620 | 0.2621 | 0.3878 | 0.18774 |
| All therapies, failed | 125 | 3,023 | 335 | 2,949 | 0.2717 | 0.4938 | 0.03971 |

The failed-gene-therapy row has zero known positive genes (`TP+FN=0`). Its sensitivity is undefined. For all therapies the failed-gene overlap is 125/460, so the row-level 0% headline cannot describe the gene-level result.

**Crucial interpretation:** this is catalogue overlap, not an independently adjudicated truth set. Genes outside the selected TTD catalogue are treated as negatives, though many are simply untested/unrecorded. Thus the 0.02065 value is not a justified estimate that only 2% of selected targets would work. Equally, 83% recovery of known catalogue genes is not therapeutic accuracy. Both positive and negative outcome truth, ascertainment and a matched background must be established before diagnostic/predictive performance terms are appropriate.

### 4. The model is a marginal co-specificity regression

[`iterate_lm_long_glm.R`, lines 23–35](https://github.com/neurogenomics/phenomix.core/blob/b83926a9a80c68e24296568bd269642f4a620900/R/iterate_lm_long_glm.R#L23) fits `glm(y ~ x)` separately per cell annotation, with no family override on the inspected call path (therefore the R Gaussian default). The code does not condition on other cell annotations, expression abundance/detectability, gene properties or curation intensity. Atlas gene-expression similarity and the shared HPO input can produce correlated hits.

**Correction:** label the existing output as a marginal association. A future rerun should compare binary/curated gene sets and provenance-aware evidence alternatives, evaluate gene covariates and correlated cell labels, and assess stability using matched nulls and independent reference data. Multiple-testing correction is not a substitute for a valid null/model or causal identification. Any causal claim needs its own appropriately scoped genetic/mechanistic/perturbational evidence.

### 5. Claimed input scaling is absent on the inspected call path

The manuscript methods describe scaled input variables, but [its analysis call](https://github.com/neurogenomics/rare_disease_celltyping/blob/fe08bcde7e5287132bdfc5bf9dfd8fcff2dbb6c3/manuscript/index.qmd#L273) does not pass `scale_fn`; [MSTExplorer passes through arguments](https://github.com/neurogenomics/MSTExplorer/blob/a2560ebab468364f07be518c75eb23a62df84f4d/R/run_phenomix.R#L49), and [phenomix.core defaults it to NULL](https://github.com/neurogenomics/phenomix.core/blob/b83926a9a80c68e24296568bd269642f4a620900/R/iterate_lm.R#L54). Slopes therefore remain dependent on input scales if this call path generated the data.

**Scope caveat:** this establishes code-to-methods inconsistency, not proof of how every cached result asset was generated. Positive rescaling in ordinary univariate Gaussian regression changes slopes but ordinarily not significance; it is not by itself evidence that all q-values are wrong. Corrected comparable effect sizes require source matrices and an explicit rerun.

### 6. `logFC` is not a biological fold change

[`add_logfc.R`, lines 17–18](https://github.com/neurogenomics/MSTExplorer/blob/a2560ebab468364f07be518c75eb23a62df84f4d/R/add_logfc.R#L17) computes `log2((estimate + abs(global_min)) / mean(estimate + abs(global_min)))`. This is a dataset-relative transformation of slopes with no treated/reference expression numerator and denominator. It changes if unrelated result rows alter the minimum or mean; a nonpositive minimum can yield a zero shifted value and negative infinity.

**Correction:** show native signed effect with its definition and uncertainty, or a separately defined standardised effect after rerunning; retain legacy transform only with an explicit legacy label. Do not plot it as expression change caused by disease or treatment.

### 7. GenCC categories are numerically accumulated

[`get_gencc.R`](https://github.com/neurogenomics/KGExplorer/blob/09010d7da45566527a47582bac20e84c85547054/R/get_gencc.R#L34) maps qualitative assertions to integers, then sums/averages across disease–gene submissions. [`hpo_to_matrix.R`](https://github.com/neurogenomics/HPOExplorer/blob/6ed9ac7a5ce697ab70bba42d8d3a97961b6b4d3e/R/hpo_to_matrix.R#L34) defaults to the sum metric averaged across disease-linked phenotype rows. Three Limited assertions (2+2+2) can equal one Definitive (6); repeated/assertion-volume evidence is not necessarily independent biological support. [`add_evidence.R:75`](https://github.com/neurogenomics/HPOExplorer/blob/6ed9ac7a5ce697ab70bba42d8d3a97961b6b4d3e/R/add_evidence.R#L75) uses `>=`, so a threshold of 3 admits Supportive (3).

**Correction:** preserve submitted classification, submitter, disease, inheritance and conflicting assertions. Use an explicit categorical inclusion policy or a calibrated evidence model; do not present the sum as a causal confidence probability. Keep phenotype mapping provenance separate from gene–disease validity.

### 8. Severity implementation differs from the documented construct

[`gpt_annot_codify.R:61–74`](https://github.com/neurogenomics/HPOExplorer/blob/6ed9ac7a5ce697ab70bba42d8d3a97961b6b4d3e/R/gpt_annot_codify.R#L61) divides by `3 × max(weight) × number_of_metrics = 180`; the listed weights sum to 33, so the numerator can reach only 99. The implemented maximum is 55, although described as 0–100. A denominator of `3 × sum(weights) = 99` would normalise this particular weighted construct to 100. Missing values are also dropped from the numerator with `na.rm=TRUE`, so missingness can depress scores rather than signal uncertainty.

[`gpt_annot_class.R:61–69`](https://github.com/neurogenomics/HPOExplorer/blob/6ed9ac7a5ce697ab70bba42d8d3a97961b6b4d3e/R/gpt_annot_class.R#L61) requires more than three Tier-2/3 features for Severe and checks Tier 3 for Moderate. The [published Methods](https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2026.1794934/full) specify at least three and Tier 2 respectively. A phenotype with only frequent impaired mobility is Mild in the code but Moderate under the written rule; exactly three relevant features can remain Moderate instead of Severe.

**Correction:** regenerate from the original item-level annotations with a named scoring version and missing-data policy, preserve legacy values for comparison, and independently evaluate the construct. Rescaling alone preserves ranking when all weights are fixed; it does not validate phenotype burden or turn severity into a treatment-priority score. Do not multiply an unversioned portal value by 100/55 blindly.

### 9. Published rerendering is not a clean regeneration

The main result chunk is `eval=FALSE`; the manuscript loads precomputed results. [`load_example_results.R:84`](https://github.com/neurogenomics/MSTExplorer/blob/a2560ebab468364f07be518c75eb23a62df84f4d/R/load_example_results.R#L84) defaults to `latest`. Input-gene mappings, atlases, cached intermediate targets and package dependencies also need pinning. Consequently the checked source cannot identify the precise generation conditions of an arbitrary imported table.

The inspected target call sets severity threshold to NULL and does not provide the physical-malformation filter described in the manuscript; `prioritise_targets` defaults `gpt_filters=NULL`. Its threshold choices remain a heuristic policy. Likewise [cross-atlas significance overlap](https://github.com/neurogenomics/MSTExplorer/blob/a2560ebab468364f07be518c75eb23a62df84f4d/R/validate_associations_correlate_ctd.R#L75) requires low q-values in both but does not explicitly require matching slope signs.

## Portal-specific implications and feasible correction scope

The portal audit reports that `hpoCellTypePredictions.json` lacks atlas/run/version provenance and was exported by retaining q<0.05 and top five rows per HPO, then rounding q-values to six decimal places. It contains only 43 HPO terms, with 31 truncated lists and 34 top q-values displayed as zero. Its generating asset hash has not been recovered. These are separate losses of coverage, provenance and numerical precision; upstream code findings cannot be assumed to identify the exact portal data lineage.

**Can be corrected in this website release:** independent edge types and uncertainty; trial-status/endpoint-outcome separation; explicit manual phenotype mapping; full evidence references; missingness/coverage counts; units/denominators; conservative mechanism compatibility gates; no efficacy probabilities from atlas q-values; no causality from expression; preservation of signed/raw q-values and atlas provenance when importing verifiable rows; conspicuous legacy-data labels where provenance is absent.

**Requires a frozen upstream reanalysis:** standardised effect regeneration; alternate GenCC policies; dependence/covariate-sensitive models; versioned severity recomputation; assay/reference sensitivity; independent outcome-labelled intervention benchmarking. This release restores source precision and signed atlas rows from the available portal import matrices, with all significant directions and all tested panel/endpoint rows; it does not regenerate that analysis. Do not “repair” old numbers in place without raw inputs. Record exact source asset checksum, sample/atlas context, package lockfile, code commit, scoring/model definition, selected unit and resulting checksum.

**Requires additional empirical evidence:** proving a cell mediates a phenotype or benefit; establishing safe gene dosage; target-cell exposure/engagement at clinical dose; calibrating modality success probabilities; prospective decision utility. Those cannot be completed by an interface or by mechanically passing a gate.

### Mechanism class is not a universal exclusion rule

A family-specific list of typical disease mechanisms can identify a plausible
direction, but absence from the list does not establish a necessary-condition
failure. In particular, dominant-negative activity does not universally make
wild-type gene augmentation impossible. [Ji et al., 2019, Figure 5 and the rescue
results](https://www.nature.com/articles/s41598-019-54892-7) restored chloride
currents in dominant-mutant patient-derived RPE with wild-type BEST1
supplementation, including an AAV2 experiment, without removing the mutant
allele. [Zhao et al., 2021, the ratio experiments and rescue
results](https://pmc.ncbi.nlm.nih.gov/articles/PMC8169119/) characterized
ratio-dependent dominant-negative effects for the tested dominant LoF variants.
Tested gain-of-function variants behaved differently: augmentation alone failed
in the studied RPE models, whereas suppression plus augmentation restored
channel function. These are preclinical cellular findings; they establish neither
clinical benefit nor a general augmentation-only rescue for gain-of-function
conditions.

**Portal rule:** a mechanism outside a family's typical-direction list yields
an unknown directional concern. Hard contradiction requires a cited,
intervention-specific reason showing that a necessary condition fails in the
selected scope. Explicit supported or contradicted gate facts must match the
gene, exact disease identifier, HPO phenotype and modality, plus any declared
variant, construct and population. An augmentation result cannot support a
knockdown gate, and one allele's failed construct cannot exclude every strategy
for the disease. Unknown evidence remains unresolved. This correction does not
turn the family list, a disease-level direction match or a cellular assay into
proof of patient-specific suitability.

## Verification performed and remaining limitations

- Resolved and pinned five upstream source repositories and inspected the call chain.
- Recomputed published Table S11 fractions directly from worksheet XML; discovered the prior audit's failed-gene denominator error.
- Ran source-derived Python property counterexamples for forced-zero failed matches, duplicate-row denominators, maximum severity 55, Tier-2-only classification and the three-feature boundary. These check logic, not the R dependency environment or complete biological analysis.
- Compared severity category code against the primary published Methods.
- Imported the complete four original portal matrix files into a checksummed, atlas-separated evidence layer; selected export coverage and precision limits are in the source manifest. This does not establish their missing generation lineage.
- Did not run the full R pipeline from frozen expression/HPO/GenCC inputs, recompute item-level severity, adjudicate every worldwide intervention or reproduce all reported performance statistics. Causal truth, population independence and deployment-data provenance remain unresolved.

## Selected file hashes

| Source at the pinned commit | SHA256 |
|---|---|
| `rare_disease_celltyping/manuscript/index.qmd` | `42986bd5894c311ff39586e30f0566b60493c36b8cf5779f2fa93039a776d8e0` |
| `MSTExplorer/R/ttd_check.R` | `dc8ad09d2b2d983082ffc3cc8c0e1fc1b2dfe8683c3120168db6e26eaa3342f4` |
| `MSTExplorer/R/ttd_hypergeo.R` | `82f0cd1746f440d517cd63e8b891842a392efec70538b37b84d8716df25f6cea` |
| `MSTExplorer/R/add_logfc.R` | `3c075a3d7ea7c594d405a375c77182932f788797cc2657364162ae58a57b95c9` |
| `HPOExplorer/R/gpt_annot_codify.R` | `b8c70d926a759a42d748396fe84a0c4d833b400b7ceb1fc99a811ce2a5dbcc78` |
| `HPOExplorer/R/gpt_annot_class.R` | `aa02b52392a426af188389b024c3d07beec4c9735d88a0ee2d424ffb5fee13cd` |
| `phenomix.core/R/iterate_lm_long_glm.R` | `808a0fdd54748b2ea190216c9fa91c3daeb8461484538e916aae7957f9bf0d07` |
| `KGExplorer/R/get_gencc.R` | `d6e5559d0353d7589f1ed0b4945429aa1e0e4041562d34339fbca180db4106b4` |
