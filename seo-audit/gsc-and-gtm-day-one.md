# Search Console and GTM — what to do first, on the pages that make money

Date 2026-09-26. Two jobs, both blocked on access I do not have, both reduced here to a short list you can work through.

---

## Part 1 — GTM is live but forwards nothing

**Verified on production today:** container `GTM-M7RVVGSG` loads, GA4 property `G-85EHQ8CD1W` receives a `page_view`, exactly one measurement stack, no duplicate tag. That part is right.

**But that is all it sends.** I completed the scorecard on the live site and watched what happened:

| | Result |
|---|---|
| `scorecard_completed` pushed to `dataLayer` | ✅ yes |
| Forwarded to GA4 | ❌ no — GA4 saw only `page_view` |

The site already emits five events. None of them reach GA4, because the container has a GA4 configuration tag and no event tags. Until this is fixed, **the funnel is still unmeasured** — you will see sessions and landing pages, and nothing about enquiries.

### The five events the site already pushes

| dataLayer event | Fires when | Parameters |
|---|---|---|
| `generate_lead` | the server **accepted** an enquiry — once per lead id | `lead_source`, `lead_intent`, `lead_page`, `lead_id` |
| `scorecard_completed` | the diagnostic finishes | `lead_page`, `leak_level` |
| `file_download` | a checklist file is delivered | `file_name`, `lead_page` |
| `contact_click` | WhatsApp or phone tapped | `method`, `lead_page` |
| `lead_delivery_error` | delivery failed | `reason`, `lead_source` |

No personal data is in any of them, by design. Do not add any.

### What to build in GTM (about 15 minutes)

**1. Five dataLayer variables** — Variables → New → Data Layer Variable, one each:
`lead_source`, `lead_intent`, `lead_page`, `lead_id`, `leak_level`, `file_name`, `method`, `reason`

**2. Five custom event triggers** — Triggers → New → Custom Event, event name exactly as above.

**3. Five GA4 event tags** — Tag type *GA4 Event*, Measurement ID `G-85EHQ8CD1W`, one per trigger:

| Tag | Event name | Event parameters |
|---|---|---|
| GA4 – generate_lead | `generate_lead` | lead_source, lead_intent, lead_page, lead_id |
| GA4 – scorecard_completed | `scorecard_completed` | lead_page, leak_level |
| GA4 – file_download | `file_download` | file_name, lead_page |
| GA4 – contact_click | `contact_click` | method, lead_page |
| GA4 – lead_delivery_error | `lead_delivery_error` | reason, lead_source |

**4. In GA4:** Admin → Events → mark **`generate_lead`** as a key event. Only that one. A download, a scorecard and a WhatsApp tap are interactions — counting them as conversions is how a funnel starts lying to you.

**5. Verify** in GTM Preview: complete the scorecard and watch `scorecard_completed` fire, then check GA4 DebugView. I can re-verify from the live site once you publish the container.

---

## Part 2 — Search Console, and the honest position

**I cannot reach Search Console from here.** There is no GSC connector in this session, and the OAuth flow cannot run in it — so there is no quota for me to spend today, on the money pages or any others. Anything I reported from "GSC data" would be invented.

**The property may not exist yet.** `SITE.googleSiteVerification` is still empty and no verification tag is on the live site. Unless you verified by DNS, there is nothing to open.

### Step 1 — verify the property (5 minutes, yours)

Use the **Domain property** (`sotyn.ai`) with a DNS TXT record in GoDaddy. It covers apex, www and http in one property and cannot break on a redeploy. The HTML-tag fallback exists if you prefer: paste the token into `SITE.googleSiteVerification` and I will deploy it.

### Step 2 — submit the sitemap

`https://www.sotyn.ai/sitemap-index.xml` — live, 200, 48 canonical URLs, every one carrying a real `lastmod`.

### Step 3 — spend the URL Inspection quota in this order

The quota is roughly **2,000 inspections a day, ~10 a minute**. You will use fewer than 20. Inspect these, in this order — they are the pages that can actually produce an enquiry:

| # | URL | Why first |
|---|---|---|
| 1 | `/` | Entity page. If this is not indexed, nothing else matters |
| 2 | `/pricing` | Highest buying intent on the site |
| 3 | `/demo` | The conversion page itself |
| 4 | `/ra-billing-software` | Best-matched commercial page, and the one query family with clear India-specific SERP evidence |
| 5 | `/subcontractor-billing-software` | New, high intent, no competitor page owns it |
| 6 | `/construction-procurement-software` | New, module-level buying term |
| 7 | `/construction-erp-implementation` | Late-stage buyers, closest to signing |
| 8 | `/epc-erp-software` | Was orphaned until this week — check whether that cost it indexing |
| 9 | `/compare/sotyn-vs-tally` | Newest page; a clean read on how fast new URLs are picked up |
| 10 | `/material-reconciliation` | Established commercial page |
| 11–14 | the four `/solutions/*` pages | Rewritten this week from ~220 to ~500 words |
| 15 | `/locations/punjab/ludhiana` | The only district page; tells you whether the gate approach indexes at all |

**For each, record:** indexed or not · Google-selected canonical (it should match the page's own) · last crawl date · mobile usability · any enhancement warning.

**Request indexing only for pages that come back not-indexed**, and only once. Repeated requests do nothing except use quota.

### Step 4 — what to look for, and what not to conclude

- **Google-selected canonical ≠ your canonical** on any page → tell me, that is a real defect and I will fix it.
- **Not indexed, "Discovered – currently not indexed"** → usually a quality or authority signal, not a technical one. The fix is the [directory listings and a customer story](ai-visibility-listings.md), not more markup.
- **Not indexed and crawled recently** → give it time. The canonical host changed on 23 September and nine pages are less than a week old.

Do not read the first week as a trend. Compare complete 28-day periods once there is data, and keep branded queries separate from the non-brand ones that actually matter.

---

## Where this leaves measurement

| | Status |
|---|---|
| Pageviews, sessions, landing pages | **Working** — GTM + GA4 live today |
| Enquiries, downloads, diagnostics in GA4 | **Blocked** — needs the five tags above |
| Enquiries in the Google Sheet | **Blocked** — still `sheet: "not_configured"` |
| Impressions, clicks, indexing | **Blocked** — property not verified |

Three short jobs, all yours, none longer than fifteen minutes. Until they are done the site is well built and unmeasured, and I would rather say that than dress up a number.
