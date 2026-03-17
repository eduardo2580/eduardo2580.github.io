# Eduardo.AI — Portfolio Interativo

IA que roda **100% no navegador**. Sem servidor. Sem API. Sem custo.

---

## Estrutura de arquivos

```
/
├── index.html                  ← Página principal + PWA shell
├── manifest.json               ← Manifesto PWA
├── sw.js                       ← Service Worker (cache + offline)
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── css/
│   └── style.css               ← Todos os estilos (tema Replika-inspired)
└── js/
    ├── compat.js               ← Polyfills ES3/ES5 (NetSurf, IE11, Firefox ESR)
    ├── knowledge.js            ← Base de conhecimento + cache de respostas
    ├── db.js                   ← IndexedDB (respostas padrão + aprendizadas, TTL 7 dias)
    ├── avatar.js               ← Controlador do avatar SVG animado
    ├── voice.js                ← Web Speech API (voz + estados locked/denied)
    └── chat.js                 ← Motor de chat (WebLLM + fallback por palavras-chave)
```

---

## Como funciona a IA

### Modo 1 — WebLLM (melhor qualidade)
- Usa **Phi-3.5-mini-instruct** (~2.4 GB), um LLM da Microsoft
- Roda diretamente no browser via **WebGPU + WASM** — zero servidor
- **Primeiro acesso:** baixa e armazena o modelo em IndexedDB (~2 min)
- **Visitas seguintes:** carrega do cache local em segundos
- **Requer:** Chrome 113+, Edge 113+, Safari 17+ (macOS/iOS)

### Modo 2 — Fallback por palavras-chave (sempre disponível)
- Ativa automaticamente se WebGPU não estiver disponível
- Responde com base em mapeamento de palavras-chave → respostas pré-definidas
- Funciona em qualquer browser, inclusive offline

### Cache inteligente (IndexedDB)
- Respostas padrão (6 tópicos × 3 idiomas) são pré-carregadas na base local
- Respostas geradas pelo WebLLM são salvas automaticamente por **7 dias**
- Na segunda vez que a mesma pergunta é feita, a resposta vem do cache — sem chamar o modelo
- Respostas fracas ou recusas do modelo **não** são salvas no cache

---

## Requisitos de browser

| Browser         | WebLLM (Phi-3.5) | Fallback | PWA | Voz |
|-----------------|:----------------:|:--------:|:---:|:---:|
| Chrome 113+     | ✅               | ✅       | ✅  | ✅  |
| Edge 113+       | ✅               | ✅       | ✅  | ✅  |
| Safari 17+      | ✅               | ✅       | ✅  | ✅  |
| Firefox         | ⚠ sem WebGPU     | ✅       | ✅  | ✅  |
| Mobile Chrome   | ⚠ limitado       | ✅       | ✅  | ✅  |
| NetSurf / IE11  | ❌               | ✅       | ❌  | ❌  |

> Para ativar WebGPU no Chrome manualmente:
> `chrome://flags/#enable-unsafe-webgpu`

---

## Como usar

1. Copie todos os arquivos para a raiz do seu servidor ou repositório GitHub Pages
2. Acesse `index.html` no browser
3. Na primeira visita, o modelo Phi-3.5 é baixado automaticamente (barra de progresso)
4. Clique em **PT / EN / ES** para mudar o idioma
5. Use os chips de sugestão ou digite sua própria pergunta
6. Clique no botão de microfone para entrada por voz (requer permissão)

### Instalar como app (PWA)
No Chrome/Edge: clique no ícone de instalação na barra de endereços.
No Safari iOS: toque em Compartilhar → Adicionar à Tela de Início.

### Deploy no GitHub Pages
```bash
# Repositório: eduardo2580/eduardo2580.github.io
# Copie todos os arquivos para a raiz do repositório
git add .
git commit -m "deploy"
git push
```

---

## Personalização

### Atualizar perfil e respostas
Edite **`js/knowledge.js`**:
- `_P` — dados brutos do perfil (nome, nascimento, e-mail, links, formação, etc.)
- `_A` — respostas ricas por chave e idioma (suporta `**bold**`, `[[url|link]]`, `\n`)
- `window.GREETINGS` — mensagens de boas-vindas por idioma
- `window.KEYWORD_MAP` — expressões regulares que mapeiam perguntas às respostas
- `window.buildSystemPrompt()` — prompt do sistema injetado no WebLLM

### Trocar o modelo LLM
Em **`js/chat.js`**, altere `WEBLLM_CDNS` e `MODEL_ID`:

| Modelo                               | Tamanho  | Qualidade |
|--------------------------------------|----------|-----------|
| `Phi-3.5-mini-instruct-q4f16_1-MLC`  | ~2.4 GB  | ⭐⭐⭐⭐    |
| `Phi-3-mini-4k-instruct-q4f16_1-MLC` | ~2.2 GB  | ⭐⭐⭐⭐    |
| `Llama-3.2-1B-Instruct-q4f16_1-MLC`  | ~0.9 GB  | ⭐⭐⭐      |
| `gemma-2-2b-it-q4f16_1-MLC`          | ~1.6 GB  | ⭐⭐⭐⭐    |

> Lista completa: https://mlc.ai/models

### Atualizar o Service Worker após deploy
Ao fazer alterações nos arquivos, incremente a versão em **`sw.js`**:
```javascript
var CACHE_VERSION = 'v1.0.1'; // bump a cada deploy
```

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| [WebLLM](https://github.com/mlc-ai/web-llm) | LLM rodando no browser via WebGPU |
| [Phi-3.5-mini](https://huggingface.co/microsoft/Phi-3.5-mini-instruct) | Modelo de linguagem (Microsoft, gratuito) |
| SVG + CSS animations | Avatar animado — sem Three.js, sem GPU |
| Web Speech API | Entrada e saída de voz |
| IndexedDB | Cache local de respostas com TTL |
| Service Worker | PWA + suporte offline |
| DM Sans + DM Serif Display | Google Fonts |
| HTML5 / CSS3 / ES5 JavaScript | Sem frameworks, compatível com browsers antigos |

---


© 2025-2026 Eduardo Souza Rodrigues — [eduardo2580.github.io](https://eduardo2580.github.io)
