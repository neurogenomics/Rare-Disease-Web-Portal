import React, { useEffect, useRef, useState } from "react";
import PhenotypeTree from "../components/CellTree.jsx";
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
    Tag,
    Card,
    Collapse,
} from "antd";
import { Column } from "@ant-design/plots";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import * as d3 from "d3";
import { BASE_API_URL } from "../../config.js";
import { SettingsOutlined } from "@mui/icons-material";
import NotFound from "../components/utilities/Texts.jsx";

const suitsDta =
    '[{"source":"Microsoft","target":"Amazon","type":"1"},{"source":"Microsoft","target":"HTC","type":"licensing"},{"source":"Samsung","target":"Apple","type":"suit"},{"source":"Motorola","target":"Apple","type":"suit"},{"source":"Nokia","target":"Apple","type":"resolved"},{"source":"HTC","target":"Apple","type":"suit"},{"source":"Kodak","target":"Apple","type":"suit"},{"source":"Microsoft","target":"Barnes & Noble","type":"suit"},{"source":"Microsoft","target":"Foxconn","type":"suit"},{"source":"Oracle","target":"Google","type":"suit"},{"source":"Apple","target":"HTC","type":"suit"},{"source":"Microsoft","target":"Inventec","type":"suit"},{"source":"Samsung","target":"Kodak","type":"resolved"},{"source":"LG","target":"Kodak","type":"resolved"},{"source":"RIM","target":"Kodak","type":"suit"},{"source":"Sony","target":"LG","type":"suit"},{"source":"Kodak","target":"LG","type":"resolved"},{"source":"Apple","target":"Nokia","type":"resolved"},{"source":"Qualcomm","target":"Nokia","type":"resolved"},{"source":"Apple","target":"Motorola","type":"suit"},{"source":"Microsoft","target":"Motorola","type":"suit"},{"source":"Motorola","target":"Microsoft","type":"suit"},{"source":"Huawei","target":"ZTE","type":"suit"},{"source":"Ericsson","target":"ZTE","type":"suit"},{"source":"Kodak","target":"Samsung","type":"resolved"},{"source":"Apple","target":"Samsung","type":"suit"},{"source":"Kodak","target":"RIM","type":"suit"},{"source":"Nokia","target":"Qualcomm","type":"suit"}]';

const DemoColumn = (data) => {
    const chartRef = useRef();
    useEffect(() => {
        console.log({ chartRef });
    }, []);
    const config = {
        data: data.data,
        xField: "gene",
        yField: "expression_specificity",
        slider: {
            x: {
                values: [0, 0.1],
            },
        },
    };
    return <Column {...config} ref={chartRef} />;
};

const { Header, Content, Sider } = Layout;

