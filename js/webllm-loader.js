/**
 * webllm-loader.js  —  <script type="module">
 *
 * Browser support: Chrome 113+, Edge 113+, Firefox 122+, Safari 17+
 * (all browsers that ship WebGPU — exactly the set that can run WebLLM)
 * Browsers without WebGPU or ES module support ignore this file entirely
 * and chat.js keyboard fallback handles them transparently.
 *
 * Contract with chat.js (via window globals):
 *   window.__webllmStarted   — set true before anything async runs
 *   window.__webllmReady     — MLCEngine instance when fully loaded
 *   window.__webllmFailed    — non-empty string on any unrecoverable error
 *   window.__webllmProgress  — function(pct, text) registered by chat.js
 *   window.__webllmLang      — 'pt'|'en'|'es' written by chat.js on boot/lang-switch
 *
 * Stages and what happens on failure at each:
 *   1. WebGPU probe    → no WebGPU: sets __webllmFailed immediately, chat.js
 *                        stays in keyboard mode
 *   2. Module load     → all CDNs fail: sets __webllmFailed, keyboard mode
 *   3. Model ID check  → ID missing: sets __webllmFailed, keyboard mode
 *   4. Engine init     → throws or hangs: sets __webllmFailed, keyboard mode
 *   ✓  All done        → sets __webllmReady, chat.js switches to AI mode live
 *
 * CDN strategy:
 *   esm.sh is EXCLUDED — it re-bundles @mlc-ai/web-llm with its own transpiler
 *   and mangles internal refs (detectGPUDevice etc.) causing runtime crashes.
 *   esm.run serves the package's own dist/web-llm.mjs unchanged (official rec).
 *   jsdelivr direct path is the same file via a different route — belt & braces.
 */

/* ── Constants ──────────────────────────────────────────────────────────── */
const MODEL_ID = 'Phi-3.5-mini-instruct-q4f16_1-MLC';

/* Both CDNs serve the same pre-built ESM file — no re-bundling, no mangling */
const CDNS = [
  'https://esm.run/@mlc-ai/web-llm',
  'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm/dist/web-llm.mjs'
];

/* Hang detector: if CreateMLCEngine fires zero progress callbacks in this
   window it's silently stuck — abort so keyboard mode activates promptly. */
const HANG_MS = 30000;

/* ── Signal: loader is running ──────────────────────────────────────────── */
window.__webllmStarted = true;

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSLATIONS
   All user-visible strings in PT / EN / ES.
   Tokens like {n}, {total}, {mb}, {host}, {pct} are substituted at runtime.
   getLang() reads window.__webllmLang written by chat.js.
   Falls back to 'pt' if chat.js hasn't booted yet.
═══════════════════════════════════════════════════════════════════════════ */
const getLang = () => window.__webllmLang || 'pt';

