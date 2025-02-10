import React, { useEffect, useState } from "react";
import { ResponsiveHeatMapCanvas } from "@nivo/heatmap";
import { Tooltip } from "antd";
import { InfoOutlined } from "@mui/icons-material";

const SeverityNetWork = ({ data1 }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        // console.log("Props changed:", JSON.stringify(data1));

        setData(data1);
        // console.log("Data has been set:", data1)
    }, [data1]);

    const truncateLabel = (label, maxLength) => {
        if (label.length > maxLength) {
            return label.substring(0, maxLength) + "...";
        }
        return label;
    };

    return (
        <>
            <div style={{ margin: "0 auto", height: 450, width: "95%" }}>
                <ResponsiveHeatMapCanvas
                    data={data}
                    margin={{ top: 90, right: 50, bottom: 10, left: 280 }}
                    axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -30,
                        legend: "Clinical Characteristics",
                        legendPosition: "middle",
                        legendOffset: -85,
                        truncateTickAt: 0,
                        format: (value) => {
                            return value
                                .split("_")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                )
                                .join(" ");
                        },
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "HPO Names",
                        legendPosition: "middle",
                        legendOffset: -250,
                        format: (value) => truncateLabel(value, 40),
                    }}
                    colors={{
                        type: "diverging",
                        scheme: "purples",
                        divergeAt: 0.5,
                        minValue: -1,
                        maxValue: 3,
                    }}
                    emptyColor="#555555"
                    // legends={[
                    //     {
                    //         anchor: "bottom",
                    //         translateX: 0,
                    //         translateY: 30,
                    //         length: 400,
                    //         thickness: 8,
                    //         direction: "row",
                    //         tickPosition: "after",
                    //         tickSize: 3,
                    //         tickSpacing: 4,
                    //         tickOverlap: false,
                    //         title: "Occurence",
                    //         titleAlign: "start",
                    //         titleOffset: 4,
                    //     },
                    // ]}
                    motionConfig="molasses"
                />
            </div>
            <div className="p-3 mb-3 ml-[14em] flex justify-center space-x-4" style={{  display: "inline-block !important" }}>
                <div className="flex items-center space-x-2 font-semibold mr-3">
                    <span>Occurrence</span>
                    <Tooltip title="Represents how often the clinical characteristic occurs, from 0 (never) to 4 (always).">
                        <InfoOutlined fontSize="Inherit" />
                    </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                    <div
                        className="flex items-center justify-center w-5 h-5"
                        style={{ backgroundColor: "#d9d8ea" }}
                    >
                        <span className="text-xs text-black">0</span>
                    </div>
                    <span>Never</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div
                        className="flex items-center justify-center w-5 h-5"
                        style={{ backgroundColor: "#9e9bc9" }}
                    >
                        <span className="text-xs text-black">1</span>
                    </div>
                    <span>Rarely</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div
                        className="flex items-center justify-center w-5 h-5"
                        style={{ backgroundColor: "#6a51a4" }}
                    >
                        <span className="text-xs text-white">2</span>
                    </div>
                    <span>Often</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div
                        className="flex items-center justify-center w-5 h-5"
                        style={{ backgroundColor: "#3f017d" }}
                    >
                        <span className="text-xs text-white">3</span>
                    </div>
                    <span>Always</span>
                </div>
            </div>
        </>
    );
};

export default SeverityNetWork;