export default function CelltypePage() {
    // Set states
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [loading, setLoading] = useState(false);
    const [decimalPoints, setDecimalPoints] = useState(3);

    const ref = useRef();

    function NetWork(a, b) {
        var c = a.filter(function (v) {
            return (
                b.some((item2) => item2["id"] === v["source"]) &&
                b.some((item2) => item2["id"] === v["target"])
            );
        });
        ref.current.innerHTML = "";
        const suits = c;
        const width = 1800;
        const height = 600;
        const types = [0, 1, 2, 3];
        const nodes = b;
        const links = suits.map((d) => {
            return Object.create(d);
        });

        function linkArc(d) {
            const r = Math.hypot(
                d.target.x - d.source.x,
                d.target.y - d.source.y
            );
            return ` M${d.source.x},${d.source.y}A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;
        }

        const drag = (simulation) => {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        };
        const color = d3.scaleOrdinal(d3.schemePurples[4]);

        const simulation = d3
            .forceSimulation(nodes)
            .force(
                "link",
                d3.forceLink(links).id((d) => d.id)
            )
            .force("charge", d3.forceManyBody().strength(-400))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        const svg = d3
            .select(ref.current)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr(
                "style",
                "max-width: 100%; height: auto; font: 12px sans-serif;"
            );

        svg.append("defs")
            .selectAll("marker")
            .data(types)
            .join("marker")
            .attr("id", (d) => `arrow-${d}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -0.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("fill", "#cf6464")
            .attr("d", "M0,-5L10,0L0,5");

        const link = svg
            .append("g")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke", "#cf6464")
            .attr("marker-end", `url(${new URL(`#arrow-3`, location)})`);

        const node = svg
            .append("g")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .selectAll("g")
            .data(nodes)
            .attr("fill", "#d80f0f")
            .join("g")
            .call(drag(simulation));

        node.append("circle")
            .attr("stroke", (d) => color(d.type))
            .attr("stroke-width", 1.5)
            .attr("r", 6)
            .attr("fill", (d) => color(d.type));

        node.append("text")
            .attr("x", 8)
            .attr("y", "0.31em")
            .text((d) => d.name)
            .clone(true)
            .lower()
            .attr("fill", (d) => color(d.type))
            .attr("stroke", (d) => color(d.type))
            .attr("stroke-width", 3);

        simulation.on("tick", () => {
            link.attr("d", linkArc);
            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

        Object.assign(svg.node(), { scales: { color } });

        const zoom = d3
            .zoom()
            .extent([
                [0, 0],
                [250, 250],
            ])
            .on("zoom", function (event) {
                console.log(event);
                svg.attr("transform", event.transform);
            });
        svg.call(zoom);
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const db_type = searchParams.get("db_type");
        const jump = searchParams.get("jump");

        if (db_type) {
            setSize(db_type);
            let eve = {
                db_type: db_type,
                q: "10",
                fold_change: "0",
                celltype_name: jump,
            };
            onload(eve);
        }
        handleSubmit(); // Submit default key on page load
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
            render: (text) => {
                return text || <NotFound />;
            },
        },
        {
            title: "Severity Score",
            dataIndex: "severity_score_gpt",
            key: "severity_score_gpt",
            render: (text) => {
                return parseFloat(text).toFixed(decimalPoints);
            },
        },
        {
            title: "Q-Value",
            dataIndex: "q",
            key: "q",
            render: (text) => {
                return parseFloat(text).toFixed(decimalPoints);
            },
        },
        {
            title: "Severity Tier",
            dataIndex: "severity_class",
            key: "severity_class",
            render: (text) => {
                if (text === 0) {
                    return <Tag color="green">mild</Tag>;
                } else if (text === 1) {
                    return <Tag color="orange">moderate</Tag>;
                } else if (text === 2) {
                    return <Tag color="red">severe</Tag>;
                } else if (text === 3) {
                    return <Tag color="purple">profound</Tag>;
                } else {
                    return <Tag color="default">NA</Tag>;
                }
            },
        },
    ];

    const columns1 = [
        {
            title: "Gene Name",
            dataIndex: "gene",
            key: "gene",
            width: "30%",
            sorter: (a, b) => a.gene.length - b.gene.length,
        },

        {
            title: "Expression Specificity",
            dataIndex: "expression_specificity",
            key: "expression_specificity",
            sorter: (a, b) =>
                a.expression_specificity - b.expression_specificity,
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return parseFloat(text).toFixed(decimalPoints);
            },
        },
    ];
    const [sliderValues, setSliderValues] = useState({
        db_type: "DescartesHuman",
        q: "0.05",
        fold_change: "1",
        celltype_name: "All",
    });
    const [activeCellType, setActiveCellType] = useState("All");

    const handleSliderChange = (name) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            q: name,
        }));
    };
    const handleSliderChange1 = (name) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            fold_change: name,
        }));
    };
    const handleDecimalChange = (decimalPoints) => {
        setDecimalPoints(decimalPoints);
    };
    const handleSubmit = async (event) => {
        setLoading(true);
        const queryParams = new URLSearchParams(sliderValues).toString();
        const url = `${BASE_API_URL}/api/cell?${queryParams}`;
        console.log("Submitting request to URL:", url);
        try {
            const response = await axios.get(url);
            console.log("Response data:", response.data);

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

        fetch(
            `${BASE_API_URL}/gene1/${sliderValues.celltype_name}/${sliderValues.db_type}`
        )
            .then((res) => res.json())
            .then((results) => {
                debugger;
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
        console.log("Submitting request to URL:", url);
        try {
            const response = await axios.get(url);
            console.log("Response data:", response.data);

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
    console.log("Form is rendered");
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState("DescartesHuman");
    const handleSizeChange = (e) => {
        setSize(e.target.value);
        setSliderValues((prevValues) => ({
            ...prevValues,
            db_type: e.target.value,
        }));
    };
    const getData = (data, info) => {
        console.log(`data from Child2 - ${info.node.key}`);
        setSliderValues((prevValues) => ({
            ...prevValues,
            celltype_name: info.node.key,
        }));
    };
    const download = () => {
        var canvas = document.getElementsByTagName("canvas")[0];
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

    const download1 = () => {
        var svgElement = document.getElementById("svgMain");
        var svgData = new XMLSerializer().serializeToString(svgElement);
        var blob = new Blob([svgData], { type: "image/svg+xml" });
        var url = URL.createObjectURL(blob);
        if (window.navigator.msSaveOrOpenBlob) {
            var imgData = blob;
            var blobObj = new Blob([imgData]);
            window.navigator.msSaveOrOpenBlob(blobObj, "Cell Associations.png");
        } else {
            var oA = document.createElement("a");
            oA.download = "Severity";
            oA.href = url;
            oA.className = "qrcode";
            document.body.appendChild(oA);
            oA.click();
            oA.remove();
        }
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
                    <h1
                        style={{
                            fontSize: "1.1em",
                            fontWeight: "bold",
                            color: "#FFFFFF",
                        }}
                    >
                        Select database
                    </h1>
                    <hr style={{ marginBottom: 7, border: "none" }} />
                    <Radio.Group
                        buttonStyle="solid"
                        value={size}
                        onChange={handleSizeChange}
                    >
                        <Radio.Button
                            style={{ width: 200 }}
                            value="DescartesHuman"
                        >
                            DescartesHuman
                        </Radio.Button>
                        <Radio.Button
                            style={{ width: 200 }}
                            value="HumanCellLandscape"
                        >
                            HumanCellLandscape
                        </Radio.Button>
                    </Radio.Group>
                    <br />
                    <br />
                    <PhenotypeTree onGetData={getData} db_type={size} />
                    <center>
                        <div style={{ textAlign: "left" }}>
                            <hr style={{ marginBottom: 10, border: "none" }} />
                            <InputNumber
                                name="q"
                                style={{
                                    width: "100%",
                                }}
                                defaultValue="0.005"
                                step="0.0005"
                                max="1"
                                min="0.00000001"
                                onChange={handleSliderChange}
                                addonBefore="Q-Value"
                                stringMode
                            />
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
                                    console.log("Button clicked");
                                    handleSubmit(event);
                                }}
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
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: "16px 0",
                        }}
                    >
                        <Breadcrumb.Item href={"/"}>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>CellType</Breadcrumb.Item>
                    </Breadcrumb>
                    <Card
                        style={{
                            width: "100%",
                        }}
                    >
                        <p>
                            Each cell type has been mapped to specific
                            phenotypes and genes, providing insight into the
                            cellular mechanisms underlying rare diseases. This
                            page allows users to search for any cell type and
                            view its associations with phenotypes and genes. The
                            strength of these relationships is displayed using
                            visualizations like bar charts and network graphs.{" "}
                        </p>
                    </Card>
                    <br />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 22,
                                fontWeight: "bold",
                                color: "#6357d3",
                            }}
                        >
                            {activeCellType}
                        </h2>
                        <br />
                        <Tabs
                            type="card"
                            items={new Array(2).fill(null).map((_, i) => {
                                let id = String(i + 1);
                                if (i === 0) {
                                    id = "Phenotype Associations";
                                    return {
                                        label: `${id}`,
                                        key: id,
                                        children: (
                                            <Spin spinning={loading}>
                                                <Button
                                                    style={{
                                                        float: "right",
                                                        width: 50,
                                                    }}
                                                    type="primary"
                                                    icon={<DownloadOutlined />}
                                                    size="small"
                                                    onClick={download1}
                                                />
                                                <br />
                                                <svg id={"svgMain"} ref={ref} />
                                                <Table
                                                    columns={columns}
                                                    expandable={{
                                                        expandedRowRender,
                                                        defaultExpandedRowKeys:
                                                            ["0"],
                                                    }}
                                                    dataSource={data}
                                                    size="small"
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
                                            <Spin spinning={loading}>
                                                <Button
                                                    style={{
                                                        float: "right",
                                                        width: 50,
                                                    }}
                                                    type="primary"
                                                    icon={<DownloadOutlined />}
                                                    size="small"
                                                    onClick={download}
                                                />
                                                <br />
                                                <DemoColumn data={data1} />
                                                <Table
                                                    columns={columns1}
                                                    dataSource={data1}
                                                    size="small"
                                                />
                                            </Spin>
                                        ),
                                    };
                                }
                            })}
                        />
                    </div>
                </Content>
                <CustomFooter />
            </Layout>
        </Layout>
    );
}
