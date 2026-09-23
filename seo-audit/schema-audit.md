# Structured data audit — www.sotyn.ai

**Audit date:** 2026-09-23
**Scope:** 19 live production URLs, JSON-LD only.
**Evidence labels:** every finding is marked **LIVE-OBSERVED (2026-09-23)** when it comes from
production HTML fetched with `curl` on that date, or **SOURCE-OBSERVED** when it comes from the
repository on `main` (audit started at commit `9e35784`; `src/` line numbers below are current as of
commit `8eb6413` — see the note under *Sources of truth*).

**Sources of truth**

- `src/layouts/BaseLayout.astro` lines 32–103 — sitewide `Organization` + `SoftwareApplication`,
  assembled at line 117 (`const allSchema = [orgSchema, siteSchema, appSchema, ...schema]`) and
  injected at lines 191–192 (`<script type="application/ld+json" set:html={JSON.stringify(s)} />`).
- Per-page `schema={...}` props in `src/pages/**`.
- `src/config/site.ts` — the values those blocks read (phone, address, pricing).

> **Source moved during this audit.** While the audit was running, `src/layouts/BaseLayout.astro`
> gained a third sitewide entity — `WebSite` (`@id .../#website`, `publisher` → `#organization`,
> `inLanguage: "en-IN"`) at lines 105–115, now included in `allSchema` at line 117. **That entity is
> not yet on production:** none of the 19 live pages fetched on 2026-09-23 emitted a `WebSite` node,
> so it appears in no table below. It is correctly built (it references the Organization by `@id`
> rather than copying it, and deliberately omits `SearchAction`, per the comment at lines 105–106 —
> which matches §7 of this report). Re-validate after it deploys. All `src/` line numbers in this
> report are as of that post-change state; line numbers for the live behaviour described are the
> lines that produced it.

---

## 1. How the audit was run

**Extraction (LIVE-OBSERVED, 2026-09-23).** All 19 URLs returned HTTP 200 and were fetched with
`curl -sL -A 'Mozilla/5.0'`. Every `<script type="application/ld+json">` block was parsed. **All
blocks on all 19 pages parsed as valid JSON — zero syntax errors.**

**Validation (LIVE-OBSERVED, 2026-09-23).** Schema Markup Validator, `https://validator.schema.org/validate`.

Two corrections to the intended command are worth recording, because they change how this is
re-run:

1. The POST field is **`html`**, not `code`. A request using `--data-urlencode "code@FILE"` returns
   `{"fetchError":"NOT_FOUND","numObjects":0,"totalNumErrors":0,"totalNumWarnings":0}` — a response
   that looks like a clean pass but means *nothing was submitted*. Do not read a zero from that
   shape as a green result.
2. The response is prefixed with `)]}'` on its own line, which must be stripped before JSON parsing.

Working command:

```
curl -s --data-urlencode "html@FILE" -A 'Mozilla/5.0' https://validator.schema.org/validate
```

`url=<page URL>` also works and validates the rendered live page, but Google rate-limits it to a
302 redirect after roughly three calls, so the markup was submitted directly instead. Requests were
paced; two pages needed retries after rate-limiting, and all 19 eventually returned a result.

**Google Rich Results Test (LIVE-OBSERVED, 2026-09-23): not available — manual run required.**
Probed and confirmed unreachable:

- `https://searchconsole.googleapis.com/v1/urlTestingTools/richResults:run` → HTTP 404 (GET and POST).
- `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run` → HTTP 404
  (the sibling API this endpoint was modelled on has been retired).
- `https://search.google.com/test/rich-results?url=...` → HTTP 200 but a JavaScript-only shell with
  no result payload.

No Rich Results Test figure in this report is invented. Every RRT row in
`rich-results-test-log.csv` reads `not available — manual run required`, and a human must run
`/webinar` and one FAQ page by hand in the browser tool.

---

## 2. Pages x types x validation result

`Objects` is the validator's `numObjects`. `Organization` never appears as its own object because
`SoftwareApplication.author` and `.publisher` reference it by `@id`, so the validator folds it into
the software node — that is the *correct* result and is the proof the single-entity wiring works.

