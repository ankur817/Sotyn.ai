import test from "node:test";
import assert from "node:assert/strict";
import { readAcceptance, waLink, submitLead, newRequestId } from "../src/lib/lead-client.js";

const jsonHeaders = { get: (k) => (k.toLowerCase() === "content-type" ? "application/json; charset=utf-8" : null) };
const htmlHeaders = { get: (k) => (k.toLowerCase() === "content-type" ? "text/html; charset=utf-8" : null) };

test("accepts a JSON 200 and returns the lead id", () => {
  const r = readAcceptance({ ok: true, status: 200, headers: jsonHeaders }, '{"ok":true,"id":"LEAD-42"}');
  assert.equal(r.accepted, true);
  assert.equal(r.leadId, "LEAD-42");
});

test("an HTTP 200 carrying HTML is NOT an accepted lead", () => {
  const r = readAcceptance({ ok: true, status: 200, headers: htmlHeaders }, "<!doctype html><title>Home</title>");
  assert.equal(r.accepted, false);
  assert.equal(r.reason, "non_json_response");
});

test("a JSON body that reports an error is not accepted", () => {
  const r = readAcceptance({ ok: true, status: 200, headers: jsonHeaders }, '{"ok":false,"error":"invalid phone"}');
  assert.equal(r.accepted, false);
});

test("non-2xx is not accepted", () => {
  for (const status of [400, 403, 404, 429, 500, 502]) {
    const r = readAcceptance({ ok: false, status, headers: jsonHeaders }, "{}");
    assert.equal(r.accepted, false, `status ${status}`);
  }
});

test("unparseable JSON is not accepted", () => {
  const r = readAcceptance({ ok: true, status: 200, headers: jsonHeaders }, "{not json");
  assert.equal(r.accepted, false);
  assert.equal(r.reason, "unparseable_json");
});

test("accepted without an id still counts, with a null id", () => {
  const r = readAcceptance({ ok: true, status: 201, headers: jsonHeaders }, "{}");
  assert.equal(r.accepted, true);
  assert.equal(r.leadId, null);
});

// ── WhatsApp link encoding: exactly once, and safe for real-world input ──────
test("newlines survive as real newlines, not literal %0A", () => {
  const url = waLink("917009987817", ["Demo request", "Name: A"]);
  assert.ok(url.includes("Demo%20request%0AName"), url);
  assert.ok(!url.includes("%250A"), "double-encoded newline");
  assert.ok(!url.includes("%2520"), "double-encoded space");
});

test("ampersand, hash and plus in user input are encoded exactly once", () => {
  const url = waLink("917009987817", ["Name: Sharma & Sons #2", "Phone: +91 70099 87817"]);
  assert.ok(url.includes("Sharma%20%26%20Sons%20%232"), url);
  assert.ok(url.includes("%2B91"), url);
  const query = url.split("?text=")[1];
  assert.equal(decodeURIComponent(query), "Name: Sharma & Sons #2\nPhone: +91 70099 87817");
});

test("Hindi and other Unicode round-trip", () => {
  const line = "Name: अंकुर कपलेश";
  const url = waLink("917009987817", [line]);
  assert.equal(decodeURIComponent(url.split("?text=")[1]), line);
});

test("empty lines are dropped so the message has no blank gaps", () => {
  const url = waLink("917009987817", ["A", "", null, "B"]);
  assert.equal(decodeURIComponent(url.split("?text=")[1]), "A\nB");
});

// ── submitLead: never throws, reports why ───────────────────────────────────
test("a network error resolves as not accepted", async () => {
  const r = await submitLead("https://example.invalid/hook", { name: "A" }, {
    requestId: "req-1",
    fetchImpl: () => Promise.reject(new TypeError("Failed to fetch")),
  });
  assert.deepEqual(r, { accepted: false, leadId: null, reason: "network_error" });
});

test("an HTML 200 from the endpoint resolves as not accepted", async () => {
  const r = await submitLead("https://example.test/hook", { name: "A" }, {
    requestId: "req-2",
    fetchImpl: async () => ({ ok: true, status: 200, headers: htmlHeaders, text: async () => "<html>ok</html>" }),
  });
  assert.equal(r.accepted, false);
  assert.equal(r.reason, "non_json_response");
});

test("the same requestId is sent so a retry cannot duplicate the lead", async () => {
  const seen = [];
  const fetchImpl = async (_url, init) => {
    seen.push(JSON.parse(init.body).requestId);
    return { ok: false, status: 500, headers: jsonHeaders, text: async () => "{}" };
  };
  await submitLead("https://example.test/hook", { name: "A" }, { requestId: "req-3", fetchImpl });
  await submitLead("https://example.test/hook", { name: "A" }, { requestId: "req-3", fetchImpl });
  assert.deepEqual(seen, ["req-3", "req-3"]);
});

test("a missing endpoint is reported, not silently treated as success", async () => {
  const r = await submitLead("", { name: "A" }, { requestId: "req-4" });
  assert.equal(r.accepted, false);
  assert.equal(r.reason, "no_endpoint");
});

test("only CORS-safelisted headers are sent, so no preflight can fail", async () => {
  // Regression: an X-Request-Id header was rejected by the endpoint's
  // Access-Control-Allow-Headers, blocking every live submission.
  let seen = null;
  await submitLead("https://example.test/hook", { name: "A" }, {
    requestId: "req-5",
    fetchImpl: async (_url, init) => {
      seen = init.headers;
      return { ok: true, status: 200, headers: jsonHeaders, text: async () => '{"ok":true}' };
    },
  });
  assert.deepEqual(Object.keys(seen), ["Content-Type"]);
});

test("the idempotency key still travels in the body", async () => {
  let body = null;
  await submitLead("https://example.test/hook", { name: "A" }, {
    requestId: "req-6",
    fetchImpl: async (_url, init) => {
      body = JSON.parse(init.body);
      return { ok: true, status: 200, headers: jsonHeaders, text: async () => '{"ok":true}' };
    },
  });
  assert.equal(body.requestId, "req-6");
});

test("request ids are unique", () => {
  const ids = new Set(Array.from({ length: 50 }, () => newRequestId()));
  assert.equal(ids.size, 50);
});
