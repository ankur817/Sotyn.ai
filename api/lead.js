/**
 * Single intake for every website enquiry (Vercel Serverless Function).
 *
 *   browser → POST /api/lead   (same origin: no CORS, no credentials in the page)
 *                ├─ Google Sheet  "SOTYN Website Leads"  ← the mandatory register
 *                └─ ERP webhook   securederp.in/api/public/sotyn-lead
 *
 * Environment (set in Vercel → Project → Settings → Environment Variables):
 *   SHEETS_WEBAPP_URL    Apps Script Web App URL (see integrations/google-sheets/Code.gs)
 *   SHEETS_WEBAPP_TOKEN  shared secret checked by that script
 *   ERP_LEAD_URL         optional; defaults to the current ERP endpoint
 *   LEAD_OWNER           optional; name written into "Assigned owner"
 *
 * Until SHEETS_WEBAPP_URL is set, the function still forwards to the ERP and
 * reports sheet: "not_configured" — so switching the forms here is safe and
 * never makes lead capture worse than it is today.
 *
 * "Accepted" means at least one durable store took the lead. If both fail we
 * return 502 and the form shows its honest failure panel.
 */
import {
  validateLead,
  makeLeadId,
  istTimestamp,
  utmFrom,
  toSheetRow,
} from "../src/lib/lead-server.js";
import { lookupLocation } from "../src/data/locations/lookup.js";

const ERP_DEFAULT = "https://securederp.in/api/public/sotyn-lead";

async function postJson(url, body, { timeoutMs = 8000, headers = {} } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
      redirect: "follow",
    });
    const text = await res.text().catch(() => "");
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* not json */
    }
    return { ok: res.ok, status: res.status, json, text: text.slice(0, 500) };
  } catch (err) {
    return { ok: false, status: 0, json: null, text: String(err && err.name === "AbortError" ? "timeout" : err) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Append to the sheet, reconciling by Lead ID before a retry so an ambiguous
 * timeout cannot produce two rows for one enquiry.
 */
async function appendToSheet(env, payload) {
  if (!env.SHEETS_WEBAPP_URL) return { state: "not_configured" };
  const call = (action, extra = {}) =>
    postJson(env.SHEETS_WEBAPP_URL, { action, token: env.SHEETS_WEBAPP_TOKEN, ...extra }, { timeoutMs: 10000 });

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      // Did the ambiguous attempt actually land?
      const check = await call("check", { leadId: payload.leadId, submissionId: payload.submissionId });
      if (check.ok && check.json && check.json.exists) return { state: "ok", reconciled: true };
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
    const res = await call("append", payload);
    if (res.ok && res.json && res.json.ok) return { state: "ok", row: res.json.row };
    // A permission or token error will not improve on retry.
    if (res.status === 401 || res.status === 403) return { state: "failed", reason: `auth_${res.status}` };
  }
  return { state: "failed", reason: "unreachable" };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const env = process.env;
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: "invalid_json" });
    }
  }
  body = body || {};

  const { ok, errors, lead } = validateLead(body);
  if (!ok) {
    // A honeypot hit looks like success to the bot and is never stored.
    if (errors.includes("honeypot")) return res.status(200).json({ ok: true, id: "ignored", sheet: "skipped", erp: "skipped" });
    return res.status(422).json({ ok: false, error: "validation_failed", fields: errors });
  }

  const leadId = makeLeadId();
  const receivedAt = istTimestamp();
  const utm = utmFrom(lead.landingSearch);

  // The location PAGE the visitor came from, resolved against the district
  // registry. A district name supplied in a query string is never trusted or
  // stored as text — only a registry hit is recorded, and it describes the page
  // viewed, not the visitor's own location (the form asks for that separately).
  const pageLocation = lookupLocation(body.page_state, body.page_district);

  // 1) ERP first — it is the system sales already works in.
  const erp = await postJson(env.ERP_LEAD_URL || ERP_DEFAULT, {
    ...lead,
    leadId,
    receivedAt,
    ...utm,
    pageDistrictCode: pageLocation ? pageLocation.district_code : "",
    pageStateCode: pageLocation ? pageLocation.state_code : "",
    submittedAt: new Date().toISOString(),
  });
  const erpAccepted = erp.ok && erp.json && erp.json.ok !== false;
  const erpRef = erpAccepted && erp.json ? String(erp.json.id ?? erp.json.leadId ?? "") : "";

  // 2) Google Sheet — the register sales follows up from.
  const sheet = await appendToSheet(env, {
    leadId,
    row: toSheetRow({
      leadId,
      lead,
      receivedAt,
      utm,
      erpRef,
      erpSync: erpAccepted ? "ok" : "failed",
      owner: env.LEAD_OWNER || "",
      pageLocation,
    }),
    isTest: lead.isTest,
    submissionId: lead.requestId || leadId,
  });

  // 3) A failure on either side is recorded, never silently dropped.
  if (sheet.state === "failed" || !erpAccepted) {
    await appendToSheet(env, {
      leadId,
      errorRow: [
        receivedAt,
        leadId,
        erpAccepted ? "sheet" : "erp",
        erpAccepted ? sheet.reason || "unknown" : `${erp.status}:${erp.text}`.slice(0, 200),
        "pending",
      ],
      sheetTab: "Sync Errors",
      submissionId: lead.requestId || leadId,
    }).catch(() => {});
  }

  const accepted = erpAccepted || sheet.state === "ok";
  if (!accepted) {
    return res.status(502).json({
      ok: false,
      error: "no_durable_store",
      erp: erp.status || "unreachable",
      sheet: sheet.state,
    });
  }

  return res.status(200).json({
    ok: true,
    id: leadId,
    leadId,
    erp: erpAccepted ? "ok" : "failed",
    erpRef: erpRef || undefined,
    sheet: sheet.state,
    isTest: lead.isTest || undefined,
  });
}
