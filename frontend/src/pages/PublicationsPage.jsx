import { useEffect } from "react";
import CustomHeader from "../components/utilities/Header";
import { Breadcrumb, Card, Layout } from "antd";
import { Link } from "react-router-dom";
import CustomFooter from "../components/utilities/Footer";

const { Content } = Layout;

// Description ~50words
const publications = [
    {
        title: "Using GPT-4 to annotate the severity of all phenotypic abnormalities within the human phenotype ontology",
        description: "This work uses GPT-4 to annotate clinical characteristics of HPO terms and proposes a phenotype severity scheme. The portal retains these annotations as historical research data. Severity classes and scores require independent validation and are not calibrated treatment-priority measures; see Methods & coverage for the current interpretation.",
        authors: "Kitty B Murphy, Brian M Schilder, Nathan G Skene",
        journal: "Frontiers in Digital Health",
        year: 2026,
        doi: "https://doi.org/10.3389/fdgth.2026.1794934"
    },
    {
        title: "Cell type-specific contextualisation of the human phenome: towards the systematic treatment of all rare diseases",
        description: "This study combines disease-linked phenotype and gene evidence with single-cell expression atlases to nominate cellular contexts and therapeutic research targets. The portal exposes these associations with their atlas, signed estimates and source limits. Concordance with known treatments does not independently validate cellular causality or predict clinical efficacy.",
        authors: "Brian M. Schilder, Kitty B. Murphy, Hiranyamaya Dash, Yichun Zhang, Robert Gordon-Smith, Jai Chapman, Momoko Otani, Nathan G. Skene",
        journal: "Genome Medicine",
        year: 2026,
        doi: "https://doi.org/10.1186/s13073-026-01692-0"
    }
    // Add more publications as needed
];

export default function PublicationsPage() {
    useEffect(() => {
        document.title = "Publications · Rare Disease Celltyping Portal";
    }, []);
    return (
        <Layout className="portal-page portal-information-page">
            <CustomHeader activePageKey="publications" />
            <Content className="portal-information-content">
                <Breadcrumb items={[{ title: <Link to="/">Home</Link> }, { title: "Publications" }]} />
                <Card className="portal-information-card portal-publication-intro">
                    <h1>Publications</h1>
                    <p>
                        Studies underlying the portal&apos;s phenotype and cellular-context data.
                        Read <Link to="/evidence?tab=methods">methods and source coverage</Link> for
                        the current interpretation, then inspect the <Link to="/evidence">treatment evidence</Link>.
                    </p>
                </Card>
                <div className="portal-publication-list">
                    {publications.map((pub) => (
                        <Card key={pub.doi} className="portal-information-card">
                            <article>
                                <h2><a href={pub.doi} target="_blank" rel="noopener noreferrer">{pub.title}</a></h2>
                                <p>{pub.description}</p>
                                <dl className="portal-publication-details">
                                    <div><dt>Authors</dt><dd>{pub.authors}</dd></div>
                                    <div><dt>Journal</dt><dd>{pub.journal}, {pub.year}</dd></div>
                                    <div><dt>DOI</dt><dd><a href={pub.doi} target="_blank" rel="noopener noreferrer">{pub.doi}</a></dd></div>
                                </dl>
                            </article>
                        </Card>
                    ))}
                </div>
            </Content>
            <CustomFooter />
        </Layout>
    );
}
