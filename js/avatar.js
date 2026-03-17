/*
 * avatar.js — SVG avatar animation controller
 * Pure ES5. No Three.js. No WebGL. No GPU.
 * Works in NetSurf, Firefox, Safari, Chrome, IE9+.
 *
 * Controls:
 *  - Halo ring spin speed (CSS class)
 *  - Eye pulse speed via SVG animate dur attribute
 *  - Mouth grill scale via SVG transform
 *  - Status dot color already handled by chat.js
 *
 * Exposes window.AvatarController.setTalking(bool)
 */
(function (win, doc) {

  /* ── Element refs ── */
  var halo    = doc.getElementById('avatar-halo');
  var mouth   = doc.getElementById('av-mouth');
  var eyeAnims = [];   /* SVG animate elements on eyes */

  /* collect eye <animate> elements */
  var eyes = ['136', '184'];  /* cx values of eye circles */
  (function () {
    var circles = doc.getElementsByTagName('circle');
    for (var i = 0; i < circles.length; i++) {
      var anims = circles[i].getElementsByTagName('animate');
      for (var j = 0; j < anims.length; j++) {
        eyeAnims.push(anims[j]);
      }
    }
  }());

  /* ── Talking state ── */
  var talking      = false;
  var mouthTimer   = null;
  var mouthScale   = 1;
  var mouthDir     = 1;

  /* animate mouth when talking */
  function tickMouth() {
    if (!talking) {
      /* reset */
      if (mouth) mouth.setAttribute('transform', 'scale(1,1)');
      return;
    }
    mouthScale += mouthDir * 0.06;
    if (mouthScale > 1.25) mouthDir = -1;
    if (mouthScale < 0.85) mouthDir =  1;
    if (mouth) {
      mouth.setAttribute('transform',
        'translate(160,188) scale(' + mouthScale.toFixed(2) + ',' + (2 - mouthScale).toFixed(2) + ') translate(-160,-188)');
    }
    mouthTimer = setTimeout(tickMouth, 60);
  }

  /* ── CSS class helpers (ES5 safe) ── */
  function addClass(el, cls) {
    if (!el) return;
    if (el.classList) { el.classList.add(cls); return; }
    if (el.className.baseVal !== undefined) {
      /* SVG element */
      if (el.className.baseVal.indexOf(cls) < 0)
        el.className.baseVal += ' ' + cls;
    } else {
      if (el.className.indexOf(cls) < 0) el.className += ' ' + cls;
    }
  }
  function removeClass(el, cls) {
    if (!el) return;
    if (el.classList) { el.classList.remove(cls); return; }
    var rx = new RegExp('\\b' + cls + '\\b', 'g');
    if (el.className.baseVal !== undefined) {
      el.className.baseVal = el.className.baseVal.replace(rx, '').trim();
    } else {
      el.className = el.className.replace(rx, '').trim();
    }
  }

  /* ── Speed up / slow down SVG animate elements ── */
  function setEyeSpeed(fast) {
    for (var i = 0; i < eyeAnims.length; i++) {
      eyeAnims[i].setAttribute('dur', fast ? '0.8s' : '2s');
    }
  }

  /* ════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════ */
  win.AvatarController = {
    setTalking: function (val) {
      talking = !!val;

      /* halo spin speed */
      if (halo) {
        if (talking) { addClass(halo, 'talking'); }
        else         { removeClass(halo, 'talking'); }
      }

      /* eye pulse speed */
      setEyeSpeed(talking);

      /* mouth animation */
      if (mouthTimer) clearTimeout(mouthTimer);
      if (talking) {
        mouthDir = 1;
        tickMouth();
      } else {
        if (mouth) mouth.setAttribute('transform', '');
      }
    }
  };

}(window, document));
