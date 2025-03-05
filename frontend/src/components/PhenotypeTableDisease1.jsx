import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Spin, Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { ONTOLOGY_API_URL } from "../../config.js";

const PhenotypeTableDisease = (hpid) => {
    const [data, setData] = useState();
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true);
        let hppp = hpid.hpid;
        fetch(`${ONTOLOGY_API_URL}/api/network/annotation/${hppp}`)
            .then((res) => res.json())
            .then(({ genes }) => {
                setData(genes);
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
            title: "Gene ID",
            dataIndex: "id",
            key: "id",
            width: "30%",
            sorter: (a, b) => a.id.substring("NCBIGene:".length) - b.id.substring("NCBIGene:".length),
            sortDirections: ['ascend', 'descend'],
            ...getColumnSearchProps("id"),
            render: (text) => {
                const model = text.split(":")[0];
                const text1 = text.split(":")[1];
                if (model === "NCBIGene") {
                    return (
                        <a
                            style={{ textDecoration: "underline" }}
                            target={"_blank"}
                            href={`https://www.ncbi.nlm.nih.gov/gene/${text1}`}
                        >
                            {text}
                        </a>
                    );
                }
                return { text };
            },
        },

        {
            title: "Gene Symbol",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
        },
    ];
    return (
        <Spin spinning={loading}>
            <Table
                columns={columns}
                dataSource={data}
                showSorterTooltip={true}
            />
        </Spin>
    );
};
export default PhenotypeTableDisease;
