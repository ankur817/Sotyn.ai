# Claim / feature / pricing registry — SOURCE-OBSERVED 2026-09-23

Every row is what the repo says today (branch `fix/audit-2026-09-23`). Nothing here is a recommendation and no commercially correct answer has been guessed. Each **DECISION** needs your answer; the answer then lives in `src/config/site.ts` and every page reads from it.

## 1. Pricing

| Claim | Where | Wording | Conflict |
|---|---|---|---|
| Starter | `site.ts` plans[0] | ₹6,000/mo · "₹72,000 billed yearly" · `annualInr: 72000` | consistent (asserted by `tests/pricing.test.mjs`) |
| Growth | `site.ts` plans[1] | ₹12,500/mo · "₹1,50,000 billed yearly" · `annualInr: 150000` | consistent |
| Enterprise | `site.ts` plans[2] | "₹3,00,000 +/yr" **and** "custom quote" | card shows a hard figure and "custom" at once |
| Enterprise definition | `pricing.astro` FAQ | "for ₹50 Cr+ groups that need multi-company and API" | "multi-company" and "API" appear nowhere else in `src/` |
| Office users | `site.ts` plan notes | "Up to 10 office users" / "Up to 25 office users" | **DECISION 1** — the FAQ on the same page says "unlimited office and site users, with no per-seat fees" |
| Setup fee | `site.ts` setup bands + `pricing.astro:133` | ₹25,000 (Starter) / ₹50,000 (Growth & Enterprise) | **DECISION 2** — the FAQ says "₹1,000–₹25,000, by team size" |
| Launch cohort | `site.ts` offer + `pricing.astro` | "first 25 contractors, 40% off year 1" | **DECISION 3** — the FAQ says "first 100 contractors … price locked for life"; `/social-kit` says "₹10,000/mo, locked for life" (matches no plan) |
| Discount display | `site.ts` `strike: ""` on all plans | 40% off is advertised but never shown as a struck-through price | no discounted figure is ever rendered |
| Billing cadence | `site.ts` + `pricing.astro:14` | all plans "billed yearly" vs "Pay monthly and cancel anytime, or pay annually to get the lower rate" | **DECISION 10** — no monthly price exists in config |
| "Everything included, every plan" | `pricing.astro:12,117` | "every module … no module up-sells" | **DECISION 9** — HRMS, Solar, AI quotation, Scorecard/War Room are Growth+; SSO, audit exports, SLA, on-prem are Enterprise-only |
| Onboarding scope | `site.ts` vs FAQ | "masters import, BOQ setup, 2 training sessions" vs "data migration from Tally & Excel, master setup and team training" | tied to DECISION 7 (Tally) |
| 30-day money-back | 9 places | consistent everywhere | no conflict |
| ROI payback input | `site.ts roi.annualCost: 150000` | calculator assumes the Growth price while the page headline is "from ₹6,000/mo" | assumption should be stated on the calculator |
| Structured data | `BaseLayout.astro` | AggregateOffer INR 72,000–3,00,000 | **FIXED** (was `price: "0"`) |

## 2. CTA destinations (`/pricing`)

| Element | Label | Href before | Href now |
|---|---|---|---|
| Growth plan card (highlighted) | "Book a demo" | **`/webinar`** | `/demo` — **FIXED** |
| Starter / Enterprise cards | "Book a demo" / "Talk to us" | `/#demo` | `/demo` — **FIXED** |
| Offer box primary | "Claim your launch seat" | `/webinar` | unchanged (label matches destination) |
| Offer box secondary | "Get your free leak score first" | `/scorecard` | unchanged |
| ROI box | "Join the free masterclass" | `/webinar` | unchanged |
| CTA band | "Book a free demo" | `/#demo` | unchanged — **open**: the header uses `/demo`, the band uses `/#demo`; pick one |
| CTA band copy | "Join the free masterclass, or book a 1-on-1 demo." | — | **open** — the band has no masterclass link |

## 3. Language support — RESOLVED 2026-09-26

**Settled as "English today, ten rolling out"**, driven by `SITE.languages.uiStatus`.
Evidence for choosing that over "11 live": the product's own sign-in screen is
English only with no language switcher (checked 2026-09-26); `/demo` and
`/reduce-project-delays` already told buyers the ten were rolling out; and the
structured data declared two. Only the homepage claimed eleven were live, and a
claim the demo itself contradicts costs more than it wins.

**To flip it:** set `uiStatus: "live"` in `src/config/site.ts` and move the
languages into `uiLive`. The homepage section, the FAQ answer and
`availableLanguage` all follow from that one line, and a test fails the build if
any page claims eleven languages while the switch says otherwise.

### Original finding

| Where | Wording | Implied status |
|---|---|---|
| `index.astro` (FAQ, eyebrow, lead, mobile bullet, meta description — 5 places) | "runs in 11 languages", "India's first 11-language EPC ERP" | **AVAILABLE**, present tense |
| `demo.astro` FAQ | "English is live today; the 10 most-spoken Indian languages are rolling out." | **COMING SOON** |
| `reduce-project-delays.astro` FAQ | "The 10 most-spoken Indian languages are rolling out" | **COMING SOON** |
| `BaseLayout.astro` schema | `availableLanguage: ["en","hi"]`, `inLanguage: "en-IN"` | **2 languages** |

