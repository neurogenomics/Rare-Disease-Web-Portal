import { useState, useMemo } from "react";
import CustomHeader from "../components/utilities/Header.jsx";
import CustomFooter from "../components/utilities/Footer.jsx";
import {
    Breadcrumb,
    Layout,
    theme,
    Table,
    Card,
    Select,
    Input,
    Tag,
    Tooltip,
    Badge,
    Statistic,
    Row,
    Col,
    Collapse,
    Popover,
} from "antd";
import { Launch } from "@mui/icons-material";
import SeverityDistributionChart from "../components/SeverityDistributionChart.jsx";
import hpoSeverityData from "../data/hpoSeverity.json";
import targetCellEvidenceData from "../data/targetCellEvidence.json";
import aavTropismReference from "../data/aavTropismReference.json";
import cellTypeMapping from "../data/cellTypeMapping.json";
import deliveryRouteFilters from "../data/deliveryRouteFilters.json";
import {
    approvedGeneTherapies,
    getUniqueCategories,
    getUniqueCompanies,
    getUniqueTherapyTypes,
    getCNSTherapies,
    getAAVTherapies,
    getInVivoTherapies,
    getTherapiesWithPredictions,
    getPredictionStats,
} from "../data/approvedGeneTherapies.js";

const { Content } = Layout;
const { Search } = Input;

// Helper function to normalize delivery route names for lookup
const normalizeRoute = (route) => {
    if (!route) return null;
    const routeLower = route.toLowerCase();

    // Map common route names to our standardized keys
    if (routeLower.includes('intravenous') || routeLower === 'iv') return 'IV';
    if (routeLower.includes('intracranial') || routeLower.includes('stereotactic') || routeLower.includes('intraparenchymal')) return 'intracranial';
    if (routeLower.includes('intrathecal') || routeLower === 'it') return 'intrathecal';
    if (routeLower.includes('intracerebroventricular') || routeLower === 'icv') return 'ICV';
    if (routeLower.includes('subretinal')) return 'subretinal';
    if (routeLower.includes('intravitreal') || routeLower === 'ivt') return 'intravitreal';
    if (routeLower.includes('intramuscular') || routeLower === 'im') return 'intramuscular';
    if (routeLower.includes('hsct') || routeLower.includes('ex vivo') || routeLower.includes('transplant')) return 'HSCT';

    return route; // Return as-is if no match
};

// Calculate effective tropism: serotype tropism filtered by route accessibility
// Priority order for access determination:
// 1. Serotype-specific override (e.g., AAV9 crosses BBB)
// 2. Age modifier (if provided)
// 3. Base route accessibility
const getEffectiveTropism = (serotype, deliveryRoute, ageContext = null) => {
    if (!serotype || !deliveryRoute) return null;

    // Get serotype data
    const serotypeData = aavTropismReference.serotypes[serotype];
    if (!serotypeData) return null;

    // Get route filter data
    const normalizedRoute = normalizeRoute(deliveryRoute);
    const routeFilters = deliveryRouteFilters.routes[normalizedRoute];
    if (!routeFilters) return null;

    // Collect all cell types from serotype tropism
    const tropismCellTypes = [];
    if (serotypeData.primary_tropism) {
        Object.values(serotypeData.primary_tropism).forEach(tissue => {
            if (tissue.cell_types) {
                tropismCellTypes.push(...tissue.cell_types);
            }
        });
    }
    if (serotypeData.mstexplorer_equivalent_celltypes) {
        tropismCellTypes.push(...serotypeData.mstexplorer_equivalent_celltypes);
    }

    // Get base accessible cell types from route
    const accessibleCellTypes = routeFilters.accessible_cell_types || {};

    // Get serotype-specific modifiers for this route (e.g., AAV9 BBB crossing)
    const serotypeModifiers = routeFilters.serotype_modifiers?.[serotype];

    const effectiveTropism = {
        accessible: [],
        limited: [],
        inaccessible: []
    };

    // Categorize each cell type
    const uniqueCellTypes = [...new Set(tropismCellTypes)];
    uniqueCellTypes.forEach(cellType => {
        let finalAccess = null;
        let accessNotes = null;
        let accessSource = null;

        // 1. Check serotype-specific override first (highest priority)
        if (serotypeModifiers?.overrides?.[cellType]) {
            finalAccess = serotypeModifiers.overrides[cellType];
            accessNotes = serotypeModifiers.description;
            accessSource = 'serotype_override';
        }

        // 2. Check age modifier (if no serotype override)
        if (!finalAccess && ageContext && routeFilters.age_modifiers?.[ageContext]?.[cellType]) {
            finalAccess = routeFilters.age_modifiers[ageContext][cellType];
            accessNotes = routeFilters.age_modifiers[ageContext].description;
            accessSource = 'age_modifier';
        }

        // 3. Fall back to base route accessibility
        if (!finalAccess) {
            const access = accessibleCellTypes[cellType];
            if (access) {
                finalAccess = access.access;
                accessNotes = access.notes;
                accessSource = 'base_route';
            }
        }

        // Categorize based on final access determination
        if (!finalAccess || finalAccess === 'no') {
            effectiveTropism.inaccessible.push({
                cell_type: cellType,
                reason: accessNotes || "Not listed in route accessibility"
            });
        } else if (finalAccess === 'yes') {
            effectiveTropism.accessible.push({
                cell_type: cellType,
                notes: accessNotes,
                source: accessSource
            });
        } else if (finalAccess === 'limited') {
            effectiveTropism.limited.push({
                cell_type: cellType,
                notes: accessNotes,
                source: accessSource
            });
        }
    });

    return effectiveTropism;
};

