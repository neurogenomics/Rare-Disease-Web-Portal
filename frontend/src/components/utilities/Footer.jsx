import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const CustomFooter = () => {
    return (
        <Footer style={{ textAlign: "center", padding: "15px 0" }}>
            <a href="https://www.neurogenomics.co.uk" target="_blank" className="text-purple-950">
                Neurogenomics Lab
            </a> © {new Date().getFullYear()}
        </Footer>
    );
};

export default CustomFooter;