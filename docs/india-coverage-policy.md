# India coverage — registry schema and indexing rules

Status: **policy and schema defined; no location pages created, no registry data loaded.** Loading it needs an authoritative source download and serviceability answers only you can give. Nothing here generates a page on its own.

## Why no city pages were created in this pass

A city page earns an index slot only with verified demand, a truthful delivery arrangement, and something materially useful that a national page does not already say. None of those three can be evidenced today: search data is blocked (`blocked-access.md`), and I have no confirmation of where sotyn.ai can actually deliver implementation and support. Publishing city-name-swapped copies of an existing page in the meantime would be a doorway-page pattern — against Google's spam policies, and worse for the business than publishing nothing.

## Registry schema (one row per place, versioned)

| Field | Meaning |
|---|---|
| `id` | Stable internal id, never reused |
| `lgd_code` | Local Government Directory code, with the LGD snapshot date |
| `census_code` | Census town/UA code where the place is a town rather than a local body |
| `state_ut`, `district`, `name` | From the source, spelled as the source spells it |
| `aliases[]` | Renamed and alternative spellings (e.g. Gurgaon/Gurugram) — all resolve to one canonical route |
| `region` | Named region such as Delhi NCR, which is **not** a city and never becomes one |
| `serviceable` | Can the business genuinely deliver here: `remote-only` \| `remote+visits` \| `on-site team` |
| `delivery_mode` | How onboarding and support are actually delivered |
| `evidence` | What proves serviceability and demand — a signed customer, a visit record, a GSC query set. Empty means no evidence |
| `indexable` | Separate from `serviceable`. Defaults to **false** |
| `source_date`, `version` | Provenance of the row |

`serviceable ≠ indexable`. A place can be fully serviceable and still have no indexed page.

## Rules

1. **Sources:** LGD (lgdirectory.gov.in) for local bodies, plus Census town/UA data where LGD alone does not represent a settlement. LGD local bodies are not a one-to-one list of settlements. Record the snapshot date; re-verify on each refresh.
2. **Findability without doorway pages:** one national coverage finder — search by state/district/city, showing the honest delivery mode for that place and a form that carries the place with the lead. This serves every place in the registry from **one** indexable URL.
3. **No Cartesian product.** Never city × trade, city × feature or city × module.
4. **No fabricated local presence.** No claimed office, on-site team or local customer without a record. No Google Business Profile for a place with no staffed location. No virtual addresses, no duplicate profiles, no keyword-stuffed business names.
5. **Indexing threshold** — all four required before `indexable: true`: (a) verified relevant demand for that place, (b) a truthful delivery arrangement, (c) materially useful local content or evidence a national page cannot carry, (d) a named owner for keeping it accurate.
6. **Aliases** resolve to one canonical route; the others redirect permanently. Regions are landing content, not cities.
7. **Sequence:** national commercial pages first (done — they exist and are being improved), then a **small pilot** of at most 3–5 cities once demand data is available. Punjab/Delhi NCR are operational starting hypotheses because the company is in Ludhiana — **not** a claim that they are the largest markets. Expand on qualified leads and indexation quality, never a page quota. If the threshold is not met, publish fewer pages.
8. **Translation:** add a language only when the copy quality **and** the actual sales and support experience in that language are supportable. Then reciprocal hreflang plus self-canonicals. This interacts directly with the unresolved 11-language claim in `claims-registry.md`.

## What is needed to proceed

1. Where can implementation and support genuinely be delivered, and in which mode?
2. Which places have real customers or real enquiries today?
3. Search Console access, so demand is measured rather than assumed.
