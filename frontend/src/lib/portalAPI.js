import { BASE_API_URL } from '../../config.js';
import { createSnapshotPortal, SnapshotUnavailable } from './snapshotPortal.js';

// Local staging has no Mongo service. Source snapshots make its covered
// explorer paths reviewable without silently impersonating a live database.
// A Vercel preview may opt in with VITE_SNAPSHOT_EXPLORERS=true; an explicit
// VITE_API_BASE_URL keeps API-backed development available.
export const USE_PORTAL_SNAPSHOTS = import.meta.env.VITE_SNAPSHOT_EXPLORERS === 'true'
  || (import.meta.env.VITE_SNAPSHOT_EXPLORERS !== 'false' && import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL);

const nativeFetch = (...args) => globalThis.fetch(...args);
const snapshot = createSnapshotPortal(async path => {
  const response = await nativeFetch(path);
  if (!response.ok) throw new SnapshotUnavailable(`Published snapshot could not be loaded: ${path}`);
  return response.json();
});

function supportedOrigin(input) {
  const url = new URL(input, window.location.origin);
  return [new URL(BASE_API_URL).origin, 'https://ontology.jax.org', 'https://eutils.ncbi.nlm.nih.gov'].includes(url.origin);
}

export async function portalFetch(input, options) {
  if (USE_PORTAL_SNAPSHOTS && (!options?.method || options.method === 'GET') && supportedOrigin(input)) {
    try {
      const value = await snapshot.request(input);
      if (value !== undefined) return new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json', 'X-Portal-Evidence-Source': 'published-snapshot' } });
    } catch (error) {
      return new Response(JSON.stringify({ evidence_status: 'source_unavailable', detail: error.message }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }
  }
  return nativeFetch(input, options);
}

/** axios.get-compatible response surface for the existing read-only explorers. */
export async function portalGet(input, options) {
  const response = await portalFetch(input, { signal: options?.signal });
  const data = await response.json();
  if (!response.ok) {
    const error = new SnapshotUnavailable(data.detail || `Source request returned ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }
  return { data, status: response.status, headers: response.headers };
}
