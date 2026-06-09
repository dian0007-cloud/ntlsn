#!/usr/bin/env node
/**
 * NTLSN build-digest — renders a weekly "what's on across the sector" email
 * from data/events.json: the next N days of events, grouped by state.
 *
 * Usage:  node scripts/build-digest.mjs [--days 14] [--out digest.html]
 *
 * Output is a self-contained HTML email body (inline styles, email-client safe).
 * Sending is a separate step — see .github/workflows/digest.yml (gated on a
 * BUTTONDOWN_API_KEY secret). With no secret set, the workflow just uploads the
 * HTML as an artifact so you can preview it.
 */
import fs from 'node:fs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const DAYS = parseInt(arg('--days', '14'), 10);
const OUT = arg('--out', 'digest.html');

const unis = JSON.parse(fs.readFileSync('data/universities.json', 'utf8'));
const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
const uniMap = Object.fromEntries(unis.map(u => [u.id, u]));

const today = new Date();
const horizon = new Date(today); horizon.setDate(horizon.getDate() + DAYS);
const iso = d => d.toISOString().slice(0, 10);
const TODAY = iso(today), HORIZON = iso(horizon);

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmt = (d, end) => {
  const [y,m,da] = d.split('-').map(Number);
  if (end && end !== d) { const [,m2,da2] = end.split('-').map(Number);
    return m === m2 ? `${da}–${da2} ${MON[m-1]}` : `${da} ${MON[m-1]} – ${da2} ${MON[m2-1]}`; }
  return `${da} ${MON[m-1]}`;
};
const esc = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const upcoming = events
  .filter(e => e.date >= TODAY && e.date <= HORIZON)
  .sort((a, b) => a.date.localeCompare(b.date));

const byState = {};
for (const e of upcoming) { const st = (uniMap[e.uni] || {}).state || 'National'; (byState[st] ||= []).push(e); }
const stateOrder = ['NSW','VIC','QLD','WA','SA','TAS','ACT','NT','National'];
const states = Object.keys(byState).sort((a,b) => stateOrder.indexOf(a) - stateOrder.indexOf(b));

const row = e => {
  const u = uniMap[e.uni] || {};
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #eef2f7;">
    <a href="${esc(e.url||'https://www.ntlsn.com/')}" style="color:#0A1628;font-weight:600;font-size:15px;text-decoration:none;">${esc(e.title)}</a>
    <div style="color:#5b6b7e;font-size:13px;margin-top:3px;">${fmt(e.date,e.endDate)} · ${esc((u.abbr||e.uni||'').toString())} · ${esc(e.type||'')}</div></td></tr>`;
};

const body = states.length ? states.map(st =>
  `<h2 style="font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#4ECDC4;margin:26px 0 6px;">${esc(st)}</h2>
   <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${byState[st].map(row).join('')}</table>`
).join('') : '<p style="color:#5b6b7e;">No events in the next ' + DAYS + ' days — check back soon.</p>';

const html = `<!doctype html><html><body style="margin:0;background:#f6f9fc;">
<div style="max-width:600px;margin:0 auto;padding:28px 22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#fff;">
  <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#4ECDC4;font-weight:700;">NTLSN · This fortnight</div>
  <h1 style="font-size:24px;color:#0A1628;margin:6px 0 4px;">What's on across the sector</h1>
  <p style="color:#5b6b7e;font-size:14px;margin:0 0 8px;">${upcoming.length} event${upcoming.length===1?'':'s'} in the next ${DAYS} days · ${TODAY}</p>
  ${body}
  <div style="margin-top:30px;padding-top:16px;border-top:1px solid #eef2f7;font-size:12px;color:#8a99aa;">
    <a href="https://www.ntlsn.com" style="color:#0A1628;font-weight:600;text-decoration:none;">See the whole sector at ntlsn.com →</a><br>
    Free &amp; open. Subscribe to the live calendar: webcal://www.ntlsn.com/events.ics
  </div>
</div></body></html>`;

fs.writeFileSync(OUT, html);
console.log(`build-digest: ${upcoming.length} events over ${DAYS} days across ${states.length} states → ${OUT}`);
