/*
 * chat.js — Eduardo.AI
 *
 * Browser support: Chrome, Edge, Firefox, Safari (all modern versions).
 * Written in ES5 — no const/let, no arrow functions, no template literals,
 * no async/await. Works in any browser regardless of WebGPU support.
 *
 * Architecture:
 *   ┌─────────────────────────────────────────────────────┐
 *   │  KEYBOARD MODE  (always active from first keystroke) │
 *   │  • Chip clicks  → instant cached answer              │
 *   │  • Free text    → keyword lookup → canned reply      │
 *   └───────────────────────┬─────────────────────────────┘
 *                           │ if WebLLM loads in background
 *                           ▼
 *   ┌─────────────────────────────────────────────────────┐
 *   │  AI MODE  (seamless upgrade, no reload)             │
 *   │  • Free text → WebLLM engine → generated reply      │
 *   │  • Chip clicks remain instant (no change needed)    │
 *   └─────────────────────────────────────────────────────┘
 *
 * Key design decisions:
 *   1. Never make the user wait for the AI download.
 *      If a message arrives while the engine is loading, it gets a keyword
 *      reply immediately. Once the engine is ready, the next message uses AI.
 *
 *   2. WebLLM failure is silent from the user's perspective.
 *      The progress bar shows the error briefly, then disappears.
 *      The status dot turns orange (keyword mode). No scary error dialog.
 *
 *   3. knowledge.js and db.js are untouched.
 *      This file only reads their public globals:
 *        window.SUGGESTIONS, window.GREETINGS, window.ANSWER_CACHE,
 *        window.KEYWORD_MAP, window.getAnswer, window.keywordLookup,
 *        window.buildSystemPrompt, window.DB
 */
