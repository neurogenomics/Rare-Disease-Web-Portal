import test from 'node:test';
import assert from 'node:assert/strict';
import {locateVariant} from '../src/lib/evidenceModel.js';
import {buildCandidates} from '../src/lib/modalityModel.js';
const reference={assembly:'GRCh38',chromosome:'3',canonicalTranscript:{start:100,end:1000,exons:[{id:'exon1',start:500,end:600}]}};
const variant=(bounds={},name='NC_000003.12:g.550A>G')=>({alleles:[{name,locations:[{assembly_name:'GRCh38',chr:'3',start:'550',stop:'550',...bounds}]}]});
test('uncertain structural bounds do not become precise exon evidence',()=>{
  for(const field of ['inner_start','inner_stop','outer_start','outer_stop']) {
    const result=locateVariant(variant({[field]:'700'}),reference);
    assert.equal(result.kind,'unknown');
    assert.match(result.reason,/uncertain/);
  }
  assert.equal(locateVariant(variant({},'NC_000003.12:g.(?_550)_(600_?)del'),reference).kind,'unknown');
  assert.equal(locateVariant(variant({inner_start:'',inner_stop:'',outer_start:'',outer_stop:''}),reference).kind,'exonic');
});
test('ontology metadata is not a therapeutic phenotype endpoint',()=>{
  const rows=buildCandidates({genePhenotypes:{genes:{GENE:[
    {hpo_id:'HP:1',hpo_name:'An inherited condition',disease_id:'OMIM:1',isPhenotypicAbnormality:false},
    {hpo_id:'HP:2',hpo_name:'Measured functional abnormality',disease_id:'OMIM:1',isPhenotypicAbnormality:true},
  ]}}});
  assert.deepEqual(rows.map(row=>row.hpoId),['HP:2']);
});
