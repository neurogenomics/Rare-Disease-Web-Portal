export function urlParser(page) {
    function parseDb(db) {
        const shortForms = {
            DescartesHuman: "DH",
            HumanCellLandscape: "HCL",
        };

        // If db is a key in shortForms, return db as is
        if (Object.keys(shortForms).includes(db)) {
            return db;
        }

        // If db is a value in shortForms, return the corresponding key
        const key = Object.keys(shortForms).find(
            (key) => shortForms[key] === db
        );
        if (key) {
            return key;
        }

        return null;
    }

    function parseQ(q) {
        const parsed = parseFloat(q);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            return q;
        }
        return null;
    }

    function parseSeveritySliders(sliderVal) {
        if (!sliderVal) return null;
        let parsed = [0, 3]; // Default
        // Example: 11 = [1, 1]
        if (sliderVal?.length === 2) {
            let digit1 = parseInt(sliderVal[0]);
            let digit2 = parseInt(sliderVal[1]);
            if (
                !isNaN(digit1) &&
                !isNaN(digit2) &&
                digit1 >= 0 &&
                digit1 <= 3 &&
                digit2 >= 0 &&
                digit2 <= 3
            ) {
                parsed = [digit1, digit2];
            }
        }
        return parsed;
    }

    const searchParams = new URLSearchParams(window.location.search);
    let params = {};

    switch (page.toLowerCase()) {
        case "phenotype":
            params = {
                jump: searchParams?.get("jump"),
                url_db_type: parseDb(searchParams?.get("db_type")),
            };
            break;
        case "celltype":
            params = {
                jump: searchParams?.get("jump"),
                db_type: parseDb(searchParams?.get("db_type")),
                q_value: parseQ(searchParams?.get("q_value")),
            };
            break;
        case "gene":
            params = {
                jump: searchParams?.get("jump"), // NCBI Gene ID number
                db_type: parseDb(searchParams?.get("db_type"))
            };
            break;
        case "severity":
            params = {
                intellectual_disability: parseSeveritySliders(
                    searchParams?.get("intellectual_disability")
                ),
                death: parseSeveritySliders(searchParams?.get("death")),
                impaired_mobility: parseSeveritySliders(
                    searchParams?.get("impaired_mobility")
                ),
                physical_malformations: parseSeveritySliders(
                    searchParams?.get("physical_malformations")
                ),
                blindness: parseSeveritySliders(searchParams?.get("blindness")),
                sensory_impairments: parseSeveritySliders(
                    searchParams?.get("sensory_impairments")
                ),
                immunodeficiency: parseSeveritySliders(
                    searchParams?.get("immunodeficiency")
                ),
                cancer: parseSeveritySliders(searchParams?.get("cancer")),
                reduced_fertility: parseSeveritySliders(
                    searchParams?.get("reduced_fertility")
                ),
                congenital_onset: parseSeveritySliders(
                    searchParams?.get("congenital_onset")
                ),
                severity_class: parseSeveritySliders(
                    searchParams?.get("severity_class")
                ),
                with1: searchParams?.get("with1"),
                without: searchParams?.get("without"),
            };
            break;
    }

    return params;
}

export function updatedExplorerUrl(pathname, search, items) {
    const searchParams = new URLSearchParams(search);
    const atlas = value => ({ DH: 'DescartesHuman', HCL: 'HumanCellLandscape' })[value] || value;
    if (Object.hasOwn(items, 'db_type')) {
        const previous = atlas(searchParams.get('atlas') || searchParams.get('db_type'));
        const next = atlas(items.db_type);
        if (next !== previous) searchParams.delete('cell');
        if (next) searchParams.set('atlas', next);
        else searchParams.delete('atlas');
    }
    if (Object.hasOwn(items, 'jump')) {
        const durable = { '/phenotype': 'hpo', '/celltype': 'cell' }[pathname];
        if (durable) {
            if (items.jump) searchParams.set(durable, items.jump);
            else searchParams.delete(durable);
        }
        if (pathname === '/gene' && items.jump !== searchParams.get('jump')) searchParams.delete('gene');
    }
    Object.entries(items).forEach(([key, value]) => {
        if (value == null || value === "") searchParams.delete(key);
        else searchParams.set(key, String(value));
    });
    return `${pathname}${searchParams.size ? `?${searchParams}` : ""}`;
}

export function urlSetter(items) {
    const newUrl = updatedExplorerUrl(window.location.pathname, window.location.search, items);
    if (newUrl === `${window.location.pathname}${window.location.search}`) return false;
    window.history.pushState({}, "", newUrl);
    // React Router and the evidence bridge must observe legacy tree selections.
    // Identical hydration calls above are skipped to avoid remount loops.
    window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
    return true;
}
