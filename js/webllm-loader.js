/*
 * webllm-loader.js — Eduardo.AI (v3)
 *
 * Load order in index.html (MUST be type="module"):
 *   <script type="module" src="webllm-loader.js"></script>
 *
 * Model ladder — smallest first:
 *   1. SmolLM2-135M-Instruct-q4f16_1-MLC   ~80 MB
 *   2. SmolLM2-360M-Instruct-q4f16_1-MLC   ~200 MB
 *   3. Qwen2-0.5B-Instruct-q4f16_1-MLC     ~300 MB
 *   4. SmolLM2-1.7B-Instruct-q4f16_1-MLC   ~900 MB
 *
 * Sets window.__webllmReady  = engine   on success
 * Sets window.__webllmFailed = reason   on failure
 */

const MODELS = [
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',   // ~900 MB — fast, good multilingual
  'Llama-3.2-3B-Instruct-q4f16_1-MLC',    // ~1.8 GB — excellent PT/ES/EN
  'Qwen2.5-3B-Instruct-q4f16_1-MLC',      // ~1.8 GB — best multilingual overall
  'Phi-3.5-mini-instruct-q4f16_1-MLC',    // ~2 GB  — last resort
];

const CDNS = [
  'https://esm.run/@mlc-ai/web-llm',
  'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm/dist/web-llm.mjs',
];

const HANG_MS         = 45000;
const QUOTA_THRESHOLD = 200 * 1024 * 1024; /* 200 MB min free */

window.__webllmStarted = true;

/* ── translations ── */
const gl = () => window.__webllmLang || 'pt';
const T = {
  checkGPU:    { pt: 'Verificando WebGPU…',             en: 'Checking WebGPU…',              es: 'Verificando WebGPU…'             },
  checkQuota:  { pt: 'Verificando espaço…',             en: 'Checking storage…',             es: 'Verificando espacio…'            },
  gpuOk:       { pt: 'WebGPU OK — carregando módulo…',  en: 'WebGPU OK — loading module…',   es: 'WebGPU OK — cargando módulo…'   },
  dlMod:       { pt: 'Baixando módulo via {h}…',        en: 'Downloading module via {h}…',   es: 'Descargando módulo via {h}…'    },
  tryCDN:      { pt: 'Tentando CDN alternativa…',       en: 'Trying alternative CDN…',       es: 'Probando CDN alternativa…'      },
  pickModel:   { pt: 'Selecionando modelo…',            en: 'Selecting model…',              es: 'Seleccionando modelo…'          },
  initModel:   { pt: 'Iniciando {m}…',                  en: 'Starting {m}…',                 es: 'Iniciando {m}…'                 },
  retry:       { pt: 'Tentando modelo menor…',          en: 'Trying smaller model…',         es: 'Probando modelo menor…'         },
  downloading: { pt: 'Baixando… {p}%',                  en: 'Downloading… {p}%',             es: 'Descargando… {p}%'              },
  loadCache:   { pt: 'Lendo cache… {p}%',               en: 'Reading cache… {p}%',           es: 'Leyendo caché… {p}%'            },
  compiling:   { pt: 'Compilando shaders…',             en: 'Compiling shaders…',            es: 'Compilando shaders…'            },
  finalizing:  { pt: 'Finalizando…',                    en: 'Finalising…',                   es: 'Finalizando…'                   },
  ready:       { pt: 'IA pronta ✓',                     en: 'AI ready ✓',                    es: 'IA lista ✓'                     },
  generic:     { pt: 'Carregando… {p}%',                en: 'Loading… {p}%',                 es: 'Cargando… {p}%'                 },
  errNoGPU:    { pt: '⚠ WebGPU indisponível.',          en: '⚠ WebGPU unavailable.',         es: '⚠ WebGPU no disponible.'        },
  errQuota:    { pt: '⚠ Espaço insuficiente.',          en: '⚠ Not enough storage.',         es: '⚠ Espacio insuficiente.'        },
  errCDN:      { pt: '⚠ Falha ao baixar módulo.',       en: '⚠ Module download failed.',     es: '⚠ Error al descargar módulo.'   },
  errModel:    { pt: '⚠ Nenhum modelo disponível.',     en: '⚠ No model available.',         es: '⚠ Ningún modelo disponible.'    },
  errHang:     { pt: '⚠ Motor sem resposta.',           en: '⚠ Engine timed out.',           es: '⚠ Motor sin respuesta.'         },
  errQuotaOv:  { pt: '⚠ Cota de armazenamento excedida.', en: '⚠ Storage quota exceeded.',  es: '⚠ Cuota excedida.'              },
  errGeneric:  { pt: '⚠ Erro: {msg}',                   en: '⚠ Error: {msg}',               es: '⚠ Error: {msg}'                 },
};
function t(k, v) {
  const e = T[k]; if (!e) return k;
  let s = e[gl()] || e.pt;
  if (v) Object.keys(v).forEach(k2 => { s = s.replace('{' + k2 + '}', v[k2]); });
  return s;
}

/* ── DOM ── */
function push(pct, text) {
  const p = Math.min(100, Math.max(0, Math.round(pct)));
  const fill = document.getElementById('llm-loader-fill');
  const lbl  = document.getElementById('llm-loader-label');
  if (fill)        fill.style.width = p + '%';
  if (lbl && text) lbl.textContent  = text;
  if (typeof window.__webllmProgress === 'function') {
    try { window.__webllmProgress(p, text); } catch (_) {}
  }
}

