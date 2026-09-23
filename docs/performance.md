# Performance — measured evidence and what was fixed

Date 2026-09-23. Every number is measured, not modelled.

## Field data (CrUX): BLOCKED

The CrUX API requires a key (`HTTP 403 — "Method doesn't allow unregistered callers"`), and PageSpeed Insights' keyless endpoint returned `HTTP 429 RESOURCE_EXHAUSTED — "Quota exceeded … limit 'Queries per day' … quota_limit_value: 0"` on 14 attempts over ~12 minutes. A control run against `example.com` returned 429 too, so **the block is global to the keyless endpoint, not specific to sotyn.ai**.

Consequence, stated plainly: **there are no p75 LCP / INP / CLS figures in this document, and no Lighthouse scores.** No lab number has been substituted for a field number. To unblock: a free PSI API key, or a run from pagespeed.web.dev / Chrome DevTools. Targets when it is measurable: **p75 LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**, mobile and desktop reported separately.

## What was measured directly (LIVE-OBSERVED 2026-09-23)

Home page, as served:

| | Measured |
|---|---|
| HTML (brotli) | 26,267 B (125,084 B uncompressed) |
| TTFB (`x-vercel-cache: HIT`) | 0.45 s |
| **Total page weight** | **≈1.34 MB — images are 95.9% of it** |
| Images | 14 tags / 9 files = 1,351,351 B; **0 WebP/AVIF**, 0 `<picture>` |
| External scripts | **0** — no analytics, no tag manager, no chat widget |
| External stylesheets | 1 — Google Fonts |

Other templates are light: `/pricing` 11,559 B, `/tools/ra-bill` 11,584 B, `/solutions/mep-contractors` 8,092 B (brotli), 2 images each. **The home page carries the weight.**

## Fixed on this branch

| Fix | Measured effect |
|---|---|
| **Font request trimmed** — 8 static Inter weights (300–900) → the variable range `400..900`; weight 300 is used nowhere in `src/` | Render-blocking CSS **18,776 B → 3,762 B (−80%)**; `@font-face` rules **52 → 10**; still `display=swap` on all of them. Verified by fetching both URLs with a browser UA |
| **Hero image no longer lazy-loaded** — it is the LCP candidate and was `loading="lazy"`, deferring its request until after layout. Now `fetchpriority="high" decoding="async"` | Attribute change verified in `dist/` and in a real browser |
| **Logo given intrinsic dimensions** (744×333) — the only 2 of 14 images without them, and it sits in the header at load | Browser-verified: renders 139×72 from the CSS height plus the attribute aspect ratio — a layout-shift source removed with no visual change |
| **Cache headers for `/images/` and `/downloads/`** — images were served `max-age=0, must-revalidate`, so all 9 revalidated on every repeat visit (hashed Astro assets already cache for a year) | `public, max-age=2592000, stale-while-revalidate=86400`. Deliberately **not** `immutable`, because these filenames are not content-hashed and must stay replaceable |

## Not done — the biggest win, and why it is a separate change

Re-encoding the 9 images to WebP at the same dimensions was measured at **1,351,351 B → 592,382 B (−758,969 B, −56%)**, and resizing the oversized ones takes it further:

| File | Served | Opportunity |
|---|---|---|
| `hero-dashboard.png` | 192,457 B | intrinsic 2560×1640 but declared 1280×820 → resize + WebP ≈ **27,018 B (−86%)** |
| `sotyn_logo_v2.png` | 97,183 B | rendered at 72px high; at 2× DPR as WebP ≈ **27,714 B (−71%)**. Loads on **every page** |
| `real-site.jpg` | 249,530 B | WebP ≈ 133,854 B (−46%) |
| `book-autocad-to-site.jpg` | 165,768 B | WebP ≈ 55,722 B (−66%) |
| …5 more | — | see the table above; total −56% before resizing |

The right fix is Astro's own `astro:assets` — move these files from `public/images/` to `src/assets/` and use `<Image>`/`<Picture>`, which emits WebP/AVIF with `srcset` and correct dimensions at build time. **`sharp` is already installed** with Astro 5, so this needs **no new dependency**. It is held back only because it touches 9 files across many pages and deserves its own visual QA pass rather than riding along with correctness fixes. Vercel's runtime optimiser is not enabled on this deployment (`/_vercel/image` → 404), and build-time conversion is the better fit for a static site anyway.

Also worth doing later: self-hosting Inter and Anton removes the cross-origin blocking request entirely, at the cost of owning the font pipeline.

## Not applicable

No third-party scripts to defer. No external JS bundles (13,240 B of inline JS on the home page). Same-origin CSS totals 12,250 B brotli. `font-display: swap` was already correct.
