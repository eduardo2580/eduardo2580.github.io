/* ===========================================================
   Splash Screen – Bíblia Sagrada PWA (Versão Estabilizada)
   =========================================================== */

(function () {
  'use strict';

  // --- TRAVA DE SEGURANÇA: CARREGA APENAS UMA VEZ POR SESSÃO ---
  // Isso impede que o splash apareça novamente se o app recarregar para atualizar.
  if (sessionStorage.getItem('bs_splash_shown')) {
    return; 
  }

  const DURATION_MS   = 10000;   // Tempo total de exibição
  const FADE_DURATION = 800;     // Tempo do efeito de sumir

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
    // Registra que o splash já foi exibido nesta sessão
    sessionStorage.setItem('bs_splash_shown', 'true');

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
      }
      #bs-brand {
        font-family: 'Georgia', serif;
        font-size: 26px;
        letter-spacing: 0.18em;
        color: transparent;
        background: linear-gradient(90deg, #9a7435, #e8c96b, #f5e4a3, #e8c96b, #9a7435);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        text-transform: uppercase;
        animation: bs-rise 0.8s 0.2s ease both, bs-shimmer 3.5s 1s linear infinite;
        margin-bottom: 6px;
      }
      #bs-subtitle {
        font-family: 'Georgia', serif;
        font-size: 12px;
        letter-spacing: 0.32em;
        color: rgba(210,170,80,0.55);
        text-transform: uppercase;
        animation: bs-rise 0.8s 0.35s ease both;
        margin-bottom: 52px;
      }
      #bs-verse-block {
        max-width: 480px;
        text-align: center;
        animation: bs-rise 0.9s 0.6s ease both;
        padding: 0 24px;
      }
      #bs-verse-text {
        font-family: 'Georgia', serif;
        font-size: 17px;
        font-style: italic;
        line-height: 1.7;
        color: #f5edd8;
        margin-bottom: 14px;
      }
      #bs-verse-ref {
        font-family: 'Georgia', serif;
        font-size: 12px;
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
    `;

    const overlay = document.createElement('div');
    overlay.id = 'bs-splash';
    overlay.innerHTML = `
      <div id="bs-logo-wrap"><div id="bs-ring"></div><div id="bs-logo-circle">📖</div></div>
      <div id="bs-brand">Bíblia Sagrada</div>
      <div id="bs-subtitle">Palavra de Deus</div>
      <div id="bs-verse-block">
        <p id="bs-verse-text">"${verse.text}"</p>
        <p id="bs-verse-ref">${verse.ref}</p>
      </div>
      <div id="bs-progress-wrap"><div id="bs-progress-bar"></div></div>
    `;

    document.head.appendChild(style);
    document.body.insertBefore(overlay, document.body.firstChild);

    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
        style.remove();
      }, FADE_DURATION + 50);
    }, DURATION_MS);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    buildSplash();
  } else {
    document.addEventListener('DOMContentLoaded', buildSplash);
  }
})();