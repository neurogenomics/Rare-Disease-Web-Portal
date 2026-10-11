import { useState } from "react";
import { Link } from "react-router-dom";
import MainLogo from "./MainLogo";
import '../../styles/portal-nav.css';
const groups = [
  {label:'Explore biology',items:[['phenotype','Phenotypes','/phenotype'],['celltype','Cell types','/celltype'],['gene','Genes','/gene'],['severity','Severity','/severity'],['gene-browser','Gene browser','/gene-browser']]},
  {label:'Evidence',items:[['approved-therapies','Treatment evidence','/evidence'],['variants','Genes & variants','/evidence?tab=variants'],['gene-therapy-targets','Modality requirements','/evidence?tab=modalities'],['methods','Methods & coverage','/evidence?tab=methods']]},
];
export default function CustomHeader({activePageKey}) {
  const [open,setOpen]=useState(false);
  return <header className="rd-header"><Link to="/" className="rd-logo-link" aria-label="Rare disease portal home"><MainLogo /></Link>
    <button type="button" className="rd-menu-toggle" aria-label="Toggle site navigation" aria-expanded={open} aria-controls="rd-navigation" onClick={()=>setOpen(!open)}>Menu {open?'−':'+'}</button>
    <nav id="rd-navigation" className={'rd-navigation'+(open?' is-open':'')} aria-label="Main navigation">
      <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
      {groups.map(group=><details className="rd-nav-group" key={group.label}><summary>{group.label}</summary><div>{group.items.map(([key,label,path])=><Link to={path} key={key} aria-current={activePageKey===key?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}</div></details>)}
      <Link to="/publications" aria-current={activePageKey==='publications'?'page':undefined}>Publications</Link><Link to="/about" aria-current={activePageKey==='about'?'page':undefined}>About</Link>
    </nav>
  </header>;
}
