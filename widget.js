/*!
 * NTLSN embed widget — drop-in "upcoming sector events" list for any site.
 * Usage:  <script src="https://www.ntlsn.com/widget.js" data-limit="5" data-uni="usq"></script>
 *   data-limit : how many events to show (default 5)
 *   data-uni   : optional university id (e.g. usq, unimelb, curtin) — omit for sector-wide
 * Renders into a scoped shadow root so it never clashes with the host page's CSS.
 * Reads the CORS-open /data/events.json. ~5KB, no dependencies. Links back to NTLSN.
 */
(function () {
  var s = document.currentScript;
  if (!s) return;
  var origin;
  try { origin = new URL(s.src).origin; } catch (e) { origin = 'https://www.ntlsn.com'; }
  var uni = (s.getAttribute('data-uni') || '').toLowerCase().trim();
  var limit = parseInt(s.getAttribute('data-limit') || '5', 10);
  if (isNaN(limit) || limit < 1) limit = 5;

  var host = document.createElement('div');
  host.setAttribute('data-ntlsn-widget', '');
  s.parentNode.insertBefore(host, s.nextSibling);
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var CSS =
    ':host{all:initial}' +
    '.w{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'max-width:480px;border:1px solid #e3e8ef;border-radius:14px;overflow:hidden;background:#fff;color:#0A1628;' +
      'box-shadow:0 1px 3px rgba(10,22,40,.06)}' +
    '.hd{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#0A1628;color:#fff}' +
    '.dot{width:8px;height:8px;border-radius:50%;background:#4ECDC4;flex:0 0 auto}' +
    '.hd b{font-size:13px;font-weight:700;letter-spacing:.3px}' +
    '.hd span{font-size:11px;color:#9fb3c8;margin-left:auto}' +
    '.it{display:block;padding:11px 16px;border-top:1px solid #eef2f7;text-decoration:none;color:inherit}' +
    '.it:hover{background:#f6f9fc}' +
    '.t{font-size:14px;font-weight:600;line-height:1.3;margin:0 0 3px}' +
    '.m{font-size:12px;color:#5b6b7e;display:flex;flex-wrap:wrap;gap:6px;align-items:center}' +
    '.pill{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:#0A1628;' +
      'background:#e6fbf8;border:1px solid #b8efe8;border-radius:6px;padding:1px 6px}' +
    '.ft{padding:9px 16px;border-top:1px solid #eef2f7;font-size:11px;color:#5b6b7e;text-align:center}' +
    '.ft a{color:#0A1628;font-weight:600;text-decoration:none}' +
    '.empty{padding:18px 16px;font-size:13px;color:#5b6b7e}';

  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }

  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fmt(d, end) {
    var a = d.split('-'), y = a[0], m = +a[1], day = +a[2];
    if (end && end !== d) {
      var b = end.split('-'), m2 = +b[1], day2 = +b[2];
      if (m === m2) return day + '–' + day2 + ' ' + MON[m - 1] + ' ' + y;
      return day + ' ' + MON[m - 1] + ' – ' + day2 + ' ' + MON[m2 - 1] + ' ' + y;
    }
    return day + ' ' + MON[m - 1] + ' ' + y;
  }
  function cap(x) { return x ? x.charAt(0).toUpperCase() + x.slice(1) : ''; }
  // Only allow http(s), protocol-relative, root/relative or hash links — blocks javascript:/data: etc.
  function safeUrl(u, fallback) {
    if (!u) return fallback;
    var s = String(u).trim();
    if (/^(https?:|\/\/|\/|#|\.\/|\.\.\/)/i.test(s)) return s;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(s)) return fallback; // an untrusted scheme — drop it
    return s; // bare relative path, e.g. "events.html"
  }

  function render(html) { root.innerHTML = '<style>' + CSS + '</style>' + html; }
  render('<div class="w"><div class="hd"><span class="dot"></span><b>NTLSN · What’s On</b></div><div class="empty">Loading sector events…</div></div>');

  fetch(origin + '/data/events.json', { mode: 'cors' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (events) {
      var today = new Date().toISOString().slice(0, 10);
      var list = events.filter(function (e) { return (e.endDate || e.date) >= today; });
      if (uni) list = list.filter(function (e) { return (e.uni || '').toLowerCase() === uni; });
      list.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      list = list.slice(0, limit);

      var w = el('div', 'w');
      var hd = el('div', 'hd');
      hd.appendChild(el('span', 'dot'));
      hd.appendChild(el('b', null, 'NTLSN · What’s On'));
      hd.appendChild(el('span', null, uni ? uni.toUpperCase() : 'Sector'));
      w.appendChild(hd);

      if (!list.length) {
        w.appendChild(el('div', 'empty', 'No upcoming events listed right now.'));
      } else {
        list.forEach(function (e) {
          var a = el('a', 'it');
          a.href = safeUrl(e.url, origin + '/#events');
          a.target = '_blank'; a.rel = 'noopener';
          a.appendChild(el('p', 't', e.title));
          var m = el('div', 'm');
          m.appendChild(el('span', null, fmt(e.date, e.endDate)));
          if (e.type) m.appendChild(el('span', 'pill', cap(e.type)));
          if (e.uni && !uni) m.appendChild(el('span', null, e.uni.toUpperCase()));
          a.appendChild(m);
          w.appendChild(a);
        });
      }
      var ft = el('div', 'ft');
      var link = el('a', null, 'See the whole sector →');
      link.href = origin; link.target = '_blank'; link.rel = 'noopener';
      ft.appendChild(document.createTextNode('Powered by '));
      ft.appendChild(link);
      w.appendChild(ft);

      render('');// reset to a single <style>, then attach the built widget
      root.appendChild(w);
    })
    .catch(function () {
      render('<div class="w"><div class="hd"><span class="dot"></span><b>NTLSN · What’s On</b></div>' +
        '<div class="empty">Couldn’t load events — <a href="' + origin + '" target="_blank" rel="noopener" style="color:#0A1628">visit NTLSN</a>.</div></div>');
    });
})();
