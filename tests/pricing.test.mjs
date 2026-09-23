import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// site.ts is TypeScript-flavoured but value-only; read the literals we assert on.
const src = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");

function num(str) {
  return Number(String(str).replace(/[^0-9]/g, ""));
}
function grabAll(re) {
  return [...src.matchAll(re)].map((m) => m[1]);
}

const annualInr = grabAll(/annualInr:\s*(\d+)/g).map(Number);
const billed = grabAll(/billed:\s*"([^"]+)"/g);
const monthly = grabAll(/\n\s+price:\s*"([\d,]+)"/g);

test("every plan carries a machine-readable annual price", () => {
  assert.equal(annualInr.length, 3, "expected 3 plans with annualInr");
});

test("the displayed 'billed yearly' string matches the machine-readable price", () => {
  // Starter and Growth quote a yearly figure; Enterprise is "custom quote".
  assert.equal(num(billed[0]), annualInr[0]);
  assert.equal(num(billed[1]), annualInr[1]);
});

test("monthly × 12 equals the yearly figure shown on the same card", () => {
  assert.equal(num(monthly[0]) * 12, annualInr[0]);
  assert.equal(num(monthly[1]) * 12, annualInr[1]);
});

test("the structured-data range matches the cheapest and dearest plan", () => {
  const low = Number(src.match(/annualLowInr:\s*(\d+)/)[1]);
  const high = Number(src.match(/annualHighInr:\s*(\d+)/)[1]);
  assert.equal(low, Math.min(...annualInr));
  assert.equal(high, Math.max(...annualInr));
});

test("the app is never advertised as free in structured data", () => {
  const layout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
  assert.ok(!/price:\s*"0"/.test(layout), 'SoftwareApplication must not carry price "0"');
  assert.ok(/AggregateOffer/.test(layout));
});

test("the sales telephone is not double-prefixed", () => {
  const layout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
  assert.ok(!/telephone:\s*`\+\$\{SITE\.phoneHref\}`/.test(layout), "produces ++91…");
  const phoneHref = src.match(/phoneHref:\s*"([^"]+)"/)[1];
  assert.ok(phoneHref.startsWith("+") && !phoneHref.startsWith("++"), phoneHref);
});

test("scarcity and countdown stay off until they describe something real", () => {
  assert.match(src, /countdown:\s*\{\s*enabled:\s*false/s);
  assert.match(src, /showSeatsLeft:\s*false/);
});

test("the canonical host is the host that serves the site", () => {
  assert.match(src, /url:\s*"https:\/\/www\.sotyn\.ai"/);
  const robots = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.ok(robots.includes("https://www.sotyn.ai/sitemap-index.xml"), robots);
});
