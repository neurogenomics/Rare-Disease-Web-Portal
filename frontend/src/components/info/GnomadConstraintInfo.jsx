import { Popover } from "antd";
import { InfoOutlined } from "@mui/icons-material";
export default function GnomadConstraintInfo() {
  return <Popover content={<div style={{maxWidth:420}}>
    <p>gnomAD constraint compares observed with expected population variation. LOEUF is an upper confidence bound for the predicted loss-of-function observed/expected ratio; lower values indicate stronger depletion.</p>
    <p>Constraint does not establish the disease mechanism, the effect of a particular allele, or whether raising expression is safe. Haploinsufficiency requires disease-specific dosage evidence. A predicted truncating variant may retain function, escape decay, or affect only some transcripts.</p>
    <p>Use the metric’s release and transcript. Thresholds vary between releases; missing constraint is not evidence of tolerance.</p>
    <p><a href="https://gnomad.broadinstitute.org/news/2026-03-gnomad-v4-1-1/" target="_blank" rel="noreferrer">gnomAD constraint interpretation</a> · <a href="https://www.clinicalgenome.org/curation-activities/dosage-sensitivity/" target="_blank" rel="noreferrer">ClinGen dosage evidence</a></p>
  </div>}><InfoOutlined fontSize="inherit" className="cursor-help" /></Popover>;
}
