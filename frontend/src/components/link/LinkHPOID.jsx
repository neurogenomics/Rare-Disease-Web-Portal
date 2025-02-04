import React from "react";
import { Launch } from "@mui/icons-material";

export default function LinkHPOID({ hpoId }) {
    const PREFIX = "HP:";
    const BASEURL = "https://hpo.jax.org/browse/term/";

    if (hpoId.startsWith(PREFIX)) {
        return (
            <a
                href={BASEURL + hpoId}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "underline" }}
            >
                {hpoId}{" "}
                <sup className="text-xs">
                    <Launch fontSize="inherit" />
                </sup>
            </a>
        );
    }
}
