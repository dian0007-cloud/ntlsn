/*!
 * NTLSN Acknowledgement of Country widget.
 * Usage:  <script src="https://www.ntlsn.com/country-widget.js" data-uni="usq"></script>
 *   data-uni   : institution id from /data/universities.json (usq, anu, unimelb, ...)
 *   data-theme : "dark" (default) or "light"
 * Renders a respectful Acknowledgement of the Traditional Country the campus
 * stands on, using NTLSN's verified institutional dataset. Shadow-DOM scoped.
 *
 * The Acknowledgement wording is general and institution-neutral. Traditional
 * Country names are factual campus acknowledgement data; if your institution
 * has its own approved wording or protocols, please use those instead.
 */
(function () {
  var s = document.currentScript;
  if (!s) return;
  var origin;
  try { origin = new URL(s.src).origin; } catch (e) { origin = 'https://www.ntlsn.com'; }
  var uni = (s.getAttribute('data-uni') || '').toLowerCase().trim();
  var theme = (s.getAttribute('data-theme') || 'dark').toLowerCase();

  var host = document.createElement('div');
  host.setAttribute('data-ntlsn-country', '');
  s.parentNode.insertBefore(host, s.nextSibling);
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var DARK = theme !== 'light';
  var BG = DARK ? '#0A1628' : '#ffffff';
  var FG = DARK ? '#e7eef5' : '#0A1628';
  var SUB = DARK ? '#9fb3c8' : '#5b6b7e';
  var BORDER = DARK ? 'rgba(255,255,255,.10)' : '#e3e8ef';

  var CSS = ':host{all:initial}' +
    '.w{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'max-width:560px;background:' + BG + ';color:' + FG + ';border:1px solid ' + BORDER + ';' +
      'border-radius:14px;overflow:hidden}' +
    // Aboriginal flag accent: black / red / yellow band (used only in this element, per NTLSN convention)
    '.band{display:flex;height:6px}' +
    '.band span:nth-child(1){flex:1;background:#000}' +
    '.band span:nth-child(2){flex:1;background:#CC0000}' +
    '.band span:nth-child(3){flex:1;background:#FFCC00}' +
    '.in{padding:18px 20px}' +
    '.k{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:' + SUB + ';margin:0 0 8px}' +
    '.t{font-size:15px;line-height:1.65;margin:0}' +
    '.t b{font-weight:700}' +
    '.ft{margin-top:12px;font-size:11px;color:' + SUB + '}' +
    '.ft a{color:' + FG + ';font-weight:600;text-decoration:none}';

  function render(html) { root.innerHTML = '<style>' + CSS + '</style>' + html; }

  function ack(u) {
    var country = u ? u.traditionalCountry : null;
    var body;
    if (u && country) {
      body = 'We acknowledge the <b>' + country + '</b> peoples, the Traditional Custodians of the lands on which ' +
             '<b>' + u.name + '</b> stands, and pay our respects to Elders past and present. ' +
             'Sovereignty was never ceded.';
    } else {
      body = 'We acknowledge the Traditional Custodians of Country throughout Australia and pay our respects ' +
             'to Elders past and present. Sovereignty was never ceded.';
    }
    render('<div class="w"><div class="band"><span></span><span></span><span></span></div><div class="in">' +
      '<p class="k">Acknowledgement of Country</p>' +
      '<p class="t">' + body + '</p>' +
      '<div class="ft">Country data via <a href="' + origin + '" target="_blank" rel="noopener">NTLSN</a> — the National Teaching &amp; Learning Sector Navigator</div>' +
      '</div></div>');
  }

  if (!uni) { ack(null); return; }
  fetch(origin + '/data/universities.json', { mode: 'cors' })
    .then(function (r) { return r.json(); })
    .then(function (unis) {
      var u = null;
      for (var i = 0; i < unis.length; i++) if ((unis[i].id || '').toLowerCase() === uni) { u = unis[i]; break; }
      ack(u);
    })
    .catch(function () { ack(null); });
})();
