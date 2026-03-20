/* kb-medicine.js — Eduardo.AI Medical Knowledge Base v2026.03.20
   ICD-10 lookup + medical topics. Educational only.
*/
(function(W) {
  'use strict';

  /* ── ICD-10 DATABASE ────────────────────────── */
  var ICD = {
    /* F — Mental health */
    'F20': {
      pt: { label: 'Esquizofrenia', detail: 'Transtorno psicótico crônico com delírios, alucinações, pensamento desorganizado e embotamento afetivo. Onset típico: 15–35 anos. Tratamento: antipsicóticos (haloperidol, risperidona, clozapina) + psicossocial. Nunca suspender medicação abruptamente. Prevalência: ~1% da população.' },
      en: { label: 'Schizophrenia', detail: 'Chronic psychotic disorder with delusions, hallucinations, disorganized thinking and flat affect. Typical onset: 15–35 years. Treatment: antipsychotics (haloperidol, risperidone, clozapine) + psychosocial support. Never stop medication abruptly. Prevalence: ~1% of population.' },
      es: { label: 'Esquizofrenia', detail: 'Trastorno psicótico crónico con delirios, alucinaciones, pensamiento desorganizado y afecto plano. Inicio típico: 15–35 años. Tratamiento: antipsicóticos + psicosocial. Prevalencia: ~1% de la población.' }
    },
    'F32': {
      pt: { label: 'Episódio depressivo', detail: 'Humor deprimido, perda de interesse/prazer (anedonia), fadiga, alterações de sono/apetite, dificuldade de concentração, pensamentos de morte. Duração ≥2 semanas. Tratamento: antidepressivos (ISRS, ISRN), psicoterapia (TCC), para casos graves: eletroconvulsoterapia.' },
      en: { label: 'Depressive episode', detail: 'Depressed mood, loss of interest/pleasure (anhedonia), fatigue, sleep/appetite changes, difficulty concentrating, thoughts of death. Duration ≥2 weeks. Treatment: antidepressants (SSRIs, SNRIs), psychotherapy (CBT), ECT for severe cases.' },
      es: { label: 'Episodio depresivo', detail: 'Humor deprimido, pérdida de interés/placer, fatiga, alteraciones de sueño/apetito, pensamientos de muerte. Duración ≥2 semanas. Tratamiento: antidepresivos, psicoterapia (TCC).' }
    },
    'F41': {
      pt: { label: 'Transtornos de ansiedade', detail: 'Inclui transtorno de ansiedade generalizada (F41.1), pânico (F41.0), fobia específica. Sintomas: preocupação excessiva, taquicardia, sudorese, dispneia. Tratamento: ISRS/ISRN, benzodiazepínicos (curto prazo), TCC, técnicas de relaxamento.' },
      en: { label: 'Anxiety disorders', detail: 'Includes generalized anxiety disorder (F41.1), panic disorder (F41.0), specific phobia. Symptoms: excessive worry, tachycardia, sweating, dyspnea. Treatment: SSRIs/SNRIs, benzodiazepines (short-term), CBT, relaxation techniques.' },
      es: { label: 'Trastornos de ansiedad', detail: 'Incluye ansiedad generalizada (F41.1), pánico (F41.0), fobia específica. Tratamiento: ISRS/IRSN, benzodiazepinas (corto plazo), TCC.' }
    },
    'F31': {
      pt: { label: 'Transtorno afetivo bipolar', detail: 'Oscilação entre episódios de mania (euforia, grandiosidade, impulsividade, diminuição do sono) e depressão. Tratamento: estabilizadores de humor (lítio, valproato, lamotrigina), antipsicóticos atípicos. Lítio reduz risco de suicídio. Manutenção a longo prazo é essencial.' },
      en: { label: 'Bipolar affective disorder', detail: 'Oscillation between mania (euphoria, grandiosity, impulsivity, decreased sleep) and depression. Treatment: mood stabilizers (lithium, valproate, lamotrigine), atypical antipsychotics. Lithium reduces suicide risk. Long-term maintenance is essential.' },
      es: { label: 'Trastorno afectivo bipolar', detail: 'Alternancia entre manía (euforia, grandiosidad, impulsividad) y depresión. Tratamiento: estabilizadores del ánimo (litio, valproato), antipsicóticos atípicos.' }
    },
    /* I — Cardiovascular */
    'I21': {
      pt: { label: 'Infarto agudo do miocárdio', detail: 'IAM: necrose do músculo cardíaco por oclusão de artéria coronária. Sintomas: dor torácica intensa (opressão, irradiação para braço E / mandíbula), sudorese, dispneia, náusea. ECG: supra de ST, BRE novo. Marcadores: troponina. Tratamento: AAS + clopidogrel, anticoagulante, reperfusão (angioplastia primária ou trombólise).' },
      en: { label: 'Acute myocardial infarction', detail: 'Heart muscle necrosis from coronary artery occlusion. Symptoms: severe chest pain (pressure, radiation to left arm/jaw), sweating, dyspnea, nausea. ECG: ST elevation, new LBBB. Markers: troponin. Treatment: ASA + clopidogrel, anticoagulant, reperfusion (primary PCI or thrombolysis).' },
      es: { label: 'Infarto agudo de miocardio', detail: 'Necrosis del músculo cardíaco por oclusión coronaria. Síntomas: dolor torácico intenso, sudoración, disnea. ECG: elevación del ST. Tratamiento: AAS + clopidogrel, reperfusión (angioplastia o trombólisis).' }
    },
    'I10': {
      pt: { label: 'Hipertensão essencial', detail: 'Pressão arterial ≥140/90 mmHg. Causa mais comum de doença cardiovascular. Geralmente assintomática. Fatores de risco: obesidade, sedentarismo, sal, estresse, genética. Tratamento: mudança de estilo de vida + medicação (IECA, BRA, tiazídicos, BCC, betabloqueadores).' },
      en: { label: 'Essential hypertension', detail: 'Blood pressure ≥140/90 mmHg. Most common cause of cardiovascular disease. Usually asymptomatic. Risk factors: obesity, sedentary lifestyle, salt, stress, genetics. Treatment: lifestyle change + medication (ACE inhibitors, ARBs, thiazides, CCBs, beta-blockers).' },
      es: { label: 'Hipertensión esencial', detail: 'Presión arterial ≥140/90 mmHg. Causa más común de enfermedad cardiovascular. Generalmente asintomática. Tratamiento: cambio de estilo de vida + medicación.' }
    },
    'I50': {
      pt: { label: 'Insuficiência cardíaca', detail: 'O coração não bombeia suficientemente. Tipos: sistólica (FE reduzida) e diastólica (FE preservada). Sintomas: dispneia (esforço → repouso), ortopneia, edema periférico, fadiga. NYHA classifica gravidade (I–IV). Tratamento: IECA + betabloqueador + espironolactona + diurético; SGLT2i para FEr.' },
      en: { label: 'Heart failure', detail: 'Heart cannot pump adequately. Types: systolic (reduced EF) and diastolic (preserved EF). Symptoms: dyspnea on exertion → rest, orthopnea, peripheral edema, fatigue. NYHA classification I–IV. Treatment: ACE inhibitor + beta-blocker + spironolactone + diuretic; SGLT2i for HFrEF.' },
      es: { label: 'Insuficiencia cardíaca', detail: 'El corazón no bombea adecuadamente. Síntomas: disnea, ortopnea, edema periférico, fatiga. Tratamiento: IECA + betabloqueador + espironolactona + diurético.' }
    },
    /* J — Respiratory */
    'J18': {
      pt: { label: 'Pneumonia', detail: 'Infecção pulmonar. Causas: Streptococcus pneumoniae (mais comum), Haemophilus, atípicas (Mycoplasma, Legionella), viral (influenza, SARS-CoV-2). Sintomas: febre, tosse produtiva, dispneia, dor pleurítica. Radiografia: consolidação. Tratamento: amoxicilina (ambulatorial) ou beta-lactâmico ± macrolídeo (hospitalar).' },
      en: { label: 'Pneumonia', detail: 'Lung infection. Causes: Streptococcus pneumoniae (most common), atypical (Mycoplasma, Legionella), viral (influenza, SARS-CoV-2). Symptoms: fever, productive cough, dyspnea, pleuritic pain. X-ray: consolidation. Treatment: amoxicillin (outpatient) or beta-lactam ± macrolide (inpatient).' },
      es: { label: 'Neumonía', detail: 'Infección pulmonar. Síntomas: fiebre, tos productiva, disnea, dolor pleurítico. Tratamiento: amoxicilina (ambulatorio) o beta-lactámico ± macrólido (hospitalario).' }
    },
    /* E — Endocrine */
    'E11': {
      pt: { label: 'Diabetes mellitus tipo 2', detail: 'Hiperglicemia crónica por resistência insulínica + disfunção de células beta. Diagnóstico: glicemia ≥126 mg/dL em jejum, HbA1c ≥6,5%. Complicações: retinopatia, nefropatia, neuropatia, pé diabético, DCV. Tratamento: metformina de 1ª linha + SGLT2i (proteção cardiorреnal) + GLP-1 se obesidade.' },
      en: { label: 'Type 2 diabetes mellitus', detail: 'Chronic hyperglycemia from insulin resistance + beta cell dysfunction. Diagnosis: fasting glucose ≥126 mg/dL, HbA1c ≥6.5%. Complications: retinopathy, nephropathy, neuropathy, diabetic foot, CVD. Treatment: metformin first-line + SGLT2i (cardio-renal protection) + GLP-1 if obesity.' },
      es: { label: 'Diabetes mellitus tipo 2', detail: 'Hiperglucemia crónica por resistencia insulínica. Diagnóstico: glucemia ≥126 mg/dL en ayunas, HbA1c ≥6,5%. Tratamiento: metformina de primera línea + SGLT2i.' }
    },
    /* C — Neoplasms */
    'C34': {
      pt: { label: 'Neoplasia maligna dos brônquios e pulmões', detail: 'Câncer de pulmão: 85% são carcinoma de células não pequenas (adenocarcinoma, escamoso, grande célula), 15% células pequenas (mais agressivo). Principal causa: tabagismo (85%). Triagem: TC de tórax baixa dose em fumantes 50–80 anos. Tratamento: cirurgia (precoce), quimio, radioterapia, imunoterapia (pembrolizumab), terapia-alvo (EGFR, ALK).' },
      en: { label: 'Malignant neoplasm of bronchus and lung', detail: 'Lung cancer: 85% non-small cell (adenocarcinoma, squamous, large cell), 15% small cell (more aggressive). Main cause: smoking (85%). Screening: low-dose CT in smokers 50–80 years. Treatment: surgery (early stage), chemo, radiation, immunotherapy (pembrolizumab), targeted therapy (EGFR, ALK).' },
      es: { label: 'Neoplasia maligna de bronquios y pulmón', detail: 'Cáncer de pulmón: 85% carcinoma de células no pequeñas, 15% células pequeñas. Principal causa: tabaquismo (85%). Tratamiento: cirugía, quimio, inmunoterapia.' }
    },
    /* K — Digestive */
    'K40': {
      pt: { label: 'Hérnia inguinal', detail: 'Protrusão de conteúdo abdominal pelo canal inguinal. Mais comum em homens. Direta: enfraquecimento da parede posterior. Indireta: pelo anel inguinal profundo (congênita). Risco de encarceramento/estrangulamento. Tratamento: cirurgia (hernioplastia de Lichtenstein com tela ou videolaparoscopia).' },
      en: { label: 'Inguinal hernia', detail: 'Protrusion of abdominal content through the inguinal canal. More common in men. Direct: posterior wall weakness. Indirect: through deep inguinal ring (congenital). Risk of incarceration/strangulation. Treatment: surgery (Lichtenstein mesh repair or laparoscopic).' },
      es: { label: 'Hernia inguinal', detail: 'Protrusión del contenido abdominal por el canal inguinal. Más común en hombres. Riesgo de encarcelamiento. Tratamiento: cirugía (herniorrafia de Lichtenstein o laparoscopia).' }
    },
    /* N — Genitourinary */
    'N18': {
      pt: { label: 'Doença renal crónica', detail: 'TFG < 60 mL/min/1,73m² por >3 meses. Causas: DM tipo 2, HAS, glomerulonefrite. Estadios 1–5 (5 = falência renal, requer diálise/transplante). Sintomas tardios: uremia, anemia, hiperfosfatemia. Controle: PA < 130/80, HbA1c < 7%, IECA/BRA, SGLT2i, eritropoetina para anemia.' },
      en: { label: 'Chronic kidney disease', detail: 'GFR < 60 mL/min/1.73m² for >3 months. Causes: type 2 DM, hypertension, glomerulonephritis. Stages 1–5 (5 = kidney failure, requires dialysis/transplant). Late symptoms: uremia, anemia, hyperphosphatemia. Management: BP < 130/80, HbA1c < 7%, ACE inhibitor/ARB, SGLT2i, erythropoietin.' },
      es: { label: 'Enfermedad renal crónica', detail: 'FGR < 60 mL/min/1,73m² por >3 meses. Causas: DM tipo 2, HTA, glomerulonefritis. Estadios 1–5. Tratamiento: control de PA, HbA1c, IECA/ARA2, SGLT2i.' }
    }
  };

  /* ── LOOKUP FUNCTION ────────────────────────── */
  W.lookupICDCode = function(code, lang) {
    var lc = lang || 'pt';
    var entry = ICD[code.toUpperCase()];
    if (!entry) return null;
    var data = entry[lc] || entry['pt'];
    if (!data) return null;
    return { label: data.label, detail: data.detail };
  };

  /* ── GENERAL MEDICAL KB ─────────────────────── */
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'medicine',
    priority: 8,
    lang: {
      pt: {
        'cid10': 'CID-10 (Classificação Internacional de Doenças, 10ª revisão) é o sistema da OMS para codificar doenças e condições de saúde. Estrutura: letra (sistema/categoria) + 2 números + decimal. Ex: F20 = esquizofrenia, I21 = infarto, E11 = diabetes tipo 2, J18 = pneumonia. Digite qualquer código para saber mais.',
        'sistema_imune': 'Sistema imune: inato (resposta rápida, inespecífica — neutrófilos, macrófagos, NK, inflamação, febre) e adaptativo (específico — linfócitos B produzem anticorpos, linfócitos T citotóxicos destroem células infectadas). Vacinação treina o sistema adaptativo. HIV destrói CD4+ (TCD4), colapsa a imunidade adaptativa.',
        'antibioticos': 'Antibióticos tratam infecções bacterianas — não têm efeito em vírus. Mecanismos: inibição da parede celular (penicilinas, cefalosporinas), ribossomos (macrolídeos, aminoglicosídeos), DNA-girase (quinolonas), membrana celular (polimixinas). Resistência bacteriana é crise global — não usar sem prescrição, completar o curso.',
        'sistema_nervoso': 'SNC (encéfalo + medula) + SNP (nervos). Neurônio: soma, dendritos (recebem), axônio (transmitem), sinapse (junção química com neurotransmissores). Neurotransmissores: dopamina (recompensa, motor), serotonina (humor), noradrenalina (alerta), GABA (inibição), glutamato (excitação). Plasticidade sináptica = base da aprendizagem.',
        'farmacologia': 'Farmacocinética (o que o organismo faz com o fármaco): absorção, distribuição, metabolismo (fígado, CYP450), excreção (rim). Farmacodinâmica (o que o fármaco faz no organismo): receptores agonistas/antagonistas, dose-resposta, janela terapêutica. Interações medicamentosas podem ser farmacocinéticas (inibição CYP) ou farmacodinâmicas.',
        'covid': 'COVID-19 (SARS-CoV-2): coronavírus que emergiu em Wuhan (China) em 2019. Transmissão: aerossóis/gotículas. Síndrome Respiratória Aguda Grave em casos severos. Vacinas: mRNA (Pfizer, Moderna), adenoviral (AstraZeneca, Janssen). COVID longa: sintomas persistentes >12 semanas — fadiga, névoa cerebral, dispneia.',
      },
      en: {
        'icd10': 'ICD-10 (International Classification of Diseases, 10th revision) is the WHO system for coding diseases and health conditions. Structure: letter (system/category) + 2 numbers + decimal. E.g.: F20 = schizophrenia, I21 = heart attack, E11 = type 2 diabetes, J18 = pneumonia. Type any code to learn more.',
        'immune_system': 'Immune system: innate (fast, nonspecific — neutrophils, macrophages, NK cells, inflammation, fever) and adaptive (specific — B lymphocytes produce antibodies, cytotoxic T cells destroy infected cells). Vaccination trains the adaptive system. HIV destroys CD4+ (TCD4), collapsing adaptive immunity.',
        'antibiotics': 'Antibiotics treat bacterial infections — they have no effect on viruses. Mechanisms: cell wall inhibition (penicillins, cephalosporins), ribosomes (macrolides, aminoglycosides), DNA gyrase (quinolones). Antibiotic resistance is a global crisis — do not use without prescription, complete the course.',
        'nervous_system': 'CNS (brain + spinal cord) + PNS (nerves). Neuron: soma, dendrites (receive), axon (transmit), synapse (chemical junction with neurotransmitters). Neurotransmitters: dopamine (reward, motor), serotonin (mood), noradrenaline (alertness), GABA (inhibition), glutamate (excitation).',
        'covid': 'COVID-19 (SARS-CoV-2): coronavirus that emerged in Wuhan (China) in 2019. Transmission: aerosols/droplets. Severe Acute Respiratory Syndrome in severe cases. Vaccines: mRNA (Pfizer, Moderna), adenoviral (AstraZeneca, Janssen). Long COVID: persistent symptoms >12 weeks — fatigue, brain fog, dyspnea.',
      },
      es: {
        'cie10': 'CIE-10 (Clasificación Internacional de Enfermedades, 10ª revisión) es el sistema de la OMS para codificar enfermedades. Estructura: letra + 2 números + decimal. Ej: F20 = esquizofrenia, I21 = infarto, E11 = diabetes tipo 2. Escriba cualquier código para saber más.',
        'sistema_inmune': 'Sistema inmune: innato (rápido, inespecífico) y adaptativo (específico — linfocitos B/T). La vacunación entrena el sistema adaptativo. El VIH destruye los CD4+, colapsando la inmunidad adaptativa.',
        'antibioticos': 'Los antibióticos tratan infecciones bacterianas, no virales. Mecanismos: inhibición de la pared celular, ribosomas, ADN-girasa. La resistencia bacteriana es una crisis global — no usar sin prescripción.',
        'covid': 'COVID-19 (SARS-CoV-2): coronavirus surgido en Wuhan (China) en 2019. Transmisión: aerosoles/gotas. Vacunas: ARNm (Pfizer, Moderna), adenoviral (AstraZeneca). COVID prolongado: síntomas persistentes >12 semanas.',
      }
    }
  });

}(window));
