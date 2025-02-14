import React from "react";
import { Tree, Input, Tooltip } from "antd";
import axios from "axios";
import { BASE_API_URL, ONTOLOGY_API_URL } from "../../config.js";
import { Close } from "@mui/icons-material";
import { debounce } from "lodash";

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const searchParams = new URLSearchParams(window.location.search);
let jump = searchParams.get("jump");

const getParentKey = (title, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.title === title)) {
                parentKey = node.key;
            } else if (getParentKey(title, node.children)) {
                parentKey = getParentKey(title, node.children);
            }
        }
    }
    return parentKey;
};

const dataList = [];

const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({ key, title: node.title });
        if (node.children) {
            generateList(node.children);
        }
    }
};

class SearchTree extends React.Component {
    state = {
        expandedKeys: jump ? [jump] : ["HP:0000118"],
        selectedKeys: jump ? [jump] : [""],
        searchValue: jump ? jump : "",
        autoExpandParent: true,
        gData: [
            {
                title: "Phenotypic Abnormality",
                key: "HP:0000118",
                hasData: true,
            },
        ],
        first_load: true,
        loading: true,
    };
    constructor(props) {
        super(props);
        this.onChange = debounce(this.onChange.bind(this), 500);
    }
    componentDidMount() {
        if (jump) {
            this.onSearch(jump);
        }
        this.onFirstLoad(this.state.selectedKeys, {});
    }

    checkData = (param) => {
        const urlData = `${BASE_API_URL}/api/cellByHpoid1?hpo_id=${param}&db_type=${this.props.dbType}&dry_run=true`
        return axios.get(urlData).then((response) => {
            if (response.data) {
                return true;
            } else {
                return false;
            }
        });
    };

    fetchData = (param) => {
        const url = `${ONTOLOGY_API_URL}/api/hp/terms/${param}/children`;

        return axios.get(url).then((response) => {
            const children = response.data;
            const items = children.map(item => {
                item.key = item.id;
                item.title = item.name;
                item.isLeaf = false; // Assume it's not a leaf initially
                return item;
            });

            // Check if each child has further children by making another API call
            const childPromises = items.map(item => {
                const childUrl = `${ONTOLOGY_API_URL}/api/hp/terms/${item.id}/children`;
                return axios.get(childUrl)
                    .then(async childResponse => {
                        if (childResponse.data.length === 0) {
                            item.isLeaf = true; // If no children, then it's a leaf
                        }
                        item.hasData = await this.checkData(item.id);
                        return item;
                    })
                    .catch((e) => {
                        item.isLeaf = true; // If API call fails, consider it a leaf
                        console.warn("Failed to fetch children for", item.id, "Error:", e);
                        return item;
                    });
            });

            return Promise.all(childPromises).then(updatedItems => {
                this.setState({ loading: false });
                return updatedItems;
            });
        })
        .catch((e) => {
            console.warn("Failed to fetch parent-", param, "Error:", e);
            return [];
        });
    };

    onSelect = (selectedKeys, info) => {
        if (
            selectedKeys.length === 0 ||
            selectedKeys[0] === this.state.selectedKeys[0]
        ) {
            console.log("No selection or already selected");
            return;
        }
        this.setState({ selectedKeys });
        this.props.onGetData(selectedKeys[0], info);
        this.setState({ expandedKeys: [selectedKeys[0]] });
    };

