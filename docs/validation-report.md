# Evidence validation report

Validated 2026-10-11. The final offline audit of 9,997 JSON files reports **zero schema, count, reference, source-field or archive/public consistency errors**. All 138 regression tests and the production build pass. There is one unresolved disease-alias warning. These checks establish conservative calculations and traceability; passing them does not validate causal cell types, a clinical treatment decision or a treatment-success probability.

The final prebuild publisher passed, and Vite completed the production build in 15.89 seconds after the evidence-ledger and staging missingness changes. The evidence-workbench executable is 654.26 kB, or 155.14 kB gzip; the main executable is 176.57 kB, or 58.50 kB gzip. Large evidence datasets are published as separately fetched data. Existing build warnings concern stale Browserslist data, `lottie.js` use of `eval` and chunks larger than 500 kB. The completed desktop/mobile and keyboard workbench review found no material scientific-limit mismatch with this report. A further desktop browser check verified the gene browser's unavailable-API warning, disabled unsourced percentile filter and route to the snapshot-backed workbench.

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
| Import, dosage, ontology, registry-refresh and reverse-cell fixtures | 22 passed |
| Backend candidate engine and annotation missingness | 40 passed |
| Frontend evidence, modality and annotation engines | 62 passed |
| Snapshot publication and restoration | 14 passed |
| Final normalized corpus and archive audit | Zero errors; one disease-alias warning |
| Prebuild publication and production build | Passed |
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

Four separate nonblocking maturity dimensions cover preclinical evidence, endpoint measurability, therapeutic precedent and comparative value. Fixtures preserve valid Strong/Moderate/Weak/Unknown judgments only with an explanation, HTTP(S) source array and matching gene, disease, phenotype and modality. Missing or malformed evidence, mismatched scope and omitted or mismatched declared constructs/populations stay unknown. Strong/weak labels cannot change any modality evaluation or candidate ordering, and ambiguous merged contexts discard these scoped facts. The current corpus has no modifier facts, so the interface displays unknown maturity rather than manufacturing it from trial phase or same-gene precedent.

The final interface review also checked that MacTel does not offer an inherited-disease requirement link when its disease-gene list is empty, while Luxturna retains the matching RPE65 requirement link. Access and treatment-window gates are scoped to the functional compartment, selected endpoint and stage: an extracellular or downstream bypass does not acquire an unjustified requirement to enter or rescue the disease-causing cells. All-family comparisons use the same selected disease context, gene reference and cassette scenario; family changes preserve that exact context and filters even when its new assessment falls outside the shortlist's requirement-status filter. Necessary gate counts remain separate from maturity labels. These interface/engine corrections changed no evidence snapshots, so the completed source-corpus audit remains applicable.

## Corpus and source traceability

| Audited quantity | Count |
| --- | ---: |
| Explicit gene panel | 92 |
| Genes with HPO disease-context rows | 84 |
| HPO gene/disease rows | 24,332 |
| Nonclinical ontology rows among those associations | 1,214 |
| HPO identifiers tested in the atlas source files | 11,028 |
| Panel, curated and legacy HPO identifiers selected for all-tested retention | 3,609 |
| Exported atlas files / retained association rows | 9,762 / 726,881 |
| Panel gene-expression rows across both atlases | 17,842 |
| Exact reverse-index cell labels: Descartes / Human Cell Landscape | 77 / 124 |
| Complete ClinVar gene queries / per-gene variation rows | 92 / 150,894 |
| Distinct ClinVar Variation IDs across the panel | 148,294 |
| Registry snapshots | 119 |
| Registry retrieval failures / retained stale snapshots | 0 / 0 |
| Curated assessments / source records | 77 / 218 |
| Resolved curated source-ID references | 612 |
| Reviewed disease-mechanism contexts | 27 |
| Explicit allele-specific functional cases | 2 |
| ClinGen dosage genes | 1,532 |
| Normalized snapshots packed and restored | 9,973 |
| Packed / uncompressed snapshot bytes | 111,164,041 / 893,291,495 |

Every stored ClinVar variation is traceable to its cached NCBI summary and equals normalization of that source response. Source URLs, retrieval dates and checksums agree with the caches. For complete queries, the returned variation-ID set equals the saved search-ID set; all 92 retrieval denominators agree. These are complete **gene-symbol queries at their recorded retrieval dates**, including every returned classification, rather than all possible disease alleles or a phenotype-specific pathogenic-allele catalogue. A variation spanning several genes can appear in several gene files, which explains the difference between per-gene rows and distinct variation IDs.

API caches retain decoded JSON and a recorded HTTP-body hash. The offline audit compares the decoded source content and recorded provenance; it does not reconstruct the original HTTP body's whitespace or independently rehash those original response bytes.

All 92 gene-reference snapshots also agree with their cached Ensembl responses and the variant index: gene bounds, assembly, chromosome, strand, canonical transcript identity/version, translation length, transcript counts and the complete exported exon list are preserved. Every source response has at most one canonical transcript, so selecting a first transcript does not conceal an unresolved canonical choice in this snapshot.

