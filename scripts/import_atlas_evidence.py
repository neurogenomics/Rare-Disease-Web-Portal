#!/usr/bin/env python3
"""Stream original portal matrices into source-attributed, atlas-separated evidence.

python3 scripts/import_atlas_evidence.py --source-dir /path/to/original/portal/data

All q < 0.05 associations are retained, including negative/unknown directions.
For the research panel's HPOs and curated/legacy endpoints, all tested cell rows
are retained. Gene expression exports contain every available cell for the
explicit panel, preserving the source specificity without rank normalization.
Only one JSON object is parsed at a time; a temporary SQLite spool groups rows.
This restores source precision and attribution, not absent generation lineage.
"""

import argparse
from datetime import datetime, timezone
import hashlib
import json
import math
from pathlib import Path
import sqlite3
import tempfile

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "frontend/src/data/evidence"
PUBLIC = ROOT / "frontend/public/data/evidence"
ATLASES = ("DescartesHuman", "HumanCellLandscape")


def iter_json_array(path, chunk_size=1024 * 1024):
    """Incremental standard-library parser; handles multiline/nested objects."""
    decoder = json.JSONDecoder()
    buffer, position, eof, started, after_value, separator_pending = "", 0, False, False, False, False
    with Path(path).open(encoding="utf-8") as source:
        while True:
            if position >= len(buffer) and not eof:
                buffer = source.read(chunk_size)
                position = 0
                eof = not buffer
            while position < len(buffer) and buffer[position].isspace():
                position += 1
            if position >= len(buffer):
                if eof:
                    raise ValueError(f"Incomplete JSON array: {path}")
                continue
            char = buffer[position]
            if not started:
                if char != "[":
                    raise ValueError(f"Expected JSON array: {path}")
                started = True
                position += 1
                continue
            if char == "]":
                if separator_pending:
                    raise ValueError(f"Trailing comma in JSON array: {path}")
                remainder = buffer[position + 1:] + source.read()
                if remainder.strip():
                    raise ValueError(f"Trailing data after JSON array: {path}")
                return
            if after_value:
                if char != ",":
                    raise ValueError(f"Expected array separator: {path}")
                position += 1
                after_value = False
                separator_pending = True
                continue
            try:
                item, end = decoder.raw_decode(buffer, position)
            except json.JSONDecodeError:
                if eof:
                    raise
                block = source.read(chunk_size)
                buffer = buffer[position:] + block
                position = 0
                eof = not block
                continue
            if not isinstance(item, dict):
                raise ValueError(f"Expected JSON object row: {path}")
            yield item
            position = end
            after_value = True
            separator_pending = False


def finite(value, lower=None, upper=None):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        return None
    if (lower is not None and value < lower) or (upper is not None and value > upper):
        return None
    return value


def source_manifest(path, kind, atlas):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(4 * 1024 * 1024), b""):
            digest.update(chunk)
    stat = path.stat()
    return {"sourceFile": path.name, "atlas": atlas, "kind": kind,
            "sha256": digest.hexdigest(), "bytes": stat.st_size,
            "localFileModifiedAt": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
            "sourceGenerationLineage": "Unknown: source import file identifies atlas but not analysis commit, expression release, HPO release or model configuration.",
            "timestampMeaning": "Local file modification time, not analysis generation or source release date."}


def atomic_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n", encoding="utf-8")
    temporary.replace(path)


def all_hpo_ids(value):
    """Explicit panel/source endpoints only, never a text-match causal mapping."""
    if isinstance(value, dict):
        for child in value.values():
            yield from all_hpo_ids(child)
    elif isinstance(value, list):
        for child in value:
            yield from all_hpo_ids(child)
    elif isinstance(value, str) and value.startswith("HP:") and len(value) == 10 and value[3:].isdigit():
        yield value


def empty_stats():
    return {"testedRows": 0, "positiveSignificant": 0, "negativeSignificant": 0,
            "zeroDirectionSignificant": 0, "unknownDirectionSignificant": 0,
            "missingOrInvalidQ": 0, "reportedZeroQ": 0, "storedRows": 0, "top": None}


