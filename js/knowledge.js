/**
 * knowledge.js — Eduardo Souza Rodrigues
 * Enhanced with deep general knowledge across all major domains.
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

/* ════════════════════════════════════════════════════════════════════════════
   GENERAL KNOWLEDGE BASE — Comprehensive domain coverage
   Powers smart fallback answers when the LLM is unavailable.
   Organized by topic clusters for fast regex matching.
════════════════════════════════════════════════════════════════════════════ */
var _GK = {

  /* ── PROGRAMMING LANGUAGES ── */
  python: {
    pt: '**Python** é uma linguagem de programação de alto nível criada por Guido van Rossum em 1991.\n\n**Características principais:**\n- Sintaxe limpa e legível (indentação obrigatória)\n- Interpretada e dinamicamente tipada\n- Suporte nativo a múltiplos paradigmas: OOP, funcional, procedural\n- Ecossistema massivo: PyPI tem mais de 400.000 pacotes\n\n**Casos de uso:**\nData Science & ML (pandas, NumPy, TensorFlow), Web (Django, Flask, FastAPI), Automação, Scripting, IA generativa.\n\n**Exemplo básico:**\n```python\ndef fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)\n```\n\nPython é consistentemente a linguagem mais popular do mundo segundo o índice TIOBE e Stack Overflow Developer Survey.',
    en: '**Python** is a high-level programming language created by Guido van Rossum in 1991.\n\n**Key characteristics:**\n- Clean, readable syntax (mandatory indentation)\n- Interpreted and dynamically typed\n- Multi-paradigm: OOP, functional, procedural\n- Massive ecosystem: PyPI hosts 400,000+ packages\n\n**Use cases:**\nData Science & ML (pandas, NumPy, TensorFlow), Web (Django, Flask, FastAPI), Automation, Scripting, Generative AI.\n\n**Basic example:**\n```python\ndef fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)\n```\n\nPython consistently ranks as the world\'s most popular language (TIOBE index, Stack Overflow Developer Survey).',
    es: '**Python** es un lenguaje de programación de alto nivel creado por Guido van Rossum en 1991.\n\n**Características principales:**\n- Sintaxis limpia y legible (indentación obligatoria)\n- Interpretado y tipado dinámico\n- Multiparadigma: OOP, funcional, procedural\n- Ecosistema masivo: PyPI tiene más de 400.000 paquetes\n\n**Casos de uso:**\nData Science y ML (pandas, NumPy, TensorFlow), Web (Django, Flask, FastAPI), Automatización, Scripting, IA generativa.\n\nPython es consistentemente el lenguaje más popular del mundo según el índice TIOBE.'
  },

  javascript: {
    pt: '**JavaScript** é a linguagem de programação da web, criada por Brendan Eich em apenas 10 dias em 1995 (na Netscape).\n\n**Fatos importantes:**\n- Única linguagem nativa dos navegadores web\n- Motor V8 (Google) possibilitou o Node.js — JS no servidor\n- Tipagem dinâmica e baseada em protótipos (não classes reais)\n- ES2015+ trouxe classes, arrow functions, Promises, async/await\n\n**Ecossistema 2024–2025:**\nReact, Vue, Angular (frontend) | Node.js, Deno, Bun (backend) | React Native, Capacitor (mobile)\n\n**Peculiaridades famosas:**\n```js\ntypeof null === "object"  // true (bug histórico)\n0.1 + 0.2 !== 0.3         // true (ponto flutuante IEEE 754)\n```\n\nJS roda em mais de 98% dos websites do planeta.',
    en: '**JavaScript** is the language of the web, created by Brendan Eich in just 10 days in 1995 (at Netscape).\n\n**Key facts:**\n- The only language native to web browsers\n- V8 engine (Google) enabled Node.js — JS on the server\n- Dynamically typed, prototype-based (not true classes)\n- ES2015+ added classes, arrow functions, Promises, async/await\n\n**2024–2025 Ecosystem:**\nReact, Vue, Angular (frontend) | Node.js, Deno, Bun (backend) | React Native, Capacitor (mobile)\n\n**Famous quirks:**\n```js\ntypeof null === "object"  // true (historical bug)\n0.1 + 0.2 !== 0.3         // true (IEEE 754 float)\n```\n\nJS runs on over 98% of all websites on the planet.',
    es: '**JavaScript** es el lenguaje de la web, creado por Brendan Eich en apenas 10 días en 1995.\n\n**Datos clave:**\n- Único lenguaje nativo de los navegadores web\n- El motor V8 (Google) permitió Node.js — JS en el servidor\n- Tipado dinámico, basado en prototipos\n- ES2015+ agregó clases, arrow functions, Promises, async/await\n\nJS corre en más del 98% de todos los sitios web del planeta.'
  },

  typescript: {
    pt: '**TypeScript** é um superset de JavaScript criado pela Microsoft em 2012, que adiciona tipagem estática opcional ao JS.\n\n**Por que usar TypeScript?**\n- Detecta erros em tempo de compilação (não em execução)\n- IntelliSense muito melhor em IDEs\n- Refactoring mais seguro em projetos grandes\n- Compila para JavaScript puro — compatível com tudo\n\n**Exemplo:**\n```ts\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\ngreet(42); // ❌ Erro em compilação!\n```\n\nAdotado pelo Angular, Next.js, NestJS. Mais de 80% dos devs TypeScript relatam redução de bugs em produção.',
    en: '**TypeScript** is a JavaScript superset created by Microsoft in 2012 that adds optional static typing.\n\n**Why use TypeScript?**\n- Catches errors at compile time (not runtime)\n- Far better IntelliSense in IDEs\n- Safer refactoring in large projects\n- Compiles to plain JavaScript — compatible with everything\n\n**Example:**\n```ts\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\ngreet(42); // ❌ Compile-time error!\n```\n\nAdopted by Angular, Next.js, NestJS. Over 80% of TypeScript devs report fewer production bugs.',
    es: '**TypeScript** es un superset de JavaScript creado por Microsoft en 2012 que agrega tipado estático opcional.\n\nDetecta errores en tiempo de compilación, mejora el IntelliSense en IDEs y hace el refactoring más seguro. Compila a JavaScript puro, compatible con todo.\n\nAdoptado por Angular, Next.js, NestJS.'
  },

  csharp: {
    pt: '**C#** é uma linguagem de programação orientada a objetos criada pela Microsoft (Anders Hejlsberg) em 2000, parte do ecossistema .NET.\n\n**Principais usos:**\n- Desenvolvimento desktop (Windows Forms, WPF, MAUI)\n- Backend web (ASP.NET Core)\n- Jogos (Unity — o motor favorito de Eduardo!)\n- Aplicações empresariais\n\n**Características:**\n- Fortemente tipada e compilada\n- Coleta de lixo automática\n- LINQ para consultas a dados\n- async/await nativo\n- Interoperável com outras linguagens .NET (F#, VB.NET)\n\nC# é frequentemente classificada entre as 5 linguagens mais populares do mundo.',
    en: '**C#** is an object-oriented programming language created by Microsoft (Anders Hejlsberg) in 2000, part of the .NET ecosystem.\n\n**Primary uses:**\n- Desktop development (Windows Forms, WPF, MAUI)\n- Web backend (ASP.NET Core)\n- Game development (Unity)\n- Enterprise applications\n\n**Characteristics:**\n- Strongly typed and compiled\n- Automatic garbage collection\n- LINQ for data queries\n- Native async/await\n- Interoperable with other .NET languages\n\nC# consistently ranks among the top 5 most popular languages globally.',
    es: '**C#** es un lenguaje orientado a objetos creado por Microsoft en 2000, parte del ecosistema .NET.\n\nUsado para desarrollo de escritorio (Windows Forms, WPF), backend web (ASP.NET Core), videojuegos (Unity) y aplicaciones empresariales. Fuertemente tipado, con recolección de basura automática y async/await nativo.'
  },

  /* ── WEB DEVELOPMENT ── */
  html: {
    pt: '**HTML5** (HyperText Markup Language) é a espinha dorsal da web — define a estrutura e significado do conteúdo.\n\n**Elementos semânticos HTML5:**\n`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`\n\n**Novidades importantes do HTML5:**\n- `<canvas>` e `<video>` / `<audio>` nativos\n- APIs: Geolocation, Web Storage, IndexedDB, Service Workers\n- Formulários: tipos `date`, `email`, `range`, `color`\n- Web Components (Custom Elements, Shadow DOM)\n\n**Acessibilidade:** Use atributos ARIA (`aria-label`, `role`) para leitores de tela.\n\nO HTML é padronizado pelo W3C e WHATWG. A versão atual é HTML Living Standard.',
    en: '**HTML5** (HyperText Markup Language) is the backbone of the web — it defines the structure and meaning of content.\n\n**HTML5 semantic elements:**\n`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`\n\n**HTML5 key additions:**\n- Native `<canvas>`, `<video>` / `<audio>`\n- APIs: Geolocation, Web Storage, IndexedDB, Service Workers\n- Form types: `date`, `email`, `range`, `color`\n- Web Components (Custom Elements, Shadow DOM)\n\n**Accessibility:** Use ARIA attributes (`aria-label`, `role`) for screen readers.\n\nHTML is standardized by W3C and WHATWG as HTML Living Standard.',
    es: '**HTML5** es la columna vertebral de la web — define la estructura y el significado del contenido.\n\nIncluye elementos semánticos (`<header>`, `<nav>`, `<main>`, `<article>`), APIs nativas (Geolocation, Web Storage, IndexedDB), elementos multimedia (`<canvas>`, `<video>`, `<audio>`) y Web Components.\n\nEstandarizado por W3C y WHATWG como HTML Living Standard.'
  },

  css: {
    pt: '**CSS3** (Cascading Style Sheets) controla a apresentação visual da web.\n\n**Módulos modernos essenciais:**\n- **Flexbox** — layout unidimensional (linha ou coluna)\n- **CSS Grid** — layout bidimensional de alto poder\n- **Custom Properties** — variáveis CSS nativas (`--primary-color: #3b82f6`)\n- **Animations & Transitions** — movimentos suaves sem JavaScript\n- **Media Queries** — design responsivo por breakpoint\n- **Container Queries** — responsividade por tamanho do componente (CSS4)\n\n**Pré-processadores:** Sass, Less, Stylus\n**Frameworks:** Tailwind CSS, Bootstrap, Bulma\n\n**Dica de ouro:** CSS Cascade Layers (`@layer`) e Scope (`@scope`) são as features mais poderosas de 2023–2024.',
    en: '**CSS3** (Cascading Style Sheets) controls the visual presentation of the web.\n\n**Essential modern modules:**\n- **Flexbox** — one-dimensional layout (row or column)\n- **CSS Grid** — powerful two-dimensional layout\n- **Custom Properties** — native CSS variables (`--primary-color: #3b82f6`)\n- **Animations & Transitions** — smooth movement without JavaScript\n- **Media Queries** — responsive design by breakpoint\n- **Container Queries** — component-size responsiveness (CSS4)\n\n**Preprocessors:** Sass, Less, Stylus\n**Frameworks:** Tailwind CSS, Bootstrap, Bulma\n\n**Pro tip:** CSS Cascade Layers (`@layer`) and Scope (`@scope`) are the most powerful features of 2023–2024.',
    es: '**CSS3** controla la presentación visual de la web.\n\nMódulos esenciales: Flexbox (layout unidimensional), CSS Grid (bidimensional), Custom Properties (variables CSS nativas), Animations & Transitions, Media Queries y Container Queries.\n\nPreprocesadores: Sass, Less. Frameworks: Tailwind CSS, Bootstrap, Bulma.'
  },

  react: {
    pt: '**React** é uma biblioteca JavaScript criada pelo Facebook (Meta) em 2013 para construir interfaces de usuário.\n\n**Conceitos centrais:**\n- **Componentes** — blocos de UI reutilizáveis (function ou class)\n- **JSX** — sintaxe que mistura JS com HTML-like markup\n- **Virtual DOM** — reconciliação eficiente de mudanças\n- **Hooks** — `useState`, `useEffect`, `useContext`, `useMemo`...\n- **Unidirectional data flow** — estado desce, eventos sobem\n\n**Ecossistema React 2024–2025:**\nNext.js (meta-framework) | Remix | React Native (mobile) | React Server Components\n\n**State management:** Redux Toolkit, Zustand, Jotai, TanStack Query\n\nReact domina o mercado frontend com ~40% de uso entre frameworks JS.',
    en: '**React** is a JavaScript library created by Facebook (Meta) in 2013 for building user interfaces.\n\n**Core concepts:**\n- **Components** — reusable UI building blocks (function or class)\n- **JSX** — syntax that mixes JS with HTML-like markup\n- **Virtual DOM** — efficient change reconciliation\n- **Hooks** — `useState`, `useEffect`, `useContext`, `useMemo`...\n- **Unidirectional data flow** — state flows down, events flow up\n\n**2024–2025 React Ecosystem:**\nNext.js (meta-framework) | Remix | React Native (mobile) | React Server Components\n\n**State management:** Redux Toolkit, Zustand, Jotai, TanStack Query\n\nReact dominates the frontend market with ~40% usage share among JS frameworks.',
    es: '**React** es una biblioteca JavaScript creada por Facebook (Meta) en 2013 para construir interfaces de usuario.\n\nConceptos clave: Componentes reutilizables, JSX, Virtual DOM, Hooks (useState, useEffect), flujo de datos unidireccional.\n\nEcosistema: Next.js, React Native, Redux Toolkit, Zustand. Domina el mercado frontend con ~40% de uso.'
  },

  nodejs: {
    pt: '**Node.js** é um runtime JavaScript do lado do servidor, construído sobre o motor V8 do Chrome, criado por Ryan Dahl em 2009.\n\n**Por que Node.js é revolucionário?**\n- Event loop não-bloqueante — lida com milhares de conexões simultâneas\n- Um único ecossistema (npm) para frontend e backend\n- Ideal para APIs em tempo real, streaming, microserviços\n\n**Frameworks principais:**\nExpress.js (minimalista) | Fastify (alto desempenho) | NestJS (arquitetura Angular-like) | Hono (edge computing)\n\n**Alternativas modernas ao Node:**\n- **Deno** — seguro por padrão, TypeScript nativo (Ryan Dahl, 2018)\n- **Bun** — runtime ultra-rápido com bundler e test runner integrados (2023)\n\nNode alimenta o backend de Netflix, LinkedIn, Uber, e muitas startups.',
    en: '**Node.js** is a server-side JavaScript runtime built on Chrome\'s V8 engine, created by Ryan Dahl in 2009.\n\n**Why Node.js is revolutionary:**\n- Non-blocking event loop — handles thousands of simultaneous connections\n- Single ecosystem (npm) for both frontend and backend\n- Ideal for real-time APIs, streaming, microservices\n\n**Main frameworks:**\nExpress.js (minimalist) | Fastify (high performance) | NestJS (Angular-like architecture) | Hono (edge computing)\n\n**Modern Node alternatives:**\n- **Deno** — secure by default, native TypeScript (Ryan Dahl, 2018)\n- **Bun** — ultra-fast runtime with built-in bundler and test runner (2023)\n\nNode powers the backend of Netflix, LinkedIn, Uber, and countless startups.',
    es: '**Node.js** es un runtime JavaScript del lado del servidor construido sobre el motor V8 de Chrome, creado por Ryan Dahl en 2009.\n\nEvent loop no bloqueante, maneja miles de conexiones simultáneas. Frameworks: Express.js, Fastify, NestJS, Hono. Alternativas: Deno y Bun.\n\nAlimenta el backend de Netflix, LinkedIn y Uber.'
  },

  /* ── DATABASES ── */
  sql: {
    pt: '**SQL** (Structured Query Language) é a linguagem padrão para bancos de dados relacionais, criada nos anos 1970 na IBM.\n\n**Comandos fundamentais:**\n```sql\nSELECT nome, email FROM usuarios WHERE ativo = 1;\nINSERT INTO produtos (nome, preco) VALUES (\'Notebook\', 3999.99);\nUPDATE pedidos SET status = \'enviado\' WHERE id = 42;\nDELETE FROM sessoes WHERE expirou_em < NOW();\n```\n\n**JOINs essenciais:**\n- `INNER JOIN` — somente registros que casam em ambas as tabelas\n- `LEFT JOIN` — todos da esquerda + casamentos da direita\n- `RIGHT JOIN` — todos da direita + casamentos da esquerda\n\n**SGBDs populares:** PostgreSQL, MySQL/MariaDB, SQLite, SQL Server, Oracle\n\n**Dica avançada:** Window Functions (`ROW_NUMBER()`, `LAG()`, `PARTITION BY`) são transformadoras para análise.',
    en: '**SQL** (Structured Query Language) is the standard language for relational databases, created in the 1970s at IBM.\n\n**Core commands:**\n```sql\nSELECT name, email FROM users WHERE active = 1;\nINSERT INTO products (name, price) VALUES (\'Laptop\', 999.99);\nUPDATE orders SET status = \'shipped\' WHERE id = 42;\nDELETE FROM sessions WHERE expired_at < NOW();\n```\n\n**Essential JOINs:**\n- `INNER JOIN` — only matching records from both tables\n- `LEFT JOIN` — all from left + right matches\n- `RIGHT JOIN` — all from right + left matches\n\n**Popular DBMSs:** PostgreSQL, MySQL/MariaDB, SQLite, SQL Server, Oracle\n\n**Advanced tip:** Window Functions (`ROW_NUMBER()`, `LAG()`, `PARTITION BY`) are game-changing for analytics.',
    es: '**SQL** es el lenguaje estándar para bases de datos relacionales, creado en los años 70 en IBM.\n\nComandos fundamentales: SELECT, INSERT, UPDATE, DELETE. JOINs: INNER, LEFT, RIGHT.\n\nSGBDs populares: PostgreSQL, MySQL, SQLite, SQL Server, Oracle. Las Window Functions son clave para análisis avanzados.'
  },

  /* ── GIT & VERSION CONTROL ── */
  git: {
    pt: '**Git** é o sistema de controle de versão distribuído criado por Linus Torvalds em 2005 (para o kernel Linux).\n\n**Fluxo de trabalho básico:**\n```bash\ngit init                    # inicializar repositório\ngit add .                   # stage todas as mudanças\ngit commit -m "feat: login" # commit com mensagem\ngit push origin main        # enviar para remoto\ngit pull                    # baixar atualizações\n```\n\n**Branches:**\n```bash\ngit checkout -b feature/auth   # criar e mudar para branch\ngit merge feature/auth         # mesclar na branch atual\ngit rebase main                # rebase (histórico linear)\n```\n\n**Plataformas:** GitHub (Microsoft), GitLab, Bitbucket, Gitea\n\n**Conventional Commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`\n\nGit é usado em virtualmente 100% dos projetos de software modernos.',
    en: '**Git** is the distributed version control system created by Linus Torvalds in 2005 (for the Linux kernel).\n\n**Basic workflow:**\n```bash\ngit init                    # initialize repo\ngit add .                   # stage all changes\ngit commit -m "feat: login" # commit with message\ngit push origin main        # push to remote\ngit pull                    # fetch + merge updates\n```\n\n**Branches:**\n```bash\ngit checkout -b feature/auth   # create and switch to branch\ngit merge feature/auth         # merge into current branch\ngit rebase main                # rebase (linear history)\n```\n\n**Platforms:** GitHub (Microsoft), GitLab, Bitbucket, Gitea\n\n**Conventional Commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`\n\nGit is used in virtually 100% of modern software projects.',
    es: '**Git** es el sistema de control de versiones distribuido creado por Linus Torvalds en 2005.\n\nFlujo básico: git init, git add, git commit, git push, git pull.\nRamas: git checkout -b, git merge, git rebase.\n\nPlataformas: GitHub, GitLab, Bitbucket. Usado en prácticamente el 100% de proyectos modernos.'
  },

  /* ── ARTIFICIAL INTELLIGENCE ── */
  ia: {
    pt: '**Inteligência Artificial (IA)** é o campo da ciência da computação que desenvolve sistemas capazes de executar tarefas que normalmente requerem inteligência humana.\n\n**Subcampos principais:**\n- **Machine Learning (ML)** — sistemas que aprendem com dados\n- **Deep Learning** — redes neurais com múltiplas camadas\n- **NLP** — Processamento de Linguagem Natural\n- **Computer Vision** — interpretação de imagens/vídeo\n- **RL** — Aprendizado por Reforço (AlphaGo, ChatGPT RLHF)\n\n**Grandes Modelos de Linguagem (LLMs):**\nGPT-4o (OpenAI), Claude (Anthropic), Gemini (Google), Llama 3 (Meta), Mistral\n\n**Ferramentas e frameworks:**\nTensorFlow, PyTorch, Hugging Face, LangChain, LlamaIndex\n\n**2024–2025:** Agentes de IA autônomos, multimodalidade, IA on-device.',
    en: '**Artificial Intelligence (AI)** is the field of computer science developing systems capable of tasks that normally require human intelligence.\n\n**Main subfields:**\n- **Machine Learning (ML)** — systems that learn from data\n- **Deep Learning** — neural networks with multiple layers\n- **NLP** — Natural Language Processing\n- **Computer Vision** — image/video interpretation\n- **RL** — Reinforcement Learning (AlphaGo, ChatGPT RLHF)\n\n**Large Language Models (LLMs):**\nGPT-4o (OpenAI), Claude (Anthropic), Gemini (Google), Llama 3 (Meta), Mistral\n\n**Tools & frameworks:**\nTensorFlow, PyTorch, Hugging Face, LangChain, LlamaIndex\n\n**2024–2025:** Autonomous AI agents, multimodality, on-device AI.',
    es: '**Inteligencia Artificial** es el campo que desarrolla sistemas capaces de tareas que normalmente requieren inteligencia humana.\n\nSubcampos: Machine Learning, Deep Learning, NLP, Computer Vision, Reinforcement Learning.\n\nLLMs destacados: GPT-4o (OpenAI), Claude (Anthropic), Gemini (Google), Llama 3 (Meta).\n\nHerramientas: TensorFlow, PyTorch, Hugging Face, LangChain.'
  },

  llm: {
    pt: '**Large Language Models (LLMs)** são modelos de IA treinados em vastas quantidades de texto para entender e gerar linguagem natural.\n\n**Como funcionam:**\n1. Tokenização do texto em subpalavras\n2. Transformer encoder/decoder processa o contexto\n3. Mecanismo de atenção pondera a relevância de cada token\n4. Geração autoregressiva: prediz o próximo token\n\n**LLMs mais importantes (2024–2025):**\n| Modelo | Empresa | Destaque |\n|--------|---------|----------|\n| GPT-4o | OpenAI | Multimodal, rápido |\n| Claude 3.5 Sonnet | Anthropic | Raciocínio, segurança |\n| Gemini 1.5 Pro | Google | Contexto 1M tokens |\n| Llama 3.1 | Meta | Open-source |\n| Mistral Large | Mistral | Eficiência |\n\n**Técnicas:** RAG (Retrieval-Augmented Generation), Fine-tuning, Prompt Engineering, RLHF.',
    en: '**Large Language Models (LLMs)** are AI models trained on massive amounts of text to understand and generate natural language.\n\n**How they work:**\n1. Text tokenization into subwords\n2. Transformer encoder/decoder processes context\n3. Attention mechanism weighs relevance of each token\n4. Autoregressive generation: predicts the next token\n\n**Most important LLMs (2024–2025):**\n| Model | Company | Highlight |\n|-------|---------|----------|\n| GPT-4o | OpenAI | Multimodal, fast |\n| Claude 3.5 Sonnet | Anthropic | Reasoning, safety |\n| Gemini 1.5 Pro | Google | 1M token context |\n| Llama 3.1 | Meta | Open-source |\n| Mistral Large | Mistral | Efficiency |\n\n**Techniques:** RAG, Fine-tuning, Prompt Engineering, RLHF.',
    es: '**Los Grandes Modelos de Lenguaje (LLMs)** son modelos de IA entrenados en vastas cantidades de texto.\n\nFuncionan mediante tokenización, transformers y mecanismos de atención para predecir el siguiente token.\n\nLLMs destacados: GPT-4o (OpenAI), Claude 3.5 Sonnet (Anthropic), Gemini 1.5 Pro (Google), Llama 3.1 (Meta).'
  },

  /* ── ALGORITHMS & DATA STRUCTURES ── */
  algoritmos: {
    pt: '**Algoritmos e Estruturas de Dados** são os fundamentos da ciência da computação.\n\n**Estruturas de dados essenciais:**\n- **Array** — acesso O(1), inserção O(n)\n- **Linked List** — inserção O(1), busca O(n)\n- **Stack (LIFO)** — push/pop O(1)\n- **Queue (FIFO)** — enqueue/dequeue O(1)\n- **Hash Table** — busca média O(1)\n- **Binary Tree** — busca/inserção O(log n) em árvore balanceada\n- **Graph** — modelagem de redes e relações\n\n**Algoritmos de ordenação:**\n| Algoritmo | Médio | Pior caso | Estável? |\n|-----------|-------|-----------|----------|\n| QuickSort | O(n log n) | O(n²) | ❌ |\n| MergeSort | O(n log n) | O(n log n) | ✅ |\n| HeapSort | O(n log n) | O(n log n) | ❌ |\n| TimSort | O(n log n) | O(n log n) | ✅ |\n\n**Paradigmas:** Dividir e Conquistar, Programação Dinâmica, Greedy, Backtracking.',
    en: '**Algorithms and Data Structures** are the foundations of computer science.\n\n**Essential data structures:**\n- **Array** — O(1) access, O(n) insertion\n- **Linked List** — O(1) insertion, O(n) search\n- **Stack (LIFO)** — push/pop O(1)\n- **Queue (FIFO)** — enqueue/dequeue O(1)\n- **Hash Table** — average O(1) lookup\n- **Binary Tree** — O(log n) search/insert in balanced tree\n- **Graph** — modeling networks and relationships\n\n**Sorting algorithms:**\n| Algorithm | Average | Worst case | Stable? |\n|-----------|---------|------------|--------|\n| QuickSort | O(n log n) | O(n²) | ❌ |\n| MergeSort | O(n log n) | O(n log n) | ✅ |\n| HeapSort | O(n log n) | O(n log n) | ❌ |\n| TimSort | O(n log n) | O(n log n) | ✅ |\n\n**Paradigms:** Divide & Conquer, Dynamic Programming, Greedy, Backtracking.',
    es: '**Algoritmos y Estructuras de Datos** son los fundamentos de la informática.\n\nEstructuras esenciales: Array, Linked List, Stack (LIFO), Queue (FIFO), Hash Table, Binary Tree, Graph.\n\nAlgoritmos de ordenación: QuickSort O(n log n) inestable, MergeSort O(n log n) estable, TimSort usado en Python/Java.\n\nParadigmas: Dividir y Conquistar, Programación Dinámica, Greedy, Backtracking.'
  },

  /* ── CLOUD & DEVOPS ── */
  cloud: {
    pt: '**Computação em Nuvem** é o fornecimento de serviços de TI pela internet (servidores, armazenamento, bancos de dados, redes, software).\n\n**3 grandes players:**\n| Provider | Market Share | Destaque |\n|----------|-------------|----------|\n| AWS (Amazon) | ~31% | Mais serviços, mais maduro |\n| Azure (Microsoft) | ~24% | Integração Office/AD |\n| GCP (Google) | ~12% | ML/IA, Kubernetes |\n\n**Modelos de serviço:**\n- **IaaS** — Infraestrutura como Serviço (EC2, VMs)\n- **PaaS** — Plataforma como Serviço (Heroku, App Engine)\n- **SaaS** — Software como Serviço (Gmail, Salesforce)\n- **FaaS/Serverless** — Lambda, Cloud Functions, Vercel\n\n**DevOps essencial:** Docker, Kubernetes, Terraform, CI/CD (GitHub Actions, GitLab CI).',
    en: '**Cloud Computing** is the delivery of IT services over the internet (servers, storage, databases, networking, software).\n\n**3 major players:**\n| Provider | Market Share | Highlight |\n|----------|-------------|----------|\n| AWS (Amazon) | ~31% | Most services, most mature |\n| Azure (Microsoft) | ~24% | Office/AD integration |\n| GCP (Google) | ~12% | ML/AI, Kubernetes |\n\n**Service models:**\n- **IaaS** — Infrastructure as a Service (EC2, VMs)\n- **PaaS** — Platform as a Service (Heroku, App Engine)\n- **SaaS** — Software as a Service (Gmail, Salesforce)\n- **FaaS/Serverless** — Lambda, Cloud Functions, Vercel\n\n**Essential DevOps:** Docker, Kubernetes, Terraform, CI/CD (GitHub Actions, GitLab CI).',
    es: '**Computación en la Nube** es la entrega de servicios de TI por internet.\n\nTres grandes: AWS (~31%), Azure (~24%), GCP (~12%).\n\nModelos: IaaS (infraestructura), PaaS (plataforma), SaaS (software), FaaS/Serverless.\n\nDevOps esencial: Docker, Kubernetes, Terraform, CI/CD.'
  },

  docker: {
    pt: '**Docker** é uma plataforma de conteinerização criada em 2013 que empacota aplicações com todas as suas dependências.\n\n**Conceitos chave:**\n- **Imagem** — template imutável (Dockerfile define como construir)\n- **Contêiner** — instância em execução de uma imagem\n- **Registry** — repositório de imagens (Docker Hub, ECR, GCR)\n- **Volume** — persistência de dados fora do contêiner\n- **Network** — comunicação entre contêineres\n\n**Exemplo Dockerfile:**\n```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json .\nRUN npm ci --production\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]\n```\n\n**Docker Compose** — orquestração de múltiplos serviços localmente.\n**Kubernetes** — orquestração em produção (autoescala, rollouts, saúde).',
    en: '**Docker** is a containerization platform created in 2013 that packages applications with all their dependencies.\n\n**Key concepts:**\n- **Image** — immutable template (Dockerfile defines how to build)\n- **Container** — running instance of an image\n- **Registry** — image repository (Docker Hub, ECR, GCR)\n- **Volume** — data persistence outside the container\n- **Network** — communication between containers\n\n**Example Dockerfile:**\n```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json .\nRUN npm ci --production\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]\n```\n\n**Docker Compose** — multi-service local orchestration.\n**Kubernetes** — production orchestration (autoscaling, rollouts, health checks).',
    es: '**Docker** es una plataforma de contenedores creada en 2013 que empaqueta aplicaciones con todas sus dependencias.\n\nConceptos: Imagen (template), Contenedor (instancia), Registry, Volume, Network.\n\nDocker Compose para orquestación local; Kubernetes para producción.'
  },

  /* ── CYBERSECURITY ── */
  seguranca: {
    pt: '**Cibersegurança** é o conjunto de práticas para proteger sistemas, redes e dados contra ataques digitais.\n\n**Principais ameaças:**\n- **Phishing** — engenharia social para roubo de credenciais\n- **SQL Injection** — inserção de código malicioso em queries\n- **XSS** — Cross-Site Scripting (injeção de JS em páginas)\n- **CSRF** — Cross-Site Request Forgery\n- **Ransomware** — cifra os dados e exige pagamento\n- **Man-in-the-Middle** — interceptação de comunicação\n\n**Boas práticas para devs (OWASP Top 10):**\n1. Sanitizar inputs\n2. Usar HTTPS/TLS sempre\n3. Tokens JWT com expiração\n4. Senhas com bcrypt/Argon2\n5. Autenticação multifator (MFA)\n6. Princípio do menor privilégio\n7. Headers de segurança (CSP, HSTS)\n\n**Frameworks:** OWASP, NIST CSF, ISO 27001.',
    en: '**Cybersecurity** is the set of practices to protect systems, networks, and data from digital attacks.\n\n**Main threats:**\n- **Phishing** — social engineering for credential theft\n- **SQL Injection** — malicious code insertion in queries\n- **XSS** — Cross-Site Scripting (JS injection in pages)\n- **CSRF** — Cross-Site Request Forgery\n- **Ransomware** — encrypts data and demands payment\n- **Man-in-the-Middle** — communication interception\n\n**Dev best practices (OWASP Top 10):**\n1. Sanitize inputs\n2. Always use HTTPS/TLS\n3. JWT tokens with expiration\n4. Passwords with bcrypt/Argon2\n5. Multi-factor authentication (MFA)\n6. Principle of least privilege\n7. Security headers (CSP, HSTS)\n\n**Frameworks:** OWASP, NIST CSF, ISO 27001.',
    es: '**Ciberseguridad** es el conjunto de prácticas para proteger sistemas, redes y datos de ataques digitales.\n\nAmenazas principales: Phishing, SQL Injection, XSS, CSRF, Ransomware, Man-in-the-Middle.\n\nBuenas prácticas (OWASP Top 10): Sanitizar inputs, HTTPS/TLS, JWT con expiración, bcrypt/Argon2, MFA, principio de menor privilegio.'
  },

  /* ── GAME DEVELOPMENT ── */
  unity: {
    pt: '**Unity** é um dos motores de jogos mais populares do mundo, criado em 2005, usado para jogos 2D, 3D, VR e AR.\n\n**Linguagem principal:** C# (que Eduardo domina!)\n\n**Conceitos Unity:**\n- **GameObject** — qualquer objeto na cena\n- **Component** — comportamento adicionado a um GameObject\n- **Transform** — posição, rotação, escala\n- **MonoBehaviour** — classe base para scripts\n- **Unity Event System** — gerencia entrada e UI\n- **Physics** — Rigidbody, Collider, Raycast\n\n**Funções do ciclo de vida:**\n```csharp\nvoid Awake()   { /* antes do Start, sempre */ }\nvoid Start()   { /* frame inicial */ }\nvoid Update()  { /* todo frame */ }\nvoid FixedUpdate() { /* física */ }\n```\n\nUnity é usado em Pokémon GO, Cuphead, Hollow Knight, Ori and the Blind Forest.',
    en: '**Unity** is one of the world\'s most popular game engines, created in 2005, used for 2D, 3D, VR, and AR games.\n\n**Primary language:** C# (which Eduardo knows!)\n\n**Unity concepts:**\n- **GameObject** — any object in the scene\n- **Component** — behavior added to a GameObject\n- **Transform** — position, rotation, scale\n- **MonoBehaviour** — base class for scripts\n- **Unity Event System** — manages input and UI\n- **Physics** — Rigidbody, Collider, Raycast\n\n**Lifecycle functions:**\n```csharp\nvoid Awake()   { /* before Start, always */ }\nvoid Start()   { /* first frame */ }\nvoid Update()  { /* every frame */ }\nvoid FixedUpdate() { /* physics */ }\n```\n\nUnity powers Pokémon GO, Cuphead, Hollow Knight, Ori and the Blind Forest.',
    es: '**Unity** es uno de los motores de juegos más populares del mundo, creado en 2005 para juegos 2D, 3D, VR y AR.\n\nLenguaje principal: C#. Conceptos: GameObject, Component, Transform, MonoBehaviour, Physics.\n\nCiclo de vida: Awake(), Start(), Update(), FixedUpdate().\n\nUsado en Pokémon GO, Cuphead, Hollow Knight, Ori and the Blind Forest.'
  },

  /* ── COMPUTER SCIENCE FOUNDATIONS ── */
  oop: {
    pt: '**Programação Orientada a Objetos (POO/OOP)** é o paradigma de programação baseado em objetos que combinam dados e comportamento.\n\n**Os 4 pilares:**\n\n**1. Encapsulamento** — esconder detalhes internos\n```csharp\nprivate string _senha;\npublic void SetSenha(string s) { _senha = Hash(s); }\n```\n\n**2. Herança** — reaproveitar código de uma classe pai\n```csharp\nclass Gato : Animal { void Miar() { ... } }\n```\n\n**3. Polimorfismo** — um método, múltiplas formas\n```csharp\nanimal.FazerSom(); // Dog: "Au", Cat: "Miau"\n```\n\n**4. Abstração** — expor apenas o essencial\n```csharp\nabstract class Forma { abstract double Area(); }\n```\n\n**Princípios SOLID:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    en: '**Object-Oriented Programming (OOP)** is a programming paradigm based on objects that combine data and behavior.\n\n**The 4 pillars:**\n\n**1. Encapsulation** — hiding internal details\n```csharp\nprivate string _password;\npublic void SetPassword(string p) { _password = Hash(p); }\n```\n\n**2. Inheritance** — reusing code from a parent class\n```csharp\nclass Cat : Animal { void Meow() { ... } }\n```\n\n**3. Polymorphism** — one method, multiple forms\n```csharp\nanimal.MakeSound(); // Dog: "Woof", Cat: "Meow"\n```\n\n**4. Abstraction** — exposing only the essentials\n```csharp\nabstract class Shape { abstract double Area(); }\n```\n\n**SOLID Principles:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    es: '**Programación Orientada a Objetos (POO)** es un paradigma basado en objetos que combinan datos y comportamiento.\n\nLos 4 pilares: Encapsulamiento (ocultar detalles internos), Herencia (reutilizar código de clase padre), Polimorfismo (un método, múltiples formas), Abstracción (exponer solo lo esencial).\n\nPrincipios SOLID: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.'
  },

  /* ── CAREER & JOBS ── */
  carreira: {
    pt: '**Carreira em Tecnologia** — Um guia para crescer na área de TI.\n\n**Trilhas principais:**\n- **Frontend** — React, Vue, CSS/UX, acessibilidade\n- **Backend** — Node.js, Python, Java, Go, bases de dados\n- **Full Stack** — Frontend + Backend\n- **DevOps/SRE** — cloud, Docker, Kubernetes, CI/CD\n- **Data Science/ML** — Python, stats, ML, visualização\n- **Cybersecurity** — redes, SO, pentest, SIEM\n- **Mobile** — Android/iOS, React Native, Flutter\n- **Game Dev** — Unity (C#), Unreal (C++)\n\n**Como se destacar:**\n1. Portfólio no GitHub com projetos reais\n2. Open Source contributions\n3. Blog técnico ou perfil ativo no LinkedIn\n4. LeetCode/HackerRank para entrevistas\n5. Certificações relevantes (AWS, GCP, Azure)\n\nO mercado de TI no Brasil cresce ~15% ao ano e tem escassez crônica de profissionais.',
    en: '**Career in Technology** — A guide to growing in the IT field.\n\n**Main tracks:**\n- **Frontend** — React, Vue, CSS/UX, accessibility\n- **Backend** — Node.js, Python, Java, Go, databases\n- **Full Stack** — Frontend + Backend\n- **DevOps/SRE** — cloud, Docker, Kubernetes, CI/CD\n- **Data Science/ML** — Python, stats, ML, visualization\n- **Cybersecurity** — networks, OS, pentesting, SIEM\n- **Mobile** — Android/iOS, React Native, Flutter\n- **Game Dev** — Unity (C#), Unreal (C++)\n\n**How to stand out:**\n1. GitHub portfolio with real projects\n2. Open source contributions\n3. Technical blog or active LinkedIn profile\n4. LeetCode/HackerRank for interviews\n5. Relevant certifications (AWS, GCP, Azure)\n\nThe Brazilian IT market grows ~15% per year with chronic professional shortages.',
    es: '**Carrera en Tecnología** — Guía para crecer en TI.\n\nTrillos principales: Frontend, Backend, Full Stack, DevOps/SRE, Data Science/ML, Ciberseguridad, Mobile, Game Dev.\n\nCómo destacar: Portafolio en GitHub, contribuciones Open Source, blog técnico, LeetCode para entrevistas, certificaciones relevantes.'
  },

  /* ── COMPUTING HISTORY ── */
  historia: {
    pt: '**História da Computação** — Marcos fundamentais:\n\n**1843** — Ada Lovelace escreve o primeiro algoritmo computacional\n**1936** — Alan Turing publica o conceito de "máquina universal"\n**1945** — ENIAC: primeiro computador eletrônico de propósito geral\n**1947** — Transistor inventado nos Bell Labs (Bardeen, Brattain, Shockley)\n**1969** — ARPANET: precursor da internet | Unix criado\n**1971** — Intel 4004: primeiro microprocessador comercial\n**1981** — IBM PC lançado | MS-DOS\n**1991** — World Wide Web criada por Tim Berners-Lee\n**1994** — Linux 1.0 lançado por Linus Torvalds\n**1995** — Java, JavaScript, PHP surgem no mesmo ano!\n**2007** — iPhone revoluciona o mobile\n**2012** — AlexNet: marco do deep learning moderno\n**2022** — ChatGPT: IA generativa para o grande público\n**2023–2025** — Era dos Agentes de IA autônomos',
    en: '**History of Computing** — Fundamental milestones:\n\n**1843** — Ada Lovelace writes the first computational algorithm\n**1936** — Alan Turing publishes the concept of a "universal machine"\n**1945** — ENIAC: first general-purpose electronic computer\n**1947** — Transistor invented at Bell Labs (Bardeen, Brattain, Shockley)\n**1969** — ARPANET: internet precursor | Unix created\n**1971** — Intel 4004: first commercial microprocessor\n**1981** — IBM PC launched | MS-DOS\n**1991** — World Wide Web created by Tim Berners-Lee\n**1994** — Linux 1.0 released by Linus Torvalds\n**1995** — Java, JavaScript, PHP all appear in the same year!\n**2007** — iPhone revolutionizes mobile\n**2012** — AlexNet: milestone of modern deep learning\n**2022** — ChatGPT: generative AI for the general public\n**2023–2025** — Era of autonomous AI agents',
    es: '**Historia de la Computación** — Hitos fundamentales:\n\n1843: Ada Lovelace escribe el primer algoritmo. 1936: Alan Turing — máquina universal. 1945: ENIAC — primer computador electrónico. 1969: ARPANET + Unix. 1991: World Wide Web (Tim Berners-Lee). 1995: Java, JavaScript y PHP en el mismo año. 2007: iPhone. 2012: AlexNet (deep learning). 2022: ChatGPT. 2023–2025: Era de agentes de IA.'
  },

  /* ── MATH & CS THEORY ── */
  matematica: {
    pt: '**Matemática para Computação** — As áreas essenciais:\n\n**Álgebra Linear:**\n- Vetores, matrizes, transformações lineares\n- Essencial para: gráficos 3D, ML, processamento de sinais\n\n**Cálculo:**\n- Derivadas, integrais, gradientes\n- Essencial para: otimização em ML, física em jogos\n\n**Estatística e Probabilidade:**\n- Distribuições (normal, Poisson, Bernoulli)\n- Bayes, inferência, testes de hipótese\n- Essencial para: ML, análise de dados, A/B testing\n\n**Matemática Discreta:**\n- Lógica, teoria dos grafos, combinatória, complexidade\n- Essencial para: algoritmos, criptografia, BD\n\n**Notação Big-O:**\n- O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)\n\nRecurso gratuito: Khan Academy, MIT OpenCourseWare, 3Blue1Brown (YouTube).',
    en: '**Math for Computing** — Essential areas:\n\n**Linear Algebra:**\n- Vectors, matrices, linear transformations\n- Essential for: 3D graphics, ML, signal processing\n\n**Calculus:**\n- Derivatives, integrals, gradients\n- Essential for: ML optimization, game physics\n\n**Statistics and Probability:**\n- Distributions (normal, Poisson, Bernoulli)\n- Bayes, inference, hypothesis testing\n- Essential for: ML, data analysis, A/B testing\n\n**Discrete Mathematics:**\n- Logic, graph theory, combinatorics, complexity\n- Essential for: algorithms, cryptography, databases\n\n**Big-O Notation:**\n- O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)\n\nFree resources: Khan Academy, MIT OpenCourseWare, 3Blue1Brown (YouTube).',
    es: '**Matemáticas para Computación** — Áreas esenciales:\n\nÁlgebra Lineal (vectores, matrices — esencial para ML y gráficos 3D), Cálculo (derivadas, gradientes — esencial para optimización), Estadística y Probabilidad (distribuciones, Bayes — esencial para ML), Matemática Discreta (grafos, combinatoria — esencial para algoritmos).\n\nNotación Big-O: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).'
  },

  /* ── OPEN SOURCE ── */
  opensource: {
    pt: '**Open Source** (Código Aberto) é software cujo código-fonte é disponibilizado publicamente para uso, modificação e distribuição.\n\n**Licenças mais comuns:**\n- **MIT** — permissiva, pode usar em código proprietário\n- **Apache 2.0** — permissiva + proteção de patentes\n- **GPL v3** — copyleft forte (derivados devem ser abertos)\n- **LGPL** — copyleft fraco (bibliotecas podem ser usadas)\n- **Creative Commons** — para conteúdo não-software\n\n**Projetos open-source que movem o mundo:**\nLinux, Git, PostgreSQL, Node.js, Python, Firefox, VS Code, Kubernetes, React, TensorFlow\n\n**Como contribuir:**\n1. Encontre um projeto (github.com/explore)\n2. Leia o CONTRIBUTING.md\n3. Resolva issues marcadas "good first issue"\n4. Abra um Pull Request bem descrito\n\nContribuições OS elevam seu portfólio e currículo enormemente.',
    en: '**Open Source** is software whose source code is publicly available for use, modification, and distribution.\n\n**Most common licenses:**\n- **MIT** — permissive, can be used in proprietary code\n- **Apache 2.0** — permissive + patent protection\n- **GPL v3** — strong copyleft (derivatives must be open)\n- **LGPL** — weak copyleft (libraries can be used)\n- **Creative Commons** — for non-software content\n\n**Open-source projects that power the world:**\nLinux, Git, PostgreSQL, Node.js, Python, Firefox, VS Code, Kubernetes, React, TensorFlow\n\n**How to contribute:**\n1. Find a project (github.com/explore)\n2. Read CONTRIBUTING.md\n3. Resolve "good first issue" tickets\n4. Open a well-described Pull Request\n\nOS contributions greatly boost your portfolio and resume.',
    es: '**Open Source** es software cuyo código fuente está disponible públicamente.\n\nLicencias comunes: MIT (permisiva), Apache 2.0, GPL v3 (copyleft fuerte), LGPL, Creative Commons.\n\nProyectos que mueven el mundo: Linux, Git, PostgreSQL, Node.js, Python, Firefox, VS Code, Kubernetes, React.\n\nContribuir: buscar issues "good first issue" en GitHub y abrir Pull Requests bien descritos.'
  },

  /* ── SERVICENOW ── */
  servicenow: {
    pt: '**ServiceNow** é uma plataforma cloud de gestão de serviços empresariais (ITSM, HRSD, CSM, SecOps), fundada em 2003.\n\n**Módulos principais:**\n- **ITSM** — IT Service Management (Incidents, Changes, Problems)\n- **ITOM** — IT Operations Management\n- **HRSD** — HR Service Delivery\n- **CSM** — Customer Service Management\n- **GRC** — Governance, Risk, Compliance\n\n**Desenvolvimento na plataforma:**\n- JavaScript server-side (GlideRecord, GlideSystem)\n- Flow Designer (low-code workflows)\n- Integration Hub (conectores com APIs externas)\n- App Engine Studio (desenvolvimento no-code)\n- UI Builder (portais modernos)\n\n**Certificações relevantes:** CSA (Certified System Administrator), CAD, CIS-ITSM\n\nEduardo participou dos Bootcamps Shark in ServiceNow edições 4 e 8, e do Cask Camp (20h).',
    en: '**ServiceNow** is a cloud platform for enterprise service management (ITSM, HRSD, CSM, SecOps), founded in 2003.\n\n**Main modules:**\n- **ITSM** — IT Service Management (Incidents, Changes, Problems)\n- **ITOM** — IT Operations Management\n- **HRSD** — HR Service Delivery\n- **CSM** — Customer Service Management\n- **GRC** — Governance, Risk, Compliance\n\n**Platform development:**\n- Server-side JavaScript (GlideRecord, GlideSystem)\n- Flow Designer (low-code workflows)\n- Integration Hub (external API connectors)\n- App Engine Studio (no-code development)\n- UI Builder (modern portals)\n\n**Key certifications:** CSA, CAD, CIS-ITSM\n\nEduardo completed Shark in ServiceNow Bootcamps (editions 4 & 8) and Cask Camp (20h).',
    es: '**ServiceNow** es una plataforma cloud de gestión de servicios empresariales (ITSM, HRSD, CSM, SecOps), fundada en 2003.\n\nMódulos: ITSM, ITOM, HRSD, CSM, GRC.\n\nDesarrollo: JavaScript server-side (GlideRecord), Flow Designer, Integration Hub, App Engine Studio, UI Builder.\n\nEduardo completó los Bootcamps Shark in ServiceNow ediciones 4 y 8, y el Cask Camp (20h).'
  },

  /* ── MOBILE DEVELOPMENT ── */
  android: {
    pt: '**Desenvolvimento Android** — Criação de aplicativos para o maior SO mobile do mundo (72% de market share).\n\n**Ferramentas principais:**\n- **Android Studio** — IDE oficial baseada no IntelliJ\n- **Kotlin** — linguagem principal (substitui Java)\n- **Jetpack Compose** — UI declarativa moderna\n- **Gradle** — sistema de build\n\n**Componentes Android:**\n- Activity (tela), Fragment (parte de tela)\n- ViewModel + LiveData / StateFlow\n- Room (banco SQLite), Retrofit (HTTP), Hilt (DI)\n\n**Arquiteturas:** MVVM, MVI, Clean Architecture\n\n**Alternativas cross-platform:**\n- React Native (JavaScript)\n- Flutter (Dart)\n- MAUI (C# — ótimo para quem já sabe C#!)\n\nEduardo possui certificação em Desenvolvimento de Apps com Android Studio (Fundação Bradesco, 15h, 2026).',
    en: '**Android Development** — Building apps for the world\'s largest mobile OS (72% market share).\n\n**Main tools:**\n- **Android Studio** — official IDE based on IntelliJ\n- **Kotlin** — primary language (replaces Java)\n- **Jetpack Compose** — modern declarative UI\n- **Gradle** — build system\n\n**Android components:**\n- Activity (screen), Fragment (part of screen)\n- ViewModel + LiveData / StateFlow\n- Room (SQLite DB), Retrofit (HTTP), Hilt (DI)\n\n**Architectures:** MVVM, MVI, Clean Architecture\n\n**Cross-platform alternatives:**\n- React Native (JavaScript)\n- Flutter (Dart)\n- MAUI (C# — great for those who already know C#!)\n\nEduardo holds a certification in Android Studio App Development (Fundação Bradesco, 15h, 2026).',
    es: '**Desarrollo Android** — Creación de aplicaciones para el mayor SO móvil del mundo (72% de cuota de mercado).\n\nHerramientas: Android Studio (IDE), Kotlin (lenguaje principal), Jetpack Compose (UI declarativa), Gradle (build).\n\nAlternativas cross-platform: React Native (JavaScript), Flutter (Dart), MAUI (C#).\n\nEduardo tiene certificación en Android Studio (Fundação Bradesco, 15h, 2026).'
  }
};

