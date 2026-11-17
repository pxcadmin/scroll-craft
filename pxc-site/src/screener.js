/* Free Front Desk Screener. Ten questions, one per domino. Email is asked
   after question three. The result is the three highest scores. */
(function () {
  var root = document.querySelector('[data-quiz]'), dataEl = document.getElementById('quiz-data');
  if (!root || !dataEl) return;
  var data = JSON.parse(dataEl.textContent), items = data.items, opts = data.opts, N = items.length;
  var body = root.querySelector('[data-quiz-body]'), bar = root.querySelector('.quiz__bar i');
  var ev = window.PXCev || function () {}, cfg = window.PXC || {};
  var picked = (new URLSearchParams(location.search).get('d') || '').split(',').map(function (n) { return parseInt(n, 10) - 1; }).filter(function (n) { return n >= 0 && n < N; });
  var answers = [], step = 0, lead = { email: '', practice: '' }, asked = false, started = false;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function progress(v) { bar.style.setProperty('--q', v); }
  function focusFirst() { var el = body.querySelector('.opt, input, .btn'); if (el && started) el.focus({ preventScroll: true }); }

  function question() {
    var it = items[step], cur = answers[step];
    progress(step / N);
    body.innerHTML = '<fieldset><legend class="eyebrow">Question ' + (step + 1) + ' of ' + N + (picked.indexOf(step) > -1 ? ' &nbsp;·&nbsp; one you picked' : '') + '</legend>' +
      '<p class="h3 quiz__q">' + esc(it.q) + '</p><div class="opts">' +
      opts.map(function (o, i) { return '<button type="button" class="opt' + (cur === i ? ' is-on' : '') + '" data-v="' + i + '"><i>' + 'ABCD'[i] + '</i>' + esc(o) + '</button>'; }).join('') +
      '</div></fieldset><div class="quiz__nav">' + (step > 0 ? '<button type="button" data-back>Back</button>' : '<span></span>') + '<span class="small">How often, in a normal week?</span></div>';
    focusFirst();
  }
  function email() {
    progress(3 / N);
    body.innerHTML = '<form class="form" data-lead novalidate><p class="eyebrow">Three down, seven to go</p>' +
      '<p class="h3">Where should we send your result?</p>' +
      '<p class="small">You will see it on screen either way. We send a copy and nothing else. No patient information, please.</p>' +
      '<label>Work email<input type="email" name="email" autocomplete="email" required value="' + esc(lead.email) + '"></label>' +
      '<label>Practice name (optional)<input name="practice" autocomplete="organization" value="' + esc(lead.practice) + '"></label>' +
      '<div class="actions"><button class="btn" type="submit">Continue</button><button type="button" class="link" data-skip style="background:none;border:0;cursor:pointer;padding:.75rem 0">Skip for now</button></div>' +
      '<p class="form__msg" role="alert"></p></form>';
    focusFirst();
  }
  function result() {
    progress(1);
    var order = items.map(function (_, i) { return i; }).sort(function (a, b) {
      return (answers[b] - answers[a]) || ((picked.indexOf(b) > -1) - (picked.indexOf(a) > -1)) || (a - b);
    });
    var top = order.slice(0, 3), total = answers.reduce(function (s, v) { return s + v; }, 0), calm = answers[top[0]] === 0;
    var ids = top.map(function (i) { return i + 1; }).join(',');
    var payload = { form: 'screener', email: lead.email, practice: lead.practice, top3: top.map(function (i) { return items[i].t; }).join(' | '), score: total + ' of ' + N * 3 };
    items.forEach(function (it, i) { payload['q' + (i + 1)] = opts[answers[i]]; });
    if (lead.email && window.PXCsend && cfg.formEndpoint) window.PXCsend(payload).catch(function () {});
    try { sessionStorage.setItem('pxc-screener', JSON.stringify(payload)); } catch (e) {}
    ev('screener_complete', { top3: ids, score: total });
    var agree = picked.length ? top.filter(function (i) { return picked.indexOf(i) > -1; }).length : -1;
    body.innerHTML = '<p class="eyebrow">Your first read</p>' +
      (calm ? '<h2 class="h2 mt-s">Your desk looks <em>steady.</em></h2><p class="lede mt-s">Nothing scored above "rarely." If the day still feels heavier than that, a 20-minute call will find what ten questions cannot.</p>'
        : '<h2 class="h2 mt-s">Your likely <em>three.</em></h2><p class="lede mt-s">These scored highest. They are the dominoes most likely knocking over the rest.' + (agree > 0 ? ' ' + agree + ' of the three you picked on the way in made the list.' : '') + '</p>' +
          '<ol class="three">' + top.map(function (i) { return '<li><div><h3 class="h3">' + esc(items[i].t) + '</h3><p>' + esc(items[i].d) + '</p><p><b style="color:var(--sc-ink);font-weight:500">First fix.</b> ' + esc(items[i].fix) + '</p></div></li>'; }).join('') + '</ol>') +
      '<p class="h3">Your next step</p><p class="soft mt-s">A 20-minute review call. We go through your three, and you leave with one thing to try this week. This is a first read, not an audit.</p>' +
      '<div class="actions mt-m"><a class="btn" href="' + (cfg.schedulerUrl || '/contact/?topic=screener-review&three=' + ids) + '" data-ev="book_call">Book the 20-minute review</a><a class="link" href="tel:' + cfg.tel + '" data-ev="call">' + cfg.phone + '</a></div>' +
      '<div class="quiz__nav"><button type="button" data-restart>Start over</button><a class="small" href="/services/practice-audit/">What the Practice Audit adds</a></div>';
    var h = body.querySelector('h2'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    root.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function next() {
    if (step === 3 && !asked) return email();
    if (step >= N) return result();
    question();
  }
  body.addEventListener('click', function (e) {
    var o = e.target.closest('.opt');
    if (o) {
      if (!started) { started = true; ev('screener_start'); }
      answers[step] = +o.getAttribute('data-v'); o.classList.add('is-on'); step++;
      return setTimeout(next, 180);
    }
    if (e.target.closest('[data-back]')) { step--; return question(); }
    if (e.target.closest('[data-skip]')) { asked = true; ev('screener_email_skip'); return question(); }
    if (e.target.closest('[data-restart]')) { answers = []; step = 0; asked = false; return question(); }
  });
  body.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, em = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { f.querySelector('.form__msg').textContent = 'Please enter a work email, or skip for now.'; f.email.focus(); return; }
    lead.email = em; lead.practice = f.practice.value.trim(); asked = true; ev('screener_email');
    question();
  });
  question();
})();
