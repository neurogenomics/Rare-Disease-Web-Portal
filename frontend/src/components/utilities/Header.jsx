import React, { useState } from "react";
import { ConfigProvider, Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import MainLogo from "./MainLogo";

const { Header } = Layout;

const items = [
    {
        key: "home",
        label: "Home",
        path: "/"
    },
    {
        key: "search",
        label: "Search",
        children: [
            {
                key: "phenotype",
                label: "By Phenotype",
                path: "/phenotype"
            },
            {
                key: "celltype",
                label: "By Cell Type",
                path: "/celltype"
            },
            {
                key: "gene",
                label: "By Gene",
                path: "/gene"
            },
            {
                key: "severity",
                label: "By Severity",
                path: "/severity"
            },
        ],
    },
    {
        key: "publications",
        label: "Publications",
        path: "/publications"
    },
    {
        key: "about",
        label: "About",
        path: "/about"
    },
];

const CustomHeader = ({ activePageKey }) => {
    const [selectedKey, setSelectedKey] = useState(activePageKey);
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
        const item = findMenuItemByKey(items, e.key);
        console.log(item);
        if (item && item.path) {
            navigate(item.path);
        }
    }

    const findMenuItemByKey = (menuItems, key) => {
        for (const item of menuItems) {
            if (item.key === key) {
                return item;
            }
            if (item.children) {
                const childItem = findMenuItemByKey(item.children, key);
                if (childItem) {
                    return childItem;
                }
            }
        }
        return null;
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        darkItemColor: "#000",
                        darkItemSelectedBg: "#8b5cf6",
                        darkSubMenuItemBg: "#fff",
                        darkPopupBg: "#fff",
                        subMenuItemBg: "#fff",
                        subMenuItemSelectedColor: "#fff",
                        darkItemHoverColor: "#8b5cf6",
                    },
                    Layout: {
                        headerHeight: "3.2em",
                    },
                },
            }}
        >
            <Header
                style={{
                    background: "#fff",
                    padding: 0,
                    top: 0,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    zIndex: 10,
                }}
                theme="light"
            >
                <MainLogo />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[selectedKey]}
                    items={items}
                    className="header-menu"
                    onClick={handleMenuClick}
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#fff",
                    }}
                    disabledOverflow={true}
                />
            </Header>
        </ConfigProvider>
    );
};

export default CustomHeader;
