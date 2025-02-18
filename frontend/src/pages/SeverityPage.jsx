import React, { useEffect, useRef, useState } from "react";
import SeveritySlider from "../components/SeveritySlider.jsx";
import SeveritySlider1 from "../components/SeveritySlider1.jsx";
import SeverityNetWork from "../components/SeverityNetWork.jsx";
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
    Alert,
    Checkbox,
    Card,
    InputNumber,
    Collapse,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SettingsOutlined } from "@mui/icons-material";
import { BASE_API_URL, ONTOLOGY_API_URL } from "../../config.js";
import NotFound from "../components/utilities/Texts.jsx";
import SeverityTierHover from "../components/info/SeverityTierHover.jsx";
import SeverityTierInfo from "../components/info/SeverityTierInfo.jsx";
import SeverityScoreInfo from "../components/info/SeverityScoreInfo.jsx";
import SeverityScoreHover from "../components/info/SeverityScoreHover.jsx";
import DownloadButton from "../components/utilities/Download.jsx";
import formatText from "../scripts/formatText.js";
import CellAtlasInfo from "../components/info/CellAtlasInfo.jsx";
import CellAtlasSelectionInfo from "../components/info/CellAtlasSelectionInfo.jsx";
import { HPOTextTooltip } from "../components/info/TextTooltips.jsx";
import PageIntro from "../components/PageIntro.jsx";

const { Header, Content, Sider } = Layout;

