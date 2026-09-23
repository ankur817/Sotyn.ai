# District coverage system — how it works and what it refuses to do

Date 2026-09-23. Companion files: `src/data/locations/districts.json` (registry), `src/data/locations/publication.json` (gate), `docs/district-registry-reconciliation.md` (source provenance), `seo-audit/district-keyword-briefs.csv` (research).

## The distinction the whole system is built on

Five things that are constantly conflated, kept separate here:

| | Meaning | Where it lives |
|---|---|---|
| **Geographic coverage** | The district exists and its identity is verified | `districts.json` — every district |
| **Serviceability** | We can genuinely deliver to a contractor there, and in which mode | `publication.json` → `delivery_mode` |
| **Published page** | A standalone URL exists | `publication.json` → `status: approved` |
| **Indexed** | Google has it in its index | Search Console, once access exists |
| **Qualified lead** | A contractor there asked for a demo | The Sheet register |

A district in the registry does **not** get a URL. Coverage is claimed at registry level; pages are claimed only where a page is justified. **Nothing in this system lets a page be generated from geography alone.**

## Architecture

```
/locations                          India hub — every state and district, as crawlable text
/locations/{state}                  built ONLY for states that have a published district
/locations/{state}/{district}       built ONLY from an approved publication record
```

Why there are no empty state hubs: a hub for a state with no published district would be a list of names with nothing to say — exactly the thin page this brief rules out. Those states are served by the India hub's selector and the national pages, and the hub says so in plain words.

Why there are no city URLs, no district × trade, no district × feature, and no alias URLs: each would multiply URLs without adding a buyer service. Aliases live in the registry as `aliases` so a search on a city name can find its parent district in the selector, never as a separate page.

The hub's filter is progressive enhancement. Every state and district is in the HTML before any JavaScript runs, inside `<details>` elements that work with a keyboard and without JS.

## The publication gate

A district page is built only when its record has **all** of:

1. `status: "approved"`,
2. a `reason_page_exists` that names something true **about that district** — a test rejects any reason containing "rank", "SEO", "traffic", "keyword" or "volume",
3. at least one `evidence` item,
4. a real `delivery_mode` (`remote` / `remote+visits` / `on-site team`),
5. a named `approved_by` — someone has to own the local claims.

Everything else stays a draft with its `blocker` recorded. Drafts are never rendered.

**Today: zero districts are approved.** The only record is Ludhiana as a draft — the company's registered office is there, which is the one genuinely district-specific fact available, and it is blocked on two things: the official LGD code, and the owner confirming what on-site support is actually offered there. When that lands, one page ships and the template is validated on a real case rather than a hypothetical one.

## The automated clone check

`tests/locations.test.mjs` strips navigation, the district name and the state name from each published page's `<main>`, then compares the remaining text between every pair of district pages. Above 92% similarity the test fails.

This is a **flag, not a compliance score**. The fix for a failure is more genuine district-specific value — never paraphrasing until the number drops.

## Keyword research

`npm run briefs` writes a ten-slot brief per district to `seo-audit/district-keyword-briefs.csv`. Every row records: district code, query, natural alternatives, intent, role, data source, data date, geographic scope, available volume, confidence, target URL, page status, CTA and the evidence gap.

Honest constraints baked into the output:
- Every row says **`available_volume: unknown`**. There is no authorised Search Console, Keyword Planner or Trends access, and **no Google product publishes district-level search volume** — a city targeting option is not a district boundary.
- Slots are labelled **research candidates**, never "top searched".
- Trade-specific slots (MEP, solar) are marked `conditional` — their relevance depends on the trade mix in that district, which is unverified.
- Unpublished districts point their slots at the relevant **national** page, because that is where the buyer is actually served today.

No API calls are spent on thousands of near-identical combinations. The national topic research in `seo-audit/google-trends-research.csv` and `docs/keyword-map.md` carries the real evidence; the district briefs are the geographic layer over it.

## Leads from location pages

District and state CTAs pass `?from=district&state=…&district=…`. The intake resolves that pair **against the registry** (`lookupLocation`) and stores only a registry hit — a district name typed into a URL is never stored as text.

Three separate ideas, three separate fields:

| Field | Meaning |
|---|---|
| `City` | What the visitor typed — their company's location. Theirs to state and correct. |
| `Location page state` / `district` | The page they were reading. A visitor on the Ludhiana page is not necessarily in Ludhiana. |
| Project location | Not captured yet — it belongs in qualification, after contact. |

The three new Sheet columns are **appended after `Submission ID`**, and the Apps Script now finds columns by header name rather than by position, so adding them cannot shift or break existing formulas, staff-managed fields or de-duplication.

## Rollout

1. Registry complete and reconciled against a named snapshot.
2. Briefs generated for every district.
3. One representative page (Ludhiana) once its blocker clears — validates template, routes, schema, links and the enquiry path end to end.
4. Further pages **only** as each passes the same gate, in small reviewable batches.
5. Every unpublished district keeps its research brief and its hub coverage, with the blocker recorded.

Batch size is an operational choice. It is not a ranking technique, and it is not permission to publish low-value pages faster.

## What this system will not do

- No Google Business Profile per district, no invented office, phone or geo pin.
- No `LocalBusiness` schema on district pages — a district is a subject area, not an address. Pages carry `WebPage` + `BreadcrumbList` and reference the existing Organization and SoftwareApplication entities.
- No fabricated local customers, partners, statistics or "leading provider in {district}" claims.
- No canonicalising district pages to the homepage while expecting them to rank.
- No mass-noindex or mass-delete of existing pages.
- No promise of first position, of appearing in every local search, or of a lead volume.

## Measurement, when access exists

Report separately: districts verified · briefs completed · pages approved · pages published · pages observed indexed · impressions and clicks per page and query · CTR · qualified enquiries · attended demos · commercial outcomes.

**Search Console has no district dimension.** Queries that happen to name a place are not the same as the searcher's location, which is not the same as a lead's declared location. Any ranking observation must record keyword, date, location, device and method, and one observation is never a nationwide rank.
