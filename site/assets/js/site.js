/* Shared behaviour: reveals, nav, the rate board, the hallmark moment. */
(function () {
  'use strict';

  var reduceQ = matchMedia('(prefers-reduced-motion: reduce)');
  var reveals = [].slice.call(document.querySelectorAll('.reveal, .room'));

  /* ---------- section entrances, with the stagger retired afterwards ---------- */
  function settle(el) {
    // once the choreography has played, drop the delays so hovers never lag
    setTimeout(function () { el.classList.add('settled'); }, 1400);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        settle(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in', 'settled'); });
  }

  /* ---------- the nav tucks away while you read, returns when you scroll up ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var lastY = window.scrollY, ticking = false, tucked = false;
    addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var want = y > 620 && y > lastY;
        if (want !== tucked) { tucked = want; nav.classList.toggle('tucked', want); }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- the rate board ---------- */
  var grid = document.getElementById('rate-grid');
  var note = document.getElementById('rates-note');
  if (grid && window.RATES) {
    var R = window.RATES;
    var live = (R.metals || []).filter(function (m) { return m.perTola != null || m.per10g != null; });

    // rates.js is hand edited by the shop, so treat everything in it as text,
    // never as markup. A stray < or & should print, not run.
    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    // and a price is only ever a finite number
    function npr(n) {
      var v = Number(n);
      if (!isFinite(v)) return '';
      return 'Rs ' + Math.round(v).toLocaleString('en-IN');
    }

    if (live.length) {
      grid.innerHTML = live.map(function (m) {
        var main = m.perTola != null
          ? npr(m.perTola) + ' <small>per tola</small>'
          : npr(m.per10g) + ' <small>per 10 g</small>';
        var alt = (m.perTola != null && m.per10g != null)
          ? npr(m.per10g) + ' per 10 grams' : '';
        return '<div class="rate-card">' +
          '<p class="rate-metal">' + esc(m.metal) + '</p>' +
          '<p class="rate-fine">' + esc(m.fineness) + '</p>' +
          '<p class="rate-num">' + main + '</p>' +
          (alt ? '<p class="rate-alt">' + alt + '</p>' : '') +
          '</div>';
      }).join('');

      if (R.updated && note) {
        var d = new Date(R.updated + 'T00:00:00');
        if (!isNaN(d)) {
          var stamp = new Intl.DateTimeFormat('en-GB',
            { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
          note.insertAdjacentHTML('beforebegin',
            '<p class="rate-stamp">Set on ' + stamp + '</p>');
        }
      }
    } else {
      // the honest empty state: no invented price ever goes on this page
      grid.innerHTML =
        '<div class="rate-card" style="grid-column:1/-1">' +
        '<p class="rate-metal">Today</p>' +
        '<p class="rate-num" style="font-size:clamp(1.5rem,2.6vw,2rem)">' +
        'The rate is posted at the counter.</p>' +
        '<p class="rate-alt" style="margin-top:14px;font-size:14px;font-family:var(--body)">' +
        'Message us and we will send you today\'s gold and silver rate straight away.</p>' +
        '<p style="margin-top:22px"><a class="btn btn-gold" target="_blank" rel="noopener" ' +
        'href="https://wa.me/9779824540992?text=Namaste%2C%20what%20is%20today%27s%20gold%20rate%3F">' +
        'Ask for today\'s rate</a></p>' +
        '</div>';
    }
  }

  /* ---------- the metal purity bar ---------- */
  var alloyBar = document.getElementById('alloyBar');
  if (alloyBar) {
    var ALLOYS = {
      '24K': { au: 99.9, ag: 0.1, cu: 0, mark: '999',
        title: 'Pure, and proudly soft',
        note: 'It bends under a thumbnail, so it cannot hold a stone or survive being worn. ' +
              'This is the purity for bars, coins and gifting biscuits.' },
      '22K': { au: 91.6, ag: 5.0, cu: 3.4, mark: '916',
        title: 'The standard here',
        note: 'Enough silver and copper to survive daily wear, without losing the deep yellow. ' +
              'Most of our necklaces, bangles and bridal sets are made at this purity.' },
      '18K': { au: 75.0, ag: 15.0, cu: 10.0, mark: '750',
        title: 'Made to hold a stone',
        note: 'Harder than 22 carat, so a prong grips a stone and keeps gripping it. ' +
              'This is what we use when a piece has stones set into it.' },
      '14K': { au: 58.5, ag: 25.0, cu: 16.5, mark: '585',
        title: 'Built for every day',
        note: 'The toughest of the four and the kindest on budget. For a piece that gets worn ' +
              'to work, to the kitchen and to bed.' }
    };

    var picks = [].slice.call(document.querySelectorAll('.ap'));
    var ind = document.querySelector('.ap-ind');
    var segAu = alloyBar.querySelector('.au'), segAg = alloyBar.querySelector('.ag'),
        segCu = alloyBar.querySelector('.cu');
    var elK = document.getElementById('alloyK'), elP = document.getElementById('alloyP');
    var elAu = document.getElementById('pcAu'), elAg = document.getElementById('pcAg'),
        elCu = document.getElementById('pcCu');
    var elT = document.getElementById('alloyTitle'), elN = document.getElementById('alloyNote');

    function slide(btn) {
      ind.style.setProperty('--px', btn.offsetLeft - 5 + 'px');
      ind.style.setProperty('--pw', btn.offsetWidth + 'px');
      ind.classList.add('ready');
    }

    function setK(k) {
      var a = ALLOYS[k];
      if (!a) return;
      picks.forEach(function (b) {
        var on = b.getAttribute('data-k') === k;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      segAu.style.setProperty('--w', a.au + '%');
      segAg.style.setProperty('--w', a.ag + '%');
      segCu.style.setProperty('--w', a.cu + '%');
      // a sliver too narrow for its label just drops the label
      segAu.classList.toggle('tiny', a.au < 9);
      segAg.classList.toggle('tiny', a.ag < 9);
      segCu.classList.toggle('tiny', a.cu < 9);
      elK.textContent = k;
      elP.textContent = a.au + '% gold, stamped ' + a.mark;
      elAu.textContent = a.au.toFixed(1) + '%';
      elAg.textContent = a.ag.toFixed(1) + '%';
      elCu.textContent = a.cu.toFixed(1) + '%';
      elT.textContent = a.title;
      elN.textContent = a.note;
      alloyBar.setAttribute('aria-label',
        k + ' gold is ' + a.au + ' percent gold, ' + a.ag + ' percent silver and ' +
        a.cu + ' percent copper');
      slide(picks.filter(function (b) { return b.getAttribute('data-k') === k; })[0]);
    }

    picks.forEach(function (b) {
      b.addEventListener('click', function () { setK(b.getAttribute('data-k')); });
    });
    // the indicator needs a laid-out page before it can measure anything
    requestAnimationFrame(function () { setK('22K'); });
    addEventListener('resize', function () {
      var on = document.querySelector('.ap.on');
      if (on) slide(on);
    }, { passive: true });
  }

  /* ---------- pause every loop on a hidden tab ---------- */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* ---------- mark the current page in the nav ---------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  [].forEach.call(document.querySelectorAll('.nav-links a'), function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------- reduced motion flipped on mid-session: show final states ---------- */
  reduceQ.addEventListener('change', function (e) {
    if (e.matches) reveals.forEach(function (el) { el.classList.add('in', 'settled'); });
  });

  /* ============================================================
     MOBILE MENU — built from the nav that is already in the page
     ============================================================ */
  (function () {
    var act = document.querySelector('.nav-act');
    var links = document.querySelectorAll('.nav-links a');
    if (!act || !links.length) return;

    var btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open the menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    act.appendChild(btn);

    var sheet = document.createElement('div');
    sheet.className = 'msheet';
    sheet.id = 'msheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Menu');
    var html = '<a href="index.html">Home</a>';
    [].forEach.call(links, function (a) {
      html += '<a href="' + a.getAttribute('href') + '">' + a.textContent + '</a>';
    });
    html += '<div class="msheet-act">' +
      '<a class="btn btn-gold" target="_blank" rel="noopener" href="https://wa.me/9779824540992">Message on WhatsApp</a>' +
      '<a class="btn btn-ghost" href="tel:+9779824540992">Call 982 4540992</a></div>';
    sheet.innerHTML = html;
    document.body.appendChild(sheet);
    btn.setAttribute('aria-controls', 'msheet');

    var open = false, lastFocus = null;

    function setOpen(v) {
      open = v;
      sheet.classList.toggle('open', v);
      document.body.classList.toggle('menu-open', v);
      btn.setAttribute('aria-expanded', v ? 'true' : 'false');
      btn.setAttribute('aria-label', v ? 'Close the menu' : 'Open the menu');
      if (v) { lastFocus = document.activeElement; sheet.querySelector('a').focus(); }
      else if (lastFocus) lastFocus.focus();
    }

    btn.addEventListener('click', function () { setOpen(!open); });
    sheet.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
    addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;
      var f = sheet.querySelectorAll('a');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches && open) setOpen(false);
    });
  })();

  /* ============================================================
     THE CURSOR, THE MAGNETIC BUTTONS AND THE CARD TILT
     Fine pointers only, and off entirely under reduced motion.
     ============================================================ */
  (function () {
    var fine = matchMedia('(pointer: fine)');
    if (!fine.matches || reduceQ.matches) return;

    /* --- lerp-following cursor --- */
    var ring = document.createElement('div');
    ring.className = 'cur';
    ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML = '<span class="cur-label"></span>';
    var dot = document.createElement('div');
    dot.className = 'cur-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(ring, dot);
    var label = ring.querySelector('.cur-label');

    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, curRaf = null;

    function curTick(now) {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      dot.style.transform = 'translate3d(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px,0)';
      if (Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1) { curRaf = null; return; }
      curRaf = requestAnimationFrame(curTick);
    }

    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      document.body.classList.add('cursor-on');
      if (curRaf === null) curRaf = requestAnimationFrame(curTick);
    }, { passive: true });
    addEventListener('pointerleave', function () { document.body.classList.remove('cursor-on'); });

    var HOT = 'a, button, summary, .cc, .pc';
    addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest(HOT);
      if (!t) return;
      document.body.classList.add('cur-hot');
      var l = t.getAttribute('data-cursor') ||
              (t.matches('.cc, .pc') ? 'View' :
               t.closest('.fq') ? 'Open' : '');
      label.textContent = l;
    });
    addEventListener('pointerout', function (e) {
      if (e.target.closest && e.target.closest(HOT)) {
        document.body.classList.remove('cur-hot');
        label.textContent = '';
      }
    });

    /* --- magnetic pull on the primary buttons --- */
    [].forEach.call(document.querySelectorAll('.btn-gold, .btn-ghost, .ico'), function (b) {
      b.classList.add('mag');
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        b.style.setProperty('--mx', (dx * 0.22).toFixed(1) + 'px');
        b.style.setProperty('--my', (dy * 0.3).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () {
        b.style.setProperty('--mx', '0px');
        b.style.setProperty('--my', '0px');
      });
    });

    /* --- tilt on the picture cards --- */
    [].forEach.call(document.querySelectorAll('.cc, .pc'), function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        c.style.setProperty('--ty', (px * 6).toFixed(2) + 'deg');
        c.style.setProperty('--tx', (-py * 6).toFixed(2) + 'deg');
        c.classList.add('tilted');
      });
      c.addEventListener('pointerleave', function () {
        c.style.setProperty('--tx', '0deg');
        c.style.setProperty('--ty', '0deg');
        c.classList.remove('tilted');
      });
    });
  })();
})();

