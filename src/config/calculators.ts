/**
 * Single source of truth for the free calculators.
 * Used by /tools (hub, all-in-one) and /tools/[slug] (per-calculator SEO page).
 * Formulas live client-side in components/CalcEngine.astro, keyed by slug.
 */
export interface CalcInput { id: string; label: string; val?: number; type?: "select"; options?: { v: string | number; t: string }[]; }
export interface CalcOutput { id: string; label: string; hl?: boolean; }
export interface Calc {
  slug: string; icon: string; name: string; short: string; blurb: string;
  inputs: CalcInput[]; outputs: CalcOutput[]; cta: string;
  seoTitle: string; seoDescription: string; intro: string; faqs: { q: string; a: string }[];
}

export const calculators: Calc[] = [
  {
    slug: "quote-margin", icon: "trending-up", name: "Quote Margin Calculator", short: "Quote Margin",
    blurb: "The real price you must quote to hit your target margin — after overhead. (Markup ≠ margin.)",
    inputs: [{ id: "cost", label: "Direct cost (₹)", val: 1000000 }, { id: "overhead", label: "Site overhead %", val: 8 }, { id: "margin", label: "Target net margin %", val: 15 }],
    outputs: [{ id: "price", label: "Quote at least", hl: true }, { id: "marginr", label: "Your margin (₹)" }, { id: "markup", label: "= effective markup" }],
    cta: "sotyn.ai shows real margin on <strong>every line of every quote</strong>, before you send it.",
    seoTitle: "Quote Margin Calculator for Contractors — margin vs markup | sotyn.ai",
    seoDescription: "Free quote margin calculator for Indian contractors. Enter your cost, overhead and target margin to get the price you must quote — and see why markup isn't margin. No sign-up.",
    intro: "Most contractors lose margin at the quote itself — by adding a markup to cost and forgetting overhead, or by confusing markup with margin. A 15% markup is not a 15% margin. This calculator works backwards from the margin you actually want to keep, after site overhead, and tells you the minimum price to quote.",
    faqs: [
      { q: "What's the difference between markup and margin?", a: "Markup is added on top of cost (₹100 cost + 15% markup = ₹115). Margin is the share of the selling price you keep (₹115 price with ₹100 cost = 13% margin, not 15%). This tool sizes the price so your kept margin is what you targeted." },
      { q: "Should overhead be in the cost?", a: "Site overhead — supervision, establishment, rentals — is real cost. If you quote margin on direct cost alone, overhead eats it. Enter it here so the quote protects your true margin." },
    ],
  },
  {
    slug: "profit-leak", icon: "droplet", name: "Profit Leak Calculator", short: "Profit Leak",
    blurb: "The 2–3% that quietly disappears between quote, site and collection — in rupees, on your turnover.",
    inputs: [{ id: "turnover", label: "Annual turnover (₹ Cr)", val: 25 }, { id: "leak", label: "Estimated leakage %", val: 2.5 }],
    outputs: [{ id: "year", label: "Leaking per year", hl: true }, { id: "day", label: "Per day" }],
    cta: "Most contractors leak 2–3% and find out at year-end. sotyn.ai surfaces it the same day.",
    seoTitle: "Construction Profit Leak Calculator — how much you lose a year | sotyn.ai",
    seoDescription: "Free calculator to estimate profit leakage for Indian EPC & construction firms. See what 2–3% leakage across quoting, material, labour and billing costs you per year. No sign-up.",
    intro: "Contractors rarely lose money on bad projects — they lose it in the gaps between quoting, site execution, material, labour and collection. Industry experience puts this silent leakage at roughly 2–3% of turnover for firms still running on WhatsApp and Excel. This calculator turns that percentage into the rupees you're likely losing every year, and every day.",
    faqs: [
      { q: "Where does the leakage actually happen?", a: "The usual six: quoting below true cost, material over-consumption and off-market buying, ghost labour, rework and delays, slow billing, and cash stuck in receivables. Each is small; together they add up to 2–3%." },
      { q: "Is 2.5% a fair default?", a: "It's a conservative mid-point for a firm without connected systems. If you already have tight controls, use a lower figure; if quoting, material and billing all live in separate places, it's often higher." },
    ],
  },
  {
    slug: "cash-stuck", icon: "wallet", name: "Cash-Stuck Calculator", short: "Cash-Stuck",
    blurb: "How much of your money is locked in receivables and retention right now — financing your clients for free.",
    inputs: [{ id: "turnover", label: "Annual turnover (₹ Cr)", val: 25 }, { id: "days", label: "Avg payment delay (days)", val: 75 }, { id: "ret", label: "Retention held (%)", val: 5 }],
    outputs: [{ id: "recv", label: "Stuck in receivables" }, { id: "reten", label: "Held as retention" }, { id: "total", label: "Total cash locked", hl: true }],
    cta: "That's your working capital, sitting idle. sotyn.ai chases every rupee automatically.",
    seoTitle: "Cash-Stuck Calculator — receivables & retention locked up | sotyn.ai",
    seoDescription: "Free calculator to see how much working capital is locked in receivables and retention for your construction business. Built for Indian contractors. No sign-up.",
    intro: "Every day a client pays late, you're financing them for free. Between slow receivables and retention held back on every bill, a large share of a contractor's turnover sits locked up as working capital. This calculator estimates how much of your cash is stuck right now, so you can see the size of the collections problem.",
    faqs: [
      { q: "How is 'stuck in receivables' estimated?", a: "It approximates your average outstanding as turnover × (average payment delay in days ÷ 365) — i.e. how much revenue is typically unpaid at any moment given your collection speed." },
      { q: "Why include retention?", a: "Retention (usually 5–10%) is your money the client holds until defect liability ends. It's real cash locked out of your business, often for a year or more, so it belongs in the total." },
    ],
  },
  {
    slug: "material-wastage", icon: "box", name: "Material Wastage Calculator", short: "Material Wastage",
    blurb: "Over-consumption, theft and off-market buying against your BOQ — the classic procurement leak.",
    inputs: [{ id: "spend", label: "Annual material spend (₹)", val: 30000000 }, { id: "wastage", label: "Wastage / leakage %", val: 5 }],
    outputs: [{ id: "year", label: "Lost per year", hl: true }, { id: "month", label: "Per month" }],
    cta: "sotyn.ai tracks BOQ vs actually-consumed, per line — over-consumption shows up instantly.",
    seoTitle: "Material Wastage Calculator for Construction — BOQ leakage | sotyn.ai",
    seoDescription: "Free material wastage calculator for Indian construction & EPC contractors. Estimate what over-consumption and leakage against your BOQ costs per year. No sign-up.",
    intro: "Material is usually the largest cost line on a project and the easiest place for margin to disappear — through over-consumption, wastage, theft and buying above agreed rates. Because purchase records and site consumption usually live in different registers, the leak isn't seen until a year-end reconciliation. This calculator sizes it against your annual material spend.",
    faqs: [
      { q: "What counts as material 'wastage'?", a: "Everything that consumes more material than the BOQ allows: genuine wastage and breakage, over-ordering, pilferage, and paying above the agreed rate. 5% is a common working estimate; tight sites are lower." },
      { q: "How do you catch it in real time?", a: "By comparing consumed quantity against the BOQ, per line item, as work is booked — so a line crossing its budget flags the same day instead of at audit." },
    ],
  },
  {
    slug: "labour-leak", icon: "users", name: "Labour Leak Calculator", short: "Labour Leak",
    blurb: "Ghost labour on muster rolls and inflated sub-contractor bills add up fast.",
    inputs: [{ id: "spend", label: "Monthly labour spend (₹)", val: 2000000 }, { id: "leak", label: "Estimated leak %", val: 6 }],
    outputs: [{ id: "month", label: "Lost per month" }, { id: "year", label: "Lost per year", hl: true }],
    cta: "Real attendance + rate-checked sub-con bills plug this leak on day one.",
    seoTitle: "Labour Leak Calculator — ghost labour & sub-contractor cost | sotyn.ai",
    seoDescription: "Free labour leakage calculator for Indian contractors. Estimate the cost of ghost labour on muster rolls and inflated sub-contractor bills per month and year. No sign-up.",
    intro: "Labour is the second big leak. Attendance recorded on paper muster rolls is easy to inflate, and sub-contractor bills are hard to check against agreed rates and real headcount. This calculator estimates what that leakage costs against your monthly labour spend — before real attendance and rate-checked billing close it.",
    faqs: [
      { q: "What drives labour leakage?", a: "Ghost workers on the muster roll, over-stated attendance, and sub-contractor bills claiming more labour or higher rates than agreed. 6% is a common working figure for manual muster rolls." },
      { q: "How does verified attendance help?", a: "When attendance is captured at site (and, soon, geofenced with a selfie check-in), the muster roll can't be padded — and sub-con bills are checked against real, recorded headcount and agreed rates." },
    ],
  },
  {
    slug: "delay-cost", icon: "alert", name: "Project Delay Cost Calculator", short: "Delay Cost",
    blurb: "Every extra day a site runs burns overhead — supervision, rentals, establishment.",
    inputs: [{ id: "overhead", label: "Monthly site running cost (₹)", val: 900000 }, { id: "days", label: "Delay (days)", val: 30 }],
    outputs: [{ id: "perday", label: "Burn per day" }, { id: "total", label: "Cost of the delay", hl: true }],
    cta: "Problems surface the same day in sotyn.ai — so delays get fixed before they compound.",
    seoTitle: "Project Delay Cost Calculator for Construction | sotyn.ai India",
    seoDescription: "Free project delay cost calculator for Indian construction & EPC contractors. See what every extra day on site burns in overhead. No sign-up.",
    intro: "A delayed project keeps burning overhead — supervision salaries, equipment rentals, site establishment — long after the revenue is booked. That daily burn, not the headline penalty, is what quietly erodes margin. This calculator turns your monthly site running cost into a per-day burn and totals it across the delay.",
    faqs: [
      { q: "What should 'monthly site running cost' include?", a: "The overhead that continues whether or not work progresses: site engineers and supervisors, rentals, establishment, security and site office costs. Exclude material and direct labour tied to actual work." },
      { q: "Does this include liquidated damages?", a: "No — this sizes the overhead burn, which applies to almost every delay. LDs and reputational cost are on top, and are project-specific." },
    ],
  },
  {
    slug: "retention", icon: "lock", name: "Retention Money Calculator", short: "Retention",
    blurb: "How much is held back as retention — and what that locked money costs you until release.",
    inputs: [{ id: "value", label: "Contract / billed value (₹)", val: 10000000 }, { id: "ret", label: "Retention %", val: 5 }, { id: "rate", label: "Cost of capital % / yr", val: 12 }, { id: "months", label: "Released after (months)", val: 12 }],
    outputs: [{ id: "held", label: "Retention held", hl: true }, { id: "carry", label: "Carrying cost till release" }],
    cta: "Track every retention due-date so you claim it back the day it's release-eligible.",
    seoTitle: "Retention Money Calculator for Contractors | sotyn.ai India",
    seoDescription: "Free retention money calculator for Indian construction contractors. See how much is held as retention and what that locked cash costs you until release. No sign-up.",
    intro: "Retention protects the client, but it's your cash — held back on every bill, often 5–10%, and released only after the defect liability period. Until then it costs you: it's working capital you could deploy, at your cost of capital. This calculator sizes both the retention held and its carrying cost until release.",
    faqs: [
      { q: "How is the carrying cost calculated?", a: "Retention held × your cost of capital × the fraction of a year it's held (months ÷ 12). It's the interest value of money locked out of your business." },
      { q: "Why do contractors lose retention?", a: "Because nobody tracks release dates. Retention becomes claimable at milestones and after defect liability — miss the date and it sits longer, or gets forgotten. Tracking every due-date is how you get it back on time." },
    ],
  },
  {
    slug: "gst", icon: "layers", name: "Construction GST Calculator", short: "Construction GST",
    blurb: "Add or strip GST on works-contract billing at the right rate — no more manual back-calculation.",
    inputs: [
      { id: "amount", label: "Amount (₹)", val: 1000000 },
      { id: "rate", label: "GST rate", type: "select", options: [{ v: 18, t: "18% (works contract)" }, { v: 12, t: "12%" }, { v: 5, t: "5%" }] },
      { id: "mode", label: "Mode", type: "select", options: [{ v: "add", t: "Add GST (exclusive)" }, { v: "remove", t: "Remove GST (inclusive)" }] },
    ],
    outputs: [{ id: "base", label: "Base value" }, { id: "gst", label: "GST amount" }, { id: "total", label: "Total (incl. GST)", hl: true }],
    cta: "sotyn.ai auto-applies the right GST on every bill type — Sales, RA, MB, T&C.",
    seoTitle: "Construction GST Calculator (18% / 12% / 5%) | sotyn.ai India",
    seoDescription: "Free GST calculator for Indian construction & works-contract billing. Add or remove GST at 18%, 12% or 5% instantly. Built for contractors. No sign-up.",
    intro: "Works-contract GST trips up billing every cycle — especially back-calculating the base value out of a GST-inclusive amount. This calculator does both directions: add GST to an exclusive amount, or strip GST out of an inclusive figure, at 18% (the common works-contract rate), 12% or 5%.",
    faqs: [
      { q: "What GST rate applies to works contracts?", a: "Most construction works contracts attract 18% GST, with 12% and 5% applying to specific categories (e.g. certain affordable housing and government works). Confirm your project's category with your tax advisor." },
      { q: "How do I remove GST from an inclusive amount?", a: "Divide the inclusive amount by (1 + rate). This tool's 'Remove GST' mode does it for you and shows the base value and the GST component." },
    ],
  },
  {
    slug: "ra-bill", icon: "book", name: "RA Bill Net-Payable Calculator", short: "RA Bill",
    blurb: "What actually lands in the bank this Running Account bill — after retention, GST and TDS.",
    inputs: [{ id: "work", label: "Work done this bill (₹)", val: 2000000 }, { id: "ret", label: "Retention %", val: 5 }, { id: "gst", label: "GST %", val: 18 }, { id: "tds", label: "TDS %", val: 2 }],
    outputs: [{ id: "gstamt", label: "GST added" }, { id: "deduct", label: "Retention + TDS" }, { id: "net", label: "Net payable", hl: true }],
    cta: "sotyn.ai builds the RA bill and its deductions automatically — billing-ready the moment a DPR is approved.",
    seoTitle: "RA Bill Calculator — Running Account bill net-payable | sotyn.ai India",
    seoDescription: "Free RA bill calculator for Indian contractors. Work out the net payable on a Running Account bill after retention, GST and TDS. No sign-up.",
    intro: "A Running Account (RA) bill is rarely the simple value of work done. Retention comes off, TDS is deducted, and GST is added — and the number that actually reaches your bank is what matters for cash flow. This calculator computes the net payable on an RA bill so you know exactly what to expect.",
    faqs: [
      { q: "How is RA bill net-payable calculated?", a: "Work done, minus retention, minus TDS, plus GST = net payable. Retention and TDS are deductions; GST is added on top and paid onward. This tool shows each component." },
      { q: "What's a typical retention and TDS?", a: "Retention is commonly 5–10% of work done; TDS under section 194C is typically 1–2%. Use your contract's actual figures for an exact number." },
    ],
  },
  {
    slug: "erp-roi", icon: "check", name: "Sotyn ROI & Payback Calculator", short: "Sotyn ROI",
    blurb: "What plugging even part of your leak is worth — and how fast sotyn.ai pays for itself.",
    inputs: [{ id: "turnover", label: "Annual turnover (₹ Cr)", val: 25 }, { id: "leak", label: "Current leakage %", val: 2.5 }, { id: "recover", label: "Realistically recover %", val: 60 }, { id: "cost", label: "sotyn.ai cost / yr (₹)", val: 150000 }],
    outputs: [{ id: "recoverable", label: "Recoverable per year", hl: true }, { id: "payback", label: "Payback" }, { id: "roi", label: "Return" }],
    cta: "See it on your real numbers in a 20-minute demo — no slides, just your margin, cash and sites.",
    seoTitle: "Construction Software ROI & Payback Calculator | sotyn.ai India",
    seoDescription: "Free ROI calculator: see what recovering part of your profit leak is worth and how fast sotyn.ai pays for itself. Built for Indian EPC & construction firms. No sign-up.",
    intro: "Software is only worth what it recovers. If a connected system helps you claw back even part of the 2–3% leaking across quoting, material, labour and billing, that recovery usually dwarfs its cost. This calculator estimates the recoverable rupees per year and how quickly the platform pays for itself.",
    faqs: [
      { q: "Is recovering 60% of the leak realistic?", a: "It's a deliberately conservative default — connected quoting, real attendance, BOQ-vs-actual and faster billing typically address a large share of the leak. Adjust it up or down to your own confidence." },
      { q: "What does the payback mean?", a: "How long the annual software cost takes to be covered by the recovered money. For most mid-size contractors the recoverable amount is several times the cost, so payback lands in weeks, not years." },
    ],
  },
];

export const getCalc = (slug: string) => calculators.find((c) => c.slug === slug);
