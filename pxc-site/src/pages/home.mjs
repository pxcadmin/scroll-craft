import { CTA, closeBlock, deskSvg, faqBlock, faqLd, person } from '../layout.mjs';
import { DOMINOES, FAQ_HOME, SHEET_ROWS } from '../content.mjs';

const st = (o) => Object.entries(o).map(([k, v]) => `--${k}:${v}`).join(';');
const obj = (cls, pos, inner, attr = '') => `<div class="o ${cls}" style="${st(pos)}"${attr}>${inner}</div>`;
const chip = (text, pos, { ring = true, late = false, blur = 0, wide = false } = {}) =>
  obj(`o--chip${blur ? ' o--blur' : ''}${wide ? ' o--wide' : ''}`, { ...pos, ...(blur ? { b: blur } : {}) },
    `<div class="bob" style="--t:${5 + (Math.abs(pos.x) % 4)};--d:${Math.abs(pos.y) % 5}"><span class="chip"><i class="dot${ring ? ' is-ring' : ' dot--soft'}"></i>${text}</span></div>`, late ? ' data-late' : '');

const NOTES = [[4, 6, -5, 'rgba(255,52,57,.4)'], [22, 3, 4], [41, 8, -3, 'rgba(181,164,228,.5)'], [60, 4, 6], [79, 7, -4], [8, 36, 5], [27, 40, -6, 'rgba(255,52,57,.4)'], [46, 34, 3], [66, 38, -2, 'rgba(181,164,228,.5)'], [82, 41, 7], [14, 68, -4], [36, 71, 5, 'rgba(181,164,228,.5)'], [57, 66, -7], [76, 72, 3, 'rgba(255,52,57,.4)']];

