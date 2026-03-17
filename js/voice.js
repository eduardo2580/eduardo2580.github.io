/*
 * voice.js — Web Speech API integration for Eduardo.AI
 * ES5 compatible. No dependencies beyond the browser.
 *
 * States:
 *   unsupported — browser has no SpeechRecognition → locked icon, tooltip explains
 *   denied      — user denied mic permission → locked icon, tooltip explains
 *   idle        — ready, showing normal mic icon
 *   listening   — actively recording, pulsing red mic icon
 *   processing  — transcript received, filling input
 *
 * Exposes:
 *   window.VoiceController.setLang(lang)  — updates recognition language
 *   window.VoiceController.getState()     — returns current state string
 */
(function (win, doc) {
  'use strict';

  /* ── DOM refs ── */
  var $btn        = doc.getElementById('mic-btn');
  var $iconIdle   = doc.getElementById('mic-icon-idle');
  var $iconActive = doc.getElementById('mic-icon-active');
  var $iconLocked = doc.getElementById('mic-icon-locked');
  var $tooltip    = doc.getElementById('mic-tooltip');
  var $input      = doc.getElementById('chat-input');

  if (!$btn) return; /* no button in DOM, bail */

  /* ── Translated strings ── */
  var STRINGS = {
    unsupported: {
      pt: 'Voz não disponível neste navegador',
      en: 'Voice not available in this browser',
      es: 'Voz no disponible en este navegador'
    },
    denied: {
      pt: 'Permissão de microfone negada',
      en: 'Microphone permission denied',
      es: 'Permiso de micrófono denegado'
    },
    listening: {
      pt: 'Ouvindo… clique para parar',
      en: 'Listening… click to stop',
      es: 'Escuchando… clic para detener'
    },
    idle: {
      pt: 'Clique para falar',
      en: 'Click to speak',
      es: 'Clic para hablar'
    },
    noSpeech: {
      pt: 'Nenhuma fala detectada',
      en: 'No speech detected',
      es: 'No se detectó voz'
    },
    permRequest: {
      pt: 'Solicitando permissão de microfone…',
      en: 'Requesting microphone permission…',
      es: 'Solicitando permiso de micrófono…'
    }
  };

  /* ── Lang → BCP-47 locale map ── */
  var LOCALES = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

  /* ── State ── */
  var state       = 'idle';
  var currentLang = 'pt';
  var recognition = null;
  var permissionKnown = false; /* true once we've tried to get permission */

  /* ── Detect Web Speech API ── */
  var SpeechRecognition = win.SpeechRecognition
    || win.webkitSpeechRecognition
    || win.mozSpeechRecognition
    || win.msSpeechRecognition
    || null;

  /* ════════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════════ */
  function str(key) {
    var entry = STRINGS[key];
    if (!entry) return '';
    return entry[currentLang] || entry.pt;
  }

  function showIcon(which) {
    /* which: 'idle' | 'active' | 'locked' */
    if ($iconIdle)   $iconIdle.style.display   = (which === 'idle')   ? '' : 'none';
    if ($iconActive) $iconActive.style.display = (which === 'active') ? '' : 'none';
    if ($iconLocked) $iconLocked.style.display = (which === 'locked') ? '' : 'none';
  }

  function setTooltip(text) {
    if ($tooltip) $tooltip.textContent = text || '';
  }

  function addClass(el, cls) {
    if (!el) return;
    if (el.classList) { el.classList.add(cls); return; }
    if (el.className.indexOf(cls) < 0) el.className += ' ' + cls;
  }
  function removeClass(el, cls) {
    if (!el) return;
    if (el.classList) { el.classList.remove(cls); return; }
    el.className = el.className.replace(new RegExp('\\b' + cls + '\\b', 'g'), '').trim();
  }

  /* ════════════════════════════════════════════
     RENDER STATE
  ════════════════════════════════════════════ */
  function render() {
    switch (state) {
      case 'unsupported':
        showIcon('locked');
        setTooltip(str('unsupported'));
        addClass($btn, 'mic-locked');
        removeClass($btn, 'mic-listening');
        $btn.setAttribute('aria-label', str('unsupported'));
        break;

      case 'denied':
        showIcon('locked');
        setTooltip(str('denied'));
        addClass($btn, 'mic-locked');
        removeClass($btn, 'mic-listening');
        $btn.setAttribute('aria-label', str('denied'));
        break;

      case 'listening':
        showIcon('active');
        setTooltip(str('listening'));
        removeClass($btn, 'mic-locked');
        addClass($btn, 'mic-listening');
        $btn.setAttribute('aria-label', str('listening'));
        break;

      default: /* idle / processing */
        showIcon('idle');
        setTooltip(str('idle'));
        removeClass($btn, 'mic-locked');
        removeClass($btn, 'mic-listening');
        $btn.setAttribute('aria-label', str('idle'));
        break;
    }
  }

  /* ════════════════════════════════════════════
     CHECK / REQUEST MIC PERMISSION
     Uses Permissions API when available,
     falls back to actually starting recognition
  ════════════════════════════════════════════ */
  function checkPermission(onGranted, onDenied) {
    /* Permissions API available (Chrome, Edge, Firefox 96+) */
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' }).then(function (result) {
        if (result.state === 'granted') {
          permissionKnown = true;
          onGranted();
        } else if (result.state === 'denied') {
          permissionKnown = true;
          onDenied();
        } else {
          /* 'prompt' — will ask when we start recognition */
          onGranted();
        }
        /* Watch for permission changes */
        result.onchange = function () {
          if (result.state === 'denied') {
            stopListening();
            state = 'denied';
            render();
          } else if (result.state === 'granted') {
            if (state === 'denied') {
              state = 'idle';
              render();
            }
          }
        };
      }).catch(function () {
        /* Permissions API failed, proceed optimistically */
        onGranted();
      });
    } else {
      /* No Permissions API — proceed, errors caught in recognition.onerror */
      onGranted();
    }
  }

  /* ════════════════════════════════════════════
     BUILD RECOGNITION INSTANCE
  ════════════════════════════════════════════ */
  function buildRecognition() {
    if (!SpeechRecognition) return null;
    var r = new SpeechRecognition();
    r.continuous      = false;   /* single utterance */
    r.interimResults  = true;    /* show partial results in input */
    r.maxAlternatives = 1;
    r.lang            = LOCALES[currentLang] || 'pt-BR';
    return r;
  }

  /* ════════════════════════════════════════════
     START LISTENING
  ════════════════════════════════════════════ */
  function startListening() {
    if (state === 'listening') {
      stopListening();
      return;
    }
    if (state === 'unsupported' || state === 'denied') return;

    recognition = buildRecognition();
    if (!recognition) {
      state = 'unsupported';
      render();
      return;
    }

    /* Show permission request hint */
    if (!permissionKnown) {
      setTooltip(str('permRequest'));
    }

    /* Result handler */
    recognition.onresult = function (e) {
      var transcript = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      if ($input) {
        $input.value = transcript;
        /* Trigger prediction update */
        var evt = doc.createEvent ? doc.createEvent('Event') : null;
        if (evt) { evt.initEvent('input', true, true); $input.dispatchEvent(evt); }
      }
    };

    /* Final result — auto-send if setting complete */
    recognition.onend = function () {
      var wasFinal = $input && $input.value.trim().length > 0;
      if (state === 'listening') {
        state = 'idle';
        render();
        /* Auto-send the transcribed text */
        if (wasFinal && win.chatSend) {
          win.chatSend();
        }
      }
    };

    /* Error handler */
    recognition.onerror = function (e) {
      if (win.console) win.console.warn('[Voice] Error:', e.error);
      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        permissionKnown = true;
        state = 'denied';
      } else if (e.error === 'no-speech') {
        setTooltip(str('noSpeech'));
        state = 'idle';
        setTimeout(function () { render(); }, 2000);
        return;
      } else {
        state = 'idle';
      }
      render();
    };

    recognition.onaudiostart = function () {
      permissionKnown = true; /* permission was granted if audio started */
      state = 'listening';
      render();
    };

    try {
      recognition.start();
    } catch (err) {
      if (win.console) win.console.warn('[Voice] Start error:', err);
      state = 'idle';
      render();
    }
  }

  /* ════════════════════════════════════════════
     STOP LISTENING
  ════════════════════════════════════════════ */
  function stopListening() {
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
      recognition = null;
    }
    if (state === 'listening') {
      state = 'idle';
      render();
    }
  }

  /* ════════════════════════════════════════════
     CLICK HANDLER
  ════════════════════════════════════════════ */
  function onMicClick() {
    if (state === 'unsupported' || state === 'denied') {
      /* Show tooltip briefly on click so user understands why it's locked */
      if ($tooltip) {
        addClass($tooltip, 'tooltip-flash');
        setTimeout(function () { removeClass($tooltip, 'tooltip-flash'); }, 2200);
      }
      return;
    }
    if (state === 'listening') {
      stopListening();
      return;
    }
    /* Check permission before starting */
    checkPermission(
      function () { startListening(); },
      function () { state = 'denied'; render(); }
    );
  }

  /* Attach click */
  if ($btn.addEventListener) {
    $btn.addEventListener('click', onMicClick, false);
  } else if ($btn.attachEvent) {
    $btn.attachEvent('onclick', onMicClick);
  }

  /* ════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════ */
  function init() {
    if (!SpeechRecognition) {
      state = 'unsupported';
    } else {
      state = 'idle';
      /* Silently check if permission is already denied */
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'microphone' }).then(function (r) {
          if (r.state === 'denied') {
            permissionKnown = true;
            state = 'denied';
            render();
          }
        }).catch(function () {});
      }
    }
    render();
  }

  /* ════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════ */
  win.VoiceController = {
    setLang: function (lang) {
      currentLang = lang;
      /* Update running recognition language if possible */
      if (recognition && recognition.lang !== undefined) {
        recognition.lang = LOCALES[lang] || 'pt-BR';
      }
      render();
    },
    getState: function () { return state; },
    stop: stopListening
  };

  /* Boot */
  if (doc.readyState === 'complete' || doc.readyState === 'loaded' || doc.readyState === 'interactive') {
    init();
  } else {
    if (doc.addEventListener) { doc.addEventListener('DOMContentLoaded', init, false); }
    else if (doc.attachEvent) { doc.attachEvent('onreadystatechange', function () {
      if (doc.readyState === 'complete') init();
    }); }
  }

}(window, document));
