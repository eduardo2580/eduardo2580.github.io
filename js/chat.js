/*
 * chat.js — Eduardo.AI
 * Written in ES5 for maximum browser compatibility (NetSurf, Firefox ESR, IE11).
 * No arrow functions. No const/let. No template literals. No async/await.
 *
 * Features:
 *  - Type-ahead prediction: ghost text in input as user types
 *  - Chip clicks: instant O(1) cached answer, no delay
 *  - Free text: WebLLM (if browser supports it) OR keyword fallback
 *  - Lang switch: greeting replaced in-place, history kept
 *  - WebLLM loaded in background; UI always usable via fallback
 *  - Full ES5 — works in NetSurf, old Firefox, IE11
 */
(function (win, doc) {
  'use strict';

  /* ════════════════════════════════════════════
     CONFIG
  ════════════════════════════════════════════ */
  var MAX_TOKENS = 200;
  var PREDICT_DEBOUNCE_MS = 80;

  /* ════════════════════════════════════════════
     STATE
  ════════════════════════════════════════════ */
  var lang           = 'pt';
  var busy           = false;
  var stopRequested  = false;   /* true when user clicks stop during WebLLM call */
  var talkTimer      = null;
  var engine         = null;
  var greetBubble    = null;
  var predictTimer   = null;
  var currentPrediction = '';

  /* ════════════════════════════════════════════
     DOM REFS — getElementById only (NetSurf safe)
  ════════════════════════════════════════════ */
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
  var $inputRow  = doc.getElementById('input-row');

  /* ════════════════════════════════════════════
     COMPAT HELPERS
  ════════════════════════════════════════════ */
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
    if (force === true)  { addClass(el, cls); return; }
    if (force === false) { removeClass(el, cls); return; }
    if (hasClass(el, cls)) { removeClass(el, cls); } else { addClass(el, cls); }
  }
  function setAttr(el, name, val) { if (el) el.setAttribute(name, val); }
  function addEvent(el, ev, fn) {
    if (!el) return;
    if (el.addEventListener) { el.addEventListener(ev, fn, false); }
    else if (el.attachEvent) { el.attachEvent('on' + ev, fn); }
  }
  function later(fn, ms) { return setTimeout(fn, ms || 0); }
  function nextPaint(fn) {
    if (win.requestAnimationFrame) { win.requestAnimationFrame(fn); }
    else { later(fn, 16); }
  }

  /* ════════════════════════════════════════════
     SEND BUTTON STATE  (send ↔ stop swap)
  ════════════════════════════════════════════ */
  function setSendState(state) {
    if (!$send) return;
    if (state === 'stop') {
      addClass($send, 'is-stopping');
      $send.disabled = false;
      if ($sendIcon) $sendIcon.style.display = 'none';
      if ($stopIcon) $stopIcon.style.display = '';
      setAttr($send, 'aria-label', UI_STRINGS ? (UI_STRINGS.ariaStop[lang] || 'Stop') : 'Stop');
    } else if (state === 'disabled') {
      removeClass($send, 'is-stopping');
      $send.disabled = true;
      if ($sendIcon) $sendIcon.style.display = '';
      if ($stopIcon) $stopIcon.style.display = 'none';
      setAttr($send, 'aria-label', UI_STRINGS ? (UI_STRINGS.ariaSend[lang] || 'Send') : 'Send');
    } else {
      removeClass($send, 'is-stopping');
      $send.disabled = false;
      if ($sendIcon) $sendIcon.style.display = '';
      if ($stopIcon) $stopIcon.style.display = 'none';
      setAttr($send, 'aria-label', UI_STRINGS ? (UI_STRINGS.ariaSend[lang] || 'Send') : 'Send');
    }
  }

  /* ════════════════════════════════════════════
     WEAK ANSWER DETECTION
     Returns true if the WebLLM reply is low quality /
     a refusal / too short to be useful.
  ════════════════════════════════════════════ */
  var WEAK_PATTERNS = [
    /^i (don'?t|cannot|can'?t|won'?t|am not able to|am unable to)/i,
    /^(eu )?(não (sei|consigo|posso)|não tenho|desculpe, não)/i,
    /^(lo siento|no (sé|puedo|tengo))/i,
    /^(sorry|i'?m sorry)[,.]?\s*(i (don'?t|can'?t|cannot|won'?t))/i,
    /^(as an ai|como (uma? )?ia|como asistente)/i,
    /^\s*[\.\-\…]+\s*$/,          /* just dots/dashes */
    /^(hmm|uh|um|err)[,.]?\s*$/i  /* filler non-answers */
  ];

  function isWeakAnswer(reply) {
    if (!reply || reply.trim().length < 12) return true;
    var r = reply.trim();
    for (var i = 0; i < WEAK_PATTERNS.length; i++) {
      if (WEAK_PATTERNS[i].test(r)) return true;
    }
    return false;
  }

  /* ════════════════════════════════════════════
     LANGUAGE
  ════════════════════════════════════════════ */
  var PLACEHOLDERS = { pt:'Enviar mensagem…', en:'Send a message…', es:'Enviar mensaje…' };

  /* All static UI strings that change with language */
  var UI_STRINGS = {
    loaderLabel:   { pt:'Carregando IA local…',    en:'Loading local AI…',       es:'Cargando IA local…'       },
    fallbackLabel: { pt:'Modo teclado ativo',       en:'Keyword mode active',     es:'Modo teclado activo'      },
    disclaimer:    { pt:'Eduardo.AI pode cometer erros. Verifique as respostas.',
                     en:'Eduardo.AI can make mistakes. Please double-check responses.',
                     es:'Eduardo.AI puede cometer errores. Verifique las respuestas.' },
    ariaMsg:       { pt:'Mensagem',                 en:'Message',                 es:'Mensaje'                  },
    ariaSend:      { pt:'Enviar',                   en:'Send',                    es:'Enviar'                   },
    ariaStop:      { pt:'Parar',                    en:'Stop',                    es:'Detener'                  }
  };

  function setLang(l) {
    lang = l;
    var i, b;
    for (i = 0; i < $langBtns.length; i++) {
      b = $langBtns[i];
      var bLang = b.getAttribute('data-lang');
      toggleClass(b, 'active', bLang === l);
    }
    if ($input) {
      $input.placeholder = PLACEHOLDERS[l] || PLACEHOLDERS.pt;
      setAttr($input, 'aria-label', UI_STRINGS.ariaMsg[l]);
    }
    if ($send) setAttr($send, 'aria-label', UI_STRINGS.ariaSend[l]);

    /* Replace greeting text in-place — re-render rich HTML */
    if (greetBubble && win.GREETINGS) {
      greetBubble.innerHTML = renderMsgContent(win.GREETINGS[l]);
    }

    /* Translate loader label (if still visible) */
    if ($loaderLbl) {
      var loaderTxt = $loaderLbl.innerHTML;
      /* only update if it still shows the initial label, not a progress message */
      if (loaderTxt === UI_STRINGS.loaderLabel.pt ||
          loaderTxt === UI_STRINGS.loaderLabel.en ||
          loaderTxt === UI_STRINGS.loaderLabel.es) {
        $loaderLbl.innerHTML = escapeHtml(UI_STRINGS.loaderLabel[l]);
      }
    }

    /* Translate disclaimer */
    var $disc = doc.getElementById('disclaimer');
    if ($disc) $disc.innerHTML = escapeHtml(UI_STRINGS.disclaimer[l]);

    renderSuggestions();
    setAvatarState('online');
    clearPrediction();
    /* Sync voice recognition language */
    if (win.VoiceController) win.VoiceController.setLang(l);
  }

  /* bind lang buttons */
  (function () {
    for (var i = 0; i < $langBtns.length; i++) {
      (function (btn) {
        addEvent(btn, 'click', function () {
          setLang(btn.getAttribute('data-lang') || 'pt');
        });
      }($langBtns[i]));
    }
  }());

  /* ════════════════════════════════════════════
     SUGGESTIONS
  ════════════════════════════════════════════ */
  function renderSuggestions() {
    if (!$suggs) return;
    $suggs.innerHTML = '';
    var suggs = win.SUGGESTIONS && win.SUGGESTIONS[lang];
    if (!suggs) return;
    for (var i = 0; i < suggs.length; i++) {
      (function (item) {
        var b = doc.createElement('button');
        b.className   = 'sug-chip';
        b.innerHTML   = item.label;   /* innerHTML for broader compat */
        addEvent(b, 'click', function () { sendInstant(item.label, item.key); });
        $suggs.appendChild(b);
      }(suggs[i]));
    }
  }

  /* ════════════════════════════════════════════
     TYPE-AHEAD PREDICTION
     Shows ghost/completion text as user types.
     Scores each suggestion label + answer key
     against current input, picks best match.
  ════════════════════════════════════════════ */

  /* score: how well does `input` match `candidate` */
  function predScore(input, candidate) {
    if (!input) return 0;
    var inp  = input.toLowerCase();
    var cand = candidate.toLowerCase();

    /* exact prefix of label */
    if (cand.indexOf(inp) === 0) return 100;

    /* word inside label starts with input */
    var words = cand.split(/\s+/);
    for (var w = 0; w < words.length; w++) {
      if (words[w].indexOf(inp) === 0) return 80;
    }

    /* keyword regex match */
    var map = win.KEYWORD_MAP && win.KEYWORD_MAP[lang];
    if (map) {
      var entries = Object.keys(map);
      for (var e = 0; e < entries.length; e++) {
        var key = entries[e];
        if (map[key].test(inp)) {
          /* find the suggestion whose key matches */
          var suggs = win.SUGGESTIONS && win.SUGGESTIONS[lang];
          if (suggs) {
            for (var s = 0; s < suggs.length; s++) {
              if (suggs[s].key === key) return 60;
            }
          }
        }
      }
    }

    /* substring anywhere */
    if (cand.indexOf(inp) >= 0) return 40;

    return 0;
  }

  /* find best matching suggestion label for current input */
  function predictBestLabel(input) {
    if (!input || input.length < 2) return '';
    var suggs = win.SUGGESTIONS && win.SUGGESTIONS[lang];
    if (!suggs) return '';

    var best = null;
    var bestScore = 0;

    for (var i = 0; i < suggs.length; i++) {
      var sc = predScore(input, suggs[i].label);
      if (sc > bestScore) { bestScore = sc; best = suggs[i].label; }
    }

    /* Only show ghost if score good enough and label extends input */
    if (bestScore >= 40 && best) {
      var inp  = input.toLowerCase();
      var lo   = best.toLowerCase();
      /* ghost = the completion suffix after the user's typed chars */
      if (lo.indexOf(inp) === 0 && best.length > input.length) {
        return best.slice(input.length); /* suffix only */
      }
      /* input doesn't prefix the label — show full label as hint */
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
    if ($ghost) {
      $ghost.innerHTML = '';
      removeClass($ghost, 'visible');
    }
  }

  function onInputChange() {
    if (predictTimer) clearTimeout(predictTimer);
    predictTimer = later(function () {
      var val = $input ? $input.value : '';
      var suffix = predictBestLabel(val);
      showPrediction(suffix);
    }, PREDICT_DEBOUNCE_MS);
  }

  /* Accept prediction with Tab or ArrowRight at end of input */
  function onInputKey(e) {
    var key = e.key || e.keyCode;
    var isTab   = (key === 'Tab'        || key === 9);
    var isRight = (key === 'ArrowRight' || key === 39);
    var isEnter = (key === 'Enter'      || key === 13);

    if (isEnter && !e.shiftKey) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      send();
      return;
    }

    if (currentPrediction && (isTab || isRight)) {
      /* Tab: accept full completion */
      if (isTab) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        var ghost = currentPrediction;
        if (ghost.indexOf(' → ') === 0) {
          /* hint mode: replace full input with label */
          $input.value = ghost.slice(3);
        } else {
          /* suffix mode: append completion */
          $input.value = $input.value + ghost;
        }
        clearPrediction();
        return;
      }
      /* ArrowRight at end of field: same as Tab */
      if (isRight) {
        var pos  = typeof $input.selectionEnd !== 'undefined' ? $input.selectionEnd : $input.value.length;
        var len  = $input.value.length;
        if (pos >= len) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = false);
          if (currentPrediction.indexOf(' → ') === 0) {
            $input.value = currentPrediction.slice(3);
          } else {
            $input.value = $input.value + currentPrediction;
          }
          clearPrediction();
          return;
        }
      }
    }
  }

  if ($input) {
    addEvent($input, 'input',   onInputChange);
    addEvent($input, 'keyup',   onInputChange);    /* IE8 fallback */
    addEvent($input, 'keydown', onInputKey);
    addEvent($input, 'blur',    clearPrediction);
  }

  /* ════════════════════════════════════════════
     MESSAGE RENDERING
  ════════════════════════════════════════════ */
  var LABELS = {
    user: { pt:'Você', en:'You', es:'Tú' },
    bot:  { pt:'Eduardo.AI', en:'Eduardo.AI', es:'Eduardo.AI' }
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  /**
   * renderMsgContent(text)
   * Converts safe markup in answer strings to HTML:
   *   [[url|label]]  → styled <a> link
   *   **text**       → <strong>
   *   \n             → <br>
   * Everything else is escaped first so no injection is possible.
   */
  function renderMsgContent(text) {
    if (!text) return '';

    /* 1. Pull out [[url|label]] tokens before escaping so | and ] survive */
    var links = [];
    var placeholder = '\x00LINK';
    var processed = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, function(_, url, label) {
      /* Whitelist: only http/https/mailto URLs */
      var safeUrl = /^(https?:|mailto:)/.test(url.trim()) ? url.trim() : '#';
      links.push({ url: safeUrl, label: label });
      return placeholder + (links.length - 1) + '\x00';
    });

    /* 2. Escape everything else */
    processed = escapeHtml(processed);

    /* 3. Re-insert links as styled anchors */
    processed = processed.replace(new RegExp(escapeHtml(placeholder) + '(\\d+)' + escapeHtml('\x00'), 'g'), function(_, idx) {
      var link = links[parseInt(idx, 10)];
      if (!link) return '';
      var target = link.url.indexOf('mailto:') === 0 ? '' : ' target="_blank" rel="noopener noreferrer"';
      return '<a href="' + link.url + '"' + target + ' class="msg-link">' + escapeHtml(link.label) + '</a>';
    });

    /* 4. Bold: **text** */
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    /* 5. Newlines → <br> */
    processed = processed.replace(/\n/g, '<br>');

    return processed;
  }

  function appendMsg(text, role, isError) {
    var wrap = doc.createElement('div');
    wrap.className = 'msg ' + role;

    var lbl = doc.createElement('div');
    lbl.className = 'msg-sender';
    lbl.innerHTML = escapeHtml((LABELS[role] && LABELS[role][lang]) || role);

    var bub = doc.createElement('div');
    bub.className = 'msg-bubble' + (isError ? ' error' : '');
    /* Bot messages get rich rendering; user messages are always plain-escaped */
    bub.innerHTML = (role === 'bot' && !isError)
      ? renderMsgContent(text)
      : escapeHtml(text);

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
    lbl.innerHTML = escapeHtml((LABELS.bot && LABELS.bot[lang]) || 'Eduardo.AI');
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

  /* ════════════════════════════════════════════
     AVATAR / STATUS
  ════════════════════════════════════════════ */
  var STATUS_CFG = {
    loading:  { dot:'#facc15', txt:{ pt:'Carregando IA…', en:'Loading AI…',      es:'Cargando IA…'      }, talk:false },
    online:   { dot:'#34d399', txt:{ pt:'Online',         en:'Online',           es:'En línea'          }, talk:false },
    thinking: { dot:'#a78bfa', txt:{ pt:'Pensando…',      en:'Thinking…',        es:'Pensando…'         }, talk:true  },
    fallback: { dot:'#fb923c', txt:{ pt:'Modo teclado',   en:'Keyword mode',     es:'Modo teclado'      }, talk:false },
    error:    { dot:'#f87171', txt:{ pt:'Modo offline',   en:'Offline mode',     es:'Modo sin conexión' }, talk:false }
  };

  function setAvatarState(state) {
    var c = STATUS_CFG[state] || STATUS_CFG.online;
    setAttr($statusDot, 'fill', c.dot);
    if ($statusDot) $statusDot.style.fill = c.dot; /* also via style for SVG in FF */
    if ($status) $status.innerHTML = escapeHtml(c.txt[lang] || '');
    if (win.AvatarController) win.AvatarController.setTalking(c.talk);
    toggleClass($chatArea, 'ai-active', !!c.talk);
  }

  /* ════════════════════════════════════════════
     LOADER
  ════════════════════════════════════════════ */
  function setProgress(pct, label) {
    if ($fill)      $fill.style.width = Math.min(100, pct) + '%';
    if ($loaderLbl) $loaderLbl.innerHTML = escapeHtml(label || '');
  }

  function hideLoader() { addClass($loader, 'hidden'); }

  function enableInput() {
    if ($input) $input.disabled = false;
    setSendState('send');
  }

  /* ════════════════════════════════════════════
     INSTANT SEND (chip clicks — zero latency)
  ════════════════════════════════════════════ */
  function sendInstant(label, key) {
    if (busy) return;
    clearPrediction();

    appendMsg(label, 'user');

    /* answer from pre-warmed cache — synchronous */
    var cache  = win.ANSWER_CACHE && win.ANSWER_CACHE[lang];
    var reply  = (cache && cache[key]) || (win.getAnswer ? win.getAnswer(key, lang) : '');

    nextPaint(function () {
      appendMsg(reply, 'bot');
      talkAnim(reply.length);
    });
  }

  /* ════════════════════════════════════════════
     ASYNC SEND (free-text — WebLLM or keyword)
  ════════════════════════════════════════════ */
  function send() {
    if (!$input) return;

    /* ── Stop button clicked while thinking ── */
    if (busy) {
      stopRequested = true;
      setSendState('send');
      removeTyping();
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

    appendMsg(text, 'user');
    showTyping();
    setAvatarState('thinking');
    setSendState('stop');

    /* ── Check DB cache first (defaults + learned) ── */
    var keyHit = win.keywordLookup ? win.keywordLookup(text, lang) : 'unknown';
    var isKnownKey = (keyHit !== 'unknown' && keyHit !== 'default');

    if (isKnownKey) {
      win.DB ? win.DB.getDefault(keyHit, lang, function (cached) {
        var reply = cached || (win.ANSWER_CACHE && win.ANSWER_CACHE[lang] && win.ANSWER_CACHE[lang][keyHit])
                            || (win.getAnswer ? win.getAnswer(keyHit, lang) : '');
        removeTyping();
        appendMsg(reply, 'bot');
        talkAnim(reply.length);
        setSendState('send');
        busy = false;
      }) : (function () {
        var reply = win.getAnswer ? win.getAnswer(keyHit, lang) : '';
        removeTyping();
        appendMsg(reply, 'bot');
        talkAnim(reply.length);
        setSendState('send');
        busy = false;
      }());
      return;
    }

    /* ── Check learned cache ── */
    if (win.DB) {
      win.DB.getLearned(text, lang, function (cachedAnswer) {
        if (cachedAnswer) {
          removeTyping();
          appendMsg(cachedAnswer, 'bot');
          talkAnim(cachedAnswer.length);
          setSendState('send');
          busy = false;
        } else {
          dispatchToEngine(text);
        }
      });
    } else {
      dispatchToEngine(text);
    }
  }

  /* ── Route to WebLLM or keyword fallback ── */
  function dispatchToEngine(text) {
    if (engine) {
      sendViaWebLLM(text);
    } else {
      later(function () {
        if (stopRequested) { setSendState('send'); busy = false; return; }
        removeTyping();
        var key   = win.keywordLookup ? win.keywordLookup(text, lang) : 'unknown';
        var cache = win.ANSWER_CACHE && win.ANSWER_CACHE[lang];
        var reply = (cache && cache[key]) || (win.getAnswer ? win.getAnswer(key, lang) : '');
        appendMsg(reply, 'bot');
        talkAnim(reply.length);
        setSendState('send');
        busy = false;
      }, 180);
    }
  }

  function sendViaWebLLM(text) {
    var sys = win.buildSystemPrompt ? win.buildSystemPrompt(lang) : '';
    engine.chat.completions.create({
      messages:    [{ role:'system', content:sys }, { role:'user', content:text }],
      max_tokens:  MAX_TOKENS,
      temperature: 0.6,
      top_p:       0.9,
      stream:      false
    }).then(function (res) {
      /* Honour stop request — discard reply silently */
      if (stopRequested) { setSendState('send'); busy = false; return; }

      var reply = (res.choices[0].message.content || '').trim();
      removeTyping();

      /* ── Weak answer check ── */
      if (isWeakAnswer(reply)) {
        var fallback = win.getAnswer ? win.getAnswer('unknown', lang) : reply;
        appendMsg(fallback, 'bot');
        talkAnim(fallback.length);
        /* Do NOT save a weak answer to the learned DB */
      } else {
        appendMsg(reply, 'bot');
        talkAnim(reply.length);
        if (win.DB) win.DB.saveLearned(text, lang, reply);
      }

      setSendState('send');
      busy = false;
    }).catch(function (err) {
      if (stopRequested) { setSendState('send'); busy = false; return; }
      removeTyping();
      setAvatarState('error');
      var errMap = { pt:'⚠ Erro ao gerar resposta.', en:'⚠ Error generating response.', es:'⚠ Error al generar respuesta.' };
      appendMsg(errMap[lang] || errMap.pt, 'bot', true);
      setSendState('send');
      busy = false;
      if (win.console) win.console.error('[Chat WebLLM]', err);
    });
  }

  /* ════════════════════════════════════════════
     TALK ANIMATION
  ════════════════════════════════════════════ */
  function talkAnim(replyLen) {
    var dur = Math.min(Math.max(replyLen * 40, 1800), 7000);
    if (talkTimer) clearTimeout(talkTimer);
    setAvatarState('thinking');
    talkTimer = later(function () {
      setAvatarState(engine ? 'online' : 'fallback');
    }, dur);
  }

  /* ════════════════════════════════════════════
     WEBLLM — loaded by js/webllm-loader.js
     (<script type="module"> in index.html)

     Register __webllmProgress immediately (before boot)
     so no progress events are missed regardless of timing.
  ════════════════════════════════════════════ */
  var PROGRESS_LABELS = {
    checking: { pt:'Verificando WebGPU…',  en:'Checking WebGPU…',    es:'Verificando WebGPU…'  },
    loading:  { pt:'Carregando modelo… ',  en:'Loading model… ',     es:'Cargando modelo… '    }
  };

  /* Registered immediately — before boot() — so the module script
     never misses a progress event even if it fires very early */
  win.__webllmProgress = function (pct, text) {
    var label = (text && text.trim())
      ? text
      : PROGRESS_LABELS.loading[lang] + pct + '%';
    setProgress(pct, label);
  };

  function initWebLLM() {
    /* Poll every 300ms for up to 10 minutes.
       webllm-loader.js sets __webllmReady or __webllmFailed when done. */
    var attempts    = 0;
    var maxAttempts = 2000; /* 2000 × 300ms = 10 min */
    var lastPct     = 0;

    /* Show initial state only if loader hasn't already pushed a progress update */
    if (!win.__webllmStarted) {
      setProgress(5, PROGRESS_LABELS.checking[lang]);
    }

    function check() {
      attempts++;

      if (win.__webllmReady) {
        engine = win.__webllmReady;
        hideLoader();
        setAvatarState('online');
        return;
      }

      if (win.__webllmFailed) {
        activateFallback('loader: ' + win.__webllmFailed);
        return;
      }

      if (attempts >= maxAttempts) {
        activateFallback('poll-timeout');
        return;
      }

      later(check, 300);
    }

    later(check, 300);
  }

  function activateFallback(reason) {
    if (win.console) win.console.info('[Chat] Fallback active:', reason);
    setProgress(100, UI_STRINGS.fallbackLabel[lang] || UI_STRINGS.fallbackLabel.pt);
    later(function () { hideLoader(); setAvatarState('fallback'); }, 600);
  }

  /* ════════════════════════════════════════════
     GREETING
  ════════════════════════════════════════════ */
  function showGreeting() {
    var text = (win.GREETINGS && win.GREETINGS[lang]) || '';
    var wrap = appendMsg(text, 'bot');
    var bubs = wrap.getElementsByClassName('msg-bubble');
    greetBubble = bubs.length ? bubs[0] : null;
    talkAnim(text.length);
  }

  /* ════════════════════════════════════════════
     SEND BUTTON
  ════════════════════════════════════════════ */
  addEvent($send, 'click', function () { send(); });

  /* Expose send() globally so voice.js can trigger it after transcription */
  win.chatSend = send;

  /* ════════════════════════════════════════════
     BOOT
  ════════════════════════════════════════════ */
  function boot() {
    /* set initial translated loader label */
    if ($loaderLbl) $loaderLbl.innerHTML = escapeHtml(UI_STRINGS.loaderLabel[lang]);
    /* set initial disclaimer */
    var $disc = doc.getElementById('disclaimer');
    if ($disc) $disc.innerHTML = escapeHtml(UI_STRINGS.disclaimer[lang]);

    enableInput();
    setAvatarState('loading');
    renderSuggestions();
    showGreeting();
    initWebLLM();
  }

  /* Guard: only boot once regardless of which event fires first */
  var booted = false;
  function bootOnce() {
    if (booted) return;
    booted = true;
    boot();
  }

  if (doc.readyState === 'complete' || doc.readyState === 'loaded' || doc.readyState === 'interactive') {
    bootOnce();
  } else {
    if (doc.addEventListener) {
      doc.addEventListener('DOMContentLoaded', bootOnce, false);
    }
    addEvent(win, 'load', bootOnce);
  }

}(window, document));
