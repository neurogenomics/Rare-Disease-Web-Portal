import test from 'node:test';
import assert from 'node:assert/strict';
import {modalities, priorityModifiers, assessPriorityModifiers, assessCargo, assessModality, buildCandidates, rankCandidates} from '../src/lib/modalityModel.js';

const source = 'https://example.org/condition-specific-evidence';
const reference = cds => ({canonicalTranscript: {codingBasesExcludingStop: cds}, provenance: {sourceUrl: source}});
const context = () => ({gene: 'GENE1', disease: 'Disease A', diseaseIds: ['OMIM:1'], mechanism: 'haploinsufficiency', sourceUrls: [source]});
const gateOf = (assessment, id) => assessment.gates.find(gate => gate.id === id);
const gateScope = (modalityId, overrides = {}) => ({gene: 'GENE1', diseaseId: 'OMIM:1', hpoId: 'HP:1', modalityId, ...overrides});
const gateSelection = (overrides = {}) => ({diseaseId: 'OMIM:1', hpoId: 'HP:1', ...overrides});
const gateEvidence = (modalityId, overrides = {}) => ({
  status: 'supported', reason: 'Measured effect in this exact disease and phenotype context',
  sources: [source], scope: gateScope(modalityId), ...overrides,
});

test('CDS is a lower bound, not a complete vector cassette', () => {
  assert.equal(assessCargo({start: 1, end: 100000}).status, 'unknown');
  assert.equal(assessCargo(reference(3000)).status, 'unknown');
  assert.equal(assessCargo(reference(6000)).status, 'contradicted');
  assert.equal(assessCargo(reference(3000), {otherCassetteBp: 1700}).status, 'supported');
  assert.equal(assessCargo(reference(3000), {otherCassetteBp: 1701}).status, 'contradicted');
  assert.match(assessCargo(reference(3000), {otherCassetteBp: 1700}).reason, /user-defined cassette scenario/i);
});

test('invalid cargo capacities and missing CDS do not become feasibility evidence', () => {
  for (const value of [null, undefined, NaN, Infinity, -1, 0, true]) {
    assert.equal(assessCargo(reference(value)).status, 'unknown');
  }
  for (const capacityBp of [NaN, Infinity, 0, -1]) {
    assert.equal(assessCargo(reference(3000), {capacityBp, otherCassetteBp: 1000}).status, 'unknown');
  }
});

test('unknown direction and evidence do not become a contradiction', () => {
  const missing = assessModality('aso-upregulation');
  assert.equal(missing.status, 'insufficient_evidence');
  assert.equal(gateOf(missing, 'mechanism').status, 'unknown');
  assert.equal(gateOf(assessModality('aso-upregulation', {...context(), sourceUrls: []}), 'mechanism').status, 'unknown');
  const unknownMechanism = assessModality('aso-upregulation', {...context(), mechanism: 'unknown'});
  assert.equal(gateOf(unknownMechanism, 'mechanism').status, 'unknown');
});

test('an opposing disease mechanism raises a direction concern without proving universal incompatibility', () => {
  const gain = {...context(), mechanism: 'gain_of_function'};
  for (const modalityId of ['aso-upregulation', 'aav-addition', 'aso-knockdown']) {
    const diseaseContext = modalityId === 'aso-knockdown' ? context() : gain;
    const assessment = assessModality(modalityId, diseaseContext, reference(3000));
    assert.equal(assessment.status, 'insufficient_evidence', modalityId);
    assert.equal(gateOf(assessment, 'mechanism').status, 'unknown', modalityId);
    assert.equal(gateOf(assessment, 'mechanism').directionConcern, true, modalityId);
    assert.equal(assessment.contradicted, 0, modalityId);
  }
  assert.equal(gateOf(assessModality('aso-knockdown', gain), 'mechanism').status, 'supported');
  const dominantNegative = assessModality('aav-addition', {...context(), mechanism: 'dominant_negative'}, reference(3000));
  assert.equal(gateOf(dominantNegative, 'mechanism').status, 'unknown');
  assert.equal(gateOf(dominantNegative, 'mechanism').directionConcern, true);
  assert.equal(dominantNegative.contradicted, 0);
  assert.equal(dominantNegative.status, 'insufficient_evidence');
});

