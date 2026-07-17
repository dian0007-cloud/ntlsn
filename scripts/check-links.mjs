#!/usr/bin/env node
/**
 * NTLSN check-links — pings every event URL in data/events.json and reports
 * the dead ones. Dependency-free (Node 20+ global fetch). Run weekly in CI.
 *
 *   node scripts/check-links.mjs
 *
 * Exit 1 only on CONFIRMED-dead links (404/410/DNS failure) so the weekly run
 * goes red and gets noticed. Three outcomes per link:
 *   - alive         : 2xx/3xx, or a known bot-block status (403/405/429/401/503/999)
 *   - inconclusive  : timed out, OR the response looks like a bot-challenge page
 *                      (Cloudflare "Just a moment…" / cdn-cgi/challenge-platform).
 *                      Many .edu.au sites sit behind Cloudflare and serve a 4xx
 *                      challenge to automated clients; those are NOT dead — a real
 *                      browser solves the challenge — so we report them separately
 *                      for a human to eyeball rather than failing the build.
 *   - dead          : anything else that isn't ok (e.g. a genuine 404/410).
 */
import fs from 'node:fs';

const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
const targets = events.filter(e => e.url);
const CONC = 8, TIMEOUT = 15000, SNIFF_TIMEOUT = 10000;
const ALIVE_ANYWAY = new Set([403, 405, 429, 401, 503, 999]); // bot-block / rate-limit, not dead
// A realistic desktop UA: the old "NTLSN link checker" token was itself a bot
// signal that triggered Cloudflare challenges on .edu.au sites.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const CHALLENGE_RE = /cdn-cgi\/challenge-platform|__CF\$cv\$params|cf-challenge|Just a moment|Attention Required|<title>[^<]*Cloudflare/i;

// Re-fetch (GET) the body and look for a bot-challenge page. Used only when a
// link is about to be declared dead, to rule out a Cloudflare-style 4xx challenge.
async function sniffBotChallenge(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), SNIFF_TIMEOUT);
  try {
    const r = await fetch(url, { redirect: 'follow', signal: ctl.signal, headers: { 'User-Agent': UA }, method: 'GET' });
    const text = await r.text();
    return CHALLENGE_RE.test(text);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function check(e) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  const opts = { redirect: 'follow', signal: ctl.signal, headers: { 'User-Agent': UA } };
  try {
    let r;
    try { r = await fetch(e.url, { ...opts, method: 'HEAD' }); }
    catch { r = await fetch(e.url, { ...opts, method: 'GET' }); }
    if (!r.ok && r.status !== 405) { // some servers reject HEAD; retry GET
      try { r = await fetch(e.url, { ...opts, method: 'GET' }); } catch { /* keep HEAD result */ }
    }
    clearTimeout(timer);
    const redirect = r.status >= 300 && r.status < 400;
    if (r.ok || redirect || ALIVE_ANYWAY.has(r.status)) {
      return { id: e.id, title: e.title, url: e.url, status: r.status, dead: false, inconclusive: false };
    }
    // Not ok and not a known bot-block. Could be a real 404, or a Cloudflare-style
    // challenge served with a 4xx status. Sniff the body before declaring it dead.
    const challenged = await sniffBotChallenge(e.url);
    return { id: e.id, title: e.title, url: e.url, status: r.status, dead: !challenged, inconclusive: challenged };
  } catch (err) {
    clearTimeout(timer);
    const name = String(err?.name || err);
    // Timeouts/aborts are inconclusive (treat as alive); DNS/conn errors are dead.
    const inconclusive = name.includes('Abort') || name.includes('Timeout');
    return { id: e.id, title: e.title, url: e.url, status: 0, dead: !inconclusive, inconclusive, err: name };
  }
}

function row(d) {
  return `| ${d.id} | ${d.status || d.err || '?'} | ${d.title.slice(0, 50)} | ${d.url} |`;
}

async function run() {
  const out = [];
  for (let i = 0; i < targets.length; i += CONC) {
    out.push(...await Promise.all(targets.slice(i, i + CONC).map(check)));
  }
  const dead = out.filter(r => r.dead);
  const inconclusive = out.filter(r => r.inconclusive && !r.dead);
  const alive = out.length - dead.length - inconclusive.length;
  const lines = [];
  lines.push(`# NTLSN link check — ${targets.length} event URLs`);
  lines.push('');
  lines.push(`✅ ${alive} alive · ⚠️ ${inconclusive.length} inconclusive (bot-challenged/timeout — needs human look) · ❌ ${dead.length} dead`);
  lines.push('');
  if (inconclusive.length) {
    lines.push(`⚠️ ${inconclusive.length} inconclusive — likely Cloudflare/bot-challenged, not confirmed dead:`);
    lines.push('');
    lines.push('| id | status | event | url |');
    lines.push('|---|---|---|---|');
    for (const d of inconclusive) lines.push(row(d));
    lines.push('');
  }
  if (dead.length) {
    lines.push(`❌ ${dead.length} dead link(s) found:`);
    lines.push('');
    lines.push('| id | status | event | url |');
    lines.push('|---|---|---|---|');
    for (const d of dead) lines.push(row(d));
  } else if (!inconclusive.length) {
    lines.push(`✅ All ${targets.length} event links resolved (bot-blocks and timeouts treated as alive).`);
  }
  const report = lines.join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
  if (dead.length) process.exit(1);
}

run();
