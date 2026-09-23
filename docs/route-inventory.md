# Route inventory — LIVE-OBSERVED 2026-09-23

Method: HTTP requests only (`curl -sIL` for status/chains, HTML parsing for head fields). No browser, no POST, no form submitted. Base host `https://www.sotyn.ai`.

**Counts:** discovered 41 HTML routes · tested 41 (100%) · blocked 0 · plus 7 synthetic unknown routes and 20 host/variant URLs = 74 distinct URLs probed. 0 failed requests. Static assets (33 images, 6 CSS, 1 favicon, 1 PDF) were enumerated; only the PDF was status-tested (200, `application/pdf`, 206,904 bytes).

**Completeness caveat:** discovery = sitemap + anchors on all 41 fetched pages + the repo's route files, which agree exactly. A route that is neither in the sitemap, nor linked, nor in the repo would not have been found.

## Statuses and directives

All rows LIVE-OBSERVED 2026-09-23. All 200s, no redirects on `www`. Classification is for this remediation: **KEEP** = no change needed now; **IMPROVE** = content/claim work identified.

| Path | Status | In sitemap (before → after) | Robots | Class |
|---|---|---|---|---|
| `/` | 200 | yes → yes | index | IMPROVE (language claim, proof attribution) |
| `/about` | 200 | yes → yes | index | IMPROVE (attribution, 500+ vs 535+, years) |
| `/platform` | 200 | yes → yes | index | IMPROVE (unattributed stats; differentiate from `/` and `/epc-erp-software`) |
| `/features` | 200 | yes → yes | index | IMPROVE (feature status markers) |
| `/epc-erp-software` | 200 | yes → yes | index | IMPROVE (orphan — no inbound links; feature status) |
| `/pricing` | 200 | yes → yes | index | IMPROVE (FAQ vs cards contradictions) |
| `/demo` | 200 | yes → yes | index | KEEP (form fixed) |
| `/ra-billing-software` | 200 | yes → yes | index | KEEP |
| `/material-reconciliation` | 200 | yes → yes | index | KEEP |
| `/reduce-project-delays` | 200 | yes → yes | index | KEEP |
| `/solutions/mep-contractors` | 200 | yes → yes | index | IMPROVE (feature status, unattributed stats) |
| `/solutions/solar-epc` | 200 | yes → yes | index | IMPROVE (same) |
| `/solutions/civil-contractors` | 200 | yes → yes | index | IMPROVE (geofencing claim in meta description) |
| `/solutions/industrial-epc` | 200 | yes → yes | index | IMPROVE (same) |
| `/compare` + 6 × `/compare/sotyn-vs-*` | 200 | yes → yes | index | IMPROVE (competitor claims to verify) |
| `/tools` + 10 × `/tools/*` | 200 | yes → yes | index | KEEP (calculator logic to unit-test next) |
| `/resources` + 3 × `/resources/*` | 200 | yes → yes | index | KEEP |
| `/scorecard` | 200 | yes → yes | index | KEEP |
| `/webinar` | 200 | yes → yes | index | IMPROVE (static "100 seats", schedule "every Saturday") |
| `/thank-you` | 200 | **yes → removed** | noindex | KEEP (was a noindex page in the sitemap) |
| `/social-kit` | 200 | **yes → removed** | noindex | KEEP (internal asset page) |
| `/404` | 404 | no → no | noindex | KEEP (canonical removed) |

Sitemap: **40 URLs before → 38 after**. No page was deleted, redirected or merged.

## Head-field quality (LIVE-OBSERVED 2026-09-23)

- Missing title / description / canonical / H1: **0 / 0 / 0 / 0** across 41 routes.
- Titles over 60 chars: **29 of 41** (longest `/platform`, 112).
- Meta descriptions over 160 chars: **33 of 41** (longest `/pricing`, 279).
- Duplicate titles: 1 (the 404 template, shared by all unknown routes — correct).
- Not yet changed: truncation in SERPs costs clicks but rewriting 33 descriptions is copy work that should follow the claim decisions in `claims-registry.md`, so the same text is not written twice.

## Host and duplicate-URL findings (the significant technical defects)

| Finding | Evidence | Status |
|---|---|---|
| Canonicals pointed at the non-www host, which 308-redirects | 44/44 canonicals = `https://sotyn.ai/...`; apex → 308 → www | **FIXED** on branch (`SITE.url` → www) |
| Every sitemap URL was a redirect | 40/40 listed as non-www + trailing slash → 308 | **FIXED** (www, no trailing slash, verified in `dist/`) |
| `robots.txt` advertised the non-www sitemap | `Sitemap: https://sotyn.ai/sitemap-index.xml` | **FIXED** |
| `/pricing` and `/pricing/` both 200, byte-identical (45,165 bytes) | confirmed on 3 paths | **FIXED** (`vercel.json` `trailingSlash: false`) |
| `/index.html` returns 200 — a third copy of the homepage | byte-identical to `/` | **FIXED** (`cleanUrls: true`) |
| `noindex` pages listed in the sitemap | `/thank-you`, `/social-kit` | **FIXED** (sitemap filter) |
| 404 page carried `canonical → /404` | all unknown routes | **FIXED** |
| Soft-404s | none — unknown routes return a real 404 | No action |
| Orphan pages (in sitemap, zero inbound links) | `/epc-erp-software`, `/social-kit`, `/thank-you` | `/epc-erp-software` is a commercial page and needs internal links — **open**; the other two are correctly orphaned |
