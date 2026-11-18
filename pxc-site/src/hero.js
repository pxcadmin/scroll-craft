/* PXC hero: one clinic, filmed and photographed, moving in true depth.

   Built to the scroll-craft approved-collection rules (references/devices.md,
   "Layered scenes"; references/approved-collection.md §2):
   - each photograph is three or four planes: room, far, mid, near
   - adjacent planes move at rates 10 to 15 percent apart (0.69, 0.80, 0.89, 1.0)
   - total travel stays under about 130px, dolly scale under 5 percent
   - scenes change by a plain film dissolve; nothing flies, floats or blurs
   - real motion (the turn, the walk to the exam room) is filmed footage, and
     each still lands frame-identically on the footage it hands to

   One progress value p (0..1) drives everything. ?film turns the page into a
   renderer: window.__film(p) sets a frame and resolves once footage has seeked. */
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var stage = hero.querySelector('.hero__stage');
  var FILM = /[?&]film\b/.test(location.search);
  if (FILM) document.documentElement.classList.add('film');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches && !FILM;
  var small = matchMedia('(max-width: 860px)').matches;

  // The timeline. sec is film time; tools/film.mjs reads this.
  var SEG = window.PXC_HERO_SEG = [
    { id: 'c1', p0: 0.00, p1: 0.18, sec: 5.0 },   // packed waiting room
    { id: 'd1', p0: 0.18, p1: 0.22, sec: 1.0 },   // dissolve
    { id: 'c2', p0: 0.22, p1: 0.34, sec: 3.0 },   // the wide desk, settling onto the footage
    { id: 'v1', p0: 0.34, p1: 0.58, sec: 6.04 },  // the turn (footage)
    { id: 'k1', p0: 0.58, p1: 0.66, sec: 2.2 },   // the calm desk
    { id: 'd2', p0: 0.66, p1: 0.70, sec: 1.0 },   // dissolve
    { id: 'k2', p0: 0.70, p1: 0.76, sec: 1.6 },   // the walk back, settling onto the footage
    { id: 'v2', p0: 0.76, p1: 1.00, sec: 6.04 }   // the walk (footage)
  ];
  var VID = { v1: [0.34, 0.58], v2: [0.76, 1.00] };

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(v) { v = clamp(v); return v * v * (3 - 2 * v); }
  function local(a, b, p) { return clamp((p - a) / (b - a)); }

  var scenes = {};
  [].forEach.call(hero.querySelectorAll('.hx__scn'), function (el) {
    scenes[el.getAttribute('data-scn')] = {
      el: el, last: '',
      parts: [].map.call(el.querySelectorAll('[data-depth]'), function (p) { return { el: p, d: parseFloat(p.getAttribute('data-depth')), last: '' }; })
    };
  });
  var videos = {};
  [].forEach.call(hero.querySelectorAll('.hx__video'), function (el) {
    videos[el.getAttribute('data-vid')] = { el: el, ready: false, loading: false, cur: 0, dur: 6.04 };
  });
  var caps = [].map.call(hero.querySelectorAll('.hero__cap'), function (el) { return { el: el, w: el.getAttribute('data-at').split(' ').map(Number) }; });
  var fades = hero.querySelectorAll('.hero__fade'), labels = hero.querySelectorAll('.hero__foot [data-l]');

  // Camera per scene: x is a lateral truck (-1..1), z a dolly (0..1), o the scene's opacity.
  // c2 and k2 end at x=0, z=0 exactly where their footage begins; k1 starts there.
  function cam(id, p) {
    switch (id) {
      case 'c1': { var u = sm(local(0, 0.22, p)); return { o: 1 - sm(local(0.18, 0.22, p)), x: -u, z: u }; }
      case 'c2': { var s = sm(local(0.18, 0.34, p)); return { o: sm(local(0.18, 0.22, p)), x: 0.9 * (1 - s), z: 0.7 * (1 - s) }; }
      case 'k1': { var w = sm(local(0.58, 0.70, p)); return { o: 1 - sm(local(0.66, 0.70, p)), x: 0.8 * w, z: w }; }
      case 'k2': { var r = sm(local(0.66, 0.76, p)); return { o: sm(local(0.66, 0.70, p)), x: -0.7 * (1 - r), z: 0.6 * (1 - r) }; }
    }
  }
  function sceneOn(id, p) {
    return { c1: p < 0.22, c2: p >= 0.18 && p <= 0.34, k1: p >= 0.58 && p < 0.70, k2: p >= 0.66 && p <= 0.76 }[id];
  }

  var px = 0, py = 0, tx = 0, ty = 0, off = reduce, t0 = performance.now();
  var vw = innerWidth;
  addEventListener('resize', function () { vw = innerWidth; small = matchMedia('(max-width: 860px)').matches; });

  function place(part, c, t) {
    var rate = 0.69 + 0.31 * part.d;            // room .69, far .80, mid .89, near 1.0
    var k = Math.min(vw, 1920) / 1440;          // travel scales with the frame, capped
    var x = 0, y = 0, s = 1.08; // 8% overscan, matched on the footage, so travel never shows an edge
    if (!off) {
      x = (-c.x * 64 * rate - px * 14 * rate) * k;   // at most ~78px for the nearest plane
      y = (-py * 8 * rate + Math.sin(t * 0.9) * 1.5 * rate) * k; // a held-camera breath
      s *= 1 + c.z * 0.045 * rate;                  // dolly: nearer planes grow a little more
    }
    var tf = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + s.toFixed(4) + ')';
    if (tf !== part.last) { part.last = tf; part.el.style.transform = tf; }
  }

  function cue(el, a, b, p) {
    var v = a <= 0 ? clamp((b - p) / 0.04) : clamp((p - a) / 0.02) * (b > 1 ? 1 : clamp((b - p) / 0.02));
    el.style.opacity = v.toFixed(3);
    el.style.transform = 'translate3d(0,' + ((1 - v) * 18).toFixed(1) + 'px,0)';
    el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
  }

  // ---- footage: each clip fetched once, scrubbed with a lerped playhead ----
  function loadVideo(V) {
    if (V.loading || reduce) return; V.loading = true;
    var el = V.el, src = el.getAttribute(small && el.getAttribute('data-src-m') ? 'data-src-m' : 'data-src');
    fetch(src).then(function (r) { return r.blob(); }).then(function (b) {
      el.addEventListener('loadeddata', function () { V.ready = true; V.dur = el.duration || V.dur; }, { once: true });
      el.src = URL.createObjectURL(b); // setting src starts the load
    }).catch(function () { V.loading = false; });
  }

  // Later scenes load lazily, then all at once as soon as the visitor starts
  // moving or the page has settled, so a plane never arrives after its scene.
  var warmed = false;
  function warmImages() {
    if (warmed) return; warmed = true;
    [].forEach.call(hero.querySelectorAll('.hx img'), function (img) { img.loading = 'eager'; });
  }
  addEventListener('load', function () { setTimeout(warmImages, 1500); });
  function imagesReady() {
    warmImages();
    var imgs = [].slice.call(hero.querySelectorAll('.hx img'));
    return Promise.all(imgs.map(function (i) { return i.decode ? i.decode().catch(function () {}) : Promise.resolve(); }));
  }

  var p = 0, pOverride = null, visible = true;
  function progress() {
    if (pOverride !== null) return pOverride;
    var r = hero.getBoundingClientRect(), span = r.height - innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }

  function render(now) {
    var t = (now - t0) / 1000;
    if (!FILM) { px += (tx - px) * 0.06; py += (ty - py) * 0.06; }
    p = progress();
    if (p > 0.03) warmImages();
    if (p > 0.08) loadVideo(videos.v1);
    if (p > 0.45) loadVideo(videos.v2);

    // which footage owns the frame right now
    var active = null;
    for (var vid in VID) if (p >= VID[vid][0] && p <= VID[vid][1] && videos[vid] && videos[vid].ready) active = vid;

    for (var id in scenes) {
      var S = scenes[id], c = cam(id, p), on = sceneOn(id, p);
      // without footage (reduced motion, still loading), dissolve the stills across it
      if (!active) {
        if (p > 0.34 && p < 0.58) { var m = local(0.40, 0.52, p); if (id === 'c2') { on = m < 1; c = { o: 1 - m, x: 0, z: 0 }; } if (id === 'k1') { on = m > 0; c = { o: m, x: 0, z: 0 }; } }
        if (p > 0.76 && id === 'k2') { on = true; c = { o: 1, x: 0, z: 0 }; }
      }
      if (active === 'v1' && (id === 'c2' || id === 'k1')) on = false;
      if (active === 'v2' && id === 'k2') on = false;
      var key = (on ? 1 : 0) + ':' + (on ? c.o.toFixed(3) : 0);
      if (key !== S.last) { S.last = key; S.el.style.visibility = on ? 'visible' : 'hidden'; S.el.style.opacity = on ? c.o.toFixed(3) : 0; }
      if (!on) continue;
      for (var i = 0; i < S.parts.length; i++) place(S.parts[i], c, t);
    }
    for (var v in videos) {
      var V = videos[v], show = v === active;
      V.el.style.visibility = show ? 'visible' : 'hidden';
      if (!show && V.ready) {
        // park off-screen footage on the frame it will be entered at, so the
        // first visible frame is never a stale one
        var park = p < VID[v][0] ? 0 : V.dur - 0.05;
        if (!V.el.seeking && Math.abs(V.el.currentTime - park) > 0.02) { V.el.currentTime = park; V.cur = park; }
      }
      if (show) {
        var target = local(VID[v][0], VID[v][1], p) * (V.dur - 0.05);
        V.cur = FILM ? target : V.cur + (target - V.cur) * 0.22;
        if (!V.el.seeking && Math.abs(V.el.currentTime - V.cur) > 1 / 90) V.el.currentTime = V.cur;
      }
    }
    var after = sm(local(0.44, 0.56, p));
    stage.style.setProperty('--after', after.toFixed(3));
    stage.style.setProperty('--hp', p.toFixed(4));
    for (var f = 0; f < fades.length; f++) cue(fades[f], 0, 0.07, p);
    for (var q = 0; q < caps.length; q++) cue(caps[q].el, caps[q].w[0], caps[q].w[1], p);
    for (var l = 0; l < labels.length; l++) labels[l].classList.toggle('on', (labels[l].getAttribute('data-l') === 'b') === (p >= 0.5));
    sound(after);
    return active;
  }

  function loop(now) { if (visible) render(now); if (!FILM) requestAnimationFrame(loop); }

  // ---- film mode ----------------------------------------------------------
  if (FILM) {
    window.__filmReady = imagesReady();
    window.__film = function (pp, seconds) {
      pOverride = pp; t0 = performance.now() - (seconds || 0) * 1000;
      return new Promise(function (res) {
        var need = null;
        for (var vid in VID) if (pp >= VID[vid][0] && pp <= VID[vid][1]) need = videos[vid];
        var go = function () {
          var active = render(performance.now());
          var V = active && videos[active];
          // wait for the decoded frame to be on screen, not just for the seek to finish
          var painted = function () {
            var done = false, fin = function () { if (!done) { done = true; requestAnimationFrame(function () { requestAnimationFrame(res); }); } };
            if (V.el.requestVideoFrameCallback) V.el.requestVideoFrameCallback(fin);
            setTimeout(fin, 250); // headless Chrome may not report a paused, seeked frame
          };
          if (V && V.el.seeking) V.el.addEventListener('seeked', painted, { once: true });
          else requestAnimationFrame(function () { requestAnimationFrame(res); });
        };
        if (need && !need.ready) { loadVideo(need); var w = setInterval(function () { if (need.ready) { clearInterval(w); go(); } }, 50); } else go();
      });
    };
    for (var vv in videos) loadVideo(videos[vv]);
  }

  // ---- input, motion and sound controls ---------------------------------------
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
  if (!FILM && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('pointermove', function (e) { if (off) return; tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  }
  var pause = hero.querySelector('[data-pause]');
  function setOff(v) {
    off = v; tx = ty = 0;
    document.documentElement.classList.toggle('motion-off', v);
    for (var id in scenes) scenes[id].parts.forEach(function (pt) { pt.last = ''; });
    if (pause) { pause.setAttribute('aria-pressed', String(v)); pause.textContent = v ? 'Play motion' : 'Pause motion'; }
  }
  setOff(off);
  if (pause) pause.addEventListener('click', function () { setOff(!off); });

  // Sound is opt-in: the busy room (music, phones, whispers) and the calm room,
  // cross-faded by the scroll. Nothing downloads until the visitor asks.
  var snd = hero.querySelector('[data-sound]'), ac, gains = null, soundOn = false;
  function sound(after) {
    if (!gains) return;
    var g = soundOn && visible ? 0.85 : 0, n = ac.currentTime;
    gains[0].gain.setTargetAtTime(g * (1 - after), n, 0.15);
    gains[1].gain.setTargetAtTime(g * after, n, 0.3);
  }
  if (snd) snd.addEventListener('click', function () {
    soundOn = snd.getAttribute('aria-pressed') !== 'true';
    snd.setAttribute('aria-pressed', String(soundOn)); snd.textContent = soundOn ? 'Sound on' : 'Sound off';
    if (soundOn && !ac) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = new AC(); gains = [];
      ['/assets/hero/chaos-loop.m4a', '/assets/hero/calm-loop.m4a'].forEach(function (src) {
        var a = new Audio(src); a.loop = true; a.preload = 'auto';
        var g = ac.createGain(); g.gain.value = 0; ac.createMediaElementSource(a).connect(g).connect(ac.destination);
        gains.push(g); a.play().catch(function () {});
      });
    }
    if (ac) ac[soundOn ? 'resume' : 'suspend']();
  });

  if (!FILM) requestAnimationFrame(loop);
})();
