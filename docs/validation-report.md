# Evidence validation report

Validated 2026-10-11. The current offline audit of 10,269 JSON files reports **zero schema, count, reference, source-field or archive/public consistency errors**. The release evidence comprises 235 passing checks: this follow-up reran 154 frontend, 14 bundle and 27 Python checks (195 rerun); 40 unchanged backend checks retain their previously passing result. The final production build passes. There is one unresolved disease-alias warning. These checks establish conservative calculations and traceability; passing them does not validate causal cell types, a clinical treatment decision or a treatment-success probability.

The prebuild publisher passed, and the final Vite production build took 33.22 seconds after the recent pharmacotherapy, CSS and fixed-example navigation follow-up. The evidence-workbench executable is 1,149.43 kB, or 262.11 kB gzip; the entry executable is 242.12 kB, or 75.27 kB gzip. The large frozen source datasets are separately fetched; the new authored endpoint evidence is included in the workbench chunk. Existing build warnings concern stale Browserslist data and chunks larger than 500 kB. Further splitting of authored evidence remains a performance opportunity. Desktop/mobile checks below verified the scoped results and allele controls. Earlier checks also verified the gene browser's unavailable-API warning, disabled unsourced percentile filter and route to the snapshot-backed workbench.

All 13 main, information and evidence entry routes now reuse the established
portal logo, header, navigation, footer and Ant Design conventions. Browser
checks at 1280px and 390px found no horizontal page overflow, including populated
phenotype, gene, cell, variant and treatment views. Actual reciprocal navigation,
atlas changes, same-route selections, Back/Forward, unavailable source recovery,
mobile-menu Escape and trial-drawer Escape were exercised. The detailed paths
are in [site-navigation-audit.md](site-navigation-audit.md). Fixed Methods examples
were additionally exercised from an unrelated ATM/ataxia/A-T context and open
populated treatment or modality records after clearing unrelated filters. CSS selectors remain
scoped. Frontend lint passes with the legacy prop-types and exhaustive-deps rules
excluded; their pre-existing debt has not been represented as a clean full lint.
All 154 frontend regressions pass. The publication adapter derives biological
explorer views from the audited corpus; the new endpoint and allele models are
validated separately below.

## Reproducible checks

Run from the repository root:

```sh
python3 -m unittest discover -s scripts/tests -p 'test_*.py' -q
backend/.venv/bin/python -m pytest backend/tests/test_candidate_evidence.py backend/tests/test_annotation_unknowns.py -q
node --test frontend/tests/*.test.mjs scripts/tests/snapshotBundles.test.mjs
python3 scripts/tests/audit_snapshots.py
npm --prefix frontend run build
git diff --check
```

The corpus audit requires `jsonschema` and the frozen local HPO, ClinGen and API caches created by the refresh pipeline. Those raw caches are excluded from the public snapshot archives. Production builds restore the versioned normalized archives and require neither Python nor those raw caches. The importer fixtures are offline; bundle fixtures use Python and Node with temporary directories.

| Check | Result |
| --- | --- |
| Import, dosage, ontology, registry-refresh, gene-phenotype projection and reverse-cell fixtures | 27 passed; rerun |
| Backend candidate engine and annotation missingness | 40 previously passed; unchanged, not rerun in this follow-up |
| Frontend evidence, endpoint scope, allele/modality, annotation, navigation, snapshot and severity handling | 154 passed; rerun |
| Snapshot publication and restoration | 14 passed; rerun |
| Final normalized corpus and archive audit | Zero errors; one disease-alias warning |
| Prebuild publication and final production build | Passed |
| Diff whitespace hygiene | Passed |

The 15 added annotation regressions distinguish an unassessed reference from a
source-backed TF or reagent assessment, restrict negative filters to declared
source coverage, and keep absent reference corpora separate from zero filter
matches. HPO counts are null until queried. Empty, invalid and failed specificity
samples never manufacture thresholds; valid zeros and tiny values retain their
precision. The percentile response declares its atlas, cell scope, sample size
and empirical sampling method; the interface labels it as an estimate and treats
legacy values without provenance as unverified. Retrieval failures remain
retryable. These fixtures use offline collections, not fabricated production
annotations.

