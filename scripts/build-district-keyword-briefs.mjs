/**
 * Generates a ten-slot keyword research brief for every district in the
 * registry → seo-audit/district-keyword-briefs.csv
 *
 * These are RESEARCH CANDIDATES. There is no authorised Search Console,
 * Keyword Planner or Trends access (see docs/TOOL_ACCESS.md), so no row
 * carries a volume, a difficulty or a trend direction. A slot is only worth
 * pursuing once measured demand exists, which is why every row states its
 * confidence and its evidence gap rather than a made-up number.
 *
 * Run: npm run briefs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const SRC = new URL("../src/data/locations/districts.json", import.meta.url);
const PUB = new URL("../src/data/locations/publication.json", import.meta.url);
const OUT = new URL("../seo-audit/district-keyword-briefs.csv", import.meta.url);

if (!existsSync(SRC)) { console.error("No districts.json yet."); process.exit(1); }
const registry = JSON.parse(readFileSync(SRC, "utf8"));
const publication = JSON.parse(readFileSync(PUB, "utf8"));
const approved = new Set(
  (publication.records || []).filter((r) => r.status === "approved").map((r) => r.district_code)
);

// Slot families. `conditional` slots only make sense where that trade actually
// operates — unverified everywhere until there is evidence, and marked so.
const SLOTS = [
  { n: 1, q: (d) => `construction ERP software in ${d}`, intent: "commercial", role: "primary", url: "/", cta: "Book a contractor-software demo" },
  { n: 2, q: (d) => `EPC ERP software in ${d}`, intent: "commercial", role: "secondary", url: "/epc-erp-software", cta: "Book a contractor-software demo" },
  { n: 3, q: (d) => `ERP software for contractors in ${d}`, intent: "commercial", role: "secondary", url: "/", cta: "Book a contractor-software demo" },
  { n: 4, q: (d) => `construction project management software in ${d}`, intent: "commercial", role: "secondary", url: "/platform", cta: "Book a contractor-software demo" },
  { n: 5, q: (d) => `MEP contractor software in ${d}`, intent: "commercial", role: "conditional", url: "/solutions/mep-contractors", cta: "Book a contractor-software demo" },
  { n: 6, q: (d) => `solar EPC management software in ${d}`, intent: "commercial", role: "conditional", url: "/solutions/solar-epc", cta: "Book a contractor-software demo" },
  { n: 7, q: (d) => `RA billing software in ${d}`, intent: "commercial", role: "secondary", url: "/ra-billing-software", cta: "See the RA billing workflow" },
  { n: 8, q: (d) => `subcontractor billing software in ${d}`, intent: "commercial", role: "secondary", url: "/subcontractor-billing-software", cta: "See the bill-checking workflow" },
  { n: 9, q: (d) => `construction procurement software in ${d}`, intent: "commercial", role: "secondary", url: "/construction-procurement-software", cta: "See procurement approvals" },
  { n: 10, q: (d) => `construction ERP implementation in ${d}`, intent: "commercial", role: "secondary", url: "/construction-erp-implementation", cta: "Discuss ERP implementation for your team" },
];

// Natural alternatives worth testing before committing to a slot's phrasing.
const alternatives = (d) => [`${d} construction ERP`, `contractor software ${d}`, `ERP for contractors ${d}`].join(" | ");

const rows = [[
  "district_code","district_name","state_code","state_name","slot","query","natural_alternatives","search_intent",
  "role","data_source","data_date","geographic_scope","available_volume","confidence","target_url",
  "page_status","cta","evidence_gap",
].join(",")];

const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

let districts = 0;
for (const st of registry.states || []) {
  for (const d of st.districts || []) {
    districts++;
    const isPublished = approved.has(d.district_code);
    for (const slot of SLOTS) {
      rows.push([
        d.district_code, d.district_name, st.state_code, st.state_name, slot.n,
        slot.q(d.district_name), alternatives(d.district_name), slot.intent, slot.role,
        "none — no authorised GSC / Keyword Planner / Trends access (docs/TOOL_ACCESS.md)",
        "2026-09-23",
        "district name in query; no district-level volume data exists in any Google product",
        "unknown",
        slot.role === "conditional" ? "research candidate — trade presence unverified in this district" : "research candidate — unmeasured",
        isPublished ? `/locations/${st.state_slug}/${d.district_slug}` : slot.url,
        isPublished ? "district page published" : "served by national page + coverage hub",
        slot.cta,
        isPublished ? "measure query/page performance once Search Console access exists"
                    : "no district page: needs a locally specific reason and evidence before one is written",
      ].map(esc).join(","));
    }
  }
}

mkdirSync(new URL("../seo-audit/", import.meta.url), { recursive: true });
writeFileSync(OUT, rows.join("\n") + "\n");
console.log(`district-keyword-briefs.csv: ${districts} districts × ${SLOTS.length} slots = ${rows.length - 1} rows`);
