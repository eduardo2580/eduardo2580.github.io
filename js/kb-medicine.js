/* kb-medicine.js — Eduardo.AI Medical Knowledge Base v2026.03.20
   ICD-10-CM 2022: 72,748 codes loaded from JSON at runtime.
   Supports PT / EN / ES translation via pattern substitution.
   GitHub Pages compatible: uses fetch() — no server needed.
   Code normalization: dots removed (F20.0 = F200), prefix match.
   Educational only. Not a substitute for professional medical advice.
*/
(function(W) {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     TRANSLATION ENGINE
     Ordered phrase/word substitutions EN → PT and EN → ES.
     Longer phrases must come before shorter words.
  ═══════════════════════════════════════════════════════════ */

  /* Each entry: [regex, pt_replacement, es_replacement] */
  var TRANS = [
    /* ── Encounter types ── */
    [/\binitial encounter for open fracture type I or II\b/gi, 'encontro inicial para fratura exposta tipo I ou II', 'encuentro inicial para fractura expuesta tipo I o II'],
    [/\binitial encounter for open fracture type IIIA, IIIB, or IIIC\b/gi, 'encontro inicial para fratura exposta tipo IIIA, IIIB ou IIIC', 'encuentro inicial para fractura expuesta tipo IIIA, IIIB o IIIC'],
    [/\binitial encounter for open fracture\b/gi, 'encontro inicial para fratura exposta', 'encuentro inicial para fractura expuesta'],
    [/\binitial encounter for closed fracture\b/gi, 'encontro inicial para fratura fechada', 'encuentro inicial para fractura cerrada'],
    [/\binitial encounter\b/gi, 'encontro inicial', 'encuentro inicial'],
    [/\bsubsequent encounter for fracture with routine healing\b/gi, 'encontro subsequente para fratura com consolidação normal', 'encuentro subsecuente para fractura con curación rutinaria'],
    [/\bsubsequent encounter for fracture with delayed healing\b/gi, 'encontro subsequente para fratura com consolidação retardada', 'encuentro subsecuente para fractura con curación demorada'],
    [/\bsubsequent encounter for fracture with nonunion\b/gi, 'encontro subsequente para fratura com não-união', 'encuentro subsecuente para fractura con no-unión'],
    [/\bsubsequent encounter for fracture with malunion\b/gi, 'encontro subsequente para fratura com consolidação viciosa', 'encuentro subsecuente para fractura con mala unión'],
    [/\bsubsequent encounter for open fracture type I or II with routine healing\b/gi, 'encontro subsequente para fratura exposta tipo I ou II com consolidação normal', 'encuentro subsecuente para fractura expuesta tipo I o II con curación rutinaria'],
    [/\bsubsequent encounter for open fracture type IIIA, IIIB, or IIIC with routine healing\b/gi, 'encontro subsequente para fratura exposta tipo IIIA, IIIB ou IIIC com consolidação normal', 'encuentro subsecuente para fractura expuesta tipo IIIA, IIIB o IIIC con curación rutinaria'],
    [/\bsubsequent encounter for open fracture type I or II with delayed healing\b/gi, 'encontro subsequente para fratura exposta tipo I ou II com consolidação retardada', 'encuentro subsecuente para fractura expuesta tipo I o II con curación demorada'],
    [/\bsubsequent encounter for open fracture type IIIA, IIIB, or IIIC with delayed healing\b/gi, 'encontro subsequente para fratura exposta tipo IIIA, IIIB ou IIIC com consolidação retardada', 'encuentro subsecuente para fractura expuesta tipo IIIA, IIIB o IIIC con curación demorada'],
    [/\bsubsequent encounter for open fracture type I or II with nonunion\b/gi, 'encontro subsequente para fratura exposta tipo I ou II com não-união', 'encuentro subsecuente para fractura expuesta tipo I o II con no-unión'],
    [/\bsubsequent encounter for open fracture type IIIA, IIIB, or IIIC with nonunion\b/gi, 'encontro subsequente para fratura exposta tipo IIIA, IIIB ou IIIC com não-união', 'encuentro subsecuente para fractura expuesta tipo IIIA, IIIB o IIIC con no-unión'],
    [/\bsubsequent encounter for open fracture type I or II with malunion\b/gi, 'encontro subsequente para fratura exposta tipo I ou II com consolidação viciosa', 'encuentro subsecuente para fractura expuesta tipo I o II con mala unión'],
    [/\bsubsequent encounter for open fracture type IIIA, IIIB, or IIIC with malunion\b/gi, 'encontro subsequente para fratura exposta tipo IIIA, IIIB ou IIIC com consolidação viciosa', 'encuentro subsecuente para fractura expuesta tipo IIIA, IIIB o IIIC con mala unión'],
    [/\bsubsequent encounter\b/gi, 'encontro subsequente', 'encuentro subsecuente'],
    [/\bencounter for examination of blood pressure with abnormal findings\b/gi, 'consulta para exame de pressão arterial com achados anormais', 'consulta para examen de presión arterial con hallazgos anormales'],
    [/\bencounter for examination of blood pressure without abnormal findings\b/gi, 'consulta para exame de pressão arterial sem achados anormais', 'consulta para examen de presión arterial sin hallazgos anormales'],
    [/\bencounter for\b/gi, 'consulta para', 'consulta para'],
    [/\bsequela\b/gi, 'sequela', 'secuela'],

    /* ── Fracture descriptors ── */
    [/\bdisplaced fracture\b/gi, 'fratura desviada', 'fractura desplazada'],
    [/\bnondisplaced fracture\b/gi, 'fratura sem desvio', 'fractura no desplazada'],
    [/\bstress fracture\b/gi, 'fratura por estresse', 'fractura por estrés'],
    [/\bpathological fracture\b/gi, 'fratura patológica', 'fractura patológica'],
    [/\bcompression fracture\b/gi, 'fratura por compressão', 'fractura por compresión'],
    [/\bavulsion fracture\b/gi, 'fratura por avulsão', 'fractura por avulsión'],
    [/\bincarcerated fracture \(avulsion\)\b/gi, 'fratura encarcerada (avulsão)', 'fractura encarcerada (avulsión)'],
    [/\bfracture of shaft\b/gi, 'fratura da diáfise', 'fractura de la diáfisis'],
    [/\bfracture of neck\b/gi, 'fratura do colo', 'fractura del cuello'],
    [/\bfracture of head\b/gi, 'fratura da cabeça', 'fractura de la cabeza'],
    [/\bfracture of base\b/gi, 'fratura da base', 'fractura de la base'],
    [/\bfracture of body\b/gi, 'fratura do corpo', 'fractura del cuerpo'],
    [/\bfracture\b/gi, 'fratura', 'fractura'],
    [/\bopen fracture\b/gi, 'fratura exposta', 'fractura expuesta'],
    [/\bclosed fracture\b/gi, 'fratura fechada', 'fractura cerrada'],
    [/\bmalunion\b/gi, 'consolidação viciosa', 'mala unión'],
    [/\bnonunion\b/gi, 'não-união', 'no-unión'],

    /* ── Diabetes ── */
    [/\btype 1 diabetes mellitus\b/gi, 'diabetes mellitus tipo 1', 'diabetes mellitus tipo 1'],
    [/\btype 2 diabetes mellitus\b/gi, 'diabetes mellitus tipo 2', 'diabetes mellitus tipo 2'],
    [/\bother specified diabetes mellitus\b/gi, 'diabetes mellitus especificado', 'diabetes mellitus especificado'],
    [/\bdiabetes mellitus\b/gi, 'diabetes mellitus', 'diabetes mellitus'],
    [/\bdiabetic retinopathy\b/gi, 'retinopatia diabética', 'retinopatía diabética'],
    [/\bproliferative diabetic retinopathy\b/gi, 'retinopatia diabética proliferativa', 'retinopatía diabética proliferativa'],
    [/\bnon-proliferative diabetic retinopathy\b/gi, 'retinopatia diabética não proliferativa', 'retinopatía diabética no proliferativa'],
    [/\bdiabetic macular edema\b/gi, 'edema macular diabético', 'edema macular diabético'],
    [/\bdiabetic nephropathy\b/gi, 'nefropatia diabética', 'nefropatía diabética'],
    [/\bdiabetic neuropathy\b/gi, 'neuropatia diabética', 'neuropatía diabética'],
    [/\bdiabetic polyneuropathy\b/gi, 'polineuropatia diabética', 'polineuropatía diabética'],
    [/\bdiabetic peripheral angiopathy\b/gi, 'angiopatia periférica diabética', 'angiopatía periférica diabética'],
    [/\bdiabetic foot ulcer\b/gi, 'úlcera do pé diabético', 'úlcera del pie diabético'],
    [/\bdiabetic ketoacidosis\b/gi, 'cetoacidose diabética', 'cetoacidosis diabética'],
    [/\bhyperosmolarity\b/gi, 'hiperosmolaridade', 'hiperosmolaridad'],
    [/\bhypoglycemia\b/gi, 'hipoglicemia', 'hipoglucemia'],
    [/\bhyperglycemia\b/gi, 'hiperglicemia', 'hiperglucemia'],
    [/\btraction retinal detachment\b/gi, 'descolamento de retina tracional', 'desprendimiento de retina traccional'],
    [/\bstable proliferative diabetic retinopathy\b/gi, 'retinopatia diabética proliferativa estável', 'retinopatía diabética proliferativa estable'],
    [/\bwith diabetic macular edema, resolved\b/gi, 'com edema macular diabético, resolvido', 'con edema macular diabético, resuelto'],
    [/\bwithout macular edema\b/gi, 'sem edema macular', 'sin edema macular'],
    [/\bwith macular edema\b/gi, 'com edema macular', 'con edema macular'],

    /* ── Cardiovascular ── */
    [/\bST elevation \(STEMI\) myocardial infarction\b/gi, 'infarto do miocárdio com supradesnivelamento de ST (IAMCST)', 'infarto de miocardio con elevación del ST (IAMCST)'],
    [/\bnon-ST elevation \(NSTEMI\) myocardial infarction\b/gi, 'infarto do miocárdio sem supradesnivelamento de ST (IAMSST)', 'infarto de miocardio sin elevación del ST (IAMSST)'],
    [/\bmyocardial infarction\b/gi, 'infarto do miocárdio', 'infarto de miocardio'],
    [/\bessential \(primary\) hypertension\b/gi, 'hipertensão arterial essencial (primária)', 'hipertensión arterial esencial (primaria)'],
    [/\bheart failure\b/gi, 'insuficiência cardíaca', 'insuficiencia cardíaca'],
    [/\batrial fibrillation\b/gi, 'fibrilação atrial', 'fibrilación auricular'],
    [/\batrial flutter\b/gi, 'flutter atrial', 'aleteo auricular'],
    [/\bcoronary artery disease\b/gi, 'doença arterial coronariana', 'enfermedad arterial coronaria'],
    [/\bischemic heart disease\b/gi, 'cardiopatia isquêmica', 'cardiopatía isquémica'],
    [/\bcardiac arrest\b/gi, 'parada cardíaca', 'paro cardíaco'],
    [/\bangina pectoris\b/gi, 'angina pectoris', 'angina de pecho'],
    [/\bunstable angina\b/gi, 'angina instável', 'angina inestable'],
    [/\bstable angina\b/gi, 'angina estável', 'angina estable'],
    [/\bdeep vein thrombosis\b/gi, 'trombose venosa profunda', 'trombosis venosa profunda'],
    [/\bpulmonary embolism\b/gi, 'embolia pulmonar', 'embolia pulmonar'],
    [/\bischemic stroke\b/gi, 'acidente vascular cerebral isquêmico', 'accidente cerebrovascular isquémico'],
    [/\bhemorrhagic stroke\b/gi, 'acidente vascular cerebral hemorrágico', 'accidente cerebrovascular hemorrágico'],
    [/\bcerebral infarction\b/gi, 'infarto cerebral', 'infarto cerebral'],
    [/\bperipheral vascular disease\b/gi, 'doença vascular periférica', 'enfermedad vascular periférica'],
    [/\baortic aneurysm\b/gi, 'aneurisma da aorta', 'aneurisma de aorta'],
    [/\bhypertensive chronic kidney disease\b/gi, 'doença renal crônica hipertensiva', 'enfermedad renal crónica hipertensiva'],
    [/\bhypertensive heart disease\b/gi, 'cardiopatia hipertensiva', 'cardiopatía hipertensiva'],
    [/\bhypertension\b/gi, 'hipertensão', 'hipertensión'],
    [/\bventricular fibrillation\b/gi, 'fibrilação ventricular', 'fibrilación ventricular'],
    [/\bventricular tachycardia\b/gi, 'taquicardia ventricular', 'taquicardia ventricular'],
    [/\btachycardia\b/gi, 'taquicardia', 'taquicardia'],
    [/\bbradycardia\b/gi, 'bradicardia', 'bradicardia'],
    [/\bpalpitations\b/gi, 'palpitações', 'palpitaciones'],
    [/\bleft anterior descending coronary artery\b/gi, 'artéria coronária descendente anterior esquerda', 'arteria coronaria descendente anterior izquierda'],
    [/\bright coronary artery\b/gi, 'artéria coronária direita', 'arteria coronaria derecha'],
    [/\bleft main coronary artery\b/gi, 'artéria coronária principal esquerda', 'arteria coronaria principal izquierda'],
    [/\bleft circumflex coronary artery\b/gi, 'artéria coronária circunflexa esquerda', 'arteria coronaria circunfleja izquierda'],
    [/\bcoronary artery\b/gi, 'artéria coronária', 'arteria coronaria'],
    [/\binferior wall\b/gi, 'parede inferior', 'pared inferior'],
    [/\banterior wall\b/gi, 'parede anterior', 'pared anterior'],
    [/\blateral wall\b/gi, 'parede lateral', 'pared lateral'],
    [/\bposterior wall\b/gi, 'parede posterior', 'pared posterior'],

    /* ── Respiratory ── */
    [/\bchronic obstructive pulmonary disease\b/gi, 'doença pulmonar obstrutiva crônica (DPOC)', 'enfermedad pulmonar obstructiva crónica (EPOC)'],
    [/\basthma\b/gi, 'asma', 'asma'],
    [/\bpneumonia\b/gi, 'pneumonia', 'neumonía'],
    [/\bbronchitis\b/gi, 'bronquite', 'bronquitis'],
    [/\brespiratory failure\b/gi, 'insuficiência respiratória', 'insuficiencia respiratoria'],
    [/\bpulmonary edema\b/gi, 'edema pulmonar', 'edema pulmonar'],
    [/\bpleural effusion\b/gi, 'derrame pleural', 'derrame pleural'],
    [/\bpneumothorax\b/gi, 'pneumotórax', 'neumotórax'],
    [/\blung cancer\b/gi, 'câncer de pulmão', 'cáncer de pulmón'],
    [/\bsleep apnea\b/gi, 'apneia do sono', 'apnea del sueño'],
    [/\bobstructive sleep apnea\b/gi, 'apneia obstrutiva do sono', 'apnea obstructiva del sueño'],
    [/\binfluenza\b/gi, 'influenza', 'influenza'],
    [/\btuberculosis\b/gi, 'tuberculose', 'tuberculosis'],
    [/\bsinusitis\b/gi, 'sinusite', 'sinusitis'],
    [/\btonsillitis\b/gi, 'amigdalite', 'amigdalitis'],
    [/\bpharyngitis\b/gi, 'faringite', 'faringitis'],
    [/\blaryngitis\b/gi, 'laringite', 'laringitis'],
    [/\btracheitis\b/gi, 'traqueíte', 'traqueítis'],
    [/\bpleuritis\b/gi, 'pleurite', 'pleuritis'],
    [/\bbronchiectasis\b/gi, 'bronquiectasia', 'bronquiectasia'],
    [/\bpulmonary fibrosis\b/gi, 'fibrose pulmonar', 'fibrosis pulmonar'],
    [/\bsarcoidosis\b/gi, 'sarcoidose', 'sarcoidosis'],

    /* ── Mental health ── */
    [/\bschizophrenia\b/gi, 'esquizofrenia', 'esquizofrenia'],
    [/\bbipolar disorder\b/gi, 'transtorno bipolar', 'trastorno bipolar'],
    [/\bdepressive disorder\b/gi, 'transtorno depressivo', 'trastorno depresivo'],
    [/\bmajor depressive disorder\b/gi, 'transtorno depressivo maior', 'trastorno depresivo mayor'],
    [/\bdysthymia\b/gi, 'distimia', 'distimia'],
    [/\bpost-traumatic stress disorder\b/gi, 'transtorno de estresse pós-traumático (TEPT)', 'trastorno de estrés postraumático (TEPT)'],
    [/\banxiety disorder\b/gi, 'transtorno de ansiedade', 'trastorno de ansiedad'],
    [/\bgeneralized anxiety disorder\b/gi, 'transtorno de ansiedade generalizada', 'trastorno de ansiedad generalizada'],
    [/\bpanic disorder\b/gi, 'transtorno de pânico', 'trastorno de pánico'],
    [/\bphobia\b/gi, 'fobia', 'fobia'],
    [/\bobsessive-compulsive disorder\b/gi, 'transtorno obsessivo-compulsivo (TOC)', 'trastorno obsesivo-compulsivo (TOC)'],
    [/\bautism spectrum disorder\b/gi, 'transtorno do espectro autista', 'trastorno del espectro autista'],
    [/\battention-deficit hyperactivity disorder\b/gi, 'transtorno de déficit de atenção e hiperatividade (TDAH)', 'trastorno por déficit de atención e hiperactividad (TDAH)'],
    [/\bintellectual disability\b/gi, 'deficiência intelectual', 'discapacidad intelectual'],
    [/\bconduct disorder\b/gi, 'transtorno de conduta', 'trastorno de conducta'],
    [/\balcohol dependence\b/gi, 'dependência alcoólica', 'dependencia alcohólica'],
    [/\balcohol use disorder\b/gi, 'transtorno por uso de álcool', 'trastorno por uso de alcohol'],
    [/\bsubstance use disorder\b/gi, 'transtorno por uso de substâncias', 'trastorno por uso de sustancias'],
    [/\bcocaine abuse\b/gi, 'abuso de cocaína', 'abuso de cocaína'],
    [/\bopioid use disorder\b/gi, 'transtorno por uso de opioide', 'trastorno por uso de opioides'],
    [/\bnicotine dependence\b/gi, 'dependência de nicotina', 'dependencia de nicotina'],
    [/\bhallucinogen\b/gi, 'alucinógeno', 'alucinógeno'],
    [/\bparanoid schizophrenia\b/gi, 'esquizofrenia paranoide', 'esquizofrenia paranoide'],
    [/\bschizoaffective disorder\b/gi, 'transtorno esquizoafetivo', 'trastorno esquizoafectivo'],
    [/\bschizophreniform disorder\b/gi, 'transtorno esquizofreniforme', 'trastorno esquizofreniforme'],
    [/\bdelusional disorder\b/gi, 'transtorno delirante', 'trastorno delirante'],
    [/\bdementia\b/gi, 'demência', 'demencia'],
    [/\balzheimer\b/gi, "alzheimer", 'alzheimer'],
    [/\bdelirium\b/gi, 'delirium', 'delirium'],
    [/\binsomnia\b/gi, 'insônia', 'insomnio'],
    [/\beating disorder\b/gi, 'transtorno alimentar', 'trastorno alimentario'],
    [/\banorexia nervosa\b/gi, 'anorexia nervosa', 'anorexia nerviosa'],
    [/\bbulimia nervosa\b/gi, 'bulimia nervosa', 'bulimia nerviosa'],
    [/\bself-harm\b/gi, 'automutilação', 'autolesión'],
    [/\bsuicidal\b/gi, 'suicida', 'suicida'],

    /* ── Neurological ── */
    [/\bepilepsy\b/gi, "epilepsia", 'epilepsia'],
    [/\bseizure\b/gi, 'crise epiléptica', 'crisis epiléptica'],
    [/\bparkinson\b/gi, 'parkinson', 'parkinson'],
    [/\bmigraine\b/gi, 'enxaqueca', 'migraña'],
    [/\bheadache\b/gi, 'cefaleia', 'cefalea'],
    [/\bvertigo\b/gi, 'vertigem', 'vértigo'],
    [/\bdizziness\b/gi, 'tontura', 'mareo'],
    [/\bneuropathy\b/gi, 'neuropatia', 'neuropatía'],
    [/\bneuralgia\b/gi, 'nevralgia', 'neuralgia'],
    [/\bencephalopathy\b/gi, 'encefalopatia', 'encefalopatía'],
    [/\bencephalitis\b/gi, 'encefalite', 'encefalitis'],
    [/\bmeningitis\b/gi, 'meningite', 'meningitis'],
    [/\bmultiple sclerosis\b/gi, 'esclerose múltipla', 'esclerosis múltiple'],
    [/\bamyotrophic lateral sclerosis\b/gi, 'esclerose lateral amiotrófica (ELA)', 'esclerosis lateral amiotrófica (ELA)'],
    [/\bGuillain-Barr[eé] syndrome\b/gi, 'síndrome de Guillain-Barré', 'síndrome de Guillain-Barré'],
    [/\btransient ischemic attack\b/gi, 'ataque isquêmico transitório (AIT)', 'ataque isquémico transitorio (AIT)'],
    [/\bcerebrovascular\b/gi, 'cerebrovascular', 'cerebrovascular'],
    [/\bintracranial hemorrhage\b/gi, 'hemorragia intracraniana', 'hemorragia intracraneal'],
    [/\bsubarachnoid hemorrhage\b/gi, 'hemorragia subaracnoide', 'hemorragia subaracnoidea'],
    [/\bsubdural hematoma\b/gi, 'hematoma subdural', 'hematoma subdural'],
    [/\bepidural hematoma\b/gi, 'hematoma epidural', 'hematoma epidural'],

    /* ── Musculoskeletal / Bones ── */
    [/\brheumatoid arthritis\b/gi, 'artrite reumatoide', 'artritis reumatoide'],
    [/\bosteoarthritis\b/gi, 'osteoartrite', 'osteoartritis'],
    [/\bosteoporosis\b/gi, 'osteoporose', 'osteoporosis'],
    [/\bgout\b/gi, 'gota', 'gota'],
    [/\bspondylosis\b/gi, 'espondilose', 'espondilosis'],
    [/\bspondylolysis\b/gi, 'espondilólise', 'espondilólisis'],
    [/\bspondylolisthesis\b/gi, 'espondilolistese', 'espondilolistesis'],
    [/\bankylosing spondylitis\b/gi, 'espondilite anquilosante', 'espondilitis anquilosante'],
    [/\bintervertebral disc degeneration\b/gi, 'degeneração do disco intervertebral', 'degeneración del disco intervertebral'],
    [/\bintervertebral disc\b/gi, 'disco intervertebral', 'disco intervertebral'],
    [/\bdisc herniation\b/gi, 'hérnia de disco', 'hernia de disco'],
    [/\btendinitis\b/gi, 'tendinite', 'tendinitis'],
    [/\btendinopathy\b/gi, 'tendinopatia', 'tendinopatía'],
    [/\bbursitis\b/gi, 'bursite', 'bursitis'],
    [/\bsynovitis\b/gi, 'sinovite', 'sinovitis'],
    [/\bfibromyalgia\b/gi, 'fibromialgia', 'fibromialgia'],
    [/\bcarpal tunnel syndrome\b/gi, 'síndrome do túnel do carpo', 'síndrome del túnel carpiano'],
    [/\bthoracic outlet syndrome\b/gi, 'síndrome do desfiladeiro torácico', 'síndrome del opérculo torácico'],
    [/\brotator cuff\b/gi, 'manguito rotador', 'manguito rotador'],
    [/\bmeniscus\b/gi, 'menisco', 'menisco'],
    [/\bligament\b/gi, 'ligamento', 'ligamento'],
    [/\btendon\b/gi, 'tendão', 'tendón'],
    [/\bsprain\b/gi, 'entorse', 'esguince'],
    [/\bstrain\b/gi, 'distensão muscular', 'distensión muscular'],
    [/\bdislocation\b/gi, 'luxação', 'luxación'],
    [/\bsubluxation\b/gi, 'subluxação', 'subluxación'],
    [/\bosteomyelitis\b/gi, 'osteomielite', 'osteomielitis'],
    [/\bosteoarthropathy\b/gi, 'osteoartropatia', 'osteoartropatía'],
    [/\bosteochondrosis\b/gi, 'osteocondrosis', 'osteocondrosis'],
    [/\bchondromalacia\b/gi, 'condromalacia', 'condromalacia'],
    [/\bfemur\b/gi, 'fêmur', 'fémur'],
    [/\btibia\b/gi, 'tíbia', 'tibia'],
    [/\bfibula\b/gi, 'fíbula', 'fíbula'],
    [/\bhumerus\b/gi, 'úmero', 'húmero'],
    [/\bradius\b/gi, 'rádio', 'radio'],
    [/\bulna\b/gi, 'ulna', 'cúbito'],
    [/\bclavicle\b/gi, 'clavícula', 'clavícula'],
    [/\bscapula\b/gi, 'escápula', 'escápula'],
    [/\bpelvis\b/gi, 'pelve', 'pelvis'],
    [/\bacetabulum\b/gi, 'acetábulo', 'acetábulo'],
    [/\blumbar vertebra\b/gi, 'vértebra lombar', 'vértebra lumbar'],
    [/\bthoracic vertebra\b/gi, 'vértebra torácica', 'vértebra torácica'],
    [/\bcervical vertebra\b/gi, 'vértebra cervical', 'vértebra cervical'],
    [/\bsacrum\b/gi, 'sacro', 'sacro'],
    [/\bcoccyx\b/gi, 'cóccix', 'cóccix'],
    [/\bmetacarpal\b/gi, 'metacarpo', 'metacarpiano'],
    [/\bmetatarsal\b/gi, 'metatarso', 'metatarsiano'],
    [/\bphalanx\b/gi, 'falange', 'falange'],
    [/\bphalanges\b/gi, 'falanges', 'falanges'],
    [/\bcalcaneus\b/gi, 'calcâneo', 'calcáneo'],
    [/\bpatella\b/gi, 'patela', 'rótula'],
    [/\bsternum\b/gi, 'esterno', 'esternón'],
    [/\brib\b/gi, 'costela', 'costilla'],
    [/\bspine\b/gi, 'coluna vertebral', 'columna vertebral'],
    [/\bvertebral column\b/gi, 'coluna vertebral', 'columna vertebral'],

    /* ── Body regions ── */
    [/\bcervical region\b/gi, 'região cervical', 'región cervical'],
    [/\bthoracic region\b/gi, 'região torácica', 'región torácica'],
    [/\blumbar region\b/gi, 'região lombar', 'región lumbar'],
    [/\bsacral region\b/gi, 'região sacral', 'región sacra'],
    [/\blumbosacral region\b/gi, 'região lombossacral', 'región lumbosacra'],
    [/\boccipitoatlantoaxial region\b/gi, 'região occiptoatlantoaxial', 'región occiptoatlantoaxial'],
    [/\bcervicothoracic region\b/gi, 'região cervicotorácica', 'región cervicotorácica'],
    [/\bthoracolumbar region\b/gi, 'região toracolombar', 'región toracolumbar'],
    [/\bright hand\b/gi, 'mão direita', 'mano derecha'],
    [/\bleft hand\b/gi, 'mão esquerda', 'mano izquierda'],
    [/\bright arm\b/gi, 'braço direito', 'brazo derecho'],
    [/\bleft arm\b/gi, 'braço esquerdo', 'brazo izquierdo'],
    [/\bright leg\b/gi, 'perna direita', 'pierna derecha'],
    [/\bleft leg\b/gi, 'perna esquerda', 'pierna izquierda'],
    [/\bright foot\b/gi, 'pé direito', 'pie derecho'],
    [/\bleft foot\b/gi, 'pé esquerdo', 'pie izquierdo'],
    [/\bright knee\b/gi, 'joelho direito', 'rodilla derecha'],
    [/\bleft knee\b/gi, 'joelho esquerdo', 'rodilla izquierda'],
    [/\bright hip\b/gi, 'quadril direito', 'cadera derecha'],
    [/\bleft hip\b/gi, 'quadril esquerdo', 'cadera izquierda'],
    [/\bright shoulder\b/gi, 'ombro direito', 'hombro derecho'],
    [/\bleft shoulder\b/gi, 'ombro esquerdo', 'hombro izquierdo'],
    [/\bright elbow\b/gi, 'cotovelo direito', 'codo derecho'],
    [/\bleft elbow\b/gi, 'cotovelo esquerdo', 'codo izquierdo'],
    [/\bright wrist\b/gi, 'punho direito', 'muñeca derecha'],
    [/\bleft wrist\b/gi, 'punho esquerdo', 'muñeca izquierda'],
    [/\bright ankle\b/gi, 'tornozelo direito', 'tobillo derecho'],
    [/\bleft ankle\b/gi, 'tornozelo esquerdo', 'tobillo izquierdo'],
    [/\bright eye\b/gi, 'olho direito', 'ojo derecho'],
    [/\bleft eye\b/gi, 'olho esquerdo', 'ojo izquierdo'],
    [/\bright ear\b/gi, 'orelha direita', 'oído derecho'],
    [/\bleft ear\b/gi, 'orelha esquerda', 'oído izquierdo'],
    [/\bunspecified eye\b/gi, 'olho não especificado', 'ojo no especificado'],
    [/\bunspecified ear\b/gi, 'orelha não especificada', 'oído no especificado'],
    [/\bunspecified hand\b/gi, 'mão não especificada', 'mano no especificada'],
    [/\bunspecified arm\b/gi, 'braço não especificado', 'brazo no especificado'],
    [/\bunspecified leg\b/gi, 'perna não especificada', 'pierna no especificada'],
    [/\bunspecified foot\b/gi, 'pé não especificado', 'pie no especificado'],
    [/\bunspecified knee\b/gi, 'joelho não especificado', 'rodilla no especificada'],
    [/\bunspecified hip\b/gi, 'quadril não especificado', 'cadera no especificada'],
    [/\bunspecified shoulder\b/gi, 'ombro não especificado', 'hombro no especificado'],
    [/\bunspecified elbow\b/gi, 'cotovelo não especificado', 'codo no especificado'],
    [/\bunspecified wrist\b/gi, 'punho não especificado', 'muñeca no especificada'],
    [/\bunspecified ankle\b/gi, 'tornozelo não especificado', 'tobillo no especificado'],
    [/\bforearm\b/gi, 'antebraço', 'antebrazo'],
    [/\bupper arm\b/gi, 'braço', 'brazo'],
    [/\blower leg\b/gi, 'perna', 'pierna'],
    [/\bupper leg\b/gi, 'coxa', 'muslo'],
    [/\bupper back\b/gi, 'parte superior das costas', 'parte superior de la espalda'],
    [/\blower back\b/gi, 'parte inferior das costas', 'parte inferior de la espalda'],
    [/\babdominal wall\b/gi, 'parede abdominal', 'pared abdominal'],
    [/\bupper quadrant\b/gi, 'quadrante superior', 'cuadrante superior'],
    [/\blower quadrant\b/gi, 'quadrante inferior', 'cuadrante inferior'],
    [/\bright upper quadrant\b/gi, 'quadrante superior direito', 'cuadrante superior derecho'],
    [/\bright lower quadrant\b/gi, 'quadrante inferior direito', 'cuadrante inferior derecho'],
    [/\bleft upper quadrant\b/gi, 'quadrante superior esquerdo', 'cuadrante superior izquierdo'],
    [/\bleft lower quadrant\b/gi, 'quadrante inferior esquerdo', 'cuadrante inferior izquierdo'],
    [/\bepigastric\b/gi, 'epigástrico', 'epigástrico'],
    [/\bumbilical\b/gi, 'umbilical', 'umbilical'],
    [/\binguinal\b/gi, 'inguinal', 'inguinal'],

    /* ── Eyes ── */
    [/\bcataract\b/gi, 'catarata', 'catarata'],
    [/\bglaucoma\b/gi, 'glaucoma', 'glaucoma'],
    [/\bconjunctivitis\b/gi, 'conjuntivite', 'conjuntivitis'],
    [/\bretinal detachment\b/gi, 'descolamento de retina', 'desprendimiento de retina'],
    [/\bmacular degeneration\b/gi, 'degeneração macular', 'degeneración macular'],
    [/\bdiabetic macular edema\b/gi, 'edema macular diabético', 'edema macular diabético'],
    [/\bstrabismus\b/gi, 'estrabismo', 'estrabismo'],
    [/\bamblyopia\b/gi, 'ambliopia', 'ambliopía'],
    [/\bkeratoconus\b/gi, 'ceratocone', 'queratocono'],
    [/\buveitis\b/gi, 'uveíte', 'uveítis'],
    [/\biritis\b/gi, 'irite', 'iritis'],
    [/\boptic neuritis\b/gi, 'neurite óptica', 'neuritis óptica'],

    /* ── Ear ── */
    [/\botitis media\b/gi, 'otite média', 'otitis media'],
    [/\botitis externa\b/gi, 'otite externa', 'otitis externa'],
    [/\bhearing loss\b/gi, 'perda auditiva', 'pérdida auditiva'],
    [/\btinnitus\b/gi, 'zumbido', 'acúfenos'],
    [/\b[Mm]énière[']?s disease\b/g, "doença de Ménière", "enfermedad de Ménière"],
    [/\botosclerosis\b/gi, 'otosclerose', 'otosclerosis'],

    /* ── Gastrointestinal ── */
    [/\bgastroesophageal reflux disease\b/gi, 'doença do refluxo gastroesofágico (DRGE)', 'enfermedad por reflujo gastroesofágico (ERGE)'],
    [/\bgastroesophageal reflux\b/gi, 'refluxo gastroesofágico', 'reflujo gastroesofágico'],
    [/\bpeptic ulcer\b/gi, 'úlcera péptica', 'úlcera péptica'],
    [/\bgastric ulcer\b/gi, 'úlcera gástrica', 'úlcera gástrica'],
    [/\bduodenal ulcer\b/gi, 'úlcera duodenal', 'úlcera duodenal'],
    [/\bgastritis\b/gi, 'gastrite', 'gastritis'],
    [/\bcolitis\b/gi, 'colite', 'colitis'],
    [/\bcrohn[']?s disease\b/gi, "doença de Crohn", "enfermedad de Crohn"],
    [/\bulcerative colitis\b/gi, 'colite ulcerativa', 'colitis ulcerativa'],
    [/\birritable bowel syndrome\b/gi, 'síndrome do intestino irritável', 'síndrome del intestino irritable'],
    [/\bappendicitis\b/gi, 'apendicite', 'apendicitis'],
    [/\bcholecystitis\b/gi, 'colecistite', 'colecistitis'],
    [/\bcholelithiasis\b/gi, 'colelitíase', 'colelitiasis'],
    [/\bpancreatitis\b/gi, 'pancreatite', 'pancreatitis'],
    [/\bhepatitis\b/gi, 'hepatite', 'hepatitis'],
    [/\bcirrhosis\b/gi, 'cirrose', 'cirrosis'],
    [/\bliver failure\b/gi, 'insuficiência hepática', 'insuficiencia hepática'],
    [/\bdiverticulitis\b/gi, 'diverticulite', 'diverticulitis'],
    [/\bdiverticulosis\b/gi, 'diverticulose', 'diverticulosis'],
    [/\bintestinal obstruction\b/gi, 'obstrução intestinal', 'obstrucción intestinal'],
    [/\binguinal hernia\b/gi, 'hérnia inguinal', 'hernia inguinal'],
    [/\bumbilical hernia\b/gi, 'hérnia umbilical', 'hernia umbilical'],
    [/\bventral hernia\b/gi, 'hérnia ventral', 'hernia ventral'],
    [/\bhernia\b/gi, 'hérnia', 'hernia'],
    [/\brectal bleeding\b/gi, 'sangramento retal', 'sangrado rectal'],
    [/\bhemorrhoids\b/gi, 'hemorroidas', 'hemorroides'],
    [/\bperitonitis\b/gi, 'peritonite', 'peritonitis'],
    [/\besophagitis\b/gi, 'esofagite', 'esofagitis'],
    [/\bdysphagia\b/gi, 'disfagia', 'disfagia'],
    [/\bnausea and vomiting\b/gi, 'náusea e vômito', 'náuseas y vómitos'],
    [/\bnausea\b/gi, 'náusea', 'náusea'],
    [/\bvomiting\b/gi, 'vômito', 'vómito'],
    [/\bdiarrhea\b/gi, 'diarreia', 'diarrea'],
    [/\bconstipation\b/gi, 'constipação', 'estreñimiento'],
    [/\bfecal incontinence\b/gi, 'incontinência fecal', 'incontinencia fecal'],

    /* ── Kidney / Urinary ── */
    [/\bchronic kidney disease\b/gi, 'doença renal crônica', 'enfermedad renal crónica'],
    [/\bacute kidney injury\b/gi, 'lesão renal aguda', 'lesión renal aguda'],
    [/\bkidney failure\b/gi, 'insuficiência renal', 'insuficiencia renal'],
    [/\brenal failure\b/gi, 'insuficiência renal', 'insuficiencia renal'],
    [/\bglomerulonephritis\b/gi, 'glomerulonefrite', 'glomerulonefritis'],
    [/\bnephrotic syndrome\b/gi, 'síndrome nefrótico', 'síndrome nefrótico'],
    [/\bnephrolithiasis\b/gi, 'nefrolitíase', 'nefrolitiasis'],
    [/\burolithiasis\b/gi, 'urolitíase', 'urolitiasis'],
    [/\burinary tract infection\b/gi, 'infecção do trato urinário', 'infección del tracto urinario'],
    [/\bcystitis\b/gi, 'cistite', 'cistitis'],
    [/\bpyelonephritis\b/gi, 'pielonefrite', 'pielonefritis'],
    [/\bprostatic hyperplasia\b/gi, 'hiperplasia prostática', 'hiperplasia prostática'],
    [/\bbenign prostatic hyperplasia\b/gi, 'hiperplasia prostática benigna', 'hiperplasia prostática benigna'],
    [/\burinary incontinence\b/gi, 'incontinência urinária', 'incontinencia urinaria'],
    [/\bhematuria\b/gi, 'hematúria', 'hematuria'],
    [/\bproteinuria\b/gi, 'proteinúria', 'proteinuria'],
    [/\bpolycystic kidney\b/gi, 'rim policístico', 'riñón poliquístico'],

    /* ── Cancer / Neoplasms ── */
    [/\bmalignant neoplasm\b/gi, 'neoplasia maligna', 'neoplasia maligna'],
    [/\bbenign neoplasm\b/gi, 'neoplasia benigna', 'neoplasia benigna'],
    [/\bneoplasm of uncertain behavior\b/gi, 'neoplasia de comportamento incerto', 'neoplasia de comportamiento incierto'],
    [/\blung cancer\b/gi, 'câncer de pulmão', 'cáncer de pulmón'],
    [/\bbreast cancer\b/gi, 'câncer de mama', 'cáncer de mama'],
    [/\bcolon cancer\b/gi, 'câncer de cólon', 'cáncer de colon'],
    [/\brectal cancer\b/gi, 'câncer de reto', 'cáncer de recto'],
    [/\bcolorectal cancer\b/gi, 'câncer colorretal', 'cáncer colorrectal'],
    [/\bprostate cancer\b/gi, 'câncer de próstata', 'cáncer de próstata'],
    [/\bcervical cancer\b/gi, 'câncer do colo do útero', 'cáncer de cuello uterino'],
    [/\buterine cancer\b/gi, 'câncer uterino', 'cáncer uterino'],
    [/\bovarian cancer\b/gi, 'câncer de ovário', 'cáncer de ovario'],
    [/\bpancreatic cancer\b/gi, 'câncer de pâncreas', 'cáncer de páncreas'],
    [/\bgastric cancer\b/gi, 'câncer gástrico', 'cáncer gástrico'],
    [/\bstomach cancer\b/gi, 'câncer de estômago', 'cáncer de estómago'],
    [/\bskin cancer\b/gi, 'câncer de pele', 'cáncer de piel'],
    [/\bmelanoma\b/gi, 'melanoma', 'melanoma'],
    [/\bleukemia\b/gi, 'leucemia', 'leucemia'],
    [/\blymphoma\b/gi, 'linfoma', 'linfoma'],
    [/\bhodgkin lymphoma\b/gi, 'linfoma de Hodgkin', 'linfoma de Hodgkin'],
    [/\bnon-hodgkin lymphoma\b/gi, 'linfoma não-Hodgkin', 'linfoma no Hodgkin'],
    [/\bmultiple myeloma\b/gi, 'mieloma múltiplo', 'mieloma múltiple'],
    [/\bthyroid cancer\b/gi, 'câncer de tireoide', 'cáncer de tiroides'],
    [/\bladder cancer\b/gi, 'câncer de bexiga', 'cáncer de vejiga'],
    [/\bkidney cancer\b/gi, 'câncer de rim', 'cáncer de riñón'],
    [/\brenal cell carcinoma\b/gi, 'carcinoma de células renais', 'carcinoma de células renales'],
    [/\bhepatocellular carcinoma\b/gi, 'carcinoma hepatocelular', 'carcinoma hepatocelular'],
    [/\bnon-small cell lung cancer\b/gi, 'câncer de pulmão de células não pequenas', 'cáncer de pulmón de células no pequeñas'],
    [/\bsmall cell lung cancer\b/gi, 'câncer de pulmão de células pequenas', 'cáncer de pulmón de células pequeñas'],
    [/\badenoma\b/gi, 'adenoma', 'adenoma'],
    [/\bcarcinoma\b/gi, 'carcinoma', 'carcinoma'],
    [/\bsarcoma\b/gi, 'sarcoma', 'sarcoma'],
    [/\bglioma\b/gi, 'glioma', 'glioma'],
    [/\bmeningioma\b/gi, 'meningioma', 'meningioma'],
    [/\bbrain tumor\b/gi, 'tumor cerebral', 'tumor cerebral'],
    [/\bmetastasis\b/gi, 'metástase', 'metástasis'],
    [/\bmetastatic\b/gi, 'metastático', 'metastásico'],

    /* ── Endocrine ── */
    [/\bhypothyroidism\b/gi, 'hipotireoidismo', 'hipotiroidismo'],
    [/\bhyperthyroidism\b/gi, 'hipertireoidismo', 'hipertiroidismo'],
    [/\bthyroiditis\b/gi, 'tireoidite', 'tiroiditis'],
    [/\bHashimoto[']?s thyroiditis\b/gi, "tireoidite de Hashimoto", "tiroiditis de Hashimoto"],
    [/\bGraves[']? disease\b/gi, "doença de Graves", "enfermedad de Graves"],
    [/\badrenal insufficiency\b/gi, 'insuficiência adrenal', 'insuficiencia adrenal'],
    [/\bCushing[']?s syndrome\b/gi, "síndrome de Cushing", "síndrome de Cushing"],
    [/\bAddison[']?s disease\b/gi, "doença de Addison", "enfermedad de Addison"],
    [/\bpheochromocytoma\b/gi, 'feocromocitoma', 'feocromocitoma'],
    [/\bhyperparathyroidism\b/gi, 'hiperparatireoidismo', 'hiperparatiroidismo'],
    [/\bhypoparathyroidism\b/gi, 'hipoparatireoidismo', 'hipoparatiroidismo'],
    [/\bobesity\b/gi, 'obesidade', 'obesidad'],
    [/\boverweight\b/gi, 'sobrepeso', 'sobrepeso'],
    [/\bdyslipidemia\b/gi, 'dislipidemia', 'dislipidemia'],
    [/\bhypercholesterolemia\b/gi, 'hipercolesterolemia', 'hipercolesterolemia'],
    [/\bhypertriglyceridemia\b/gi, 'hipertrigliceridemia', 'hipertrigliceridemia'],
    [/\bhyperuricemia\b/gi, 'hiperuricemia', 'hiperuricemia'],
    [/\banemia\b/gi, 'anemia', 'anemia'],
    [/\biron deficiency anemia\b/gi, 'anemia ferropriva', 'anemia ferropénica'],
    [/\bvitamin B12 deficiency\b/gi, 'deficiência de vitamina B12', 'deficiencia de vitamina B12'],
    [/\bfolate deficiency\b/gi, 'deficiência de folato', 'deficiencia de folato'],
    [/\bvitamin D deficiency\b/gi, 'deficiência de vitamina D', 'deficiencia de vitamina D'],

    /* ── Skin ── */
    [/\bdermatitis\b/gi, 'dermatite', 'dermatitis'],
    [/\bpsoriasis\b/gi, 'psoríase', 'psoriasis'],
    [/\beczema\b/gi, 'eczema', 'eccema'],
    [/\burticaria\b/gi, 'urticária', 'urticaria'],
    [/\bancne\b/gi, 'acne', 'acné'],
    [/\brosacea\b/gi, 'rosácea', 'rosácea'],
    [/\balopecia\b/gi, 'alopecia', 'alopecia'],
    [/\bcellulitis\b/gi, 'celulite', 'celulitis'],
    [/\bimpetigo\b/gi, 'impetigo', 'impétigo'],
    [/\bherpes zoster\b/gi, 'herpes zoster', 'herpes zóster'],
    [/\bherpes simplex\b/gi, 'herpes simples', 'herpes simple'],
    [/\bwart\b/gi, 'verruga', 'verruga'],
    [/\bpressure ulcer\b/gi, 'úlcera de pressão', 'úlcera por presión'],
    [/\bcontact dermatitis\b/gi, 'dermatite de contato', 'dermatitis de contacto'],
    [/\bseborrheic dermatitis\b/gi, 'dermatite seborreica', 'dermatitis seborreica'],
    [/\birritant contact dermatitis\b/gi, 'dermatite de contato irritativa', 'dermatitis de contacto irritante'],
    [/\ballergic contact dermatitis\b/gi, 'dermatite alérgica de contato', 'dermatitis alérgica de contacto'],
    [/\bburn\b/gi, 'queimadura', 'quemadura'],
    [/\bscald\b/gi, 'escaldadura', 'escaldadura'],
    [/\bwound\b/gi, 'ferida', 'herida'],
    [/\blaceration\b/gi, 'laceração', 'laceración'],
    [/\bcontusion\b/gi, 'contusão', 'contusión'],
    [/\babrasion\b/gi, 'abrasão', 'abrasión'],
    [/\bpuncture wound\b/gi, 'ferida perfurante', 'herida punzante'],

    /* ── Infectious diseases ── */
    [/\bchickenpox\b/gi, 'catapora', 'varicela'],
    [/\bvaricella\b/gi, 'varicela', 'varicela'],
    [/\bcholera\b/gi, 'cólera', 'cólera'],
    [/\btyphoid\b/gi, 'febre tifoide', 'fiebre tifoidea'],
    [/\bsalmonella\b/gi, 'salmonela', 'salmonela'],
    [/\bmalaria\b/gi, 'malária', 'malaria'],
    [/\bdengue\b/gi, 'dengue', 'dengue'],
    [/\bzika\b/gi, 'zika', 'zika'],
    [/\bchikungunya\b/gi, 'chikungunya', 'chikungunya'],
    [/\bHIV\b/g, 'HIV', 'VIH'],
    [/\bAIDS\b/g, 'SIDA/AIDS', 'SIDA'],
    [/\bsepsis\b/gi, 'sepse', 'sepsis'],
    [/\bsepticemia\b/gi, 'septicemia', 'septicemia'],
    [/\bbacteremia\b/gi, 'bacteremia', 'bacteriemia'],
    [/\bmeningococcal\b/gi, 'meningocócico', 'meningocócico'],
    [/\bpneumococcal\b/gi, 'pneumocócico', 'neumocócico'],
    [/\bstaphylococcal\b/gi, 'estafilocócico', 'estafilocócico'],
    [/\bstreptococcal\b/gi, 'estreptocócico', 'estreptocócico'],
    [/\binfection\b/gi, 'infecção', 'infección'],
    [/\binfectious\b/gi, 'infeccioso', 'infeccioso'],

    /* ── Reproductive / Pregnancy ── */
    [/\bpregnancy\b/gi, 'gravidez', 'embarazo'],
    [/\bchildbirth\b/gi, 'parto', 'parto'],
    [/\bdelivery\b/gi, 'parto', 'parto'],
    [/\bmiscarriage\b/gi, 'aborto espontâneo', 'aborto espontáneo'],
    [/\babortion\b/gi, 'aborto', 'aborto'],
    [/\bpreeclampsia\b/gi, 'pré-eclâmpsia', 'preeclampsia'],
    [/\beclampsia\b/gi, 'eclâmpsia', 'eclampsia'],
    [/\bgestational diabetes\b/gi, 'diabetes gestacional', 'diabetes gestacional'],
    [/\bmenstrual disorder\b/gi, 'transtorno menstrual', 'trastorno menstrual'],
    [/\bendometriosis\b/gi, 'endometriose', 'endometriosis'],
    [/\buterine fibroids\b/gi, 'miomas uterinos', 'miomas uterinos'],
    [/\bovarian cyst\b/gi, 'cisto ovariano', 'quiste ovárico'],
    [/\bpolycystic ovary syndrome\b/gi, 'síndrome dos ovários policísticos', 'síndrome del ovario poliquístico'],
    [/\bamenorrhea\b/gi, 'amenorreia', 'amenorrea'],
    [/\bdysmenorrhea\b/gi, 'dismenorreia', 'dismenorrea'],
    [/\bmenorrhagia\b/gi, 'menorragia', 'menorragia'],
    [/\binfertility\b/gi, 'infertilidade', 'infertilidad'],
    [/\bectopic pregnancy\b/gi, 'gravidez ectópica', 'embarazo ectópico'],
    [/\bplacenta previa\b/gi, 'placenta prévia', 'placenta previa'],
    [/\bneonatal\b/gi, 'neonatal', 'neonatal'],
    [/\bnewborn\b/gi, 'recém-nascido', 'recién nacido'],
    [/\bcongenital\b/gi, 'congênito', 'congénito'],

    /* ── Injuries / Trauma ── */
    [/\btrauma\b/gi, 'trauma', 'trauma'],
    [/\binjury\b/gi, 'lesão', 'lesión'],
    [/\binjured\b/gi, 'acidentado', 'lesionado'],
    [/\baccident\b/gi, 'acidente', 'accidente'],
    [/\bmotor vehicle accident\b/gi, 'acidente de veículo motorizado', 'accidente de vehículo de motor'],
    [/\bfall\b/gi, 'queda', 'caída'],
    [/\bconcussion\b/gi, 'concussão', 'conmoción cerebral'],
    [/\btraumatic brain injury\b/gi, 'traumatismo craniencefálico', 'traumatismo craneoencefálico'],
    [/\bspinal cord injury\b/gi, 'lesão medular', 'lesión medular'],
    [/\bamputation\b/gi, 'amputação', 'amputación'],
    [/\bforeign body\b/gi, 'corpo estranho', 'cuerpo extraño'],
    [/\bopen wound\b/gi, 'ferida aberta', 'herida abierta'],
    [/\bpoisoning\b/gi, 'intoxicação', 'intoxicación'],
    [/\boverdose\b/gi, 'superdosagem', 'sobredosis'],
    [/\bvenomous\b/gi, 'venenoso', 'venenoso'],
    [/\bsnakebite\b/gi, 'picada de cobra', 'mordedura de serpiente'],
    [/\binsect bite\b/gi, 'picada de inseto', 'picadura de insecto'],
    [/\bdrowning\b/gi, 'afogamento', 'ahogamiento'],
    [/\bsuffocation\b/gi, 'sufocação', 'sofocación'],
    [/\belectric shock\b/gi, 'choque elétrico', 'descarga eléctrica'],

    /* ── Common medical terms ── */
    [/\bpain\b/gi, 'dor', 'dolor'],
    [/\bacute pain\b/gi, 'dor aguda', 'dolor agudo'],
    [/\bchronic pain\b/gi, 'dor crônica', 'dolor crónico'],
    [/\bfever\b/gi, 'febre', 'fiebre'],
    [/\bfatigue\b/gi, 'fadiga', 'fatiga'],
    [/\bweakness\b/gi, 'fraqueza', 'debilidad'],
    [/\bswelling\b/gi, 'inchaço', 'hinchazón'],
    [/\bedema\b/gi, 'edema', 'edema'],
    [/\bhemorrhage\b/gi, 'hemorragia', 'hemorragia'],
    [/\bbleeding\b/gi, 'sangramento', 'sangrado'],
    [/\bthrombosis\b/gi, 'trombose', 'trombosis'],
    [/\bembolism\b/gi, 'embolia', 'embolia'],
    [/\binflammation\b/gi, 'inflamação', 'inflamación'],
    [/\bnecrosis\b/gi, 'necrose', 'necrosis'],
    [/\bfibrosis\b/gi, 'fibrose', 'fibrosis'],
    [/\batrophy\b/gi, 'atrofia', 'atrofia'],
    [/\bhypertrophy\b/gi, 'hipertrofia', 'hipertrofia'],
    [/\bdysplasia\b/gi, 'displasia', 'displasia'],
    [/\bhyperplasia\b/gi, 'hiperplasia', 'hiperplasia'],
    [/\babnormal\b/gi, 'anormal', 'anormal'],
    [/\bchronic\b/gi, 'crônico', 'crónico'],
    [/\bacute\b/gi, 'agudo', 'agudo'],
    [/\brecurrent\b/gi, 'recorrente', 'recurrente'],
    [/\bpersistent\b/gi, 'persistente', 'persistente'],
    [/\bsevere\b/gi, 'grave', 'grave'],
    [/\bmild\b/gi, 'leve', 'leve'],
    [/\bmoderate\b/gi, 'moderado', 'moderado'],
    [/\bbilateral\b/gi, 'bilateral', 'bilateral'],
    [/\bunilateral\b/gi, 'unilateral', 'unilateral'],
    [/\bstage\b/gi, 'estágio', 'estadio'],
    [/\bgrade\b/gi, 'grau', 'grado'],
    [/\btype\b/gi, 'tipo', 'tipo'],
    [/\bsyndrome\b/gi, 'síndrome', 'síndrome'],
    [/\bdisorder\b/gi, 'transtorno', 'trastorno'],
    [/\bdisease\b/gi, 'doença', 'enfermedad'],
    [/\bcondition\b/gi, 'condição', 'condición'],
    [/\bcomplication\b/gi, 'complicação', 'complicación'],
    [/\bdeformity\b/gi, 'deformidade', 'deformidad'],
    [/\bdefect\b/gi, 'defeito', 'defecto'],
    [/\bdysfunction\b/gi, 'disfunção', 'disfunción'],
    [/\binsufficiency\b/gi, 'insuficiência', 'insuficiencia'],
    [/\bdeficiency\b/gi, 'deficiência', 'deficiencia'],
    [/\bexcess\b/gi, 'excesso', 'exceso'],
    [/\bstenosis\b/gi, 'estenose', 'estenosis'],
    [/\bobstruction\b/gi, 'obstrução', 'obstrucción'],
    [/\brupture\b/gi, 'ruptura', 'ruptura'],
    [/\bperforation\b/gi, 'perfuração', 'perforación'],
    [/\bmass\b/gi, 'massa', 'masa'],
    [/\bcyst\b/gi, 'cisto', 'quiste'],
    [/\bpolyp\b/gi, 'pólipo', 'pólipo'],
    [/\blesion\b/gi, 'lesão', 'lesión'],
    [/\bulcer\b/gi, 'úlcera', 'úlcera'],
    [/\bfistula\b/gi, 'fístula', 'fístula'],
    [/\babscess\b/gi, 'abscesso', 'absceso'],
    [/\bcalculus\b/gi, 'cálculo', 'cálculo'],
    [/\bstone\b/gi, 'pedra', 'piedra'],
    [/\btumor\b/gi, 'tumor', 'tumor'],
    [/\bgrowth\b/gi, 'crescimento anormal', 'crecimiento anormal'],
    [/\bsclerosis\b/gi, 'esclerose', 'esclerosis'],
    [/\bocclusion\b/gi, 'oclusão', 'oclusión'],
    [/\bspasm\b/gi, 'espasmo', 'espasmo'],
    [/\bparalysis\b/gi, 'paralisia', 'parálisis'],
    [/\bparesis\b/gi, 'paresia', 'paresia'],
    [/\bcontracture\b/gi, 'contratura', 'contractura'],
    [/\binstability\b/gi, 'instabilidade', 'inestabilidad'],
    [/\bhypersensitivity\b/gi, 'hipersensibilidade', 'hipersensibilidad'],
    [/\ballergy\b/gi, 'alergia', 'alergia'],
    [/\banaphylaxis\b/gi, 'anafilaxia', 'anafilaxia'],
    [/\bautoimmune\b/gi, 'autoimune', 'autoinmune'],
    [/\bimmune\b/gi, 'imune', 'inmune'],
    [/\btransplant\b/gi, 'transplante', 'trasplante'],
    [/\bgraft\b/gi, 'enxerto', 'injerto'],
    [/\bprosthesis\b/gi, 'prótese', 'prótesis'],
    [/\bimplant\b/gi, 'implante', 'implante'],
    [/\bsurgery\b/gi, 'cirurgia', 'cirugía'],
    [/\boperation\b/gi, 'operação', 'operación'],
    [/\bprocedure\b/gi, 'procedimento', 'procedimiento'],
    [/\btherapy\b/gi, 'terapia', 'terapia'],
    [/\btreatment\b/gi, 'tratamento', 'tratamiento'],
    [/\bmedication\b/gi, 'medicação', 'medicación'],
    [/\bdrug\b/gi, 'fármaco', 'fármaco'],
    [/\bscreening\b/gi, 'rastreamento', 'tamizaje'],
    [/\bexamination\b/gi, 'exame', 'examen'],
    [/\bdiagnosis\b/gi, 'diagnóstico', 'diagnóstico'],
    [/\bsymptom\b/gi, 'sintoma', 'síntoma'],
    [/\bsign\b/gi, 'sinal', 'signo'],
    [/\bfinding\b/gi, 'achado', 'hallazgo'],
    [/\bhistory\b/gi, 'história', 'historia'],
    [/\bstatus\b/gi, 'estado', 'estado'],
    [/\bfollow-up\b/gi, 'acompanhamento', 'seguimiento'],
    [/\bsurveillance\b/gi, 'vigilância', 'vigilancia'],
    [/\bpreventive\b/gi, 'preventivo', 'preventivo'],
    [/\bprophylactic\b/gi, 'profilático', 'profiláctico'],
    [/\brehabilitation\b/gi, 'reabilitação', 'rehabilitación'],
    [/\bpalliative\b/gi, 'paliativo', 'paliativo'],

    /* ── Laterality / Position ── */
    [/\bright\b/gi, 'direito', 'derecho'],
    [/\bleft\b/gi, 'esquerdo', 'izquierdo'],
    [/\bunspecified\b/gi, 'não especificado', 'no especificado'],
    [/\bbilateral\b/gi, 'bilateral', 'bilateral'],
    [/\bproximal\b/gi, 'proximal', 'proximal'],
    [/\bdistal\b/gi, 'distal', 'distal'],
    [/\bmedial\b/gi, 'medial', 'medial'],
    [/\blateral\b/gi, 'lateral', 'lateral'],
    [/\banterior\b/gi, 'anterior', 'anterior'],
    [/\bposterior\b/gi, 'posterior', 'posterior'],
    [/\bsuperior\b/gi, 'superior', 'superior'],
    [/\binferior\b/gi, 'inferior', 'inferior'],
    [/\bexternal\b/gi, 'externo', 'externo'],
    [/\binternal\b/gi, 'interno', 'interno'],
    [/\bupper\b/gi, 'superior', 'superior'],
    [/\blower\b/gi, 'inferior', 'inferior'],
    [/\bother\b/gi, 'outro', 'otro'],
    [/\bmultiple\b/gi, 'múltiplo', 'múltiple'],
    [/\bsingle\b/gi, 'único', 'único'],
    [/\bprimary\b/gi, 'primário', 'primario'],
    [/\bsecondary\b/gi, 'secundário', 'secundario'],
    [/\binitial\b/gi, 'inicial', 'inicial'],
    [/\bsubsequent\b/gi, 'subsequente', 'subsecuente'],
    [/\bdue to\b/gi, 'devido a', 'debido a'],
    [/\bcaused by\b/gi, 'causado por', 'causado por'],
    [/\binvolving\b/gi, 'envolvendo', 'que involucra'],
    [/\bassociated with\b/gi, 'associado a', 'asociado con'],
    [/\bwithout\b/gi, 'sem', 'sin'],
    [/\bwith\b/gi, 'com', 'con'],
    [/\band\b/gi, 'e', 'y'],
    [/\bor\b/gi, 'ou', 'o'],
    [/\bof\b/gi, 'de', 'de'],
    [/\bfor\b/gi, 'para', 'para'],
    [/\bat\b/gi, 'em', 'en'],
    [/\bin\b/gi, 'em', 'en'],
    [/\bto\b/gi, 'para', 'a'],
    [/\bby\b/gi, 'por', 'por'],
    [/\ba\b/gi, 'um', 'un'],

    /* ── Activity codes ── */
    [/\bactivity,\b/gi, 'atividade,', 'actividad,'],
    [/\bother caregiving\b/gi, 'outros cuidados', 'otros cuidados'],
  ];

  /* Translate EN description to target language */
  function translateDesc(en, targetLang) {
    if (!en || targetLang === 'en') return en;
    var idx = (targetLang === 'es') ? 2 : 1; /* 1=PT, 2=ES */
    var result = en;
    for (var i = 0; i < TRANS.length; i++) {
      result = result.replace(TRANS[i][0], TRANS[i][idx]);
    }
    return result;
  }

  /* ═══════════════════════════════════════════════════════════
     CODE NORMALIZATION
     Handles: F20 → F20*, F20.0 → F200, 200 → search all
  ═══════════════════════════════════════════════════════════ */

  function normalizeCode(raw) {
    var t = String(raw).trim().toUpperCase();
    /* Remove dots and spaces */
    t = t.replace(/[\s.]/g, '');
    return t;
  }

  /* ═══════════════════════════════════════════════════════════
     ICD DATA STORE
     Loaded once via fetch(), stored in _icdMap
  ═══════════════════════════════════════════════════════════ */

  var _icdMap = null;     /* {CODE: 'description', ...} */
  var _loadState = 'idle'; /* idle | loading | ready | error */
  var _loadQueue = [];     /* callbacks waiting for data */

  /* JSON path — same directory as this script */
  var JSON_URL = (function() {
    /* Find script tag src to derive base path */
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      if (src.indexOf('kb-medicine') >= 0) {
        return src.replace(/kb-medicine\.js[^/]*$/, '') + 'icd10cm_codes_2022-2.json';
      }
    }
    return 'icd10cm_codes_2022-2.json';
  }());

  function loadICD(callback) {
    if (_loadState === 'ready') { callback(true); return; }
    if (_loadState === 'error') { callback(false); return; }
    _loadQueue.push(callback);
    if (_loadState === 'loading') return;
    _loadState = 'loading';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', JSON_URL, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);
          _icdMap = {};
          for (var i = 0; i < data.length; i++) {
            _icdMap[data[i].code] = data[i].description;
          }
          _loadState = 'ready';
          for (var j = 0; j < _loadQueue.length; j++) _loadQueue[j](true);
          _loadQueue = [];
        } catch(e) {
          _loadState = 'error';
          for (var k = 0; k < _loadQueue.length; k++) _loadQueue[k](false);
          _loadQueue = [];
        }
      } else {
        _loadState = 'error';
        for (var m = 0; m < _loadQueue.length; m++) _loadQueue[m](false);
        _loadQueue = [];
      }
    };
    xhr.send();
  }

  /* Start loading immediately */
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { loadICD(function(){}); });
    } else {
      loadICD(function(){});
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PUBLIC API
  ═══════════════════════════════════════════════════════════ */

  /* Synchronous lookup (works after data is loaded) */
  W.lookupICDCode = function(rawCode, lang) {
    var lc = lang || 'pt';
    if (!_icdMap) return null;

    var code = normalizeCode(rawCode);
    var desc = null;

    /* 1. Exact match */
    if (_icdMap[code]) {
      desc = _icdMap[code];
      return { label: translateDesc(desc, lc), detail: null };
    }

    /* 2. Prefix match — return first match + count */
    var matches = [];
    var keys = Object.keys(_icdMap);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(code) === 0) {
        matches.push({ code: keys[i], desc: _icdMap[keys[i]] });
      }
    }

    if (matches.length === 0) return null;
    if (matches.length === 1) {
      return { label: translateDesc(matches[0].desc, lc), detail: null };
    }

    /* Multiple subcodes — build a summary */
    var lines = [];
    var limit = Math.min(matches.length, 15);
    for (var j = 0; j < limit; j++) {
      lines.push(matches[j].code + ' — ' + translateDesc(matches[j].desc, lc));
    }
    if (matches.length > 15) {
      lines.push('... (' + (matches.length - 15) + (lc === 'pt' ? ' mais' : lc === 'es' ? ' más' : ' more') + ')');
    }

    var heading = lc === 'pt' ? 'Subcódigos para ' + code + ':' :
                  lc === 'es' ? 'Subcódigos para ' + code + ':' :
                  'Subcodes for ' + code + ':';

    return { label: heading, detail: lines.join('\n') };
  };

  /* Async lookup — callback(result) where result may be null */
  W.lookupICDAsync = function(rawCode, lang, callback) {
    loadICD(function(ok) {
      if (!ok) { callback(null); return; }
      callback(W.lookupICDCode(rawCode, lang));
    });
  };

  /* Check if ICD data is ready */
  W.icdReady = function() { return _loadState === 'ready'; };
  W.icdLoading = function() { return _loadState === 'loading'; };

  /* ═══════════════════════════════════════════════════════════
     KB PLUGIN: medical topics (non-ICD knowledge)
  ═══════════════════════════════════════════════════════════ */

  var ICD_DETAIL = {
    'F20':{ pt:{label:'Esquizofrenia',detail:'Transtorno psicótico crônico: delírios, alucinações, pensamento desorganizado, embotamento afetivo. Início típico: 15–35 anos. Hipótese dopaminérgica. Tratamento: antipsicóticos (haloperidol, risperidona, olanzapina, clozapina para refratários) + reabilitação psicossocial. Prevalência ~1% mundial.'},
             en:{label:'Schizophrenia',detail:'Chronic psychotic disorder: delusions, hallucinations, disorganized thinking, flat affect. Typical onset: 15–35 years. Dopamine hypothesis. Treatment: antipsychotics (haloperidol, risperidone, olanzapine, clozapine for refractory) + psychosocial rehabilitation. ~1% worldwide prevalence.'},
             es:{label:'Esquizofrenia',detail:'Trastorno psicótico crónico: delirios, alucinaciones, pensamiento desorganizado. Inicio: 15–35 años. Tratamiento: antipsicóticos + rehabilitación psicosocial. Prevalencia ~1%.'}},
    'F31':{ pt:{label:'Transtorno bipolar',detail:'Episódios alternantes de mania (euforia, grandiosidade, impulsividade, pouco sono) e depressão. Tipo I: mania plena; Tipo II: hipomania+depressão. Tratamento: lítio (reduz suicídio), valproato, lamotrigina, antipsicóticos atípicos (quetiapina). Manutenção a longo prazo é essencial.'},
             en:{label:'Bipolar disorder',detail:'Alternating mania (euphoria, grandiosity, impulsivity, decreased sleep) and depression. Type I: full mania; Type II: hypomania+depression. Treatment: lithium (reduces suicide), valproate, lamotrigine, atypical antipsychotics (quetiapine). Long-term maintenance essential.'},
             es:{label:'Trastorno bipolar',detail:'Alternancia entre manía y depresión. Tipo I: manía plena; Tipo II: hipomanía. Tratamiento: litio, valproato, lamotrigina, antipsicóticos atípicos. Mantenimiento a largo plazo esencial.'}},
    'F32':{ pt:{label:'Episódio depressivo',detail:'Humor deprimido, anedonia, fadiga, alterações de sono/apetite, concentração reduzida, sentimentos de culpa, pensamentos de morte ≥2 semanas. Tratamento: ISRS (fluoxetina, sertralina, escitalopram), ISRN (venlafaxina, duloxetina), TCC, para refratários: ECT, esketamina nasal.'},
             en:{label:'Depressive episode',detail:'Depressed mood, anhedonia, fatigue, sleep/appetite changes, poor concentration, guilt, thoughts of death ≥2 weeks. Treatment: SSRIs (fluoxetine, sertraline, escitalopram), SNRIs (venlafaxine, duloxetine), CBT, for refractory: ECT, nasal esketamine.'},
             es:{label:'Episodio depresivo',detail:'Humor deprimido, anhedonia, fatiga ≥2 semanas. Tratamiento: ISRS (fluoxetina, sertralina), IRSN (venlafaxina), TCC, ECT en refractarios.'}},
    'I10':{ pt:{label:'Hipertensão arterial essencial',detail:'PA ≥130/80 mmHg. 1,28 bilhões de adultos. Principal causa de AVC e IAM. Geralmente assintomática. Tratamento escalonado: estilo de vida → IECA/BRA + tiazídico + BCC → espironolactona + beta-bloqueador. Meta <130/80.'},
             en:{label:'Essential hypertension',detail:'BP ≥130/80 mmHg. 1.28 billion adults. #1 cause of stroke and MI. Usually asymptomatic. Treatment ladder: lifestyle → ACE inhibitor/ARB + thiazide + CCB → spironolactone + beta-blocker. Target <130/80.'},
             es:{label:'Hipertensión arterial esencial',detail:'PA ≥130/80 mmHg. 1.280 millones de adultos. Principal causa de ACV e IAM. Tratamiento: estilo de vida + IECA/ARA2 + tiazida + BCC. Meta <130/80.'}},
    'E11':{ pt:{label:'Diabetes tipo 2',detail:'Resistência insulínica + falência progressiva de células β. Diagnóstico: glicemia jejum ≥126 mg/dL ×2, HbA1c ≥6,5%. Metas: HbA1c <7%, PA <130/80, LDL <70. Tratamento: metformina (1ª linha) + SGLT2i (dapagliflozina) + GLP-1RA (semaglutida). Complicações: retinopatia, nefropatia, neuropatia, IAM, AVC.'},
             en:{label:'Type 2 diabetes',detail:'Insulin resistance + progressive β-cell failure. Diagnosis: fasting glucose ≥126 mg/dL ×2, HbA1c ≥6.5%. Targets: HbA1c <7%, BP <130/80, LDL <70. Treatment: metformin (1st line) + SGLT2i (dapagliflozin) + GLP-1RA (semaglutide). Complications: retinopathy, nephropathy, neuropathy, MI, stroke.'},
             es:{label:'Diabetes tipo 2',detail:'Resistencia insulínica + falla progresiva de células β. Diagnóstico: glucemia ≥126 ×2, HbA1c ≥6,5%. Tratamiento: metformina + SGLT2i (dapagliflozina) + GLP-1RA (semaglutida). Complicaciones: retinopatía, nefropatía, neuropatía, IAM, ACV.'}},
    'J44':{ pt:{label:'DPOC',detail:'Obstrução irreversível do fluxo aéreo. Causa: tabagismo (85%). VEF₁/CVF <0,70. Tratamento estável: cessação tabágica, broncodilatadores (LAMA>LABA), reabilitação pulmonar, O₂ domiciliar. Exacerbação: corticoide + broncodilatador + ATB se infecção.'},
             en:{label:'COPD',detail:'Irreversible airflow obstruction. Cause: smoking (85%). FEV₁/FVC <0.70. Stable treatment: smoking cessation, bronchodilators (LAMA>LABA), pulmonary rehabilitation, home O₂. Exacerbation: systemic corticosteroid + bronchodilator + antibiotic if infection.'},
             es:{label:'EPOC',detail:'Obstrucción irreversible. Causa: tabaquismo (85%). FEV₁/FVC <0,70. Tratamiento: cese tabáquico, LAMA, LABA, rehabilitación pulmonar. Exacerbación: corticoide + broncodilatador + antibiótico.'}},
    'I50':{ pt:{label:'Insuficiência cardíaca',detail:'IC sistólica: FEVE<40%. IC diastólica: FEVE≥50%. Sintomas: dispneia, ortopneia, edema MMII, BNP elevado. NYHA I–IV. Tratamento FEVEr (4 pilares): IECA/sacubitril-valsartana + betabloqueador + espironolactona + SGLT2i (dapagliflozina).'},
             en:{label:'Heart failure',detail:'Systolic HF: EF<40%. Diastolic HF: EF≥50%. Symptoms: exertional→resting dyspnea, orthopnea, lower limb edema, elevated BNP/NT-proBNP. NYHA I–IV. HFrEF treatment (4 pillars): ACE inhibitor/sacubitril-valsartan + beta-blocker + spironolactone + SGLT2i (dapagliflozin).'},
             es:{label:'Insuficiencia cardíaca',detail:'IC sistólica: FEVI<40%. Síntomas: disnea, ortopnea, edema. NYHA I–IV. Tratamiento FEVIr: IECA/sacubitril-valsartán + betabloqueador + espironolactona + SGLT2i.'}},
    'B20':{ pt:{label:'HIV/SIDA',detail:'Retrovírus que destrói linfócitos TCD4+. CD4+ <200: SIDA. TARV: TDF+3TC+DTG — carga viral suprimida em >95%. PrEP: TDF/FTC diário (>99%). PEP: profilaxia pós-exposição em <72h.'},
             en:{label:'HIV/AIDS',detail:'Retrovirus destroying TCD4+ lymphocytes. CD4+ <200: AIDS. ART: TDF+3TC+DTG regimen — viral load suppressed in >95%. PrEP: daily TDF/FTC (>99% efficacy). PEP: post-exposure prophylaxis within 72h.'},
             es:{label:'VIH/SIDA',detail:'Retrovirus que destruye TCD4+. CD4+ <200: SIDA. TAR: TDF+3TC+DTG suprime carga viral en >95%. PrEP: TDF/FTC diario (>99%). Esperanza de vida casi normal con TAR.'}}
  };

  /* Enhanced lookupICDCode — tries detail map first, then JSON */
  var _origLookup = W.lookupICDCode;
  W.lookupICDCode = function(rawCode, lang) {
    var lc = lang || 'pt';
    var code = normalizeCode(rawCode);
    /* 1. Check curated detail map (3-char base code) */
    var base = code.slice(0, 3);
    if (ICD_DETAIL[base]) {
      var d = ICD_DETAIL[base][lc] || ICD_DETAIL[base]['pt'];
      if (d) return { label: d.label, detail: d.detail };
    }
    /* 2. Fall back to JSON map */
    return _origLookup ? _origLookup(rawCode, lang) : null;
  };

  /* ── chat.js integration: async ICD handler ── */
  /* Override the synchronous path to support async loading */
  W.__icdLookupAsync = function(rawCode, lang, deliverFn) {
    if (_loadState === 'ready') {
      return W.lookupICDCode(rawCode, lang);
    }
    /* Data not ready — deliver loading message, then real answer */
    var lc = lang || 'pt';
    var loading = lc === 'pt' ? '⏳ Carregando base CID-10 (72.748 códigos)…' :
                  lc === 'es' ? '⏳ Cargando base CIE-10 (72.748 códigos)…' :
                                '⏳ Loading ICD-10 database (72,748 codes)…';
    loadICD(function(ok) {
      if (!ok) {
        var err = lc === 'pt' ? '❌ Falha ao carregar dados CID-10. Verifique: https://icd.who.int' :
                  lc === 'es' ? '❌ Error al cargar datos CIE-10. Consulte: https://icd.who.int' :
                                '❌ Failed to load ICD-10 data. See: https://icd.who.int';
        if (deliverFn) deliverFn(err);
        return;
      }
      var r = W.lookupICDCode(rawCode, lang);
      if (!r) {
        var nf = lc === 'pt' ? 'Código não encontrado na base CID-10 2022.' :
                 lc === 'es' ? 'Código no encontrado en la base CIE-10 2022.' :
                               'Code not found in ICD-10 2022 database.';
        if (deliverFn) deliverFn(nf);
        return;
      }
      var txt = (lc === 'pt' ? 'CID-10: ' : lc === 'es' ? 'CIE-10: ' : 'ICD-10: ') +
                normalizeCode(rawCode) + ' — ' + r.label;
      if (r.detail) txt += '\n\n' + r.detail;
      txt += '\n\n⚠ ' + (lc === 'pt' ? 'Informação educacional. Consulte um profissional de saúde.' :
                         lc === 'es' ? 'Solo educativo. Consulte a un profesional de salud.' :
                                       'Educational only. Consult a healthcare professional.');
      if (deliverFn) deliverFn(txt);
    });
    return loading; /* returned synchronously while loading */
  };

  /* ── Knowledge base plugin ── */
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'medicine',
    priority: 8,
    lang: {
      pt: {
        'cid10': 'CID-10 (Classificação Internacional de Doenças, 10ª revisão, OMS). Base completa com 72.748 códigos. Estrutura: letra (capítulo) + 2 dígitos + subdivisão. Exemplos: A-B infecciosas, C-D neoplasias, E endócrinas, F mentais, G neurológicas, I cardiovasculares, J respiratórias, K digestivas, L pele, M osteomusculares, N geniturinárias, O gravidez, S-T traumas. Digite qualquer código (ex: F20, I21, E11, J45, F20.0, F200) para consulta.',
        'sinais_vitais': 'PA normal: <120/80 mmHg. FC: 60-100 bpm. FR: 12-20 irpm. SpO₂: ≥95%. Temperatura: 36-37,5°C (febre >37,8°C). Glasgow: 15=normal, ≤8=grave. Dor: EVA 0–10. Diurese: >0,5 mL/kg/h.',
        'hemograma': 'Hb: 13-17 g/dL (H), 12-16 (M). Leucócitos: 4.000-11.000/mm³. Plaquetas: 150.000-400.000/mm³. VCM: 80-100 fL.',
        'bioquimica': 'Glicemia jejum: 70-99 normal, 100-125 pré-DM, ≥126 DM. HbA1c: <5,7% normal, ≥6,5% DM. Creatinina: 0,7-1,2 (H) mg/dL. TGP/ALT: <41 U/L. TSH: 0,4-4,0 mUI/L.',
        'lipidograma': 'Colesterol total: <200 desejável. LDL: <100 ótimo (risco alto <70). HDL: >40 (H), >50 (M). TG: <150 normal. Estatinas alta intensidade: ≥50% redução LDL.',
        'antibioticos': 'Mecanismos: parede celular (β-lactâmicos, vancomicina), membrana (polimixinas), proteína 50S (macrolídeos, clindamicina), 30S (aminoglicosídeos, tetraciclinas), DNA (quinolonas, metronidazol), folato (TMP-SMX). Resistência: β-lactamases (ESBL, KPC).',
        'emergencias': 'PCR: RCP 30:2 + DEA. Anafilaxia: adrenalina IM 0,5mg. Sepse: hemoculturas + ATB + fluidos 30mL/kg. AVC: alteplase IV até 4,5h + trombectomia até 24h. CAD: insulina IV + hidratação. IAMCSST: cateterismo primário <90min.',
        'vacinas': 'Tipos: vivas atenuadas (MMR, varicela, FA — contraindicadas em imunossuprimidos), inativadas (influenza, hepatite A), subunidades (HBV, HPV), conjugadas (PCV15, MenACWY), toxoide (dT), mRNA (COVID-19). Vacinas NÃO causam autismo (estudo Wakefield 1998 foi fraudulento e retratado).',
        'obesidade': 'IMC ≥25 sobrepeso, ≥30 obeso, ≥40 obeso mórbido. Farmacoterapia: semaglutida (GLP-1RA) -15%, tirzepatida (GLP-1+GIP) -22,5%. Cirurgia: bypass em Y de Roux -30%, sleeve -25%.',
      },
      en: {
        'icd10': 'ICD-10 (International Classification of Diseases, 10th revision, WHO). Full database with 72,748 codes. Structure: letter (chapter) + 2 digits + subdivision. Type any code (e.g. F20, I21, E11, J45, F20.0, F200) for lookup.',
        'vital_signs': 'Normal BP: <120/80 mmHg. HR: 60-100 bpm. RR: 12-20 breaths/min. SpO₂: ≥95%. Temperature: 36-37.5°C (fever >37.8°C). Glasgow: 15=normal, ≤8=severe. Pain: VAS 0–10.',
        'blood_tests': 'Hgb: 13-17 g/dL (M), 12-16 (F). WBC: 4,000-11,000/mm³. Platelets: 150,000-400,000/mm³. Fasting glucose 70-99 mg/dL. TSH 0.4-4.0 mIU/L.',
        'antibiotics': 'Mechanisms: cell wall (β-lactams, vancomycin), membrane (polymyxins), protein 50S (macrolides, clindamycin), 30S (aminoglycosides, tetracyclines), DNA (quinolones, metronidazole), folate (TMP-SMX). Resistance: β-lactamases (ESBL, KPC).',
        'emergency_medicine': 'Cardiac arrest: CPR 30:2 + AED. Anaphylaxis: epinephrine IM 0.5mg. STEMI: primary PCI <90min. Ischemic stroke: alteplase IV up to 4.5h + thrombectomy up to 24h. DKA: IV insulin + fluids. Sepsis: blood cultures + antibiotics + 30mL/kg crystalloids.',
        'vaccination': 'Types: live-attenuated (MMR, varicella, yellow fever), inactivated (influenza, hep A), subunit (HBV, HPV), conjugate (PCV15, MenACWY), toxoid (dT), mRNA (COVID-19). Vaccines do NOT cause autism (Wakefield 1998 was fraudulent and retracted).',
        'obesity': 'BMI ≥25 overweight, ≥30 obese, ≥40 morbidly obese. Pharmacotherapy: semaglutide (GLP-1RA) -15%, tirzepatide (GLP-1+GIP) -22.5%. Surgery: Roux-en-Y gastric bypass -30%, sleeve gastrectomy -25%.',
      },
      es: {
        'cie10': 'CIE-10 (Clasificación Internacional de Enfermedades, 10ª revisión, OMS). Base completa con 72.748 códigos. Escriba cualquier código (ej: F20, I21, E11, J45, F20.0, F200) para consultar.',
        'signos_vitales': 'PA normal: <120/80 mmHg. FC: 60-100 lpm. FR: 12-20 rpm. SpO₂: ≥95%. Temperatura: 36-37,5°C (fiebre >37,8°C). Glasgow: 15=normal, ≤8=grave. Dolor: EVA 0-10.',
        'antibioticos': 'Mecanismos: pared celular (β-lactámicos, vancomicina), membrana (polimixinas), proteína 50S (macrólidos, clindamicina), 30S (aminoglucósidos, tetraciclinas), ADN (quinolonas, metronidazol), folato (TMP-SMX). Resistencia: β-lactamasas (BLEE, KPC).',
        'emergencias': 'PCR: RCP 30:2 + DEA. Anafilaxia: adrenalina IM 0,5mg. IAMCEST: angioplastia primaria <90min. ACV isquémico: alteplasa IV hasta 4,5h + trombectomía hasta 24h. CAD: insulina IV + hidratación. Sepsis: hemocultivos + antibióticos + cristaloides 30mL/kg.',
        'vacunas': 'Tipos: viva atenuada (SRP, varicela), inactivada (influenza, hepatitis A), subunidades (HBV, VPH), conjugada (PCV15, MenACWY), toxoide (dT), ARNm (COVID-19). Las vacunas NO causan autismo (estudio Wakefield fraudulento y retractado).',
        'obesidad': 'IMC ≥25 sobrepeso, ≥30 obeso, ≥40 mórbido. Farmacoterapia: semaglutida (GLP-1RA) -15%, tirzepatida (GLP-1+GIP) -22,5%. Cirugía: bypass en Y de Roux -30%, sleeve -25%.',
      }
    }
  });

}(window));