/* ── quota check ── */
async function checkQuota() {
  if (!navigator.storage?.estimate) return true;
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const free = quota - usage;
    console.info('[WebLLM] Free storage:', Math.round(free / 1024 / 1024), 'MB');
    return free >= QUOTA_THRESHOLD;
  } catch { return true; }
}

function isQuotaErr(e) {
  if (!e) return false;
  const n = (e.name    || '').toLowerCase();
  const m = (e.message || '').toLowerCase();
  return n === 'quotaexceedederror' || n === 'ns_error_dom_quota_reached'
      || m.includes('quota') || m.includes('storage') || e.code === 22;
}

/* ── progress label ── */
function pct(report) {
  const m = (report.text || '').match(/\[(\d+)\/(\d+)\]/);
  if (m) {
    const n = +m[1], tot = +m[2];
    if (tot > 0) return Math.round(((n - 1) / tot) * 80 + 12 + (report.progress || 0) * (80 / tot));
  }
  if (typeof report.progress === 'number') return Math.round(12 + report.progress * 80);
  return null;
}
function label(report, p) {
  const raw = (report.text || '').trim(), ps = p != null ? String(p) : '…';
  if (/compil/i.test(raw))                    return t('compiling');
  if (/token|finish|complete|ready/i.test(raw)) return t('finalizing');
  if (/cache/i.test(raw))                     return t('loadCache', { p: ps });
  if (/fetch|load|param|download/i.test(raw)) return t('downloading', { p: ps });
  return t('generic', { p: ps });
}

/* ── WebGPU probe ── */
async function probeGPU() {
  if (!navigator.gpu) return false;
  for (const o of [{ powerPreference: 'high-performance' }, { powerPreference: 'low-power' }, {}]) {
    try {
      const a = await Promise.race([
        navigator.gpu.requestAdapter(o),
        new Promise(r => setTimeout(() => r(null), 6000))
      ]);
      if (a) return true;
    } catch { /* try next */ }
    await new Promise(r => setTimeout(r, 600));
  }
  return false;
}

/* ── module load ── */
async function loadMod() {
  for (const url of CDNS) {
    const h = new URL(url).hostname;
    push(7, t('dlMod', { h }));
    try {
      const mod = await import(url);
      if (mod && typeof mod.CreateMLCEngine === 'function') return mod;
    } catch (e) { console.warn('[WebLLM]', h, 'failed:', e?.message); push(8, t('tryCDN')); }
  }
  return null;
}

/* ── model list ── */
function candidates(mod) {
  try {
    const ids = (mod.prebuiltAppConfig?.model_list || []).map(m => m.model_id);
    if (!ids.length) return [...MODELS];
    const f = MODELS.filter(id => ids.includes(id));
    return f.length ? f : [ids[0]];
  } catch { return [...MODELS]; }
}

/* ── init one model ── */
async function initOne(mod, modelId, base) {
  let fired = false, done = false;
  const hang = setTimeout(() => {
    if (!fired && !done) { window.__webllmFailed = 'hang-timeout'; }
  }, HANG_MS);
  try {
    const engine = await mod.CreateMLCEngine(modelId, {
      initProgressCallback(r) {
        fired = true;
        const p = pct(r);
        if (p !== null) push(p, label(r, p));
      }
    });
    done = true; clearTimeout(hang); return engine;
  } catch (e) { clearTimeout(hang); throw e; }
}

/* ── try all models ── */
async function tryAll(mod, list) {
  for (let i = 0; i < list.length; i++) {
    const id = list[i];
    push(10 + i * 2, t('initModel', { m: id }));
    console.info('[WebLLM] Trying:', id);
    try {
      const engine = await initOne(mod, id, 10 + i * 2);
      if (engine) return engine;
    } catch (e) {
      if (isQuotaErr(e)) throw e;
      console.warn('[WebLLM]', id, 'failed:', e?.message);
      if (i < list.length - 1) push(11 + i * 2, t('retry'));
    }
  }
  return null;
}

/* ── MAIN ── */
(async () => {
  try {
    push(2, t('checkGPU'));
    if (!await probeGPU()) { push(100, t('errNoGPU')); window.__webllmFailed = 'no-webgpu'; return; }

    push(4, t('checkQuota'));
    if (!await checkQuota()) { push(100, t('errQuota')); window.__webllmFailed = 'quota-insufficient'; return; }

    push(6, t('gpuOk'));
    const mod = await loadMod();
    if (!mod) { push(100, t('errCDN')); window.__webllmFailed = 'all-cdns-failed'; return; }

    push(9, t('pickModel'));
    const list = candidates(mod);
    if (!list.length) { push(100, t('errModel')); window.__webllmFailed = 'no-models'; return; }
    console.info('[WebLLM] Candidates:', list);

    const engine = await tryAll(mod, list);
    if (!engine || window.__webllmFailed) {
      if (!window.__webllmFailed) { push(100, t('errModel')); window.__webllmFailed = 'all-failed'; }
      return;
    }

    push(100, t('ready'));
    window.__webllmReady = engine;
    console.info('[WebLLM] Ready ✓');

  } catch (e) {
    const msg = e?.message || 'unknown';
    console.error('[WebLLM] Fatal:', msg, e);
    if (isQuotaErr(e)) { push(100, t('errQuotaOv')); window.__webllmFailed = 'quota-exceeded'; }
    else               { push(100, t('errGeneric', { msg: msg.slice(0, 80) })); window.__webllmFailed = msg; }
  }
})();
