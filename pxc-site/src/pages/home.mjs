import { CTA, closeBlock, faqBlock, faqLd, person } from '../layout.mjs';
import { DOMINOES, FAQ_HOME, SHEET_ROWS } from '../content.mjs';

// The hero is four photographs cut into depth planes (see tools/layers.py) and one
// filmed turn between them. data-depth sets how fast a plane moves: room 0,
// far .35, mid .65, near 1, floating objects 1.2 and up.
const LAYERS = [['room', 0], ['far', 0.35], ['mid', 0.65], ['near', 1]];
const ly = (scn, [name, d], eager) =>
  `<div class="hx__ly hx__ly--${name}" data-depth="${d}"><img src="/assets/hero/${scn}-${name}.webp" alt="" width="1920" height="1080" decoding="async"${eager ? (name === 'room' ? ' fetchpriority="high"' : '') : ' loading="lazy"'}></div>`;
const ob = (name, d, x, y, w) =>
  `<div class="hx__ob" data-depth="${d}" style="--x:${x}%;--y:${y}%;--w:${w}%"><img src="/assets/hero/obj-${name}.webp" alt="" loading="lazy" onerror="this.parentNode.remove()"></div>`;
const hchip = (text, d, x, y, calm, ring) =>
  `<div class="hx__chip${calm ? ' hx__chip--calm' : ''}" data-depth="${d}" style="--d:${d};--x:${x}%;--y:${y}%"><span><i class="dot${calm ? ' dot--cyan' : ring ? ' is-ring' : ' dot--soft'}"></i>${text}</span></div>`;
const scn = (id, mood, fx, fxm, extra = '', eager = false) =>
  `<div class="hx__scn" data-scn="${id}" data-mood="${mood}" style="--fx:${fx}%;--fxm:${fxm}%">${LAYERS.map((l) => ly(id, l, eager)).join('')}${extra}</div>`;
const CHAOS_OBJ = ob('charts', 1.3, 6, 44, 12) + ob('phone', 1.55, 74, 58, 10) + ob('notes', 1.2, 44, 10, 7) + ob('paper', 1.7, 86, 8, 8);

const hero = (cfg) => `
<section class="hero" id="hero" data-sc-act="pin" data-sc-span="6" aria-labelledby="hero-h">
  <div data-sc-stage class="hero__stage">
    <div class="hx" aria-hidden="true">
      ${scn('c1', 'chaos', 46, 38, CHAOS_OBJ + hchip('Line 1 ringing', 1.1, 60, 20, false, true) + hchip('Line 2 ringing', 0.8, 76, 38, false, true) + hchip('Voicemail full', 0.5, 54, 52), true)}
      ${scn('c2', 'chaos', 58, 50, CHAOS_OBJ + hchip('Line 3 ringing', 0.6, 68, 26, false, true) + hchip('On hold 6:40', 1, 82, 62) + hchip('Callback, no owner', 0.8, 56, 48, false, true))}
      <video class="hx__video" data-src="/assets/hero/clinic-move.mp4" data-src-m="/assets/hero/clinic-move-m.mp4" muted playsinline preload="none"></video>
      ${scn('k1', 'calm', 58, 50, hchip('Calls answered', 0.6, 70, 22, true) + hchip('Queue: 0', 1, 82, 56, true))}
      ${scn('k2', 'calm', 52, 44, hchip('Patient roomed', 0.7, 64, 24, true) + hchip('Next step: owned', 1, 78, 54, true))}
      <div class="hx__glow"></div><div class="hx__sweep"></div>
    </div>
    <div class="hero__scrim" aria-hidden="true"></div><div class="hero__floor" aria-hidden="true"></div>
    <p class="vh" id="hero-desc">An overwhelmed medical clinic: every waiting chair full of unhappy patients, three receptionists on ringing phones, charts piled on the counter and sliding onto the floor. As you scroll, the same clinic becomes calm: the counter is clear, staff greet patients face to face, a nurse takes a patient back to an exam room and one patient waits comfortably.</p>
    <div class="hero__copy"><div class="hero__fade">
      <p class="eyebrow">Front desk consulting for independent medical practices</p>
      <h1 class="h1" id="hero-h" aria-describedby="hero-desc"><span>Less front-desk chaos.</span> <span><em>More room to care.</em></span></h1>
      <p class="lede">We fix the three front-desk problems costing you the most calls, patients and staff. In 90 days. Measured on day one and again on day 90.</p>
      <div class="actions">${CTA}<a class="link" href="/services/90-day-front-desk-reset/#the-90-days">See how the 90 days work</a></div>
      <p class="small">Ten questions. About five minutes. No patient information.</p>
    </div></div>
    <p class="hero__cap" data-at="0.085 0.195">Every seat taken. <em>Every line ringing.</em></p>
    <p class="hero__cap" data-at="0.275 0.39">The day your team <em>knows too well.</em></p>
    <p class="hero__cap" data-at="0.5 0.68">A clearer <em>way through.</em></p>
    <p class="hero__cap" data-at="0.715 0.8">Calls answered. <em>The queue is clear.</em></p>
    <p class="hero__cap" data-at="0.87 1.1">More present. <em>Less pulled apart.</em></p>
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
