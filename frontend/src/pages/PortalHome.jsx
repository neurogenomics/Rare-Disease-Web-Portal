import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomHeader from '../components/utilities/Header.jsx';
import CustomFooter from '../components/utilities/Footer.jsx';
import '../styles/portal-home.css';

const paths=[
  ['01','Phenotype','Start with the feature you want to explain.','/phenotype'],
  ['02','Gene & variant','Inspect the allele, transcript and disease assertion.','/variants'],
  ['03','Cell context','Explore the atlas association and its limits.','/celltype'],
  ['04','Intervention','Follow delivery, mechanism and measured outcomes.','/evidence'],
];
export default function PortalHome(){
  useEffect(()=>{document.title='Rare Disease Celltyping Portal · Home';},[]);
  return <div className="rd-home">
    <CustomHeader activePageKey="home" />
    <main>
      <section className="rd-hero"><div className="rd-kicker">Explore rare-disease biology</div>
        <h1>From phenotype to therapeutic evidence</h1>
        <p>Connect rare-disease phenotypes, genes, variants and cell types to the interventions tested in people. See what each connection establishes, where it breaks, and what is still unknown.</p>
        <div className="rd-actions"><Link className="rd-primary" to="/evidence">Explore therapeutic evidence <span>↗</span></Link><Link to="/variants?gene=SCN1A">Start with a gene →</Link></div>
      </section>
      <section className="rd-chain" aria-label="Ways to explore">{paths.map(([n,title,description,url])=><Link key={n} to={url}><span className="rd-step">{n}</span><h2>{title}<span>↗</span></h2><p>{description}</p></Link>)}</section>
      <section className="rd-questions"><div className="rd-question-intro"><div className="rd-kicker">Example evidence questions</div><h2>Clinical benefit is one part of the mechanism</h2><p>An effective treatment may act in a predicted cell, replace a missing protein from another tissue, or compensate through a different pathway. The explorer separates those possibilities.</p></div>
        <div className="rd-example-list">
          <Link to="/evidence?therapy=patisiran-attr"><span>Indirect action</span><h3>Can liver-directed RNA lowering improve neuropathy?</h3><p>Patisiran · TTR · peripheral nerve phenotype</p><b>Inspect the chain →</b></Link>
          <Link to="/evidence?therapy=tofersen-sod1"><span>Clinical & tissue evidence</span><h3>Does target engagement establish clinical benefit?</h3><p>Tofersen · SOD1 · motor neurons</p><b>Compare the evidence →</b></Link>
          <Link to="/gene-therapy?gene=SCN1A&modality=aso-upregulation"><span>Mechanism & direction</span><h3>When is increasing a transcript a sensible hypothesis?</h3><p>Disease-specific mechanism · remaining allele · dose window</p><b>Inspect the requirements →</b></Link>
        </div>
      </section>
      <section className="rd-tools"><Link to="/variants"><h3>Variants, in context ↗</h3><p>ClinVar assertions, reference coordinates, canonical exons and explicit limits on phenotype attribution.</p></Link><Link to="/gene-therapy"><h3>Modality requirements ↗</h3><p>Compare RNA, gene, editing, protein and cell approaches. Missing evidence stays visible.</p></Link><Link to="/evidence?tab=methods"><h3>Methods & coverage ↗</h3><p>Inspect source dates, review coverage and the difference between association and causal rescue.</p></Link></section>
    </main>
      <section className="rd-home-notice" aria-label="Research scope"><p>Research evidence exploration. Rankings describe evidence and compatibility requirements, not individual treatment recommendations.</p><nav aria-label="More about the portal"><Link to="/about">About</Link><Link to="/publications">Publications</Link><Link to="/severity">Phenotype severity</Link><a href="https://github.com/neurogenomics/Rare-Disease-Web-Portal" target="_blank" rel="noreferrer">Source code ↗</a></nav></section>
    <CustomFooter />
  </div>;
}
