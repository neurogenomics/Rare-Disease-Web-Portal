/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MainLogo from "./MainLogo";
import '../../styles/portal-nav.css';
const groups = [
  {label:'Explore biology',items:[['phenotype','Phenotypes','/phenotype'],['celltype','Cell types','/celltype'],['gene','Genes','/gene'],['severity','Severity','/severity'],['gene-browser','Gene browser','/gene-browser']]},
  {label:'Evidence',items:[['approved-therapies','Treatment evidence','/evidence'],['variants','Genes & variants','/evidence?tab=variants'],['gene-therapy-targets','Modality requirements','/evidence?tab=modalities'],['methods','Methods & coverage','/evidence?tab=methods']]},
];
export default function CustomHeader({activePageKey}) {
  const [open,setOpen]=useState(false);
  const location = useLocation();
  const navigationRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    setOpen(false);
    navigationRef.current?.querySelectorAll('details[open]').forEach(group => { group.open = false; });
  }, [location.pathname, location.search]);
  const closeNavigation = event => {
    if (event.key !== 'Escape') return;
    const summary = event.target.closest('details')?.querySelector('summary');
    navigationRef.current?.querySelectorAll('details[open]').forEach(group => { group.open = false; });
    setOpen(false);
    (open ? menuRef.current : summary)?.focus();
  };
  return <header className="rd-header"><Link to="/" className="rd-logo-link" aria-label="Rare disease portal home"><MainLogo /></Link>
    <button ref={menuRef} type="button" className="rd-menu-toggle" aria-label="Toggle site navigation" aria-expanded={open} aria-controls="rd-navigation" onClick={()=>setOpen(!open)} onKeyDown={closeNavigation}>Menu {open?'−':'+'}</button>
    <nav ref={navigationRef} id="rd-navigation" className={'rd-navigation'+(open?' is-open':'')} aria-label="Main navigation" onKeyDown={closeNavigation}>
      <Link to="/" aria-current={activePageKey==='home'?'page':undefined} onClick={()=>setOpen(false)}>Home</Link>
      {groups.map(group=><details className="rd-nav-group" data-active={group.items.some(([key]) => key === activePageKey) || undefined} key={group.label}><summary>{group.label}</summary><div>{group.items.map(([key,label,path])=><Link to={path} key={key} aria-current={activePageKey===key?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}</div></details>)}
      <Link to="/publications" aria-current={activePageKey==='publications'?'page':undefined}>Publications</Link><Link to="/about" aria-current={activePageKey==='about'?'page':undefined}>About</Link>
    </nav>
  </header>;
}