/* ============================================================
   LEVEL-UP LAYER
   Border glow, gooey pills, the statement marquee, line masks.
   ============================================================ */
(function () {
  'use strict';
  var reduceQ = matchMedia('(prefers-reduced-motion: reduce)');
  var fine = matchMedia('(pointer: fine)');

  /* ---------- line mask reveal on the big page headings ---------- */
  [].forEach.call(document.querySelectorAll('.phead-h, .room-inner .h2'), function (h) {
    var parts = h.innerHTML.split(/<br\s*\/?>/i);
    if (parts.length < 2) parts = [h.innerHTML];
    h.innerHTML = parts.map(function (p) {
      return '<span class="lm"><span>' + p.trim() + '</span></span>';
    }).join('');
  });

  /* ---------- border glow ---------- */
  if (fine.matches && !reduceQ.matches) {
    [].forEach.call(document.querySelectorAll('.pc, .cc, .rate-card, .step, .pr'), function (card) {
      card.classList.add('bglow');
      var light = document.createElement('span');
      light.className = 'edge-light';
      light.setAttribute('aria-hidden', 'true');
      card.appendChild(light);

      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        var cx = r.width / 2, cy = r.height / 2;
        var dx = x - cx, dy = y - cy;
        var kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
        var ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
        var edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
        var deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (deg < 0) deg += 360;
        card.style.setProperty('--edge-proximity', (edge * 100).toFixed(2));
        card.style.setProperty('--cursor-angle', deg.toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--edge-proximity', '0');
      });
    });
  }

  /* ---------- the collection pills, with a gliding gold indicator ---------- */
  var pills = document.querySelector('.pills');
  if (pills) {
    var links = [].slice.call(pills.querySelectorAll('a'));
    var ind = document.createElement('span');
    ind.className = 'pill-ind';
    ind.setAttribute('aria-hidden', 'true');
    pills.querySelector('.pills-in').prepend(ind);

    var burst = document.createElement('span');
    burst.className = 'pill-burst';
    burst.setAttribute('aria-hidden', 'true');
    pills.querySelector('.pills-in').appendChild(burst);

    function glide(a) {
      links.forEach(function (l) { l.classList.toggle('on', l === a); });
      ind.style.setProperty('--px', a.offsetLeft + 'px');
      ind.style.setProperty('--pw', a.offsetWidth + 'px');
      ind.classList.add('ready');
    }

    function spark(a) {
      if (reduceQ.matches) return;
      burst.innerHTML = '';
      var cx = a.offsetLeft + a.offsetWidth / 2;
      for (var i = 0; i < 12; i++) {
        var ang = (i / 12) * Math.PI * 2 + (Math.random() - .5) * .4;
        var dist = 26 + Math.random() * 26;
        var s = document.createElement('i');
        s.style.setProperty('--bx', cx + 'px');
        s.style.setProperty('--ex', (Math.cos(ang) * dist).toFixed(1) + 'px');
        s.style.setProperty('--ey', (Math.sin(ang) * dist).toFixed(1) + 'px');
        s.style.setProperty('--bs', (0.4 + Math.random() * 0.9).toFixed(2));
        s.style.setProperty('--bt', (520 + Math.random() * 260).toFixed(0) + 'ms');
        burst.appendChild(s);
      }
      setTimeout(function () { burst.innerHTML = ''; }, 900);
    }

    links.forEach(function (a) {
      a.addEventListener('click', function () { glide(a); spark(a); });
    });

    // the pills follow the section you are actually reading
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = secs.indexOf(e.target);
          if (i > -1) glide(links[i]);
        });
      }, { rootMargin: '-30% 0px -55% 0px' });
      secs.forEach(function (s) { if (s) spy.observe(s); });
    }
    glide(links[0]);
    addEventListener('resize', function () {
      var on = pills.querySelector('a.on');
      if (on) glide(on);
    }, { passive: true });
  }

  /* ---------- the statement marquee, carried along by scroll ---------- */
  var mq = document.querySelector('.mq');
  if (mq) {
    var track = mq.querySelector('.mq-track');
    var first = track.firstElementChild;
    // duplicate until the track comfortably clears the widest screen
    while (track.scrollWidth < 3200) track.appendChild(first.cloneNode(true));
    var unit = first.getBoundingClientRect().width;

    var off = 0, vel = 0, lastY = scrollY, mqRaf = null, onScreen = false;

    function mqTick() {
      var base = reduceQ.matches ? 0 : 0.42;
      off -= base + vel;
      vel *= 0.92;
      if (off <= -unit) off += unit;
      if (off > 0) off -= unit;
      track.style.setProperty('--mqx', off.toFixed(1) + 'px');
      if (onScreen) mqRaf = requestAnimationFrame(mqTick);
      else mqRaf = null;
    }

    addEventListener('scroll', function () {
      var dy = scrollY - lastY;
      lastY = scrollY;
      vel += Math.max(-14, Math.min(14, dy * 0.11));
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        onScreen = e[0].isIntersecting;
        if (onScreen && mqRaf === null) mqRaf = requestAnimationFrame(mqTick);
      }, { threshold: 0 }).observe(mq);
    } else { onScreen = true; mqRaf = requestAnimationFrame(mqTick); }
  }
})();