/* ════════════════════════════════════════════════════════════════════════════
   ANSWERS — rich HTML, keyed, three languages.
   Use [[url|text]] syntax for links — rendered by renderMsgContent() in chat.js.
   Use **text** for bold. Use \n for line breaks.
════════════════════════════════════════════════════════════════════════════ */
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
    pt: 'Posso ajudar com informações sobre **Eduardo** — formação, tecnologias, projetos, prêmios, contato.\n\nOu pergunte sobre tecnologia: Python, JavaScript, Git, SQL, React, IA, Algoritmos, Cloud, Docker, Cibersegurança, Unity, Android e muito mais! 🚀',
    en: 'I can help with information about **Eduardo** — his education, technologies, projects, awards or contact.\n\nOr ask about technology: Python, JavaScript, Git, SQL, React, AI, Algorithms, Cloud, Docker, Cybersecurity, Unity, Android, and much more! 🚀',
    es: 'Puedo ayudarte con información sobre **Eduardo** — su formación, tecnologías, proyectos, premios o contacto.\n\n¡O pregúntame sobre tecnología: Python, JavaScript, Git, SQL, React, IA, Algoritmos, Cloud, Docker, Ciberseguridad, Unity, Android y mucho más! 🚀'
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
  pt: 'Olá! Sou o **Eduardo.AI** — um assistente de portfólio com conhecimentos gerais em tecnologia e programação, rodando 100% no seu navegador. Pergunte sobre o Eduardo ou qualquer coisa de tecnologia! 🚀',
  en: 'Hi! I\'m **Eduardo.AI** — a portfolio assistant with broad general knowledge in technology and programming, running entirely in your browser. Ask about Eduardo or anything tech-related! 🚀',
  es: '¡Hola! Soy **Eduardo.AI** — un asistente de portafolio con amplios conocimientos en tecnología y programación, funcionando completamente en tu navegador. ¡Pregunta sobre Eduardo o cualquier tema tecnológico! 🚀'
};

