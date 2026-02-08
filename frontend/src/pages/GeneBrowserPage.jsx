import { useEffect, useRef, useState } from "react";
import CustomHeader from "../components/utilities/Header.jsx";
import CustomFooter from "../components/utilities/Footer.jsx";
import axios from "axios";
import {
    Breadcrumb,
    Layout,
    theme,
    Table,
    Spin,
    Button,
    Card,
    Slider,
    Select,
    Switch,
    Tooltip,
    Tag,
    Radio,
    Checkbox,
} from "antd";
import { SearchOutlined, ExpandMore } from "@mui/icons-material";
import { BASE_API_URL } from "../../config.js";
import ExpressionSpecificityInfo from "../components/info/ExpressionSpecificityInfo.jsx";
import DownloadButton from "../components/utilities/Download.jsx";
import formatText from "../scripts/formatText.js";
import PageIntro from "../components/PageIntro.jsx";
import { urlSetter } from "../scripts/urlHandlers.js";
import ShareButton from "../components/utilities/ShareButton.jsx";

const { Content, Sider } = Layout;

export default function GeneBrowserPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState({
        diseases: [],
        dbd_types: [],
        cell_types: [],
    });
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [hpoData, setHpoData] = useState({});
    const [hpoLoading, setHpoLoading] = useState({});
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 50,
            total: 0,
        },
    });

    // Tour refs
    const tourRefDisease = useRef(null);
    const tourRefVariant = useRef(null);
    const tourRefTF = useRef(null);
    const tourRefCell = useRef(null);
    const tourRefSubmit = useRef(null);

    const tourSteps = [
        { key: "gene-browser-disease", target: () => tourRefDisease.current },
        { key: "gene-browser-variant", target: () => tourRefVariant.current },
        { key: "gene-browser-tf", target: () => tourRefTF.current },
        { key: "gene-browser-cell", target: () => tourRefCell.current },
        { key: "gene-browser-submit", target: () => tourRefSubmit.current },
    ];

    // Filter state
    const [filterValues, setFilterValues] = useState({
        disease: null,
        min_disease_score: 0.3,
        has_common_variants: true,
        has_rare_variants: true,
        is_tf: null,
        dbd_type: null,
        db_type: "DescartesHuman",
        cell_types: [],
        specificity_percentile: 10,  // Default: Top 10%
        min_specificity: 0.02,       // Will be computed from percentile
    });

    // Percentile thresholds (fetched from backend)
    const [percentileThresholds, setPercentileThresholds] = useState({
        1: 0.14, 5: 0.05, 10: 0.02, 25: 0.01, 50: 0.001
    });

    // Fetch filter options on mount
    useEffect(() => {
        fetchFilterOptions();
    }, [filterValues.db_type]);

    // Fetch percentile thresholds when db_type or cell_types change
    useEffect(() => {
        const fetchPercentiles = async () => {
            try {
                // Use first cell type if selected, otherwise global
                const cellType = filterValues.cell_types.length > 0
                    ? filterValues.cell_types[0]
                    : "";
                const url = `${BASE_API_URL}/api/genes/browse/percentiles?db_type=${filterValues.db_type}${cellType ? `&cell_type=${cellType}` : ""}`;
                const response = await axios.get(url);
                const thresholds = response.data;
                setPercentileThresholds(thresholds);
                // Update min_specificity based on current percentile selection
                // API returns string keys, convert to string for lookup
                const currentPercentile = String(filterValues.specificity_percentile);
                const newThreshold = thresholds[currentPercentile] || 0.02;
                setFilterValues((prev) => ({
                    ...prev,
                    min_specificity: newThreshold,
                }));
            } catch (error) {
                console.error("Error fetching percentile thresholds:", error);
            }
        };
        fetchPercentiles();
    }, [filterValues.db_type, filterValues.cell_types]);

    // Fetch when pagination changes (but not on initial mount)
    useEffect(() => {
        if (data.length > 0) {
            handleSubmit();
        }
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

    const fetchFilterOptions = async () => {
        setOptionsLoading(true);
        try {
            const response = await axios.get(
                `${BASE_API_URL}/api/genes/browse/options?db_type=${filterValues.db_type}`
            );
            const options = response.data || { diseases: [], dbd_types: [], cell_types: [] };
            setFilterOptions(options);

            // Set default cell type if available and none selected
            if (options.cell_types && options.cell_types.length > 0) {
                const defaultCell = options.cell_types.find((ct) =>
                    ct.toLowerCase().includes("microglia")
                ) || options.cell_types[0];
                if (defaultCell) {
                    setFilterValues((prev) => ({
                        ...prev,
                        cell_types: prev.cell_types.length === 0 ? [defaultCell] : prev.cell_types,
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching filter options:", error);
        } finally {
            setOptionsLoading(false);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
    };

    const handleFilterChange = (name, value) => {
        setFilterValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const params = new URLSearchParams({
            db_type: filterValues.db_type,
            min_specificity: filterValues.min_specificity,
            pageSize: tableParams.pagination.pageSize,
            current: tableParams.pagination.current,
        });

        if (filterValues.disease) {
            params.append("disease", filterValues.disease);
        }
        if (filterValues.min_disease_score > 0) {
            params.append("min_disease_score", filterValues.min_disease_score);
        }
        if (filterValues.has_common_variants) {
            params.append("has_common_variants", "true");
        }
        if (filterValues.has_rare_variants) {
            params.append("has_rare_variants", "true");
        }
        if (filterValues.is_tf !== null) {
            params.append("is_tf", filterValues.is_tf.toString());
        }
        if (filterValues.dbd_type) {
            params.append("dbd_type", filterValues.dbd_type);
        }
        if (filterValues.cell_types.length > 0) {
            params.append("cell_types", filterValues.cell_types.join(","));
        }

        const url = `${BASE_API_URL}/api/genes/browse?${params.toString()}`;

        try {
            const response = await axios.get(url);
            const results = (response.data.genes || []).map((item, index) => ({
                ...item,
                key: item.gene_symbol || index,
            }));

            setData(results);
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: response.data.total || 0,
                },
            }));

            // Update URL
            urlSetter({
                disease: filterValues.disease || "",
                min_score: filterValues.min_disease_score.toString(),
                is_tf: filterValues.is_tf !== null ? filterValues.is_tf.toString() : "",
                db_type: filterValues.db_type,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHpoData = async (geneSymbol) => {
        if (hpoData[geneSymbol] || hpoLoading[geneSymbol]) return;

        setHpoLoading((prev) => ({ ...prev, [geneSymbol]: true }));

        try {
            const response = await axios.get(
                `${BASE_API_URL}/api/gene/${geneSymbol}/hpo?db_type=${filterValues.db_type}`
            );
            setHpoData((prev) => ({ ...prev, [geneSymbol]: response.data }));
        } catch (error) {
            console.error(`Error fetching HPO data for ${geneSymbol}:`, error);
            setHpoData((prev) => ({ ...prev, [geneSymbol]: { phenotypes: [] } }));
        } finally {
            setHpoLoading((prev) => ({ ...prev, [geneSymbol]: false }));
        }
    };

    const handleExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([...expandedRowKeys, record.gene_symbol]);
            fetchHpoData(record.gene_symbol);
        } else {
            setExpandedRowKeys(expandedRowKeys.filter((k) => k !== record.gene_symbol));
        }
    };

    // Disease score color
    const getScoreColor = (score) => {
        if (!score) return "default";
        if (score >= 0.7) return "red";
        if (score >= 0.5) return "orange";
        if (score >= 0.3) return "gold";
        return "default";
    };

    const columns = [
        {
            title: "Gene",
            dataIndex: "gene_symbol",
            key: "gene_symbol",
            width: 100,
            sorter: true,
            render: (text) => (
                <a
                    style={{ textDecoration: "underline", fontWeight: "bold" }}
                    target="_blank"
                    href={`/gene?jump=${text}`}
                >
                    {text}
                </a>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: 200,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text || "—"}</span>
                </Tooltip>
            ),
        },
        {
            title: "TF",
            dataIndex: "is_tf",
            key: "is_tf",
            width: 60,
            sorter: true,
            render: (isTf, record) => (
                isTf ? (
                    <Tooltip title={record.tf_metadata?.dbd || "Transcription Factor"}>
                        <Tag color="purple">TF</Tag>
                    </Tooltip>
                ) : null
            ),
        },
        {
            title: "AD Score",
            key: "ad_score",
            width: 90,
            sorter: true,
            render: (_, record) => {
                const score = record.disease_associations?.alzheimers?.overall_score;
                return score ? (
                    <Tag color={getScoreColor(score)}>{score.toFixed(2)}</Tag>
                ) : (
                    <span className="text-gray-400">—</span>
                );
            },
        },
        {
            title: "PD Score",
            key: "pd_score",
            width: 90,
            sorter: true,
            render: (_, record) => {
                const score = record.disease_associations?.parkinsons?.overall_score;
                return score ? (
                    <Tag color={getScoreColor(score)}>{score.toFixed(2)}</Tag>
                ) : (
                    <span className="text-gray-400">—</span>
                );
            },
        },
        {
            title: "Evidence",
            key: "evidence",
            width: 90,
            render: (_, record) => {
                const ad = record.disease_associations?.alzheimers;
                const pd = record.disease_associations?.parkinsons;
                const hasCommon = ad?.has_common || pd?.has_common;
                const hasRare = ad?.has_rare || pd?.has_rare;
                return (
                    <div className="flex gap-1">
                        {hasCommon && <Tooltip title="Common variants"><Tag color="blue">C</Tag></Tooltip>}
                        {hasRare && <Tooltip title="Rare variants"><Tag color="green">R</Tag></Tooltip>}
                        {!hasCommon && !hasRare && <span className="text-gray-400">—</span>}
                    </div>
                );
            },
        },
        {
            title: "Top Cell Types",
            key: "top_cell_types",
            width: 200,
            render: (_, record) => {
                const cells = record.top_cell_types || [];
                if (cells.length === 0) return <span className="text-gray-400">—</span>;
                return (
                    <div className="flex flex-wrap gap-1">
                        {cells.slice(0, 3).map((ct, i) => (
                            <Tooltip key={i} title={`Specificity: ${ct.specificity?.toFixed(3)}`}>
                                <Tag>{formatText(ct.name)}</Tag>
                            </Tooltip>
                        ))}
                    </div>
                );
            },
        },
    ];

    const expandedRowRender = (record) => {
        const hpo = hpoData[record.gene_symbol];
        const isLoading = hpoLoading[record.gene_symbol];
        const ad = record.disease_associations?.alzheimers;
        const pd = record.disease_associations?.parkinsons;

        return (
            <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-6">
                    {/* TF Metadata */}
                    <div>
                        <h4 className="font-semibold mb-2">Transcription Factor</h4>
                        {record.is_tf && record.tf_metadata ? (
                            <>
                                <p><strong>DBD:</strong> {record.tf_metadata.dbd || "Unknown"}</p>
                                <p><strong>Assessment:</strong> {record.tf_metadata.assessment || "Unknown"}</p>
                                <p><strong>Binding Mode:</strong> {record.tf_metadata.binding_mode || "Unknown"}</p>
                            </>
                        ) : (
                            <p className="text-gray-500">Not a transcription factor</p>
                        )}
                    </div>

                    {/* Disease Evidence */}
                    <div>
                        <h4 className="font-semibold mb-2">Disease Evidence</h4>
                        <div className="space-y-2">
                            <div>
                                <strong>Alzheimer's:</strong>{" "}
                                {ad ? (
                                    <span>
                                        Score: {ad.overall_score?.toFixed(2) || "—"}
                                        {ad.has_common && <Tag color="blue" className="ml-1">Common</Tag>}
                                        {ad.has_rare && <Tag color="green" className="ml-1">Rare</Tag>}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">No association</span>
                                )}
                            </div>
                            <div>
                                <strong>Parkinson's:</strong>{" "}
                                {pd ? (
                                    <span>
                                        Score: {pd.overall_score?.toFixed(2) || "—"}
                                        {pd.has_common && <Tag color="blue" className="ml-1">Common</Tag>}
                                        {pd.has_rare && <Tag color="green" className="ml-1">Rare</Tag>}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">No association</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* HPO Phenotypes */}
                    <div>
                        <h4 className="font-semibold mb-2">
                            Associated HPO Phenotypes
                            <Tooltip title="Phenotypes linked via cell type specificity">
                                <span className="text-gray-400 text-xs ml-1">(via cell types)</span>
                            </Tooltip>
                        </h4>
                        {isLoading ? (
                            <Spin size="small" />
                        ) : hpo?.phenotypes?.length > 0 ? (
                            <div className="max-h-32 overflow-y-auto">
                                {hpo.phenotypes.slice(0, 10).map((p, i) => (
                                    <div key={i} className="text-sm mb-1">
                                        <a
                                            href={`/phenotype?jump=${p.hpo_id}`}
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            {p.hpo_id}
                                        </a>
                                        <span className="ml-1">{p.name}</span>
                                        <span className="text-gray-400 text-xs ml-1">
                                            ({p.via_cell_types?.length || 0} cell types)
                                        </span>
                                    </div>
                                ))}
                                {hpo.phenotypes.length > 10 && (
                                    <p className="text-gray-500 text-xs">
                                        ...and {hpo.phenotypes.length - 10} more
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">No phenotypes found</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <CustomHeader activePageKey="gene-browser" />
            <Layout
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#0F172AFF",
                }}
            >
                <Sider
                    style={{
                        background: "#FFF",
                        marginTop: 20,
                        marginBottom: 20,
                        marginLeft: 30,
                        marginRight: 30,
                        textAlign: "center",
                        borderRadius: borderRadiusLG,
                        padding: 10,
                        paddingTop: 30,
                    }}
                    width={350}
                >
                    <div className="demo-logo-vertical" />
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <center>
                            <div>
                                <p className="text-xl font-semibold text-left mb-4 ml-5">
                                    Gene Browser Filters
                                </p>

                                {/* Disease Filter */}
                                <div className="mx-5 mb-4 text-left" ref={tourRefDisease}>
                                    <label className="font-medium">Disease Association</label>
                                    <Radio.Group
                                        value={filterValues.disease}
                                        onChange={(e) => handleFilterChange("disease", e.target.value)}
                                        className="w-full mt-2"
                                    >
                                        <Radio.Button value={null} className="w-1/3 text-center">All</Radio.Button>
                                        <Radio.Button value="alzheimers" className="w-1/3 text-center">AD</Radio.Button>
                                        <Radio.Button value="parkinsons" className="w-1/3 text-center">PD</Radio.Button>
                                    </Radio.Group>
                                </div>

                                {/* Disease Score Threshold */}
                                <div className="mx-5 mb-4 text-left">
                                    <label className="font-medium">Min. Disease Score</label>
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={filterValues.min_disease_score}
                                        onChange={(value) => handleFilterChange("min_disease_score", value)}
                                        marks={{ 0: "0", 0.3: "0.3", 0.5: "0.5", 1: "1" }}
                                    />
                                </div>

                                {/* Variant Type Filter */}
                                <div className="mx-5 mb-4 text-left" ref={tourRefVariant}>
                                    <label className="font-medium">Variant Evidence</label>
                                    <div className="mt-2 space-y-1">
                                        <Checkbox
                                            checked={filterValues.has_common_variants}
                                            onChange={(e) => handleFilterChange("has_common_variants", e.target.checked)}
                                        >
                                            Common variants (GWAS)
                                        </Checkbox>
                                        <br />
                                        <Checkbox
                                            checked={filterValues.has_rare_variants}
                                            onChange={(e) => handleFilterChange("has_rare_variants", e.target.checked)}
                                        >
                                            Rare variants
                                        </Checkbox>
                                    </div>
                                </div>

                                {/* TF Filter */}
                                <div className="mx-5 mb-4 text-left" ref={tourRefTF}>
                                    <label className="font-medium mr-3">Transcription Factors</label>
                                    <div className="mt-2">
                                        <Radio.Group
                                            value={filterValues.is_tf}
                                            onChange={(e) => handleFilterChange("is_tf", e.target.value)}
                                        >
                                            <Radio.Button value={null}>All</Radio.Button>
                                            <Radio.Button value={true}>TFs Only</Radio.Button>
                                            <Radio.Button value={false}>Non-TFs</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                </div>

                                {/* DBD Type Filter (only when TFs selected) */}
                                {filterValues.is_tf === true && (
                                    <div className="mx-5 mb-4 text-left">
                                        <label className="font-medium">DNA-Binding Domain</label>
                                        <Select
                                            allowClear
                                            placeholder="Select DBD type"
                                            value={filterValues.dbd_type}
                                            onChange={(value) => handleFilterChange("dbd_type", value)}
                                            style={{ width: "100%" }}
                                            options={filterOptions.dbd_types.map((d) => ({ value: d, label: d }))}
                                            loading={optionsLoading}
                                        />
                                    </div>
                                )}

                                {/* Cell Atlas Selection */}
                                <div className="mx-5 mb-4 text-left">
                                    <label className="font-medium">Cell Atlas</label>
                                    <Select
                                        value={filterValues.db_type}
                                        onChange={(value) => handleFilterChange("db_type", value)}
                                        style={{ width: "100%" }}
                                        options={[
                                            { value: "DescartesHuman", label: "Descartes Human (Fetal)" },
                                            { value: "HumanCellLandscape", label: "Human Cell Landscape (Adult)" },
                                        ]}
                                    />
                                </div>

                                {/* Cell Type Filter */}
                                <div className="mx-5 mb-4 text-left" ref={tourRefCell}>
                                    <label className="font-medium">
                                        Cell Type Filter <ExpressionSpecificityInfo />
                                    </label>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Filter by cell types"
                                        value={filterValues.cell_types}
                                        onChange={(values) => handleFilterChange("cell_types", values)}
                                        style={{ width: "100%" }}
                                        options={filterOptions.cell_types.map((ct) => ({
                                            value: ct,
                                            label: formatText(ct),
                                        }))}
                                        maxTagCount={2}
                                        loading={optionsLoading}
                                    />
                                </div>

                                {/* Specificity Percentile Slider */}
                                <div className="mx-5 mb-4 text-left">
                                    <label className="font-medium">
                                        Show Top % Most Specific
                                        <Tooltip title="Filter to genes in the top X% of expression specificity. Lower percentages = more specific genes only.">
                                            <span className="text-gray-400 text-xs ml-1 cursor-help">ⓘ</span>
                                        </Tooltip>
                                    </label>
                                    <Slider
                                        min={1}
                                        max={50}
                                        value={filterValues.specificity_percentile}
                                        onChange={(value) => {
                                            // API returns string keys, convert to string for lookup
                                            const newThreshold = percentileThresholds[String(value)] || 0.02;
                                            setFilterValues((prev) => ({
                                                ...prev,
                                                specificity_percentile: value,
                                                min_specificity: newThreshold,
                                            }));
                                        }}
                                        marks={{
                                            1: "1%",
                                            5: "5%",
                                            10: "10%",
                                            25: "25%",
                                            50: "50%"
                                        }}
                                        step={null}
                                        included={false}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Threshold: ≥ {filterValues.min_specificity?.toFixed(4) || "—"}
                                    </p>
                                </div>
                            </div>

                            <div style={{ margin: 29 }}>
                                <Button
                                    name="Search"
                                    size="large"
                                    icon={<SearchOutlined />}
                                    style={{
                                        marginTop: 10,
                                        marginBottom: 20,
                                        backgroundColor: "#c8bbec",
                                    }}
                                    type="submit"
                                    block
                                    onClick={handleSubmit}
                                    ref={tourRefSubmit}
                                >
                                    <p className="font-semibold">Browse Genes</p>
                                </Button>
                            </div>
                        </center>
                    </form>
                </Sider>
                <Layout>
                    <Content
                        style={{
                            margin: "0 16px",
                            minWidth: "50rem",
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: "16px 0",
                            }}
                        >
                            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Gene Browser</Breadcrumb.Item>
                        </Breadcrumb>

                        <Card style={{ width: "100%", marginBottom: 16 }}>
                            <h2 className="text-xl font-semibold mb-2">Gene Browser</h2>
                            <p>
                                Browse genes by disease association, transcription factor status,
                                and cell type expression specificity. This tool combines data from:
                            </p>
                            <ul className="list-disc ml-6 mt-2">
                                <li><strong>OpenTargets:</strong> Alzheimer's and Parkinson's disease associations with common/rare variant evidence</li>
                                <li><strong>Lambert et al. 2018:</strong> Human transcription factor census</li>
                                <li><strong>Cell atlases:</strong> Expression specificity across human cell types</li>
                            </ul>
                            <p className="mt-2 text-gray-600">
                                Click any row to expand and see detailed TF metadata, disease evidence breakdown,
                                and associated HPO phenotypes via cell type pathway.
                            </p>
                        </Card>

                        {data.length > 0 ? (
                            <div
                                style={{
                                    padding: 24,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                                className="relative"
                            >
                                <div className="absolute left-6 z-10">
                                    <ShareButton />
                                </div>
                                <div className="absolute right-6 z-10">
                                    <DownloadButton elementId="gene-browser-table" />
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Gene Results
                                        <span className="text-gray-500 font-normal ml-2">
                                            ({tableParams.pagination.total} total)
                                        </span>
                                    </h3>
                                </div>

                                <Spin spinning={loading}>
                                    <Table
                                        id="gene-browser-table"
                                        pagination={tableParams.pagination}
                                        columns={columns}
                                        expandable={{
                                            expandedRowRender,
                                            expandedRowKeys,
                                            onExpand: handleExpand,
                                            rowExpandable: () => true,
                                        }}
                                        dataSource={data}
                                        size="small"
                                        onChange={handleTableChange}
                                        scroll={{ x: 900 }}
                                        rowKey="gene_symbol"
                                    />
                                </Spin>
                            </div>
                        ) : (
                            <PageIntro
                                description="Browse genes by disease association, TF status, and cell type specificity. Use the filters on the left to narrow your search, then click 'Browse Genes' to see results."
                                tourSteps={tourSteps}
                            />
                        )}
                    </Content>
                    <CustomFooter />
                </Layout>
            </Layout>
        </>
    );
}
