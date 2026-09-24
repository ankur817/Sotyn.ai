/**
 * The three workflow checklists. This file is the single source for both the
 * on-page version and the downloadable file (scripts/build-checklist-files.mjs),
 * so what a visitor reads and what they download cannot drift apart.
 *
 * These are operating checks any contractor can run with a pen. Where sotyn.ai
 * does something relevant it is said plainly in `system`, but no check depends
 * on buying software — a checklist that only works if you buy the product is an
 * advert, not a checklist.
 */

export const CHECKLISTS = {
  "purchase-approval-checklist": {
    slug: "purchase-approval-checklist",
    file: "construction-purchase-approval-checklist.csv",
    eyebrow: "Free checklist · India · no sign-up",
    h1: "Construction purchase-approval checklist",
    title: "Purchase Approval Checklist for Contractors | sotyn.ai",
    description:
      "18 checks for approving construction purchases: what an indent must carry, when to compare rates, who approves at which value. Free file, no sign-up.",
    lead: "Most site purchases go wrong before anyone signs anything — an indent with no quantity basis, a rate nobody compared, an approval that happened on WhatsApp. These are the checks to run at each step, and what to look at when you run them.",
    workflow: { href: "/construction-procurement-software", label: "See the procurement workflow" },
    demoFrom: "procurement",
    howToUse: [
      "Print it, or open the file in Excel or Google Sheets and use the Done / Owner / Notes columns.",
      "Run it against three purchases you made last month — a small one, a big one and an urgent one. The urgent one is where the control breaks.",
      "Anything you cannot evidence in writing is a gap, even if everyone remembers it going fine.",
    ],
    groups: [
      {
        name: "Before the indent leaves site",
        icon: "box",
        items: [
          { check: "The indent names the project and the BOQ line or work item it is for.", why: "A purchase with no work attached to it cannot be reconciled later, and it is the easiest place for quantity to inflate.", look: "Does the indent form have a project and BOQ/item field, and is it filled?" },
          { check: "The quantity has a basis — drawing, BOQ, measurement or consumption rate.", why: "\"Send 120 m\" and \"120 m per the BOQ line\" look the same on paper and behave very differently at reconciliation.", look: "Ask the person who raised it how they arrived at the number." },
          { check: "Existing stock and other sites were checked first.", why: "Two sites buying the same item in the same week at two rates is the most common avoidable loss in multi-site work.", look: "Stock register or system stock at the time of the indent." },
          { check: "The required-by date is realistic and recorded.", why: "Fake urgency is how rate comparison gets skipped. If everything is urgent, nothing is.", look: "Compare required-by dates against actual delivery dates for last month." },
          { check: "The specification is complete enough to quote against.", why: "Vendors quoting different specifications are not comparable, and the difference surfaces as a debit note later.", look: "Could a vendor quote from this line without phoning you?" },
        ],
      },
      {
        name: "Getting a rate you can defend",
        icon: "layers",
        items: [
          { check: "The vendor is on your approved list, with GST and bank details on record.", why: "Ad-hoc vendors are where compliance problems and fake invoices enter.", look: "Vendor master: GSTIN, PAN, bank account, date added, who added them." },
          { check: "At least two comparable quotes above your agreed value threshold.", why: "One quote is a price, not a rate. The threshold is yours to set — what matters is that it exists and is followed.", look: "Written quotes against one specification, dated." },
          { check: "The comparison is on landed cost, not headline rate.", why: "Freight, loading, GST treatment and payment terms routinely move the winner.", look: "Does the comparison sheet have columns for freight and terms?" },
          { check: "A rate contract is used where one exists.", why: "Rate contracts stop being useful the moment buyers forget they exist.", look: "List of live rate contracts, and whether the last five POs used them." },
          { check: "The reason for not choosing the lowest rate is written down.", why: "There are good reasons — delivery, quality, credit. An unwritten reason looks identical to a kickback in an audit.", look: "A reason field on the comparison, not a verbal explanation." },
        ],
      },
      {
        name: "Approval that leaves a trail",
        icon: "check",
        items: [
          { check: "Approval limits are defined by value, and everyone knows their limit.", why: "Undefined limits mean either everything reaches the owner or nothing does.", look: "A written matrix: value band → approver. One page is enough." },
          { check: "The approver sees the comparison, not just the final number.", why: "Approving a figure without its alternatives is a signature, not a decision.", look: "What is attached to the approval request." },
          { check: "The approval is recorded with who, when and on what.", why: "This is the record that protects the approver as much as the company.", look: "Can you produce the approval for a purchase made six months ago in under a minute?" },
          { check: "Split purchases below the threshold are visible.", why: "Three POs of ₹49,000 against a ₹50,000 limit is the oldest trick in procurement.", look: "Same vendor, same item, same week — sort last quarter's POs and check." },
        ],
      },
      {
        name: "Receipt and payment",
        icon: "wallet",
        items: [
          { check: "Goods are received against the PO, with quantity and condition recorded.", why: "Without a receipt record, the bill becomes the only evidence of what arrived.", look: "Receipt note with quantity received vs ordered, signed at site." },
          { check: "Short supply, rejection and damage are recorded when they happen.", why: "Recorded three weeks later, it becomes an argument. Recorded on the day, it becomes a debit note.", look: "How many debit notes were raised last quarter, and how fast." },
          { check: "The vendor bill is checked against the PO rate and the receipt quantity before payment.", why: "This single check catches rate creep, quantity inflation and duplicate billing.", look: "Who does the three-way check, and what happens when it fails." },
          { check: "Advance payments are tracked to adjustment, not just to payment.", why: "An advance nobody recovered is a loss that never appears as one.", look: "Open advances by vendor, with age." },
        ],
      },
    ],
    example: {
      title: "What the trail looks like when it works",
      intro: "Illustrative — sample data, not a customer record.",
      rows: [
        ["Indent IND-118", "Site engineer, Project A", "120 m of 4-core 16 sq mm cable against BOQ line 4.2, required Thursday"],
        ["Comparison", "Purchase desk", "Three approved vendors, one specification, landed cost with freight"],
        ["Approval", "Approver for that value band", "Approved with the comparison attached, reason recorded for not taking L1"],
        ["PO-0442", "Purchase desk", "Issued against IND-118, with delivery date and site"],
        ["Receipt", "Store at site", "112 m received against 120 m ordered — short receipt recorded the same day"],
        ["Settlement", "Accounts", "Bill checked against PO rate and receipt quantity; debit note for 8 m"],
      ],
    },
    system:
      "sotyn.ai runs this chain as one linked record — indent against a BOQ line, RFQ comparison, value-based L1/L2 approval with the comparison attached, PO, receiving and debit note, all traceable from the original request.",
  },

  "subcontractor-bill-verification-checklist": {
    slug: "subcontractor-bill-verification-checklist",
    file: "subcontractor-bill-verification-checklist.csv",
    eyebrow: "Free checklist · India · no sign-up",
    h1: "Subcontractor bill verification checklist",
    title: "Subcontractor Bill Verification Checklist | sotyn.ai",
    description:
      "18 checks before you certify a subcontractor bill: measurement, agreed rates, recoveries, retention, TDS and the certification trail. Free file, no sign-up.",
    lead: "A subcontractor bill arrives at month end with the subcontractor's own measurement on it, and there is never enough time. These are the checks worth making anyway — in the order that catches the most money for the least effort.",
    workflow: { href: "/subcontractor-billing-software", label: "See the bill-checking workflow" },
    demoFrom: "subcontractor-billing",
    howToUse: [
      "Open the file in Excel or Sheets and keep one row per check against each bill you certify.",
      "Start with the recoveries section — advances and material issued are where the largest single misses usually are.",
      "If a check cannot be answered from documents, that is the finding. Write it in Notes rather than passing the bill.",
    ],
    groups: [
      {
        name: "The measurement",
        icon: "book",
        items: [
          { check: "The claimed quantity is measured, not estimated.", why: "A bill built from a percentage of completion is an opinion with a number on it.", look: "Measurement sheet or MB entry with dates and locations." },
          { check: "Your own engineer recorded or verified the measurement.", why: "Accepting the subcontractor's measurement unchecked is the single most expensive habit in subcontract billing.", look: "Whose signature is on the measurement, and when it was taken." },
          { check: "Cumulative quantity is checked against the previous bill and the contract quantity.", why: "Over-billing shows up in the running total long before it shows up in one bill.", look: "Previous bill's cumulative figure — does this bill start where that one ended?" },
          { check: "Work billed matches work actually approved in progress records.", why: "If the DPR and the bill disagree, one of them is wrong and it matters which.", look: "Daily reports or progress records for the billing period." },
          { check: "Extra items and variations are separately identified and authorised.", why: "Variations buried inside a normal line item become permanent and unquestioned.", look: "Is there a written authorisation for each extra item claimed?" },
        ],
      },
      {
        name: "The rate",
        icon: "trending-up",
        items: [
          { check: "Every rate matches the signed work order or rate master.", why: "Typed rates drift. This check takes minutes and finds real money.", look: "Work order rate vs billed rate, line by line." },
          { check: "Rates for extra items were agreed before the work, not after.", why: "A rate negotiated after work is complete is a rate you will lose.", look: "Date of the rate approval vs the date the work was done." },
          { check: "Unit of measurement matches the contract.", why: "Running metre billed against square metre rates is a quiet, repeatable error.", look: "Unit column on the bill against the work order." },
          { check: "Escalation, if any, is applied per the contract clause.", why: "Escalation applied generously is rarely noticed until the project P&L is final.", look: "The clause itself, and the index or basis it names." },
        ],
      },
      {
        name: "Recoveries and deductions",
        icon: "wallet",
        items: [
          { check: "All advances paid are recovered per the agreed schedule.", why: "This is the most commonly missed deduction, and it compounds across bills.", look: "Ledger of advances against this package, and what has been recovered so far." },
          { check: "Material issued by you is charged at the agreed rate.", why: "Material issued and never recovered is a direct transfer of margin.", look: "Material issue records for the period against the recovery line on the bill." },
          { check: "Debits for damage, rework or idle-machinery use are applied.", why: "Debits agreed verbally at site rarely reach the bill.", look: "Site correspondence for the period — was anything agreed that is not on this bill?" },
          { check: "Retention is deducted at the contract percentage.", why: "Two bills on one package computed two different ways is common, and always in one direction.", look: "Retention on this bill against retention on the last one." },
          { check: "TDS and any statutory deduction are applied on the correct base.", why: "Deducting on the wrong base is a compliance problem, not just an arithmetic one.", look: "Confirm the base with your accountant once, then apply it the same way every time." },
        ],
      },
      {
        name: "Certification and payment",
        icon: "shield",
        items: [
          { check: "The certified value is signed by someone authorised to certify it.", why: "Certification is a commitment to pay. It deserves a name against it.", look: "Who certified, on what date, and whether they were authorised to." },
          { check: "The bill number and period are unique and not previously certified.", why: "Duplicate certification happens most often when a bill is revised and resubmitted.", look: "Register of certified bills for this package." },
          { check: "Retention held to date is visible, with its release conditions.", why: "Retention nobody tracks becomes retention nobody claims — or releases twice.", look: "Retention ledger per package, with defect liability dates." },
          { check: "The payment matches the certified value, and the difference is explained if not.", why: "Payments that quietly differ from certifications make every later reconciliation impossible.", look: "Bank payment against certified amount for the last five bills." },
        ],
      },
    ],
    example: {
      title: "One bill, checked",
      intro: "Illustrative figures for a single package — sample data, not a customer's account.",
      rows: [
        ["Claimed", "Subcontractor", "1,940 m conduiting for the period"],
        ["Measured", "Your site engineer", "1,860 m measured and recorded against the MB"],
        ["Priced", "From the rate master", "₹42/m agreed in the work order → ₹78,120 gross"],
        ["Recovered", "Accounts", "Advance ₹15,000 · material issued ₹6,400"],
        ["Deducted", "By rule", "Retention 5% = ₹3,906 · TDS 1% = ₹781"],
        ["Certified", "Authorised approver", "₹52,033 net, with the 80 m difference raised before certification"],
      ],
    },
    system:
      "sotyn.ai prices the bill from the agreed rate master rather than from the bill, applies advances, material issued, retention and TDS in one fixed order on every bill, and records who checked and who certified.",
  },

  "erp-migration-checklist": {
    slug: "erp-migration-checklist",
    file: "construction-erp-migration-checklist.csv",
    eyebrow: "Free checklist · India · no sign-up",
    h1: "Construction ERP migration checklist",
    title: "Construction ERP Migration Checklist | sotyn.ai",
    description:
      "21 checks for moving a contracting business off Excel: masters, live projects, opening balances, training and what go-live must mean. Free file, no sign-up.",
    lead: "Contractor ERP rollouts rarely fail on features. They fail because the masters were never cleaned, the running projects were never brought across, and nobody wrote down what had to be true before the spreadsheets stopped. This is the sequence that avoids that — whoever you buy from.",
    workflow: { href: "/construction-erp-implementation", label: "See how implementation runs" },
    demoFrom: "implementation",
    howToUse: [
      "Use it before you sign, not after. Half of these checks are questions for your vendor.",
      "Assign an owner per row on your side. A migration with no named data owner stalls at the first disagreement about which rate is correct.",
      "Treat the go-live section as a contract with yourself — agree it in writing before the work starts.",
    ],
    groups: [
      {
        name: "Before you commit",
        icon: "target",
        items: [
          { check: "You have written down the three workflows that must work on day one.", why: "\"Everything\" is not a scope. Three workflows can be tested; everything cannot.", look: "Your own list — typically site reporting, procurement and billing." },
          { check: "You know who owns the data on your side.", why: "Migration stalls the first time nobody can say which of three rates is right.", look: "One named person for masters, one for projects, one for balances." },
          { check: "You have asked what is included in onboarding and what is chargeable.", why: "Implementation cost is where quoted price and final invoice usually part company.", look: "Get it in writing: migration, training sessions, configuration, support period." },
          { check: "You know what happens to your existing accounting system.", why: "Most contractors keep their accounting software. Find out whether it is a migration or an ongoing integration — they are very different promises.", look: "Ask specifically: one-time import, or continuous two-way sync?" },
          { check: "You have agreed what 'go-live' means and who signs it off.", why: "Without acceptance criteria, a rollout has no end and the spreadsheets never stop.", look: "A short written list: these workflows, running in the system, signed by these people." },
        ],
      },
      {
        name: "Masters — where the work actually is",
        icon: "layers",
        items: [
          { check: "Item master is de-duplicated before import.", why: "The same cable in four spellings at three rates produces confident, wrong reporting forever.", look: "Sort your item list alphabetically and read it. You will find them." },
          { check: "Vendor master has GSTIN, PAN and bank details, with dead vendors removed.", why: "Importing dead vendors carries a decade of noise into a clean system.", look: "Vendors with no transaction in 24 months." },
          { check: "Labour and subcontract rate masters reflect current signed contracts.", why: "Bills will be checked against these rates. Wrong rates are worse than no rates.", look: "Spot-check ten rates against the actual work orders." },
          { check: "Cost heads and BOQ structure are agreed before anything is imported.", why: "Changing the structure after data is in is the most expensive rework in any rollout.", look: "One page: how you want to see cost, and whether reports can produce it." },
          { check: "Users and their roles are listed, including site staff.", why: "Role design decides whether site staff actually use the system or work around it.", look: "Who raises, who approves, who sees money. Write it as a table." },
        ],
      },
      {
        name: "Live projects and balances",
        icon: "box",
        items: [
          { check: "Running projects are migrated with their BOQs, not just new ones.", why: "If only new projects go in, two systems run in parallel and one of them wins — usually the spreadsheet.", look: "Count your live projects. All of them should appear in the plan." },
          { check: "Work already executed on those projects is brought in as opening position.", why: "Otherwise the first RA bill from the new system is wrong, and trust is lost in week one.", look: "Cumulative quantity billed per project, as at the cut-off date." },
          { check: "Opening receivables, payables and retention held are entered and agreed.", why: "Without them the first month's cash view is fiction.", look: "Tie the totals to your books at the cut-off date, and have your accountant sign it." },
          { check: "Open advances with subcontractors and vendors are carried over.", why: "An advance that does not migrate is an advance nobody recovers.", look: "Ledger of open advances at cut-off." },
          { check: "A cut-off date is fixed, and everyone knows what happens either side of it.", why: "Ambiguity about the cut-off produces double entry and missing entry at once.", look: "One date, written down, communicated to site and office." },
        ],
      },
      {
        name: "People and go-live",
        icon: "users",
        items: [
          { check: "Training is by role and uses your own data, not a demo company.", why: "Generic training does not survive contact with a real site.", look: "Separate sessions for site staff and office staff, on your migrated projects." },
          { check: "Site staff can do their part on the phone they already have.", why: "If the field cannot file from a phone, the data stops at the office and the system becomes a reporting burden.", look: "Have one site engineer file a daily report during the demo, on their own handset." },
          { check: "A parallel-run period is defined — and has an end date.", why: "Parallel running without an end date is how a rollout quietly becomes permanent duplication.", look: "Two to four weeks is typical. Write the end date down." },
          { check: "Acceptance criteria are tested and signed before the old way stops.", why: "This is the moment the rollout either lands or drifts.", look: "Each agreed workflow demonstrated end to end, signed by the person who owns it." },
          { check: "You know who to call, and what the support arrangement is.", why: "The first month generates more questions than the next year.", look: "Named contact, hours, channel, and what counts as chargeable." },
          { check: "You have a rollback position if go-live fails.", why: "Rarely needed, and the day you need it you will need it badly.", look: "Your exported data, and the date until which the old system stays available." },
        ],
      },
    ],
    example: {
      title: "A four-week sequence that works",
      intro: "Illustrative plan for a mid-sized contractor — yours is agreed before work starts and may differ.",
      rows: [
        ["Week 1", "You + the vendor", "Item, vendor and rate masters exported, de-duplicated, imported, checked by your team"],
        ["Week 2", "You + project leads", "Live projects with BOQs and contract values, plus work already executed"],
        ["Week 2–3", "Your accounts team", "Opening receivables, payables, retention and advances, tied to the books"],
        ["Week 3", "The vendor", "Training by role, on your own migrated data, site and office separately"],
        ["Week 4", "Both, against criteria", "DPRs filed daily, indents raised in the system, one full billing cycle, then sign-off"],
      ],
    },
    system:
      "This is the sequence sotyn.ai onboarding follows, with the one-time onboarding fee stated on the pricing page and acceptance criteria agreed in writing before go-live.",
  },
};

export const CHECKLIST_LIST = Object.values(CHECKLISTS);
export const countChecks = (c) => c.groups.reduce((n, g) => n + g.items.length, 0);
