# Rare Disease Web Portal

A web portal for rare diseases.
It's a university project from Imperial College London 2023/24 70095 MSc Computing (Specialism) Individual Project.
This is the code part, please contact me if you're interested in the whole report.

-   Project Title: Development of a Public Web Portal for Investigating Rare Diseases, the Cell Types That Cause Them and the Genes Which Can Be Targeted With Therapeutics
-   Supervisor: Nathan Skene
-   Author: [Yichun Zhang](https://github.com/missyQWQ)

## Abstract

Rare diseases (RDs) collectively affect millions of individuals worldwide, presenting significant challenges in diagnostics and treatment due to their genetic and phenotypic diversity. Despite advances in cellular and genetic research, current platforms remain fragmented, often lacking effective data integration or intuitive visualizations, which hinders the exploration of complex relationships between phenotypes and genes. Additionally, most platforms do not incorporate cell type data and phenotype severity data, limiting their scope and utility for rare disease research.

This paper presents the development of a public web portal that introduces a novel, flexible query system, allowing users to explore relationships bidirectionally between phenotypes, cell types, genes, and phenotype severity, which is a feature absent in existing platforms. Users can initiate queries from any entry point (whether starting from phenotypes, cell types, genes, or phenotype severity), and follow relationships across these data types, offering a comprehensive and dynamic way to explore rare disease data. The portal integrates datasets including the Human Phenotype Ontology (HPO) along with data on phenotype severity and the intricate relationships between phenotypes, cells, genes, and rare diseases. Advanced visualization tools such as interactive network graphs, bar charts, and heatmaps provide users with an intuitive and interactive experience.

Compared to existing tools, this public web portal improves accessing performance, focus on user-friendly design, covers more data scope. Its key innovations include large data integration, interactive data visualization, flexible and multidirectional query functionality. This portal is designed for diverse users, including clinicians and molecular biologists, and aims to drive progress in rare disease research, personalized diagnostics, and therapeutic development by offering a powerful, integrated resource for RD data exploration.

## Directory Structure

```bash
.
├── backend
│   ├── database.py
│   ├── main.py
│   ├── model.py
│   └── requirements.txt
└── frontend
    ├── index.html
    ├── config.js
    ├── public
    │   └── models
    │       ├── dna1
    │       └── dna2
    └── src
        ├── App.css
        ├── App.jsx
        ├── assets
        ├── index.css
        ├── main.jsx
        ├── components
        │   ├── BackgroundAnimation.jsx
        │   ├── CellTree.jsx
        │   ├── DnaModel.jsx
        │   ├── DnaModel2.jsx
        │   ├── GeneTable.jsx
        │   ├── GeneTable1.jsx
        │   ├── GeneTable2.jsx
        │   ├── GeneTree.jsx
        │   ├── HomeOption.jsx
        │   ├── PhenotypeTableDisease.jsx
        │   ├── PhenotypeTableDisease1.jsx
        │   ├── PhenotypeTableDisease2.jsx
        │   ├── PhenotypeTree.jsx
        │   ├── SeverityCollapsibleTable.jsx
        │   ├── SeverityNetWork.jsx
        │   ├── SeveritySlider.jsx
        │   ├── SeveritySlider1.jsx
        │   ├── SeverityTable.jsx
        │   └── VioletButton.jsx
        └── pages
            ├── CelltypePage.jsx
            ├── GenePage.jsx
            ├── HomePage.jsx
            ├── PhenotypePage.jsx
            └── SeverityPage.jsx

```

## Run it!!

```bash
# Run Backend
cd backend
uvicorn main:app --reload

# Run Frontend
cd frontend
npm run dev
```

## Previews

### Home Page

![home_page](/Images/HomePage.png)

### Search by Phenotype Page

![phenotype_page_overview](/Images/PhenotypePage_Overview.png)
![phenotype_page_cellgene](/Images/PhenotypePage_CellGene.png)
![phenotype_page_cell](/Images/PhenotypePage_Cell.png)
![phenotype_page_disease](/Images/PhenotypePage_Disease.png)
![phenotype_page_gene](/Images/PhenotypePage_Gene.png)

### Search by Celltype Page

![cell_page_phenotype](/Images/CellPage_Phenotype.png)
![cell_page_gene](/Images/CellPage_Gene.png)

### Search by Gene Page

![gene_page_cell](/Images/GenePage_Cell.png)
![gene_page_disease](/Images/GenePage_Disease.png)
![gene_page_phenotype](/Images/GenePage_Phenotype.png)

### Search by Severity Page

![severity_page_overview](/Images/SeverityPage_Overview.png)
![severity_page_details](/Images/SeverityPage_Details.png)