| # | URL | Schema @types emitted (live) | Objects | Errors | Warnings | Warning detail |
|---|-----|------------------------------|---------|--------|----------|----------------|
| 1 | `/` | Organization, SoftwareApplication, FAQPage (6 Q&A) | 2 | 0 | 1 | `SoftwareApplication.areaServed` UNKNOWN_FIELD |
| 2 | `/pricing` | Organization, SoftwareApplication, FAQPage (5 Q&A) | 2 | 0 | 1 | same |
| 3 | `/demo` | Organization, SoftwareApplication, BreadcrumbList (2), FAQPage (3 Q&A) | 3 | 0 | 1 | same |
| 4 | `/platform` | Organization, SoftwareApplication, BreadcrumbList (2) | 2 | 0 | 1 | same |
| 5 | `/epc-erp-software` | Organization, SoftwareApplication, BreadcrumbList (2) | 2 | 0 | 1 | same |
| 6 | `/ra-billing-software` | Organization, SoftwareApplication, BreadcrumbList (3), FAQPage (3 Q&A) | 3 | 0 | 1 | same |
| 7 | `/material-reconciliation` | Organization, SoftwareApplication, BreadcrumbList (3), FAQPage (3 Q&A) | 3 | 0 | 1 | same |
| 8 | `/construction-procurement-software` | Organization, SoftwareApplication, BreadcrumbList (3) | 2 | 0 | 1 | same |
| 9 | `/subcontractor-billing-software` | Organization, SoftwareApplication, BreadcrumbList (3) | 2 | 0 | 1 | same |
| 10 | `/construction-erp-implementation` | Organization, SoftwareApplication, BreadcrumbList (3) | 2 | 0 | 1 | same |
| 11 | `/solutions/mep-contractors` | Organization, SoftwareApplication, BreadcrumbList (3) | 2 | 0 | 1 | same |
| 12 | `/compare/sotyn-vs-onsite` | Organization, SoftwareApplication, BreadcrumbList (3) | 2 | 0 | 1 | same |
| 13 | `/tools/ra-bill` | Organization, SoftwareApplication, BreadcrumbList (3), FAQPage (2 Q&A) | 3 | 0 | 1 | same |
| 14 | `/resources/epc-margin-leakage-checklist` | Organization, SoftwareApplication, BreadcrumbList (3) | 2 | 0 | 1 | same |
| 15 | `/scorecard` | Organization, SoftwareApplication | 1 | 0 | 1 | same |
| 16 | `/webinar` | Organization, SoftwareApplication, **Event** (+ a 2nd Organization as organizer) | 2 | 0 | 1 | same |
| 17 | `/about` | Organization, SoftwareApplication | 1 | 0 | 1 | same |
| 18 | `/404` | Organization, SoftwareApplication | 1 | 0 | 1 | same |
| 19 | `/thank-you` | Organization, SoftwareApplication | 1 | 0 | 1 | same |

**Totals: 0 errors, 19 warnings across 19 pages.** The 19 warnings are 19 instances of one
sitewide issue, not 19 distinct problems.

### `@id` values

Identical and consistent on all 19 pages (LIVE-OBSERVED, 2026-09-23):

- `https://www.sotyn.ai/#organization` — declared once on `Organization`, referenced twice
  (`SoftwareApplication.author`, `SoftwareApplication.publisher`).
- `https://www.sotyn.ai/#software` — declared once on `SoftwareApplication`.

No page declares the same `@id` twice. No `BreadcrumbList`, `FAQPage` or `Event` node carries an
`@id` — acceptable, since nothing needs to reference them.

---

## 3. The one validator warning, sitewide

**Finding (LIVE-OBSERVED, 2026-09-23 + SOURCE-OBSERVED).**
`SoftwareApplication.areaServed` — `UNKNOWN_FIELD`, severity `WARNING`, on all 19 pages.

`areaServed` is defined on `Organization`, `Service`, `Offer` and `Demand`. It is **not** a property
of `CreativeWork`, so `SoftwareApplication` does not inherit it. The value is silently discarded.

- **Emitted at:** `src/layouts/BaseLayout.astro` line 102 — `areaServed: { "@type": "Country", name: "India" },`
  (inside `appSchema`).
