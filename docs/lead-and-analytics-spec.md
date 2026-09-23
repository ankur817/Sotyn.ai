# Lead delivery, event and reporting specification

Status: the **client half is implemented** on this branch (`src/lib/lead-client.js`, all four forms). The endpoint and analytics halves are **not**, and depend on the access in `blocked-access.md`.

## 1. Lead delivery contract (what the site now does)

Request — `POST https://securederp.in/api/public/sotyn-lead`

```
Content-Type: application/json
X-Request-Id: <uuid>            # stable across retries of one submission
{
  name, phone, company?, city?, trade?, team?, email?, turnover?, context?,
  source,          // demo-form | resource | book-checklist | webinar-registration
  magnet?,         // which asset, for resource forms
  page,            // path only
  referrer,        // document.referrer
  landingSearch,   // query string, for campaign attribution
  submittedAt,     // ISO 8601
  requestId        // same value as the header
}
```

Response the site treats as **accepted**: HTTP 2xx **and** `Content-Type: application/json` **and** a body that does not carry `ok: false` or `error`. An id in `id` / `leadId` / `lead_id` is used as the lead reference. Anything else — HTML body, non-2xx, unparseable JSON, network failure, 12s timeout — is **not accepted**, and the visitor is told so.

Required of the endpoint (outstanding):
1. Return JSON on success, ideally `{"ok":true,"id":"<opaque>"}`. **If it returns HTML today, every real lead will show the failure state — confirm before deploying.**
2. Treat a repeated `X-Request-Id` as the same lead (idempotency), so a retry cannot duplicate.
3. Server-side validation, length limits, timeout and per-IP/phone rate limiting. Browser timing checks are not rate limiting and have been removed.
4. Durable write before responding 2xx. A 2xx must mean "stored", not "received".
5. Sanitised logs — no full payload dumps containing phone numbers.
6. Notification routing to a named owner, with a failure path that is visible.

Personal data: kept in the page and the request only. Not written to `localStorage`, not sent to analytics. Every form should carry a line naming where the data goes (currently `securederp.in`) and link to a privacy policy — **that page does not exist yet**.

## 2. Event specification (implement once a property is authorised)

One stack only. Do not add a second tag manager or a duplicate GA4 tag.

| Event | Fires when | Parameters (no PII, ever) |
|---|---|---|
| `generate_lead` | the endpoint **accepted** the lead — once per `lead_id` | `lead_source`, `lead_page`, `lead_id` |
| `file_download` | a resource file is delivered | `file_name`, `lead_page` |
| `contact_click` | WhatsApp float / call link clicked | `method` (`whatsapp`\|`phone`), `lead_page` |
| `lead_delivery_error` | delivery failed | `reason` (`http_*`, `non_json_response`, `timeout`, `network_error`), `lead_source` — **never** the form values |
| `qualify_lead` | **CRM-side**, after a human qualifies the lead | `lead_id`, `qualification` |
| `demo_scheduled` / `demo_attended` | CRM status change | `lead_id` |
| `pilot_paid` / `subscription_won` | accounting record | `lead_id`, value from the **actual invoice** |

Rules: never send names, phone numbers, emails, BOQ text or free-text answers to GA4/GTM — not as parameters, not in URLs. Never assign an invented monetary value to a lead. A WhatsApp or call click and a download are **interactions**, not enquiries and not revenue. One accepted lead = one `generate_lead`. `qualify_lead` fires on real qualification only, never on a page view.

Attribution: `referrer` and `landingSearch` travel with the lead itself, so source survives in the CRM even when analytics consent is declined. Preserve first-touch and last-touch per your consent and retention policy.

## 3. Weekly dashboard specification

One page, in whatever tool has authorised data (Looker Studio over GA4 + a CRM export). Every row dated, every source named.

| Metric | Source | Definition guard |
|---|---|---|
| Non-brand impressions & clicks | GSC, branded queries excluded by an explicit regex kept in the doc | Report anonymised-query and incomplete-date limitations. GSC has no city dimension |
| Landing-page sessions | GA4 | Segment by landing page, not by session default channel alone |
| Accepted leads | `generate_lead` count **reconciled with the CRM count** | If they differ, the CRM is the ledger; investigate the gap |
| Lead delivery errors | `lead_delivery_error` by reason | A rise here means leads are being lost; alert on it |
| Demos scheduled / attended | CRM status | "Attended" means a human attended, not that a form was submitted |
| Paid pilots | Invoice raised | — |
| Won subscriptions | Signed + first payment | — |
| Collected revenue | Accounting, cash received | Never model it from lead counts |
| Source attribution | Lead record's `source` / `referrer` / `landingSearch` | Report unknowns as unknown |

Trend rules: compare the latest complete 28 days with the preceding 28, plus 90-day and year-on-year where the history exists. Never report a ranking position as a guarantee, and never promise indexing or a lead volume.

**Reports are not scheduled and no outreach is sent** — both need explicit authorisation.
