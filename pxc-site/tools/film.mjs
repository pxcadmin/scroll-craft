// Render the hero as a film: steps the page's own timeline frame by frame in
// ?film mode, captures each frame, then muxes the soundtrack.
//   node tools/film.mjs [--url http://localhost:4500/] [--fps 30] [--w 1920 --h 1080] [--out hero-src/pxc-hero-film.mp4]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : d; };
const url = arg('--url', 'http://localhost:4500/'), fps = +arg('--fps', 30), W = +arg('--w', 1920), H = +arg('--h', 1080);
const out = arg('--out', 'hero-src/pxc-hero-film.mp4'), audio = arg('--audio', 'hero-src/audio/film.wav');
const dir = path.join(path.dirname(out), 'frames-' + W);
fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto(url + (url.includes('?') ? '&' : '?') + 'film');
await page.waitForFunction(() => window.__film && window.PXC_HERO_SEG);
await page.evaluate(() => document.fonts.ready);
const seg = await page.evaluate(() => window.PXC_HERO_SEG);
const total = seg.reduce((s, x) => s + x.sec, 0), N = Math.round(total * fps);
const pAt = (sec) => { let acc = 0; for (const s of seg) { if (sec <= acc + s.sec) return s.p0 + (s.p1 - s.p0) * ((sec - acc) / s.sec); acc += s.sec; } return 1; };
await page.evaluate(() => window.__film(0.45, 0)); // warm the footage
await page.waitForTimeout(1500);
for (let f = 0; f < N; f++) {
  const sec = f / fps;
  await page.evaluate(([p, s]) => window.__film(p, s), [pAt(sec), sec]);
  await page.screenshot({ path: path.join(dir, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  if (f % 60 === 0) process.stdout.write(`  frame ${f}/${N}\n`);
}
await browser.close();
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(dir, '%05d.jpg'), ...(fs.existsSync(audio) ? ['-i', audio, '-c:a', 'aac', '-b:a', '160k', '-shortest'] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(out, `${total.toFixed(2)}s, ${N} frames at ${fps} fps`);
