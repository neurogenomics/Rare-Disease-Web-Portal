import { Popover } from "antd";
import { InfoOutlined } from "@mui/icons-material";
export default function AAVTractabilityInfo() {
  return <Popover content={<div style={{maxWidth:440}}>
    <p>AAV delivery requires evidence for the specific capsid, species, administration route, dose, age and cell state. Exposure, transduction and functional rescue are different observations. This portal does not assign a universal cell-type transduction score.</p>
    <p>Mouse PHP.B/PHP.eB blood–brain barrier performance depends on mouse receptor biology and cannot be assumed in humans. Dividing cells can dilute vector genomes; durable benefit still needs direct measurement.</p>
    <p>For a single conventional AAV, the roughly 4.7 kb vector-genome budget includes the chosen coding sequence, promoter, regulatory elements, polyA and ITRs. A short CDS alone does not prove that a cassette fits. Self-complementary and dual-vector designs have different requirements.</p>
    <p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6520463/" target="_blank" rel="noreferrer">Primary species/tropism study</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/8934224/" target="_blank" rel="noreferrer">Primary packaging study</a> · <a href="/evidence?tab=modalities">Assess modality requirements</a></p>
  </div>}><InfoOutlined fontSize="inherit" className="cursor-help" /></Popover>;
}
