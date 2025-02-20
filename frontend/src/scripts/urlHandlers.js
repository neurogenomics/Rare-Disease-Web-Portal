import { toHalfFloat } from "three/src/extras/DataUtils.js";

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

export function urlSetter(items) {
    const searchParams = new URLSearchParams(window.location.search);

    Object.keys(items).forEach((key) => {
        searchParams.set(key, items[key]);
    });

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
}
