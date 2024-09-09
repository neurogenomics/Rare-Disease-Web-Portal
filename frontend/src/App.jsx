import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PhenotypePage from "./pages/PhenotypePage";
import CelltypePage from "./pages/CelltypePage";
import GenePage from "./pages/GenePage";
import SeverityPage from "./pages/SeverityPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/phenotype" element={<PhenotypePage />} />
                <Route path="/celltype" element={<CelltypePage />} />
                <Route path="/gene" element={<GenePage />} />
                <Route path="/severity/query" element={<SeverityPage />} />
                <Route
                    path="/severity/query/:search"
                    element={<SeverityPage />}
                />
                <Route path="/severity" element={<SeverityPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
