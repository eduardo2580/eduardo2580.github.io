/**
 * webllm-loader.js  —  <script type="module">
 *
 * Pure ES module. Loads WebLLM natively in every modern browser.
 * Communicates with ES5 chat.js via window globals:
 *
 *   window.__webllmStarted   — true as soon as this script runs
 *   window.__webllmReady     — the MLC engine instance (on success)
 *   window.__webllmFailed    — error string (on permanent failure)
 *   window.__webllmProgress(pct, text) — progress bridge (set by chat.js)
 */

const MODEL_ID = 'Phi-3.5-mini-instruct-q4f16_1-MLC';

const CDNS = [
  'https://esm.sh/@mlc-ai/web-llm',
  'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.79/+esm',
  'https://esm.run/@mlc-ai/web-llm'
];

/* Signal immediately so chat.js knows not to overwrite the progress bar */
window.__webllmStarted = true;

/* Push a progress update — chat.js may or may not have registered the
   callback yet, so we also write directly to the DOM as a safety net */
function pushProgress(pct, text) {
  /* Try the chat.js bridge */
  if (typeof window.__webllmProgress === 'function') {
    window.__webllmProgress(pct, text);
  }
  /* Direct DOM fallback — always works regardless of timing */
  const fill  = document.getElementById('llm-loader-fill');
  const label = document.getElementById('llm-loader-label');
  if (fill)  fill.style.width  = Math.min(100, pct) + '%';
  if (label && text) label.textContent = text;
}

/* ── WebGPU check ── */
async function hasWebGPU() {
  if (!navigator.gpu) return false;
  try {
    const adapter = await Promise.race([
      navigator.gpu.requestAdapter(),
      new Promise(resolve => setTimeout(() => resolve(true), 4000))
    ]);
    return !!adapter;
  } catch {
    return false;
  }
}

/* ── CDN loader ── */
async function loadWebLLMModule() {
  for (const url of CDNS) {
    try {
      pushProgress(8, 'Baixando módulo de IA…');
      const mod = await import(url);
      if (mod && typeof mod.CreateMLCEngine === 'function') return mod;
    } catch (e) {
      console.warn('[WebLLM] CDN failed:', url, e?.message);
    }
  }
  return null;
}

/* ── Main ── */
(async () => {
  try {
    pushProgress(3, 'Verificando WebGPU…');

    const gpuOk = await hasWebGPU();
    if (!gpuOk) {
      window.__webllmFailed = 'no-webgpu';
      return;
    }

    pushProgress(6, 'WebGPU disponível, carregando módulo…');

    const webllm = await loadWebLLMModule();
    if (!webllm) {
      window.__webllmFailed = 'all-cdns-failed';
      return;
    }

    pushProgress(10, 'Inicializando modelo…');

    const engine = await webllm.CreateMLCEngine(MODEL_ID, {
      initProgressCallback(report) {
        const pct  = Math.round((report.progress || 0) * 100);
        const text = report.text?.trim()
          ? report.text
          : `Carregando modelo… ${pct}%`;
        pushProgress(pct, text);
      }
    });

    window.__webllmReady = engine;
    pushProgress(100, 'IA pronta!');

  } catch (e) {
    console.warn('[WebLLM] Init failed:', e?.message);
    window.__webllmFailed = e?.message || 'unknown-error';
  }
})();
