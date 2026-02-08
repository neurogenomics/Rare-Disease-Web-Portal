// Curated list of FDA/EMA approved gene therapies (includes all genetic modification approaches)
// Sources: FDA Approved Cellular and Gene Therapy Products, EMA Gene Therapy Products, BioInformant
// Last updated: January 2026
//
// therapy_type categories:
// - "In vivo gene therapy" = viral vector delivered directly to patient (AAV, oncolytic virus)
// - "Ex vivo gene therapy" = patient cells modified outside body, then reinfused (lentivirus, retrovirus HSCT)
// - "CAR-T" = chimeric antigen receptor T-cell therapy
// - "TCR-T" = T-cell receptor modified therapy
// - "Gene-edited cells" = CRISPR or other gene editing of patient cells

export const approvedGeneTherapies = [
    // =====================
    // CNS/Neurological
    // =====================
    {
        id: 1,
        brand_name: "Zolgensma",
        gene_symbol: "SMN1",
        disease_name: "Spinal Muscular Atrophy (SMA)",
        indication: "Treatment of pediatric patients with SMA with bi-allelic mutations in the SMN1 gene",
        modality: "AAV9",
        therapy_type: "In vivo gene therapy",
        company: "Novartis",
        approval_year: 2019,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0001324", "HP:0002093", "HP:0001263", "HP:0011968"],
        category: "CNS",
        delivery_route: "IV",
        one_time: true,
        target_cell_type: "Motor neurons",
        target_cell_source: "mechanism",
        // Evidence-based HPO mappings from pivotal trial
        pivotal_trials: [
            { nct_id: "NCT03306277", trial_name: "STR1VE", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0001324",
                hpo_label: "Muscle weakness",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03306277",
                    endpoint_type: "primary",
                    endpoint_measure: "Achievement of Independent Sitting for at Least 30 Seconds",
                    endpoint_description: "Independent sitting is defined as sitting up straight with head erect for at least 30 seconds.",
                    mapping_rationale: "Independent sitting requires trunk and neck muscle strength. SMA causes progressive muscle weakness due to motor neuron loss. Achieving sitting demonstrates recovery of motor function and improvement in the core muscle weakness phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03306277" },
                    { type: "fda_label", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/125694s000lbl.pdf" }
                ]
            },
            {
                hpo_id: "HP:0002093",
                hpo_label: "Respiratory insufficiency",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03306277",
                    endpoint_type: "primary",
                    endpoint_measure: "Event-free Survival",
                    endpoint_description: "Survival defined by avoidance of death or permanent ventilation (>=16 hours/day for >=14 consecutive days).",
                    mapping_rationale: "SMA Type 1 patients typically require permanent ventilation due to respiratory muscle weakness. The primary endpoint specifically measures respiratory function via ventilation requirements, directly addressing respiratory insufficiency.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03306277" },
                    { type: "fda_label", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/125694s000lbl.pdf" }
                ]
            },
            {
                hpo_id: "HP:0011968",
                hpo_label: "Feeding difficulties",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03306277",
                    endpoint_type: "secondary",
                    endpoint_measure: "Ability to Thrive",
                    endpoint_description: "Achieving: no mechanical feeding support, ability to tolerate thin liquids via swallowing test, maintains weight.",
                    mapping_rationale: "The 'Ability to Thrive' endpoint directly measures feeding function, including swallowing ability and oral nutrition tolerance. SMA causes bulbar muscle weakness leading to feeding difficulties.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03306277" }
                ]
            },
            {
                hpo_id: "HP:0001263",
                hpo_label: "Global developmental delay",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03306277",
                    endpoint_type: "primary",
                    endpoint_measure: "Achievement of Independent Sitting for at Least 30 Seconds",
                    endpoint_description: "Motor milestone achievement measured at 18 months.",
                    mapping_rationale: "SMA Type 1 patients fail to achieve normal developmental milestones. Independent sitting is a key motor milestone; failure to achieve it represents global developmental delay. This is a secondary phenotype addressed by the treatment.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03306277" }
                ]
            }
        ],
    },
    {
        id: 2,
        brand_name: "Upstaza",
        gene_symbol: "DDC",
        disease_name: "AADC Deficiency",
        indication: "Treatment of patients with aromatic L-amino acid decarboxylase (AADC) deficiency",
        modality: "AAV2",
        therapy_type: "In vivo gene therapy",
        company: "PTC Therapeutics",
        approval_year: 2022,
        approval_agency: "EMA",
        hpo_ids: ["HP:0002194", "HP:0000511", "HP:0001332"],
        category: "CNS",
        delivery_route: "Intracranial",
        one_time: true,
        target_cell_type: "Dopaminergic neurons (putamen)",
        target_cell_source: "fda_label",
        pivotal_trials: [
            { nct_id: "NCT02852213", trial_name: "AADC Gene Therapy", phase: "Phase 1" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002194",
                hpo_label: "Delayed gross motor development",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02852213",
                    endpoint_type: "secondary",
                    endpoint_measure: "Gross Motor Function Measure-88 (GMFM-88)",
                    endpoint_description: "Increase in Gross Motor Function Measure-88 (GMFM-88) score measured over 2 years.",
                    mapping_rationale: "GMFM-88 directly measures gross motor function development. AADC deficiency causes severe motor developmental delay due to dopamine and serotonin deficiency. Improvement in GMFM-88 score demonstrates recovery of delayed motor milestones.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02852213" }
                ]
            },
            {
                hpo_id: "HP:0000511",
                hpo_label: "Oculogyric crisis",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02852213",
                    endpoint_type: "secondary",
                    endpoint_measure: "Symptom Diary - Oculogyric Episodes",
                    endpoint_description: "Decrease in frequency and severity of oculogyric episodes as recorded in PI-created symptom diary over 1 year.",
                    mapping_rationale: "Oculogyric crises are a hallmark feature of AADC deficiency, characterized by sustained upward deviation of the eyes. The trial specifically measured reduction in oculogyric episode frequency as a key clinical outcome.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02852213" }
                ]
            },
            {
                hpo_id: "HP:0001332",
                hpo_label: "Dystonia",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT02852213",
                    endpoint_type: "primary",
                    endpoint_measure: "Adverse events including post-operative dyskinesia severity",
                    endpoint_description: "Assessment of adverse events related to gene transfer, including severity of post-operative dyskinesia.",
                    mapping_rationale: "AADC deficiency causes movement disorders including dystonia due to dopamine deficiency. Post-operative dyskinesia monitoring indicates assessment of movement disorder phenotype. Restoration of dopamine synthesis addresses underlying dystonia.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02852213" }
                ]
            }
        ],
    },
    {
        id: 3,
        brand_name: "Kebilidi",
        gene_symbol: "DDC",
        disease_name: "AADC Deficiency",
        indication: "Treatment of pediatric patients with AADC deficiency",
        modality: "AAV2",
        therapy_type: "In vivo gene therapy",
        company: "PTC Therapeutics",
        approval_year: 2023,
        approval_agency: "FDA",
        hpo_ids: ["HP:0002194", "HP:0000511", "HP:0001332"],
        category: "CNS",
        delivery_route: "Intracranial",
        one_time: true,
        target_cell_type: "Dopaminergic neurons (putamen)",
        target_cell_source: "fda_label",
        note: "US version of Upstaza",
        pivotal_trials: [
            { nct_id: "NCT02852213", trial_name: "AADC Gene Therapy", phase: "Phase 1" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002194",
                hpo_label: "Delayed gross motor development",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02852213",
                    endpoint_type: "secondary",
                    endpoint_measure: "Gross Motor Function Measure-88 (GMFM-88)",
                    endpoint_description: "Increase in Gross Motor Function Measure-88 (GMFM-88) score measured over 2 years.",
                    mapping_rationale: "GMFM-88 directly measures gross motor function development. AADC deficiency causes severe motor developmental delay due to dopamine and serotonin deficiency. Improvement in GMFM-88 score demonstrates recovery of delayed motor milestones.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02852213" }
                ]
            },
            {
                hpo_id: "HP:0000511",
                hpo_label: "Oculogyric crisis",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02852213",
                    endpoint_type: "secondary",
                    endpoint_measure: "Symptom Diary - Oculogyric Episodes",
                    endpoint_description: "Decrease in frequency and severity of oculogyric episodes as recorded in PI-created symptom diary over 1 year.",
                    mapping_rationale: "Oculogyric crises are a hallmark feature of AADC deficiency, characterized by sustained upward deviation of the eyes. The trial specifically measured reduction in oculogyric episode frequency as a key clinical outcome.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02852213" }
                ]
            },
            {
                hpo_id: "HP:0001332",
                hpo_label: "Dystonia",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT02852213",
                    endpoint_type: "primary",
                    endpoint_measure: "Adverse events including post-operative dyskinesia severity",
                    endpoint_description: "Assessment of adverse events related to gene transfer, including severity of post-operative dyskinesia.",
                    mapping_rationale: "AADC deficiency causes movement disorders including dystonia due to dopamine deficiency. Post-operative dyskinesia monitoring indicates assessment of movement disorder phenotype. Restoration of dopamine synthesis addresses underlying dystonia.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02852213" }
                ]
            }
        ],
    },
    {
        id: 4,
        brand_name: "Skysona",
        gene_symbol: "ABCD1",
        disease_name: "Cerebral Adrenoleukodystrophy (CALD)",
        indication: "Treatment of early cerebral adrenoleukodystrophy in patients with a confirmed diagnosis",
        modality: "Lentivirus (ex vivo)",
        therapy_type: "Ex vivo gene therapy",
        company: "Bluebird Bio",
        approval_year: 2022,
        approval_agency: "FDA",
        hpo_ids: ["HP:0002352", "HP:0002015", "HP:0000572", "HP:0001249", "HP:0002167"],
        category: "CNS",
        delivery_route: "HSCT (ex vivo)",
        one_time: true,
        target_cell_type: "Hematopoietic stem cells (CD34+)",
        target_cell_source: "fda_label",
        pivotal_trials: [
            { nct_id: "NCT01896102", trial_name: "ALD-102/103 (Lenti-D)", phase: "Phase 2/3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002352",
                hpo_label: "Leukoencephalopathy",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01896102",
                    endpoint_type: "secondary",
                    endpoint_measure: "Resolution of Gadolinium Positivity on MRI",
                    endpoint_description: "Percentage of participants who demonstrated resolution of gadolinium positivity (GdE-) on MRI at Month 24, indicating stabilization of white matter inflammation.",
                    mapping_rationale: "Gadolinium enhancement on brain MRI indicates active demyelination and inflammation in cerebral white matter. Resolution of gadolinium positivity directly demonstrates stabilization of the leukoencephalopathy characteristic of CALD.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01896102" }
                ]
            },
            {
                hpo_id: "HP:0002015",
                hpo_label: "Dysphagia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01896102",
                    endpoint_type: "primary",
                    endpoint_measure: "Major Functional Disability-Free Survival - Tube Feeding",
                    endpoint_description: "Tube feeding is one of the 6 Major Functional Disabilities (MFDs) assessed. Freedom from tube feeding at 24 months indicates preserved swallowing function.",
                    mapping_rationale: "Tube feeding requirement indicates dysphagia severe enough to preclude oral nutrition. The MFD-free survival endpoint specifically tracks avoidance of tube feeding, directly measuring dysphagia prevention.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01896102" }
                ]
            },
            {
                hpo_id: "HP:0000572",
                hpo_label: "Visual loss",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01896102",
                    endpoint_type: "primary",
                    endpoint_measure: "Major Functional Disability-Free Survival - Cortical Blindness",
                    endpoint_description: "Cortical blindness is one of the 6 Major Functional Disabilities (MFDs) assessed. Freedom from cortical blindness at 24 months indicates preserved vision.",
                    mapping_rationale: "Cortical blindness represents complete visual loss due to damage to visual processing areas. The MFD-free survival endpoint tracks avoidance of cortical blindness, directly measuring prevention of visual loss.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01896102" }
                ]
            },
            {
                hpo_id: "HP:0001249",
                hpo_label: "Intellectual disability",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01896102",
                    endpoint_type: "primary",
                    endpoint_measure: "Major Functional Disability-Free Survival - Loss of Communication",
                    endpoint_description: "Loss of communication is one of the 6 Major Functional Disabilities (MFDs) assessed, reflecting severe cognitive decline.",
                    mapping_rationale: "Loss of communication in CALD reflects progressive intellectual disability from cerebral demyelination. The NFS also scores aphasia/apraxia and communication loss. Preventing these disabilities indicates preservation of cognitive function.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01896102" }
                ]
            },
            {
                hpo_id: "HP:0002167",
                hpo_label: "Abnormality of speech or vocalization",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT01896102",
                    endpoint_type: "secondary",
                    endpoint_measure: "Neurologic Function Score - Aphasia/Apraxia",
                    endpoint_description: "NFS includes scoring for aphasia/apraxia (1 point) and loss of communication (3 points) as part of the 25-point neurologic assessment.",
                    mapping_rationale: "The NFS specifically evaluates speech and language dysfunction including aphasia and apraxia. Change in NFS from baseline captures improvement or stabilization of speech abnormalities in CALD patients.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01896102" }
                ]
            }
        ],
    },
    {
        id: 5,
        brand_name: "Libmeldy",
        gene_symbol: "ARSA",
        disease_name: "Metachromatic Leukodystrophy (MLD)",
        indication: "Treatment of early-onset metachromatic leukodystrophy",
        modality: "Lentivirus (ex vivo)",
        therapy_type: "Ex vivo gene therapy",
        company: "Orchard Therapeutics",
        approval_year: 2020,
        approval_agency: "EMA",
        hpo_ids: ["HP:0002194", "HP:0002352", "HP:0007328", "HP:0001249"],
        category: "CNS",
        delivery_route: "HSCT (ex vivo)",
        one_time: true,
        target_cell_type: "Hematopoietic stem cells (CD34+)",
        target_cell_source: "fda_label",
        pivotal_trials: [
            { nct_id: "NCT01560182", trial_name: "MLD Gene Therapy", phase: "Phase 1/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002194",
                hpo_label: "Delayed gross motor development",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "primary",
                    endpoint_measure: "Gross Motor Function Measure (GMFM) Score",
                    endpoint_description: "An improvement of 10% of the total GMFM score in treated patients compared to historical control MLD population, evaluated 24 months after treatment.",
                    mapping_rationale: "GMFM directly measures gross motor function. MLD causes progressive motor deterioration due to demyelination. Improvement in GMFM score versus historical controls demonstrates preservation or recovery of motor development.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            },
            {
                hpo_id: "HP:0002352",
                hpo_label: "Leukoencephalopathy",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "secondary",
                    endpoint_measure: "Total Brain MRI Score",
                    endpoint_description: "Total brain MRI score compared to scores observed in historical control MLD population at 24 months after treatment.",
                    mapping_rationale: "Brain MRI scoring in MLD quantifies white matter abnormalities characteristic of leukoencephalopathy. Comparison to historical controls measures stabilization or improvement of the demyelinating process.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            },
            {
                hpo_id: "HP:0007328",
                hpo_label: "Impaired peripheral nerve conduction",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "secondary",
                    endpoint_measure: "Nerve Conduction Velocity (NCV) Index",
                    endpoint_description: "NCV Index for electroneurography (ENG) compared to scores observed in the historical control MLD population.",
                    mapping_rationale: "MLD causes both central and peripheral demyelination. NCV testing directly measures peripheral nerve function. Comparison to historical controls demonstrates preservation of peripheral nerve conduction.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            },
            {
                hpo_id: "HP:0001249",
                hpo_label: "Intellectual disability",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "secondary",
                    endpoint_measure: "IQ Measurement Above 55",
                    endpoint_description: "The measurement of an IQ above 55 (threshold for severe cognitive impairment) at neuro-psychological testings at 24, 30 and 36 months after treatment.",
                    mapping_rationale: "IQ below 55 indicates severe intellectual disability. The endpoint specifically measures cognitive preservation above the severe impairment threshold, directly assessing prevention of intellectual disability progression in MLD.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            }
        ],
    },
    {
        id: 6,
        brand_name: "Lenmeldy",
        gene_symbol: "ARSA",
        disease_name: "Metachromatic Leukodystrophy (MLD)",
        indication: "Treatment of children with presymptomatic late infantile, presymptomatic early juvenile, or early symptomatic early juvenile MLD",
        modality: "Lentivirus (ex vivo)",
        therapy_type: "Ex vivo gene therapy",
        company: "Orchard Therapeutics",
        approval_year: 2024,
        approval_agency: "FDA",
        hpo_ids: ["HP:0002194", "HP:0002352", "HP:0007328", "HP:0001249"],
        category: "CNS",
        delivery_route: "HSCT (ex vivo)",
        one_time: true,
        target_cell_type: "Hematopoietic stem cells (CD34+)",
        target_cell_source: "fda_label",
        note: "US version of Libmeldy",
        pivotal_trials: [
            { nct_id: "NCT01560182", trial_name: "MLD Gene Therapy", phase: "Phase 1/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002194",
                hpo_label: "Delayed gross motor development",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "primary",
                    endpoint_measure: "Gross Motor Function Measure (GMFM) Score",
                    endpoint_description: "An improvement of 10% of the total GMFM score in treated patients compared to historical control MLD population, evaluated 24 months after treatment.",
                    mapping_rationale: "GMFM directly measures gross motor function. MLD causes progressive motor deterioration due to demyelination. Improvement in GMFM score versus historical controls demonstrates preservation or recovery of motor development.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            },
            {
                hpo_id: "HP:0002352",
                hpo_label: "Leukoencephalopathy",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "secondary",
                    endpoint_measure: "Total Brain MRI Score",
                    endpoint_description: "Total brain MRI score compared to scores observed in historical control MLD population at 24 months after treatment.",
                    mapping_rationale: "Brain MRI scoring in MLD quantifies white matter abnormalities characteristic of leukoencephalopathy. Comparison to historical controls measures stabilization or improvement of the demyelinating process.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            },
            {
                hpo_id: "HP:0007328",
                hpo_label: "Impaired peripheral nerve conduction",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "secondary",
                    endpoint_measure: "Nerve Conduction Velocity (NCV) Index",
                    endpoint_description: "NCV Index for electroneurography (ENG) compared to scores observed in the historical control MLD population.",
                    mapping_rationale: "MLD causes both central and peripheral demyelination. NCV testing directly measures peripheral nerve function. Comparison to historical controls demonstrates preservation of peripheral nerve conduction.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            },
            {
                hpo_id: "HP:0001249",
                hpo_label: "Intellectual disability",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01560182",
                    endpoint_type: "secondary",
                    endpoint_measure: "IQ Measurement Above 55",
                    endpoint_description: "The measurement of an IQ above 55 (threshold for severe cognitive impairment) at neuro-psychological testings at 24, 30 and 36 months after treatment.",
                    mapping_rationale: "IQ below 55 indicates severe intellectual disability. The endpoint specifically measures cognitive preservation above the severe impairment threshold, directly assessing prevention of intellectual disability progression in MLD.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01560182" }
                ]
            }
        ],
    },

    // =====================
    // Neuromuscular
    // =====================
    {
        id: 7,
        brand_name: "Elevidys",
        gene_symbol: "DMD",
        disease_name: "Duchenne Muscular Dystrophy (DMD)",
        indication: "Treatment of ambulatory pediatric patients with Duchenne muscular dystrophy",
        modality: "AAVrh74",
        therapy_type: "In vivo gene therapy",
        company: "Sarepta",
        approval_year: 2023,
        approval_agency: "FDA",
        hpo_ids: ["HP:0003202", "HP:0001324", "HP:0003236"],
        category: "Neuromuscular",
        delivery_route: "IV",
        one_time: true,
        target_cell_type: "Skeletal muscle fibers",
        target_cell_source: "mechanism",
        // Evidence-based HPO mappings from pivotal trial
        pivotal_trials: [
            { nct_id: "NCT03375164", trial_name: "microDys-IV-001", phase: "Phase 1/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0003202",
                hpo_label: "Amyotrophy",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03375164",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change From Baseline at Day 90 in Delandistrogene Moxeparvovec Dystrophin Expression as Measured by Western Blot",
                    endpoint_description: "Baseline muscle biopsies with ultrasound guidance were performed pre-treatment and post-treatment (Day 90) on all participants. The change from baseline in delandistrogene moxeparvovec dystrophin protein levels in these muscle biopsy samples was determined by Western blot.",
                    mapping_rationale: "Dystrophin protein expression in muscle biopsies directly addresses the underlying cause of muscle wasting (amyotrophy) in DMD. Absence of dystrophin leads to progressive muscle fiber damage and atrophy. Increased dystrophin expression demonstrates restoration of the structural protein needed to prevent ongoing muscle degeneration.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03375164" }
                ]
            },
            {
                hpo_id: "HP:0001324",
                hpo_label: "Muscle weakness",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03375164",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change From Baseline at Year 5 in the 100 Meter Timed Test",
                    endpoint_description: "This assessment measures the time needed to move 100 meters and served as the primary motor outcome measure for this study. A decrease in the time needed to move 100 meters indicates increased motor function.",
                    mapping_rationale: "The 100 Meter Timed Test is a validated functional outcome measure that directly assesses motor function and muscle strength in DMD patients. Improvement in walking speed reflects improvement in lower limb muscle weakness, a core phenotype of Duchenne muscular dystrophy.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03375164" }
                ]
            },
            {
                hpo_id: "HP:0003236",
                hpo_label: "Elevated circulating creatine kinase",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03375164",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change From Baseline at Day 90 in Delandistrogene Moxeparvovec Dystrophin Expression as Measured by Immunofluorescence (IF) Fiber Intensity",
                    endpoint_description: "The change from baseline in delandistrogene moxeparvovec dystrophin expression in muscle biopsy samples was determined using IF. Automated software quantified the intensity of dystrophin expression post-treatment compared to pre-treatment.",
                    mapping_rationale: "Elevated creatine kinase in DMD results from muscle fiber membrane instability due to lack of dystrophin. Restoration of dystrophin expression (measured by IF fiber intensity) indicates improved membrane stability, which would reduce CK leakage. While CK was not directly measured as an endpoint, dystrophin restoration addresses the underlying cause of elevated CK.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03375164" }
                ]
            }
        ],
    },

    // =====================
    // Ophthalmology
    // =====================
    {
        id: 8,
        brand_name: "Luxturna",
        gene_symbol: "RPE65",
        disease_name: "Inherited Retinal Dystrophy (RPE65-mediated)",
        indication: "Treatment of patients with confirmed biallelic RPE65 mutation-associated retinal dystrophy",
        modality: "AAV2",
        therapy_type: "In vivo gene therapy",
        company: "Spark Therapeutics",
        approval_year: 2017,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0000662", "HP:0007663", "HP:0000505"],
        category: "Ophthalmology",
        delivery_route: "Subretinal",
        one_time: true,
        target_cell_type: "Retinal pigment epithelium (RPE)",
        target_cell_source: "mechanism",
        // Evidence-based HPO mappings from pivotal trial
        pivotal_trials: [
            { nct_id: "NCT00999609", trial_name: "AAV2-hRPE65v2-301", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0000662",
                hpo_label: "Nyctalopia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT00999609",
                    endpoint_type: "primary",
                    endpoint_measure: "Multi-luminance Mobility Testing (MLMT), Bilateral",
                    endpoint_description: "The MLMT measures changes in functional vision, as assessed by the ability to navigate a course accurately and at a reasonable pace at different levels of environmental illumination. MLMT was assessed using both eyes at 7 levels of illumination, ranging from 400 lux to 1 lux (moonless night). A higher score indicates ability to pass at lower light levels.",
                    mapping_rationale: "The MLMT primary endpoint directly measures night vision function by testing navigation ability at progressively lower light levels (down to 1 lux, equivalent to a moonless night). Nyctalopia (night blindness) is a hallmark feature of RPE65-mediated retinal dystrophy. Improved MLMT scores demonstrate improved function in low-light conditions, directly addressing the night blindness phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00999609" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/luxturna" }
                ]
            },
            {
                hpo_id: "HP:0007663",
                hpo_label: "Reduced visual acuity",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT00999609",
                    endpoint_type: "secondary",
                    endpoint_measure: "Visual Acuity",
                    endpoint_description: "Measurement of the sharpness of vision, determined by the ability to read letters on a standardized chart from a specified distance.",
                    mapping_rationale: "Visual acuity testing directly measures the sharpness of vision. Patients with RPE65-mediated retinal dystrophy have progressive visual acuity loss. The secondary endpoint measuring change in visual acuity from baseline directly assesses improvement in this core phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00999609" }
                ]
            },
            {
                hpo_id: "HP:0000505",
                hpo_label: "Visual impairment",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT00999609",
                    endpoint_type: "secondary",
                    endpoint_measure: "Full-field Light Sensitivity Threshold (FST) Testing: White Light",
                    endpoint_description: "Measures the light sensitivity of the entire visual field by recording the luminance at which a subject reliably reports seeing the dimmest flash.",
                    mapping_rationale: "FST measures overall retinal light sensitivity, a fundamental aspect of visual function. RPE65 deficiency impairs the visual cycle leading to severely reduced light sensitivity. Improved FST demonstrates improved photoreceptor function and addresses the broad visual impairment phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00999609" }
                ]
            }
        ],
    },
    {
        id: 9,
        brand_name: "Encelto",
        gene_symbol: "CNTF",
        disease_name: "Retinitis Pigmentosa",
        indication: "Treatment of retinitis pigmentosa",
        modality: "Encapsulated cell technology",
        therapy_type: "Ex vivo gene therapy",
        company: "Neurotech Pharmaceuticals",
        approval_year: 2025,
        approval_agency: "FDA",
        hpo_ids: ["HP:0007663", "HP:0000546"],
        category: "Ophthalmology",
        delivery_route: "Intravitreal implant",
        one_time: false,
        target_cell_type: "Photoreceptors (via CNTF secretion)",
        target_cell_source: "mechanism",
        note: "First cell-based gene therapy implant",
        // Evidence-based HPO mappings from pivotal trial
        pivotal_trials: [
            { nct_id: "NCT00447993", trial_name: "CNTF for Late Stage RP", phase: "Phase 2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0007663",
                hpo_label: "Reduced visual acuity",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT00447993",
                    endpoint_type: "primary",
                    endpoint_measure: "Change in Best-corrected Visual Acuity (BCVA) Using Electronic Visual Acuity (EVA) Technology at Month 12",
                    endpoint_description: "The primary efficacy endpoint was the proportion of patients demonstrating an improvement in best-corrected visual acuity (BCVA), defined as an increase of 10 letters or more at the 1-Year post-implant visit.",
                    mapping_rationale: "Best-corrected visual acuity (BCVA) directly measures the sharpness of vision. Retinitis pigmentosa causes progressive photoreceptor degeneration leading to visual acuity loss. The primary endpoint measuring significant BCVA improvement (10+ letters) directly addresses the reduced visual acuity phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00447993" }
                ]
            },
            {
                hpo_id: "HP:0000546",
                hpo_label: "Retinal degeneration",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT00447993",
                    endpoint_type: "secondary",
                    endpoint_measure: "Number of Participants With and Without Best Corrected Visual Acuity Response Over the 18-month Follow-up Period",
                    endpoint_description: "BCVA was measured at Months 1, 3, 6, 12 and 18. Response is defined as an improvement in visual acuity by an increase of 10 letters or more. The assessment tracked sustained visual function over time.",
                    mapping_rationale: "Retinitis pigmentosa is characterized by progressive retinal degeneration with photoreceptor loss. CNTF acts as a neurotrophic factor to protect photoreceptors from degeneration. Sustained BCVA improvement over 18 months indicates slowing or halting of the underlying retinal degeneration process.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00447993" }
                ]
            }
        ],
    },

    // =====================
    // Hematology
    // =====================
    {
        id: 10,
        brand_name: "Zynteglo",
        gene_symbol: "HBB",
        disease_name: "Beta-Thalassemia",
        indication: "Treatment of patients with transfusion-dependent beta-thalassemia",
        modality: "Lentivirus (ex vivo)",
        therapy_type: "Ex vivo gene therapy",
        company: "Bluebird Bio",
        approval_year: 2022,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0001903", "HP:0011902", "HP:0003281"],
        category: "Hematology",
        delivery_route: "HSCT (ex vivo)",
        one_time: true,
        target_cell_type: "Hematopoietic stem cells (CD34+)",
        target_cell_source: "fda_label",
        pivotal_trials: [
            { nct_id: "NCT02906202", trial_name: "Northstar-2", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0001903",
                hpo_label: "Anemia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02906202",
                    endpoint_type: "primary",
                    endpoint_measure: "Percentage of Participants Who Meet the Definition of Transfusion Independence (TI)",
                    endpoint_description: "TI was defined as a weighted average hemoglobin (Hb) >= 9 g/dL without any packed red blood cell (pRBC) transfusions for a continuous period of >= 12 months.",
                    mapping_rationale: "Transfusion independence directly addresses the core anemia phenotype of beta-thalassemia. Patients require regular transfusions because they cannot produce sufficient functional hemoglobin. Achieving TI with Hb >= 9 g/dL demonstrates correction of the underlying anemia.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02906202" }
                ]
            },
            {
                hpo_id: "HP:0011902",
                hpo_label: "Abnormal hemoglobin",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02906202",
                    endpoint_type: "secondary",
                    endpoint_measure: "Weighted Average Hemoglobin (Hb) During Transfusion Independence (TI)",
                    endpoint_description: "Weighted average Hb was defined as the weighted average of Hb values without any pRBC transfusions in the proceeding 60 days.",
                    mapping_rationale: "Beta-thalassemia is caused by mutations in the HBB gene leading to absent or reduced beta-globin production and abnormal hemoglobin. The endpoint measuring sustained hemoglobin levels demonstrates restoration of functional hemoglobin production.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02906202" }
                ]
            },
            {
                hpo_id: "HP:0003281",
                hpo_label: "Increased circulating ferritin concentration",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT02906202",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change From Baseline in Serum Ferritin at Months 12 and 24",
                    endpoint_description: "Serum ferritin was commonly used for an indirect estimation of body iron stores. It can be elevated in iron overload states.",
                    mapping_rationale: "Chronic transfusion therapy in beta-thalassemia leads to iron overload manifesting as elevated serum ferritin. This secondary endpoint measures reduction in iron burden as patients achieve transfusion independence.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02906202" }
                ]
            }
        ],
    },
    {
        id: 11,
        brand_name: "Casgevy",
        gene_symbol: "BCL11A",
        disease_name: "Sickle Cell Disease / Beta-Thalassemia",
        indication: "Treatment of sickle cell disease and transfusion-dependent beta-thalassemia",
        modality: "CRISPR/Cas9 (ex vivo)",
        therapy_type: "Gene-edited cells",
        company: "Vertex / CRISPR Therapeutics",
        approval_year: 2023,
        approval_agency: "FDA, EMA, UK MHRA",
        hpo_ids: ["HP:0012531", "HP:0001903", "HP:0011902", "HP:0001878"],
        category: "Hematology",
        delivery_route: "HSCT (ex vivo)",
        one_time: true,
        target_cell_type: "Hematopoietic stem cells (CD34+)",
        target_cell_source: "mechanism",
        note: "First CRISPR-based therapy approved",
        pivotal_trials: [
            { nct_id: "NCT03745287", trial_name: "CLIMB-121", phase: "Phase 2/3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0012531",
                hpo_label: "Pain",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03745287",
                    endpoint_type: "primary",
                    endpoint_measure: "Proportion of subjects who have not experienced any severe vaso-occlusive crisis (VOC) for at least 12 consecutive months (VF12)",
                    endpoint_description: "Freedom from severe vaso-occlusive crises for at least 12 consecutive months after CTX001 infusion.",
                    mapping_rationale: "Vaso-occlusive crises are the hallmark clinical manifestation of sickle cell disease, characterized by severe acute pain episodes. The primary endpoint directly measures elimination of these painful crises, addressing the core pain phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03745287" }
                ]
            },
            {
                hpo_id: "HP:0001903",
                hpo_label: "Anemia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03745287",
                    endpoint_type: "secondary",
                    endpoint_measure: "Hb concentration over time",
                    endpoint_description: "Total hemoglobin concentration measured from CTX001 infusion up to 2 years post-infusion.",
                    mapping_rationale: "Sickle cell disease causes chronic hemolytic anemia due to sickling and destruction of red blood cells. Sustained hemoglobin improvement demonstrates correction of the underlying anemia.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03745287" }
                ]
            },
            {
                hpo_id: "HP:0011902",
                hpo_label: "Abnormal hemoglobin",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03745287",
                    endpoint_type: "secondary",
                    endpoint_measure: "Proportion of subjects with sustained HbF >=20% for at least 12 months",
                    endpoint_description: "Sustained fetal hemoglobin (HbF) levels of at least 20% for 12 or more months after infusion.",
                    mapping_rationale: "Casgevy works by upregulating fetal hemoglobin (HbF) production to compensate for defective adult hemoglobin (HbS). Sustained HbF >= 20% demonstrates successful correction of the abnormal hemoglobin phenotype via fetal globin induction.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03745287" }
                ]
            },
            {
                hpo_id: "HP:0001878",
                hpo_label: "Hemolytic anemia",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03745287",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change from baseline in indirect bilirubin, reticulocyte count, haptoglobin, and lactate dehydrogenase over time",
                    endpoint_description: "Hemolysis markers including indirect bilirubin, reticulocytes, haptoglobin, and LDH measured from baseline through 2 years.",
                    mapping_rationale: "These laboratory markers directly assess hemolysis severity. Indirect bilirubin and LDH elevation indicate red cell destruction; low haptoglobin indicates hemoglobin release; elevated reticulocytes indicate compensatory erythropoiesis. Improvement in these markers demonstrates reduced hemolytic anemia.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03745287" }
                ]
            }
        ],
    },
    {
        id: 12,
        brand_name: "Lyfgenia",
        gene_symbol: "HBB",
        disease_name: "Sickle Cell Disease",
        indication: "Treatment of sickle cell disease in patients 12 years and older",
        modality: "Lentivirus (ex vivo)",
        therapy_type: "Ex vivo gene therapy",
        company: "Bluebird Bio",
        approval_year: 2023,
        approval_agency: "FDA",
        hpo_ids: ["HP:0012531", "HP:0001903", "HP:0011902", "HP:0001878"],
        category: "Hematology",
        delivery_route: "HSCT (ex vivo)",
        one_time: true,
        target_cell_type: "Hematopoietic stem cells (CD34+)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT02140554", trial_name: "HGB-206", phase: "Phase 1/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0012531",
                hpo_label: "Pain",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02140554",
                    endpoint_type: "primary",
                    endpoint_measure: "Percentage of Group C Participants Who Achieved Complete Resolution of Vaso-occlusive Events (VOE-CR)",
                    endpoint_description: "VOE-CR was defined as complete resolution of adjudicated VOEs between 6 months and 18 months post lovo-cel infusion.",
                    mapping_rationale: "Vaso-occlusive events are the primary cause of acute pain crises in sickle cell disease. Complete resolution of VOEs directly demonstrates elimination of the pain phenotype that drives disease morbidity.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02140554" }
                ]
            },
            {
                hpo_id: "HP:0001903",
                hpo_label: "Anemia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02140554",
                    endpoint_type: "secondary",
                    endpoint_measure: "Weighted Average of Non-transfused Total Hb in Group C Participants",
                    endpoint_description: "Non-transfused total Hb was the total g/dL of HbS + HbF + HbA2 + HbAT87Q measured at Month 6, 12, 18, and 24 post lovo-cel infusion.",
                    mapping_rationale: "Total hemoglobin levels directly measure anemia severity. In sickle cell disease, chronic hemolysis leads to anemia. Sustained improvement in total Hb demonstrates correction of the underlying anemia.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02140554" }
                ]
            },
            {
                hpo_id: "HP:0011902",
                hpo_label: "Abnormal hemoglobin",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02140554",
                    endpoint_type: "secondary",
                    endpoint_measure: "Weighted Average of HbAT87Q % in Non-transfused Total Hb in Group C Participants",
                    endpoint_description: "HbAT87Q % in non-transfused total Hb was calculated as: HbAT87Q / non-transfused total Hb * 100.",
                    mapping_rationale: "HbAT87Q is the anti-sickling hemoglobin produced by the lovo-cel transgene. Measuring its proportion of total hemoglobin demonstrates successful production of functional hemoglobin to correct the abnormal hemoglobin (HbS) phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02140554" }
                ]
            },
            {
                hpo_id: "HP:0001878",
                hpo_label: "Hemolytic anemia",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT02140554",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change From Baseline in Total Bilirubin, Haptoglobin, and Lactate Dehydrogenase (LDH) in Group C Participants",
                    endpoint_description: "Total Bilirubin, Haptoglobin, and LDH are markers of RBC hemolysis measured at baseline, Month 12 and Month 24.",
                    mapping_rationale: "These laboratory markers directly assess hemolysis. Total bilirubin and LDH elevation indicate red cell destruction; low haptoglobin indicates hemoglobin release. Improvement in these markers demonstrates reduced hemolytic anemia from sickle cell disease.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02140554" }
                ]
            }
        ],
    },
    {
        id: 13,
        brand_name: "Hemgenix",
        gene_symbol: "F9",
        disease_name: "Hemophilia B",
        indication: "Treatment of adults with Hemophilia B who require factor IX prophylaxis",
        modality: "AAV5",
        therapy_type: "In vivo gene therapy",
        company: "CSL Behring",
        approval_year: 2022,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0001892", "HP:0003125", "HP:0005261"],
        category: "Hematology",
        delivery_route: "IV",
        one_time: true,
        target_cell_type: "Hepatocytes",
        target_cell_source: "aav_tropism",
        pivotal_trials: [
            { nct_id: "NCT03569891", trial_name: "HOPE-B", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0001892",
                hpo_label: "Abnormal bleeding",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03569891",
                    endpoint_type: "primary",
                    endpoint_measure: "Annualized Bleeding Rate (ABR) for All Bleeding Episodes",
                    endpoint_description: "ABR was calculated as the ratio of the number of bleeds to the number of days in the time interval multiplied by 365.25, measured from months 7-18 post-treatment.",
                    mapping_rationale: "Annualized bleeding rate is the core clinical outcome measure for hemophilia. Reduction in ABR directly demonstrates improvement in the abnormal bleeding phenotype that defines hemophilia B.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03569891" }
                ]
            },
            {
                hpo_id: "HP:0003125",
                hpo_label: "Reduced factor IX activity",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03569891",
                    endpoint_type: "secondary",
                    endpoint_measure: "Factor IX Activity Levels After AMT-061 Dosing",
                    endpoint_description: "Factor IX activity levels measured at baseline and 6, 12, and 18 months after AMT-061 dosing.",
                    mapping_rationale: "Factor IX deficiency is the direct cause of hemophilia B. Measuring FIX activity levels after gene therapy directly demonstrates correction of the reduced factor IX activity phenotype through endogenous production.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03569891" }
                ]
            },
            {
                hpo_id: "HP:0005261",
                hpo_label: "Joint hemorrhage",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03569891",
                    endpoint_type: "secondary",
                    endpoint_measure: "Number of Joint Bleeding Episodes",
                    endpoint_description: "Number of joint bleeding episodes during the lead-in period and months 7-18 after AMT-061 dosing.",
                    mapping_rationale: "Hemarthrosis (joint hemorrhage) is a major manifestation of severe hemophilia, leading to hemophilic arthropathy. Reduction in joint bleeding episodes demonstrates improvement in this specific bleeding manifestation.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03569891" }
                ]
            }
        ],
    },
    {
        id: 14,
        brand_name: "Beqvez",
        gene_symbol: "F9",
        disease_name: "Hemophilia B",
        indication: "Treatment of adults with moderately severe to severe Hemophilia B",
        modality: "AAV (Spark100)",
        therapy_type: "In vivo gene therapy",
        company: "Pfizer",
        approval_year: 2024,
        approval_agency: "FDA",
        hpo_ids: ["HP:0001892", "HP:0003125", "HP:0005261"],
        category: "Hematology",
        delivery_route: "IV",
        one_time: true,
        target_cell_type: "Hepatocytes",
        target_cell_source: "aav_tropism",
        pivotal_trials: [
            { nct_id: "NCT03861273", trial_name: "BeneGene-2", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0001892",
                hpo_label: "Abnormal bleeding",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03861273",
                    endpoint_type: "primary",
                    endpoint_measure: "Annualized Bleeding Rate (ABR) for Total Bleeds (Treated and Untreated) From Week 12 to Month 15",
                    endpoint_description: "ABR = number of total bleeding episodes during the given time period * 365.25 / (Date of last day - date of first day + 1).",
                    mapping_rationale: "Annualized bleeding rate is the primary clinical outcome for hemophilia gene therapy. Reduction in total bleeding episodes directly demonstrates correction of the abnormal bleeding phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03861273" }
                ]
            },
            {
                hpo_id: "HP:0003125",
                hpo_label: "Reduced factor IX activity",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03861273",
                    endpoint_type: "secondary",
                    endpoint_measure: "Steady State Circulating Factor IX (FIX:C) From Week 12 to Month 15",
                    endpoint_description: "Central laboratory analysis using one-stage assays and chromogenic assay. Data reported is the geometric mean of all assessments from week 12 to Month 15.",
                    mapping_rationale: "Sustained Factor IX activity levels directly measure correction of the underlying deficiency. The FIX:C levels achieved demonstrate restoration of clotting factor activity that was previously reduced or absent.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03861273" }
                ]
            },
            {
                hpo_id: "HP:0005261",
                hpo_label: "Joint hemorrhage",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03861273",
                    endpoint_type: "secondary",
                    endpoint_measure: "Number of Target Joint Bleeds From Week 12 to Month 15",
                    endpoint_description: "Target Joint defined as a major joint (hip, elbow, wrist, shoulder, knee, ankle) with repeated bleeds (three or more spontaneous bleeds within 6 months).",
                    mapping_rationale: "Target joint bleeds represent the most clinically significant joint hemorrhage manifestation in hemophilia. Reduction in target joint bleeds indicates improvement in hemarthrosis and protection against progressive arthropathy.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03861273" }
                ]
            }
        ],
    },
    {
        id: 15,
        brand_name: "Roctavian",
        gene_symbol: "F8",
        disease_name: "Hemophilia A",
        indication: "Treatment of severe hemophilia A in adults without factor VIII inhibitors",
        modality: "AAV5",
        therapy_type: "In vivo gene therapy",
        company: "BioMarin",
        approval_year: 2023,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0001892", "HP:0003324", "HP:0001928"],
        category: "Hematology",
        delivery_route: "IV",
        one_time: true,
        target_cell_type: "Hepatocytes",
        target_cell_source: "aav_tropism",
        pivotal_trials: [
            { nct_id: "NCT03370913", trial_name: "BMN 270-301 (GENEr8-1)", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0001892",
                hpo_label: "Abnormal bleeding",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03370913",
                    endpoint_type: "primary",
                    endpoint_measure: "Change From Baseline in Annualized Number of Bleeding Episodes (ABR for All Bleeds) in EEP",
                    endpoint_description: "All bleeds comprises both treated and non-treated bleeds. ABR = Number of bleeding episodes during the calculation period / total number of days * 365.25.",
                    mapping_rationale: "Annualized bleeding rate is the definitive clinical measure of hemophilia severity. The primary endpoint demonstrates that gene therapy reduces abnormal bleeding by enabling endogenous FVIII production.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03370913" }
                ]
            },
            {
                hpo_id: "HP:0003324",
                hpo_label: "Generalized muscle weakness",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03370913",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change From Baseline in FVIII Activity at Week 104",
                    endpoint_description: "Change from baseline in FVIII activity, as measured by chromogenic substrate assay, at Weeks 104 post-BMN 270 infusion. Baseline value imputed as 1 IU/dL for each subject.",
                    mapping_rationale: "Factor VIII deficiency is the direct cause of hemophilia A. Measuring FVIII activity at 2 years demonstrates durable correction of the reduced factor VIII activity phenotype through sustained transgene expression.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03370913" }
                ]
            },
            {
                hpo_id: "HP:0001928",
                hpo_label: "Abnormal coagulation",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03370913",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change From Baseline in Annualized FVIII Utilization in EEP",
                    endpoint_description: "Change from baseline in the annualized utilization (IU/kg/year) of exogenous FVIII replacement therapy.",
                    mapping_rationale: "Reduction in exogenous FVIII utilization demonstrates that the coagulation system is functioning more normally. Patients no longer require as much replacement factor because their coagulation cascade is restored by endogenous FVIII production.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03370913" }
                ]
            }
        ],
    },
    // =====================
    // Immunology
    // =====================
    {
        id: 16,
        brand_name: "Strimvelis",
        gene_symbol: "ADA",
        disease_name: "ADA-SCID",
        indication: "Treatment of severe combined immunodeficiency due to adenosine deaminase deficiency",
        modality: "Retrovirus (ex vivo)",
        therapy_type: "Ex vivo gene therapy",
        company: "Orchard Therapeutics / Fondazione Telethon",
        approval_year: 2016,
        approval_agency: "EMA",
        hpo_ids: ["HP:0005387", "HP:0002719", "HP:0004430"],
        category: "Immunology",
        delivery_route: "HSCT (ex vivo)",
        one_time: true,
        target_cell_type: "Hematopoietic stem cells (CD34+)",
        target_cell_source: "mechanism",
        note: "First ex vivo gene therapy approved in EU",
        pivotal_trials: [
            { nct_id: "NCT00598481", trial_name: "ADA Gene Transfer", phase: "Phase 2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0005387",
                hpo_label: "Combined immunodeficiency",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT00598481",
                    endpoint_type: "primary",
                    endpoint_measure: "Survival",
                    endpoint_description: "From post-treatment to up to 3 years",
                    mapping_rationale: "ADA-SCID is a form of combined immunodeficiency where lack of adenosine deaminase leads to accumulation of toxic metabolites that destroy lymphocytes. Survival is the ultimate measure of immune reconstitution - untreated ADA-SCID patients typically die within the first year from opportunistic infections. 3-year survival demonstrates successful restoration of immune function.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00598481" }
                ]
            },
            {
                hpo_id: "HP:0002719",
                hpo_label: "Recurrent infections",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT00598481",
                    endpoint_type: "secondary",
                    endpoint_measure: "Rate of Severe Infections",
                    endpoint_description: "Severe infections were defined as those that required hospitalization or those that prolonged hospitalization. The rate of infection was estimated as number of severe infections over person-years of observation before and after treatment administration.",
                    mapping_rationale: "The secondary endpoint directly measures severe infection rate, which is the clinical manifestation of recurrent infections in immunodeficient patients. ADA-SCID patients experience frequent severe infections due to absent T, B, and NK cell function. Reduction in severe infections demonstrates restoration of protective immunity.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00598481" }
                ]
            },
            {
                hpo_id: "HP:0004430",
                hpo_label: "Severe combined immunodeficiency",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT00598481",
                    endpoint_type: "secondary",
                    endpoint_measure: "CD3+ Cell Counts",
                    endpoint_description: "T-lymphocyte counts (CD3+): mean T-lymphocyte at Baseline and 3 years post gene therapy. Samples were taken from peripheral venous whole blood and tested by cytofluorometry.",
                    mapping_rationale: "CD3+ T-cell counts are a biomarker for SCID severity. ADA-SCID patients have severely reduced or absent T-cells. The endpoint measures T-cell reconstitution, which is the primary immunological defect in SCID. Normal CD3+ counts indicate successful correction of the severe combined immunodeficiency phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00598481" }
                ]
            }
        ],
    },

    // =====================
    // Dermatology
    // =====================
    {
        id: 17,
        brand_name: "Vyjuvek",
        gene_symbol: "COL7A1",
        disease_name: "Dystrophic Epidermolysis Bullosa (DEB)",
        indication: "Treatment of wounds in patients with dystrophic epidermolysis bullosa",
        modality: "HSV-1 (topical)",
        therapy_type: "In vivo gene therapy",
        company: "Krystal Biotech",
        approval_year: 2023,
        approval_agency: "FDA",
        hpo_ids: ["HP:0200041", "HP:0008066", "HP:0012531"],
        category: "Dermatology",
        delivery_route: "Topical",
        one_time: false,
        target_cell_type: "Keratinocytes",
        target_cell_source: "mechanism",
        note: "First topical gene therapy; redosing required",
        pivotal_trials: [
            { nct_id: "NCT03536143", trial_name: "GEM-3", phase: "Phase 1/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0200041",
                hpo_label: "Skin erosion",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03536143",
                    endpoint_type: "primary",
                    endpoint_measure: "Complete Wound Closure Responder",
                    endpoint_description: "One wound is a responder if the reduction from baseline in wound surface is >=90%.",
                    mapping_rationale: "Complete wound closure directly addresses skin erosion, the primary manifestation of DEB. Patients with DEB lack functional type VII collagen, leading to chronic skin erosions that fail to heal. Achievement of >=90% wound surface reduction demonstrates restoration of normal wound healing capacity.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03536143" }
                ]
            },
            {
                hpo_id: "HP:0008066",
                hpo_label: "Abnormal blistering of the skin",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03536143",
                    endpoint_type: "primary",
                    endpoint_measure: "Duration of Wound Closure",
                    endpoint_description: "Time from the complete closure to the first reopening of the same wound",
                    mapping_rationale: "Duration of wound closure measures resistance to re-blistering. DEB patients experience recurrent blistering due to lack of anchoring fibrils. Prolonged wound closure duration indicates restoration of structural integrity at the dermal-epidermal junction, reducing susceptibility to new blister formation.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03536143" }
                ]
            },
            {
                hpo_id: "HP:0012531",
                hpo_label: "Pain",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03536143",
                    endpoint_type: "primary",
                    endpoint_measure: "Time to Wound Closure Analysis",
                    endpoint_description: "Time from the first treatment to Complete Wound Closure (>=90% reduction in wound surface area from baseline)",
                    mapping_rationale: "Faster wound closure reduces duration of pain associated with open wounds in DEB. Chronic wounds are a significant source of pain in DEB patients. Reduced time to closure indicates faster relief from wound-associated pain.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03536143" }
                ]
            }
        ],
    },
    {
        id: 18,
        brand_name: "Zevaskyn",
        gene_symbol: "COL7A1",
        disease_name: "Dystrophic Epidermolysis Bullosa (DEB)",
        indication: "Treatment of dystrophic epidermolysis bullosa",
        modality: "Autologous gene-corrected keratinocytes",
        therapy_type: "Ex vivo gene therapy",
        company: "Abeona Therapeutics",
        approval_year: 2025,
        approval_agency: "FDA",
        hpo_ids: ["HP:0200041", "HP:0008066", "HP:0012531"],
        category: "Dermatology",
        delivery_route: "Topical (cell sheet)",
        one_time: true,
        target_cell_type: "Keratinocytes (autologous corrected)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT04227106", trial_name: "VIITAL", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0200041",
                hpo_label: "Skin erosion",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT04227106",
                    endpoint_type: "primary",
                    endpoint_measure: "Wound Healing",
                    endpoint_description: "Proportion of RDEB wound sites with >=50% healing from Baseline in treated versus untreated wounds",
                    mapping_rationale: "The primary endpoint directly measures wound healing, which addresses the chronic skin erosions characteristic of DEB. Recessive dystrophic EB patients have impaired wound healing due to lack of type VII collagen. Achieving >=50% healing demonstrates functional restoration of wound closure capacity.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04227106" }
                ]
            },
            {
                hpo_id: "HP:0012531",
                hpo_label: "Pain",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT04227106",
                    endpoint_type: "primary",
                    endpoint_measure: "Pain Reduction",
                    endpoint_description: "Associated with wound dressing change assessed by the mean differences in scores of the Wong-Baker FACES scale between treated and untreated wounds",
                    mapping_rationale: "Pain during dressing changes is a significant morbidity in DEB patients. The trial used the Wong-Baker FACES pain scale as a co-primary endpoint, directly measuring pain reduction. This is a validated patient-reported outcome that captures the pain phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04227106" }
                ]
            },
            {
                hpo_id: "HP:0008066",
                hpo_label: "Abnormal blistering of the skin",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT04227106",
                    endpoint_type: "primary",
                    endpoint_measure: "Wound Healing",
                    endpoint_description: "Proportion of RDEB wound sites with >=50% healing from Baseline in treated versus untreated wounds",
                    mapping_rationale: "Wound healing in RDEB indirectly addresses the blistering phenotype. By restoring type VII collagen expression in keratinocytes, the therapy strengthens the dermal-epidermal junction, reducing the fragility that causes blistering. Healed wounds with restored collagen are more resistant to new blister formation.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04227106" }
                ]
            }
        ],
    },

    // =====================
    // Urology/Oncology
    // =====================
    {
        id: 19,
        brand_name: "Adstiladrin",
        gene_symbol: "IFN-alpha",
        disease_name: "Non-muscle invasive Bladder Cancer (NMIBC)",
        indication: "Treatment of BCG-unresponsive non-muscle invasive bladder cancer with carcinoma in situ",
        modality: "Adenovirus",
        therapy_type: "In vivo gene therapy",
        company: "Ferring Pharmaceuticals",
        approval_year: 2022,
        approval_agency: "FDA",
        hpo_ids: ["HP:0002862"],
        category: "Oncology",
        delivery_route: "Intravesical",
        one_time: false,
        target_cell_type: "Bladder urothelium",
        target_cell_source: "mechanism",
        // Evidence-based HPO mappings from pivotal trial
        pivotal_trials: [
            { nct_id: "NCT02773849", trial_name: "BOND-003", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002862",
                hpo_label: "Bladder carcinoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02773849",
                    endpoint_type: "primary",
                    endpoint_measure: "Complete Response Rate in Patients With Carcinoma in Situ (CIS)",
                    endpoint_description: "A patient in the CIS cohort was judged to have achieved CR where urine cytology was reported as normal, atypical, degenerative, reactive, inflammatory, or nonspecific AND cystoscopy was reported as normal or with findings that did not include evidence of low-grade or high-grade recurrence. Bladder biopsy, if performed, demonstrated an absence of low-grade or high-grade recurrence.",
                    mapping_rationale: "The primary endpoint directly measures complete response of bladder carcinoma (HP:0002862). Complete response requires absence of tumor on cytology, cystoscopy, and biopsy - directly addressing the bladder cancer phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02773849" },
                    { type: "fda_label", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/761217s000lbl.pdf" }
                ]
            },
            {
                hpo_id: "HP:0002862",
                hpo_label: "Bladder carcinoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02773849",
                    endpoint_type: "secondary",
                    endpoint_measure: "Durability of Complete Response",
                    endpoint_description: "Durability of complete response (CR) was defined as the time from first observed CR to the documented treatment failure. Treatment failure was defined as high-grade disease recurrence, disease progression, or death, whichever occurred earlier.",
                    mapping_rationale: "Durability of response measures sustained absence of bladder carcinoma over time, providing evidence that the treatment effect on the bladder cancer phenotype is maintained.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02773849" }
                ]
            },
            {
                hpo_id: "HP:0002862",
                hpo_label: "Bladder carcinoma",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT02773849",
                    endpoint_type: "secondary",
                    endpoint_measure: "Incidence of Cystectomy",
                    endpoint_description: "The incidence of cystectomy is described as the proportion of patients undergoing radical cystectomy for any reason after the first dose, within 12 months, 2 years and 5 years.",
                    mapping_rationale: "Cystectomy (bladder removal) is a clinically meaningful endpoint reflecting disease severity. Avoidance of cystectomy indicates successful control of bladder carcinoma without need for surgical organ removal.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02773849" }
                ]
            }
        ],
    },
    {
        id: 20,
        brand_name: "Imlygic",
        gene_symbol: "GM-CSF",
        disease_name: "Melanoma",
        indication: "Treatment of unresectable cutaneous, subcutaneous, and nodal lesions in patients with melanoma",
        modality: "Oncolytic HSV-1",
        therapy_type: "In vivo gene therapy",
        company: "Amgen",
        approval_year: 2015,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0002861"],
        category: "Oncology",
        delivery_route: "Intralesional",
        one_time: false,
        target_cell_type: "Tumor cells (melanoma)",
        target_cell_source: "mechanism",
        note: "First oncolytic virus therapy approved",
        // Evidence-based HPO mappings from pivotal trial
        pivotal_trials: [
            { nct_id: "NCT00769704", trial_name: "OPTiM", phase: "Phase 3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002861",
                hpo_label: "Melanoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT00769704",
                    endpoint_type: "primary",
                    endpoint_measure: "Durable Response Rate",
                    endpoint_description: "Durable response rate was defined as the percentage of participants with a complete response (CR) or partial response (PR) maintained continuously for at least 6 months from the time the objective response was first observed and initiating within 12 months of starting therapy. CR: Disappearance of all clinical evidence of tumor; PR: >= 50% reduction in the sum of the products of the perpendicular diameters of all measurable tumors.",
                    mapping_rationale: "The primary endpoint directly measures durable tumor response in melanoma patients. Complete or partial response indicates reduction or elimination of melanoma lesions, directly addressing the melanoma phenotype (HP:0002861).",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00769704" },
                    { type: "fda_label", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2015/125518lbl.pdf" }
                ]
            },
            {
                hpo_id: "HP:0002861",
                hpo_label: "Melanoma",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT00769704",
                    endpoint_type: "secondary",
                    endpoint_measure: "Overall Survival",
                    endpoint_description: "Overall survival was defined as the time from the date of randomization to the date of death from any cause. Overall survival time was censored at the last date the patient was known to be alive when the confirmation of death was absent or unknown.",
                    mapping_rationale: "Overall survival in melanoma patients measures the ultimate clinical outcome of melanoma treatment. While not specific to the phenotype, survival is the most clinically meaningful endpoint for melanoma therapy efficacy.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00769704" }
                ]
            },
            {
                hpo_id: "HP:0002861",
                hpo_label: "Melanoma",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT00769704",
                    endpoint_type: "secondary",
                    endpoint_measure: "Objective Response Rate",
                    endpoint_description: "Objective response rate was defined as the percentage of participants with a best overall response of complete response (CR) or partial response (PR). Disease assessments were performed in accordance with modified World Health Organization criteria.",
                    mapping_rationale: "Objective response rate measures tumor shrinkage or disappearance in melanoma patients, directly assessing the impact of treatment on the melanoma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT00769704" }
                ]
            }
        ],
    },
    {
        id: 21,
        brand_name: "Papzimeos",
        gene_symbol: "IL-12",
        disease_name: "Recurrent Respiratory Papillomatosis (RRP)",
        indication: "Treatment of recurrent respiratory papillomatosis",
        modality: "Adenovirus",
        therapy_type: "In vivo gene therapy",
        company: "Precigen",
        approval_year: 2025,
        approval_agency: "FDA",
        hpo_ids: ["HP:0030680", "HP:0002094", "HP:0002015"],
        category: "Oncology",
        delivery_route: "Intralesional",
        one_time: false,
        target_cell_type: "Respiratory epithelium / Papilloma cells",
        target_cell_source: "mechanism",
        note: "First gene therapy from non-profit",
        // Evidence-based HPO mappings from pivotal trial
        pivotal_trials: [
            { nct_id: "NCT04724980", trial_name: "PRGN-2012 Phase 1/2", phase: "Phase 1/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0030680",
                hpo_label: "Papilloma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT04724980",
                    endpoint_type: "primary",
                    endpoint_measure: "Complete Response Rate",
                    endpoint_description: "A complete response is defined as no requirement for surgical intervention in the 12 months after treatment. The trial measured percentage of subjects with a complete response following treatment with PRGN-2012.",
                    mapping_rationale: "The primary endpoint measures complete response defined by elimination of need for papilloma removal surgery. RRP is characterized by recurrent papillomas in the respiratory tract requiring repeated surgical removal. No surgical intervention indicates resolution of papilloma growth (HP:0030680).",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04724980" },
                    { type: "press_release", url: "https://investors.precigen.com/news-releases/news-release-details/precigen-announces-groundbreaking-pivotal-study-data-prgn-2012" }
                ]
            },
            {
                hpo_id: "HP:0030680",
                hpo_label: "Papilloma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT04724980",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change in RRP Staging Assessment Scores (Derkay Score)",
                    endpoint_description: "Absolute and percentage change from baseline in Derkay score over time following initiation of PRGN-2012 treatment.",
                    mapping_rationale: "The Derkay score is the standard clinical staging system for RRP that quantifies papilloma burden by anatomic site. Reduction in Derkay score indicates decreased papilloma burden, directly measuring improvement in the papilloma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04724980" }
                ]
            },
            {
                hpo_id: "HP:0002015",
                hpo_label: "Dysphagia",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT04724980",
                    endpoint_type: "secondary",
                    endpoint_measure: "Change in Vocal Function Scores (VHI-10)",
                    endpoint_description: "Absolute and percentage change from baseline in VHI-10 (Voice Handicap Index-10) score over time following initiation of PRGN-2012 treatment.",
                    mapping_rationale: "RRP papillomas in the larynx and upper airway can cause voice and swallowing difficulties. The VHI-10 measures voice-related quality of life which correlates with pharyngeal/laryngeal function. Improvement indicates reduced impact on swallowing and voice function.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04724980" }
                ]
            },
            {
                hpo_id: "HP:0002094",
                hpo_label: "Dyspnea",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT04724980",
                    endpoint_type: "secondary",
                    endpoint_measure: "Rate of Pulmonary RRP Response",
                    endpoint_description: "The fraction of participants with a pulmonary RRP partial or complete response will be reported in all treated pulmonary participants.",
                    mapping_rationale: "Pulmonary RRP causes papillomas in the lower respiratory tract leading to breathing difficulties (dyspnea). Pulmonary response indicates reduction of papilloma burden in the lungs, addressing respiratory obstruction and dyspnea symptoms.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04724980" }
                ]
            }
        ],
    },

    // =====================
    // Metabolic
    // =====================
    {
        id: 22,
        brand_name: "Glybera",
        gene_symbol: "LPL",
        disease_name: "Lipoprotein Lipase Deficiency (LPLD)",
        indication: "Treatment of familial lipoprotein lipase deficiency",
        modality: "AAV1",
        therapy_type: "In vivo gene therapy",
        company: "uniQure",
        approval_year: 2012,
        approval_agency: "EMA (withdrawn 2017)",
        hpo_ids: ["HP:0002155", "HP:0003077", "HP:0001081"],
        category: "Metabolic",
        delivery_route: "IM",
        one_time: true,
        target_cell_type: "Skeletal muscle",
        target_cell_source: "aav_tropism",
        note: "First gene therapy approved in West; withdrawn due to commercial failure",
        pivotal_trials: [
            { nct_id: "NCT01109498", trial_name: "AMT-011 LPLD", phase: "Phase 2/3" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0002155",
                hpo_label: "Hypertriglyceridemia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01109498",
                    endpoint_type: "primary",
                    endpoint_measure: "Reduction of fasting triglyceride (TG) concentrations",
                    endpoint_description: "To achieve a reduction in fasting plasma TG such that the difference in median plasma TG observed before administration and up to 12 weeks after administration represents approximately 40% reduction, on top of a low-fat diet.",
                    mapping_rationale: "The primary endpoint directly measures fasting triglyceride levels, which is the defining biochemical abnormality of LPLD. Lipoprotein lipase deficiency causes severe hypertriglyceridemia due to inability to clear triglyceride-rich lipoproteins. A 40% reduction in TG demonstrates restoration of lipase activity.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01109498" }
                ]
            },
            {
                hpo_id: "HP:0003077",
                hpo_label: "Hyperlipidemia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT01109498",
                    endpoint_type: "secondary",
                    endpoint_measure: "Sustained reduction of TG concentrations",
                    endpoint_description: "To achieve sustained efficacy, defined as approximately 40% reduction in fasting plasma TG up to 26 weeks after administration, on top of a low-fat diet.",
                    mapping_rationale: "Sustained TG reduction at 26 weeks demonstrates durable correction of hyperlipidemia. LPLD patients have lifelong severe hyperlipidemia that increases pancreatitis risk. Sustained reduction indicates long-term normalization of lipid metabolism.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01109498" }
                ]
            },
            {
                hpo_id: "HP:0001081",
                hpo_label: "Chylomicronemia",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT01109498",
                    endpoint_type: "secondary",
                    endpoint_measure: "Biological activity and expression of the transgene product",
                    endpoint_description: "To determine the biological activity and expression of the lipoprotein lipase (LPLS447X) transgene product.",
                    mapping_rationale: "LPLD causes chylomicronemia due to defective clearance of chylomicrons. The transgene encodes a gain-of-function LPL variant (S447X) that enhances chylomicron clearance. Detection of biological activity indicates restoration of chylomicron catabolism, addressing the underlying cause of chylomicronemia.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT01109498" }
                ]
            }
        ],
    },

    // =====================
    // CAR-T Therapies (all involve genetic modification)
    // =====================
    {
        id: 23,
        brand_name: "Kymriah",
        gene_symbol: "CD19-CAR",
        disease_name: "B-cell ALL / Large B-cell Lymphoma",
        indication: "Treatment of relapsed/refractory B-cell precursor ALL and DLBCL",
        modality: "Lentivirus CAR-T (ex vivo)",
        therapy_type: "CAR-T",
        company: "Novartis",
        approval_year: 2017,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0001909", "HP:0012539"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting CD19+ B cells)",
        target_cell_source: "mechanism",
        note: "First CAR-T therapy approved",
        pivotal_trials: [
            { nct_id: "NCT02435849", trial_name: "ELIANA", phase: "Phase 2" },
            { nct_id: "NCT02445248", trial_name: "JULIET", phase: "Phase 2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0001909",
                hpo_label: "Leukemia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02435849",
                    endpoint_type: "primary",
                    endpoint_measure: "Overall Remission Rate (ORR)",
                    endpoint_description: "Evaluating the efficacy of tisagenlecleucel therapy as measured by overall remission rate including complete response (CR) and CR with incomplete blood count recovery (CRi) during the 3 months after administration. CR defined as bone marrow <5% blasts, neutrophils >1.0 x 10^9/L, platelets >100 x 10^9/L.",
                    mapping_rationale: "The overall remission rate directly measures eradication of leukemic blasts in the bone marrow. Complete response indicates elimination of the leukemia phenotype, with restoration of normal hematopoiesis. This endpoint directly addresses the HP:0001909 Leukemia phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02435849" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/kymriah-tisagenlecleucel" }
                ]
            },
            {
                hpo_id: "HP:0012539",
                hpo_label: "Non-Hodgkin lymphoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02445248",
                    endpoint_type: "primary",
                    endpoint_measure: "Overall Response Rate (ORR) Per Independent Review Committee",
                    endpoint_description: "ORR includes complete response (CR) and partial response (PR) as determined by IRC assessment. Best overall disease response from CTL019 infusion until progressive disease or start of new anticancer therapy. Response assessed according to Cheson Response criteria and Lugano Classification (2014).",
                    mapping_rationale: "The overall response rate measures tumor response in diffuse large B-cell lymphoma (DLBCL), a type of non-Hodgkin lymphoma. Complete and partial responses indicate reduction or elimination of lymphoma burden, directly addressing the HP:0012539 Non-Hodgkin lymphoma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02445248" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/kymriah-tisagenlecleucel" }
                ]
            }
        ],
    },
    {
        id: 24,
        brand_name: "Yescarta",
        gene_symbol: "CD19-CAR",
        disease_name: "Large B-cell Lymphoma",
        indication: "Treatment of relapsed or refractory large B-cell lymphoma",
        modality: "Retrovirus CAR-T (ex vivo)",
        therapy_type: "CAR-T",
        company: "Kite/Gilead",
        approval_year: 2017,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0012539"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting CD19+ B cells)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT02348216", trial_name: "ZUMA-1", phase: "Phase 1/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0012539",
                hpo_label: "Non-Hodgkin lymphoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02348216",
                    endpoint_type: "primary",
                    endpoint_measure: "Overall Response Rate (ORR) Per Revised IWG Response Criteria",
                    endpoint_description: "ORR was defined as the percentage of participants achieving either a complete response (CR) or a partial response (PR), as assessed by the study investigators using revised IWG Response Criteria for Malignant Lymphoma (Cheson et al, 2007). CR requires complete disappearance of all detectable clinical evidence of disease.",
                    mapping_rationale: "The overall response rate directly measures tumor response in aggressive non-Hodgkin lymphoma (DLBCL, PMBCL, TFL). Complete response indicates elimination of lymphoma, and partial response indicates significant reduction. This endpoint directly addresses the HP:0012539 Non-Hodgkin lymphoma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02348216" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/yescarta-axicabtagene-ciloleucel" }
                ]
            }
        ],
    },
    {
        id: 25,
        brand_name: "Tecartus",
        gene_symbol: "CD19-CAR",
        disease_name: "Mantle Cell Lymphoma / B-cell ALL",
        indication: "Treatment of relapsed or refractory mantle cell lymphoma and B-cell ALL",
        modality: "Retrovirus CAR-T (ex vivo)",
        therapy_type: "CAR-T",
        company: "Kite/Gilead",
        approval_year: 2020,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0012539"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting CD19+ B cells)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT02601313", trial_name: "ZUMA-2", phase: "Phase 2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0012539",
                hpo_label: "Non-Hodgkin lymphoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02601313",
                    endpoint_type: "primary",
                    endpoint_measure: "Objective Response (OR) Per Lugano Classification",
                    endpoint_description: "Objective response includes complete metabolic response (CMR), complete radiological response (CRR), partial metabolic response (PMR), and partial radiological response (PRR) according to the Lugano Classification as assessed by Independent Radiology Review Committee (IRRC).",
                    mapping_rationale: "The objective response rate measures tumor response in mantle cell lymphoma, a type of non-Hodgkin lymphoma. Complete and partial responses by PET-CT imaging demonstrate reduction or elimination of lymphoma, directly addressing the HP:0012539 Non-Hodgkin lymphoma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02601313" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/tecartus-brexucabtagene-autoleucel" }
                ]
            }
        ],
    },
    {
        id: 26,
        brand_name: "Breyanzi",
        gene_symbol: "CD19-CAR",
        disease_name: "Large B-cell Lymphoma",
        indication: "Treatment of relapsed or refractory large B-cell lymphoma",
        modality: "Lentivirus CAR-T (ex vivo)",
        therapy_type: "CAR-T",
        company: "Bristol Myers Squibb",
        approval_year: 2021,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0012539"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting CD19+ B cells)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT02631044", trial_name: "TRANSCEND-NHL-001", phase: "Phase 1" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0012539",
                hpo_label: "Non-Hodgkin lymphoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02631044",
                    endpoint_type: "primary",
                    endpoint_measure: "Objective Response Rate (ORR)",
                    endpoint_description: "ORR assessed using Lugano criteria, measuring complete response (CR) and partial response (PR) rates in relapsed/refractory B-cell non-Hodgkin lymphoma patients.",
                    mapping_rationale: "The objective response rate measures tumor response in large B-cell lymphoma, a type of non-Hodgkin lymphoma. Complete and partial responses demonstrate effective targeting and elimination of malignant B-cells, directly addressing the HP:0012539 Non-Hodgkin lymphoma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02631044" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/breyanzi-lisocabtagene-maraleucel" }
                ]
            }
        ],
    },
    {
        id: 27,
        brand_name: "Abecma",
        gene_symbol: "BCMA-CAR",
        disease_name: "Multiple Myeloma",
        indication: "Treatment of relapsed or refractory multiple myeloma",
        modality: "Lentivirus CAR-T (ex vivo)",
        therapy_type: "CAR-T",
        company: "Bristol Myers Squibb",
        approval_year: 2021,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0006775", "HP:0012531"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting BCMA+ myeloma cells)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT03361748", trial_name: "KarMMa", phase: "Phase 2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0006775",
                hpo_label: "Multiple myeloma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03361748",
                    endpoint_type: "primary",
                    endpoint_measure: "Overall Response Rate (ORR)",
                    endpoint_description: "Number of participants who achieved partial response (PR) or better according to IMWG Uniform Response Criteria for Multiple Myeloma as assessed by an independent response committee (IRC).",
                    mapping_rationale: "The overall response rate measures myeloma response including reduction in M-protein, serum free light chains, and bone marrow plasma cells. Complete and partial responses demonstrate effective targeting of BCMA-expressing myeloma cells, directly addressing the HP:0006775 Multiple myeloma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03361748" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/abecma-idecabtagene-vicleucel" }
                ]
            },
            {
                hpo_id: "HP:0012531",
                hpo_label: "Pain",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03361748",
                    endpoint_type: "secondary",
                    endpoint_measure: "Mean Change From Baseline on EORTC QLQ-C30 Pain",
                    endpoint_description: "Mean change from baseline on the European Organization for Research and Treatment of Cancer Quality of Life Questionnaire (EORTC QLQ-C30) Pain subscale. A high score for a symptom scale represents a high level of symptomatic problem.",
                    mapping_rationale: "Bone pain is a common symptom in multiple myeloma due to osteolytic lesions. The EORTC QLQ-C30 Pain subscale directly measures this symptom. Reduction in pain scores indicates improvement in the HP:0012531 Pain phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03361748" }
                ]
            }
        ],
    },
    {
        id: 28,
        brand_name: "Carvykti",
        gene_symbol: "BCMA-CAR",
        disease_name: "Multiple Myeloma",
        indication: "Treatment of relapsed or refractory multiple myeloma",
        modality: "Lentivirus CAR-T (ex vivo)",
        therapy_type: "CAR-T",
        company: "Janssen/Legend Biotech",
        approval_year: 2022,
        approval_agency: "FDA, EMA",
        hpo_ids: ["HP:0006775", "HP:0012531"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting BCMA+ myeloma cells)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT03548207", trial_name: "CARTITUDE-1", phase: "Phase 1b/2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0006775",
                hpo_label: "Multiple myeloma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT03548207",
                    endpoint_type: "primary",
                    endpoint_measure: "Overall Response Rate (ORR)",
                    endpoint_description: "ORR was defined as the percentage of participants who achieved partial response (PR) or better according to international myeloma working group (IMWG) criteria. IMWG criteria for PR requires >=50% reduction of serum M-protein and reduction in 24-hour urinary M-protein by >=90% or to <200 mg/24 hours.",
                    mapping_rationale: "The overall response rate measures myeloma response by IMWG criteria, including reduction in M-protein, free light chains, and bone marrow plasma cells. High response rates demonstrate effective elimination of BCMA-expressing myeloma cells, directly addressing the HP:0006775 Multiple myeloma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03548207" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/carvykti" }
                ]
            },
            {
                hpo_id: "HP:0012531",
                hpo_label: "Pain",
                confidence: "medium",
                evidence: {
                    trial_nct_id: "NCT03548207",
                    endpoint_type: "secondary",
                    endpoint_measure: "Patient Global Impression of Severity (PGIS) Score",
                    endpoint_description: "PGIS was a single item to assess severity of pain on a 5-point verbal rating scale ranged from 1 (no pain) to 5 (very severe pain). A higher score indicates more severe pain.",
                    mapping_rationale: "Multiple myeloma commonly causes bone pain due to osteolytic lesions. The PGIS directly measures patient-reported pain severity. Reduction in PGIS scores indicates improvement in the HP:0012531 Pain phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT03548207" }
                ]
            }
        ],
    },
    {
        id: 29,
        brand_name: "Aucatzyl",
        gene_symbol: "CD19-CAR",
        disease_name: "B-cell ALL",
        indication: "Treatment of relapsed or refractory B-cell precursor acute lymphoblastic leukemia",
        modality: "Retrovirus CAR-T (ex vivo)",
        therapy_type: "CAR-T",
        company: "Autolus",
        approval_year: 2024,
        approval_agency: "FDA",
        hpo_ids: ["HP:0001909"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting CD19+ B cells)",
        target_cell_source: "mechanism",
        pivotal_trials: [
            { nct_id: "NCT02935257", trial_name: "ALLCAR19", phase: "Phase 1" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0001909",
                hpo_label: "Leukemia",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT02935257",
                    endpoint_type: "primary",
                    endpoint_measure: "Toxicity and Feasibility of CD19CAR T-cell Administration",
                    endpoint_description: "Toxicity following CD19CAR T-cell administration as evaluated by the incidence of grade 3-5 toxicity causally related to the ATIMP. Feasibility of manufacturing CD19CAR T-cells evaluated by the number of therapeutic products generated.",
                    mapping_rationale: "While the primary endpoint focused on safety and feasibility, the trial was designed for relapsed/refractory B-cell ALL patients. Response assessments measuring complete remission rates directly address the HP:0001909 Leukemia phenotype by demonstrating elimination of leukemic blasts.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT02935257" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/aucatzyl-obecabtagene-autoleucel" }
                ]
            }
        ],
    },

    // =====================
    // TCR-T Therapies
    // =====================
    {
        id: 30,
        brand_name: "Tecelra",
        gene_symbol: "MAGE-A4 TCR",
        disease_name: "Synovial Sarcoma",
        indication: "Treatment of HLA-A*02:01-positive adults with unresectable or metastatic synovial sarcoma",
        modality: "Lentivirus TCR-T (ex vivo)",
        therapy_type: "TCR-T",
        company: "Adaptimmune",
        approval_year: 2024,
        approval_agency: "FDA",
        hpo_ids: ["HP:0100242"],
        category: "Oncology",
        delivery_route: "IV (autologous)",
        one_time: false,
        target_cell_type: "Patient T cells (targeting MAGE-A4+ tumor cells)",
        target_cell_source: "mechanism",
        note: "First TCR-T therapy approved",
        pivotal_trials: [
            { nct_id: "NCT04044768", trial_name: "SPEARHEAD-1", phase: "Phase 2" }
        ],
        hpo_evidence: [
            {
                hpo_id: "HP:0100242",
                hpo_label: "Sarcoma",
                confidence: "high",
                evidence: {
                    trial_nct_id: "NCT04044768",
                    endpoint_type: "primary",
                    endpoint_measure: "Overall Response Rate (ORR)",
                    endpoint_description: "Percentage of participants with confirmed tumor response (complete [CR] or partial [PR] response) to treatment as assessed using Response Evaluation Criteria in Solid Tumors (RECIST) v1.1 by Independent Radiologist review.",
                    mapping_rationale: "The overall response rate measures tumor shrinkage in synovial sarcoma patients using RECIST criteria. Complete and partial responses demonstrate effective targeting of MAGE-A4-expressing sarcoma cells by the engineered TCR-T cells, directly addressing the HP:0100242 Sarcoma phenotype.",
                    mapped_by: "claude",
                    mapping_date: "2026-01-24"
                },
                sources: [
                    { type: "clinicaltrials", url: "https://clinicaltrials.gov/study/NCT04044768" },
                    { type: "fda_label", url: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products/tecelra-afamitresgene-autoleucel" }
                ]
            }
        ],
    },
];

