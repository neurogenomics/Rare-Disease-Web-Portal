import React, { useEffect, useRef, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Spin, Button, Table } from "antd";
import { Column } from "@ant-design/plots";
import { BASE_API_URL } from "../../config.js";
import formatText from "../scripts/formatText.js";
import truncateText from "../scripts/truncateText.js";
import MathJax from "react-mathjax2";
import QValueInfo from "./info/QValueInfo.jsx";

const DemoColumn = (data) => {
    const chartRef = useRef();
    const formula = "-\\log_{10}(\\text{q-value})";
    const config = {
        data: data.data,
        xField: "Cell",
        yField: "q",
        axis: {
            x: {
                title: "Cell Types",
                labelFormatter: (v) => {
                    return truncateText(formatText(v), 30);
                },
            },
            y: {
                title: "Enrichment Significance (-log10(q-value))",
            },
        },
        interaction: {
            tooltip: {
                render: (e, { title, items }) => {
                    return (
                        <div key={title}>
                            <div className="text-xs">
                                <span className="font-semibold">
                                    Cell Type:{" "}
                                </span>
                                {formatText(title)}
                            </div>
                            {items.map((item) => {
                                const { name, value, color } = item;
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
                                                <MathJax.Context>
                                                    <span>
                                                        Enrichment Significance
                                                        (
                                                        <MathJax.Node inline>
                                                            {formula}
                                                        </MathJax.Node>
                                                        ): &nbsp;{" "}
                                                    </span>
                                                </MathJax.Context>
                                            </div>
                                            <b>
                                                {value.toFixed(
                                                    data.decimalPoints
                                                )}
                                            </b>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="italic">
                                A higher value indicates a stronger cell
                                type-phenotype association.
                            </div>
                        </div>
                    );
                },
            },
        },
        height: 570,
    };
    ``;
    return <Column {...config} ref={chartRef} />;
};

const PhenotypeTableDisease = (hpid) => {
    const [data, setData] = useState();
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);

    const [chart, setChart] = useState([]);

    const fetchData = () => {
        setLoading(true);
        let hppp = hpid.hpid;
        fetch(
            `${BASE_API_URL}/api/cellByHpoid1?hpo_id=${hppp}&db_type=${hpid.dbType}`
        )
            .then((res) => res.json())
            .then((data) => {
                // let filteredData = data.filter((item) => item.q < 0.99999); // Remove data where q is nearly 1, i.e. practically no association
                let temp = [];
                data.forEach((item) => {
                    item.key = item.id;
                    temp.push({
                        q: Math.log10(item.q) * -1,
                        Cell: item.celltype_name,
                    });
                });
                setChart(temp);
                setData(data);
                setLoading(false);
            });
    };

    const fetchData1 = (db_type) => {
        setLoading(true);
        let hppp = hpid.hpid;
        fetch(
            `${BASE_API_URL}/api/cellByHpoid1?hpo_id=${hppp}&db_type=${db_type}`
        )
            .then((res) => res.json())
            .then((data) => {
                // let filteredData = data.filter((item) => item.q < 0.99999); // Remove data where q is nearly 1, i.e. practically no association
                let temp = [];
                data.forEach((item) => {
                    item.key = item.id;
                    temp.push({
                        q: Math.log10(item.q) * -1,
                        Cell: item.celltype_name,
                    });
                });
                setChart(temp);
                setData(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const db_type = searchParams.get("db_type");

        if (hpid.hpid) {
            if (db_type) {
                fetchData1(db_type);
            }
            fetchData();
        }
    }, [hpid]);

    const columns = [
        {
            title: "Cell Type",
            dataIndex: "celltype_name",
            key: "celltype_name",
            sorter: (a, b) => a.celltype_name.localeCompare(b.celltype_name),
            sortDirections: ["ascend", "descend"],
            render: (text, record) => {
                return (
                    <a
                        style={{ textDecoration: "underline" }}
                        target={"_blank"}
                        href={`/celltype?jump=${text}&db_type=${record.celltype_database}`}
                    >
                        {formatText(text)}
                    </a>
                );
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
            sortDirections: ["ascend", "descend"],
            render: (num) => num.toFixed(hpid.decimalPoints),
        },
    ];
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
                render: (num) => num.toFixed(hpid.decimalPoints),
            },
        ];
        const data1 = [];

        data1.push({
            Value: record.estimate,
            Target: "Estimate",
        });

        data1.push({
            Value: record.std_error,
            Target: "Standard Error",
        });
        data1.push({
            Value: record.statistic,
            Target: "Statistic",
        });
        data1.push({
            Value: record.fold_change,
            Target: "Fold Change",
        });

        data1.push({
            Value: record.p,
            Target: "P-Value",
        });
        data1.push({
            Value: record.model_estimate,
            Target: "Model Estimate",
        });
        data1.push({
            Value: record.model_statistic,
            Target: "Model Statistic",
        });

        return (
            <Table columns={columns} dataSource={data1} pagination={false} />
        );
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

    return (
        <>
            <Spin spinning={loading}>
                {chart.length > 0 && (
                    <>
                        <Button
                            style={{ float: "right", width: 50 }}
                            type="primary"
                            icon={<DownloadOutlined />}
                            size="small"
                            onClick={download}
                        />
                        <br />
                        <DemoColumn
                            data={chart}
                            decimalPoints={hpid.decimalPoints}
                        />
                    </>
                )}
                <Table
                    scroll={{ x: 500, y: 600 }}
                    columns={columns}
                    expandable={{
                        expandedRowRender,
                        defaultExpandedRowKeys: ["0"],
                    }}
                    dataSource={data}
                    sortDirections={["descend", "ascend"]}
                    showSorterTooltip={true}
                />
            </Spin>
        </>
    );
};
export default PhenotypeTableDisease;
