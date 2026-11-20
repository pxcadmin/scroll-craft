import { CTA, closeBlock, crumbsNav, faqBlock, faqLd, person } from '../layout.mjs';
import { DOMINOES, FAQ_AUDIT } from '../content.mjs';
import { seal } from './home.mjs';

const phero = (crumbs, eyebrow, h1, lede, extra = '') => `
<section class="phero" aria-labelledby="h">
  <div class="wrap">
    ${crumbsNav(crumbs)}
    <div class="stack">
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="h1" id="h">${h1}</h1>
      <p class="lede">${lede}</p>
      ${extra}
    </div>
  </div>
</section>`;
const portrait = (alt) => `<figure class="portrait" data-portrait><img src="/assets/jennifer-radu.webp" srcset="/assets/jennifer-radu-400.webp 400w, /assets/jennifer-radu.webp 720w" sizes="(max-width: 860px) 90vw, 30rem" width="720" height="900" alt="${alt}"></figure>`;
const QUIZ_OPTS = ['Rarely', 'Some days', 'Most days', 'Every day'];

export default (cfg) => {
  const C = (name, url) => [['Home', '/'], [name, url]];
  const call = `<a class="link" href="tel:${cfg.tel}" data-ev="call">${cfg.phone}</a>`;
  const pages = [];

  /* ------------------------------------------------------- Practice Audit */
  pages.push({
    path: '/services/practice-audit/',
    title: 'Medical Practice Front Desk Audit | $1,500 | PXC',
    desc: 'Know what to fix and what can wait. A five-day count, an observation and a signed Top 3. Credited toward the 90-Day Reset.',
    h1: 'Practice Audit', crumbs: C('Practice Audit', '/services/practice-audit/'),
    schema: [
      { '@context': 'https://schema.org', '@type': 'Service', name: 'Practice Audit', serviceType: 'Medical front desk audit', provider: { '@id': `${cfg.url}/#org` }, areaServed: { '@type': 'Country', name: 'United States' },
        description: 'A five-business-day count of the front desk with no patient information, an observation of the hardest hour, a Domino Map, a signed Top 3 and a quick-win kit.',
        offers: { '@type': 'Offer', price: '1500', priceCurrency: 'USD', url: `${cfg.url}/services/practice-audit/`, description: 'Credited to the 90-Day Reset if you sign within 30 days of your findings call.' } },
      faqLd(FAQ_AUDIT),
    ],
    html: `${phero(C('Practice Audit', '/services/practice-audit/'), 'Practice Audit', 'Know what to fix. <em>And what can wait.</em>', 'Step one of the Reset. Five business days. $1,500, credited to the Reset.', `<div class="actions">${CTA}<a class="link" href="/contact/?topic=practice-audit">Book the audit call</a></div>`)}

<section class="section section--line" aria-labelledby="a1">
  <div class="wrap grid">
    <div class="col-7 stack" data-sc-in>
      <h2 class="h2" id="a1">What is the Practice Audit?</h2>
      <p class="lede">The Practice Audit is a five-business-day count of your front desk, an observation of your hardest hour, and a findings call that ends with a Top 3 you sign. It costs $1,500 and it uses no patient information.</p>
      <p class="body soft">Most practices already know the front desk is under strain. What they do not have is a count. Without one, every fix is a guess, and the loudest problem wins. The audit replaces the guess with five days of tallies, so you can see which problems are driving the others and which ones can wait.</p>
      <p class="pull">Count the break before you buy a tool for it.</p>
    </div>
  </div>
</section>

<section class="section section--line" aria-labelledby="a2">
  <div class="wrap">
    <h2 class="h2" id="a2" data-sc-in>How the five days run.</h2>
    <div class="days" data-fill><i class="days__fill" aria-hidden="true"></i>
      <ol class="days--4">
        <li data-at="0"><b>Days 1 to 5</b><span>Your team tallies calls, lines, overrides, no-shows and open messages alongside the normal day. Tick marks, not charts.</span></li>
        <li data-at="0.33"><b>Your hardest hour</b><span>We observe the hour your desk finds hardest, so the count has context.</span></li>
        <li data-at="0.66"><b>Findings call</b><span>We walk through your Domino Map and what the count shows.</span></li>
        <li data-at="0.98"><b>Your Top 3</b><span>You choose and sign the three priorities worth fixing first.</span></li>
      </ol>
    </div>
  </div>
</section>

<section class="section section--line" aria-labelledby="a3">
  <div class="wrap grid">
    <div class="col-5 stack" data-sc-in>
      <h2 class="h2" id="a3">What do you get?</h2>
      <p class="body soft">Five things, written for your desk. They are yours to keep whether or not you go on to the Reset.</p>
    </div>
    <div class="col-6r" data-sc-in>
      <ol class="gets" style="margin-top:0">
        <li>The five-day count, on one sheet</li><li>An observation of your hardest hour</li><li>Your Domino Map: which of the <a class="link" href="/the-10-dominoes/">ten dominoes</a> are falling, and in what order</li>
        <li>A signed Top 3: the three priorities to fix first</li><li>A quick-win kit your team can use right away</li>
      </ol>
    </div>
  </div>
</section>

<section class="section section--surface" aria-labelledby="a4">
  <div class="wrap grid">
    <div class="col-6 stack" data-sc-in>
      <h2 class="h2" id="a4">What it costs.</h2>
      <p><span class="num">$1,500</span></p>
      <p class="soft">Credited to the 90-Day Reset if you sign within 30 days of your findings call.</p>
    </div>
    <div class="col-5r stack" data-sc-in>
      <h3 class="h3">No patient information. Ever.</h3>
      <p class="soft">Your team counts events, not people. No names, no charts, no access to your EHR. The sheet holds tallies and nothing else.</p>
      <h3 class="h3" style="margin-top:2.5rem">What happens next?</h3>
      <p class="soft">If the count shows three problems worth 90 days of work, the <a class="link" href="/services/90-day-front-desk-reset/">90-Day Reset</a> fixes them with your team. If it does not, you will hear that plainly.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="a5">
  <div class="wrap grid">
    <div class="col-4" data-sc-in><h2 class="h2" id="a5">Questions about <em>the audit.</em></h2></div>
    <div style="grid-column:6 / span 7" data-sc-in>${faqBlock(FAQ_AUDIT)}</div>
  </div>
</section>
${closeBlock(cfg)}`,
  });

  /* ------------------------------------------------------------- Screener */
  pages.push({
    path: '/free-front-desk-screener/',
    title: 'Free Front Desk Screener for Medical Practices | PXC',
    desc: 'Ten questions. About five minutes. See where your front-desk friction starts. No patient information needed.',
    h1: 'Free Front Desk Screener', crumbs: C('Free Front Desk Screener', '/free-front-desk-screener/'), solidBar: true,
    scripts: ['/assets/screener.js'],
    schema: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Free Front Desk Screener', url: `${cfg.url}/free-front-desk-screener/`, applicationCategory: 'BusinessApplication', operatingSystem: 'Any',
      description: 'Ten questions that show which three of the ten front desk dominoes are most likely driving the rest at a medical practice. No patient information.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, provider: { '@id': `${cfg.url}/#org` } }],
    html: `
<section class="phero" aria-labelledby="h" style="padding-bottom:4rem">
  <div class="wrap">
    ${crumbsNav(C('Free Front Desk Screener', '/free-front-desk-screener/'))}
    <p class="eyebrow">Free Front Desk Screener</p>
    <h1 class="h2 mt-s" id="h">A clearer picture <em>in ten questions.</em></h1>
    <p class="small mt-s">About five minutes. No patient information. Think about a normal week at your front desk.</p>
    <div class="quiz" data-quiz>
      <div class="quiz__bar" aria-hidden="true"><i></i></div>
      <div data-quiz-body aria-live="polite">
        <fieldset><legend class="eyebrow">Question 1 of 10</legend>
          <p class="h3 quiz__q">${DOMINOES[0].q}</p>
          <div class="opts">${QUIZ_OPTS.map((o, i) => `<button type="button" class="opt" data-v="${i}"><i>${'ABCD'[i]}</i>${o}</button>`).join('')}</div>
        </fieldset>
      </div>
      <noscript><p class="mt-s">The screener needs JavaScript. You can also call ${cfg.phone} and go through it by phone.</p></noscript>
    </div>
    <script type="application/json" id="quiz-data">${JSON.stringify({ opts: QUIZ_OPTS, items: DOMINOES.map((d) => ({ t: d.t, q: d.q, d: d.d, fix: d.fix })) }).replace(/</g, '\\u003c')}</script>
  </div>
</section>

<section class="section section--line" aria-labelledby="s2">
  <div class="wrap grid">
    <div class="col-5 stack" data-sc-in>
      <h2 class="h3" id="s2">What is the Front Desk Screener?</h2>
      <p class="soft">Ten questions, one for each of the <a class="link" href="/the-10-dominoes/">ten front desk dominoes</a>. Your answers show the three most likely to be knocking over the rest. It is a first read, not an audit.</p>
    </div>
    <div class="col-6r stack" data-sc-in>
      <h2 class="h3">What happens after?</h2>
      <p class="soft">You see your likely three on screen, with a first fix for each. Then you can book a 20-minute review call. If you want the count done properly, the <a class="link" href="/services/practice-audit/">Practice Audit</a> is the next step.</p>
    </div>
  </div>
</section>`,
  });

  /* --------------------------------------------------------------- Method */
  pages.push({
    path: '/method/',
    title: 'The PXC Method: Pinpoint, eXecute, Compound | PXC',
    desc: 'How PXC fixes a medical front desk. Pinpoint what starts the chain reaction, eXecute the fixes with your team, Compound the better day.',
    h1: 'The PXC Method', crumbs: C('The PXC Method', '/method/'),
    html: `${phero(C('The PXC Method', '/method/'), 'The PXC Method', 'Pinpoint. eXecute. <em>Compound.</em>', 'Find the friction. Do the work. Keep it working. Three steps, in that order, over 90 days.')}

<section class="section section--line" aria-labelledby="m0">
  <div class="wrap grid"><div class="col-7 stack" data-sc-in>
    <h2 class="h2" id="m0">How does the PXC Method work?</h2>
    <p class="lede">The PXC Method finds the three front-desk problems driving the rest, fixes them with your own team, and builds the routines that keep them fixed. Each step has a plain output you can hold: a count, a rule, a number.</p>
  </div></div>
</section>

${[
  ['P', 'Pinpoint.', 'Find what starts the chain reaction.', 'One missed handoff rarely stays one problem. Pinpoint is how we find the one that started it. Your team runs a five-day count alongside the normal day. We observe your hardest hour. Then you choose and sign a Top 3.', ['A five-day count', 'An observation of your hardest hour', 'A Top 3 you sign'], '/services/90-day-front-desk-reset/#the-90-days', 'Days 1 to 6 of the Reset'],
  ['X', 'eXecute.', 'Put the fixes into everyday use.', 'A fix that lives in a binder is not a fix. Each of your three priorities gets a rule your team can read in a minute, one named owner, a script, hands-on training, and a number tracked every week.', ['A written rule', 'A named owner', 'Scripts and hands-on training', 'A number your team tracks each week'], '/services/90-day-front-desk-reset/#the-90-days', 'Days 7 to 80 of the Reset'],
  ['C', 'Compound.', 'Make the better day repeatable.', 'The work holds when the routine holds. Three rhythms keep it going after we leave: a daily huddle, a weekly scoreboard, and a monthly owner review. They are short, and they are yours.', ['A daily huddle', 'A weekly scoreboard', 'A monthly owner review'], '/services/90-day-front-desk-reset/#price', 'What stays when we leave'],
].map(([l, name, sub, body, list, href, label]) => `
<section class="section section--line" aria-labelledby="m-${l}">
  <div class="wrap grid" style="align-items:start">
    <div class="col-4 pxc" style="margin:0;border:0;display:block" data-sc-in><svg viewBox="0 0 150 170" aria-hidden="true" style="width:clamp(8rem,16vw,15rem)"><text x="0" y="150">${l}</text></svg></div>
    <div class="col-7 stack" style="grid-column:6 / span 7" data-sc-in>
      <h2 class="h2" id="m-${l}">${name}</h2>
      <p class="lede">${sub}</p>
      <p class="body soft">${body}</p>
      <ul class="list">${list.map((i) => `<li>${i}</li>`).join('')}</ul>
      <p><a class="link" href="${href}">${label}</a></p>
    </div>
  </div>
</section>`).join('')}
${closeBlock(cfg)}`,
  });

  /* ------------------------------------------------------------- Dominoes */
  pages.push({
    path: '/the-10-dominoes/',
    title: 'The 10 Front Desk Dominoes | Medical Practice Operations | PXC',
    desc: 'The ten front-desk problems in a medical practice, and how one knocks over the next. Find your three.',
    h1: 'The 10 Front Desk Dominoes', crumbs: C('The 10 Front Desk Dominoes', '/the-10-dominoes/'),
    schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'The 10 Front Desk Dominoes', numberOfItems: 10, itemListElement: DOMINOES.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.t, description: d.d })) }],
    html: `${phero(C('The 10 Front Desk Dominoes', '/the-10-dominoes/'), 'The map', 'Which problems knock <em>the others over?</em>', 'One missed handoff rarely stays one problem. We map your front desk as ten dominoes and fix the three that are knocking over the rest.')}

<section class="section section--line" aria-labelledby="d0">
  <div class="wrap grid">
    <div class="col-4 stack" data-sc-in>
      <h2 class="h2" id="d0">What are the ten front desk dominoes?</h2>
      <p class="soft">The ten places a medical front desk breaks, in the order a patient meets them. Each one leans on the next. Open any of them to see the signs, what it costs, and the first fix.</p>
      <p>${CTA}</p>
    </div>
    <div style="grid-column:6 / span 7" data-sc-in>
      <div class="faq">${DOMINOES.map((d, i) => `
        <details${i === 0 ? ' open' : ''} id="domino-${i + 1}"><summary><h3><span style="color:var(--cyan)">${i + 1}.</span> ${d.t}</h3></summary>
          <p><b style="color:var(--sc-ink);font-weight:500">What it costs.</b> ${d.d}</p>
          <p><b style="color:var(--sc-ink);font-weight:500">Signs.</b> ${d.signs}</p>
          <p><b style="color:var(--sc-ink);font-weight:500">First fix.</b> ${d.fix}</p></details>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="section section--surface" aria-labelledby="d1">
  <div class="wrap grid"><div class="col-7 stack" data-sc-in>
    <h2 class="h2" id="d1">Why only three?</h2>
    <p class="lede">Because ten priorities is no priority. Fix the three that are knocking over the rest and the others often stand back up on their own.</p>
    <p class="body soft">The free screener gives you a first read on your three in about five minutes. The <a class="link" href="/services/practice-audit/">Practice Audit</a> confirms them with a five-day count.</p>
  </div></div>
