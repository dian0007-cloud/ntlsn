/**
 * NTLSN — Sector Feed Aggregator  (Google Apps Script)
 * ============================================================
 * Auto-pulls RSS/Atom feeds from across the sector — VIDEOS (YouTube
 * playlists & channels), BLOGS, and NEWS/notices — into a "Feed" tab
 * on a daily schedule, and serves the latest items as JSON for the
 * NTLSN website to display live (no redeploy needed, ever).
 *
 * Every feed below was VERIFIED working on 8 Jun 2026.
 *
 * SETUP (≈5 min, once):
 *  1. New Google Sheet → Extensions → Apps Script (use a NEW sheet to keep
 *     this separate from your working symposium backend — zero risk to it).
 *  2. Delete the sample code, paste ALL of this, Save.
 *  3. Run  setupDailyTrigger  → authorise → watch the "Feed" tab fill. ✅
 *  4. Deploy → New deployment → "Web app" → Execute as: Me | Access: Anyone
 *     → Deploy → copy the /exec URL.
 *  5. Send Claude the /exec URL → we wire a live "Latest from the Sector"
 *     section into the site that groups Videos / Blogs / News. Self-updating forever.
 *
 *  Add a source later = paste one {type,name,url} line + Save. Broken feeds are skipped.
 */

// ───────────────────────── SOURCES (verified 8 Jun 2026) ─────────────────────────
// type: 'video' | 'blog' | 'news'   (drives grouping on the website)
var FEED_SOURCES = [
  // ── VIDEOS (YouTube RSS — playlists & channels) ──
  { type:'video', name:'ASCILITE Live! Webinars',        url:'https://www.youtube.com/feeds/videos.xml?playlist_id=PLETH5KYzFInHK8qiM3PGXAVxclQU32rFi' },
  { type:'video', name:'ASCILITE Learning Design SIG',   url:'https://www.youtube.com/feeds/videos.xml?playlist_id=PLETH5KYzFInHNJkp7U7fs01XPyhWf-Fy2' },
  { type:'video', name:'ASCILITE Business Education SIG', url:'https://www.youtube.com/feeds/videos.xml?playlist_id=PLETH5KYzFInGeWmYQYc1tOUV5qCfcowNO' },
  { type:'video', name:'CRADLE (Deakin)',                url:'https://www.youtube.com/feeds/videos.xml?channel_id=UC_fNnNOrV5umhap4aMQEJ6g' },
  { type:'video', name:'TELedvisors SIG',                url:'https://www.youtube.com/feeds/videos.xml?channel_id=UCY9N3coAiYgfBp-a4A_jfbg' },
  { type:'video', name:'Open Educational Practice SIG',  url:'https://www.youtube.com/feeds/videos.xml?channel_id=UCH9b-qoLigPoY1F__oep17Q' },

  // ── BLOGS (RSS) ──
  { type:'blog',  name:'Teaching@Sydney',                url:'https://educational-innovation.sydney.edu.au/teaching@sydney/feed/' },
  { type:'blog',  name:'Teche (Macquarie)',              url:'https://teche.mq.edu.au/feed/' },
  { type:'blog',  name:'Needed Now in L&T',              url:'https://needednowlt.substack.com/feed' },
  { type:'blog',  name:'TELall (ASCILITE)',              url:'https://blog.ascilite.org/feed/' },

  // ── NEWS / NOTICES (RSS) ──
  { type:'news',  name:'HERDSA',                         url:'https://herdsa.org.au/rss.xml' },
  { type:'news',  name:'CAULLT',                         url:'https://www.caullt.edu.au/feed/' },

  // ── MORE VIDEOS (channels) ──
  { type:'video', name:'ASCILITE',                       url:'https://www.youtube.com/feeds/videos.xml?channel_id=UCBVI4UqVptVCTwr4mWYTGDg' },
  { type:'video', name:'Transforming Assessment',        url:'https://www.youtube.com/feeds/videos.xml?channel_id=UCQBx0xYINK4yQhI6Dfo2N8Q' },
  { type:'video', name:'HERDSA',                         url:'https://www.youtube.com/feeds/videos.xml?channel_id=UCZ9Vmn9hz7GmMRGP8QiI5tA' },
  { type:'video', name:'HERDSA SoTL SIG',                url:'https://www.youtube.com/feeds/videos.xml?channel_id=UCGiWf_pn-aH6CTjzJrgLzoA' },

  // ── MORE BLOGS ──
  { type:'blog',  name:'UTS Education Express',          url:'https://educationexpress.uts.edu.au/feed/' },

  // ── JOURNALS (RSS) ──
  { type:'journal', name:'JUTLP (Journal)',              url:'https://open-publishing.org/journals/index.php/jutlp/gateway/plugin/WebFeedGatewayPlugin/rss2' },
  { type:'journal', name:'JTLGE — Graduate Employability', url:'https://ojs.deakin.edu.au/index.php/jtlge/gateway/plugin/WebFeedGatewayPlugin/rss2' },
  { type:'journal', name:'AJET — Educational Technology',  url:'https://ajet.org.au/index.php/AJET/gateway/plugin/WebFeedGatewayPlugin/rss2' },

  // ── SECTOR NEWS & REGULATORS (added 10 Jun 2026, all verified) ──
  { type:'news',  name:'Campus Morning Mail',             url:'https://campusmorningmail.com.au/feed/' },
  { type:'news',  name:'The Conversation — Education (AU)', url:'https://theconversation.com/au/education/articles.atom' },
  { type:'news',  name:'TEQSA (Regulator)',               url:'https://www.teqsa.gov.au/rss.xml' },
  { type:'news',  name:'Advance HE (UK)',                 url:'https://www.advance-he.ac.uk/rss.xml' },
  { type:'news',  name:'Campus Review',                   url:'https://www.campusreview.com.au/feed/' },

  // ── MORE ASSOCIATIONS & SCHOLARLY BLOGS (added 10 Jun 2026, all verified) ──
  { type:'blog',  name:'ACODE',                           url:'https://www.acode.edu.au/feed/' },
  { type:'blog',  name:'ANTF (Nat. Teaching Fellows, UK)', url:'https://ntf-association.com/feed/' },
  { type:'blog',  name:'AARE — EduResearch Matters',      url:'https://blog.aare.edu.au/feed/' },
  { type:'blog',  name:'Tony Bates (Online Learning)',    url:'https://www.tonybates.ca/feed/' },
  { type:'blog',  name:'e-Literate',                      url:'https://eliterate.us/feed/' },
  { type:'blog',  name:'EDUCAUSE Review',                 url:'https://er.educause.edu/rss' }

  // NOTE: CRADLE *blog* & Taylor&Francis HERD journal block bots (CAPTCHA/403) — not pullable.
  //       CRADLE is covered above via its YouTube channel instead.
  //       Empty/dead feeds (skipped): Universities Australia /feed/ (0 items), ALT UK /feed/ (0 items),
  //       Inside Higher Ed & THE & EdSurge & Western Sydney (404).
];

