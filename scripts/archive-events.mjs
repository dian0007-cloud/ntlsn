#!/usr/bin/env node
/**
 * NTLSN archive-events — moves past events out of data/events.json into
 * per-year archive files (data/archive-YYYY.json), so the live data file only
 * ever holds current/upcoming events (TASKS.md 3.2 — auto-expiry + archive).
 *
 * Past = (endDate || date) < today — the same boundary build-feeds.mjs and
 * validate-data.mjs use, so all three agree on what counts as live.
 *
 * Idempotent: re-running never duplicates an id (merge is keyed on id) and
 * never re-prunes what is already gone, so it is safe on a daily cron.
 *
 * This script only mutates data files — it does NOT regenerate the feeds.
 * Run `node scripts/build-feeds.mjs` afterward so events.ics / feed.xml /
 * events-ld.json reflect the pruned set, and `node scripts/validate-data.mjs`
 * to confirm the smaller events.json still validates.
 *
 *   node scripts/archive-events.mjs           # dry run: print the plan, change nothing
 *   node scripts/archive-events.mjs --apply    # move past events now
 */
import fs from 'node:fs';

const APPLY = process.argv.includes('--apply');
const TODAY = new Date().toISOString().slice(0, 10);

const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
const keep = [];
const past = [];
for (const e of events) {
  if ((e.endDate || e.date) < TODAY) past.push(e);
  else keep.push(e);
}

// Group past events by calendar year → data/archive-YYYY.json
const byYear = {};
for (const e of past) {
  const year = String(e.date).slice(0, 4);
  (byYear[year] = byYear[year] || []).push(e);
}

const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

if (!APPLY) {
  console.log(`archive-events (DRY RUN) — today is ${TODAY}`);
  console.log(`  events.json: ${events.length} → keep ${keep.length} upcoming, move ${past.length} past`);
  for (const [year, evs] of Object.entries(byYear)) {
    const file = `data/archive-${year}.json`;
    console.log(`  ${file}: +${evs.length} past event(s)${fs.existsSync(file) ? ' (merged with existing)' : ' (new file)'}`);
  }
  if (!past.length) console.log('  Nothing past to archive.');
  console.log('  Re-run with --apply to perform the move.');
  process.exit(0);
}

// --apply: merge each year's past events into its archive (deduped by id), then prune events.json.
let moved = 0;
for (const [year, evs] of Object.entries(byYear)) {
  const file = `data/archive-${year}.json`;
  let existing = [];
  if (fs.existsSync(file)) {
    try { existing = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { existing = []; }   // unreadable archive: start clean rather than abort
  }
  const have = new Set(existing.map(e => e.id));
  for (const e of evs) if (!have.has(e.id)) { existing.push(e); moved++; }
  existing.sort((a, b) => a.date.localeCompare(b.date));
  writeJson(file, existing);
}
writeJson('data/events.json', keep);
console.log(`archive-events: moved ${moved} past event(s) to ${Object.keys(byYear).map(y => 'archive-' + y + '.json').join(', ')}; ${keep.length} upcoming remain in events.json.`);
