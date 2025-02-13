import React from "react";
import { Tooltip, Popover } from "antd";
import { InfoOutlined, Launch } from "@mui/icons-material";

export default function SeverityTierInfo() {
    const info =
        "A classification that describes the impact of a phenotype on an individual’s health, functionality, and prognosis, ranging from mild to severe.";
    function popoverContent() {
        return (
            <>
                <p>{info}</p>
                <p className="mt-1">Hover over any tag for detailed information.</p>
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
                styles={{ root: { maxWidth: "350px" } }}
            >
                <InfoOutlined fontSize="inherit" />
            </Popover>
        </>
    );
}
