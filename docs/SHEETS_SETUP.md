# Turning on the Google Sheets lead register

The code is live. Two things are left, and both need accounts I don't have access to. Until they're done, `/api/lead` accepts leads, forwards them to the ERP and reports `sheet: "not_configured"` — nothing is lost, but no sheet row is written.

**Spreadsheet:** [SOTYN Website Leads](https://docs.google.com/spreadsheets/d/1RUuz2bdpzI--arBU2rkp1Rm_JUpTI7rMU77QE-aBmUc/edit) — owned by director@securedengineers.com, shared with dme@securedengineers.com as editor. It holds only website enquiries; no SEPL, PGAK or recruitment records.

## Step 1 — deploy the Apps Script (about three minutes, in the owner's Google account)

1. Open the sheet → **Extensions → Apps Script**.
2. Replace `Code.gs` with [`integrations/google-sheets/Code.gs`](../integrations/google-sheets/Code.gs) from this repo.
3. Change `TOKEN` at the top to a long random string. Keep a copy.
4. Run the `setup` function once and accept the authorisation prompt. It creates the **Leads**, **Dashboard** and **Sync Errors** tabs.
5. **Deploy → New deployment → Web app**: *Execute as* **Me**, *Who has access* **Anyone**. Copy the `/exec` URL.

"Anyone" only means the URL can be reached. Every request still has to carry the token, the script runs as you, and the spreadsheet itself stays private. No Google credential ever reaches a browser.

## Step 2 — two environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Value |
|---|---|
| `SHEETS_WEBAPP_URL` | the `/exec` URL from step 1 |
| `SHEETS_WEBAPP_TOKEN` | the `TOKEN` string from step 1 |

Optional: `LEAD_OWNER` (name written into "Assigned owner" on every new row) and `ERP_LEAD_URL` (defaults to the current endpoint). **Redeploy** after saving.

## Step 3 — confirm it works

```bash
curl -s -X POST https://www.sotyn.ai/api/lead -H 'Content-Type: application/json' -d '{"name":"SOTYN WEBSITE TEST — IGNORE","phone":"9999999999","company":"Setup check","intent":"demo_request","is_test":true}'
```

Expect `"sheet":"ok"` instead of `"not_configured"`, and a row in **Leads** with that Lead ID and `Is test = TRUE`. Delete the row afterwards if you like — the Dashboard already excludes test rows from every business total.

## How it behaves once on

- Every form — demo, pricing/pilot, scorecard diagnostic, resource downloads, webinar registration — posts to `/api/lead`, which writes the sheet **and** the ERP and records each destination's state separately.
- One row per Lead ID. Retries and double-clicks reconcile by Lead ID instead of appending again. Two genuine enquiries from the same person stay as two rows.
- If the sheet is unreachable, the ERP still accepts the lead and a row is written to **Sync Errors** with the reason, so nothing disappears.
- If both fail, the visitor sees the honest failure panel — never a false confirmation.
- Phone and WhatsApp clicks are **not** written here. They're interactions, not captured contacts, and they're tracked separately.

## Known limitation to decide on

The ERP endpoint de-duplicates by contact: three QA submissions with the same phone all returned `{"ok":true,"id":7,"duplicate":true}`. The sheet keeps them as separate rows (correct — a repeat enquiry is a real event), so the ERP reference column will repeat for genuine repeat enquiries. If you want them as distinct ERP records, that's a change on the `securederp.in` side.

A persistent retry queue for a long Sheets outage would need Vercel KV or similar. Today the function retries within the request and records the failure; it does not hold a queue across requests.
