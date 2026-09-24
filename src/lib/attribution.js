/**
 * First-touch attribution.
 *
 * The bug this fixes: the lead carried `document.referrer` at the moment of
 * submission. A buyer who arrives from Google, reads the procurement page and
 * then opens /demo was recorded as "internal" — the real source was overwritten
 * by their own navigation. And the referrer was being written into the sheet's
 * "Landing page" column, which is not what that column means.
 *
 * So the first page of the visit, the referrer that brought them, and any
 * campaign parameters are captured ONCE and kept for the session.
 *
 * sessionStorage only: no cookie, no cross-site identifier, nothing personal.
 * Every access is wrapped — private mode and blocked storage must not break a
 * form.
 */

const KEY = "sotyn_first_touch";

/** Call on every page load. Writes once; later pages never overwrite it. */
export function captureFirstTouch() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const ref = document.referrer || "";
    let external = "";
    if (ref) {
      try {
        external = new URL(ref).hostname.replace(/^www\./, "").endsWith("sotyn.ai") ? "" : ref;
      } catch {
        external = "";
      }
    }
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        landing: location.pathname.slice(0, 200),
        referrer: external.slice(0, 500),
        search: location.search.slice(0, 500),
        at: new Date().toISOString(),
      })
    );
  } catch {
    /* storage unavailable — the lead still sends, just without first-touch */
  }
}

/** Returns { firstLanding, firstReferrer, firstSearch } — always safe to spread. */
export function getFirstTouch() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return {};
    const t = JSON.parse(raw);
    return {
      firstLanding: t.landing || "",
      firstReferrer: t.referrer || "",
      firstSearch: t.search || "",
      firstSeenAt: t.at || "",
    };
  } catch {
    return {};
  }
}
