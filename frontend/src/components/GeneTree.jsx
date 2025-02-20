import React from "react";
import { Tree, Input } from "antd";
import axios from "axios";
import { ONTOLOGY_API_URL } from "../../config.js";
import { urlParser } from "../scripts/urlHandlers.js";

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

class SearchTree extends React.Component {
    state = {
        expandedKeys: ["1"],
        searchValue: "",
        autoExpandParent: true,
        gData: [
            {
                title: "",
                key: "1",
            },
        ],
        selectedKeys: [""],
        loading: false,
    };
    constructor(props) {
        super(props);
    }

    onSelect = (selectedKeys, info) => {
        this.props.onGetData(selectedKeys[0], info);
        this.setState({ selectedKeys });
    };

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onSearch = (e) => {
        this.setState({
            loading: true,
        });
        let res = [];
        const url = `${ONTOLOGY_API_URL}/api/network/search/gene?q=${e}&limit=-1`;

        return axios.get(url).then((response) => {
            for (let i = 0; i < response.data.results.length; i++) {
                let item = response.data.results[i];
                item.key = item.id;
                item.title = item.id.substring(0, 7) + " " + item.name;
                res.push(item);
            }
            this.setState({
                gData: res,
                loading: false,
            });
        });
    };

    onChange = (e) => {
        this.setState({
            loading: true,
        });
        let res = [];
        const url = `${ONTOLOGY_API_URL}/api/network/search/gene?q=${e.target.value}&limit=100`;

        return axios.get(url).then((response) => {
            for (let i = 0; i < response.data.results.length; i++) {
                let item = response.data.results[i];
                item.key = item.id;
                item.title = item.name;
                res.push(item);
            }
            this.setState({
                gData: res,
                loading: false,
            });
        });
    };

    componentDidMount() {
        const { jump } = urlParser("gene");
        if (jump) {
            let e = {
                target: {
                    value: jump,
                }
            }
            const geneId = "NCBIGene:" + jump;
            let info = {
                node: {
                    dataRef: {
                        key: geneId,
                        id: geneId,
                    }
                }
            };
            this.onChange(e);
            this.onSelect([geneId], info);
        } else {
            // Search "NCBI" by default
            let e = {
                target: {
                    value: "NCBI",
                },
            }
            this.onChange(e);
        }
    };

    loop = (data) =>
        data.map((item) => {
            let { searchValue } = this.state;
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: "#f50" }}>{searchValue}</span>
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

    render() {
        let { expandedKeys, autoExpandParent, gData, loading } = this.state;
        return (
            <div className="space-y-4 mb-4">
                <div ref={this.props.tourRefs[0]}>
                    <Search
                        placeholder="Search gene name"
                        onChange={this.onChange}
                        onSearch={this.onSearch}
                        loading={loading}
                    />
                </div>
                <div ref={this.props.tourRefs[1]}>
                <div
                    style={{
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "4px",
                    }}
                >
                    
                    <p className="font-semibold m-0.5 mb-2 ml-2">
                        Genes Names
                    </p>
                    <Tree
                        style={{ maxHeight: 500, overflowY: "auto" }}
                        onSelect={this.onSelect}
                        expandedKeys={expandedKeys}
                        selectedKeys={this.state.selectedKeys}
                        autoExpandParent={autoExpandParent}
                    >
                        {this.loop(gData)}
                    </Tree>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchTree;
