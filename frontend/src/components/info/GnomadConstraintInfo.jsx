import React from "react";
import { Tooltip, Popover } from "antd";
import { InfoOutlined, Launch } from "@mui/icons-material";

export default function GnomadConstraintInfo() {
    const info =
        "gnomAD constraint metrics measure how tolerant a gene is to loss-of-function (LoF) mutations in the human population.";

    function popoverContent() {
        return (
            <>
                <p className="mb-2">{info}</p>
                <div className="bg-gray-50 p-3 rounded mb-2">
                    <p className="font-semibold mb-1">Key metrics:</p>
                    <ul className="list-disc ml-4 text-sm">
                        <li><strong>pLI</strong>: Probability of LoF intolerance (0-1). Higher = less tolerant.</li>
                        <li><strong>LOEUF</strong>: LoF observed/expected upper bound fraction. Lower = more constrained.</li>
                    </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded mb-2">
                    <p className="font-semibold mb-1">Why it matters for gene therapy:</p>
                    <ul className="list-disc ml-4 text-sm">
                        <li>High pLI (&gt;0.9) = gene cannot tolerate losing function</li>
                        <li>LoF intolerance suggests disease is caused by loss of function</li>
                        <li>AAV gene therapy adds a working copy ("gene augmentation")</li>
                        <li>Gene augmentation only works if disease is LoF-based</li>
                    </ul>
                </div>
                <p className="mt-2 text-sm">
                    <span className="font-semibold">More information:</span>{" "}
                    <Tooltip title={<i>gnomAD: The Genome Aggregation Database</i>} placement="bottom">
                        <a
                            href="https://gnomad.broadinstitute.org/help/constraint"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            gnomAD Constraint Documentation
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
        <Popover
            content={popoverContent}
            styles={{ root: { maxWidth: "450px" } }}
        >
            <InfoOutlined fontSize="inherit" className="cursor-help" />
        </Popover>
    );
}
