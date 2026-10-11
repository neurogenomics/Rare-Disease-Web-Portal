# Portal design and navigation audit

Reviewed locally on 11 October 2026 at `http://127.0.0.1:5180`. This records the
staging interface checks; it does not claim a production deployment or clinical
validation.

## Shared design

All routes below were checked at 390px and 1280px. Each rendered a real page
heading, the shared portal logo/header and footer, and no horizontal page
overflow. Wide biological tables and charts scroll within their containers.
The explorer sidebars stack above the main content below 1050px.

| Route | View |
| --- | --- |
| `/` | Portal homepage |
| `/phenotype` | HPO explorer |
| `/gene` | Gene explorer |
| `/celltype` | Exact atlas cell explorer |
| `/severity` | Legacy severity explorer |
| `/gene-browser` | Gene annotation browser |
| `/about` | Methods and project information |
| `/publications` | Publications |
| `/evidence` | Treatment evidence |
| `/variants` | Variant entry route |
| `/approved-therapies` | Treatment entry route |
| `/gene-therapy` | Modality entry route |
| `/evidence?tab=methods` | Methods and source coverage |

The older pages now use the same Ant Design cards, blue controls, system type,
neutral background and responsive content widths. About and Publications have
the same information-page shell. Route loading and unknown-page recovery also
reuse the shared identity. Charts retain meaningful scientific colour scales.

## Actual click-through checks

- Selected CFTR, inspected ClinVar Variation ID 7120 (G551D), followed its exact
  submitted `OMIM:219700` condition identifier to a disease-scoped modality
  context, selected Cirrhosis (`HP:0001394`), and opened that phenotype explorer.
- Followed its exact Descartes `AFP_ALB_positive_cells` row into the cell
  explorer, then an AGXT expression row into the gene explorer. Gene, HPO,
  disease identifier and atlas/cell scope were retained in the URLs.
- Changed the gene atlas to Human Cell Landscape. The gene was retained and
  the previous atlas's cell cleared. Back and Forward restored each atlas and
  hydrated the selected gene; a reciprocal variant link retained that scope.
- An unmatched gene/endpoint combination showed no matching therapies. Explicit
  filter changes recovered CFTR's reviewed Ivacaftor case rather than silently
  replacing the selected biological context.
- Followed Ivacaftor's measured FEV1 endpoint (`HP:0032342`) into the exact
  Descartes `Ciliated_epithelial_cells` explorer, then back to the endpoint's
  treatment evidence and the NCT00909532 numerical trial drawer.
- HAO1's authoritative NCBI identity and expression loaded despite its missing
  HPO annotation rows. Its HPO table stayed an available empty panel result.
  A new same-route SCN1A search hydrated the new gene and clickable HPO rows.
- Populated phenotype, gene, cell, variant and treatment views were checked at
  390px without page overflow. Long HGVS and table content remained contained.
- A cell request with q=0.1 showed source unavailability because the published
  reverse cell export covers q<0.05. It did not manufacture a wider result set
  or treat the failed request as absence of association.
- Escape dismissed the trial drawer and closed mobile navigation. Unknown
  routes displayed the shared recovery page with working portal entry links.
- The phenotype page tour opened from its shared control. An unavailable
  severity distribution showed an explicit warning and retry action, with
  neither a fabricated zero percentile nor infinite extrema.
- The Human Cell Landscape tree separately displayed `Adult_Fetal_neuron` and
  `Adult_Fetal_Neuron`. Each selection loaded its own different phenotype rows
  and exposed the exact source label and atlas in the result. Case-sensitive
  identities survive the case-insensitive host filesystem.
- A cell atlas change cleared the old cell from the displayed results, URL and
  evidence bridge. Back restored the exact former atlas/cell, and Forward
  restored the new atlas without reintroducing that cell.
- The phenotype/cell intersection modal loaded actual expression rows and its
  CFTR link returned to the gene explorer with the selected HPO and exact cell
  scope. The populated modal also fit the 390px viewport.

## Evidence boundaries

The local compatibility views use published snapshots by default. They cover
the frozen September 2026 HPO ontology and the explicit 92-gene evidence panel.
Exact atlas labels remain distinct, including case-sensitive source labels.
Gene/HPO disease-context annotations are navigation aids, not allele-specific
phenotype attribution. Negative signed rows, source q=0, missing atlas coverage
and measured empty results remain separate states.

The annotation browser's full reference filters and the severity explorer's
full facets still need a matching API/database. Missing phenotype definitions,
comments and cross-references are labelled as not included in the snapshot.
Unavailable severity distributions cannot supply an empirical percentile.
The remaining source and statistical limits are in
[validation-report.md](validation-report.md) and
[statistical-audit.md](statistical-audit.md).
