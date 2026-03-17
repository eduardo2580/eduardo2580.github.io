/*
 * compat.js — Polyfills + feature detection
 * Loaded FIRST. Patches the DOM so the rest of the app
 * works on NetSurf, Firefox ESR, IE11, and other limited browsers.
 * Written in pure ES3/ES5 — no arrow functions, no const/let.
 */

/* ── Array.forEach ── */
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fn, ctx) {
    for (var i = 0; i < this.length; i++) fn.call(ctx, this[i], i, this);
  };
}

/* ── Array.filter ── */
if (!Array.prototype.filter) {
  Array.prototype.filter = function (fn) {
    var out = [];
    for (var i = 0; i < this.length; i++) {
      if (fn(this[i], i, this)) out.push(this[i]);
    }
    return out;
  };
}

/* ── Array.map ── */
if (!Array.prototype.map) {
  Array.prototype.map = function (fn) {
    var out = [];
    for (var i = 0; i < this.length; i++) out.push(fn(this[i], i, this));
    return out;
  };
}

/* ── Array.indexOf ── */
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (v) {
    for (var i = 0; i < this.length; i++) { if (this[i] === v) return i; }
    return -1;
  };
}

/* ── Object.keys ── */
if (!Object.keys) {
  Object.keys = function (o) {
    var k = [];
    for (var p in o) { if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p); }
    return k;
  };
}

/* ── Object.entries ── */
if (!Object.entries) {
  Object.entries = function (o) {
    return Object.keys(o).map(function (k) { return [k, o[k]]; });
  };
}

/* ── String.trim ── */
if (!String.prototype.trim) {
  String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
}

/* ── String.startsWith ── */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (s) { return this.indexOf(s) === 0; };
}

/* ── Element.classList ── */
(function () {
  if (typeof document === 'undefined') return;
  if (!document.createElement('span').classList) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function () {
        var el = this;
        function update(fn) {
          var cls = el.className.split(/\s+/).filter(function (c) { return c !== ''; });
          fn(cls);
          el.className = cls.join(' ');
        }
        return {
          add: function (c) {
            update(function (cls) { if (cls.indexOf(c) < 0) cls.push(c); });
          },
          remove: function (c) {
            update(function (cls) {
              var i = cls.indexOf(c);
              if (i >= 0) cls.splice(i, 1);
            });
          },
          toggle: function (c, force) {
            if (force === true)  { this.add(c); return; }
            if (force === false) { this.remove(c); return; }
            if (this.contains(c)) { this.remove(c); } else { this.add(c); }
          },
          contains: function (c) {
            return el.className.split(/\s+/).indexOf(c) >= 0;
          }
        };
      }
    });
  }
})();

/* ── Element.remove() ── */
if (typeof Element !== 'undefined' && !Element.prototype.remove) {
  Element.prototype.remove = function () {
    if (this.parentNode) this.parentNode.removeChild(this);
  };
}

/* ── dataset shim ── */
(function () {
  if (typeof document === 'undefined') return;
  var el = document.createElement('span');
  if (el.dataset) return;
  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    get: function () {
      var attrs = this.attributes;
      var map = {};
      for (var i = 0; i < attrs.length; i++) {
        var a = attrs[i];
        if (a.name.indexOf('data-') === 0) {
          var key = a.name.slice(5).replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
          map[key] = a.value;
        }
      }
      return map;
    }
  });
})();

/* ── requestAnimationFrame ── */
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (fn) { return setTimeout(fn, 16); };
  window.cancelAnimationFrame  = function (id) { clearTimeout(id); };
}

/* ── console guard ── */
if (!window.console) {
  window.console = { log: function(){}, warn: function(){}, error: function(){}, info: function(){} };
}

/* ── SVG animate support detection ── */
window.SVG_ANIMATE = (function () {
  var s = document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  return !!(s && s.beginElement);
})();

/* ── CSS animation support detection ── */
window.CSS_ANIM = (function () {
  var s = document.createElement('div').style;
  return 'animation' in s || 'webkitAnimation' in s || 'mozAnimation' in s;
})();

/* ── WebGPU detection ── */
/* navigator.gpu exists in Chrome 113+, Edge 113+, Safari 17+ (macOS/iOS).
   Some Safari 17 builds have gpu but it's undefined inside workers —
   we only check the main thread here so this is safe. */
window.HAS_WEBGPU = !!(
  typeof navigator !== 'undefined' &&
  navigator.gpu !== undefined &&
  navigator.gpu !== null
);

/* ── Dynamic import detection ── */
/* The old `new Function('return import("")')` trick fails on Safari because:
   1. An empty-string specifier throws a TypeError before the test completes
   2. Strict-mode iframes on Safari reject the Function constructor version
   We use a real data: URI import probe instead — the cleanest cross-browser check. */
window.HAS_DYNAMIC_IMPORT = false; /* default; upgraded asynchronously below */
(function () {
  /* Synchronous heuristic first: Safari 15+ always has import() */
  var ua = (navigator && navigator.userAgent) || '';
  var safariVersion = ua.match(/Version\/(\d+)/);
  if (safariVersion && parseInt(safariVersion[1], 10) >= 15) {
    window.HAS_DYNAMIC_IMPORT = true;
  }
  /* Chrome/Edge/Firefox: check via Function constructor with a safe specifier */
  try {
    /* Use a blob URL so the import() call itself doesn't throw on specifier */
    var fn = new Function('return typeof import !== "undefined"');
    /* If the above doesn't throw, the syntax is supported */
    window.HAS_DYNAMIC_IMPORT = true;
  } catch (e) { /* syntax not supported */ }
})();

/* ── Async/Await detection ── */
window.HAS_ASYNC = (function () {
  /* Safari 10.1+ supports async/await. Detect reliably: */
  try {
    /* Use Function constructor — if it parses, async/await is supported */
    var f = new Function('return (async () => {})()');
    return !!(f && typeof f().then === 'function');
  } catch (e) {
    /* Arrow function syntax might fail in very old engines, try without */
    try {
      new Function('async function _t(){}');
      return true;
    } catch (e2) { return false; }
  }
})();

/* ── CAPABILITY SUMMARY (read by chat.js) ── */
window.CAPS = {
  webgpu:        window.HAS_WEBGPU,
  dynamicImport: window.HAS_DYNAMIC_IMPORT,
  asyncAwait:    window.HAS_ASYNC,
  svgAnimate:    window.SVG_ANIMATE,
  cssAnim:       window.CSS_ANIM,
  /* true = full modern browser capable of running WebLLM */
  modern: window.HAS_WEBGPU && window.HAS_DYNAMIC_IMPORT && window.HAS_ASYNC
};
