/* The scroll-scrubbed showroom walk.
   Scroll position is the playhead. Nothing plays on a timer. */
(function () {
  'use strict';

  var hero    = document.getElementById('hero');
  var stage   = document.getElementById('stage');
  var video   = document.getElementById('hero-video');
  var poster  = document.getElementById('poster');
  var ring    = document.getElementById('ring');
  var dust    = document.getElementById('dust');
  if (!hero || !stage || !video) return;

  // Two cuts of the same film: the wide one, and a portrait crop for phones
  // that is a third of the weight because it travels on mobile data.
  var SOURCES = {
    wide:     { url: 'assets/video/hero-scrub.mp4',          bytes: 3991985,
                poster: 'assets/video/hero-poster.jpg' },
    portrait: { url: 'assets/video/hero-scrub-portrait.mp4', bytes: 2564877,
                poster: 'assets/video/hero-poster-portrait.jpg' }
  };
  var PORTRAIT_Q = '(orientation: portrait) and (max-width: 900px)';
  function pickSource() {
    return matchMedia(PORTRAIT_Q).matches ? SOURCES.portrait : SOURCES.wide;
  }
  var current = pickSource();

  /* ============ the static-hero gates ============
     These must match site.css character for character. Phones scrub now, so
     only two cases fall back: reduced motion, and a sideways phone. */
  var GATES = [
    '(prefers-reduced-motion: reduce)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 500px)'
  ];
  var MQLS = GATES.map(function (q) { return matchMedia(q); });

  /* ============ split the headlines once, with a seeded generator ============ */
  function rng(seed) {
    var s = seed >>> 0;
    return function () { return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  }

  function splitEl(el, mode, spread, seed) {
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    var r = rng(seed);
    var words = text.split(' ');
    var visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');

    var charTotal = text.replace(/ /g, '').length, charSeen = 0;

    words.forEach(function (word, wi) {
      var w = document.createElement('span');
      w.className = 'w';
      if (mode === 'words') {
        w.style.setProperty('--th', (wi / Math.max(1, words.length) * 0.5).toFixed(3));
        w.textContent = word;
      } else {
        for (var i = 0; i < word.length; i++) {
          var c = document.createElement('span');
          c.className = 'c';
          c.textContent = word[i];
          var ordered = (charSeen / Math.max(1, charTotal)) * spread;
          c.style.setProperty('--th', (ordered + r() * 0.06).toFixed(3));
          c.style.setProperty('--jx', ((r() - 0.5) * 46).toFixed(1) + 'px');
          c.style.setProperty('--jy', ((r() - 0.5) * 14).toFixed(1) + 'px');
          c.style.setProperty('--jr', ((r() - 0.5) * 8).toFixed(1) + 'deg');
          w.appendChild(c);
          charSeen++;
        }
      }
      visual.appendChild(w);
      if (wi < words.length - 1) visual.appendChild(document.createTextNode(' '));
    });

    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    el.textContent = '';
    el.appendChild(sr);
    el.appendChild(visual);
  }

  var seed = 20260826;
  [].forEach.call(document.querySelectorAll('.band [data-split]'), function (el, n) {
    var band = el.closest('.band');
    var mode = el.getAttribute('data-split');
    var spread = parseFloat(band && band.getAttribute('data-spread')) || 0.34;
    splitEl(el, mode, spread, seed + n * 7919);
  });

  // the two halves of band 2 part outward from the centre line
  [].forEach.call(document.querySelectorAll('[data-entrance="part"] .half'), function (h, i) {
    h.style.setProperty('--th', i === 0 ? '0' : '0.22');
    h.style.setProperty('--jx', (i === 0 ? -38 : 38) + 'px');
  });

  /* ============ the bands ============ */
  var bands = [].map.call(document.querySelectorAll('.band'), function (el) {
    var r = (el.getAttribute('data-range') || '0,1').split(',');
    var rm = (el.getAttribute('data-range-m') || el.getAttribute('data-range') || '0,1').split(',');
    var a = parseFloat(r[0]), b = parseFloat(r[1]);
    var am = parseFloat(rm[0]), bm = parseFloat(rm[1]);
    return {
      el: el, a: a, b: b, am: am, bm: bm,
      first: a <= 0.0001,
      last: b >= 0.9999,
      ramp: parseFloat(el.getAttribute('data-ramp')) || Math.min(0.025, (b - a) * 0.35),
      op: -1, k: -1
    };
  });

  /* chapter markers: which beat of the walk you are in */
  var chapters = document.createElement('div');
  chapters.className = 'chapters';
  chapters.setAttribute('aria-hidden', 'true');
  chapters.innerHTML = bands.map(function () { return '<b></b>'; }).join('');
  stage.appendChild(chapters);
  var chapDots = chapters.querySelectorAll('b');
  var chapOn = -1;

  function updateChapters(p) {
    var idx = 0, best = -1;
    for (var i = 0; i < bands.length; i++) {
      var B = bands[i];
      var a = narrow ? B.am : B.a, b = narrow ? B.bm : B.b;
      var mid = (a + b) / 2;
      var score = 1 - Math.abs(p - mid) / Math.max(0.001, (b - a));
      if (score > best) { best = score; idx = i; }
    }
    if (idx !== chapOn) {
      chapOn = idx;
      for (var j = 0; j < chapDots.length; j++) chapDots[j].classList.toggle('on', j === idx);
    }
  }

  var smoothstep = function (p, e0, e1) {
    var t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };
  var clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };

  var loadK = 0, loadStart = 0;

  var narrow = false;   // set by applyHeroMode; phones get the wider ranges

  function updateBands(p) {
    if (!canDrive) p = 0;     // no film yet: the poster is frame one, so is the copy
    for (var i = 0; i < bands.length; i++) {
      var B = bands[i];
      var a = narrow ? B.am : B.a, b = narrow ? B.bm : B.b;
      var f = Math.min(0.02, (b - a) / 3);
      var inRamp  = B.first ? 1 : smoothstep(p, a, a + f);
      var outRamp = B.last  ? 1 : (1 - smoothstep(p, b - f, b));
      var op = inRamp * outRamp;
      var k = clamp((p - a) / B.ramp, 0, 1);
      if (B.first) k = Math.max(k, loadK);

      if (Math.abs(op - B.op) > 0.004) {           // delta gate the opacity
        B.op = op;
        B.el.style.opacity = op.toFixed(3);
      }
      if (Math.abs(k - B.k) > 0.008) {             // delta gate the assembly
        B.k = k;
        B.el.style.setProperty('--k', k.toFixed(3));
      }
    }
  }

  /* ============ scroll progress through the pinned hero ============ */
  function heroProgress() {
    var rect = hero.getBoundingClientRect();
    var range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    return clamp(-rect.top / range, 0, 1);
  }

  /* ============ gated seeks ============ */
  var seekBusy = false, pendingTime = null, lastSeek = -1;
  // The clip runs at 48fps, so anything finer than half a frame lands on the
  // frame already showing. Skipping those keeps the decoder off the critical path.
  var HALF_FRAME = 1 / 96;

  function requestSeek(t) {
    if (!video.duration || isNaN(t)) return;
    if (Math.abs(t - lastSeek) < HALF_FRAME && t > 0 && t < video.duration) return;
    lastSeek = t;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    try { video.currentTime = t; } catch (err) { seekBusy = false; }
  }
  video.addEventListener('seeked', function () {
    seekBusy = false;
    if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', function () {
    seekBusy = false; pendingTime = null; failVideo();
  });

  /* ============ the lerp loop, resting when converged ============ */
  var target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;

  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));

    if (loadK < 1 && loadStart) {
      loadK = clamp((now - loadStart) / 900, 0, 1);
    }

    var settled = Math.abs(target - shown) < 0.0005 && loadK >= 1;
    if (settled) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);

    if (video.duration) requestSeek(shown * video.duration);
    updateBands(shown);
    updateCue(shown);
    updateVelocity(Math.abs(target - shown));
  }

  /* Scroll fast and the camera softens and surges, the way a real one does.
     It settles back to sharp the moment you stop. */
  var velOK = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastBlur = -1;
  function updateVelocity(v) {
    if (!velOK) return;
    var blur = Math.min(2.6, v * 62);
    if (Math.abs(blur - lastBlur) < 0.12) return;
    lastBlur = blur;
    video.style.setProperty('--vblur', blur.toFixed(2) + 'px');
    video.style.setProperty('--vscale', (1 + Math.min(0.014, v * 0.34)).toFixed(4));
  }

  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) { lastTick = 0; rafId = requestAnimationFrame(tick); }
  }

  var cueOn = null, chapVis = null;
  function updateCue(p) {
    var want = p < 0.06;
    if (want !== cueOn) { cueOn = want; stage.classList.toggle('cue-on', want); }
    var showChap = p > 0.03;
    if (showChap !== chapVis) { chapVis = showChap; stage.classList.toggle('chapters-on', showChap); }
    updateChapters(p);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      heroOnScreen = e[0].isIntersecting;
      if (heroOnScreen && scrubOn) onScroll();
    }, { threshold: 0 }).observe(hero);
  }

  /* ============ the poster first, then the streamed blob ============ */
  var heroStarted = false, fetchStarted = false, videoReady = false, canDrive = false;

  function failVideo() {
    stage.classList.remove('loading');
    stage.classList.add('video-failed');
    canDrive = true;          // the captions still work over the still frame
    updateBands(heroProgress());
  }

  function initHeroOnce() {
    if (heroStarted) return;
    heroStarted = true;
    poster.style.backgroundImage = "url('" + current.poster + "')";
    loadStart = performance.now();
    loadVideo();
  }

  /* Fetch the whole file, then scrub a local copy.
     Streaming and seeking with range requests was tried and does not work: a
     paused video buffers a second or two and then suspends, and a seek past
     what it holds never completes, so the film sticks. Holding the file makes
     every seek instant and every host behave the same. The cost is the wait,
     and the wait is paid for by keeping the file small, showing real progress,
     and holding the opening caption so the words always match the frame. */
  function loadVideo() {
    if (fetchStarted) return;
    fetchStarted = true;
    stage.classList.add('loading');
    fetchBlob().catch(failVideo);
  }

  async function fetchBlob() {
    var ctrl = new AbortController();
    var watchdog = setTimeout(function () { ctrl.abort(); }, 30000);

    var res = await fetch(current.url, { signal: ctrl.signal });
    if (!res.ok) throw new Error('http ' + res.status);

    var total = Number(res.headers.get('Content-Length')) || current.bytes;
    var reader = res.body.getReader();
    var chunks = [], got = 0, lastPaint = 0;

    for (;;) {
      var r = await reader.read();
      if (r.done) break;
      clearTimeout(watchdog);
      watchdog = setTimeout(function () { ctrl.abort(); }, 30000);
      chunks.push(r.value);
      got += r.value.length;
      var now = performance.now();
      if (now - lastPaint > 90) {
        lastPaint = now;
        ring.style.setProperty('--ld', Math.round(126 * (1 - Math.min(1, got / total))));
      }
    }
    clearTimeout(watchdog);
    ring.style.setProperty('--ld', 0);

    video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    video.load();
    video.addEventListener('canplay', ready, { once: true });
    video.addEventListener('loadeddata', ready, { once: true });
  }

  function ready() {
    if (videoReady || !video.duration) return;
    videoReady = true;
    canDrive = true;
    stage.classList.remove('loading');
    stage.classList.add('video-ready');
    lastSeek = -1;
    requestSeek(heroProgress() * video.duration);   // land where they already are
    updateBands(heroProgress());
    onScroll();
  }

  /* ============ gold dust, built once ============ */
  if (dust) {
    var dr = rng(4242), html = '';
    for (var i = 0; i < 18; i++) {
      var size = (2 + dr() * 3).toFixed(1);
      html += '<i style="left:' + (dr() * 100).toFixed(1) + '%;width:' + size + 'px;height:' + size +
              'px;animation-duration:' + (16 + dr() * 20).toFixed(1) + 's;animation-delay:-' +
              (dr() * 26).toFixed(1) + 's"></i>';
    }
    dust.innerHTML = html;
  }

  /* ============ arm and disarm, live on all five gates ============ */
  var scrubOn = false;

  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    initHeroOnce();
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(function (b) { b.op = -1; b.k = -1; });
    cueOn = null;
    updateBands(heroProgress());
    onScroll();
  }

  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
  }

  function applyHeroMode() {
    var staticMode = MQLS.some(function (m) { return m.matches; });
    if (staticMode) { disableScrub(); return; }

    // rotating a phone changes which cut of the film belongs on screen
    narrow = matchMedia(PORTRAIT_Q).matches;
    var want = pickSource();
    if (heroStarted && want.url !== current.url) {
      current = want;
      stage.classList.remove('video-ready', 'video-failed');
      fetchStarted = false; videoReady = false; canDrive = false;
      lastSeek = -1;
      poster.style.backgroundImage = "url('" + current.poster + "')";
      loadVideo();
    }
    enableScrub();
  }
  matchMedia(PORTRAIT_Q).addEventListener('change', applyHeroMode);

  MQLS.forEach(function (m) { m.addEventListener('change', applyHeroMode); });
  applyHeroMode();
  addEventListener('resize', function () { if (scrubOn) onScroll(); }, { passive: true });
})();
