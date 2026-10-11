/** Research compatibility is a conjunction of scoped gates, never a probability. */
const gate = (id, label, reason, hard = true) => ({ id, label, reason, hard });
const common = [
  gate('delivery', 'Access to the functional compartment', 'Evidence must establish the relevant tissue, extracellular compartment or cell state, matching species, route, age and dose.'),
  gate('functionalSufficiency', 'Functional sufficiency for this endpoint', 'Correction or compensation must alter the selected phenotype at the required biochemical threshold, cell fraction or circuit function. Molecular restoration does not establish benefit across the whole syndrome.'),
  gate('window', 'Reversibility and treatment window', 'Correction or bypass must be able to change the selected endpoint at the assessed disease stage; established cell loss or developmental anatomy may limit benefit.'),
  gate('safety', 'Therapeutic dose window', 'Relevant toxicity, off-target effects and overcorrection require assessment.'),
  gate('endpoint', 'Measurable phenotype endpoint', 'An endpoint and natural history are needed to test benefit.', false),
];
const definitions = [
  ['aso-upregulation', 'Endogenous RNA upregulation', 'Increase useful transcript from an endogenous allele. Experimental designs include transcript stabilization and poison-exon modulation; mechanisms are not interchangeable.', ['loss_of_function','haploinsufficiency'], [
    gate('functionalAllele','Functional allele or rescuable transcript','Gene deletion on both alleles or a stable toxic protein cannot be assumed rescuable by raising RNA.'),
    gate('rnaMechanism','Demonstrated RNA control mechanism','The exact stabilization, decay or splicing control site must increase functional RNA in the target cells.'),
    gate('mutantSafety','Mutant transcript is safe to co-modulate','NMD depends on transcript and variant position; do not infer it from a stop-gain alone.'),
  ]],
  ['aso-splice-correction','Splice-correcting ASO','Restore a defined splice defect or productive isoform.',null,[
    gate('spliceDefect','Demonstrated splice defect','RNA evidence must identify aberrant transcript, tissue and variant.'),
    gate('spliceRescue','Functional splice rescue','Corrected transcript must encode a useful protein and demonstrate rescue.'),
  ]],
  ['aso-exon-skipping','Exon-skipping ASO','Skip an explicitly selected exon or exon set.',null,[
    gate('frameRescue','Reading-frame restoration','The patient deletion and transcript determine whether a particular skip restores frame.'),
    gate('truncatedFunction','Truncated protein remains functional','In-frame does not alone imply preserved protein function.'),
  ]],
  ['aso-knockdown','Non-selective RNA lowering','Reduce a toxic or excessive gene product. Healthy-allele loss is a separate risk.', ['gain_of_function','toxic_gain_of_function','toxic_rna','dosage_gain'],[
    gate('loweringTolerance','Healthy product tolerates lowering','Evidence must establish tolerable total gene-product reduction.'),
  ]],
  ['allele-selective','Allele-selective RNA lowering','Preferentially reduce a pathogenic allele while retaining useful expression.',['gain_of_function','dominant_negative','toxic_gain_of_function','toxic_rna','dosage_gain'],[
    gate('alleleSelectivity','Discriminating sequence and phase','A targetable variant or phased haplotype must distinguish the disease allele.'),
    gate('selectiveRescue','Selective rescue measured','Allele discrimination and benefit need experimental confirmation.'),
  ]],
  ['aav-addition','Single-AAV gene addition','Supply a functional coding sequence using a defined expression cassette.',['loss_of_function','haploinsufficiency'],[
    gate('cargo','Complete expression cassette fits','Count selected CDS, promoter, regulatory elements, polyA and ITRs under an explicitly defined capacity.'),
    gate('expressionControl','Expression control and persistence','Promoter specificity, dosage, immune status and dividing-cell dilution matter.'),
  ]],
  ['lentiviral-hsc','Ex vivo HSC gene addition','Modify engrafting haematopoietic cells, including enzyme-delivery strategies.',['loss_of_function','haploinsufficiency'],[
    gate('hscMechanism','HSC lineage or cross-correction mechanism','Engrafted cells must supply the needed function to affected tissues.'),
    gate('conditioning','Conditioning and engraftment feasible','Conditioning, clonal risk and patient eligibility are separate requirements.'),
    gate('cargo','Vector-specific cargo and expression','Lentiviral capacity and construct performance require platform-specific evidence.'),
  ]],
  ['mrna-replacement','mRNA replacement','Deliver useful coding RNA without a permanent DNA change.',['loss_of_function','haploinsufficiency'],[
    gate('rnaCargo','Functional RNA formulation','Sequence, stability, translation and dose must be demonstrated.'),
    gate('redosing','Repeat delivery feasible','Expression duration and repeat-dose immune/toxicity burdens matter.'),
  ]],
  ['base-editing','Base editing','Correct a compatible base or deliberately alter a regulatory site.',null,[
    gate('editableBase','Compatible edit chemistry','Exact reference/alternate allele, strand and chemistry must permit the change.'),
    gate('editingWindow','Guide, PAM and bystander profile','Genomic context and editor window must avoid harmful bystanders.'),
    gate('editingRescue','Editing restores the needed function','Mosaic fraction, allele phase and repair consequences need measurement.'),
  ]],
  ['prime-editing','Prime editing','Install a precisely specified sequence change.',null,[
    gate('editDesign','Validated guide and edit design','Edit size and local sequence matter; theoretical editability is not rescue.'),
    gate('editingRescue','Editing restores the needed function','Target-cell efficiency, unwanted edits and functional rescue require evidence.'),
  ]],
  ['nuclease-editing','Nuclease or regulatory editing','Disrupt, excise or repair a defined locus.',null,[
    gate('editDesign','Defined repair or regulatory design','Cutting a gene is not equivalent to restoring it.'),
    gate('editingRescue','Repair outcome and functional rescue','Repair pathway, cell cycle, mosaicism and chromosomal risks must be assessed.'),
  ]],
  ['protein-replacement','Protein or enzyme replacement','Supply a missing extracellular or uptake-compatible protein.',['loss_of_function','haploinsufficiency'],[
    gate('proteinUptake','Protein reaches its functional compartment','Cross-correction requires appropriate uptake, processing and distribution.'),
    gate('redosing','Repeat dosing feasible','Half-life, immune responses and administration burden matter.'),
  ]],
  ['small-molecule','Small molecule or pharmacological chaperone','Modulate a defined target with variant-specific response evidence where relevant.',null,[
    gate('drugMechanism','Target and direction established','Residual protein, pathway compensation or inhibition must match the disease mechanism.'),
    gate('drugResponse','Variant or context response measured','A druggable gene is not evidence every disease variant will respond.'),
  ]],
  ['cell-replacement','Cell replacement','Replace a missing or dysfunctional cell population.',null,[
    gate('cellIntegration','Engraftment and functional integration','Replacement cells must survive, connect and supply the relevant function.'),
    gate('cellSafety','Cell identity, purity and growth control','Tumour risk, immune compatibility and ectopic differentiation need assessment.'),
  ]],
  ['dual-aav','Dual-AAV gene addition','Reconstitute a selected coding sequence delivered across two vectors.',['loss_of_function','haploinsufficiency'],[
    gate('dualCargo','Both defined vector genomes fit','Each complete cassette needs its own capacity assessment; total gene size alone does not settle this.'),
    gate('coTransduction','Both vectors reach the same relevant cells','Distribution, stoichiometry and effective co-transduction require direct evidence.'),
    gate('reconstitution','Correct functional reconstitution','Splicing, overlapping sequences or protein ligation must produce a useful product without harmful byproducts.'),
    gate('expressionControl','Expression control and persistence','Dosage and durability require construct- and tissue-specific evidence.'),
  ]],
  ['nonviral-dna','Nonviral DNA gene addition','Deliver a defined functional DNA construct using a nonviral platform.',['loss_of_function','haploinsufficiency'],[
    gate('dnaCargo','Platform-specific construct and uptake','There is no generic unlimited cargo budget; formulation, nuclear delivery and expression need demonstration.'),
    gate('expressionControl','Controlled useful expression','Promoter, persistence, redosing and unintended integration risks need assessment.'),
  ]],
  ['rna-editing','RNA editing','Correct a specified transcript base without altering the genomic allele.',null,[
    gate('rnaEditChemistry','Compatible transcript edit','Exact RNA sequence, chemistry, isoform and accessible site must permit the desired edit.'),
    gate('rnaEditRescue','Useful transcript and protein rescue','Editing fraction, bystanders and rescue need evidence in relevant cells.'),
    gate('redosing','Repeat delivery and duration feasible','Transcript turnover and sustained delivery determine the treatment burden.'),
  ]],
  ['epigenetic-reactivation','Epigenetic or transcriptional reactivation','Restore useful expression from a silenced or underexpressed endogenous allele.',['loss_of_function','haploinsufficiency'],[
    gate('functionalAllele','Useful endogenous allele remains','Deletion or a damaging coding variant cannot be rescued by activation alone.'),
    gate('activationSite','Validated regulatory or silencing target','Imprinting, allele specificity and tissue-specific expression must be established.'),
    gate('activationSafety','Safe dosage and regulatory effects','Off-target activation, overshoot and persistence require measurement.'),
  ]],
  ['stop-readthrough','Premature-stop readthrough','Promote translation beyond a particular premature termination codon.',['loss_of_function','haploinsufficiency'],[
    gate('readthroughAllele','Accessible premature-stop transcript','Exact stop, surrounding sequence, transcript availability and decay must be established.'),
    gate('readthroughFunction','Readthrough product retains function','Inserted amino acids, full-length protein yield and function require variant-specific assays.'),
    gate('terminationSafety','Normal termination and off-target safety','Natural stop suppression and systemic exposure require assessment.'),
  ]],
  ['substrate-reduction','Substrate or pathway reduction','Reduce a harmful accumulated substrate or compensate a downstream pathway.',null,[
    gate('pathwayTarget','Disease-relevant pathway and direction','A biochemical association alone does not establish a safe compensatory target.'),
    gate('pathwayRescue','Relevant tissue burden and functional benefit','Demonstrate useful reduction in the affected compartment and assess tradeoffs.'),
  ]],
  ['antibody-biologic','Antibody or receptor-directed biologic','Modulate a defined extracellular target or signaling pathway.',null,[
    gate('biologicTarget','Target, direction and disease link established','A causal gene, modifier, compensatory pathway and therapeutic antigen are distinct roles.'),
    gate('biologicEngagement','Relevant compartment engagement','Binding, target occupancy and downstream functional response require tissue-specific evidence.'),
  ]],
  ['hormone-metabolite','Hormone or metabolite replacement/analogue','Restore or compensate a specific biochemical signal, transport defect or product.',null,[
    gate('biochemicalRescue','Correct biochemical direction established','Blood biomarker normalization does not alone demonstrate correction in brain or another affected tissue.'),
    gate('compartmentAccess','Functional access despite the disease defect','Transport, conversion and action must be shown in the relevant compartment.'),
  ]],
];

