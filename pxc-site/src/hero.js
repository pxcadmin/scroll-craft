/* PXC hero: a perspective camera travelling through a real 3D room.
   Scroll drives depth, an idle drift keeps it alive, the pointer only adds. */
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var stage = hero.querySelector('.hero__stage'), scene = hero.querySelector('.scene'), cam = hero.querySelector('.scene__cam');
  var objs = [].map.call(hero.querySelectorAll('.o, .lamp, [data-z]'), function (el) {
    return { el: el, z: parseFloat(el.getAttribute('data-z') || el.style.getPropertyValue('--z')) || 0, late: el.hasAttribute('data-late'), o: -1 };
  });
  var fades = hero.querySelectorAll('.hero__fade'), caps = hero.querySelectorAll('.hero__cap'), labels = hero.querySelectorAll('.hero__foot [data-l]');
  var P = 900, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var off = reduce, px = 0, py = 0, tx = 0, ty = 0, p = 0, shown = 0, visible = true, t0 = performance.now();
  // camera depth over scroll progress: push in, build, pass the doorway, settle, ease back 2%
  var KEYS = [[0, 0], [0.22, 150], [0.5, 780], [0.78, 1760], [0.93, 1905], [1, 1868]];
  function camZ(t) {
    for (var i = 1; i < KEYS.length; i++) if (t <= KEYS[i][0]) {
      var a = KEYS[i - 1], b = KEYS[i], u = (t - a[0]) / (b[0] - a[0]);
      u = u * u * (3 - 2 * u); return a[1] + (b[1] - a[1]) * u;
    }
    return KEYS[KEYS.length - 1][1];
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function fit() {
    var w = stage.clientWidth, h = stage.clientHeight, small = w <= 860;
    scene.style.setProperty('--k', (small ? w / 860 : Math.max(w / 1600, h / 900)).toFixed(4));
  }
  function progress() {
    var r = hero.getBoundingClientRect(), span = r.height - innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }
  function cue(el, a, b) { // plateau window with soft edges
    var v = a <= 0 && p < b - 0.08 ? 1 : clamp((p - a) / 0.07) * clamp((b - p) / 0.08);
    if (b >= 1) v = clamp((p - a) / 0.07);
    el.style.opacity = v.toFixed(3);
    el.style.transform = 'translate3d(0,' + ((1 - v) * 18).toFixed(1) + 'px,0)';
    el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
  }
  function frame(now) {
    if (visible) {
      p = progress();
      // motion off: two still compositions, cross-faded, no travel
      var target = off ? (p < 0.5 ? 0.1 : 0.97) : p;
      shown += (target - shown) * (off ? 0.12 : 0.14);
      if (Math.abs(target - shown) < 0.0004) shown = target;
      var z = camZ(shown), t = (now - t0) / 1000, idle = off ? 0 : 1;
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      var cx = -48 * clamp(shown / 0.5) - px * 46 + Math.sin(t * 1.047) * 6.4 * idle;   // 6s loop, about 0.4% of the frame
      var cy = py * -26 + Math.cos(t * 0.785) * 3.6 * idle;
      cam.style.setProperty('--cam-z', z.toFixed(1) + 'px');
      cam.style.setProperty('--cam-x', cx.toFixed(1) + 'px');
      cam.style.setProperty('--cam-y', cy.toFixed(1) + 'px');
      cam.style.setProperty('--cam-ry', (px * 2.2).toFixed(2) + 'deg');
      cam.style.setProperty('--cam-rx', (py * -1.4).toFixed(2) + 'deg');
      var late = clamp((shown - 0.16) / 0.2);
      for (var i = 0; i < objs.length; i++) {
        var o = objs[i], zz = o.z + z, v = clamp((P * 0.86 - zz) / (P * 0.3));
        if (o.late) v *= late;
        v = Math.round(v * 50) / 50;
        if (v !== o.o) { o.o = v; o.el.style.opacity = v; o.el.style.visibility = v ? 'visible' : 'hidden'; }
      }
      stage.style.setProperty('--after', clamp((shown - 0.5) / 0.3).toFixed(3));
      stage.style.setProperty('--hp', p.toFixed(4));
      for (var f = 0; f < fades.length; f++) cue(fades[f], 0, 0.2);
      if (caps[0]) cue(caps[0], 0.2, 0.47);
      if (caps[1]) cue(caps[1], 0.5, 0.75);
      if (caps[2]) cue(caps[2], 0.8, 1);
      for (var l = 0; l < labels.length; l++) labels[l].classList.toggle('on', (labels[l].getAttribute('data-l') === 'b') === (p >= 0.62));
      if (window.PXCsound) window.PXCsound(1 - clamp((p - 0.3) / 0.35));
    }
    requestAnimationFrame(frame);
  }
  fit(); addEventListener('resize', fit);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('pointermove', function (e) { if (off) return; tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  }
  // Pause motion
  var pause = hero.querySelector('[data-pause]');
  function setOff(v) { off = v; document.documentElement.classList.toggle('motion-off', v); if (v) { tx = ty = 0; } if (pause) { pause.setAttribute('aria-pressed', String(v)); pause.textContent = v ? 'Play motion' : 'Pause motion'; } }
  setOff(off);
  if (pause) pause.addEventListener('click', function () { setOff(!off); });
  // Sound: off by default, synthesised, nothing downloaded. Two soft tones in the busy room, silence in the calm one.
  var snd = hero.querySelector('[data-sound]'), ac, gain, level = 0;
  if (snd) snd.addEventListener('click', function () {
    var on = snd.getAttribute('aria-pressed') !== 'true';
    snd.setAttribute('aria-pressed', String(on)); snd.textContent = on ? 'Sound on' : 'Sound off';
    if (on && !ac) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = new AC(); gain = ac.createGain(); gain.gain.value = 0; gain.connect(ac.destination);
      [440, 480].forEach(function (f) { var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(gain); o.start(); });
      (function ringLoop() { // ring for 0.9s every 2.6s, scaled by how much of the busy room is left
        if (!ac) return; var n = ac.currentTime, g = 0.028 * level;
        gain.gain.cancelScheduledValues(n); gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(g, n + 0.05); gain.gain.setValueAtTime(g, n + 0.85); gain.gain.linearRampToValueAtTime(0, n + 0.95);
        setTimeout(ringLoop, 2600);
      })();
    }
    if (ac) ac[on ? 'resume' : 'suspend']();
  });
  window.PXCsound = function (v) { level = v; };
  requestAnimationFrame(frame);
})();
