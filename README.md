# Rare Disease Web Portal

A web portal for rare diseases.
It's a university project from Imperial College London 2023/24 70095 MSc Computing (Specialism) Individual Project.
This is the code part, please contact me if you're interested in the whole report.

-   Project Title: Development of a Public Web Portal for Investigating Rare Diseases, the Cell Types That Cause Them and the Genes Which Can Be Targeted With Therapeutics
-   Supervisor: [Nathan Skene](https://github.com/NathanSkene)
-   Author: [Yichun Zhang](https://github.com/missyQWQ)

## 1. Abstract

Rare diseases (RDs) collectively affect millions of individuals worldwide, presenting significant challenges in diagnostics and treatment due to their genetic and phenotypic diversity. Despite advances in cellular and genetic research, current platforms remain fragmented, often lacking effective data integration or intuitive visualizations, which hinders the exploration of complex relationships between phenotypes and genes. Additionally, most platforms do not incorporate cell type data and phenotype severity data, limiting their scope and utility for rare disease research.

This paper presents the development of a public web portal that introduces a novel, flexible query system, allowing users to explore relationships bidirectionally between phenotypes, cell types, genes, and phenotype severity, which is a feature absent in existing platforms. Users can initiate queries from any entry point (whether starting from phenotypes, cell types, genes, or phenotype severity), and follow relationships across these data types, offering a comprehensive and dynamic way to explore rare disease data. The portal integrates datasets including the Human Phenotype Ontology (HPO) along with data on phenotype severity and the intricate relationships between phenotypes, cells, genes, and rare diseases. Advanced visualization tools such as interactive network graphs, bar charts, and heatmaps provide users with an intuitive and interactive experience.

Compared to existing tools, this public web portal improves accessing performance, focus on user-friendly design, covers more data scope. Its key innovations include large data integration, interactive data visualization, flexible and multidirectional query functionality. This portal is designed for diverse users, including clinicians and molecular biologists, and aims to drive progress in rare disease research, personalized diagnostics, and therapeutic development by offering a powerful, integrated resource for RD data exploration.

## 2. Directory Structure

```bash
.
├── backend
│   ├── database.py
│   ├── main.py
│   ├── model.py
│   ├── config.py
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

## 3. Run It!!
### 3.1 Run in Local
(1) Clone this repo
```bash
git clone https://github.com/neurogenomics/Rare-Disease-Web-Portal.git
```
(2) Set up MongoDB database
```bash
1. Download MongoDB Compass
2. Create a new connection with URI: mongodb://localhost:27017/
3. Upload data files (Please contact me for the data files as they are too large to upload in GitHub)
```
(3) Run backend
```bash
cd backend
uvicorn main:app --reload
```
(4) Run frontend
```bash
cd frontend
npm i
npm run dev
```
(5) Enjoy your web portal ☺️
```bash
Website: http://localhost:5173/
API: http://127.0.0.1:8000/docs#/
```
### 3.2 Run in Server
(1) Clone this repo
```bash
git clone https://github.com/neurogenomics/Rare-Disease-Web-Portal.git
```
(2) Set up MongoDB database
```bash
1. Download MongoDB Compass
2. Create a new connection with URI: mongodb://146.169.8.136:8917/
3. No need to do anything about data files as they are already uploaded to the database on the server 146.169.8.136
```
(3) Run backend
```bash
1. Go to your local backend folder
2. Comment & uncomment corresponding codes in "config.py" and "main.py", and save changes
3. Copy & paste all backend files, including config.py, main.py, database.py, model.py, and requirements.txt, from your local space to the server
4. Run "python3 main.py" under the backend folder in the server, and use tmux to hold the process
```
(4) Run frontend
```bash
1. Go to your local frontend folder
2. Comment & uncomment corresponding codes in "config.js", and save changes
3. Run "npm run build" under the frontend folder in your local, then a new "dist" folder will be generated automatically
4. Go to "/var/www/html" in the server
5. Copy & paste all files in the "dist" folder(at local) to "/var/www/html"(at server)
6. Wrap folder "models" with a new folder "public", so the structure under "/var/www/html" should look like:
.
├── index.html
├── assets
└── public
    └── models
```
(5) Enjoy your web portal ☺️
```bash
Website: https://neurogenomics-ukdri.dsi.ic.ac.uk/
API: https://neurogenomics-ukdri-api.dsi.ic.ac.uk/docs
Server: 146.169.8.136
```

## 4. Previews

### 4.1 Home Page

![home_page](/Images/HomePage.png)

### 4.2 Search by Phenotype Page

![phenotype_page_overview](/Images/PhenotypePage_Overview.png)
![phenotype_page_cellgene](/Images/PhenotypePage_CellGene.png)
![phenotype_page_cell](/Images/PhenotypePage_Cell.png)
![phenotype_page_disease](/Images/PhenotypePage_Disease.png)
![phenotype_page_gene](/Images/PhenotypePage_Gene.png)

### 4.3 Search by Celltype Page

![cell_page_phenotype](/Images/CellPage_Phenotype.png)
![cell_page_gene](/Images/CellPage_Gene.png)

### 4.4 Search by Gene Page

![gene_page_cell](/Images/GenePage_Cell.png)
![gene_page_disease](/Images/GenePage_Disease.png)
![gene_page_phenotype](/Images/GenePage_Phenotype.png)

### 4.5 Search by Severity Page

![severity_page_overview](/Images/SeverityPage_Overview.png)
![severity_page_details](/Images/SeverityPage_Details.png)
