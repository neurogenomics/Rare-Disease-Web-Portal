import React from "react";
import { Tag, Popover } from "antd";
import LinkHPOID from "../link/LinkHPOID";

export default function SeverityTierHover({ tier }) {
    const tiers = {
        0: {
            name: "Mild",
            description:
                "For quantitative traits, a deviation of between two and three standard deviations from the appropriate population mean.",
            tagColor: "green",
            hpoID: "HP:0012825",
        },
        1: {
            name: "Borderline",
            description:
                "For quantitative traits, a deviation that is less than two standard deviations from the appropriate population mean.",
            tagColor: "orange",
            hpoID: "HP:0012827",
        },
        2: {
            name: "Severe",
            description:
                "For quantitative traits, a deviation of between four and five standard deviations from the appropriate population mean.",
            tagColor: "red",
            hpoID: "HP:0012828",
        },
        3: {
            name: "Profound",
            description:
                "For quantitative traits, a deviation of more than five standard deviations from the appropriate population mean.",
            tagColor: "purple",
            hpoID: "HP:0012829",
        },
        NA: {
            name: "NA",
            description: "No severity information available.",
            tagColor: "default",
            hpoID: null,
        },
    };

    // Maps tagColor to a highlight background color
    function highlightColor(tagColor) {
        switch (tagColor) {
            case "green":
                return "rgba(0, 128, 0, 0.1)";
            case "orange":
                return "rgba(255, 165, 0, 0.1)";
            case "red":
                return "rgba(255, 0, 0, 0.1)";
            case "purple":
                return "rgba(128, 0, 128, 0.1)";
            default:
                return "rgba(0,0,0,0.05)";
        }
    }

    const numericTier = parseInt(tier);
    const inputTier = [0, 1, 2, 3].includes(numericTier)
        ? tiers[numericTier]
        : tiers.NA;

    function popoverContent() {
        return (
            <div className="space-y-2">
                {Object.entries(tiers).map(([key, data]) => {
                    const isCurrent =
                        key == tier ||
                        (key === "NA" && inputTier === tiers.NA);

                    return (
                        <div
                            key={key}
                            className="p-2 rounded-md"
                            style={{
                                backgroundColor: isCurrent
                                    ? highlightColor(data.tagColor)
                                    : "transparent",
                            }}
                        >
                            <div className="flex items-center pb-1">
                                <Tag color={data.tagColor}>{data.name}</Tag>
                                {data.hpoID && (
                                    <small className="pb-1 pl-1">
                                        <LinkHPOID hpoId={data.hpoID} />
                                    </small>
                                )}
                            </div>
                            <div className="text-sm pl-[0.5px]">{data.description}</div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <Popover
            content={popoverContent()}
            title="Severity Tiers"
            placement="right"
            overlayStyle={{ maxWidth: "400px" }}
        >
            <Tag color={inputTier.tagColor}>{inputTier.name}</Tag>
        </Popover>
    );
}
