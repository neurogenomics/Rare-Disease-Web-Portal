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
    InputNumber,
    Slider,
    Select,
    Switch,
    Tooltip,
} from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { BASE_API_URL } from "../../config.js";
import SeverityScoreInfo from "../components/info/SeverityScoreInfo.jsx";
import SeverityScoreHover from "../components/info/SeverityScoreHover.jsx";
import DownloadButton from "../components/utilities/Download.jsx";
import formatText from "../scripts/formatText.js";
import PageIntro from "../components/PageIntro.jsx";
import { urlParser, urlSetter } from "../scripts/urlHandlers.js";
import checkAllNull from "../scripts/checkAllNull.js";
import ShareButton from "../components/utilities/ShareButton.jsx";
import AAVTractabilityInfo from "../components/info/AAVTractabilityInfo.jsx";
import QValueInfo from "../components/info/QValueInfo.jsx";
import ExpressionSpecificityInfo from "../components/info/ExpressionSpecificityInfo.jsx";

const { Content, Sider } = Layout;

export default function GeneTherapyPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cellTypes, setCellTypes] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 20,
        },
    });

    // URL Parser
    const urlParams = urlParser("gene-therapy");

    // Tour refs
    const tourRefSeverity = useRef(null);
    const tourRefOnset = useRef(null);
    const tourRefCellType = useRef(null);
    const tourRefSubmit = useRef(null);

    const tourSteps = [
        {
            key: "gene-therapy-severity",
            target: () => tourRefSeverity.current,
        },
        {
            key: "gene-therapy-onset",
            target: () => tourRefOnset.current,
        },
        {
            key: "gene-therapy-celltype",
            target: () => tourRefCellType.current,
        },
        {
            key: "gene-therapy-submit",
            target: () => tourRefSubmit.current,
        },
    ];

    // Filter state
    const [filterValues, setFilterValues] = useState({
        severity_min: urlParams?.severity_min || 20,
        congenital_onset_max: urlParams?.congenital_onset_max || 1,
        q_threshold: urlParams?.q_threshold || 0.05,
        expression_specificity_min: urlParams?.expression_specificity_min || 0.1,
        db_type: urlParams?.db_type || "DescartesHuman",
        cell_types: urlParams?.cell_types || "All",
        cns_only: urlParams?.cns_only !== false,
        post_natal_only: urlParams?.post_natal_only !== false,
        terminally_differentiated_only: urlParams?.terminally_differentiated_only || false,
    });

    // Fetch cell types on mount
    useEffect(() => {
        fetchCellTypes();
    }, [filterValues.db_type]);

    useEffect(() => {
        if (
            tableParams.pagination?.current !== 1 ||
            tableParams.pagination?.pageSize !== 20
        ) {
            handleSubmit();
        }
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    useEffect(() => {
        if (!checkAllNull(urlParams)) handleSubmit();
    }, []);

    const fetchCellTypes = async () => {
        try {
            const response = await axios.get(
                `${BASE_API_URL}/api/gene-therapy/cell-types?db_type=${filterValues.db_type}`
            );
            setCellTypes(response.data || []);
        } catch (error) {
            console.error("Error fetching cell types:", error);
        }
    };

    const handleTableChange = async (pagination, filters, sorter) => {
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
            congenital_onset_max: filterValues.post_natal_only ? 1 : 3,
            severity_min: filterValues.severity_min,
            q_threshold: filterValues.q_threshold,
            db_type: filterValues.db_type,
            cell_types: filterValues.cell_types,
            expression_specificity_min: filterValues.expression_specificity_min,
            cns_only: filterValues.cns_only,
            terminally_differentiated_only: filterValues.terminally_differentiated_only,
            pageSize: tableParams.pagination?.pageSize,
            current: tableParams.pagination?.current,
        });

        const url = `${BASE_API_URL}/api/gene-therapy?${params.toString()}`;

        try {
            const response = await axios.get(url);
            const results = response.data.map((item, index) => ({
                ...item,
                key: item.id || index,
            }));

            setLoading(false);
            setData(results);

            if (results.length > 0 && results[0].total) {
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: results[0].total,
                    },
                }));
            }

            // Update URL
            Object.keys(filterValues).forEach((key) => {
                urlSetter({ [key]: filterValues[key].toString() });
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Gene",
            dataIndex: "gene",
            key: "gene",
            width: 100,
            render: (text, record) => (
                <div>
                    <a
                        style={{ textDecoration: "underline", fontWeight: "bold" }}
                        target="_blank"
                        href={`/gene?jump=${text}`}
                    >
                        {text}
                    </a>
                    {record.has_approved_therapy && (
                        <Tooltip title="This gene already has an approved therapy">
                            <span className="ml-1 text-orange-500 text-xs">*</span>
                        </Tooltip>
                    )}
                </div>
            ),
        },
        {
            title: "HPO ID",
            dataIndex: "hpo_id",
            key: "hpo_id",
            width: 120,
            render: (text) => (
                <a
                    style={{ textDecoration: "underline" }}
                    target="_blank"
                    href={`/phenotype?jump=${text}`}
                >
                    {text}
                </a>
            ),
        },
        {
            title: "Phenotype",
            dataIndex: "hpo_name",
            key: "hpo_name",
            ellipsis: true,
        },
        {
            title: "Cell Type",
            dataIndex: "celltype_name",
            key: "celltype_name",
            render: (text, record) => (
                <div>
                    {formatText(text)}
                    {record.terminally_differentiated && (
                        <Tooltip title="Terminally differentiated - ideal for AAV">
                            <span className="ml-1 text-green-500 text-xs">TD</span>
                        </Tooltip>
                    )}
                </div>
            ),
        },
        {
            title: (
                <>
                    Severity <SeverityScoreInfo />
                </>
            ),
            dataIndex: "severity_score_gpt",
            key: "severity_score_gpt",
            width: 90,
            render: (text) => (
                <SeverityScoreHover score={parseFloat(text)} decimalPoints={1} />
            ),
        },
        {
            title: (
                <>
                    AAV <AAVTractabilityInfo />
                </>
            ),
            dataIndex: "aav_tractability",
            key: "aav_tractability",
            width: 80,
            render: (value, record) => {
                const score = parseFloat(value || 0);
                const color = score >= 0.8 ? "green" : score >= 0.5 ? "orange" : "red";
                return (
                    <Tooltip title={`Best serotype: ${record.best_serotype || "Unknown"}`}>
                        <span style={{ color }}>{(score * 100).toFixed(0)}%</span>
                    </Tooltip>
                );
            },
        },
        {
            title: (
                <>
                    Q-value <QValueInfo />
                </>
            ),
            dataIndex: "q",
            key: "q",
            width: 90,
            render: (text) => (
                <Tooltip title={text}>
                    {parseFloat(text).toExponential(2)}
                </Tooltip>
            ),
        },
        {
            title: (
                <>
                    Expr. Spec. <ExpressionSpecificityInfo />
                </>
            ),
            dataIndex: "expression_specificity",
            key: "expression_specificity",
            width: 90,
            render: (text) => parseFloat(text).toFixed(3),
        },
        {
            title: "Onset",
            dataIndex: "congenital_onset",
            key: "congenital_onset",
            width: 70,
            render: (value) => {
                const labels = ["Never", "Rarely", "Often", "Always"];
                return (
                    <Tooltip title="Congenital onset frequency">
                        {labels[value] || value}
                    </Tooltip>
                );
            },
        },
    ];

    const expandedRowRender = (record) => {
        return (
            <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Clinical Characteristics</h4>
                        <p><strong>Death:</strong> {["Never", "Rarely", "Often", "Always"][record.death] || "N/A"}</p>
                        <p><strong>Intellectual Disability:</strong> {["Never", "Rarely", "Often", "Always"][record.intellectual_disability] || "N/A"}</p>
                        <p><strong>Congenital Onset:</strong> {["Never", "Rarely", "Often", "Always"][record.congenital_onset] || "N/A"}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">AAV Tractability</h4>
                        <p><strong>Tractability Score:</strong> {record.aav_tractability ? (record.aav_tractability * 100).toFixed(0) + "%" : "N/A"}</p>
                        <p><strong>Best Serotype:</strong> {record.best_serotype || "Unknown"}</p>
                        <p><strong>Terminally Differentiated:</strong> {record.terminally_differentiated ? "Yes" : "No"}</p>
                        {record.has_approved_therapy && (
                            <p className="text-orange-600 font-semibold mt-2">
                                This gene already has an approved therapy - check Approved Therapies page
                            </p>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Association Details</h4>
                        <p><strong>P-value:</strong> {record.p ? parseFloat(record.p).toExponential(2) : "N/A"}</p>
                        <p><strong>Cell Atlas:</strong> {record.celltype_database}</p>
                    </div>
                </div>
            </div>
        );
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Cell type options for Select
    const cellTypeOptions = [
        { value: "All", label: "All Cell Types" },
        ...cellTypes.map((ct) => ({ value: ct, label: formatText(ct) })),
    ];

    // Neuron-related cell types for quick filter
    const neuronCellTypes = cellTypes.filter(
        (ct) =>
            ct.toLowerCase().includes("neuron") ||
            ct.toLowerCase().includes("neur") ||
            ct.toLowerCase().includes("astro") ||
            ct.toLowerCase().includes("oligo")
    );

    return (
        <>
            <CustomHeader activePageKey="gene-therapy" />
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
                                    Gene Therapy Filters
                                </p>

                                {/* Severity Threshold */}
                                <div className="mx-5 mb-4 text-left" ref={tourRefSeverity}>
                                    <label className="font-medium">
                                        Min. Severity Score <SeverityScoreInfo />
                                    </label>
                                    <Slider
                                        min={0}
                                        max={100}
                                        value={filterValues.severity_min}
                                        onChange={(value) => handleFilterChange("severity_min", value)}
                                        marks={{ 0: "0", 20: "20", 50: "50", 100: "100" }}
                                    />
                                </div>

                                {/* Post-natal onset toggle */}
                                <div className="mx-5 mb-4 text-left" ref={tourRefOnset}>
                                    <label className="font-medium mr-3">
                                        Post-natal Onset Only
                                    </label>
                                    <Tooltip title="Exclude congenital phenotypes (onset before birth) for AAV gene therapy suitability">
                                        <Switch
                                            checked={filterValues.post_natal_only}
                                            onChange={(checked) => handleFilterChange("post_natal_only", checked)}
                                        />
                                    </Tooltip>
                                </div>

                                {/* CNS Only toggle */}
                                <div className="mx-5 mb-4 text-left">
                                    <label className="font-medium mr-3">
                                        CNS Phenotypes Only
                                    </label>
                                    <Tooltip title="Filter to nervous system phenotypes (descendants of HP:0000707)">
                                        <Switch
                                            checked={filterValues.cns_only}
                                            onChange={(checked) => handleFilterChange("cns_only", checked)}
                                        />
                                    </Tooltip>
                                </div>

                                {/* Terminally Differentiated Only toggle */}
                                <div className="mx-5 mb-4 text-left">
                                    <label className="font-medium mr-3">
                                        Terminally Differentiated Only
                                    </label>
                                    <Tooltip title="Only include cell types that don't divide (neurons, cardiomyocytes) for durable AAV treatment">
                                        <Switch
                                            checked={filterValues.terminally_differentiated_only}
                                            onChange={(checked) => handleFilterChange("terminally_differentiated_only", checked)}
                                        />
                                    </Tooltip>
                                </div>

                                {/* Q-value threshold */}
                                <div className="mx-5 mb-4 text-left">
                                    <label className="font-medium">
                                        Q-value Threshold <QValueInfo />
                                    </label>
                                    <InputNumber
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={filterValues.q_threshold}
                                        onChange={(value) => handleFilterChange("q_threshold", value)}
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                {/* Expression specificity */}
                                <div className="mx-5 mb-4 text-left">
                                    <label className="font-medium">
                                        Min. Expression Specificity <ExpressionSpecificityInfo />
                                    </label>
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={filterValues.expression_specificity_min}
                                        onChange={(value) => handleFilterChange("expression_specificity_min", value)}
                                        marks={{ 0: "0", 0.1: "0.1", 0.5: "0.5", 1: "1" }}
                                    />
                                </div>

                                {/* Cell Atlas selection */}
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

                                {/* Cell Type filter */}
                                <div className="mx-5 mb-4 text-left" ref={tourRefCellType}>
                                    <label className="font-medium">Cell Type Filter</label>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Select cell types (or leave empty for all)"
                                        value={filterValues.cell_types === "All" ? [] : filterValues.cell_types.split(",")}
                                        onChange={(values) => handleFilterChange("cell_types", values.length ? values.join(",") : "All")}
                                        style={{ width: "100%" }}
                                        options={cellTypeOptions}
                                        maxTagCount={2}
                                    />
                                    {neuronCellTypes.length > 0 && (
                                        <Button
                                            size="small"
                                            type="link"
                                            onClick={() => handleFilterChange("cell_types", neuronCellTypes.join(","))}
                                        >
                                            Select neural cell types only
                                        </Button>
                                    )}
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
                                    <p className="font-semibold">Find Candidates</p>
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
                            <Breadcrumb.Item>Gene Therapy Targets</Breadcrumb.Item>
                        </Breadcrumb>

                        <Card style={{ width: "100%", marginBottom: 16 }}>
                            <h2 className="text-xl font-semibold mb-2">Gene Therapy Target Prioritization</h2>
                            <p>
                                This tool identifies potential gene therapy candidates by combining
                                phenotype severity, cell type associations, and gene expression specificity.
                                It filters for characteristics important for AAV-based gene therapy:
                            </p>
                            <ul className="list-disc ml-6 mt-2">
                                <li><strong>Post-natal onset:</strong> AAV works best when symptoms appear after birth</li>
                                <li><strong>CNS phenotypes:</strong> Focus on neurological conditions</li>
                                <li><strong>High severity:</strong> Prioritize conditions with significant clinical impact</li>
                                <li><strong>Cell type specificity:</strong> Target terminally differentiated cells (neurons, astrocytes)</li>
                            </ul>
                        </Card>

                        {data.length > 0 || !checkAllNull(urlParams) ? (
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
                                    <DownloadButton elementId="gene-therapy-table" />
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Gene Therapy Candidates
                                        {data.length > 0 && data[0].total && (
                                            <span className="text-gray-500 font-normal ml-2">
                                                ({data[0].total} total results)
                                            </span>
                                        )}
                                    </h3>
                                </div>

                                <Spin spinning={loading}>
                                    <Table
                                        id="gene-therapy-table"
                                        pagination={tableParams.pagination}
                                        columns={columns}
                                        expandable={{
                                            expandedRowRender,
                                            rowExpandable: () => true,
                                        }}
                                        dataSource={data}
                                        size="small"
                                        onChange={handleTableChange}
                                        scroll={{ x: 1000 }}
                                    />
                                </Spin>
                            </div>
                        ) : (
                            <PageIntro
                                description="Find gene therapy candidates by filtering phenotypes based on severity, onset timing, and cell type associations. Adjust the filters on the left and click 'Find Candidates' to search."
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
