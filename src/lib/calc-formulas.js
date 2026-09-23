/**
 * Calculator formulas — pure functions, no DOM, so they can be unit-tested
 * (tests/calculators.test.mjs). CalcEngine.astro is only the DOM glue.
 *
 * Every function takes plain numbers and returns { outputs, message }.
 * `outputs` values are already formatted for display; "—" means "cannot be
 * computed from these inputs" and is used instead of a misleading number.
 *
 * Stated assumptions (surfaced on the pages, not hidden in code):
 *  - "leakage" and "recovery" percentages are the USER'S estimates. Nothing here
 *    is a measured saving of any customer.
 *  - cash-stuck adds retention to average receivables; where a client's retention
 *    is already inside the outstanding bill value, that overlaps.
 *  - GST/TDS rates are user inputs, not advice. Applicability must be checked
 *    against current law for the specific contract.
 */

/** Indian-format rupees, abbreviating to lakh/crore like the rest of the site. */
export function formatInr(n) {
  if (!isFinite(n)) return "—";
  const neg = n < 0;
  n = Math.abs(n);
  let out;
  // Compare on the rounded rupee value, so 99,999.999… reads "₹1 L" like every
  // other way of arriving at one lakh, not "₹1,00,000".
  const rounded = Math.round(n);
  if (rounded >= 1e7) out = "₹" + (n / 1e7).toFixed(2).replace(/\.?0+$/, "") + " Cr";
  else if (rounded >= 1e5) out = "₹" + (n / 1e5).toFixed(2).replace(/\.?0+$/, "") + " L";
  else out = "₹" + Math.round(n).toLocaleString("en-IN");
  return (neg ? "−" : "") + out;
}

const pct = (v) => (isFinite(v) ? v.toFixed(1) + "%" : "—");

export const formulas = {
  // Price that leaves `margin`% of the SELLING price after overhead.
  // Markup (on cost) and margin (of price) are deliberately both shown.
  "quote-margin": ({ cost = 0, overhead = 0, margin = 0 }) => {
    const base = cost * (1 + overhead / 100);
    if (margin >= 100) {
      return {
        outputs: { price: "—", marginr: "—", markup: "—" },
        message: "A margin of 100% or more of the selling price is not achievable — enter a margin below 100%.",
      };
    }
    const price = base / (1 - margin / 100);
    return {
      outputs: {
        price: formatInr(price),
        marginr: formatInr(price - base),
        markup: cost > 0 ? pct((price / cost - 1) * 100) : "—",
      },
      message: `To hit a ${margin}% margin on ${formatInr(cost)} cost, I must quote at least ${formatInr(price)}.`,
    };
  },

  // turnover is entered in ₹ crore.
  "profit-leak": ({ turnover = 0, leak = 0 }) => {
    const loss = turnover * 1e7 * (leak / 100);
    return {
      outputs: { year: formatInr(loss), day: formatInr(loss / 365) },
      message: `At ${leak}% leakage I'm losing ${formatInr(loss)} a year.`,
    };
  },

  "cash-stuck": ({ turnover = 0, days = 0, ret = 0 }) => {
    const annual = turnover * 1e7;
    const recv = (annual / 365) * days;
    const reten = annual * (ret / 100);
    return {
      outputs: { recv: formatInr(recv), reten: formatInr(reten), total: formatInr(recv + reten) },
      message: `${formatInr(recv + reten)} of my cash is stuck in receivables + retention.`,
    };
  },

  "material-wastage": ({ spend = 0, wastage = 0 }) => {
    const loss = spend * (wastage / 100);
    return {
      outputs: { year: formatInr(loss), month: formatInr(loss / 12) },
      message: `At ${wastage}% wastage I'm losing ${formatInr(loss)} of material a year.`,
    };
  },

  "labour-leak": ({ spend = 0, leak = 0 }) => {
    const monthly = spend * (leak / 100);
    return {
      outputs: { month: formatInr(monthly), year: formatInr(monthly * 12) },
      message: `Labour leakage is costing me ${formatInr(monthly * 12)} a year.`,
    };
  },

  // overhead is the MONTHLY site overhead; a month is treated as 30 days.
  "delay-cost": ({ overhead = 0, days = 0 }) => {
    const perday = overhead / 30;
    return {
      outputs: { perday: formatInr(perday), total: formatInr(perday * days) },
      message: `A ${days}-day delay is burning ${formatInr(perday * days)} in site overhead.`,
    };
  },

  // Simple (not compounded) carrying cost over the release period.
  retention: ({ value = 0, ret = 0, rate = 0, months = 0 }) => {
    const held = value * (ret / 100);
    const carry = held * (rate / 100) * (months / 12);
    return {
      outputs: { held: formatInr(held), carry: formatInr(carry) },
      message: `${formatInr(held)} of mine is held as retention (${formatInr(carry)} carrying cost till release).`,
    };
  },

  // mode "remove" treats `amount` as GST-inclusive; anything else adds GST.
  gst: ({ amount = 0, rate = 0, mode = "add" }) => {
    if (mode === "remove") {
      if (rate <= -100) {
        return { outputs: { base: "—", gst: "—", total: formatInr(amount) }, message: "Enter a valid GST rate." };
      }
      const base = amount / (1 + rate / 100);
      return {
        outputs: { base: formatInr(base), gst: formatInr(amount - base), total: formatInr(amount) },
        message: `GST ${rate}% → GST ${formatInr(amount - base)}, total ${formatInr(amount)}.`,
      };
    }
    const gstAmt = amount * (rate / 100);
    return {
      outputs: { base: formatInr(amount), gst: formatInr(gstAmt), total: formatInr(amount + gstAmt) },
      message: `GST ${rate}% → GST ${formatInr(gstAmt)}, total ${formatInr(amount + gstAmt)}.`,
    };
  },

  // Retention and TDS are computed on the work value; GST is added on it.
  "ra-bill": ({ work = 0, ret = 0, gst = 0, tds = 0 }) => {
    const retA = work * (ret / 100);
    const gstA = work * (gst / 100);
    const tdsA = work * (tds / 100);
    const net = work - retA + gstA - tdsA;
    return {
      outputs: { gstamt: formatInr(gstA), deduct: formatInr(retA + tdsA), net: formatInr(net) },
      message: `Net payable on this RA bill works out to ${formatInr(net)}.`,
    };
  },

  // `recover` is the share of the estimated leak the user believes is
  // recoverable — an assumption, never a measured customer saving.
  "erp-roi": ({ turnover = 0, leak = 0, recover = 0, cost = 0 }) => {
    const recoverable = turnover * 1e7 * (leak / 100) * (recover / 100);
    const monthly = recoverable / 12;
    if (!(monthly > 0) || !(cost > 0)) {
      return {
        outputs: { recoverable: formatInr(recoverable), payback: "—", roi: "—" },
        message: `Enter a turnover, a leakage estimate and a recovery share to see a payback.`,
      };
    }
    const payMonths = cost / monthly;
    const payback =
      payMonths < 1.5 ? `${Math.max(1, Math.round(payMonths * 4.3))} weeks` : `${payMonths.toFixed(1)} months`;
    return {
      outputs: {
        recoverable: formatInr(recoverable),
        payback,
        roi: (recoverable / cost).toFixed(1) + "×",
      },
      message: `sotyn.ai could recover ~${formatInr(recoverable)}/yr for me — payback about ${payback}.`,
    };
  },
};
