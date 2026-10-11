import { Alert } from 'antd';
import { USE_PORTAL_SNAPSHOTS } from '../lib/portalAPI.js';

export default function SnapshotScopeNotice() {
  if (!USE_PORTAL_SNAPSHOTS) return null;
  return <Alert className="portal-source-notice" type="info" showIcon style={{ marginBottom: 16 }}
    message="Exploring published evidence snapshots"
    description={<>HPO uses the frozen September 2026 ontology. Gene–phenotype and expression views cover the 92-gene evidence panel; disease labels and gene descriptions may be unavailable. Reverse cell views cover signed source associations with q &lt; 0.05. Legacy severity scores are unvalidated research annotations. An empty panel result is not genome-wide absence, cell causality, or evidence of treatment response. <a href="/evidence?tab=methods">Review sources and limits</a>.</>} />;
}
