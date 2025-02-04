import React from "react";
import { Tag, Popover } from "antd";
import LinkHPOID from "../link/LinkHPOID";
import { InfoOutlined } from "@mui/icons-material";

export default function SeverityTierInfo() {
    const info = "A classification that describes the impact of a phenotype on an individual’s health, functionality, and prognosis, ranging from mild to severe.";
    function popoverContent() {
        return (
            <>
                <p>{info}</p>
                <p className="mt-1">
                                        <span className="font-semibold">More information:</span> <LinkHPOID hpoId="HP:0012824" />
                                    </p>
            </>
        );
    };

    return (
        <>
            <Popover content={popoverContent} styles={{ root: {maxWidth: "300px"} }}>
                <InfoOutlined fontSize="inherit" />
            </Popover>
        </>
    )
}