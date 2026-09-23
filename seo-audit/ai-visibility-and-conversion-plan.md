# AI-search visibility and conversion plan

Date 2026-09-23. Phases 5 and 6. **Proposal — nothing here is deployed.**

No part of this plan can promise a citation in an AI answer engine, a rich result, a ranking or a lead volume. What it can do is make the entity unambiguous, the claims checkable and the useful material reachable in plain HTML — the conditions under which a system can cite you responsibly, and a buyer can decide.

---

## Part 1 — Entity clarity

**Today:** one `Organization` with a stable id, one `SoftwareApplication`, consistent NAP, two verified social profiles. The site is static HTML, so everything is machine-readable without JS. That is a good base.

**Gaps that weaken the entity:**

| Gap | Why it matters | Action |
|---|---|---|
| The parent-company record reads as product evidence on `/platform` and `/solutions/*` | An assistant summarising the site will report "535+ projects" as sotyn.ai's customer base. It is Secured Engineers' contracting record. | Attribute in the same sentence, everywhere |
| No privacy, terms or security page | A B2B entity with data-handling promises and no policy page is hard to vouch for | Publish all three (verified posture only) |
| No documentation, changelog or dated content | Nothing carries a "last updated" signal or implementation specifics | Small docs set, dated |
| The 11-language contradiction | Two pages say opposite things; a summariser will pick one, possibly the wrong one | Settle the fact, then state it once |
| No third-party mention anywhere | Directory listings, partner pages and genuine coverage are how an entity is corroborated | Outreach plan below — drafts only |

## Part 2 — The content test every page must pass

Applied to the three pages published on 2026-09-23 and to everything proposed:

1. **Does it answer a real question better than the generic result?** — the workflow pages answer "how does this actually work, step by step", which vendor pages usually skip.
2. **Does it contain first-hand knowledge?** — worked examples, approval levels, deduction order, migration sequence: things only an operator knows.
3. **Is every claim verifiable?** — capability lists come from shipped modules; the "what this does not do" section is the differentiator.
4. **Is it useful without an AI assistant?** — yes; each is readable end to end.
5. **Is it specific enough to cite responsibly?** — a system can quote "L1/L2 approvals with the comparison attached" without overstating.
6. **Is there an honest conversion path?** — a page-specific CTA, no "meeting booked" claim before a time is agreed.

**What earns citations here is the honesty, not the markup.** The "what this does not do" sections, the labelled sample data, and the published fee are the parts a research tool can safely repeat.

## Part 3 — Material worth creating, in order

1. **Three checklists** (purchase approval, subcontractor bill verification, ERP migration) — real, usable files attached to the workflow page each supports. Un-gated to read; contact details only for a clearly stated extra service.
2. **A redacted product walkthrough** — annotated screenshots of the real screens for procurement, subcontractor billing and DPR. **Needs permission and redaction**; no mockups presented as live screens.
3. **Implementation notes** — constraints, prerequisites, what goes wrong and how long things take. This is the material a generic vendor page never has.
4. **One customer case study** — only with written consent and real numbers. Until then, the honest line is "we run our own 14-year contracting business on it", which is already true and already said.

**Never:** fabricated reviews, purchased links, automated comments, mass-generated city mentions, or "recommended by AI" claims.

## Part 4 — Distribution (drafts only, nothing sent)

| Channel | Audience | Asset | Landing page |
|---|---|---|---|
| LinkedIn (company + founder) | Indian contractor owners already following the founder | Workflow walkthrough posts | the matching workflow page |
| Existing opt-in audience | Webinar registrants and past enquiries | The checklists | resource page, not the webinar |
| Contractor associations / trade bodies | MEP, solar, civil membership | Implementation guidance | `/construction-erp-implementation` |
| Implementation partners | Firms already doing ERP rollouts in India | Partner page (does not exist yet) | to be created |
| Industry publications | Construction-tech editorial in India | Original operating evidence, with methodology | `/about` |

Every message must name the actual audience and why the asset helps them. **Sending requires separate authorisation.**

---

## Part 5 — Conversion paths, audited

| Path | State today | Fix |
|---|---|---|
| Home → demo | Works; primary CTA visible | First paragraph should answer what/who before the brand line |
| Workflow page → demo | **Shipped** — page-specific CTA carrying `?from=` context | Add the annotated screenshot so the demo is pre-justified |
| Pricing → demo | Works, but four contradictions undermine it | Blocked on client decisions |
| Calculator → product | Weak — result ends at WhatsApp | Link each result to its workflow page and an optional enquiry carrying the result |
| Resource → product | Weak | Attach each resource to a commercial page |
| Scorecard → diagnostic | **Fixed** — no longer a webinar registration | Sheet row verification pending |
| Failure recovery | **Fixed** — data kept, retry/call/WhatsApp offered, no false success | — |
| Mobile | Verified at 375×812 on the new pages; WhatsApp float does not obscure content | Re-check after the image work |

**Form friction:** the demo form asks 6 fields, two optional; trade and context now arrive from the page. That is short enough — further qualification belongs after contact, in the CRM, not in front of a first-time visitor.

## Part 6 — Conversion tracking to implement (blocked on a GA4 property)

Names follow GA4 conventions; the full contract is in `docs/lead-and-analytics-spec.md`.

| Event | Fires when | Notes |
|---|---|---|
| `request_demo` | demo form accepted by the server | one per lead id |
| `submit_lead_form` | any accepted enquiry | carries `lead_intent` |
| `generate_lead` | accepted enquiry, deduplicated | **not** on a form *attempt* |
| `qualify_lead` | a human qualifies it in the CRM | never from a page view |
| `pricing_view` | `/pricing` viewed | — |
| `file_download` | resource delivered | an interaction, not a lead |
| `contact_click` | WhatsApp or phone click | an interaction, not a conversation |
| `scorecard_completed` | diagnostic finished | **shipped** — already firing |
| `lead_delivery_error` | delivery failed | alerting signal, no PII |

Rules that must not be relaxed: no personal data in any parameter or URL; one accepted lead is one conversion; a click is never a lead; tests excluded from every total; resource contacts reported separately from sales opportunities. `start_trial`, `checkout_start` and `purchase` are **not applicable** — there is no self-serve trial or checkout; sales are closed after a demo.

## Part 7 — How success will be judged (once measurable)

Relevant non-brand impressions and clicks · CTR on the commercial pages · indexed status of the priority URLs · accepted genuine enquiries by intent · qualified enquiries · demos booked and attended · paid pilots and subscriptions · pending follow-ups. Matching periods, matching denominators. Never all-source leads ÷ organic clicks.

**Today the honest baseline is: no analytics, no Search Console, no lead register rows.** That is the first thing to fix, because without it every later claim about this work is unverifiable.