The homepage claim also drives the meta description, i.e. it is what a buyer sees in search results.

## 4. Feature status — DECISIONS 5–9

| Feature | Claimed COMING SOON | Claimed AVAILABLE | Note |
|---|---|---|---|
| AI Auto-Quotation | `site.ts` capabilities, Growth features, every-plan includes; `resources/tender-rate-analysis` ("opens for early access") | `epc-erp-software`, `solutions/[slug]`, `features`, `compare/[slug]` ("Yes — Excel/PDF" against 3 named rivals) | also priced at ₹1,00,000/yr in the value stack |
| Geofenced GPS + selfie attendance | `site.ts` capabilities; `calculators.ts` | `epc-erp-software`, `solutions/[slug]` (incl. an indexed meta description), `compare/[slug]` ("Yes — no 2nd app") | priced at ₹40,000/yr in the value stack |
| Tally | — | `features` ("Tally link — keeps your accountant's books in sync"), `index` FAQ ("links with Tally") | vs migration-only wording in `demo`, `ra-billing-software`, `pricing`, `index:815` |
| Native mobile app | `Footer` ("coming soon on Google Play and the App Store"), `index` store badges | `site.ts` plan features + includes ("Mobile app") | schema says `Web, Android, iOS (PWA)` |
| Solar division | — | every-plan includes **and** Growth-only features | gating contradiction |
| TOC War Room | — | capabilities, `epc-erp-software`, `compare`, `solutions` | Growth+ in plan features |
| SSO / priority SLA | — | Enterprise card only | each appears exactly once, with no terms anywhere |
| Compliance RAG | `index.astro` (`soon: true`) | — | consistent |
| Ask-anything AI assistant | `platform.astro:116` "rolling out" | `platform.astro:108` present tense | same page, 8 lines apart |

## 5. Proof and attribution — DECISION 11

| Claim | Attribution as rendered |
|---|---|
| 535+ projects · 18+ states · 300+ users · ₹11.7 Cr savings | Attributed to Secured Engineers on `/`, `/epc-erp-software`, `/webinar`. **Unattributed** on `/platform` and `/solutions/*` (the latter under "Run on real EPC sites, not a demo.") |
| 89.77% repeat clients · 93.32% projects delivered early · 1,13,880+ safe man-hours | Parent-company EPC metrics rendered in a grid beside "Projects run on it" / "Users every day". No baseline, period or definition of "early" anywhere |
| ISO 9001:2015 · MSME · GST | Parent-company credentials rendered as software trust badges in every footer and on `/demo`, `/epc-erp-software`. No certificate number or scope. Footer says "certified" where config says "registered" |
| Footer: "Trusted by 300+ EPC professionals daily" | Sitewide, sourced from a label meaning parent-company staff |
| Named clients (V-Guard, Luminous, Sonalika, Hero Homes) | In a **testimonial card** attributed to "The track record behind it"; the client strip elsewhere is correctly labelled "Clients served by the company that built it" |
| 3 testimonials | All first-party (founder / the company), under the heading "Proof, not promises". Config confirms **no third-party customer quotes exist** |
| "14 years" (5 places) vs `foundingDate: 2011` | 2011 → 2026 is 15 years |
| `about.astro`: "500+ projects by year ten" vs 535+ at year 14 | unreconciled |

**No fabricated case study, review, rating or client quote was added.** Where proof is missing, the fix is to collect it with consent, not to write it.

## 6. Hosting, security, compliance — DECISION 12

Claimed sitewide: hosted in India · Indian data centres · nightly **offsite** backups (one place says just "nightly backups", and that is the version rendered on `/pricing`) · full audit log · role-based access · "never sold, never shared" · "export any time" · private workspace (all plans) vs private instance / on-prem (Enterprise only, never described).

**There is no privacy policy, terms, security or DPA page in `src/pages/`.** Lead forms post to `securederp.in` — a different domain from sotyn.ai — and no form says so. "Indian compliance" is claimed with no standard named (no DPDP, SOC 2 or ISO 27001 claim — do **not** add one unless it is real and certified).

## 7. Urgency mechanics — FIXED behind flags

| Mechanic | What the code did | Now |
|---|---|---|
| Countdown | `data-mode` is never read; with an empty `deadline` it targets the end of the **current month**, recomputed each page load — the "launch offer" renews monthly, forever, and can never expire | `countdown.enabled: false`. Component preserved; re-enable only with `mode: "fixed"` and a real deadline |
| Seats left | `seatsLeft: 25` hard-coded, nothing decrements it; `/pricing` rendered "Only 25 of 25 launch seats left" | `offer.showSeatsLeft: false`. Re-enable when the number comes from a real record |
| Webinar "Only 100 seats per session" | static string, not a live registration count | **open** — either make it real or soften the wording |
