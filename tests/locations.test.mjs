import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const registryPath = new URL("../src/data/locations/districts.json", import.meta.url);
const pubPath = new URL("../src/data/locations/publication.json", import.meta.url);
const hasRegistry = existsSync(registryPath);
const registry = hasRegistry ? JSON.parse(readFileSync(registryPath, "utf8")) : { states: [] };
const publication = JSON.parse(readFileSync(pubPath, "utf8"));
const states = registry.states || [];
const districts = states.flatMap((s) => (s.districts || []).map((d) => ({ ...d, state: s })));
const approved = (publication.records || []).filter((r) => r.status === "approved");

// ── Registry integrity ──────────────────────────────────────────────────────
test("the registry exists and declares its source snapshot", () => {
  assert.ok(hasRegistry, "districts.json missing — the registry is the foundation of this system");
  for (const field of ["retrieved", "primary_source", "completeness"]) {
    assert.ok(registry.snapshot?.[field], `snapshot.${field} must be stated, so coverage claims are checkable`);
  }
});

test("every district carries an official code, a state and a source", () => {
  assert.ok(districts.length > 0, "no districts loaded");
  for (const d of districts) {
    assert.ok(d.district_code, `${d.district_name}: no district_code`);
    assert.ok(d.district_name, "district without a name");
    assert.ok(d.district_slug, `${d.district_name}: no slug`);
    assert.ok(d.state.state_code && d.state.state_slug, `${d.district_name}: state not resolved`);
    assert.ok(d.source_url, `${d.district_name}: no source_url — provenance is not optional`);
    assert.ok(["official", "cross-checked", "unverified-mirror"].includes(d.geo_confidence), `${d.district_name}: bad geo_confidence "${d.geo_confidence}"`);
  }
});

test("district codes are unique — codes are the identity, names are not", () => {
  const seen = new Map();
  for (const d of districts) {
    const prev = seen.get(d.district_code);
    assert.ok(!prev, `duplicate code ${d.district_code}: ${prev} and ${d.district_name}`);
    seen.set(d.district_code, d.district_name);
  }
});

test("slugs are URL-safe and unique within their state", () => {
  for (const s of states) {
    const seen = new Set();
    for (const d of s.districts || []) {
      assert.match(d.district_slug, /^[a-z0-9-]+$/, `${d.district_name}: slug not URL-safe`);
      assert.ok(!seen.has(d.district_slug), `${s.state_name}: slug collision on ${d.district_slug}`);
      seen.add(d.district_slug);
    }
    assert.match(s.state_slug, /^[a-z0-9-]+$/, `${s.state_name}: state slug not URL-safe`);
  }
});

test("duplicate district names across states are allowed but resolvable", () => {
  const byName = new Map();
  for (const d of districts) {
    const key = d.district_slug;
    byName.set(key, [...(byName.get(key) || []), `${d.state.state_slug}/${d.district_slug}`]);
  }
  for (const [slug, paths] of byName) {
    if (paths.length > 1) {
      // The same district name in two states is normal; the URLs must still differ.
      assert.equal(new Set(paths).size, paths.length, `${slug}: identical URLs for different districts`);
    }
  }
});

test("inactive districts exist in the registry but never become pages", () => {
  const inactive = districts.filter((d) => d.status && d.status !== "active");
  for (const d of inactive) {
    const rec = approved.find((r) => r.district_code === d.district_code);
    assert.ok(!rec, `${d.district_name} is ${d.status} but has an approved page record`);
  }
});

// ── Publication gate ────────────────────────────────────────────────────────
test("every approved page record resolves to a real district", () => {
  for (const r of approved) {
    const d = districts.find((x) => x.district_code === r.district_code);
    assert.ok(d, `approved record ${r.district_code} (${r.district_name}) is not in the registry`);
  }
});

test("an approved page must state WHY it exists and carry evidence", () => {
  for (const r of approved) {
    assert.ok(r.reason_page_exists && r.reason_page_exists.length > 40, `${r.district_name}: no district-specific reason`);
    assert.ok(Array.isArray(r.evidence) && r.evidence.length > 0, `${r.district_name}: no evidence`);
    assert.ok(["remote", "remote+visits", "on-site team"].includes(r.delivery_mode), `${r.district_name}: delivery_mode must be a real arrangement`);
    assert.ok(r.approved_by, `${r.district_name}: local claims need a named approver`);
  }
});

test("a reason that is really a ranking wish is rejected", () => {
  const banned = /\b(rank|ranking|seo|traffic|keyword|volume)\b/i;
  for (const r of approved) {
    assert.ok(!banned.test(r.reason_page_exists), `${r.district_name}: "${r.reason_page_exists}" is an SEO motive, not a buyer reason`);
  }
});

test("drafts record what is missing, and never generate a route", () => {
  for (const r of (publication.records || []).filter((x) => x.status !== "approved")) {
    assert.ok(r.blocker && r.blocker.length > 10, `${r.district_name}: a draft must say what is blocking it`);
  }
});

// ── Built output: coverage vs published pages ───────────────────────────────
const distDir = new URL("../dist/", import.meta.url);
const built = (p) => {
  const f = new URL(`${p.replace(/^\//, "")}/index.html`, distDir);
  return existsSync(f) ? readFileSync(f, "utf8") : null;
};