test('a supported disease mechanism alone does not establish modality suitability', () => {
  const assessment = assessModality('aso-upregulation', context());
  assert.equal(gateOf(assessment, 'mechanism').status, 'supported');
  assert.equal(assessment.status, 'insufficient_evidence');
  assert.ok(assessment.unknown > 0);
});

test('unsourced positive and negative gate assertions both stay unknown', () => {
  for (const status of ['supported', 'contradicted']) {
    const assessment = assessModality('aso-upregulation', {...context(), gates: {
      delivery: gateEvidence('aso-upregulation', {status, reason: 'Assertion', sources: []}),
    }}, null, gateSelection());
    assert.equal(gateOf(assessment, 'delivery').status, 'unknown');
  }
});

test('unjustified not-applicable assertions cannot bypass required gates', () => {
  const modality = modalities.find(modality => modality.id === 'aso-upregulation');
  const gates = Object.fromEntries(modality.gates.filter(gate => gate.id !== 'mechanism').map(gate => [gate.id,
    gateEvidence(modality.id, {status: 'not_applicable'})]));
  const assessment = assessModality('aso-upregulation', {...context(), gates}, null, gateSelection());
  assert.equal(assessment.status, 'insufficient_evidence');
  assert.equal(gateOf(assessment, 'delivery').status, 'unknown');
});

test('sourced required gates remain an inspectable conjunction', () => {
  const modality = modalities.find(modality => modality.id === 'aso-upregulation');
  const gates = Object.fromEntries(modality.gates.filter(gate => gate.id !== 'mechanism').map(gate => [gate.id,
    gateEvidence(modality.id, {reason: `Measured ${gate.id}`})]));
  const assessment = assessModality('aso-upregulation', {...context(), gates}, null, gateSelection());
  assert.equal(assessment.status, 'requirements_supported');
  gates.delivery = gateEvidence(modality.id, {status: 'contradicted', reason: 'Relevant delivery failed'});
  assert.equal(assessModality('aso-upregulation', {...context(), gates}, null, gateSelection()).status, 'incompatible');
});

test('scoped evidence cannot redefine a necessary gate or a maturity dimension', () => {
  const modality = modalities.find(item => item.id === 'aso-upregulation');
  const definition = modality.gates.find(gate => gate.id === 'functionalSufficiency');
  const gates = Object.fromEntries(modality.gates.map(gate => [gate.id, gateEvidence(modality.id)]));
  gates.functionalSufficiency = gateEvidence(modality.id, {
    status: 'contradicted', reason: 'Measured restoration falls below the selected endpoint threshold',
    id: 'endpoint', label: 'Optional observation', hard: false,
  });
  const assessment = assessModality(modality.id, {...context(), gates}, null, gateSelection());
  const measured = gateOf(assessment, definition.id);
  assert.equal(measured.id, definition.id);
  assert.equal(measured.label, definition.label);
  assert.equal(measured.hard, true);
  assert.equal(measured.status, 'contradicted');
  assert.equal(assessment.status, 'incompatible');
  assert.equal(assessment.contradicted, 1);

  const modifierDefinition = priorityModifiers.find(modifier => modifier.id === 'preclinical');
  const modifiers = assessPriorityModifiers({modifiers: {preclinical: modifierFact({
    id: 'precedent', label: 'Preferred treatment', hard: true, score: 100,
  })}}, modifierSelection());
  const modifier = modifierOf(modifiers, modifierDefinition.id);
  assert.equal(modifier.id, modifierDefinition.id);
  assert.equal(modifier.label, modifierDefinition.label);
  assert.equal(modifier.strength, 'strong');
  assert.equal('hard' in modifier, false);
  assert.equal('score' in modifier, false);
  assert.deepEqual(modifiers.map(item => item.id), priorityModifiers.map(item => item.id));
});

