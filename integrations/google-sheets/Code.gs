/**
 * SOTYN Website Leads — Apps Script Web App.
 *
 * This is the only thing that writes to the spreadsheet. It runs as the sheet's
 * owner, so the spreadsheet itself stays private and no Google credential ever
 * reaches a browser. The website never calls this directly: /api/lead (server
 * side, on Vercel) does, with a shared token.
 *
 * ── Setup (about three minutes, in the owner's Google account) ──────────────
 * 1. Open the sheet → Extensions → Apps Script. Paste this file over Code.gs.
 * 2. Edit TOKEN below to a long random string of your choosing.
 * 3. Run `setup` once (it creates the Leads / Dashboard / Sync Errors tabs and
 *    asks for authorisation).
 * 4. Deploy → New deployment → Web app.
 *      Execute as:  Me
 *      Who has access:  Anyone
 *    ("Anyone" only means the URL is reachable; every request still has to
 *    carry the token below, and the sheet stays private.)
 * 5. Copy the Web app URL, then in Vercel → Settings → Environment Variables:
 *      SHEETS_WEBAPP_URL   = <the /exec URL>
 *      SHEETS_WEBAPP_TOKEN = <the TOKEN value>
 *    Redeploy the site.
 */

var TOKEN = "CHANGE-ME-to-a-long-random-string";

var LEAD_COLUMNS = [
  "Lead ID", "Received (IST)", "Name", "Company", "Phone", "Email", "City", "State", "Trade",
  "Enquiry type", "Requirement", "Landing page", "Submission page", "Form ID", "Acquisition source",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "Calculator/resource context",
  "Status", "Assigned owner", "Next follow-up", "Demo status", "Qualification", "ERP reference",
  "ERP sync", "Sheet sync", "Consent", "Is test", "Submission ID",
  "Location page state", "Location page district", "Location page district code"
];

var ERROR_COLUMNS = ["Time (IST)", "Lead ID", "Destination", "Error", "Recovery status"];

// Columns are located by header NAME, never by position, so appending a column
// (e.g. the location fields added 2026-09-23) cannot break de-duplication or
// anything the sales team has added to the right of the sheet.
function columnIndex_(sh, header) {
  var row = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  for (var i = 0; i < row.length; i++) if (row[i] === header) return i + 1;
  return 0;
}

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var leads = ensureSheet_(ss, "Leads", LEAD_COLUMNS);
  ensureSheet_(ss, "Sync Errors", ERROR_COLUMNS);
  buildDashboard_(ss);
  leads.setFrozenRows(1);
  // Phone column as plain text so numbers keep their shape.
  leads.getRange(1, 5, leads.getMaxRows(), 1).setNumberFormat("@");
  return "ready";
}

function ensureSheet_(ss, name, columns) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  // Only ever ADD headers. An existing header is left exactly as it is, so a
  // sheet the sales team has customised is never overwritten by a redeploy.
  var width = Math.max(sh.getLastColumn(), columns.length);
  var first = sh.getRange(1, 1, 1, width).getValues()[0];
  for (var c = 0; c < columns.length; c++) {
    if (first[c] !== columns[c] && !first[c]) {
      sh.getRange(1, c + 1).setValue(columns[c]).setFontWeight("bold");
    }
  }
  return sh;
}