const scene = () => `
<div class="scene" aria-hidden="true">
  <div class="scene__bg scene__bg--before"></div><div class="scene__bg scene__bg--after"></div>
  <div class="scene__fit"><div class="scene__cam">
    <div class="floor"></div>

    <!-- the calm room, beyond the doorway -->
    <div class="wall wall--far"></div>
    <div class="lamp" style="--x:-420;--z:-2700"></div><div class="lamp" style="--x:0;--z:-2780"></div><div class="lamp" style="--x:420;--z:-2700"></div>
    ${obj('desk desk--after', { x: 0, y: 212, z: -2500, w: 820 }, deskSvg(false))}
    ${obj('', { x: -330, y: -120, z: -2060, w: 250 }, '<div class="glass glass--after"><h4>Phones</h4><span class="big">Calls answered</span></div>')}
    ${obj('', { x: 0, y: -160, z: -2100, w: 250 }, '<div class="glass glass--after"><h4>At the window</h4><span class="big">Queue: 0</span></div>')}
    ${obj('', { x: 330, y: -120, z: -2060, w: 250 }, '<div class="glass glass--after"><h4>Handoffs</h4><span class="big">Next step: owned.</span></div>')}

    <!-- L0: the wall, the note board, the doorway -->
    <div class="wall wall--l" data-z="-900"><div class="clock"></div></div>
    <div class="wall wall--r" data-z="-900"><div class="board">${NOTES.map(([l, t, r, c]) => `<i style="--l:${l};--t:${t};--r:${r}${c ? `;--c:${c}` : ''}"></i>`).join('')}</div></div>
    <div class="wall wall--t" data-z="-900"><span class="wall__sign">Check-in</span></div>
    <div class="door" data-z="-898"></div>

    <!-- chips that multiply as the pressure builds -->
    ${chip('Voicemail full', { x: -420, y: -210, z: -800 }, { late: true, ring: false, wide: true })}
    ${chip('Refill request', { x: 250, y: -250, z: -700 }, { late: true, ring: false })}
    ${chip('Line 3 ringing', { x: -330, y: 40, z: -560 }, { late: true })}
    ${chip('Callback, no owner', { x: 190, y: -40, z: -470 }, { late: true, ring: false, wide: true })}
    ${chip('Form missing', { x: -250, y: -150, z: -300 }, { late: true, ring: false })}
    ${chip('Double-booked 10:20', { x: 300, y: 70, z: -230 }, { late: true, wide: true })}

    <!-- L1: far -->
    ${obj('o--wide', { x: -420, y: -50, z: -640, w: 300 }, `<div class="glass"><h4><span>Today</span><span>Over by 5</span></h4><div class="sched-g">
      <div><i style="--t:2;--h:20"></i><i style="--t:26;--h:16"></i><i class="x" style="--t:36;--h:18"></i><i style="--t:60;--h:30"></i></div>
      <div><i style="--t:6;--h:26"></i><i class="x" style="--t:24;--h:18"></i><i style="--t:48;--h:18"></i><i style="--t:70;--h:24"></i></div>
      <div><i style="--t:0;--h:16"></i><i style="--t:20;--h:24"></i><i style="--t:50;--h:20"></i><i class="x" style="--t:62;--h:20"></i></div>
      <div><i style="--t:8;--h:22"></i><i style="--t:36;--h:26"></i><i class="x" style="--t:54;--h:16"></i><i style="--t:76;--h:20"></i></div></div></div>`)}
    ${obj('', { x: 520, y: 0, z: -620, w: 290 }, '<div class="glass"><h4><span>At the window</span><span>7 waiting</span></h4><div class="queue"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>')}

    <!-- L2: the desk -->
    ${obj('desk', { x: 30, y: 212, z: -360, w: 820 }, deskSvg(true))}

    <!-- L3: near -->
    ${obj('', { x: 330, y: 200, z: -130, w: 290 }, `<div class="glass"><h4><span>Front desk</span><span>9:42</span></h4>
      <div class="row"><i class="dot is-ring"></i>Line 1 ringing<span>0:48</span></div><div class="row"><i class="dot is-ring"></i>Line 2 ringing<span>0:21</span></div>
      <div class="row"><i class="dot dot--soft"></i>Line 3 on hold<span>6:40</span></div><div class="row"><i class="dot dot--soft"></i>Voicemail<span>Full</span></div></div>`)}
    ${obj('o--wide', { x: -300, y: 290, z: -150, w: 240 }, '<div class="pile"><i style="--n:0;--r:-3"></i><i style="--n:1;--r:2"></i><i style="--n:2;--r:-1"></i><i style="--n:3;--r:4"></i><i style="--n:4;--r:-2"></i><i style="--n:5;--r:1"></i></div>')}

    <!-- L4: floating, nearest -->
    ${obj('o--blur', { x: 420, y: -230, z: 150, w: 150, rz: 14, ry: -18, b: 3 }, '<div class="bob" style="--t:8"><div class="sheet3d"></div></div>')}
    ${obj('o--blur o--wide', { x: -40, y: 400, z: 250, w: 190, rz: -22, ry: 24, b: 5 }, '<div class="bob" style="--t:6;--d:2"><div class="sheet3d"></div></div>')}
    ${obj('o--blur', { x: -290, y: -230, z: 60, w: 120, rz: -9, ry: 12, b: 2 }, '<div class="bob" style="--t:9;--d:4"><div class="sheet3d"></div></div>')}
    ${chip('Line 2 ringing', { x: 170, y: -200, z: 170 }, { blur: 2 })}
    ${chip('Line 1 ringing', { x: -215, y: 110, z: 90 }, { blur: 1.2 })}
    ${chip('On hold 6:40', { x: 40, y: 230, z: 230 }, { blur: 3, ring: false })}
  </div></div>
</div>`;