var SHEET_TAB      = 'Feed';
var MAX_PER_SOURCE = 8;    // newest N per source per run
var KEEP_DAYS      = 150;  // auto-drop older than this
var SERVE_LIMIT    = 60;   // items returned to the website

// ───────────────────────── THE PULLER (runs daily) ─────────────────────────
function pullFeeds() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB);
  if (sh.getLastRow() === 0) sh.appendRow(['Date','Type','Source','Title','Link','Summary']);

  var seen = {};
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) seen[rows[i][4]] = true; // dedupe by Link (col 5)

  var added = 0;
  FEED_SOURCES.forEach(function (src) {
    try {
      var xml = UrlFetchApp.fetch(src.url, { muteHttpExceptions:true, followRedirects:true, headers:{'User-Agent':'Mozilla/5.0 (NTLSN feed reader)'} }).getContentText();
      var root = XmlService.parse(xml).getRootElement();
      var items = [];
      var channel = root.getChild('channel');
      if (channel) items = channel.getChildren('item');                         // RSS 2.0
      if (!items.length) items = root.getChildren('entry', root.getNamespace()); // Atom (YouTube etc.)

      // newest-first across ALL feeds (fixes YouTube playlists returning oldest-first)
      items.sort(function (a, b) {
        return new Date(_t(b,'pubDate') || _t(b,'published') || _t(b,'updated')) -
               new Date(_t(a,'pubDate') || _t(a,'published') || _t(a,'updated'));
      });
      var n = 0;
      for (var j = 0; j < items.length && n < MAX_PER_SOURCE; j++) {
        var it = items[j];
        var title = _t(it,'title');
        var link  = _t(it,'link');
        if (!link) { var l = it.getChild('link', it.getNamespace()); if (l && l.getAttribute('href')) link = l.getAttribute('href').getValue(); }
        var date  = _t(it,'pubDate') || _t(it,'published') || _t(it,'updated') || '';
        var summ  = (_t(it,'description') || _t(it,'summary') || '').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim().slice(0,240);
        if (!link || seen[link]) continue;
        sh.appendRow([ _d(date), src.type, src.name, title, link, summ ]);
        seen[link] = true; n++; added++;
      }
    } catch (e) { /* skip a broken feed, keep going */ }
  });

  _prune(sh);
  return added; // shows in the execution log
}

function _t(el, tag) {
  var c = el.getChild(tag);
  if (c) return c.getText();
  try { c = el.getChild(tag, el.getNamespace()); return c ? c.getText() : ''; } catch (e) { return ''; }
}
function _d(s) { var d = new Date(s); return isNaN(d) ? new Date() : d; }
function _prune(sh) {
  var cutoff = new Date(); cutoff.setDate(cutoff.getDate() - KEEP_DAYS);
  var rows = sh.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) { var d = new Date(rows[i][0]); if (!isNaN(d) && d < cutoff) sh.deleteRow(i + 1); }
}

// ───────────────────────── SERVE JSON TO THE WEBSITE ─────────────────────────
// If merging into your existing symposium project, route by a param:
//   if (e.parameter.feed === 'rss') { ...return the block below... }
function doGet(e) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_TAB);
  var out = [];
  if (sh) {
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) out.push({ date:rows[i][0], type:rows[i][1], source:rows[i][2], title:rows[i][3], link:rows[i][4], summary:rows[i][5] });
    out.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    out = out.slice(0, SERVE_LIMIT);
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

// ───────────────────────── RUN ONCE to schedule daily ─────────────────────────
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'pullFeeds') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('pullFeeds').timeBased().everyDays(1).atHour(6).create(); // ~6am daily
  pullFeeds(); // run now too
}
