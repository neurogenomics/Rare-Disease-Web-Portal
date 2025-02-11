import React, { useEffect, useRef, useState } from "react";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Spin, Button, Input, Space, Table, Modal } from "antd";
import Highlighter from "react-highlight-words";
import { Column } from "@ant-design/plots";
import { BASE_API_URL } from "../../config.js";
import formatText from "../scripts/formatText.js";

const DemoColumn = (data) => {
    const chartRef = useRef();
    useEffect(() => {
        console.log({ chartRef });
    }, []);
    const config = {
        data: data.data,
        xField: "Cell",
        yField: "q",
        interaction: {
            tooltip: {
                render: (e, { title, items }) => {
                    return (
                        <div key={title}>
                            <h4>{title}</h4>
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
                                                ></span>
                                                <span>-log10(q): &nbsp; </span>
                                            </div>

                                            <b>{value}</b>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                },
            },
        },
        height: 570,
        slider: {
            x: {
                values: [0, 0.1],
            },
        },
    };
    return <Column {...config} ref={chartRef} />;
};

const DemoColumn1 = (data) => {
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
                values: [0, 1],
            },
        },
    };
    return <Column {...config} ref={chartRef} />;
};

const PhenotypeTableDisease = (hpid) => {
    const [data, setData] = useState();
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);

    const [chart, setChart] = useState();
    const [data1, setData1] = useState([]);

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
        },
    ];
    const fetchData = () => {
        setLoading(true);
        let hppp = hpid.hpid;
        console.log("hpid changehhhhhhhh", hppp);
        console.log("hpid change", JSON.stringify(hpid));
        fetch(
            `${BASE_API_URL}/api/cellByHpoid1?hpo_id=${hppp}&db_type=${hpid.dbType}`
        )
            .then((res) => res.json())
            .then((data) => {
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
                let temp = [];
                data.forEach((item) => {
                    item.key = item.id;
                    temp.push({
                        q: Math.log10(item.q),
                        Cell: item.celltype_name.substring(0, 10),
                    });
                });
                console.log("TEMP", temp);
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
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: "Cell Type",
            dataIndex: "celltype_name",
            key: "celltype_name",
            sorter: (a, b) => a.celltype_name.localeCompare(b.celltype_name),
            sortDirections: ['ascend', 'descend'],
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
        // {
        //     title: "HPO ID",
        //     dataIndex: "hpo_id",
        //     key: "hpo_id",
        //     sorter: (a, b) => a.hpo_id.localeCompare(b.hpo_id),
        // },
        {
            title: "Q-Value",
            dataIndex: "q",
            key: "q",
            sorter: (a, b) => a.q - b.q,
            sortDirections: ['ascend', 'descend'],
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
    const download1 = () => {
        var canvas = document.getElementsByTagName("canvas")[1];
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

    const [visiable, setVisiable] = useState(false);

    const onOk = () => {
        console.log("编写自己的onOk逻辑");
        closeModal();
    };
    const closeModal = () => {
        setVisiable(false);
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
                        <DemoColumn data={chart} />
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
            <Modal
                title="Gene Associations"
                width={1000}
                open={visiable}
                onOk={onOk}
                onCancel={closeModal}
                afterClose={closeModal}
            >
                <Spin spinning={loading}>
                    {" "}
                    <Button
                        style={{ float: "right", width: 50 }}
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={download1}
                    />
                    <br />
                    <DemoColumn1 data={data1} />
                    <Table columns={columns1} dataSource={data1} size="small" />
                </Spin>
            </Modal>
        </>
    );
};
export default PhenotypeTableDisease;
