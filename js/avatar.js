/*
 * avatar.js — Eduardo.AI  (SVG Robot Controller)
 *
 * Controls the robot SVG avatar animations:
 *   - Idle: slow float, gentle eye pulse, core glow breathe
 *   - Talking: mouth bars animate, eyes pulse faster, head micro-bob
 *   - Thinking: eyes dim and scan, mouth static
 *
 * Exposes window.AvatarController.setTalking(bool)
 * Also toggles .talking on #avatar-halo for glow-sync.js
 *
 * Pure ES5. No dependencies. Works everywhere including smartwatches.
 */
(function (win, doc) {
  'use strict';

  /* ── Element refs ── */
  var halo     = doc.getElementById('avatar-halo');
  var svgRoot  = doc.getElementById('avatar-canvas');
  var mouthEl  = doc.getElementById('av-mouth');

  /* Eyes and core animate elements — collected after SVG parses */
  var eyeAnims   = [];
  var coreAnims  = [];

  /* ── State ── */
  var talking      = false;
  var mouthTimer   = null;
  var mouthLines   = [];
  var mouthBase    = [];   /* original y1/y2 values */

  /* ════════════════════════════════════════════
     COLLECT ANIMATED ELEMENTS
  ════════════════════════════════════════════ */
  function collectElements() {
    if (!svgRoot) return;

    /* Eye <animate> elements — pulse speed */
    var circles = svgRoot.getElementsByTagName('circle');
    for (var i = 0; i < circles.length; i++) {
      var anims = circles[i].getElementsByTagName('animate');
      for (var j = 0; j < anims.length; j++) {
        eyeAnims.push(anims[j]);
      }
    }

    /* Core <animate> elements */
    var coreCircle = svgRoot.getElementById
      ? svgRoot.getElementById('av-core-pulse')
      : null;

    /* Mouth lines */
    if (mouthEl) {
      var lines = mouthEl.getElementsByTagName('line');
      for (var k = 0; k < lines.length; k++) {
        var ln = lines[k];
        mouthLines.push(ln);
        mouthBase.push({
          y1: parseFloat(ln.getAttribute('y1')),
          y2: parseFloat(ln.getAttribute('y2'))
        });
      }
    }
  }

  /* ════════════════════════════════════════════
     EYE SPEED
  ════════════════════════════════════════════ */
  function setEyeSpeed(fast) {
    var dur = fast ? '0.6s' : '2s';
    for (var i = 0; i < eyeAnims.length; i++) {
      eyeAnims[i].setAttribute('dur', dur);
    }
  }

  /* ════════════════════════════════════════════
     MOUTH ANIMATION
     Animates the three horizontal grill lines
     to look like a speaking mouth waveform.
  ════════════════════════════════════════════ */
  var mouthPhase = 0;
  var mouthDir   = 1;
  var MOUTH_AMP  = 2.5;   /* max vertical offset in px */

  function tickMouth() {
    if (!talking) {
      resetMouth();
      return;
    }

    mouthPhase += mouthDir * 0.18;
    if (mouthPhase >  1) mouthDir = -1;
    if (mouthPhase < -1) mouthDir =  1;

    /* Each line gets a slightly different phase offset for wave effect */
    var offsets = [
      Math.sin(mouthPhase * Math.PI) * MOUTH_AMP,
      Math.sin(mouthPhase * Math.PI + 0.8) * MOUTH_AMP * 0.7,
      Math.sin(mouthPhase * Math.PI + 1.6) * MOUTH_AMP
    ];

    for (var i = 0; i < mouthLines.length && i < mouthBase.length; i++) {
      var base = mouthBase[i];
      var off  = offsets[i] || 0;
      mouthLines[i].setAttribute('y1', (base.y1 + off).toFixed(1));
      mouthLines[i].setAttribute('y2', (base.y2 + off).toFixed(1));
      /* Also pulse opacity */
      var op = (0.5 + Math.abs(mouthPhase) * 0.5).toFixed(2);
      mouthLines[i].setAttribute('opacity', op);
    }

    mouthTimer = setTimeout(tickMouth, 55);
  }

  function resetMouth() {
    for (var i = 0; i < mouthLines.length && i < mouthBase.length; i++) {
      mouthLines[i].setAttribute('y1', mouthBase[i].y1);
      mouthLines[i].setAttribute('y2', mouthBase[i].y2);
      mouthLines[i].setAttribute('opacity', '0.35');
    }
  }

  /* ════════════════════════════════════════════
     HALO CLASS HELPERS
  ════════════════════════════════════════════ */
  function addClass(el, cls) {
    if (!el) return;
    if (el.classList) { el.classList.add(cls); return; }
    /* SVG element fallback */
    if (el.className && el.className.baseVal !== undefined) {
      if (el.className.baseVal.indexOf(cls) < 0)
        el.className.baseVal += ' ' + cls;
    } else if (typeof el.className === 'string') {
      if (el.className.indexOf(cls) < 0)
        el.className += ' ' + cls;
    }
  }

  function removeClass(el, cls) {
    if (!el) return;
    var rx = new RegExp('\\b' + cls + '\\b', 'g');
    if (el.classList) { el.classList.remove(cls); return; }
    if (el.className && el.className.baseVal !== undefined) {
      el.className.baseVal = el.className.baseVal.replace(rx, '').trim();
    } else if (typeof el.className === 'string') {
      el.className = el.className.replace(rx, '').trim();
    }
  }

  /* ════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════ */
  win.AvatarController = {
    setTalking: function (val) {
      talking = !!val;

      /* Halo spin speed (CSS handles .talking class) */
      if (talking) { addClass(halo, 'talking'); }
      else          { removeClass(halo, 'talking'); }

      /* Eye pulse speed */
      setEyeSpeed(talking);

      /* Mouth animation */
      if (mouthTimer) clearTimeout(mouthTimer);
      if (talking) {
        mouthDir = 1;
        tickMouth();
      } else {
        resetMouth();
      }
    }
  };

  /* ── Boot ── */
  function boot() {
    collectElements();
  }

  if (doc.readyState === 'loading') {
    if (doc.addEventListener) doc.addEventListener('DOMContentLoaded', boot, false);
  } else {
    boot();
  }

}(window, document));
