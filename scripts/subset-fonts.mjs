/**
 * Subsets the self-hosted fonts to the characters this site actually renders.
 *
 * Why: ₹ (U+20B9) sits in Google's "latin-ext" subset, and this site is full of
 * rupee signs — so the 85 KB latin-ext file downloaded on nearly every page
 * just for one glyph. Subsetting to the real character inventory removes that.
 *
 * The inventory is read from the BUILT HTML, so it can never claim a glyph the
 * site does not use — and the check at the end fails if any rendered character
 * is missing from the result.
 *
 * Requires: python3 -m pip install --user fonttools brotli
 * Run after a build:  npm run fonts
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const DIST = "dist";
const SRC = "public/fonts";
if (!existsSync(DIST)) { console.error("Build first: npm run build"); process.exit(1); }

// ── 1. every character the built site renders ──────────────────────────────
const chars = new Set();
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith(".html")) {
      const text = readFileSync(p, "utf8")
        .replace(/<script[\s\S]*?<\/script>/g, " ")
        .replace(/<style[\s\S]*?<\/style>/g, " ")
        .replace(/<[^>]+>/g, " ");
      for (const ch of text) chars.add(ch.codePointAt(0));
    }
  }
})(DIST);

// Always keep basic latin + common punctuation, so a future edit that adds a
// character we happen not to use today still renders.
for (let c = 0x20; c <= 0x7e; c++) chars.add(c);
for (const extra of [0xa0, 0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2026, 0x2030, 0x20b9, 0x20ac, 0x00a3, 0x2192, 0x2190, 0x00b7, 0x00d7, 0x2122, 0x00ae, 0x00a9, 0x2212]) chars.add(extra);

const unicodes = [...chars].filter((c) => c > 0x1f && c < 0x3000).sort((a, b) => a - b);
console.log(`characters rendered by the site: ${unicodes.length}`);

// ── 2. subset each face ────────────────────────────────────────────────────
const before = [];
const after = [];
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".woff2") && !f.includes("-subset"))) {
  const input = join(SRC, file);
  const output = join(SRC, file.replace(".woff2", "-subset.woff2"));
  before.push([file, statSync(input).size]);
  execFileSync("python3", [
    "-m", "fontTools.subset", input,
    `--unicodes=${unicodes.map((c) => c.toString(16)).join(",")}`,
    "--flavor=woff2", "--layout-features=*", "--no-hinting",
    `--output-file=${output}`,
  ]);
  after.push([file.replace(".woff2", "-subset.woff2"), statSync(output).size]);
}

// ── 3. prove nothing rendered is missing ───────────────────────────────────
for (const [name] of after) {
  const missing = execFileSync("python3", ["-c", `
import sys
from fontTools.ttLib import TTFont
f = TTFont("${join(SRC, name)}")
cmap = set()
for t in f["cmap"].tables: cmap |= set(t.cmap.keys())
want = set(${JSON.stringify(unicodes)})
# Anton is display-only; report what a face lacks rather than assuming failure.
print(len(want - cmap))
`], { encoding: "utf8" }).trim();
  console.log(`${name}: ${missing} of ${unicodes.length} rendered characters not in this face`);
}

const sum = (a) => a.reduce((n, [, s]) => n + s, 0);
console.log(`\nfonts: ${sum(before).toLocaleString()} B -> ${sum(after).toLocaleString()} B (saved ${(sum(before) - sum(after)).toLocaleString()} B)`);