/* ============================================================
   BUTTON CHEVRON RINGS
   Added here rather than in the markup so every button on every
   page gets one without touching five files.
   ============================================================ */
(function () {
  'use strict';
  var CHEV = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2.5 7.8 6 4 9.5"/></svg>';
  [].forEach.call(document.querySelectorAll('.btn-gold, .btn-ghost, .btn-wa'), function (b) {
    if (b.querySelector('.b-ring')) return;
    var r = document.createElement('span');
    r.className = 'b-ring';
    r.setAttribute('aria-hidden', 'true');
    r.innerHTML = CHEV;
    b.insertBefore(r, b.firstChild);
  });
})();

/* ============================================================
   THE MAP, LOADED ONLY WHEN ASKED
   Google sets cookies, so no request goes out until the visitor
   presses the button. Nothing here runs on any other page.
   ============================================================ */
(function () {
  'use strict';
  var holder = document.getElementById('map-holder');
  var btn = document.getElementById('map-load');
  if (!holder || !btn) return;

  btn.addEventListener('click', function () {
    var src = holder.getAttribute('data-map');
    if (!src) return;
    var f = document.createElement('iframe');
    f.title = 'Map showing the location of Baleram Ramashankar Jewellers in Nepalgunj';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer';
    f.setAttribute('allowfullscreen', '');
    f.src = src;
    holder.innerHTML = '';
    holder.appendChild(f);
    holder.classList.add('map-live');
  });
})();
