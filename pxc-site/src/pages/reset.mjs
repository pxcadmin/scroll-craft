import { CTA, closeBlock, crumbsNav, deskSvg, faqBlock, faqLd } from '../layout.mjs';
import { FAQ_RESET } from '../content.mjs';
import { results, seal } from './home.mjs';

export default (cfg) => {
  const crumbs = [['Home', '/'], ['90-Day Front Desk Reset', '/services/90-day-front-desk-reset/']];
  return {
    path: '/services/90-day-front-desk-reset/',
    title: '90-Day Medical Front Desk Reset | $12,500 | PXC',
    desc: 'Three front-desk priorities fixed with your team in 90 days. Written rules, named owners, training, a weekly number. Miss day 90 and we keep working.',
    h1: 'The 90-Day Medical Front Desk Reset',
    crumbs,
    schema: [
      { '@context': 'https://schema.org', '@type': 'Service', '@id': `${cfg.url}/services/90-day-front-desk-reset/#service`, name: '90-Day Medical Front Desk Reset', serviceType: 'Medical front desk consulting',
        description: 'Three front-desk priorities, chosen by audit and signed by the practice, fixed with the practice team in 90 days. Each gets a written rule, a named owner, a script, training and a weekly number. Measured on day one and day 90.',
        provider: { '@id': `${cfg.url}/#org` }, areaServed: { '@type': 'Country', name: 'United States' }, audience: { '@type': 'Audience', audienceType: 'Independent medical practices with 2 to 20 providers' },
        offers: { '@type': 'Offer', price: '12500', priceCurrency: 'USD', url: `${cfg.url}/services/90-day-front-desk-reset/`, description: 'One location. $6,250 at signing, $6,250 at kickoff. Additional locations $3,000 each.' } },
      faqLd(FAQ_RESET),
    ],
    html: `
<section class="phero" aria-labelledby="h">
  <div class="wrap">
    ${crumbsNav(crumbs)}
    <div class="grid" style="align-items:end">
      <div class="col-7 stack">
        <p class="eyebrow">The 90-Day Medical Front Desk Reset</p>
        <h1 class="h1" id="h">A front desk that <em>works with your team.</em></h1>
        <p class="lede">Three priorities. Fixed with your people, in your practice, in 90 days. Measured on day one and day 90.</p>
        <div class="actions">${CTA}<a class="link" href="tel:${cfg.tel}" data-ev="call">Talk it through first, ${cfg.phone}</a></div>
      </div>
      <div class="col-5r desk desk--after" aria-hidden="true" style="opacity:.9">${deskSvg(false)}</div>
    </div>
  </div>
</section>

<section class="section section--line" aria-labelledby="fit-h">
  <div class="wrap">
    <h2 class="h2" id="fit-h" data-sc-in>Built for practices like yours.</h2>
    <div class="fit" data-sc-in>
      <div><p class="eyebrow">A fit</p><ul class="mt-s"><li>2 to 20 providers</li><li>One or two locations</li><li>An owner and a manager with a few hours a week</li></ul></div>
      <div class="no"><p class="eyebrow">Not a fit</p><ul class="mt-s"><li>EHR builds</li><li>Billing projects</li><li>Hiring searches</li><li>Health systems</li></ul></div>
    </div>
  </div>
</section>

<section class="section section--line" aria-labelledby="chg-h">
  <div class="wrap">
    <div class="stack" data-sc-in>
      <h2 class="h2" id="chg-h">What changes in 90 days?</h2>
      <p class="lede">Three of the <a class="link" href="/the-10-dominoes/">ten areas</a>, chosen by your audit and signed by you. For each one: a written rule, a named owner, a script, training, and a weekly number.</p>
    </div>
    <div class="flip3" data-sc-in data-sc-stagger="120">
      <button class="flip" type="button" aria-pressed="false"><span class="flip__in">
        <span class="flip__f"><span class="eyebrow">Before</span><span class="h3">A missed call has no owner.</span><span class="soft">It is still open at the end of the day, and the patient calls again.</span></span>
        <span class="flip__f flip__f--b"><span class="eyebrow">After</span><span class="h3">Every callback has a name and a time.</span><span class="soft">A written rule, one owner, and a count your team sees each week.</span></span></span></button>
      <button class="flip" type="button" aria-pressed="false"><span class="flip__in">
        <span class="flip__f"><span class="eyebrow">Before</span><span class="h3">"I sent it."</span><span class="soft">The handoff depends on who happens to be nearby, and nobody knows if it landed.</span></span>
        <span class="flip__f flip__f--b"><span class="eyebrow">After</span><span class="h3">"It's done."</span><span class="soft">A handoff is finished when it is received. The script says what received means.</span></span></span></button>
      <button class="flip" type="button" aria-pressed="false"><span class="flip__in">
        <span class="flip__f"><span class="eyebrow">Before</span><span class="h3">The new hire learns by watching.</span><span class="soft">They inherit whatever was never written down, and the pattern repeats.</span></span>
        <span class="flip__f flip__f--b"><span class="eyebrow">After</span><span class="h3">The new hire learns from the page.</span><span class="soft">Rules, scripts and practice sessions that belong to the practice, not to one person.</span></span></span></button>
    </div>
    <p class="small mt-s">Examples. Your three come from your own count.</p>
  </div>
</section>

<section class="section section--line" id="the-90-days" aria-labelledby="run-h">
  <div class="wrap">
    <h2 class="h2" id="run-h" data-sc-in>How the 90 days run.</h2>
    <div class="days" data-fill><i class="days__fill" aria-hidden="true"></i>
      <ol class="days--even">
        <li data-at="0"><b>Days 1 to 5</b><span>We count. Your team tallies calls, lines, overrides, no-shows and open messages alongside the normal day.</span></li>
        <li data-at="0.2"><b>Day 6</b><span>You sign your three.</span></li>
        <li data-at="0.4"><b>Days 7 to 80</b><span>We fix them one at a time. Rule, owner, script, practice, count.</span></li>
        <li data-at="0.6"><b>Day 45</b><span>Midpoint check on the same sheet.</span></li>
        <li data-at="0.98"><b>Day 90</b><span>Final measure. Same sheet as day one.</span></li>
      </ol>
    </div>
  </div>
</section>

<section class="section section--line" aria-labelledby="keep-h">
  <div class="wrap">
    <div class="stack" data-sc-in>
      <h2 class="h2" id="keep-h">What stays when we leave.</h2>
      <p class="lede">Seven things your practice keeps. They are yours, written for your desk.</p>
    </div>
    <ul class="fan" data-fan>
      ${['Your written rules', 'Your scripts', 'Your role board', 'The daily huddle', 'The weekly scoreboard', 'The monthly owner review', 'The measurement sheet'].map((t, i) => `<li style="--i:${i}">${t}</li>`).join('')}
    </ul>
  </div>
</section>

<section class="section section--surface" aria-labelledby="ai-h">
  <div class="wrap grid">
    <div class="col-7 stack" data-sc-in>
      <h2 class="h2" id="ai-h">Where does AI come in?</h2>
      <p class="lede">Only where your audit shows it will help.</p>
      <p class="body soft">Common fits: after-hours call capture, appointment reminders and confirmations, message sorting. We set it up, train your team on it, and count whether it worked. If AI is not the answer, we will say so.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="promise-h">
  <div class="wrap promise" data-sc-in>
    <div class="stack">
      <h2 class="h2" id="promise-h">Miss the day-90 number? <em>We keep working.</em></h2>
      <p class="lede">If your day-90 measure is missed and your practice met its side of the plan, we keep working on the same three priorities at no added fee, through day 180.</p>
      <p><a class="link" href="/keep-working-promise/">Read the full promise</a></p>
    </div>
    ${seal()}
  </div>
</section>

<section class="section section--line" id="price" aria-labelledby="price-h">
  <div class="wrap grid">
    <div class="col-6 stack" data-sc-in>
      <h2 class="h2" id="price-h">What it costs.</h2>
      <p><span class="num">$12,500</span></p>
      <p class="soft">for one location.</p>
    </div>
    <div class="col-5r" data-sc-in>
      <table class="ptable">
        <tbody>
          <tr><th scope="row">At signing</th><td>$6,250</td></tr>
          <tr><th scope="row">At kickoff</th><td>$6,250</td></tr>
          <tr><th scope="row">Each additional location</th><td>$3,000</td></tr>
          <tr><th scope="row">Practice Audit credit, if you sign within 30 days of your findings call</th><td>$1,500</td></tr>
        </tbody>
      </table>
      <p class="small mt-s">Prices are the same on a call as on this page.</p>
    </div>
  </div>
</section>

<section class="section section--line" aria-labelledby="who-h">
  <div class="wrap grid" style="align-items:center">
    <div class="col-4" data-sc-in><figure class="portrait" data-portrait><img src="/assets/jennifer-radu.webp" srcset="/assets/jennifer-radu-400.webp 400w, /assets/jennifer-radu.webp 720w" sizes="(max-width: 860px) 90vw, 26rem" width="720" height="900" loading="lazy" alt="Jennifer Radu, founder of Patient eXperience Consulting"></figure></div>
    <div class="col-6r stack" data-sc-in>
      <h2 class="h2" id="who-h">Who is in the room with your team?</h2>
      <p class="lede">Jennifer Radu. 21 years running practices. 12 urgent care clinics at once. Former teacher. Six surgeries as a patient.</p>
      <p class="pull">"I ran the desk. I taught the class. I sat in the waiting room."</p>
      <p><a class="link" href="/about/">Meet Jennifer</a></p>
    </div>
  </div>
</section>

${results()}

<section class="section section--line" aria-labelledby="q-h">
  <div class="wrap grid">
    <div class="col-4" data-sc-in><h2 class="h2" id="q-h">Questions about <em>the Reset.</em></h2></div>
    <div style="grid-column:6 / span 7" data-sc-in>${faqBlock(FAQ_RESET)}</div>
  </div>
</section>

${closeBlock(cfg, 'Find your three <em>in ten questions.</em>')}

<section class="section" aria-labelledby="fine-h">
  <div class="wrap">
    <h2 class="h3" id="fine-h">The fine print, in plain English.</h2>
    <ul class="fine mt-s">
      <li>The Keep-Working Promise applies when your day-90 measure is missed and your practice met its side of the plan you signed. It covers the same three priorities, at no added fee, through day 180.</li>
      <li>The promise is more work, not money back. It is not a refund.</li>
      <li>Results are measured and reported. They are not guaranteed.</li>
      <li>We never ask for, collect or store patient information. Counts are tallies, not charts.</li>
      <li>The Reset covers front-desk operations. It does not include EHR builds, billing projects, hiring searches or clinical care.</li>
    </ul>
  </div>
</section>`,
  };
};
