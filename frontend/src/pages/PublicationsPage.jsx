import React from "react";
import CustomHeader from "../components/utilities/Header";
import { Layout } from "antd";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BackgroundAnimation from "../components/BackgroundAnimation";

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
    return (
        <div className="relative">
            <CustomHeader activePageKey="publications" />
            <div className="fixed inset-0 -z-10">
                <BackgroundAnimation />
            </div>
            <Content className="relative z-10 p-12 bg-center">
                <div className="bg-white bg-opacity-95 p-10 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold flex items-center mb-3">
                        <ArticleOutlinedIcon fontSize="large" className="mr-4" />
                        Publications
                    </h1>
                    <br />
                    <div className="space-y-8 font-mono" style= {{ marginLeft: "3.4em" }}>
                        {publications.map((pub, index) => (
                            <div key={index} className="border-b pb-7">
                                <p className="font-bold mb-1 text-xl">{pub.title}</p>
                                <p className="mb-2 text-sm">{pub.description}</p>
                                <div className="ml-3">
                                    <p><strong>Authors:</strong> {pub.authors}</p>
                                    <p><strong>Journal:</strong> {pub.journal}</p>
                                    <p><strong>Year:</strong> {pub.year}</p>
                                    <p><strong>DOI: </strong><a href={pub.doi} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{pub.doi}</a></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Content>
        </div>
    );
}
