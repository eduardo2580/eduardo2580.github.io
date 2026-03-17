/**
 * knowledge.js — Eduardo Souza Rodrigues
 * Single source of truth. Rich HTML answers with styled links.
 * Chips map directly to answer keys — instant O(1) replies.
 */

/* ── Raw profile ── */
var _P = {
  name:     'Eduardo Souza Rodrigues',
  born:     '2005, Campinas, SP, Brasil',
  age:      '20 anos',
  email:    'eduardo.kvsw3@aleeas.com',
  github:   'https://github.com/eduardo2580',
  linkedin: 'https://linkedin.com/in/eduardo-souza-rodrigues',
  site:     'https://eduardo2580.github.io',
  orcid:    'https://orcid.org/0009-0001-7877-2153',
  lattes:   'https://lattes.cnpq.br/2487835899987366',
  education: [
    'Análise e Desenvolvimento de Sistemas — Universidade São Francisco, USF (2024–presente)',
    'Ensino Médio Técnico em Informática — SENAC Registro, SP (2022–2023)',
    'Web Design for Everybody (Capstone) — Universidade de Michigan (2023)',
    'Cursos: Alura, Fundação Bradesco, Ondaro/Cask, ServiceNow Learning'
  ],
  experience: [
    'Jovem Aprendiz — ETAPA Ensino e Cultura Ltda. (2024): jogos com Construct 3, cadastro, planilhas',
    'Prêmio SENAC Projeto do Ano — Impacto Social (2023): "O Futuro do Trabalho"',
    'Bootcamps Shark in ServiceNow edições 4 e 8; Cask Camp Ultimate (20h)',
    'Eventos acadêmicos USF: cibersegurança, escrita, intercâmbio'
  ],
  tech: {
    frontend: 'HTML5, CSS3, JavaScript, Design Responsivo, GitHub Pages',
    backend:  'C#, SQL, Node.js, ServiceNow, Windows Forms',
    tools:    'Git, Visual Studio, Oracle VirtualBox, Microsoft 365, Android Studio',
    other:    'Unity, Arduino IDE, Construct 3, Cibersegurança'
  },
  projects: [
    'Campo Minado (2026) — github.com/eduardo2580',
    'Jogos com Construct 3 (2024)',
    '"O Futuro do Trabalho" — apresentação premiada SENAC (2023)',
    'Site pessoal: eduardo2580.github.io'
  ],
  certs: [
    'Web Design for Everybody Capstone, Advanced Styling, Interactivity with JavaScript, Intro HTML5/CSS3 — Michigan (2023)',
    'Shark in ServiceNow #8 — Aoop (2023)',
    'Cask Camp — Ondaro Brasil (2024, 20h)',
    'Introduction to Generative AI — ServiceNow Learning (2024)',
    'Imersão Dev Back-End & Google Gemini — Alura (2024)',
    'Imersão Dev Agentes de IA Google — Alura (2026)',
    'Apps Mobile com Android Studio — Bradesco (2026, 15h)',
    'Suporte e Manutenção de Computadores — SENAC (2022, 272h)',
    'Introdução à POO — Bradesco (2024, 5h)'
  ],
  award: 'Prêmio SENAC Projeto do Ano — Impacto Social (2023): "O Futuro do Trabalho"',
  langs: 'Português (nativo) | Inglês (intermediário) | Espanhol (básico)'
};

