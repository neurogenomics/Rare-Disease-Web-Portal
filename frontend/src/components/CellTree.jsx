import { useEffect, useState } from "react";
import { Alert, Tree, Input } from "antd";
import { portalGet, USE_PORTAL_SNAPSHOTS } from "../lib/portalAPI.js";
import { BASE_API_URL } from "../../config.js";

export default function CellTree({ db_type, onGetData, tourRefs = [] }) {
    const jump = new URLSearchParams(window.location.search).get('jump');
    const [search, setSearch] = useState(jump || '');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            portalGet(`${BASE_API_URL}/api/cell/type?celltype_name=${encodeURIComponent(search)}&db_type=${encodeURIComponent(db_type)}`)
                .then(({ data: response }) => {
                    if (!active) return;
                    const records = response.map(cell => ({ key: cell, title: cell.replaceAll('_', ' '), dataRef: { key: cell, title: cell.replaceAll('_', ' ') } }));
                    if (!USE_PORTAL_SNAPSHOTS && (!search || search.toLowerCase() === 'all')) records.unshift({ key: 'All', title: 'All cells' });
                    setData(records); setLoading(false);
                }).catch(failure => { if (active) { setData([]); setError(failure.message); setLoading(false); } });
        }, 200);
        return () => { active = false; clearTimeout(timer); };
    }, [search, db_type]);

    return <div style={{ marginBottom: 16 }}>
        <div ref={tourRefs[0]} className="mb-4"><Input.Search value={search} onChange={event => setSearch(event.target.value)} onSearch={setSearch} placeholder="Search exact atlas cell types" loading={loading} /></div>
        <div ref={tourRefs[1]} style={{ background: '#fff', padding: 10, borderRadius: 6 }}>
            <p className="font-semibold mb-2">Cell types</p>
            {error && <Alert type="warning" showIcon message="Cell source unavailable" description={error} />}
            {!loading && !error && !data.length && <p>No matching labels in this atlas source view.</p>}
            <Tree style={{ maxHeight: 450, overflowY: 'auto' }} treeData={data} selectedKeys={jump ? [jump] : []}
                onSelect={(keys, info) => { if (keys.length) onGetData(keys[0], info); }} />
        </div>
    </div>;
}