All 119 registry snapshots agree with normalization of their cached ClinicalTrials.gov responses, including registered and reported outcomes, design, adverse-event data and references. All 38 distinct registry IDs linked through exact curated source URLs have snapshots, including companion cohorts. Their outcome interpretation remains `not_automatically_assessed`; registry status and result availability are not automatically turned into a favorable clinical finding.

Frozen HPO ontology and association source bytes match their recorded SHA256 values. The ontology is `hp/releases/2026-09-01`; the association export records a source modification date of 2026-09-02. An independent ancestry traversal reproduces the clinical-phenotype flags, and the backend and frontend use the same known IDs, clinical branch and ontology checksum. Inheritance, course and other ontology metadata remain in the source evidence but are excluded from therapeutic phenotype candidates.

Atlas counts, signed directions, q-threshold decisions, positive-only minimum-q display choices and coverage declarations agree with every retained row. Independent reconstruction of the reverse-cell index agrees with every significant signed association, including associations beyond the displayed top cell. The eight public metadata datasets equal their authored source snapshots. All three compressed archives pass their outer checksums; all 9,973 records pass individual checksums, byte counts and manifest membership checks and are byte-identical to the public files.

## Scientific interpretation and remaining gaps

All 27 mechanism contexts have at least one same-gene disease-ID join. `MECP2-4` also lists `ORPHA:85281`, which is absent from the current HPO export; its `OMIM:300260` join resolves. This is retained as an alias-resolution warning, without inventing a crosswalk. Opposing mechanisms sharing a disease ID, including SCN2A, STXBP1 and TCF4 contexts, must remain ambiguous until an exact allele and appropriate functional evidence resolve them. The reviewed context is not assigned to every variation in a gene.

Independent primary-source spot checks support the scope of the SCN1A loss/gain distinction, SYNGAP1 dosage loss, MECP2 duplication, SLC6A1 tested-variant functional loss, STXBP1 reduced-dosage human-neuron model, TCF4 variant-specific fly model and SCN2A R1882Q gain versus R853Q loss. For example, the [SCN2A patient-neuron study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10883610/) resolves specific tested variants, while the [TCF4 fly-model study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4736037/) supports a model-specific dominant-negative context. The [SLC6A1 functional study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11179425/) supports tested-variant haploinsufficiency and leaves the developmental rescue requirement unresolved. These checks do not independently verify the full contents or current availability of every curated external reference.

The following limits remain material:

- **Coverage:** 110 selected panel/curated/legacy HPO identifiers are absent from the imported atlas sources. Eight panel genes have no HPO disease-context rows: ALAS1, CNTF, CSF2, HAO1, IFNA2, MAGEA4, TNFRSF17 and UGCG. Missing evidence is not a negative causal or therapeutic finding.
- **Historical curation:** the preserved severity dataset contains 17,141 rows, including 444 obsolete HPO IDs and 948 disagreements with current labels; the legacy product catalogue has 13 label disagreements. These values are historical machine annotations with an unvalidated construct, not patient-specific severity or treatment-priority probabilities. Current curated HPO labels resolve, are nonobsolete and belong to the clinical phenotype branch.
- **Atlas lineage:** exact import-file hashes and numerical precision are restored, but the analysis commit, expression and HPO releases and model configuration that generated those matrices remain unknown. Signed association, specificity and q-values do not establish causal cells, exposure, target engagement or clinical rescue. Source q=0 retains its unknown upstream precision.
- **Allele and transcript information:** 11,062 per-gene variation rows have no SPDI representation. Canonical Ensembl transcript identifiers, versions, strands and exons support conservative genomic overlap; protein length times three supplies a coding-length lower bound. The snapshots do not provide transcript-normalized CDS/cDNA positions, complete local sequence or a guaranteed clinically relevant transcript. They cannot determine actual splice repair, NMD, editing eligibility, functional effect or a full vector cassette.
- **Evidence roles:** HPO gene/disease annotations do not create allele-to-phenotype links. ClinGen dosage scores do not promote themselves to a selected allele's mechanism. A registered or completed trial does not establish a favorable clinical outcome. Biomarker changes, subgroup analyses, delivery-receptor targets and downstream bypass mechanisms remain distinct from direct clinical benefit and rescue of the disease-causing cells.
- **Modality decisions:** a matching disease mechanism alone cannot establish suitability, safe dose, the useful remaining allele, an appropriate treatment window or access to the functional compartment. Unsupported gates remain unknown; asserted research compatibility is a scoped conjunction, never an approval or efficacy probability.

The unresolved statistical work and required source reanalysis are documented separately in [the statistical audit](statistical-audit.md). This validation restores and checks evidence handling; it does not perform that upstream reanalysis or an independent worldwide intervention benchmark.
