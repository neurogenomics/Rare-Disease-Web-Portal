import React from "react";
import { Tooltip, Popover } from "antd";
import { InfoOutlined, Launch } from "@mui/icons-material";

export default function QValueInfo() {
    const info =
        "The q-value indicates how strongly a cell type is associated with a phenotype. A lower q-value (closer to 0) suggests a stronger and more reliable association.";
    const info2 =
        "Q-values are adjusted p-values that help control for false positives when testing multiple cell types. Values below 0.05 are typically considered significant.";
    function popoverContent() {
        return (
            <>
                <p>{info}</p>
                <p className="mt-2">{info2}</p>
                <div className="mt-3 rounded-lg p-1 pl-3 bg-purple-100">
                    <span className="font-semibold">
                        P-value correction method:{" "}
                    </span>
                    <Tooltip
                        title={
                            <i>
                                Journal of the Royal Statistial Society:
                                Controlling the False Discovery Rate: A
                                Practical and Powerful Approach to Multiple
                                Testing
                            </i>
                        }
                        placement="bottom"
                    >
                        <a
                            target="_blank"
                            href="https://doi.org/10.1111/j.2517-6161.1995.tb02031.x"
                        >
                            Benjamini-Hochberg{" "}
                            <sup className="text-xs">
                                <Launch fontSize="inherit" />
                            </sup>
                        </a>
                    </Tooltip>
                </div>
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
