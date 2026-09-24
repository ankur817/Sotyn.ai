import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config/site.ts";

/**
 * lastmod = the date that page's source last changed in git, NOT build time.
 * A sitemap that stamps every URL on every deploy teaches crawlers to ignore
 * the field. Falls back to no lastmod when the date cannot be established.
 */
const lastmodCache = new Map();
function lastmodFor(pathname) {
  const clean = pathname.replace(/^\/|\/$/g, "");
  if (lastmodCache.has(clean)) return lastmodCache.get(clean);
  const parts = clean ? clean.split("/") : [];
  const candidates = clean
    ? [
        `src/pages/${clean}.astro`,
        `src/pages/${clean}/index.astro`,
        // Dynamic routes: the page's content lives in its template, so that
        // file's history is the honest last-modified date.
        ...(parts.length >= 2
          ? [
              `src/pages/${parts.slice(0, -1).join("/")}/[slug].astro`,
              `src/pages/${parts.slice(0, -1).join("/")}/[district].astro`,
              `src/pages/${parts[0]}/[${parts[1]}]/[district].astro`,
              `src/pages/${parts[0]}/[state]/index.astro`,
            ]
          : []),
      ]
    : ["src/pages/index.astro"];
  let iso;
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { encoding: "utf8" }).trim();
      if (out) iso = out;
    } catch {
      /* not a git checkout (e.g. a shallow CI clone) — omit lastmod */
    }
    if (iso) break;
  }
  lastmodCache.set(clean, iso);
  return iso;
}

// https://astro.build
export default defineConfig({
  site: SITE.url,
  integrations: [
    sitemap({
      // Pages that are intentionally noindex must not be advertised in the sitemap.
      filter: (page) => !/\/(thank-you|social-kit)\/?$/.test(new URL(page).pathname),
      // Vercel serves one canonical address per page (cleanUrls, no trailing
      // slash), so the sitemap must list that exact address — not a redirect.
      serialize: (item) => {
        const url = item.url.replace(/(.+)\/$/, "$1");
        const lastmod = lastmodFor(new URL(url).pathname);
        return lastmod ? { ...item, url, lastmod } : { ...item, url };
      },
    }),
  ],
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
});