</section>
${closeBlock(cfg, 'Find your three <em>in ten questions.</em>')}`,
  });

  /* -------------------------------------------------------------- Promise */
  pages.push({
    path: '/keep-working-promise/',
    title: 'The Keep-Working Promise | PXC',
    desc: 'If your day-90 measure is missed and you met your side of the plan, PXC keeps working at no added fee through day 180.',
    h1: 'The Keep-Working Promise', crumbs: C('The Keep-Working Promise', '/keep-working-promise/'),
    html: `
<section class="phero" aria-labelledby="h">
  <div class="wrap promise">
    <div>
      ${crumbsNav(C('The Keep-Working Promise', '/keep-working-promise/'))}
      <div class="stack">
        <p class="eyebrow">Our promise</p>
        <h1 class="h1" id="h">Miss the number? <em>We keep working.</em></h1>
        <p class="lede">If your day-90 measure is missed and your practice met its side of the plan, we keep working on the same three priorities at no added fee, through day 180.</p>
      </div>
    </div>
    <div class="sc-in">${seal()}</div>
  </div>
</section>

<section class="section section--line">
  <div class="wrap grid">
    <div class="col-7 prose" data-sc-in>
      <h2 class="h2" style="margin-top:0">What is the Keep-Working Promise?</h2>
      <p>It is what happens if the 90-Day Reset does not reach the number you signed. We do not walk away at day 90 with the work unfinished. We stay on the same three priorities, at no added fee, for up to 90 more days.</p>
      <h3 class="h3">How does it work?</h3>
      <ul>
        <li>On day 6 you sign your three priorities and the measure for each one.</li>
        <li>On day 90 we count again, on the same sheet we used on day one.</li>
        <li>If a signed measure is missed and your practice met its side of the plan, the work continues on those priorities through day 180.</li>
      </ul>
      <h3 class="h3">What is our side of the plan?</h3>
      <p>Your side is written into the plan you sign on day 6, in plain words, before the work starts. It is the practice's share of the work: the count gets tallied, each workflow has a named owner, the training sessions happen, and the team uses the new routine.</p>
      <h3 class="h3">What the promise is not.</h3>
      <ul>
        <li>It is not a refund. The promise is more work, not money back.</li>
        <li>It is not a guarantee of results. Results are measured and reported, not guaranteed.</li>
        <li>It does not add new priorities. It covers the same three you signed.</li>
        <li>It ends on day 180.</li>
      </ul>
      <h3 class="h3">Why make it?</h3>
      <p>Because an operator stays until the work holds. If we agreed on a number and your team did its part, the remaining work is ours to finish.</p>
      <p class="small">Questions about the promise? Call ${call}.</p>
    </div>
  </div>