test("the India hub is built and lists every district as crawlable text", { skip: !existsSync(distDir) }, () => {
  const html = built("/locations");
  assert.ok(html, "/locations was not built");
  // Sampling: the hub must contain the district names themselves, not a JS-only list.
  for (const d of districts.slice(0, 25)) {
    assert.ok(html.includes(d.district_name), `${d.district_name} missing from the coverage hub HTML`);
  }
  assert.ok(html.includes("not a directory of contractors") || html.includes("not a directory"), "the hub must say it is software, not a contractor directory");
});

test("no district page is built without an approved record", { skip: !existsSync(distDir) }, () => {
  for (const d of districts) {
    const html = built(`/locations/${d.state.state_slug}/${d.district_slug}`);
    const isApproved = approved.some((r) => r.district_code === d.district_code);
    if (!isApproved) assert.equal(html, null, `${d.district_name} has a page but no approved record`);
  }
});

test("published district pages carry their own canonical and a real reason", { skip: !existsSync(distDir) }, () => {
  for (const r of approved) {
    const d = districts.find((x) => x.district_code === r.district_code);
    const path = `/locations/${d.state.state_slug}/${d.district_slug}`;
    const html = built(path);
    assert.ok(html, `${path} not built`);
    assert.ok(html.includes(`rel="canonical" href="https://www.sotyn.ai${path}"`), `${path}: wrong canonical`);
    // Compare on letters only: the page HTML-escapes apostrophes and dashes.
    const flat = (t) => t.replace(/&#?\w+;/g, " ").replace(/[^a-z0-9]+/gi, " ").toLowerCase();
    assert.ok(flat(html).includes(flat(r.reason_page_exists).slice(0, 60)), `${path}: the approved reason is not visible on the page`);
    assert.ok(!/LocalBusiness/.test(html), `${path}: LocalBusiness schema implies an office that does not exist`);
    assert.ok(!/aggregateRating|"Review"/.test(html), `${path}: invented rating markup`);
  }
});

test("district pages differ from each other by more than the district name", { skip: !existsSync(distDir) }, () => {
  const bodies = approved
    .map((r) => {
      const d = districts.find((x) => x.district_code === r.district_code);
      const html = built(`/locations/${d.state.state_slug}/${d.district_slug}`);
      if (!html) return null;
      // Strip nav/footer, then the district and state names, then compare.
      const main = (html.split("<main")[1] || "").split("</main>")[0]
        .replace(/<[^>]+>/g, " ")
        .replace(new RegExp(d.district_name, "gi"), "")
        .replace(new RegExp(d.state.state_name, "gi"), "")
        .replace(/\s+/g, " ")
        .trim();
      return { name: d.district_name, main };
    })
    .filter(Boolean);

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = new Set(bodies[i].main.split(" "));
      const b = new Set(bodies[j].main.split(" "));
      const shared = [...a].filter((w) => b.has(w)).length;
      const similarity = shared / Math.max(a.size, b.size);
      assert.ok(
        similarity < 0.92,
        `${bodies[i].name} and ${bodies[j].name} are ${Math.round(similarity * 100)}% identical once the place names are removed — that is a name-swap, not a page`
      );
    }
  }
});

test("state hubs exist only where a district page does", { skip: !existsSync(distDir) }, () => {
  const withPages = new Set(approved.map((r) => districts.find((d) => d.district_code === r.district_code)?.state.state_slug));
  for (const s of states) {
    const html = built(`/locations/${s.state_slug}`);
    if (!withPages.has(s.state_slug)) {
      assert.equal(html, null, `${s.state_name} has a hub with no published district — an empty page built for search engines`);
    }
  }
});

// ── Lead context ────────────────────────────────────────────────────────────
test("a district supplied in a query string is validated against the registry", { skip: !existsSync(new URL("../src/data/locations/lookup.js", import.meta.url)) }, async () => {
  const { lookupLocation } = await import("../src/data/locations/lookup.js");
  assert.equal(lookupLocation("../../etc", "passwd"), null);
  assert.equal(lookupLocation("punjab", "not-a-district"), null);
  assert.equal(lookupLocation("", ""), null);
  const sample = districts[0];
  const hit = lookupLocation(sample.state.state_slug, sample.district_slug);
  assert.ok(hit, "a genuine district must resolve");
  assert.equal(hit.district_code, sample.district_code);
});

test("the sheet keeps the page location separate from the visitor's own city", async () => {
  const { LEAD_COLUMNS, toSheetRow } = await import("../src/lib/lead-server.js");
  assert.ok(LEAD_COLUMNS.includes("City"), "the visitor's own city must stay its own column");
  assert.ok(LEAD_COLUMNS.includes("Location page district"), "the page they read must be recorded separately");
  // New columns must be appended, or staff formulas and the Apps Script break.
  assert.equal(LEAD_COLUMNS[LEAD_COLUMNS.length - 3], "Location page state");
  assert.equal(LEAD_COLUMNS.indexOf("Submission ID"), LEAD_COLUMNS.length - 4);
  const row = toSheetRow({
    leadId: "X", lead: { name: "A", phone: "9", intent: "demo_request", city: "Amritsar" },
    receivedAt: "t", utm: {}, pageLocation: { state_name: "Punjab", district_name: "Ludhiana", district_code: "034" },
  });
  assert.equal(row[LEAD_COLUMNS.indexOf("City")], "Amritsar", "the visitor's stated city wins");
  assert.equal(row[LEAD_COLUMNS.indexOf("Location page district")], "Ludhiana");
});
