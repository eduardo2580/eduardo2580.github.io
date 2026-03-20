/* kb-core.js — Eduardo.AI Knowledge Base v2026.03.20
   Contains: identity, greetings, technology, AI/LLM, evolution, contacts
   ES5 compatible. No dependencies.
*/
(function(W) {
  'use strict';

  /* ── IDENTITY ───────────────────────────────── */
  W.IDENTITY = {
    name: 'Eduardo Souza Rodrigues',
    greeting: {
      pt: 'Olá! Sou Eduardo.AI, assistente de Eduardo Souza Rodrigues. Posso ajudar com tecnologia, ciência, história, medicina (CID-10) e muito mais. Como posso ajudar?',
      en: 'Hi! I\'m Eduardo.AI, Eduardo Souza Rodrigues\'s assistant. I can help with technology, science, history, medicine (ICD-10) and more. How can I help?',
      es: '¡Hola! Soy Eduardo.AI, asistente de Eduardo Souza Rodrigues. Puedo ayudar con tecnología, ciencia, historia, medicina (CIE-10) y más. ¿En qué puedo ayudarte?'
    }
  };

  W.GREETINGS = {
    pt: W.IDENTITY.greeting.pt,
    en: W.IDENTITY.greeting.en,
    es: W.IDENTITY.greeting.es
  };

  /* ── FLAT KB ────────────────────────────────── */
  if (!W.EduardoKB) W.EduardoKB = [];

  /* ── CORE KB PLUGIN ─────────────────────────── */
  W.EduardoKB.push({
    id: 'core',
    priority: 0,
    lang: {
      pt: {
        /* Eduardo */
        'quem_e_eduardo': 'Eduardo Souza Rodrigues é o criador deste assistente. Desenvolvedor e entusiasta de tecnologia, ciência e inteligência artificial. Este chatbot foi construído para responder perguntas sobre seus projetos e os temas que ele estuda.',
        'projetos': 'Eduardo trabalha em projetos de software, com foco em interfaces inteligentes, automação e aplicações web modernas. Eduardo.AI é um de seus projetos — um chatbot com base de conhecimento local, sem necessidade de servidor ou GPU.',
        'contato': 'Para entrar em contato com Eduardo, use os canais disponíveis no portfólio. Eduardo.AI pode fornecer mais informações sobre projetos específicos.',

        /* Python */
        'python': 'Python é uma linguagem de programação de alto nível, interpretada e de propósito geral. Criada por Guido van Rossum em 1991. Principais usos: ciência de dados (pandas, numpy), machine learning (scikit-learn, PyTorch), desenvolvimento web (Django, FastAPI), automação e scripts. Versão atual: Python 3.12+. Filosofia: código legível, "Pythonic".',
        'python_async': 'Python assíncrono usa asyncio + async/await (desde Python 3.4/3.5). async def cria corrotinas; await suspende execução até resultado. Loop de eventos gerencia corrotinas. Frameworks: FastAPI (web async), aiohttp, trio. Diferente de threads: cooperativo, não preemptivo.',
        'python_decorators': 'Decoradores Python (@nome) são funções que envolvem outras funções. Usados para: logging, cache (@functools.lru_cache), rotas (@app.get), autenticação. Podem aceitar argumentos se aninhados. Implementam o padrão Wrapper.',

        /* JavaScript */
        'javascript': 'JavaScript (JS) é a linguagem da web. Roda no navegador e no servidor (Node.js). Conceitos centrais: closures, prototypes, event loop, Promises/async-await. ES2015+ trouxe classes, arrow functions, destructuring, módulos. Ecossistema: npm, React, Vue, Next.js, Deno.',
        'javascript_promises': 'Promises em JS representam valor futuro: estados pending → fulfilled/rejected. Criação: new Promise((resolve, reject) => {}). Encadeamento: .then().catch().finally(). async/await é açúcar sintático para Promises. Promise.all() executa em paralelo.',
        'typescript': 'TypeScript é JavaScript com tipagem estática. Desenvolvido pela Microsoft. Recursos: interfaces, generics, enums, type guards, utility types (Partial, Record, etc.). Compila para JS. Adotado por Angular, NestJS, VSCode. Melhora refatoração e tooling.',

        /* IA / LLM */
        'inteligencia_artificial': 'Inteligência Artificial (IA) é o campo de criar sistemas que realizam tarefas que exigiriam inteligência humana. Subcampos: Machine Learning, Deep Learning, NLP, Computer Vision. Marcos recentes: GPT-4, Gemini, Claude, Llama — Large Language Models (LLMs) baseados em Transformer.',
        'llm': 'Large Language Models (LLMs) são redes neurais treinadas em texto massivo para prever o próximo token. Arquitetura Transformer (atenção). Escala: bilhões de parâmetros. Capacidades: texto, código, raciocínio. Exemplos: GPT-4 (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta).',
        'machine_learning': 'Machine Learning é o subcampo de IA onde modelos aprendem de dados. Tipos: supervisionado (labels), não-supervisionado (clusters), por reforço (recompensas). Algoritmos clássicos: regressão, SVM, Random Forest, gradient boosting (XGBoost). Deep Learning usa redes neurais multicamada.',
        'redes_neurais': 'Redes neurais artificiais se inspiram no cérebro. Camadas: entrada → ocultas → saída. Treinamento por backpropagation + gradient descent. Tipos: CNN (imagens), RNN/LSTM (sequências), Transformer (atenção self, base dos LLMs). Frameworks: PyTorch, TensorFlow, JAX.',
        'transformer': 'A arquitetura Transformer (Vaswani et al., 2017) revolucionou NLP. Mecanismo de self-attention pondera relevância de cada token em relação aos outros. Permite paralelização (ao contrário de RNNs). Base de BERT (encoder), GPT (decoder), T5 (encoder-decoder). Escalável a trilhões de parâmetros.',
        'rag': 'RAG (Retrieval-Augmented Generation) combina busca vetorial com LLMs. Documentos indexados como embeddings em banco vetorial (Pinecone, Chroma, pgvector). Query do usuário → busca por similaridade → contexto injetado no prompt → LLM responde com dados reais. Resolve alucinação e dados recentes.',
        'embeddings': 'Embeddings são representações vetoriais de texto/imagem em espaço dimensional (ex: 1536D). Textos semanticamente similares têm vetores próximos. Modelos: text-embedding-ada-002 (OpenAI), sentence-transformers. Busca por cosine similarity. Base de sistemas RAG e busca semântica.',

        /* Evolução */
        'evolucao': 'A teoria da evolução de Darwin (A Origem das Espécies, 1859): espécies mudam ao longo do tempo por seleção natural. Variações hereditárias; indivíduos mais adaptados sobrevivem e reproduzem mais. Evidências: fósseis, anatomia comparada, biogeografia, genética molecular (DNA). Não há "propósito" — é processo cego e gradual.',
        'darwin': 'Charles Darwin (1809–1882): naturalista britânico. Viagem no HMS Beagle (1831–1836) às Galápagos foi decisiva. Propôs: descida com modificação + seleção natural. Co-descoberta com Alfred Russel Wallace. Obras: A Origem das Espécies (1859), A Descendência do Homem (1871). Base de toda biologia moderna.',
        'selecao_natural': 'Seleção natural: mecanismo evolutivo onde variações hereditárias que aumentam sobrevivência/reprodução são preservadas. Três requisitos: variação na população, herança dos traços, diferenças reprodutivas. Não é aleatória — elimina o menos adaptado ao ambiente local. Complementada por deriva genética e seleção sexual.',
        'genetica': 'Genética estuda hereditariedade e variação. DNA (ácido desoxirribonucleico) codifica genes em cromossomos. Transcrição: DNA → RNA mensageiro. Tradução: RNA → proteínas (ribossomos). Mutações são mudanças no DNA — base da variação evolutiva. Mendel descobriu leis da hereditariedade com ervilhas.',

        /* Relatividade */
        'relatividade': 'Relatividade de Einstein: Especial (1905) — E=mc², velocidade da luz c é constante em todos os referenciais, tempo dilata e espaço contrai perto da velocidade da luz. Geral (1915) — gravidade não é força mas curvatura do espaço-tempo pela massa/energia. Base do GPS (correção relativística), buracos negros, ondas gravitacionais.',
        'relatividade_especial': 'Relatividade Especial (Einstein, 1905): 1) leis da física são iguais em todos os referenciais inerciais; 2) velocidade da luz é constante (~3×10⁸ m/s). Consequências: dilatação do tempo (relógio mais lento em movimento), contração do espaço, aumento de massa, E=mc² (energia = massa × c²).',
        'relatividade_geral': 'Relatividade Geral (Einstein, 1915): gravidade é curvatura do espaço-tempo causada por massa e energia. Quanto maior a massa, maior a curvatura. Luz dobra ao passar por estrelas (confirmado em 1919). Prediz buracos negros, Big Bang, ondas gravitacionais (detectadas em 2015 pelo LIGO).',

        /* História */
        'segunda_guerra': 'Segunda Guerra Mundial (1939–1945): conflito global iniciado com invasão da Polônia pela Alemanha nazista. Eixo (Alemanha, Itália, Japão) vs. Aliados (EUA, Reino Unido, URSS, França). Marcos: Holocausto (6M judeus mortos), Pearl Harbor (1941), Dia D (1944), Hiroshima/Nagasaki (1945). 70–85 milhões de mortos.',
        'primeira_guerra': 'Primeira Guerra Mundial (1914–1918): "Grande Guerra". Causada por assassinato do Arquiduque Franz Ferdinand em Sarajevo. Tríplice Entente (França, Reino Unido, Rússia) vs. Tríplice Aliança (Alemanha, Áustria-Hungria, Itália). Guerra de trincheiras, uso de gás mostarda. ~20 milhões de mortos. Levou ao Tratado de Versalhes.',
        'revolucao_francesa': 'Revolução Francesa (1789–1799): derrubou a monarquia absolutista. Causas: crise financeira, desigualdade, iluminismo. Fases: Assembleia Nacional → Terror (Robespierre) → Diretório → Napoleão. Legado: Declaração dos Direitos do Homem, liberdade-igualdade-fraternidade, nacionalismo moderno.',
        'iluminismo': 'Iluminismo (séc. XVIII): movimento filosófico europeu que privilegiava razão, ciência e liberdade individual contra dogma e monarquia absoluta. Pensadores: Voltaire, Rousseau, Locke, Montesquieu, Kant. Influenciou Revolução Francesa, Americana e independências latino-americanas. "Ouse saber!" (Sapere aude — Kant).',

        /* Web / Dev */
        'html': 'HTML (HyperText Markup Language) estrutura o conteúdo da web. HTML5 (2014) adicionou: canvas, video/audio, form validation, geolocation, localStorage, web workers. Elementos semânticos: header, nav, main, article, aside, footer. ARIA para acessibilidade. DOCTYPE <!DOCTYPE html> ativa modo padrão.',
        'css': 'CSS (Cascading Style Sheets) estiliza HTML. CSS3 features: Flexbox, Grid, variáveis (custom properties --var), animações/transitions, @media queries, calc(). BEM e CSS Modules organizam código. Preprocessors: Sass, Less. Tailwind é framework utility-first.',
        'git': 'Git é sistema de controle de versão distribuído (Linus Torvalds, 2005). Comandos essenciais: init, clone, add, commit, push, pull, branch, merge, rebase. GitHub/GitLab hospedam repositórios. Pull Requests para revisão. Branching strategies: GitFlow, trunk-based. .gitignore exclui arquivos.',
        'api_rest': 'REST (Representational State Transfer) é estilo arquitetural para APIs web. Métodos HTTP: GET (ler), POST (criar), PUT/PATCH (atualizar), DELETE (remover). JSON é formato padrão. Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error. Stateless: cada request é independente.',
        'docker': 'Docker cria containers — ambientes isolados e portáteis. Dockerfile define imagem. Layers são cacheadas. docker run inicia container, docker-compose orquestra múltiplos. Diferença de VM: containers compartilham kernel do host (mais leve). Kubernetes orquestra containers em escala.',
        'banco_dados': 'Bancos de dados: Relacionais (SQL) — PostgreSQL, MySQL, SQLite — tabelas, joins, ACID. NoSQL — MongoDB (documentos), Redis (chave-valor, cache), Cassandra (colunar, escala), Neo4j (grafos). ORM abstrai SQL: SQLAlchemy (Python), Prisma (JS). Índices aceleram queries. Normalização reduz redundância.',
      },
      en: {
        'who_is_eduardo': 'Eduardo Souza Rodrigues is the creator of this assistant. Developer and enthusiast of technology, science and artificial intelligence. This chatbot was built to answer questions about his projects and the topics he studies.',
        'projects': 'Eduardo works on software projects focused on intelligent interfaces, automation and modern web applications. Eduardo.AI is one of his projects — a chatbot with a local knowledge base, no server or GPU needed.',
        'contact': 'To contact Eduardo, use the channels available in his portfolio. Eduardo.AI can provide more information about specific projects.',

        'python': 'Python is a high-level, interpreted, general-purpose programming language. Created by Guido van Rossum in 1991. Main uses: data science (pandas, numpy), machine learning (scikit-learn, PyTorch), web development (Django, FastAPI), automation. Philosophy: readable code, "Pythonic" style.',
        'javascript': 'JavaScript (JS) is the language of the web. Runs in browsers and on servers (Node.js). Core concepts: closures, prototypes, event loop, Promises/async-await. ES2015+ brought classes, arrow functions, destructuring, modules. Ecosystem: npm, React, Vue, Next.js.',
        'artificial_intelligence': 'Artificial Intelligence (AI) creates systems that perform tasks requiring human intelligence. Subfields: Machine Learning, Deep Learning, NLP, Computer Vision. Recent milestones: GPT-4, Gemini, Claude, Llama — Transformer-based Large Language Models (LLMs).',
        'llm': 'Large Language Models (LLMs) are neural networks trained on massive text to predict the next token. Transformer architecture (attention). Scale: billions of parameters. Capabilities: text, code, reasoning. Examples: GPT-4 (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta).',
        'evolution': 'Darwin\'s theory of evolution (On the Origin of Species, 1859): species change over time through natural selection. Heritable variations; better-adapted individuals survive and reproduce more. Evidence: fossils, comparative anatomy, biogeography, molecular genetics (DNA).',
        'relativity': 'Einstein\'s relativity: Special (1905) — E=mc², speed of light constant in all frames, time dilates and space contracts near light speed. General (1915) — gravity is spacetime curvature by mass/energy. Foundation of GPS corrections, black holes, gravitational waves.',
        'world_war_2': 'World War II (1939–1945): global conflict started with Germany\'s invasion of Poland. Axis (Germany, Italy, Japan) vs. Allies (USA, UK, USSR, France). Key events: Holocaust (6M Jews killed), Pearl Harbor (1941), D-Day (1944), Hiroshima/Nagasaki (1945). 70–85 million deaths.',
        'machine_learning': 'Machine Learning is the AI subfield where models learn from data. Types: supervised (labels), unsupervised (clusters), reinforcement (rewards). Classic algorithms: regression, SVM, Random Forest, gradient boosting. Deep Learning uses multi-layer neural networks.',
        'transformer': 'The Transformer architecture (Vaswani et al., 2017) revolutionized NLP. Self-attention mechanism weighs the relevance of each token to others. Enables parallelization (unlike RNNs). Foundation of BERT (encoder), GPT (decoder), T5 (encoder-decoder).',
        'rag': 'RAG (Retrieval-Augmented Generation) combines vector search with LLMs. Documents indexed as embeddings in a vector store (Pinecone, Chroma, pgvector). User query → similarity search → context injected into prompt → LLM answers with real data. Solves hallucination and stale data.',
      },
      es: {
        'quien_es_eduardo': 'Eduardo Souza Rodrigues es el creador de este asistente. Desarrollador y entusiasta de tecnología, ciencia e inteligencia artificial. Este chatbot fue construido para responder preguntas sobre sus proyectos y los temas que estudia.',
        'python': 'Python es un lenguaje de programación de alto nivel, interpretado y de propósito general. Creado por Guido van Rossum en 1991. Principales usos: ciencia de datos (pandas, numpy), machine learning (scikit-learn, PyTorch), desarrollo web (Django, FastAPI). Filosofía: código legible.',
        'javascript': 'JavaScript (JS) es el lenguaje de la web. Se ejecuta en navegadores y servidores (Node.js). Conceptos fundamentales: closures, prototypes, event loop, Promises/async-await. ES2015+ trajo clases, arrow functions, destructuring, módulos.',
        'inteligencia_artificial': 'La Inteligencia Artificial (IA) crea sistemas que realizan tareas que requieren inteligencia humana. Subcampos: Machine Learning, Deep Learning, NLP, Visión por Computadora. Hitos recientes: GPT-4, Gemini, Claude, Llama — LLMs basados en Transformer.',
        'evolucion': 'La teoría de la evolución de Darwin (El Origen de las Especies, 1859): las especies cambian con el tiempo por selección natural. Variaciones hereditarias; individuos más adaptados sobreviven y se reproducen más. Evidencias: fósiles, anatomía comparada, genética molecular.',
        'relatividad': 'Relatividad de Einstein: Especial (1905) — E=mc², velocidad de la luz constante. General (1915) — la gravedad es la curvatura del espacio-tiempo por la masa. Base del GPS, agujeros negros y ondas gravitacionales.',
        'segunda_guerra_mundial': 'Segunda Guerra Mundial (1939–1945): conflicto global iniciado con la invasión de Polonia por la Alemania nazi. Eje vs. Aliados. Holocausto (6M judíos), Pearl Harbor, Día D, Hiroshima. Entre 70 y 85 millones de muertos.',
      }
    }
  });

}(window));
