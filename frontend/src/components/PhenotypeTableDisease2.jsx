import { legacyExplorerHref } from "../lib/legacyExplorerLink.js";
import { portalFetch } from "../lib/portalAPI.js";
import { useEffect, useRef, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Alert, Spin, Button, Table, Tooltip } from "antd";
import { Column } from "@ant-design/plots";
import { BASE_API_URL } from "../../config.js";
import formatText from "../scripts/formatText.js";
import truncateText from "../scripts/truncateText.js";
import MathJax from "react-mathjax2";
import QValueInfo from "./info/QValueInfo.jsx";
import CellGeneAssociations from "./CellGeneAssociations.jsx";
import { formatQ } from '../lib/evidenceModel.js';

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
                title: "Source -log10(q) (not effect size or causal evidence)",
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
                                This displays source statistical significance,
                                not effect size, direction or causal evidence.
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
    const [loading, setLoading] = useState(false);
    const [sourceError, setSourceError] = useState(null);

    const [chart, setChart] = useState([]);

    const fetchData = () => {
        setLoading(true);
        setSourceError(null);
        let hppp = hpid.hpid;
        portalFetch(
            `${BASE_API_URL}/api/cellByHpoid1?hpo_id=${hppp}&db_type=${hpid.dbType}`
        )
            .then((res) => { if (!res.ok) throw new Error("Source unavailable"); return res.json(); })
            .then((data) => {
                // let filteredData = data.filter((item) => item.q < 0.99999); // Remove data where q is nearly 1, i.e. practically no association
                let temp = [];
                data.forEach((item) => {
                    item.key = item.id;
                    if (typeof item.q !== 'number' || !Number.isFinite(item.q) || item.q <= 0 || item.q > 1) return;
                    temp.push({
                        q: Math.log10(item.q) * -1,
                        Cell: item.celltype_name,
                    });
                });
                setChart(temp);
                setData(data);
                setLoading(false);
            }).catch(error => { setData([]); setSourceError(error.message); setLoading(false); });
    };

    useEffect(() => {
        if (hpid.hpid) {
            fetchData();
        }
    }, [hpid]);

    const columns = [
        { title: "Direction", dataIndex: "direction", key: "direction" },
        { title: "Signed estimate", dataIndex: "estimate", key: "estimate", render: value => typeof value === "number" && Number.isFinite(value) ? value.toPrecision(4) : "Unknown" },
        {
            title: "Cell Type",
            dataIndex: "celltype_name",
            key: "celltype_name",
            sorter: (a, b) => a.celltype_name.localeCompare(b.celltype_name),
            sortDirections: ["ascend", "descend"],
            render: (text, record) => {
                return (
                    <div className="flex flex-row space-x-2 items-center">
                    <Tooltip title="Click to launch search for all associations with this cell type">
                    <a
                        style={{ textDecoration: "underline" }}
                        href={legacyExplorerHref("celltype", text, { hpo: hpid.hpid, atlas: record.celltype_database })}
                        className="cursor-pointer text-blue-950"
                    >
                        {formatText(text)}
                    </a>
                    </Tooltip>
                    <CellGeneAssociations hpID={hpid.hpid} hpName={hpid.hpname} cell={text} dbType={record.celltype_database} />
                    </div>
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
            render: (num) => formatQ(num),
        },
    ];
    const expandedRowRender = (record) => {
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
                render: (num) => typeof num === "number" && Number.isFinite(num) ? num.toPrecision(4) : "Unknown",
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
            {sourceError && <Alert type="warning" showIcon message="Source unavailable; associations remain unknown" description={sourceError} style={{ marginBottom: 12 }} />}
            {data?.[0]?.snapshot_coverage && <Alert type="info" showIcon style={{ marginBottom: 12 }}
                message={data[0].snapshot_coverage === 'all_tested_rows' ? 'All retained tested rows for this phenotype and atlas' : 'Only significant source rows are retained for this phenotype'}
                description="Positive and negative estimates are shown separately. Statistical significance does not establish cell causality; missing rows outside the declared snapshot scope are unknown." />}
                <p className="text-sm text-gray-600">The chart omits q values reported as zero and invalid values because their logarithms cannot be plotted reliably. The table retains the source values. Association significance does not establish cellular causality.</p>
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
                rowKey={record => record.id || record.celltype || record.hpo_id}
                locale={{ emptyText: sourceError ? "Source unavailable; associations remain unknown." : "No rows in this source view; review the published coverage limits." }}
                    sortDirections={["descend", "ascend"]}
                    showSorterTooltip={true}
                />
            </Spin>
        </>
    );
};
export default PhenotypeTableDisease;
