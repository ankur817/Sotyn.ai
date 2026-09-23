# Verified business brief — sotyn.ai

Compiled 2026-09-23 from the repository (`ankur817/Sotyn.ai`, branch `main`), the production site, and the live lead endpoint. **Nothing here is assumed from the name or the market.** Every line is either evidenced or marked **Needs client confirmation**.

Evidence labels: `SOURCE` = repo · `LIVE` = production HTTP on 2026-09-23 · `TEST` = something I executed.

---

## 1. What sotyn.ai is

An **ERP (business operating system) sold as software to Indian contracting companies**. It is not a construction-services business and must never be marketed as one.

- Product category, self-described: *"India's first AI-native ERP — built only for EPC contractors"* (SOURCE `src/config/site.ts`).
- Delivery: web application at `securederp.in`, mobile-first through the browser. Structured data states `Web, Android, iOS (PWA)` (SOURCE `BaseLayout.astro`). **Native App Store / Google Play apps are "coming soon"** per the sitewide footer.
- Built and operated by **Secured Engineers Pvt. Ltd.**, a 14-year EPC contractor, which is also its first customer (SOURCE, and stated openly on `/about`).
- Marketing site: static **Astro 5** build on **Vercel**, served from `www.sotyn.ai` (LIVE). 44 routes.

**Consequence for this engagement:** the parent company's construction record is the product's credibility story, but SEPL's clients, project counts and certifications are *not* sotyn.ai software-customer evidence. They must be attributed every time they appear.

## 2. Primary job to be done

Give a contracting business one system for the chain where its margin leaks: **quote → procurement → site execution → billing → collection**, so an owner can see cost, cash and progress while a job is running instead of at closeout. The site's own framing: *"AI that shows you exactly where your money is leaking — from quote to site to collection"* (SOURCE).

## 3. Who it is for

| Role | Evidence | Their question |
|---|---|---|
| **Owner / CMD / founder** — the economic buyer | Pricing is per company; the "War Room" and scorecard are explicitly CMD-level (SOURCE) | "Where is my margin going, and can I see it without asking five people?" |
| Project / site manager | DPR, snags, Gantt, indents (SOURCE `features.astro`) | "Can my site staff actually file this on a phone?" |
| Billing / QS engineer | RA, MB, T&C bill types; rate masters (SOURCE) | "Will the bill match my measurement book and my contract?" |
| Purchase manager | RFQ queue, vendor/item master, L1/L2 approvals (SOURCE) | "Can I compare rates and prove who approved a purchase?" |
| Accounts | AR/AP, collections, cash flow, TDS/GST/retention (SOURCE) | "What is actually collectible this month?" |

Firm profile stated on the site: **EPC contractors with roughly ₹2–100 Cr turnover**, in MEP/MEPF, solar, civil, industrial and turnkey work (SOURCE `site.ts` webinar.forWho).

## 4. Conversion events (verified end to end)

Primary: **demo request**. Secondary: diagnostic (scorecard), resource download, webinar registration, paid-pilot enquiry.

- All five now post to a same-origin intake, `POST /api/lead` (SOURCE `api/lead.js`; TEST 2026-09-23 — returns `{"ok":true,"id":"SOTYN-…","erp":"ok"}`).
- The ERP endpoint `https://securederp.in/api/public/sotyn-lead` answers `200 · application/json · {"ok":true,"id":7,"duplicate":true}` (TEST). It **de-duplicates by contact**.
- Google Sheets register ("SOTYN Website Leads") is built but **not yet live** — the function reports `sheet: "not_configured"` (TEST). Owner action pending.
- **No analytics exists.** No GA4, no GTM, no Meta pixel in the live HTML (`metaPixelId` is empty, SOURCE). So there is currently **no measured funnel at all** — every conversion number in this engagement starts from zero baseline.

## 5. Pricing (publicly stated)

Starter ₹6,000/mo (₹72,000/yr) · Growth ₹12,500/mo (₹1,50,000/yr) · Enterprise from ₹3,00,000/yr. One-time onboarding ₹25,000 (Starter) / ₹50,000 (Growth & Enterprise). 30-day money-back guarantee. Unlimited **site** users on every plan (SOURCE, LIVE `/pricing`).

⚠️ Four pricing facts contradict themselves between the plan cards and the FAQ on the same page — see §9.

## 6. Capabilities: shipping vs not

**Verified shipping** (used as the basis for all content so far): projects, DPR, snags, Gantt · indent → RFQ → PO → dispatch → receiving → debit notes, L1/L2 approvals, vendor/item master, per-site inventory · EPC bill types (Sales, RA, MB, Installation, T&C) with GST, TDS, retention · labour & subcontract rate masters · AR/AP, collections, cash flow · HRMS, attendance, payroll · executive dashboard / War Room · scorecard · roles, permissions, audit log · solar sales funnel · Fire NOC renewal tracking.