const hero = (cfg) => `
<section class="hero" id="hero" data-sc-act="pin" data-sc-span="3.4" aria-labelledby="hero-h">
  <div data-sc-stage class="hero__stage">
    ${scene()}
    <div class="hero__scrim" aria-hidden="true"></div>
    <div class="hero__copy"><div class="hero__fade">
      <p class="eyebrow">Front desk consulting for independent medical practices</p>
      <h1 class="h1" id="hero-h"><span>Less front-desk chaos.</span> <span><em>More room to care.</em></span></h1>
      <p class="lede">We fix the three front-desk problems costing you the most calls, patients and staff. In 90 days. Measured on day one and again on day 90.</p>
      <div class="actions">${CTA}<a class="link" href="/services/90-day-front-desk-reset/#the-90-days">See how the 90 days work</a></div>
      <p class="small">Ten questions. About five minutes. No patient information.</p>
    </div></div>
    <p class="hero__cap" style="opacity:0">The day your team <em>knows too well.</em></p>
    <p class="hero__cap" style="opacity:0">A clearer <em>way through.</em></p>
    <p class="hero__cap" style="opacity:0">More present. <em>Less pulled apart.</em></p>
    <div class="hero__foot">
      <span data-l="a" class="on">The pressure</span><span class="hero__track" aria-hidden="true"><i></i></span><span data-l="b">The possibility</span>
      <div class="hero__ctl"><button type="button" class="snd" data-sound aria-pressed="false">Sound off</button><button type="button" data-pause aria-pressed="false">Pause motion</button></div>
    </div>
  </div>
</section>`;

const slabs = () => DOMINOES.map((d, i) => `<button class="slab" type="button" style="--i:${i}" data-dom="${i}" aria-pressed="false" aria-label="${i + 1}. ${d.t}"><span class="slab__b"><span class="slab__f slab__f--back"></span><span class="slab__e"></span><span class="slab__s"></span><span class="slab__f"><b>${i + 1}</b><span>${d.t}</span></span></span></button>`).join('');

