import { portalFetch, portalGet } from "../lib/portalAPI.js";
import SnapshotScopeNotice from "../components/SnapshotScopeNotice.jsx";
import EvidenceEntry from "../components/EvidenceEntry.jsx";
import { useEffect, useRef, useState } from "react";
import PhenotypeTree from "../components/CellTree.jsx";
import CustomHeader from "../components/utilities/Header.jsx";
import CustomFooter from "../components/utilities/Footer.jsx";
import {
    Breadcrumb,
    Layout,
    theme,
    InputNumber,
    Radio,
    Table,
    Spin,
    Button,
    Tabs,
    Card,
    Collapse,
    ConfigProvider,
    Tooltip,
    Alert
} from "antd";
import { Column } from "@ant-design/plots";
import { SearchOutlined } from "@ant-design/icons";
import { BASE_API_URL } from "../../config.js";
import { SettingsOutlined } from "@mui/icons-material";
import NotFound from "../components/utilities/Texts.jsx";
import SeverityTierHover from "../components/info/SeverityTierHover.jsx";
import SeverityTierInfo from "../components/info/SeverityTierInfo.jsx";
import SeverityScoreInfo from "../components/info/SeverityScoreInfo.jsx";
import SeverityScoreHover from "../components/info/SeverityScoreHover.jsx";
import formatText from "../scripts/formatText.js";
import CellAtlasInfo from "../components/info/CellAtlasInfo.jsx";
import CellAtlasSelectionInfo from "../components/info/CellAtlasSelectionInfo.jsx";
import QValueInfo from "../components/info/QValueInfo.jsx";
import ExpressionSpecificityInfo from "../components/info/ExpressionSpecificityInfo.jsx";
import PageIntro from "../components/PageIntro.jsx";
import { urlParser, urlSetter } from "../scripts/urlHandlers.js";
import ShareButton from "../components/utilities/ShareButton.jsx";
import PhenotypeNetwork from "../components/PhenotypeNetwork.jsx";
import { createRoot } from "react-dom/client";
import { Link } from "react-router-dom";
import { legacyExplorerHref } from "../lib/legacyExplorerLink.js";
import { formatQ } from "../lib/evidenceModel.js";
import DownloadButton from "../components/utilities/Download.jsx";

function displaySourceNumber(value, decimalPoints) {
    return value == null || value === "" || !Number.isFinite(Number(value))
        ? "Not available" : Number(value).toPrecision(Math.max(3, decimalPoints));
}

