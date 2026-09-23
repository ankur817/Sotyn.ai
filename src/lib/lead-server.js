/**
 * Server-side lead helpers — pure functions, unit-tested in tests/lead-server.test.mjs
 * and used by api/lead.js. Nothing here touches the network.
 */

const MAX = { name: 120, company: 160, phone: 20, email: 160, city: 80, trade: 80, team: 40, context: 2000, requirement: 2000 };

/** Deterministic, human-readable id: SOTYN-YYYYMMDD-XXXXXX (IST date). */
export function makeLeadId(now = new Date(), rand = Math.random) {
  const ist = istParts(now);
  const suffix = Math.floor(rand() * 36 ** 6)
    .toString(36)
    .toUpperCase()
    .padStart(6, "0");
  return `SOTYN-${ist.y}${ist.mo}${ist.d}-${suffix}`;
}

function istParts(date) {
  // IST is a fixed +05:30 offset — no DST, so this is exact.
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return {
    y: ist.getUTCFullYear(),
    mo: p(ist.getUTCMonth() + 1),
    d: p(ist.getUTCDate()),
    h: p(ist.getUTCHours()),
    mi: p(ist.getUTCMinutes()),
    s: p(ist.getUTCSeconds()),
  };
}

/** "2026-09-23 15:42:07 IST" — what sales reads in the sheet. */
export function istTimestamp(date = new Date()) {
  const t = istParts(date);
  return `${t.y}-${t.mo}-${t.d} ${t.h}:${t.mi}:${t.s} IST`;
}

/**
 * Neutralise spreadsheet formula injection. A visitor-supplied value starting
 * with = + - @ (or a leading tab/CR, which Sheets strips before parsing) would
 * otherwise execute when the sheet is opened.
 */
export function safeCell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value).replace(/\r\n?/g, "\n");
  return /^[=+\-@\t\n]/.test(s) ? `'${s}` : s;
}

/** Phone must survive as text: no 9,999,999,999 and no dropped leading zero. */
export function phoneCell(value) {
  const s = String(value ?? "").trim();
  return s ? `'${s}` : "";
}

export function clamp(value, max) {
  const s = String(value ?? "").trim();
  return s.length > max ? s.slice(0, max) : s;
}

const INTENTS = new Set(["demo_request", "diagnostic_request", "webinar_registration", "resource_request", "pilot_enquiry"]);

/**
 * Server-side validation — the browser's checks are a convenience, this is the
 * real gate. Returns { ok, errors, lead } with everything already clamped.
 */
export function validateLead(body = {}) {
  const errors = [];
  if (body.website || body.website_hp) errors.push("honeypot"); // silent bot
  const name = clamp(body.name, MAX.name);
  const phone = clamp(body.phone, MAX.phone);
  if (!name) errors.push("name_required");
  if (!phone) errors.push("phone_required");
  else if (!/^[0-9+\-() ]{8,20}$/.test(phone)) errors.push("phone_invalid");
  const email = clamp(body.email, MAX.email);
  if (email && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) errors.push("email_invalid");
  const intent = INTENTS.has(body.intent) ? body.intent : "resource_request";

  return {
    ok: errors.length === 0,
    errors,
    lead: {
      name,
      phone,
      email,
      company: clamp(body.company, MAX.company),
      city: clamp(body.city, MAX.city),
      trade: clamp(body.trade, MAX.trade),
      team: clamp(body.team, MAX.team),
      turnover: clamp(body.turnover, MAX.team),
      intent,
      placement: clamp(body.placement, MAX.trade),
      source: clamp(body.source, MAX.trade),
      event: intent === "webinar_registration" ? clamp(body.event, MAX.company) : "",
      context: clamp(body.context, MAX.context),
      magnet: clamp(body.magnet, MAX.trade),
      page: clamp(body.page, MAX.city),
      referrer: clamp(body.referrer, MAX.context),
      landingSearch: clamp(body.landingSearch, MAX.context),
      requestId: clamp(body.requestId, 80),
      isTest: body.is_test === true || /SOTYN WEBSITE TEST/i.test(name),
    },
  };
}

/** Only permitted campaign parameters are kept — never arbitrary query strings. */
export function utmFrom(search = "") {
  const out = { utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" };
  try {
    const params = new URLSearchParams(String(search).replace(/^\?/, ""));
    for (const key of Object.keys(out)) out[key] = clamp(params.get(key) || "", 120);
    if (!out.utm_source && params.get("gclid")) out.utm_source = "google-ads";
  } catch {
    /* ignore a malformed query string */
  }
  return out;
}

/** Plain-language source when no UTM is present. */
export function acquisitionSource(referrer = "", utm = {}) {
  if (utm.utm_source) return utm.utm_source;
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (/(^|\.)google\./.test(host)) return "google-organic";
    if (/(^|\.)bing\./.test(host)) return "bing-organic";
    if (/facebook|instagram|fb\.me/.test(host)) return "meta";
    if (/linkedin/.test(host)) return "linkedin";
    if (/sotyn\.ai$/.test(host)) return "internal";
    return host;
  } catch {
    return "unknown";
  }
}

/** Human label for the sheet's "Enquiry type" column. */
export const ENQUIRY_LABEL = {
  demo_request: "Demo request",
  diagnostic_request: "Diagnostic (scorecard)",
  webinar_registration: "Webinar registration",
  resource_request: "Resource / download",
  pilot_enquiry: "Paid pilot enquiry",
};

/** The exact column order of the Leads tab. Changing this is a schema change. */
export const LEAD_COLUMNS = [
  "Lead ID", "Received (IST)", "Name", "Company", "Phone", "Email", "City", "State", "Trade",
  "Enquiry type", "Requirement", "Landing page", "Submission page", "Form ID", "Acquisition source",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "Calculator/resource context",
  "Status", "Assigned owner", "Next follow-up", "Demo status", "Qualification", "ERP reference",
  "ERP sync", "Sheet sync", "Consent", "Is test", "Submission ID",
];

/** Build the row exactly as the Leads tab expects it. */
export function toSheetRow({ leadId, lead, receivedAt, utm, erpRef = "", erpSync = "pending", owner = "" }) {
  const label = ENQUIRY_LABEL[lead.intent] || lead.intent;
  const requirement = [lead.team && `Team: ${lead.team}`, lead.turnover && `Turnover: ${lead.turnover}`, lead.event && `Event: ${lead.event}`]
    .filter(Boolean)
    .join(" · ");
  return [
    leadId,
    receivedAt,
    safeCell(lead.name),
    safeCell(lead.company),
    phoneCell(lead.phone),
    safeCell(lead.email),
    safeCell(lead.city),
    "", // State — filled by sales, or later from the city registry
    safeCell(lead.trade),
    label,
    safeCell(requirement),
    safeCell(lead.referrer),
    safeCell(lead.page),
    safeCell(lead.placement || lead.source),
    acquisitionSource(lead.referrer, utm),
    safeCell(utm.utm_source),
    safeCell(utm.utm_medium),
    safeCell(utm.utm_campaign),
    safeCell(utm.utm_term),
    safeCell(utm.utm_content),
    safeCell(lead.context || lead.magnet),
    lead.isTest ? "Test" : "New",
    owner,
    "", // Next follow-up
    lead.intent === "demo_request" ? "Requested" : "",
    "", // Qualification
    safeCell(erpRef),
    erpSync,
    "ok",
    "Submitted via website form",
    lead.isTest ? "TRUE" : "FALSE",
    safeCell(lead.requestId),
  ];
}
