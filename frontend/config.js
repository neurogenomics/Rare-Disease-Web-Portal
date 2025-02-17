// Ontology API
export const ONTOLOGY_API_URL = "https://ontology.jax.org"; // DO NOT change this, this is a third-party API providing ontology data

// Backend API
const LOCAL_API_URL = "http://127.0.0.1:8000"; // Dev, local
const SERVER_API_URL = "https://neurogenomics-ukdri-api.dsi.ic.ac.uk"; // Prod

export const BASE_API_URL = import.meta.env.DEV
    ? LOCAL_API_URL
    : SERVER_API_URL;