// Helper functions
export const getUniqueCategories = () => {
    return [...new Set(approvedGeneTherapies.map(t => t.category))].sort();
};

export const getUniqueModalities = () => {
    return [...new Set(approvedGeneTherapies.map(t => t.modality))].sort();
};

export const getUniqueTherapyTypes = () => {
    return [...new Set(approvedGeneTherapies.map(t => t.therapy_type))].sort();
};

export const getUniqueCompanies = () => {
    return [...new Set(approvedGeneTherapies.map(t => t.company))].sort();
};

export const getCNSTherapies = () => {
    return approvedGeneTherapies.filter(t =>
        t.category === "CNS" ||
        t.category === "CNS/Lysosomal" ||
        t.category === "Neuromuscular"
    );
};

export const getAAVTherapies = () => {
    return approvedGeneTherapies.filter(t => t.modality.startsWith("AAV"));
};

export const getInVivoTherapies = () => {
    return approvedGeneTherapies.filter(t => t.therapy_type === "In vivo gene therapy");
};

export const getExVivoTherapies = () => {
    return approvedGeneTherapies.filter(t =>
        t.therapy_type === "Ex vivo gene therapy" ||
        t.therapy_type === "Gene-edited cells"
    );
};

export const getCARTTherapies = () => {
    return approvedGeneTherapies.filter(t => t.therapy_type === "CAR-T");
};