def import_evidence(source_dir, data_dir=DATA, public_dir=PUBLIC, threshold=0.05):
    panel = json.loads((data_dir / "geneList.json").read_text())
    gene_lookup = {gene.upper(): gene for gene in panel}
    full_hpos = set()
    for name in ("genePhenotypes.json", "legacyCatalog.json", "curatedEvidence.json"):
        path = data_dir / name
        if path.exists():
            full_hpos.update(all_hpo_ids(json.loads(path.read_text())))
    summaries, manifests, expression = {}, [], {gene: {atlas: [] for atlas in ATLASES} for gene in panel}
    generated = datetime.now(timezone.utc).isoformat()
    with tempfile.TemporaryDirectory(prefix="portal-atlas-") as directory:
        connection = sqlite3.connect(Path(directory) / "rows.sqlite")
        connection.execute("CREATE TABLE rows (hpo TEXT NOT NULL, atlas TEXT NOT NULL, cell TEXT NOT NULL, payload TEXT NOT NULL)")
        for atlas in ATLASES:
            path = source_dir / f"hpo_celltype_{atlas}.json"
            manifest = source_manifest(path, "phenotype_cell_associations", atlas)
            before = path.stat()
            batch, count, stored = [], 0, 0
            for original in iter_json_array(path):
                count += 1
                if original.get("celltype_database") not in (None, atlas):
                    raise ValueError(f"Atlas label disagrees with source filename in {path}")
                hpo_id, cell = original.get("hpo_id"), original.get("celltype_name")
                if not hpo_id or not cell:
                    raise ValueError(f"Missing HPO/cell identifier in {path} at row {count}")
                q = finite(original.get("q"), 0, 1)
                estimate = finite(original.get("estimate"))
                significant = q is not None and q < threshold
                direction = "unknown" if estimate is None else "positive" if estimate > 0 else "negative" if estimate < 0 else "zero"
                stat = summaries.setdefault(hpo_id, {}).setdefault(atlas, empty_stats())
                stat["testedRows"] += 1
                stat["missingOrInvalidQ"] += q is None
                stat["reportedZeroQ"] += q == 0
                if significant:
                    key = {"positive": "positiveSignificant", "negative": "negativeSignificant", "zero": "zeroDirectionSignificant", "unknown": "unknownDirectionSignificant"}[direction]
                    stat[key] += 1
                    if direction == "positive":
                        candidate = {"cell": cell, "atlas": atlas, "q": q,
                                     "p": finite(original.get("p"), 0, 1), "estimate": estimate,
                                     "std_error": finite(original.get("std_error"), 0)}
                        if stat["top"] is None or (q, cell) < (stat["top"]["q"], stat["top"]["cell"]):
                            stat["top"] = candidate
                if hpo_id not in full_hpos and not significant:
                    continue
                row = {"cell": cell, "atlas": atlas, "q": q, "p": finite(original.get("p"), 0, 1),
                       "estimate": estimate, "std_error": finite(original.get("std_error"), 0),
                       "statistic": finite(original.get("statistic")), "model_estimate": finite(original.get("model_estimate")),
                       "model_statistic": finite(original.get("model_statistic")), "fold_change": finite(original.get("fold_change")),
                       "direction": direction, "significance": "significant" if significant else "unknown" if q is None else "not_significant",
                       "sourceRecordId": original.get("_id", {}).get("$oid") if isinstance(original.get("_id"), dict) else str(original.get("_id", ""))}
                batch.append((hpo_id, atlas, cell, json.dumps(row, separators=(",", ":"), allow_nan=False)))
                stat["storedRows"] += 1
                stored += 1
                if len(batch) >= 5000:
                    connection.executemany("INSERT INTO rows VALUES (?,?,?,?)", batch)
                    batch.clear()
                if count % 250000 == 0:
                    print(f"{atlas}: streamed {count:,} associations; retained {stored:,}", flush=True)
            connection.executemany("INSERT INTO rows VALUES (?,?,?,?)", batch)
            connection.commit()
            after = path.stat()
            if before.st_size != after.st_size or before.st_mtime_ns != after.st_mtime_ns:
                raise ValueError(f"Source changed during import: {path}")
            manifest.update({"sourceRows": count, "retainedRows": stored})
            manifests.append(manifest)
            print(f"{atlas}: {count:,} source associations, {stored:,} exported", flush=True)
        connection.execute("CREATE INDEX by_hpo ON rows(hpo,atlas,cell)")
        connection.commit()
        phenotype_index = {}
        for hpo_id, atlas_stats in sorted(summaries.items()):
            count = sum(value["storedRows"] for value in atlas_stats.values())
            coverage = "all_tested_rows" if hpo_id in full_hpos else "all_significant_rows"
            filename = hpo_id.replace(":", "_") + ".json"
            file = "/data/evidence/associations/" + filename if count else None
            phenotype_index[hpo_id] = {"file": file, "coverage": coverage,
                                       "storedRows": count, "atlases": atlas_stats}
            if count:
                rows = [json.loads(row[0]) for row in connection.execute("SELECT payload FROM rows WHERE hpo=? ORDER BY atlas,cell", (hpo_id,))]
                atomic_json(public_dir / "associations" / filename, {
                    "_metadata": {"generatedAt": generated, "coverage": coverage, "qThreshold": threshold,
                        "sources": [{key: source[key] for key in ("atlas", "sourceFile", "sha256")} for source in manifests],
                        "sourceGenerationLineage": "Unknown. Original import precision is preserved; statistical/model validity is not established.",
                        "interpretation": "Enrichment association, not cell-type causality. Negative estimates are retained separately and never counted as positive associations."},
                    "hpo_id": hpo_id, "rows": rows})
        connection.close()
    for atlas in ATLASES:
        path = source_dir / f"celltype_gene_{atlas}.json"
        manifest = source_manifest(path, "cell_gene_expression_specificity", atlas)
        before = path.stat()
        count, kept = 0, 0
        for row in iter_json_array(path):
            count += 1
            gene = gene_lookup.get(str(row.get("gene", "")).upper())
            if gene:
                expression[gene][atlas].append({"cell": row.get("celltype"), "specificity": finite(row.get("expression_specificity"), 0, 1)})
                kept += 1
        after = path.stat()
        if before.st_size != after.st_size or before.st_mtime_ns != after.st_mtime_ns:
            raise ValueError(f"Source changed during import: {path}")
        manifest.update({"sourceRows": count, "retainedRows": kept})
        manifests.append(manifest)
        print(f"{atlas}: {count:,} source expression rows, {kept:,} panel rows exported", flush=True)
    for by_atlas in expression.values():
        for rows in by_atlas.values():
            rows.sort(key=lambda row: (row["specificity"] is None, -(row["specificity"] or 0), row["cell"] or ""))
    metadata = {"generatedAt": generated, "qThreshold": threshold, "sources": manifests,
        "phenotypeCount": len(summaries), "phenotypesWithFiles": sum(bool(item["file"]) for item in phenotype_index.values()),
        "fullTestedPanelPhenotypes": len(full_hpos), "scope": "All significant signed association rows for both source atlases; all tested rows for panel/curated/legacy HPOs. Gene expression covers the explicit gene panel.",
        "precision": "Numbers parsed and exported without additional rounding. Source zero q values may reflect underflow or upstream rounding; they are not infinite evidence.",
        "topDefinition": "Within each atlas, the smallest source q among positive estimates meeting q threshold; cell name breaks ties. This is a display ordering, not causal validation.",
        "limitations": ["Generation commit, HPO/expression release and model configuration are absent from these import files.",
            "Negative signed associations are not positive enrichment; all significant directions remain available.",
            "Estimate/fold-change meanings require the generating model; restored precision does not validate the statistical model.",
            "No phenotype-to-gene or variant causal assertion follows from expression specificity or enrichment alone."]}
    atomic_json(data_dir / "atlasIndex.json", {"_metadata": metadata, "phenotypes": phenotype_index})
    atomic_json(data_dir / "geneExpression.json", {"_metadata": {
        "generatedAt": generated, "sources": [source for source in manifests if source["kind"] == "cell_gene_expression_specificity"],
        "panelGenes": len(panel), "scope": "Every source cell row for each panel gene; absent rows are not zero expression. Source values preserved without renormalization.",
        "interpretation": "Cell expression specificity is not variant effect, haploinsufficiency, disease mechanism or delivery evidence."}, "genes": expression})
    print(json.dumps({"phenotypes": len(summaries), "phenotypesWithFiles": metadata["phenotypesWithFiles"],
                      "associationRowsExported": sum(m["retainedRows"] for m in manifests if m["kind"] == "phenotype_cell_associations"),
                      "panelExpressionRows": sum(m["retainedRows"] for m in manifests if m["kind"] == "cell_gene_expression_specificity")}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--q-threshold", type=float, default=0.05)
    arguments = parser.parse_args()
    if not 0 < arguments.q_threshold <= 1:
        parser.error("q-threshold must be in (0,1]")
    import_evidence(arguments.source_dir, threshold=arguments.q_threshold)
