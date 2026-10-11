#!/usr/bin/env python3
"""Offline schema, reference and count audit of every evidence JSON snapshot.

Run: python3 scripts/tests/audit_snapshots.py
Requires jsonschema. It checks structural/semantic consistency, not source truth.
Source URLs are not fetched and timestamps are not treated as analysis lineage.
"""
from collections import Counter, defaultdict
import gzip
import hashlib
import json
import math
from pathlib import Path
import re
import sys
import urllib.parse

from jsonschema import Draft202012Validator

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from refresh_evidence import trial_record, variant_record
from import_atlas_evidence import all_hpo_ids

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'frontend/src/data/evidence'
PUBLIC = ROOT / 'frontend/public'


def obj(required, properties=None):
    return {'type': 'object', 'required': required, 'properties': properties or {}}


STRING = {'type': 'string'}
NONNEGATIVE = {'type': 'integer', 'minimum': 0}
NULL_NUMBER = {'type': ['number', 'null']}
Q = {'type': ['number', 'null'], 'minimum': 0, 'maximum': 1}
PROVENANCE = obj(['sourceUrl', 'retrievedAt', 'sha256'], {
    'sourceUrl': STRING, 'retrievedAt': STRING,
    'sha256': {'type': 'string', 'pattern': '^[a-f0-9]{64}$'},
})
ASSOCIATION = obj(['cell', 'atlas', 'q', 'p', 'estimate', 'direction', 'significance', 'sourceRecordId'], {
    'cell': STRING, 'atlas': {'enum': ['DescartesHuman', 'HumanCellLandscape']},
    'q': Q, 'p': Q, 'estimate': NULL_NUMBER,
    'std_error': {'type': ['number', 'null'], 'minimum': 0},
    'direction': {'enum': ['positive', 'negative', 'zero', 'unknown']},
    'significance': {'enum': ['significant', 'not_significant', 'unknown']},
})
VARIANT = obj(['id', 'alleles', 'classification', 'mechanism', 'phenotypeLink'], {
    'id': STRING, 'alleles': {'type': 'array', 'items': obj(['alleleId', 'name', 'locations', 'spdi'])},
    'classification': {'type': ['string', 'null']},
    'mechanism': {'const': 'not_established_by_consequence'},
    'phenotypeLink': {'const': 'disease_context_only'},
})
VARIANT_METADATA = obj(['gene', 'matchedCount', 'retrievedCount', 'complete', 'searchSources', 'sources'], {
    'gene': STRING, 'matchedCount': NONNEGATIVE, 'retrievedCount': NONNEGATIVE,
    'complete': {'type': 'boolean'},
    'sources': {'type': 'array', 'items': PROVENANCE},
    'searchSources': {'type': 'array', 'items': PROVENANCE},
})
TRIAL = obj(['nctId', 'status', 'hasResults', 'reportedOutcomes', 'provenance'], {
    'nctId': {'type': 'string', 'pattern': '^NCT[0-9]{8}$'},
    'hasResults': {'type': 'boolean'}, 'reportedOutcomes': {'type': 'array'},
    'provenance': PROVENANCE,
})
DOSAGE_ASSERTION = obj(['score', 'sourceScore', 'description', 'diseaseId', 'pmids'], {
    'score': {'enum': [None, 0, 1, 2, 3, 30, 40]}, 'sourceScore': STRING,
    'diseaseId': {'type': ['string', 'null']}, 'pmids': {'type': 'array', 'items': STRING},
})
SEVERITY = {'type': 'array', 'items': obj(['hpo_id', 'hpo_name', 'severity_class', 'severity_score'], {
    'hpo_id': STRING, 'hpo_name': STRING, 'severity_class': {'enum': ['mild', 'moderate', 'severe', 'profound']},
    'severity_score': {'type': 'number', 'minimum': 0},
})}
SCHEMAS = {
    'geneList.json': {'type': 'array', 'uniqueItems': True, 'items': STRING},
    'geneIdentifiers.json': {'type': 'object', 'propertyNames': {'pattern': '^[0-9]+$'}, 'additionalProperties': STRING},
    'genePhenotypes.json': obj(['metadata', 'genes'], {'genes': {'type': 'object', 'additionalProperties': {
        'type': 'array', 'items': obj(['hpo_id', 'hpo_name', 'ncbi_gene_id', 'disease_id'], {
            'hpo_id': {'type': 'string', 'pattern': '^HP:[0-9]{7}$'},
            'disease_id': {'type': 'string', 'pattern': '^(OMIM|ORPHA):[0-9]+$'},
        })}}}),
    'hpoTerms.json': obj(['metadata', 'terms'], {'terms': {'type': 'object', 'additionalProperties':
        obj(['label', 'synonyms', 'obsolete'], {'label': STRING, 'synonyms': {'type': 'array'},
            'obsolete': {'type': 'boolean'}, 'parents': {'type': 'array', 'items': STRING},
            'isPhenotypicAbnormality': {'type': 'boolean'}})}}),
    'mechanismContexts.json': {'type': 'array', 'items': obj(['id', 'gene', 'disease', 'diseaseIds', 'mechanism', 'sourceUrls', 'scope'], {
        'diseaseIds': {'type': 'array', 'minItems': 1, 'items': STRING},
        'sourceUrls': {'type': 'array', 'minItems': 1, 'items': STRING},
        'mechanism': {'enum': ['loss_of_function', 'haploinsufficiency', 'gain_of_function', 'dosage_gain', 'toxic_gain_of_function', 'dominant_negative', 'toxic_rna', 'unknown']},
    })},
    'curatedEvidence.json': obj(['schemaVersion', 'reviewedAt', 'scope', 'sources', 'assessments'], {
        'sources': {'type': 'array', 'items': obj(['id', 'title', 'url', 'kind', 'accessedAt'])},
        'assessments': {'type': 'array', 'items': obj(['id', 'therapyName', 'gene', 'disease', 'phenotypes', 'conclusion'], {
            'phenotypes': {'type': 'array', 'items': obj(['hpoId', 'label', 'endpoint', 'mapping', 'rationale', 'sourceIds'])},
        })},
    }),
    'variantFunctionalEvidence.json': obj(['schemaVersion', 'reviewedAt', 'scope', 'cases'], {
        'cases': {'type': 'array', 'items': obj(['id', 'gene', 'variantIds', 'variantLabel', 'variantClass',
            'diseaseId', 'phenotypes', 'evidence', 'limits', 'sourceUrls'], {
                'variantIds': {'type': 'array', 'items': STRING},
                'therapyId': {'type': ['string', 'null']},
                'modalityId': {'type': ['string', 'null']},
                'sourceUrls': {'type': 'array', 'minItems': 1, 'items': STRING},
                'observedPhenotypes': {'type': 'array', 'items': obj(['hpoId', 'label', 'present', 'rationale', 'sourceUrls'], {
                    'present': {'type': 'boolean'}, 'sourceUrls': {'type': 'array', 'minItems': 1, 'items': STRING},
                })},
                'functionalObservations': {'type': 'array', 'items': obj(['species', 'cells', 'assay', 'intervention',
                    'timeFrame', 'direction', 'claim', 'sourceUrls'], {
                    'direction': {'enum': ['supports', 'opposes', 'limits', 'unknown']},
                    'sourceUrls': {'type': 'array', 'minItems': 1, 'items': STRING},
                })},
                'mechanismEvidence': obj(['mechanism', 'sourceUrls', 'scope'], {
                    'mechanism': {'enum': ['loss_of_function', 'haploinsufficiency', 'gain_of_function',
                        'dosage_gain', 'toxic_gain_of_function', 'dominant_negative', 'toxic_rna', 'unknown']},
                    'scope': obj(['gene', 'diseaseId', 'variantId']),
                    'sourceUrls': {'type': 'array', 'minItems': 1, 'items': STRING},
                    'directionUnresolved': {'type': 'boolean'},
                    'directionReason': STRING,
                    'directionSourceUrls': {'type': 'array', 'minItems': 1, 'items': STRING},
                }),
            })},
    }),
    'endpointEvidence.json': obj(['schemaVersion', 'reviewedAt', 'scope', 'sources', 'assessments'], {
        'sources': {'type': 'array', 'items': obj(['id', 'title', 'url', 'kind', 'accessedAt'])},
        'assessments': {'type': 'array', 'items': obj(['assessmentId', 'diseaseIds', 'endpointResults', 'cellObservations', 'limitations'], {
            'diseaseIds': {'type': 'array', 'items': obj(['id', 'label', 'sourceIds', 'rationale'])},
            'endpointResults': {'type': 'array', 'items': obj(['id', 'hpoId', 'diseaseIds', 'trialRefs', 'population',
                'endpoint', 'comparator', 'role', 'analysis', 'timeFrame', 'outcome', 'summary', 'sourceIds', 'scopeReview', 'limits'], {
                'outcome': {'enum': ['benefit', 'null', 'harm', 'mixed', 'surrogate', 'unknown', 'not_measured']},
                'scopeReview': {'enum': ['endpoint_specific', 'single_mapped_endpoint', 'source_limited']},
                'sourceIds': {'type': 'array', 'minItems': 1, 'items': STRING},
            })},
            'cellObservations': {'type': 'array', 'items': obj(['id', 'hpoIds', 'trialRefs', 'population', 'species',
                'cells', 'route', 'assay', 'comparator', 'timeFrame', 'evidenceType', 'direction', 'claim', 'sourceIds',
                'endpointResultIds', 'diseaseIds', 'studyRelationship', 'clinicalMediation', 'atlasIdentity'], {
                'direction': {'enum': ['supports', 'opposes', 'limits', 'unknown']},
                'sourceIds': {'type': 'array', 'minItems': 1, 'items': STRING},
            })},
        })},
    }),
    'dosageEvidence.json': obj(['metadata', 'genes'], {'genes': {'type': 'object', 'additionalProperties':
        obj(['gene', 'ncbiGeneId', 'assembly', 'haploinsufficiency', 'triplosensitivity'], {
            'assembly': {'const': 'GRCh38'}, 'haploinsufficiency': DOSAGE_ASSERTION, 'triplosensitivity': DOSAGE_ASSERTION,
        })}}),
    'variantIndex.json': obj(['metadata', 'genes'], {'genes': {'type': 'object'}}),
    'trialIndex.json': obj(['metadata', 'trials', 'errors'], {'trials': {'type': 'object'}, 'errors': {'type': 'object'}}),
    'atlasIndex.json': obj(['_metadata', 'phenotypes'], {'phenotypes': {'type': 'object', 'additionalProperties':
        obj(['file', 'coverage', 'storedRows', 'atlases'], {'storedRows': NONNEGATIVE,
            'coverage': {'enum': ['all_tested_rows', 'all_significant_rows']}})}}),
    'geneExpression.json': obj(['_metadata', 'genes'], {'genes': {'type': 'object', 'additionalProperties':
        {'type': 'object', 'additionalProperties': {'type': 'array', 'items': obj(['cell', 'specificity'], {'cell': STRING, 'specificity': Q})}}}}),
    'cellIndex.json': obj(['metadata', 'cells'], {'cells': {'type': 'object', 'additionalProperties':
        {'type': 'object', 'additionalProperties': obj(['positiveHpoIds', 'negativeHpoIds'], {
            'positiveHpoIds': {'type': 'array', 'uniqueItems': True, 'items': STRING},
            'negativeHpoIds': {'type': 'array', 'uniqueItems': True, 'items': STRING},
        })}}}),
    'legacyCatalog.json': obj(['metadata', 'therapies'], {'therapies': {'type': 'array', 'items': obj(['id', 'legacyId', 'name', 'mappings'])}}),
}
PUBLIC_SCHEMAS = {
    'associations': obj(['_metadata', 'hpo_id', 'rows'], {'rows': {'type': 'array', 'items': ASSOCIATION}}),
    'variants': obj(['metadata', 'reference', 'variants'], {'metadata': VARIANT_METADATA, 'variants': {'type': 'array', 'items': VARIANT}}),
    'trials': TRIAL,
    'cells': obj(['metadata', 'atlas', 'cell', 'rows'], {
        'metadata': obj(['generatedAt', 'derivedFrom', 'coverage', 'qThreshold', 'sources', 'interpretation', 'cellFilenameEncoding'], {
            'coverage': {'const': 'all_published_significant_rows'}, 'qThreshold': {'const': 0.05},
            'cellFilenameEncoding': {'const': 'utf8-lowercase-hex'},
        }),
        'atlas': {'enum': ['DescartesHuman', 'HumanCellLandscape']}, 'cell': STRING,
        'rows': {'type': 'array', 'items': obj(ASSOCIATION['required'] + ['hpo_id'], ASSOCIATION['properties'])},
    }),
}


