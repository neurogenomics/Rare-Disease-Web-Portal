# Rare Disease Web Portal

A web portal for rare diseases.
It's a university project from Imperial College London 2023/24 70095 MSc Computing (Specialism) Individual Project.
This is the code part, please contact me if you're interested in the whole report.

-   **Project Title**: Development of a Public Web Portal for Investigating Rare Diseases, the Cell Types That Cause Them and the Genes Which Can Be Targeted With Therapeutics
-   **Supervisor**: [Nathan Skene](https://github.com/NathanSkene)
-   **Author**: [Yichun Zhang](https://github.com/missyQWQ)
-   **Contributors**: [Hiranyamaya (Hiru) Dash](https://github.com/HDash),  [Brian Schilder](https://github.com/bschilder)

**This project has already deployed at [Rare Disease Web Portal](https://neurogenomics-ukdri.dsi.ic.ac.uk/)**

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

##  Setup instructions

### 1. Install dependencies

1. Install [`MongoDB Compass GUI`](https://www.mongodb.com/products/tools/compass)
2. [Optional] 
    - Install conda env: `conda env create -f https://raw.githubusercontent.com/neurogenomics/Rare-Disease-Web-Portal/refs/heads/main/conda/portal_backend.yml`
    - Activate conda env: `conda activate portal_backend`

### 2.1 Run locally
#### (1) Clone this repo
```bash
git clone https://github.com/neurogenomics/Rare-Disease-Web-Portal.git
```
#### (2) Set up MongoDB database
```
1. Open MongoDB Compass
2. Create a new connection with URI: `mongodb://localhost:27017/`
3. Download the data files from Zenodo [https://zenodo.org/records/15147825]
Further instructions on how to setup the database can be found in the Zenodo record description.
```
#### (3) Run backend
```bash
cd backend
uvicorn main:app --reload
```
#### (4) Run frontend
```bash
cd frontend
npm i
npm run dev
```
#### (5) Enjoy your web portal ☺️

Website: `http://localhost:5173/`  
API: `http://127.0.0.1:8000/docs#/`

### 2.2 Run on server
#### (1) Clone this repo
```bash
git clone https://github.com/neurogenomics/Rare-Disease-Web-Portal.git
```
#### (2) Set up MongoDB database

1. Download MongoDB Compass
2. Create a new connection with URI: `mongodb://146.169.8.136:8917/`
3. No need to do anything about data files as they are already uploaded to the database on the server `146.169.8.136`

#### (3) Run backend

1. Go to your local backend folder
2. Comment & uncomment corresponding codes in `config.py` and `main.py`, and save changes
3. Copy & paste all backend files, including `config.py`, `main.py`, `database.py`, `model.py`, and `requirements.txt`, from your local space to the server
4. Run `tmux && python3 main.py` under the backend folder in the server (`tmux` keeps the process running in the background).

#### (4) Run frontend

1. Go to your local frontend folder
2. Comment & uncomment corresponding codes in `config.js`, and save changes
3. Run `npm run build` under the frontend folder in your local, then a new "dist" folder will be generated automatically
4. Go to `/var/www/html` in the server
5. Copy & paste all files in the `dist` folder(at local) to `/var/www/html` (at server)
6. Wrap folder `models` with a new folder `public`, so the structure under `/var/www/html` should look like:
```bash
.
├── index.html
├── assets
└── public
    └── models
```
#### (5) Enjoy your web portal ☺️

Website: `https://neurogenomics-ukdri.dsi.ic.ac.uk/`  
API: `https://neurogenomics-ukdri-api.dsi.ic.ac.uk/docs`  
Server: `146.169.8.136`

## Previews

Preview images of the web portal.

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
