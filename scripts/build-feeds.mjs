#!/usr/bin/env node
/**
 * NTLSN build-feeds — regenerates events.ics, feed.xml, sitemap.xml and the
 * schema.org Event JSON-LD from /data/events.json + /data/universities.json.
 *
 * Usage:  node scripts/build-feeds.mjs [--out dist]
 * Run on every data change and in CI before deploy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { validate } from './validate-data.mjs';

// Pre-flight: never build feeds from invalid data.
const _v = validate();
if (_v.errors.length) {
  _v.errors.forEach(e => console.error('❌ ' + e));
  console.error(`build-feeds aborted: ${_v.errors.length} data error(s). Run scripts/validate-data.mjs.`);
  process.exit(1);
}

const OUT = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : '.';
fs.mkdirSync(OUT, { recursive: true });
const unis = JSON.parse(fs.readFileSync('data/universities.json', 'utf8'));
const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
const uniMap = Object.fromEntries(unis.map(u => [u.id, u]));
const TODAY = new Date().toISOString().slice(0, 10);
const STAMP = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

// Upcoming/current events only (endDate, or date, on or after today). Shared by the
// ICS, RSS and JSON-LD feeds so every format agrees on what "current" means — past
// events never appear in any subscriber-facing feed. (TASKS.md 3.2.)
const upcoming = events.filter(e => (e.endDate || e.date) >= TODAY).sort((a, b) => a.date.localeCompare(b.date));

// ---------- ICS ----------
const icsDate = d => d.replace(/-/g, '');
const plusOne = d => { const t = new Date(d + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10).replace(/-/g, ''); };
const esc = s => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
function fold(line) {
  const out = []; let s = line;
  while (Buffer.byteLength(s, 'utf8') > 73) {
    let cut = 73; while (Buffer.byteLength(s.slice(0, cut), 'utf8') > 73) cut--;
    out.push(s.slice(0, cut)); s = ' ' + s.slice(cut);
  }
  out.push(s); return out.join('\r\n');
}
const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NTLSN//Sector Events//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  fold('X-WR-CALNAME:NTLSN — Australian HE Teaching & Learning Events'),
  fold('X-WR-CALDESC:Every symposium\\, workshop & PD opportunity across all 42 Australian universities. ntlsn.com'),
  'X-WR-TIMEZONE:Australia/Brisbane', 'REFRESH-INTERVAL;VALUE=DURATION:P1D'];
for (const e of upcoming) {
  const u = uniMap[e.uni] || {};
  const loc = u.name ? u.name + (u.city ? ' — ' + u.city + ', ' + u.state : '') : '';
  ics.push('BEGIN:VEVENT',
    'UID:ntlsn-' + e.id + '@ntlsn.com',
    'DTSTAMP:' + STAMP,
    'DTSTART;VALUE=DATE:' + icsDate(e.date),
    'DTEND;VALUE=DATE:' + plusOne(e.endDate || e.date),
    fold('SUMMARY:' + esc(e.title)),
    fold('DESCRIPTION:' + esc((e.desc || '') + (e.url ? '\n' + e.url : ''))),
    fold('LOCATION:' + esc(loc)),
    e.url ? fold('URL:' + e.url) : null,
    'CATEGORIES:' + esc((e.type || 'event').toUpperCase()),
    'TRANSP:TRANSPARENT', 'END:VEVENT');
}
ics.push('END:VCALENDAR');
fs.writeFileSync(path.join(OUT, 'events.ics'), ics.filter(Boolean).join('\r\n') + '\r\n');

// ---------- RSS ----------
const x = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const items = upcoming.map(e => {
  const u = uniMap[e.uni] || {};
  return '  <item>\n    <title>' + x(e.title) + ' (' + x(e.date) + (e.endDate && e.endDate !== e.date ? ' – ' + x(e.endDate) : '') + ')</title>\n' +
    '    <link>' + x(e.url || 'https://www.ntlsn.com/') + '</link>\n' +
    '    <guid isPermaLink="false">ntlsn-' + e.id + '</guid>\n' +
    '    <category>' + x(e.type) + '</category>\n' +
    '    <description>' + x((u.abbr ? u.abbr + ' · ' : '') + (e.desc || '')) + '</description>\n  </item>';
}).join('\n');
fs.writeFileSync(path.join(OUT, 'feed.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n' +
  '  <title>NTLSN — Australian HE Teaching &amp; Learning Events</title>\n  <link>https://www.ntlsn.com/</link>\n' +
  '  <atom:link href="https://www.ntlsn.com/feed.xml" rel="self" type="application/rss+xml"/>\n' +
  '  <description>Upcoming symposiums, workshops and PD across all 42 Australian universities.</description>\n' +
  '  <language>en-au</language>\n  <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>\n' + items + '\n</channel>\n</rss>\n');

// ---------- JSON-LD ----------
const ld = {
  '@context': 'https://schema.org', '@type': 'ItemList',
  name: 'Upcoming Australian Higher Education Teaching & Learning Events',
  itemListElement: upcoming.map((e, i) => {
    const u = uniMap[e.uni] || {};
    return { '@type': 'ListItem', position: i + 1, item: {
      '@type': 'Event', name: e.title, startDate: e.date, endDate: e.endDate || e.date,
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      description: e.desc || undefined, url: e.url || 'https://www.ntlsn.com/',
      location: { '@type': 'Place', name: u.name || 'Australia', address: { '@type': 'PostalAddress', addressLocality: u.city, addressRegion: u.state, addressCountry: 'AU' } },
      organizer: { '@type': 'CollegeOrUniversity', name: u.name || 'NTLSN', url: u.tlUrl }
    } };
  })
};
fs.writeFileSync(path.join(OUT, 'events-ld.json'), JSON.stringify(ld));

// ---------- Sitemap ----------
// Merge-generate: scan the repo's standalone pages, keep each page's existing
// lastmod, stamp pages new to the sitemap with TODAY, and drop entries whose
// file no longer exists. The canonical host is ntlsn.com (see robots.txt).
const SITE = 'https://ntlsn.com';
const SM_EXCLUDE = new Set(['404.html']);
const pages = fs.readdirSync('.').filter(f => f.endsWith('.html') && !SM_EXCLUDE.has(f)).sort();
const prevLastmod = {};
const prevSitemap = [path.join(OUT, 'sitemap.xml'), 'sitemap.xml'].find(p => fs.existsSync(p));
if (prevSitemap) {
  for (const m of fs.readFileSync(prevSitemap, 'utf8').matchAll(/<loc>\s*([^<]+?)\s*<\/loc>\s*<lastmod>\s*([^<]+?)\s*<\/lastmod>/g)) {
    try { prevLastmod[new URL(m[1]).pathname] = m[2]; } catch { /* skip malformed loc */ }
  }
}
const smEntry = p => '<url><loc>' + SITE + p + '</loc><lastmod>' + (prevLastmod[p] || TODAY) + '</lastmod></url>';
const smUrls = ['/'].concat(pages.filter(f => f !== 'index.html').map(f => '/' + f));
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  smUrls.map(smEntry).join('\n') + '\n</urlset>\n');

console.log('build-feeds: ' + upcoming.length + ' upcoming → events.ics + feed.xml + JSON-LD | ' + events.length + ' total in data/events.json | sitemap: ' + smUrls.length + ' URLs');
