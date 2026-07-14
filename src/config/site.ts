/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SOTYNERP — SINGLE SOURCE OF TRUTH
 * ────────────────────────────────────────────────────────────────────────────
 *  The ERP that runs Secured Engineers Pvt. Ltd., now offered to contractors
 *  across India. Edit this one file for contact details, links, stats, pricing,
 *  the webinar funnel and lead routing. Anything marked ⚠️ REPLACE needs a value.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const SITE = {
  // ── Brand ────────────────────────────────────────────────────────────────
  name: "sotyn.ai",
  legalName: "sotyn.ai",
  brandShort: "sotyn.ai",
  tagline: "India’s first AI-native ERP — built only for EPC contractors",
  promise:
    "AI that shows you exactly where your money is leaking — from quote to site to collection — and helps you plug it.",
  motto: "If it's not in SOTYN, it didn't happen.",
  parentCompany: "Secured Engineers Pvt. Ltd.",

  // ── Domain / URL ─────────────────────────────────────────────────────────
  url: "https://sotyn.ai",
  appUrl: "https://securederp.in",

  // ── Contact ──────────────────────────────────────────────────────────────
  phone: "+91 70099 87817",
  phoneHref: "+917009987817",
  whatsapp: "917009987817",
  email: "sales@sotyn.ai", // ⚠️ REPLACE if you set up a dedicated inbox
  emailDisplay: "sales@sotyn.ai", // ⚠️ REPLACE
  emailFallback: "sales@securedengineers.com",

  // ── Head office ──────────────────────────────────────────────────────────
  address: {
    street: "2480/1, BK Tower, Gill Road",
    city: "Ludhiana",
    region: "Punjab",
    postalCode: "141003",
    country: "IN",
    countryName: "India",
  },

  // ── Proof points (real numbers from the company that built it) ───────────
  stats: [
    { value: "535+", label: "Projects run on it" },
    { value: "18+", label: "Indian states" },
    { value: "300+", label: "Team members using it daily" },
    { value: "₹11.7 Cr+", label: "Client savings tracked" },
  ],

  // ── Trust & capability (homepage proof). All real numbers — edit freely. ──
  trust: {
    numbers: [
      { value: "535+", label: "Projects run on it" },
      { value: "14+", label: "Years in business" },
      { value: "18+", label: "Indian states" },
      { value: "300+", label: "Users every day" },
      { value: "₹11.7 Cr+", label: "Client savings tracked" },
      { value: "89.77%", label: "Repeat clients" },
      { value: "93.32%", label: "Projects delivered early" },
      { value: "1,13,880+", label: "Safe man-hours · 0 incidents" },
    ],
    capabilities: [
      { icon: "wallet", t: "EPC-native billing", d: "Sales, RA, MB, Installation and T&C bill types with GST — built for how contractors actually bill. Rivals have nothing this specific." },
      { icon: "box", t: "Indent → PO → Payment", d: "A full procurement engine — L1/L2 approvals, PO pipeline, debit notes, dispatch and receiving." },
      { icon: "bolt", t: "AI Auto-Quotation (coming soon)", d: "Upload a client BOQ (Excel/PDF) → AI matches your rates and returns a priced quote with margin per line. Rolling out now." },
      { icon: "users", t: "HRMS + payroll", d: "Attendance, leave & OT rules and auto payroll with GST, TDS, PF & ESI — geofenced GPS + selfie check-in coming soon." },
      { icon: "gauge", t: "TOC War Room", d: "A CMD-level console with ₹/day bottleneck costing — see exactly what's slowing your money." },
      { icon: "shield", t: "Your data, hosted in India", d: "Your own secure workspace, nightly offsite backups, full audit log. Never sold, never shared." },
    ],
    certs: ["ISO 9001:2015 certified", "MSME registered", "14 years in business", "GST-registered company"],
  },

  // Proof cards — REAL, verifiable statements only. No fabricated third-party
  // quotes. When real client quotes are collected, add them here (with consent).
  testimonials: [
    {
      quote: "We run 535+ projects across 18 states on sotyn.ai — quote, site, labour and money, all in one place. It's our single source of truth.",
      name: "Er. Ankur Kaplesh",
      role: "Founder, Secured Engineers — customer #1",
    },
    {
      quote: "The demo is our own live company. Right now — 30+ active sites, hundreds of daily reports in approval, every RA bill and payment — all running through sotyn.ai. No mockups, no staged data.",
      name: "Secured Engineers Pvt. Ltd.",
      role: "sotyn.ai customer #1 — we built it, we run on it",
    },
    {
      quote: "14 years, ISO 9001:2015, 535+ projects across 18 states — delivered for names like V-Guard, Luminous, Sonalika and Hero Homes. That operating discipline is what sotyn.ai encodes.",
      name: "The track record behind it",
      role: "MEPF · EPC · Solar · India",
    },
  ],

  // ── Marketing / ad tracking ──────────────────────────────────────────────
  metaPixelId: "", // ⚠️ paste your Facebook/Meta Pixel ID to track ad → webinar → buy

  // Founding-price countdown. mode "monthly" rolls to the end of the current
  // month and auto-resets (never shows expired). Set mode "fixed" + a `deadline`
  // ISO string (e.g. "2026-07-31T23:59:59+05:30") for a hard one-time deadline.
  countdown: {
    enabled: true,
    mode: "monthly",
    deadline: "",
    label: "Launch offer closes in",
    sublabel: "After the first 25 contractors, the 40%-off launch discount is gone.",
  },

  // ── PRICING ──────────────────────────────────────────────────────────────
  // Strategy: low price, high RESPECT. Anchor it, guarantee it, make it scarce.
  // ⚠️ Adjust the numbers to your market — everything reads from here.
  pricing: {
    currency: "₹",
    anchor:
      "The market charges ₹70K–₹1.2L a year for point tools. sotyn.ai bundles projects, procurement, EPC billing, HRMS & payroll into one price — less than one site supervisor's salary to run your whole company.",
    guarantee: "30-day money-back guarantee",
    guaranteeNote:
      "Use it for 30 days. If it doesn't show you where you're leaking money, we refund every rupee — no questions asked.",
    plans: [
      {
        name: "Starter",
        blurb: "Run projects, procurement & EPC billing.",
        price: "6,000",
        per: "/mo",
        billed: "₹72,000 billed yearly",
        strike: "",
        note: "Up to 10 office users · 5 live projects · unlimited site users",
        highlight: false,
        cta: "Book a demo",
        features: [
          "Projects · Daily Reports · Snags",
          "Procurement — RFQ, PO, dispatch",
          "Billing — all 5 EPC types (RA/MB/T&C) + GST",
          "Cash Flow · AR/AP",
          "Mobile app + site chat",
          "+ ₹25,000 one-time onboarding",
        ],
      },
      {
        name: "Growth",
        badge: "Most popular",
        blurb: "Everything to run the whole company.",
        price: "12,500",
        per: "/mo",
        billed: "₹1,50,000 billed yearly",
        strike: "",
        note: "Up to 25 office users · 20 live projects · unlimited site users",
        highlight: true,
        cta: "Book a demo",
        features: [
          "Everything in Starter, plus:",
          "HRMS + attendance + payroll",
          "Solar division",
          "AI Auto-Quotation — BOQ → priced quote (coming soon)",
          "Scorecard & TOC War Room",
          "+ ₹50,000 one-time onboarding",
        ],
      },
      {
        name: "Enterprise",
        blurb: "Unlimited scale, private instance.",
        price: "3,00,000",
        per: "+/yr",
        billed: "custom quote",
        from: true,
        strike: "",
        note: "Unlimited users & projects",
        highlight: false,
        cta: "Talk to us",
        features: [
          "Everything in Growth, plus:",
          "Unlimited users & projects",
          "Dedicated onboarding + account manager",
          "SSO · audit exports · priority SLA",
          "Private instance / on-prem option",
        ],
      },
    ],
    // What's in EVERY plan — the "everything included" promise.
    includes: [
      "14 module groups — CRM, solar, quotes, procurement, projects, finance, HRMS, scorecard, inventory & more",
      "Unlimited site users — never a per-seat penalty for adding field staff",
      "EPC-native billing — Sales, RA, MB, Installation & T&C, with GST",
      "AI Auto-Quotation — upload a BOQ, get a priced quote (coming soon)",
      "Mobile app for every site worker, in plain language",
      "Your own secure workspace, hosted in India, nightly backups",
      "No lock-in — cancel anytime",
    ],
    // One-time onboarding fee (per playbook: ₹25K Starter / ₹50K Growth+).
    setup: {
      label: "One-time onboarding",
      note: "Charged once — masters import, BOQ setup and 2 training sessions, so you go live fast.",
      bands: [
        { team: "Starter", fee: "25,000" },
        { team: "Growth & Enterprise", fee: "50,000" },
      ],
    },
    // Launch offer value stack — first 25 contractors, 40% off year 1.
    offer: {
      seatsTotal: 25,
      seatsLeft: 25, // ⚠️ update as launch seats fill
      stack: [
        { item: "The full sotyn.ai ERP — 14 module groups, unlimited site users", value: "₹3–10 L / yr value" },
        { item: "AI Auto-Quotation — BOQ to priced quote in minutes", value: "₹1,00,000 / yr" },
        { item: "EPC-native billing (Sales / RA / MB / T&C) with GST", value: "included" },
        { item: "HRMS + geofenced attendance + payroll", value: "₹40,000 / yr" },
        { item: "TOC War Room — ₹/day bottleneck costing for the CMD", value: "priceless" },
      ],
      bonuses: [
        { item: "Launch offer — 40% off your entire first year", value: "first 25 only" },
        { item: "Founder-level WhatsApp support — direct to Ankur", value: "included" },
        { item: "Done-for-you onboarding & data migration", value: "₹25–50K" },
        { item: "The 11-Point Profit Leak Checklist (from the book)", value: "₹2,000" },
      ],
      totalValue: "₹6,00,000+",
    },
    // Drives the ROI / leakage calculator.
    roi: {
      defaultTurnover: 25, // ₹ Cr
      defaultLeakPct: 2.5,
      annualCost: 150000, // Growth annual price, used for payback math
    },
  },

  // ── WEBINAR FUNNEL ───────────────────────────────────────────────────────
  // The Facebook/Instagram ad sends traffic to /webinar. ⚠️ set your real
  // date/time and (optionally) the live link.
  webinar: {
    kicker: "Free live masterclass for contractors",
    title: "The EPC Contractor's Profit Masterclass",
    subtitle:
      "How to stop losing money on every project — and build an EPC business that runs without you.",
    host: "Er. Ankur Kaplesh",
    hostTitle:
      "AI ERP Implementation Consultant & Founder, sotyn.ai · 14 yrs · 535+ projects · Author of 2 books",
    when: "Every Saturday · 7:00 PM IST", // ⚠️ set your real schedule
    duration: "60 minutes + live Q&A",
    platform: "Live on Zoom · 100% free",
    seats: "Only 100 seats per session",
    forWho:
      "EPC contractors & firms (₹2–100 Cr) — MEP, solar, civil, industrial & turnkey EPC.",
    learn: [
      "The 6 places every contractor silently leaks money — and how to plug each one",
      "The 4 numbers you must see every week to protect your margin",
      "How to delegate site & money decisions so the business grows without you",
      "The exact system we use to run 535+ projects across 18 states",
      "A founding-member offer to install the same system in your business",
    ],
  },

  // ── LEAD ROUTING ─────────────────────────────────────────────────────────
  // Demo, checklist and webinar forms POST JSON here. While empty, they fall
  // back to WhatsApp + email so no lead is ever lost. Each payload carries a
  // `source` so you can tell demo vs checklist vs webinar leads apart.
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
    msg || `Hi sotyn.ai, I run a contracting business and I'd like a demo.`
  )}`;

export const telLink = `tel:${SITE.phoneHref}`;
export const mailLink = `mailto:${SITE.emailFallback}`;