export default (cfg) => ({
  path: '/',
  title: 'Medical Front Desk Consulting | 90-Day Reset | PXC',
  desc: 'Less front-desk chaos. More room to care. PXC fixes the three front-desk problems costing your practice the most, in 90 days, measured. Free screener.',
  h1: 'Patient eXperience Consulting: medical front desk consulting',
  schema: [
    { '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': `${cfg.url}/#service`, name: cfg.name, alternateName: cfg.short, url: `${cfg.url}/`, image: `${cfg.url}/assets/logo-full.svg`,
      description: 'Front desk consulting for independent medical practices. The three front-desk problems costing the most calls, patients and staff, fixed with your team in 90 days and measured.',
      telephone: cfg.tel, priceRange: '$0 - $12,500', areaServed: { '@type': 'Country', name: 'United States' },
      address: { '@type': 'PostalAddress', addressLocality: cfg.city, addressRegion: cfg.region, addressCountry: 'US' }, founder: { '@id': `${cfg.url}/about/#jennifer` },
      ...(cfg.sameAs.length ? { sameAs: cfg.sameAs } : {}),
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'A clear place to start', itemListElement: [
        { '@type': 'Offer', name: 'Free Front Desk Screener', price: '0', priceCurrency: 'USD', url: `${cfg.url}/free-front-desk-screener/`, description: 'Ten questions. A first read on where the friction starts, and a 20-minute review call.' },
        { '@type': 'Offer', name: 'Practice Audit', price: '1500', priceCurrency: 'USD', url: `${cfg.url}/services/practice-audit/`, description: 'A five-day count with no patient information, an observation, findings, and your agreed Top 3.' },
        { '@type': 'Offer', name: '90-Day Medical Front Desk Reset', price: '12500', priceCurrency: 'USD', url: `${cfg.url}/services/90-day-front-desk-reset/`, description: 'Three priorities fixed with your team, trained, and measured.' }] } },
    { '@context': 'https://schema.org', ...person(cfg) },
    faqLd(FAQ_HOME),
  ],
  html: `${hero(cfg)}

<section class="section" aria-label="Experience">
  <div class="wrap">
    <ul class="proof" data-sc-in data-sc-stagger="90">
      <li><span class="num" data-sc-count="0 21">21</span><p>years running medical practices.</p></li>
      <li><span class="num" data-sc-count="0 12">12</span><p>urgent care clinics managed at once.</p></li>
      <li><span class="num" data-sc-count="0 4">4</span><p>counties in parallel.</p></li>
      <li><span class="num" data-sc-count="0 90">90</span><p>days to implement and measure.</p></li>
    </ul>
  </div>
</section>

<section class="section section--line" id="answer" aria-labelledby="answer-h">
  <div class="wrap grid">
    <div class="col-7 stack" data-sc-in>
      <p class="eyebrow">The short answer</p>
      <h2 class="h2" id="answer-h">What does PXC actually fix?</h2>
      <p class="lede">Patient eXperience Consulting fixes the front desk at independent medical practices. Phones that ring out. Lines at check-in. Schedules that run over. No-shows. The pile of messages, refills and forms. We find the three problems driving the rest, fix them with your team in 90 days, and measure the result on the same sheet we started with.</p>
    </div>
  </div>
</section>

<section class="section section--line" id="familiar" aria-labelledby="familiar-h">
  <div class="wrap">
    <div class="stack" data-sc-in>
      <p class="eyebrow">Sound familiar?</p>
      <h2 class="h2" id="familiar-h">The day gets busy. <em>Everything lands on your people.</em></h2>
    </div>
    <div class="tabs" data-tabs>
      <div class="tabs__list" role="tablist" aria-label="Three front-desk patterns">
        <button class="tab" role="tab" id="tab-0" aria-selected="true" aria-controls="vig-0"><span class="h3">The phone never stops.</span><p><span>Three lines ringing. One person at the desk. Voicemail full by mid-morning.</span></p></button>
        <button class="tab" role="tab" id="tab-1" aria-selected="false" aria-controls="vig-1" tabindex="-1"><span class="h3">The handoff gets lost.</span><p><span>"I sent it" is not the same as "it's done." The patient calls back to find out.</span></p></button>
        <button class="tab" role="tab" id="tab-2" aria-selected="false" aria-controls="vig-2" tabindex="-1"><span class="h3">The manager catches everything.</span><p><span>You are covering the desk, fixing the schedule and training the new hire. Again.</span></p></button>
      </div>
      <div class="tabs__stage">
        <div class="vig is-on" id="vig-0" role="tabpanel" aria-labelledby="tab-0"><div class="vig__card" data-sc-tilt="4"><div class="vig__head eyebrow"><span>Front desk</span><span>9:42 am</span></div>
          <div class="vig__row"><i class="dot is-ring"></i><b>Line 1</b> ringing<span>0:48</span></div><div class="vig__row"><i class="dot is-ring"></i><b>Line 2</b> ringing<span>0:21</span></div>
          <div class="vig__row"><i class="dot is-ring"></i><b>Line 3</b> on hold<span>6:40</span></div><div class="vig__row"><i class="dot dot--soft"></i><b>Voicemail</b><span>Full</span></div></div></div>
        <div class="vig" id="vig-1" role="tabpanel" aria-labelledby="tab-1" hidden><div class="vig__card" data-sc-tilt="4"><div class="vig__head eyebrow"><span>Message to clinical</span><span>Tuesday</span></div>
          <div class="vig__row"><i class="dot dot--cyan"></i><b>Sent</b><span>10:14 am</span></div><div class="vig__row"><i class="dot dot--soft"></i><b>Received by</b><span>Nobody yet</span></div>
          <div class="vig__row"><i class="dot dot--soft"></i><b>Done</b><span>Not marked</span></div><div class="vig__row"><i class="dot is-ring"></i><b>Patient called back</b><span>2:30 pm</span></div></div></div>
        <div class="vig" id="vig-2" role="tabpanel" aria-labelledby="tab-2" hidden><div class="vig__card" data-sc-tilt="4"><div class="vig__head eyebrow"><span>The manager's day</span><span>All at once</span></div>
          <div class="vig__row"><i class="dot is-ring"></i><b>Cover the desk</b><span>Now</span></div><div class="vig__row"><i class="dot is-ring"></i><b>Fix Thursday's schedule</b><span>Overdue</span></div>
          <div class="vig__row"><i class="dot dot--soft"></i><b>Train the new hire</b><span>Again</span></div><div class="vig__row"><i class="dot dot--soft"></i><b>Your own work</b><span>After hours</span></div></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--line" id="calculator" aria-labelledby="calc-h">
  <div class="wrap">
    <div class="stack" data-sc-in>
      <p class="eyebrow">Your numbers, not ours</p>
      <h2 class="h2" id="calc-h">What are missed calls costing you <em>each month?</em></h2>
    </div>
    <form class="calc" data-calc data-sc-in onsubmit="return false">
      <div>
        <div class="field"><label for="c-calls">Calls missed per day <output id="o-calls" for="c-calls">8</output></label><input type="range" id="c-calls" min="0" max="40" step="1" value="8"></div>
        <div class="field"><label for="c-share">Share that were appointments <output id="o-share" for="c-share">30%</output></label><input type="range" id="c-share" min="0" max="100" step="5" value="30"></div>
        <div class="field"><label for="c-value">Average visit value <output id="o-value" for="c-value">$150</output></label><input type="range" id="c-value" min="50" max="600" step="10" value="150"></div>
      </div>
      <div class="calc__out" aria-live="polite">
        <p class="eyebrow">By your own count</p>
        <p>About <strong class="num" id="c-result">$7,560</strong> a month.</p>
        <p class="small">This is your math, not a promise. It assumes 21 working days a month. The Practice Audit counts it properly over five days.</p>
        <p class="mt-s"><a class="link" href="/contact/?topic=missed-call-breakdown" id="c-link">Send me the full breakdown</a></p>
      </div>
    </form>
  </div>
</section>

<section class="dom" id="dominoes" data-dominoes data-sc-span="3.2" aria-labelledby="dom-h">
  <div data-sc-stage class="dom__stage">
    <div class="dom__text">
      <p class="eyebrow">The map</p>
      <h2 class="h2 mt-s" id="dom-h">Which problems knock <em>the others over?</em></h2>
      <p class="body soft mt-s">One missed handoff rarely stays one problem. We map your front desk as ten dominoes and fix the three that are knocking over the rest.</p>
      <ol class="dom__list">
        ${DOMINOES.map((d, i) => `<li class="dom__item${i === 0 ? ' is-on' : ''}" data-item="${i}"><span class="num" aria-hidden="true">${i + 1}</span><div><h3 class="h3">${d.t}.</h3><p>${d.d}</p><button type="button" class="dom__pick" data-dom="${i}" aria-pressed="false">Sounds like our desk</button></div></li>`).join('\n        ')}
      </ol>
      <div class="dom__after">
        <p class="soft" data-dom-hint>Tap the three that sound like your desk.</p>
        <a class="btn" href="/free-front-desk-screener/" data-dom-go hidden>Score these three</a>
      </div>
    </div>
    <div class="dom__row"><div class="dom__rig"><div class="dom__floor" aria-hidden="true"></div>${slabs()}</div></div>
  </div>
</section>

<section class="section section--line" id="method" aria-labelledby="method-h">
  <div class="wrap">
    <div class="stack" data-sc-in>
      <p class="eyebrow">The PXC Method</p>
      <h2 class="h2" id="method-h">Find the friction. Do the work. <em>Keep it working.</em></h2>
    </div>
    <ol class="pxc" data-sc-in data-sc-stagger="160">
      <li><svg viewBox="0 0 150 170" aria-hidden="true"><text x="0" y="150">P</text></svg><h3 class="h3">Pinpoint.</h3><p><b>Find what starts the chain reaction.</b> A five-day count, an observation of your hardest hour, and a Top 3 you sign.</p></li>
      <li><svg viewBox="0 0 150 170" aria-hidden="true"><text x="0" y="150">X</text></svg><h3 class="h3">eXecute.</h3><p><b>Put the fixes into everyday use.</b> A written rule. A named owner. Scripts and hands-on training. A number your team tracks each week.</p></li>
      <li><svg viewBox="0 0 150 170" aria-hidden="true"><text x="0" y="150">C</text></svg><h3 class="h3">Compound.</h3><p><b>Make the better day repeatable.</b> A daily huddle, a weekly scoreboard and a monthly owner review.</p></li>
    </ol>
    <p class="mt-m"><a class="link" href="/method/">How the method works</a></p>
  </div>
</section>

<section class="section section--line" id="reset" aria-labelledby="reset-h">
  <div class="wrap">
    <div class="grid">
      <div class="col-6 stack" data-sc-in>
        <p class="eyebrow">The 90-Day Medical Front Desk Reset</p>
        <h2 class="h2" id="reset-h">Three priorities. <em>Hands-on change.</em></h2>
        <p class="lede">A focused engagement that turns your audit findings into the way your front desk works.</p>
        <p class="price mt-m"><span class="num">$12,500</span><span class="soft">One location. Half at signing, half at kickoff.</span></p>
        <div class="actions"><a class="btn" href="/services/90-day-front-desk-reset/">See the Reset</a></div>
      </div>
      <div class="col-5r" data-sc-in>
        <p class="eyebrow">What you get</p>
        <ol class="gets">
          <li>Written rules your team can use</li><li>A named owner for each workflow</li><li>Scripts, training and practice</li><li>A weekly number that shows progress</li>
          <li>AI tools set up where the audit shows they fit. Never forced.</li><li>A day-one and day-90 measurement on the same sheet</li>
        </ol>
      </div>
    </div>
    <div class="days" data-fill><i class="days__fill" aria-hidden="true"></i>
      <ol class="days--4">
        <li data-at="0"><b>Day 1</b><span>We count.</span></li><li data-at="0.33"><b>Day 6</b><span>You sign your three.</span></li>
        <li data-at="0.66"><b>Day 45</b><span>Midpoint check.</span></li><li data-at="0.98"><b>Day 90</b><span>We measure. Same sheet.</span></li>
      </ol>
    </div>
  </div>
</section>

<section class="section section--surface" id="promise" aria-labelledby="promise-h">
  <div class="wrap promise" data-sc-in>
    <div class="stack">
      <p class="eyebrow">Our promise</p>
      <h2 class="h2" id="promise-h">Miss the day-90 number? <em>We keep working.</em></h2>
      <p class="lede">If your day-90 measure is missed and your practice met its side of the plan, we keep working on the same three priorities at no added fee, through day 180.</p>
      <p><a class="link" href="/keep-working-promise/">Read the full promise</a></p>
    </div>
    ${seal()}
  </div>
</section>

<section class="section" id="start" aria-labelledby="start-h">
  <div class="wrap">
    <div class="stack" data-sc-in>
      <h2 class="h2" id="start-h">A clear place to start.</h2>
      <p class="lede">Start with the front desk. Decide the next step with evidence.</p>
    </div>
    <ol class="steps" data-sc-in data-sc-stagger="120">
      <li><span class="n">01</span><h3 class="h3">Free Front Desk Screener</h3><span class="cost">$0</span><p>Ten questions. A first read on where the friction starts, and a 20-minute review call.</p>${CTA}</li>
      <li><span class="n">02</span><h3 class="h3">Practice Audit</h3><span class="cost">$1,500</span><p>A five-day count with no patient information, an observation, findings, and your agreed Top 3.</p><a class="link" href="/services/practice-audit/">About the audit</a></li>
      <li><span class="n">03</span><h3 class="h3">90-Day Medical Front Desk Reset</h3><span class="cost">$12,500</span><p>Three priorities fixed with your team, trained, and measured.</p><a class="link" href="/services/90-day-front-desk-reset/">About the Reset</a></li>
    </ol>
    <p class="small mt-m">The $1,500 audit is credited to the Reset if you sign within 30 days of your findings call.</p>
  </div>
</section>

${results()}

<section class="section section--line" id="jennifer" aria-labelledby="jen-h">
  <div class="wrap grid" style="align-items:center">
    <div class="col-5" data-sc-in><figure class="portrait" data-portrait><img src="/assets/jennifer-radu.webp" srcset="/assets/jennifer-radu-400.webp 400w, /assets/jennifer-radu.webp 720w" sizes="(max-width: 860px) 90vw, 30rem" width="720" height="900" loading="lazy" alt="Jennifer Radu, founder of Patient eXperience Consulting, speaking with a microphone in hand"></figure></div>
    <div class="col-6r stack" data-sc-in>
      <p class="eyebrow">Meet Jennifer Radu</p>
      <h2 class="h2" id="jen-h">She knows both <em>sides of the desk.</em></h2>
      <p class="body">Over 21 years running medical practices, including 12 urgent care clinics across four counties at once. Six back surgeries as a patient. A background in teaching. Jennifer brings all three to your team: change the work, teach the new routine, keep it going.</p>
      <p class="pull">An operator, not a binder.</p>
      <p class="creds"><span>C.P.P.M.</span><span>Former teacher</span><span>21 years in practice</span></p>
      <p><a class="link" href="/about/">Meet Jennifer</a></p>
    </div>
  </div>
</section>

<section class="section section--line" id="questions" aria-labelledby="q-h">
  <div class="wrap grid">
    <div class="col-4" data-sc-in><h2 class="h2" id="q-h">Before you <em>take the next step.</em></h2></div>
    <div class="col-7" style="grid-column:6 / span 7" data-sc-in>${faqBlock(FAQ_HOME)}</div>
  </div>
</section>
${closeBlock(cfg)}`,
});