export default function SeverityPage() {
    const [data, setData] = useState([]);

    const [dataSet, setDataSet] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [checkboxAlert, setCheckboxAlert] = useState(false);
    const [decimalPoints, setDecimalPoints] = useState(3);

    // Tour
    const tourRefSeverity = useRef(null);
    const tourRefOccurence = useRef(null);
    const tourRefCellAssociation = useRef(null);
    const tourRefSubmit = useRef(null);

    const tourSteps = [
        {
            key: "severity-tier",
            target: () => tourRefSeverity.current,
        },
        {
            key: "severity-occurence",
            target: () => tourRefOccurence.current,
        },
        {
            key: "severity-cell-association",
            target: () => tourRefCellAssociation.current,
        },
        {
            key: "severity-submit",
            target: () => tourRefSubmit.current,
        },
    ];

    useEffect(() => {
        if (
            tableParams.pagination?.current !== 1 ||
            tableParams.pagination?.pageSize !== 10
        ) {
            // Don't submit on first page load
            handleSubmit();
        }
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    const handleTableChange = async (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
    };
    const handleDecimalChange = (decimalPoints) => {
        setDecimalPoints(decimalPoints);
    };
    const expandedRowRender = (record, index, indent, expanded) => {
        const columns = [
            {
                title: "Clinical Characteristic",
                dataIndex: "date",
                key: "date",
            },
            {
                title: "Frequency",
                dataIndex: "upgradeNum",
                key: "upgradeNum",
            },
            {
                title: "Justification",
                dataIndex: "name",
                key: "name",
            },
        ];
        const data1 = [];

        data1.push({
            key: "2",
            date: "Intellectual Disability",
            name: record.intellectual_disability_justification,
            upgradeNum:
                record.intellectual_disability === 0
                    ? "Never"
                    : record.intellectual_disability === 1
                    ? "Rarely"
                    : record.intellectual_disability === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "3",
            date: "Death",
            name: record.death_justification,
            upgradeNum:
                record.death === 0
                    ? "Never"
                    : record.death === 1
                    ? "Rarely"
                    : record.death === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "4",
            date: "Impaired Mobility",
            name: record.impaired_mobility_justification,
            upgradeNum:
                record.impaired_mobility === 0
                    ? "Never"
                    : record.impaired_mobility === 1
                    ? "Rarely"
                    : record.impaired_mobility === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "5",
            date: "Physical Malformations",
            name: record.physical_malformations_justification,
            upgradeNum:
                record.physical_malformations === 0
                    ? "Never"
                    : record.physical_malformations === 1
                    ? "Rarely"
                    : record.physical_malformations === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "6",
            date: "Blindness",
            name: record.blindness_justification,
            upgradeNum:
                record.blindness === 0
                    ? "Never"
                    : record.blindness === 1
                    ? "Rarely"
                    : record.blindness === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "7",
            date: "Sensory Impairments",
            name: record.sensory_impairments_justification,
            upgradeNum:
                record.sensory_impairments === 0
                    ? "Never"
                    : record.sensory_impairments === 1
                    ? "Rarely"
                    : record.sensory_impairments === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "8",
            date: "Immunodeficiency",
            name: record.immunodeficiency_justification,
            upgradeNum:
                record.immunodeficiency === 0
                    ? "Never"
                    : record.immunodeficiency === 1
                    ? "Rarely"
                    : record.immunodeficiency === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "9",
            date: "Cancer",
            name: record.cancer_justification,
            upgradeNum:
                record.cancer === 0
                    ? "Never"
                    : record.cancer === 1
                    ? "Rarely"
                    : record.cancer === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "10",
            date: "Reduced Fertility",
            name: record.reduced_fertility_justification,
            upgradeNum:
                record.reduced_fertility === 0
                    ? "Never"
                    : record.reduced_fertility === 1
                    ? "Rarely"
                    : record.reduced_fertility === 2
                    ? "Often"
                    : "Always",
        });
        data1.push({
            key: "11",
            date: "Congenital Onset",
            name: record.congenital_onset_justification,
            upgradeNum:
                record.congenital_onset === 0
                    ? "Never"
                    : record.congenital_onset === 1
                    ? "Rarely"
                    : record.congenital_onset === 2
                    ? "Often"
                    : "Always",
        });

        return (
            <>
                <Alert
                    message="Definition:"
                    description={record.definition || <NotFound />}
                    type="info"
                />
                <br />
                <Table
                    columns={columns}
                    dataSource={data1}
                    pagination={false}
                />
            </>
        );
    };
    const columns = [
        {
            title: "HPO ID",
            dataIndex: "hpo_id",
            key: "hpo_id",
            render: (text) => {
                return (
                    <a
                        style={{ textDecoration: "underline" }}
                        target={"_blank"}
                        href={`/phenotype?jump=${text}`}
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
        },
        {
            title: (
                <>
                    Severity Score <SeverityScoreInfo />
                </>
            ),
            dataIndex: "severity_score_gpt",
            key: "severity_score_gpt",
            render: (text) => {
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
            title: "Most Associated Cell Type",
            dataIndex: "celltype_name",
            key: "celltype_name",
            render: (text) =>
                text ? formatText(text) : <i className="text-gray-700">None</i>,
        },
        {
            title: (
                <>
                    Cell Atlas <CellAtlasInfo columnMode={true} />
                </>
            ),
            dataIndex: "celltype_database",
            key: "celltype_database",
            width: 170,
            render: (text) => (
                <CellAtlasSelectionInfo atlasName={text} columnMode={true} />
            ),
        },
    ];
    const [sliderValues, setSliderValues] = useState({
        intellectual_disability: [0, 3],
        death: [0, 3],
        impaired_mobility: [0, 3],
        physical_malformations: [0, 3],
        blindness: [0, 3],
        sensory_impairments: [0, 3],
        immunodeficiency: [0, 3],
        cancer: [0, 3],
        reduced_fertility: [0, 3],
        congenital_onset: [0, 3],
        severity_class: [0, 3],
        with1: true,
        without: true,
    });

    const handleSliderChange = (name, value) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            [name.toLowerCase().replace(/ /g, "_")]: value,
        }));
    };

    const onChange = (e) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            with1: e.target.checked,
        }));
    };
    const onChange1 = (e) => {
        setSliderValues((prevValues) => ({
            ...prevValues,
            without: e.target.checked,
        }));
    };
    const handleSubmit = async () => {
        // Check if neither checkboxes are checked
        if (!sliderValues.with1 && !sliderValues.without) {
            setCheckboxAlert(true);
            return;
        }

        setCheckboxAlert(false);
        setLoading(true);
        const queryParams = new URLSearchParams(sliderValues).toString();
        const url = `${BASE_API_URL}/api/severity?${queryParams}&pageSize=${tableParams.pagination?.pageSize}&current=${tableParams.pagination?.current}`;
        try {
            const response = await axios.get(url);

            // Fetch definitions for each item
            const dataWithDefinitions = await Promise.all(
                response.data.map(async (item, index) => {
                    if (index < 10) {
                        const definitionResponse = await axios.get(
                            `${ONTOLOGY_API_URL}/api/hp/terms/${item.hpo_id}`
                        );
                        return {
                            ...item,
                            definition: definitionResponse.data.definition,
                            key: item.id,
                        };
                    }
                    return {
                        ...item,
                        key: item.id,
                    };
                })
            );
            setLoading(false);
            setData(dataWithDefinitions);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: dataWithDefinitions[0]["total"],
                },
            });
            let list = [];
            for (let i = 0; i < dataWithDefinitions.length; i++) {
                if (i === 10) {
                    break;
                }
                let itemData = [];
                for (let keyx in dataWithDefinitions[i]) {
                    if (
                        ![
                            "id",
                            "_id",
                            "celltype_name",
                            "q",
                            "celltype_database",
                            "definition",
                            "key",
                            "hpo_id",
                            "hpo_name",
                            "severity_class",
                            "severity_score_gpt",
                            "AssociatedName",
                            "Associated",
                            "total",
                        ].includes(keyx) &&
                        keyx.indexOf("justification") < 0
                    ) {
                        itemData.push({
                            x: keyx,
                            y: parseInt(dataWithDefinitions[i][keyx]),
                        });
                    }
                }
                let item = {
                    id: dataWithDefinitions[i].hpo_name,
                    data: itemData,
                };
                list.push(item);
            }
            setDataSet(list);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
            <CustomHeader activePageKey="severity" />
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
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <div className="demo-logo-vertical" />
                    <form onSubmit={handleSubmit}>
                        <center>
                            <div>
                                <p className="text-xl font-semibold text-left mb-2 ml-5">
                                    Filters
                                </p>
                                <div ref={tourRefSeverity}>
                                <SeveritySlider1
                                    name={<>Severity Class</>}
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "severity_class",
                                            value
                                        )}
                                />
                                </div>
                                <div ref={tourRefOccurence}>
                                <SeveritySlider
                                    name="Intellectual Disability"
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "Intellectual Disability",
                                            value
                                        )
                                    }
                                />
                                <SeveritySlider
                                    name="Death"
                                    onChange={(value) =>
                                        handleSliderChange("Death", value)
                                    }
                                />
                                <SeveritySlider
                                    name="Impaired Mobility"
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "Impaired Mobility",
                                            value
                                        )
                                    }
                                />
                                <SeveritySlider
                                    name="Physical Malformations"
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "Physical Malformations",
                                            value
                                        )
                                    }
                                />
                                <SeveritySlider
                                    name="Blindness"
                                    onChange={(value) =>
                                        handleSliderChange("Blindness", value)
                                    }
                                />
                                <SeveritySlider
                                    name="Sensory Impairments"
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "Sensory Impairments",
                                            value
                                        )
                                    }
                                />
                                <SeveritySlider
                                    name="Immunodeficiency"
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "Immunodeficiency",
                                            value
                                        )
                                    }
                                />
                                <SeveritySlider
                                    name="Cancer"
                                    onChange={(value) =>
                                        handleSliderChange("Cancer", value)
                                    }
                                />
                                <SeveritySlider
                                    name="Reduced Fertility"
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "Reduced Fertility",
                                            value
                                        )
                                    }
                                />
                                <SeveritySlider
                                    name="Congenital Onset"
                                    onChange={(value) =>
                                        handleSliderChange(
                                            "Congenital Onset",
                                            value
                                        )
                                    }
                                />
                                </div>
                            </div>
                            <div style={{ margin: 29, textAlign: "left" }}>
                                <div ref={tourRefCellAssociation} className="mb-4">
                                {checkboxAlert && (
                                    <Alert
                                        className="mb-5"
                                        message="Please select atleast one cell type condition."
                                        type="error"
                                        showIcon
                                    />
                                )}
                                <Checkbox
                                    style={{
                                        marginBottom: 10,
                                        transform: "scale(1.2)",
                                        fontWeight: 400,
                                        marginLeft: 25,
                                    }}
                                    onChange={onChange}
                                    checked={sliderValues.with1}
                                >
                                    With Associated Cell Type
                                </Checkbox>
                                <Checkbox
                                    style={{
                                        transform: "scale(1.2)",
                                        fontWeight: 400,
                                        marginLeft: 27,
                                    }}
                                    onChange={onChange1}
                                    checked={sliderValues.without}
                                >
                                    Without Associated Cell Type
                                </Checkbox>
                                </div>
                            </div>
                            <div style={{ margin: 29 }}>
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
                                Search by Severity
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <Card
                            style={{
                                width: "100%",
                            }}
                        >
                            <p>
                                Each phenotype in the{" "}
                                <HPOTextTooltip type="full" /> has had its
                                severity scored. This was done based on a
                                scoring system derived by clinicians, such that
                                phenotypes which cause intellectual disability
                                and death are profoundly severe, while those
                                which just reduce fertility are mild. Our
                                annotation of this was described in this
                                preprint. Justifications for why each phenotype
                                is associated with a severity modifier, can be
                                seen by expanding the entries in the table
                                below.
                            </p>
                        </Card>
                        <br />
                        {data.length > 0 ? (
                        <div
                            style={{
                                padding: 24,
                                paddingBottom: 0,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                            className="relative"
                        >
                            <div className="absolute right-6">
                                <DownloadButton elementId="severity-network" />
                            </div>
                            <div id="severity-network">
                                <SeverityNetWork data1={dataSet} />
                            </div>

                            <Spin spinning={loading}>
                                {" "}
                                <Table
                                    pagination={tableParams.pagination}
                                    columns={columns}
                                    expandable={{
                                        expandedRowRender,
                                        defaultExpandedRowKeys: ["0"],
                                    }}
                                    dataSource={data}
                                    size="small"
                                    onChange={handleTableChange}
                                    showSorterTooltip={true}
                                />
                            </Spin>
                        </div>) : 
                        <PageIntro description="Search phenotypes by severity tier and frequency of specific clinical characteristics." tourSteps={tourSteps}/>}
                    </Content>
                    <CustomFooter />
                </Layout>
            </Layout>
        </>
    );
}
