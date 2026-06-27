/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SOTYNERP — SINGLE SOURCE OF TRUTH
 * ────────────────────────────────────────────────────────────────────────────
 *  The ERP that runs Secured Engineers Pvt. Ltd., now offered to contractors
 *  across India. Edit this one file for contact details, links, stats and
 *  lead routing. Anything marked  ⚠️ REPLACE  still needs a real value.
 *
 *  These values power the call/WhatsApp buttons, the demo form, SEO tags,
 *  Google structured data, the sitemap and the footer.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const SITE = {
  // ── Brand ────────────────────────────────────────────────────────────────
  name: "SotynERP",
  legalName: "SotynERP",
  brandShort: "SotynERP",
  tagline: "The ERP built by contractors, for contractors",
  promise:
    "See exactly where your money is leaking — from quote to site to collection — and plug it.",
  // The company behind the product (your real EPC business = the proof).
  parentCompany: "Secured Engineers Pvt. Ltd.",

  // ── Domain / URL ─────────────────────────────────────────────────────────
  // You own sotyn.ai — point it here when this site goes live.
  url: "https://sotyn.ai",
  // Where existing customers log in (the live ERP).
  appUrl: "https://securederp.in",

  // ── Contact (reuses your real numbers so the demo form works on day one) ──
  phone: "+91 70099 87817",
  phoneHref: "+917009987817",
  whatsapp: "917009987817", // country code + number, NO + or spaces
  email: "sales@sotyn.ai", // ⚠️ REPLACE if you set up a dedicated inbox
  emailDisplay: "sales@sotyn.ai", // ⚠️ REPLACE
  emailFallback: "sales@securedengineers.com", // working inbox used until sotyn.ai email is live

  // ── Head office (same as Secured Engineers) ──────────────────────────────
  address: {
    street: "2480/1, BK Tower, Gill Road",
    city: "Ludhiana",
    region: "Punjab",
    postalCode: "141003",
    country: "IN",
    countryName: "India",
  },

  // ── Proof points — these are REAL numbers from the company that built it ──
  // The strongest sales asset SotynERP has: it runs a live EPC business.
  stats: [
    { value: "535+", label: "Projects run on it" },
    { value: "18+", label: "Indian states" },
    { value: "300+", label: "Team members using it daily" },
    { value: "₹11.7 Cr+", label: "Client savings tracked" },
  ],

  // ── Pricing ──────────────────────────────────────────────────────────────
  // ⚠️ REPLACE the numbers below with your real prices. They're indicative
  //    placeholders so the page looks complete. `price` shows big on the card.
  // Calibrated for Indian contractors with ₹10–100 Cr turnover.
  // ⚠️ These are recommended starting prices — adjust to your costs/market.
  // Field/site app users are unlimited & free; you only charge for core users.
  pricing: {
    currency: "₹",
    billingNote: "per month, billed annually",
    gstNote:
      "Prices exclude 18% GST. Field/site app users are unlimited & free — you only pay for core (office & management) users.",
    disclaimer:
      "Calibrated for contractors with ₹10–100 Cr turnover. Your final quote depends on team size and the modules you switch on — book a demo for an exact number. Start on the plan that fits and add modules as you grow.",
    tiers: [
      {
        name: "Growth",
        blurb: "Stop the obvious leaks — quote, procure, bill.",
        turnover: "₹10–30 Cr turnover",
        coreUsers: "Up to 40 core users",
        fieldUsers: "Unlimited field users",
        price: "35,000",
        from: false,
        annual: "₹4.2 L / year",
        perUser: "≈ ₹875 / core user / mo",
        onboarding: "₹75,000 one-time onboarding",
        highlight: false,
        features: [
          "CRM, Leads & Quotation + Estimator",
          "Projects, Daily Reports, Snags & Checklists",
          "Procurement (RFQ, Vendors) & Inventory",
          "Sales Billing & Invoices",
          "Attendance + Tally link",
          "Core dashboards · mobile app",
          "WhatsApp + email support",
        ],
        cta: "Book a demo",
      },
      {
        name: "Scale",
        blurb: "Control the money and the labour.",
        turnover: "₹30–75 Cr turnover",
        coreUsers: "Up to 100 core users",
        fieldUsers: "Unlimited field users",
        price: "75,000",
        from: false,
        annual: "₹9 L / year",
        perUser: "≈ ₹750 / core user / mo",
        onboarding: "₹2 L one-time onboarding",
        highlight: true,
        badge: "Most popular",
        features: [
          "Everything in Growth, plus:",
          "Full Finance: AR/AP, Collections, Cash Flow",
          "Sub-contractor billing + Labour Rate",
          "Payroll",
          "Schedule (Gantt), PMS Tasks, Rentals, Assets",
          "Scorecard, Roles & Permissions, Audit Log",
          "Priority support",
        ],
        cta: "Book a demo",
      },
      {
        name: "Enterprise",
        blurb: "Scale across divisions, sites & companies.",
        turnover: "₹75–100 Cr+ turnover",
        coreUsers: "100+ / unlimited core users",
        fieldUsers: "Unlimited field users",
        price: "1,50,000",
        from: true,
        annual: "from ₹18 L / year",
        perUser: "Volume pricing",
        onboarding: "from ₹4 L onboarding",
        highlight: false,
        features: [
          "Everything in Scale, plus:",
          "Full Solar Division",
          "AI Auto-Quotation",
          "War Room & Operating Console",
          "Multi-location & multi-company",
          "API + custom integrations",
          "Dedicated manager · SLA · on-site training",
        ],
        cta: "Talk to us",
      },
    ],
    // Drives the ROI / leakage calculator — keep in sync with the tiers above.
    roi: {
      defaultTurnover: 50, // ₹ Cr
      defaultLeakPct: 2.5,
      bands: [
        { maxCr: 30, plan: "Growth", annual: 420000 },
        { maxCr: 75, plan: "Scale", annual: 900000 },
        { maxCr: 100000, plan: "Enterprise", annual: 1800000 },
      ],
    },
  },

  // ── LEAD ROUTING ─────────────────────────────────────────────────────────
  // The demo form POSTs lead data as JSON to this endpoint (your CRM/ERP
  // webhook). While empty, it falls back to WhatsApp + email so no lead is
  // ever lost.
  leadWebhookUrl: "", // ⚠️ PLUG your ERP/CRM lead webhook URL HERE when ready

  // ── Social ───────────────────────────────────────────────────────────────
  social: {
    linkedin: "https://www.linkedin.com/company/secured-engineers/",
    instagram: "https://www.instagram.com/securedengineers/",
    twitter: "",
    youtube: "",
  },
};

// Convenience helpers ────────────────────────────────────────────────────────
export const waLink = (msg = "") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    msg || `Hi SotynERP, I run a contracting business and I'd like a demo.`
  )}`;

export const telLink = `tel:${SITE.phoneHref}`;
export const mailLink = `mailto:${SITE.emailFallback}`;
