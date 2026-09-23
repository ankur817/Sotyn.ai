# sotyn.ai — audit and remediation, 2026-09-23

**Scope:** https://www.sotyn.ai/ (marketing site) — qualified ERP enquiries, attended demos, paid implementations, subscription revenue, India.
**Repo:** `ankur817/Sotyn.ai` · branch `fix/audit-2026-09-23` off `main` @ `fef5f86774277d7fb629dad29982a0be387c12cd`.
**Framework:** Astro 5 static build (`npm run build` → `dist/`), retained. No framework migration, no dependency changes.
**Deployment:** Vercel (`server: Vercel`, `x-vercel-cache` headers LIVE-OBSERVED 2026-09-23). Production is served on **www.sotyn.ai**.

**Evidence labels used throughout:** `LIVE-OBSERVED` (production HTTP), `SOURCE-OBSERVED` (repo), `VERIFIED-TEST` (test I ran), `HYPOTHESIS`, `BLOCKED`.

> Deployment status: **code complete on a branch, not deployed.** Nothing in this document has reached production.

---

## 1. Baseline

| Item | Value | Label |
|---|---|---|
| Live host serving 200 | `www.sotyn.ai` | LIVE-OBSERVED 2026-09-23 |
| Apex `sotyn.ai` | 308 → www (2 hops from `http://`) | LIVE-OBSERVED 2026-09-23 |
| Routes discovered / tested / blocked | 41 / 41 / 0 | LIVE-OBSERVED 2026-09-23 |
| Sitemap URLs | 40, all non-www + trailing slash, **40/40 returned 308 at the listed address** | LIVE-OBSERVED 2026-09-23 |
| Soft-404s | none — unknown routes return a real HTTP 404 | LIVE-OBSERVED 2026-09-23 |
| Deployed commit | **BLOCKED** — no Vercel access; the live HTML matches `main`'s content, which is evidence but not proof | BLOCKED |
| Full inventory | [route-inventory.md](route-inventory.md) | — |
| Claim / pricing / feature conflicts | [claims-registry.md](claims-registry.md) | — |
| Access gaps | [blocked-access.md](blocked-access.md) | — |

Page classification: **all 41 routes KEEP or IMPROVE. Nothing merged, nothing deleted, no redirects introduced.** No page was removed for low traffic (traffic data is BLOCKED — see below), and no new URL was created for an intent already served.

---

## 2. Defects verified and fixed on this branch

### A. Forms showed success when nothing was delivered — FIXED
SOURCE-OBSERVED (`LeadCapture.astro:100` at baseline): `form.hidden = true; done.hidden = false;` ran unconditionally after the fetch, so "You're all set." appeared after a failed webhook. `RegisterForm.astro` revealed "seat reserved" the same way; `BookLeadMagnet.astro` likewise. A `window.open()` WhatsApp popup was treated as delivery — a popup attempt proves nothing, and it is blocked by default on many browsers.

Fixed by a shared client, `src/lib/lead-client.js`. A lead counts as received **only** when the endpoint returns HTTP ok **and** a JSON body that does not report an error. An HTTP 200 carrying HTML (catch-all page, login wall, CDN error) is a failure — VERIFIED-TEST, `tests/lead-client.test.mjs`. On failure the visitor now keeps everything they typed and gets three labelled routes out: **Try again**, **Call +91 70099 87817**, **Send on WhatsApp instead**. No auto-popup, no full-screen redirect as the only recovery.

### B. Conversion events fired before the request succeeded — FIXED
SOURCE-OBSERVED (`DemoForm.astro:113`, `LeadCapture.astro:87`, `BookLeadMagnet.astro:114`, `RegisterForm.astro:89`): `fbq('track','Lead')` ran before the fetch. Now `trackAcceptedLead()` runs only inside the accepted branch, is de-duplicated per lead id, and pushes `generate_lead` to `dataLayer` with **only** `lead_source`, `lead_page` and an opaque `lead_id` — no name, phone, email, company or free text. Downloads push `file_download`, never `generate_lead`. `metaPixelId` is empty (SOURCE-OBSERVED), so no pixel is active today — the ordering is fixed for when one is added.

