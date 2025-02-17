import React, { useEffect, useRef, useState } from "react";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Spin, Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { Column } from "@ant-design/plots";
import { BASE_API_URL } from "../../config.js";
import formatText from "../scripts/formatText.js";
import truncateText from "../scripts/truncateText.js";
import ExpressionSpecificityInfo from "./info/ExpressionSpecificityInfo.jsx";
import { render } from "@react-three/fiber";

const DemoColumn = (data) => {
    const chartRef = useRef();

    const config = {
        data: data.data,
        xField: "celltype",
        yField: "expression_specificity",
        axis: {
                    x: {
                        title: "Cell Type",
                        labelFormatter: (v) => {
                                            return truncateText(formatText(v), 30);
                                        },
                    },
                    y: {
                        title: "Gene Expression Specificity",
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
                                                        <span>
                                                            Gene Expression Specificity:{" "}
                                                            <b>
                                                                {value.toFixed(
                                                                    data.decimalPoints
                                                                )}
                                                            </b>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="italic">
                                        A higher value indicates that the gene likely 
                                        plays a more important role in the cell type.
                                    </div>
                                </div>
                            );
                        },
                    },
                },
        
    };
    return <Column {...config} ref={chartRef} />;
};
const PhenotypeTableDisease = (hpid) => {
    const [data, setData] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [searchedColumn, setSearchedColumn] = useState(null);
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true);
        let hppp = hpid.hpid;
        fetch(`${BASE_API_URL}/gene/${hppp}/${hpid.dbType}`)
            .then((res) => res.json())
            .then((results) => {
                results = results.filter(
                    (item) => item.expression_specificity > 0.00001
                ); // Filter out cell types with practically no specificity
                results.sort((a, b) => {
                    return b.expression_specificity - a.expression_specificity;
                });
                setData(results);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
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
            title: "Cell Name",
            dataIndex: "celltype",
            key: "celltype",
            width: "30%",
            sorter: (a, b) => a.celltype.localeCompare(b.celltype),
            sortDirections: ["ascend", "descend"],
            ...getColumnSearchProps("celltype"),
            render: (text) => formatText(text),
        },
        {
            title: (
                            <>
                                Gene Expression Specificity <ExpressionSpecificityInfo />
                            </>
                        ),
            dataIndex: "expression_specificity",
            key: "expression_specificity",
            ...getColumnSearchProps("expression_specificity"),
            sorter: (a, b) =>
                a.expression_specificity - b.expression_specificity,
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return text.toFixed(hpid.decimalPoints);
            }
        },
    ];
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
        <Spin spinning={loading}>
            {data && data.length > 0 && (
                <>
                    <Button
                        style={{ float: "right", width: 50 }}
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={download}
                    />
                    <br />
                    <DemoColumn data={data} decimalPoints={hpid.decimalPoints} />
                </>
            )}
            <Table
                columns={columns}
                dataSource={data}
                sortDirections={["descend", "ascend"]}
                showSorterTooltip={true}
            />
        </Spin>
    );
};
export default PhenotypeTableDisease;
