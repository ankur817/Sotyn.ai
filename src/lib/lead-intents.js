/**
 * Typed intent contract for every form on the site.
 *
 * The problem this solves: /scorecard rendered the webinar registration
 * component, so a contractor asking for their leak-score follow-up pressed
 * "Reserve my free seat", was told "Your seat is reserved 🎟️", and arrived in
 * the CRM tagged with the masterclass event. The form's promise, its
 * confirmation and the sales record must describe the same thing.
 *
 * `intent` is WHAT the visitor asked for. `placement` is WHERE the form was —
 * both are independent of the acquisition channel, which travels separately as
 * referrer/landingSearch.
 *
 * `event` is written into the payload only for intents that really concern a
 * scheduled event. Nothing else may carry a masterclass name.
 */

export const INTENTS = {
  demo_request: {
    intent: "demo_request",
    submit: "Book my free demo",
    pending: "Sending…",
    doneTitle: "Request received.",
    doneBody:
      "We'll WhatsApp you to agree a time for a 20-minute walkthrough on your own numbers. Nothing is booked until you confirm that time.",
    note: "No spam. We'll WhatsApp you to agree a time for a 20-minute walkthrough on your own numbers.",
    waIntro: "New sotyn.ai demo request",
    carriesEvent: false,
  },
  diagnostic_request: {
    intent: "diagnostic_request",
    submit: "Send me my leak breakdown",
    pending: "Sending…",
    doneTitle: "Got it — your breakdown is on its way.",
    doneBody:
      "We'll WhatsApp you the line-by-line breakdown behind your score, and what it would take to close the biggest gaps. No obligation.",
    note: "Free. We'll WhatsApp the breakdown behind your score — no masterclass sign-up, no spam.",
    waIntro: "Profit leak scorecard — send me the breakdown",
    carriesEvent: false,
  },
  webinar_registration: {
    intent: "webinar_registration",
    submit: "Reserve my free seat",
    pending: "Sending your registration…",
    doneTitle: "Your seat is reserved 🎟️",
    doneBody: "We'll WhatsApp you the joining link and a reminder before it starts. See you there!",
    note: "Free. We'll WhatsApp you the joining link & a reminder.",
    waIntro: "Webinar registration",
    carriesEvent: true,
  },
  resource_request: {
    intent: "resource_request",
    submit: "Send it to me",
    pending: "Sending…",
    doneTitle: "You're all set.",
    doneBody: "Thanks! We'll be in touch on WhatsApp with the full version.",
    note: "No spam — just practical EPC guides, occasionally. Your data stays in India.",
    waIntro: "Resource request",
    carriesEvent: false,
  },
  pilot_enquiry: {
    intent: "pilot_enquiry",
    submit: "Talk to us about a pilot",
    pending: "Sending…",
    doneTitle: "Request received.",
    doneBody: "We'll WhatsApp you to talk through scope, timeline and what a paid pilot would cover.",
    note: "We'll come back to you with scope and timelines before anything is agreed.",
    waIntro: "Paid pilot enquiry",
    carriesEvent: false,
  },
};

/** Never throws: an unknown intent falls back to the most neutral one. */
export function getIntent(name) {
  return INTENTS[name] || INTENTS.resource_request;
}

/**
 * Build the part of the lead payload that describes what was asked for.
 * `source` is preserved verbatim for the existing receiver — this only ADDS
 * fields, so the ERP endpoint keeps working unchanged.
 */
export function intentPayload({ intent, placement, source, event, context }) {
  const def = getIntent(intent);
  const out = {
    intent: def.intent,
    placement: placement || "",
    source: source || placement || def.intent, // backward compatible
  };
  // A resource or diagnostic request must never carry an event name.
  if (def.carriesEvent && event) out.event = event;
  // Diagnostic context travels with the lead (never to analytics), and only
  // because the visitor pressed submit.
  if (context) out.context = context;
  return out;
}
