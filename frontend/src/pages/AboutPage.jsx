import { useEffect } from "react";
import { Breadcrumb, Card, Layout } from "antd";
import { Link } from "react-router-dom";
import CustomHeader from "../components/utilities/Header";
import CustomFooter from "../components/utilities/Footer";
import { Email, Place, GitHub, X, Launch } from "@mui/icons-material";

const { Content } = Layout;

function Logos() {
    return (
        <div className="portal-partner-logos">
            <a href="https://www.ukdri.ac.uk/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/logo_UKDRI.png" alt="UK Dementia Research Institute logo" />
            </a>
            <a href="https://www.imperial.ac.uk/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/logo_Imperial_DoBS.png" alt="Imperial College London logo" />
            </a>
        </div>
    );
}

export default function AboutPage() {
    useEffect(() => {
        document.title = "About · Rare Disease Celltyping Portal";
    }, []);
    return (
        <Layout className="portal-page portal-information-page">
            <CustomHeader activePageKey="about" />
            <Content className="portal-information-content">
                <Breadcrumb items={[{ title: <Link to="/">Home</Link> }, { title: "About" }]} />
                <div className="portal-information-grid">
                    <Card className="portal-information-card">
                        <h1>About the portal</h1>
                        <p>
                            Rare diseases involve complex genetic variation, creating challenges for patients,
                            clinicians and researchers. The Rare Disease Celltyping Portal brings together
                            disease and phenotype annotations, single-cell expression atlases, variant records
                            and treatment evidence to help researchers examine possible cellular mechanisms.
                        </p>
                        <p>
                            Explore a phenotype, follow its associated genes and cell types, then inspect
                            the variant and treatment sources behind the interpretation. Statistical
                            enrichment nominates a cellular context; it does not establish that a cell
                            type causes a phenotype or that a treatment will work. Severity annotations
                            are historical research data and require independent validation.
                        </p>
                        <p>
                            The <Link to="/evidence?tab=methods">methods and source coverage</Link> explain
                            these limits. The <Link to="/publications">publications</Link> describe the
                            underlying studies, and the <Link to="/evidence">evidence explorer</Link> lets
                            you review supporting, conflicting and missing evidence.
                        </p>
                        <p className="portal-contribute-link">
                            <a href="https://github.com/neurogenomics/Rare-Disease-Web-Portal" target="_blank" rel="noopener noreferrer">
                                Contribute to this project on GitHub <Launch fontSize="inherit" />
                            </a>
                        </p>
                        <Logos />
                    </Card>
                    <Card className="portal-information-card">
                        <h2>Contact</h2>
                        <a className="portal-lab-logo" href="https://www.neurogenomics.co.uk" target="_blank" rel="noopener noreferrer">
                            <img src="/logos/logo_neurogenomicslab.png" alt="Neurogenomics Lab logo" />
                        </a>
                        <p>
                            UK Dementia Research Institute<br />
                            Department of Brain Sciences<br />
                            Faculty of Medicine, Imperial College London
                        </p>
                        <p className="portal-contact-line">
                            <Email fontSize="small" /> <a href="mailto:nskene@ic.ac.uk">nskene@ic.ac.uk</a>
                        </p>
                        <p className="portal-contact-line">
                            <Place fontSize="small" />
                            <a href="https://maps.app.goo.gl/Fxs7yTVidBDvthjZ9" target="_blank" rel="noopener noreferrer">
                                Sir Michael Uren Hub, Imperial College London, London, UK – W12 0BZ
                            </a>
                        </p>
                        <div className="portal-social-links">
                            <a href="https://github.com/neurogenomics" target="_blank" rel="noopener noreferrer" aria-label="Neurogenomics on GitHub"><GitHub /></a>
                            <a href="https://x.com/n_skene" target="_blank" rel="noopener noreferrer" aria-label="Nathan Skene on X"><X /></a>
                        </div>
                    </Card>
                </div>
            </Content>
            <CustomFooter />
        </Layout>
    );
}
