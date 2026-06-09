#!/usr/bin/env node
/**
 * NTLSN check-links — pings every event URL in data/events.json and reports
 * the dead ones. Dependency-free (Node 20+ global fetch). Run weekly in CI.
 *
 *   node scripts/check-links.mjs
 *
 * Exit 1 only on CONFIRMED-dead links (404/410/DNS failure) so the weekly run
 * goes red and gets noticed. Bot-blocks (403/405/429) and timeouts are treated
 * as "alive" to avoid false alarms.
 */
import fs from 'node:fs';

const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
const targets = events.filter(e => e.url);
const CONC = 8, TIMEOUT = 15000;
const ALIVE_ANYWAY = new Set([403, 405, 429, 401, 503, 999]); // bot-block / rate-limit, not dead

async function check(e) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  const opts = { redirect: 'follow', signal: ctl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (NTLSN link checker)' } };
  try {
    let r;
    try { r = await fetch(e.url, { ...opts, method: 'HEAD' }); }
    catch { r = await fetch(e.url, { ...opts, method: 'GET' }); }
    if (!r.ok && r.status !== 405) { // some servers reject HEAD; retry GET
      try { r = await fetch(e.url, { ...opts, method: 'GET' }); } catch { /* keep HEAD result */ }
    }
    clearTimeout(timer);
    // 2xx ok; 3xx redirects = alive (resource exists); bot-blocks = alive.
    const redirect = r.status >= 300 && r.status < 400;
    const dead = !r.ok && !redirect && !ALIVE_ANYWAY.has(r.status);
    return { id: e.id, title: e.title, url: e.url, status: r.status, dead };
  } catch (err) {
    clearTimeout(timer);
    const name = String(err?.name || err);
    // Timeouts/aborts are inconclusive (treat as alive); DNS/conn errors are dead.
    const inconclusive = name.includes('Abort') || name.includes('Timeout');
    return { id: e.id, title: e.title, url: e.url, status: 0, dead: !inconclusive, err: name };
  }
}

async function run() {
  const out = [];
  for (let i = 0; i < targets.length; i += CONC) {
    out.push(...await Promise.all(targets.slice(i, i + CONC).map(check)));
  }
  const dead = out.filter(r => r.dead);
  const lines = [];
  lines.push(`# NTLSN link check — ${targets.length} event URLs`);
  lines.push('');
  if (!dead.length) {
    lines.push(`✅ All ${targets.length} event links resolved (bot-blocks and timeouts treated as alive).`);
  } else {
    lines.push(`❌ ${dead.length} dead link(s) found:`);
    lines.push('');
    lines.push('| id | status | event | url |');
    lines.push('|---|---|---|---|');
    for (const d of dead) lines.push(`| ${d.id} | ${d.status || d.err} | ${d.title.slice(0, 50)} | ${d.url} |`);
  }
  const report = lines.join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
  if (dead.length) process.exit(1);
}

run();