/* ════════════════════════════════════════════════════════════════════════════
   EXTENDED KEYWORD MAP
   Covers Eduardo topics + all general knowledge domains
════════════════════════════════════════════════════════════════════════════ */
window.KEYWORD_MAP = {
  pt: {
    /* ── Eduardo profile topics ── */
    sobre:          /quem|sobre|apresent|perfil|bio|nasceu|idade|anos|eduardo/i,
    formacao:       /form|estud|universid|faculdad|senac|michigan|ads|curso|escola|gradu/i,
    tecnologias:    /tecnolog|stack|linguagem|programa.*ling/i,
    projetos:       /projeto|campo minado|jogo|futuro do trabalho|portf/i,
    premios:        /prêmio|premio|award|ganhou|reconhec|conquist/i,
    contato:        /contato|contac|linkedin|site|email|redes|encontr|falar/i,
    /* ── General knowledge ── */
    python:         /\bpython\b/i,
    javascript:     /\bjavascript\b|\bjs\b/i,
    typescript:     /\btypescript\b|\bts\b/i,
    csharp:         /\bc#\b|\bcsharp\b|\b\.net\b/i,
    html:           /\bhtml\b/i,
    css:            /\bcss\b|\bflexbox\b|\bgrid\b|\bresponsiv/i,
    react:          /\breact\b/i,
    nodejs:         /\bnode\.?js\b|\bexpress\b|\bbun\b|\bdeno\b/i,
    sql:            /\bsql\b|\bbanco de dados\b|\bbd\b|\bquery\b|\bjoin\b/i,
    git:            /\bgit\b|\bgithub\b|\bgitlab\b|\bcommit\b|\bbranch\b/i,
    ia:             /\binteligência artificial\b|\b\bia\b(?!$)|\bmachine learning\b|\bml\b/i,
    llm:            /\bllm\b|\bmodelo.*linguag|\bgpt\b|\bclaude\b|\bgemini\b|\bllama\b/i,
    algoritmos:     /\balgoritm|\bestrutura.*dado|\bbig.?o\b|\bcomplexidad/i,
    cloud:          /\bcloud\b|\bnuvem\b|\baws\b|\bazure\b|\bgcp\b/i,
    docker:         /\bdocker\b|\bcontain|\bkubernetes\b|\bk8s\b/i,
    seguranca:      /\bsegurança\b|\bcibersegurança\b|\bsecurity\b|\bowasp\b|\bpentest/i,
    unity:          /\bunity\b|\bjogo.*motor|\bgame.*engine/i,
    oop:            /\boop\b|\borientad.*objeto|\bpoo\b|\bsolid\b|\bencapsul/i,
    carreira:       /\bcarreira\b|\bemprego\b|\btrilha\b|\bdev.*senior|\bfreela/i,
    historia:       /\bhistória\b|\btimeline\b|\bturing\b|\beniac\b|\barpanet/i,
    matematica:     /\bmatema|\bálgebra|\bestatístic|\bcálculo|\bbig.?o\b/i,
    opensource:     /\bopen.?source\b|\bcódigo aberto\b|\blicença\b|\bcontribu.*github/i,
    servicenow:     /\bservicenow\b|\bglide\b|\bitsm\b|\bflow designer/i,
    android:        /\bandroid\b|\bandroid studio\b|\bkotlin\b|\bflutter\b/i
  },
  en: {
    /* ── Eduardo profile topics ── */
    sobre:          /who|about|introduc|profile|bio|born|age|years|eduardo/i,
    formacao:       /educat|study|universit|college|senac|michigan|ads|course|school|degree/i,
    tecnologias:    /technolog|stack|programming.*lang/i,
    projetos:       /project|minesweeper|campo minado|game|future of work|portfolio/i,
    premios:        /award|prize|winner|won|recogni|achiev/i,
    contato:        /contact|linkedin|website|email|social|reach|find|talk/i,
    /* ── General knowledge ── */
    python:         /\bpython\b/i,
    javascript:     /\bjavascript\b|\bjs\b/i,
    typescript:     /\btypescript\b|\bts\b/i,
    csharp:         /\bc#\b|\bcsharp\b|\b\.net\b/i,
    html:           /\bhtml\b/i,
    css:            /\bcss\b|\bflexbox\b|\bgrid\b|\bresponsiv/i,
    react:          /\breact\b/i,
    nodejs:         /\bnode\.?js\b|\bexpress\b|\bbun\b|\bdeno\b/i,
    sql:            /\bsql\b|\bdatabase\b|\bdb\b|\bquery\b|\bjoin\b/i,
    git:            /\bgit\b|\bgithub\b|\bgitlab\b|\bcommit\b|\bbranch\b/i,
    ia:             /\bartificial intelligence\b|\bai\b(?!$)|\bmachine learning\b|\bml\b/i,
    llm:            /\bllm\b|\blanguage model|\bgpt\b|\bclaude\b|\bgemini\b|\bllama\b/i,
    algoritmos:     /\balgorithm|\bdata structure|\bbig.?o\b|\bcomplexity/i,
    cloud:          /\bcloud\b|\baws\b|\bazure\b|\bgcp\b/i,
    docker:         /\bdocker\b|\bcontain|\bkubernetes\b|\bk8s\b/i,
    seguranca:      /\bcybersecurity\b|\bsecurity\b|\bowasp\b|\bpentest/i,
    unity:          /\bunity\b|\bgame.*engine/i,
    oop:            /\boop\b|\bobject.oriented|\bsolid\b|\bencapsul/i,
    carreira:       /\bcareer\b|\bjob\b|\btrack\b|\bdev.*senior|\bfreelance/i,
    historia:       /\bhistory\b|\btimeline\b|\bturing\b|\beniac\b|\barpanet/i,
    matematica:     /\bmath|\blinear algebra|\bstatistics|\bcalculus|\bbig.?o\b/i,
    opensource:     /\bopen.?source\b|\blicense\b|\bcontribut.*github/i,
    servicenow:     /\bservicenow\b|\bglide\b|\bitsm\b|\bflow designer/i,
    android:        /\bandroid\b|\bkotlin\b|\bflutter\b/i
  },
  es: {
    /* ── Eduardo profile topics ── */
    sobre:          /quién|quien|sobre|presenta|perfil|bio|nació|edad|años|eduardo/i,
    formacao:       /forma|estudi|universid|senac|michigan|ads|curso|escuela|carrera/i,
    tecnologias:    /tecnolog|stack|lenguaje.*programac/i,
    projetos:       /proyecto|campo minado|juego|futuro del trabajo|portaf/i,
    premios:        /premio|award|ganó|gano|reconoc|logr/i,
    contato:        /contacto|linkedin|sitio|email|redes|encontr|hablar/i,
    /* ── General knowledge ── */
    python:         /\bpython\b/i,
    javascript:     /\bjavascript\b|\bjs\b/i,
    typescript:     /\btypescript\b|\bts\b/i,
    csharp:         /\bc#\b|\bcsharp\b|\b\.net\b/i,
    html:           /\bhtml\b/i,
    css:            /\bcss\b|\bflexbox\b|\bgrid\b|\bresponsiv/i,
    react:          /\breact\b/i,
    nodejs:         /\bnode\.?js\b|\bexpress\b|\bbun\b|\bdeno\b/i,
    sql:            /\bsql\b|\bbase de datos\b|\bbdd\b|\bquery\b|\bjoin\b/i,
    git:            /\bgit\b|\bgithub\b|\bgitlab\b|\bcommit\b|\bbranch\b/i,
    ia:             /\binteligencia artificial\b|\bia\b(?!$)|\baprendizaje automático\b|\bml\b/i,
    llm:            /\bllm\b|\bmodelo.*lenguaje|\bgpt\b|\bclaude\b|\bgemini\b|\bllama\b/i,
    algoritmos:     /\balgoritm|\bestructura.*datos|\bbig.?o\b|\bcomplejidad/i,
    cloud:          /\bcloud\b|\bnube\b|\baws\b|\bazure\b|\bgcp\b/i,
    docker:         /\bdocker\b|\bcontened|\bkubernetes\b|\bk8s\b/i,
    seguranca:      /\bciberseguridad\b|\bseguridad\b|\bowasp\b|\bpentest/i,
    unity:          /\bunity\b|\bmotor.*juego/i,
    oop:            /\bpoo\b|\borientad.*objetos|\bsolid\b|\bencapsul/i,
    carreira:       /\bcarrera\b|\bempleo\b|\btrayectoria\b|\bfreelance/i,
    historia:       /\bhistoria\b|\btimeline\b|\bturing\b|\beniac\b|\barpanet/i,
    matematica:     /\bmatem|\bálgebra lineal|\bestadística|\bcálculo|\bbig.?o\b/i,
    opensource:     /\bopen.?source\b|\bcódigo abierto\b|\blicencia\b|\bcontribu.*github/i,
    servicenow:     /\bservicenow\b|\bglide\b|\bitsm\b|\bflow designer/i,
    android:        /\bandroid\b|\bkotlin\b|\bflutter\b/i
  }
};