export const modalities = definitions.map(([id,label,description,mechanisms,requirements]) => ({id,label,description,mechanisms,
  gates:[gate('mechanism','Disease and allele mechanism','Use condition-scoped functional/dosage evidence; variant consequence and gene constraint do not establish mechanism.'),...requirements,...common]}));

const supportedGate = (status,reason,sources=[]) => ({status,reason,sources});
const validSources = sources => Array.isArray(sources) && sources.length > 0 &&
  sources.every(url => typeof url==='string' && /^https?:\/\//i.test(url));

function scopedGateFact(fact, context, modalityId, options) {
  const scope=fact?.scope || {};
  const selection={gene:context.gene,diseaseId:options.diseaseId,hpoId:options.hpoId,modalityId,
    variantId:options.variantId,constructId:options.constructId,populationId:options.populationId};
  if (!['gene','diseaseId','hpoId','modalityId'].every(key => typeof scope[key]==='string' && scope[key] && scope[key]===selection[key]) ||
      !Array.isArray(context.diseaseIds) || !context.diseaseIds.includes(selection.diseaseId) ||
      ['variantId','constructId','populationId'].some(key => scope[key] != null && scope[key]!==selection[key])) {
    return supportedGate('unknown','No gate assessment matches this exact gene, disease, phenotype, modality and any declared variant, construct or population.');
  }
  if (!['supported','contradicted','unknown','not_applicable'].includes(fact.status) ||
      typeof fact.reason!=='string' || !fact.reason.trim() || !validSources(fact.sources)) {
    return supportedGate('unknown','A scoped assessment, explanation and evidence sources are required for this gate.');
  }
  // Evidence annotates a requirement; it cannot redefine its identity or necessity.
  return {status:fact.status,reason:fact.reason,sources:fact.sources,scope};
}

export const priorityModifiers = [
  {id:'preclinical', label:'Preclinical evidence', reason:'Assess the relevant model, intervention, readout and reproducibility; model availability alone is not functional rescue.'},
  {id:'measurability', label:'Endpoint measurability', reason:'Assess the selected phenotype, population, natural history and endpoint sensitivity.'},
  {id:'precedent', label:'Therapeutic precedent', reason:'Assess a comparable intervention and context; a trial phase or another same-gene therapy is not transferable success.'},
  {id:'comparativeValue', label:'Comparative value', reason:'Assess benefit over existing treatment, burden and remaining manifestations in the specified population.'},
];

// Modifiers describe evidence maturity, not necessary conditions or a score.
// Explicit scopes prevent another phenotype, construct or population from
// inheriting a judgment merely because it shares a gene or modality.
export function assessPriorityModifiers(context={}, selection={}) {
  return priorityModifiers.map(definition => {
    const fact=context?.modifiers?.[definition.id];
    const unknown=reason => ({...definition,strength:'unknown',reason,sources:[],scope:null});
    if (!fact) return unknown(definition.reason);
    const scope=fact.scope || {};
    if (!['gene','diseaseId','hpoId','modalityId'].every(key => scope[key] && scope[key]===selection[key]) ||
        ['constructId','populationId'].some(key => scope[key] && scope[key]!==selection[key])) {
      return unknown('No modifier assessment matches this exact gene, disease, phenotype, modality and any declared construct/population.');
    }
    if (!['strong','moderate','weak','unknown'].includes(fact.strength) || typeof fact.reason!=='string' || !fact.reason.trim() ||
        !Array.isArray(fact.sources) || !fact.sources.length || !fact.sources.every(url => typeof url==='string' && /^https?:\/\//i.test(url))) {
      return unknown('A scoped assessment, explanation and evidence sources are required; maturity is not inferred from trial status.');
    }
    return {...definition,strength:fact.strength,reason:fact.reason,sources:fact.sources,scope};
  });
}

export function assessCargo(reference, options={}) {
  const cds = reference?.canonicalTranscript?.codingBasesExcludingStop;
  if (!Number.isFinite(cds) || cds <= 0) return supportedGate('unknown','No selected coding transcript length. Genomic span is not cargo length.');
  const capacity = options.capacityBp ?? 4700;
  if (!Number.isFinite(capacity) || capacity <= 0) return supportedGate('unknown','A positive platform capacity is required.');
  // Full coding sequence cannot fit if its lower bound already exceeds capacity.
  if (cds > capacity) return supportedGate('contradicted',`Canonical coding sequence alone is at least ${cds.toLocaleString()} bp, above the ${capacity.toLocaleString()} bp scenario capacity. Alternative constructs need separate assessment.`,[reference.provenance?.sourceUrl].filter(Boolean));
  if (!Number.isFinite(options.otherCassetteBp) || options.otherCassetteBp < 0) return supportedGate('unknown',`Canonical coding sequence is at least ${cds.toLocaleString()} bp; promoter, stop codon, regulatory elements, polyA and ITRs have not been specified.`);
  const total = cds + options.otherCassetteBp;
  return supportedGate(total <= capacity ? 'supported' : 'contradicted',`User-defined cassette scenario: ${cds} coding bases + ${options.otherCassetteBp} other bases = ${total} bp; capacity ${capacity} bp. Not validated delivery or efficacy.`);
}

export function assessModality(modalityId, context={}, reference=null, options={}) {
  const modality = modalities.find(m => m.id===modalityId);
  if (!modality) return {status:'unknown',gates:[],supported:0,unknown:0,contradicted:0};
  context=context || {};
  const facts=context.gates || {};
  const gates=modality.gates.map(g => {
    let result=facts[g.id] ? scopedGateFact(facts[g.id],context,modalityId,options) : supportedGate('unknown',g.reason);
    if (g.id==='mechanism' && !facts.mechanism) {
      if (!['loss_of_function','haploinsufficiency','gain_of_function','dominant_negative','toxic_gain_of_function','toxic_rna','dosage_gain'].includes(context.mechanism) || !validSources(context.sourceUrls)) result=supportedGate('unknown',context.mechanism==='conflicting'?'Multiple variant mechanisms share this disease context; allele-specific evidence is required before choosing intervention direction.':g.reason);
      else if (modality.mechanisms?.includes(context.mechanism)) result=supportedGate('supported',
        `${context.disease || 'Selected context'}: ${context.mechanism.replaceAll('_',' ')} is consistent with this family's usual intervention direction. Disease-level mechanism does not establish rescue of the selected allele or phenotype.`,context.sourceUrls);
      else if (modality.mechanisms) result={...supportedGate('unknown',
        `${context.disease || 'Selected context'}: ${context.mechanism.replaceAll('_',' ')} requires an allele- and intervention-specific direction assessment. Mechanism class alone does not prove this modality incompatible; functional evidence must establish whether the proposed intervention restores the selected endpoint.`,context.sourceUrls),directionConcern:true};
      else result=supportedGate('unknown','Mechanism alone does not determine the required variant-specific design.',context.sourceUrls);
    }
    if (g.id==='cargo' && modality.id==='aav-addition') result=assessCargo(reference,options);
    // Unsupported assertions, invalid states and missing source citations do not pass.
    if (!['supported','contradicted','unknown','not_applicable'].includes(result.status)) result=supportedGate('unknown','Invalid evidence state.');
    if (g.hard && result.status==='not_applicable') result=supportedGate('unknown','A necessary requirement cannot be bypassed as not applicable; choose a different scoped modality if it does not apply.');
    if (g.id!=='cargo' && ['supported','contradicted'].includes(result.status) && !result.sources?.length) result=supportedGate('unknown','Evidence source required for this gate.');
    return {...g,...result};
  });
  const blocking=gates.filter(g=>g.hard&&g.status==='contradicted');
  const unknown=gates.filter(g=>g.hard&&g.status==='unknown');
  return {modalityId,status:blocking.length?'incompatible':unknown.length?'insufficient_evidence':'requirements_supported',gates,
    supported:gates.filter(g=>g.status==='supported').length,unknown:unknown.length,contradicted:blocking.length};
}

export function buildCandidates({genePhenotypes, severity=[], predictions={}, atlasIndex=null, contexts=[], variantIndex={}, modalityId='aso-upregulation'}) {
  const severityMap=new Map(severity.map(x=>[x.hpo_id,x]));
  const rows=[];
  const seen=new Set();
  for(const [gene,associations] of Object.entries(genePhenotypes.genes || {})) {
    for(const a of associations) {
      const key=[gene,a.hpo_id,a.disease_id].join('|');
      if(seen.has(key)||a.isPhenotypicAbnormality===false||/obsolete/i.test(a.hpo_name)||['HP:0000001','HP:0000118'].includes(a.hpo_id)) continue;
      seen.add(key);
      const matches=contexts.filter(c=>c.gene===gene&&c.diseaseIds?.includes(a.disease_id));
      const context=matches.length>1 ? {...matches[0],
        mechanism:new Set(matches.map(c=>c.mechanism)).size===1?matches[0].mechanism:'conflicting',
        sourceUrls:[...new Set(matches.flatMap(c=>c.sourceUrls||[]))],gates:{},modifiers:{},
        notes:'Multiple variant mechanisms share this disease context. Allele-specific evidence is required; gate facts are not automatically merged. ' + matches.map(c => c.notes || c.scope || '').filter(Boolean).join(' ')} : matches[0];
      const evaluation=assessModality(modalityId,context||{},variantIndex.genes?.[gene]?.reference,{diseaseId:a.disease_id,hpoId:a.hpo_id});
      const s=severityMap.get(a.hpo_id);
      rows.push({id:key,gene,hpoId:a.hpo_id,phenotype:a.hpo_name,diseaseId:a.disease_id,
        disease:context?.disease||a.disease_id,context:context||null,
        severity:s?.severity_class||'unknown',severityScore:s?.severity_score??null,
        severityProvenance:'Legacy machine-annotated HPO severity; unvalidated and not a treatment-priority probability.',
        predictedCells: Object.values(atlasIndex?.phenotypes?.[a.hpo_id]?.atlases || {}).map(atlas=>atlas.top).filter(Boolean),
        predictedCell:atlasIndex ? Object.values(atlasIndex.phenotypes?.[a.hpo_id]?.atlases || {}).map(atlas=>atlas.top?.cell).filter(Boolean).join(' / ') || null : predictions[a.hpo_id]?.top_cell_type||null,
        associationKind:'Disease-context phenotype–gene co-association; variant-level phenotype attribution unestablished.',
        evaluation});
    }
  }
  return rankCandidates(rows);
}

export function rankCandidates(rows) {
  const severityRank={profound:3,severe:2,moderate:1,mild:0};
  const stateRank={requirements_supported:2,insufficient_evidence:1,incompatible:0};
  return [...rows].sort((a,b)=>
    (stateRank[b.evaluation.status]??-1)-(stateRank[a.evaluation.status]??-1)||
    Number(b.evaluation.gates.find(g=>g.id==='mechanism')?.status==='supported')-Number(a.evaluation.gates.find(g=>g.id==='mechanism')?.status==='supported')||
    (severityRank[b.severity]??-1)-(severityRank[a.severity]??-1)||
    a.evaluation.unknown-b.evaluation.unknown||a.id.localeCompare(b.id));
}
