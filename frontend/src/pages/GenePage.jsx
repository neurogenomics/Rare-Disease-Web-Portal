import React, { useState, useRef } from "react";
import {
    Breadcrumb,
    Layout,
    Tabs,
    theme,
    Descriptions,
    Radio,
    Card,
    Collapse,
    InputNumber,
    ConfigProvider,
} from "antd";
import PhenotypeTree from "../components/GeneTree.jsx";
import PhenotypeTableDisease from "../components/GeneTable.jsx";
import PhenotypeTableDisease1 from "../components/GeneTable1.jsx";
import PhenotypeTableDisease2 from "../components/GeneTable2.jsx";
import CustomFooter from "../components/utilities/Footer.jsx";
import NotFound from "../components/utilities/Texts.jsx";
import { LaunchOutlined, SettingsOutlined } from "@mui/icons-material";
import CustomHeader from "../components/utilities/Header.jsx";
import CellAtlasInfo from "../components/info/CellAtlasInfo.jsx";
import CellAtlasSelectionInfo from "../components/info/CellAtlasSelectionInfo.jsx";
import PageIntro from "../components/PageIntro.jsx";
import { urlSetter } from "../scripts/urlHandlers.js";
import ShareButton from "../components/utilities/ShareButton.jsx";

const { Content, Sider } = Layout;

const items = [
    {
        key: "10",
        label: "Comment",
        children: "Root of all terms in the Human Phenotype Ontology.",
    },
];
export default function phenotypePage() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [data, setData] = useState(null);
    const [gene, setGene] = useState(null);
    const [size, setSize] = useState("DescartesHuman");
    const [decimalPoints, setDecimalPoints] = useState(3);
    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const [desItem, setDesItem] = useState(items);
    const handleDecimalChange = (decimalPoints) => {
        setDecimalPoints(decimalPoints);
    };

    // Tour
    const tourRefAtlas = useRef(null);
    const tourRefSearch = useRef(null);
    const tourRefSelect = useRef(null);

    const tourSteps = [
        {
            key: "atlas-search",
            target: () => tourRefAtlas.current,
        },
        {
            key: "gene-search",
            target: () => tourRefSearch.current,
        },
        {
            key: "gene-select",
            target: () => tourRefSelect.current,
        },
    ];

    const parseNCBIGeneID = (id, with_link = true) => {
        const prefixString = "NCBIGene:";

        // Check for valid NCBI Gene ID
        if (!id.startsWith(prefixString)) {
            return <NotFound />;
        }

        const geneID = id.substring(prefixString.length);

        if (with_link) {
            return (
                <a
                    href={`https://www.ncbi.nlm.nih.gov/gene?Cmd=DetailsSearch&Term=${geneID}`}
                    target="_blank"
                >
                    {geneID}{" "}
                    <LaunchOutlined
                        className="align-super"
                        style={{ fontSize: "10px", color: "gray" }}
                    />
                </a>
            );
        }
    };

    const getData = (data, info) => {
        if (!info.node.dataRef.id.includes("NCBIGene")) {
            return false;
        }

        setData(info.node.dataRef.id);
        urlSetter({ jump: info.node.dataRef.id.substring(9) });
        let itemsTemp = [];
        itemsTemp.push({
            label: "NCBI Gene ID",
            key: "1",
            children: parseNCBIGeneID(info.node.dataRef.id),
        });

        fetch(
            `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${info.node.dataRef.id.substring(
                9
            )}&retmode=json`
        )
            .then((res) => res.json())
            .then(async (result) => {
                for (const resultKey in result.result) {
                    if (resultKey === info.node.dataRef.id.substring(9)) {
                        for (const resultKey1 in result.result[resultKey]) {
                            if (resultKey1 === "name") {
                                setGene(result.result[resultKey][resultKey1]);
                            }
                            if (resultKey1 === "maplocation") {
                                itemsTemp.push({
                                    label: "Gene Location",
                                    key: "3",
                                    children:
                                        result.result[resultKey][resultKey1],
                                });
                            }
                            if (resultKey1 === "otheraliases") {
                                itemsTemp.push({
                                    label: "Synonyms",
                                    key: "3",
                                    children: result.result[resultKey][
                                        resultKey1
                                    ] || <NotFound />,
                                });
                            }
                            if (resultKey1 === "summary") {
                                itemsTemp.push({
                                    label: "Definition",
                                    key: "2",
                                    children: result.result[resultKey][
                                        resultKey1
                                    ] || <NotFound />,
                                });
                            }
                        }
                    }
                }
                setDesItem(itemsTemp);
                return false;
            });
        setDesItem(items);
        return false;
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

    return (
        <>
            <CustomHeader activePageKey="gene" />
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
                                        buttonSolidCheckedHoverBg: "#8a5cf2",
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
                        tourRefs={[tourRefSearch, tourRefSelect]}
                        onGetData={getData}
                    />
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
                            minWidth: "50rem",
                        }}
                    >
                        <Breadcrumb
                            style={{
                                margin: "16px 0",
                            }}
                        >
                            <Breadcrumb.Item href={"/"}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Search by Gene</Breadcrumb.Item>
                        </Breadcrumb>
                        <Card
                            style={{
                                width: "100%",
                            }}
                        >
                            <p>
                                Genes are linked to cell types and phenotypes,
                                revealing their role in rare diseases. This page
                                provides visualizations of gene-cell type,
                                gene-disease, and gene-phenotype relationships.
                            </p>
                        </Card>
                        <br />
                        {gene != null ? (
                            <div
                                style={{
                                    padding: 24,
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
                                        {gene}
                                    </h2>
                                    <ShareButton />
                                </div>
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
                                    type="card"
                                    items={new Array(3)
                                        .fill(null)
                                        .map((_, i) => {
                                            let id = String(i + 1);
                                            if (i === 0) {
                                                id = "Cell Associations";
                                                return {
                                                    label: `${id}`,
                                                    key: id,
                                                    children: (
                                                        <PhenotypeTableDisease2
                                                            hpid={gene}
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
                                                        <PhenotypeTableDisease1
                                                            hpid={data}
                                                        />
                                                    ),
                                                };
                                            }
                                            if (i === 2) {
                                                id = "HPO Associations";
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
                                        })}
                                />
                            </div>
                        ) : (
                            <PageIntro
                                description="Search and select a gene from the list on the left to explore its relationships with different cell types, diseases, and phenotypes."
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
