// Page shell: head, schema, header, footer.
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

export const faqBlock = (items) => `<div class="faq">${items.map(([q, a], i) => `
  <details${i === 0 ? ' open' : ''}><summary><h3>${q}</h3></summary><p>${a}</p></details>`).join('')}
</div>`;
export const faqLd = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

export const person = (cfg) => ({
  '@type': 'Person', '@id': `${cfg.url}/about/#jennifer`, name: 'Jennifer Radu', jobTitle: 'Founder, Medical Front Desk Consultant',
  honorificSuffix: 'C.P.P.M.', worksFor: { '@id': `${cfg.url}/#org` }, url: `${cfg.url}/about/`, image: `${cfg.url}/assets/jennifer-radu.webp`,
  description: '21 years running medical practices, including 12 urgent care clinics across four counties at once. Former teacher.',
  ...(cfg.sameAs.length ? { sameAs: cfg.sameAs } : {}),
});
const org = (cfg) => ({
  '@context': 'https://schema.org', '@type': 'Organization', '@id': `${cfg.url}/#org`, name: cfg.name, alternateName: cfg.short, url: `${cfg.url}/`,
  logo: `${cfg.url}/assets/logo-full.svg`, telephone: cfg.tel, founder: { '@id': `${cfg.url}/about/#jennifer` },
  address: { '@type': 'PostalAddress', addressLocality: cfg.city, addressRegion: cfg.region, addressCountry: 'US' },
  ...(cfg.sameAs.length ? { sameAs: cfg.sameAs } : {}),
});
const website = (cfg) => ({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${cfg.url}/#site`, url: `${cfg.url}/`, name: cfg.name, publisher: { '@id': `${cfg.url}/#org` } });
const crumbsLd = (cfg, crumbs) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: cfg.url + url })) });

export const crumbsNav = (crumbs) => `<nav aria-label="Breadcrumb"><ol class="crumbs">${crumbs.map(([n, u], i) => i === crumbs.length - 1 ? `<li aria-current="page">${n}</li>` : `<li><a href="${u}">${n}</a></li>`).join('')}</ol></nav>`;

export const CTA = '<a class="btn" href="/free-front-desk-screener/" data-ev="screener_cta">Take the free screener</a>';
export const closeBlock = (cfg, h2 = 'A calmer practice starts <em>with a clearer picture.</em>', sub = 'Ten questions. About five minutes. Find where the front-desk friction starts.') => `
<section class="close" aria-labelledby="close-h">
  <div class="wrap" data-sc-in>
    <p class="eyebrow">Your next step</p>
    <h2 class="h2 mt-s" id="close-h">${h2}</h2>
    <p class="lede">${sub}</p>
    ${CTA}
    <p class="small mt-s">Prefer a conversation? <a class="link" href="tel:${cfg.tel}" data-ev="call">${cfg.phone}</a></p>
  </div>
</section>`;

export const deskSvg = (busy) => `<svg viewBox="0 0 820 300" fill="none" stroke="var(--s)" stroke-width="1.5" aria-hidden="true" focusable="false">
  <path d="M132 22c-26-4-40-22-44-46 26 2 42 18 44 46zM132 22c2-30 20-48 48-52-2 30-20 48-48 52z" fill="var(--f)"/><path d="M132 22c-8-16-18-26-30-34M132 22c8-20 20-32 34-40"/>
  <rect x="110" y="22" width="44" height="48" fill="var(--f)"/>
  <path d="M520 70 548 0h142l-28 70z" fill="var(--f)"/>
  ${busy ? `<g fill="rgba(239,238,243,.85)" stroke="rgba(23,23,29,.5)"><path d="M214 70l10-9h98l-10 9zM220 61l10-9h98l-10 9zM212 52l10-9h98l-10 9zM224 43l10-9h98l-10 9zM700 70l8-8h84l-8 8zM706 62l8-8h84l-8 8z"/></g>
  <g stroke="none"><rect x="566" y="12" width="26" height="24" fill="rgba(255,52,57,.75)" transform="rotate(-6 579 24)"/><rect x="606" y="18" width="26" height="24" fill="rgba(181,164,228,.8)" transform="rotate(5 619 30)"/><rect x="640" y="8" width="26" height="24" fill="rgba(247,246,249,.7)" transform="rotate(-3 653 20)"/></g>` : '<path d="M398 70v-26h24v26" fill="var(--f)"/>'}
  <rect x="0" y="70" width="820" height="26" fill="var(--f)"/>
  <rect x="40" y="96" width="740" height="204" fill="var(--f)"/>
  <path d="M62 96v204M80 96v204M98 96v204M116 96v204"/>
  <circle cx="410" cy="198" r="58"/><path d="M396 160h28v24h24v28h-24v24h-28v-24h-24v-28h24z"/>
</svg>`;

