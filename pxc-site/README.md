# PXC website

Static, multipage site for Patient eXperience Consulting, built on the scroll-craft engine from this repo and the build guide dated Nov 17, 2026.

```bash
npm install        # esbuild only, for minifying
npm run build      # writes ./site (deploy this folder to any static host)
npm run serve      # http://localhost:4500
```

## Before launch: fill `site.config.mjs`

| Setting | Why it matters |
| --- | --- |
| `url` | Currently `https://www.example.com`. Drives every canonical, schema `@id`, the sitemap and `llms.txt`. |
| `formEndpoint` | Where the screener and contact form POST JSON (CRM webhook). Empty: forms fall back to `contactEmail`, then to the phone number. |
| `schedulerUrl` | Embeds the scheduler on `/contact/` and the screener result. Empty: the contact form shows instead. |
| `sameAs` | LinkedIn, YouTube, Google Business Profile. Feeds schema and the About page. |
| `articles` | The live site's 14 articles and 2 guides, at their current URLs. They are not in this repo and still need to be carried over. |

## What is where

- `src/pages/home.mjs`: the 14 homepage sections and the 3D hero scene markup.
- `src/hero.js`, `src/scenes.css`: the hero camera and the domino scene. The hero is a real CSS 3D room (five depth bands, a doorway the camera passes through), not a photograph, so it carries no stock people and needs no disclaimer.
- `src/content.mjs`: dominoes, FAQs, measurement sheet rows. One source for pages, schema and `llms.txt`.
- `src/pages/reset.mjs`, `src/pages/inner.mjs`: Reset, Audit, Screener, Method, Dominoes, Promise, About, Contact, Resources, 404.
- `src/scrollcraft.*`: the engine, copied unmodified.

## Copy that needs Jennifer's review

Written from the facts in the build guide, not from the live site, which was not available here:

- Reset FAQ answers and Audit FAQ answers (`src/content.mjs`).
- "Signs" and "First fix" for each domino, and the ten screener questions.
- "What is our side of the plan?" on the Keep-Working Promise page. These are contract-adjacent terms.
- The About page is about 330 words. The guide asks for 800, which needs detail only Jennifer has.
- URLs for Audit, Screener, Method, About, Contact and Resources are assumed. Match them to the live site or add 301s.