/* ════════════════════════════════════════════════════
   ANSWERS — rich HTML, keyed, three languages.
   Use [[url|text]] syntax for links — rendered by renderMsgContent() in chat.js.
   Use **text** for bold. Use \n for line breaks.
════════════════════════════════════════════════════ */
var _A = {

  sobre: {
    pt: '**Eduardo Souza Rodrigues** é um Desenvolvedor Junior nascido em **2005** em Campinas, SP, Brasil. Tem 20 anos e está cursando **Análise e Desenvolvimento de Sistemas** na Universidade São Francisco.\n\nApaixonado por tecnologia desde criança — cresceu explorando Unity, Arduino e desenvolvimento web. Seu objetivo é criar soluções digitais que melhorem a vida das pessoas e promovam o desenvolvimento sustentável.',
    en: '**Eduardo Souza Rodrigues** is a Junior Developer born in **2005** in Campinas, SP, Brazil. He\'s 20 years old, studying **Systems Analysis and Development** at São Francisco University.\n\nPassionate about tech since childhood — grew up exploring Unity, Arduino and web development. His goal is to build digital solutions that improve people\'s lives and drive sustainable development.',
    es: '**Eduardo Souza Rodrigues** es un Desarrollador Junior nacido en **2005** en Campinas, SP, Brasil. Tiene 20 años y estudia **Análisis de Sistemas y Desarrollo** en la Universidad São Francisco.\n\nApasionado por la tecnología desde niño — creció explorando Unity, Arduino y desarrollo web. Su objetivo es crear soluciones digitales que mejoren la vida de las personas.'
  },

  formacao: {
    pt: '**Formação Acadêmica**\n\n🎓 **ADS** — Universidade São Francisco, USF (2024–presente)\n🎓 **Ensino Médio Técnico em Informática** — SENAC Registro, SP (2022–2023)\n🌐 **Web Design for Everybody** — Universidade de Michigan (2023)\n\nTambém realizou cursos em **Alura**, **Fundação Bradesco**, **Ondaro/Cask** e **ServiceNow Learning**.',
    en: '**Academic Background**\n\n🎓 **Systems Analysis & Development** — São Francisco University, USF (2024–present)\n🎓 **Technical High School in IT** — SENAC Registro, SP (2022–2023)\n🌐 **Web Design for Everybody** — University of Michigan (2023)\n\nAdditional courses at **Alura**, **Fundação Bradesco**, **Ondaro/Cask** and **ServiceNow Learning**.',
    es: '**Formación Académica**\n\n🎓 **ADS** — Universidad São Francisco, USF (2024–presente)\n🎓 **Bachillerato Técnico en Informática** — SENAC Registro, SP (2022–2023)\n🌐 **Web Design for Everybody** — Universidad de Michigan (2023)\n\nCursos adicionales en **Alura**, **Fundação Bradesco**, **Ondaro/Cask** y **ServiceNow Learning**.'
  },

  tecnologias: {
    pt: '**Stack Tecnológico**\n\n**Frontend:** HTML5, CSS3, JavaScript, Design Responsivo, GitHub Pages\n**Backend:** C#, SQL, Node.js, ServiceNow, Windows Forms\n**Ferramentas:** Git, Visual Studio, Oracle VirtualBox, Microsoft 365, Android Studio\n**Outros:** Unity, Arduino IDE, Construct 3, Cibersegurança',
    en: '**Tech Stack**\n\n**Frontend:** HTML5, CSS3, JavaScript, Responsive Design, GitHub Pages\n**Backend:** C#, SQL, Node.js, ServiceNow, Windows Forms\n**Tools:** Git, Visual Studio, Oracle VirtualBox, Microsoft 365, Android Studio\n**Other:** Unity, Arduino IDE, Construct 3, Cybersecurity',
    es: '**Stack Tecnológico**\n\n**Frontend:** HTML5, CSS3, JavaScript, Diseño Responsivo, GitHub Pages\n**Backend:** C#, SQL, Node.js, ServiceNow, Windows Forms\n**Herramientas:** Git, Visual Studio, Oracle VirtualBox, Microsoft 365, Android Studio\n**Otros:** Unity, Arduino IDE, Construct 3, Ciberseguridad'
  },

  projetos: {
    pt: '**Projetos**\n\n💣 **Campo Minado** (2026) — jogo clássico desenvolvido em JavaScript\n[[https://github.com/eduardo2580|Ver no GitHub →]]\n\n🎮 **Jogos com Construct 3** (2024) — desenvolvidos como Jovem Aprendiz na ETAPA\n\n📊 **O Futuro do Trabalho** (2023) — apresentação acadêmica premiada pelo SENAC na categoria Impacto Social\n\n🌐 **Site Pessoal** — portfólio completo\n[[https://eduardo2580.github.io|eduardo2580.github.io →]]',
    en: '**Projects**\n\n💣 **Minesweeper / Campo Minado** (2026) — classic game built in JavaScript\n[[https://github.com/eduardo2580|View on GitHub →]]\n\n🎮 **Games with Construct 3** (2024) — built as Young Apprentice at ETAPA\n\n📊 **The Future of Work** (2023) — award-winning academic presentation, SENAC Social Impact Prize\n\n🌐 **Personal Website** — full portfolio\n[[https://eduardo2580.github.io|eduardo2580.github.io →]]',
    es: '**Proyectos**\n\n💣 **Campo Minado** (2026) — juego clásico desarrollado en JavaScript\n[[https://github.com/eduardo2580|Ver en GitHub →]]\n\n🎮 **Juegos con Construct 3** (2024) — desarrollados como Joven Aprendiz en ETAPA\n\n📊 **El Futuro del Trabajo** (2023) — presentación premiada por el SENAC en Impacto Social\n\n🌐 **Sitio Personal** — portafolio completo\n[[https://eduardo2580.github.io|eduardo2580.github.io →]]'
  },

  premios: {
    pt: '🏆 **Prêmio SENAC — Projeto do Ano em Impacto Social (2023)**\n\nEduardo e sua equipe apresentaram **"O Futuro do Trabalho"**, um projeto que explorou as transformações do mercado de trabalho diante da automação e da IA. O projeto foi eleito o melhor do ano letivo na categoria Impacto Social pelo SENAC.',
    en: '🏆 **SENAC Award — Project of the Year in Social Impact (2023)**\n\nEduardo and his team presented **"The Future of Work"**, a project exploring how automation and AI are transforming the job market. It was voted the best project of the academic year in the Social Impact category by SENAC.',
    es: '🏆 **Premio SENAC — Proyecto del Año en Impacto Social (2023)**\n\nEduardo y su equipo presentaron **"El Futuro del Trabajo"**, un proyecto sobre cómo la automatización y la IA están transformando el mercado laboral. Fue elegido el mejor proyecto del año académico en la categoría Impacto Social por el SENAC.'
  },

  contato: {
    pt: '**Entre em contato com Eduardo:**\n\n[[https://github.com/eduardo2580|GitHub — github.com/eduardo2580]]\n[[https://linkedin.com/in/eduardo-souza-rodrigues|LinkedIn — linkedin.com/in/eduardo-souza-rodrigues]]\n[[https://eduardo2580.github.io|Site — eduardo2580.github.io]]\n[[mailto:eduardo.kvsw3@aleeas.com|E-mail — eduardo.kvsw3@aleeas.com]]\n[[https://orcid.org/0009-0001-7877-2153|ORCID — 0009-0001-7877-2153]]\n[[https://lattes.cnpq.br/2487835899987366|Lattes CV]]',
    en: '**Get in touch with Eduardo:**\n\n[[https://github.com/eduardo2580|GitHub — github.com/eduardo2580]]\n[[https://linkedin.com/in/eduardo-souza-rodrigues|LinkedIn — linkedin.com/in/eduardo-souza-rodrigues]]\n[[https://eduardo2580.github.io|Website — eduardo2580.github.io]]\n[[mailto:eduardo.kvsw3@aleeas.com|Email — eduardo.kvsw3@aleeas.com]]\n[[https://orcid.org/0009-0001-7877-2153|ORCID — 0009-0001-7877-2153]]\n[[https://lattes.cnpq.br/2487835899987366|Lattes CV]]',
    es: '**Contacta a Eduardo:**\n\n[[https://github.com/eduardo2580|GitHub — github.com/eduardo2580]]\n[[https://linkedin.com/in/eduardo-souza-rodrigues|LinkedIn — linkedin.com/in/eduardo-souza-rodrigues]]\n[[https://eduardo2580.github.io|Sitio web — eduardo2580.github.io]]\n[[mailto:eduardo.kvsw3@aleeas.com|Correo — eduardo.kvsw3@aleeas.com]]\n[[https://orcid.org/0009-0001-7877-2153|ORCID — 0009-0001-7877-2153]]\n[[https://lattes.cnpq.br/2487835899987366|Lattes CV]]'
  },

  default: {
    pt: 'Posso responder sobre **Eduardo Souza Rodrigues** — sua formação, tecnologias, projetos, prêmios, contato — ou sobre qualquer tema de tecnologia, programação e desenvolvimento. O que você quer saber?',
    en: 'I can answer about **Eduardo Souza Rodrigues** — his education, technologies, projects, awards, contact — or about any topic in tech, programming and development. What would you like to know?',
    es: 'Puedo responder sobre **Eduardo Souza Rodrigues** — su formación, tecnologías, proyectos, premios, contacto — o sobre cualquier tema de tecnología, programación y desarrollo. ¿Qué quieres saber?'
  },

  unknown: {
    pt: 'Desculpe, não tenho uma resposta para isso. 😕\n\nPosso ajudar com informações sobre Eduardo — **formação**, **tecnologias**, **projetos**, **prêmios** ou **contato**. Ou pergunte sobre tecnologia em geral!',
    en: 'Sorry, I don\'t have an answer for that. 😕\n\nI can help with information about Eduardo — his **education**, **technologies**, **projects**, **awards** or **contact**. Or ask me anything about tech!',
    es: 'Lo siento, no tengo una respuesta para eso. 😕\n\nPuedo ayudarte con información sobre Eduardo — **formación**, **tecnologías**, **proyectos**, **premios** o **contacto**. ¡O pregúntame sobre tecnología en general!'
  }
};