test('functional sufficiency is a required sourced endpoint condition in every modality', () => {
  for (const modality of modalities) {
    const definition = modality.gates.find(gate => gate.id === 'functionalSufficiency');
    assert.equal(definition?.hard, true, modality.id);
    const evidence = Object.fromEntries(modality.gates.map(gate => [gate.id, {
      ...gateEvidence(modality.id), reason: `Measured ${gate.id} for the selected endpoint`,
    }]));
    const assess = gates => assessModality(modality.id, {...context(), gates}, reference(3000), gateSelection({otherCassetteBp: 1700}));
    assert.equal(assess(evidence).status, 'requirements_supported', modality.id);
    const otherGates = {...evidence};
    delete otherGates.functionalSufficiency;
    for (const fact of [undefined,
      gateEvidence(modality.id, {reason: 'Molecular restoration without endpoint evidence', sources: []}),
      gateEvidence(modality.id, {status: 'contradicted', reason: 'Uncited assertion about the threshold', sources: []}),
      gateEvidence(modality.id, {status: 'not_applicable', reason: 'No threshold assessed'})]) {
      const assessment = assess(fact ? {...otherGates, functionalSufficiency: fact} : otherGates);
      assert.equal(gateOf(assessment, 'functionalSufficiency').status, 'unknown', modality.id);
      assert.equal(assessment.status, 'insufficient_evidence', modality.id);
      assert.equal(assessment.unknown, 1, modality.id);
      assert.equal(assessment.contradicted, 0, modality.id);
    }
    const failed = assess({...evidence, functionalSufficiency: {
      ...gateEvidence(modality.id), status: 'contradicted', reason: 'Measured functional restoration stays below the selected endpoint threshold',
    }});
    assert.equal(failed.status, 'incompatible', modality.id);
    assert.equal(failed.contradicted, 1, modality.id);
  }
});

const modifierSelection = () => ({gene: 'GENE1', diseaseId: 'OMIM:1', hpoId: 'HP:1', modalityId: 'aso-upregulation'});
const modifierFact = (overrides = {}) => ({
  strength: 'strong', reason: 'Relevant intervention measured the selected endpoint in this disease context',
  sources: [source], scope: modifierSelection(), ...overrides,
});
const modifierOf = (assessment, id) => assessment.find(modifier => modifier.id === id);

test('four separate maturity dimensions remain unknown when scoped evidence is absent', () => {
  assert.deepEqual(priorityModifiers.map(modifier => modifier.id), ['preclinical', 'measurability', 'precedent', 'comparativeValue']);
  for (const value of [undefined, null, {}, {...context(), trialPhase: 'PHASE3', modifiers: {}}]) {
    const assessment = assessPriorityModifiers(value, modifierSelection());
    assert.equal(assessment.length, 4);
    for (const modifier of assessment) {
      assert.equal(modifier.strength, 'unknown');
      assert.deepEqual(modifier.sources, []);
      assert.equal(modifier.scope, null);
      assert.equal('score' in modifier, false);
    }
  }
});

test('exact scoped modifier evidence preserves its stated maturity, explanation and citations', () => {
  for (const id of priorityModifiers.map(modifier => modifier.id)) {
    for (const strength of ['strong', 'moderate', 'weak', 'unknown']) {
      const fact = modifierFact({strength});
      const result = modifierOf(assessPriorityModifiers({modifiers: {[id]: fact}}, modifierSelection()), id);
      assert.equal(result.strength, strength, id);
      assert.equal(result.reason, fact.reason, id);
      assert.deepEqual(result.sources, fact.sources, id);
      assert.deepEqual(result.scope, fact.scope, id);
    }
  }
});