    onFirstLoad = (selectedKeys, info) => {
        let { first_load } = this.state;
        if (first_load && jump) {
            this.onSelect(selectedKeys, info);
            this.setState({
                expandedKeys: [jump],
                autoExpandParent: false,
            });
        }
        this.setState({ first_load: false });
    };

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
        });
    };

    onChange = (e) => {
        if (e.target.value === "") {
            e.target.value = "Phenotypic Abnormality";
        }
        let res = [];
        const url = `${ONTOLOGY_API_URL}/api/hp/search?q=${e.target.value}&limit=50`;
        this.setState({ loading: true });

        axios.get(url).then((response) => {
            for (let i = 0; i < response.data.terms.length; i++) {
                let item = response.data.terms[i];
                res.push({ key: item.id, title: item.name, isLeaf: false });
            }

            // Check if each child has further children by making another API call
            const childPromises = res.map(item => {
                const childUrl = `${ONTOLOGY_API_URL}/api/hp/terms/${item.key}/children`;
                return axios.get(childUrl)
                    .then(async childResponse => {
                        if (childResponse.data.length === 0) {
                            item.isLeaf = true; // If no children, then it's a leaf
                        }
                        item.hasData = await this.checkData(item.key);
                        return item;
                    })
                    .catch((e) => {
                        item.isLeaf = true; // If API call fails, consider it a leaf
                        console.warn("Failed to fetch children for", item.key, "Error:", e);
                        return item;
                    });
            });

            Promise.all(childPromises).then(updatedItems => {
                this.setState({
                    gData: updatedItems,
                    loading: false,
                });
            });
        });
    };

    loop = (data) =>
        data.map((item) => {
            let { searchValue } = this.state;
            const index = item.title
                .toLowerCase()
                .indexOf(searchValue.toLowerCase());
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const middleStr = searchValue
                ? item.title.substr(index, searchValue.length)
                : "";
            let title =
                index > -1 ? (
                    <span className="inline-block align-middle">
                        {beforeStr}
                        <span style={{ color: "#f50" }}>{middleStr}</span>
                        {afterStr}
                        {item.hasData ? (
                            ""
                        ) : (
                            <span className="ml-1 text-red-500">
                                    <Close fontSize="inherit" />
                            </span>
                        )}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
                title = (
                    <Tooltip title={(item.hasData) ? null : "No cell associations found"} placement="right">
                    {title}
                    </Tooltip>
                );
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title} dataRef={item}>
                        {this.loop(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    dataRef={item}
                    key={item.key}
                    title={title}
                    isLeaf={item.isLeaf}
                />
            );
        });

    onLoadData = (treeNode) =>
        this.fetchData(treeNode.props.eventKey).then((res) => {
            if (res.length === 0) {
                treeNode.props.dataRef.isLeaf = true;
            } else {
                treeNode.props.dataRef.children = res;
            }
            return new Promise((resolve) => {
                if (treeNode.props.children) {
                    resolve();
                    return;
                }
                setTimeout(() => {
                    treeNode.props.dataRef.children = res;
                    this.setState({
                        gData: [...this.state.gData],
                    });
                    resolve();
                }, 500);
            });
        });

    onSearch = (e) => {
        let res = [];
        const url = `${ONTOLOGY_API_URL}/api/hp/search?q=${e}&limit=50`;

        return axios.get(url).then((response) => {
            for (let i = 0; i < response.data.terms.length; i++) {
                let item = response.data.terms[i];
                res.push({ key: item.id, title: item.name, isLeaf: false });
            }

            // Check if each child has further children by making another API call
            const childPromises = res.map(item => {
                const childUrl = `${ONTOLOGY_API_URL}/api/hp/terms/${item.key}/children`;
                return axios.get(childUrl)
                    .then(async childResponse => {
                        if (childResponse.data.length === 0) {
                            item.isLeaf = true; // If no children, then it's a leaf
                        }
                        item.hasData = await this.checkData(item.key);
                        return item;
                    })
                    .catch((e) => {
                        item.isLeaf = true; // If API call fails, consider it a leaf
                        console.warn("Failed to fetch children for", item.key, "Error:", e);
                        return item;
                    });
            });

            Promise.all(childPromises).then(updatedItems => {
                this.setState({
                    gData: updatedItems,
                });
            });
        });
    };

    render() {
        let { expandedKeys, selectedKeys, autoExpandParent, gData, loading } =
            this.state;
        generateList(gData);
        return (
            <div style={{ marginBottom: "20px" }}>
                <Search
                    style={{ marginBottom: 16 }}
                    placeholder="Search phenotype tree"
                    onChange={this.onChange}
                    onSearch={this.onSearch}
                    loading={loading}
                />
                <div
                    style={{
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "4px",
                    }}
                >
                    <p className="font-semibold m-0.5 mb-2 ml-2">
                        Phenotype Tree
                    </p>
                    <Tree
                        style={{ maxHeight: 550, overflowY: "auto" }}
                        onSelect={this.onSelect}
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        selectedKeys={selectedKeys}
                        autoExpandParent={autoExpandParent}
                        loadData={this.onLoadData}
                        onLoad={this.onFirstLoad}
                    >
                        {this.loop(gData)}
                    </Tree>
                </div>
            </div>
        );
    }
}

export default SearchTree;
