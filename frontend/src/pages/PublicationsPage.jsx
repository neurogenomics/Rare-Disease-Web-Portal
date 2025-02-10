import React from "react";
import CustomHeader from "../components/utilities/Header";
import { Layout } from "antd";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BackgroundAnimation from "../components/BackgroundAnimation";

const { Content } = Layout;

// Description ~50words
const publications = [
    {
        title: "Harnessing generative AI to annotate the severity of all phenotypic abnormalities within the Human Phenotype Ontology",
        description: "Using GPT-4, we systematically annotated the severity of all Human Phenotype Ontology (HPO) phenotypes based on clinical characteristics and frequency. Benchmarking showed high accuracy (89–100% recall). A novel severity scoring system enables prioritization of the most detrimental phenotypes, aiding gene therapy selection and therapeutic intervention efforts.",
        authors: "Kitty B Murphy, Brian M Schilder, Nathan G Skene",
        journal: "medRxiv",
        year: 2024,
        doi: "https://doi.org/10.1101/2024.06.10.24308475"
    },
    {
        title: "Identification of cell type-specific gene targets underlying thousands of rare diseases and subtraits",
        description: "Rare diseases are understudied due to their diversity and low prevalence. Using the Human Phenotype Ontology and single-cell transcriptomics, we conducted >688,000 enrichment tests, identifying >13,888 cell type-phenotype associations. We introduce a pipeline for gene target prioritization and provide R packages to enhance accessibility.",
        authors: "Kitty B. Murphy, Robert Gordon-Smith, Jai Chapman, Momoko Otani, Brian M. Schilder, Nathan G. Skene",
        journal: "medRxiv",
        year: 2023,
        doi: "https://doi.org/10.1101/2023.02.13.23285820"
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
                                    <p><strong>DOI: </strong><a href={pub.doi} target="_blank" className="text-blue-500 hover:underline">{pub.doi}</a></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Content>
        </div>
    );
}