test('malformed or uncited modifier facts cannot become maturity evidence', () => {
  const invalid = [
    {strength: 'established'}, {reason: undefined}, {reason: ''}, {reason: '   '}, {reason: 42}, {reason: null},
    {sources: undefined}, {sources: []}, {sources: source}, {sources: [null]},
    {sources: ['ftp://example.org/study']}, {sources: [source, false]},
  ];
  for (const id of priorityModifiers.map(modifier => modifier.id)) {
    for (const overrides of invalid) {
      const result = modifierOf(assessPriorityModifiers({sourceUrls: [source], modifiers: {
        [id]: modifierFact(overrides),
      }}, modifierSelection()), id);
      assert.equal(result.strength, 'unknown', `${id}: ${JSON.stringify(overrides)}`);
      assert.deepEqual(result.sources, []);
      assert.equal(result.scope, null);
      assert.match(result.reason, /assessment, explanation and evidence sources are required/i);
    }
  }
});

test('modifier evidence cannot transfer across a gene, disease, phenotype or modality', () => {
  for (const id of priorityModifiers.map(modifier => modifier.id)) {
    for (const key of ['gene', 'diseaseId', 'hpoId', 'modalityId']) {
      for (const value of [undefined, 'a-different-selection']) {
        const scope = {...modifierSelection(), [key]: value};
        const result = modifierOf(assessPriorityModifiers({modifiers: {
          [id]: modifierFact({scope}),
        }}, modifierSelection()), id);
        assert.equal(result.strength, 'unknown', `${id}: ${key}`);
        assert.deepEqual(result.sources, []);
        assert.equal(result.scope, null);
        assert.match(result.reason, /exact gene, disease, phenotype, modality/i);
      }
    }
  }
});

test('declared construct and population scopes must match and cannot be silently omitted', () => {
  const selected = {...modifierSelection(), constructId: 'construct-A', populationId: 'adult-cohort'};
  for (const id of priorityModifiers.map(modifier => modifier.id)) {
    // A fact that declares neither optional dimension remains within its stated scope.
    assert.equal(modifierOf(assessPriorityModifiers({modifiers: {[id]: modifierFact()}}, selected), id).strength, 'strong');
    const scoped = modifierFact({scope: {...selected}});
    assert.equal(modifierOf(assessPriorityModifiers({modifiers: {[id]: scoped}}, selected), id).strength, 'strong');
    for (const key of ['constructId', 'populationId']) {
      for (const value of [undefined, 'different']) {
        const result = modifierOf(assessPriorityModifiers({modifiers: {[id]: scoped}}, {...selected, [key]: value}), id);
        assert.equal(result.strength, 'unknown', `${id}: ${key}`);
        assert.deepEqual(result.sources, []);
        assert.equal(result.scope, null);
      }
    }
  }
});

test('maturity labels are separate from compatibility gates in every modality', () => {
  for (const modality of modalities) {
    const plain = assessModality(modality.id, context(), reference(3000));
    for (const strength of ['strong', 'weak', 'unknown']) {
      const modifiers = Object.fromEntries(priorityModifiers.map(({id}) => [id, modifierFact({
        strength, scope: {...modifierSelection(), modalityId: modality.id},
      })]));
      const withMaturity = assessModality(modality.id, {...context(), modifiers}, reference(3000));
      assert.deepEqual(withMaturity, plain, `${modality.id}: ${strength}`);
      assert.ok(withMaturity.gates.every(gate => !priorityModifiers.some(modifier => modifier.id === gate.id)), modality.id);
    }
  }
});

