# CHANGE_LEDGER — claim vs source vs test vs deployment vs production vs outcome

Compiled 2026-09-23. **A build pass is not a deployment; a deployment is not indexation; a passing test is not an accepted CRM lead.** Each column below is independent and is filled only from evidence I obtained myself.

## Release state (verified 2026-09-23, this machine)

| Question | Evidence | Answer |
|---|---|---|
| Production repository | `git remote -v` → `https://github.com/ankur817/Sotyn.ai.git`; live HTML matches this source | `ankur817/Sotyn.ai` — the only remote configured |
| Production host | `curl -I https://www.sotyn.ai/` → `server: Vercel`, `x-vercel-id: bom1::…`, `x-vercel-cache` | **Vercel** (region bom1). A stale `netlify.toml` also sits in the repo — dead config, left in place, flagged below |
| Package manager | `package-lock.json` only, no yarn/pnpm lockfile | npm |
| `main` HEAD | `git rev-parse origin/main` | `fef5f86…` (12 Sep 2026) — **unchanged**, matching the reviewer's finding |
| Working branch | `git log` | `fix/audit-2026-09-23` → `9d7ca6f`, `36ae383`, + this round |
| PR | `gh pr view 8` | **OPEN, MERGEABLE, CLEAN** — [PR #8](https://github.com/ankur817/Sotyn.ai/pull/8). Not merged |
| Preview builds | GitHub commit statuses | 5 Vercel projects, **all SUCCESS** on `36ae383`. Previews are behind Vercel SSO, so anonymous fetch returns 302 — I could not fetch preview HTML |
| **Production revision** | `curl https://www.sotyn.ai/` → still contains `"price":"0"`, `"telephone":"++917009987817"`, `wght@300;400;…` | **Production is still the pre-fix code.** Nothing from this work is live |
| Uncommitted work preserved | `git status` clean except intended edits; no unrelated file touched | yes |

**Reviewer's open questions answered:** the production repository/provider is discovered, not assumed (Vercel, this repo). No second sitemap, form system or analytics stack was created. No framework migration. No DNS, host, pricing, billing or analytics-ownership change was made.

## Ledger

| # | Prior claim / intended outcome | Source & implemented? | Test & environment | Merged | Deployment | Production verification | Search/lead outcome | Decision |
|---|---|---|---|---|---|---|---|---|
| 1 | Forms no longer show success on failed delivery → stop losing enquiries silently | `src/lib/lead-client.js` + 4 form components — **yes** | `tests/lead-client.test.mjs`, `tests/forms.test.mjs` (node --test, local); **browser-verified** on a local production build: failure keeps data, shows honest error, stays on `/demo` | **No** (PR #8) | Preview built OK; SSO-gated | **Not in production** | Not measurable — no CRM/GA4 access | Finish: merge after the endpoint contract is confirmed |
| 2 | Paid app no longer advertised at price 0 | `BaseLayout.astro` `AggregateOffer` INR 72,000–3,00,000 — **yes** | `tests/pricing.test.mjs`; **schema.org validator: 0 errors, 0 warnings** on `/`, `/pricing`, `/scorecard`, `/webinar`, `/compare/sotyn-vs-onsite` | No | — | **Production still serves `"price":"0"`** (verified today) | Not measurable (no GSC) | Finish |
| 3 | `++91` telephone fixed; one Organization entity with stable `@id` | `BaseLayout.astro` — **yes** | validator clean; `dist` grep | No | — | **Production still serves `++917009987817`** | — | Finish |
| 4 | Canonical host = www, sitemap lists non-redirecting URLs, `/thank-you` + `/social-kit` out of the sitemap, one URL per page at the edge | `site.ts`, `astro.config.mjs`, `vercel.json`, `robots.txt` — **yes** | `dist` inspection: 38 locs, no trailing slash, canonical `https://www.sotyn.ai/...` | No | — | Not in production | **Indexation impact is unknown and unmeasurable without GSC** — do not claim a ranking effect | Finish |
| 5 | Fake urgency (monthly-resetting countdown, "25 of 25 seats") disabled behind flags | `site.ts` `countdown.enabled:false`, `offer.showSeatsLeft:false` — **yes** | `tests/pricing.test.mjs` | No | — | **Production still renders the countdown and "Only 25 of 25 launch seats left"** | Conversion effect unmeasured — hypothesis only | Finish |
| 6 | Competitor claims corrected against each vendor's own site | `compare/[slug].astro` — **yes** (Onsite pricing, Powerplay payroll, Procore residency, Odoo hosting, RDash funding/pricing) | Source review + dated vendor pages | No | — | **Production still shows the incorrect claims** | — | Finish. Powerplay has since migrated to `getpowerplay.ai`; re-verify that page before further edits |
| 7 | Calculators unit-tested, three arithmetic defects fixed | `src/lib/calc-formulas.js` — **yes** | 23 tests; **browser-verified** `/tools/gst` removes 18% from ₹1,18,000 → ₹1,00,000 | No | — | Not in production | — | Finish |
| 8 | Measured performance fixes (font CSS 18,776 B → 3,762 B, hero not lazy, logo dimensions, image cache headers) | `BaseLayout`, `index.astro`, `Header`/`Footer`, `vercel.json` — **yes** | Both font URLs fetched and diffed; browser-verified rendering | No | — | Not in production (`wght@300;400;…` still served) | **Field data BLOCKED** — no CrUX/PSI, so no LCP/INP/CLS claim | Finish |
| 9 | **NEW this round — `/scorecard` asked for a diagnostic but registered a masterclass seat** | `RegisterForm` was rendered with `source="scorecard"` while every string and the payload's `event` said masterclass — **now fixed** via `src/lib/lead-intents.js` | `tests/intents.test.mjs`; **browser-verified end to end** (below) | No | — | **Production still shows "Reserve my free seat" / "Your seat is reserved 🎟️" on `/scorecard`** | Sales-record mislabelling is a code fact; volume lost is **not measurable** here | Newly required — done |
| 10 | **NEW this round — a Meta `Lead` event fired when the scorecard score was computed**, before any contact details existed | `scorecard.astro` — **now removed**; replaced with a `scorecard_completed` interaction event | `tests/intents.test.mjs`; browser: `fbq` calls = 0 on score, 1 after accepted submission | No | — | **Production still fires it** | Would have inflated "leads" in any pixel-based optimisation | Newly required — done |
| 11 | Stale `netlify.toml` alongside `vercel.json` | Present, unchanged | — | — | — | Harmless today (Vercel serves), but it is a second deploy contract that could confuse a future release | — | **Blocked on owner decision** — delete or keep deliberately |

## This round's new work (evidence)

**Typed intent contract** — `src/lib/lead-intents.js` defines `demo_request`, `diagnostic_request`, `webinar_registration`, `resource_request`, `pilot_enquiry`. Each carries its own button label, pending text, confirmation wording and WhatsApp intro; **only `webinar_registration` may carry an `event` name.** Every form now sends `intent` + `placement` alongside the existing `source`, which is preserved verbatim so the ERP receiver keeps working unchanged — this is additive, not a schema break.

Browser evidence, local production build, stubbed endpoint (no production CRM was touched):

| Scenario | Result |
|---|---|
| `/scorecard` completed | `fbq` calls **0**; `dataLayer` has `scorecard_completed` only; button reads **"Send me my leak breakdown"**; note says "no masterclass sign-up" |
| `/scorecard` submit, endpoint returns JSON `{ok:true,id:"TEST-1"}` | Payload `intent=diagnostic_request`, `placement=scorecard-result`, `source=scorecard`, `context="Leak score 30/100 · Severe risk · est. ₹87.5 L/yr · gaps…"`, **`event` absent**, `X-Request-Id` header present. Confirmation reads **"Got it — your breakdown is on its way."** One `generate_lead` with `lead_intent`, no PII. Pixel fires once, after acceptance |
| `/webinar` submit, endpoint returns **HTTP 200 with HTML** | **No confirmation shown**, no `generate_lead`, no pixel; entered data kept; recovery panel shown; WhatsApp text encoded once and carries `Event: The EPC Contractor's Profit Masterclass` |

`npm run build` passes (41 pages). `npm test` — **86 tests, 0 failures.**

## What is explicitly NOT claimed

- No ranking, impression, indexation or lead-volume change is claimed. **No GSC, GA4, GTM, Ads or Ahrefs access exists** (see `TOOL_ACCESS.md`), so there is no before/after outcome column that can honestly be filled.
- Schema validity was measured with the schema.org validator (0 errors). That is **syntax validity, not Google rich-result eligibility**, and FAQ rich results are no longer supported regardless.
- No production CRM lead was created. Acceptance behaviour was proven against stubbed responses; the **real endpoint's success contract is still unconfirmed**.
- Nothing has been deployed. Production still runs `fef5f86`.

## Rollback

One branch, two prior commits plus this one, no data migration, no URL deleted or redirected. `git revert` the merge, or flip the individual switches: `countdown.enabled`, `offer.showSeatsLeft`, `SITE.url`, the `vercel.json` `cleanUrls`/`trailingSlash` keys. Intent changes revert with the branch; the receiver keeps working either way because `source` was never removed.


---

## Round 3 — released to production 2026-09-23

| # | Change | Implemented | Tested | Deployed | Production verification | Outcome measurable? |
|---|---|---|---|---|---|---|
| 12 | Merge of PR #8 (all earlier fixes) | `48d6e69` | 86 tests | **Yes** | Verified live: `AggregateOffer` INR 72,000–3,00,000, `+917009987817`, one Organization, canonical `https://www.sotyn.ai/...`, `/pricing/` and `/index.html` → 308, sitemap 38 URLs without noindex pages, scorecard copy, countdown and "25 of 25 seats" gone, corrected competitor claims, font `wght@400..900` | No — no GSC/GA4 |
| 13 | **Regression I caused:** `X-Request-Id` was not in the endpoint's `Access-Control-Allow-Headers`, so the preflight failed and **no lead could be submitted from the live site** for ~1h35m | `b82c7c2` (PR #10) | 88 tests incl. 2 regressions | **Yes** | An authorised QA submission then reached the ERP and returned `{"ok":true,"id":7}` | Forms showed the honest failure panel throughout — no lead was lost to a false success |
| 14 | **Lead endpoint contract documented** | — | — | — | `200`, `application/json; charset=utf-8`, body `{"ok":true,"id":7,"duplicate":true}`. The endpoint de-duplicates by contact, so repeat QA submissions map to one record | — |
| 15 | Google Sheets register + same-origin intake `/api/lead` | `2166495` (PR #11) | 113 tests (25 new) | **Yes** | `GET /api/lead` → 405 (exists); QA POST → `{"ok":true,"id":"SOTYN-20260923-U4GF82","erp":"ok","erpRef":"7","sheet":"not_configured","isTest":true}`; invalid payload → 422 `["name_required","phone_invalid"]`; honeypot → silently ignored; browser scorecard QA through `/api/lead` showed the diagnostic confirmation | Sheet rows **pending** the Apps Script deploy + 2 env vars |

**Spreadsheet created:** [SOTYN Website Leads](https://docs.google.com/spreadsheets/d/1RUuz2bdpzI--arBU2rkp1Rm_JUpTI7rMU77QE-aBmUc/edit) — website enquiries only, shared with dme@securedengineers.com. Setup steps in [SHEETS_SETUP.md](SHEETS_SETUP.md).

**Test lead IDs:** `SOTYN-20260923-U4GF82` (intake QA, ERP ref 7) · ERP record **7** (browser demo-form QA, before the intake existed) · one scorecard diagnostic QA through `/api/lead`. All carry `is_test` or the "SOTYN WEBSITE TEST" label and are excluded from Dashboard totals.