export function layout(cfg, p) {
  const canonical = cfg.url + p.path;
  const crumbs = p.crumbs || [['Home', '/']];
  const nav = [['/services/90-day-front-desk-reset/', 'The Reset'], ['/method/', 'How it works'], ['/#results', 'Results'], ['/about/', 'Meet Jennifer']];
  const schema = [org(cfg), website(cfg), crumbsLd(cfg, crumbs), ...(p.schema || [])];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.name)}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#0A0A0E">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/work-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<noscript><style>[data-sc-in],[data-sc-stagger]>*,[data-sc-cue]{opacity:1!important;transform:none!important}.pxc svg text{stroke-dashoffset:0}.seal circle,.seal path.s{stroke-dashoffset:0}.seal text{opacity:1}</style></noscript>
${schema.map(ld).join('\n')}
</head>
<body${p.body ? ` class="${p.body}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
<header class="bar${p.solidBar ? ' is-solid' : ''}" data-bar>
  <div class="wrap bar__in">
    <a class="bar__logo" href="/" aria-label="${esc(cfg.name)}, home"><img src="/assets/logo-wordmark.svg" width="102" height="26" alt="PXC"></a>
    <button class="bar__menu" type="button" aria-expanded="false" aria-controls="nav" data-menu>Menu</button>
    <nav class="bar__nav" id="nav" aria-label="Main">
      ${nav.map(([u, t]) => `<a href="${u}"${u === p.path ? ' aria-current="page"' : ''}>${t}</a>`).join('\n      ')}
      <a href="tel:${cfg.tel}" data-ev="call">${cfg.phone}</a>
      <a class="btn btn--sm" href="/free-front-desk-screener/" data-ev="screener_cta">Take the free screener</a>
    </nav>
  </div>
</header>
<main id="main">
${p.html}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <div class="foot__logo">
        <img src="/assets/logo-full.svg" width="176" height="130" alt="${esc(cfg.name)}" loading="lazy">
        <p class="mt-s">Less front-desk chaos. More room to care.</p>
      </div>
      <nav aria-label="Services"><h2>The work</h2><ul>
        <li><a href="/free-front-desk-screener/">Free Front Desk Screener</a></li>
        <li><a href="/services/practice-audit/">Practice Audit</a></li>
        <li><a href="/services/90-day-front-desk-reset/">90-Day Front Desk Reset</a></li>
        <li><a href="/keep-working-promise/">The Keep-Working Promise</a></li>
      </ul></nav>
      <nav aria-label="Learn"><h2>Learn</h2><ul>
        <li><a href="/method/">The PXC Method</a></li>
        <li><a href="/the-10-dominoes/">The 10 Front Desk Dominoes</a></li>
        <li><a href="/resources/">Resources</a></li>
        <li><a href="/about/">Meet Jennifer</a></li>
      </ul></nav>
      <div><h2>Contact</h2>
        <address>${cfg.name}<br>${cfg.city}, ${cfg.region}<br><a href="tel:${cfg.tel}" data-ev="call">${cfg.phone}</a><br><a href="/contact/">Book a call</a></address>
      </div>
    </div>
    <div class="foot__legal">
      <p>Scenes on this site are illustrations. They are not clients and not patient records. We never ask for patient information.</p>
      <p>Results are measured, not guaranteed. The Keep-Working Promise is not a refund. <a href="/keep-working-promise/">Read the full promise</a>.</p>
      <p>&copy; ${new Date().getFullYear()} ${cfg.name}. ${cfg.city}, ${cfg.region}. Virtual, nationwide.</p>
    </div>
  </div>
</footer>
<script>window.PXC=${JSON.stringify({ formEndpoint: cfg.formEndpoint, schedulerUrl: cfg.schedulerUrl, contactEmail: cfg.contactEmail, phone: cfg.phone, tel: cfg.tel })};</script>
<script src="/assets/site.js" defer></script>
${(p.scripts || []).map((s) => `<script src="${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}