// Check if a predicted cell type is route-reachable
const isPredictedCellRouteReachable = (predictedCellType, serotype, deliveryRoute) => {
    if (!predictedCellType || !serotype || !deliveryRoute) return null;

    const effectiveTropism = getEffectiveTropism(serotype, deliveryRoute);
    if (!effectiveTropism) return null;

    // Normalize predicted cell type
    const normalizedPredicted = predictedCellType.replace(/_/g, ' ').toLowerCase();

    // Check in accessible
    const isAccessible = effectiveTropism.accessible.some(ct =>
        ct.cell_type.toLowerCase().includes(normalizedPredicted) ||
        normalizedPredicted.includes(ct.cell_type.toLowerCase())
    );
    if (isAccessible) return 'accessible';

    // Check in limited
    const isLimited = effectiveTropism.limited.some(ct =>
        ct.cell_type.toLowerCase().includes(normalizedPredicted) ||
        normalizedPredicted.includes(ct.cell_type.toLowerCase())
    );
    if (isLimited) return 'limited';

    // Check in inaccessible
    const isInaccessible = effectiveTropism.inaccessible.some(ct =>
        ct.cell_type.toLowerCase().includes(normalizedPredicted) ||
        normalizedPredicted.includes(ct.cell_type.toLowerCase())
    );
    if (isInaccessible) return 'inaccessible';

    return 'unknown';
};