The site-wide follow-up adds 10 durable-context navigation tests, 17 snapshot,
publication and legacy-URL tests, and five severity-distribution tests. They
separate missing requested atlas coverage from measured empty results, keep
zero-HPO targets searchable through authoritative identities, reject wider
reverse-cell filters, preserve signed rows and q=0, and test same-route history
hydration. Two differently capitalized neuron-label pairs previously collided
on the case-insensitive macOS filesystem. Reversible UTF-8 hexadecimal filenames
and exact source labels now preserve them independently. Missing severity
distributions cannot supply zero percentiles or infinite extrema; percentiles
use only finite source values, include ties and handle values above the maximum.

Manual configuration checks confirmed environment overrides for a separate
API/database and exact frontend origins. The actual FastAPI CORS middleware
accepts `http://127.0.0.1:5180` and rejects an unlisted origin without querying the
database. Scoped lint passes for the changed gene-browser, display helper and
frontend API configuration. Neither the checks nor the local preview alter the
Imperial services or populate an annotation database.

Streaming-array fixtures exercise one-byte and other small chunks, nested strings and Unicode, incomplete data, missing separators and trailing commas. Atlas import fixtures preserve signed estimates, zero and very small q-values, missingness and exact expression specificity; they distinguish all-tested panel exports from significant-only exports. ClinGen fixtures keep score 0, score 30, score 40 and unscored assertions distinct, preserve source identifiers and reject duplicate gene records.

ClinVar fixtures cover successful empty queries, server truncation, explicit retrieval caps, missing summaries and failed refreshes that preserve a dated previous snapshot. Benign, uncertain, pathogenic, somatic-impact and oncogenicity fields remain separate. Uncertain structural bounds and multiple loci cannot establish a precise exon projection. Ontology fixtures exercise multiple inheritance, term ordering, obsolete terms, clinical-branch ancestry and backend exclusion of inheritance metadata.

Registry-refresh fixtures include exact primary-source companion-cohort links, deduplicate repeated links and exclude lookalike hosts or unrelated paths. A completed trial with no reported results stays unassessed. A failed refresh preserves prior dated index evidence and exact public-file bytes only when that snapshot exists; current successful retrievals and retained stale records have separate counts.

The reverse-cell fixture includes positive associations beyond the displayed top cell, negative associations, source q=0, invalid values and exact labels shared between distinct atlases. Invalid NaN/Infinity estimates are rejected. The bundle tests exercise deterministic packing, byte-exact restoration of CRLF, Unicode, formatting and files without a final newline, and recovery of missing or altered public files. Damaged archives, mismatched inner or outer checksums, unsafe or duplicate paths, wrong groups, count mismatches and invalid JSON fail restoration without writing a new success stamp.

The mechanism-ledger regressions cover all 11 modality families without an automatic disease-direction rule: splice correction, exon skipping, base/prime/nuclease/RNA editing, small molecules, cell replacement, substrate reduction, antibody biologics and hormone/metabolite interventions. Explicit sourced support and contradiction survive evaluation; generic disease direction alone remains insufficient even when all other requirements are supported. An explicit assertion requires its own source rather than borrowing a disease-context citation. Further checks cover explicit mechanism evidence overriding automatic direction rules, preserve gate identity and necessity against extra evidence fields, and ensure that conflicting merged disease contexts discard scoped gate and modifier facts. Every explicit non-cargo judgment requires an explanation, HTTP(S) citations, exact gene/disease/HPO/modality scope and matching declared variant/construct/population. Missing or mismatched scope stays unknown. Automatic outside-family mechanisms produce direction concerns without hard incompatibility; a separate scenario-specific cargo failure remains a contradiction.

All 22 modality families require sourced functional sufficiency for the selected endpoint. Fixtures show that all other gates passing cannot substitute for an unknown biochemical threshold, effective cell fraction or circuit contribution. Unsupported affirmative and negative assertions remain unknown; declaring this necessary gate not applicable cannot bypass it, and sourced failure blocks that scenario. Molecular restoration does not establish benefit across the whole syndrome.

