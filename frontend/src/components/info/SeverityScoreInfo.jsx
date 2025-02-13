import React from "react";
import { Tooltip, Popover } from "antd";
import { InfoOutlined, Launch } from "@mui/icons-material";

export default function SeverityScoreInfo() {
    const info =
        "A normalized score (0-100) of phenotype severity, based on the type and frequency of clinical characteristics. Higher scores indicate more severe phenotypes, helping to assess prognosis and prioritize treatments.";
    function popoverContent() {
        return (
            <>
                <p>{info}</p>
                <p className="mt-1">Hover over any score for detailed distribution.</p>
                <p className="mt-1">
                    <span className="font-semibold">More information:</span>{" "}
                    <Tooltip title={<i>medRxiv: Harnessing generative AI to annotate the severity of all phenotypic abnormalities within the Human Phenotype Ontology</i>} placement="bottom">
                    <a
                        href="https://www.medrxiv.org/content/10.1101/2024.06.10.24308475v1.full-text"
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

    return (
        <>
            <Popover
                content={popoverContent}
                styles={{ root: { maxWidth: "400px" } }}
            >
                <InfoOutlined fontSize="inherit" />
            </Popover>
        </>
    );
}
