import { Button, Card, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import geneIdentifiers from '../data/evidence/geneIdentifiers.json';
import { biologicalContext, buildEvidenceHref, evidenceDestination } from '../lib/evidenceNavigation.js';

export default function EvidenceEntry() {
  const location = useLocation();
  if (!['/gene', '/phenotype', '/celltype', '/gene-browser', '/severity'].includes(location.pathname)) return null;
  const destination = evidenceDestination(location.pathname, location.search, { geneIdentifiers });
  const context = biologicalContext(destination.split('?')[1] || '');
  const label = context.get('gene') || context.get('hpo') || context.get('cell') || 'Selected biology';
  return <Card size="small" className="portal-evidence-entry" style={{ margin: '16px 0' }}>
    <Space direction="vertical" size={8}>
      <strong>Continue from {label}</strong>
      <span>Keep the selected gene, phenotype and exact atlas/cell context while reviewing the next evidence layer.</span>
      <Space wrap>
        <Link to={buildEvidenceHref({ tab: 'therapies' }, context)}><Button>Treatment evidence</Button></Link>
        <Link to={buildEvidenceHref({ tab: 'variants' }, context)}><Button>Variants and allele mechanisms</Button></Link>
        <Link to={buildEvidenceHref({ tab: 'modalities' }, context)}><Button>Therapeutic requirements</Button></Link>
      </Space>
    </Space>
  </Card>;
}