// =====================
// Cell Type Prediction Validation
// =====================

// Import cell type predictions from MSTExplorer
import hpoCellTypePredictions from "./hpoCellTypePredictions.json";

// Cell type mapping for EXACT matches only (actual target -> equivalent MSTExplorer names)
// These must be genuinely the same cell type, just with different naming conventions
const cellTypeExactMatches = {
    // Retinal - these are true equivalents
    "retinal cells": ["photoreceptor_cells", "retinal_pigment_cells", "retinal_progenitors_and_muller_glia", "bipolar_cells", "amacrine_cells"],
    "retinal pigment epithelium": ["retinal_pigment_cells"],
    "rpe and photoreceptors": ["retinal_pigment_cells", "photoreceptor_cells"],
    "photoreceptors": ["photoreceptor_cells"],

    // Muscle - true equivalents
    "skeletal muscle": ["skeletal_muscle_cells", "satellite_cells", "adult_fetal_skeletal_muscle_cell"],
    "skeletal muscle cells": ["skeletal_muscle_cells", "satellite_cells"],

    // Blood/Hematopoietic - true equivalents
    "hematopoietic stem cells": ["hematopoietic_stem_cells", "adult_cb_cd34+"],
    "hematopoietic stem cells (cd34+)": ["hematopoietic_stem_cells", "adult_cb_cd34+"],
    "erythroid progenitors": ["erythroblasts", "adult_erythroid_cell", "fetus_erythroid_cell"],
    "t cells": ["thymocytes", "adult_t_cell"],
    "patient t cells": ["thymocytes", "adult_t_cell", "lymphoid_cells"],

    // Liver - true equivalents
    "hepatocytes": ["afp_alb_positive_cells", "hepatoblasts", "fetus_hepatocyte_endodermal_cell"],

    // Glia - true equivalents
    "oligodendrocytes": ["oligodendrocytes", "adult_oligodendrocyte"],
    "microglia": ["microglia"],

    // Neurons - only exact neuron types
    "neurons": ["excitatory_neurons", "inhibitory_neurons"],
    "excitatory neurons": ["excitatory_neurons"],
    "dopaminergic neurons": ["excitatory_neurons", "limbic_system_neurons"],  // Dopaminergic are a subset of excitatory
    "dopaminergic neurons (putamen)": ["excitatory_neurons", "limbic_system_neurons"],
};

