import test from "node:test";
import assert from "node:assert/strict";
import { formulas, formatInr } from "../src/lib/calc-formulas.js";

// ── Formatting: units must not silently change meaning ──────────────────────
test("rupees format into lakh and crore at the right thresholds", () => {
  assert.equal(formatInr(99999), "₹99,999");
  assert.equal(formatInr(100000), "₹1 L");
  assert.equal(formatInr(1050000), "₹10.5 L");
  assert.equal(formatInr(9999999), "₹100 L");
  assert.equal(formatInr(10000000), "₹1 Cr");
  assert.equal(formatInr(100000000), "₹10 Cr");
  assert.equal(formatInr(125000000), "₹12.5 Cr");
});

test("negative and non-finite values do not render as a plausible number", () => {
  assert.equal(formatInr(-250000), "−₹2.5 L");
  assert.equal(formatInr(Infinity), "—");
  assert.equal(formatInr(NaN), "—");
  assert.equal(formatInr(0), "₹0");
});

// ── quote-margin: the margin-vs-markup distinction the page promises ────────
test("quote margin is margin of price, not markup on cost", () => {
  // No overhead: to keep 15% of the selling price on ₹100 cost → ₹117.65.
  const r = formulas["quote-margin"]({ cost: 100, overhead: 0, margin: 15 });
  assert.equal(r.outputs.price, "₹118"); // rounded for display
  assert.equal(r.outputs.markup, "17.6%"); // markup ≠ the 15% margin
});

test("quote margin includes overhead in the protected base", () => {
  const r = formulas["quote-margin"]({ cost: 1000000, overhead: 8, margin: 15 });
  // base = 10,80,000 ; price = base / 0.85 = 12,70,588
  assert.equal(r.outputs.price, "₹12.71 L");
  assert.equal(r.outputs.marginr, "₹1.91 L");
});

test("a margin of 100% or more is refused, not silently ignored", () => {
  for (const margin of [100, 120]) {
    const r = formulas["quote-margin"]({ cost: 1000, overhead: 0, margin });
    assert.equal(r.outputs.price, "—", `margin ${margin}`);
    assert.match(r.message, /not achievable/);
  }
});

test("zero cost does not produce a markup percentage", () => {
  const r = formulas["quote-margin"]({ cost: 0, overhead: 10, margin: 15 });
  assert.equal(r.outputs.markup, "—");
});

// ── GST: add and remove must be exact inverses ──────────────────────────────
test("adding then removing GST returns the original base", () => {
  const added = formulas.gst({ amount: 100000, rate: 18, mode: "add" });
  assert.equal(added.outputs.gst, "₹18,000");
  assert.equal(added.outputs.total, "₹1.18 L");
  const removed = formulas.gst({ amount: 118000, rate: 18, mode: "remove" });
  assert.equal(removed.outputs.base, "₹1 L");
  assert.equal(removed.outputs.gst, "₹18,000");
});

test("GST removal at 12% and 5% is exact", () => {
  assert.equal(formulas.gst({ amount: 112000, rate: 12, mode: "remove" }).outputs.base, "₹1 L");
  assert.equal(formulas.gst({ amount: 105000, rate: 5, mode: "remove" }).outputs.base, "₹1 L");
});

test("GST at 0% changes nothing", () => {
  const r = formulas.gst({ amount: 50000, rate: 0, mode: "add" });
  assert.equal(r.outputs.gst, "₹0");
  assert.equal(r.outputs.total, "₹50,000");
});

test("an impossible GST rate is refused instead of dividing by zero", () => {
  const r = formulas.gst({ amount: 50000, rate: -100, mode: "remove" });
  assert.equal(r.outputs.base, "—");
});

// ── RA bill ─────────────────────────────────────────────────────────────────
test("RA bill net payable deducts retention and TDS and adds GST", () => {
  // 10,00,000 work · 5% retention · 18% GST · 2% TDS
  // = 10,00,000 − 50,000 + 1,80,000 − 20,000 = 11,10,000
  const r = formulas["ra-bill"]({ work: 1000000, ret: 5, gst: 18, tds: 2 });
  assert.equal(r.outputs.gstamt, "₹1.8 L");
  assert.equal(r.outputs.deduct, "₹70,000");
  assert.equal(r.outputs.net, "₹11.1 L");
});