const platformMechanismFamilies = [
  'aso-splice-correction', 'aso-exon-skipping', 'base-editing', 'prime-editing',
  'nuclease-editing', 'small-molecule', 'cell-replacement', 'rna-editing',
  'substrate-reduction', 'antibody-biologic', 'hormone-metabolite',
];
for (const modalityId of platformMechanismFamilies) {
  test(`${modalityId}: explicit platform mechanism evidence survives generic direction and requires its own source`, () => {
    const modality = modalities.find(item => item.id === modalityId);
    assert.equal(modality.mechanisms, null);
    const evidence = Object.fromEntries(modality.gates.map(gate => [gate.id, {
      ...gateEvidence(modalityId), reason: `Measured ${gate.id} for this intervention`,
    }]));
    const mechanismEvidence = {
      status: 'supported', reason: 'Functional rescue measured for the exact platform, allele and compartment',
      sources: ['https://example.org/selected-platform-functional-study'], scope: gateScope(modalityId),
    };
    const positive = assessModality(modalityId, {...context(), gates: {...evidence, mechanism: mechanismEvidence}}, null, gateSelection());
    assert.equal(positive.status, 'requirements_supported');
    assert.equal(positive.unknown, 0);
    assert.equal(positive.contradicted, 0);
    assert.equal(gateOf(positive, 'mechanism').status, 'supported');
    assert.equal(gateOf(positive, 'mechanism').reason, mechanismEvidence.reason);
    assert.deepEqual(gateOf(positive, 'mechanism').sources, mechanismEvidence.sources);

    const negativeEvidence = {...mechanismEvidence, status: 'contradicted', reason: 'This platform failed to restore the selected function'};
    const negative = assessModality(modalityId, {...context(), gates: {...evidence, mechanism: negativeEvidence}}, null, gateSelection());
    assert.equal(negative.status, 'incompatible');
    assert.equal(negative.contradicted, 1);
    assert.equal(gateOf(negative, 'mechanism').status, 'contradicted');
    assert.equal(gateOf(negative, 'mechanism').reason, negativeEvidence.reason);
    assert.deepEqual(gateOf(negative, 'mechanism').sources, negativeEvidence.sources);

    for (const status of ['supported', 'contradicted']) {
      const unsourced = assessModality(modalityId, {...context(), gates: {
        ...evidence, mechanism: gateEvidence(modalityId, {status, reason: 'Explicit assertion without platform-specific evidence', sources: []}),
      }}, null, gateSelection());
      // Outer disease-context citations cannot substitute for this gate's evidence.
      assert.equal(gateOf(unsourced, 'mechanism').status, 'unknown', status);
      assert.equal(unsourced.status, 'insufficient_evidence', status);
      assert.equal(unsourced.contradicted, 0, status);
    }

    const otherGates = {...evidence};
    delete otherGates.mechanism;
    for (const mechanism of ['loss_of_function', 'haploinsufficiency', 'gain_of_function',
      'dominant_negative', 'toxic_gain_of_function', 'toxic_rna', 'dosage_gain']) {
      const generic = assessModality(modalityId, {...context(), mechanism, gates: otherGates}, null, gateSelection());
      assert.equal(gateOf(generic, 'mechanism').status, 'unknown', mechanism);
      assert.equal(generic.status, 'insufficient_evidence', mechanism);
      assert.equal(generic.unknown, 1, mechanism);
      assert.equal(generic.contradicted, 0, mechanism);
    }
  });
}

test('explicit mechanism gates also override automatic direction rules and require their own citations', () => {
  for (const [mechanism, status] of [['haploinsufficiency', 'contradicted'], ['gain_of_function', 'supported']]) {
    const measured = gateEvidence('aso-upregulation', {status, reason: 'Allele-specific intervention evidence'});
    const assessment = assessModality('aso-upregulation', {...context(), mechanism, gates: {mechanism: measured}}, null, gateSelection());
    assert.equal(gateOf(assessment, 'mechanism').status, status);
    assert.equal(gateOf(assessment, 'mechanism').reason, measured.reason);
    assert.deepEqual(gateOf(assessment, 'mechanism').sources, measured.sources);
    const unsourced = assessModality('aso-upregulation', {...context(), mechanism, gates: {mechanism: {...measured, sources: []}}}, null, gateSelection());
    assert.equal(gateOf(unsourced, 'mechanism').status, 'unknown');
    assert.equal(unsourced.status, 'insufficient_evidence');
  }
});

