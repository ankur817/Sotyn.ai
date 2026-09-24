/**
 * Writes the downloadable checklist files from src/data/checklists.js, so the
 * file a visitor downloads is the same checklist the page shows.
 *
 * CSV, because it opens in Excel, Google Sheets and LibreOffice without a
 * plugin, and a contractor can actually fill in the Done / Owner / Notes
 * columns. Run: npm run checklists
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { CHECKLISTS, countChecks } from "../src/data/checklists.js";

const OUT = new URL("../public/downloads/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

for (const c of Object.values(CHECKLISTS)) {
  const lines = [];
  lines.push([c.h1].map(esc).join(","));
  lines.push([`${countChecks(c)} checks · sotyn.ai · https://www.sotyn.ai/resources/${c.slug}`].map(esc).join(","));
  lines.push([""].join(","));
  lines.push(["How to use this"].map(esc).join(","));
  for (const h of c.howToUse) lines.push(["", h].map(esc).join(","));
  lines.push([""].join(","));
  lines.push(["#", "Section", "Check", "Why it matters", "What to look at", "Done (Y/N)", "Owner", "Date", "Notes"].map(esc).join(","));

  let n = 0;
  for (const g of c.groups) {
    for (const item of g.items) {
      n++;
      lines.push([n, g.name, item.check, item.why, item.look, "", "", "", ""].map(esc).join(","));
    }
  }

  lines.push([""].join(","));
  lines.push([c.example.title].map(esc).join(","));
  lines.push([c.example.intro].map(esc).join(","));
  for (const row of c.example.rows) lines.push(["", ...row].map(esc).join(","));

  lines.push([""].join(","));
  lines.push(["Free to use and share. No sign-up, no attribution required."].map(esc).join(","));
  lines.push([`Workflow page: https://www.sotyn.ai${c.workflow.href}`].map(esc).join(","));

  const path = new URL(c.file, OUT);
  // BOM so Excel opens ₹ and other UTF-8 characters correctly on Windows.
  writeFileSync(path, "﻿" + lines.join("\r\n") + "\r\n");
  console.log(`${c.file}: ${countChecks(c)} checks, ${lines.length} rows`);
}
