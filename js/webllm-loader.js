/*
 * webllm-loader.js  —  <script type="module">
 *
 * Fixes vs original:
 *   1. Quota exceeded → caught explicitly, sets __webllmFailed = 'quota-exceeded'
 *      chat.js then activates keyword mode immediately with a clear status.
 *   2. Tries SmolLM2-1.7B-Instruct (~900MB) before Phi-3.5-mini (~2GB).
 *      SmolLM2 fits in most browser quotas; Phi is tried only if SmolLM2 isn't
 *      in the model list (older WebLLM version).
 *   3. Quota pre-check: before downloading, estimates available storage via
 *      navigator.storage.estimate(). If less than 1GB is available, skips
 *      the download entirely and activates keyboard mode immediately —
 *      avoiding the painful "download 1.9GB then fail" experience.
 *   4. All other error handling and CDN fallback logic unchanged.
 */

/* ── Model candidates — smallest first ── */
const MODELS = [
  'SmolLM2-1.7B-Instruct-q4f16_1-MLC',   /* ~900MB — fits most quotas  */
  'Phi-3.5-mini-instruct-q4f16_1-MLC',    /* ~2GB  — original, fallback */
];

const CDNS = [
  'https://esm.run/@mlc-ai/web-llm',
  'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm/dist/web-llm.mjs'
];

const HANG_MS          = 30000;
const QUOTA_THRESHOLD  = 1.1 * 1024 * 1024 * 1024; /* 1.1 GB minimum free */

window.__webllmStarted = true;

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════════════════════════════ */
const getLang = () => window.__webllmLang || 'pt';

const T = {
  checkingGPU:       { pt: 'Verificando WebGPU…',                             en: 'Checking WebGPU…',                              es: 'Verificando WebGPU…'                           },
  checkingQuota:     { pt: 'Verificando espaço disponível…',                  en: 'Checking available storage…',                   es: 'Verificando espacio disponible…'               },
  gpuOk:             { pt: 'WebGPU detectado — baixando módulo de IA…',       en: 'WebGPU detected — downloading AI module…',      es: 'WebGPU detectado — descargando módulo de IA…'  },
  downloadingModule: { pt: 'Baixando módulo de IA via {host}…',               en: 'Downloading AI module from {host}…',             es: 'Descargando módulo desde {host}…'              },
  tryingCDN:         { pt: 'Tentando CDN alternativa ({host})…',              en: 'Trying alternative CDN ({host})…',              es: 'Probando CDN alternativa ({host})…'            },
  verifyingModel:    { pt: 'Verificando modelo…',                             en: 'Verifying model…',                              es: 'Verificando modelo…'                           },
  initEngine:        { pt: 'Iniciando download: {model}…',                    en: 'Starting download: {model}…',                   es: 'Iniciando descarga: {model}…'                  },
  downloading:       { pt: 'Baixando modelo — parte {n} de {total}{mb}',      en: 'Downloading model — part {n} of {total}{mb}',   es: 'Descargando modelo — parte {n} de {total}{mb}' },
  downloadingPct:    { pt: 'Baixando modelo… {pct}%',                         en: 'Downloading model… {pct}%',                     es: 'Descargando modelo… {pct}%'                    },
  loadingCache:      { pt: 'Lendo cache — parte {n} de {total}{mb}',          en: 'Reading cache — part {n} of {total}{mb}',       es: 'Leyendo caché — parte {n} de {total}{mb}'      },
  loadingCachePct:   { pt: 'Lendo cache… {pct}%',                             en: 'Reading cache… {pct}%',                         es: 'Leyendo caché… {pct}%'                         },
  compilingShaders:  { pt: 'Compilando shaders — etapa {n} de {total}…',      en: 'Compiling shaders — step {n} of {total}…',      es: 'Compilando shaders — paso {n} de {total}…'     },
  compilingNoCount:  { pt: 'Compilando shaders WebGPU…',                      en: 'Compiling WebGPU shaders…',                     es: 'Compilando shaders WebGPU…'                    },
  loadingTokenizer:  { pt: 'Carregando tokenizador…',                         en: 'Loading tokenizer…',                            es: 'Cargando tokenizador…'                         },
  finalizing:        { pt: 'Finalizando…',                                    en: 'Finalising…',                                   es: 'Finalizando…'                                  },
  ready:             { pt: 'IA local pronta! ✓',                              en: 'Local AI ready! ✓',                             es: '¡IA local lista! ✓'                            },
  generic:           { pt: 'Carregando… {pct}%',                              en: 'Loading… {pct}%',                               es: 'Cargando… {pct}%'                              },
  /* ── Errors ── */
  errNoGPU:          { pt: '⚠ WebGPU indisponível — modo teclado ativo.',    en: '⚠ WebGPU unavailable — keyword mode active.',   es: '⚠ WebGPU no disponible — modo teclado.'        },
  errQuota:          { pt: '⚠ Sem espaço para IA (~1 GB) — modo teclado.',   en: '⚠ Not enough storage for AI (~1 GB) — keyword mode.', es: '⚠ Sin espacio para IA (~1 GB) — modo teclado.' },
  errAllCDNs:        { pt: '⚠ Falha ao baixar módulo — modo teclado ativo.', en: '⚠ Module download failed — keyword mode.',       es: '⚠ Error de descarga — modo teclado.'           },
  errModelNotFound:  { pt: '⚠ Modelo não encontrado — modo teclado ativo.',  en: '⚠ Model not found — keyword mode.',             es: '⚠ Modelo no encontrado — modo teclado.'        },
  errHang:           { pt: '⚠ Motor sem resposta — modo teclado ativo.',     en: '⚠ Engine timed out — keyword mode.',            es: '⚠ Motor sin respuesta — modo teclado.'         },
  errGeneric:        { pt: '⚠ Erro de IA: {msg}',                            en: '⚠ AI error: {msg}',                             es: '⚠ Error de IA: {msg}'                          },
  errQuotaExceeded:  { pt: '⚠ Cota de armazenamento excedida — modo teclado.', en: '⚠ Storage quota exceeded — keyword mode.',   es: '⚠ Cuota de almacenamiento excedida — modo teclado.' },
};