/* ════════════════════════════════
   SUGGESTIONS
════════════════════════════════ */
window.SUGGESTIONS = {
  pt: [
    { label: 'Quem é Eduardo?', key: 'sobre'       },
    { label: 'Tecnologias',     key: 'tecnologias' },
    { label: 'Formação',        key: 'formacao'    },
    { label: 'Projetos',        key: 'projetos'    },
    { label: 'Prêmios',         key: 'premios'     },
    { label: 'Contato',         key: 'contato'     }
  ],
  en: [
    { label: 'Who is Eduardo?', key: 'sobre'       },
    { label: 'Technologies',    key: 'tecnologias' },
    { label: 'Education',       key: 'formacao'    },
    { label: 'Projects',        key: 'projetos'    },
    { label: 'Awards',          key: 'premios'     },
    { label: 'Contact',         key: 'contato'     }
  ],
  es: [
    { label: '¿Quién es?',      key: 'sobre'       },
    { label: 'Tecnologías',     key: 'tecnologias' },
    { label: 'Formación',       key: 'formacao'    },
    { label: 'Proyectos',       key: 'projetos'    },
    { label: 'Premios',         key: 'premios'     },
    { label: 'Contacto',        key: 'contato'     }
  ]
};

/* ════════════════════════════════
   GREETINGS
════════════════════════════════ */
window.GREETINGS = {
  pt: 'Olá! Sou o **Eduardo.AI** — um assistente de portfólio com conhecimentos gerais, rodando 100% no seu navegador. Pergunte sobre o Eduardo ou qualquer coisa de tecnologia! 🚀',
  en: 'Hi! I\'m **Eduardo.AI** — a portfolio assistant with broad general knowledge, running entirely in your browser. Ask about Eduardo or anything tech-related! 🚀',
  es: '¡Hola! Soy **Eduardo.AI** — un asistente de portafolio con conocimientos generales, funcionando completamente en tu navegador. ¡Pregunta sobre Eduardo o cualquier tema tecnológico! 🚀'
};