</section>
${closeBlock(cfg)}`,
  });

  /* ---------------------------------------------------------------- About */
  pages.push({
    path: '/about/',
    title: 'Jennifer Radu, Medical Front Desk Consultant | PXC',
    desc: '21 years running medical practices, including 12 urgent care clinics at once. Former teacher. Patient. Founder of PXC in Bradenton, FL.',
    h1: 'Jennifer Radu', crumbs: C('Meet Jennifer', '/about/'),
    schema: [{ '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${cfg.url}/about/`, mainEntity: person(cfg) }],
    html: `
<section class="phero" aria-labelledby="h">
  <div class="wrap grid" style="align-items:center">
    <div class="col-7">
      ${crumbsNav(C('Meet Jennifer', '/about/'))}
      <div class="stack">
        <p class="eyebrow">Meet Jennifer Radu</p>
        <h1 class="h1" id="h">The practice. The patient. <em>The person doing the work.</em></h1>
        <p class="lede">Jennifer Radu, C.P.P.M., is the founder of Patient eXperience Consulting. She has run the front desk, taught the class, and sat in the waiting room.</p>
      </div>
    </div>
    <div class="col-4" style="grid-column:9 / span 4">${portrait('Jennifer Radu, C.P.P.M., founder of Patient eXperience Consulting')}</div>
  </div>
</section>

<section class="section section--line" aria-label="Experience">
  <div class="wrap">
    <ul class="proof" data-sc-in data-sc-stagger="90">
      <li><span class="num" data-sc-count="0 21">21</span><p>years running medical practices.</p></li>
      <li><span class="num" data-sc-count="0 12">12</span><p>urgent care clinics managed at once.</p></li>
      <li><span class="num" data-sc-count="0 4">4</span><p>counties in parallel.</p></li>
      <li><span class="num" data-sc-count="0 6">6</span><p>back surgeries as a patient.</p></li>
    </ul>
  </div>
</section>

<section class="section section--line">
  <div class="wrap grid">
    <div class="col-7 prose" data-sc-in>
      <h2 class="h2" style="margin-top:0">Who is Jennifer Radu?</h2>
      <p>Jennifer Radu is a medical practice operator with more than 21 years in the work. She holds the C.P.P.M. credential, taught before she managed, and founded Patient eXperience Consulting in Bradenton, Florida, to fix one part of a practice well: the front desk.</p>
      <h3 class="h3">The practice.</h3>
      <p>Jennifer has spent over 21 years running medical practices. At one point that meant 12 urgent care clinics across four counties, all at once. She knows what a Monday morning sounds like when three lines are ringing and one person is at the desk, because that was her desk.</p>
      <h3 class="h3">The patient.</h3>
      <p>Six back surgeries put Jennifer on the other side of the window. She has been the patient on hold, the patient in the line, and the patient who called back to find out what happened to a message. That is why PXC measures the day from the front desk outward.</p>
      <h3 class="h3">The person doing the work.</h3>
      <p>Before she ran practices, Jennifer taught. It shows in how a Reset runs. A new routine is not announced. It is written down, practiced with the people who will use it, and counted every week until it holds.</p>
      <p class="pull">An operator, not a binder.</p>
      <p>Jennifer brings all three to your team: change the work, teach the new routine, keep it going.</p>
      <p class="creds"><span>C.P.P.M.</span><span>Former teacher</span><span>21 years in practice</span><span>${cfg.city}, ${cfg.region}</span></p>
      ${cfg.sameAs.length ? `<p>${cfg.sameAs.map((u) => `<a class="link" href="${u}" rel="me noopener">${new URL(u).hostname.replace('www.', '')}</a>`).join(' &nbsp; ')}</p>` : ''}
    </div>
  </div>
</section>
${closeBlock(cfg)}`,
  });

  /* -------------------------------------------------------------- Contact */
  pages.push({
    path: '/contact/',
    title: 'Talk to PXC | Bradenton, FL and Virtual Nationwide',
    desc: 'Tell us where the day gets stuck. Book a 20-minute call or dial (941) 239-2309. No patient information needed.',
    h1: 'Talk to PXC', crumbs: C('Contact', '/contact/'), solidBar: true,
    schema: [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: `${cfg.url}/contact/`, about: { '@id': `${cfg.url}/#org` } }],
    html: `
<section class="phero" aria-labelledby="h">
  <div class="wrap grid">
    <div class="col-5">
      ${crumbsNav(C('Contact', '/contact/'))}
      <div class="stack">
        <h1 class="h2" id="h">Tell us where <em>the day gets stuck.</em></h1>
        <p class="lede">Book a 20-minute call. No patient information. No pressure. A clear next step when you hang up.</p>
        <p class="num" style="font-size:clamp(2rem,1.5rem + 2vw,3rem)"><a href="tel:${cfg.tel}" data-ev="call" style="text-decoration:none">${cfg.phone}</a></p>
        <address class="soft" style="font-style:normal">${cfg.name}<br>${cfg.city}, ${cfg.region}<br>All work is virtual, nationwide.</address>
      </div>
    </div>
    <div class="col-6r" data-sched>
      <form class="form" data-form="contact" novalidate>
        <label>Your name<input name="name" autocomplete="name" required></label>
        <label>Practice name<input name="practice" autocomplete="organization"></label>
        <label>Email<input name="email" type="email" autocomplete="email" required></label>
        <label>Phone<input name="phone" type="tel" autocomplete="tel"></label>
        <label>Where does the day get stuck? Please do not include patient information.<textarea name="message" rows="4"></textarea></label>
        <label class="vh" aria-hidden="true">Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label>
        <div class="actions"><button class="btn" type="submit">Request a 20-minute call</button></div>
        <p class="form__msg" role="status"></p>
      </form>
    </div>
  </div>
</section>`,
  });

  /* ------------------------------------------------------------ Resources */
  const tools = [
    ['/free-front-desk-screener/', 'Free Front Desk Screener', 'Ten questions. A first read on which three problems are driving the rest.', 'Take the screener'],
    ['/#calculator', 'Missed-Call Calculator', 'Three inputs. What missed calls cost you each month, by your own count.', 'Run your numbers'],
    ['/the-10-dominoes/', 'The 10 Front Desk Dominoes', 'The ten places a front desk breaks, with signs and a first fix for each.', 'See the map'],
    ['/method/', 'The PXC Method', 'Pinpoint, eXecute, Compound. How the work runs, step by step.', 'Read the method'],
    ['/keep-working-promise/', 'The Keep-Working Promise', 'What happens if the day-90 number is missed, in plain English.', 'Read the promise'],
    ['/services/practice-audit/', 'The Practice Audit', 'What a five-day count looks like and what you get at the end.', 'About the audit'],
  ];
  const gloss = [
    ['Five-day count', 'Five business days of tallies kept by your own team: calls, lines, overrides, no-shows and open messages. No patient information.'],
    ['Domino Map', 'A one-page picture of which of the ten front desk dominoes are falling at your practice, and in what order.'],
    ['Top 3', 'The three priorities you choose and sign after the count. The Reset fixes these and only these.'],
    ['Named owner', 'One person responsible for a workflow. Not a department, not "the front desk." A name.'],
    ['Daily huddle', 'A short daily check-in where the team looks at today and yesterday\'s misses.'],
    ['Weekly scoreboard', 'The few numbers your team tracks each week to see whether the fix is holding.'],
    ['Monthly owner review', 'A monthly look at the scoreboard by the practice owner, so the routine outlasts the Reset.'],
    ['Keep-Working Promise', 'If the day-90 measure is missed and the practice met its side of the plan, PXC keeps working at no added fee through day 180.'],
  ];
  pages.push({
    path: '/resources/',
    title: 'Front Desk Resources for Medical Practices | PXC',
    desc: 'Free tools, guides and plain-English definitions for running a calmer medical front desk. Screener, missed-call calculator, the ten dominoes.',
    h1: 'Resources', crumbs: C('Resources', '/resources/'),
    schema: [{ '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'PXC front desk glossary', hasDefinedTerm: gloss.map(([t, d]) => ({ '@type': 'DefinedTerm', name: t, description: d })) }],
    html: `${phero(C('Resources', '/resources/'), 'Resources', 'Make the next <em>busy day clearer.</em>', 'Free tools and plain-English guides for the front desk. Use them with or without us.')}

<section class="section section--line" aria-labelledby="r1">
  <div class="wrap">
    <h2 class="h2" id="r1" data-sc-in>Free tools.</h2>
    <div class="cards" data-sc-in data-sc-stagger="70">
      ${tools.map(([u, t, d, l]) => `<a class="card" href="${u}"><h3 class="h3">${t}</h3><p>${d}</p><span class="link">${l}</span></a>`).join('\n      ')}
    </div>
  </div>
</section>
${cfg.articles.length ? `
<section class="section section--line" aria-labelledby="r2">
  <div class="wrap">
    <h2 class="h2" id="r2" data-sc-in>Articles and guides.</h2>
    <div class="cards" data-sc-in>${cfg.articles.map((a) => `<a class="card" href="${a.url}"><h3 class="h3">${a.title}</h3><p>${a.description}</p><span class="link">Read</span></a>`).join('')}</div>
  </div>
</section>` : ''}
<section class="section section--line" aria-labelledby="r3">
  <div class="wrap">
    <h2 class="h2" id="r3" data-sc-in>What do these terms mean?</h2>
    <dl class="gloss" data-sc-in>${gloss.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
    <p class="mt-m">More questions? <a class="link" href="/#questions">Read the common ones</a>.</p>
  </div>
</section>
${closeBlock(cfg)}`,
  });

  /* ------------------------------------------------------------------ 404 */
  pages.push({
    path: '/404.html', file: '404.html', noindex: true, solidBar: true,
    title: 'Page not found | PXC', desc: 'That page is not here. Start with the free front desk screener.',
    html: `
<section class="phero" aria-labelledby="h" style="min-height:80vh">
  <div class="wrap stack">
    <p class="eyebrow">Page not found</p>
    <h1 class="h1" id="h">Let's get you <em>to the right place.</em></h1>
    <p class="lede">That page has moved or never existed. These will get you where you were going.</p>
    <div class="actions">${CTA}<a class="link" href="/">Home</a><a class="link" href="/services/90-day-front-desk-reset/">The Reset</a><a class="link" href="/contact/">Contact</a></div>
  </div>
</section>`,
  });

  return pages;
};
