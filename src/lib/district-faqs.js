/**
 * District page FAQs, in one place.
 *
 * The page renders these AND marks them up as FAQPage. Keeping both from one
 * source is the point: schema that says something the visitor cannot see is
 * the defect this file exists to prevent.
 */
export function districtFaqs(district, SITE) {
  const p = district.publication;
  const a = SITE.address;
  return [
    {
      q: `Do you have an office in ${district.district_name}?`,
      a: p.office_here
        ? `Yes — our office is at ${a.street}, ${a.city} ${a.postalCode}, and the team that built sotyn.ai runs its own contracting business from here. Support and onboarding are still delivered online, the same as everywhere else; we are not offering site visits as part of the subscription.`
        : `No. Our office is in ${a.city}, ${a.region}. Onboarding and support for ${district.district_name} are delivered online, and we would rather say that plainly than imply a local branch.`,
    },
    {
      q: "Can my site staff use it on their phones?",
      a: "Yes — through the browser, on any phone, and site users are not charged per seat. Native Android and iOS apps are not released yet.",
    },
    {
      q: "We run on Tally and Excel. Do we start over?",
      a: "No. Your masters, live projects, BOQs, vendors and opening balances are migrated at setup. Accounting stays where your accountant wants it; projects, procurement and billing move here.",
    },
    {
      q: "Is support available in my language?",
      a: "Support is in English today. Other Indian languages are being rolled out, and we will not promise support in one before it is real.",
    },
    {
      q: "What if it does not suit us?",
      a: `${SITE.pricing.guarantee}. ${SITE.pricing.guaranteeNote}`,
    },
  ];
}
