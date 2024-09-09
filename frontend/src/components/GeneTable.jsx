import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Spin, Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";

// Component to display a table of phenotypes related to a disease
const PhenotypeTableDisease = (hpid) => {
    const [data, setData] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [searchedColumn, setSearchedColumn] = useState(null);
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false);

    // Function to fetch data from the external API
    const fetchData = () => {
        setLoading(true);
        let hppp = hpid.hpid;
        console.log("hpid changehhhhhhhh", hppp);
        console.log("hpid change", JSON.stringify(hpid));
        fetch(`https://ontology.jax.org/api/network/annotation/${hppp}`)
            .then((res) => res.json())
            .then(({ phenotypes }) => {
                setData(phenotypes);
                setLoading(false);
            });
    };

    // Effect hook to fetch data when the component mounts or hpid changes
    useEffect(() => {
        fetchData();
        console.log("Props changed:", hpid);
    }, [hpid]);

    // Function to handle search action
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    // Function to handle reset action
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    // Function to get column search properties
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
            title: "Term Identifier",
            dataIndex: "id",
            key: "id",
            width: "30%",
            sorter: (a, b) => a.id.length - b.id.length,
            ...getColumnSearchProps("id"),
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
            title: "Term Name",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ["descend", "ascend"],
        },
    ];

    // Render the table with a loading spinner
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
