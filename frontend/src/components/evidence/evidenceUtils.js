import { useEffect, useState } from 'react';

const indexCache = new Map();

export function useEvidenceJson(url, cache = false) {
  const [state, setState] = useState({ data: null, loading: false, error: null, url: null });
  useEffect(() => {
    if (!url) return;
    if (cache && indexCache.has(url)) {
      setState({ data: indexCache.get(url), loading: false, error: null, url });
      return;
    }
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null, url });
    fetch(url, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`Snapshot unavailable (${response.status}).`); return response.json(); })
      .then((data) => { if (cache) indexCache.set(url, data); setState({ data, loading: false, error: null, url }); })
      .catch((error) => { if (error.name !== 'AbortError') setState({ data: null, loading: false, error: error.message, url }); });
    return () => controller.abort();
  }, [url, cache]);
  return state.url === url ? state : { data: null, loading: Boolean(url), error: null };
}

export function useEvidenceIndex(name, needed = true) {
  const [enabled, setEnabled] = useState(needed);
  useEffect(() => { if (needed) setEnabled(true); }, [needed]);
  return useEvidenceJson(enabled ? `/data/evidence/${name}.json` : null, true);
}

export const number = (value) => Number.isFinite(Number(value)) && value != null ? Number(value).toLocaleString('en-GB') : 'Unknown';
export const humanize = (value) => String(value || 'Unknown').replaceAll('_', ' ').toLowerCase();
export const sourceDate = (value) => value ? String(value).slice(0, 10) : 'Date unavailable';
export const geneTokens = (value) => String(value || '').split(/[\s/,;]+/).filter(Boolean);
export function downloadJson(value, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function variantLocation(variant, reference) {
  const locations = (variant.alleles || []).flatMap((allele) => allele.locations || []);
  return locations.find((location) => location.assembly_name === (reference?.assembly || 'GRCh38') && String(location.chr) === String(reference?.chromosome) && Number(location.start) > 0) || null;
}
