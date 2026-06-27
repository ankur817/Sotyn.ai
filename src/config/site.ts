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
      { icon: "layers", t: "Every department, one login", d: "60+ modules across sales, finance, procurement, site, HR & solar — all talking to each other." },
      { icon: "bolt", t: "AI that works for you", d: "AI auto-quotation, leak alerts and a daily briefing — not just data entry." },
      { icon: "shield", t: "Your data, hosted in India", d: "Your own secure workspace with daily backups. Never sold, never shared." },
      { icon: "gauge", t: "Bank-grade control", d: "Role-based access and a full audit log on every single change." },
      { icon: "wallet", t: "Works with Tally & Excel", d: "We migrate your data and keep your accountant's books in sync." },
      { icon: "users", t: "Built for the field", d: "A mobile app every site worker actually uses — in plain language." },
    ],
    certs: ["ISO 9001:2015 certified", "MSME registered", "14 years in business", "GST-registered company"],
  },

  // Testimonials — ⚠️ REPLACE the placeholder entries with REAL client quotes.
  // Never publish fabricated testimonials. Cards render in this order.
  testimonials: [
    {
      quote: "We run 535+ projects across 18 states on sotyn.ai — quote, site, labour and money, all in one place. It's our single source of truth.",
      name: "Er. Ankur Kaplesh",
      role: "Founder, Secured Engineers — customer #1",
    },
    {
      quote: "⚠️ REPLACE with a real client quote — e.g. “sotyn.ai cut our quoting time from 3 days to 2 hours.”",
      name: "Add client name",
      role: "Designation, Company",
    },
    {
      quote: "⚠️ REPLACE with a real client quote — e.g. “We found ₹40 lakh of leakage in the first month.”",
      name: "Add client name",
      role: "Designation, Company",
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
    label: "Founding price closes in",
    sublabel: "After that the price goes up — and founding seats are gone.",
  },

  // ── PRICING ──────────────────────────────────────────────────────────────
  // Strategy: low price, high RESPECT. Anchor it, guarantee it, make it scarce.
  // ⚠️ Adjust the numbers to your market — everything reads from here.
  pricing: {
    currency: "₹",
    anchor:
      "Comparable construction ERPs cost ₹3–10 lakh a year. sotyn.ai is a fraction of that — because we built it to run our own business, not to milk customers.",
    guarantee: "30-day money-back guarantee",
    guaranteeNote:
      "Use it for 30 days. If it doesn't show you where you're leaking money, we refund every rupee — no questions asked.",
    plans: [
      {
        name: "Founding Member",
        badge: "Limited · price locked for life",
        blurb: "The lowest price sotyn.ai will ever offer.",
        price: "10,000",
        per: "/mo",
        billed: "billed annually · ₹1,20,000/yr",
        strike: "",
        note: "First 100 contractors only · rate locked forever",
        highlight: true,
        cta: "Claim founding price",
        features: ["Everything included (full list below)", "Price never increases — for life", "Priority onboarding"],
      },
      {
        name: "Standard",
        blurb: "Everything included, no limits.",
        price: "14,999",
        per: "/mo",
        billed: "billed annually · ₹1,79,988/yr",
        strike: "19,999",
        note: "Or ₹19,999/mo billed monthly",
        highlight: false,
        cta: "Book a demo",
        features: ["Everything in the list below", "Annual or monthly billing", "Standard onboarding"],
      },
      {
        name: "Enterprise",
        blurb: "₹50 Cr+ turnover or multi-company groups.",
        price: "Custom",
        per: "",
        billed: "Tailored to your group",
        strike: "",
        note: "Multi-company · API · dedicated manager · SLA",
        highlight: false,
        cta: "Talk to us",
        features: ["Everything, plus:", "Multi-company & multi-location", "API + custom integrations", "Dedicated manager + SLA"],
      },
    ],
    // What's in EVERY plan — the "everything included" promise.
    includes: [
      "Every module — CRM, quotation, procurement, site, finance, HR & solar",
      "Unlimited users — office and site, no per-seat fees ever",
      "Tally + Excel migration & team training during onboarding",
      "Mobile app for every site worker, in plain language",
      "Your own secure workspace, hosted in India",
      "WhatsApp + priority support",
      "No lock-in — cancel anytime",
    ],
    // One-time setup & onboarding fee, scaled by employee count.
    setup: {
      label: "One-time setup & onboarding",
      note: "Charged once. Covers data migration from Tally & Excel, master setup and team training — so you go live in weeks, not months.",
      bands: [
        { team: "Up to 10 employees", fee: "1,000" },
        { team: "11–25 employees", fee: "5,000" },
        { team: "26–50 employees", fee: "10,000" },
        { team: "51–100 employees", fee: "18,000" },
        { team: "100+ employees", fee: "25,000" },
      ],
    },
    // Grand-slam offer value stack (illustrative values — adjust freely).
    offer: {
      seatsTotal: 100,
      seatsLeft: 17, // ⚠️ update as founding seats fill
      stack: [
        { item: "The full sotyn.ai ERP — every module, unlimited users", value: "₹3–10 L / yr value" },
        { item: "AI Auto-Quotation engine", value: "₹1,00,000 / yr" },
        { item: "Done-for-you Tally + Excel migration & master setup", value: "₹50,000" },
        { item: "Team training until you're fully live", value: "₹40,000" },
        { item: "Secure workspace hosted in India + daily backups", value: "₹30,000 / yr" },
      ],
      bonuses: [
        { item: "Bonus — Free 1-on-1 Profit Leak Audit on your own numbers", value: "₹25,000" },
        { item: "Bonus — Priority onboarding: live in 2 weeks, not months", value: "₹30,000" },
        { item: "Bonus — The 11-Point Profit Leak Checklist (from the book)", value: "₹2,000" },
        { item: "Bonus — Founding price locked for life", value: "saves lakhs over time" },
      ],
      totalValue: "₹6,00,000+",
    },
    // Drives the ROI / leakage calculator.
    roi: {
      defaultTurnover: 25, // ₹ Cr
      defaultLeakPct: 2.5,
      annualCost: 120000, // founding annual price, used for payback math
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
      "Business Coach & Founder, sotyn.ai · 14 yrs · 535+ projects · Author of 2 books",
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
