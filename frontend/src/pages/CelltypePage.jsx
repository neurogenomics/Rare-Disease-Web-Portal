import React, { useEffect, useRef, useState } from "react";
import PhenotypeTree from "../components/CellTree.jsx";
import CustomHeader from "../components/utilities/Header.jsx";
import CustomFooter from "../components/utilities/Footer.jsx";
import axios from "axios";
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
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
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
import { createRoot } from "react-dom";

const suitsDta =
    '[{"source":"Microsoft","target":"Amazon","type":"1"},{"source":"Microsoft","target":"HTC","type":"licensing"},{"source":"Samsung","target":"Apple","type":"suit"},{"source":"Motorola","target":"Apple","type":"suit"},{"source":"Nokia","target":"Apple","type":"resolved"},{"source":"HTC","target":"Apple","type":"suit"},{"source":"Kodak","target":"Apple","type":"suit"},{"source":"Microsoft","target":"Barnes & Noble","type":"suit"},{"source":"Microsoft","target":"Foxconn","type":"suit"},{"source":"Oracle","target":"Google","type":"suit"},{"source":"Apple","target":"HTC","type":"suit"},{"source":"Microsoft","target":"Inventec","type":"suit"},{"source":"Samsung","target":"Kodak","type":"resolved"},{"source":"LG","target":"Kodak","type":"resolved"},{"source":"RIM","target":"Kodak","type":"suit"},{"source":"Sony","target":"LG","type":"suit"},{"source":"Kodak","target":"LG","type":"resolved"},{"source":"Apple","target":"Nokia","type":"resolved"},{"source":"Qualcomm","target":"Nokia","type":"resolved"},{"source":"Apple","target":"Motorola","type":"suit"},{"source":"Microsoft","target":"Motorola","type":"suit"},{"source":"Motorola","target":"Microsoft","type":"suit"},{"source":"Huawei","target":"ZTE","type":"suit"},{"source":"Ericsson","target":"ZTE","type":"suit"},{"source":"Kodak","target":"Samsung","type":"resolved"},{"source":"Apple","target":"Samsung","type":"suit"},{"source":"Kodak","target":"RIM","type":"suit"},{"source":"Nokia","target":"Qualcomm","type":"suit"}]';

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
                                A higher value indicates that the gene likely
                                plays a more important role in the cell type.
                            </div>
                        </div>
                    );
                },
            },
        },
    };
    return <Column {...config} ref={chartRef} />;
};

const { Content, Sider } = Layout;

