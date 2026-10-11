import { useMemo } from "react";
import { Column } from "@ant-design/plots";
import { Card, Spin, Alert } from "antd";
import hpoSeverityData from "../data/hpoSeverity.json";

/**
 * Chart comparing severity distribution of approved therapy phenotypes
 * against the baseline distribution of all HPO phenotypes.
 */
export default function SeverityDistributionChart({ approvedTherapies }) {
    const chartData = useMemo(() => {
        // Extract primary endpoint HPO IDs from approved therapies
        const primaryHpoIds = new Set();
        const primaryHpoDetails = [];

        approvedTherapies.forEach((therapy) => {
            if (therapy.hpo_evidence) {
                therapy.hpo_evidence
                    .filter((ev) => ev.evidence?.endpoint_type === "primary")
                    .forEach((ev) => {
                        if (!primaryHpoIds.has(ev.hpo_id)) {
                            primaryHpoIds.add(ev.hpo_id);
                            primaryHpoDetails.push({
                                hpo_id: ev.hpo_id,
                                hpo_label: ev.hpo_label,
                                therapy: therapy.brand_name,
                            });
                        }
                    });
            }
        });

        // Create severity lookup from JSON data
        const severityLookup = {};
        hpoSeverityData.forEach((item) => {
            severityLookup[item.hpo_id] = {
                severity_class: item.severity_class,
                severity_score: item.severity_score,
                hpo_name: item.hpo_name,
            };
        });

        // Count baseline severity distribution
        const baselineCounts = { profound: 0, severe: 0, moderate: 0, mild: 0 };
        hpoSeverityData.forEach((item) => {
            if (item.severity_class && baselineCounts.hasOwnProperty(item.severity_class)) {
                baselineCounts[item.severity_class]++;
            }
        });

        // Count approved therapy severity distribution
        const approvedCounts = { profound: 0, severe: 0, moderate: 0, mild: 0 };
        const matchedPhenotypes = [];

        primaryHpoIds.forEach((hpoId) => {
            const severity = severityLookup[hpoId];
            if (severity && severity.severity_class) {
                if (approvedCounts.hasOwnProperty(severity.severity_class)) {
                    approvedCounts[severity.severity_class]++;
                    matchedPhenotypes.push({
                        hpo_id: hpoId,
                        ...severity,
                    });
                }
            }
        });

        // Calculate percentages
        const baselineTotal = Object.values(baselineCounts).reduce((a, b) => a + b, 0);
        const approvedTotal = Object.values(approvedCounts).reduce((a, b) => a + b, 0);

        // Create chart data
        const severityOrder = ["profound", "severe", "moderate", "mild"];
        const data = [];

        severityOrder.forEach((severity) => {
            data.push({
                severity: severity.charAt(0).toUpperCase() + severity.slice(1),
                category: "All HPO Phenotypes",
                percentage: baselineTotal > 0 ? (baselineCounts[severity] / baselineTotal) * 100 : 0,
                count: baselineCounts[severity],
            });
            data.push({
                severity: severity.charAt(0).toUpperCase() + severity.slice(1),
                category: "Approved Therapy Endpoints",
                percentage: approvedTotal > 0 ? (approvedCounts[severity] / approvedTotal) * 100 : 0,
                count: approvedCounts[severity],
            });
        });

        return {
            data,
            stats: {
                totalHpo: baselineTotal,
                primaryEndpoints: primaryHpoIds.size,
                matchedPhenotypes: matchedPhenotypes.length,
                approvedCounts,
                baselineCounts,
            },
            matchedPhenotypes,
        };
    }, [approvedTherapies]);

    if (!chartData.data.length) {
        return (
            <Alert
                message="No severity data available"
                description="Could not load HPO severity annotations."
                type="warning"
            />
        );
    }

    const config = {
        data: chartData.data,
        xField: "severity",
        yField: "percentage",
        colorField: "category",
        group: true,
        style: {
            inset: 5,
        },
        scale: {
            color: {
                range: ["#8884d8", "#82ca9d"],
            },
        },
        axis: {
            y: {
                title: "Percentage (%)",
                labelFormatter: (v) => `${v.toFixed(0)}%`,
            },
            x: {
                title: "Severity Class",
            },
        },
        tooltip: {
            title: "severity",
            items: [
                {
                    channel: "y",
                    name: "Percentage",
                    valueFormatter: (v) => `${v.toFixed(1)}%`,
                },
                {
                    field: "count",
                    name: "Count",
                },
            ],
        },
        legend: {
            position: "top",
        },
    };

    return (
        <Card
            title="Severity Distribution: Approved Therapy Endpoints vs All HPO Phenotypes"
            style={{ marginTop: 16, marginBottom: 16 }}
        >
            <div className="mb-4 text-sm text-gray-600">
                <p>
                    This chart compares the severity distribution of <strong>primary endpoint phenotypes</strong>{" "}
                    from approved gene therapies against the baseline distribution of all{" "}
                    {chartData.stats.totalHpo.toLocaleString()} HPO phenotypes.
                </p>
                <p className="mt-1">
                    <strong>{chartData.stats.primaryEndpoints}</strong> unique primary endpoint phenotypes
                    identified from approved therapies ({chartData.stats.matchedPhenotypes} with severity data).
                </p>
            </div>

            <div style={{ height: 350 }}>
                <Column {...config} />
            </div>

            {/* Summary statistics */}
            <div className="mt-4 grid grid-cols-4 gap-4 text-center text-sm">
                {["Profound", "Severe", "Moderate", "Mild"].map((severity) => {
                    const key = severity.toLowerCase();
                    const baselinePct =
                        chartData.stats.totalHpo > 0
                            ? ((chartData.stats.baselineCounts[key] / chartData.stats.totalHpo) * 100).toFixed(1)
                            : 0;
                    const approvedPct =
                        chartData.stats.matchedPhenotypes > 0
                            ? ((chartData.stats.approvedCounts[key] / chartData.stats.matchedPhenotypes) * 100).toFixed(1)
                            : 0;

                    return (
                        <div key={severity} className="p-2 bg-gray-50 rounded">
                            <div className="font-semibold">{severity}</div>
                            <div className="text-xs text-gray-500">
                                Baseline: {baselinePct}% | Approved: {approvedPct}%
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-xs text-gray-500">
                <strong>Note:</strong> Severity scores from GPT annotations via HPOExplorer. Higher severity
                (profound/severe) phenotypes are often targeted by gene therapies due to unmet medical need.
            </div>
        </Card>
    );
}
