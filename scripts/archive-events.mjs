#!/usr/bin/env node
/**
 * NTLSN archive-events — moves events whose dates have passed out of
 * data/events.json into a year-stamped archive (data/archive-<YEAR>.json),
 * deduped by id. Idempotent: re-running merges into the existing archive without
 * duplicating, so it is safe to run repeatedly.
 *
 *   node scripts/archive-events.mjs
 *
 * Part of TASKS.md 3.2 (Auto-expiry + archive). Run before build-feeds in the
 * scheduled rebuild so data/events.json holds only current/upcoming events and
 * the feeds stay fresh. An event is "past" when its endDate (or date) is before
 * TODAY — the same threshold build-feeds uses for the upcoming filter, so the two
 * agree. Past events are never deleted: they move to the archive, preserving
 * history for reference/audit.
 */
import fs from 'node:fs';
import { validate } from './validate-data.mjs';

// Pre-flight: never mutate invalid data.
const _v = validate();
if (_v.errors.length) {
  _v.errors.forEach(e => console.error('❌ ' + e));
  console.error(`archive-events aborted: ${_v.errors.length} data error(s). Run scripts/validate-data.mjs.`);
  process.exit(1);
}

const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = TODAY.slice(0, 4);
const ARCHIVE_PATH = `data/archive-${YEAR}.json`;

const isPast = e => (e.endDate || e.date) < TODAY;
const past = events.filter(isPast);
const keep = events.filter(e => !isPast(e));

if (!past.length) {
  console.log(`archive-events: nothing past as of ${TODAY}; ${keep.length} events remain in data/events.json.`);
  process.exit(0);
}

// Merge into any existing year archive (dedupe by id, preserve order).
let existing = [];
if (fs.existsSync(ARCHIVE_PATH)) {
  try { existing = JSON.parse(fs.readFileSync(ARCHIVE_PATH, 'utf8')); }
  catch (e) { console.error(`archive-events: existing ${ARCHIVE_PATH} is unreadable: ${e.message}`); process.exit(1); }
}
const have = new Set(existing.map(e => e.id));
const merged = existing.concat(past.filter(e => !have.has(e.id)));

// Match the existing data/*.json formatting: JSON.stringify(…, null, 2) + trailing newline.
fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(merged, null, 2) + '\n');
fs.writeFileSync('data/events.json', JSON.stringify(keep, null, 2) + '\n');

// Post-flight: the reduced events.json must still validate.
const _v2 = validate();
if (_v2.errors.length) {
  _v2.errors.forEach(e => console.error('❌ ' + e));
  console.error('archive-events: post-archive validation FAILED — resolve before committing.');
  process.exit(1);
}

console.log(`archive-events: moved ${past.length} past event(s) to ${ARCHIVE_PATH} (archive now ${merged.length}). ${keep.length} upcoming/current remain in data/events.json.`);
