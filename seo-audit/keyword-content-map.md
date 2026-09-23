# Keyword, IA and content map — sotyn.ai

Date 2026-09-23. Built on the verified brief (`sotyn-business-brief.md`) and the research in `google-trends-research.csv` / `docs/keyword-map.md`. **No search volume, CPC or difficulty figure appears anywhere in this document** — none is available (`docs/TOOL_ACCESS.md`), and inventing one would corrupt every prioritisation built on it. Priority = product fit → buying intent → evidence we can publish → differentiation → effort.

## Cluster model

```
sotyn.ai (entity: contractor ERP software, India)
├── Category            /  ·  /epc-erp-software  ·  /platform  ·  /features
├── Workflow (the buying unit)
│     ├── Procurement   /construction-procurement-software
│     ├── Billing out   /ra-billing-software
│     ├── Billing in    /subcontractor-billing-software
│     ├── Materials     /material-reconciliation
│     └── Progress      /reduce-project-delays
├── Trade               /solutions/{mep-contractors,solar-epc,civil-contractors,industrial-epc}
├── Evaluation          /pricing  ·  /construction-erp-implementation  ·  /compare/*
├── Tools & resources   /tools/* (10)  ·  /resources/*  ·  /scorecard
└── Trust  ⚠ missing    privacy · terms · security · docs
```

One primary intent per URL. A workflow page owns the workflow term; the trade pages own the audience term and link into the workflows rather than repeating them.

---

## Priority URLs — full specification

### 1. `/` — homepage
1. **Template** home. 2. **Intent** commercial, broad category. 3. **Persona** owner/CMD of a ₹2–100 Cr contracting firm, first visit, probably from a brand or category search.
4. **Primary theme** construction ERP software (India). **Secondary** EPC/MEP/solar/civil fit, what it replaces, what a demo shows.
5. **Goal/CTA** demo request → `/demo`.
6. **Title** `Construction ERP Software for Contractors in India | sotyn.ai` *(shipped)*.
7. **Description** rewrite — currently 219 chars and it repeats the disputed 11-language claim. Target ≤155: the category, who it is for, the one-sentence outcome, "book a free demo".
8. **H1** keep the brand line, but the **first paragraph must answer plainly what the product is and who it is for** — today the answer is spread across three sections.
9. **Outline** what it is → the five leaks it closes (each linking to its workflow page) → what you see in a demo → who runs it today, attributed → pricing signpost → demo.
10. **Proof needed** existing screenshots only; the attributed SEPL record; **no new claim**.
11. **Links in** nav, footer, every page. **Links out** the five workflow pages, `/pricing`, `/demo`, `/epc-erp-software`.
12. **Schema** Organization + WebSite (WebSite not yet present). FAQ markup only while the FAQs stay visible.
13. **Events** `request_demo`, `pricing_view`, `contact_click`.
14. **Acceptance** a first-time visitor can state the category, the audience and the next step within one screen; no unresolved claim in the copy.
15. **Risk** the language claim (P0-3) must be settled before the description is rewritten. **Client confirmation: yes.**

### 2. `/epc-erp-software` — EPC category page
Intent: commercial, narrower than the homepage. Persona: EPC/turnkey contractor who searched the category by name.
**Title** `EPC ERP Software for EPC & Turnkey Contractors | sotyn.ai` *(shipped — resolves the three-way title collision)*.
**Gap:** the H1 does not contain the term, the page has almost **no inbound internal links**, and it repeats homepage material instead of going deeper on EPC-specific billing (RA/MB/T&C), multi-site procurement and the owner's console.
**Action:** differentiate (do not merge). Add contextual links from `/` and `/platform`; add an EPC-specific worked example; link out to all five workflow pages.
**Schema** BreadcrumbList (visible breadcrumb exists). **Events** `request_demo`. **Acceptance:** no paragraph duplicated from `/` or `/platform`.

### 3. `/platform` — how the system fits together
Intent: consideration. Persona: evaluator mapping modules to their own process.
**Title** `Construction Project Management Software for Indian Contractors | sotyn.ai` *(shipped)*.
**Gap:** leads on the invented category "Construction Operating System", which nobody searches; the stats block renders **unattributed** here (must be attributed to Secured Engineers); no link into the new workflow pages.
**Action:** improve — add the searched phrasing as an H2, attribute the stats, add the workflow links, state plainly what is not included.

### 4. `/pricing`
Intent: transactional/evaluation. Persona: economic buyer.
**Gap:** four internal contradictions (office users, setup fee, cohort size, billing cadence) — see brief §9. **Blocked on client decisions**; no copy work until they land.
**Then:** state what a plan includes vs what is Growth+/Enterprise-only, link to `/construction-erp-implementation` for the one-time fee, and keep the free-demo route alongside the paid pilot.
**Schema:** keep the `AggregateOffer` on the sitewide SoftwareApplication; **do not** add `Product`. **Events** `pricing_view`, `request_demo`. **Client confirmation: yes, four items.**

