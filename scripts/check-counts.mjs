#!/usr/bin/env node
/**
 * NTLSN check-counts — asserts displayed total counts in the STATIC <head> of
 * index.html match the canonical data files. Prevents silent drift like the hero
 * claiming "all 42 universities" while data/universities.json holds 43. Dependency
 * -free (Node 20+). Run weekly in CI alongside check-links.mjs.
 *
 *   node scripts/check-counts.mjs
 *
 * Scope: the static <head> only (meta description, og/twitter, JSON-LD) — that copy
 * can't be corrected at runtime, so it must be statically truthful. Visible body copy
 * that lives in the minified bundle is reconciled at runtime by the ntlsn-unicount
 * patch script, so it is intentionally NOT asserted here.
 *
 * Exit 1 on any mismatch.
 */
import fs from 'node:fs';

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const html = fs.readFileSync('index.html', 'utf8');
const headEnd = html.indexOf('</head>');
const head = headEnd === -1 ? html : html.slice(0, headEnd + 7);

const problems = [];

// --- Universities total: every "all N universities" in the static head must equal the live total.
const unis = readJSON('data/universities.json');
const uniTotal = Array.isArray(unis) ? unis.length : 0;
const headUniTotals = new Set();
for (const m of head.matchAll(/all\s+(\d{1,3})\s+universities/gi)) headUniTotals.add(Number(m[1]));
for (const n of headUniTotals) {
  if (n !== uniTotal) {
    problems.push(`Head claims "all ${n} universities" but data/universities.json has ${uniTotal}. Update the meta/og/twitter/JSON-LD copy (or make ntlsn-unicount cover it).`);
  }
}
if (headUniTotals.size === 0) {
  problems.push('No "all N universities" total found in <head> — did the hero copy change? Review check-counts.mjs.');
}

const lines = [];
lines.push(`# NTLSN count check — universities total = ${uniTotal}`);
lines.push('');
if (problems.length) {
  lines.push(`❌ ${problems.length} drift(s) found:`);
  lines.push('');
  for (const p of problems) lines.push(`- ${p}`);
} else {
  lines.push(`✅ Static <head> university total matches data (${uniTotal}).`);
}
const report = lines.join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '\n' + report + '\n');
if (problems.length) process.exit(1);