- **The information is not lost by removing it.** The same statement is already made validly at
  `src/layouts/BaseLayout.astro` line 51 (`orgSchema.areaServed`) and line 58 (`contactPoint.areaServed: "IN"`).
- **Fix:** delete line 102. If the geographic scope of the *product* matters, move it onto the
  `AggregateOffer` (lines 91–101) as `eligibleRegion` / `areaServed`, where it is valid.

This is the only change that clears every warning on the site.

---

## 4. Mismatches between schema and visible content

### 4.1 `BreadcrumbList` emitted with no visible breadcrumb — 3 pages

**Finding (LIVE-OBSERVED, 2026-09-23).** Eleven of the twelve breadcrumb pages render a real
`<nav aria-label="Breadcrumb">`. Three do not, yet still emit `BreadcrumbList`. Google's breadcrumb
guidance expects the markup to describe a navigation path the user can actually see and use.

Evidence — `grep -io 'aria-label="Breadcrumb"'` against the live HTML:

| Page | `aria-label="Breadcrumb"` present | Visible text at top of `<main>` | Verdict |
|---|---|---|---|
| `/platform` | yes | `Home / Platform` | correct |
| `/demo`, `/ra-billing-software`, `/material-reconciliation`, `/construction-procurement-software`, `/subcontractor-billing-software`, `/construction-erp-implementation`, `/tools/ra-bill`, `/resources/epc-margin-leakage-checklist` | yes | visible crumb trail | correct |
| `/epc-erp-software` | **no** | `EPC ERP software` (an eyebrow label, not a crumb) | **mismatch** |
| `/solutions/mep-contractors` | **no** | `For MEP contractors` (an eyebrow label) | **mismatch** |
| `/compare/sotyn-vs-onsite` | **no** | `Honest comparison · 2026` (an eyebrow label) | **mismatch** |

**Files and lines to fix (SOURCE-OBSERVED):**

- `src/pages/epc-erp-software.astro` lines 21–28 — `BreadcrumbList` `["Home", "EPC ERP Software"]`.
  Rendered markup begins at line 34 with no `<nav class="crumb" aria-label="Breadcrumb">`.
- `src/pages/solutions/[slug].astro` lines 73–81 — `BreadcrumbList` `["Home", "Solutions", v.name]`.
  Hero at line 84 opens straight into `<span class="eyebrow">`.
- `src/pages/compare/[slug].astro` lines 93–101 — `BreadcrumbList` `["Home", "Compare", "sotyn.ai vs …"]`.
  Hero at line 104 opens straight into `<span class="eyebrow">`.

**Recommended fix:** add the visible `<nav class="crumb" aria-label="Breadcrumb">` these three pages
are missing, copying the pattern already used at `src/pages/tools/[slug].astro` line 25. Keep the
markup. Do not resolve this by keeping invisible markup.

**Secondary issue on the same three (SOURCE-OBSERVED).** `src/pages/solutions/[slug].astro` line 78
points breadcrumb position 2 at `${SITE.url}/#solutions` — a fragment on the homepage, not a page.
A breadcrumb item should be a real, crawlable URL. Either create `/solutions` or drop the middle
crumb to `["Home", v.name]`.

### 4.2 `Event` on `/webinar` has no `startDate`, and the page has no date to give it

**Finding (LIVE-OBSERVED, 2026-09-23 + SOURCE-OBSERVED).** `/webinar` emits:

```json
{"@type":"Event","name":"The EPC Contractor's Profit Masterclass",
 "eventAttendanceMode":"…OnlineEventAttendanceMode","eventStatus":"…EventScheduled",
 "organizer":{"@type":"Organization","name":"sotyn.ai","url":"https://www.sotyn.ai"},
 "performer":{"@type":"Person","name":"Er. Ankur Kaplesh"},
 "location":{"@type":"VirtualLocation","url":"https://www.sotyn.ai/webinar"}}
```

There is no `startDate`, no `endDate` and no `offers`. `startDate` is required by schema.org for
`Event` and is mandatory for Google's Event rich result — an Event without it cannot be eligible.
The Schema Markup Validator returned **0 errors / 0 warnings for the Event node**, because it does
not enforce Google's required-property set; a clean result there is not evidence of eligibility.

