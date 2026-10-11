import { Popover } from "antd";
import { InfoOutlined } from "@mui/icons-material";

export default function ExpressionSpecificityInfo() {
    const info =
        "Expression specificity shows how selectively a gene is expressed in this cell type. Values range from 0 to 1, where 1 means the gene is expressed almost exclusively in this cell type, and lower values indicate the gene is expressed more broadly across multiple cell types.";
    const info2 =
        "Expression specificity is a source expression metric. It does not establish gene function, cell causality, variant effects, therapeutic target engagement or delivery.";
    function popoverContent() {
        return (
            <>
                <p>{info}</p>
                <p className="mt-2">{info2}</p>
            </>
        );
    }

    return (
        <>
            <Popover
                content={popoverContent}
                styles={{ root: { maxWidth: "450px" } }}
            >
                <InfoOutlined fontSize="inherit" />
            </Popover>
        </>
    );
}
