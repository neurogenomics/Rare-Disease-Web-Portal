import EvidenceWorkbench from "./EvidenceWorkbench";
// Retired heuristic views are preserved in Git history; use source-scoped evidence.
export default function ApprovedTherapiesPage() { return <EvidenceWorkbench initialTab="therapies" />; }
