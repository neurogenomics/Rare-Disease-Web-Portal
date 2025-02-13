import React from "react";
import { Popover } from "antd";
import { InfoOutlined } from "@mui/icons-material";

export default function CellAtlasInfo(columnMode = false) {
    const info =
        "Single-cell RNA-seq atlases are comprehensive maps of gene expression in individual cells across diverse tissues, capturing cellular diversity, states, and interactions to advance understanding of development, health, and disease.";
    const info2 =
        "We use these cell atlases to systematically map rare disease-associated genes to specific cell types, uncovering their roles in disease mechanisms and potential therapeutic targets."
    function popoverContent() {
        return (
            <>
                <p>{info}</p>
                <p className="mt-1">{info2}</p>
                <p className="mt-1 font-medium">
                    {columnMode ? "Hover over any atlas name to learn more about it." : "Hover over each option below to learn more about it."}
                </p>
            </>
        );
    }

    return (
        <>
            <Popover
                title={columnMode ? "Source of the most associated cell type" : "Select a cell atlas to explore associations"}
                content={popoverContent}
                styles={{ root: { maxWidth: "450px" } }}
                placement="rightTop"
                className="-mt-[2px]"
            >
                <InfoOutlined fontSize="inherit" />
            </Popover>
        </>
    );
}
