import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PortalHome from "./pages/PortalHome";
import EvidenceEntry from "./components/EvidenceEntry";
const PhenotypePage = lazy(() => import('./pages/PhenotypePage'));
const CelltypePage = lazy(() => import('./pages/CelltypePage'));
const GenePage = lazy(() => import('./pages/GenePage'));
const SeverityPage = lazy(() => import('./pages/SeverityPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GeneBrowserPage = lazy(() => import('./pages/GeneBrowserPage'));
const EvidenceWorkbench = lazy(() => import('./pages/EvidenceWorkbench'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<main style={{padding:'4rem'}}>Loading evidence explorer…</main>}>
            <Routes>
                <Route path="/" element={<PortalHome />} />
                <Route path="/phenotype" element={<PhenotypePage />} />
                <Route path="/celltype" element={<CelltypePage />} />
                <Route path="/gene" element={<GenePage />} />
                <Route path="/severity/query" element={<SeverityPage />} />
                <Route
                    path="/severity/query/:search"
                    element={<SeverityPage />}
                />
                <Route path="/severity" element={<SeverityPage />} />
                <Route path="/evidence" element={<EvidenceWorkbench />} />
                <Route path="/gene-therapy" element={<EvidenceWorkbench initialTab="modalities" />} />
                <Route path="/approved-therapies" element={<EvidenceWorkbench initialTab="therapies" />} />
                <Route path="/variants" element={<EvidenceWorkbench initialTab="variants" />} />
                <Route path="/gene-browser" element={<GeneBrowserPage />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
            <EvidenceEntry />
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
