# Baseline technical audit — www.sotyn.ai

Date **2026-09-23**. Stack: **Astro 5** static build → **Vercel** (`server: Vercel`, region `bom1`). 44 routes (41 in the sitemap + `/404`, `/thank-you`, `/social-kit`, which are deliberately excluded). Evidence labels: `LIVE` production HTTP · `SOURCE` repo · `TEST` something I ran · `BLOCKED`.

This is a **baseline**, not a fresh discovery: several fixes from earlier rounds are already in production and are recorded as verified-closed so they are not re-reported as open work.

---

## A. What is already correct (verified today, do not redo)

| Area | Evidence |
|---|---|
| Render mode | Static HTML. Titles, H1s, copy, links, FAQs, pricing and JSON-LD are all in the server response — nothing critical is client-rendered or hydrated later (LIVE). No JS-rendering risk for search engines. |
| Canonical host | Every canonical uses `https://www.sotyn.ai/...`, the host that actually serves 200. Apex and `http://` both 308 to it (LIVE). |
| URL hygiene | `/pricing/` → 308 → `/pricing`; `/index.html` → 308 → `/`; no parameterised or duplicate variants; uppercase path returns a clean 404 (TEST). |
| Sitemap | `/sitemap-index.xml` → `/sitemap-0.xml`, 41 canonical URLs, no trailing slashes, `noindex` pages excluded (LIVE). `robots.txt` names the www sitemap. |
| Soft 404s | None. Unknown routes return a genuine HTTP 404 with `noindex` and no canonical (TEST, 7 URLs). |
| Broken internal links | **Zero.** All 49 distinct internal link targets across the 41 sitemap pages resolve (TEST). |
| Metadata coverage | Every page has a unique title, description, H1 and canonical (TEST). No duplicate titles. |
| Image alt text | 14 images on the homepage, **0 missing `alt`**; 4 decorative images correctly use empty alt (TEST). |
| Security headers | HSTS with preload, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` (LIVE). |
| Structured data | One Organization entity with a stable `@id`; `SoftwareApplication` with a real `AggregateOffer`; no Review or AggregateRating anywhere (LIVE). |
| Lead capture | Same-origin `/api/lead`, server-side validation, honest failure states, no false success (TEST). |

---

## B. Ranked issues

### P0 — indexing, measurement, or a broken business path

**P0-1 · There is no analytics or Search Console measurement at all**
*Evidence:* no GA4, GTM or pixel in the live HTML (LIVE); no authorised GSC property for sotyn.ai (BLOCKED, `docs/TOOL_ACCESS.md`).
*Impact:* every recommendation in this engagement is unmeasurable. No impressions, clicks, positions, landing-page performance or conversion rate exists — before or after.
*Fix:* owner confirms/creates the GA4 property and verifies `https://www.sotyn.ai` in Search Console; submit the sitemap; then implement the event spec in `docs/lead-and-analytics-spec.md` (one stack, no duplicate `page_view`/`generate_lead`).
*Effort:* 1h once access exists. *Risk:* low. *Validation:* DebugView + GSC sitemap read-back. *Rollback:* remove the tag.

**P0-2 · Google Sheets lead register is built but not receiving**
*Evidence:* `/api/lead` returns `sheet: "not_configured"` after two fresh production deploys (TEST).
*Impact:* leads reach the ERP but not the register sales was told to work from.
*Fix:* one owner action — put `SHEETS_WEBAPP_URL` / `SHEETS_WEBAPP_TOKEN` on the Vercel project whose **Domains** tab lists `www.sotyn.ai` (five projects build this repo), Production scope, then redeploy.
*Effort:* 5 min. *Risk:* none to the site. *Validation:* POST returns `sheet:"ok"` and the row reads back by Lead ID. *Rollback:* remove the variables.

**P0-3 · The 11-language claim contradicts the product on the highest-value page**
*Evidence:* `/` says sotyn.ai "runs in 11 languages" in body copy **and in its meta description**; `/demo` and `/reduce-project-delays` say English is live and ten are rolling out; schema declares two (SOURCE, LIVE).
*Impact:* a buying-stage claim that the demo itself contradicts. It is also the description shown in search results.
*Fix:* client decides the true status; one wording propagates from `SITE`.
*Effort:* 1h after the decision. *Risk:* none. *Validation:* grep for the claim across `src/`. *Rollback:* revert commit.

### P1 — directly limits qualified visibility or conversion

**P1-1 · No privacy policy, terms or security page**
*Evidence:* no such routes exist (SOURCE); yet every page promises India hosting, nightly backups, audit log, "never sold, never shared", and forms post to `securederp.in` — a different domain, undisclosed at the point of entry (LIVE).
*Impact:* B2B procurement blocker; also a trust signal search engines and AI systems use to judge an entity.
*Fix:* publish privacy, terms and a factual security page covering only verified posture; add a line at each form naming where data goes.
*Effort:* 3-4h + client input. *Risk:* low — but **never invent a certification**. *Validation:* links from footer, no unverifiable claim. *Rollback:* unpublish.

