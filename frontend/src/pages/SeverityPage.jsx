import React, { useEffect, useRef, useState } from "react";
import SeveritySlider from "../components/SeveritySlider.jsx";
import SeveritySlider1 from "../components/SeveritySlider1.jsx";
import SeverityNetWork from "../components/SeverityNetWork.jsx";
import axios from "axios";
import {
    Breadcrumb,
    Layout,
    theme,
    Badge,
    Dropdown,
    Space,
    Table,
    Spin,
    Button,
    Input,
    Tooltip,
    Alert,
    Checkbox,
    Tag,
    Card,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { FormControlLabel } from "@mui/material";
import { BASE_API_URL, ONTOLOGY_API_URL } from "../../config.js";

const { Header, Content, Footer, Sider } = Layout;

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

    useEffect(() => {
        handleSubmit();
    }, [tableParams.pagination?.current]);

    const handleTableChange = async (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
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
            date: "IntellectualDisability",
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
            date: "ImpairedMobility",
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
            date: "PhysicalMalformations",
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
            date: "SensoryImpairments",
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
            date: "ReducedFertility",
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
            date: "CongenitalOnset",
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
                    description={record.definition}
                    type="info"
                />
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
            title: "Severity Score",
            dataIndex: "severity_score_gpt",
            key: "severity_score_gpt",
        },
        {
            title: "Severity Tier",
            dataIndex: "severity_class",
            key: "severity_class",
            render: (text, record) => {
                if (text === 0) {
                    return <Tag color="green">mild</Tag>;
                } else if (text === 1) {
                    return <Tag color="orange">moderate</Tag>;
                } else if (text === 2) {
                    return <Tag color="red">severe</Tag>;
                } else if (text === 3) {
                    return <Tag color="purple">profound</Tag>;
                }
            },
        },
        {
            title: "Most Associated Celltype",
            dataIndex: "celltype_name",
            key: "celltype_name",
        },
        {
            title: "Celltype Database",
            dataIndex: "celltype_database",
            key: "celltype_database",
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
        with1: false,
        without: false,
    });

    const handleSliderChange = (name, value) => {
        debugger;
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
        setLoading(true);
        const queryParams = new URLSearchParams(sliderValues).toString();
        debugger;
        const url = `${BASE_API_URL}/api/severity?${queryParams}&pageSize=${tableParams.pagination?.pageSize}&current=${tableParams.pagination?.current}`;
        console.log("Submitting request to URL:", url);
        try {
            const response = await axios.get(url);
            console.log("Response data:", response.data);

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
                let item = { id: dataWithDefinitions[i].hpo_name };
                let itemData = [];
                for (let key in dataWithDefinitions[i]) {
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
                        ].includes(key) &&
                        key.indexOf("justification") < 0
                    ) {
                        itemData.push({
                            x: key,
                            y: dataWithDefinitions[i][key],
                        });
                    }
                }
                item.data = itemData;
                list.push(item);
            }
            setDataSet(list);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    console.log("Form is rendered");
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const download = () => {
        var svgElement = document.getElementsByTagName("svg")[1];
        var svgData = new XMLSerializer().serializeToString(svgElement);
        var blob = new Blob([svgData], { type: "image/svg+xml" });
        var url = URL.createObjectURL(blob);
        if (window.navigator.msSaveOrOpenBlob) {
            //ie
            var imgData = blob;
            var blobObj = new Blob([imgData]);
            window.navigator.msSaveOrOpenBlob(blobObj, "Cell Associations.png");
        } else {
            //google, firefox
            var oA = document.createElement("a");
            oA.download = "Severity";
            oA.href = url;
            oA.className = "qrcode";
            document.body.appendChild(oA);
            oA.click();
            oA.remove();
        }
    };

    return (
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
                    marginLeft: 50,
                    marginRight: 30,
                    textAlign: "center",
                    borderRadius: borderRadiusLG,
                    padding: 20,
                }}
                width={350}
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="demo-logo-vertical" />
                <form onSubmit={handleSubmit}>
                    <center>
                        <div>
                            <SeveritySlider1
                                name="Severity Tier"
                                onChange={(value) =>
                                    handleSliderChange("severity_class", value)
                                }
                            />
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
                        <div style={{ margin: 29, textAlign: "left" }}>
                            <Checkbox
                                style={{
                                    marginBottom: 20,
                                    transform: "scale(1.2)",
                                    fontWeight: 400,
                                    marginLeft: 25,
                                }}
                                onChange={onChange}
                            >
                                With Associated Celltype
                            </Checkbox>
                            <Checkbox
                                style={{
                                    marginBottom: 20,
                                    transform: "scale(1.2)",
                                    fontWeight: 400,
                                    marginLeft: 27,
                                }}
                                onChange={onChange1}
                            >
                                Without Associated Celltype
                            </Checkbox>
                        </div>

                        <div style={{ margin: 29 }}>
                            <Button
                                name="Search"
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
                                Search
                            </Button>
                        </div>
                    </center>
                </form>
            </Sider>
            <Layout>
                <Content
                    style={{
                        margin: "0 16px",
                        overflow: "auto",
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: "16px 0",
                        }}
                    >
                        <Breadcrumb.Item href={"/"}>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Severity</Breadcrumb.Item>
                    </Breadcrumb>

                    <Card
                        style={{
                            width: "100%",
                        }}
                    >
                        <p>
                            Each phenotype in the HPO has had its severity
                            scored. This was done based on a scoring system
                            derived by clinicians, such that phenotypes which
                            cause intellectual disability and death are
                            profoundly severe, while those which just reduce
                            fertility are mild. Our annotation of this was
                            described in this preprint. Justifications for why
                            each phenotype is associated with a severity
                            modifier, can be seen by expanding the entries in
                            the table below.
                        </p>
                    </Card>
                    <br />
                    <Button
                        style={{ float: "right", width: 50 }}
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={download}
                    />
                    <br />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <SeverityNetWork data1={dataSet} />

                        <Spin spinning={loading}>
                            {" "}
                            <Table
                                pagination={tableParams.pagination}
                                style={{ height: 500 }}
                                columns={columns}
                                expandable={{
                                    expandedRowRender,
                                    defaultExpandedRowKeys: ["0"],
                                }}
                                dataSource={data}
                                size="small"
                                onChange={handleTableChange}
                            />
                        </Spin>
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                    }}
                >
                    Neurogenomics Lab ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
}
