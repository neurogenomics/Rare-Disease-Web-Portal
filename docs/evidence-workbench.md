# Evidence workbench

This release connects interventions, measured endpoints, reviewed HPO mappings,
signed atlas associations, cell mechanisms, gene–disease contexts and clinical
variant assertions. Its assessments distinguish clinical response from delivery,
target engagement, functional rescue and bypass. They do not establish an
independent therapeutic accuracy estimate or patient-specific eligibility.

Start at `/evidence`. The original `/approved-therapies` and `/gene-therapy`
routes now use the same workbench. Phenotype, gene and exact atlas/cell selections
from the older explorers carry into it. URL filters support sharing; records,
source manifests, associations and shortlist tables can be downloaded.

## Inspect an evidence chain

1. Select a treatment and inspect its measured endpoint, population and time
   point. Direct and proxy HPO mappings are curator judgments with sources.
2. Read trial outcome separately from authorization and programme status. Open
   registry details for measures, groups, effect estimates, confidence intervals,
   p values and adverse events where posted. Unposted results remain unknown.
3. Compare disease relevance, delivery, engagement, rescue and bypass with the
   atlas rows. Positive and negative estimates are separate; exact labels do not
   establish lineage equivalence or cellular causality.
4. Follow the gene to ClinVar records. Inspect condition, germline versus somatic
   assertion, review status, accession, HGVS/SPDI, assembly and location. Precise
   variants can be placed against canonical exons; uncertain structural bounds,
   multi-locus records and missing coordinates remain unprojected.
5. Inspect a modality's requirement ledger in an exact disease context. A
   consequence, dosage score or constraint statistic cannot supply every gate.
   Multiple allele mechanisms within one disease stay unresolved until the
   allele is adjudicated. Supported requirements do not imply clinical efficacy.

For a selected context, compare all 22 families using the same gene reference
and cassette scenario. Switching families preserves the exact candidate and URL
filters, including when its new assessment lies outside a shortlist filter.
Functional sufficiency is a separate necessary condition: restoring a molecule
or reaching surviving cells does not establish a useful biochemical threshold,
cell fraction or downstream circuit response for the selected phenotype.

Mechanism lists describe a family's typical therapeutic direction. A sourced
disease mechanism outside that list creates an **unknown directional concern**;
it does not prove that every intervention in the family must fail. A positive
or negative explicit gate judgment needs a cited reason and an exact match to
the selected gene, disease identifier, HPO phenotype and modality. Any declared
variant, construct or population must also match. Evidence from another scope
cannot pass or contradict the selected gate. A supported disease-level direction
still does not adjudicate a patient's allele or establish functional rescue.