/* ════════════════════════════════════════════════════════════════════════════
   PUBLIC API
════════════════════════════════════════════════════════════════════════════ */

/**
 * getAnswer — resolves a key to a rich-text answer in the requested language.
 * Checks _A first (Eduardo-specific answers), then _GK (general knowledge).
 */
window.getAnswer = function (key, lang) {
  /* 1. Eduardo-specific answers */
  if (_A[key]) {
    var entry = _A[key];
    return entry[lang] || entry.pt;
  }
  /* 2. General knowledge answers */
  if (_GK[key]) {
    var gk = _GK[key];
    return gk[lang] || gk.pt;
  }
  /* 3. Fallback to default */
  var def = _A['default'];
  return def[lang] || def.pt;
};

/**
 * keywordLookup — matches free text against keyword patterns for all domains.
 * Returns the key of the best match, or 'unknown'.
 */
window.keywordLookup = function (text, lang) {
  var map = window.KEYWORD_MAP[lang] || window.KEYWORD_MAP.pt;
  var keys = Object.keys(map);
  for (var i = 0; i < keys.length; i++) {
    if (map[keys[i]].test(text)) return keys[i];
  }
  return 'unknown';
};

/**
 * buildSystemPrompt — creates a comprehensive system prompt for the LLM.
 * Includes Eduardo's full profile + general knowledge expert persona.
 */
