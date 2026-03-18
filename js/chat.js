/*
 * chat.js — Eduardo.AI  (patched)
 *
 * Patch summary vs original:
 *   resolveKeyword() — now reads ANSWER_CACHE directly instead of going
 *   through DB.getDefault, which had a race condition where db.js could
 *   open before knowledge.js finished seeding the GK keys into ANSWER_CACHE.
 *   All other logic is identical to the original.
 */
(function (win, doc) {
  'use strict';

  /* ════════════════════════════════════════════════════════════════════════
     CONFIG
  ════════════════════════════════════════════════════════════════════════ */
  var MAX_TOKENS         = 300;
  var PREDICT_DEBOUNCE   = 80;
  var POLL_INTERVAL      = 400;
  var FAIL_MIN_POLLS     = 8;

  /* ════════════════════════════════════════════════════════════════════════
     STATE
  ════════════════════════════════════════════════════════════════════════ */
  var lang             = 'pt';
  var engine           = null;
  var busy             = false;
  var stopRequested    = false;
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
     UI STRINGS
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
  ════════════════════════════════════════════════════════════════════════ */
  win.__webllmProgress = function (pct) {
    if ($fill) $fill.style.width = Math.min(100, pct) + '%';
  };

  function hideLoader() { addClass($loader, 'hidden'); }

  /* ════════════════════════════════════════════════════════════════════════
     LANGUAGE
  ════════════════════════════════════════════════════════════════════════ */
  function applyLang(l) {
    lang = l;
    win.__webllmLang = l;

    var i;
    for (i = 0; i < $langBtns.length; i++) {
      toggleClass($langBtns[i], 'active', $langBtns[i].getAttribute('data-lang') === l);
    }

    if ($input) {
      $input.placeholder = s('placeholder');
      setAttr($input, 'aria-label', s('ariaMsg'));
    }
    if ($send) setAttr($send, 'aria-label', s('ariaSend'));

    if (greetBubble && win.GREETINGS) {
      greetBubble.innerHTML = renderMsgContent(win.GREETINGS[l]);
    }

    if ($disc) $disc.innerHTML = escapeHtml(s('disclaimer'));

    if ($loaderLbl && !win.__webllmStarted) {
      $loaderLbl.textContent = s('loaderInit');
    }

    renderSuggestions();
    setAvatarState('online');
    clearPrediction();
    if (win.VoiceController) win.VoiceController.setLang(l);
  }

  (function () {
    for (var i = 0; i < $langBtns.length; i++) {
      (function (btn) {
        on(btn, 'click', function () { applyLang(btn.getAttribute('data-lang') || 'pt'); });
      }($langBtns[i]));
    }
  }());

  /* ════════════════════════════════════════════════════════════════════════
     SUGGESTIONS
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

  /* TUI timestamp */
  function nowHHMMSS() {
    var d = new Date();
    return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);
  }

  function appendMsg(text, role, isError) {
    var wrap = doc.createElement('div');
    wrap.className = 'msg ' + role;

    var time = doc.createElement('span');
    time.className = 'msg-time';
    time.textContent = nowHHMMSS();

    var sep = doc.createElement('span');
    sep.className = 'msg-sep';
    sep.textContent = '\u00a0-\u00a0';

    var lbl = doc.createElement('span');
    lbl.className = 'msg-sender';
    lbl.textContent = (SENDER[role] && SENDER[role][lang]) || role;

    var colon = doc.createElement('span');
    colon.className = 'msg-colon';
    colon.textContent = ':\u00a0';

    var bub = doc.createElement('span');
    bub.className = 'msg-bubble' + (isError ? ' error' : '');
    bub.innerHTML = (role === 'bot' && !isError) ? renderMsgContent(text) : escapeHtml(text);

    wrap.appendChild(time);
    wrap.appendChild(sep);
    wrap.appendChild(lbl);
    wrap.appendChild(colon);
    wrap.appendChild(bub);
    if ($msgs) $msgs.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  function showTyping() {
    var wrap = doc.createElement('div');
    wrap.className = 'msg bot';
    wrap.id = 'typing-wrap';
    var time = doc.createElement('span');
    time.className = 'msg-time';
    time.textContent = nowHHMMSS();
    var sep = doc.createElement('span');
    sep.className = 'msg-sep';
    sep.textContent = '\u00a0-\u00a0';
    var bub = doc.createElement('span');
    bub.className = 'typing-bubble';
    bub.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(time);
    wrap.appendChild(sep);
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
     SEND BUTTON
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
  ════════════════════════════════════════════════════════════════════════ */
  function syncEngine() {
    if (!engine && win.__webllmReady) engine = win.__webllmReady;
  }

  /* ════════════════════════════════════════════════════════════════════════
     TYPE-AHEAD PREDICTION
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
    on($input, 'keyup',   onInputChange);
    on($input, 'keydown', onInputKey);
    on($input, 'blur',    clearPrediction);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SEND — CHIP CLICK
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
  ════════════════════════════════════════════════════════════════════════ */
  function sendFreeText() {
    if (!$input) return;

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
    syncEngine();

    appendMsg(text, 'user');
    showTyping();
    setAvatarState('thinking');
    setSendState('stop');

    var keyHit     = win.keywordLookup ? win.keywordLookup(text, lang) : 'unknown';
    var isKnownKey = (keyHit !== 'unknown' && keyHit !== 'default');

    if (isKnownKey) {
      resolveKeyword(keyHit);
      return;
    }

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

  /* ── PATCHED resolveKeyword ──────────────────────────────────────────────
   * Original went to DB.getDefault first, which caused a race condition:
   * db.js could open before knowledge.js finished seeding GK keys into
   * ANSWER_CACHE, so any GK key (python, docker, etc.) would return null
   * from the DB and fall through to the 'unknown' answer.
   *
   * Fix: read ANSWER_CACHE directly — it's always synchronously populated
   * by knowledge.js before any user interaction can happen. Only fall back
   * to DB.getDefault if ANSWER_CACHE doesn't have the key (for safety),
   * then fall through to getAnswer as the final guaranteed source.
   * ──────────────────────────────────────────────────────────────────────── */
  function resolveKeyword(key) {
    /* 1. ANSWER_CACHE — synchronous, always populated, covers all GK keys */
    var cache = win.ANSWER_CACHE && win.ANSWER_CACHE[lang];
    if (cache && cache[key]) {
      removeTyping();
      appendMsg(cache[key], 'bot');
      talkAnim(cache[key].length);
      finish();
      return;
    }

    /* 2. getAnswer — direct lookup into _A / _GK (also synchronous) */
    if (win.getAnswer) {
      var direct = win.getAnswer(key, lang);
      if (direct) {
        removeTyping();
        appendMsg(direct, 'bot');
        talkAnim(direct.length);
        finish();
        return;
      }
    }

    /* 3. DB fallback — for any edge case where the above both miss */
    if (win.DB) {
      win.DB.getDefault(key, lang, function (cached) {
        var reply = cached || (win.getAnswer ? win.getAnswer('unknown', lang) : '');
        removeTyping();
        appendMsg(reply, 'bot');
        talkAnim(reply.length);
        finish();
      });
    } else {
      var reply = win.getAnswer ? win.getAnswer('unknown', lang) : '';
      removeTyping();
      appendMsg(reply, 'bot');
      talkAnim(reply.length);
      finish();
    }
  }

  function routeToEngine(text) {
    syncEngine();
    if (engine) {
      sendViaWebLLM(text);
      return;
    }
    useKeywordFallback(text);
  }

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
  ════════════════════════════════════════════════════════════════════════ */
  function startWebLLMPoller() {
    var polls = 0;
    var MAX   = 3000;

    function poll() {
      polls++;
      syncEngine();

      if (engine) {
        hideLoader();
        setAvatarState('online');
        if (win.console) win.console.info('[Chat] WebLLM engine active after', polls, 'polls');
        return;
      }

      if (win.__webllmFailed && polls >= FAIL_MIN_POLLS) {
        onWebLLMFailed(win.__webllmFailed);
        return;
      }

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
     SEND BUTTON
  ════════════════════════════════════════════════════════════════════════ */
  on($send, 'click', function () { sendFreeText(); });
  win.chatSend = sendFreeText;

  /* ════════════════════════════════════════════════════════════════════════
     BOOT
  ════════════════════════════════════════════════════════════════════════ */
  function boot() {
    win.__webllmLang = lang;

    if ($disc) $disc.innerHTML = escapeHtml(s('disclaimer'));

    if ($loaderLbl && !win.__webllmStarted) {
      $loaderLbl.textContent = s('loaderInit');
    }

    if ($input) $input.disabled = false;
    setSendState('send');

    setAvatarState('loading');
    renderSuggestions();
    showGreeting();

    startWebLLMPoller();
  }

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
