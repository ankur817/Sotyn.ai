# SotynERP — Marketing Website

Lead-generation marketing site for **SotynERP**, the all-in-one ERP for MEPF, solar,
civil & EPC contractors across India — built and run by Secured Engineers Pvt. Ltd.

Built with **Astro** (static, fast, SEO-friendly). Same proven stack as the Secured
Engineers site, restyled as a modern SaaS product site in the ERP's royal-blue brand.

## Run it
```bash
npm install      # first time only
npm run dev      # local dev at http://localhost:4321
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## The one file to edit
`src/config/site.ts` — brand, phone, WhatsApp, email, domain, the customer login
URL (the live ERP) and the lead webhook all live there. Anything marked `⚠️ REPLACE`
still needs a real value.

## Leads
The demo form (`src/components/DemoForm.astro`) POSTs JSON to `SITE.leadWebhookUrl`.
When that's empty it falls back to a pre-filled **WhatsApp** message, so **no lead is
ever lost**. Plug your CRM/ERP lead webhook into that field when it's live.

Customer **Login** links to the live ERP at `SITE.appUrl` (https://securederp.in).

## Structure
- `src/pages/index.astro` — the whole homepage, built around the 4 money questions
  (losing money · leakage · issues · not growing), each mapped to real ERP modules.
- `src/pages/thank-you.astro` — post-submit page.
- `src/components/` — Header, Footer, DemoForm, WhatsAppFloat.
- `src/config/site.ts` — single source of truth.
- `src/styles/global.css` — SaaS design system (royal blue + amber money accent).

## SEO / AI-SEO built in
Per-page titles & meta · canonical · Open Graph + Twitter cards · auto sitemap ·
`robots.txt` welcoming Google + AI crawlers · JSON-LD `SoftwareApplication` + `FAQPage`.

## To do before launch (replace placeholders)
- [ ] Add a real `og-image.png` (1200×630) to `public/` — social share image.
- [ ] Set a dedicated `email` in `src/config/site.ts` (or keep the fallback inbox).
- [ ] Plug the CRM/ERP lead webhook into `leadWebhookUrl`.
- [ ] Point the **sotyn.ai** domain at the deployed site.

## Deploy (free)
Push to GitHub, connect to **Netlify** or **Vercel** (framework: Astro, build:
`npm run build`, output: `dist`). Or drag-and-drop the `dist/` folder onto Netlify.
Then point `sotyn.ai` DNS at it.
