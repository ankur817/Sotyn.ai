import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { CHECKLISTS, countChecks } from "../src/data/checklists.js";

const dist = new URL("../dist/", import.meta.url);
const page = (slug) => readFileSync(new URL(`resources/${slug}/index.html`, dist), "utf8");
const file = (name) => readFileSync(new URL(`downloads/${name}`, dist), "utf8");

for (const c of Object.values(CHECKLISTS)) {
  test(`${c.slug}: the promised file actually exists and is usable`, () => {
    const f = new URL(`downloads/${c.file}`, dist);
    assert.ok(existsSync(f), `${c.file} was never generated — a download promise with no file is worse than no download`);
    const body = file(c.file);
    assert.ok(body.length > 3000, `${c.file} is too thin to be useful (${body.length} bytes)`);
    assert.match(body, /Done \(Y\/N\),Owner,Date,Notes/, "the file must be fillable, not just readable");
  });

  test(`${c.slug}: every check on the page is in the file, and vice versa`, () => {
    const body = file(c.file);
    const html = page(c.slug);
    for (const g of c.groups) {
      for (const item of g.items) {
        const first = item.check.split(" ").slice(0, 6).join(" ");
        assert.ok(body.includes(first), `file is missing: ${first}`);
        // The page escapes entities, so compare on letters.
        const flat = (t) => t.replace(/&#?\w+;/g, " ").replace(/[^a-z0-9]+/gi, " ").toLowerCase();
        assert.ok(flat(html).includes(flat(first)), `page is missing: ${first}`);
      }
    }
  });

  test(`${c.slug}: the whole checklist is readable without giving an email`, () => {
    const html = page(c.slug);
    const beforeForm = html.split("leadForm")[0];
    const last = c.groups.at(-1).items.at(-1).check.split(" ").slice(0, 5).join(" ");
    const flat = (t) => t.replace(/&#?\w+;/g, " ").replace(/[^a-z0-9]+/gi, " ").toLowerCase();
    assert.ok(flat(beforeForm).includes(flat(last)), "the final check must appear before any form — no gating");
    assert.match(html, /no sign-up/i);
  });

  test(`${c.slug}: links to its workflow page and a contextual demo`, () => {
    const html = page(c.slug);
    assert.ok(html.includes(`href="${c.workflow.href}"`), "no link to the workflow it supports");
    assert.ok(html.includes(`/demo?from=${c.demoFrom}`), "the demo CTA must carry the context");
    assert.ok(html.includes(`/downloads/${c.file}`), "the download link is missing from the page");
  });

  test(`${c.slug}: every check explains why it matters and what to look at`, () => {
    for (const g of c.groups) {
      for (const item of g.items) {
        assert.ok(item.why && item.why.length > 40, `${item.check}: no reason given`);
        assert.ok(item.look && item.look.length > 15, `${item.check}: nothing to look at`);
      }
    }
  });

  test(`${c.slug}: sample data is labelled as sample data`, () => {
    assert.match(c.example.intro, /illustrative|sample/i, "a worked example must say it is not a customer record");
  });

  test(`${c.slug}: is reachable from the resources hub`, () => {
    const hub = readFileSync(new URL("resources/index.html", dist), "utf8");
    assert.ok(hub.includes(`/resources/${c.slug}`), "orphaned resource");
  });
}

test("the three checklists cover the three workflow pages", () => {
  const targets = Object.values(CHECKLISTS).map((c) => c.workflow.href).sort();
  assert.deepEqual(targets, [
    "/construction-erp-implementation",
    "/construction-procurement-software",
    "/subcontractor-billing-software",
  ]);
});

test("checklists are substantial, not a landing page with five bullets", () => {
  for (const c of Object.values(CHECKLISTS)) {
    assert.ok(countChecks(c) >= 15, `${c.slug}: only ${countChecks(c)} checks`);
    assert.ok(c.howToUse.length >= 3, `${c.slug}: no instructions for use`);
  }
});

test("no checklist claims a capability that is not shipping", () => {
  for (const c of Object.values(CHECKLISTS)) {
    const all = JSON.stringify(c).toLowerCase();
    for (const unshipped of ["auto-quotation", "geofenc", "app store", "google play"]) {
      assert.ok(!all.includes(unshipped), `${c.slug} leans on an unreleased capability: ${unshipped}`);
    }
  }
});