const T = {
  /* ── Stage labels ── */
  checkingGPU:         { pt: 'Verificando suporte a WebGPU…',                         en: 'Checking WebGPU support…',                          es: 'Verificando soporte WebGPU…'                        },
  gpuOk:               { pt: 'WebGPU detectado — baixando módulo de IA…',             en: 'WebGPU detected — downloading AI module…',          es: 'WebGPU detectado — descargando módulo de IA…'       },
  downloadingModule:   { pt: 'Baixando módulo de IA via {host}…',                     en: 'Downloading AI module from {host}…',                 es: 'Descargando módulo de IA desde {host}…'             },
  tryingCDN:           { pt: 'Tentando CDN alternativa ({host})…',                    en: 'Trying alternative CDN ({host})…',                   es: 'Probando CDN alternativa ({host})…'                 },
  verifyingModel:      { pt: 'Verificando compatibilidade do modelo…',                en: 'Verifying model compatibility…',                     es: 'Verificando compatibilidad del modelo…'             },
  initEngine:          { pt: 'Iniciando download: Phi-3.5-mini (~2 GB)…',             en: 'Starting download: Phi-3.5-mini (~2 GB)…',           es: 'Iniciando descarga: Phi-3.5-mini (~2 GB)…'          },
  /* ── Progress labels (one per WebLLM phase) ── */
  downloading:         { pt: 'Baixando modelo — parte {n} de {total}{mb}',            en: 'Downloading model — part {n} of {total}{mb}',        es: 'Descargando modelo — parte {n} de {total}{mb}'      },
  downloadingPct:      { pt: 'Baixando modelo… {pct}%',                               en: 'Downloading model… {pct}%',                          es: 'Descargando modelo… {pct}%'                         },
  loadingCache:        { pt: 'Lendo cache local — parte {n} de {total}{mb}',          en: 'Reading local cache — part {n} of {total}{mb}',      es: 'Leyendo caché local — parte {n} de {total}{mb}'     },
  loadingCachePct:     { pt: 'Lendo cache do modelo… {pct}%',                         en: 'Reading model cache… {pct}%',                        es: 'Leyendo caché del modelo… {pct}%'                   },
  compilingShaders:    { pt: 'Compilando shaders WebGPU — etapa {n} de {total}…',     en: 'Compiling WebGPU shaders — step {n} of {total}…',    es: 'Compilando shaders WebGPU — paso {n} de {total}…'   },
  compilingNoCount:    { pt: 'Compilando shaders WebGPU…',                            en: 'Compiling WebGPU shaders…',                          es: 'Compilando shaders WebGPU…'                         },
  loadingTokenizer:    { pt: 'Carregando tokenizador…',                               en: 'Loading tokenizer…',                                 es: 'Cargando tokenizador…'                              },
  finalizing:          { pt: 'Finalizando inicialização…',                            en: 'Finalising…',                                        es: 'Finalizando…'                                       },
  ready:               { pt: 'IA local pronta! ✓',                                   en: 'Local AI ready! ✓',                                  es: '¡IA local lista! ✓'                                 },
  generic:             { pt: 'Carregando… {pct}%',                                    en: 'Loading… {pct}%',                                    es: 'Cargando… {pct}%'                                   },
  /* ── Error labels (shown in the progress bar, then keyboard mode activates) ── */
  errNoGPU:            { pt: '⚠ WebGPU indisponível — usando modo teclado.',          en: '⚠ WebGPU unavailable — using keyword mode.',         es: '⚠ WebGPU no disponible — modo teclado activado.'    },
  errAllCDNs:          { pt: '⚠ Falha ao baixar módulo de IA — modo teclado ativo.', en: '⚠ AI module download failed — keyword mode active.', es: '⚠ Error de descarga — modo teclado activo.'         },
  errModelNotFound:    { pt: '⚠ Modelo não encontrado — modo teclado ativo.',         en: '⚠ Model not found — keyword mode active.',           es: '⚠ Modelo no encontrado — modo teclado activo.'      },
  errHang:             { pt: '⚠ Motor de IA sem resposta — modo teclado ativo.',      en: '⚠ AI engine timed out — keyword mode active.',       es: '⚠ Motor de IA sin respuesta — modo teclado activo.' },
  errGeneric:          { pt: '⚠ Erro de IA: {msg}',                                   en: '⚠ AI error: {msg}',                                  es: '⚠ Error de IA: {msg}'                               }
};

