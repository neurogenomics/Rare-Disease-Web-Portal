#!/usr/bin/env python3
"""Reproducible public evidence snapshots. Never infer efficacy from trial status.

python3 scripts/refresh_evidence.py --trials --genes
ClinVar downloads all records returned by the explicit gene query.
--max-variants is an optional *declared* cap for development, not completeness.
Cached source responses retain URL, retrieval time and SHA256. No API secrets.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import gzip
import hashlib
import json
from pathlib import Path
import re
import time
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'frontend/src/data/evidence'
PUBLIC = ROOT / 'frontend/public/data/evidence'
CACHE = ROOT / 'data/evidence/raw'
EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'


def now():
    return datetime.now(timezone.utc).isoformat()


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    temp.replace(path)


def fetch(url, refresh=False):
    key = hashlib.sha256(url.encode()).hexdigest()
    path = CACHE / (key + '.json.gz')
    if path.exists() and not refresh:
        try:
            with gzip.open(path, 'rt') as f:
                cached = json.load(f)
            if not (cached['data'].get('error') or cached['data'].get('ERROR')):
                return cached
        except (ValueError, OSError, EOFError):
            pass  # Interrupted cache writes are refetched, not permanent failure.
    for attempt in range(4):
        try:
            request = urllib.request.Request(url, headers={'Accept': 'application/json', 'User-Agent': 'RareDiseaseEvidencePortal/1.0 (public research data snapshot)'})
            with urllib.request.urlopen(request, timeout=45) as response:
                raw = response.read()
                entry = {'sourceUrl': url, 'retrievedAt': now(), 'sha256': hashlib.sha256(raw).hexdigest(),
                         'lastModified': response.headers.get('Last-Modified'), 'data': json.loads(raw)}
                if entry['data'].get('error') or entry['data'].get('ERROR'):
                    raise ValueError(str(entry['data'].get('error') or entry['data'].get('ERROR'))[:250])
            CACHE.mkdir(parents=True, exist_ok=True)
            temporary=path.with_suffix('.tmp')
            with gzip.open(temporary, 'wt') as f:
                json.dump(entry, f)
            temporary.replace(path)
            return entry
        except Exception:
            if attempt == 3:
                raise
            time.sleep(1.5 * (attempt + 1))


def provenance(entry):
    return {k: v for k, v in entry.items() if k != 'data'}


def trial_record(entry):
    d = entry['data']
    p = d.get('protocolSection', {})
    status = p.get('statusModule', {})
    results = d.get('resultsSection', {})
    outcomes = results.get('outcomeMeasuresModule', {}).get('outcomeMeasures', [])
    return {
        'nctId': p.get('identificationModule', {}).get('nctId'),
        'title': p.get('identificationModule', {}).get('briefTitle'),
        'status': status.get('overallStatus'), 'whyStopped': status.get('whyStopped'),
        'lastUpdate': status.get('lastUpdatePostDateStruct', {}).get('date'),
        'completionDate': status.get('completionDateStruct', {}).get('date'),
        'hasResults': d.get('hasResults', False),
        'design': p.get('designModule', {}),
        'conditions': p.get('conditionsModule', {}).get('conditions', []),
        'interventions': p.get('armsInterventionsModule', {}).get('interventions', []),
        'registeredOutcomes': p.get('outcomesModule', {}),
        'reportedOutcomes': outcomes,
        'adverseEvents': results.get('adverseEventsModule', {}),
        'references': p.get('referencesModule', {}).get('references', []),
        'documents': d.get('documentSection', {}),
        'outcomeInterpretation': 'not_automatically_assessed',
        'provenance': provenance(entry),
    }


def refresh_trials(args):
    catalog = json.loads((DATA / 'legacyCatalog.json').read_text())
    ids = {t.get('nct_id') for p in catalog['therapies'] for t in p['trials']}
    for p in catalog['therapies']:
        ids.update(m.get('nctId') for m in p['mappings'])
    curated = DATA / 'curatedEvidence.json'
    if curated.exists():
        evidence = json.loads(curated.read_text())
        ids.update(t['nctId'] for a in evidence['assessments'] for t in a['trials'] if t.get('nctId'))
        # Companion cohorts can be source evidence without sharing the selected
        # endpoint/population of an assessment. Preserve their registry records
        # without promoting them to an assessed treatment outcome.
        for source in evidence.get('sources', []):
            url = urllib.parse.urlparse(source.get('url') or '')
            if url.hostname in ('clinicaltrials.gov', 'www.clinicaltrials.gov'):
                match = re.fullmatch(r'/study/(NCT\d{8})/?', url.path)
                if match:
                    ids.add(match.group(1))
    ids.update(['NCT02193074', 'NCT02292537', 'NCT02243568', 'NCT02676076', 'NCT04903288',
                'NCT03761849', 'NCT03852511', 'NCT02500381', 'NCT03676192', 'NCT01254782',
                'NCT04259281', 'NCT04442295', 'NCT00909532', 'NCT00909727'])
    # Invalid historical/discovery identifiers are retained as audit issues in
    # the legacy catalog, but these two exploratory IDs were not source claims.
    ids.difference_update(['NCT01254782', 'NCT02243568'])
    ids = sorted(i for i in ids if i and re.fullmatch(r'NCT\d{8}', i))
    previous_path = DATA / 'trialIndex.json'
    previous = json.loads(previous_path.read_text()).get('trials', {}) if previous_path.exists() else {}
    records, errors = {}, {}
    def one(nct):
        return trial_record(fetch('https://clinicaltrials.gov/api/v2/studies/' + nct, args.refresh))
    with ThreadPoolExecutor(max_workers=4) as pool:
        jobs = {pool.submit(one, nct): nct for nct in ids}
        for task in as_completed(jobs):
            nct = jobs[task]
            try:
                record = task.result()
                save(PUBLIC / 'trials' / (nct + '.json'), record)
                records[nct] = {k: v for k, v in record.items() if k not in ('reportedOutcomes', 'adverseEvents', 'documents')}
                records[nct]['reportedOutcomeCount'] = len(record['reportedOutcomes'])
            except Exception as e:
                errors[nct] = str(e)
                if nct in previous and (PUBLIC / 'trials' / (nct + '.json')).exists():
                    records[nct] = {**previous[nct], 'stale': True,
                                    'refreshError': str(e), 'refreshAttemptedAt': now()}
    retrieved = len(records) - sum(bool(r.get('stale')) for r in records.values())
    save(DATA / 'trialIndex.json', {'metadata': {'generatedAt': now(), 'requested': len(ids), 'retrieved': retrieved,
         'retainedStale': len(records) - retrieved,
         'scope': 'Trials explicitly identified in the legacy catalog, curated assessments and linked registry sources; not all trials of every therapy.',
         'interpretation': 'COMPLETED means a registry lifecycle state, not efficacy. Posted results still require endpoint-specific assessment.'},
         'trials': records, 'errors': errors})
    print(f'Trials: {retrieved}/{len(ids)}; {len(records) - retrieved} retained stale; {len(errors)} errors', flush=True)


def stars(status):
    value = (status or '').lower()
    if value == 'practice guideline': return 4
    if value == 'reviewed by expert panel': return 3
    if value == 'criteria provided, multiple submitters, no conflicts': return 2
    if value.startswith('criteria provided'): return 1
    if value in ('no assertion criteria provided', 'no assertion provided', 'no classifications from unflagged records', 'no classification provided'): return 0
    return None


def variant_record(d):
    c = d.get('germline_classification') or d.get('clinical_significance') or {}
    variations = d.get('variation_set') or []
    return {'id': d['uid'], 'accession': d.get('accession_version', d.get('accession')), 'title': d.get('title'),
            'variantType': d.get('obj_type'), 'genes': d.get('genes', []),
            'classification': c.get('description'), 'reviewStatus': c.get('review_status'), 'reviewStars': stars(c.get('review_status')),
            'lastEvaluated': c.get('last_evaluated'), 'conditions': c.get('trait_set', []),
            'consequences': d.get('molecular_consequence_list', []), 'proteinChange': d.get('protein_change'),
            'alleles': [{'alleleId': x.get('measure_id'), 'name': x.get('variation_name'), 'cdnaChange': x.get('cdna_change'),
                        'locations': x.get('variation_loc', []), 'spdi': x.get('canonical_spdi')} for x in variations],
            'submissions': d.get('supporting_submissions', {}), 'url': 'https://www.ncbi.nlm.nih.gov/clinvar/variation/' + d['uid'] + '/',
            'somaticClinicalImpact':d.get('clinical_impact_classification',{}), 'oncogenicity':d.get('oncogenicity_classification',{}),
            'phenotypeLink': 'disease_context_only', 'mechanism': 'not_established_by_consequence'}


def summary_batches(ids, refresh=False):
    url=EUTILS+'esummary.fcgi?'+urllib.parse.urlencode({'db':'clinvar','id':','.join(ids),'retmode':'json'})
    entry=fetch(url,refresh)
    time.sleep(.36)
    error=entry['data'].get('eutilsresult',{}).get('ERROR')
    if error and 'size' in error.lower() and len(ids)>1:
        midpoint=len(ids)//2
        yield from summary_batches(ids[:midpoint],refresh)
        yield from summary_batches(ids[midpoint:],refresh)
    elif error:
        raise ValueError(error[:250])
    else:
        yield entry


def gene_reference(gene, refresh=False):
    e = fetch('https://rest.ensembl.org/lookup/symbol/homo_sapiens/' + urllib.parse.quote(gene) + '?expand=1;content-type=application/json', refresh)
    g = e['data']
    transcripts = g.get('Transcript', [])
    canonical = next((t for t in transcripts if t.get('is_canonical')), None)
    # Translation length is amino-acid length, not genomic gene span. Stop codon
    # and all regulatory/vector components remain explicitly uncounted.
    return {'gene': gene, 'ensemblId': g.get('id'), 'assembly': g.get('assembly_name'), 'chromosome': g.get('seq_region_name'),
            'start': g.get('start'), 'end': g.get('end'), 'strand': g.get('strand'), 'description': g.get('description'),
            'canonicalTranscript': ({'id': canonical['id'], 'version': canonical.get('version'), 'start': canonical['start'],
                'end': canonical['end'], 'strand': canonical.get('strand'), 'proteinLengthAa': canonical.get('Translation', {}).get('length'),
                'codingBasesExcludingStop': canonical.get('Translation', {}).get('length', 0) * 3 or None,
                'exons': [{'id': x['id'], 'start': x['start'], 'end': x['end']} for x in canonical.get('Exon', [])]} if canonical else None),
            'transcriptCount': len(transcripts), 'provenance': provenance(e)}


def refresh_genes(args):
    genes = args.gene_symbols.split(',') if args.gene_symbols else json.loads((DATA / 'geneList.json').read_text())
    index_path = DATA / 'variantIndex.json'
    index = json.loads(index_path.read_text()) if index_path.exists() else {'genes': {}}
    for gene in genes:
        existing = index['genes'].get(gene, {})
        if existing.get('complete') and not args.refresh and not args.max_variants:
            if not existing.get('reference'):
                try:
                    existing['reference']=gene_reference(gene)
                    existing['referenceError']=None
                    public_path=PUBLIC/'variants'/(gene+'.json')
                    public=json.loads(public_path.read_text())
                    public['reference']=existing['reference']
                    save(public_path,public)
                    save(index_path,index)
                except Exception as e:
                    existing['referenceError']=str(e)[:250]
                    save(index_path,index)
            print(gene + ': cached complete', flush=True)
            continue
        query = f'{gene}[gene]'
        try:
            # Retrieve all classifications. VUS and benign records must remain
            # distinguishable from pathogenic records and from absent evidence.
            # One resolved identifier set avoids unstable offset paging.
            # A server cap is disclosed as partial coverage instead.
            url = EUTILS + 'esearch.fcgi?' + urllib.parse.urlencode({'db':'clinvar', 'term':query, 'retmode':'json', 'retmax':100000, 'retstart':0})
            search = fetch(url, args.refresh)
            time.sleep(.36)
            result = search['data']['esearchresult']
            if any(result.get('errorlist', {}).values()) or result.get('ERROR'):
                raise ValueError(str(result.get('errorlist') or result.get('ERROR')))
            total = int(result['count'])
            ids = result.get('idlist', [])
            search_sources = [provenance(search)]
            requested_ids = list(dict.fromkeys(ids))[:args.max_variants or None]
            query_translation=result.get('querytranslation',query)
            records, sources = [], []
            for start in range(0, len(requested_ids), 200):
                subset = requested_ids[start:start+200]
                for summary in summary_batches(subset,args.refresh):
                    result = summary['data'].get('result', {})
                    if result.get('uids') is None: raise ValueError('Missing ClinVar summaries')
                    for uid in result['uids']:
                        if result[uid].get('error'): raise ValueError(str(result[uid]['error']))
                        records.append(variant_record(result[uid]))
                    sources.append(provenance(summary))
            records = list({v['id']:v for v in records}.values())
            gene_ref, gene_error = None, None
            try: gene_ref = gene_reference(gene, args.refresh)
            except Exception as e: gene_error = str(e)
            metadata = {'gene':gene,'query':query,'generatedAt':now(),'matchedCount':total,'retrievedCount':len(records),
                        'complete':len(records)==total and {r['id'] for r in records}==set(requested_ids),
                        'classificationScope':'All ClinVar variation records returned by the gene query. Germline classification is shown where reported; somatic and oncogenicity assertions are separate.',
                        'queryTranslation':query_translation,
                        'retrievalInterval':{'first':min(x['retrievedAt'] for x in search_sources+sources),'last':max(x['retrievedAt'] for x in search_sources+sources)},
                        'declaredCap':args.max_variants,'searchSources':search_sources,'sources':sources,
                        'limitations':['Variant-level aggregate classifications may combine conditions. Follow RCV/SCV for condition-specific assertions.',
                                      'Consequence list spans transcripts; it does not prove loss of function, haploinsufficiency, or a specific HPO phenotype.',
                                      'ClinVar classifications are submitted evidence; phenotype/disease and therapy eligibility need separate review.']}
            save(PUBLIC / 'variants' / (gene + '.json'), {'metadata':metadata,'reference':gene_ref,'variants':records})
            index['genes'][gene] = {k:v for k,v in metadata.items() if k not in ('sources','searchSources','limitations')}
            index['genes'][gene].update({'reference':gene_ref,'referenceError':gene_error,'file':'/data/evidence/variants/'+gene+'.json'})
            print(f'{gene}: {len(records)}/{total} variants; reference={bool(gene_ref)}', flush=True)
        except Exception as e:
            if existing.get('retrievedCount'):
                index['genes'][gene]={**existing,'refreshError':str(e)[:250],'refreshAttemptedAt':now(),'stale':True}
            else:
                index['genes'][gene] = {'gene':gene,'error':str(e)[:250],'complete':False,'retrievedCount':0,'generatedAt':now()}
            print(f'{gene}: ERROR {str(e)[:250]}', flush=True)
        index['metadata'] = {'generatedAt':now(),'geneCount':len(index['genes']),
                             'scope':'Explicit research gene panel from historical therapies and mechanism/diverse modality examples; not genome-wide.'}
        save(index_path,index)


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--trials',action='store_true')
    parser.add_argument('--genes',action='store_true')
    parser.add_argument('--gene-symbols')
    parser.add_argument('--max-variants',type=int)
    parser.add_argument('--refresh',action='store_true')
    args=parser.parse_args()
    if args.max_variants is not None and args.max_variants < 1: parser.error('max variants must be positive')
    if args.trials: refresh_trials(args)
    if args.genes: refresh_genes(args)