const DemoColumn = (data) => {
    const chartRef = useRef();
    const config = {
        data: data.data,
        xField: "gene",
        yField: "expression_specificity",
        axis: {
            x: {
                title: "Gene",
            },
            y: {
                title: "Expression Specificity",
            },
        },
        interaction: {
            tooltip: {
                render: (e, { title, items }) => {
                    return (
                        <div key={title}>
                            <div className="text-xs">
                                <span className="font-semibold">
                                    Gene Name:{" "}
                                </span>
                                {formatText(title)}
                            </div>
                            {items.map((item) => {
                                const { value, color } = item;
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div>
                                        <div
                                            style={{
                                                margin: 10,
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: "50%",
                                                        backgroundColor: color,
                                                        marginRight: 6,
                                                    }}
                                                />
                                                <span>
                                                    Expression Specificity:{" "}
                                                    <b>
                                                        {value.toFixed(
                                                            data.decimalPoints
                                                        )}
                                                    </b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="italic">
                                Higher values indicate greater relative expression
                                specificity in this atlas, not functional importance.
                            </div>
                        </div>
                    );
                },
            },
        },
    };
    return <Column {...config} ref={chartRef} />;
};

const { Content } = Layout;

export default function CelltypePage() {
    useEffect(() => {
        document.title = "Cell types · Rare Disease Celltyping Portal";
    }, []);
    // Set states
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [loading, setLoading] = useState(false);
    const [phenotypeError, setPhenotypeError] = useState(false);
    const [geneError, setGeneError] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [decimalPoints, setDecimalPoints] = useState(3);

    const networkDivRef = useRef();
    const networkRootRef = useRef(null);
    const requestRevision = useRef(0);
    useEffect(() => () => {
        ++requestRevision.current;
        networkRootRef.current?.unmount();
        networkRootRef.current = null;
    }, []);

    // Tour
    const tourRefAtlas = useRef(null);
    const tourRefSearch = useRef(null);
    const tourRefSelect = useRef(null);
    const tourRefQValue = useRef(null);
    const tourRefSubmit = useRef(null);

    const tourSteps = [
        {
            key: "atlas-search",
            target: () => tourRefAtlas.current,
        },
        {
            key: "cell-search",
            target: () => tourRefSearch.current,
        },
        {
            key: "cell-select",
            target: () => tourRefSelect.current,
        },
        {
            key: "cell-qvalue",
            target: () => tourRefQValue.current,
        },
        {
            key: "cell-submit",
            target: () => tourRefSubmit.current,
        },
    ];

    // URL Parsing
    const { jump, db_type, q_value } = urlParser("celltype");

    const [sliderValues, setSliderValues] = useState({
        db_type: db_type || "DescartesHuman",
        q: q_value || "0.05",
        fold_change: "1",
        celltype_name: jump || "",
    });
    const [activeCellType, setActiveCellType] = useState("");
    const [activeAtlas, setActiveAtlas] = useState(db_type || "DescartesHuman");

    useEffect(() => {
        // Hydration reads the current source selection and never writes history.
        // A delayed former mount must not restore a cleared cell into a new atlas.
        const current = urlParser("celltype");
        if (current.jump && current.jump === jump && current.db_type === db_type) {
            handleSubmit(null, {
                ...sliderValues,
                celltype_name: current.jump,
                db_type: current.db_type || "DescartesHuman",
                q: current.q_value || "0.05",
            }, false);
        }
        // URL hydration runs on the router-keyed mount; filters submit explicitly.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const expandedRowRender = (record) => {
        const columns = [
            {
                title: "Target",
                dataIndex: "Target",
                key: "Target",
            },
            {
                title: "Value",
                dataIndex: "Value",
                key: "Value",
            },
        ];
        const data1 = [];

        data1.push({
            Value: record.celltype_database,
            Target: "database",
        });
        data1.push({
            Value: displaySourceNumber(record.estimate, decimalPoints),
            Target: "estimate",
        });

        data1.push({
            Value: displaySourceNumber(record.std_error, decimalPoints),
            Target: "std_error",
        });
        data1.push({
            Value: displaySourceNumber(record.statistic, decimalPoints),
            Target: "statistic",
        });
        data1.push({
            Value: formatQ(record.q == null ? null : Number(record.q)),
            Target: "q",
        });
        data1.push({
            Value: displaySourceNumber(record.fold_change, decimalPoints),
            Target: "fold_change",
        });

        data1.push({
            Value: formatQ(record.p == null ? null : Number(record.p)),
            Target: "p",
        });
        data1.push({
            Value: displaySourceNumber(record.model_estimate, decimalPoints),
            Target: "model_estimate",
        });
        data1.push({
            Value: displaySourceNumber(record.model_statistic, decimalPoints),
            Target: "model_statistic",
        });

        return (
            <Table columns={columns} dataSource={data1} pagination={false} rowKey="Target" />
        );
    };
    const columns = [
        {
            title: "HPO ID",
            dataIndex: "hpo_id",
            key: "hpo_id",
            sorter: (a, b) =>
                a.hpo_id.substring("HP:".length) -
                b.hpo_id.substring("HP:".length),
            render: (text, record) => {
                return (
                    <Link
                        style={{ textDecoration: "underline" }}
                        to={legacyExplorerHref("phenotype", text, { atlas: record.celltype_database })}
                    >
                        {text}
                    </Link>
                );
            },
        },
        {
            title: "HPO Name",
            dataIndex: "hpo_name",
            key: "hpo_name",
            sorter: (a, b) => a.hpo_name.localeCompare(b.hpo_name),
            render: (text) => {
                return text || <NotFound />;
            },
        },
        {
            title: "Direction",
            dataIndex: "direction",
            key: "direction",
            render: (text) => text || "Not recorded",
        },
        {
            title: "Signed estimate",
            dataIndex: "estimate",
            key: "estimate",
            sorter: (a, b) => a.estimate - b.estimate,
            render: (value) => displaySourceNumber(value, decimalPoints),
        },
        {
            title: (
                <>
                    Severity Score <SeverityScoreInfo />
                </>
            ),
            dataIndex: "severity_score_gpt",
            key: "severity_score_gpt",
            sorter: (a, b) => a.severity_score_gpt - b.severity_score_gpt,
            render: (text) => {
                if (isNaN(parseFloat(text))) {
                    return <i className="text-gray-400">NA</i>;
                }
                return (
                    <SeverityScoreHover
                        score={parseFloat(text)}
                        decimalPoints={decimalPoints}
                    />
                );
            },
        },
        {
            title: (
                <>
                    Severity Class <SeverityTierInfo />
                </>
            ),
            dataIndex: "severity_class",
            key: "severity_class",
            render: (text) => {
                return <SeverityTierHover tier={text} />;
            },
        },
        {
            title: (
                <>
                    Q-Value <QValueInfo />
                </>
            ),
            dataIndex: "q",
            key: "q",
            sorter: (a, b) => a.q - b.q,
            render: (text) => {
                return formatQ(text == null ? null : Number(text));
            },
        },
    ];

    const columns1 = [
        {
            title: "Gene Name",
            dataIndex: "gene",
            key: "gene",
            width: "30%",
            sorter: (a, b) => a.gene.localeCompare(b.gene),
            render: (text) => {
                const destination = legacyExplorerHref("gene", text, { atlas: activeAtlas, cell: activeCellType });
                return destination ? <Link to={destination}>{text}</Link> : text;
            },
        },

        {
            title: (
                <>
                    Expression Specificity <ExpressionSpecificityInfo />
                </>
            ),
            dataIndex: "expression_specificity",
            key: "expression_specificity",
            sorter: (a, b) =>
                a.expression_specificity - b.expression_specificity,
            render: (text) => {
                return displaySourceNumber(text, decimalPoints);
            },
        },
    ];

    const handleSliderChange = (name) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            q: name,
        }));
    };
    const handleDecimalChange = (decimalPoints) => {
        setDecimalPoints(decimalPoints);
    };
    const handleSubmit = async (event, submitted = sliderValues, writeSelection = true) => {
        event?.preventDefault();
        const revision = ++requestRevision.current;
        const submittedAtlas = submitted.db_type;
        const submittedCell = submitted.celltype_name;
        setLoading(true);
        setPhenotypeError(false);
        setGeneError(false);
        setNetworkError(false);
        setData([]);
        setData1([]);
        setActiveAtlas(submittedAtlas);
        setActiveCellType(submittedCell);
        if (writeSelection && urlSetter({
            jump: submittedCell,
            db_type: submittedAtlas,
            q_value: submitted.q,
        })) return; // The keyed destination mount owns the new source request.
        const queryParams = new URLSearchParams(submitted).toString();
        const url = `${BASE_API_URL}/api/cell?${queryParams}`;
        try {
            const response = await portalGet(url);
            if (revision !== requestRevision.current) return;

            // Fetch definitions for each item
            const dataWithDefinitions = await Promise.all(
                response.data.map(async (item) => {
                    return {
                        ...item,
                        key: item.id,
                    };
                })
            );
            if (revision !== requestRevision.current) return;
            setLoading(false);
            setData(dataWithDefinitions);
            let node = [];
            for (let i = 0; i < dataWithDefinitions.length; i++) {
                node.push({
                    id: dataWithDefinitions[i].hpo_id,
                    name: dataWithDefinitions[i].hpo_name,
                    type: dataWithDefinitions[i].severity_class,
                });
            }

            portalFetch(`${BASE_API_URL}/api/hpjFiltered?${queryParams}`)
                .then((res) => { if (!res.ok) throw new Error('Network source unavailable'); return res.json(); })
                .then((results) => {
                    if (revision !== requestRevision.current) return;
                    node = node.filter(function (v) {
                        return v.name !== undefined;
                    })

                    results = results.filter(function (v) {
                        return (
                            node.some((item2) => item2["id"] === v["source"]) &&
                            node.some((item2) => item2["id"] === v["target"])
                        );
                    });

                    const data = {
                        "nodes": node,
                        "links": results
                    }
                    if (networkDivRef.current) {
                        networkRootRef.current ||= createRoot(networkDivRef.current);
                        networkRootRef.current.render(
                            <PhenotypeNetwork elementRef={networkDivRef} data={data} height={400} context={{ atlas: submittedAtlas, cell: submittedCell }} />
                        );
                    }
                }).catch(() => { if (revision === requestRevision.current) setNetworkError(true); });
        } catch (error) {
            if (revision !== requestRevision.current) return;
            console.error("Error fetching data:", error);
            setPhenotypeError(true);
            setLoading(false);
        }

        portalFetch(
            `${BASE_API_URL}/gene1/${submittedCell}/${submittedAtlas}`
        )
            .then((res) => { if (!res.ok) throw new Error('Gene source unavailable'); return res.json(); })
            .then((results) => {
                if (revision !== requestRevision.current) return;
                results.sort((a, b) => {
                    return b.expression_specificity - a.expression_specificity;
                });
                setData1(results);
                setLoading(false);
            }).catch(() => { if (revision === requestRevision.current) { setGeneError(true); setLoading(false); } });
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState(db_type || "DescartesHuman");
    const handleSizeChange = (e) => {
        // Rows belong to the submitted atlas. Changing a pending atlas must
        // not relabel cached rows or allow a late former request to restore them.
        ++requestRevision.current;
        networkRootRef.current?.unmount();
        networkRootRef.current = null;
        setData([]);
        setData1([]);
        setActiveCellType("");
        setLoading(false);
        setPhenotypeError(false);
        setGeneError(false);
        setNetworkError(false);
        setSize(e.target.value);
        setSliderValues((prevValues) => ({
            ...prevValues,
            db_type: e.target.value,
            celltype_name: "",
        }));
        // The current URL, evidence bridge and browser history must describe
        // the newly selected atlas, without the former atlas's cell identity.
        urlSetter({ db_type: e.target.value, jump: null });
    };
    const getData = (data, info) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            celltype_name: info.node.key,
        }));
    };
    // Advanced Settings
    const genExtra = () => <SettingsOutlined />; // Settings icon
    const advancedSettingsChildren = [
        <InputNumber
            key="decimal-points"
            min={1}
            max={10}
            defaultValue={decimalPoints}
            addonBefore={"Decimal Points"}
            style={{ width: "100%" }}
            onChange={handleDecimalChange}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // Prevent the default behavior of the Enter key
                }
            }}
        />,
    ];
    const advancedSettingsMain = [
        {
            key: "1",
            title: "Advanced Settings",
            label: <p className="font-semibold">Advanced Settings</p>,
            children: advancedSettingsChildren,
            extra: genExtra(),
        },
    ];

    // Override q-value input addon style to alter background color and padding
    // Work around: addonBg prop not working
    useEffect(() => {
        document
            .querySelectorAll(".ant-input-number-group-addon")
            .forEach((el) => {
                el.style.background = "#f0f0f0";
                el.style.padding = "0px 20px";
            });
    }, []);

    return (
        <>
            <CustomHeader activePageKey="celltype" />
            <Layout className="portal-page portal-explorer">
                <aside className="portal-sidebar" aria-label="Search and filters">
                    <form onSubmit={handleSubmit}>
                        <div ref={tourRefAtlas} className="mb-4">
                            <h2
                                style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                    color: "#262626",
                                }}
                            >
                                Cell Atlases <CellAtlasInfo />
                            </h2>
                            <hr style={{ marginBottom: 7, border: "none" }} />
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Radio: {
                                            buttonSolidCheckedBg: "#1677ff",
                                            buttonSolidCheckedHoverBg:
                                                "#4096ff",
                                        },
                                    },
                                }}
                            >
                                <Radio.Group
                                    className="portal-atlas-options"
                                    buttonStyle="solid"
                                    value={size}
                                    onChange={handleSizeChange}
                                >
                                    <Radio.Button
                                        className="portal-atlas-option"
                                        value="DescartesHuman"
                                    >
                                        <CellAtlasSelectionInfo atlasName="DescartesHuman" />
                                    </Radio.Button>
                                    <Radio.Button
                                        className="portal-atlas-option"
                                        value="HumanCellLandscape"
                                    >
                                        <CellAtlasSelectionInfo atlasName="HumanCellLandscape" />
                                    </Radio.Button>
                                </Radio.Group>
                            </ConfigProvider>
                        </div>
                        <PhenotypeTree
                            onGetData={getData}
                            db_type={size}
                            tourRefs={[tourRefSearch, tourRefSelect]}
                        />
                        <div className="portal-filter-form">
                            <div style={{ textAlign: "left" }}>
                                <hr
                                    style={{ marginBottom: 10, border: "none" }}
                                />
                                <div ref={tourRefQValue}>
                                    <InputNumber
                                        name="q"
                                        style={{
                                            width: "100%",
                                        }}
                                        defaultValue="0.005"
                                        value={sliderValues.q}
                                        step="0.005"
                                        max="1"
                                        min="0.00001"
                                        onChange={handleSliderChange}
                                        addonBefore={
                                            <>
                                                <Tooltip title="Only the results with q-value below this threhold will be displayed.">
                                                    Q-Value <QValueInfo />
                                                </Tooltip>
                                            </>
                                        }
                                        stringMode
                                    />
                                </div>
                                <br />
                                <br />
                                <Collapse
                                    items={advancedSettingsMain}
                                    size="small"
                                    style={{ background: colorBgContainer }}
                                />
                                <Button
                                    name="Search"
                                    size="large"
                                    icon={<SearchOutlined />}
                                    style={{
                                        marginTop: 20,
                                        marginBottom: 20,
                                    }}
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    ref={tourRefSubmit}
                                >
                                    <p className="font-semibold">Search</p>
                                </Button>
                            </div>
                        </div>
                    </form>
                </aside>
                <Layout className="portal-content-layout">
                    <Content className="portal-content">
                        <Breadcrumb
                            style={{
                                margin: "16px 0",
                            }}
                        >
                            <Breadcrumb.Item href={"/"}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Search by Cell Type
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <EvidenceEntry />
                        <SnapshotScopeNotice />
                        <Card
                            style={{
                                width: "100%",
                            }}
                        >
                            <h1>Cell types</h1>
                            <p>
                                Select an exact cell label and atlas to inspect signed phenotype
                                associations and gene expression specificity. Positive and negative
                                estimates remain separate evidence; neither establishes cellular
                                causality. Gene expression does not show that a pathogenic variant
                                acts in that cell or that a treatment reaches or rescues it.
                            </p>
                        </Card>
                        <br />
                        {activeCellType != "" ? (
                            <div
                                className="portal-results"
                                style={{
                                    padding: 22,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <div className="portal-panel-heading">
                                <h2
                                    style={{
                                        fontSize: 22,
                                        fontWeight: "bold",
                                        color: "#262626",
                                    }}
                                >
                                    {formatText(activeCellType)}
                                </h2>
                                <ShareButton />
                                </div>
                                <p>Source cell label: <code>{activeCellType}</code> · Atlas: <code>{activeAtlas}</code></p>
                                <br />
                                {(phenotypeError || geneError) && <Alert type="warning" showIcon role="alert" message="Source request failed; association results are unknown." description={`${phenotypeError ? 'Phenotype associations could not be retrieved. ' : ''}${geneError ? 'Gene expression associations could not be retrieved. ' : ''}A failed request does not establish absence of an association. Retry Search or follow the static evidence snapshots.`} />}
                                {networkError && <Alert type="info" showIcon message="The network source could not be retrieved; the relationship graph is unavailable." />}
                                <Tabs
                                    type="card"
                                    items={new Array(2)
                                        .fill(null)
                                        .map((_, i) => {
                                            let id = String(i + 1);
                                            if (i === 0) {
                                                id = "Phenotype Associations";
                                                return {
                                                    label: `${id}`,
                                                    key: id,
                                                    children: (
                                                        <Spin
                                                            spinning={loading}
                                                        >
                                                            <br />
                                                            <div id="network" ref={networkDivRef} style={{ display: phenotypeError || networkError ? 'none' : undefined }} className="mb-3 -mt-3 border rounded-lg" />
                                                            <Table
                                                                locale={{ emptyText: phenotypeError ? 'Source unavailable; phenotype associations remain unknown.' : undefined }}
                                                                columns={
                                                                    columns
                                                                }
                                                                expandable={{
                                                                    expandedRowRender,
                                                                    defaultExpandedRowKeys:
                                                                        ["0"],
                                                                }}
                                                                showSorterTooltip={
                                                                    true
                                                                }
                                                                dataSource={
                                                                    data
                                                                }
                                                                size="small"
                                                                className="mt-5"
                                                            />
                                                        </Spin>
                                                    ),
                                                };
                                            }
                                            if (i === 1) {
                                                id = "Gene Associations";
                                                return {
                                                    label: `${id}`,
                                                    key: id,
                                                    children: (
                                                        <Spin
                                                            spinning={loading}
                                                        >

                                                            {data1?.length > 50 && (
                <Alert
                    type="info"
                    showIcon
                    message={
                        <>
                            Only showing the top 50 genes (sorted by expression
                            specificity) out of{" "}
                            <span className="font-semibold text-blue-950">
                                {data1.length}
                            </span>.
                        </>
                    }
                    className=" my-3"
                />
            )}
                                                            {!geneError && data1.length > 0 && <div className="portal-result-download"><DownloadButton elementId="cell-gene-plot" /></div>}
                                                            {!geneError && <div id="cell-gene-plot"><DemoColumn data={data1.slice(0, 50)} decimalPoints={decimalPoints} /></div>}
                                                            <Table
                                                                locale={{ emptyText: geneError ? 'Source unavailable; gene associations remain unknown.' : undefined }}
                                                                columns={
                                                                    columns1
                                                                }
                                                                dataSource={
                                                                    data1
                                                                }
                                                                rowKey="gene"
                                                                size="small"
                                                                showSorterTooltip={
                                                                    true
                                                                }
                                                            />
                                                        </Spin>
                                                    ),
                                                };
                                            }
                                        })}
                                />
                            </div>
                        ) : (
                            <PageIntro
                                tourSteps={tourSteps}
                                description="Search and select a cell type from the list on the left to explore its relationships with different genes and phenotypes."
                            />
                        )}
                    </Content>
                    <CustomFooter />
                </Layout>
            </Layout>
        </>
    );
}