// Cell type categories for "related" matches (same tissue system, different cell type)
const cellTypeCategories = {
    cns_neurons: ["excitatory_neurons", "inhibitory_neurons", "limbic_system_neurons", "granule_neurons",
                  "purkinje_neurons", "satb2_lrrc7_positive_cells", "motor neurons", "dopaminergic neurons"],
    cns_glia: ["oligodendrocytes", "adult_oligodendrocyte", "microglia", "astrocytes", "schwann_cells", "ens_glia"],
    retinal: ["photoreceptor_cells", "retinal_pigment_cells", "retinal_progenitors_and_muller_glia",
              "bipolar_cells", "amacrine_cells"],
    muscle: ["skeletal_muscle_cells", "satellite_cells", "cardiomyocytes", "adult_ventricle_cardiomyocyte",
             "adult_fetal_skeletal_muscle_cell", "fetus_fetal_skeletal_muscle_cell"],
    hematopoietic: ["hematopoietic_stem_cells", "adult_cb_cd34+", "erythroblasts", "adult_erythroid_cell",
                   "thymocytes", "lymphoid_cells", "adult_t_cell", "adult_b_cell", "megakaryocytes"],
    liver: ["afp_alb_positive_cells", "hepatoblasts", "fetus_hepatocyte_endodermal_cell", "hepatocytes"],
    immune: ["thymocytes", "lymphoid_cells", "antigen_presenting_cells", "adult_t_cell", "adult_b_cell",
             "myeloid_cells", "adult_mast_cell"],
};

