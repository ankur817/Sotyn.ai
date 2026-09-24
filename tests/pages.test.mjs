import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";

// Asserts against the built output, so these are the pages that actually ship.
const dist = new URL("../dist/", import.meta.url);
const page = (route) => {
  const path = new URL(route === "/" ? "index.html" : `${route.replace(/^\//, "")}/index.html`, dist);
  assert.ok(existsSync(path), `${route} was not built`);
  return readFileSync(path, "utf8");
};
const titleOf = (html) => (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
const h1Of = (html) => (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, "").trim() || "";

const NEW_PAGES = [
  { route: "/construction-procurement-software", cta: "/demo?from=procurement", keyword: "procurement" },
  { route: "/subcontractor-billing-software", cta: "/demo?from=subcontractor-billing", keyword: "subcontractor" },
  { route: "/construction-erp-implementation", cta: "/demo?from=implementation", keyword: "implementation" },
];

for (const { route, cta, keyword } of NEW_PAGES) {
  test(`${route}: is built with a title, description, canonical and H1`, () => {
    const html = page(route);
    assert.ok(titleOf(html).length > 20, "title too thin");
    assert.match(html, /<meta name="description" content="[^"]{80,}"/);
    assert.ok(html.includes(`rel="canonical" href="https://www.sotyn.ai${route}"`), "wrong canonical");
    assert.ok(h1Of(html).length > 20, "H1 too thin");
  });

  test(`${route}: names the intent in the title and H1`, () => {
    const html = page(route);
    assert.match(titleOf(html).toLowerCase(), new RegExp(keyword));
    assert.match(h1Of(html).toLowerCase(), new RegExp(keyword));
  });

  test(`${route}: carries a worked example and a limitations section`, () => {
    const html = page(route);
    assert.match(html, /Worked example/, "no worked example");
    assert.match(html, /<table class="we"/, "worked example is not a table of steps");
    assert.match(html, /class="pp-limits"/, "no limitations list — a page must say what it does NOT do");
  });

  test(`${route}: the primary CTA matches the page and carries context`, () => {
    assert.ok(page(route).includes(`href="${cta}"`), `missing CTA to ${cta}`);
  });

  test(`${route}: is in the sitemap`, () => {
    const sitemap = readFileSync(new URL("sitemap-0.xml", dist), "utf8");
    assert.ok(sitemap.includes(`https://www.sotyn.ai${route}</loc>`), "not in the sitemap");
  });

  test(`${route}: is reachable from the site, not orphaned`, () => {
    // The footer renders on every page, so any built page proves the link exists.
    assert.ok(page("/pricing").includes(`href="${route}"`), "no inbound internal link");
  });
}

test("no two built pages share a title", () => {
  const seen = new Map();
  const walk = (dir, prefix = "") => {
    for (const entry of readdirSync(new URL(dir, dist), { withFileTypes: true })) {
      if (entry.isDirectory()) walk(`${dir}${entry.name}/`, `${prefix}${entry.name}/`);
      else if (entry.name === "index.html") {
        const t = titleOf(readFileSync(new URL(`${dir}${entry.name}`, dist), "utf8"));
        const route = `/${prefix}`;
        if (seen.has(t)) assert.fail(`duplicate title "${t}" on ${seen.get(t)} and ${route}`);
        seen.set(t, route);
      }
    }
  };
  walk("");
  assert.ok(seen.size > 35, `only ${seen.size} pages checked`);
});

test("the homepage, platform and EPC pages each claim a different intent", () => {
  const home = titleOf(page("/")).toLowerCase();
  const platform = titleOf(page("/platform")).toLowerCase();
  const epc = titleOf(page("/epc-erp-software")).toLowerCase();
  assert.match(home, /construction erp software/);
  assert.match(epc, /epc erp software/);
  assert.match(platform, /project management/);
  assert.notEqual(home, epc);
  assert.notEqual(home, platform);
});

test("workflow pages send visitors to a demo that knows where they came from", () => {
  assert.ok(page("/ra-billing-software").includes('href="/demo?from=ra-billing"'));
  assert.ok(page("/material-reconciliation").includes('href="/demo?from=material-reconciliation"'));
});

test("the demo form accepts only a short slug as context", () => {
  const src = readFileSync(new URL("../src/components/DemoForm.astro", import.meta.url), "utf8");
  assert.match(src, /\^\[a-z0-9-\]\{1,60\}\$/, "the ?from= and location values must be validated as slugs");
  assert.match(src, /FROM_LABELS/);
});

test("new pages link to their neighbours, so a buyer can move sideways", () => {
  assert.ok(page("/construction-procurement-software").includes("/subcontractor-billing-software"));
  assert.ok(page("/subcontractor-billing-software").includes("/ra-billing-software"));
  assert.ok(page("/construction-erp-implementation").includes("/pricing"));
});

test("the implementation page states the real onboarding fee, read from config", () => {
  const html = page("/construction-erp-implementation");
  const site = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
  const fees = [...site.matchAll(/fee:\s*"([\d,]+)"/g)].map((m) => m[1]);
  for (const fee of fees) assert.ok(html.includes(fee), `onboarding fee ${fee} missing from the page`);
});

test("no page claims a capability that is marked coming soon", () => {
  for (const { route } of NEW_PAGES) {
    // Body copy only — the sitewide footer legitimately says the native apps
    // are still coming.
    const html = page(route).split("<footer")[0].toLowerCase();
    for (const unshipped of ["auto-quotation", "geofenc", "app store", "google play"]) {
      assert.ok(!html.includes(unshipped), `${route} leans on an unreleased capability: ${unshipped}`);
    }
  }
});

// ── Internal linking: no orphans, no dead ends ──────────────────────────────
test("no indexable page is an orphan or a dead end", async () => {
  const { readdirSync, readFileSync, existsSync } = await import("node:fs");
  const pages = new Map();
  const walk = (dir, prefix = "") => {
    for (const e of readdirSync(new URL(dir, dist), { withFileTypes: true })) {
      if (e.isDirectory()) walk(`${dir}${e.name}/`, `${prefix}${e.name}/`);
      else if (e.name === "index.html") {
        const route = `/${prefix}`.replace(/\/$/, "") || "/";
        pages.set(route, readFileSync(new URL(`${dir}${e.name}`, dist), "utf8"));
      }
    }
  };
  walk("");
  const mainOf = (html) => (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || ["", ""])[1];
  const inbound = new Map(), outbound = new Map();
  for (const [route, html] of pages) {
    for (const m of mainOf(html).matchAll(/<a[^>]*href="(\/[^"#?]*)"/g)) {
      const target = m[1].replace(/\/$/, "") || "/";
      if (!pages.has(target) || target === route) continue;
      inbound.set(target, (inbound.get(target) || new Set()).add(route));
      outbound.set(route, (outbound.get(route) || new Set()).add(target));
    }
  }
  // Utility pages are deliberately orphaned; everything else must be reachable
  // from page content, not only from the nav.
  const utility = new Set(["/", "/thank-you", "/social-kit", "/404"]);
  const orphans = [...pages.keys()].filter((r) => !utility.has(r) && !inbound.has(r));
  const deadEnds = [...pages.keys()].filter((r) => !utility.has(r) && (outbound.get(r)?.size ?? 0) < 2);
  assert.deepEqual(orphans, [], `orphaned: ${orphans.join(", ")}`);
  assert.deepEqual(deadEnds, [], `dead ends: ${deadEnds.join(", ")}`);
});

test("links use descriptive anchor text", async () => {
  const { readFileSync } = await import("node:fs");
  const weak = /^(click here|read more|learn more|here|more|this page|link)$/i;
  for (const route of ["/", "/pricing", "/features", "/platform", "/demo"]) {
    const html = readFileSync(new URL(route === "/" ? "index.html" : `${route.slice(1)}/index.html`, dist), "utf8");
    const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || ["", ""])[1];
    for (const m of main.matchAll(/<a[^>]*href="\/[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
      const anchor = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      assert.ok(!weak.test(anchor), `${route}: weak anchor "${anchor}"`);
    }
  }
});
