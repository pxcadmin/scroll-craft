// Static build for the PXC site. `node build.mjs` writes ./site, ready for any static host.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cfg from './site.config.mjs';
import { layout, ld } from './src/layout.mjs';
import home from './src/pages/home.mjs';
import reset from './src/pages/reset.mjs';
import inner from './src/pages/inner.mjs';
import { DOMINOES, FAQ_HOME } from './src/content.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'site');
const src = path.join(root, 'src');
const read = (f) => fs.readFileSync(path.join(src, f), 'utf8');
const write = (f, s) => { const p = path.join(out, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
fs.cpSync(path.join(src, 'assets'), path.join(out, 'assets'), { recursive: true });

// one stylesheet, one script
let css = ['scrollcraft.css', 'styles.css', 'scenes.css'].map(read).join('\n');
let js = ['scrollcraft.js', 'dominoes.js', 'site.js', 'hero.js'].map(read).join('\n;');
let quiz = read('screener.js');
try {
  const esbuild = await import('esbuild');
  css = (await esbuild.transform(css, { loader: 'css', minify: true })).code;
  js = (await esbuild.transform(js, { minify: true, target: 'es2018' })).code;
  quiz = (await esbuild.transform(quiz, { minify: true, target: 'es2018' })).code;
} catch { console.warn('esbuild not installed: shipping unminified assets (npm i to fix)'); }
write('assets/site.css', css);
write('assets/site.js', js);
write('assets/screener.js', quiz);

const pages = [home(cfg), reset(cfg), ...inner(cfg)];
for (const p of pages) write(p.file || path.join(p.path, 'index.html'), layout(cfg, p));

// sitemap, robots, llms.txt
const today = new Date().toISOString().slice(0, 10);
const listed = pages.filter((p) => !p.noindex);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...listed.map((p) => p.path), ...cfg.articles.map((a) => a.url)].map((u) => `  <url><loc>${cfg.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /

# AI answer engines are welcome. The short version of this site is at /llms.txt
Sitemap: ${cfg.url}/sitemap.xml
`);
write('llms.txt', `# ${cfg.name} (${cfg.short})

> ${cfg.short} fixes the front desk at independent medical practices. We find the three front-desk problems driving the rest, fix them with the practice's own team in 90 days, and measure the result on the same sheet we started with. One offer: the 90-Day Medical Front Desk Reset.

## Facts

- Who it is for: independent medical practices with 2 to 20 providers and one or two locations.
- Founder: Jennifer Radu, C.P.P.M. 21 years running medical practices, including 12 urgent care clinics across four counties at once. Former teacher.
- Location: ${cfg.city}, ${cfg.region}. All work is virtual, nationwide.
- Phone: ${cfg.phone}
- Patient information: never requested, never collected.

## The offer, in three steps

- Free Front Desk Screener, $0: ten questions, about five minutes, a first read on where the friction starts, and a 20-minute review call.
- Practice Audit, $1,500: a five-day count with no patient information, an observation of the hardest hour, findings, and an agreed Top 3. Credited to the Reset if the practice signs within 30 days of the findings call.
- 90-Day Medical Front Desk Reset, $12,500 for one location (half at signing, half at kickoff; additional locations $3,000 each): three priorities fixed with the team, each with a written rule, a named owner, a script, training and a weekly number. AI tools are set up only where the audit shows they fit.

## The Keep-Working Promise

If the day-90 measure is missed and the practice met its side of the plan, ${cfg.short} keeps working on the same three priorities at no added fee, through day 180. It is not a refund, and results are not guaranteed.

## The ten front desk dominoes

${DOMINOES.map((d, i) => `${i + 1}. ${d.t}: ${d.d}`).join('\n')}

## Pages

${listed.map((p) => `- [${p.h1 || p.title}](${cfg.url}${p.path}): ${p.desc}`).join('\n')}
${cfg.articles.length ? '\n## Articles\n\n' + cfg.articles.map((a) => `- [${a.title}](${cfg.url}${a.url}): ${a.description}`).join('\n') + '\n' : ''}
## Common questions

${FAQ_HOME.map(([q, a]) => `- ${q} ${a}`).join('\n')}
`);

const kb = (f) => (fs.statSync(path.join(out, f)).size / 1024).toFixed(1) + ' KB';
console.log(`built ${pages.length} pages -> site/   css ${kb('assets/site.css')}   js ${kb('assets/site.js')}`);
void ld;