function doPost(e) {
  var out = function (obj, code) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  };
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out({ ok: false, error: "invalid_json" });
  }
  if (body.token !== TOKEN) return out({ ok: false, error: "unauthorised" });

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialise appends so two submissions cannot collide
  try {
    if (body.action === "check") {
      return out({ ok: true, exists: findRow_(ss, body.leadId, body.submissionId) > 0 });
    }
    if (body.action !== "append") return out({ ok: false, error: "unknown_action" });

    // Sync Errors row
    if (body.sheetTab === "Sync Errors" && body.errorRow) {
      ensureSheet_(ss, "Sync Errors", ERROR_COLUMNS).appendRow(body.errorRow);
      return out({ ok: true });
    }

    // Idempotency: one row per submission. The Lead ID covers a retry of the
    // same server request; the Submission ID covers a double-click or a browser
    // retry, which arrive as two requests carrying one submission.
    var existing = findRow_(ss, body.leadId, body.submissionId);
    if (existing > 0) return out({ ok: true, row: existing, duplicate: true });

    var sh = ensureSheet_(ss, "Leads", LEAD_COLUMNS);
    sh.appendRow(body.row);
    var row = sh.getLastRow();
    sh.getRange(row, 5).setNumberFormat("@"); // phone stays text
    return out({ ok: true, row: row });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function findRow_(ss, leadId, submissionId) {
  var sh = ss.getSheetByName("Leads");
  if (!sh || sh.getLastRow() < 2) return 0;
  var n = sh.getLastRow() - 1;
  var ids = sh.getRange(2, 1, n, 1).getValues();                       // Lead ID
  var subCol = columnIndex_(sh, "Submission ID");
  var subs = subCol ? sh.getRange(2, subCol, n, 1).getValues() : [];
  for (var i = 0; i < n; i++) {
    if (leadId && ids[i][0] === leadId) return i + 2;
    if (submissionId && subs.length && subs[i][0] && subs[i][0] === submissionId) return i + 2;
  }
  return 0;
}

/**
 * Dashboard — every figure is a formula over the Leads tab, so it stays true
 * as sales edit rows. Tests (Is test = TRUE) are excluded from every business
 * total, and resource/webinar contacts are counted separately from sales
 * opportunities.
 */
function buildDashboard_(ss) {
  var sh = ss.getSheetByName("Dashboard") || ss.insertSheet("Dashboard", 0);
  sh.clear();
  var genuine = 'Leads!$AE:$AE,"FALSE"'; // Is test = FALSE
  var rows = [
    ["SOTYN Website Leads — dashboard", ""],
    ["Figures exclude test submissions. Resource and webinar contacts are listed separately from sales opportunities.", ""],
    ["", ""],
    ["GENUINE ENQUIRIES", ""],
    ["Today", '=COUNTIFS(' + genuine + ',Leads!$B:$B,">="&TEXT(TODAY(),"yyyy-mm-dd"))'],
    ["Last 7 days", '=SUMPRODUCT((Leads!$AE$2:$AE="FALSE")*(LEFT(Leads!$B$2:$B,10)>=TEXT(TODAY()-6,"yyyy-mm-dd"))*(Leads!$A$2:$A<>""))'],
    ["Last 30 days", '=SUMPRODUCT((Leads!$AE$2:$AE="FALSE")*(LEFT(Leads!$B$2:$B,10)>=TEXT(TODAY()-29,"yyyy-mm-dd"))*(Leads!$A$2:$A<>""))'],
    ["All time", '=COUNTIFS(' + genuine + ')'],
    ["", ""],
    ["BY ENQUIRY TYPE (all time, genuine)", ""],
    ["Demo requests", '=COUNTIFS(' + genuine + ',Leads!$J:$J,"Demo request")'],
    ["Diagnostic (scorecard)", '=COUNTIFS(' + genuine + ',Leads!$J:$J,"Diagnostic (scorecard)")'],
    ["Paid pilot enquiries", '=COUNTIFS(' + genuine + ',Leads!$J:$J,"Paid pilot enquiry")'],
    ["— sales opportunities (above three)", "=B11+B12+B13"],
    ["Resource / download contacts", '=COUNTIFS(' + genuine + ',Leads!$J:$J,"Resource / download")'],
    ["Webinar registrations", '=COUNTIFS(' + genuine + ',Leads!$J:$J,"Webinar registration")'],
    ["", ""],
    ["PIPELINE", ""],
    ["Qualified", '=COUNTIFS(' + genuine + ',Leads!$Z:$Z,"Qualified")'],
    ["Demos requested", '=COUNTIFS(' + genuine + ',Leads!$Y:$Y,"Requested")'],
    ["Demos booked", '=COUNTIFS(' + genuine + ',Leads!$Y:$Y,"Booked")'],
    ["Demos attended", '=COUNTIFS(' + genuine + ',Leads!$Y:$Y,"Attended")'],
    ["Paid pilots", '=COUNTIFS(' + genuine + ',Leads!$Z:$Z,"Paid pilot")'],
    ["Subscribers", '=COUNTIFS(' + genuine + ',Leads!$Z:$Z,"Subscriber")'],
    ["", ""],
    ["FOLLOW-UP ACCOUNTABILITY", ""],
    ["Unassigned leads", '=COUNTIFS(' + genuine + ',Leads!$W:$W,"")'],
    ["Overdue follow-ups", '=SUMPRODUCT((Leads!$AE$2:$AE="FALSE")*(Leads!$X$2:$X<>"")*(DATEVALUE(LEFT(Leads!$X$2:$X&"                    ",10))<TODAY()))'],
    ["", ""],
    ["DELIVERY HEALTH", ""],
    ["Rows with ERP sync failed", '=COUNTIF(Leads!$AB:$AB,"failed")'],
    ["Open sync errors", "=COUNTIF('Sync Errors'!E:E,\"pending\")"],
    ["", ""],
    ["TOP LANDING PAGES (genuine, all time)", ""],
    ["", '=IFERROR(QUERY(Leads!A2:AF,"select M, count(A) where AE = \'FALSE\' and M is not null group by M order by count(A) desc limit 10 label count(A) \'Leads\'",0),"No leads yet")'],
    ["", ""],
    ["BY SOURCE", ""],
    ["", '=IFERROR(QUERY(Leads!A2:AF,"select O, count(A) where AE = \'FALSE\' group by O order by count(A) desc limit 10 label count(A) \'Leads\'",0),"No leads yet")'],
    ["", ""],
    ["BY TRADE", ""],
    ["", '=IFERROR(QUERY(Leads!A2:AF,"select I, count(A) where AE = \'FALSE\' and I is not null group by I order by count(A) desc limit 10 label count(A) \'Leads\'",0),"No leads yet")'],
    ["", ""],
    ["Google Search Console impressions / clicks", "not connected — see docs/TOOL_ACCESS.md"],
  ];
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  sh.getRange(1, 1).setFontSize(14).setFontWeight("bold");
  sh.getRange(2, 1).setFontSize(9).setFontColor("#666666");
  [4, 10, 18, 26, 30, 34, 37, 40].forEach(function (r) {
    sh.getRange(r, 1).setFontWeight("bold");
  });
  sh.setColumnWidth(1, 320);
  sh.setColumnWidth(2, 220);
}