/* ════════════════════════════════
   KEYWORD MAP
════════════════════════════════ */
window.KEYWORD_MAP = {
  pt: {
    sobre:       /quem|sobre|apresent|perfil|bio|nasceu|idade|anos|eduardo/i,
    formacao:    /form|estud|universid|faculdad|senac|michigan|ads|curso|escola|gradu/i,
    tecnologias: /tecnolog|stack|html|css|javascript|c#|sql|node|servicenow|git|unity|arduino|construct|android|linguagem|programa/i,
    projetos:    /projeto|campo minado|jogo|futuro do trabalho|github|desenvolv|portf/i,
    premios:     /prêmio|premio|award|ganhou|reconhec|conquist/i,
    contato:     /contato|contac|linkedin|github|site|email|redes|encontr|falar/i
  },
  en: {
    sobre:       /who|about|introduc|profile|bio|born|age|years|eduardo/i,
    formacao:    /educat|study|universit|college|senac|michigan|ads|course|school|degree/i,
    tecnologias: /technolog|stack|html|css|javascript|c#|sql|node|servicenow|git|unity|arduino|construct|android|language|program/i,
    projetos:    /project|minesweeper|campo minado|game|future of work|github|built|portfolio/i,
    premios:     /award|prize|winner|won|recogni|achiev/i,
    contato:     /contact|linkedin|github|website|email|social|reach|find|talk/i
  },
  es: {
    sobre:       /quién|quien|sobre|presenta|perfil|bio|nació|edad|años|eduardo/i,
    formacao:    /forma|estudi|universid|senac|michigan|ads|curso|escuela|carrera/i,
    tecnologias: /tecnolog|stack|html|css|javascript|c#|sql|node|servicenow|git|unity|arduino|construct|android|lenguaje|program/i,
    projetos:    /proyecto|campo minado|juego|futuro del trabajo|github|desarroll|portaf/i,
    premios:     /premio|award|ganó|gano|reconoc|logr/i,
    contato:     /contacto|linkedin|github|sitio|email|redes|encontr|hablar/i
  }
};

/* ════════════════════════════════
   PUBLIC API
════════════════════════════════ */

window.getAnswer = function (key, lang) {
  var entry = _A[key] || _A['default'];
  return entry[lang] || entry.pt;
};

