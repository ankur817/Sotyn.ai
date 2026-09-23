# Keyword-to-URL map — 2026-09-23

**No authorised volume data exists.** No Keyword Planner, Trends export or Ahrefs pull was available (see `blocked-access.md`), so **nothing here states or estimates search volume, CPC or difficulty.** Priority below is reasoned from buying intent, product fit and existing assets — and is labelled as such.

`SERP-OBSERVED` = what kind of pages a query returns (an intent signal, never a demand signal), checked 2026-09-23. **Caveat: the search index available was US-centric**, so any "this SERP looks foreign" observation may reflect the index rather than what an Indian buyer sees. Those are marked **GEO-UNVERIFIED** and must be re-run on an India-located SERP before they drive spend.

One intent → one primary URL. Nothing below creates a second page for an intent already served.

## A. Intents that already have a home

| Intent | Stage | Primary URL | Targeted today? | Gap to close |
|---|---|---|---|---|
| EPC ERP software | transactional | `/epc-erp-software` | Yes — title matches | H1 ("The ERP built only for EPC contractors.") drops the phrase; **title collides with the homepage** |
| construction ERP software India | transactional | `/` | Partial | Homepage title also leads on "EPC ERP". Decide the split: `/` = broad construction ERP, `/epc-erp-software` = the narrow term. SERP-OBSERVED (GEO-UNVERIFIED): listicle-dominated, a slow fight |
| ERP for turnkey contractors · industrial EPC ERP | transactional | `/solutions/industrial-epc` | Yes | Thinnest of the four solution pages — no problem block, no FAQ, no turnkey-specific proof |
| MEP contractor software | transactional | `/solutions/mep-contractors` | Yes | **Never expands "MEP" or names a trade.** Blocks the whole electrical/HVAC/plumbing/fire cluster. Add "India" — the title has no geo |
| solar EPC management software | transactional | `/solutions/solar-epc` | Yes | **Best opportunity of the four.** SERP-OBSERVED: a genuinely India-native field; rivals sell on DISCOM approvals, state subsidies, net metering, PM Surya Ghar, O&M. The page has none of that vocabulary |
| civil contractor ERP | transactional | `/solutions/civil-contractors` | Title only | H1 omits the term. The one India-serving rival sells on RERA and gang-contractor billing — neither appears on the page |
| RA billing software | transactional | `/ra-billing-software` | **Yes — strongest match on the site** | **BOQ and subcontractor billing are never mentioned** on it; both belong here |
| material reconciliation | informational | `/material-reconciliation` | Yes | SERP-OBSERVED: the query returns **formats, formulas and explainers**, not software. Either add a genuine format/formula section with a template, or accept this as a nurture asset and stop judging it on leads |
| DPR software | transactional | `/reduce-project-delays` | Partial | SERP-OBSERVED: a real India-leaning software SERP. Add a `DPR software` H2 + FAQ here first. **Do not** spin out `/dpr-software` unless this underperforms for a quarter — it would cannibalise |
| construction project management software India | transactional | `/platform` | Partial | Title and H1 lead on the invented category "Construction Operating System", which nobody searches. Add the searched phrase as an H2 without losing the positioning |
| competitor / alternatives | comparison | `/compare` + 6 children | Yes | Coverage is fine; **accuracy was not** — see the corrections applied in `audit.md` §8 |
| pricing / cost | transactional | `/pricing` | Yes | Publishing real figures is a genuine edge: Powerplay, Procore and RDash publish none |
| calculators | informational | `/tools` + 10 | Yes | These are the internal-link feeders for the new pages below |

## B. Intents with no home — fold or build

| Intent | Verdict | Why |
|---|---|---|
| electrical / HVAC / firefighting / plumbing contractor software | **Fold** into `/solutions/mep-contractors` | Same product, buyer and objections. Add a trade-by-trade band + FAQs. One possible exception later: **fire-fighting**, because `/features` lists a "Fire NOC Renewal" module no researched rival claims — a real hook, but gate it on demand data |
| measurement book / MB software | **Fold** into `/ra-billing-software` | MB is a step inside RA billing, not a separate purchase. Also see the flag below — the bare phrase is a homograph |
| subcontractor billing | **Fold** into `/ra-billing-software` | Same buyer, same workflow. Use Indian vocabulary (sub-contractor RA bill, vendor bill), not US "pay apps" |
| construction procurement software | **Build** `/construction-procurement-software` | Strongest new-page case. A distinct module-level buying term whose only home is a section inside a 40-item hub. The depth already exists (RFQ, indent→PO→payment, L1/L2 approvals, vendor/item masters, inventory) |
| Tally integration for contractors | **Build** — high priority | An explicit, high-intent, India-only *switching* query with one line of coverage today. Sourced wedge: Onsite charges **₹20,000/yr + ₹5,000 maintenance** for Tally integration (their published pricing, 2026-09-23). If sotyn.ai includes it, say so with the comparison |
| construction labour / payroll software | **Build** | No home; SERP-OBSERVED as a real India-native software market (selling on geofenced/selfie attendance, ESIC, statutory compliance); Powerplay runs a dedicated page for it. **Blocked on DECISION 6** — geofenced attendance must have a settled status first |
| project cash-flow software | **Build** | A calculator is a lead magnet, not a solution page. Fits the existing problem-page pattern exactly, with `/tools/cash-stuck` and `/tools/retention` as support |
| BOQ management | **Build only if scoped defensively** | SERP-OBSERVED: the query returns **drawing takeoff** tools (PDF/DWG/BIM). sotyn.ai does not claim takeoff. A page that ranks and then fails that expectation will bounce. Only build it framed as *client BOQ → priced quote → BOQ vs actual*, saying plainly that it starts from a BOQ, not from drawings |

## C. Seeds where the intent is NOT a software buyer

| Seed | Observation | Verdict |
|---|---|---|
| measurement book software | Returns **software-engineering measurement literature** (Fenton & Bieman, "Applied Software Measurement") and library tooling. Not one Indian construction MB result | Homograph collision. Do not target the bare phrase; only the India-qualified form is plausible, and that is unproven |
| MEP contractor software · civil contractor ERP | Return US/UK vendors almost exclusively, MEP skewed to **estimating/takeoff** — a capability sotyn.ai does not claim | GEO-UNVERIFIED geo-mismatch. Always target the India-qualified variant |
| material reconciliation | Explainers, formats and YouTube — the searcher usually wants a free Excel format | Mid-funnel, not a buying term |
| subcontractor billing | A US market: pay applications, lien waivers, lien rights — legal constructs with no Indian equivalent | Vocabulary mismatch; use Indian phrasing |
| construction ERP software India · EPC ERP software | Listicle-dominated, with a far wider competitive set than the six on `/compare` (Xpedeon, Ramco, StrategicERP, In4Velocity, NYGGS, eresource and others) | Not off-intent, but a 2–3 quarter objective, not a quick win |

**No jobs, training, tender or "contractor near me" service contamination was observed** on any sampled SERP — but that check must be repeated on an India-located SERP, where bare terms like "civil contractor" are likelier to attract it.

## D. Suggested sequence

1. Resolve the `/` ↔ `/epc-erp-software` title collision (one page must yield).
2. Fill the gaps in pages that already exist — solar regulatory vocabulary, MEP trade names, BOQ + subcontractor billing on `/ra-billing-software`, a DPR block on `/reduce-project-delays`. Cheapest work, best-placed assets.
3. Build `/construction-procurement-software`, then the Tally page, then cash-flow. Labour/payroll waits on the geofencing decision; BOQ waits on India keyword data.
4. Get Search Console access before anything is judged a success or a failure.