The visible page has no concrete date either. `src/config/site.ts` line 274 reads
`when: "Every Saturday · 7:00 PM IST", // ⚠️ set your real schedule` — a standing weekly slot, not a
scheduled instance. `eventStatus: "EventScheduled"` therefore asserts something the page does not
support.

- **Emitted at:** `src/pages/webinar.astro` lines 8–17.
- **Two honest options, pick one:**
  1. Publish a real next-session datetime in `SITE.webinar` and emit it as `startDate` (ISO 8601
     with the `+05:30` offset) plus `endDate`, and show that same datetime on the page. Only then is
     `eventStatus: "EventScheduled"` true.
  2. Remove the `Event` block entirely until a dated session exists. A recurring "every Saturday"
     with no instance is not an `Event`.

### 4.3 Language: the product claims 11 languages, the markup claims one or two

**Finding (LIVE-OBSERVED, 2026-09-23).** The homepage states this prominently, twice:

> "In 11 languages — हिन्दी, தமிழ், తెలుగు, বাংলা & more"
> "India's first 11-language EPC ERP … English plus the 10 most-spoken Indian languages"

and the `/` FAQ answers "My site staff don't work in English" by naming all eleven.

The markup does not reflect this:

- `SoftwareApplication.inLanguage: "en-IN"` — `src/layouts/BaseLayout.astro` line 76. A single value,
  on the entity that *is* the multilingual product.
- `Organization.contactPoint.availableLanguage: ["en", "hi"]` — `src/layouts/BaseLayout.astro` line 59.
- `<html lang="en-IN">` on every page.

Two of these are defensible; one is not.

- `<html lang="en-IN">` is **correct and should not change.** The marketing site is served in
  English; `lang` describes the document, not the product.
- `contactPoint.availableLanguage: ["en","hi"]` is **correct if the sales desk genuinely answers in
  English and Hindi only.** This property describes the contact point, not the software. Worth a
  one-line confirmation with sales; if they also handle Punjabi, add it. Do not copy all eleven here
  unless sales really supports eleven.
- **`SoftwareApplication.inLanguage: "en-IN"` is the mismatch.** The application's own entity
  under-reports its most differentiated feature. `inLanguage` accepts an array.

**Fix:** at `src/layouts/BaseLayout.astro` line 76, replace the scalar with the eleven BCP-47 tags
the product actually ships (`["en-IN","hi","bn","mr","te","ta","gu","ur","kn","or","ml"]`, per the
languages named on the homepage), and add matching `availableLanguage` on the `SoftwareApplication`.
Add the list to `src/config/site.ts` so the page copy and the markup read the same array and cannot
drift — the same discipline already applied to pricing at `src/config/site.ts` lines 143–145.

### 4.4 `/404` carries full product and offer markup

**Finding (LIVE-OBSERVED, 2026-09-23).** A request for a genuinely missing URL
(`/this-page-does-not-exist-xyz123`) correctly returns HTTP 404 — the status handling is right. But
the error page still emits the full sitewide `Organization` + `SoftwareApplication` + `AggregateOffer`,
because `BaseLayout.astro` line 117 (`const allSchema = [orgSchema, siteSchema, appSchema, ...schema]`) attaches
them unconditionally and `src/pages/404.astro` passes no `schema` prop of its own.

Low severity — Google discards structured data on 404s — but an error page asserting a priced,
in-stock product is noise, and the `AggregateOffer` is the part that least belongs there.

**Fix:** add an opt-out to `src/layouts/BaseLayout.astro` (e.g. a `noEntitySchema` prop consulted at
line 117) and set it on `src/pages/404.astro`. Optional; fix the items above first.

---

## 5. Verified correct — claims that match visible content

Recorded so a later audit does not re-litigate them.

### 5.1 AggregateOffer prices — CORRECT

**LIVE-OBSERVED (2026-09-23).** Markup on every page carries
`AggregateOffer / priceCurrency INR / lowPrice "72000" / highPrice "300000" / offerCount 3 /
availability InStock`.

