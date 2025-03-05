import React, { useState, useEffect } from "react";
import { Popover } from "antd";
import { Histogram } from "@ant-design/plots"
import { BASE_API_URL } from "../../../config";
import { ArrowDropDown } from "@mui/icons-material";
import axios from "axios";


export default function SeverityScoreHover({ score, decimalPoints, showPercentile = false }) {
    const [scoresRef, setScores] = useState([]);

    useEffect(() => {
        async function fetchScores() {
            try {
                const response = await axios.get(
                    `${BASE_API_URL}/api/severity-scores`
                );
                setScores(response.data);
            } catch (error) {
                console.error("Error fetching severity scores:", error);
            } finally {
                console.log("Severity score fetch complete");
            }
        }

        fetchScores();
    }, []);

    const chartConfig = {
        data: scoresRef.map((score) => ({ score })),
        binField: "score",
        seriesField: "score",
        stackField: "score",
        style: {
            inset: 0.5,
        },
        height: 300,
        width: 600,
        axis: {
            x: {
                title: "Severity Score",
            },
            y: {
                title: "Phenotype Frequency",
            },
        },
    };

    const calculateMean = (arr) => {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((acc, num) => acc + num, 0);
        return (sum / arr.length).toFixed(decimalPoints);
    };

    const calculateMedian = (arr) => {
        if (arr.length === 0) return 0;
        const sortedArr = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sortedArr.length / 2);

        return sortedArr.length % 2 !== 0
            ? sortedArr[mid]
            : ((sortedArr[mid - 1] + sortedArr[mid]) / 2).toFixed(decimalPoints);
    };

    const calculatePercentile = (arr, score) => {
        if (arr.length === 0) return 0;
        const sortedArr = [...arr].sort((a, b) => a - b);
        const rank = sortedArr.findIndex((value) => value >= score);
        return ((rank / arr.length) * 100).toFixed(1);
    };


    const popoverContent = () => {
        const stats = [
            {
                label: "Maximum Score",
                value: Math.max(...scoresRef).toFixed(decimalPoints),
            },
            {
                label: "Minimum Score",
                value: Math.min(...scoresRef).toFixed(decimalPoints),
            },
            {
                label: "Mean Score",
                value: calculateMean(scoresRef),
            },
            {
                label: "Median Score",
                value: calculateMedian(scoresRef),
            },
        ];

        return (
            <>
                <div className="grid grid-cols-2 gap-4">
                    {stats.map(({ label, value }, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                {label}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="bg-gray-50 rounded-md">
                        <div className="pl-[73px] pr-[30px] -mb-5">
                            <div
                                style={{
                                    bottom: "10px",
                                    marginLeft: `${(score/Math.max(...scoresRef).toFixed(decimalPoints))*100}%`,
                                    display: "inline-block",
                                }}
                                className="mt-2 mb-1"
                            >
                                <p className="text-sm text-gray-500 font-medium -mb-2 -ml-[55px]">
                                    {score.toFixed(1)} |{" "}
                                    {calculatePercentile(
                                        scoresRef,
                                        score
                                    )}
                                    {" "}Percentile
                                </p>
                                <ArrowDropDown />
                            </div>
                        </div>
                        <Histogram {...chartConfig} />
                    </div>
                </div>
            </>
        );
    };

    return (
        <Popover content={popoverContent} title="Severity Score Distribution" placement="right">
            <div className="text-purple-900">
                {score.toFixed(decimalPoints)}{" "}
                {showPercentile && ` (${calculatePercentile(scoresRef, score)} Percentile)`}
            </div>
        </Popover>
    )
}