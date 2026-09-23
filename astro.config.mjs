import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config/site.ts";

// https://astro.build
export default defineConfig({
  site: SITE.url,
  integrations: [
    sitemap({
      // Pages that are intentionally noindex must not be advertised in the sitemap.
      filter: (page) => !/\/(thank-you|social-kit)\/?$/.test(new URL(page).pathname),
      // Vercel serves one canonical address per page (cleanUrls, no trailing
      // slash), so the sitemap must list that exact address — not a redirect.
      serialize: (item) => ({ ...item, url: item.url.replace(/(.+)\/$/, "$1") }),
    }),
  ],
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
});
