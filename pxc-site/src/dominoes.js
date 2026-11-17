/* The ten dominoes. Desktop: a pinned 3D row that falls with scroll. Phones and
   reduced motion: a rail of ten cards. Runs before the engine mounts so it can
   decide whether this section is a pinned act at all. */
(function () {
  var sec = document.querySelector('[data-dominoes]');
  if (!sec) return;
  var rail = matchMedia('(max-width: 860px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window);
  if (rail) sec.classList.add('dom--rail'); else sec.setAttribute('data-sc-act', 'pin');
  var slabs = [].slice.call(sec.querySelectorAll('.slab')), items = [].slice.call(sec.querySelectorAll('.dom__item'));
  var hint = sec.querySelector('[data-dom-hint]'), go = sec.querySelector('[data-dom-go]');
  var picked = [], shown = 0, hover = -1, N = slabs.length;
  function show(i) { if (i === shown) return; shown = i; items.forEach(function (el, k) { el.classList.toggle('is-on', k === i); }); }
  function sync() {
    for (var i = 0; i < N; i++) {
      var on = picked.indexOf(i) > -1;
      slabs[i].classList.toggle('is-picked', on); slabs[i].setAttribute('aria-pressed', String(on));
      items[i].classList.toggle('is-picked', on);
      var b = items[i].querySelector('.dom__pick'); if (b) { b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Picked. Tap to remove' : 'Sounds like our desk'; }
    }
    var left = 3 - picked.length;
    hint.textContent = left === 3 ? 'Tap the three that sound like your desk.' : left > 0 ? 'Picked ' + picked.length + ' of 3. ' + left + ' to go.' : 'Three picked. Ten questions will score them.';
    go.hidden = left > 0;
    go.href = '/free-front-desk-screener/?d=' + picked.map(function (i) { return i + 1; }).join(',');
  }
  function toggle(i) {
    var at = picked.indexOf(i);
    if (at > -1) picked.splice(at, 1); else { if (picked.length === 3) picked.shift(); picked.push(i); }
    sync(); if (!rail) show(i);
  }
  sec.addEventListener('click', function (e) { var b = e.target.closest('[data-dom]'); if (b) toggle(+b.getAttribute('data-dom')); });
  slabs.forEach(function (s, i) {
    s.addEventListener('pointerenter', function () { hover = i; show(i); });
    s.addEventListener('pointerleave', function () { hover = -1; });
    s.addEventListener('focus', function () { hover = i; show(i); });
    s.addEventListener('blur', function () { hover = -1; });
  });
  sync();
  if (rail) return;
  // the fall: a wave front runs down the line; each slab leans onto the next
  var live = false;
  new IntersectionObserver(function (e) { live = e[0].isIntersecting; }).observe(sec);
  function tick() {
    if (live) {
      var r = sec.getBoundingClientRect(), span = r.height - innerHeight, p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      var front = (p - 0.06) / 0.78 * (N + 0.6);            // which domino the wave has reached
      for (var i = 0; i < N; i++) {
        var u = Math.min(1, Math.max(0, front - i)), e2 = u * u * (3 - 2 * u);
        slabs[i].style.setProperty('--fall', (e2 * (i === N - 1 ? 90 : 73)).toFixed(1));
      }
      if (hover < 0) show(Math.min(N - 1, Math.max(0, Math.floor(front))));
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
