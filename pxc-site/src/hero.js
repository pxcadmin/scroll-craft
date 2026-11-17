/* PXC hero: four photographs cut into depth planes, and one filmed turn.

   One progress value p (0..1) drives everything. Each scene's planes move at
   rates set by their depth (room 0, far .35, mid .65, near 1, objects 1.2+),
   so near things pass in front of far things as the camera moves. A scene
   arrives by assembling back to front and leaves by flying past the lens. The
   chaos-wide scene settles exactly onto the footage's first frame and the
   calm-wide scene starts from its last, so both handoffs are invisible.

   ?film turns the page into a renderer: window.__film(p) sets one frame and
   resolves once the footage has seeked, for tools/film.mjs to capture. */
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var stage = hero.querySelector('.hero__stage');
  var FILM = /[?&]film\b/.test(location.search);
  if (FILM) document.documentElement.classList.add('film');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches && !FILM;
  var small = matchMedia('(max-width: 860px)').matches;

  // the timeline, shared with tools/film.mjs (film seconds per segment)
  var SEG = window.PXC_HERO_SEG = [
    { id: 'c1', p0: 0.00, p1: 0.20, sec: 5.0 },
    { id: 'x1', p0: 0.20, p1: 0.26, sec: 1.2 },
    { id: 'c2', p0: 0.26, p1: 0.40, sec: 3.3 },
    { id: 'v',  p0: 0.40, p1: 0.70, sec: 6.04 },
    { id: 'k1', p0: 0.70, p1: 0.80, sec: 2.5 },
    { id: 'x2', p0: 0.80, p1: 0.85, sec: 1.2 },
    { id: 'k2', p0: 0.85, p1: 1.00, sec: 4.5 }
  ];
  var V0 = 0.40, V1 = 0.70;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(v) { v = clamp(v); return v * v * (3 - 2 * v); }
  function local(a, b, p) { return clamp((p - a) / (b - a)); }
  function bump(p, at, w) { var d = Math.abs(p - at) / w; return d >= 1 ? 0 : 1 - d * d; }

  var scenes = {};
  [].forEach.call(hero.querySelectorAll('.hx__scn'), function (el) {
    scenes[el.getAttribute('data-scn')] = {
      el: el,
      parts: [].map.call(el.querySelectorAll('[data-depth]'), function (p, i) {
        return { el: p, d: parseFloat(p.getAttribute('data-depth')), ob: p.classList.contains('hx__ob'), chip: p.classList.contains('hx__chip'), i: i, last: '' };
      })
    };
  });
  var video = hero.querySelector('.hx__video');
  var caps = [].map.call(hero.querySelectorAll('.hero__cap'), function (el) { return { el: el, w: el.getAttribute('data-at').split(' ').map(Number) }; });
  var fades = hero.querySelectorAll('.hero__fade'), labels = hero.querySelectorAll('.hero__foot [data-l]');

  // camera and arrival/departure state per scene, from p
  function state(id, p) {
    switch (id) {
      case 'c1': { var z = sm(local(0, 0.21, p)); return { on: p < 0.265, a: intro, e: local(0.20, 0.26, p), z: z, x: -0.35 * z, y: 0.1 * z }; }
      case 'c2': { var s = sm(local(0.24, V0, p)); return { on: p > 0.195 && p < V0 + 0.006, a: local(0.20, 0.27, p), e: 0, z: 0.18 * (1 - s), x: 0.9 * (1 - s), y: 0 }; }
      case 'k1': { var z2 = sm(local(V1, 0.85, p)); return { on: p > V1 - 0.006 && p < 0.855, a: 1, e: local(0.80, 0.85, p), z: z2, x: 0.25 * z2, y: 0.05 * z2 }; }
      case 'k2': { var s2 = sm(local(0.83, 1, p)); return { on: p > 0.795, a: local(0.80, 0.865, p), e: 0, z: 0.22 * s2, x: 0.5 * (1 - s2), y: 0 }; }
    }
  }

  var px = 0, py = 0, tx = 0, ty = 0, off = reduce, intro = reduce ? 1 : 0, t0 = performance.now();
  var vw = innerWidth;
  addEventListener('resize', function () { vw = innerWidth; small = matchMedia('(max-width: 860px)').matches; });

  function place(part, st, t) {
    var d = part.d, k = vw / 100;
    var scale = 1, x = 0, y = 0, op = 1, blur = 0, rot = 0;
    if (!off) {
      // the camera: depth sets how much each plane swells and slides
      scale = 1 + st.z * (0.04 + 0.30 * d * d);
      x = (-st.x * 7 * d - px * 3.2 * d) * k;
      y = (-st.y * 4 * d - py * 2.2 * d) * k;
      // arrival: back to front. The room settles first, near planes land last,
      // dropping in from in front of the lens, so you watch the scene get built.
      var aa = sm((st.a - d * 0.32) / 0.6);
      if (st.a < 1) {
        // the room comes in from slightly closer so its edges never show; people
        // and furniture rise from behind; the nearest planes drop in from in front
        scale *= d < 0.2 ? 1 + 0.05 * (1 - aa) : d < 0.8 ? 0.9 + 0.1 * aa : 1 + (1 - aa) * (0.35 + 0.3 * d);
        y += (1 - aa) * (d < 0.8 ? 3 : -2) * k * d;
        op = aa;
      }
      // departure: everything flies past the lens, the nearest first and fastest
      if (st.e > 0) {
        var ee = st.e * st.e;
        scale *= 1 + ee * (0.12 + 2.4 * d);
        blur = ee * 14 * d;
        op *= d === 0 ? 1 - sm((st.e - 0.55) / 0.45) : 1 - sm((st.e - (1 - Math.min(d, 1)) * 0.45) / 0.55);
      }
      if (part.ob || part.chip) { // floating things also breathe on their own
        y += Math.sin(t * (0.7 + part.i * 0.13) + part.i) * 0.5 * k;
        rot = Math.sin(t * 0.5 + part.i) * (part.ob ? 4 : 0.6);
        if (part.ob) blur = Math.max(blur, (d - 1.35) * 3);
      }
    } else {
      op = st.e > 0 ? 1 - sm(st.e) : st.a < 1 ? sm(st.a) : 1;
    }
    var tf = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + scale.toFixed(4) + ')' + (rot ? ' rotate(' + rot.toFixed(2) + 'deg)' : '');
    var key = tf + op.toFixed(3) + blur.toFixed(1);
    if (key === part.last) return;
    part.last = key;
    part.el.style.transform = tf;
    part.el.style.opacity = op.toFixed(3);
    part.el.style.filter = blur > 0.2 ? 'blur(' + blur.toFixed(1) + 'px)' : '';
  }

  function chipVis(part, id, p) { // chips pop in during their scene's dwell only
    if (!part.chip) return 1;
    var w = { c1: [0.02, 0.19], c2: [0.27, 0.39], k1: [0.72, 0.8], k2: [0.87, 1.01] }[id];
    return clamp((p - w[0]) / 0.03) * clamp((w[1] - p) / 0.03 + (w[1] > 1 ? 1 : 0));
  }

  function cue(el, a, b, p) {
    var v = a <= 0 ? clamp((b - p) / 0.04) : clamp((p - a) / 0.025) * (b > 1 ? 1 : clamp((b - p) / 0.025));
    el.style.opacity = v.toFixed(3);
    el.style.transform = 'translate3d(0,' + ((1 - v) * 18).toFixed(1) + 'px,0)';
    el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
  }

  // ---- the footage: fetched once, scrubbed with a lerped playhead -------
  var vReady = false, vLoading = false, vCur = 0, vTarget = 0, vDur = 6.04;
  function loadVideo() {
    if (vLoading || reduce || !video) return; vLoading = true;
    var src = video.getAttribute(small && video.getAttribute('data-src-m') ? 'data-src-m' : 'data-src');
    fetch(src).then(function (r) { return r.blob(); }).then(function (b) {
      video.addEventListener('loadeddata', function () { vReady = true; vDur = video.duration || vDur; }, { once: true });
      video.src = URL.createObjectURL(b); // setting src starts the load; calling load() too would abort it
    }).catch(function () { vLoading = false; });
  }

  var p = 0, pOverride = null, visible = true;
  function progress() {
    if (pOverride !== null) return pOverride;
    var r = hero.getBoundingClientRect(), span = r.height - innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }

  function render(now) {
    var t = (now - t0) / 1000;
    if (!FILM && intro < 1) intro = Math.min(1, (now - t0) / 1400);
    if (!FILM) { px += (tx - px) * 0.06; py += (ty - py) * 0.06; }
    p = progress();
    if (p > 0.12) loadVideo();
    var inV = p >= V0 && p <= V1;
    var useV = inV && vReady;
    // scenes
    for (var id in scenes) {
      var S = scenes[id], st = state(id, p);
      // without footage (reduced motion, still loading): cross-fade the stills across the turn
      if (!useV && inV) {
        var m = local(V0 + 0.05, V1 - 0.05, p);
        if (id === 'c2') st = { on: m < 1, a: 1, e: 0, z: 0, x: 0, y: 0, fade: 1 - m };
        if (id === 'k1') st = { on: m > 0, a: 1, e: 0, z: 0, x: 0, y: 0, fade: m };
      }
      var vis = st.on && !(useV && (id === 'c2' ? p > V0 + 0.004 : id === 'k1' ? p < V1 - 0.004 : false));
      S.el.style.visibility = vis ? 'visible' : 'hidden';
      S.el.style.opacity = vis ? (st.fade !== undefined ? st.fade : 1) : 0;
      if (!vis) continue;
      for (var i = 0; i < S.parts.length; i++) {
        place(S.parts[i], st, t);
        if (S.parts[i].chip) { var cv = chipVis(S.parts[i], id, p); S.parts[i].el.style.opacity = (parseFloat(S.parts[i].el.style.opacity) * cv).toFixed(3); }
      }
    }
    // footage
    if (video) {
      var vOn = useV;
      video.style.visibility = vOn ? 'visible' : 'hidden';
      video.style.opacity = vOn ? 1 : 0;
      if (vOn) {
        vTarget = local(V0, V1, p) * (vDur - 0.05);
        vCur = FILM ? vTarget : vCur + (vTarget - vCur) * 0.22;
        if (!video.seeking && Math.abs(video.currentTime - vCur) > 1 / 90) video.currentTime = vCur;
      }
    }
    // brand light, sweeps, copy
    var after = sm(local(0.5, 0.64, p));
    stage.style.setProperty('--after', after.toFixed(3));
    stage.style.setProperty('--pulse', (off ? 1 : 0.78 + 0.22 * Math.sin(t * 5.2)).toFixed(3));
    stage.style.setProperty('--sweep', Math.max(bump(p, 0.235, 0.03), bump(p, 0.825, 0.025)).toFixed(3));
    stage.style.setProperty('--hp', p.toFixed(4));
    for (var f = 0; f < fades.length; f++) cue(fades[f], 0, 0.075, p);
    for (var c = 0; c < caps.length; c++) cue(caps[c].el, caps[c].w[0], caps[c].w[1], p);
    for (var l = 0; l < labels.length; l++) labels[l].classList.toggle('on', (labels[l].getAttribute('data-l') === 'b') === (p >= 0.55));
    sound(after, p);
  }

  function loop(now) { if (visible || FILM) render(now); if (!FILM) requestAnimationFrame(loop); }

  // ---- film mode ------------------------------------------------------------
  if (FILM) {
    window.__film = function (pp, seconds) {
      pOverride = pp; t0 = performance.now() - (seconds || 0) * 1000;
      intro = clamp(((seconds || 0) - 0.2) / 1.6); // the film opens by building the first scene
      return new Promise(function (res) {
        var go = function () {
          render(performance.now());
          if (pp >= V0 && pp <= V1 && video && vReady && video.seeking) video.addEventListener('seeked', function () { requestAnimationFrame(function () { res(); }); }, { once: true });
          else requestAnimationFrame(function () { requestAnimationFrame(res); });
        };
        if (!vReady && pp > 0.3) { loadVideo(); var w = setInterval(function () { if (vReady) { clearInterval(w); go(); } }, 50); } else go();
      });
    };
    loadVideo();
  }

  // ---- input, motion and sound controls --------------------------------------
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

  // Sound is opt-in. Two loops, the frantic one with the phones and the calm one,
  // cross-faded by the scroll. Nothing loads until the visitor asks for it.
  var snd = hero.querySelector('[data-sound]'), ac, gains = null, soundOn = false;
  function sound(after, pp) {
    if (!gains) return;
    var g = soundOn && visible ? 0.8 : 0, n = ac.currentTime;
    gains[0].gain.setTargetAtTime(g * (1 - after), n, 0.15);
    gains[1].gain.setTargetAtTime(g * after, n, 0.25);
  }
  if (snd) snd.addEventListener('click', function () {
    soundOn = snd.getAttribute('aria-pressed') !== 'true';
    snd.setAttribute('aria-pressed', String(soundOn)); snd.textContent = soundOn ? 'Sound on' : 'Sound off';
    if (soundOn && !ac) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = new AC(); gains = [];
      ['/assets/hero/chaos-loop.m4a', '/assets/hero/calm-loop.m4a'].forEach(function (src) {
        var a = new Audio(src); a.loop = true; a.crossOrigin = 'anonymous'; a.preload = 'auto';
        var g = ac.createGain(); g.gain.value = 0; ac.createMediaElementSource(a).connect(g).connect(ac.destination);
        gains.push(g); a.play().catch(function () {});
      });
    }
    if (ac) ac[soundOn ? 'resume' : 'suspend']();
  });

  if (!FILM) requestAnimationFrame(loop);
})();
