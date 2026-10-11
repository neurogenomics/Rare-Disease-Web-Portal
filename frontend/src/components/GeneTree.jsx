import { useEffect, useRef, useState } from "react";
import { Alert, Tree, Input } from "antd";
import { portalGet } from "../lib/portalAPI.js";
import { ONTOLOGY_API_URL } from "../../config.js";
import { urlParser } from "../scripts/urlHandlers.js";

export default function GeneTree({ onGetData, tourRefs = [] }) {
    const { jump } = urlParser('gene');
    const [search, setSearch] = useState(jump || '');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);
    const getData = useRef(onGetData);
    getData.current = onGetData;

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            portalGet(`${ONTOLOGY_API_URL}/api/network/search/gene?q=${encodeURIComponent(search || 'NCBI')}&limit=100`)
                .then(({ data: response }) => {
                    if (!active) return;
                    const records = response.results.map(item => ({ ...item, key: item.id, title: `${item.name} · ${item.id}`, dataRef: item }));
                    setData(records);
                    const source = records.find(item => item.id === `NCBIGene:${jump}` || item.name.toLowerCase() === (jump || '').toLowerCase());
                    if (source && !selected.length) {
                        setSelected([source.key]);
                        getData.current(source.key, { node: { dataRef: source.dataRef } });
                    }
                    setLoading(false);
                }).catch(failure => { if (active) { setData([]); setError(failure.message); setLoading(false); } });
        }, 200);
        return () => { active = false; clearTimeout(timer); };
    }, [search, jump, selected.length]);

    return <div className="space-y-4 mb-4">
        <div ref={tourRefs[0]}><Input.Search value={search} onChange={event => setSearch(event.target.value)} onSearch={setSearch} placeholder="Search gene symbol or NCBI ID" loading={loading} /></div>
        <div ref={tourRefs[1]} style={{ background: '#fff', padding: 10, borderRadius: 6 }}>
            <p className="font-semibold mb-2">Genes</p>
            {error && <Alert type="warning" showIcon message="Gene source unavailable" description={error} />}
            {!loading && !error && !data.length && <p>No matching gene identities in this source view.</p>}
            <Tree style={{ maxHeight: 500, overflowY: 'auto' }} treeData={data} selectedKeys={selected}
                onSelect={(keys, info) => { if (!keys.length) return; setSelected(keys); getData.current(keys[0], { ...info, node: { ...info.node, dataRef: info.node.dataRef } }); }} />
        </div>
    </div>;
}
