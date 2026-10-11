import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import PortalHome from "./pages/PortalHome";
import { Button, Layout, Result } from 'antd';
import CustomHeader from './components/utilities/Header';
import CustomFooter from './components/utilities/Footer';
const PhenotypePage = lazy(() => import('./pages/PhenotypePage'));
const CelltypePage = lazy(() => import('./pages/CelltypePage'));
const GenePage = lazy(() => import('./pages/GenePage'));
const SeverityPage = lazy(() => import('./pages/SeverityPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GeneBrowserPage = lazy(() => import('./pages/GeneBrowserPage'));
const EvidenceWorkbench = lazy(() => import('./pages/EvidenceWorkbench'));

/* eslint-disable react/prop-types */
function ExplorerRoute({ Page }) {
    const location = useLocation();
    // Legacy explorers initialize their selection from the URL on mount.
    // A changed query must also hydrate when following an internal link or Back.
    return <Page key={`${location.pathname}${location.search}`} />;
}

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Layout style={{minHeight:'100vh'}}><CustomHeader /><Layout.Content style={{padding:24}}><p role="status">Loading portal page…</p></Layout.Content><CustomFooter /></Layout>}>
            <Routes>
                <Route path="/" element={<PortalHome />} />
                <Route path="/phenotype" element={<ExplorerRoute Page={PhenotypePage} />} />
                <Route path="/celltype" element={<ExplorerRoute Page={CelltypePage} />} />
                <Route path="/gene" element={<ExplorerRoute Page={GenePage} />} />
                <Route path="/severity/query" element={<ExplorerRoute Page={SeverityPage} />} />
                <Route
                    path="/severity/query/:search"
                    element={<ExplorerRoute Page={SeverityPage} />}
                />
                <Route path="/severity" element={<ExplorerRoute Page={SeverityPage} />} />
                <Route path="/evidence" element={<EvidenceWorkbench />} />
                <Route path="/gene-therapy" element={<EvidenceWorkbench initialTab="modalities" />} />
                <Route path="/approved-therapies" element={<EvidenceWorkbench initialTab="therapies" />} />
                <Route path="/variants" element={<EvidenceWorkbench initialTab="variants" />} />
                <Route path="/gene-browser" element={<ExplorerRoute Page={GeneBrowserPage} />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Layout style={{minHeight:'100vh'}}><CustomHeader /><Layout.Content><Result status="404" title={<h1>Page not found</h1>} subTitle="Choose a portal page to continue exploring." extra={<><Link to="/"><Button>Home</Button></Link> <Link to="/evidence"><Button type="primary">Evidence explorer</Button></Link></>} /></Layout.Content><CustomFooter /></Layout>} />
            </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