export function seal() {
  return `<svg class="seal" viewBox="0 0 220 220" role="img" aria-label="Keep-Working Promise. Through day 180.">
    <defs><path id="seal-arc" d="M110 110m-84 0a84 84 0 1 1 168 0a84 84 0 1 1-168 0"/></defs>
    <circle cx="110" cy="110" r="104" pathLength="1"/><circle cx="110" cy="110" r="66" pathLength="1"/>
    <text><textPath href="#seal-arc" startOffset="0">KEEP-WORKING PROMISE  ·  THROUGH DAY 180  ·</textPath></text>
    <text class="seal__n" x="110" y="124" text-anchor="middle">180</text>
    <text x="110" y="146" text-anchor="middle" style="font-size:8px">DAYS</text>
  </svg>`;
}

export function results() {
  return `<section class="section section--line" id="results" aria-labelledby="results-h">
  <div class="wrap grid" style="align-items:center">
    <div class="col-5 stack" data-sc-in>
      <p class="eyebrow">Results</p>
      <h2 class="h2" id="results-h">Counted on day one. <em>Counted again on day 90.</em></h2>
      <p class="body soft">Every Reset is measured on one sheet. The same five counts on day one, at the midpoint, and on day 90. As practices finish their 90 days, their numbers will be published here with their permission.</p>
    </div>
    <div class="col-6r" data-sc-in>
      <div class="sheet"><div class="sheet__head"><span>PXC measurement sheet</span><span>One location</span></div>
        <table><caption>This is the sheet. Your numbers go here.</caption>
          <thead><tr><th scope="col">Measure</th><th scope="col">Day 1</th><th scope="col">Day 90</th></tr></thead>
          <tbody>${SHEET_ROWS.map((r) => `<tr><th scope="row">${r}</th><td></td><td></td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  </div>
</section>`;
}