test('every explicit non-cargo gate requires its own complete selection scope', () => {
  for (const modality of modalities) {
    for (const definition of modality.gates.filter(gate => gate.id !== 'cargo')) {
      for (const status of ['supported', 'contradicted']) {
        const measured = gateEvidence(modality.id, {status});
        const assess = (fact, selection = gateSelection()) => assessModality(modality.id,
          {...context(), gates: {[definition.id]: fact}}, null, selection);
        assert.equal(gateOf(assess(measured), definition.id).status, status, `${modality.id}: ${definition.id}`);
        for (const scope of [undefined, {}, ...['gene', 'diseaseId', 'hpoId', 'modalityId'].map(key => ({...measured.scope, [key]: undefined}))]) {
          const unscoped = assess({...measured, scope});
          assert.equal(gateOf(unscoped, definition.id).status, 'unknown', `${modality.id}: ${definition.id}`);
          assert.equal(unscoped.contradicted, 0);
        }
        assert.equal(gateOf(assess(measured, {}), definition.id).status, 'unknown');
      }
    }
  }
});

test('explicit gate support and contradiction cannot cross gene, disease, phenotype or modality', () => {
  for (const modality of modalities) {
    for (const definition of modality.gates.filter(gate => gate.id !== 'cargo')) {
      for (const status of ['supported', 'contradicted']) {
        for (const key of ['gene', 'diseaseId', 'hpoId', 'modalityId']) {
          const fact = gateEvidence(modality.id, {status, scope: gateScope(modality.id, {[key]: 'different'})});
          const assessment = assessModality(modality.id, {...context(), gates: {[definition.id]: fact}}, null, gateSelection());
          assert.equal(gateOf(assessment, definition.id).status, 'unknown', `${modality.id}: ${definition.id}: ${key}`);
          assert.equal(assessment.contradicted, 0);
        }
      }
    }
  }
});

test('matching selected disease alone cannot import a gate from another curated disease context', () => {
  for (const status of ['supported', 'contradicted']) {
    const fact = gateEvidence('aso-upregulation', {status, scope: gateScope('aso-upregulation', {diseaseId: 'OMIM:2'})});
    const assessment = assessModality('aso-upregulation', {...context(), gates: {mechanism: fact}}, null,
      gateSelection({diseaseId: 'OMIM:2'}));
    assert.equal(gateOf(assessment, 'mechanism').status, 'unknown');
    assert.equal(assessment.contradicted, 0);
  }
});

test('declared variant, construct and population must match before a gate judgment can override direction', () => {
  const exact = gateSelection({variantId: 'variation-123', constructId: 'cassette-A', populationId: 'adult-cohort'});
  for (const modalityId of ['aso-upregulation', 'aav-addition', 'base-editing', 'small-molecule']) {
    for (const status of ['supported', 'contradicted']) {
      const fact = gateEvidence(modalityId, {status, scope: gateScope(modalityId, exact)});
      const diseaseContext = {...context(), mechanism: 'dominant_negative', gates: {mechanism: fact}};
      const matched = assessModality(modalityId, diseaseContext, null, exact);
      assert.equal(gateOf(matched, 'mechanism').status, status, modalityId);
      assert.equal(gateOf(matched, 'mechanism').directionConcern, undefined);
      assert.equal(matched.contradicted, status === 'contradicted' ? 1 : 0);
      for (const key of ['variantId', 'constructId', 'populationId']) {
        for (const value of [undefined, 'another']) {
          const mismatched = assessModality(modalityId, diseaseContext, null, {...exact, [key]: value});
          assert.equal(gateOf(mismatched, 'mechanism').status, 'unknown', `${modalityId}: ${key}`);
          assert.equal(mismatched.contradicted, 0);
          assert.equal(mismatched.status, 'insufficient_evidence');
        }
      }
      const generalScoped = {...fact, scope: gateScope(modalityId)};
      assert.equal(gateOf(assessModality(modalityId, {...diseaseContext, gates: {mechanism: generalScoped}}, null, exact), 'mechanism').status, status);
    }
  }
});