### C. WhatsApp fallback URLs were encoded twice, or not at all — FIXED
SOURCE-OBSERVED: `DemoForm` interpolated raw user values into a URL (an `&` or `#` in a company name truncated the message); `LeadCapture` pre-encoded `%0A` and then encoded again, with a `.replace(/%2520/g,"%20")` patch that does not match `%250A`, so newlines reached WhatsApp as literal `%0A` text. Now encoded exactly once in `waLink()`. VERIFIED-TEST: ampersand, hash, plus, and Hindi text round-trip exactly (`tests/lead-client.test.mjs`).

### D. The 3.5-second "speed trap" rejected real people — REMOVED
SOURCE-OBSERVED (`DemoForm.astro:99`): any submission under 3,500 ms was silently dropped with no message — that is autofill, password-manager fill, and fast typists, lost invisibly. Removed; the honeypot stays. Server-side rate limiting and abuse control remain **outstanding** on the ERP endpoint (see §5).

### E. Webhook — the endpoint is real; persistence is unproven
`https://securederp.in/api/public/sotyn-lead` is configured and live. VERIFIED-TEST 2026-09-23:
- `OPTIONS` from `https://www.sotyn.ai` → **204** with `access-control-allow-origin: https://www.sotyn.ai`, `POST,OPTIONS`, `Content-Type`.
- Apex origin `https://sotyn.ai` → also allowed.
- **Any other origin (e.g. a `*.vercel.app` preview) → 200 with no CORS header, i.e. the browser blocks it.** Consequence: **forms cannot be tested on a Vercel preview deployment** — they will fail there by design. Test on production or add the preview origin.
- `GET` → clean JSON `404 {"error":"Not found"}`, not an HTML catch-all. Good sign for the route.
- **BLOCKED:** whether a POST is durably stored, what the success body looks like, whether it returns a lead id, whether sales are notified, and whether duplicates are collapsed. I did not POST — that would create a real lead in a production CRM without authorisation. The client now expects JSON; if the endpoint returns a non-JSON 200 on success, every real lead will show the failure state. **Confirm the response contract before deploying** (§6).

