import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Value-only TypeScript; assert on the literals, same approach as pricing.test.mjs.
const site = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
const layout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");

const ga4 = /ga4MeasurementId:\s*"([^"]*)"/.exec(site)?.[1];
const gtm = /gtmContainerId:\s*"([^"]*)"/.exec(site)?.[1];
const gscToken = /googleSiteVerification:\s*"([^"]*)"/.exec(site)?.[1];

test("the analytics slots exist in config", () => {
  assert.notEqual(ga4, undefined, "ga4MeasurementId missing from SITE.analytics");
  assert.notEqual(gtm, undefined, "gtmContainerId missing from SITE.analytics");
});

// docs/lead-and-analytics-spec.md §2: "One stack only. Do not add a second tag
// manager or a duplicate GA4 tag." Two tags double-count every pageview.
test("never both GA4 and GTM at once — one stack only", () => {
  assert.ok(!(ga4 && gtm), "set ga4MeasurementId OR gtmContainerId, never both");
});

test("a set GA4 id looks like a measurement id", () => {
  if (ga4) assert.match(ga4, /^G-[A-Z0-9]{6,}$/, `not a GA4 measurement id: ${ga4}`);
});

test("a set GTM id looks like a container id", () => {
  if (gtm) assert.match(gtm, /^GTM-[A-Z0-9]{5,}$/, `not a GTM container id: ${gtm}`);
});

test("a set GSC token is the bare token, not the whole meta tag", () => {
  if (gscToken) {
    assert.ok(!/[<>]/.test(gscToken), "paste only the content=\"...\" value, not the tag");
    assert.ok(
      !gscToken.startsWith("google-site-verification="),
      "drop the 'google-site-verification=' prefix — that form is for the DNS TXT record"
    );
  }
});

test("the layout refuses both stacks at build time", () => {
  assert.match(layout, /if \(ga4 && gtm\)/, "BaseLayout lost its one-stack guard");
});

test("analytics only loads when configured — nothing fires by default", () => {
  assert.match(layout, /\{ga4 &&/, "GA4 script is not gated on the config value");
  assert.match(layout, /\{gtmInline &&/, "GTM script is not gated on the config value");
});

test("no PII is passed to the tag (spec §2 forbids it)", () => {
  const inline = /const gaInline[\s\S]*?: "";/.exec(layout)?.[0] ?? "";
  for (const bad of ["phone", "email", "name", "company"]) {
    assert.ok(!inline.includes(bad), `gtag config must not reference ${bad}`);
  }
});