Visible on `/pricing`: **"₹72,000 billed yearly"** (Starter) and **"₹3,00,000"** (Enterprise, `+/yr`,
"from") both render in the page text, alongside "₹1,50,000 billed yearly" for Growth. Three plan
cards are visible — Starter, Growth, Enterprise — matching `offerCount: 3`.

**SOURCE-OBSERVED.** `src/layouts/BaseLayout.astro` lines 93–95 read `SITE.pricing.currencyCode`,
`SITE.pricing.annualLowInr` and `SITE.pricing.annualHighInr` from `src/config/site.ts` lines 143–145,
and `offerCount` from `SITE.pricing.plans.length`. `tests/pricing.test.mjs` asserts the machine
figures against the display strings. The markup cannot drift from the page without failing a test.

**The previously reported zero-price offer is genuinely fixed, not merely hidden.** `git show 9d7ca6f`
shows `- price: "0"` replaced by the `lowPrice` / `highPrice` pair, and nothing on the live site
emits `"price": "0"` today. This is closed. Do not re-report it.

### 5.2 Organization telephone — CORRECT

**LIVE-OBSERVED (2026-09-23).** `contactPoint.telephone` is `+917009987817` on all 19 pages. The
footer on all 19 pages shows `+91 70099 87817` and links `tel:+917009987817`. Schema, visible text
and `tel:` href agree everywhere.

**The `++91` defect is genuinely fixed.** `git show 9d7ca6f` shows
`- telephone: `+${SITE.phoneHref}`` (which double-prefixed an already-`+`-prefixed value) replaced by
`+ telephone: SITE.phoneHref` at `src/layouts/BaseLayout.astro` line 56. No live page contains
`++91`. Closed. Do not re-report it.

### 5.3 Duplicate Organization entity — FIXED sitewide (one residual instance, see §6)

**The homepage duplicate is genuinely fixed.** `git show 9d7ca6f` removed the second, differently
named `Organization` block from `src/pages/index.astro` and replaced `author`/`publisher` string
copies with `{"@id": ".../#organization"}` references. `src/pages/index.astro` lines 163–165 now
carry an explanatory comment. **LIVE-OBSERVED (2026-09-23):** 18 of 19 pages emit exactly one
`Organization`. `/webinar` is the exception, covered in §6. Closed for the homepage; do not
re-report that one.

### 5.4 Other Organization fields — all match visible content

**LIVE-OBSERVED (2026-09-23).** Every value verified present in the rendered page text:

| Property | Markup | Visible on page |
|---|---|---|
| `name` | Secured Engineers Pvt. Ltd. | yes (footer) |
| `email` | sales@securedengineers.com | yes, and the `mailto:` matches |
| `address.streetAddress` | 2480/1, BK Tower, Gill Road | yes |
| `address.addressLocality` / `postalCode` | Ludhiana / 141003 | yes |
| `foundingDate` | 2011 | yes |
| `sameAs` | LinkedIn + Instagram | both links present in footer, URLs identical |

`description` claims "535+ project EPC company"; "535+" appears in the visible homepage stats.

### 5.5 FAQPage — every question and answer is visibly on the page

**LIVE-OBSERVED (2026-09-23).** Six pages emit `FAQPage`: `/` (6 Q&A), `/pricing` (5), `/demo` (3),
`/ra-billing-software` (3), `/material-reconciliation` (3), `/tools/ra-bill` (2) — 22 Q&A pairs
total. Each question string and each answer body was matched against the page's rendered text with
markup stripped. **All 22 questions and all 22 answers are visible. Zero mismatches.**

This is structurally guaranteed: each page builds the block by mapping over the same `faqs` array it
renders from (`src/pages/index.astro` line 157, `src/pages/pricing.astro` line 17,
`src/pages/demo.astro` line 38, `src/pages/ra-billing-software.astro` line 47,
`src/pages/material-reconciliation.astro` line 47, `src/pages/tools/[slug].astro` line 21). Markup
and copy cannot diverge.

**On justification, not rich results.** Since August 2023 Google shows FAQ rich results only for a
small set of authoritative government and health sites. These pages will almost certainly get no
FAQ rich result in search, and the markup should not be defended on that basis. Keep it because the
Q&A is genuinely on the page, it is machine-readable for AI answer engines and LLM retrieval, and it
costs nothing to maintain given the shared-array pattern. **The moment a question is added to the
markup that is not on the page, the justification disappears** — that would be cloaked content with
no upside. The current state passes this test on all six pages.

