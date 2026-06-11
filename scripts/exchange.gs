/**
 * NTLSN Exchange — ONE backend for two reciprocal programs:
 *   1. PRX  — the National Peer-Review Exchange (cross-institutional peer review of teaching)
 *   2. SaP  — the National Students-as-Partners Registry
 *
 * Same trusted pattern as the symposium backend: the site POSTs registrations here
 * (rows land as Pending), you moderate in the Sheet (set Status = Approved), and
 * doGet serves the approved data as JSON. Emails NEVER leave the sheet.
 *
 * SETUP (≈5 min, once — use a NEW Google Sheet, keeps your other backends untouched):
 *  1. New Google Sheet → Extensions → Apps Script → paste ALL of this → Save.
 *  2. Run  setup  once (creates tabs + headers, authorise when asked).
 *  3. Deploy → New deployment → type "Web app" → Execute as: Me | Access: Anyone
 *     → Deploy → copy the /exec URL → paste it into the site's EX_ENDPOINT constants
 *     (scripts ntlsn-prx-script and ntlsn-sap-script in index.html) — or send it to Claude.
 *
 * MATCHING (PRX): run  suggestPairs  anytime — it writes suggested reviewer pairings
 * (cross-institution, different discipline, compatible mode) to the "Pairings" tab.
 * You email the pairs to introduce them; nothing is sent automatically.
 */

var PRX_TAB = 'PRX', SAP_TAB = 'SaP', PAIR_TAB = 'Pairings';

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var prx = ss.getSheetByName(PRX_TAB) || ss.insertSheet(PRX_TAB);
  if (prx.getLastRow() === 0) prx.appendRow(['Timestamp','Status','Name','Email','Institution','Discipline','Mode','Dimensions','Notes','PairedWith']);
  var sap = ss.getSheetByName(SAP_TAB) || ss.insertSheet(SAP_TAB);
  if (sap.getLastRow() === 0) sap.appendRow(['Timestamp','Status','Institution','Program','SpectrumLevel','URL','ContactName','ContactEmail','Notes']);
  var p = ss.getSheetByName(PAIR_TAB) || ss.insertSheet(PAIR_TAB);
  if (p.getLastRow() === 0) p.appendRow(['Generated','A name','A email','A institution','A discipline','B name','B email','B institution','B discipline','Mode']);
}

function doPost(e) {
  setup();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var out = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents || '{}');
    if (d.website) { out.ok = true; return _json(out); }           // honeypot — silently drop bots
    if (d.kind === 'prx') {
      ss.getSheetByName(PRX_TAB).appendRow([new Date(),'Pending', String(d.name||'').slice(0,120), String(d.email||'').slice(0,160),
        String(d.institution||'').slice(0,120), String(d.discipline||'').slice(0,120), String(d.mode||'formative').slice(0,20),
        String(d.dimensions||'').slice(0,300), String(d.notes||'').slice(0,500), '']);
      out.ok = true;
    } else if (d.kind === 'sap') {
      ss.getSheetByName(SAP_TAB).appendRow([new Date(),'Pending', String(d.institution||'').slice(0,120), String(d.program||'').slice(0,200),
        String(d.level||'').slice(0,40), String(d.url||'').slice(0,300), String(d.name||'').slice(0,120),
        String(d.email||'').slice(0,160), String(d.notes||'').slice(0,500)]);
      out.ok = true;
    }
  } catch (err) { out.error = String(err); }
  return _json(out);
}

function doGet(e) {
  setup();
  var kind = (e.parameter.kind || 'prx').toLowerCase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (kind === 'sap') {
    // Approved registry entries — public fields only (no contact details)
    var rows = ss.getSheetByName(SAP_TAB).getDataRange().getValues(), out = [];
    for (var i = 1; i < rows.length; i++) if (String(rows[i][1]).toLowerCase() === 'approved')
      out.push({ institution: rows[i][2], program: rows[i][3], level: rows[i][4], url: rows[i][5] });
    return _json(out);
  }
  // PRX: privacy-first — aggregate stats only, never individual registrants
  var rows = ss.getSheetByName(PRX_TAB).getDataRange().getValues();
  var n = 0, unis = {}, disciplines = {};
  for (var j = 1; j < rows.length; j++) {
    var st = String(rows[j][1]).toLowerCase();
    if (st === 'approved' || st === 'pending') { n++; unis[String(rows[j][4]).toLowerCase()] = 1; disciplines[String(rows[j][5]).toLowerCase()] = 1; }
  }
  return _json({ registered: n, institutions: Object.keys(unis).filter(String).length, disciplines: Object.keys(disciplines).filter(String).length });
}

/** Suggest cross-institution, cross-discipline reviewer pairs (writes to Pairings tab). */
function suggestPairs() {
  setup();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rows = ss.getSheetByName(PRX_TAB).getDataRange().getValues();
  var people = [];
  for (var i = 1; i < rows.length; i++)
    if (String(rows[i][1]).toLowerCase() === 'approved' && !rows[i][9])
      people.push({ row: i + 1, name: rows[i][2], email: rows[i][3], inst: String(rows[i][4]).toLowerCase(), disc: String(rows[i][5]).toLowerCase(), mode: String(rows[i][6]).toLowerCase() });
  var pair = ss.getSheetByName(PAIR_TAB), prx = ss.getSheetByName(PRX_TAB), used = {}, made = 0;
  for (var a = 0; a < people.length; a++) {
    if (used[a]) continue;
    var best = -1, bestScore = -1;
    for (var b = a + 1; b < people.length; b++) {
      if (used[b]) continue;
      var A = people[a], B = people[b];
      if (A.inst === B.inst) continue;                       // must be cross-institution
      var score = (A.disc !== B.disc ? 2 : 1) + (A.mode === B.mode ? 1 : 0);
      if (score > bestScore) { bestScore = score; best = b; }
    }
    if (best >= 0) {
      var A = people[a], B = people[best];
      pair.appendRow([new Date(), A.name, A.email, A.inst, A.disc, B.name, B.email, B.inst, B.disc, A.mode === B.mode ? A.mode : 'mixed']);
      prx.getRange(A.row, 10).setValue(B.name); prx.getRange(B.row, 10).setValue(A.name);
      used[a] = used[best] = 1; made++;
    }
  }
  Logger.log(made + ' pairing(s) suggested — see the Pairings tab.');
  return made;
}

function _json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