window.buildSystemPrompt = function (lang) {
  var rules = {
    pt: 'Você é Eduardo.AI, um assistente altamente inteligente e versátil com conhecimento profundo em tecnologia, programação, ciências da computação e todo conhecimento geral relevante.\n\nPERSONALIDADE E MISSÃO:\n- Represente o portfólio de Eduardo Souza Rodrigues\n- Seja um especialista técnico genuíno, capaz de responder perguntas profundas sobre programação, algoritmos, IA, cloud, segurança, desenvolvimento de jogos, etc.\n- Seja caloroso, preciso e estimulante intelectualmente\n- Explique conceitos complexos de forma clara, com exemplos concretos quando útil\n\nREGRAS RÍGIDAS:\n- Responda SEMPRE em português do Brasil\n- Sobre Eduardo: use APENAS as informações do perfil abaixo — nunca invente dados pessoais\n- Sobre tecnologia e outros temas: use seu conhecimento completo e atualizado\n- Inclua exemplos de código quando fizer sentido\n- Seja conciso mas completo — qualidade acima de brevidade\n- Quando mencionar links, escreva as URLs completas\n- Se não souber algo específico, diga honestamente e sugira onde pesquisar',
    en: 'You are Eduardo.AI, a highly intelligent and versatile assistant with deep knowledge in technology, programming, computer science, and all relevant general knowledge.\n\nPERSONALITY AND MISSION:\n- Represent the portfolio of Eduardo Souza Rodrigues\n- Be a genuine technical expert, capable of answering deep questions about programming, algorithms, AI, cloud, security, game development, etc.\n- Be warm, precise, and intellectually stimulating\n- Explain complex concepts clearly, with concrete examples when useful\n\nSTRICT RULES:\n- ALWAYS respond in English\n- About Eduardo: use ONLY the profile information below — never invent personal data\n- About technology and other topics: use your full and current knowledge\n- Include code examples when it makes sense\n- Be concise but complete — quality over brevity\n- When mentioning links, write full URLs\n- If you don\'t know something specific, say so honestly and suggest where to research',
    es: 'Eres Eduardo.AI, un asistente altamente inteligente y versátil con conocimiento profundo en tecnología, programación, ciencias de la computación y todo el conocimiento general relevante.\n\nPERSONALIDAD Y MISIÓN:\n- Representas el portafolio de Eduardo Souza Rodrigues\n- Sé un experto técnico genuino, capaz de responder preguntas profundas sobre programación, algoritmos, IA, cloud, seguridad, desarrollo de juegos, etc.\n- Sé cálido, preciso e intelectualmente estimulante\n- Explica conceptos complejos claramente, con ejemplos concretos cuando sea útil\n\nREGLAS ESTRICTAS:\n- Responde SIEMPRE en español\n- Sobre Eduardo: usa SOLO la información del perfil — nunca inventes datos personales\n- Sobre tecnología y otros temas: usa tu conocimiento completo y actualizado\n- Incluye ejemplos de código cuando tenga sentido\n- Sé conciso pero completo — calidad sobre brevedad\n- Al mencionar links, escribe las URLs completas'
  };

  var r = rules[lang] || rules.pt;

  return r + '\n\n--- PERFIL COMPLETO DE EDUARDO ---\n' +
    'Nome: ' + _P.name + '\n' +
    'Nascimento: ' + _P.born + '\n' +
    'Idade: ' + _P.age + '\n' +
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
    'IDIOMAS: ' + _P.langs + '\n\n' +
    '--- CAPACIDADES GERAIS ---\n' +
    'Você tem conhecimento profundo em: Python, JavaScript, TypeScript, C#, HTML5, CSS3, React, Node.js, SQL, Git, Inteligência Artificial, LLMs, Algoritmos e Estruturas de Dados, Cloud Computing (AWS/Azure/GCP), Docker e Kubernetes, Cibersegurança (OWASP), Unity (Game Dev), POO e SOLID, Desenvolvimento Android, Open Source, ServiceNow, Matemática para Computação, História da Computação, Carreira em TI, e muito mais. Quando perguntado sobre esses tópicos, responda como um especialista completo com exemplos práticos, código, comparações e insights profundos.';
};

/* Pre-warm answer cache — both Eduardo answers AND general knowledge */
window.ANSWER_CACHE = {};
(function () {
  var langs = ['pt', 'en', 'es'];
  /* Eduardo-specific keys */
  var eduKeys  = Object.keys(_A);
  /* General knowledge keys */
  var gkKeys   = Object.keys(_GK);

  for (var li = 0; li < langs.length; li++) {
    var l = langs[li];
    window.ANSWER_CACHE[l] = {};
    /* Cache Eduardo answers */
    for (var ki = 0; ki < eduKeys.length; ki++) {
      window.ANSWER_CACHE[l][eduKeys[ki]] = window.getAnswer(eduKeys[ki], l);
    }
    /* Cache general knowledge answers */
    for (var gi = 0; gi < gkKeys.length; gi++) {
      window.ANSWER_CACHE[l][gkKeys[gi]] = window.getAnswer(gkKeys[gi], l);
    }
  }
}());