### 5. `/demo` — the primary conversion page
Intent: transactional. **Gap:** the page does not show what a demo actually covers, so a cautious buyer has no reason to prefer it to leaving.
**Action:** add "what you'll see in 20 minutes" as three concrete steps on their own data, the honest statement that nothing is booked until a time is agreed, and the trade/context prefill (shipped via `/demo?from=<slug>`).
**Events** `request_demo`, `submit_lead_form`. **Acceptance:** intent and context reach the lead record and the Sheet row.

### 6. `/construction-procurement-software`, `/subcontractor-billing-software`, `/construction-erp-implementation` *(published 2026-09-23)*
Each already carries: buyer fit, real workflow, a worked example on labelled sample data, a "what this does not do" section, FAQs, a page-specific CTA (`/demo?from=…`), and links to neighbouring workflows.
**Next for each:** an annotated screenshot of the actual screen (needs product capture permission), and the matching resource asset below.
**Schema** BreadcrumbList only. **Acceptance for the screenshots:** real UI, redacted, no invented data.

---

## Compact map for the remaining URLs

| URL | Primary intent | Action | Why |
|---|---|---|---|
| `/features` | informational, module list | improve | 40 items, no links into the workflow pages they describe |
| `/ra-billing-software` | commercial, RA billing | improve | strongest existing match; add BOQ and subcontractor-bill sections, both absent |
| `/material-reconciliation` | informational-leaning | improve | its query returns formats and explainers, not software — add a genuine format/methodology section or accept it as mid-funnel |
| `/reduce-project-delays` | commercial, DPR | improve | add a visible `DPR software` H2 + FAQ here rather than creating `/dpr-software`, which would cannibalise |
| `/solutions/mep-contractors` | audience | improve | never expands "MEP" or names a trade — blocks the electrical/HVAC/plumbing/fire cluster |
| `/solutions/solar-epc` | audience | improve | strongest trade SERP; needs DISCOM, net-metering, subsidy vocabulary it currently lacks |
| `/solutions/civil-contractors` | audience | improve | mirror the India-qualified title in the H1; the one India-serving rival sells on RERA and gang-contractor billing |
| `/solutions/industrial-epc` | audience | improve | thinnest of the four; no FAQ, no problem block |
| `/compare` + 6 | comparison | maintain | claims corrected in a previous round; re-verify Powerplay, which has migrated domain and repositioned |
| `/tools/*` (10) | informational | improve | link each result to its workflow page; do not gate the calculation |
| `/resources/*` (3) | informational | improve | attach each to a commercial page |
| `/scorecard` | lead magnet | done | now a diagnostic request, not a webinar registration |
| `/webinar` | registration | maintain | keep separate from diagnostic intent |
| `/about` | trust | improve | the clearest place to separate SEPL's record from sotyn.ai's customer base |

## Proposed new pages — only these, and in this order

| Proposed URL | Intent | Why it earns a URL | Gate before publishing |
|---|---|---|---|
| `/privacy`, `/terms`, `/security` | trust | Every page makes data-handling promises with nothing to back them; forms post to another domain undisclosed | Client-approved posture. **Never invent a certification.** |
| `/resources/purchase-approval-checklist` | informational → procurement | A real, usable checklist that answers its own question and links to the procurement page | The actual file must exist and be useful un-gated |
| `/resources/subcontractor-bill-verification-checklist` | informational → subcontractor billing | Same pattern, highest-value workflow | as above |
| `/resources/erp-migration-checklist` | informational → implementation | Buyers at this stage are closest to signing | as above |
| `/docs/*` (small set) | informational | Implementation detail, constraints and product behaviour — the material that earns informational visibility and gives AI systems something specific to cite | Accuracy review |

**Not recommended now:** city or regional pages, translations, an "alternatives" expansion, industry pages beyond the four trades, or any glossary. Each would add URLs without adding a distinct buyer service.

## Cannibalisation register

| Intent | Pages that competed | Resolution |
|---|---|---|
| "EPC ERP software" | `/`, `/epc-erp-software`, `/platform` all led on it in their titles | **Fixed 2026-09-23** — split into three distinct claims |
| RA billing vs subcontractor billing | one page conflated billing *to* clients and *from* subcontractors | **Fixed** — separate pages, cross-linked |
| DPR | `/reduce-project-delays` vs a proposed `/dpr-software` | **Do not create** the new page; add a section instead |
| BOQ | `/material-reconciliation` vs a proposed BOQ page | Only if scoped as *BOQ → priced quote → BOQ vs actual*, explicitly excluding drawing takeoff |
| Procurement | `/features` procurement section vs `/construction-procurement-software` | Hub keeps the list; the workflow page owns the intent and gets the links |

## Acceptance criteria applied to every page in this map

1. States what it does **and what it does not do**.
2. Every capability named is shipping today (no AI auto-quotation, geofencing, native apps or live Tally sync).
3. Any SEPL figure is attributed to Secured Engineers in the same sentence.
4. One primary intent, in the title and the H1.
5. A CTA that matches the page, carrying context into the enquiry.
6. Nothing important lives only in an image.
