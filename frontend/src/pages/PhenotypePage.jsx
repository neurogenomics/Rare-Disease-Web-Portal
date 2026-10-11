import { portalFetch, USE_PORTAL_SNAPSHOTS } from "../lib/portalAPI.js";
import SnapshotScopeNotice from "../components/SnapshotScopeNotice.jsx";
import EvidenceEntry from "../components/EvidenceEntry.jsx";
import { useEffect, useRef, useState } from "react";
import {
    Breadcrumb,
    Layout,
    Tabs,
    theme,
    ConfigProvider,
    Descriptions,
    Radio,
    Card,
    Collapse,
    InputNumber,
    Alert,
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
import PageIntro from "../components/PageIntro.jsx";
import { HPOTextTooltip } from "../components/info/TextTooltips.jsx";
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
const onChange = (key) => {
    console.log(key);
};
export default function PhenotypePage() {
    // URL Parsing
    const { jump, url_db_type } = urlParser("phenotype");

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [data, setData] = useState(null);
    const [dataRef, setDataRef] = useState(null);
    const [sourceError, setSourceError] = useState(null);
    const [size, setSize] = useState(url_db_type || "DescartesHuman");

    const [desItem, setDesItem] = useState(items);
    const [decimalPoints, setDecimalPoints] = useState(3);

    useEffect(() => {
        document.title = "Phenotypes · Rare Disease Celltyping Portal";
    }, []);

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
            key: "phenotype-search",
            target: () => tourRefSearch.current,
        },
        {
            key: "phenotype-select",
            target: () => tourRefSelect.current,
        },
    ];

    const handleSizeChange = async (e) => {
        const newSize = e.target.value;
        setSize(newSize);
        if (data) {
            urlSetter({ jump: data, db_type: newSize });
            await onload(data);
        }
    };
    
    const handleDecimalChange = (decimalPoints) => {
        setDecimalPoints(decimalPoints);
    };

    const fetchData = async (key) => {
        let itemsTemp = [];
        itemsTemp.push({
            label: "Phenotype ID",
            key: "hpo-id",
            children: <LinkHPOID hpoId={key} />,
        });

        const result = await portalFetch(
            `${ONTOLOGY_API_URL}/api/hp/terms/${key}`
        ).then((res) => {
            if (!res.ok) throw new Error("Phenotype definition source unavailable");
            return res.json();
        });

        itemsTemp.push({
            label: "Definition",
            key: "definition",
            children: result.definition || (USE_PORTAL_SNAPSHOTS ? "Not included in this snapshot" : <NotFound />),
        });
        itemsTemp.push({
            label: "Synonyms",
            key: "synonyms",
            children: result.synonyms?.join(" - ") || <NotFound />,
        });
        itemsTemp.push({
            label: "Comment",
            key: "comment",
            children: result.comment || (USE_PORTAL_SNAPSHOTS ? "Not included in this snapshot" : <NotFound />),
        });
        itemsTemp.push({
            label: "Cross References",
            key: "cross-references",
            children: result.xrefs?.join(", ") || (USE_PORTAL_SNAPSHOTS ? "Not included in this snapshot" : <NotFound />),
        });

        try {
            const result1 = await portalFetch(
                `${BASE_API_URL}/api/hpo-definitionNew/${key}`
            ).then((res) => {
                if (!res.ok) throw new Error("Severity source unavailable");
                return res.json();
            });
            if (!result1[0]) throw new Error("Severity annotation not present in this source");
            itemsTemp.push({
                label: (
                    <>
                        Severity Score <SeverityScoreInfo />
                    </>
                ),
                key: "5",
                children: (
                    <SeverityScoreHover
                        score={result1[0].severity_score_gpt}
                        decimalPoints={decimalPoints}
                        showPercentile={true}
                    />
                ) || <NotFound />,
            });
            itemsTemp.push({
                label: (
                    <>
                        Severity Class <SeverityTierInfo />
                    </>
                ),
                key: "6",
                children: (
                    <SeverityTierHover tier={result1[0].severity_class} />
                ) || <NotFound />,
            });
        } catch (e) {
            setSourceError("The severity source has no usable annotation for this phenotype. Severity remains unknown.");
        }

        return { itemsTemp, result };
    };

    const getData = async (data, info) => {
        setDataRef(info.node.dataRef.title);
        setData(info.node.dataRef.key);
        urlSetter({ jump: data, db_type: size });

        setSourceError(null);
        try {
            const { itemsTemp } = await fetchData(info.node.dataRef.key);
            setDesItem(itemsTemp);
        } catch {
            setDesItem([]);
            setSourceError("The phenotype definition source could not be loaded. Follow the evidence snapshots or retry this selection.");
        }
        return false;
    };

    const onload = async (data) => {
        setData(data);
        setSourceError(null);
        try {
            const { itemsTemp, result } = await fetchData(data);
            setDataRef(result.name);
            setDesItem(itemsTemp);
        } catch {
            setDataRef(data);
            setDesItem([]);
            setSourceError("The phenotype definition source could not be loaded. Follow the evidence snapshots or retry this selection.");
        }
        return false;
    };

    useEffect(() => {
        if (jump) {
            onload(jump);
        }
        // The router remounts this explorer when the URL changes; selection stays explicit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            <CustomHeader activePageKey="phenotype" />
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
                        onGetData={getData}
                        dbType={size}
                        tourRefs={[tourRefSearch, tourRefSelect]}
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
                            <Breadcrumb.Item>
                                Search by Phenotype
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <EvidenceEntry />
                        <SnapshotScopeNotice />
                        {sourceError && <Alert className="mb-4" type="warning" showIcon message="Source evidence unavailable" description={sourceError} />}
                        <Card
                            style={{
                                width: "100%",
                            }}
                        >
                            <h1>Phenotypes</h1>
                            <p>
                                Select a term in the <HPOTextTooltip type="full" /> to explore
                                source-associated genes and diseases, and signed statistical
                                associations with cells in the selected atlas. These relationships
                                nominate research contexts; they do not establish phenotype causality
                                or treatment response. Continue to the evidence layers to inspect
                                variants, endpoint mappings and therapeutic requirements.
                            </p>
                        </Card>
                        <br />

                        {data ? (
                            <div
                                className="portal-results"
                                style={{
                                    padding: 24,
                                    minHeight: 560,
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
                                        {dataRef != null ? dataRef : "All"}
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
                                    onChange={onChange}
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
                                                            hpid={data}
                                                            hpname={dataRef}
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
                        ) : (
                            <PageIntro
                                description="Explore and select a phenotype from the tree on the left to explore its relationships with different cell types, diseases, and genes."
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
