import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (f) => readFileSync(new URL(`../src/components/${f}`, import.meta.url), "utf8");
const FORMS = ["DemoForm.astro", "LeadCapture.astro", "RegisterForm.astro", "BookLeadMagnet.astro"];

// Regressions for the defects found on 2026-09-23.
for (const file of FORMS) {
  const src = read(file);

  test(`${file}: delivery is decided by the shared contract, not by res.ok alone`, () => {
    assert.ok(src.includes("submitLead("), "must use the shared lead client");
    assert.ok(!/delivered\s*=\s*r(es)?\.ok/.test(src), "res.ok alone is not durable acceptance");
  });

  test(`${file}: success state is shown only inside the accepted branch`, () => {
    assert.ok(/result\.accepted/.test(src), "must branch on the acceptance result");
    // No unconditional reveal of the done state after the request.
    assert.ok(!/^\s*(form\.hidden = true; done\.hidden = false|done\.hidden = false);?\s*$/m.test(src.replace(/\n\s{6,}/g, "\n      ")) || /result\.accepted/.test(src));
  });

  test(`${file}: conversion events fire only after acceptance`, () => {
    // No bare fbq call outside the accepted branch.
    assert.ok(!/if \(window\.fbq\) window\.fbq\("track", "Lead"\)/.test(src), "pixel fired before the request");
    if (src.includes("trackAcceptedLead")) {
      const idx = src.indexOf("trackAcceptedLead(");
      const acceptedIdx = src.indexOf("result.accepted");
      assert.ok(acceptedIdx !== -1 && acceptedIdx < idx, "tracking must follow the acceptance check");
    }
  });

  test(`${file}: WhatsApp text is not hand-built with literal %0A`, () => {
    assert.ok(!src.includes("%0A"), "pre-encoded newlines get encoded a second time");
    assert.ok(!src.includes("%2520"), "double-encoding workaround");
  });

  test(`${file}: no auto-opened popup is treated as delivery`, () => {
    assert.ok(!/window\.open\(/.test(src), "a popup attempt is not proof of delivery");
  });
}

test("DemoForm: the browser-timing bot trap is gone", () => {
  const src = read("DemoForm.astro");
  assert.ok(!/3500/.test(src), "timing threshold silently rejected real people");
  assert.ok(!/Date\.now\(\) - loadTime/.test(src));
  assert.ok(src.includes('if (data.website) return;'), "honeypot must remain");
});

test("every form keeps a retry, a phone number and a labelled WhatsApp alternative on failure", () => {
  for (const file of ["DemoForm.astro", "LeadCapture.astro", "RegisterForm.astro"]) {
    const src = read(file);
    assert.ok(/Try again/.test(src), `${file}: no retry`);
    assert.ok(/telLink/.test(src), `${file}: no call option`);
    assert.ok(/WhatsApp instead/.test(src), `${file}: WhatsApp alternative must be labelled as such`);
  }
});

test("no form sends personal data to analytics", () => {
  const lib = readFileSync(new URL("../src/lib/lead-client.js", import.meta.url), "utf8");
  const pushed = lib.slice(lib.indexOf("dataLayer.push"), lib.indexOf("dataLayer.push") + 240);
  for (const field of ["name", "phone", "email", "company"]) {
    assert.ok(!new RegExp(`\\b${field}\\b`).test(pushed), `${field} must not be pushed to the dataLayer`);
  }
});
