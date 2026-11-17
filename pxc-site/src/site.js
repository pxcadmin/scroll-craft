/* Site behaviour: header, tabs, calculator, scroll fills, forms, events. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var cfg = window.PXC || {};
  if (window.ScrollCraft) ScrollCraft.mount(document.body);

  // analytics hook: pushes to dataLayer if a tag manager is present
  function ev(name, data) { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, data || {})); }
  window.PXCev = ev;
  document.addEventListener('click', function (e) { var a = e.target.closest('[data-ev]'); if (a) ev(a.getAttribute('data-ev'), { path: location.pathname }); });

  // header
  var bar = $('[data-bar]'), menu = $('[data-menu]');
  if (bar) {
    var fixed = bar.classList.contains('is-solid');
    var onScroll = function () { if (!fixed) bar.classList.toggle('is-solid', scrollY > 80); };
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
    if (menu) menu.addEventListener('click', function () { var o = bar.classList.toggle('is-open'); menu.setAttribute('aria-expanded', String(o)); menu.textContent = o ? 'Close' : 'Menu'; });
    $$('.bar__nav a').forEach(function (a) { a.addEventListener('click', function () { bar.classList.remove('is-open'); if (menu) { menu.setAttribute('aria-expanded', 'false'); menu.textContent = 'Menu'; } }); });
  }

  // tabs
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role=tab]', root);
    function pick(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        panel.hidden = false; panel.classList.toggle('is-on', on);
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); pick((i + d + tabs.length) % tabs.length, true); }
      });
    });
    pick(0);
  });

  // missed-call calculator
  var calc = $('[data-calc]');
  if (calc) {
    var c = $('#c-calls'), s = $('#c-share'), v = $('#c-value'), out = $('#c-result'), link = $('#c-link'), cur = 0, goal = 0, raf = 0;
    var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var step = function () { cur += (goal - cur) * 0.2; if (Math.abs(goal - cur) < 1) cur = goal; out.textContent = fmt(cur); raf = cur === goal ? 0 : requestAnimationFrame(step); };
    var run = function (first) {
      $('#o-calls').textContent = c.value; $('#o-share').textContent = s.value + '%'; $('#o-value').textContent = '$' + v.value;
      goal = c.value * (s.value / 100) * v.value * 21;
      link.href = '/contact/?topic=missed-call-breakdown&calls=' + c.value + '&share=' + s.value + '&value=' + v.value + '&monthly=' + Math.round(goal);
      if (first === true || matchMedia('(prefers-reduced-motion: reduce)').matches) { cur = goal; out.textContent = fmt(goal); } else if (!raf) raf = requestAnimationFrame(step);
    };
    [c, s, v].forEach(function (i) { i.addEventListener('input', run); });
    calc.addEventListener('change', function () { ev('calculator_used', { monthly: Math.round(goal) }); });
    run(true);
  }

  // scroll-linked fills: the 90-day line, the document fan, the portrait
  var fills = $$('[data-fill]'), fans = $$('[data-fan]'), ports = $$('[data-portrait]');
  if (fills.length || fans.length || ports.length) {
    var prog = function (el, a, b) { var r = el.getBoundingClientRect(), h = innerHeight; return Math.min(1, Math.max(0, (h * a - r.top) / (h * (a - b)))); };
    var upd = function () {
      fills.forEach(function (el) { var p = prog(el, 0.85, 0.4); el.style.setProperty('--fill', p.toFixed(3)); $$('[data-at]', el).forEach(function (li) { li.classList.toggle('is-hit', p >= +li.getAttribute('data-at')); }); });
      fans.forEach(function (el) { el.style.setProperty('--spread', prog(el, 0.9, 0.35).toFixed(3)); });
      ports.forEach(function (el) { el.style.setProperty('--pp', prog(el, 1, -0.2).toFixed(3)); });
    };
    upd(); addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd);
  }

  // flip cards respond to tap as well as hover
  $$('.flip').forEach(function (f) { f.addEventListener('click', function () { f.classList.toggle('is-on'); f.setAttribute('aria-pressed', String(f.classList.contains('is-on'))); }); });

  // one sender for every form on the site
  window.PXCsend = function (payload) {
    payload.page = location.pathname; payload.sent = new Date().toISOString();
    if (cfg.formEndpoint) return fetch(cfg.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) }).then(function (r) { if (!r.ok) throw new Error('send failed'); return 'sent'; });
    if (cfg.contactEmail) {
      var body = Object.keys(payload).map(function (k) { return k + ': ' + payload[k]; }).join('\n');
      location.href = 'mailto:' + cfg.contactEmail + '?subject=' + encodeURIComponent('PXC: ' + (payload.form || 'website')) + '&body=' + encodeURIComponent(body);
      return Promise.resolve('email');
    }
    return Promise.reject(new Error('not connected'));
  };

  // contact page: scheduler embed if configured, and the form
  var sched = $('[data-sched]');
  if (sched && cfg.schedulerUrl) { var f = document.createElement('iframe'); f.src = cfg.schedulerUrl; f.title = 'Book a 20-minute call'; f.className = 'sched'; f.loading = 'lazy'; sched.innerHTML = ''; sched.appendChild(f); }
  var form = $('[data-form]');
  if (form) {
    var q = new URLSearchParams(location.search), note = $('[name=message]', form);
    if (q.get('monthly') && note && !note.value) note.value = 'Please send the full missed-call breakdown. My numbers: ' + q.get('calls') + ' missed calls a day, ' + q.get('share') + '% appointments, $' + q.get('value') + ' a visit. About $' + (+q.get('monthly')).toLocaleString('en-US') + ' a month.';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.form__msg', form), data = { form: form.getAttribute('data-form') };
      $$('input, textarea', form).forEach(function (i) { if (i.name) data[i.name] = i.value; });
      if (data.website) return; // honeypot
      delete data.website;
      msg.textContent = 'Sending.';
      window.PXCsend(data).then(function (how) { msg.textContent = how === 'sent' ? 'Thank you. You will hear from Jennifer within one business day.' : 'Your email app should now be open with the message ready to send.'; ev('contact_submit'); if (how === 'sent') form.reset(); })
        .catch(function () { msg.innerHTML = 'This did not send. Please call <a class="link" href="tel:' + cfg.tel + '">' + cfg.phone + '</a>.'; });
    });
  }
})();