### 5.6 No `Review`, `AggregateRating` or self-authored rating markup — CONFIRMED ABSENT

**LIVE-OBSERVED (2026-09-23).** Every JSON-LD block on all 19 pages was scanned for
`AggregateRating`, `Review`, `Rating`, `ratingValue`, `reviewCount` and `bestRating`. **Zero
occurrences.**

**SOURCE-OBSERVED.** `grep -rn "AggregateRating\|Review\|ratingValue\|reviewCount\|bestRating" src/`
returns exactly one hit — `src/pages/index.astro` line 80, the ordinary English word "Review" in body
copy ("Review one dashboard, 30 minutes a day"). No rating markup anywhere in the repository.

This is correct and must stay that way. See §7.

---

## 6. Duplicate and conflicting entities

**18 of 19 pages are clean.** One `Organization` (`#organization`), one `SoftwareApplication`
(`#software`), referenced by `@id`, with no name or URL conflicts.

**One residual conflict, on `/webinar` (LIVE-OBSERVED, 2026-09-23).** The page emits a *second*
`Organization` that is not linked to the first:

| | Sitewide entity | `/webinar` organizer |
|---|---|---|
| `@id` | `https://www.sotyn.ai/#organization` | *(none)* |
| `@type` | Organization | Organization |
| `name` | `Secured Engineers Pvt. Ltd.` | `sotyn.ai` |
| `url` | `https://www.sotyn.ai` | `https://www.sotyn.ai` |

Two `Organization` nodes share a URL but carry different names and only one has an `@id`. A consumer
can reasonably read this as two companies at one address, which is exactly the entity split that
commit `9d7ca6f` removed from the homepage. `sotyn.ai` is already declared as `alternateName` on the
canonical entity, so the second node adds nothing.

- **Emitted at:** `src/pages/webinar.astro` line 15 —
  `organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },`
- **Fix:** replace with a reference — `organizer: { "@id": `${SITE.url}/#organization` },`.
  This is the same one-line change already applied to `author` and `publisher` at
  `src/layouts/BaseLayout.astro` lines 78–79.

**Also on `/webinar`:** `performer: { "@type": "Person", name: "Er. Ankur Kaplesh" }`
(`src/pages/webinar.astro` line 16) duplicates the `Person` already declared as
`Organization.founder` (`src/layouts/BaseLayout.astro` line 42). Two unlinked `Person` nodes with the
same name. Lower priority than the Organization split, but the clean fix is to give the founder an
`@id` (e.g. `#founder`) in `BaseLayout.astro` and reference it from `webinar.astro`.

**No other page emits a repeated type.** `BreadcrumbList` and `FAQPage` each appear at most once per
page; `ListItem`, `Question` and `Answer` repeat only as legitimate list members.

---

## 7. Types that should NOT be used here, and why

### `Review`, `AggregateRating`, `Rating` — must stay absent

Confirmed absent (§5.6). They must not be added. Google's reviews-snippet policy prohibits
self-serving review content: a business may not mark up ratings about itself, or ratings it wrote,
commissioned or collected on its own site. Adding an `aggregateRating` to
`SoftwareApplication` — the obvious temptation on a B2B SaaS page — is a direct violation and risks a
structured-data manual action, not just loss of the snippet. If genuine third-party ratings exist on
G2, Capterra or similar, link to them as ordinary content; do not mark them up here.

### `Product` for the software — do not switch to it

`SoftwareApplication` is the correct type and is already in use. `Product` would open `review` and
`aggregateRating` in a context where Google reads them as merchant ratings, inviting the violation
above. Keep `SoftwareApplication` with `AggregateOffer`.

### `LocalBusiness` — do not add

There is a physical address in Ludhiana, which makes `LocalBusiness` look applicable. It is not.
`LocalBusiness` is for a place customers visit to transact, with opening hours and service-area
geography. sotyn.ai is a nationally sold SaaS product; the Ludhiana address is a head office.
`Organization` with `PostalAddress` — what is emitted today — is correct. Adding `LocalBusiness`
would also create a third overlapping entity for the same company.