**P1-2 · No blog, documentation, help centre or changelog**
*Evidence:* the route list has no editorial or docs section (SOURCE).
*Impact:* nowhere for implementation detail, product behaviour, constraints or original operating evidence to live — the exact material that earns informational rankings and gives AI systems something citable. It also leaves the site with no `Article`/`BlogPosting` surface and no freshness signal.
*Fix:* start with a small docs set tied to the three new workflow pages rather than a blog.
*Effort:* ongoing. *Risk:* low. *Validation:* each page passes the §Phase-5 usefulness test. *Rollback:* n/a.

**P1-3 · Heading hierarchy skips levels on 37 of 41 pages**
*Evidence:* `h2 → h4` on `/`, `/about`, `/compare`; `h1 → h3` on all six comparison pages; 37 pages affected (TEST).
*Impact:* weaker document outline for assistive technology and for machines extracting structure; accessibility rather than ranking.
*Fix:* demote/promote the offending headings in `ProblemPage.astro`, `compare/[slug].astro`, `index.astro` — styling stays, semantics change.
*Effort:* 2h. *Risk:* low, CSS-coupled. *Validation:* re-run the heading check. *Rollback:* revert.

**P1-4 · Homepage weight is 1.34 MB, 96% of it images**
*Evidence:* 9 files = 1,351,351 B; re-encoding to WebP at the same dimensions measures **592,382 B (−56%)**; the hero is 2560×1640 served for a 1280×820 slot (TEST, `docs/performance.md`).
*Impact:* mobile LCP on Indian 4G — the primary audience.
*Fix:* move the 9 files to `src/assets/` and use Astro's `<Image>`/`<Picture>`; `sharp` ships with Astro, so no new dependency.
*Effort:* 3h + visual QA. *Risk:* medium (touches many pages) — do it in its own PR. *Validation:* byte comparison + screenshots before/after. *Rollback:* revert.

**P1-5 · Core Web Vitals cannot be measured**
*Evidence:* PSI keyless → `429`, daily quota `0`; CrUX → `403` without a key (TEST, retried).
*Impact:* no field p75 LCP/INP/CLS, so performance work cannot be verified as improving real-user experience.
*Fix:* a free PSI API key, or a manual run from pagespeed.web.dev.
*Effort:* 5 min. *Risk:* none. *Validation:* record baseline before P1-4 lands.

### P2 — quality, CTR, internal linking, schema

**P2-1 · Descriptions exceed the useful display length on 33 of 41 pages** (longest 279 chars). Rewrite the 12 commercial pages first; truncation costs clicks. *Effort:* 3h. *Validation:* length check in the inventory CSV.

**P2-2 · Three orphan-ish pages.** `/epc-erp-software` is a commercial page with almost no inbound internal links (it now has the footer, but no contextual links from `/` or `/platform`). `/thank-you` and `/social-kit` are correctly orphaned. *Fix:* contextual links from the homepage and platform page. *Effort:* 1h.

**P2-3 · No `WebSite`/`WebPage` schema and no visible breadcrumb on several templates.** `BreadcrumbList` is emitted on the workflow pages, which do render a visible breadcrumb — correct. Homepage and hub pages have neither. *Fix:* add `WebSite` once at the root; add `BreadcrumbList` only where the breadcrumb is visible. *Effort:* 1h.

**P2-4 · FAQ markup exists on several pages.** The FAQs are genuinely visible and useful, so the markup is honest — but it should be kept for users, not as a rich-result tactic, since Google no longer surfaces FAQ rich results for most sites. No action beyond not expanding it.

**P2-5 · Calculator pages have no `SoftwareApplication`/`WebApplication` treatment or result-sharing path.** Ten calculators are a genuine asset with no structured entity and no onward route except WhatsApp. *Fix:* contextual link from each result to the matching workflow page (partly done for RA bill / retention). *Effort:* 2h.

### P3 — after the fundamentals

- **P3-1** Self-host Inter/Anton to remove the last render-blocking cross-origin request (the font CSS is already down from 18,776 B to 3,762 B).
- **P3-2** Add `Content-Security-Policy` and `Permissions-Policy` headers — currently absent; needs care because they can break embeds. **Do not change security headers without the owner's approval.**
- **P3-3** Image `decoding="async"` on the remaining below-fold images.
- **P3-4** `/features` is a 40-item list with no internal links into the workflow pages it describes.
- **P3-5** `netlify.toml` is dead config next to `vercel.json` — harmless, but it is a second deploy contract that will confuse someone. Owner decides: delete or keep deliberately.

---

## C. Explicitly not recommended

- No doorway or city-swap pages, no programmatic page generation, no keyword-stuffed footers.
- No `Review`/`AggregateRating` markup — there are no independent reviews, and self-authored ratings are not eligible.
- No `Product` schema — the site does not sell a purchasable SKU with the required properties.
- No blanket `noindex`, no mass URL removal, no redirecting live pages to the homepage.
- No claim of AI-tool citation, guaranteed indexing, or a ranking position.

## D. Rollback posture

Every change so far is a single reversible commit on `main` with a passing test suite (138 tests) and no data migration. Feature switches exist for the riskiest behaviour (`countdown.enabled`, `offer.showSeatsLeft`, `SITE.url`, `vercel.json` URL rules). Nothing in this audit requires deleting a URL.
