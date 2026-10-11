import { Link, useLocation } from 'react-router-dom';
import geneIdentifiers from '../data/evidence/geneIdentifiers.json';
import geneList from '../data/evidence/geneList.json';
function evidenceDestination(pathname, search) {
  const current = new URLSearchParams(search);
  const selection = current.get('jump');
  const params = new URLSearchParams();
  if (pathname === '/gene' && selection) {
    const symbol = geneIdentifiers[selection.replace(/^NCBIGene:/, '')] || geneList.find(gene => gene.toLowerCase() === selection.toLowerCase());
    if (symbol) params.set('gene', symbol);
  }
  if (pathname === '/phenotype' && /^HP:\d{7}$/.test(selection || '')) params.set('hpo', selection);
  if (pathname === '/celltype' && selection) {
    params.set('cell', selection);
    const atlas = { DH: 'DescartesHuman', HCL: 'HumanCellLandscape' }[current.get('db_type')] || current.get('db_type') || 'DescartesHuman';
    params.set('atlas', atlas);
  }
  return '/evidence?' + params.toString();
}
export default function EvidenceEntry(){
  const location=useLocation();
  if(!['/gene','/phenotype','/celltype','/gene-browser','/severity'].includes(location.pathname))return null;
  const current=new URLSearchParams(location.search);
  const selection=current.get('jump');
  return <aside style={{position:'fixed',bottom:14,right:14,zIndex:20,background:'#143a40',color:'#fff',padding:'10px 16px',borderRadius:8,boxShadow:'0 3px 18px #0002',fontSize:13,maxWidth:'calc(100vw - 28px)'}} aria-label="Follow evidence">
    <Link style={{color:'white'}} to={evidenceDestination(location.pathname,location.search)} onClick={event => {
      // Older explorers update history directly; resolve their current selection at click time.
      event.currentTarget.href = evidenceDestination(window.location.pathname,window.location.search);
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        window.location.assign(event.currentTarget.href);
      }
    }}>Follow {selection||'this biology'} into therapeutic evidence →</Link>
  </aside>;
}