/**
 * Determine match status between actual target cell type and MSTExplorer predictions
 *
 * Match categories:
 * - "exact": The predicted cell type IS the actual target (same cell type, different naming)
 * - "related": Both are in the same tissue/system category (e.g., both CNS neurons)
 * - "mismatch": Prediction is a different cell type than the actual target
 * - "unknown": Cannot determine (missing data)
 *
 * Note: "mismatch" doesn't mean the pipeline is wrong - it may correctly predict the
 * phenotype-expressing tissue while the therapy targets the causative cell type upstream.
 * E.g., Zolgensma targets motor neurons, but muscle weakness phenotype → skeletal muscle.
 *
 * @param {string} actualTarget - The actual target cell type from the therapy
 * @param {string[]} predictedCellTypes - Array of predicted cell types from MSTExplorer
 * @returns {Object} - { status: string, explanation: string }
 */
function determineMatchStatus(actualTarget, predictedCellTypes) {
    if (!actualTarget || !predictedCellTypes || predictedCellTypes.length === 0) {
        return "unknown";
    }

    const normalizedTarget = actualTarget.toLowerCase().trim();
    const normalizedPredictions = predictedCellTypes.map(p => p.toLowerCase());

    // 1. Check for EXACT match using the exact match mapping
    const exactVariants = cellTypeExactMatches[normalizedTarget] ||
                          cellTypeExactMatches[normalizedTarget.split("(")[0].trim()] ||
                          [];

    if (exactVariants.length > 0) {
        for (const variant of exactVariants) {
            if (normalizedPredictions.includes(variant)) {
                return "exact";
            }
        }
    }

    // 2. Check for direct string match (handles cases not in mapping)
    for (const pred of normalizedPredictions) {
        const predNormalized = pred.replace(/_/g, " ");
        if (normalizedTarget.includes(predNormalized) || predNormalized.includes(normalizedTarget)) {
            return "exact";
        }
    }

    // 3. Check for RELATED match (same tissue category)
    // Find which category the target belongs to
    let targetCategory = null;
    for (const [category, cellTypes] of Object.entries(cellTypeCategories)) {
        if (cellTypes.some(ct => normalizedTarget.includes(ct.replace(/_/g, " ")) ||
                                 ct.includes(normalizedTarget.split(" ")[0]))) {
            targetCategory = category;
            break;
        }
    }

    // Check if any prediction is in the same category
    if (targetCategory) {
        const categoryCellTypes = cellTypeCategories[targetCategory];
        for (const pred of normalizedPredictions) {
            if (categoryCellTypes.some(ct => pred.includes(ct) || ct.includes(pred.split("_")[0]))) {
                return "related";
            }
        }
    }

    // 4. Special case: Motor neurons targeting muscle phenotypes
    // This is a "mismatch" but biologically meaningful - the therapy targets the cause,
    // while the phenotype manifests in muscle
    if (normalizedTarget.includes("motor neuron") &&
        normalizedPredictions.some(p => p.includes("muscle") || p.includes("skeletal"))) {
        return "mismatch";  // Correctly identifies this as different cell types
    }

    return "mismatch";
}