window.keywordLookup = function (text, lang) {
  var map = window.KEYWORD_MAP[lang] || window.KEYWORD_MAP.pt;
  var keys = Object.keys(map);
  for (var i = 0; i < keys.length; i++) {
    if (map[keys[i]].test(text)) return keys[i];
  }
  return 'unknown';
};

window.buildSystemPrompt = function (lang) {
  var rules = {
    pt: 'Você é Eduardo.AI, um assistente inteligente e versátil que representa o portfólio de Eduardo Souza Rodrigues.\n\nREGRAS:\n- Responda SEMPRE em português do Brasil\n- Seja caloroso, inteligente e direto\n- Sobre Eduardo: use APENAS as informações do perfil abaixo — nunca invente\n- Sobre outros temas (tecnologia, programação, ciência, cultura geral): responda com seu conhecimento geral completo\n- Se não souber a resposta ou a pergunta for completamente fora de contexto, diga "Desculpe, não tenho uma resposta para isso." e sugira perguntar sobre Eduardo ou tecnologia\n- Respostas concisas (máximo 4 frases) salvo quando o usuário pedir detalhes\n- Quando mencionar links, escreva as URLs completas',
    en: 'You are Eduardo.AI, a smart and versatile assistant representing Eduardo Souza Rodrigues\' portfolio.\n\nRULES:\n- ALWAYS respond in English\n- Be warm, intelligent and direct\n- About Eduardo: use ONLY the profile information below — never invent\n- About other topics (technology, programming, science, general culture): answer with your full general knowledge\n- If you don\'t know the answer or the question is completely off-topic, say "Sorry, I don\'t have an answer for that." and suggest asking about Eduardo or tech\n- Concise answers (max 4 sentences) unless the user asks for details\n- When mentioning links, write full URLs',
    es: 'Eres Eduardo.AI, un asistente inteligente y versátil que representa el portafolio de Eduardo Souza Rodrigues.\n\nREGLAS:\n- Responde SIEMPRE en español\n- Sé cálido, inteligente y directo\n- Sobre Eduardo: usa SOLO la información del perfil — nunca inventes\n- Sobre otros temas (tecnología, programación, ciencia, cultura general): responde con tu conocimiento general completo\n- Si no sabes la respuesta o la pregunta está completamente fuera de contexto, di "Lo siento, no tengo una respuesta para eso." y sugiere preguntar sobre Eduardo o tecnología\n- Respuestas concisas (máximo 4 frases) salvo que el usuario pida detalles\n- Al mencionar links, escribe las URLs completas'
  };

  var r = rules[lang] || rules.pt;

  return r + '\n\n--- PERFIL DE EDUARDO ---\n' +
    'Nome: ' + _P.name + '\n' +
    'Nascimento: ' + _P.born + '\n' +
    'E-mail: ' + _P.email + '\n' +
    'GitHub: ' + _P.github + '\n' +
    'LinkedIn: ' + _P.linkedin + '\n' +
    'Site: ' + _P.site + '\n' +
    'ORCID: ' + _P.orcid + '\n' +
    'Lattes: ' + _P.lattes + '\n\n' +
    'FORMAÇÃO:\n' + _P.education.map(function(e){ return '- ' + e; }).join('\n') + '\n\n' +
    'EXPERIÊNCIA:\n' + _P.experience.map(function(e){ return '- ' + e; }).join('\n') + '\n\n' +
    'TECNOLOGIAS:\nFrontend: ' + _P.tech.frontend + '\nBackend: ' + _P.tech.backend + '\nFerramentas: ' + _P.tech.tools + '\nOutros: ' + _P.tech.other + '\n\n' +
    'PROJETOS:\n' + _P.projects.map(function(p){ return '- ' + p; }).join('\n') + '\n\n' +
    'CERTIFICAÇÕES:\n' + _P.certs.map(function(c){ return '- ' + c; }).join('\n') + '\n\n' +
    'PRÊMIO: ' + _P.award + '\n' +
    'IDIOMAS: ' + _P.langs;
};

/* Pre-warm answer cache */
window.ANSWER_CACHE = {};
(function () {
  var langs = ['pt', 'en', 'es'];
  var keys  = Object.keys(_A);
  for (var li = 0; li < langs.length; li++) {
    var l = langs[li];
    window.ANSWER_CACHE[l] = {};
    for (var ki = 0; ki < keys.length; ki++) {
      window.ANSWER_CACHE[l][keys[ki]] = window.getAnswer(keys[ki], l);
    }
  }
}());
