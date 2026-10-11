# Rare-disease evidence portal — work plan

Requested 2026-10-11. Branch `codex/rare-disease-evidence`; working tree `/Users/nathanskene/Projects/Rare-Disease-Web-Portal-evidence`.

## Acceptance criteria

- Every claim has a source, evidence type, date and scope; approval, trial completion, endpoint improvement, cell exposure, engagement and causal rescue are distinct.
- Endpoint–HPO mappings are reviewed individually. Disease membership cannot establish a variant–specific-phenotype relationship. Wrong legacy IDs and identity joins are quarantined, not silently trusted.
- Positive, null, harmful, surrogate-only and indirect therapeutic cases can be inspected. Unknown is visible and cannot become negative evidence or eligibility.
- Cell comparisons preserve exact identity versus related lineage, developmental state, atlas, route, species and context. Enrichment is association, not causal attribution. No purported prediction accuracy from an opportunistic therapy sample.
- Variants show accession, condition, clinical classification, review status, assembly, coordinate, consequence, transcript and source. Gene mechanism, variant consequence, dosage sensitivity and constraint are separate.
- Modality requirements are explicit, scoped, evidence-bearing gates; unsupported gates stay unknown. A disease mechanism outside a family's typical-direction list is an unresolved directional concern, not proof of hard incompatibility. Explicit positive/negative gate facts require a cited reason and an exact gene, disease identifier, HPO and modality match, plus any declared variant, construct and population. Rankings disclose coverage, missing data and ordering rather than fabricated probabilities.
- Researcher can navigate phenotype ↔ cell ↔ gene ↔ variant ↔ therapy ↔ trial ↔ source, filter, share and export.
- Existing candidate API cannot invent phenotype–gene edges from cell expression.
- Meaningful calculation, schema and UI tests pass; local preview is visually inspected at desktop/mobile sizes. Production is only called updated if deployment is actually verified.
- Vault writeback includes evergreen explanation, actual main portal note, parent/sideways links, source records and checked navigation.

## Workstreams

1. Recover previous code, meeting requirements and known analysis failures.
2. Rebuild evidence ingestion and validation, retaining all legacy entries with honest review status.
3. Curate primary evidence across modalities, including counterexamples and failed trials.
4. Implement variant/transcript reference ingestion and transparent modality assessment.
5. Replace misleading clinical-evidence presentation with an interactive research workbench and connect existing pages.
6. Repair phenotype–gene candidate joins; review source statistical assumptions.
7. Verify, refine, document coverage and limitations, and make the result reviewable.

## Known initial defects

- HPO ID/label disagreements and therapy numeric-ID collisions.
- Registry endpoint descriptions treated as achieved clinical outcomes.
- Heuristic broad cell matching presented as accuracy; incompatible ontological identities treated as exact.
- Missing route information treated as inaccessible; animal tropism generalized to human delivery.
- Candidate genes selected by cell expression without phenotype–gene evidence.
- LLM answers used as biological validation. These are not source evidence.

Private meeting material is used to recover requirements; it must not enter public frontend assets.

## Release status — 11 October 2026

The implementation workstreams are complete for the declared evidence scope:
77 reviewed endpoint assessments with 218 cited sources, 119 registry snapshots,
92 complete ClinVar gene queries, 27 reviewed disease-mechanism contexts and 22
modality families. All 30 historical products have an adjudicated assessment;
additional inherited-disease comparisons include enzyme replacement, bypass,
chaperones, substrate reduction, stabilizers and CFTR modulation.

Mechanism direction is distinguished from a demonstrated necessary-condition
failure. Typical-direction mismatches remain unknown; explicit gate judgments
are limited to their cited intervention and selection scope. The preclinical
BEST1 dominant-negative augmentation counterexample and its gain-of-function
limits are documented in [statistical-audit.md](statistical-audit.md) and
[evidence-workbench.md](evidence-workbench.md). Preclinical evidence,
measurability, precedent and comparative value remain nonblocking modifiers.

The production build and 138 targeted tests pass. Desktop and 390px mobile
reviews exercised exact cell/atlas filters, endpoint/trial details, variant
coordinates and functional evidence, modality requirements and keyboard
navigation, all-family comparisons and separate nonblocking maturity ledgers.
The final corpus audit and release reference are recorded in
`docs/validation-report.md`.

This status does not assert a completed worldwide treatment review or an
independent cell-causality benchmark. Frozen statistical/severity reanalysis
requires missing generation inputs; additional atlas, cross-species, cell
taxonomy and severity-rationale features require their source evidence. These
remaining layers are listed in the coverage and statistical audits. No live
deployment has been verified.