Four separate nonblocking maturity dimensions cover preclinical evidence, endpoint measurability, therapeutic precedent and comparative value. Fixtures preserve valid Strong/Moderate/Weak/Unknown judgments only with an explanation, HTTP(S) source array and matching gene, disease, phenotype and modality. Missing or malformed evidence, mismatched scope and omitted or mismatched declared constructs/populations stay unknown. Strong/weak labels cannot change any modality evaluation or candidate ordering, and ambiguous merged contexts discard these scoped facts. Disease-level contexts retain empty modifier ledgers; the exact-allele examples now contain four narrowly scoped maturity records, including an explicit Unknown for untested STXBP1 corrective-ASO evidence.

The interface review also checked that MacTel does not offer an inherited-disease requirement link when its disease-gene list is empty, while Luxturna retains the matching RPE65 requirement link. Access and treatment-window gates are scoped to the functional compartment, selected endpoint and stage: an extracellular or downstream bypass does not acquire an unjustified requirement to enter or rescue the disease-causing cells. All-family comparisons use the same selected disease context, gene reference and cassette scenario; family changes preserve that exact context and filters even when its new assessment falls outside the shortlist's requirement-status filter. Necessary gate counts remain separate from maturity labels. The original 92 variant files and 119 trial files remain byte-identical; existing atlas exports append source rows without removing the earlier rows. Authored endpoint/allele evidence is covered by the expanded corpus audit.

## Endpoint and exact-allele follow-up

There are 175 result records across 86 assessments: 172 have reviewed endpoint/population/comparator/time/role/analysis scope, and three remain source-limited and unknown. The initial MONARCH/ADMIRAL seizure result retains its inaccessible antecedent analysis; its extension subgroup has explicit denominator/uncertainty limits. Two pediatric leniolisib results retain qualitative sponsor claims without a numerical endpoint analysis. The earlier follow-up investigated all 57 carried-forward records, specifically scoped 56 and left the original seizure result unresolved; that historical review scope has not been recast as the current total.

Eight measured outcomes remain explicitly unmapped to an eligible HPO phenotype: overall survival, heterogeneous neurological response, overall NPC disability/severity and global clinical/improvement scales cannot borrow a motor or ataxia HPO. `direct` and `proxy` describe the relationship of a measurement to its assigned phenotype; neither label establishes treatment benefit, cell identity or mediation. Tests cover mapped/unmapped discovery, source-limited results, independent model context, indication separation and preservation of opposing outcomes. Diagnosis identifiers support discovery, not enrollment or eligibility of the reference allele. Accessible primary abstracts, labels/reviews, original conference reports and registry protocols support the reviewed facts; inaccessible full text and missing analysis detail remain explicit.

Recent primary-source curation adds separate Menkes survival, development and circulating pharmacodynamic scopes; heterogeneous and individual FOLR1 responses; older versus pediatric APDS; A-T versus NPC; and growth/FOP interventions. [Wellcovorin's signed supplement](https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2026/018342Orig1s015ltr.pdf) was approved March 9, 2026, but [FDA withdrew NDA018342 and all supplements](https://www.federalregister.gov/documents/2026/04/10/2026-06911/glaxosmithkline-withdrawal-of-approval-of-a-new-drug-application-for-wellcovorin-leucovorin-calcium) effective April 10. The clinical literature remains, while current generic-product status remains unreviewed. [Joenja's label](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/217759s006lbl.pdf) supports pediatric use through older controlled efficacy and eight current-dose PK/safety participants; the sponsor's 21-child study does not supply a quantified pediatric effect in the accessed report. The older +37.30 result is percentage points of naive B cells among total B cells, with 8 treated and 5 placebo in the analysis, not an absolute count or pediatric estimate.

