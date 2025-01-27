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
} from "antd";
import PhenotypeTree from "../components/PhenotypeTree.jsx";
import PhenotypeTableDisease from "../components/PhenotypeTableDisease.jsx";
import PhenotypeTableDisease1 from "../components/PhenotypeTableDisease1.jsx";
import PhenotypeTableDisease2 from "../components/PhenotypeTableDisease2.jsx";
import { BASE_API_URL, ONTOLOGY_API_URL } from "../../config.js";

const { Header, Content, Footer, Sider } = Layout;

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
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [data, setData] = useState(null);
    const [dataRef, setDataRef] = useState(null);
    const [size, setSize] = useState("DescartesHuman");

    const [desItem, setDesItem] = useState(items);

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const getData = (data, info) => {
        console.log(`data from Child2 - ${info.node.dataRef.name}`);
        setDataRef(info.node.dataRef);
        setData(info.node.dataRef.key);
        let itemsTemp = [];
        itemsTemp.push({
            label: "Phenotype ID",
            key: "1",
            children: info.node.dataRef.key,
        });

        fetch(`${ONTOLOGY_API_URL}/api/hp/terms/${info.node.dataRef.key}`)
            .then((res) => res.json())
            .then(async (result) => {
                itemsTemp.push({
                    label: "Definition",
                    key: "1",
                    children: result.definition,
                });
                itemsTemp.push({
                    label: "Synonyms",
                    key: "3",
                    children: result.synonyms.join(" - "),
                });
                itemsTemp.push({
                    label: "Comment",
                    key: "2",
                    children: result.comment,
                });
                itemsTemp.push({
                    label: "Cross References",
                    key: "4",
                    children: result.xrefs.join(", "),
                });
                try {
                    await fetch(
                        `${BASE_API_URL}/api/hpo-definitionNew/${info.node.dataRef.key}`
                    )
                        .then((res) => res.json())
                        .then((result1) => {
                            console.log("dddddd- ", result1);
                            itemsTemp.push({
                                label: "Severity Score",
                                key: "5",
                                children: result1[0].severity_score_gpt,
                            });
                            itemsTemp.push({
                                label: "Severity Tier",
                                key: "6",
                                children: result1[0].severity_class,
                            });
                        });
                } catch (e) {
                    console.log("error", e);
                }
                setDesItem(itemsTemp);
                return false;
            });
        setDesItem(items);
        return false;
    };

    const onload = (data) => {
        let itemsTemp = [];
        itemsTemp.push({ label: "Phenotype ID", key: "1", children: data });
        setData(data);
        debugger;
        fetch(`${ONTOLOGY_API_URL}/api/hp/terms/${data}`)
            .then((res) => {
                return res.json();
            })
            .then(async (result) => {
                itemsTemp.push({
                    label: "Definition",
                    key: "1",
                    children: result.definition,
                });
                itemsTemp.push({
                    label: "Synonyms",
                    key: "3",
                    children: result.synonyms.join(" - "),
                });
                itemsTemp.push({
                    label: "Comment",
                    key: "2",
                    children: result.comment,
                });
                itemsTemp.push({
                    label: "Cross References",
                    key: "4",
                    children: result.xrefs.join(", "),
                });
                try {
                    await fetch(`${BASE_API_URL}/api/hpo-definitionNew/${data}`)
                        .then((res) => res.json())
                        .then((result1) => {
                            console.log("dddddd- ", result1);
                            itemsTemp.push({
                                label: "Severity Score",
                                key: "5",
                                children: result1[0].severity_score_gpt,
                            });
                            itemsTemp.push({
                                label: "Severity Tier",
                                key: "6",
                                children: result1[0].severity_class,
                            });
                        });
                } catch (e) {
                    console.log("error", e);
                }
                setDesItem(itemsTemp);
                itemsTemp.title = result.name;
                setDataRef(itemsTemp);
                return false;
            });
        setDesItem(items);
        return false;
    };

    useEffect(() => {
        console.log("初始化加载");
        const searchParams = new URLSearchParams(window.location.search);
        const param = searchParams.get("jump");

        if (param) {
            onload(param);
        }
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
                <div className="demo-logo-vertical" />
                <h1 style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#FFFFFF' }}>
                    Select database
                </h1>
                <hr style={{ marginBottom: 7, border: "none" }} />
                <Radio.Group
                    buttonStyle="solid"
                    value={size}
                    onChange={handleSizeChange}
                >
                    <Radio.Button style={{ width: 200 }} value="DescartesHuman">
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
                <PhenotypeTree onGetData={getData} />
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
                        <Breadcrumb.Item>Phenotype</Breadcrumb.Item>
                    </Breadcrumb>
                    <Card
                        style={{
                            width: "100%",
                        }}
                    >
                        <p>
                            Each phenotype in the HPO is linked to specific cell
                            types and genes, allowing researchers to explore the
                            underlying biological mechanisms. The relationships
                            between phenotypes and cell types are based on
                            statistical significance, with stronger associations
                            highlighted. This page enables users to search for
                            any phenotype and explore its corresponding data,
                            such as associated genes and cell types, using
                            dynamic visualizations like network graphs and bar
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
                            {dataRef != null ? dataRef.title : "All"}
                        </h2>
                        <Descriptions
                            column={1}
                            size={"small"}
                            labelStyle={{ color: "#0f172a", width: "200px" }}
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
