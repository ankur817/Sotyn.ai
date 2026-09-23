/**
 * Shared client-side lead delivery.
 *
 * Rules this file exists to enforce (see tests/lead-client.test.mjs):
 *  1. A form may only show "received" after the endpoint DURABLY accepted the
 *     lead: HTTP ok + a JSON body. An HTTP 200 carrying HTML (a catch-all page,
 *     a login wall, a CDN error page) is a FAILURE, not an acceptance.
 *  2. User-entered text is encoded exactly ONCE when built into a wa.me URL.
 *  3. Nothing here sends personal data to analytics.
 */

/** Build a WhatsApp deep link. `lines` are plain text — encoded once, here. */
export function waLink(phone, lines) {
  const body = (Array.isArray(lines) ? lines : [String(lines)])
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
}

/**
 * Decide whether a response counts as a durably accepted lead.
 * Returns { accepted, leadId, reason }.
 */
export function readAcceptance(res, rawBody) {
  if (!res || !res.ok) {
    return { accepted: false, leadId: null, reason: `http_${res ? res.status : "no_response"}` };
  }
  const type = (res.headers && res.headers.get && res.headers.get("content-type")) || "";
  if (!/\bapplication\/(problem\+)?json\b/i.test(type)) {
    // HTTP 200 + HTML is the classic silent-loss case: the request "worked" but
    // no lead was ever created.
    return { accepted: false, leadId: null, reason: "non_json_response" };
  }
  let body;
  try {
    body = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
  } catch {
    return { accepted: false, leadId: null, reason: "unparseable_json" };
  }
  if (body && (body.ok === false || body.error)) {
    return { accepted: false, leadId: null, reason: "endpoint_rejected" };
  }
  const leadId = (body && (body.id || body.leadId || body.lead_id)) || null;
  return { accepted: true, leadId: leadId ? String(leadId) : null, reason: "accepted" };
}

/** Random idempotency key so a retry cannot create a second lead. */
export function newRequestId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `r-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

/**
 * POST a lead. Never throws. Resolves { accepted, leadId, reason }.
 * `requestId` must stay the same across retries of the same submission.
 */
export async function submitLead(endpoint, payload, { requestId, timeoutMs = 12000, fetchImpl } = {}) {
  if (!endpoint) return { accepted: false, leadId: null, reason: "no_endpoint" };
  const doFetch = fetchImpl || (typeof fetch !== "undefined" ? fetch : null);
  if (!doFetch) return { accepted: false, leadId: null, reason: "no_fetch" };

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const res = await doFetch(endpoint, {
      method: "POST",
      // Only simple headers. The lead endpoint's CORS allow-list is
      // `Content-Type` alone, so any custom header (an X-Request-Id, say) makes
      // the preflight fail and every browser submission is blocked before it is
      // sent. Idempotency therefore travels in the body as `requestId`.
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, requestId }),
      signal: controller ? controller.signal : undefined,
    });
    const raw = await res.text().catch(() => "");
    return readAcceptance(res, raw);
  } catch (err) {
    const aborted = err && (err.name === "AbortError" || err.name === "TimeoutError");
    return { accepted: false, leadId: null, reason: aborted ? "timeout" : "network_error" };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Fire conversion events once per accepted lead. PII never leaves the page:
 * only the source, the page path and an opaque lead id are passed on.
 */
export function trackAcceptedLead({ source, intent, page, leadId }) {
  const key = `lead_tracked_${leadId || source}`;
  try {
    if (window.__sotynTracked && window.__sotynTracked[key]) return false;
    window.__sotynTracked = window.__sotynTracked || {};
    window.__sotynTracked[key] = true;
  } catch {
    /* ignore */
  }
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "generate_lead", lead_source: source, lead_intent: intent || undefined, lead_page: page, lead_id: leadId || undefined });
  } catch {
    /* ignore */
  }
  try {
    if (window.fbq) window.fbq("track", "Lead", { content_name: intent || source });
  } catch {
    /* ignore */
  }
  return true;
}