**Explicitly not shipping** — must not appear as available: AI Auto-Quotation (BOQ → priced quote), geofenced GPS + selfie attendance, Compliance RAG, native Android/iOS apps. **Contradictory across pages** — see §9: the 11-language claim, and whether Tally is a live integration or a one-time migration.

**Does not do at all** (verified absence, useful for intent filtering): drawing/BIM takeoff, e-tender portals, banking/payment execution.

## 7. Geography and language

India-wide, single office in **Ludhiana, Punjab** (SOURCE address block). Site language: English (`en-IN`). There are **no city pages, no regional pages and no translations** — deliberately, per `docs/india-coverage-policy.md`. Schema declares `availableLanguage: ["en","hi"]`.

## 8. Trust signals that are real — and how they must be framed

| Signal | Whose it is |
|---|---|
| 535+ projects · 18+ states · 300+ daily users · ₹11.7 Cr savings tracked · 89.77% repeat clients · 93.32% early delivery | **Secured Engineers'** operating record. Attribute every time. |
| ISO 9001:2015, MSME, GST registration | **Secured Engineers'** credentials, not software certifications |
| Named clients (V-Guard, Luminous, Sonalika, Hero Homes, Airtel, Dabur…) | **Secured Engineers'** contracting clients |
| "We run our own company on it" — the demo is the live business | Genuine, and the strongest honest differentiator |
| Third-party sotyn.ai customer testimonials, case studies, ratings | **None exist.** The config says so explicitly. No review or rating markup anywhere — correct, and it must stay that way. |

**No security certification is claimed** (no SOC 2, no ISO 27001, no DPDP statement) while the site promises India hosting, nightly backups, audit log and "never sold, never shared". There is **no privacy policy, no terms and no security page** — the clearest gap for a B2B procurement review.

## 9. Unresolved contradictions — Needs client confirmation

Each is live on the site today and blocks honest copy. Evidence with file/line in `docs/claims-registry.md`.

1. **Office users** — plan cards cap at 10/25; the FAQ on the same page says unlimited.
2. **Onboarding fee** — ₹25,000/₹50,000 on the cards vs "₹1,000–₹25,000" in the FAQ.
3. **Launch offer** — "first 25, 40% off year 1" vs the FAQ's "first 100, price locked for life" vs `/social-kit`'s "₹10,000/mo locked for life" (a price matching no plan).
4. **Languages** — the homepage says it *runs in 11 languages*; `/demo` and `/reduce-project-delays` say English is live and ten are rolling out; schema says two. **Highest-priority correction: it is on the highest-traffic page and in its meta description.**
5. **AI Auto-Quotation** and **geofenced attendance** — "coming soon" in four places, sold as shipping in five, including "Yes" cells against named competitors.
6. **Tally** — "links with Tally / keeps books in sync" vs "we migrate your data at setup".
7. **Mobile app** — sold as a plan feature while the footer says the app-store apps are coming.
8. **"Everything included, every plan"** vs Growth-only and Enterprise-only features.
9. **Billing cadence** — "pay monthly, cancel anytime" vs every plan billed yearly.
10. **ERP de-duplication by phone** — a genuine repeat enquiry from the same person merges into one ERP record. Is that intended?

## 10. Other things needing client confirmation

- Which of the **five Vercel projects** owns `www.sotyn.ai` (blocks the Sheets register).
- Whether a **GA4 property** exists for sotyn.ai, and who owns GSC for the domain.
- Whether implementation can genuinely be delivered outside Punjab/NCR, and in which mode — this gates any regional content.
- Whether any customer will consent to a named case study.
- Approved security/compliance posture, so a security page can exist.
- Whether the paid pilot and the free demo are both current offers, and their exact terms.

## 11. Current commercial and informational pages

**Commercial:** `/` · `/platform` · `/epc-erp-software` · `/pricing` · `/demo` · `/features` · `/ra-billing-software` · `/material-reconciliation` · `/reduce-project-delays` · `/construction-procurement-software` *(new)* · `/subcontractor-billing-software` *(new)* · `/construction-erp-implementation` *(new)* · `/solutions/{mep-contractors,solar-epc,civil-contractors,industrial-epc}` · `/compare` + 6 comparisons.

**Informational / top-of-funnel:** `/tools` + 10 calculators · `/resources` + 3 guides · `/scorecard` · `/webinar` · `/about`.

**No blog, no documentation, no changelog, no help centre** — the largest structural content gap for both search and AI-answer visibility, because there is nowhere for implementation detail, product behaviour or original operating evidence to live.