### F. Structured data contradicted the product — FIXED
- `SoftwareApplication.offers.price: "0"` on a paid subscription → now an `AggregateOffer`, INR 72,000–3,00,000, read from `SITE.pricing`, pointing at `/pricing`. A free demo does not make the app free.
- `telephone: "+" + phoneHref` produced **`++917009987817`** → now `+917009987817`.
- The homepage emitted a **second Organization** entity named "sotyn.ai" while the layout emitted one named "Secured Engineers Pvt. Ltd." — two entities for one brand. Now one Organization with a stable `@id` (`.../#organization`), referenced by the SoftwareApplication (`.../#software`) as author and publisher.
- No ratings or reviews were invented. FAQ markup left as-is (eligibility is Google's call, never a guarantee).

### G. Manufactured urgency — DISABLED behind flags, code preserved
SOURCE-OBSERVED: `Countdown.astro` ignores `data-mode` entirely and, with `deadline: ""`, always targets the **end of the current month**, recomputed on every page load — so "Launch offer closes in" silently renews forever and the advertised close never happens. `seatsLeft: 25` is a hand-edited constant nothing decrements; `/pricing` rendered "Only 25 of 25 launch seats left" — a scarcity alert stating none had sold.
Now `countdown.enabled: false` and a new `offer.showSeatsLeft: false`. The component and the offer box are untouched and re-enable in one line each, once a real deadline and a real seat count exist.

### H. Canonical host, sitemap and duplicate URLs — FIXED
LIVE-OBSERVED 2026-09-23: every canonical (44/44) and every sitemap URL (40/40) pointed at the **non-www** host, which 308-redirects. `/pricing` and `/pricing/` both returned 200 with byte-identical bodies (45,165 bytes each), and `/index.html` was a third 200 copy of the homepage.
- `SITE.url` → `https://www.sotyn.ai`; canonicals, OG URLs, sitemap and `robots.txt` now name the address that actually serves 200. VERIFIED-TEST in `dist/`.
- `vercel.json`: `cleanUrls: true`, `trailingSlash: false` — one address per page at the edge.
- Sitemap `serialize` strips the trailing slash so listed URLs are the canonical ones.
- Sitemap `filter` drops `/thank-you` and `/social-kit`, which are `noindex` yet were listed (38 URLs now, was 40).
- `/404` no longer emits a canonical pointing at `/404`.

---

## 3. What I did NOT change (owner decisions)

These are contradictions between two live statements. I will not guess which one is commercially true — each needs your answer, then one number/status propagates from `src/config/site.ts`. Full evidence in [claims-registry.md](claims-registry.md).

1. **Office users** — plan cards say "Up to 10 / 25 office users"; the FAQ on the same page says "unlimited office and site users".
2. **Setup fee** — config and the page heading say ₹25,000 / ₹50,000; the FAQ says "₹1,000–₹25,000".
3. **Launch cohort** — "first 25, 40% off year 1" vs the FAQ's "first 100 … price locked for life" vs `/social-kit`'s "₹10,000/mo, locked for life" (a price matching no plan).
4. **Languages** — the homepage says sotyn.ai "runs in 11 languages" (present tense, five places); `/demo` and `/reduce-project-delays` say English is live and ten are rolling out. **This one is a purchase-driving claim on the highest-traffic page.**
5. **AI Auto-Quotation** — "coming soon" in four places; sold as shipping on `/epc-erp-software`, `/features`, `/solutions/*` and used as a "Yes" against named competitors on `/compare/*`, and priced at ₹1,00,000/yr in the value stack.
6. **Geofenced GPS + selfie attendance** — same split, including "Yes — no 2nd app" against competitors.
7. **Tally** — "links with Tally / keeps books in sync" vs "we migrate your data at setup" (paid).
8. **Mobile app** — sold as a plan feature while the footer says Android/iOS are "coming soon" and the schema says PWA.
9. **"Everything is included. Every plan."** — HRMS, Solar, AI quotation, Scorecard/War Room are Growth+; SSO, audit exports, SLA, on-prem are Enterprise-only.
10. **"Cancel anytime / pay monthly"** vs every plan being billed yearly.
11. **Proof attribution** — 535+ projects, 89.77% repeat clients, 93.32% early delivery, 1,13,880+ safe man-hours, ISO 9001:2015 and MSME are **Secured Engineers'** EPC record. On `/platform` and `/solutions/*` the stats render with no attribution, and the footer says "Trusted by 300+ EPC professionals daily" sitewide from a figure meaning parent-company staff. The three testimonials are all first-party and the section is headed "Proof, not promises".
12. **Missing pages** — there is no privacy policy, terms or security page, while every page promises India hosting, nightly backups, a full audit log, export-anytime and "never sold, never shared". Forms post to `securederp.in`, a different domain, undisclosed at the point of entry. This is the clearest gap for a B2B buyer's procurement check.

---

## 4. Measurement — what exists and what is missing

**BLOCKED, and not substituted with estimates:** Search Console for the sotyn.ai property (the connected route exposes Secured Engineers properties only), GA4 property access, GTM container, Google Trends exports, Keyword Planner, Ahrefs (`Insufficient plan`), SEOcrawl (`billing_context_missing`), Vercel project access, CRM/ERP lead ledger. See [blocked-access.md](blocked-access.md) for the exact permission each one needs.

Consequences, stated plainly: there is **no baseline for impressions, clicks, rankings, landing-page sessions, lead volume, attended demos or revenue** in this audit. Keyword priority in the map is therefore intent-and-fit based, not volume based, and is labelled as such. No page was judged "low traffic" because no traffic data was available.

Tracking on the live site: no GA4 or GTM tag was found in the page source (SOURCE-OBSERVED + LIVE-OBSERVED); `metaPixelId` is empty. So today, nothing measures whether a lead was created. The event spec in [lead-and-analytics-spec.md](lead-and-analytics-spec.md) is what to implement once a property is authorised — one measurement stack, not a second.

---

## 5. Still outstanding (needs backend or owner input)

1. **Confirm the webhook response contract** — success status, `Content-Type`, and body shape. If it does not return JSON, either change the endpoint or tell me and I will relax the check to match reality. Until then the client is deliberately strict.
2. **Server-side abuse control** — rate limiting per IP/phone, payload size limits, and server validation belong on `securederp.in`, not the browser.
3. **Duplicate suppression** — the client now sends `X-Request-Id` and a `requestId` in the body, stable across retries. The endpoint should treat a repeat id as the same lead.
4. **Lead receipt** — return an opaque lead id so the confirmation is evidence, and so analytics can de-duplicate.
5. **Notification routing** — who receives a lead, and what happens when the notification fails. Test in staging; do not send unapproved test leads into production.
6. **Privacy policy / terms**, and a line at each form saying where the data goes.

---

## 6. Verification performed

- `npm run build` — **passes**, 41 pages, sitemap generated. VERIFIED-TEST 2026-09-23.
- `npm test` — **46 tests, all passing** (`node --test`). Regression coverage for every defect above: false success, HTML-200 acceptance, non-2xx, unparseable JSON, network error, timeout, retry idempotency, encode-once with `&`/`#`/`+`/Hindi, no popup, no pixel-before-request, no PII in the dataLayer, price/display consistency, no `price: "0"`, no `++91`, flags off, canonical host.
- Built output inspected in `dist/`: canonical `https://www.sotyn.ai/pricing`; no canonical on `/404`; sitemap = 38 URLs, no trailing slashes, no `/thank-you` or `/social-kit`; `"telephone":"+917009987817"`; `AggregateOffer` INR 72000–300000; exactly one Organization entity.
- **Not verified:** real form delivery end-to-end (needs the contract confirmed and a controlled test), field performance data, anything requiring the blocked accounts.

---

## 8. Second pass — competitor accuracy, calculators, performance (same branch)

### Competitor claims corrected on `/compare/*`
Each rival's own website was fetched on 2026-09-23. Claims that their public pages contradict, or do not support, were corrected. Full evidence in [keyword-map.md](keyword-map.md) and below.

| Page | Was | Now | Why |
|---|---|---|---|
| `/compare/sotyn-vs-onsite` | "Freemium + paid", "Low cost of entry" | "₹12,000/user/yr, min 5 users", integrations named | **Contradicted.** Onsite publishes per-user pricing with a ₹60,000/yr five-user floor and **no free tier**. The old claim was both false and against sotyn.ai's own interest — a per-company price beats a per-user floor, and the page was giving that away |
| `/compare/sotyn-vs-onsite` | "Basic PO", "Simple billing*" | "Procurement + multi-level approvals", "Client invoicing & vendor billing; RA/MB not stated*" | Onsite names multi-level approvals, procurement, vendor billing and client invoicing, and targets EPC companies explicitly |
| `/compare/sotyn-vs-powerplay` | "Attendance*" (implying no payroll) | "Attendance + payroll" | **Contradicted.** Their module is literally named "Labour & Payroll Management" |
| `/compare/sotyn-vs-powerplay` | "Freemium + paid", "Low-friction freemium entry" | "Not published*", "Free trial to get started" | No pricing page exists on either Powerplay domain; a free trial is not freemium |
| `/compare/sotyn-vs-procore` | "Global cloud*" | "India residency not stated*" | **Unsourced negative about data residency** — the kind of claim a large vendor asks you to retract |
| `/compare/sotyn-vs-procore` | "Yes (enterprise)", "Via integrations*", "Enterprise quote" | "Yes*", "Resource management; payroll not stated*", "Priced by product + construction volume*" | Procore prices by product and Annual Construction Volume, not by an "enterprise tier" |
| `/compare/sotyn-vs-odoo` | "Self/partner hosted", "No BOQ-native" | "Odoo Online, or self/partner hosted", "BOQ not native*" | **Contradicted.** Odoo Online is included in all plans; and an unqualified absolute negative is indefensible against an app ecosystem that large |
| `/compare/sotyn-vs-rdash` | "Well-funded…", "Attendance; payroll*", "Sales-led / quote" | funding claim removed, "Attendance/payroll not stated*", "USD 1,000/user/yr published*" | Funding is not stated on their site; attendance/payroll is not claimed on their site (sotyn.ai was **over**-crediting them); their pricing is published |
| all six | "we keep this fair and up to date, and never overstate a rival's gaps" | "Checked against their own website in September 2026. Where their public pages don't state something, we say so rather than assume they can't do it" | The promise now matches the method, and every competitor-negative cell carries the marker |

**Powerplay is repositioning:** `getpowerplay.in` feature URLs now 301 to `getpowerplay.ai`, whose homepage leads on AI quantity takeoffs and bidding rather than site collaboration. That page should be re-verified before more is invested in it.

### Calculators
The ten calculators' arithmetic was DOM-coupled and untestable. It now lives in `src/lib/calc-formulas.js` as pure functions, with `CalcEngine.astro` as thin glue, and **23 unit tests** covering units (lakh/crore thresholds), zero, negative and extreme inputs, margin-vs-markup, GST add/remove as exact inverses, RA-bill net payable, and retention carrying cost. Three real defects fixed:
- a margin of 100%+ silently returned the un-margined base price → now refused with an explanation;
- an impossible GST rate divided by zero → refused;
- a zero recoverable amount produced a **fabricated payback period** (it divided by a hard-coded 1) → now "—".
Assumption labelling is now in the source and belongs on the pages too: leakage and recovery percentages are the **user's estimates**, never a measured customer saving; `cash-stuck` adds retention to receivables, which can overlap; GST/TDS rates are inputs, not advice.
Verified live in a browser: `/tools/gst` removing 18% from ₹1,18,000 returns ₹1,00,000 base / ₹18,000 GST, and the WhatsApp link is encoded exactly once.

### Performance
Measured and fixed: the Google Fonts request (18,776 B → 3,762 B of render-blocking CSS, 52 → 10 `@font-face` rules), the lazy-loaded LCP hero, the header logo's missing dimensions, and images served with `max-age=0`. The largest win — 1.29 MB of PNG/JPEG that re-encodes to ~0.59 MB — is deliberately held for its own change; details and the measured per-file table are in [performance.md](performance.md). **Field data (CrUX) and Lighthouse scores are BLOCKED** and no number was invented in their place.

### Form behaviour verified in a real browser
On a local build with the webhook unreachable (CORS), submitting the demo form now shows *"We couldn't send that request. Your details are still here…"*, keeps every entered value, stays on `/demo` instead of redirecting to `/thank-you`, and offers retry / call / WhatsApp with a correctly encoded message (`Test & Co #2` survives intact). Before this branch, the same failure showed a success screen.

---

## 9. Rollback

Everything is one branch, one PR, no data migration and no URL deletions.
- Revert the merge commit, or `git revert <sha>` — the site returns to `fef5f86` behaviour exactly.
- Individual switches: `countdown.enabled: true` and `offer.showSeatsLeft: true` restore the previous urgency UI; `SITE.url` back to `https://sotyn.ai` restores the old canonical host; remove `cleanUrls`/`trailingSlash` from `vercel.json` to restore edge behaviour.
- The riskiest item to reverse cleanly is the **canonical host switch** (www), because search engines will have started consolidating on it. Decide it once: www (as implemented, matching what Vercel already serves) or apex (which would mean changing the Vercel domain config instead). Do not alternate.