For example, wild-type BEST1 supplementation, including AAV2 delivery, restored
chloride currents in dominant-mutant patient-derived retinal pigment epithelial
cells without mutant suppression. Later experiments characterized ratio-dependent
dominant-negative effects and different responses for tested gain-of-function
variants. These are preclinical cellular results, not clinical efficacy or proof
that augmentation alone rescues gain-of-function disease.
[Ji et al., 2019](https://www.nature.com/articles/s41598-019-54892-7),
[Zhao et al., 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8169119/).

Preclinical evidence, endpoint measurability, therapeutic precedent and
comparative value are a separate, nonblocking maturity ledger. Each judgment
requires sources and an exact gene/disease/phenotype/modality scope; any declared
construct or population must also match. Missing facts stay unknown. These
modifiers do not alter compatibility, shortlist order or create a weighted score.

The default shortlist uses severe/profound **historical machine annotations**.
Ordering is lexicographic: contradictions, scoped mechanism support, legacy
severity class, unknown requirements, then a stable identifier. It is not a
weighted probability. Single-AAV cargo scenarios use the canonical CDS lower
bound plus all user-entered cassette bases; alternative constructs need their
own evidence. Twenty-two modality families expose different requirements.

## Sources and coverage

The current counts and tests are in [validation-report.md](validation-report.md).
The treatment inventory, coverage bounds and exclusions are in
[therapeutic-evidence-coverage.md](therapeutic-evidence-coverage.md). The upstream
calculation findings and scientific limits are in
[statistical-audit.md](statistical-audit.md).

`frontend/src/data/evidence/curatedEvidence.json` is the treatment source of
truth; identifiers, references, dates and scoped judgments are retained. Typed
`diseaseGenes` and `therapeuticTargets` prevent a payload, bypass target or
delivery receptor from becoming a disease etiology. `mechanismContexts.json`
contains individually reviewed disease-scoped mechanisms. Empty gates preserve
missing evidence, rather than assuming universal delivery, safety or rescue.

HPO disease-context associations come from a checksummed official export.
The frozen ontology supplies labels, synonyms, obsolete status and `is_a`
membership in Phenotypic abnormality. Inheritance, clinical course and modifier
metadata are excluded from therapeutic phenotype rankings. Unknown identifiers
remain explicit. ClinGen dosage evidence is a separate source layer: zero means
no evidence, score 30 describes a recessive context, and score 40 describes
evidence against dosage pathogenicity; these do not establish variant function.

The four original portal matrix files are streamed and checksummed. All
significant signed phenotype–cell rows are retained; every tested row is retained
for panel and reviewed/historical endpoint phenotypes. Panel expression keeps
every available source cell row without renormalization. Missing generation
commit, atlas release, model configuration and source item-level severity inputs
are acknowledged rather than invented. The reverse cell index uses every
significant row, not only the top association, with exact labels and separate
positive/negative sets.

## Build and refresh

The workbench can run from static snapshots without MongoDB. The original
explorers still require the configured API and database; failed requests show
unavailable evidence rather than biological absence.

```sh
cd frontend
npm ci
npm run dev
```

`predev` and `prebuild` restore the checksummed, lossless normalized snapshot
bundles from `data/evidence/published/` and publish eight lazily fetched datasets.
Each archive and restored file is verified; missing or corrupted outputs are
repaired. Files remain ordinary JSON at the frontend URLs. The large raw source
matrices and retrieval caches are excluded from Git. Private requirement-recovery
notes are also excluded. A clean Node checkout needs no Python to restore the
versioned build data.

To refresh sources, run the following from the repository root. Use an explicit
gene panel; record changes to scope alongside the curation. Existing frozen
snapshots are preserved when a retrieval fails. Registry and ClinVar completeness
apply to the declared queries, not to all biology or all disease treatments.

```sh
python3 scripts/refresh_evidence.py --genes --trials
python3 scripts/refresh_dosage.py
python3 scripts/refresh_hpo_terms.py
python3 backend/scripts/ingest_hpo_associations.py --export-only
python3 scripts/import_atlas_evidence.py --source-dir /path/to/original/portal/data
python3 scripts/build_cell_index.py
python3 scripts/pack_evidence_snapshots.py
node scripts/publish_evidence_indexes.mjs
```

The HPO label normalizer checks its frozen OBO checksum; selecting a different
ontology release requires a reviewed source-metadata update. The official
gene–phenotype export refresh is `ingest_hpo_associations.py` without
`--export-only`. Run the atlas import **after** the gene panel, HPO subset and
curated endpoints settle. Repack **before** starting the publisher/build: the
versioned bundles define the frozen public snapshot restored at build time.
The full HPO source and branch dictionary are versioned compressed backend files;
SQLite is a local, atomic, checksummed rebuild cache, not an additional truth set.

```sh
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
node --test scripts/tests/snapshotBundles.test.mjs
backend/.venv/bin/python -m pytest backend/tests/test_candidate_evidence.py -q
node --test frontend/tests/*.test.mjs
python3 scripts/tests/audit_snapshots.py
cd frontend
npm run build
```

## Deployment and unfinished scientific work

The build output includes `/data/evidence/` with all normalized snapshots. Serve
these files at that path, preserve SPA route fallback, and use HTTP compression
for the large JSON. The homepage and source indexes are lazy-loaded; data are
not embedded in the initial executable. Deploy the compressed HPO backend files
alongside the backend code, retaining a writable cache location for SQLite.
Smoke-test treatment, variant, modality and exact-cell URLs against the deployed
build and API before declaring the live site updated.

This branch does not silently modify the production database or publish a new
live deployment. Full statistical/severity regeneration needs frozen upstream
inputs and analysis dependencies; causal cell validation, safe dosage and human
target engagement need empirical evidence. Treatment curation is bounded and
continues by indication and endpoint. The portal makes these missing connections
visible rather than synthesizing a complete-looking causal chain.
