/* PXC hero: a real clinic, filmed as one camera move from chaos to calm.
   The engine scrubs the footage. This file drives what floats in front of it:
   glass chips at their own depths, the brand glow, captions and controls. */
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var stage = hero.querySelector('.hero__stage');
  var chips = [].map.call(hero.querySelectorAll('.hchip'), function (el) {
    return { el: el, d: parseFloat(el.style.getPropertyValue('--d')) || 0.5, calm: el.classList.contains('hchip--calm') };
  });
  var fades = hero.querySelectorAll('.hero__fade'), caps = hero.querySelectorAll('.hero__cap'), labels = hero.querySelectorAll('.hero__foot [data-l]');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var off = reduce, px = 0, py = 0, tx = 0, ty = 0, p = 0, visible = true, t0 = performance.now();
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function progress() {
    var r = hero.getBoundingClientRect(), span = r.height - innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }
  function cue(el, a, b) {
    var v = a <= 0 ? clamp((b - p) / 0.08) : clamp((p - a) / 0.07) * (b >= 1 ? 1 : clamp((b - p) / 0.08));
    el.style.opacity = v.toFixed(3);
    el.style.transform = 'translate3d(0,' + ((1 - v) * 18).toFixed(1) + 'px,0)';
    el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
  }
  function frame(now) {
    if (visible) {
      p = progress();
      var t = (now - t0) / 1000, idle = off ? 0 : 1;
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      var after = clamp((p - 0.38) / 0.4);
      stage.style.setProperty('--after', after.toFixed(3));
      stage.style.setProperty('--hp', p.toFixed(4));
      // the footage itself: a slight counter-move to the pointer, plus breath
      stage.style.setProperty('--mx', (-px * 14 + Math.sin(t * 1.047) * 4 * idle).toFixed(1) + 'px');
      stage.style.setProperty('--my', (-py * 9 + Math.cos(t * 0.785) * 2.5 * idle).toFixed(1) + 'px');
      for (var i = 0; i < chips.length; i++) {
        var c = chips[i], d = c.d;
        // chaos chips rush past the lens as the camera pushes in; calm chips arrive from depth
        var v = c.calm ? clamp((p - 0.8) / 0.1) : clamp((0.42 - p) / 0.14);
        var push = c.calm ? (1 - v) * -60 * d : p * 900 * d * d;
        var x = px * 42 * d + (c.calm ? 0 : (parseFloat(c.el.style.getPropertyValue('--x')) - 50) * p * 6 * d);
        var y = py * 26 * d - p * 140 * d + (off ? 0 : Math.sin(t * (0.6 + d) + i) * 5 * d);
        var s = 1 + (c.calm ? (1 - v) * 0.25 : p * 1.6 * d);
        c.el.style.opacity = v.toFixed(3);
        c.el.style.visibility = v < 0.01 ? 'hidden' : 'visible';
        c.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
        c.el.style.filter = c.calm ? 'none' : 'blur(' + Math.max(0, (d - 0.5) * 3 + p * 10 * d).toFixed(1) + 'px)';
        void push;
      }
      for (var f = 0; f < fades.length; f++) cue(fades[f], 0, 0.2);
      if (caps[0]) cue(caps[0], 0.2, 0.46);
      if (caps[1]) cue(caps[1], 0.48, 0.72);
      if (caps[2]) cue(caps[2], 0.78, 1);
      for (var l = 0; l < labels.length; l++) labels[l].classList.toggle('on', (labels[l].getAttribute('data-l') === 'b') === (p >= 0.6));
      level = 1 - clamp((p - 0.3) / 0.3);
    }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(hero);
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('pointermove', function (e) { if (off) return; tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  }
  var pause = hero.querySelector('[data-pause]');
  function setOff(v) {
    off = v; tx = ty = 0;
    document.documentElement.classList.toggle('motion-off', v);
    if (pause) { pause.setAttribute('aria-pressed', String(v)); pause.textContent = v ? 'Play motion' : 'Pause motion'; }
  }
  setOff(off);
  if (pause) pause.addEventListener('click', function () { setOff(!off); });
  // Sound: off by default, synthesised, nothing downloaded. A soft two-tone ring while the clinic is busy, silence once it is calm.
  var snd = hero.querySelector('[data-sound]'), ac, gain, level = 1;
  if (snd) snd.addEventListener('click', function () {
    var on = snd.getAttribute('aria-pressed') !== 'true';
    snd.setAttribute('aria-pressed', String(on)); snd.textContent = on ? 'Sound on' : 'Sound off';
    if (on && !ac) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = new AC(); gain = ac.createGain(); gain.gain.value = 0; gain.connect(ac.destination);
      [440, 480].forEach(function (fq) { var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = fq; o.connect(gain); o.start(); });
      (function ring() {
        if (!ac) return; var n = ac.currentTime, g = 0.028 * level;
        gain.gain.cancelScheduledValues(n); gain.gain.setValueAtTime(0, n);
        gain.gain.linearRampToValueAtTime(g, n + 0.05); gain.gain.setValueAtTime(g, n + 0.85); gain.gain.linearRampToValueAtTime(0, n + 0.95);
        setTimeout(ring, 2600);
      })();
    }
    if (ac) ac[on ? 'resume' : 'suspend']();
  });
  requestAnimationFrame(frame);
})();
