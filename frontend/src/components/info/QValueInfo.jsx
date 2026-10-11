import { Popover } from "antd";
import { InfoOutlined } from "@mui/icons-material";
export default function QValueInfo() {
  return <Popover content={<div style={{maxWidth:420}}>
    <p>A q value reports a multiple-testing quantity from the generating analysis. It is not effect size, the probability that a cell causes a phenotype, or a probability of treatment success.</p>
    <p>The sign and estimate, tested hypotheses, atlas and model are needed to interpret an association. Small q values can occur for negative associations. A source value of zero may reflect rounding or numerical underflow and is not infinite evidence.</p>
    <p>The imported portal matrices do not record their complete generation configuration. The methods panel distinguishes restored source precision from statistical validation.</p>
    <p><a href="/evidence?tab=methods">Evidence methods and provenance</a></p>
  </div>}><InfoOutlined fontSize="inherit" className="cursor-help" /></Popover>;
}
