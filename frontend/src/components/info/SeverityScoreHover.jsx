/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Alert, Button, Popover, Spin } from "antd";
import { Histogram } from "@ant-design/plots";
import { BASE_API_URL } from "../../../config";
import axios from "axios";
import { readSeverityDistribution, severityPercentile } from "../../lib/severityDistribution.js";

// Rows share one source request; a failed request stays unavailable until an explicit retry.
let distributionRequest;
function loadDistribution(retry = false) {
    if (!distributionRequest || retry) {
        distributionRequest = axios.get(`${BASE_API_URL}/api/severity-scores`)
            .then(response => readSeverityDistribution(response.data));
    }
    return distributionRequest;
}

export default function SeverityScoreHover({ score, decimalPoints = 3, showPercentile = false }) {
    const [distribution, setDistribution] = useState({ status: "loading" });
    const validScore = typeof score === "number" && Number.isFinite(score);
    const precision = Number.isInteger(decimalPoints) ? Math.min(10, Math.max(0, decimalPoints)) : 3;

    useEffect(() => {
        let cancelled = false;
        loadDistribution().then(value => {
            if (!cancelled) setDistribution(value);
        }).catch(() => {
            if (!cancelled) setDistribution({ status: "source_unavailable", reason: "The severity score API could not be loaded. Distribution statistics and percentiles are unavailable." });
        });
        return () => { cancelled = true; };
    }, []);

    const retrySource = async () => {
        setDistribution({ status: "loading" });
        try {
            setDistribution(await loadDistribution(true));
        } catch {
            setDistribution({ status: "source_unavailable", reason: "The severity score API could not be loaded. Distribution statistics and percentiles are unavailable." });
        }
    };

    if (!validScore) return <span style={{ color: "#595959" }}>Not available</span>;
    const percentile = severityPercentile(distribution, score);
    const percentileLabel = percentile === null
        ? distribution.status === "loading" ? "distribution loading" : "percentile unavailable"
        : `${percentile.toFixed(1)} percentile`;
    const formatScore = value => value.toFixed(precision);

    const content = (
        <div style={{ width: "min(560px, calc(100vw - 56px))", maxWidth: "100%", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif", color: "#262626" }}>
            {distribution.status === "loading" ? <Spin size="small" tip="Loading source distribution"><div style={{ minHeight: 48 }} /></Spin>
                : distribution.status !== "available" ? <Alert type="info" showIcon message="Distribution unavailable"
                    description={distribution.reason}
                    action={<Button size="small" onClick={retrySource}>Retry source</Button>} />
                : <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                        {[["Maximum", distribution.stats.max], ["Minimum", distribution.stats.min],
                            ["Mean", distribution.stats.mean], ["Median", distribution.stats.median]].map(([label, value]) => (
                            <div key={label} style={{ padding: 12, background: "#f5f5f5", borderRadius: 6 }}>
                                <div style={{ color: "#595959", fontSize: 12 }}>{label}</div>
                                <div style={{ fontSize: 18, fontWeight: 600, overflowWrap: "anywhere" }}>{formatScore(value)}</div>
                            </div>
                        ))}
                    </div>
                    <p style={{ margin: "16px 0 8px", lineHeight: 1.5 }}>
                        Score {formatScore(score)}: {percentile.toFixed(1)}% of the {distribution.count.toLocaleString()} finite
                        source values are at or below this score. Ties are included.
                    </p>
                    {distribution.excludedCount > 0 && <p style={{ color: "#595959", fontSize: 12 }}>{distribution.excludedCount.toLocaleString()} missing, nonnumeric or nonfinite values excluded.</p>}
                    <Histogram autoFit data={distribution.values.map(value => ({ score: value }))} binField="score"
                        style={{ inset: 0.5 }} height={240}
                        axis={{ x: { title: "Legacy severity score" }, y: { title: "Source value frequency" } }} />
                    <p style={{ color: "#595959", fontSize: 12, lineHeight: 1.5 }}>
                        This distribution describes available historical research annotations. It is not a clinically
                        validated severity scale or a measure of treatment priority. The source population and release
                        are not identified by this API response.
                    </p>
                </>}
        </div>
    );

    return (
        <Popover content={content} title="Legacy severity score distribution" placement="top" trigger={["hover", "focus", "click"]}>
            <button type="button" aria-label={`Inspect severity score ${formatScore(score)} and source distribution`}
                style={{ padding: 0, background: "none", border: 0, borderBottom: "1px dotted #1677ff", color: "#1677ff", font: "inherit", textAlign: "left", cursor: "pointer" }}>
                {formatScore(score)}{showPercentile && ` (${percentileLabel})`}
            </button>
        </Popover>
    );
}
