/**
 * Location registry access + the publication gate.
 *
 * Two separate ideas, deliberately kept apart:
 *   - REGISTRY  — every officially verified district. Geography, nothing more.
 *   - PUBLISHED — the districts that have earned a standalone page.
 *
 * A district being in the registry does NOT create a public URL. Routes are
 * generated only from `publication.json` records marked `approved`, each of
 * which has to name the district-specific reason the page exists. That is what
 * keeps this a coverage system rather than a doorway-page generator.
 */

import registry from "../data/locations/districts.json";
import publication from "../data/locations/publication.json";

export const SNAPSHOT = registry.snapshot;
export const STATES = registry.states || [];

/** Every ACTIVE district, flattened, with its state attached. Abolished and
 *  disputed records stay in the registry (for successor mapping and history)
 *  but are never offered as coverage, lookups or pages. */
export function allDistricts() {
  return STATES.flatMap((s) =>
    (s.districts || []).filter((d) => (d.status || "active") === "active").map((d) => ({
      ...d,
      state_code: s.state_code,
      state_name: s.state_name,
      state_slug: s.state_slug,
      state_type: s.type,
    }))
  );
}

export function getState(slug) {
  return STATES.find((s) => s.state_slug === slug) || null;
}

/** District codes are the identity; names repeat across states. */
export function getDistrictByCode(code) {
  return allDistricts().find((d) => d.district_code === code) || null;
}

/** Non-active records, kept for successor mapping — never rendered. */
export function historicalDistricts() {
  return STATES.flatMap((s) =>
    (s.districts || []).filter((d) => (d.status || "active") !== "active").map((d) => ({ ...d, state_slug: s.state_slug, state_name: s.state_name }))
  );
}

export function getDistrict(stateSlug, districtSlug) {
  const state = getState(stateSlug);
  if (!state) return null;
  const d = (state.districts || []).find((x) => x.district_slug === districtSlug && (x.status || "active") === "active");
  return d ? { ...d, state_code: state.state_code, state_name: state.state_name, state_slug: state.state_slug } : null;
}

/**
 * The publication gate. A record must be `approved`, must resolve to a real
 * district in the registry, and must carry a stated reason and evidence —
 * otherwise no page is generated, however complete the record looks.
 */
export function publishedDistricts() {
  return (publication.records || [])
    .filter((r) => r.status === "approved")
    .map((r) => {
      const d = getDistrictByCode(r.district_code);
      if (!d) return null;
      if (!r.reason_page_exists || !(r.evidence && r.evidence.length)) return null;
      return { ...d, publication: r };
    })
    .filter(Boolean);
}

export function isPublished(stateSlug, districtSlug) {
  return publishedDistricts().some((d) => d.state_slug === stateSlug && d.district_slug === districtSlug);
}

/** States that have at least one published district — used by the hubs. */
export function statesWithPublished() {
  const published = publishedDistricts();
  return STATES.map((s) => ({
    ...s,
    published: published.filter((d) => d.state_slug === s.state_slug),
    districtCount: (s.districts || []).length,
  }));
}

/** Registry coverage vs published pages — never conflate the two. */
export function coverageSummary() {
  const districts = allDistricts();
  const published = publishedDistricts();
  return {
    states: STATES.length,
    districts: districts.length,
    published: published.length,
    unpublished: districts.length - published.length,
    snapshot: SNAPSHOT,
  };
}

/**
 * Validate a district/state pair that arrived from a query string, before it
 * is attached to a lead. Returns the registry record or null — never the
 * caller's text.
 */
export function resolveLocationParam(stateSlug = "", districtSlug = "") {
  const safe = (v) => /^[a-z0-9-]{1,60}$/.test(String(v || "").toLowerCase());
  if (!safe(stateSlug) || !safe(districtSlug)) return null;
  return getDistrict(String(stateSlug).toLowerCase(), String(districtSlug).toLowerCase());
}