function t(key, vars) {
  const entry = T[key];
  if (!entry) return key;
  let s = entry[getLang()] || entry.pt;
  if (vars) Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
  return s;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DOM BRIDGE
═══════════════════════════════════════════════════════════════════════════ */
function pushProgress(pct, text) {
  const p    = Math.min(100, Math.max(0, pct));
  const fill = document.getElementById('llm-loader-fill');
  const lbl  = document.getElementById('llm-loader-label');
  if (fill)       fill.style.width  = p + '%';
  if (lbl && text) lbl.textContent  = text;
  if (typeof window.__webllmProgress === 'function') {
    try { window.__webllmProgress(p, text); } catch (_) {}
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUOTA PRE-CHECK
   Uses the Storage API to estimate free space before downloading.
   Skips the download if less than QUOTA_THRESHOLD bytes are available.
   Falls back gracefully if the API is unavailable.
═══════════════════════════════════════════════════════════════════════════ */
async function checkQuota() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return true; /* API unavailable — proceed optimistically */
  }
  try {
    const { usage, quota } = await navigator.storage.estimate();
    const free = (quota || 0) - (usage || 0);
    console.info('[WebLLM] Storage: quota', Math.round((quota||0)/1024/1024), 'MB, usage', Math.round((usage||0)/1024/1024), 'MB, free', Math.round(free/1024/1024), 'MB');
    if (free < QUOTA_THRESHOLD) {
      console.warn('[WebLLM] Insufficient storage:', Math.round(free/1024/1024), 'MB free, need', Math.round(QUOTA_THRESHOLD/1024/1024), 'MB');
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[WebLLM] storage.estimate() failed:', e);
    return true; /* fail open */
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUOTA EXCEEDED DETECTOR
   Both DOMException name and message vary across browsers.
   We catch all variants here.
═══════════════════════════════════════════════════════════════════════════ */
function isQuotaError(err) {
  if (!err) return false;
  const name = (err.name || '').toLowerCase();
  const msg  = (err.message || '').toLowerCase();
  return name === 'quotaexceedederror'    ||
         name === 'ns_error_dom_quota_reached' ||
         msg.includes('quota')            ||
         msg.includes('storage')          ||
         err.code === 22;                 /* legacy DOMException code */
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS COMPUTATION
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

function buildLabel(report, pct) {
  const raw    = (report.text || '').trim();
  const pctStr = pct != null ? String(pct) : '…';
  const cm     = raw.match(/\[(\d+)\/(\d+)\]/);
  const n      = cm ? cm[1] : null;
  const total  = cm ? cm[2] : null;
  const sm     = raw.match(/([\d.]+\s*(?:MB|GB))/i);
  const mb     = sm ? ' (' + sm[1].replace(/\s+/g, '') + ')' : '';

  if (/compil/i.test(raw)) {
    const slash = raw.match(/(\d+)\s*\/\s*(\d+)/);
    if (slash) return t('compilingShaders', { n: slash[1], total: slash[2] });
    if (n && total) return t('compilingShaders', { n, total });
    return t('compilingNoCount');
  }
  if (/token/i.test(raw))              return t('loadingTokenizer');
  if (/finish|complete|ready/i.test(raw)) return t('finalizing');
  if (/cache/i.test(raw)) {
    if (n && total) return t('loadingCache', { n, total, mb });
    return t('loadingCachePct', { pct: pctStr });
  }
  if (/fetch|loading\s+model|param|download/i.test(raw)) {
    if (n && total) return t('downloading', { n, total, mb });
    return t('downloadingPct', { pct: pctStr });
  }
  if (n && total) return t('downloading', { n, total, mb });
  return t('generic', { pct: pctStr });
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 1 — WebGPU probe
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
  return false;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 2 — Module load
═══════════════════════════════════════════════════════════════════════════ */
async function loadModule() {
  for (let i = 0; i < CDNS.length; i++) {
    const url  = CDNS[i];
    const host = new URL(url).hostname;
    pushProgress(7 + i, i === 0 ? t('downloadingModule', { host }) : t('tryingCDN', { host }));
    try {
      const mod = await import(url);
      if (mod && typeof mod.CreateMLCEngine === 'function') {
        console.info('[WebLLM] Module OK from', host);
        return mod;
      }
      console.warn('[WebLLM]', host, '— missing CreateMLCEngine');
    } catch (e) {
      console.warn('[WebLLM]', host, '— import failed:', e?.message);
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 3 — Pick best model ID
   Returns the first model ID found in the module's model list.
   Tries MODELS in order (smallest first).
═══════════════════════════════════════════════════════════════════════════ */
function pickModelId(mod) {
  try {
    const list = mod.prebuiltAppConfig && mod.prebuiltAppConfig.model_list;
    if (!list) {
      console.warn('[WebLLM] Model list unavailable, using default:', MODELS[0]);
      return MODELS[0];
    }
    const ids = list.map(m => m.model_id);
    for (const candidate of MODELS) {
      if (ids.includes(candidate)) {
        console.info('[WebLLM] Selected model:', candidate);
        return candidate;
      }
    }
    /* None of our preferred models found — use the first in the list */
    console.warn('[WebLLM] None of preferred models found, using:', ids[0]);
    return ids[0] || null;
  } catch (e) {
    return MODELS[0];
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAGE 4 — Engine init with quota error handling
═══════════════════════════════════════════════════════════════════════════ */
async function initEngine(mod, modelId) {
  let progressFired = false;

  const hangTimer = setTimeout(() => {
    if (!progressFired && !window.__webllmReady) {
      console.warn('[WebLLM] Hang detected');
      pushProgress(100, t('errHang'));
      window.__webllmFailed = 'hang-timeout';
    }
  }, HANG_MS);

  const engine = await mod.CreateMLCEngine(modelId, {
    initProgressCallback(report) {
      if (!progressFired) {
        progressFired = true;
        clearTimeout(hangTimer);
      }
      const pct   = computeProgress(report);
      const label = buildLabel(report, pct);
      if (pct !== null) pushProgress(pct, label);
      console.debug('[WebLLM]', pct + '%', '|', label);
    }
  });

  clearTimeout(hangTimer);
  return engine;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
(async () => {
  try {
    /* Stage 1: WebGPU */
    pushProgress(2, t('checkingGPU'));
    if (!await probeWebGPU()) {
      pushProgress(100, t('errNoGPU'));
      window.__webllmFailed = 'no-webgpu';
      return;
    }

    /* Stage 1b: Quota pre-check */
    pushProgress(4, t('checkingQuota'));
    if (!await checkQuota()) {
      pushProgress(100, t('errQuota'));
      window.__webllmFailed = 'quota-insufficient';
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

    /* Stage 3: Model selection */
    pushProgress(8, t('verifyingModel'));
    const modelId = pickModelId(mod);
    if (!modelId) {
      pushProgress(100, t('errModelNotFound'));
      window.__webllmFailed = 'model-id-not-found';
      return;
    }

    /* Stage 4: Engine init */
    pushProgress(10, t('initEngine', { model: modelId }));
    const engine = await initEngine(mod, modelId);

    if (window.__webllmFailed) return;

    pushProgress(100, t('ready'));
    window.__webllmReady = engine;
    console.info('[WebLLM] Ready ✓ model:', modelId);

  } catch (e) {
    const msg = (e && e.message) || 'unknown-error';
    console.error('[WebLLM] Fatal:', msg, e);

    /* Quota exceeded — specific friendly message */
    if (isQuotaError(e)) {
      pushProgress(100, t('errQuotaExceeded'));
      window.__webllmFailed = 'quota-exceeded';
      return;
    }

    pushProgress(100, t('errGeneric', { msg: msg.slice(0, 90) }));
    window.__webllmFailed = msg;
  }
})();