test('gate explanations and citations must be valid even when all scope identifiers match', () => {
  for (const modality of modalities) {
    for (const definition of modality.gates.filter(gate => gate.id !== 'cargo')) {
      for (const status of ['supported', 'contradicted']) {
        for (const invalid of [{reason: undefined}, {reason: ''}, {reason: '   '}, {reason: 42},
          {sources: undefined}, {sources: []}, {sources: source}, {sources: [null]},
          {sources: ['javascript:alert(1)']}, {sources: [source, false]}]) {
          const fact = gateEvidence(modality.id, {status, ...invalid});
          const assessment = assessModality(modality.id, {...context(), gates: {[definition.id]: fact}}, null, gateSelection());
          assert.equal(gateOf(assessment, definition.id).status, 'unknown', `${modality.id}: ${definition.id}`);
          assert.equal(assessment.contradicted, 0);
        }
      }
    }
  }
});

const inputs = () => ({
  genePhenotypes: {genes: {GENE1: [
    {hpo_id: 'HP:1', hpo_name: 'Severe finding', disease_id: 'OMIM:1'},
    {hpo_id: 'HP:2', hpo_name: 'Other disease finding', disease_id: 'OMIM:2'},
  ]}},
  severity: [{hpo_id: 'HP:1', severity_class: 'severe', severity_score: 40},
             {hpo_id: 'HP:2', severity_class: 'profound', severity_score: 50}],
  contexts: [context()],
});

test('same gene in a different disease cannot inherit a disease mechanism', () => {
  const result = buildCandidates(inputs());
  const known = result.find(row => row.diseaseId === 'OMIM:1');
  const other = result.find(row => row.diseaseId === 'OMIM:2');
  assert.equal(gateOf(known.evaluation, 'mechanism').status, 'supported');
  assert.equal(other.context, null);
  assert.equal(gateOf(other.evaluation, 'mechanism').status, 'unknown');
  assert.match(other.associationKind, /variant-level phenotype attribution unestablished/i);
});

test('candidate construction passes the exact disease and phenotype into explicit gate evaluation', () => {
  const value = inputs();
  value.genePhenotypes.genes.GENE1.push({hpo_id: 'HP:3', hpo_name: 'Another endpoint', disease_id: 'OMIM:1'});
  const modality = modalities.find(item => item.id === 'aso-upregulation');
  value.contexts[0].diseaseIds.push('OMIM:2');
  value.contexts[0].gates = Object.fromEntries(modality.gates.map(gate => [gate.id, gateEvidence(modality.id)]));
  const rows = buildCandidates(value);
  const exact = rows.find(row => row.diseaseId === 'OMIM:1' && row.hpoId === 'HP:1');
  assert.equal(exact.evaluation.status, 'requirements_supported');
  for (const other of rows.filter(row => row.id !== exact.id)) {
    assert.equal(other.evaluation.status, 'insufficient_evidence', other.id);
    assert.ok(other.evaluation.gates.every(gate => gate.status === 'unknown'), other.id);
    assert.equal(other.evaluation.contradicted, 0, other.id);
  }
});

test('missing phenotype predictions and severity stay explicitly unknown', () => {
  const value = inputs();
  value.severity = [];
  const result = buildCandidates(value)[0];
  assert.equal(result.severity, 'unknown');
  assert.equal(result.severityScore, null);
  assert.equal(result.predictedCell, null);
});

test('duplicate associations do not multiply candidates', () => {
  const value = inputs();
  value.genePhenotypes.genes.GENE1.push({...value.genePhenotypes.genes.GENE1[0]});
  assert.equal(buildCandidates(value).length, 2);
});

