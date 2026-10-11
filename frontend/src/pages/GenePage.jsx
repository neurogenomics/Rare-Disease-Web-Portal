import { portalFetch } from "../lib/portalAPI.js";
import SnapshotScopeNotice from "../components/SnapshotScopeNotice.jsx";
import EvidenceEntry from "../components/EvidenceEntry.jsx";
import { useEffect, useState, useRef } from "react";
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
    Alert,
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
import { urlParser, urlSetter } from "../scripts/urlHandlers.js";
import ShareButton from "../components/utilities/ShareButton.jsx";

const { Content } = Layout;

const items = [
    {
        key: "10",
        label: "Comment",
        children: "Root of all terms in the Human Phenotype Ontology.",
    },
];
export default function GenePage() {
    // URL Parsing
        const { url_db_type } = urlParser("phenotype");

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [data, setData] = useState(null);
    const [gene, setGene] = useState(null);
    const [sourceError, setSourceError] = useState(null);
    const [size, setSize] = useState(url_db_type || "DescartesHuman");
    const [decimalPoints, setDecimalPoints] = useState(3);
    useEffect(() => {
        document.title = "Genes · Rare Disease Celltyping Portal";
    }, []);
    const handleSizeChange = (e) => {
            const newSize = e.target.value;
            setSize(newSize);
            if (data) {
                urlSetter({ jump: data.substring(9), db_type: newSize });
            }
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
        if (!info.node.dataRef.id?.startsWith("NCBIGene:")) {
            return false;
        }

        setData(info.node.dataRef.id);
        setGene(info.node.dataRef.name || info.node.dataRef.title || info.node.dataRef.id);
        setSourceError(null);
        urlSetter({ jump: info.node.dataRef.id.substring(9), db_type: size });
        let itemsTemp = [];
        itemsTemp.push({
            label: "NCBI Gene ID",
            key: "1",
            children: parseNCBIGeneID(info.node.dataRef.id),
        });

        portalFetch(
            `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${info.node.dataRef.id.substring(
                9
            )}&retmode=json`
        )
            .then((res) => {
                if (!res.ok) throw new Error("Gene definition source unavailable");
                return res.json();
            })
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
                                    key: "gene-location",
                                    children:
                                        result.result[resultKey][resultKey1],
                                });
                            }
                            if (resultKey1 === "otheraliases") {
                                itemsTemp.push({
                                    label: "Synonyms",
                                    key: "synonyms",
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
            }).catch(() => setSourceError("The gene definition source could not be loaded. Definition and aliases remain unknown; recorded gene associations can still be explored."));
        setDesItem(items);
        return false;
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

    return (
        <>
            <CustomHeader activePageKey="gene" />
            <Layout className="portal-page portal-explorer">
                <aside className="portal-sidebar" aria-label="Search and filters">
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
                                        buttonSolidCheckedHoverBg: "#4096ff",
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
                        tourRefs={[tourRefSearch, tourRefSelect]}
                        onGetData={getData}
                    />
                    <Collapse
                        items={advancedSettingsMain}
                        size="small"
                        style={{ background: colorBgContainer }}
                    />
                </aside>
                <Layout className="portal-content-layout">
                    <Content className="portal-content">
                        <Breadcrumb
                            style={{
                                margin: "16px 0",
                            }}
                        >
                            <Breadcrumb.Item href={"/"}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Search by Gene</Breadcrumb.Item>
                        </Breadcrumb>
                        <EvidenceEntry />
                        <SnapshotScopeNotice />
                        {sourceError && <Alert className="mb-4" type="warning" showIcon message="Source evidence unavailable" description={sourceError} />}
                        <Card
                            style={{
                                width: "100%",
                            }}
                        >
                            <h1>Genes</h1>
                            <p>
                                Select a gene to explore source-associated phenotypes and diseases,
                                and its expression specificity in the selected cell atlas. Follow
                                a phenotype or cell to retain that context while reviewing variants
                                and treatment evidence. Expression and enrichment alone do not
                                establish an allele effect, cellular causality or clinical efficacy.
                            </p>
                        </Card>
                        <br />
                        {gene != null ? (
                            <div
                                className="portal-results"
                                style={{
                                    padding: 24,
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
                                        {gene}
                                    </h2>
                                    <ShareButton />
                                </div>
                                <Descriptions
                                    column={1}
                                    size={"small"}
                                    labelStyle={{
                                        color: "#262626",
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
