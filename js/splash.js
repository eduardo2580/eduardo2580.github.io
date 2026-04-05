/* ===========================================================
   Splash Screen – Bíblia Sagrada PWA
   Injects a full-screen loading overlay for 10 seconds,
   then fades it out revealing the app.
   Include this as the VERY FIRST <script> in <body> (inline or deferred).
   =========================================================== */

(function () {
  'use strict';

  const DURATION_MS   = 10000;   // total splash time
  const FADE_DURATION = 800;     // fade-out duration (ms)

  const VERSES = [
    { text: 'A tua palavra é lâmpada para os meus pés e luz para o meu caminho.', ref: 'Salmos 119:105' },
    { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.', ref: 'João 3:16' },
    { text: 'Tudo posso naquele que me fortalece.', ref: 'Filipenses 4:13' },
    { text: 'O Senhor é o meu pastor e nada me faltará.', ref: 'Salmos 23:1' },
    { text: 'Sede fortes e corajosos. Não temais, nem vos assusteis.', ref: 'Josué 1:9' },
    { text: 'Confiai no Senhor de todo o vosso coração.', ref: 'Provérbios 3:5' },
    { text: 'Buscai primeiro o reino de Deus e a sua justiça.', ref: 'Mateus 6:33' },
    { text: 'Com Deus nada é impossível.', ref: 'Lucas 1:37' },
  ];

  function pickVerse() {
    const d = new Date();
    return VERSES[(d.getDate() + d.getMonth()) % VERSES.length];
  }

  function buildSplash() {
    const verse = pickVerse();

    const style = document.createElement('style');
    style.textContent = `
      #bs-splash {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0;
        background: #1a0d02;
        overflow: hidden;
        transition: opacity ${FADE_DURATION}ms ease;
      }

      #bs-splash::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 70% 60% at 50% 30%, rgba(180,130,60,0.18) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 50% 80%, rgba(120,60,10,0.22) 0%, transparent 70%);
        pointer-events: none;
      }

      #bs-splash.fade-out { opacity: 0; }

      @keyframes bs-rise {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes bs-glow {
        0%, 100% { text-shadow: 0 0 18px rgba(210,170,80,0.5); }
        50%       { text-shadow: 0 0 40px rgba(210,170,80,0.85), 0 0 80px rgba(180,130,40,0.3); }
      }
      @keyframes bs-shimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }
      @keyframes bs-bar {
        from { width: 0%; }
        to   { width: 100%; }
      }
      @keyframes bs-pulse-ring {
        0%   { transform: scale(0.85); opacity: 0.6; }
        70%  { transform: scale(1.15); opacity: 0.1; }
        100% { transform: scale(0.85); opacity: 0;   }
      }

      #bs-logo-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;
        margin-bottom: 32px;
        animation: bs-rise 0.8s ease both;
      }

      #bs-ring {
        position: absolute;
        inset: -12px;
        border-radius: 50%;
        border: 2px solid rgba(210,170,80,0.4);
        animation: bs-pulse-ring 2.4s ease-out infinite;
      }

      #bs-logo-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid rgba(210,170,80,0.6);
        background: radial-gradient(circle at 40% 35%, rgba(255,220,120,0.15), rgba(30,15,4,0.8));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
        line-height: 1;
        box-shadow:
          0 0 0 6px rgba(210,170,80,0.08),
          inset 0 0 24px rgba(180,130,40,0.15);
      }

      #bs-brand {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: clamp(22px, 5vw, 30px);
        font-weight: 400;
        letter-spacing: 0.18em;
        color: transparent;
        background: linear-gradient(90deg,
          #9a7435 0%,
          #e8c96b 30%,
          #f5e4a3 50%,
          #e8c96b 70%,
          #9a7435 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        text-transform: uppercase;
        animation:
          bs-rise 0.8s 0.2s ease both,
          bs-shimmer 3.5s 1s linear infinite;
        margin-bottom: 6px;
      }

      #bs-subtitle {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: clamp(11px, 2.5vw, 13px);
        letter-spacing: 0.32em;
        color: rgba(210,170,80,0.55);
        text-transform: uppercase;
        animation: bs-rise 0.8s 0.35s ease both;
        margin-bottom: 52px;
      }

      #bs-verse-block {
        max-width: min(480px, 88vw);
        text-align: center;
        animation: bs-rise 0.9s 0.6s ease both;
        padding: 0 24px;
      }

      #bs-ornament {
        color: rgba(210,170,80,0.5);
        font-size: 18px;
        letter-spacing: 12px;
        margin-bottom: 18px;
        display: block;
      }

      #bs-verse-text {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: clamp(15px, 3.8vw, 18px);
        font-style: italic;
        line-height: 1.7;
        color: #f5edd8;
        margin-bottom: 14px;
      }

      #bs-verse-ref {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: clamp(11px, 2.5vw, 13px);
        letter-spacing: 0.18em;
        color: rgba(210,170,80,0.75);
        text-transform: uppercase;
      }

      #bs-progress-wrap {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(255,255,255,0.06);
      }

      #bs-progress-bar {
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, #9a7435, #e8c96b, #f5e4a3);
        animation: bs-bar ${DURATION_MS}ms linear forwards;
      }

      #bs-corner-tl, #bs-corner-tr, #bs-corner-bl, #bs-corner-br {
        position: absolute;
        width: 32px;
        height: 32px;
        opacity: 0.35;
        pointer-events: none;
      }
      #bs-corner-tl { top: 20px; left: 20px; border-top: 1.5px solid #c8a84b; border-left: 1.5px solid #c8a84b; }
      #bs-corner-tr { top: 20px; right: 20px; border-top: 1.5px solid #c8a84b; border-right: 1.5px solid #c8a84b; }
      #bs-corner-bl { bottom: 20px; left: 20px; border-bottom: 1.5px solid #c8a84b; border-left: 1.5px solid #c8a84b; }
      #bs-corner-br { bottom: 20px; right: 20px; border-bottom: 1.5px solid #c8a84b; border-right: 1.5px solid #c8a84b; }
    `;

    const overlay = document.createElement('div');
    overlay.id = 'bs-splash';
    overlay.setAttribute('aria-label', 'Carregando Bíblia Sagrada');
    overlay.setAttribute('role', 'status');

    overlay.innerHTML = `
      <div id="bs-corner-tl"></div>
      <div id="bs-corner-tr"></div>
      <div id="bs-corner-bl"></div>
      <div id="bs-corner-br"></div>

      <div id="bs-logo-wrap">
        <div id="bs-ring"></div>
        <div id="bs-logo-circle">📖</div>
      </div>

      <div id="bs-brand">Bíblia Sagrada</div>
      <div id="bs-subtitle">Palavra de Deus</div>

      <div id="bs-verse-block">
        <span id="bs-ornament">✦ ✦ ✦</span>
        <p id="bs-verse-text">"${verse.text}"</p>
        <p id="bs-verse-ref">${verse.ref}</p>
      </div>

      <div id="bs-progress-wrap">
        <div id="bs-progress-bar"></div>
      </div>
    `;

    document.head.appendChild(style);
    document.body.insertBefore(overlay, document.body.firstChild);

    // Dismiss after DURATION_MS
    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
        style.remove();
      }, FADE_DURATION + 50);
    }, DURATION_MS);
  }

  // Run as early as possible
  if (document.body) {
    buildSplash();
  } else {
    document.addEventListener('DOMContentLoaded', buildSplash);
  }

})();