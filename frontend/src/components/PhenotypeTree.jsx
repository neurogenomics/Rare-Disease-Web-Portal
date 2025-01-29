import React, { useEffect } from "react";
import { Tree, Input } from "antd";
import axios from "axios";
import { ONTOLOGY_API_URL } from "../../config.js";

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

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
        expandedKeys: ["HP:0000001"],
        selectedKeys: [""],
        searchValue: "",
        autoExpandParent: true,
        gData: [
            {
                title: "ALL",
                key: "HP:0000001",
            },
        ],
        load_counter: 0,
    };
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        const param = searchParams.get("jump");
        if (param) {
            console.log("初始化加载");
            this.onSearch(param);
        }
        this.on;
    }
    fetchData = (param) => {
        let res = [];
        const url = `${ONTOLOGY_API_URL}/api/hp/terms/${param}/children`;

        return axios.get(url).then((response) => {
            console.log("Response data:", response.data);
            for (let i = 0; i < response.data.length; i++) {
                let item = response.data[i];
                item.key = item.id;
                item.title = item.name;
                res.push(item);
            }
            return res;
        });
    };

    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
        console.log("selected", selectedKeys, info);
        console.log("selected", this.props);
        this.props.onGetData(selectedKeys[0], info);
        console.log(this.state.expandedKeys);
    };

    onFirstLoad = (selectedKeys, info) => {
        let { load_counter } = this.state;
        console.log(load_counter);
        if (load_counter == 0) {
            this.onSelect(selectedKeys, info);
        }
        this.setState({ load_counter: load_counter + 1 });
    };

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onChange = (e) => {
        let res = [];
        const url = `${ONTOLOGY_API_URL}/api/hp/search?q=${e.target.value}&limit=50`;

        return axios.get(url).then((response) => {
            console.log("Response data:", response.data.terms.length);
            for (let i = 0; i < response.data.terms.length; i++) {
                let item = response.data.terms[i];
                res.push({ key: item.id, title: item.name });
            }
            this.setState({
                gData: res,
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
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: "#f50" }}>{middleStr}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title} dataRef={item}>
                        {this.loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode dataRef={item} key={item.key} title={title} />;
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
            console.log("Response data:", response.data.terms.length);
            for (let i = 0; i < response.data.terms.length; i++) {
                let item = response.data.terms[i];
                res.push({ key: item.id, title: item.name });
            }
            this.setState({
                gData: res,
            });
        });
    };

    render() {
        let { expandedKeys, selectedKeys, autoExpandParent, gData } =
            this.state;
        generateList(gData);
        return (
            <div style={{ marginBottom: "20px" }}>
                <Search
                    style={{ marginBottom: 16 }}
                    placeholder="Search phenotype tree"
                    onChange={this.onChange}
                    onSearch={this.onSearch}
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