(function (win, doc) {
  'use strict';

  /* ════════════════════════════════════════════════════════════════════════
     CONFIG
  ════════════════════════════════════════════════════════════════════════ */
  var MAX_TOKENS         = 300;   /* max tokens per WebLLM reply */
  var PREDICT_DEBOUNCE   = 80;    /* ms debounce on type-ahead prediction */
  var POLL_INTERVAL      = 400;   /* ms between WebLLM readiness polls */
  var FAIL_MIN_POLLS     = 8;     /* minimum polls before trusting __webllmFailed */
                                   /* loader's hang detector fires at 30s, so by  */
                                   /* the time __webllmFailed is set all slow ops  */
                                   /* are done — 8 × 400ms = 3.2s grace period   */

  /* ════════════════════════════════════════════════════════════════════════
     STATE
  ════════════════════════════════════════════════════════════════════════ */
  var lang             = 'pt';   /* current UI language */
  var engine           = null;   /* WebLLM MLCEngine — null until loaded */
  var busy             = false;  /* true while a response is in flight */
  var stopRequested    = false;  /* set by stop button during WebLLM call */
  var talkTimer        = null;
  var greetBubble      = null;
  var predictTimer     = null;
  var currentPrediction = '';

  /* ════════════════════════════════════════════════════════════════════════
     DOM REFS
  ════════════════════════════════════════════════════════════════════════ */
  var $msgs      = doc.getElementById('messages');
  var $wrap      = doc.getElementById('messages-wrap');
  var $input     = doc.getElementById('chat-input');
  var $ghost     = doc.getElementById('input-ghost');
  var $send      = doc.getElementById('send-btn');
  var $sendIcon  = doc.getElementById('send-icon');
  var $stopIcon  = doc.getElementById('stop-icon');
  var $suggs     = doc.getElementById('suggestions');
  var $status    = doc.getElementById('status-text');
  var $statusDot = doc.getElementById('status-dot-shape');
  var $loader    = doc.getElementById('llm-loader');
  var $fill      = doc.getElementById('llm-loader-fill');
  var $loaderLbl = doc.getElementById('llm-loader-label');
  var $chatArea  = doc.getElementById('chat-area');
  var $langBtns  = doc.getElementsByClassName('lang-pill');
  var $disc      = doc.getElementById('disclaimer');

  /* ════════════════════════════════════════════════════════════════════════
     ES5 HELPERS
  ════════════════════════════════════════════════════════════════════════ */
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
  function hasClass(el, cls) {
    if (!el) return false;
    if (el.classList) return el.classList.contains(cls);
    return el.className.indexOf(cls) >= 0;
  }
  function toggleClass(el, cls, force) {
    if (force === true)  return addClass(el, cls);
    if (force === false) return removeClass(el, cls);
    hasClass(el, cls) ? removeClass(el, cls) : addClass(el, cls);
  }
  function setAttr(el, name, val) { if (el) el.setAttribute(name, val); }
  function on(el, ev, fn) {
    if (!el) return;
    if (el.addEventListener) el.addEventListener(ev, fn, false);
    else if (el.attachEvent) el.attachEvent('on' + ev, fn);
  }
  function later(fn, ms) { return setTimeout(fn, ms || 0); }
  function nextPaint(fn) {
    if (win.requestAnimationFrame) win.requestAnimationFrame(fn);
    else later(fn, 16);
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ════════════════════════════════════════════════════════════════════════
     UI STRINGS  (everything visible to the user, translated)
  ════════════════════════════════════════════════════════════════════════ */
  var STR = {
    placeholder:   { pt: 'Enviar mensagem…',   en: 'Send a message…',   es: 'Enviar mensaje…'   },
    loaderInit:    { pt: 'Aguardando IA…',      en: 'Waiting for AI…',   es: 'Esperando IA…'     },
    fallbackLabel: { pt: 'Modo teclado ativo',  en: 'Keyword mode',      es: 'Modo teclado'      },
    disclaimer: {
      pt: 'Eduardo.AI pode cometer erros. Verifique as respostas.',
      en: 'Eduardo.AI can make mistakes. Please double-check responses.',
      es: 'Eduardo.AI puede cometer errores. Verifique las respuestas.'
    },
    ariaMsg:   { pt: 'Mensagem',  en: 'Message',  es: 'Mensaje'  },
    ariaSend:  { pt: 'Enviar',    en: 'Send',     es: 'Enviar'   },
    ariaStop:  { pt: 'Parar',     en: 'Stop',     es: 'Detener'  },
    errWebLLM: {
      pt: '⚠ Erro ao gerar resposta.',
      en: '⚠ Error generating response.',
      es: '⚠ Error al generar respuesta.'
    }
  };
  function s(key) {
    var e = STR[key];
    return e ? (e[lang] || e.pt) : '';
  }

  /* ════════════════════════════════════════════════════════════════════════
     AVATAR / STATUS
     States: loading | online | thinking | fallback | error
  ════════════════════════════════════════════════════════════════════════ */
  var STATUS = {
    loading:  { dot: '#facc15', txt: { pt: 'Carregando IA…', en: 'Loading AI…',    es: 'Cargando IA…'   }, talk: false },
    online:   { dot: '#34d399', txt: { pt: 'Online',         en: 'Online',          es: 'En línea'       }, talk: false },
    thinking: { dot: '#a78bfa', txt: { pt: 'Pensando…',      en: 'Thinking…',       es: 'Pensando…'      }, talk: true  },
    fallback: { dot: '#fb923c', txt: { pt: 'Modo teclado',   en: 'Keyword mode',    es: 'Modo teclado'   }, talk: false },
    error:    { dot: '#f87171', txt: { pt: 'Modo offline',   en: 'Offline mode',    es: 'Modo sin conexión' }, talk: false }
  };

  function setAvatarState(state) {
    var c = STATUS[state] || STATUS.online;
    if ($statusDot) { setAttr($statusDot, 'fill', c.dot); $statusDot.style.fill = c.dot; }
    if ($status)    $status.innerHTML = escapeHtml(c.txt[lang] || '');
    if (win.AvatarController) win.AvatarController.setTalking(c.talk);
    toggleClass($chatArea, 'ai-active', !!c.talk);
  }

  /* ════════════════════════════════════════════════════════════════════════
     LOADER BAR
     Only updates the fill width — the label text is owned by webllm-loader.js
     from the moment __webllmStarted is true. We never write to $loaderLbl
     while the loader is running to avoid overwriting live progress messages.
  ════════════════════════════════════════════════════════════════════════ */
  /* Registered before boot so no early progress events are missed */
  win.__webllmProgress = function (pct) {
    if ($fill) $fill.style.width = Math.min(100, pct) + '%';
  };

  function hideLoader() { addClass($loader, 'hidden'); }

  /* ════════════════════════════════════════════════════════════════════════
     LANGUAGE
  ════════════════════════════════════════════════════════════════════════ */
  function applyLang(l) {
    lang = l;
    win.__webllmLang = l;   /* loader reads this for translated progress strings */

    /* Sync lang-pill buttons */
    var i;
    for (i = 0; i < $langBtns.length; i++) {
      toggleClass($langBtns[i], 'active', $langBtns[i].getAttribute('data-lang') === l);
    }

    /* Input placeholder + aria */
    if ($input) {
      $input.placeholder = s('placeholder');
      setAttr($input, 'aria-label', s('ariaMsg'));
    }
    if ($send) setAttr($send, 'aria-label', s('ariaSend'));

    /* Greeting bubble — re-render rich HTML in new language */
    if (greetBubble && win.GREETINGS) {
      greetBubble.innerHTML = renderMsgContent(win.GREETINGS[l]);
    }

    /* Disclaimer */
    if ($disc) $disc.innerHTML = escapeHtml(s('disclaimer'));

    /* Loader label — only if loader hasn't started (it owns the label once started) */
    if ($loaderLbl && !win.__webllmStarted) {
      $loaderLbl.textContent = s('loaderInit');
    }

    renderSuggestions();
    setAvatarState('online');
    clearPrediction();
    if (win.VoiceController) win.VoiceController.setLang(l);
  }

  /* Bind lang buttons */
  (function () {
    for (var i = 0; i < $langBtns.length; i++) {
      (function (btn) {
        on(btn, 'click', function () { applyLang(btn.getAttribute('data-lang') || 'pt'); });
      }($langBtns[i]));
    }
  }());

  /* ════════════════════════════════════════════════════════════════════════
     SUGGESTIONS (chips)
  ════════════════════════════════════════════════════════════════════════ */
  function renderSuggestions() {
    if (!$suggs) return;
    $suggs.innerHTML = '';
    var suggs = win.SUGGESTIONS && win.SUGGESTIONS[lang];
    if (!suggs) return;
    for (var i = 0; i < suggs.length; i++) {
      (function (item) {
        var b = doc.createElement('button');
        b.className = 'sug-chip';
        b.innerHTML = item.label;
        on(b, 'click', function () { sendChip(item.label, item.key); });
        $suggs.appendChild(b);
      }(suggs[i]));
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     MESSAGE RENDERING
  ════════════════════════════════════════════════════════════════════════ */
  var SENDER = {
    user: { pt: 'Você', en: 'You',         es: 'Tú'         },
    bot:  { pt: 'Eduardo.AI', en: 'Eduardo.AI', es: 'Eduardo.AI' }
  };

  /**
   * renderMsgContent — converts safe markup to HTML.
   * [[url|label]] → <a>  |  **text** → <strong>  |  \n → <br>
   * Everything is escaped first so there is no injection path.
   */
  function renderMsgContent(text) {
    if (!text) return '';
    var links = [];
    var PH = '\x00L';
    var processed = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, function (_, url, label) {
      var safe = /^(https?:|mailto:)/.test(url.trim()) ? url.trim() : '#';
      links.push({ url: safe, label: label });
      return PH + (links.length - 1) + '\x00';
    });
    processed = escapeHtml(processed);
    processed = processed.replace(
      new RegExp(escapeHtml(PH) + '(\\d+)' + escapeHtml('\x00'), 'g'),
      function (_, idx) {
        var lk = links[parseInt(idx, 10)];
        if (!lk) return '';
        var tgt = lk.url.indexOf('mailto:') === 0 ? '' : ' target="_blank" rel="noopener noreferrer"';
        return '<a href="' + lk.url + '"' + tgt + ' class="msg-link">' + escapeHtml(lk.label) + '</a>';
      }
    );
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\n/g, '<br>');
    return processed;
  }

  function appendMsg(text, role, isError) {
    var wrap = doc.createElement('div');
    wrap.className = 'msg ' + role;

    var lbl = doc.createElement('div');
    lbl.className = 'msg-sender';
    lbl.innerHTML = escapeHtml((SENDER[role] && SENDER[role][lang]) || role);

    var bub = doc.createElement('div');
    bub.className = 'msg-bubble' + (isError ? ' error' : '');
    bub.innerHTML = (role === 'bot' && !isError) ? renderMsgContent(text) : escapeHtml(text);

    wrap.appendChild(lbl);
    wrap.appendChild(bub);
    if ($msgs) $msgs.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  function showTyping() {
    var wrap = doc.createElement('div');
    wrap.className = 'msg bot';
    wrap.id = 'typing-wrap';
    var lbl = doc.createElement('div');
    lbl.className = 'msg-sender';
    lbl.innerHTML = escapeHtml((SENDER.bot && SENDER.bot[lang]) || 'Eduardo.AI');
    var bub = doc.createElement('div');
    bub.className = 'typing-bubble';
    bub.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(lbl);
    wrap.appendChild(bub);
    if ($msgs) $msgs.appendChild(wrap);
    scrollBottom();
  }

  function removeTyping() {
    var el = doc.getElementById('typing-wrap');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function scrollBottom() {
    if ($wrap) $wrap.scrollTop = $wrap.scrollHeight;
  }

  /* ════════════════════════════════════════════════════════════════════════
     SEND BUTTON  (send icon ↔ stop icon swap)
  ════════════════════════════════════════════════════════════════════════ */
  function setSendState(st) {
    if (!$send) return;
    if (st === 'stop') {
      addClass($send, 'is-stopping');
      $send.disabled = false;
      if ($sendIcon) $sendIcon.style.display = 'none';
      if ($stopIcon) $stopIcon.style.display = '';
      setAttr($send, 'aria-label', s('ariaStop'));
    } else {
      removeClass($send, 'is-stopping');
      $send.disabled = (st === 'disabled');
      if ($sendIcon) $sendIcon.style.display = '';
      if ($stopIcon) $stopIcon.style.display = 'none';
      setAttr($send, 'aria-label', s('ariaSend'));
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     TALK ANIMATION
  ════════════════════════════════════════════════════════════════════════ */
  function talkAnim(replyLen) {
    var dur = Math.min(Math.max(replyLen * 40, 1800), 7000);
    if (talkTimer) clearTimeout(talkTimer);
    setAvatarState('thinking');
    talkTimer = later(function () {
      syncEngine();
      setAvatarState(engine ? 'online' : 'fallback');
    }, dur);
  }

  /* ════════════════════════════════════════════════════════════════════════
     ENGINE SYNC
     Always reads the latest value of window.__webllmReady before deciding
     whether to use AI or keyword mode. Called in the hot path of every send.
  ════════════════════════════════════════════════════════════════════════ */
  function syncEngine() {
    if (!engine && win.__webllmReady) engine = win.__webllmReady;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TYPE-AHEAD PREDICTION
     Shows ghost completion text as the user types.
     Scores suggestion labels against the current input value.
  ════════════════════════════════════════════════════════════════════════ */
  function predScore(input, candidate) {
    if (!input) return 0;
    var inp  = input.toLowerCase();
    var cand = candidate.toLowerCase();
    if (cand.indexOf(inp) === 0) return 100;
    var words = cand.split(/\s+/);
    for (var w = 0; w < words.length; w++) {
      if (words[w].indexOf(inp) === 0) return 80;
    }
    var map = win.KEYWORD_MAP && win.KEYWORD_MAP[lang];
    if (map) {
      var keys = Object.keys(map);
      for (var k = 0; k < keys.length; k++) {
        if (map[keys[k]].test(inp)) {
          var suggs = win.SUGGESTIONS && win.SUGGESTIONS[lang];
          if (suggs) {
            for (var ss = 0; ss < suggs.length; ss++) {
              if (suggs[ss].key === keys[k]) return 60;
            }
          }
        }
      }
    }
    if (cand.indexOf(inp) >= 0) return 40;
    return 0;
  }

  function bestPrediction(input) {
    if (!input || input.length < 2) return '';
    var suggs = win.SUGGESTIONS && win.SUGGESTIONS[lang];
    if (!suggs) return '';
    var best = null, bestScore = 0;
    for (var i = 0; i < suggs.length; i++) {
      var sc = predScore(input, suggs[i].label);
      if (sc > bestScore) { bestScore = sc; best = suggs[i].label; }
    }
    if (bestScore >= 40 && best) {
      var lo = best.toLowerCase();
      var inp = input.toLowerCase();
      if (lo.indexOf(inp) === 0 && best.length > input.length) return best.slice(input.length);
      if (bestScore >= 60) return ' → ' + best;
    }
    return '';
  }

  function showPrediction(suffix) {
    currentPrediction = suffix;
    if ($ghost) {
      $ghost.innerHTML = suffix ? escapeHtml(suffix) : '';
      toggleClass($ghost, 'visible', !!suffix);
    }
  }

  function clearPrediction() {
    currentPrediction = '';
    if ($ghost) { $ghost.innerHTML = ''; removeClass($ghost, 'visible'); }
  }

  function onInputChange() {
    if (predictTimer) clearTimeout(predictTimer);
    predictTimer = later(function () {
      showPrediction(bestPrediction($input ? $input.value : ''));
    }, PREDICT_DEBOUNCE);
  }

  function onInputKey(e) {
    var key     = e.key || e.keyCode;
    var isTab   = (key === 'Tab'        || key === 9);
    var isRight = (key === 'ArrowRight' || key === 39);
    var isEnter = (key === 'Enter'      || key === 13);

    if (isEnter && !e.shiftKey) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      sendFreeText();
      return;
    }

    if (currentPrediction && (isTab || isRight)) {
      var atEnd = !$input ||
        (typeof $input.selectionEnd !== 'undefined'
          ? $input.selectionEnd >= $input.value.length
          : true);
      if (isTab || (isRight && atEnd)) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if ($input) {
          $input.value = currentPrediction.indexOf(' → ') === 0
            ? currentPrediction.slice(3)
            : $input.value + currentPrediction;
        }
        clearPrediction();
      }
    }
  }

  if ($input) {
    on($input, 'input',   onInputChange);
    on($input, 'keyup',   onInputChange);  /* IE fallback */
    on($input, 'keydown', onInputKey);
    on($input, 'blur',    clearPrediction);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SEND — CHIP CLICK
     Chips always use the instant cached answer — no engine involved.
     This keeps chip responses at zero latency regardless of AI state.
  ════════════════════════════════════════════════════════════════════════ */
  function sendChip(label, key) {
    if (busy) return;
    clearPrediction();
    appendMsg(label, 'user');
    var cache = win.ANSWER_CACHE && win.ANSWER_CACHE[lang];
    var reply = (cache && cache[key]) || (win.getAnswer ? win.getAnswer(key, lang) : '');
    nextPaint(function () {
      appendMsg(reply, 'bot');
      talkAnim(reply.length);
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     SEND — FREE TEXT
     Decision tree:
       1. Stop button pressed while busy → cancel, reset
       2. Keyword match found → instant keyword answer (even if AI loaded)
          Rationale: questions about Eduardo should always use the curated
          answer, not a potentially hallucinated AI response.
       3. DB learned cache hit → return cached AI answer instantly
       4. Engine loaded → send to WebLLM
       5. Engine not loaded (still downloading or failed) → keyword fallback
          Do NOT wait — give an answer now using keyword/unknown reply.
  ════════════════════════════════════════════════════════════════════════ */
  function sendFreeText() {
    if (!$input) return;

    /* Stop */
    if (busy) {
      stopRequested = true;
      setSendState('send');
      removeTyping();
      syncEngine();
      setAvatarState(engine ? 'online' : 'fallback');
      busy = false;
      return;
    }

    var text = $input.value.trim();
    if (!text) return;

    $input.value = '';
    clearPrediction();
    busy = true;
    stopRequested = false;
    syncEngine(); /* pick up engine if it just finished loading */

    appendMsg(text, 'user');
    showTyping();
    setAvatarState('thinking');
    setSendState('stop');

    /* Step 1: keyword match → instant curated answer */
    var keyHit     = win.keywordLookup ? win.keywordLookup(text, lang) : 'unknown';
    var isKnownKey = (keyHit !== 'unknown' && keyHit !== 'default');

    if (isKnownKey) {
      resolveKeyword(keyHit);
      return;
    }

    /* Step 2: DB learned cache */
    if (win.DB) {
      win.DB.getLearned(text, lang, function (cached) {
        if (stopRequested) { finish(); return; }
        if (cached) {
          removeTyping();
          appendMsg(cached, 'bot');
          talkAnim(cached.length);
          finish();
        } else {
          routeToEngine(text);
        }
      });
    } else {
      routeToEngine(text);
    }
  }

  /* Resolve a known keyword key via DB or cache */
  function resolveKeyword(key) {
    if (win.DB) {
      win.DB.getDefault(key, lang, function (cached) {
        var reply = cached
          || (win.ANSWER_CACHE && win.ANSWER_CACHE[lang] && win.ANSWER_CACHE[lang][key])
          || (win.getAnswer ? win.getAnswer(key, lang) : '');
        removeTyping();
        appendMsg(reply, 'bot');
        talkAnim(reply.length);
        finish();
      });
    } else {
      var reply = win.getAnswer ? win.getAnswer(key, lang) : '';
      removeTyping();
      appendMsg(reply, 'bot');
      talkAnim(reply.length);
      finish();
    }
  }

  /* Route to WebLLM if available, otherwise keyword fallback immediately */
  function routeToEngine(text) {
    syncEngine();

    if (engine) {
      sendViaWebLLM(text);
      return;
    }

    /* Engine not ready (downloading or permanently failed) →
       use keyword/unknown reply right now — don't make user wait */
    useKeywordFallback(text);
  }

  /* Keyword/unknown fallback for free text */
  function useKeywordFallback(text) {
    if (stopRequested) { finish(); return; }
    removeTyping();
    var key   = win.keywordLookup ? win.keywordLookup(text, lang) : 'unknown';
    var cache = win.ANSWER_CACHE && win.ANSWER_CACHE[lang];
    var reply = (cache && cache[key]) || (win.getAnswer ? win.getAnswer(key, lang) : '');
    appendMsg(reply, 'bot');
    talkAnim(reply.length);
    finish();
  }

  /* WebLLM send */
  function sendViaWebLLM(text) {
    var sys = win.buildSystemPrompt ? win.buildSystemPrompt(lang) : '';
    engine.chat.completions.create({
      messages:    [{ role: 'system', content: sys }, { role: 'user', content: text }],
      max_tokens:  MAX_TOKENS,
      temperature: 0.6,
      top_p:       0.9,
      stream:      false
    }).then(function (res) {
      if (stopRequested) { finish(); return; }
      var reply = (res.choices[0].message.content || '').trim();
      if (win.console) win.console.info('[WebLLM] reply:', reply.slice(0, 120));
      removeTyping();
      appendMsg(reply, 'bot');
      talkAnim(reply.length);
      if (win.DB) win.DB.saveLearned(text, lang, reply);
      finish();
    }).catch(function (err) {
      if (stopRequested) { finish(); return; }
      if (win.console) win.console.error('[WebLLM] error:', err);
      removeTyping();
      setAvatarState('error');
      appendMsg(s('errWebLLM'), 'bot', true);
      finish();
    });
  }

  function finish() {
    setSendState('send');
    busy = false;
  }

  /* ════════════════════════════════════════════════════════════════════════
     WEBLLM POLLER
     Polls window.__webllmReady / __webllmFailed in the background.
     When the engine becomes ready, hides the loader and upgrades status.
     When failure is confirmed, activates fallback mode.
     The user can always chat during this entire process.
  ════════════════════════════════════════════════════════════════════════ */
  function startWebLLMPoller() {
    var polls = 0;
    var MAX   = 3000;  /* 3000 × 400ms = 20 min absolute ceiling */

    function poll() {
      polls++;
      syncEngine();

      /* Engine loaded ✓ */
      if (engine) {
        hideLoader();
        setAvatarState('online');
        if (win.console) win.console.info('[Chat] WebLLM engine active after', polls, 'polls');
        return;
      }

      /* Failure confirmed */
      if (win.__webllmFailed && polls >= FAIL_MIN_POLLS) {
        onWebLLMFailed(win.__webllmFailed);
        return;
      }

      /* Absolute ceiling */
      if (polls >= MAX) {
        onWebLLMFailed('poll-ceiling');
        return;
      }

      later(poll, POLL_INTERVAL);
    }

    later(poll, POLL_INTERVAL);
  }

  function onWebLLMFailed(reason) {
    if (win.console) win.console.info('[Chat] WebLLM not available:', reason);
    /* Keep whatever error message the loader wrote in the label for 2s,
       then hide the loader bar and switch to fallback status dot. */
    later(function () {
      hideLoader();
      setAvatarState('fallback');
    }, 2000);
  }

  /* ════════════════════════════════════════════════════════════════════════
     GREETING
  ════════════════════════════════════════════════════════════════════════ */
  function showGreeting() {
    var text = (win.GREETINGS && win.GREETINGS[lang]) || '';
    var wrap = appendMsg(text, 'bot');
    var bubs = wrap.getElementsByClassName('msg-bubble');
    greetBubble = bubs.length ? bubs[0] : null;
    talkAnim(text.length);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SEND BUTTON — bind
  ════════════════════════════════════════════════════════════════════════ */
  on($send, 'click', function () { sendFreeText(); });
  win.chatSend = sendFreeText;  /* voice.js calls this after transcription */

  /* ════════════════════════════════════════════════════════════════════════
     BOOT
  ════════════════════════════════════════════════════════════════════════ */
  function boot() {
    /* Expose language to webllm-loader.js before it fires any progress */
    win.__webllmLang = lang;

    /* Initial disclaimer */
    if ($disc) $disc.innerHTML = escapeHtml(s('disclaimer'));

    /* Loader label — only set if the loader module hasn't started yet.
       If __webllmStarted is already true, the loader owns the label. */
    if ($loaderLbl && !win.__webllmStarted) {
      $loaderLbl.textContent = s('loaderInit');
    }

    /* Enable input immediately — keyboard mode is always available */
    if ($input) $input.disabled = false;
    setSendState('send');

    setAvatarState('loading');
    renderSuggestions();
    showGreeting();

    /* Start background WebLLM poller */
    startWebLLMPoller();
  }

  /* Guard: boot exactly once */
  var booted = false;
  function bootOnce() {
    if (booted) return;
    booted = true;
    boot();
  }

  if (doc.readyState === 'complete' || doc.readyState === 'loaded' || doc.readyState === 'interactive') {
    bootOnce();
  } else {
    if (doc.addEventListener) doc.addEventListener('DOMContentLoaded', bootOnce, false);
    on(win, 'load', bootOnce);
  }

}(window, document));
