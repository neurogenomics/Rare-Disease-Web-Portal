"""Versioned HPO disease-context gene associations, separate from cell predictions.

The official HPO export connects a gene and an HPO term through a disease. It
does not establish that a particular variant causes a phenotype, or that an
expressing cell type causes it. Keep that scope attached to every returned row.
"""

import csv
import gzip
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import tempfile
import threading
from functools import lru_cache
from contextlib import closing

DATA_DIR = Path(__file__).resolve().parent / "data"
SOURCE_PATH = DATA_DIR / "phenotype_to_genes.tsv.gz"
MANIFEST_PATH = DATA_DIR / "hpo_associations_manifest.json"
DATABASE_PATH = DATA_DIR / "hpo_associations.sqlite"
SOURCE_URL = "https://purl.obolibrary.org/obo/hp/hpoa/phenotype_to_genes.txt"
ASSOCIATION_KIND = "disease_context_gene_phenotype_association"
_BUILD_LOCK = threading.Lock()

@lru_cache(maxsize=1)
def get_phenotype_branch():
    path = DATA_DIR / 'phenotypic_abnormality_ids.json.gz'
    if not path.exists(): return set(), set(), None
    with gzip.open(path, 'rt', encoding='utf-8') as handle:
        source = json.load(handle)
    return set(source.get('knownIds', [])), set(source['ids']), source['metadata']


def build_index(source_path, database_path, manifest):
    """Build an atomic, reproducible cache, validating the uncompressed source."""
    source_path, database_path = Path(source_path), Path(database_path)
    database_path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix="hpo-index-", suffix=".sqlite", dir=database_path.parent)
    os.close(fd)
    try:
        digest = hashlib.sha256()
        with gzip.open(source_path, "rb") as source:
            for block in iter(lambda: source.read(1024 * 1024), b""):
                digest.update(block)
        if digest.hexdigest() != manifest["sha256"]:
            raise ValueError("HPO source checksum does not match its manifest")
        with closing(sqlite3.connect(temporary)) as connection, connection:
            connection.execute("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)")
            connection.execute("CREATE TABLE associations (hpo_id TEXT NOT NULL, hpo_name TEXT NOT NULL, ncbi_gene_id TEXT NOT NULL, gene_symbol TEXT NOT NULL, disease_id TEXT NOT NULL)")
            with gzip.open(source_path, "rt", encoding="utf-8", newline="") as source:
                reader = csv.DictReader(source, delimiter="\t")
                columns = ["hpo_id", "hpo_name", "ncbi_gene_id", "gene_symbol", "disease_id"]
                if not set(columns).issubset(reader.fieldnames or []):
                    raise ValueError("Unsupported HPO phenotype_to_genes schema")
                batch = []
                for row in reader:
                    values = tuple(row[column].strip() for column in columns)
                    if any(not value or value == "-" for value in values):
                        continue
                    if not values[0].startswith("HP:") or ":" not in values[4]:
                        continue
                    batch.append(values)
                    if len(batch) == 5000:
                        connection.executemany("INSERT INTO associations VALUES (?,?,?,?,?)", batch)
                        batch.clear()
                connection.executemany("INSERT INTO associations VALUES (?,?,?,?,?)", batch)
            connection.execute("CREATE INDEX by_hpo ON associations(hpo_id, gene_symbol, disease_id)")
            connection.execute("CREATE INDEX by_gene ON associations(gene_symbol, hpo_id, disease_id)")
            connection.execute("INSERT INTO metadata VALUES ('sha256',?)", (manifest["sha256"],))
        os.replace(temporary, database_path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def get_source_manifest():
    """Missing evidence is unavailable, never a negative biological assertion."""
    if not MANIFEST_PATH.exists() or not SOURCE_PATH.exists():
        return None
    with MANIFEST_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def _open_index():
    manifest = get_source_manifest()
    if not manifest or not SOURCE_PATH.exists():
        return None, manifest
    with _BUILD_LOCK:
        current_hash = None
        if DATABASE_PATH.exists():
            try:
                with closing(sqlite3.connect(f"file:{DATABASE_PATH}?mode=ro", uri=True)) as connection:
                    result = connection.execute("SELECT value FROM metadata WHERE key='sha256'").fetchone()
                    current_hash = result[0] if result else None
            except sqlite3.DatabaseError:
                pass
        if current_hash != manifest["sha256"]:
            build_index(SOURCE_PATH, DATABASE_PATH, manifest)
    connection = sqlite3.connect(f"file:{DATABASE_PATH}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    return connection, manifest


def get_phenotype_gene_associations(hpo_ids=None, gene_symbols=None):
    """Return explicit HPO/gene/disease associations with reproducible provenance.

    At least one bounded scope is required; supplying both computes intersection.
    A missing snapshot returns no supported associations. Integrity failures raise
    rather than silently presenting incomplete or unverified evidence as valid.
    """
    if hpo_ids is None and gene_symbols is None:
        raise ValueError("Scope associations by phenotype or gene")
    if (hpo_ids is not None and not hpo_ids) or (gene_symbols is not None and not gene_symbols):
        return []
    connection, manifest = _open_index()
    if connection is None:
        return []
    clauses, parameters = [], []
    # JSON table-valued parameters avoid SQLite's variable count limit for large
    # phenotype queries; neither identifiers nor values enter SQL via formatting.
    if hpo_ids is not None:
        clauses.append("hpo_id IN (SELECT value FROM json_each(?))")
        parameters.append(json.dumps(sorted(set(hpo_ids))))
    if gene_symbols is not None:
        clauses.append("gene_symbol COLLATE NOCASE IN (SELECT value FROM json_each(?))")
        parameters.append(json.dumps(sorted({gene.upper() for gene in gene_symbols})))
    try:
        known_terms, phenotype_terms, ontology_metadata = get_phenotype_branch()
        rows = connection.execute(
            "SELECT DISTINCT hpo_id,hpo_name,ncbi_gene_id,gene_symbol,disease_id FROM associations WHERE "
            + " AND ".join(clauses)
            + " ORDER BY hpo_id,gene_symbol,disease_id", parameters)
        return [dict(row) | {
            "association_kind": ASSOCIATION_KIND,
            "source_url": manifest["source_url"],
            "source_last_modified": manifest.get("source_last_modified"),
            "source_sha256": manifest["sha256"],
            "retrieved_at": manifest["retrieved_at"],
            "variant_specific": False,
            "isPhenotypicAbnormality": row['hpo_id'] in phenotype_terms if row['hpo_id'] in known_terms else None,
            "ontology_source_sha256": ontology_metadata.get('sha256') if ontology_metadata else None,
        } for row in rows]
    finally:
        connection.close()