/** Translate key, substituting {token} placeholders with vars object */
function t(key, vars) {
  const entry = T[key];
  if (!entry) return key;
  let s = entry[getLang()] || entry.pt;
  if (vars) Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
  return s;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DOM BRIDGE
   Writes directly to the progress bar DOM — no dependency on chat.js timing.
   Also calls window.__webllmProgress so chat.js can sync avatar/status state.
═══════════════════════════════════════════════════════════════════════════ */
function pushProgress(pct, text) {
  const p     = Math.min(100, Math.max(0, pct));
  const fill  = document.getElementById('llm-loader-fill');
  const label = document.getElementById('llm-loader-label');
  if (fill)        fill.style.width  = p + '%';
  if (label && text) label.textContent = text;
  if (typeof window.__webllmProgress === 'function') {
    try { window.__webllmProgress(p, text); } catch (_) {}
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS COMPUTATION
   WebLLM fires initProgressCallback once per shard.
   report.progress is 0–1 within that shard, not overall.
   We parse [N/Total] from report.text to compute real cumulative %.
   Maps to a 10–98 window: 0–10% = pre-init stages, 98–100% = finalization.
═══════════════════════════════════════════════════════════════════════════ */
function computeProgress(report) {
  const text = (report.text || '').trim();
  const m    = text.match(/\[(\d+)\/(\d+)\]/);
  if (m) {
    const n = parseInt(m[1], 10), total = parseInt(m[2], 10);
    if (total > 0)
      return Math.round(((n - 1) / total) * 88 + 10 + (report.progress || 0) * (88 / total));
  }
  if (typeof report.progress === 'number') return Math.round(10 + report.progress * 88);
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LABEL BUILDER
   Converts WebLLM's raw report.text into a friendly translated string.

   Known WebLLM report.text patterns:
     "Fetching param cache[1/42]: 234.50MB loaded."   → cache read (repeat visit)
     "Loading model from cache [1/42]: 234.50MB"      → cache read
     "[42/42] Loading model..."                        → download
     "Loading model[1/1]: 1234MB loaded."             → download
     "Compiling shader 1/2"                            → shader compilation
     "Loading tokenizer"                               → tokenizer
     "Finish loading on WebGPU"                        → done
     "Start to fetch params"                           → download starting
═══════════════════════════════════════════════════════════════════════════ */
function buildLabel(report, pct) {
  const raw    = (report.text || '').trim();
  const pctStr = pct != null ? String(pct) : '…';

  /* Extract [N/Total] counter */
  const cm    = raw.match(/\[(\d+)\/(\d+)\]/);
  const n     = cm ? cm[1] : null;
  const total = cm ? cm[2] : null;

  /* Extract file size annotation */
  const sm = raw.match(/([\d.]+\s*(?:MB|GB))/i);
  const mb = sm ? ' (' + sm[1].replace(/\s+/g, '') + ')' : '';

  /* ── Phase detection — most specific first ── */

  /* Shader compilation */
  if (/compil/i.test(raw)) {
    const slash = raw.match(/(\d+)\s*\/\s*(\d+)/);
    if (slash) return t('compilingShaders', { n: slash[1], total: slash[2] });
    if (n && total) return t('compilingShaders', { n, total });
    return t('compilingNoCount');
  }

  /* Tokenizer */
  if (/token/i.test(raw)) return t('loadingTokenizer');

  /* Finish/complete signal */
  if (/finish|complete|ready/i.test(raw)) return t('finalizing');

  /* Cache read (repeat visit — weights already in browser storage) */
  if (/cache/i.test(raw)) {
    if (n && total) return t('loadingCache', { n, total, mb });
    return t('loadingCachePct', { pct: pctStr });
  }

  /* Network download (first visit) */
  if (/fetch|loading\s+model|param|download/i.test(raw)) {
    if (n && total) return t('downloading', { n, total, mb });
    return t('downloadingPct', { pct: pctStr });
  }

  /* Shard counter present but phase not recognised */
  if (n && total) return t('downloading', { n, total, mb });

  /* Last resort */
  return t('generic', { pct: pctStr });
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 1 — WebGPU probe
   Safari-specific issue: requestAdapter() with no options returns null on many
   Mac configurations. Safari's WebGPU backend (Metal) requires an explicit
   powerPreference hint to decide which GPU to expose. Without it, Safari may
   silently decline — navigator.gpu exists but every adapter call returns null.

   Fix: try three powerPreference variants before declaring no WebGPU:
     1. 'high-performance' — discrete GPU, works on most Safari + Chrome/Edge
     2. 'low-power'        — integrated GPU, needed on single-GPU Mac configs
     3. (no hint)          — spec default, reliable on Firefox

   Each attempt gets a 7s timeout — Safari's Metal stack initialises slowly,
   especially on first use. 800ms pause between variants lets it settle.
═══════════════════════════════════════════════════════════════════════════ */
async function probeWebGPU() {
  if (!navigator.gpu) return false;

  const variants = [
    { powerPreference: 'high-performance' },
    { powerPreference: 'low-power' },
    {}
  ];

  for (let i = 0; i < variants.length; i++) {
    try {
      const adapter = await Promise.race([
        navigator.gpu.requestAdapter(variants[i]),
        new Promise(r => setTimeout(() => r(null), 7000))
      ]);
      if (adapter) {
        console.info('[WebLLM] WebGPU adapter OK with', JSON.stringify(variants[i]));
        return true;
      }
    } catch (e) {
      console.warn('[WebLLM] requestAdapter variant', i, 'threw:', e && e.message);
    }
    if (i < variants.length - 1) await new Promise(r => setTimeout(r, 800));
  }

  console.info('[WebLLM] All requestAdapter variants returned null');
  return false;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 2 — Module load
   Tries each CDN in order. Returns the first that exports CreateMLCEngine.
   esm.run = officially recommended (no re-bundling, no mangling).
   jsdelivr direct = same dist file via stable path.
═══════════════════════════════════════════════════════════════════════════ */
async function loadModule() {
  for (let i = 0; i < CDNS.length; i++) {
    const url  = CDNS[i];
    const host = new URL(url).hostname;
    pushProgress(7 + i, i === 0
      ? t('downloadingModule', { host })
      : t('tryingCDN',         { host })
    );
    try {
      const mod = await import(url);
      if (mod && typeof mod.CreateMLCEngine === 'function') {
        console.info('[WebLLM] Module OK from', host);
        return mod;
      }
      console.warn('[WebLLM]', host, '— missing CreateMLCEngine, trying next');
    } catch (e) {
      console.warn('[WebLLM]', host, '— import failed:', e?.message);
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 3 — Model ID pre-flight
   Checks the module's built-in model list before starting the multi-GB download.
   A mismatch here means a version bump changed the model ID string.
═══════════════════════════════════════════════════════════════════════════ */
function checkModelId(mod) {
  try {
    const list = mod.prebuiltAppConfig && mod.prebuiltAppConfig.model_list;
    if (!list) return true; /* list unavailable — proceed optimistically */
    const found = list.some(m => m.model_id === MODEL_ID);
    if (!found) {
      const ids = list.slice(0, 5).map(m => m.model_id).join(', ');
      console.warn('[WebLLM] "' + MODEL_ID + '" not in model list. First 5:', ids);
    }
    return found;
  } catch (_) { return true; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 4 — Engine init
   Calls CreateMLCEngine with a hang detector.
   The hang detector fires if zero progress callbacks arrive in HANG_MS ms —
   this catches the silent-hang case where the wasm fetch 404s internally.
═══════════════════════════════════════════════════════════════════════════ */
async function initEngine(mod) {
  let progressFired = false;

  const hangTimer = setTimeout(() => {
    if (!progressFired && !window.__webllmReady) {
      console.warn('[WebLLM] Hang detected (no progress in', HANG_MS, 'ms)');
      pushProgress(100, t('errHang'));
      window.__webllmFailed = 'hang-timeout';
    }
  }, HANG_MS);

  const engine = await mod.CreateMLCEngine(MODEL_ID, {
    initProgressCallback(report) {
      if (!progressFired) {
        progressFired = true;
        clearTimeout(hangTimer); /* first callback clears the hang detector */
      }
      const pct   = computeProgress(report);
      const label = buildLabel(report, pct);
      if (pct !== null) pushProgress(pct, label);
      console.debug('[WebLLM]', pct + '%', '|', label, '| raw:', report.text);
    }
  });

  clearTimeout(hangTimer);
  return engine;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN — orchestrates stages 1–4
   Any failure at any stage sets __webllmFailed and returns early.
   chat.js polls __webllmFailed and activates keyboard fallback on detection.
═══════════════════════════════════════════════════════════════════════════ */
(async () => {
  try {
    /* Stage 1: WebGPU */
    pushProgress(3, t('checkingGPU'));
    if (!await probeWebGPU()) {
      console.info('[WebLLM] No WebGPU → keyboard fallback');
      pushProgress(100, t('errNoGPU'));
      window.__webllmFailed = 'no-webgpu';
      return;
    }
    pushProgress(6, t('gpuOk'));

    /* Stage 2: Module */
    const mod = await loadModule();
    if (!mod) {
      pushProgress(100, t('errAllCDNs'));
      window.__webllmFailed = 'all-cdns-failed';
      return;
    }

    /* Stage 3: Model ID check */
    pushProgress(9, t('verifyingModel'));
    if (!checkModelId(mod)) {
      pushProgress(100, t('errModelNotFound'));
      window.__webllmFailed = 'model-id-not-found';
      return;
    }

    /* Stage 4: Engine init */
    pushProgress(10, t('initEngine'));
    const engine = await initEngine(mod);

    /* If hang detector already fired, __webllmFailed is set — don't overwrite */
    if (window.__webllmFailed) return;

    pushProgress(100, t('ready'));
    window.__webllmReady = engine;
    console.info('[WebLLM] Ready ✓');

  } catch (e) {
    const msg = (e && e.message) || 'unknown-error';
    console.error('[WebLLM] Fatal:', msg);
    /* Show the raw error in the progress bar so it's debuggable */
    pushProgress(100, t('errGeneric', { msg: msg.slice(0, 90) }));
    window.__webllmFailed = msg;
  }
})();
