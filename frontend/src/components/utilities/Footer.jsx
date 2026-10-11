import { Layout } from 'antd';

const { Footer } = Layout;

const CustomFooter = () => {
    return (
        <Footer style={{ textAlign: "center", padding: "16px", color: '#595959', background: '#f5f5f5' }}>
            <a href="https://www.neurogenomics.co.uk" target="_blank" rel="noopener noreferrer" style={{color:'#1677ff'}}>
                Neurogenomics Lab
            </a> © {new Date().getFullYear()}
        </Footer>
    );
};

export default CustomFooter;
