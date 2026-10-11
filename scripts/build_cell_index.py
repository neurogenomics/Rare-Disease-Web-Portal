#!/usr/bin/env python3
"""Reverse index exact atlas/cell labels without collapsing them into lineages."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'frontend/src/data/evidence'
PUBLIC = ROOT / 'frontend/public/data/evidence'


def build_index(atlas_index, public_dir):
    cells = {}
    threshold = atlas_index['_metadata']['qThreshold']
    for hpo_id, item in atlas_index['phenotypes'].items():
        if not item.get('file'):
            continue
        path = public_dir / 'associations' / Path(item['file']).name
        snapshot = json.loads(path.read_text())
        if snapshot['hpo_id'] != hpo_id:
            raise ValueError('Atlas filename/HPO mismatch')
        for row in snapshot['rows']:
            q, estimate = row.get('q'), row.get('estimate')
            if (not isinstance(q, (int, float)) or isinstance(q, bool) or not math.isfinite(q) or not 0 <= q < threshold
                    or not isinstance(estimate, (int, float)) or isinstance(estimate, bool) or not math.isfinite(estimate) or estimate == 0):
                continue
            key = 'positiveHpoIds' if estimate > 0 else 'negativeHpoIds'
            cell = cells.setdefault(row['atlas'], {}).setdefault(row['cell'], {'positiveHpoIds': set(), 'negativeHpoIds': set()})
            cell[key].add(hpo_id)
    for by_cell in cells.values():
        for cell in by_cell.values():
            for direction, ids in cell.items():
                cell[direction] = sorted(ids)
    metadata = {**atlas_index['_metadata'],
                'scope': 'Every significant signed row in the atlas import, reverse indexed by exact atlas and cell label. Positive and negative directions are separate; no ontology or lineage equivalence is asserted.',
                'interpretation': 'A positive signed atlas association identifies phenotype hypotheses, not disease causality or therapeutic target engagement.'}
    return {'metadata': metadata, 'cells': cells}


if __name__ == '__main__':
    value = build_index(json.loads((DATA / 'atlasIndex.json').read_text()), PUBLIC)
    (DATA / 'cellIndex.json').write_text(json.dumps(value, separators=(',', ':')) + '\n')
    print(json.dumps({'atlasCells': {atlas: len(cells) for atlas, cells in value['cells'].items()}}))