class Audit:
    def __init__(self):
        self.errors = []
        self.warnings = defaultdict(list)
        self.counts = Counter()
        self.variant_ids = defaultdict(set)
        self.cell_hpo_ids = defaultdict(lambda: {'positiveHpoIds': set(), 'negativeHpoIds': set()})
        self.expected_cell_rows = defaultdict(list)
        self.actual_cell_rows = {}
        self.variant_gene_ids = defaultdict(set)

    def fail(self, message):
        self.errors.append(message)

    def check(self, condition, message):
        if not condition:
            self.fail(message)

    def warn(self, category, message):
        self.warnings[category].append(message)

    def load(self, path, schema):
        try:
            value = json.loads(path.read_text(), parse_constant=lambda token: (_ for _ in ()).throw(ValueError(token)))
        except (OSError, ValueError) as error:
            self.fail(f'{path.relative_to(ROOT)}: invalid JSON: {error}')
            return None
        self.counts['jsonFiles'] += 1
        for error in Draft202012Validator(schema).iter_errors(value):
            self.fail(f'{path.relative_to(ROOT)}:{list(error.path)}: {error.message}')
        def finite(v):
            if isinstance(v, dict):
                return all(finite(x) for x in v.values())
            if isinstance(v, list):
                return all(finite(x) for x in v)
            return not isinstance(v, float) or math.isfinite(v)
        self.check(finite(value), f'{path.name}: nonfinite numeric value')
        return value

    def run(self):
        data = {}
        for path in sorted(DATA.glob('*.json')):
            if path.name not in SCHEMAS:
                self.fail(f'No schema contract for {path.name}')
                continue
            data[path.name] = self.load(path, SCHEMAS[path.name])
        if any(value is None for value in data.values()):
            return self.result()
        panel = set(data['geneList.json'])
        self.counts['panelGenes'] = len(panel)
        hpo = data['hpoTerms.json']['terms']
        source_severity = self.load(DATA.parent / 'hpoSeverity.json', SEVERITY)
        if source_severity:
            self.counts['historicalSeverityRows'] = len(source_severity)
            for item in source_severity:
                term = hpo.get(item['hpo_id'])
                if term is None:
                    self.counts['historicalSeverityHpoAbsent'] += 1
                elif term['obsolete']:
                    self.counts['historicalSeverityHpoObsolete'] += 1
                elif term['label'] != item['hpo_name']:
                    self.counts['historicalSeverityLabelDisagreements'] += 1
        clinical_cache, visiting = {}, set()
        def clinical(identifier):
            if identifier in clinical_cache:
                return clinical_cache[identifier]
            if identifier in visiting:
                self.fail(f'HPO hierarchy cycle at {identifier}')
                return False
            visiting.add(identifier)
            term = hpo[identifier]
            for parent in term.get('parents', []):
                self.check(parent in hpo, f'{identifier}: HPO parent {parent} absent')
            result = identifier == 'HP:0000118' or any(clinical(parent) for parent in term.get('parents', []) if parent in hpo)
            visiting.remove(identifier)
            clinical_cache[identifier] = result
            return result
        for identifier, term in hpo.items():
            if 'isPhenotypicAbnormality' in term:
                expected = clinical(identifier) and identifier != 'HP:0000118' and not term['obsolete']
                self.check(term['isPhenotypicAbnormality'] == expected,
                           f'{identifier}: clinical-phenotype flag does not follow ontology ancestry')
        associations = data['genePhenotypes.json']['genes']
        self.check(set(associations) == panel, 'HPO gene panel differs from explicit panel')
        self.check(set(data['geneExpression.json']['genes']) == panel, 'Expression gene panel differs from explicit panel')
        for gene, rows in associations.items():
            self.counts['genePhenotypeRows'] += len(rows)
            for row in rows:
                if 'geneIdentifiers.json' in data:
                    self.check(data['geneIdentifiers.json'].get(row['ncbi_gene_id']) == gene,
                               f'{gene}: inconsistent NCBI gene identifier {row["ncbi_gene_id"]}')
                term = hpo.get(row['hpo_id'])
                if not term:
                    self.warn('geneHpoAbsentFromTerms', f'{gene}:{row["hpo_id"]}')
                elif term['obsolete']:
                    self.warn('obsoleteGeneHpo', f'{gene}:{row["hpo_id"]}')
                elif term['label'] != row['hpo_name']:
                    self.warn('geneHpoLabelDrift', f'{gene}:{row["hpo_id"]}: {row["hpo_name"]} -> {term["label"]}')
                if term and 'isPhenotypicAbnormality' in term:
                    self.check(row.get('isPhenotypicAbnormality') == term['isPhenotypicAbnormality'],
                               f'{gene}:{row["hpo_id"]}: clinical-phenotype flag differs from ontology')
                    if not term['isPhenotypicAbnormality']:
                        self.counts['genePhenotypeNonClinicalRows'] += 1
        self.counts['mechanismContexts'] = len(data['mechanismContexts.json'])
        for context in data['mechanismContexts.json']:
            diseases = {row['disease_id'] for row in associations.get(context['gene'], [])}
            self.check(bool(diseases.intersection(context['diseaseIds'])), f'{context["id"]}: no same-gene disease join')
            for disease in set(context['diseaseIds']) - diseases:
                self.warn('mechanismDiseaseWithoutHpoJoin', f'{context["id"]}:{disease}')
        curated = data['curatedEvidence.json']
        source_ids = {source['id'] for source in curated['sources']}
        self.check(len(source_ids) == len(curated['sources']), 'Duplicate curated source IDs')
        self.counts['curatedSources'] = len(source_ids)
        self.counts['curatedAssessments'] = len(curated['assessments'])
        endpoints = data.get('endpointEvidence.json', {})
        endpoint_source_ids = {source['id'] for source in endpoints.get('sources', [])}
        self.check(len(endpoint_source_ids) == len(endpoints.get('sources', [])), 'Duplicate endpoint source IDs')
        self.check(not source_ids.intersection(endpoint_source_ids), 'Endpoint sources reuse curated IDs')
        source_ids.update(endpoint_source_ids)
        self.counts['endpointSources'] = len(endpoint_source_ids)
        assessment_ids = [value['id'] for value in curated['assessments']]
        self.check(len(set(assessment_ids)) == len(assessment_ids), 'Duplicate curated assessment IDs')
        for assessment in curated['assessments']:
            for role in ('diseaseGenes', 'therapeuticTargets'):
                self.check(isinstance(assessment.get(role), list), f'{assessment["id"]}: {role} lacks typed gene identities')
                for gene in assessment.get(role, []):
                    self.check(gene in panel, f'{assessment["id"]}: {role} gene absent from panel: {gene}')
        def references(value):
            if isinstance(value, dict):
                for identifier in value.get('sourceIds', []):
                    self.counts['curatedSourceReferences'] += 1
                    self.check(identifier in source_ids, f'Unresolved curated sourceId: {identifier}')
                if 'hpoId' in value:
                    identifier = value['hpoId']
                    term = hpo.get(identifier)
                    self.counts['curatedHpoMentions'] += 1
                    self.check(term is not None, f'Curated HPO absent: {identifier}')
                    if term:
                        self.check(not term['obsolete'], f'Curated HPO obsolete: {identifier}')
                        if 'label' in value:
                            self.check(value['label'] == term['label'], f'Curated HPO label mismatch: {identifier}')
                        self.check(term.get('isPhenotypicAbnormality') is True, f'Curated endpoint is not a clinical phenotype: {identifier}')
                for child in value.values():
                    references(child)
            elif isinstance(value, list):
                for child in value:
                    references(child)
        references(curated['assessments'])
        references(endpoints.get('assessments', []))
        functional = data.get('variantFunctionalEvidence.json', {}).get('cases', [])
        references(functional)
        for therapy in data['legacyCatalog.json']['therapies']:
            for mapping in therapy['mappings']:
                term = hpo.get(mapping['hpoId'])
                if term is None:
                    self.counts['legacyHpoAbsent'] += 1
                elif term['obsolete']:
                    self.counts['legacyHpoObsolete'] += 1
                elif mapping.get('historicalLabel') != term['label']:
                    self.counts['legacyHpoLabelDisagreements'] += 1
        atlas = data['atlasIndex.json']
        self.counts['atlasTestedHpoIds'] = len(atlas['phenotypes'])
        full_hpos = set().union(*(set(all_hpo_ids(data[name])) for name in
            ('genePhenotypes.json', 'legacyCatalog.json', 'curatedEvidence.json')))
        self.check(atlas['_metadata']['fullTestedPanelPhenotypes'] == len(full_hpos),
                   'Atlas all-tested panel metadata does not match current HPO endpoints')
        self.counts['allTestedPanelHpoIds'] = len(full_hpos)
        for identifier in full_hpos:
            if identifier in atlas['phenotypes']:
                self.check(atlas['phenotypes'][identifier]['coverage'] == 'all_tested_rows',
                           f'{identifier}: current panel endpoint lacks all-tested coverage')
            else:
                self.counts['panelEndpointsAbsentFromImportedAtlases'] += 1
        expression = data['geneExpression.json']
        self.counts['geneExpressionRows'] = sum(len(rows) for atlases in expression['genes'].values() for rows in atlases.values())
        self.check(expression['_metadata']['panelGenes'] == len(panel), 'Expression panel metadata count mismatch')
        for source in expression['_metadata']['sources']:
            self.check(sum(len(atlases[source['atlas']]) for atlases in expression['genes'].values()) == source['retainedRows'],
                       f'{source["atlas"]}: expression manifest retained count mismatch')
        for source in atlas['_metadata']['sources']:
            if source['kind'] == 'phenotype_cell_associations':
                stats = [value['atlases'].get(source['atlas'], {}) for value in atlas['phenotypes'].values()]
                self.check(sum(value.get('testedRows', 0) for value in stats) == source['sourceRows'],
                           f'{source["atlas"]}: atlas tested source count mismatch')
                self.check(sum(value.get('storedRows', 0) for value in stats) == source['retainedRows'],
                           f'{source["atlas"]}: atlas retained source count mismatch')
        variant_index = data['variantIndex.json']['genes']
        trial_index = data['trialIndex.json']['trials']
        all_public_paths = sorted((PUBLIC / 'data/evidence').rglob('*.json'))
        for path in all_public_paths:
            role = 'cells' if path.parent.parent.name == 'cells' else path.parent.name
            if role == 'evidence' and path.name == 'hpoSeverity.json':
                value = self.load(path, SEVERITY)
                self.counts['publicMetadataFiles'] += 1
                self.check(value == source_severity, 'Historical severity public/source snapshot differs')
                continue
            if role == 'evidence' and path.name in SCHEMAS:
                value = self.load(path, SCHEMAS[path.name])
                self.counts['publicMetadataFiles'] += 1
                if value is not None:
                    self.check(value == data.get(path.name), f'{path.name}: public/source metadata snapshot differs')
                continue
            if role not in PUBLIC_SCHEMAS:
                self.fail(f'No public schema contract for {path.relative_to(ROOT)}')
                continue
            value = self.load(path, PUBLIC_SCHEMAS[role])
            if value is None:
                continue
            self.counts[role + 'Files'] += 1
            if role == 'associations':
                self.audit_associations(path, value, atlas)
            elif role == 'variants':
                self.audit_variants(path, value, variant_index)
            elif role == 'trials':
                self.audit_trial(path, value)
                if value['nctId'] not in trial_index:
                    self.warn('unindexedPublicTrials', value['nctId'])
                else:
                    self.check(trial_index[value['nctId']]['reportedOutcomeCount'] == len(value['reportedOutcomes']), f'{path.name}: trial outcome count mismatch')
            elif role == 'cells':
                key = (value['atlas'], value['cell'])
                self.check(key not in self.actual_cell_rows, f'{path.name}: duplicate reverse cell snapshot')
                self.actual_cell_rows[key] = value['rows']
                expected_filename = 'cell-' + value['cell'].encode('utf-8').hex() + '.json'
                self.check(value['atlas'] == path.parent.name and path.name == expected_filename,
                           f'{path.name}: reverse cell path/context mismatch')
                metadata = value['metadata']
                expected_sources = [source for source in atlas['_metadata']['sources']
                                    if source['atlas'] == value['atlas'] and source['kind'] == 'phenotype_cell_associations']
                self.check(metadata['sources'] == expected_sources, f'{path.name}: reverse cell source provenance mismatch')
                self.check(metadata['generatedAt'] == atlas['_metadata']['generatedAt'], f'{path.name}: reverse cell source generation marker mismatch')
                self.check(bool(metadata['derivedFrom']) and bool(metadata['interpretation']), f'{path.name}: reverse cell scope absent')
                for row in value['rows']:
                    self.check(row['atlas'] == key[0] and row['cell'] == key[1], f'{path.name}: mixed cell/atlas context')
                    self.check(isinstance(row['q'], (int, float)) and 0 <= row['q'] < 0.05, f'{path.name}: reverse row outside declared q scope')
                self.counts['reverseCellRows'] += len(value['rows'])
        for identifier, value in atlas['phenotypes'].items():
            if value['file']:
                self.check((PUBLIC / value['file'].lstrip('/')).exists(), f'{identifier}: missing atlas file')
        if 'cellIndex.json' in data:
            actual_cells = {(name, cell): values for name, cells in data['cellIndex.json']['cells'].items() for cell, values in cells.items()}
            expected_cells = {key: {direction: sorted(ids) for direction, ids in values.items()} for key, values in self.cell_hpo_ids.items()}
            self.check(actual_cells == expected_cells, 'Reverse cell index differs from all significant signed atlas rows')
            self.check(set(self.actual_cell_rows) == set(actual_cells), 'Reverse cell snapshot file set differs from explicit atlas/cell index')
            for key, rows in self.actual_cell_rows.items():
                expected_rows = self.expected_cell_rows.get(key, [])
                order = lambda row: (row['hpo_id'], row['sourceRecordId'] or '', row['atlas'], row['cell'])
                # JSON numeric 0 and 0.0 have the same value. Compare source
                # dictionaries directly, preserving numeric precision/signs,
                # rather than introducing a serializer spelling constraint.
                self.check(sorted(rows, key=order) == sorted(expected_rows, key=order),
                           f'{key}: reverse cell rows differ from independently reconstructed per-HPO signed source rows')
            for name, cells in data['cellIndex.json']['cells'].items():
                self.counts['reverseIndexCells:' + name] = len(cells)
        for gene, value in variant_index.items():
            self.counts['variantIndexGenes'] += 1
            if value.get('file'):
                self.check((PUBLIC / value['file'].lstrip('/')).exists(), f'{gene}: missing variant file')
            if value.get('complete'):
                self.counts['completeVariantGenes'] += 1
            else:
                self.warn('incompleteVariantGenes', f'{gene}: {value.get("retrievedCount", 0)}/{value.get("matchedCount", "unknown")}; {value.get("error", value.get("refreshError", ""))}')
            if value.get('stale'):
                self.warn('staleVariantGenes', gene)
        for gene, rows in associations.items():
            if rows:
                continue
            ids = self.variant_gene_ids[gene]
            self.check(len(ids) == 1, f'{gene}: missing or ambiguous exact ClinVar gene identity bridge')
            for identifier in ids:
                self.check(data['geneIdentifiers.json'].get(identifier) == gene,
                           f'{gene}: derived gene identity differs from exact ClinVar symbol/id source records')
        self.check(set(data['geneIdentifiers.json'].values()) == panel, 'Gene identity bridge does not cover the explicit panel')
        for nct in trial_index:
            self.check((PUBLIC / 'data/evidence/trials' / (nct + '.json')).exists(), f'{nct}: missing trial file')
            if trial_index[nct].get('stale'):
                self.warn('staleRegistrySnapshots', nct)
        trial_metadata = data['trialIndex.json']['metadata']
        retained_stale = sum(bool(record.get('stale')) for record in trial_index.values())
        self.check(trial_metadata['retrieved'] == len(trial_index) - retained_stale,
                   'Registry successful-current retrieval count differs from index')
        self.check(trial_metadata.get('retainedStale', 0) == retained_stale, 'Registry retained-stale count differs from index')
        for nct, error in data['trialIndex.json']['errors'].items():
            self.warn('failedTrialRetrievals', f'{nct}: {error}')
        for assessment in curated['assessments']:
            for trial in assessment.get('trials', []):
                if trial.get('nctId') and trial['nctId'] not in trial_index:
                    self.warn('curatedTrialsWithoutSnapshot', f'{assessment["id"]}:{trial["nctId"]}')
        linked_trial_ids = set()
        for source in curated['sources']:
            url = urllib.parse.urlparse(source['url'])
            if url.hostname in ('clinicaltrials.gov', 'www.clinicaltrials.gov'):
                match = re.fullmatch(r'/study/(NCT\d{8})/?', url.path)
                if match:
                    linked_trial_ids.add(match.group(1))
                    if match.group(1) not in trial_index:
                        self.warn('linkedRegistrySourcesWithoutSnapshot', f'{source["id"]}:{match.group(1)}')
        self.counts['distinctCuratedLinkedRegistryIds'] = len(linked_trial_ids)
        therapy_ids = {assessment['id'] for assessment in curated['assessments']}
        self.counts['alleleSpecificCases'] = len(functional)
        case_ids = [case['id'] for case in functional]
        self.check(len(set(case_ids)) == len(case_ids), 'Duplicate allele case IDs')
        for case in functional:
            if case.get('therapyId'):
                self.check(case['therapyId'] in therapy_ids, f'{case["id"]}: unresolved therapyId')
            else:
                self.counts['functionalCasesWithoutTreatment'] += 1
            for identifier in case['variantIds']:
                self.check(identifier in self.variant_ids[case['gene']], f'{case["id"]}: variation ID absent from same-gene snapshot: {identifier}')
            self.check(case['diseaseId'] in {row['disease_id'] for row in associations.get(case['gene'], [])}, f'{case["id"]}: same-gene disease join absent')
            evidence = case.get('mechanismEvidence')
            if evidence:
                self.counts['exactAlleleMechanismCases'] += 1
                scope = evidence['scope']
                self.check(scope['gene'] == case['gene'] and scope['diseaseId'] == case['diseaseId']
                           and scope['variantId'] in case['variantIds'], f'{case["id"]}: mechanism identity scope mismatch')
                if evidence.get('directionUnresolved'):
                    self.check(bool(evidence.get('directionReason', '').strip()), f'{case["id"]}: unresolved intervention direction lacks reason')
                for context_id in evidence.get('contextIds', []):
                    match = next((context for context in data['mechanismContexts.json'] if context['id'] == context_id), None)
                    self.check(match is not None and match['gene'] == case['gene'] and case['diseaseId'] in match['diseaseIds'],
                               f'{case["id"]}: unresolved same-gene mechanism context {context_id}')
            scenario_ids = [scenario['id'] for scenario in case.get('assessmentScenarios', [])]
            self.check(len(set(scenario_ids)) == len(scenario_ids), f'{case["id"]}: duplicate experiment scenario')
            positive_hpos = {item['hpoId'] for item in case.get('phenotypes', [])}
            positive_hpos.update(item['hpoId'] for item in case.get('observedPhenotypes', []) if item['present'])
            for facts_field in ('gates', 'modifiers'):
                for fact in case.get(facts_field, []):
                    self.counts['alleleGateFacts' if facts_field == 'gates' else 'alleleMaturityFacts'] += 1
                    scope = fact.get('scope', {})
                    self.check(scope.get('gene') == case['gene'] and scope.get('diseaseId') == case['diseaseId']
                               and scope.get('variantId') in case['variantIds'] and scope.get('hpoId') in positive_hpos,
                               f'{case["id"]}: requirement/maturity fact lacks matching positive observed/endpoint scope')
                    self.check(bool(fact.get('sources')), f'{case["id"]}: unsourced gate/maturity fact')
                    optional = ('constructId', 'populationId', 'species', 'route', 'cells', 'atlas', 'doseContext')
                    self.check(any(all(scope.get(key) is None or scope[key] == scenario.get(key) for key in optional)
                                   for scenario in case.get('assessmentScenarios', [])),
                               f'{case["id"]}: gate/maturity facts cannot be selected in a matching experiment')
        endpoint_ids = [record['assessmentId'] for record in endpoints.get('assessments', [])]
        self.check(len(set(endpoint_ids)) == len(endpoint_ids), 'Duplicate endpoint assessment IDs')
        self.check(set(endpoint_ids) == therapy_ids, 'Endpoint records do not cover the exact current assessment inventory')
        result_ids = [result['id'] for record in endpoints.get('assessments', []) for result in record['endpointResults']]
        observation_ids = [observation['id'] for record in endpoints.get('assessments', []) for observation in record['cellObservations']]
        self.check(len(set(result_ids)) == len(result_ids), 'Duplicate endpoint result IDs')
        self.check(len(set(observation_ids)) == len(observation_ids), 'Duplicate cellular observation IDs')
        self.counts['endpointScopedAssessments'] = len(endpoint_ids)
        for record in endpoints.get('assessments', []):
            assessment = next((item for item in curated['assessments'] if item['id'] == record['assessmentId']), None)
            self.check(assessment is not None, f'{record["assessmentId"]}: endpoint assessment unresolved')
            if not assessment:
                continue
            mapped_hpos = {item['hpoId'] for item in assessment['phenotypes']}
            diseases = {item['id'] for item in record['diseaseIds']}
            self.counts['endpointDiseaseJoins'] += len(diseases)
            results_by_id = {result['id']: result for result in record['endpointResults']}
            for result in record['endpointResults']:
                self.counts['endpointResults'] += 1
                self.counts['endpointResultsReviewed' if result['scopeReview'] == 'endpoint_specific' else 'endpointResultsPending'] += 1
                self.check(result['hpoId'] in mapped_hpos, f'{result["id"]}: endpoint HPO not in reviewed treatment crosswalk')
                self.check(set(result['diseaseIds']).issubset(diseases), f'{result["id"]}: disease join lacks reviewed assessment identity')
                self.check(all(ref.get('nctId') is None or ref['nctId'] in trial_index for ref in result['trialRefs']),
                           f'{result["id"]}: unresolved registry trial')
            for observation in record['cellObservations']:
                self.counts['scopedCellObservations'] += 1
                self.check(set(observation['hpoIds']).issubset(mapped_hpos), f'{observation["id"]}: cell observation endpoint scope unreviewed')
                self.check(bool(observation['endpointResultIds']) and set(observation['endpointResultIds']).issubset(results_by_id),
                           f'{observation["id"]}: unresolved cellular-observation result links')
                linked_results = [results_by_id[identifier] for identifier in observation['endpointResultIds'] if identifier in results_by_id]
                self.check(all(any(result['hpoId'] == hpo and set(observation['diseaseIds']).issubset(result['diseaseIds'])
                                       for result in linked_results) for hpo in observation['hpoIds']),
                           f'{observation["id"]}: cellular observation has no linked same-HPO diagnosis scope')
                self.check(bool(observation.get('studyRelationship')), f'{observation["id"]}: experimental/outcome study relationship unrecorded')
        self.counts['distinctVariationIdsAcrossPanel'] = len(set().union(*self.variant_ids.values())) if self.variant_ids else 0
        dosage = data['dosageEvidence.json']
        self.counts['dosageGenes'] = len(dosage['genes'])
        raw_dosage = ROOT / 'data/evidence/raw/clingen-dosage-GRCh38.tsv'
        self.check(raw_dosage.exists(), 'Missing original ClinGen dosage source')
        if raw_dosage.exists():
            self.check(hashlib.sha256(raw_dosage.read_bytes()).hexdigest() == dosage['metadata']['sha256'], 'ClinGen dosage source SHA256 mismatch')
        self.audit_hpo_lineage(data)
        self.audit_bundles()
        return self.result()

    def audit_hpo_lineage(self, data):
        for path, expected in [
            (ROOT / 'data/evidence/raw/hp.obo.gz', data['hpoTerms.json']['metadata']['sha256']),
            (ROOT / 'backend/data/phenotype_to_genes.tsv.gz', data['genePhenotypes.json']['metadata']['sha256']),
        ]:
            if not path.exists():
                self.fail(f'Missing frozen HPO source: {path.name}')
                continue
            digest = hashlib.sha256()
            with gzip.open(path, 'rb') as stream:
                while chunk := stream.read(1024 * 1024):
                    digest.update(chunk)
            self.check(digest.hexdigest() == expected, f'{path.name}: frozen HPO source SHA256 mismatch')
        flags_path = ROOT / 'backend/data/phenotypic_abnormality_ids.json.gz'
        if not flags_path.exists():
            self.fail('Backend phenotype branch snapshot absent')
            return
        with gzip.open(flags_path, 'rt') as stream:
            flags = json.load(stream)
        terms = data['hpoTerms.json']['terms']
        self.check(set(flags['knownIds']) == set(terms), 'Backend/frontend known ontology IDs differ')
        self.check(set(flags['ids']) == {identifier for identifier, term in terms.items() if term['isPhenotypicAbnormality']},
                   'Backend/frontend clinical phenotype branch differs')
        self.check(flags['metadata']['sha256'] == data['hpoTerms.json']['metadata']['sha256'], 'Backend/frontend ontology source SHA256 differs')
        manifest = json.loads((ROOT / 'backend/data/hpo_associations_manifest.json').read_text())
        self.check(manifest['sha256'] == data['genePhenotypes.json']['metadata']['sha256'], 'Backend/frontend HPO association source SHA256 differs')

    def audit_bundles(self):
        bundle = ROOT / 'data/evidence/published'
        manifest_path = bundle / 'manifest.json'
        if not manifest_path.exists():
            self.fail('Published evidence bundle manifest absent')
            return
        manifest = self.load(manifest_path, obj(['schemaVersion', 'format', 'archives'], {
            'schemaVersion': {'const': 1}, 'format': {'const': 'gzip_ndjson_path_sha256_content'},
            'archives': {'type': 'array', 'items': obj(['group', 'file', 'count', 'bytes', 'sha256', 'uncompressedBytes', 'snapshots'])},
        }))
        if manifest is None:
            return
        groups = [archive['group'] for archive in manifest['archives']]
        self.check(sorted(groups) == ['associations', 'trials', 'variants'], 'Published bundle groups are missing or duplicated')
        for archive in manifest['archives']:
            group = archive['group']
            if group not in PUBLIC_SCHEMAS or archive['file'] != f'{group}.ndjson.gz':
                self.fail('Invalid published archive path')
                continue
            path = bundle / archive['file']
            if not path.exists():
                self.fail(f'Missing published archive: {path.name}')
                continue
            packed = path.read_bytes()
            self.counts['bundleBytes'] += len(packed)
            self.check(len(packed) == archive['bytes'], f'{path.name}: compressed byte count mismatch')
            self.check(hashlib.sha256(packed).hexdigest() == archive['sha256'], f'{path.name}: compressed SHA256 mismatch')
            expected = {item['path']: item for item in archive['snapshots']}
            self.check(len(expected) == len(archive['snapshots']) == archive['count'], f'{path.name}: manifest snapshot count mismatch')
            seen, total_bytes = set(), 0
            try:
                with gzip.open(path, 'rt', encoding='utf-8') as stream:
                    for line in stream:
                        record = json.loads(line)
                        name = record['path']
                        if not re.fullmatch(re.escape(group) + r'/[A-Za-z0-9_:.-]+\.json', name):
                            self.fail(f'{path.name}: unsafe snapshot path {name}')
                            continue
                        self.check(name not in seen, f'{path.name}: duplicate snapshot path {name}')
                        seen.add(name)
                        content = record['content'].encode('utf-8')
                        total_bytes += len(content)
                        self.counts['bundledSnapshotFiles'] += 1
                        self.check(hashlib.sha256(content).hexdigest() == record['sha256'], f'{name}: bundled content SHA256 mismatch')
                        item = expected.get(name)
                        self.check(item is not None and item.get('sha256') == record['sha256'] and item.get('bytes') == len(content),
                                   f'{name}: bundle manifest/record mismatch')
                        public_path = PUBLIC / 'data/evidence' / name
                        self.check(public_path.exists() and public_path.read_bytes() == content, f'{name}: bundle/public bytes differ')
                public_names = {p.relative_to(PUBLIC / 'data/evidence').as_posix() for p in (PUBLIC / 'data/evidence' / group).glob('*.json')}
                self.check(seen == public_names == set(expected), f'{path.name}: archive/manifest/public file sets differ')
                self.check(len(seen) == archive['count'], f'{path.name}: archive file count mismatch')
                self.check(total_bytes == archive['uncompressedBytes'], f'{path.name}: uncompressed byte count mismatch')
                self.counts['bundleUncompressedBytes'] += total_bytes
            except (OSError, ValueError, KeyError, TypeError) as error:
                self.fail(f'{path.name}: bundle decode failed: {error}')

    def audit_associations(self, path, value, atlas):
        identifier = value['hpo_id']
        record = atlas['phenotypes'].get(identifier)
        self.check(record is not None, f'{path.name}: no atlas index record')
        if record is None:
            return
        rows = value['rows']
        self.counts['atlasRows'] += len(rows)
        self.check(record['storedRows'] == len(rows), f'{path.name}: retained-row count mismatch')
        self.check(record['coverage'] == value['_metadata']['coverage'], f'{path.name}: coverage mismatch')
        threshold = value['_metadata']['qThreshold']
        by_atlas = defaultdict(list)
        seen = set()
        for row in rows:
            key = (row['atlas'], row['cell'])
            self.check(key not in seen, f'{path.name}: duplicate atlas/cell row: {key}')
            seen.add(key)
            by_atlas[row['atlas']].append(row)
            estimate, q = row['estimate'], row['q']
            direction = 'unknown' if estimate is None else 'positive' if estimate > 0 else 'negative' if estimate < 0 else 'zero'
            significance = 'unknown' if q is None else 'significant' if q < threshold else 'not_significant'
            self.check(row['direction'] == direction, f'{path.name}: direction mismatch')
            self.check(row['significance'] == significance, f'{path.name}: significance mismatch')
            if significance == 'significant' and direction in ('positive', 'negative'):
                self.cell_hpo_ids[key][direction + 'HpoIds'].add(identifier)
            if q is not None and 0 <= q < 0.05:
                self.expected_cell_rows[key].append({**row, 'hpo_id': identifier})
            if record['coverage'] == 'all_significant_rows':
                self.check(significance == 'significant', f'{path.name}: nonsignificant row in significant-only coverage')
        for name, stats in record['atlases'].items():
            these = by_atlas[name]
            self.check(len(these) == stats['storedRows'], f'{path.name}/{name}: atlas count mismatch')
            if record['coverage'] == 'all_tested_rows':
                self.check(len(these) == stats['testedRows'], f'{path.name}/{name}: all-tested coverage truncated')
            for direction, key in [('positive', 'positiveSignificant'), ('negative', 'negativeSignificant'), ('zero', 'zeroDirectionSignificant'), ('unknown', 'unknownDirectionSignificant')]:
                count = sum(row['direction'] == direction and row['significance'] == 'significant' for row in these)
                self.check(count == stats[key], f'{path.name}/{name}: {key} mismatch')
            positives = [row for row in these if row['direction'] == 'positive' and row['significance'] == 'significant']
            top = min(positives, key=lambda row: (row['q'], row['cell'])) if positives else None
            self.check((stats['top']['cell'], stats['top']['q']) == (top['cell'], top['q']) if top and stats['top'] else top is None and stats['top'] is None,
                       f'{path.name}/{name}: top must be positive and minimal-q')

    def audit_variants(self, path, value, index):
        metadata, variants = value['metadata'], value['variants']
        gene = metadata['gene']
        self.counts['variantRows'] += len(variants)
        ids = {row['id'] for row in variants}
        self.variant_ids[gene].update(ids)
        self.check(len(ids) == len(variants), f'{path.name}: duplicate variation IDs')
        self.check(metadata['retrievedCount'] == len(variants), f'{path.name}: variant count mismatch')
        if metadata['complete']:
            self.check(metadata['matchedCount'] == len(variants), f'{path.name}: false completeness')
        if gene in index:
            self.check(index[gene].get('retrievedCount') == len(variants), f'{path.name}: index/public count mismatch')
            self.check(index[gene].get('reference') == value.get('reference'), f'{path.name}: index/public reference differs')
        else:
            self.warn('unindexedPublicVariants', gene)
        original_ids, original_records = set(), {}
        for source in metadata['searchSources'] + metadata['sources']:
            cache = ROOT / 'data/evidence/raw' / (hashlib.sha256(source['sourceUrl'].encode()).hexdigest() + '.json.gz')
            self.check(cache.exists(), f'{path.name}: source response missing from cache')
            if cache.exists():
                with gzip.open(cache, 'rt') as stream:
                    cached = json.load(stream)
                self.check(all(cached.get(key) == source.get(key) for key in ('sourceUrl', 'retrievedAt', 'sha256')),
                           f'{path.name}: cache/provenance mismatch')
                search = cached['data'].get('esearchresult')
                if search is not None:
                    self.check(int(search['count']) == metadata['matchedCount'], f'{path.name}: source matched count changed')
                    original_ids.update(search.get('idlist', []))
                summaries = cached['data'].get('result', {})
                for identifier in summaries.get('uids', []):
                    original_records[identifier] = summaries[identifier]
        if metadata['complete']:
            self.check(ids == original_ids, f'{path.name}: complete snapshot differs from search identifier set')
        for variant in variants:
            for identity in variant.get('genes', []):
                if identity.get('symbol') == gene and re.fullmatch(r'\d+', str(identity.get('geneid', ''))):
                    self.variant_gene_ids[gene].add(str(identity['geneid']))
            original = original_records.get(variant['id'])
            self.check(original is not None, f'{path.name}: variant {variant["id"]} not traceable to a summary')
            if original is not None:
                self.check(variant == variant_record(original), f'{path.name}: variant {variant["id"]} does not preserve current source fields')
        reference = value.get('reference')
        if not reference:
            self.warn('missingGeneReference', gene)
        else:
            self.counts['geneReferenceSnapshots'] += 1
            self.audit_reference(gene, reference)
            self.check(reference.get('assembly') == 'GRCh38', f'{path.name}: unsupported reference assembly')
            transcript = reference.get('canonicalTranscript')
            if transcript:
                self.counts['canonicalTranscriptSnapshots'] += 1
                self.check(transcript.get('codingBasesExcludingStop') == transcript.get('proteinLengthAa') * 3,
                           f'{path.name}: coding lower bound not translation length times 3')
        for variant in variants:
            self.counts['variantClassification:' + (variant['classification'] or 'not_reported')] += 1
            if not any(allele.get('spdi') for allele in variant['alleles']):
                self.counts['variantsWithoutSpdi'] += 1
            if 'somaticClinicalImpact' not in variant or 'oncogenicity' not in variant:
                self.counts['variantsWithoutSeparateSomaticFields'] += 1

    def audit_trial(self, path, trial):
        source = trial['provenance']
        cache = ROOT / 'data/evidence/raw' / (hashlib.sha256(source['sourceUrl'].encode()).hexdigest() + '.json.gz')
        if not cache.exists():
            self.fail(f'{path.name}: registry source response missing')
            return
        with gzip.open(cache, 'rt') as stream:
            entry = json.load(stream)
        self.check(all(entry.get(key) == source.get(key) for key in ('sourceUrl', 'retrievedAt', 'sha256')),
                   f'{path.name}: registry cache/provenance mismatch')
        self.check(trial == trial_record(entry), f'{path.name}: registry snapshot fields differ from source')
        self.check(trial['outcomeInterpretation'] == 'not_automatically_assessed', f'{path.name}: registry metadata promoted to a clinical conclusion')

    def audit_reference(self, gene, reference):
        source = reference.get('provenance', {})
        if not source.get('sourceUrl'):
            self.fail(f'{gene}: missing Ensembl reference provenance')
            return
        cache = ROOT / 'data/evidence/raw' / (hashlib.sha256(source['sourceUrl'].encode()).hexdigest() + '.json.gz')
        if not cache.exists():
            self.fail(f'{gene}: Ensembl reference source response missing')
            return
        with gzip.open(cache, 'rt') as stream:
            entry = json.load(stream)
        self.check(all(entry.get(key) == source.get(key) for key in ('sourceUrl', 'retrievedAt', 'sha256')),
                   f'{gene}: reference cache/provenance mismatch')
        original = entry['data']
        for target, field in [('ensemblId', 'id'), ('assembly', 'assembly_name'), ('chromosome', 'seq_region_name'),
                              ('start', 'start'), ('end', 'end'), ('strand', 'strand'), ('description', 'description')]:
            self.check(reference.get(target) == original.get(field), f'{gene}: reference {target} differs from source')
        transcripts = original.get('Transcript', [])
        self.check(reference['transcriptCount'] == len(transcripts), f'{gene}: source transcript count differs')
        canonical = [item for item in transcripts if item.get('is_canonical')]
        self.check(len(canonical) <= 1, f'{gene}: multiple source canonical transcripts require resolution')
        exported = reference.get('canonicalTranscript')
        self.check(bool(canonical) == bool(exported), f'{gene}: canonical transcript source/export mismatch')
        if canonical and exported:
            original_transcript = canonical[0]
            for field in ('id', 'version', 'start', 'end', 'strand'):
                self.check(exported.get(field) == original_transcript.get(field), f'{gene}: canonical {field} differs from source')
            self.check(exported['proteinLengthAa'] == original_transcript.get('Translation', {}).get('length'),
                       f'{gene}: translation length differs from source')
            exons = [{'id': item['id'], 'start': item['start'], 'end': item['end']} for item in original_transcript.get('Exon', [])]
            self.check(exported['exons'] == exons, f'{gene}: exon coordinates/identity differ from source')

    def result(self):
        return {'counts': dict(self.counts), 'errorCount': len(self.errors), 'errors': self.errors[:30],
                'warnings': {name: {'count': len(values), 'examples': values[:12]} for name, values in self.warnings.items()}}


if __name__ == '__main__':
    result = Audit().run()
    print(json.dumps(result, indent=2))
    sys.exit(bool(result['errorCount']))
