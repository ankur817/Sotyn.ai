# Structured data — implementation plan

Date 2026-09-23. Companion to `schema-audit.md` (what exists) and `rich-results-test-log.csv` (validation evidence). **Proposal only — nothing in this file is deployed.**

Passing a validator proves the markup is well-formed and eligible for consideration. It does not produce a rich result, an AI citation or a ranking, and nothing here should be sold as if it did.

## Principles applied

1. Every value must match text a visitor can see and select on that page.
2. One entity per thing, with a stable `@id`, referenced rather than repeated.
3. JSON-LD only, emitted from the layout and page components — no tag manager, so no duplicate-injection path exists.
4. A type is used because it describes the page, never because it exists in Schema.org.

## Current state (verified in production)

| Emitted | Where | Status |
|---|---|---|
| `Organization` `@id` `…/#organization` | `BaseLayout.astro`, sitewide | Correct. Single entity — a second, differently-named copy on the homepage was removed. Telephone `+917009987817` matches the footer. |
| `SoftwareApplication` `@id` `…/#software` | `BaseLayout.astro`, sitewide | `AggregateOffer` INR 72,000–3,00,000 read from `SITE.pricing`, matching the visible plan cards. Author/publisher reference the Organization `@id`. |
| `BreadcrumbList` | workflow, solutions, compare, tools, resources pages | Correct — those templates render a visible breadcrumb. |
| `FAQPage` | homepage and several commercial pages | Questions and answers are visibly on the page, so the markup is honest. |
| `Review` / `AggregateRating` / `Product` | nowhere | Correct, and must stay that way. |

## Changes proposed

### 1. Add `WebSite` once, at the root — P2
Gives the site entity a name and URL for the search engine's own understanding. **No `SearchAction`**: there is no site search, and declaring one that does not exist is a false claim.

```jsonc
{ "@context": "https://schema.org", "@type": "WebSite",
  "@id": "https://www.sotyn.ai/#website",
  "url": "https://www.sotyn.ai", "name": "sotyn.ai",
  "publisher": { "@id": "https://www.sotyn.ai/#organization" },
  "inLanguage": "en-IN" }
```
*File:* `src/layouts/BaseLayout.astro`. *Validation:* Schema Markup Validator on `/`, `/pricing`. *Rollback:* remove the object.

### 2. Stop `SoftwareApplication` repeating on every route — P2
It is currently emitted sitewide. The product entity should be declared once (homepage) and **referenced** by `@id` elsewhere, so 44 pages do not each assert the product and its offer.
*Risk:* low; `@id` keeps the entity resolvable. *Validation:* confirm one `SoftwareApplication` node across the crawl.

### 3. `WebPage` per template, referencing the entities — P3
`@id` per URL, `isPartOf` the WebSite, `about` the SoftwareApplication on product pages, `primaryImageOfPage` only where a real screenshot exists. Adds machine-readable page identity without a single new claim.

### 4. `Article` / `BlogPosting` — only when docs exist — P3
Not now: there is no editorial content. When docs land, mark them only with a **real** author or technical reviewer and genuine `datePublished` / `dateModified`. No invented bylines.

### 5. `VideoObject` — only if a product video is embedded and accessible — P3
None exists today. If a walkthrough is added, mark it only when the video is on the page with a transcript.

### 6. FAQ markup — keep, do not expand — P2
The FAQs are visible and useful. Google no longer surfaces FAQ rich results for most sites, so no new FAQ block should be written *for* the markup. Keep it in step with what the page shows; remove the markup from any page whose FAQs are later removed.

### 7. `availableLanguage` must follow the language decision — P0-linked
`["en","hi"]` today. This is blocked on the same unresolved fact as the "11 languages" claim (brief §9). Schema must be corrected in the same change as the copy — whichever way it goes.

### 8. `Service` — not recommended
Implementation is delivered, but `/construction-erp-implementation` describes onboarding for the software, and `SoftwareApplication` + the visible fee already covers it. A separate `Service` entity would create a second commercial entity for one business.

### 9. `Organization` completeness — P3
`sameAs` currently lists LinkedIn and Instagram, both verified. Add other profiles **only** when they are official and live. Do not add `aggregateRating`, `award` or `slogan` claims that are not visible on the site.

## Validation workflow

1. Validate the JSON-LD from `dist/` during development (scriptable, no deploy needed).
2. Validate the production URL after release with the Schema Markup Validator.
3. Run Google's Rich Results Test manually for any type that has a rich-result feature — it is not scriptable here, so it is recorded as a manual step, never as an automated pass.
4. Log every run in `rich-results-test-log.csv`: url, date, tool, items, errors, warnings, fix, re-test, owner.
5. Fix all errors before release. Judge warnings on relevance — an optional-property warning is not a defect.

## What will not be added, and why

| Type | Reason |
|---|---|
| `Review`, `AggregateRating` | No independent reviews exist; self-authored ratings are not eligible |
| `Product` with `offers`/`priceValidUntil` | The site does not sell a purchasable SKU with those properties |
| `LocalBusiness` | One office in Ludhiana; the software serves India remotely. A software site serving a city is not a branch there |
| `Course`, `Event` for the webinar | Possible later if a real scheduled instance with a fixed date exists; today the schedule is a recurring string |
| `HowTo` | The worked examples describe product behaviour, not a general how-to task, and the type has no rich-result support |
| Speakable, `SearchAction`, `llms.txt`-style files | Not supported signals for this site, and none would be truthful |
