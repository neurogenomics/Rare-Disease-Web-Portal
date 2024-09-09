import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Spin, Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
const PhenotypeTableDisease = (hpid) => {
    const [data, setData] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [searchedColumn, setSearchedColumn] = useState(null);
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true);
        let hppp = hpid.hpid;
        console.log("hpid changehhhhhhhh", hppp);
        console.log("hpid change", JSON.stringify(hpid));
        fetch(`https://ontology.jax.org/api/network/annotation/${hppp}`)
            .then((res) => res.json())
            .then(({ diseases }) => {
                setData(diseases);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!hpid.hpid) {
            return;
        }
        fetchData();
        console.log("Props changed:", hpid);
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
            title: "Disease Id",
            dataIndex: "id",
            key: "id",
            width: "30%",
            sorter: (a, b) => a.id.length - b.id.length,
            ...getColumnSearchProps("id"),
            render: (text) => {
                const model = text.split(":")[0];
                const text1 = text.split(":")[1];
                if (model === "ORPHA") {
                    return (
                        <a
                            style={{ textDecoration: "underline" }}
                            target={"_blank"}
                            href={`https://www.orpha.net/en/disease/detail/${text1}?name=${text1}&mode=orpha`}
                        >
                            {text}
                        </a>
                    );
                }
                return (
                    <a
                        style={{ textDecoration: "underline" }}
                        target={"_blank"}
                        href={`https://omim.org/entry/${text1}`}
                    >
                        {text}
                    </a>
                );
            },
        },

        {
            title: "Disease Name",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ["descend", "ascend"],
        },
    ];
    return (
        <Spin spinning={loading}>
            <Table
                columns={columns}
                dataSource={data}
                sortDirections={["descend", "ascend"]}
            />
        </Spin>
    );
};
export default PhenotypeTableDisease;