export default function ApprovedTherapiesPage() {
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [modalityFilter, setModalityFilter] = useState("All");
    const [therapyTypeFilter, setTherapyTypeFilter] = useState("All");

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Get therapies enriched with predictions
    const therapiesWithPredictions = useMemo(() => getTherapiesWithPredictions(), []);

    // Filter data
    const filteredData = useMemo(() => {
        return therapiesWithPredictions.filter((therapy) => {
            const matchesSearch =
                searchText === "" ||
                therapy.brand_name.toLowerCase().includes(searchText.toLowerCase()) ||
                therapy.gene_symbol.toLowerCase().includes(searchText.toLowerCase()) ||
                therapy.disease_name.toLowerCase().includes(searchText.toLowerCase()) ||
                therapy.company.toLowerCase().includes(searchText.toLowerCase());

            const matchesCategory =
                categoryFilter === "All" || therapy.category === categoryFilter;

            const matchesModality =
                modalityFilter === "All" || therapy.modality.includes(modalityFilter);

            const matchesTherapyType =
                therapyTypeFilter === "All" || therapy.therapy_type === therapyTypeFilter;

            return matchesSearch && matchesCategory && matchesModality && matchesTherapyType;
        });
    }, [therapiesWithPredictions, searchText, categoryFilter, modalityFilter, therapyTypeFilter]);

    // Statistics
    const stats = useMemo(() => ({
        total: approvedGeneTherapies.length,
        cns: getCNSTherapies().length,
        inVivo: getInVivoTherapies().length,
        aav: getAAVTherapies().length,
        companies: getUniqueCompanies().length,
        ...getPredictionStats(),
    }), []);

    // Severity lookup and percentile calculation
    const severityInfo = useMemo(() => {
        // Create lookup from HPO ID to severity data
        const severityLookup = {};
        hpoSeverityData.forEach((item) => {
            severityLookup[item.hpo_id] = {
                severity_class: item.severity_class,
                severity_score: item.severity_score,
            };
        });

        // Calculate percentiles for all scores
        const allScores = hpoSeverityData
            .map((item) => item.severity_score)
            .filter((s) => s != null)
            .sort((a, b) => a - b);

        const getPercentile = (score) => {
            if (score == null || allScores.length === 0) return null;
            const index = allScores.findIndex((s) => s >= score);
            if (index === -1) return 100;
            return Math.round((index / allScores.length) * 100);
        };

        // Severity class order (higher = more severe)
        const severityOrder = { profound: 4, severe: 3, moderate: 2, mild: 1 };

        // Calculate for each therapy
        const therapySeverity = {};
        approvedGeneTherapies.forEach((therapy) => {
            let maxSeverityClass = null;
            let maxSeverityScore = null;
            let maxSeverityOrder = 0;

            // Get HPO IDs from evidence or fallback to hpo_ids
            const hpoIds = therapy.hpo_evidence
                ? therapy.hpo_evidence.map((ev) => ev.hpo_id)
                : therapy.hpo_ids || [];

            hpoIds.forEach((hpoId) => {
                const sev = severityLookup[hpoId];
                if (sev) {
                    const order = severityOrder[sev.severity_class] || 0;
                    if (order > maxSeverityOrder) {
                        maxSeverityOrder = order;
                        maxSeverityClass = sev.severity_class;
                    }
                    if (sev.severity_score != null && (maxSeverityScore == null || sev.severity_score > maxSeverityScore)) {
                        maxSeverityScore = sev.severity_score;
                    }
                }
            });

            therapySeverity[therapy.id] = {
                maxSeverityClass,
                maxSeverityScore,
                percentile: getPercentile(maxSeverityScore),
            };
        });

        return therapySeverity;
    }, []);

    // Severity class colors
    const severityClassColors = {
        profound: "red",
        severe: "orange",
        moderate: "gold",
        mild: "green",
    };

    // Category color map
    const categoryColors = {
        CNS: "purple",
        "CNS/Lysosomal": "purple",
        Neuromuscular: "blue",
        Ophthalmology: "cyan",
        Hematology: "red",
        Immunology: "green",
        Oncology: "orange",
        Metabolic: "gold",
    };

    // Modality color map
    const modalityColors = {
        AAV: "blue",
        Lentivirus: "purple",
        Retrovirus: "magenta",
        CRISPR: "green",
        HSV: "orange",
        Adenovirus: "cyan",
    };

    // Therapy type color map
    const therapyTypeColors = {
        "In vivo gene therapy": "blue",
        "Ex vivo gene therapy": "purple",
        "CAR-T": "orange",
        "TCR-T": "volcano",
        "Gene-edited cells": "green",
    };

    const getModalityColor = (modality) => {
        for (const [key, color] of Object.entries(modalityColors)) {
            if (modality.includes(key)) return color;
        }
        return "default";
    };

    const columns = [
        {
            title: "Brand Name",
            dataIndex: "brand_name",
            key: "brand_name",
            width: 120,
            render: (text, record) => (
                <div>
                    <span className="font-semibold">{text}</span>
                    {record.note && (
                        <Tooltip title={record.note}>
                            <Badge status="warning" className="ml-2" />
                        </Tooltip>
                    )}
                </div>
            ),
        },
        {
            title: "Gene",
            dataIndex: "gene_symbol",
            key: "gene_symbol",
            width: 100,
            render: (text) => {
                // Don't link CAR-T targets
                if (text.includes("-CAR")) {
                    return <span className="font-mono">{text}</span>;
                }
                return (
                    <a
                        href={`/gene?jump=${text}`}
                        target="_blank"
                        className="font-mono underline"
                    >
                        {text}
                    </a>
                );
            },
        },
        {
            title: "Disease",
            dataIndex: "disease_name",
            key: "disease_name",
            ellipsis: true,
        },
        {
            title: "Severity",
            key: "severity_class",
            width: 95,
            sorter: (a, b) => {
                const order = { profound: 4, severe: 3, moderate: 2, mild: 1 };
                const aClass = severityInfo[a.id]?.maxSeverityClass;
                const bClass = severityInfo[b.id]?.maxSeverityClass;
                return (order[aClass] || 0) - (order[bClass] || 0);
            },
            render: (_, record) => {
                const sev = severityInfo[record.id];
                if (!sev?.maxSeverityClass) return <span className="text-gray-400">-</span>;
                return (
                    <Tag color={severityClassColors[sev.maxSeverityClass]}>
                        {sev.maxSeverityClass.charAt(0).toUpperCase() + sev.maxSeverityClass.slice(1)}
                    </Tag>
                );
            },
        },
        {
            title: "Percentile",
            key: "severity_percentile",
            width: 90,
            sorter: (a, b) => {
                const aPerc = severityInfo[a.id]?.percentile ?? -1;
                const bPerc = severityInfo[b.id]?.percentile ?? -1;
                return aPerc - bPerc;
            },
            render: (_, record) => {
                const sev = severityInfo[record.id];
                if (sev?.percentile == null) return <span className="text-gray-400">-</span>;
                return (
                    <Tooltip title={`Score: ${sev.maxSeverityScore?.toFixed(1)} (top ${100 - sev.percentile}% most severe)`}>
                        <span className={sev.percentile >= 80 ? "font-semibold text-red-600" : ""}>
                            {sev.percentile}%
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 110,
            render: (text) => (
                <Tag color={categoryColors[text] || "default"}>{text}</Tag>
            ),
        },
        {
            title: "Type",
            dataIndex: "therapy_type",
            key: "therapy_type",
            width: 130,
            render: (text) => (
                <Tooltip title={text}>
                    <Tag color={therapyTypeColors[text] || "default"}>
                        {text === "In vivo gene therapy" ? "In vivo" :
                         text === "Ex vivo gene therapy" ? "Ex vivo" :
                         text === "Gene-edited cells" ? "Gene-edited" : text}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: "Modality",
            dataIndex: "modality",
            key: "modality",
            width: 140,
            render: (text) => (
                <Tooltip title={text}>
                    <Tag color={getModalityColor(text)}>
                        {text.length > 18 ? text.substring(0, 18) + "..." : text}
                    </Tag>
                </Tooltip>
            ),
        },
        {
            title: "Target Cell",
            dataIndex: "target_cell_type",
            key: "target_cell_type",
            width: 160,
            ellipsis: true,
            render: (text, record) => {
                if (!text) return <span className="text-gray-400">-</span>;
                const sourceLabels = {
                    fda_label: "FDA label",
                    clinical_trial: "Clinical trial",
                    aav_tropism: "AAV tropism",
                    mechanism: "Mechanism",
                };
                return (
                    <Tooltip title={`Source: ${sourceLabels[record.target_cell_source] || record.target_cell_source}`}>
                        <span className="text-sm">{text}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: "Predicted Cell",
            dataIndex: "predicted_cell_types",
            key: "predicted_cell_types",
            width: 160,
            ellipsis: true,
            render: (cellTypes, record) => {
                if (!cellTypes || cellTypes.length === 0) {
                    return <span className="text-gray-400">-</span>;
                }
                const topCellType = cellTypes[0]?.replace(/_/g, " ");
                const tooltipContent = (
                    <div style={{ maxWidth: 300 }}>
                        <p className="font-semibold mb-1">Top predictions:</p>
                        <ol className="list-decimal ml-4">
                            {cellTypes.slice(0, 5).map((ct, i) => (
                                <li key={i} className="text-xs">{ct.replace(/_/g, " ")}</li>
                            ))}
                        </ol>
                        {record.cell_type_match_details && (
                            <p className="mt-2 text-xs text-gray-400">{record.cell_type_match_details}</p>
                        )}
                    </div>
                );
                return (
                    <Tooltip title={tooltipContent}>
                        <span className="text-sm">{topCellType}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: (
                <Tooltip title="Does the therapy's actual target cell match what MSTExplorer predicts for the HPO phenotypes?">
                    <span>Match</span>
                </Tooltip>
            ),
            dataIndex: "cell_type_match",
            key: "cell_type_match",
            width: 90,
            filters: [
                { text: "Exact", value: "exact" },
                { text: "Related", value: "related" },
                { text: "Mismatch", value: "mismatch" },
                { text: "Unknown", value: "unknown" },
            ],
            onFilter: (value, record) => record.cell_type_match === value,
            render: (match, record) => {
                const matchConfig = {
                    exact: { color: "green", icon: "✓", label: "Exact", desc: "Predicted cell type matches therapy target" },
                    aav_reachable: { color: "cyan", icon: "↔", label: "AAV Reach", desc: "Different cell type, but within AAV tropism range AND accessible via delivery route" },
                    route_unreachable: { color: "red", icon: "⊘", label: "Route Block", desc: "AAV has tropism but delivery route cannot physically access the predicted cell type" },
                    related: { color: "blue", icon: "≈", label: "Related", desc: "Same tissue system, different specific cell type" },
                    mismatch: { color: "orange", icon: "≠", label: "Different", desc: "Phenotype maps to different tissue than therapy target" },
                    different: { color: "orange", icon: "≠", label: "Different", desc: "Phenotype maps to different tissue than therapy target" },
                    unknown: { color: "default", icon: "?", label: "Unknown", desc: "No prediction data available" },
                };
                const config = matchConfig[match] || matchConfig.unknown;
                return (
                    <Tooltip
                        title={
                            <div style={{ maxWidth: 300 }}>
                                <p className="font-semibold mb-1">{config.desc}</p>
                                <p className="text-xs">{record.cell_type_match_details}</p>
                            </div>
                        }
                    >
                        <Tag color={config.color}>
                            {config.icon} {config.label}
                        </Tag>
                    </Tooltip>
                );
            },
        },
        {
            title: "Company",
            dataIndex: "company",
            key: "company",
            width: 130,
        },
        {
            title: "Year",
            dataIndex: "approval_year",
            key: "approval_year",
            width: 70,
            sorter: (a, b) => a.approval_year - b.approval_year,
        },
        {
            title: "Agency",
            dataIndex: "approval_agency",
            key: "approval_agency",
            width: 100,
            render: (text) => {
                const agencies = text.split(", ");
                return (
                    <div>
                        {agencies.map((agency) => (
                            <Tag key={agency} size="small">
                                {agency.replace(" (withdrawn)", "")}
                            </Tag>
                        ))}
                    </div>
                );
            },
        },
        {
            title: "Delivery",
            dataIndex: "delivery_route",
            key: "delivery_route",
            width: 100,
        },
    ];

    // Confidence badge colors
    const confidenceColors = {
        high: "green",
        medium: "gold",
        low: "default",
    };

    const confidenceIcons = {
        high: "\u{1F7E2}",  // green circle
        medium: "\u{1F7E1}",  // yellow circle
        low: "\u{26AA}",  // white circle
    };

    // HPO evidence popover content
    const renderEvidencePopover = (evidence) => (
        <div style={{ maxWidth: 400 }}>
            <p className="text-sm mb-2">
                <strong>Endpoint:</strong> {evidence.evidence.endpoint_measure}
            </p>
            {evidence.evidence.endpoint_description && (
                <p className="text-xs text-gray-600 mb-2">
                    {evidence.evidence.endpoint_description}
                </p>
            )}
            <p className="text-sm mb-2">
                <strong>Rationale:</strong> {evidence.evidence.mapping_rationale}
            </p>
            <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                <strong>Sources:</strong>
                <ul className="list-disc ml-4 mt-1">
                    {evidence.sources.map((source, i) => (
                        <li key={i}>
                            <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {source.type === "clinicaltrials" ? "ClinicalTrials.gov" :
                                 source.type === "fda_label" ? "FDA Label" : source.type}
                            </a>
                        </li>
                    ))}
                </ul>
                <p className="mt-1">Mapped by: {evidence.evidence.mapped_by} ({evidence.evidence.mapping_date})</p>
            </div>
        </div>
    );

    const expandedRowRender = (record) => {
        const hasEvidence = record.hpo_evidence && record.hpo_evidence.length > 0;

        return (
            <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Indication</h4>
                        <p className="text-sm">{record.indication}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Details</h4>
                        <p className="text-sm">
                            <strong>Therapy type:</strong> {record.therapy_type}
                        </p>
                        <p className="text-sm">
                            <strong>One-time treatment:</strong> {record.one_time ? "Yes" : "No (may require repeat)"}
                        </p>
                        <p className="text-sm">
                            <strong>Delivery route:</strong> {record.delivery_route}
                        </p>
                        {/* Fallback: show simple HPO list if no evidence */}
                        {!hasEvidence && record.hpo_ids && record.hpo_ids.length > 0 && (
                            <div className="mt-2">
                                <strong className="text-sm">Related HPO terms:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {record.hpo_ids.map((hpo) => (
                                        <a
                                            key={hpo}
                                            href={`/phenotype?jump=${hpo}`}
                                            target="_blank"
                                            className="text-xs underline text-blue-600"
                                        >
                                            {hpo}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* HPO Evidence Section */}
                {hasEvidence && (
                    <div className="mt-4">
                        <Collapse
                            size="small"
                            defaultActiveKey={["hpo-evidence"]}
                            items={[
                                {
                                    key: "hpo-evidence",
                                    label: (
                                        <span>
                                            <strong>HPO Phenotype Evidence</strong>
                                            <Tag className="ml-2" color="blue">
                                                {record.hpo_evidence.length} mappings
                                            </Tag>
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            <Table
                                                size="small"
                                                pagination={false}
                                                dataSource={record.hpo_evidence}
                                                rowKey="hpo_id"
                                                columns={[
                                                    {
                                                        title: "HPO Term",
                                                        dataIndex: "hpo_label",
                                                        key: "hpo_label",
                                                        render: (text, row) => {
                                                            const hpoData = hpoSeverityData.find(h => h.hpo_id === row.hpo_id);
                                                            const definition = hpoData?.definition;
                                                            const termLink = (
                                                                <a
                                                                    href={`/phenotype?jump=${row.hpo_id}`}
                                                                    target="_blank"
                                                                    className="text-blue-600 underline"
                                                                >
                                                                    {text}
                                                                </a>
                                                            );
                                                            if (definition) {
                                                                return (
                                                                    <Tooltip
                                                                        title={<div style={{ maxWidth: 300 }}>{definition}</div>}
                                                                        placement="right"
                                                                    >
                                                                        {termLink}
                                                                    </Tooltip>
                                                                );
                                                            }
                                                            return termLink;
                                                        },
                                                    },
                                                    {
                                                        title: "HPO ID",
                                                        dataIndex: "hpo_id",
                                                        key: "hpo_id",
                                                        width: 100,
                                                        render: (text) => (
                                                            <span className="font-mono text-xs">{text}</span>
                                                        ),
                                                    },
                                                    {
                                                        title: "Severity",
                                                        key: "severity",
                                                        width: 140,
                                                        render: (_, row) => {
                                                            const hpoData = hpoSeverityData.find(h => h.hpo_id === row.hpo_id);
                                                            if (!hpoData?.severity_class) {
                                                                return <span className="text-gray-400">-</span>;
                                                            }
                                                            const score = hpoData.severity_score?.toFixed(1);
                                                            return (
                                                                <Tooltip title={`Severity score: ${score}/100`}>
                                                                    <Tag color={severityClassColors[hpoData.severity_class]}>
                                                                        {hpoData.severity_class.charAt(0).toUpperCase() + hpoData.severity_class.slice(1)}
                                                                        {score && <span className="ml-1 opacity-75">({score})</span>}
                                                                    </Tag>
                                                                </Tooltip>
                                                            );
                                                        },
                                                    },
                                                    {
                                                        title: "Confidence",
                                                        dataIndex: "confidence",
                                                        key: "confidence",
                                                        width: 100,
                                                        render: (text) => (
                                                            <Tag color={confidenceColors[text]}>
                                                                {confidenceIcons[text]} {text}
                                                            </Tag>
                                                        ),
                                                    },
                                                    {
                                                        title: "Source",
                                                        key: "source",
                                                        width: 120,
                                                        render: (_, row) => (
                                                            <Tag>
                                                                {row.evidence.endpoint_type === "primary"
                                                                    ? "Primary Endpoint"
                                                                    : row.evidence.endpoint_type === "secondary"
                                                                    ? "Secondary Endpoint"
                                                                    : "Exploratory"}
                                                            </Tag>
                                                        ),
                                                    },
                                                    {
                                                        title: "Details",
                                                        key: "details",
                                                        width: 80,
                                                        render: (_, row) => (
                                                            <Popover
                                                                content={renderEvidencePopover(row)}
                                                                title={row.hpo_label}
                                                                trigger="click"
                                                            >
                                                                <a className="text-blue-600 cursor-pointer">View</a>
                                                            </Popover>
                                                        ),
                                                    },
                                                ]}
                                            />
                                            {/* Trial links */}
                                            {record.pivotal_trials && record.pivotal_trials.length > 0 && (
                                                <div className="mt-2 text-xs text-gray-600">
                                                    <strong>Pivotal Trial: </strong>
                                                    {record.pivotal_trials.map((trial, i) => (
                                                        <span key={trial.nct_id}>
                                                            {i > 0 && " | "}
                                                            <a
                                                                href={`https://clinicaltrials.gov/study/${trial.nct_id}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline"
                                                            >
                                                                {trial.nct_id} ({trial.trial_name})
                                                            </a>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                )}

                {/* Target Cell Evidence Section */}
                {(() => {
                    const evidence = targetCellEvidenceData.therapies[record.id];
                    if (!evidence) return null;

                    const serotype = evidence.aav_tropism?.serotype;
                    const tropismData = serotype && !serotype.includes("Lentivirus")
                        ? aavTropismReference.serotypes[serotype]
                        : null;

                    return (
                        <div className="mt-4">
                            <Collapse
                                size="small"
                                items={[
                                    {
                                        key: "target-evidence",
                                        label: (
                                            <span>
                                                <strong>Target Cell Evidence & AAV Tropism</strong>
                                                <Tag className="ml-2" color={evidence.primary_target.confidence === "high" ? "green" : "gold"}>
                                                    {evidence.primary_target.confidence} confidence
                                                </Tag>
                                            </span>
                                        ),
                                        children: (
                                            <div className="space-y-4">
                                                {/* Primary Target Evidence */}
                                                <div className="p-3 bg-green-50 rounded border border-green-200">
                                                    <h5 className="font-semibold text-green-800 mb-2">Primary Target</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm"><strong>Cell Type:</strong> {evidence.primary_target.cell_type_standardized}</p>
                                                            <p className="text-sm"><strong>Cell Ontology:</strong> <a href={`https://www.ebi.ac.uk/ols4/ontologies/cl/classes/${evidence.primary_target.cell_ontology_id}`} target="_blank" className="text-blue-600 underline">{evidence.primary_target.cell_ontology_id}</a></p>
                                                            <p className="text-sm"><strong>MSTExplorer Equivalent:</strong> {evidence.primary_target.mstexplorer_equivalent?.replace(/_/g, " ") || "No match"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-700">{evidence.primary_target.rationale}</p>
                                                        </div>
                                                    </div>
                                                    {/* Sources */}
                                                    <div className="mt-2 pt-2 border-t border-green-200">
                                                        <p className="text-xs font-semibold text-green-700">Evidence Sources:</p>
                                                        <ul className="list-disc ml-4 mt-1">
                                                            {evidence.primary_target.sources.map((source, i) => (
                                                                <li key={i} className="text-xs">
                                                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                                        {source.type === "fda_label" ? "FDA Label" :
                                                                         source.type === "ema_epar" ? "EMA EPAR" :
                                                                         source.citation || source.type}
                                                                    </a>
                                                                    {source.section && <span className="text-gray-500"> ({source.section})</span>}
                                                                    {source.quote && (
                                                                        <Tooltip title={<div style={{ maxWidth: 400 }}>"{source.quote}"</div>}>
                                                                            <span className="ml-1 text-blue-500 cursor-help">[quote]</span>
                                                                        </Tooltip>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* AAV Tropism Analysis */}
                                                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                                    <h5 className="font-semibold text-blue-800 mb-2">AAV Tropism Analysis</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm"><strong>Serotype:</strong> {evidence.aav_tropism.serotype}</p>
                                                            <p className="text-sm"><strong>Delivery:</strong> {evidence.aav_tropism.delivery_route}</p>
                                                            <p className="text-sm"><strong>Primary Tropism:</strong></p>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {(evidence.aav_tropism.primary_tropism || []).map((ct, i) => (
                                                                    <Tag key={i} size="small" color="blue">{ct}</Tag>
                                                                ))}
                                                            </div>
                                                            {evidence.aav_tropism?.cns_tropism?.length > 0 && (
                                                                <>
                                                                    <p className="text-sm mt-2"><strong>CNS Tropism:</strong></p>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {evidence.aav_tropism.cns_tropism.map((ct, i) => (
                                                                            <Tag key={i} size="small" color="purple">{ct}</Tag>
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-700">{evidence.aav_tropism.tropism_notes}</p>
                                                            {evidence.aav_tropism?.tropism_source && (
                                                                <p className="text-xs text-gray-500 mt-2">
                                                                    <strong>Source:</strong>{" "}
                                                                    <a href={evidence.aav_tropism.tropism_source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                                        {evidence.aav_tropism.tropism_source.citation}
                                                                    </a>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Effective Tropism - Route Filtered */}
                                                    {(() => {
                                                        const effectiveTropism = getEffectiveTropism(
                                                            evidence.aav_tropism.serotype,
                                                            evidence.aav_tropism.delivery_route
                                                        );
                                                        if (!effectiveTropism) return null;

                                                        const normalizedRoute = normalizeRoute(evidence.aav_tropism.delivery_route);
                                                        const routeData = deliveryRouteFilters.routes[normalizedRoute];

                                                        return (
                                                            <div className="mt-3 pt-3 border-t border-blue-200">
                                                                <p className="text-sm font-semibold text-blue-700 mb-2">
                                                                    Effective Tropism (Route-Filtered)
                                                                    <Tooltip title="AAV tropism defines POTENTIAL targets; delivery route FILTERS to ACTUAL targets that can be physically reached.">
                                                                        <span className="ml-1 text-blue-400 cursor-help">(?)</span>
                                                                    </Tooltip>
                                                                </p>

                                                                {routeData?.barriers?.length > 0 && (
                                                                    <p className="text-xs text-gray-500 mb-2">
                                                                        <strong>Barriers:</strong> {routeData.barriers.join(", ")}
                                                                    </p>
                                                                )}

                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {effectiveTropism.accessible.length > 0 && (
                                                                        <div>
                                                                            <p className="text-xs font-semibold text-green-700">Accessible</p>
                                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                                {effectiveTropism.accessible.slice(0, 6).map((ct, i) => (
                                                                                    <Tooltip key={i} title={ct.notes}>
                                                                                        <Tag size="small" color="green">{ct.cell_type.replace(/_/g, " ")}</Tag>
                                                                                    </Tooltip>
                                                                                ))}
                                                                                {effectiveTropism.accessible.length > 6 && (
                                                                                    <Tag size="small">+{effectiveTropism.accessible.length - 6}</Tag>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {effectiveTropism.limited.length > 0 && (
                                                                        <div>
                                                                            <p className="text-xs font-semibold text-yellow-700">Limited Access</p>
                                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                                {effectiveTropism.limited.slice(0, 6).map((ct, i) => (
                                                                                    <Tooltip key={i} title={ct.notes}>
                                                                                        <Tag size="small" color="gold">{ct.cell_type.replace(/_/g, " ")}</Tag>
                                                                                    </Tooltip>
                                                                                ))}
                                                                                {effectiveTropism.limited.length > 6 && (
                                                                                    <Tag size="small">+{effectiveTropism.limited.length - 6}</Tag>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {effectiveTropism.inaccessible.length > 0 && (
                                                                        <div>
                                                                            <p className="text-xs font-semibold text-red-700">Route Blocked</p>
                                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                                {effectiveTropism.inaccessible.slice(0, 4).map((ct, i) => (
                                                                                    <Tooltip key={i} title={ct.reason}>
                                                                                        <Tag size="small" color="red">{ct.cell_type.replace(/_/g, " ")}</Tag>
                                                                                    </Tooltip>
                                                                                ))}
                                                                                {effectiveTropism.inaccessible.length > 4 && (
                                                                                    <Tag size="small">+{effectiveTropism.inaccessible.length - 4}</Tag>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>

                                                {/* Pipeline Comparison */}
                                                {(() => {
                                                    // Check route accessibility for predicted cell type
                                                    const predictedCell = evidence.pipeline_comparison?.phenotype_predicts;
                                                    const routeAccessibility = predictedCell
                                                        ? isPredictedCellRouteReachable(
                                                            predictedCell,
                                                            evidence.aav_tropism.serotype,
                                                            evidence.aav_tropism.delivery_route
                                                        )
                                                        : null;

                                                    // Determine effective match status considering route
                                                    let effectiveMatchStatus = evidence.pipeline_comparison.match_status;
                                                    if (effectiveMatchStatus === "aav_reachable" && routeAccessibility === "inaccessible") {
                                                        effectiveMatchStatus = "route_unreachable";
                                                    }

                                                    const statusColors = {
                                                        exact: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", tag: "green" },
                                                        aav_reachable: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800", tag: "cyan" },
                                                        route_unreachable: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", tag: "red" },
                                                        related: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", tag: "gold" },
                                                        different: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", tag: "orange" }
                                                    };
                                                    const colors = statusColors[effectiveMatchStatus] || statusColors.different;

                                                    return (
                                                        <div className={`p-3 rounded border ${colors.bg} ${colors.border}`}>
                                                            <h5 className={`font-semibold mb-2 ${colors.text}`}>
                                                                Pipeline Comparison
                                                                <Tag className="ml-2" color={colors.tag}>
                                                                    {effectiveMatchStatus.replace(/_/g, " ")}
                                                                </Tag>
                                                            </h5>
                                                            <div className="grid grid-cols-4 gap-4 mb-2">
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Therapy Target</p>
                                                                    <p className="text-sm font-semibold">{evidence.primary_target.cell_type_standardized}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Pipeline Predicts</p>
                                                                    <p className="text-sm font-semibold">{evidence.pipeline_comparison?.phenotype_predicts?.replace(/_/g, " ") || "N/A"}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">Route Access</p>
                                                                    <p className="text-sm">
                                                                        {routeAccessibility === "accessible" && (
                                                                            <Tag size="small" color="green">Accessible</Tag>
                                                                        )}
                                                                        {routeAccessibility === "limited" && (
                                                                            <Tag size="small" color="gold">Limited</Tag>
                                                                        )}
                                                                        {routeAccessibility === "inaccessible" && (
                                                                            <Tooltip title="The delivery route cannot physically reach this cell type">
                                                                                <Tag size="small" color="red">Blocked</Tag>
                                                                            </Tooltip>
                                                                        )}
                                                                        {routeAccessibility === "unknown" && (
                                                                            <Tag size="small" color="default">Unknown</Tag>
                                                                        )}
                                                                        {!routeAccessibility && <span className="text-gray-400">-</span>}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500">HPO Phenotypes</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {evidence.pipeline_comparison.hpo_phenotypes?.slice(0, 3).map((hpo, i) => (
                                                                            <a key={i} href={`/phenotype?jump=${hpo}`} target="_blank" className="text-xs text-blue-600 underline">{hpo}</a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-700">{evidence.pipeline_comparison.explanation}</p>

                                                            {/* Route-specific note */}
                                                            {effectiveMatchStatus === "route_unreachable" && (
                                                                <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                                                                    <strong>Note:</strong> While the AAV serotype has tropism for the predicted cell type,
                                                                    the delivery route ({evidence.aav_tropism.delivery_route}) cannot physically access it.
                                                                </div>
                                                            )}
                                                            {effectiveMatchStatus === "aav_reachable" && routeAccessibility === "limited" && (
                                                                <div className="mt-2 p-2 bg-cyan-100 rounded text-xs text-cyan-700">
                                                                    <strong>Note:</strong> The predicted cell type has limited accessibility via this delivery route.
                                                                    Transduction efficiency may be reduced compared to the primary target.
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    );
                })()}

                {/* Cell Type Prediction Validation */}
                {record.predictions_by_hpo && Object.keys(record.predictions_by_hpo).length > 0 && (
                    <div className="mt-4">
                        <Collapse
                            size="small"
                            items={[
                                {
                                    key: "predictions",
                                    label: (
                                        <span>
                                            <strong>Cell Type Prediction Validation</strong>
                                            <Tag className="ml-2" color={
                                                record.cell_type_match === "exact" ? "green" :
                                                record.cell_type_match === "aav_reachable" ? "cyan" :
                                                record.cell_type_match === "partial" ? "gold" :
                                                record.cell_type_match === "related" ? "blue" :
                                                record.cell_type_match === "mismatch" ? "red" : "default"
                                            }>
                                                {record.cell_type_match}
                                            </Tag>
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            <div className="mb-3 p-2 bg-gray-100 rounded">
                                                <p className="text-sm">
                                                    <strong>Actual target:</strong> {record.target_cell_type || "Unknown"}
                                                </p>
                                                <p className="text-sm">
                                                    <strong>Top prediction:</strong> {record.predicted_cell_types?.[0]?.replace(/_/g, " ") || "None"}
                                                </p>
                                            </div>
                                            <Table
                                                size="small"
                                                pagination={false}
                                                dataSource={Object.entries(record.predictions_by_hpo).map(([hpoId, pred]) => ({
                                                    hpo_id: hpoId,
                                                    ...pred
                                                }))}
                                                rowKey="hpo_id"
                                                columns={[
                                                    {
                                                        title: "HPO ID",
                                                        dataIndex: "hpo_id",
                                                        key: "hpo_id",
                                                        width: 120,
                                                        render: (text) => (
                                                            <a
                                                                href={`/phenotype?jump=${text}`}
                                                                target="_blank"
                                                                className="font-mono text-xs text-blue-600 underline"
                                                            >
                                                                {text}
                                                            </a>
                                                        ),
                                                    },
                                                    {
                                                        title: "Predicted Cell Type",
                                                        dataIndex: "top_cell_type",
                                                        key: "top_cell_type",
                                                        render: (text) => (
                                                            <span className="text-sm">{text?.replace(/_/g, " ")}</span>
                                                        ),
                                                    },
                                                    {
                                                        title: "q-value",
                                                        dataIndex: "top_q_value",
                                                        key: "top_q_value",
                                                        width: 100,
                                                        render: (value) => (
                                                            <span className={`text-xs ${value < 0.001 ? "font-semibold text-green-600" : ""}`}>
                                                                {value?.toExponential(1) || "-"}
                                                            </span>
                                                        ),
                                                    },
                                                    {
                                                        title: "Other Predictions",
                                                        dataIndex: "all_cell_types",
                                                        key: "all_cell_types",
                                                        render: (cellTypes) => {
                                                            if (!cellTypes || cellTypes.length <= 1) return "-";
                                                            return (
                                                                <Tooltip title={cellTypes.slice(1).map(ct => ct.replace(/_/g, " ")).join(", ")}>
                                                                    <span className="text-xs text-gray-500">
                                                                        +{cellTypes.length - 1} more
                                                                    </span>
                                                                </Tooltip>
                                                            );
                                                        },
                                                    },
                                                ]}
                                            />
                                            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-gray-600">
                                                <strong>How to interpret:</strong> MSTExplorer predicts which cell types are enriched for
                                                genes associated with each HPO phenotype. A <strong>mismatch</strong> doesn't mean the
                                                pipeline is wrong—it may indicate the phenotype manifests in a different tissue than where
                                                the genetic defect causes the problem. For example, Zolgensma targets motor neurons (the cause),
                                                but muscle weakness (the phenotype) maps to skeletal muscle cells.
                                            </div>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                )}

                {record.note && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded">
                        <strong>Note:</strong> {record.note}
                    </div>
                )}
            </div>
        );
    };

    const categoryOptions = [
        { value: "All", label: "All Categories" },
        ...getUniqueCategories().map((c) => ({ value: c, label: c })),
    ];

    const modalityOptions = [
        { value: "All", label: "All Modalities" },
        { value: "AAV", label: "AAV (Adeno-Associated Virus)" },
        { value: "Lentivirus", label: "Lentivirus" },
        { value: "Retrovirus", label: "Retrovirus" },
        { value: "CRISPR", label: "CRISPR/Gene Editing" },
        { value: "HSV", label: "Oncolytic Virus (HSV)" },
        { value: "Adenovirus", label: "Adenovirus" },
    ];

    const therapyTypeOptions = [
        { value: "All", label: "All Therapy Types" },
        ...getUniqueTherapyTypes().map((t) => ({ value: t, label: t })),
    ];

    return (
        <>
            <CustomHeader activePageKey="approved-therapies" />
            <Layout
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#0F172AFF",
                }}
            >
                <Layout>
                    <Content
                        style={{
                            margin: "0 16px",
                            minWidth: "50rem",
                            padding: "0 30px",
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: "16px 0",
                            }}
                        >
                            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Approved Gene Therapies</Breadcrumb.Item>
                        </Breadcrumb>

                        <Card style={{ width: "100%", marginBottom: 16 }}>
                            <h2 className="text-xl font-semibold mb-2">
                                FDA/EMA Approved Gene Therapies
                            </h2>
                            <p className="mb-4">
                                A curated reference list of gene therapies approved by the FDA and/or EMA.
                                This serves as a competitive landscape reference and validation for the
                                gene therapy prioritization pipeline.
                            </p>

                            <Row gutter={16} className="mb-4">
                                <Col span={3}>
                                    <Statistic
                                        title="Total Approved"
                                        value={stats.total}
                                        valueStyle={{ color: "#3f8600" }}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Statistic
                                        title="CNS/Neuro"
                                        value={stats.cns}
                                        valueStyle={{ color: "#722ed1" }}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Statistic
                                        title="In Vivo"
                                        value={stats.inVivo}
                                        valueStyle={{ color: "#13c2c2" }}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Statistic
                                        title="AAV-based"
                                        value={stats.aav}
                                        valueStyle={{ color: "#1890ff" }}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Statistic
                                        title="Companies"
                                        value={stats.companies}
                                    />
                                </Col>
                                <Col span={3}>
                                    <Tooltip title={`Exact: ${stats.exact}, Partial: ${stats.partial}, Related: ${stats.related}, Mismatch: ${stats.mismatch}, Unknown: ${stats.unknown}`}>
                                        <Statistic
                                            title="Prediction Accuracy"
                                            value={stats.accuracy}
                                            suffix="%"
                                            valueStyle={{ color: parseFloat(stats.accuracy) >= 70 ? "#3f8600" : "#cf1322" }}
                                        />
                                    </Tooltip>
                                </Col>
                            </Row>

                            <div className="flex gap-4 flex-wrap">
                                <Search
                                    placeholder="Search by name, gene, disease, or company..."
                                    allowClear
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 300 }}
                                />
                                <Select
                                    value={therapyTypeFilter}
                                    onChange={setTherapyTypeFilter}
                                    options={therapyTypeOptions}
                                    style={{ width: 200 }}
                                />
                                <Select
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    options={categoryOptions}
                                    style={{ width: 180 }}
                                />
                                <Select
                                    value={modalityFilter}
                                    onChange={setModalityFilter}
                                    options={modalityOptions}
                                    style={{ width: 220 }}
                                />
                            </div>
                        </Card>

                        <div
                            style={{
                                padding: 24,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <Table
                                columns={columns}
                                dataSource={filteredData}
                                rowKey="id"
                                expandable={{
                                    expandedRowRender,
                                    rowExpandable: () => true,
                                }}
                                pagination={{
                                    defaultPageSize: 30,
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "30", "50", "100"],
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} therapies`,
                                }}
                                size="small"
                                scroll={{ x: 1500 }}
                            />
                        </div>

                        {/* Severity Distribution Chart */}
                        <SeverityDistributionChart approvedTherapies={approvedGeneTherapies} />

                        <Card style={{ width: "100%", marginTop: 16, marginBottom: 16 }}>
                            <h3 className="font-semibold mb-2">Data Sources</h3>
                            <ul className="list-disc ml-6 text-sm">
                                <li>
                                    <a
                                        href="https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/approved-cellular-and-gene-therapy-products"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        FDA Approved Cellular and Gene Therapy Products
                                        <sup><Launch fontSize="inherit" /></sup>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.ema.europa.eu/en/human-regulatory-overview/advanced-therapy-medicinal-products-overview"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        EMA Advanced Therapy Medicinal Products
                                        <sup><Launch fontSize="inherit" /></sup>
                                    </a>
                                </li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">
                                Last updated: January 2026. This list may not be exhaustive.
                            </p>
                        </Card>
                    </Content>
                    <CustomFooter />
                </Layout>
            </Layout>
        </>
    );
}
