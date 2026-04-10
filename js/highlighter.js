/**
 * HIGHLIGHTER.JS  v4
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop-in script. Works on ANY page, on ANY text, with no markup requirements.
 *
 *  • Select any text  →  colour-picker pill appears just below the selection
 *  • Pick a colour    →  selection is wrapped in <mark data-hl-key="…">
 *  • Click any mark   →  widget re-opens; pick a new colour or hit ⌫ to erase
 *  • Erase button     →  removes that highlight and restores the original text
 *  • All highlights   →  persisted in localStorage, restored on every page load
 *  • Counter pill     →  bottom-left button; opens a panel of all saved highlights
 *
 * Install (add before </body>):
 *   <script src="highlighter.js"></script>
 *
 * Public API:
 *   Highlighter.open()    → open the highlights panel
 *   Highlighter.getAll()  → returns all stored entries (plain object)
 *   Highlighter.clear()   → wipe every highlight from DOM + storage
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function (root) {
  'use strict';

  /* ═══════════════════════════════════════
     CONFIG
  ═══════════════════════════════════════ */
  var SK = '_hl4_' + (location.pathname || 'p').replace(/\W+/g, '_');

  var COLORS = [
    { id: 'yellow', label: 'Amarelo', hex: '#fde047' },
    { id: 'gold',   label: 'Dourado', hex: '#c9a96e' },
    { id: 'rose',   label: 'Rosa',    hex: '#f472b6' },
    { id: 'green',  label: 'Verde',   hex: '#4ade80' },
    { id: 'sky',    label: 'Azul',    hex: '#60a5fa' },
    { id: 'purple', label: 'Roxo',    hex: '#c084fc' },
  ];

  var COLOR_BG = {
    yellow : 'rgba(253,224,71,.58)',
    gold   : 'rgba(201,169,110,.55)',
    rose   : 'rgba(244,114,182,.48)',
    green  : 'rgba(74,222,128,.46)',
    sky    : 'rgba(96,165,250,.48)',
    purple : 'rgba(192,132,252,.46)',
  };

  /* ═══════════════════════════════════════
     STORAGE
  ═══════════════════════════════════════ */
  function load()     { try { return JSON.parse(localStorage.getItem(SK) || '{}'); } catch(e) { return {}; } }
  function save(d)    { try { localStorage.setItem(SK, JSON.stringify(d)); } catch(e) {} }
  function setE(k,v)  { var d=load(); d[k]=v; save(d); }
  function delE(k)    { var d=load(); delete d[k]; save(d); }

  /* ═══════════════════════════════════════
     XPATH  –  stable node address
  ═══════════════════════════════════════ */
  function xpathOf(node) {
    if (node.nodeType === 3) node = node.parentNode;
    var parts = [];
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      var tag = node.tagName.toLowerCase();
      var idx = 1, sib = node.previousElementSibling;
      while (sib) { if (sib.tagName.toLowerCase() === tag) idx++; sib = sib.previousElementSibling; }
      parts.unshift(tag + '[' + idx + ']');
      node = node.parentNode;
    }
    return '//' + parts.join('/');
  }

  function resolveXPath(xp) {
    try {
      var r = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return r.singleNodeValue || null;
    } catch(e) { return null; }
  }

  /* walk the text-node offset within a given element */
  function textNodeAt(el, charOffset) {
    if (el.nodeType === 3) return { node: el, offset: charOffset };
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    var node, acc = 0;
    while ((node = walker.nextNode())) {
      var len = node.textContent.length;
      if (acc + len >= charOffset) return { node: node, offset: charOffset - acc };
      acc += len;
    }
    return null;
  }

  /* ═══════════════════════════════════════
     STYLES
  ═══════════════════════════════════════ */
  function injectStyles() {
    if (document.getElementById('_hl4css')) return;
    var css = '';

    /* marks */
    css += 'mark[data-hl-key]{border-radius:3px;padding:1px 2px;cursor:pointer;'
         + '-webkit-print-color-adjust:exact;print-color-adjust:exact;transition:filter .15s;}';
    css += 'mark[data-hl-key]:hover{filter:brightness(.78);}';
    COLORS.forEach(function(c) {
      css += 'mark[data-hl-c="'+c.id+'"]{background:'+COLOR_BG[c.id]+';color:inherit;}';
    });

    /* widget pill */
    css += '#_hl4w{'
         + 'position:fixed;z-index:2147483647;'
         + 'display:flex;align-items:center;gap:4px;'
         + 'background:#16110a;'
         + 'border:1px solid rgba(255,255,255,.1);'
         + 'border-radius:999px;'
         + 'padding:5px 8px;'
         + 'box-shadow:0 8px 28px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.3);'
         + 'opacity:0;pointer-events:none;'
         + 'transform:translateY(8px);'
         + 'transition:opacity .18s ease,transform .18s ease;'
         + 'user-select:none;-webkit-user-select:none;'
         + 'will-change:opacity,transform;white-space:nowrap;}';
    css += '#_hl4w.on{opacity:1;pointer-events:all;transform:translateY(0);}';
    /* upward caret (widget is below selection) */
    css += '#_hl4w::before{content:"";position:absolute;'
         + 'top:-6px;left:50%;transform:translateX(-50%);'
         + 'border:6px solid transparent;border-bottom-color:#16110a;border-top:none;}';

    /* colour swatches */
    css += '._hl4sw{width:22px;height:22px;border-radius:50%;'
         + 'border:2px solid rgba(255,255,255,.18);cursor:pointer;padding:0;flex-shrink:0;outline:none;'
         + 'transition:transform .13s,border-color .13s,box-shadow .13s;}';
    css += '._hl4sw:hover,._hl4sw:focus{transform:scale(1.32);border-color:rgba(255,255,255,.9);}';
    css += '._hl4sw.cur{border-color:#fff;box-shadow:0 0 0 1px #16110a,0 0 0 3px rgba(255,255,255,.8);}';

    /* separator */
    css += '._hl4sep{width:1px;height:18px;background:rgba(255,255,255,.15);flex-shrink:0;}';

    /* erase button */
    css += '._hl4er{width:22px;height:22px;border-radius:50%;'
         + 'border:1.5px solid rgba(255,255,255,.2);background:transparent;'
         + 'color:rgba(255,255,255,.58);cursor:pointer;padding:0;flex-shrink:0;'
         + 'display:flex;align-items:center;justify-content:center;'
         + 'font-size:13px;line-height:1;transition:all .13s;}';
    css += '._hl4er:hover,._hl4er:focus{background:rgba(220,40,40,.25);'
         + 'border-color:rgba(255,80,80,.5);color:#fca5a5;}';

    /* close button */
    css += '._hl4cl{width:20px;height:20px;border-radius:50%;border:none;background:transparent;'
         + 'color:rgba(255,255,255,.35);cursor:pointer;padding:0;flex-shrink:0;'
         + 'display:flex;align-items:center;justify-content:center;'
         + 'font-size:12px;line-height:1;transition:all .13s;}';
    css += '._hl4cl:hover,._hl4cl:focus{background:rgba(255,255,255,.12);color:#fff;}';

    /* counter pill */
    css += '#_hl4pill{position:fixed;bottom:80px;left:.85rem;z-index:2147483646;'
         + 'background:#16110a;color:#c9a96e;'
         + 'border:1px solid rgba(201,169,110,.3);border-radius:999px;'
         + 'padding:.3rem .72rem;font-size:.7rem;font-weight:700;letter-spacing:.05em;'
         + 'display:flex;align-items:center;gap:.28rem;cursor:pointer;'
         + 'box-shadow:0 3px 14px rgba(0,0,0,.3);'
         + 'opacity:0;pointer-events:none;transform:translateX(-10px);'
         + 'transition:opacity .28s,transform .28s;}';
    css += '#_hl4pill.on{opacity:1;pointer-events:all;transform:translateX(0);}';

    /* panel backdrop */
    css += '#_hl4bd{position:fixed;inset:0;z-index:2147483645;'
         + 'background:rgba(0,0,0,.52);opacity:0;pointer-events:none;'
         + 'transition:opacity .25s;'
         + 'display:flex;align-items:flex-end;justify-content:center;}';
    css += '#_hl4bd.on{opacity:1;pointer-events:all;}';

    /* panel sheet */
    css += '#_hl4sh{background:#f8f2e6;border-radius:18px 18px 0 0;'
         + 'width:100%;max-width:540px;max-height:80vh;overflow-y:auto;'
         + 'padding:0 1.1rem 3rem;'
         + 'transform:translateY(100%);'
         + 'transition:transform .3s cubic-bezier(.4,0,.2,1);'
         + '-webkit-overflow-scrolling:touch;}';
    css += '#_hl4bd.on #_hl4sh{transform:translateY(0);}';
    css += '._hl4hnd{width:34px;height:4px;border-radius:999px;'
         + 'background:rgba(0,0,0,.14);margin:.65rem auto 1rem;}';
    css += '._hl4ph h2{font-size:1.05rem;font-weight:700;color:#1a140a;margin:0 0 .12rem;}';
    css += '._hl4ph p{font-size:.72rem;color:rgba(0,0,0,.38);margin:0 0 .85rem;}';
    css += '._hl4flt{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.8rem;}';
    css += '._hl4fc{display:inline-flex;align-items:center;gap:.28rem;'
         + 'padding:.24rem .58rem;border-radius:999px;border:1.5px solid rgba(0,0,0,.1);'
         + 'background:transparent;font-size:.65rem;font-weight:700;cursor:pointer;'
         + 'color:#3d2e14;transition:all .13s;}';
    css += '._hl4fc:hover{border-color:#8b6f3a;}';
    css += '._hl4fc.on{background:#1a140a;color:#f8f2e6;border-color:#1a140a;}';
    css += '._hl4fcd{width:7px;height:7px;border-radius:50%;flex-shrink:0;}';
    css += '._hl4lst{display:flex;flex-direction:column;gap:.32rem;}';
    css += '._hl4row{display:flex;align-items:center;gap:.5rem;padding:.58rem .72rem;'
         + 'border-radius:9px;border:1px solid rgba(0,0,0,.07);'
         + 'background:rgba(255,255,255,.55);cursor:pointer;'
         + 'transition:background .13s;border-left:3px solid;}';
    css += '._hl4row:hover{background:rgba(201,169,110,.1);}';
    css += '._hl4rdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}';
    css += '._hl4rm{flex:1;min-width:0;}';
    css += '._hl4rt{font-size:.74rem;color:#1a140a;'
         + 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}';
    css += '._hl4rs{font-size:.66rem;color:rgba(0,0,0,.38);margin-top:.04rem;}';
    css += '._hl4rd{width:22px;height:22px;border-radius:50%;border:none;background:transparent;'
         + 'color:rgba(0,0,0,.22);cursor:pointer;padding:0;flex-shrink:0;'
         + 'display:flex;align-items:center;justify-content:center;font-size:12px;transition:all .13s;}';
    css += '._hl4rd:hover{background:rgba(139,26,26,.1);color:#8b1a1a;}';
    css += '._hl4empty{text-align:center;padding:2.5rem 1rem;opacity:.32;font-size:.82rem;color:#1a140a;}';

    var s = document.createElement('style');
    s.id = '_hl4css'; s.textContent = css;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════
     WIDGET
  ═══════════════════════════════════════ */
  var W       = null;
  var wCtx    = null;   // current context: { type:'sel'|'mark', ... }
  var pendSel = null;   // { range, text }

  function buildWidget() {
    if (document.getElementById('_hl4w')) { W = document.getElementById('_hl4w'); return; }
    W = document.createElement('div');
    W.id = '_hl4w';
    W.setAttribute('role', 'toolbar');
    W.setAttribute('aria-label', 'Grifar texto');

    COLORS.forEach(function(c) {
      var btn = document.createElement('button');
      btn.className = '_hl4sw';
      btn.style.background = c.hex;
      btn.title = c.label;
      btn.setAttribute('aria-label', c.label);
      btn.setAttribute('data-ci', c.id);
      function pick(e) { e.preventDefault(); e.stopPropagation(); handlePick(c.id); }
      btn.addEventListener('mousedown', pick);
      btn.addEventListener('touchstart', pick, { passive: false });
      W.appendChild(btn);
    });

    /* sep */
    var s1 = document.createElement('div'); s1.className = '_hl4sep'; W.appendChild(s1);

    /* erase */
    var er = document.createElement('button');
    er.className = '_hl4er'; er.title = 'Remover grifo'; er.setAttribute('aria-label', 'Remover grifo');
    er.innerHTML = '&#9003;';
    function doErase(e) { e.preventDefault(); e.stopPropagation(); handleErase(); }
    er.addEventListener('mousedown', doErase);
    er.addEventListener('touchstart', doErase, { passive: false });
    W.appendChild(er);

    /* sep */
    var s2 = document.createElement('div'); s2.className = '_hl4sep'; W.appendChild(s2);

    /* close */
    var cl = document.createElement('button');
    cl.className = '_hl4cl'; cl.title = 'Fechar'; cl.setAttribute('aria-label', 'Fechar');
    cl.innerHTML = '&#10005;';
    function doClose(e) { e.preventDefault(); e.stopPropagation(); hideWidget(); clearSel(); }
    cl.addEventListener('mousedown', doClose);
    cl.addEventListener('touchstart', doClose, { passive: false });
    W.appendChild(cl);

    document.body.appendChild(W);
  }

  function posWidget(clientRect) {
    var ww = W.offsetWidth  || 220;
    var wh = W.offsetHeight || 36;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var sy = window.pageYOffset !== undefined ? window.pageYOffset
           : (document.documentElement.scrollTop || document.body.scrollTop || 0);

    /* centre on rect, clamp to viewport */
    var left = clientRect.left + clientRect.width / 2 - ww / 2;
    left = Math.max(8, Math.min(left, vw - ww - 8));

    /* default: below the selection */
    var topBelow = clientRect.bottom + sy + 10;
    var topAbove = clientRect.top    + sy - wh - 10;
    var top = (clientRect.bottom + wh + 16 > vh) ? topAbove : topBelow;

    W.style.left = left + 'px';
    W.style.top  = top  + 'px';
  }

  function showWidget(clientRect, ctx) {
    buildWidget();
    wCtx = ctx;
    /* highlight active colour */
    var cur = ctx && ctx.colorId ? ctx.colorId : null;
    W.querySelectorAll('._hl4sw').forEach(function(b) {
      b.classList.toggle('cur', b.getAttribute('data-ci') === cur);
    });
    posWidget(clientRect);
    W.classList.add('on');
  }

  function hideWidget() {
    if (W) W.classList.remove('on');
    wCtx = null;
  }

  /* ═══════════════════════════════════════
     PICK / ERASE HANDLERS
  ═══════════════════════════════════════ */
  function handlePick(colorId) {
    if (!wCtx) { hideWidget(); return; }
    if (wCtx.type === 'sel' && pendSel) {
      doHighlight(colorId, pendSel.range, pendSel.text);
    } else if (wCtx.type === 'mark') {
      recolorMark(wCtx.markEl, wCtx.key, colorId);
    }
    hideWidget();
    clearSel();
  }

  function handleErase() {
    if (!wCtx) { hideWidget(); return; }
    if (wCtx.type === 'mark') {
      removeMark(wCtx.markEl, wCtx.key);
    }
    hideWidget();
    clearSel();
  }

  /* ═══════════════════════════════════════
     HIGHLIGHT  –  wrap range in <mark>
  ═══════════════════════════════════════ */
  function doHighlight(colorId, range, text) {
    if (!range || range.collapsed) return;

    var key = 'hl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

    /* persist first (before DOM mutation shifts nodes) */
    var sc = range.startContainer;
    var ec = range.endContainer;
    setE(key, {
      colorId      : colorId,
      text         : text,
      startXPath   : xpathOf(sc),
      startOffset  : range.startOffset,
      endXPath     : xpathOf(ec),
      endOffset    : range.endOffset,
      page         : location.pathname,
      ts           : Date.now(),
    });

    try {
      var mk = makeMark(colorId, key);
      range.surroundContents(mk);
    } catch(crossErr) {
      /* range spans element boundaries – split per text node */
      delE(key);
      doHighlightMulti(colorId, range, key);
    }

    updatePill();
  }

  function doHighlightMulti(colorId, range, groupKey) {
    var nodes = textNodesInRange(range);
    if (!nodes.length) return;

    nodes.forEach(function(tn, i) {
      var subKey = groupKey + '_' + i;
      var sr = document.createRange();

      if (nodes.length === 1) {
        sr.setStart(tn, range.startOffset);
        sr.setEnd(tn, range.endOffset);
      } else if (i === 0) {
        sr.setStart(tn, range.startOffset);
        sr.setEnd(tn, tn.textContent.length);
      } else if (i === nodes.length - 1) {
        sr.setStart(tn, 0);
        sr.setEnd(tn, range.endOffset);
      } else {
        sr.selectNodeContents(tn);
      }

      if (sr.collapsed) return;

      setE(subKey, {
        colorId      : colorId,
        text         : sr.toString(),
        startXPath   : xpathOf(tn),
        startOffset  : i === 0 ? range.startOffset : 0,
        endXPath     : xpathOf(tn),
        endOffset    : i === nodes.length - 1 ? range.endOffset : tn.textContent.length,
        groupKey     : groupKey,
        page         : location.pathname,
        ts           : Date.now(),
      });

      try {
        var mk = makeMark(colorId, subKey);
        sr.surroundContents(mk);
      } catch(e) {}
    });

    updatePill();
  }

  function textNodesInRange(range) {
    var out    = [];
    var walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT, null, false
    );
    var node;
    while ((node = walker.nextNode())) {
      if (range.intersectsNode(node)) out.push(node);
    }
    return out;
  }

  /* ─── create a <mark> element ─── */
  function makeMark(colorId, key) {
    var mk = document.createElement('mark');
    mk.setAttribute('data-hl-key', key);
    mk.setAttribute('data-hl-c',   colorId);

    function open(e) {
      e.stopPropagation();
      hideWidget();
      clearSel();
      var rect = mk.getBoundingClientRect();
      showWidget(rect, { type: 'mark', markEl: mk, key: key, colorId: colorId });
    }
    mk.addEventListener('click', open);
    mk.addEventListener('touchend', function(e) { e.preventDefault(); open(e); }, { passive: false });
    return mk;
  }

  /* ─── recolour ─── */
  function recolorMark(mk, key, colorId) {
    var d = load();
    if (d[key]) { d[key].colorId = colorId; save(d); }
    mk.setAttribute('data-hl-c', colorId);
    updatePill();
  }

  /* ─── remove / unwrap ─── */
  function removeMark(mk, key) {
    var d = load();
    /* group removal */
    if (d[key] && d[key].groupKey) {
      var grp = d[key].groupKey;
      Object.keys(d).forEach(function(k) {
        if (d[k] && d[k].groupKey === grp) {
          delE(k);
          var sib = document.querySelector('mark[data-hl-key="' + k + '"]');
          if (sib) unwrap(sib);
        }
      });
    } else {
      delE(key);
      if (mk) unwrap(mk);
    }
    updatePill();
  }

  function unwrap(el) {
    if (!el || !el.parentNode) return;
    var frag = document.createDocumentFragment();
    while (el.firstChild) frag.appendChild(el.firstChild);
    el.parentNode.replaceChild(frag, el);
  }

  /* ═══════════════════════════════════════
     SELECTION DETECTION
  ═══════════════════════════════════════ */
  var _selT = null;

  function onSelChange() {
    clearTimeout(_selT);
    _selT = setTimeout(function() {
      var sel = window.getSelection ? window.getSelection() : document.selection;
      if (!sel || sel.isCollapsed || !sel.toString().trim()) return;

      var range = sel.getRangeAt(0);
      pendSel = { range: range.cloneRange(), text: sel.toString() };

      var rect = range.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) {
        showWidget(rect, { type: 'sel' });
      }
    }, 100);
  }

  function clearSel() {
    try { var s = window.getSelection ? window.getSelection() : null; if (s) s.removeAllRanges(); } catch(e) {}
    pendSel = null;
  }

  /* ═══════════════════════════════════════
     RESTORE  on load / DOM change
  ═══════════════════════════════════════ */
  function restoreAll() {
    var d       = load();
    var entries = Object.keys(d).sort(function(a, b) { return (d[a].ts||0) - (d[b].ts||0); });
    entries.forEach(function(key) {
      var e = d[key];
      if (e.page && e.page !== location.pathname) return;
      if (document.querySelector('mark[data-hl-key="' + key + '"]')) return;
      restoreOne(key, e);
    });
  }

  function restoreOne(key, e) {
    var startEl = resolveXPath(e.startXPath);
    var endEl   = resolveXPath(e.endXPath);
    if (!startEl || !endEl) return;

    try {
      var sp = startEl.nodeType === 3
        ? { node: startEl, offset: e.startOffset }
        : textNodeAt(startEl, e.startOffset);
      var ep = endEl.nodeType === 3
        ? { node: endEl, offset: e.endOffset }
        : textNodeAt(endEl, e.endOffset);

      if (!sp || !ep) return;

      var r = document.createRange();
      r.setStart(sp.node, Math.min(sp.offset, sp.node.textContent.length));
      r.setEnd(ep.node,   Math.min(ep.offset, ep.node.textContent.length));
      if (r.collapsed) return;

      var mk = makeMark(e.colorId, key);
      r.surroundContents(mk);
    } catch(err) { /* DOM changed; silently skip */ }
  }

  /* ═══════════════════════════════════════
     COUNTER PILL
  ═══════════════════════════════════════ */
  var pill = null;

  function buildPill() {
    if (document.getElementById('_hl4pill')) { pill = document.getElementById('_hl4pill'); return; }
    pill = document.createElement('button');
    pill.id = '_hl4pill';
    pill.setAttribute('aria-label', 'Ver meus grifos');
    pill.innerHTML = '&#9998;&thinsp;<span id="_hl4pn">0</span>';
    pill.addEventListener('click', openPanel);
    document.body.appendChild(pill);
  }

  function updatePill() {
    buildPill();
    var n = Object.keys(load()).length;
    document.getElementById('_hl4pn').textContent = n;
    pill.classList.toggle('on', n > 0);
  }

  /* ═══════════════════════════════════════
     PANEL
  ═══════════════════════════════════════ */
  var bd     = null;
  var pFilt  = 'all';

  function openPanel() {
    if (!bd) {
      bd = document.createElement('div');
      bd.id = '_hl4bd';
      bd.innerHTML = '<div id="_hl4sh">'
        + '<div class="_hl4hnd"></div>'
        + '<div class="_hl4ph"><h2>Meus Grifos</h2><p id="_hl4sub"></p></div>'
        + '<div class="_hl4flt" id="_hl4flt"></div>'
        + '<div class="_hl4lst" id="_hl4lst"></div>'
        + '</div>';
      bd.addEventListener('click', function(e) { if (e.target === bd) closePanel(); });
      document.body.appendChild(bd);
    }
    pFilt = 'all';
    renderPanel();
    requestAnimationFrame(function() { bd.classList.add('on'); });
  }

  function closePanel() { if (bd) bd.classList.remove('on'); }

  function renderPanel() {
    var d    = load();
    var all  = Object.keys(d).map(function(k) { return [k, d[k]]; });
    var sub  = document.getElementById('_hl4sub');
    var flt  = document.getElementById('_hl4flt');
    var lst  = document.getElementById('_hl4lst');
    if (!sub || !flt || !lst) return;

    sub.textContent = all.length + ' grifo' + (all.length !== 1 ? 's' : '');

    /* chips */
    var used = {};
    all.forEach(function(p) { used[p[1].colorId] = true; });
    flt.innerHTML = '';

    function chip(id, label, dot) {
      var btn = document.createElement('button');
      btn.className = '_hl4fc' + (pFilt === id ? ' on' : '');
      if (dot) {
        var sp = document.createElement('span');
        sp.className = '_hl4fcd'; sp.style.background = dot;
        btn.appendChild(sp);
      }
      btn.appendChild(document.createTextNode(label));
      btn.addEventListener('click', function() { pFilt = id; renderPanel(); });
      flt.appendChild(btn);
    }
    chip('all', 'Todos');
    COLORS.filter(function(c) { return used[c.id]; })
          .forEach(function(c) { chip(c.id, c.label, c.hex); });

    /* entries */
    var rows = all
      .filter(function(p) { return pFilt === 'all' || p[1].colorId === pFilt; })
      .sort(function(a, b) { return (b[1].ts||0) - (a[1].ts||0); });

    lst.innerHTML = '';
    if (!rows.length) {
      var em = document.createElement('div');
      em.className = '_hl4empty'; em.textContent = 'Nenhum grifo aqui.';
      lst.appendChild(em); return;
    }

    rows.forEach(function(pair) {
      var key   = pair[0];
      var entry = pair[1];
      var col   = COLORS.filter(function(c) { return c.id === entry.colorId; })[0] || COLORS[0];

      var row = document.createElement('div');
      row.className = '_hl4row'; row.style.borderLeftColor = col.hex;

      var dot = document.createElement('span');
      dot.className = '_hl4rdot'; dot.style.background = col.hex;

      var rm = document.createElement('div'); rm.className = '_hl4rm';
      var rt = document.createElement('div'); rt.className = '_hl4rt';
      rt.textContent = (entry.text || '').substring(0, 66) || '—';
      var rs = document.createElement('div'); rs.className = '_hl4rs';
      rs.textContent = col.label + (entry.groupKey ? ' · multi-nó' : '');
      rm.appendChild(rt); rm.appendChild(rs);

      var rd = document.createElement('button');
      rd.className = '_hl4rd'; rd.setAttribute('aria-label', 'Remover');
      rd.textContent = '✕';

      row.appendChild(dot); row.appendChild(rm); row.appendChild(rd);

      row.addEventListener('click', function(e) {
        if (e.target === rd) return;
        closePanel();
        var mk = document.querySelector('mark[data-hl-key="' + key + '"]');
        if (mk) mk.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      rd.addEventListener('click', function(e) {
        e.stopPropagation();
        var mk = document.querySelector('mark[data-hl-key="' + key + '"]');
        if (mk) { removeMark(mk, key); }
        else {
          /* mark no longer in DOM – delete entry and any siblings */
          var dd = load();
          if (dd[key] && dd[key].groupKey) {
            var grp = dd[key].groupKey;
            Object.keys(dd).forEach(function(k) {
              if (dd[k] && dd[k].groupKey === grp) {
                delE(k);
                var sib = document.querySelector('mark[data-hl-key="' + k + '"]');
                if (sib) unwrap(sib);
              }
            });
          } else { delE(key); }
        }
        updatePill(); renderPanel();
      });

      lst.appendChild(row);
    });
  }

  /* ═══════════════════════════════════════
     GLOBAL EVENT WIRING
  ═══════════════════════════════════════ */
  document.addEventListener('selectionchange', onSelChange);

  /* close widget when clicking outside it */
  document.addEventListener('mousedown', function(e) {
    if (W && W.classList.contains('on') && !W.contains(e.target)) hideWidget();
  });
  document.addEventListener('touchstart', function(e) {
    if (W && W.classList.contains('on') && !W.contains(e.target)) hideWidget();
  }, { passive: true });

  window.addEventListener('scroll',  function() { if (W && W.classList.contains('on')) hideWidget(); }, { passive: true });
  window.addEventListener('resize',  function() { if (W && W.classList.contains('on')) hideWidget(); });

  /* ═══════════════════════════════════════
     MUTATION OBSERVER  (SPA / lazy content)
  ═══════════════════════════════════════ */
  function observe() {
    var mo = new MutationObserver(function(muts) {
      var added = muts.some(function(m) { return m.addedNodes.length > 0; });
      if (added) { setTimeout(restoreAll, 120); updatePill(); }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════
     INIT
  ═══════════════════════════════════════ */
  function init() {
    injectStyles();
    buildWidget();
    buildPill();
    restoreAll();
    updatePill();
    observe();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ═══════════════════════════════════════
     PUBLIC API
  ═══════════════════════════════════════ */
  root.Highlighter = {
    open   : openPanel,
    close  : closePanel,
    getAll : load,
    clear  : function() {
      document.querySelectorAll('mark[data-hl-key]').forEach(function(mk) { unwrap(mk); });
      try { localStorage.removeItem(SK); } catch(e) {}
      updatePill();
    },
  };

}(typeof window !== 'undefined' ? window : this));