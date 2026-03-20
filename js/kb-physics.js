/* kb-physics.js — Eduardo.AI Physics Knowledge Base v2026.03.20 */
(function(W) {
  'use strict';
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'physics',
    priority: 5,
    lang: {
      pt: {
        'quantica': 'Mecânica quântica: partículas subatômicas existem em superposição de estados até serem observadas (colapso da função de onda). Princípio da incerteza de Heisenberg: posição e momentum não podem ser conhecidos simultaneamente com precisão absoluta. Fenômenos: interferência, tunelamento quântico, entrelaçamento. Base de semicondutores, lasers e computação quântica.',
        'termodinamica': '4 leis da termodinâmica: 0ª — dois sistemas em equilíbrio térmico com um terceiro estão em equilíbrio entre si (define temperatura). 1ª — energia não se cria nem se destrói, apenas se transforma (ΔU = Q − W). 2ª — entropia de sistema isolado sempre aumenta (irreversibilidade). 3ª — entropia tende a zero no zero absoluto (−273,15°C), mas nunca chega lá.',
        'eletromagnetismo': 'As 4 equações de Maxwell descrevem toda eletricidade e magnetismo: campos elétrico e magnético variáveis geram um ao outro e se propagam a 3×10⁸ m/s — a velocidade da luz. Lei de Gauss, lei de Ampère com correção de Maxwell, lei de Faraday. Base do rádio, TV, Wi-Fi, raios-X, luz visível. Força eletromagnética: 2ª força fundamental mais forte.',
        'fissao_fusao': 'Fissão nuclear: núcleo pesado (U-235, Pu-239) absorve nêutron e se divide liberando energia + novos nêutrons (reação em cadeia). Base de usinas e bombas atômicas. Fusão nuclear: núcleos leves (deutério + trítio) se unem formando hélio, liberando ~4x mais energia que a fissão. Ocorre no Sol e estrelas. Projeto ITER tenta fusão controlada.',
        'ondas': 'Ondas transferem energia sem transporte líquido de matéria. Mecânicas (som, sísmica) precisam de meio material. Eletromagnéticas (luz, rádio, raios-X) viajam no vácuo a c. Frequência × comprimento de onda = velocidade. Efeito Doppler: frequência aumenta quando fonte se aproxima, diminui ao se afastar. Interferência, difração, polarização são propriedades ondulatórias.',
        'mecanica_classica': 'Mecânica clássica (Newton): 1ª lei — inércia (repouso ou MRU sem força). 2ª lei — F=ma (força = massa × aceleração). 3ª lei — ação e reação são iguais e opostas. Válida para velocidades << c e escalas >> atômicas. Leis de conservação: energia, momentum linear e angular. Gravitação universal: F = G×m₁×m₂/r².',
        'astrofisica': 'Astrofísica: estrelas nascem em nebulosas (nuvens de gás/poeira), passam por sequência principal (fusão H→He), gigante vermelha, e terminam como anã branca (< 8M☉), estrela de nêutrons ou buraco negro (> 20M☉). Buracos negros: gravidade tão intensa que a velocidade de escape > c. O Universo tem ~13,8 bilhões de anos (Big Bang).',
        'optica': 'Óptica estuda comportamento da luz. Reflexão: ângulo incidente = ângulo refletido. Refração: luz muda velocidade e direção ao mudar de meio (lei de Snell: n₁sinθ₁ = n₂sinθ₂). Índice de refração: c/v no meio. Prisma decompõe branca em espectro. Lasers: luz coerente e monocromática por emissão estimulada (Einstein, 1917). Fibra óptica usa reflexão interna total.',
      },
      en: {
        'quantum_mechanics': 'Quantum mechanics: subatomic particles exist in superposition until observed (wave function collapse). Heisenberg uncertainty: position and momentum cannot both be precisely known. Phenomena: interference, quantum tunneling, entanglement. Foundation of semiconductors, lasers and quantum computing.',
        'thermodynamics': '4 laws of thermodynamics: 0th — thermal equilibrium defines temperature. 1st — energy conservation (ΔU = Q − W). 2nd — entropy of isolated systems always increases (irreversibility). 3rd — entropy approaches zero at absolute zero (−273.15°C) but never reaches it.',
        'electromagnetism': "Maxwell's 4 equations describe all electricity and magnetism: changing electric and magnetic fields generate each other and propagate at 3×10⁸ m/s — the speed of light. Foundation of radio, TV, Wi-Fi, X-rays, visible light.",
        'fission_fusion': 'Nuclear fission: heavy nucleus (U-235) splits releasing energy + neutrons (chain reaction). Basis of power plants and bombs. Nuclear fusion: light nuclei (deuterium + tritium) join forming helium, releasing ~4x more energy. Occurs in the Sun. ITER project aims for controlled fusion.',
        'classical_mechanics': 'Classical mechanics (Newton): 1st law — inertia. 2nd law — F=ma. 3rd law — equal and opposite reaction. Conservation of energy, linear and angular momentum. Universal gravitation: F = G×m₁×m₂/r².',
        'waves': 'Waves transfer energy without net matter transport. Mechanical (sound) need a medium. Electromagnetic (light, radio) travel in vacuum at c. Frequency × wavelength = speed. Doppler effect, interference, diffraction, polarization are wave properties.',
      },
      es: {
        'cuantica': 'Mecánica cuántica: partículas subatómicas en superposición hasta ser observadas. Principio de incertidumbre de Heisenberg. Fenómenos: interferencia, tunelamiento cuántico, entrelazamiento. Base de semiconductores, láseres y computación cuántica.',
        'termodinamica': '4 leyes de la termodinámica: 0ª equilibrio térmico; 1ª conservación de energía; 2ª la entropía de sistemas aislados siempre aumenta; 3ª entropía cero imposible en el cero absoluto (−273,15°C).',
        'electromagnetismo': 'Las ecuaciones de Maxwell describen electricidad y magnetismo: campos eléctrico y magnético se propagan a 3×10⁸ m/s. Base de radio, TV, Wi-Fi y luz visible.',
        'fisica_clasica': 'Mecánica clásica (Newton): 1ª ley — inercia. 2ª ley — F=ma. 3ª ley — acción y reacción iguales y opuestas. Conservación de energía y momentum. Gravitación universal: F = G×m₁×m₂/r².',
      }
    }
  });
}(window));
