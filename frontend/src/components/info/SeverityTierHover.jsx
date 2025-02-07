import React from "react";
import { Tag, Popover } from "antd";
import { Launch } from "@mui/icons-material";

export default function SeverityTierHover({ tier }) {
    const tiers = {
        0: {
            name: "Mild",
            description:
                "Assigned to phenotypes that do not meet criteria for higher severity classes. These typically have minimal impact on daily life.",
            tagColor: "green",
        },
        1: {
            name: "Moderate",
            description:
                "Assigned to phenotypes that often or always cause at least one Tier 2 clinical characteristic.",
            tagColor: "orange",
        },
        2: {
            name: "Severe",
            description:
                "Assigned to phenotypes that often or always cause one Tier 1 clinical characteristic OR three or more characteristics from Tier 2 and Tier 3.",
            tagColor: "red",
        },
        3: {
            name: "Profound",
            description:
                "Assigned to phenotypes that often or always cause more than one Tier 1 clinical characteristic.",
            tagColor: "purple",
        },
        NA: {
            name: "NA",
            description: "No severity information available.",
            tagColor: "default",
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
            <>
                <div className="-mt-1 mb-3 text-sm">
                    <p className="mb-2">Severity classes are determined by the presence and combination of these clinical characteristics:</p>
                    <ul className="list-none space-y-[0.5px] mb-2 ml-2 block">
                        <li><span className="font-medium">Tier 1 (Most severe):</span> death, intellectual disability</li>
                        <li><span className="font-medium">Tier 2:</span> impaired mobility, physical malformations</li>
                        <li><span className="font-medium">Tier 3:</span> blindness, sensory impairments, immunodeficiency, cancer</li>
                        <li><span className="font-medium">Tier 4 (Least severe):</span> reduced fertility</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2"><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4262393/" target="_blank">Based on Lazarin et al. (2014) severity classification system developed through consultation with 192 healthcare professionals.<sup className="text-xs">
                    <Launch fontSize="inherit" /></sup></a></p>
                </div>
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
                                </div>
                                <div className="text-sm pl-[0.5px]">
                                    {data.description}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }

    return (
        <Popover
            content={popoverContent()}
            title="Severity Classes"
            placement="right"
            overlayStyle={{ maxWidth: "420px" }}
        >
            <Tag color={inputTier.tagColor}>{inputTier.name}</Tag>
        </Popover>
    );
}