### `Event` on `/webinar` — not usable in its current form

See §4.2. Without a `startDate` this is not a valid `Event`. Either give it a real datetime or
remove it. If the intent is genuinely a standing weekly series, `EventSeries` with dated
`subEvent` instances is the modelling that fits — but only once real dates exist.

### `HowTo` — do not add

`/construction-erp-implementation` describes a four-step go-live and is a natural `HowTo` candidate.
Google deprecated `HowTo` rich results in September 2023 and no longer shows them. The markup would
add maintenance with no upside. Correctly absent today.

### `WebSite` + `SearchAction` (sitelinks searchbox) — do not add

The site has no internal search. `SearchAction` markup pointing at a non-existent search endpoint is
a false claim. Correctly absent.

### `FAQPage` — keep, but justify it correctly

Not a prohibited type, and correctly implemented on all six pages (§5.5). The point is the
justification: it earns its place through on-page user value and machine readability for AI answer
engines, **not** through FAQ rich results, which Google no longer shows for sites like this one. Do
not expand FAQ markup to pages whose Q&A is not visible, and do not add questions to the markup that
are not rendered.

---

## 8. Priority

| # | Finding | Pages | Fix at |
|---|---|---|---|
| 1 | `Event` has no `startDate`; `eventStatus: EventScheduled` unsupported by the page | `/webinar` | `src/pages/webinar.astro` lines 8–17; date in `src/config/site.ts` line 274 |
| 2 | Second, unlinked `Organization` (name conflict) | `/webinar` | `src/pages/webinar.astro` line 15 |
| 3 | `BreadcrumbList` with no visible breadcrumb | `/epc-erp-software`, `/solutions/mep-contractors`, `/compare/sotyn-vs-onsite` | `src/pages/epc-erp-software.astro` 21–28; `src/pages/solutions/[slug].astro` 73–81; `src/pages/compare/[slug].astro` 93–101 |
| 4 | `SoftwareApplication.inLanguage` says 1 language, the page says 11 | sitewide | `src/layouts/BaseLayout.astro` line 76 (+ `src/config/site.ts`) |
| 5 | `SoftwareApplication.areaServed` invalid — the only validator warning | all 19 | `src/layouts/BaseLayout.astro` line 102 |
| 6 | Breadcrumb crumb 2 points at a `#solutions` fragment | `/solutions/*` | `src/pages/solutions/[slug].astro` line 79 |
| 7 | Duplicate unlinked `Person` (founder vs performer) | `/webinar` | `src/pages/webinar.astro` line 16; `src/layouts/BaseLayout.astro` line 42 |
| 8 | Product + offer markup on the error page | `/404` | `src/layouts/BaseLayout.astro` line 117; `src/pages/404.astro` |

Items 1–3 are content-accuracy issues and matter most. Item 5 is the only one the validator flags,
and it is a one-line deletion.

**Still outstanding regardless of the above:** a manual Google Rich Results Test run on `/webinar`
and one FAQ page, since no scriptable endpoint exists. Record the outcome in the `retest_result`
column of `rich-results-test-log.csv`.

---

## 9. Reproducing this audit

```bash
# 1. Fetch a page and extract its JSON-LD
curl -sL -A 'Mozilla/5.0' https://www.sotyn.ai/pricing > page.html

# 2. Validate. NOTE: the field is `html`, not `code`. A `code=` request returns
#    fetchError NOT_FOUND with zero errors — a false pass.
curl -s --data-urlencode "html@jsonld.html" -A 'Mozilla/5.0' \
  https://validator.schema.org/validate | tail -n +2 | \
  python3 -c "import json,sys; d=json.load(sys.stdin); \
print(d['numObjects'], d['totalNumErrors'], d['totalNumWarnings'])"
```

`tail -n +2` strips the `)]}'` guard line. Pace requests: `url=` mode rate-limits to a 302 after
about three calls, and `html=` mode after roughly fifteen.

Google Rich Results Test: no scriptable endpoint as of 2026-09-23. Run it by hand at
`https://search.google.com/test/rich-results`.
