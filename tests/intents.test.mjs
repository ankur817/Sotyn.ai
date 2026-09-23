import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { INTENTS, getIntent, intentPayload } from "../src/lib/lead-intents.js";
import { trackAcceptedLead } from "../src/lib/lead-client.js";

const read = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), "utf8");
const INTENT_NAMES = ["demo_request", "diagnostic_request", "webinar_registration", "resource_request", "pilot_enquiry"];

test("all five intents exist and describe their own promise", () => {
  for (const name of INTENT_NAMES) {
    const i = INTENTS[name];
    assert.ok(i, `missing intent ${name}`);
    for (const field of ["submit", "pending", "doneTitle", "doneBody", "note", "waIntro"]) {
      assert.ok(i[field] && i[field].length > 0, `${name}.${field}`);
    }
  }
});

test("only a webinar registration may carry an event name", () => {
  for (const name of INTENT_NAMES) {
    assert.equal(INTENTS[name].carriesEvent, name === "webinar_registration", name);
  }
});

test("a masterclass name cannot be attached to a non-event intent", () => {
  const p = intentPayload({
    intent: "diagnostic_request",
    placement: "scorecard-result",
    source: "scorecard",
    event: "Contractor's Profit Masterclass",
  });
  assert.equal(p.event, undefined);
  assert.equal(p.intent, "diagnostic_request");
  assert.equal(p.placement, "scorecard-result");
});

test("the webinar intent keeps its event name", () => {
  const p = intentPayload({
    intent: "webinar_registration",
    placement: "webinar-page",
    source: "webinar-page",
    event: "The EPC Contractor's Profit Masterclass",
  });
  assert.equal(p.event, "The EPC Contractor's Profit Masterclass");
});

test("`source` is preserved verbatim so the existing receiver keeps working", () => {
  assert.equal(intentPayload({ intent: "resource_request", placement: "x", source: "book-checklist" }).source, "book-checklist");
  // and never disappears when only a placement is known
  assert.equal(intentPayload({ intent: "demo_request", placement: "pricing-page" }).source, "pricing-page");
});

test("diagnostic context rides with the lead only when supplied", () => {
  assert.equal(intentPayload({ intent: "diagnostic_request", placement: "p" }).context, undefined);
  assert.equal(
    intentPayload({ intent: "diagnostic_request", placement: "p", context: "Leak score 62/100" }).context,
    "Leak score 62/100"
  );
});

test("an unknown intent degrades to the most neutral one, never throws", () => {
  assert.equal(getIntent("nonsense").intent, "resource_request");
  assert.equal(getIntent(undefined).intent, "resource_request");
});

// ── The scorecard defect this contract exists to prevent ────────────────────
test("/scorecard asks for a diagnostic, not a masterclass seat", () => {
  const page = read("pages/scorecard.astro");
  assert.match(page, /intent="diagnostic_request"/);
  assert.match(page, /placement="scorecard-result"/);
});

test("/scorecard fires no lead or pixel event when the score is computed", () => {
  const page = read("pages/scorecard.astro");
  assert.ok(!/fbq\(\s*["']track["']\s*,\s*["']Lead["']/.test(page), "pixel fired before any contact details were given");
  assert.match(page, /scorecard_completed/, "completing the scorecard should log an interaction instead");
});

test("the webinar page still declares its real event", () => {
  const page = read("pages/webinar.astro");
  assert.match(page, /intent="webinar_registration"/);
  assert.match(page, /event=\{w\.title\}/);
});

test("RegisterForm takes all its wording from the intent, none hard-coded", () => {
  const c = read("components/RegisterForm.astro");
  for (const hardcoded of ["Reserve my free seat", "Your seat is reserved", "joining link", "Contractor's Profit Masterclass"]) {
    assert.ok(!c.includes(hardcoded), `still hard-codes "${hardcoded}"`);
  }
  assert.match(c, /copy\.submit/);
  assert.match(c, /copy\.doneTitle/);
});

test("every form declares an intent", () => {
  const expected = {
    "components/DemoForm.astro": "demo_request",
    "components/LeadCapture.astro": "resource_request",
    "components/BookLeadMagnet.astro": "resource_request",
  };
  for (const [file, intent] of Object.entries(expected)) {
    const src = read(file);
    assert.ok(src.includes("intentPayload("), `${file} does not use the intent contract`);
    assert.ok(src.includes(`intent: "${intent}"`), `${file} should declare ${intent}`);
  }
});

// ── Tracking: one accepted lead is one event, and no PII ────────────────────
function fakeWindow() {
  const w = { dataLayer: [], fbqCalls: [] };
  w.fbq = (...args) => w.fbqCalls.push(args);
  globalThis.window = w;
  return w;
}

test("a retry or double-click cannot produce two conversion events", () => {
  const w = fakeWindow();
  const lead = { source: "demo-form", intent: "demo_request", page: "/demo", leadId: "LEAD-1" };
  assert.equal(trackAcceptedLead(lead), true);
  assert.equal(trackAcceptedLead(lead), false, "second call must be suppressed");
  assert.equal(w.dataLayer.filter((e) => e.event === "generate_lead").length, 1);
  assert.equal(w.fbqCalls.length, 1);
  delete globalThis.window;
});

test("the conversion event carries the intent and no personal data", () => {
  const w = fakeWindow();
  trackAcceptedLead({ source: "scorecard", intent: "diagnostic_request", page: "/scorecard", leadId: "LEAD-2" });
  const ev = w.dataLayer.find((e) => e.event === "generate_lead");
  assert.equal(ev.lead_intent, "diagnostic_request");
  const serialised = JSON.stringify(ev);
  for (const pii of ["name", "phone", "email", "company", "turnover", "context"]) {
    assert.ok(!serialised.includes(pii), `${pii} leaked into the dataLayer`);
  }
  delete globalThis.window;
});

test("two different leads still produce two events", () => {
  const w = fakeWindow();
  trackAcceptedLead({ source: "demo-form", intent: "demo_request", page: "/demo", leadId: "A" });
  trackAcceptedLead({ source: "demo-form", intent: "demo_request", page: "/demo", leadId: "B" });
  assert.equal(w.dataLayer.filter((e) => e.event === "generate_lead").length, 2);
  delete globalThis.window;
});

// ── Submission guards present in every form ─────────────────────────────────
test("a second submit while one is in flight is ignored (double-click)", () => {
  for (const file of ["components/DemoForm.astro", "components/LeadCapture.astro", "components/RegisterForm.astro", "components/BookLeadMagnet.astro"]) {
    const src = read(file);
    assert.match(src, /let sending = false/, `${file}: no in-flight guard`);
    assert.match(src, /if \(sending\) return;/, `${file}: does not ignore a concurrent submit`);
  }
});

test("no form depends on a popup opening, so a popup blocker cannot fake success", () => {
  for (const file of ["components/DemoForm.astro", "components/LeadCapture.astro", "components/RegisterForm.astro", "components/BookLeadMagnet.astro"]) {
    assert.ok(!read(file).includes("window.open("), `${file} still opens a popup`);
  }
});
