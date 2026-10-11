// Ontology API
export const ONTOLOGY_API_URL = "https://ontology.jax.org"; // DO NOT change this, this is a third-party API providing ontology data

// Backend API
const LOCAL_API_URL = "http://127.0.0.1:8001"; // Dev, local
const SERVER_API_URL = "https://neurogenomics-ukdri-api.dsi.ic.ac.uk"; // Prod

// A preview can select its API without editing or deploying the live service.
// Evidence-workbench snapshots do not require this API.
export const BASE_API_URL = (import.meta.env.VITE_API_BASE_URL || (
    import.meta.env.DEV ? LOCAL_API_URL : SERVER_API_URL
)).replace(/\/$/, "");
