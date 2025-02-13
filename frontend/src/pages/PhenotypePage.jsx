import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    Layout,
    Tabs,
    theme,
    Badge,
    Descriptions,
    Radio,
    Card,
    Collapse,
    InputNumber,
} from "antd";
import PhenotypeTree from "../components/PhenotypeTree.jsx";
import PhenotypeTableDisease from "../components/PhenotypeTableDisease.jsx";
import PhenotypeTableDisease1 from "../components/PhenotypeTableDisease1.jsx";
import PhenotypeTableDisease2 from "../components/PhenotypeTableDisease2.jsx";
import { BASE_API_URL, ONTOLOGY_API_URL } from "../../config.js";
import CustomHeader from "../components/utilities/Header.jsx";
import CustomFooter from "../components/utilities/Footer.jsx";
import NotFound from "../components/utilities/Texts.jsx";
import { SettingsOutlined } from "@mui/icons-material";
import SeverityTierHover from "../components/info/SeverityTierHover.jsx";
import SeverityTierInfo from "../components/info/SeverityTierInfo.jsx";
import SeverityScoreInfo from "../components/info/SeverityScoreInfo.jsx";
import SeverityScoreHover from "../components/info/SeverityScoreHover.jsx";
import LinkHPOID from "../components/link/LinkHPOID.jsx";
import CellAtlasInfo from "../components/info/CellAtlasInfo.jsx";
import CellAtlasSelectionInfo from "../components/info/CellAtlasSelectionInfo.jsx";

const { Header, Content, Sider } = Layout;

const items = [
    {
        key: "10",
        label: "Comment",
        children: "Root of all terms in the Human Phenotype Ontology.",
    },
];
const onChange = (key) => {
    console.log(key);
};
export default function phenotypePage() {
    const searchParams = new URLSearchParams(window.location.search);
    const jump = searchParams.get("jump");
    const url_db_type = searchParams.get("db_type");

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [data, setData] = useState(null);
    const [dataRef, setDataRef] = useState(null);
    const [size, setSize] = useState(url_db_type || "DescartesHuman");

    const [desItem, setDesItem] = useState(items);
    const [decimalPoints, setDecimalPoints] = useState(3);

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const handleDecimalChange = (decimalPoints) => {
        setDecimalPoints(decimalPoints);

        // Update severity score
        setDesItem((prev) => {
            return prev.map((item) => {
                if (
                    item.key === "5" &&
                    typeof !isNaN(parseFloat(item.children))
                ) {
                    return {
                        ...item,
                        children: parseFloat(item.children).toFixed(
                            decimalPoints
                        ),
                    };
                }
                return item;
            });
        });
    };

    const fetchData = async (key) => {
        let itemsTemp = [];
        itemsTemp.push({
            label: "Phenotype ID",
            key: "1",
            children: <LinkHPOID hpoId={key} />,
        });

        const result = await fetch(`${ONTOLOGY_API_URL}/api/hp/terms/${key}`).then((res) => res.json());

        itemsTemp.push({
            label: "Definition",
            key: "1",
            children: result.definition || <NotFound />,
        });
        itemsTemp.push({
            label: "Synonyms",
            key: "3",
            children: result.synonyms.join(" - ") || <NotFound />,
        });
        itemsTemp.push({
            label: "Comment",
            key: "2",
            children: result.comment || <NotFound />,
        });
        itemsTemp.push({
            label: "Cross References",
            key: "4",
            children: result.xrefs.join(", ") || <NotFound />,
        });

        try {
            const result1 = await fetch(`${BASE_API_URL}/api/hpo-definitionNew/${key}`).then((res) => res.json());
            itemsTemp.push({
                label: (
                    <>
                        Severity Score <SeverityScoreInfo />
                    </>
                ),
                key: "5",
                children: <SeverityScoreHover score={result1[0].severity_score_gpt} decimalPoints={decimalPoints} /> || <NotFound />,
            });
            itemsTemp.push({
                label: (
                    <>
                        Severity Class <SeverityTierInfo />
                    </>
                ),
                key: "6",
                children: <SeverityTierHover tier={result1[0].severity_class} /> || <NotFound />,
            });
        } catch (e) {
            console.log("error", e);
        }

        return { itemsTemp, result };
    };

    const getData = async (data, info) => {
        setDataRef(info.node.dataRef.title);
        setData(info.node.dataRef.key);

        const { itemsTemp } = await fetchData(info.node.dataRef.key);
        setDesItem(itemsTemp);
        return false;
    };

    const onload = async (data) => {
        setData(data);

        const { itemsTemp, result } = await fetchData(data);
        setDataRef(result.name);
        setDesItem(itemsTemp);
        return false;
    };

    useEffect(() => {
        if (jump) {
            onload(jump);
        }
    }, []);

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

    return (
        <>
            <CustomHeader activePageKey="phenotype" />
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
                    <div className="demo-logo-vertical" />
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
                    <br />
                    <br />
                    <PhenotypeTree onGetData={getData} dbType={size} />
                    <Collapse
                        items={advancedSettingsMain}
                        size="small"
                        style={{ background: colorBgContainer }}
                    />
                </Sider>
                <Layout>
                    <Content
                        style={{
                            margin: "0 16px",
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: "16px 0",
                            }}
                        >
                            <Breadcrumb.Item href={"/"}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Search by Phenotype
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <Card
                            style={{
                                width: "100%",
                            }}
                        >
                            <p>
                                Each phenotype in the HPO is linked to specific
                                cell types and genes, allowing researchers to
                                explore the underlying biological mechanisms.
                                The relationships between phenotypes and cell
                                types are based on statistical significance,
                                with stronger associations highlighted. This
                                page enables users to search for any phenotype
                                and explore its corresponding data, such as
                                associated genes and cell types, using dynamic
                                visualizations like network graphs and bar
                                charts.
                            </p>
                        </Card>
                        <br />

                        <div
                            style={{
                                padding: 24,
                                minHeight: 560,
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
                                {dataRef != null ? dataRef : "All"}
                            </h2>
                            <Descriptions
                                column={1}
                                size={"small"}
                                labelStyle={{
                                    color: "#0f172a",
                                    width: "200px",
                                }}
                                style={{
                                    margin: "16px 0",
                                }}
                                bordered
                                items={desItem}
                            />

                            <Tabs
                                onChange={onChange}
                                type="card"
                                items={new Array(3).fill(null).map((_, i) => {
                                    let id = String(i + 1);
                                    if (i === 0) {
                                        id = "Cell Associations";
                                        return {
                                            label: `${id}`,
                                            key: id,
                                            children: (
                                                <PhenotypeTableDisease2
                                                    hpid={data}
                                                    dbType={size}
                                                    decimalPoints={
                                                        decimalPoints
                                                    }
                                                />
                                            ),
                                        };
                                    }
                                    if (i === 1) {
                                        id = "Disease Associations";
                                        return {
                                            label: `${id}`,
                                            key: id,
                                            children: (
                                                <PhenotypeTableDisease
                                                    hpid={data}
                                                />
                                            ),
                                        };
                                    }
                                    if (i === 2) {
                                        id = "Gene Associations";
                                        return {
                                            label: `${id}`,
                                            key: id,
                                            children: (
                                                <PhenotypeTableDisease1
                                                    hpid={data}
                                                />
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
        </>
    );
}
