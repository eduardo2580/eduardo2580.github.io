# Eduardo.AI — Portfolio Interativo

IA que roda **100% no navegador**. Sem servidor. Sem API. Sem custo.

---

## Estrutura de arquivos

```
portfolio/
├── index.html          ← Página principal
├── css/
│   └── style.css       ← Todos os estilos (tema cyberpunk)
├── js/
│   ├── knowledge.js    ← Base de conhecimento do Eduardo (prompt + fallback)
│   ├── avatar.js       ← Avatar 3D (Three.js)
│   └── chat.js         ← Motor de chat (WebLLM + fallback por palavras-chave)
└── README.md
```

---

## Como funciona a IA

### Modo 1 — WebLLM (melhor)
- Usa **Phi-3.5-mini-instruct** (~2.4 GB), um LLM da Microsoft
- Roda diretamente no browser via **WebGPU + WASM**
- **Primeiro acesso:** baixa o modelo (~2 min dependendo da conexão)
- **Visitas seguintes:** modelo fica em cache no IndexedDB → carrega em segundos
- **Requer:** Chrome 113+ / Edge 113+ com WebGPU ativado

### Modo 2 — Fallback por palavras-chave (sempre disponível)
- Ativa automaticamente se WebGPU não estiver disponível (Firefox, Safari, celulares antigos)
- Responde com base em mapeamento de palavras-chave → respostas pré-definidas
- Zero dependência externa, funciona em qualquer browser

---

## Requisitos de browser

| Browser         | WebLLM (Phi-3.5) | Fallback |
|-----------------|:----------------:|:--------:|
| Chrome 113+     | ✅               | ✅       |
| Edge 113+       | ✅               | ✅       |
| Firefox         | ⚠ (sem WebGPU)   | ✅       |
| Safari 17.4+    | 🔄 experimental  | ✅       |
| Mobile Chrome   | ⚠ limitado       | ✅       |

> Para ativar WebGPU no Chrome caso não esteja ativado:
> Acesse `chrome://flags/#enable-unsafe-webgpu` e habilite.

---

## Como usar

1. Coloque a pasta `portfolio/` no seu servidor ou GitHub Pages
2. Acesse `index.html` pelo browser
3. Na primeira vez, o modelo Phi-3.5 será baixado automaticamente (barra de progresso)
4. Após o carregamento, clique em **PT / EN / ES** para mudar o idioma
5. Use os chips de sugestão ou digite sua própria pergunta

### GitHub Pages
```bash
# Se já usa GitHub Pages com o repo eduardo2580/eduardo2580.github.io
# Basta copiar os arquivos para a raiz ou subpasta /ai/
```

---

## Personalização

### Atualizar o perfil do Eduardo
Edite **`js/knowledge.js`**:
- `systemPrompt` — contexto injetado no LLM (seção PT/EN/ES)
- `fallback` — respostas para o modo offline
- `keywordMap` — palavras-chave que disparam as respostas offline
- `greetings` — mensagens de boas-vindas

### Trocar o modelo LLM
Em **`js/chat.js`**, altere `MODEL_ID`. Modelos disponíveis:

| Modelo                              | Tamanho | Qualidade |
|-------------------------------------|---------|-----------|
| `Phi-3.5-mini-instruct-q4f16_1-MLC` | ~2.4 GB | ⭐⭐⭐⭐    |
| `Phi-3-mini-4k-instruct-q4f16_1-MLC`| ~2.2 GB | ⭐⭐⭐⭐    |
| `Llama-3.2-1B-Instruct-q4f16_1-MLC` | ~0.9 GB | ⭐⭐⭐      |
| `gemma-2-2b-it-q4f16_1-MLC`         | ~1.6 GB | ⭐⭐⭐⭐    |

> Lista completa: https://mlc.ai/models

---

## Tecnologias utilizadas

- **[Three.js r128](https://threejs.org/)** — Avatar 3D
- **[WebLLM](https://github.com/mlc-ai/web-llm)** — LLM no browser
- **[Phi-3.5-mini](https://huggingface.co/microsoft/Phi-3.5-mini-instruct)** — Modelo de linguagem da Microsoft (gratuito)
- **EB Garamond + Share Tech Mono** — Google Fonts
- HTML5 / CSS3 / JavaScript puro — sem frameworks

---

© Eduardo Souza Rodrigues — https://eduardo2580.github.io