test("RA bill with no deductions equals work plus GST", () => {
  const r = formulas["ra-bill"]({ work: 100000, ret: 0, gst: 18, tds: 0 });
  assert.equal(r.outputs.net, "₹1.18 L");
});

// ── Retention carrying cost ─────────────────────────────────────────────────
test("retention carrying cost is simple interest over the release period", () => {
  // 5% of ₹1 Cr = ₹5 L held; 12% for 12 months = ₹60,000
  const r = formulas.retention({ value: 10000000, ret: 5, rate: 12, months: 12 });
  assert.equal(r.outputs.held, "₹5 L");
  assert.equal(r.outputs.carry, "₹60,000");
});

test("a six-month release halves the carrying cost", () => {
  const r = formulas.retention({ value: 10000000, ret: 5, rate: 12, months: 6 });
  assert.equal(r.outputs.carry, "₹30,000");
});

// ── Turnover-based tools: units are ₹ crore in, rupees out ──────────────────
test("profit leak converts crore input to rupees per year and per day", () => {
  const r = formulas["profit-leak"]({ turnover: 25, leak: 2.5 });
  assert.equal(r.outputs.year, "₹62.5 L"); // 2.5% of ₹25 Cr
  assert.equal(r.outputs.day, "₹17,123");
});

test("cash stuck adds receivables and retention", () => {
  const r = formulas["cash-stuck"]({ turnover: 25, days: 73, ret: 5 });
  assert.equal(r.outputs.recv, "₹5 Cr"); // 73/365 of ₹25 Cr
  assert.equal(r.outputs.reten, "₹1.25 Cr");
  assert.equal(r.outputs.total, "₹6.25 Cr");
});

test("zero inputs give zero, not a fabricated figure", () => {
  for (const [slug, input] of [
    ["profit-leak", { turnover: 0, leak: 0 }],
    ["cash-stuck", { turnover: 0, days: 0, ret: 0 }],
    ["material-wastage", { spend: 0, wastage: 0 }],
    ["labour-leak", { spend: 0, leak: 0 }],
    ["delay-cost", { overhead: 0, days: 0 }],
  ]) {
    const values = Object.values(formulas[slug](input).outputs);
    assert.ok(values.every((v) => v === "₹0"), `${slug}: ${values.join()}`);
  }
});

test("extreme inputs stay finite and readable", () => {
  const r = formulas["profit-leak"]({ turnover: 1e6, leak: 100 });
  assert.match(r.outputs.year, /^₹[\d.,]+ Cr$/);
  assert.ok(!r.outputs.year.includes("Infinity"));
});

test("delay cost prorates a monthly overhead over 30 days", () => {
  const r = formulas["delay-cost"]({ overhead: 300000, days: 10 });
  assert.equal(r.outputs.perday, "₹10,000");
  assert.equal(r.outputs.total, "₹1 L");
});

// ── ROI: assumptions must not turn into invented paybacks ───────────────────
test("ROI payback is refused when nothing is recoverable", () => {
  const r = formulas["erp-roi"]({ turnover: 25, leak: 0, recover: 0, cost: 150000 });
  assert.equal(r.outputs.payback, "—");
  assert.equal(r.outputs.roi, "—");
});

test("ROI payback is refused when the cost is unknown", () => {
  const r = formulas["erp-roi"]({ turnover: 25, leak: 2.5, recover: 40, cost: 0 });
  assert.equal(r.outputs.payback, "—");
});

test("ROI recoverable is leak × recovery share, and payback follows from it", () => {
  // 2.5% of ₹25 Cr = ₹62.5 L; 40% recoverable = ₹25 L/yr ≈ ₹2.08 L/month
  const r = formulas["erp-roi"]({ turnover: 25, leak: 2.5, recover: 40, cost: 150000 });
  assert.equal(r.outputs.recoverable, "₹25 L");
  assert.equal(r.outputs.roi, "16.7×");
  assert.match(r.outputs.payback, /weeks|months/);
});

test("every calculator returns a message that names a real figure", () => {
  for (const slug of Object.keys(formulas)) {
    const { message } = formulas[slug]({});
    assert.equal(typeof message, "string");
    assert.ok(message.length > 0, slug);
    assert.ok(!message.includes("undefined"), `${slug}: ${message}`);
    assert.ok(!message.includes("NaN"), `${slug}: ${message}`);
  }
});