/**
 * Get cell type predictions for a therapy based on its HPO phenotypes
 * @param {Object} therapy - Therapy object with hpo_evidence or hpo_ids
 * @returns {Object} - Prediction data including predicted cell types and match status
 */
export function getTherapyPredictions(therapy) {
    // Get HPO IDs from evidence or fallback to hpo_ids
    const hpoIds = therapy.hpo_evidence
        ? therapy.hpo_evidence.map(ev => ev.hpo_id)
        : therapy.hpo_ids || [];

    if (hpoIds.length === 0) {
        return {
            predicted_cell_types: [],
            cell_type_match: "unknown",
            cell_type_match_details: "No HPO phenotypes mapped for this therapy",
            predictions_by_hpo: {}
        };
    }

    // Collect predictions for each HPO
    const predictionsByHpo = {};
    const allCellTypes = new Set();

    for (const hpoId of hpoIds) {
        const prediction = hpoCellTypePredictions[hpoId];
        if (prediction) {
            predictionsByHpo[hpoId] = {
                top_cell_type: prediction.top_cell_type,
                top_q_value: prediction.top_q_value,
                all_cell_types: Array.isArray(prediction.cell_types)
                    ? prediction.cell_types
                    : [prediction.cell_types]
            };

            // Add to combined set
            const cellTypes = Array.isArray(prediction.cell_types)
                ? prediction.cell_types
                : [prediction.cell_types];
            cellTypes.forEach(ct => allCellTypes.add(ct));
        }
    }

    const allCellTypesArray = Array.from(allCellTypes);

    // Determine top predicted cell type (most frequently appearing across HPOs)
    const cellTypeCounts = {};
    for (const hpoData of Object.values(predictionsByHpo)) {
        const topCellType = hpoData.top_cell_type;
        cellTypeCounts[topCellType] = (cellTypeCounts[topCellType] || 0) + 1;
    }

    const sortedCellTypes = Object.entries(cellTypeCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([ct]) => ct);

    // Determine match status
    const matchStatus = determineMatchStatus(therapy.target_cell_type, allCellTypesArray);

    // Generate match details with explanation
    let matchDetails = "";
    if (Object.keys(predictionsByHpo).length > 0) {
        const topPrediction = sortedCellTypes[0] || allCellTypesArray[0];
        const actualTarget = therapy.target_cell_type || "Unknown";

        // Explain the comparison
        if (matchStatus === "exact") {
            matchDetails = `Pipeline correctly predicts ${topPrediction.replace(/_/g, " ")} for these phenotypes`;
        } else if (matchStatus === "related") {
            matchDetails = `Related cell types: therapy targets "${actualTarget}", pipeline predicts "${topPrediction.replace(/_/g, " ")}" (same tissue system)`;
        } else if (matchStatus === "mismatch") {
            matchDetails = `Different cell types: therapy targets "${actualTarget}", but phenotypes map to "${topPrediction.replace(/_/g, " ")}". This may indicate the phenotype manifests in a different tissue than the genetic cause.`;
        } else {
            matchDetails = `Actual: ${actualTarget}, Predicted: ${topPrediction.replace(/_/g, " ")}`;
        }
    } else {
        matchDetails = "No predictions available for mapped HPO phenotypes";
    }

    return {
        predicted_cell_types: sortedCellTypes.length > 0 ? sortedCellTypes : allCellTypesArray,
        cell_type_match: matchStatus,
        cell_type_match_details: matchDetails,
        predictions_by_hpo: predictionsByHpo
    };
}

/**
 * Get all therapies enriched with prediction data
 */
export function getTherapiesWithPredictions() {
    return approvedGeneTherapies.map(therapy => ({
        ...therapy,
        ...getTherapyPredictions(therapy)
    }));
}

/**
 * Get prediction statistics
 */
export function getPredictionStats() {
    const therapiesWithPredictions = getTherapiesWithPredictions();
    const matchCounts = {
        exact: 0,
        partial: 0,
        related: 0,
        mismatch: 0,
        unknown: 0
    };

    therapiesWithPredictions.forEach(t => {
        matchCounts[t.cell_type_match]++;
    });

    return {
        total: therapiesWithPredictions.length,
        ...matchCounts,
        accuracy: ((matchCounts.exact + matchCounts.partial) /
                   (therapiesWithPredictions.length - matchCounts.unknown) * 100).toFixed(1)
    };
}
