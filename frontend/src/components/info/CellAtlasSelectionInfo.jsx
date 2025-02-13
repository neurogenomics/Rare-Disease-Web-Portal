import React from "react";
import { Tooltip, Popover } from "antd";
import { Launch } from "@mui/icons-material";

export default function SeverityScoreInfo({ atlasName, columnMode = false }) {
    const atlasInfo = {
        DescartesHuman: {
            name: "Descartes Human",
            info: "A comprehensive single-cell atlas of human fetal development spanning 15 organs during midgestation, mapping both gene expression and chromatin accessibility across 4 million cells.",
            resourceEntry: "Brotman Baty Institute - descartes",
            resourceLink: "https://descartes.brotmanbaty.org/",
            journalEntry:
                "Science: A human cell atlas of fetal gene expression",
            journalLink: "https://www.science.org/doi/10.1126/science.aba7721",
        },
        HumanCellLandscape: {
            name: "Human Cell Landscape",
            info: "The first broad reference map combining adult and fetal tissues to catalog human cell types across the lifespan, revealing key differences between stem cells and differentiated cells through single-cell gene expression analysis.",
            resourceEntry:
                "China National GeneBank Database - Human Cell Landscape",
            resourceLink: "https://db.cngb.org/HCL/",
            journalEntry:
                "Nature: Construction of a human cell landscape at single-cell level",
            journalLink: "https://www.nature.com/articles/s41586-020-2157-4",
        },
    };

    function popoverContent() {
        return (
            <>
                <p>{atlasInfo[atlasName]["info"]}</p>
                <p className="mt-1">
                    <span className="font-semibold">More information:</span>{" "}
                    <Tooltip
                        title={<i>{atlasInfo[atlasName]["resourceEntry"]}</i>}
                        placement="bottom"
                    >
                        <a
                            href={atlasInfo[atlasName]["resourceLink"]}
                            target="_blank"
                        >
                            Resource Website
                            <sup className="text-xs">
                                <Launch fontSize="inherit" />
                            </sup>
                        </a>
                    </Tooltip>
                    {", "}
                    <Tooltip
                        title={<i>{atlasInfo[atlasName]["journalEntry"]}</i>}
                        placement="bottom"
                    >
                        <a
                            href={atlasInfo[atlasName]["journalLink"]}
                            target="_blank"
                        >
                            Journal Article
                            <sup className="text-xs">
                                <Launch fontSize="inherit" />
                            </sup>
                        </a>
                    </Tooltip>
                </p>
            </>
        );
    }

    if (!atlasName) {
        return (
            <>
                <i className="text-gray-700">NA</i>
            </>
        );
    }

    return (
        <>
            <Popover
                content={popoverContent}
                styles={{ root: { maxWidth: "400px" } }}
                placement="bottom"
            >
                {columnMode ? (
                    atlasInfo[atlasName]["name"]
                ) : (
                    <div className="text-center font-medium">
                        {atlasInfo[atlasName]["name"]}
                    </div>
                )}
            </Popover>
        </>
    );
}