export default function CelltypePage() {
    // Set states
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [loading, setLoading] = useState(false);
    const [decimalPoints, setDecimalPoints] = useState(3);

    const networkDivRef = useRef();

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

    useEffect(() => {
        if (jump) handleSubmit();
    }, []);

    const expandedRowRender = (record, index, indent, expanded) => {
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
            Value: parseFloat(record.estimate).toFixed(decimalPoints),
            Target: "estimate",
        });

        data1.push({
            Value: parseFloat(record.std_error).toFixed(decimalPoints),
            Target: "std_error",
        });
        data1.push({
            Value: parseFloat(record.statistic).toFixed(decimalPoints),
            Target: "statistic",
        });
        data1.push({
            Value: parseFloat(record.q).toFixed(decimalPoints),
            Target: "q",
        });
        data1.push({
            Value: parseFloat(record.fold_change).toFixed(decimalPoints),
            Target: "fold_change",
        });

        data1.push({
            Value: parseFloat(record.p).toFixed(decimalPoints),
            Target: "p",
        });
        data1.push({
            Value: parseFloat(record.model_estimate).toFixed(decimalPoints),
            Target: "model_estimate",
        });
        data1.push({
            Value: parseFloat(record.model_statistic).toFixed(decimalPoints),
            Target: "model_statistic",
        });

        return (
            <Table columns={columns} dataSource={data1} pagination={false} />
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
                    <a
                        style={{ textDecoration: "underline" }}
                        target={"_blank"}
                        href={`/phenotype?jump=${text}&db_type=${record.celltype_database}`}
                    >
                        {text}
                    </a>
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
                return parseFloat(text).toFixed(decimalPoints);
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
                return parseFloat(text).toFixed(decimalPoints);
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
    const handleSubmit = async (event) => {
        setLoading(true);
        urlSetter({
            jump: sliderValues.celltype_name,
            db_type: sliderValues.db_type,
            q_value: sliderValues.q,
        });
        const queryParams = new URLSearchParams(sliderValues).toString();
        const url = `${BASE_API_URL}/api/cell?${queryParams}`;
        try {
            const response = await axios.get(url);

            // Fetch definitions for each item
            const dataWithDefinitions = await Promise.all(
                response.data.map(async (item) => {
                    return {
                        ...item,
                        key: item.id,
                    };
                })
            );
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

            fetch(`${BASE_API_URL}/api/hpjFiltered?${queryParams}`)
                .then((res) => res.json())
                .then((results) => {
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
                    createRoot(document.getElementById("network")).render(
                        <PhenotypeNetwork elementRef={networkDivRef} data={data} height={400} />
                    )
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        fetch(
            `${BASE_API_URL}/gene1/${sliderValues.celltype_name}/${sliderValues.db_type}`
        )
            .then((res) => res.json())
            .then((results) => {
                results = results.filter(
                    (item) => item.expression_specificity > 0.00001
                ); // Filter out genes with practically no specificity
                results.sort((a, b) => {
                    return b.expression_specificity - a.expression_specificity;
                });
                setData1(results);
                setLoading(false);
            });
        setActiveCellType(sliderValues.celltype_name);
    };

    const onload = async (event) => {
        setLoading(true);
        const queryParams = new URLSearchParams(event).toString();
        const url = `${BASE_API_URL}/api/cell?${queryParams}`;
        try {
            const response = await axios.get(url);

            // Fetch definitions for each item
            const dataWithDefinitions = await Promise.all(
                response.data.map(async (item) => {
                    return {
                        ...item,
                        key: item.id,
                    };
                })
            );
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

            fetch(`${BASE_API_URL}/api/hpj`)
                .then((res) => res.json())
                .then((results) => {
                    NetWork(results, node);
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState(db_type || "DescartesHuman");
    const handleSizeChange = (e) => {
        setSize(e.target.value);
        setSliderValues((prevValues) => ({
            ...prevValues,
            db_type: e.target.value,
        }));
    };
    const getData = (data, info) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            celltype_name: info.node.key,
        }));
    };
    const downloadGenePlot = () => {
        var canvas = document.getElementsById("network")[0];
        let svg0 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        svg0.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg0.setAttribute("version", "1.1");
        svg0.setAttribute("height", "880");
        svg0.setAttribute("width", "1920");
        let img3 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );
        img3.href.baseVal = canvas.toDataURL("image/png");
        img3.setAttribute("height", "880");
        svg0.appendChild(img3);
        let h = svg0.outerHTML;
        let data =
            "data:image/svg+xml;base64," +
            window.btoa(unescape(encodeURIComponent(h)));
        const elink = document.createElement("a");
        elink.download = "Cell Associations";
        elink.style.display = "none";
        elink.href = data;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
    };


    // Advanced Settings
    const genExtra = () => <SettingsOutlined />; // Settings icon
    const advancedSettingsChildren = [
        <InputNumber
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
            <Layout
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#0F172AFF",
                }}
            >
                <Sider
                    style={{ background: "#0F172AFF", margin: 20 }}
                    width={400}
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <form onSubmit={handleSubmit}>
                        <div ref={tourRefAtlas} className="mb-4">
                            <h1
                                style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                    color: "#FFFFFF",
                                }}
                            >
                                Cell Atlases <CellAtlasInfo />
                            </h1>
                            <hr style={{ marginBottom: 7, border: "none" }} />
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Radio: {
                                            buttonSolidCheckedBg: "#7944f2",
                                            buttonSolidCheckedHoverBg:
                                                "#8a5cf2",
                                        },
                                    },
                                }}
                            >
                                <Radio.Group
                                    buttonStyle="solid"
                                    value={size}
                                    onChange={handleSizeChange}
                                >
                                    <Radio.Button
                                        style={{ width: 200 }}
                                        value="DescartesHuman"
                                    >
                                        <CellAtlasSelectionInfo atlasName="DescartesHuman" />
                                    </Radio.Button>
                                    <Radio.Button
                                        style={{ width: 200 }}
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
                        <center>
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
                                        backgroundColor: "#c8bbec",
                                    }}
                                    type="submit"
                                    block
                                    onClick={(event) => {
                                        handleSubmit(event);
                                    }}
                                    ref={tourRefSubmit}
                                >
                                    <p className="font-semibold">Search</p>
                                </Button>
                            </div>
                        </center>
                    </form>
                </Sider>
                <Layout>
                    <Content
                        style={{
                            margin: "0 16px",
                            height: "200px",
                            overflow: "auto",
                            minWidth: "50rem",
                        }}
                    >
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
                        <Card
                            style={{
                                width: "100%",
                            }}
                        >
                            <p>
                                Each cell type has been mapped to specific
                                phenotypes and genes, providing insight into the
                                cellular mechanisms underlying rare diseases.
                                This page allows users to search for any cell
                                type and view its associations with phenotypes
                                and genes. The strength of these relationships
                                is displayed using visualizations like bar
                                charts and network graphs.{" "}
                            </p>
                        </Card>
                        <br />
                        {activeCellType != "" ? (
                            <div
                                style={{
                                    padding: 22,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <div className="flex flex-row items-center justify-between">
                                <h2
                                    style={{
                                        fontSize: 22,
                                        fontWeight: "bold",
                                        color: "#6357d3",
                                    }}
                                >
                                    {formatText(activeCellType)}
                                </h2>
                                <ShareButton />
                                </div>
                                <br />
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
                                                            <div id="network" ref={networkDivRef} className="mb-3 -mt-3 border rounded-lg" />
                                                            <Table
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

                                                            {data1?.length > 40 && (
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
                                                                        <Button
                                                                style={{
                                                                    float: "right",
                                                                    width: 50,
                                                                }}
                                                                type="primary"
                                                                icon={
                                                                    <DownloadOutlined />
                                                                }
                                                                size="small"
                                                                onClick={
                                                                    downloadGenePlot
                                                                }
                                                                className="z-10"
                                                            />
                                                            <DemoColumn
                                                                data={data1.slice(0, 50)}
                                                                decimalPoints={
                                                                    decimalPoints
                                                                }
                                                            />
                                                            <Table
                                                                columns={
                                                                    columns1
                                                                }
                                                                dataSource={
                                                                    data1
                                                                }
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