FOP retains opposing scopes: garetosmab's new-lesion-count success coexists with null incidence/volume secondary analyses; zilurgisertib's [registered-primary incidence comparison](https://endo2026.eventscribe.net/fsPopup.asp?PresentationID=1844848&mode=presInfo) is null while its [FDA label](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/221198Orig1s000lbl.pdf) reports favourable volume progression. The inaccessible zilurgisertib integrated review prevents a full statistical reconstruction. [Original NPC model results](https://pmc.ncbi.nlm.nih.gov/articles/PMC7954382/) separate racemic-DL Purkinje preservation from nonsignificant purified-L preservation, purified-L CD68 histology and non-neuronal culture assays. Independent model support or counterevidence never inherits a human outcome cohort, drug formulation or mediation conclusion.

The final browser pass at 1280px and 390px found no page overflow. ATP7A Variation ID 5007604 links to exact OMIM:309400 and on to treatment evidence while retaining diagnosis scope; this navigation does not establish that the allele was enrolled or responsive. The Methods inventory route to Joenja clears unrelated filters, Wellcovorin status dates are visible, and the NCT00001262 drawer shows its actual source values and closes with Escape. Wrapped entity links now retain a clickable bounding box. [The recent pharmacotherapy review](recent-pharmacotherapy-review.md) records the source-access limits and exact-allele normalization leads.

Eight allele examples separate human phenotype observations, functional assays and clinical endpoints. Seven exact ClinVar mechanism scopes, seven requirement facts and four maturity records are audited. Resolver tests reject generic disease direction under an unreviewed allele, opposite observations, mismatched identity/scope and omitted experimental dimensions. Unknown and conflicting alleles retain neutral diagnosis labels. SCN2A R853Q's mixed experimental findings keep automatic intervention direction unknown even though conventional loss remains visible; a valid intervention-specific assessment can resolve only its matching scope. STXBP1 defect characterization does not become ASO treatment maturity. Model splice rescue for CEP290 does not establish visual efficacy.

Browser checks verified SCN2A gain/loss/unreviewed selections, CFTR intervention-scoped requirements and reciprocal variant/scenario navigation, STXBP1 VUS versus functional evidence and reported seizure absence, CEP290 model rescue versus negative randomized visual results, eplontersen organ switching, tiratricol developmental failure and divergent olipudase spleen results. Alias `/gene-therapy` navigation retains the exact allele/scenario. New selectors and populated allele views have no page overflow at 1280px/390px. At the earlier 77-assessment browser check, Methods and the downloaded manifest contained 293 records (219 treatment plus 74 endpoint sources). The current audited library contains 364 records (290 treatment plus 74 endpoint sources, including 35 endpoint condition references). Thirty-seven cellular observations across 21 assessments retain explicit comparators and outcome-cohort relationships; none asserts atlas identity or clinical mediation. Independent review corrected cross-product golodirsen/casimersen biopsy links and sharpened B-VEC microscopy denominators and the Fabry score-zero definition.

An earlier browser pass verified eteplirsen’s null controlled walking result beside its separate biopsy cohort, neutrophil expression beside uninterpretable infection efficacy, and direct secondary hypoglycemia worsening. Mobile testing found that rc-tabs could forward an undefined key after mouse focus and Enter, deleting the selected tab parameter. Valid-key checking and explicit Enter/Space activation now preserve the focused tab; a stable two-column mobile grid keeps all four tabs visible. Mouse switching across all four tabs, Enter/Space, desktop return and 390px/1280px page widths were verified. The source manifest download matched the corpus counts.

## Corpus and source traceability

| Audited quantity | Count |
| --- | ---: |
| Explicit gene panel | 103 |
| Genes with HPO disease-context rows | 94 |
| HPO gene/disease rows | 28,794 |
| Nonclinical ontology rows among those associations | 1,404 |
| HPO identifiers tested in the atlas source files | 11,028 |
| Panel, curated and legacy HPO identifiers selected for all-tested retention | 4,069 |
| Exported atlas files / retained association rows | 9,809 / 814,979 |
| Panel gene-expression rows across both atlases | 20,053 |
| Exact reverse-index cell labels: Descartes / Human Cell Landscape | 77 / 124 |
| Derived exact atlas/cell snapshots / signed q<0.05 rows | 201 / 46,514 |
| Complete ClinVar gene queries / per-gene variation rows | 103 / 181,802 |
| Distinct ClinVar Variation IDs across the panel | 178,780 |
| Registry snapshots | 130 |
| Registry retrieval failures / retained stale snapshots | 0 / 0 |
| Curated assessments / treatment source records | 86 / 290 |
| Additional endpoint sources / condition-reference subset | 74 / 35 |
| Endpoint result records / reviewed / source-limited unknown | 175 / 172 / 3 |
| Measured results with no eligible phenotype HPO mapping | 8 |
| Reviewed diagnosis crosswalk entries / structured cell observations | 68 / 37 |
| Resolved authored source-ID references, including coverage and allele records | 1,428 |
| Reviewed disease-mechanism contexts | 27 |
| Explicit allele/source functional cases / exact mechanism identities | 8 / 7 |
| Exact-allele requirement facts / maturity records | 7 / 4 |
| ClinGen dosage genes | 1,532 |
| Current normalized snapshots packed and restored | 10,042 |
| Packed / uncompressed snapshot bytes | 125,718,848 / 1,025,754,444 |

Every stored ClinVar variation is traceable to its cached NCBI summary and equals normalization of that source response. Source URLs, retrieval dates and checksums agree with the caches. For complete queries, the returned variation-ID set equals the saved search-ID set; all 103 retrieval denominators agree. These are complete **gene-symbol queries at their recorded retrieval dates**, including every returned classification, rather than all possible disease alleles or a phenotype-specific pathogenic-allele catalogue. A variation spanning several genes can appear in several gene files, which explains the difference between per-gene rows and distinct variation IDs.

API caches retain decoded JSON and a recorded HTTP-body hash. The offline audit compares the decoded source content and recorded provenance; it does not reconstruct the original HTTP body's whitespace or independently rehash those original response bytes.

All 103 gene-reference snapshots also agree with their cached Ensembl responses and the variant index: gene bounds, assembly, chromosome, strand, canonical transcript identity/version, translation length, transcript counts and the complete exported exon list are preserved. Every source response has at most one canonical transcript, so selecting a first transcript does not conceal an unresolved canonical choice in this snapshot.

All 130 registry snapshots agree with normalization of their cached ClinicalTrials.gov responses, including registered and reported outcomes, design, adverse-event data and references. All 49 distinct registry IDs linked through exact curated source URLs have snapshots, including companion cohorts. Their outcome interpretation remains `not_automatically_assessed`; registry status and result availability are not automatically turned into a favorable clinical finding.

Frozen HPO ontology and association source bytes match their recorded SHA256 values. The ontology is `hp/releases/2026-09-01`; the association export records a source modification date of 2026-09-02. An independent ancestry traversal reproduces the clinical-phenotype flags, and the backend and frontend use the same known IDs, clinical branch and ontology checksum. Inheritance, course and other ontology metadata remain in the source evidence but are excluded from therapeutic phenotype candidates.

Atlas counts, signed directions, q-threshold decisions, positive-only minimum-q display choices and coverage declarations agree with every retained row. Independent reconstruction of the reverse-cell index agrees with every significant signed association, including associations beyond the displayed top cell. The nine public metadata datasets equal their authored source snapshots. The 103-gene identifier bridge independently agrees with exact ClinVar symbol/NCBI-ID records, including all nine genes without HPO rows. The audit reconstructs all 201 derived cell files and their 46,514 signed rows, checks exact source values and context, source SHA references, bounded coverage and filename encoding. These are compatibility views, not new clinical evidence. All three compressed archives pass their outer checksums; all 10,042 current records pass individual checksums, byte counts and manifest membership checks and are byte-identical to the current public files.

The preservation audit compares the earlier 92-gene release with this expansion. All 92 existing variant files and 119 existing trial files are byte-identical. The original 92 expression arrays and HPO gene arrays are identical, including their ordering. All 9,762 earlier atlas files and 726,881 rows are retained; 88,098 source rows were added overall, including 78,651 appended in existing files and 9,447 in 47 new HPO files. The earlier 9,973 packed/public records describe the old release; archive/public byte equality above applies to the 10,042 current records, not to an assertion that every old atlas file stayed byte-identical.

Panel expansion is reproduced from the checksummed frozen HPO export before the atlas import. This sequence adds exact source associations for newly declared genes without refreshing the HPO release implicitly or creating variant-to-phenotype evidence:

```sh
python3 scripts/refresh_gene_phenotypes.py
python3 scripts/import_atlas_evidence.py --source-dir /path/to/original/portal/data
python3 scripts/build_cell_index.py
python3 scripts/pack_evidence_snapshots.py
node scripts/publish_evidence_indexes.mjs
python3 scripts/tests/audit_snapshots.py
```

## Scientific interpretation and remaining gaps

All 27 mechanism contexts have at least one same-gene disease-ID join. `MECP2-4` also lists `ORPHA:85281`, which is absent from the current HPO export; its `OMIM:300260` join resolves. This is retained as an alias-resolution warning, without inventing a crosswalk. Opposing mechanisms sharing a disease ID, including SCN2A, STXBP1 and TCF4 contexts, must remain ambiguous until an exact allele and appropriate functional evidence resolve them. The reviewed context is not assigned to every variation in a gene.

Independent primary-source spot checks support the scope of the SCN1A loss/gain distinction, SYNGAP1 dosage loss, MECP2 duplication, SLC6A1 tested-variant functional loss, STXBP1 reduced-dosage human-neuron model, TCF4 variant-specific fly model and SCN2A R1882Q gain versus R853Q conventional-current loss. The [SCN2A patient-neuron study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10883610/) reports variant- and assay-specific observations; R853Q's mixed experimental findings leave intervention direction unresolved. The [TCF4 fly-model study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4736037/) supports a model-specific dominant-negative context. The [SLC6A1 functional study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11179425/) supports tested-variant haploinsufficiency and leaves the developmental rescue requirement unresolved. These checks do not independently verify the full contents or current availability of every curated external reference.

The following limits remain material:

- **Coverage:** 124 selected panel/curated/legacy HPO identifiers are absent from the imported atlas sources. Nine panel genes have no HPO disease-context rows: ALAS1, CNTF, CSF2, HAO1, IFNA2, MAGEA4, TNFRSF17, UGCG and INHBA. Missing evidence is not a negative causal or therapeutic finding.
- **Staging compatibility:** local original explorers use the frozen HPO source and explicit 103-gene phenotype/expression panel; reverse cell views cover only q<0.05. Definitions, comments, cross-references and disease labels are not fully included. Annotation-browser reference filters, severity distributions and full severity facets still need a matching API/database. The interface reports unavailable sources rather than filling these gaps with synthetic data.
- **Historical curation:** the preserved severity dataset contains 17,141 rows, including 444 obsolete HPO IDs and 948 disagreements with current labels; the legacy product catalogue has 13 label disagreements. These values are historical machine annotations with an unvalidated construct, not patient-specific severity or treatment-priority probabilities. Current curated HPO labels resolve, are nonobsolete and belong to the clinical phenotype branch.
- **Atlas lineage:** exact import-file hashes and numerical precision are restored, but the analysis commit, expression and HPO releases and model configuration that generated those matrices remain unknown. Signed association, specificity and q-values do not establish causal cells, exposure, target engagement or clinical rescue. Source q=0 retains its unknown upstream precision.
- **Allele and transcript information:** 12,226 per-gene variation rows have no SPDI representation. Canonical Ensembl transcript identifiers, versions, strands and exons support conservative genomic overlap; protein length times three supplies a coding-length lower bound. The snapshots do not provide transcript-normalized CDS/cDNA positions, complete local sequence or a guaranteed clinically relevant transcript. They cannot determine actual splice repair, NMD, editing eligibility, functional effect or a full vector cassette.
- **Evidence roles:** HPO gene/disease annotations do not create allele-to-phenotype links. ClinGen dosage scores do not promote themselves to a selected allele's mechanism. A registered or completed trial does not establish a favorable clinical outcome. Biomarker changes, subgroup analyses, delivery-receptor targets and downstream bypass mechanisms remain distinct from direct clinical benefit and rescue of the disease-causing cells.
- **Modality decisions:** a matching disease mechanism alone cannot establish suitability, safe dose, the useful remaining allele, an appropriate treatment window or access to the functional compartment. Unsupported gates remain unknown; asserted research compatibility is a scoped conjunction, never an approval or efficacy probability.

The unresolved statistical work and required source reanalysis are documented separately in [the statistical audit](statistical-audit.md). This validation restores and checks evidence handling; it does not perform that upstream reanalysis or an independent worldwide intervention benchmark.