test('rank among existing candidates is invariant to unrelated genes and phenotypes', () => {
  const value = inputs();
  const original = buildCandidates(value).map(row => row.id);
  value.genePhenotypes.genes.UNRELATED = [{hpo_id: 'HP:3', hpo_name: 'Unrelated', disease_id: 'OMIM:3'}];
  value.severity.push({hpo_id: 'HP:3', severity_class: 'profound', severity_score: 100000});
  const combined = buildCandidates(value);
  assert.deepEqual(combined.filter(row => original.includes(row.id)).map(row => row.id), original);
  const unchanged = combined.map(row => row.id);
  rankCandidates(combined);
  assert.deepEqual(combined.map(row => row.id), unchanged);
});

test('strong and weak maturity facts never change candidate compatibility or rank', () => {
  const value = inputs();
  const modality = modalities.find(item => item.id === 'aso-upregulation');
  const scopedGates = (diseaseId, hpoId) => Object.fromEntries(modality.gates.map(gate => [gate.id,
    gateEvidence(modality.id, {reason: `Measured ${gate.id}`, scope: gateScope(modality.id, {diseaseId, hpoId})})]));
  value.contexts = [{...context(), gates: scopedGates('OMIM:1', 'HP:1')},
    {...context(), disease: 'Disease B', diseaseIds: ['OMIM:2'], gates: scopedGates('OMIM:2', 'HP:2')}];
  const original = buildCandidates(value);
  assert.equal(original[0].diseaseId, 'OMIM:2');
  for (const strengths of [['strong', 'weak'], ['weak', 'strong']]) {
    value.contexts = value.contexts.map((diseaseContext, index) => ({...diseaseContext,
      modifiers: Object.fromEntries(priorityModifiers.map(({id}) => [id, modifierFact({
        strength: strengths[index], scope: {...modifierSelection(), diseaseId: diseaseContext.diseaseIds[0], hpoId: `HP:${index + 1}`},
      })])),
    }));
    const candidates = buildCandidates(value);
    assert.deepEqual(candidates.map(row => row.id), original.map(row => row.id));
    assert.deepEqual(candidates.map(row => row.evaluation), original.map(row => row.evaluation));
    for (const row of candidates) {
      const maturity = assessPriorityModifiers(row.context, {...modifierSelection(), diseaseId: row.diseaseId, hpoId: row.hpoId});
      assert.ok(maturity.every(modifier => modifier.strength === strengths[row.diseaseId === 'OMIM:1' ? 0 : 1]));
    }
    assert.deepEqual(rankCandidates([...candidates].reverse()).map(row => row.id), original.map(row => row.id));
  }
});

test('conflicting mechanism records for one disease cannot depend on input order', () => {
  const value = inputs();
  const scopedGates = {mechanism: gateEvidence('aso-upregulation', {reason: 'Evidence for one selected variant'})};
  value.contexts[0].gates = scopedGates;
  value.contexts[0].modifiers = {preclinical: modifierFact()};
  value.contexts.push({...context(), mechanism: 'gain_of_function', gates: scopedGates,
    modifiers: {preclinical: modifierFact({strength: 'weak'})}});
  const first = buildCandidates(value).find(row => row.diseaseId === 'OMIM:1');
  value.contexts.reverse();
  const reversed = buildCandidates(value).find(row => row.diseaseId === 'OMIM:1');
  assert.equal(gateOf(first.evaluation, 'mechanism').status, 'unknown');
  assert.equal(gateOf(reversed.evaluation, 'mechanism').status, 'unknown');
  assert.deepEqual(first.context.gates, {});
  assert.deepEqual(reversed.context.gates, {});
  assert.deepEqual(first.context.modifiers, {});
  assert.deepEqual(reversed.context.modifiers, {});
  assert.ok(assessPriorityModifiers(first.context, modifierSelection()).every(modifier => modifier.strength === 'unknown'));
  assert.deepEqual(assessPriorityModifiers(reversed.context, modifierSelection()), assessPriorityModifiers(first.context, modifierSelection()));
});
