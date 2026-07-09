#!/usr/bin/env node
/**
 * NTLSN archive-events — moves past events out of data/events.json into
 * data/archive-2026.json so the canonical events file stays lean and the feeds
 * never serve stale entries. Implements TASKS.md 3.2 (Auto-expiry + archive).
 *
 *   node scripts/archive-events.mjs
 *
 * Run this BEFORE build-feeds.mjs (the scheduled workflow does), or as a one-off
 * maintenance step. Idempotent: re-running on a day with no newly-expired events
 * changes nothing. An event is "past" when its endDate (or date if no endDate)
 * is strictly before TODAY.
 *
 * Merge safety: if data/archive-2026.json already exists, past events are
 * appended by id (duplicates skipped), so the script never loses or double-
 * counts an event across runs.
 *
 * The archive file holds event objects of the SAME shape as events.json
 * (honours schemas/event.schema.json) — no new fields are introduced, so the
 * existing schema and validate-data.mjs cover it without changes.
 */
import fs from 'node:fs';

const TODAY = new Date().toISOString().slice(0, 10);
const EVENTS_PATH = 'data/events.json';
const ARCHIVE_PATH = 'data/archive-2026.json';
const isPast = e => (e.endDate || e.date) < TODAY;

if (!fs.existsSync(EVENTS_PATH)) {
  console.error(`archive-events: ${EVENTS_PATH} not found — run from the repo root.`);
  process.exit(1);
}

const events = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf8'));
if (!Array.isArray(events)) {
  console.error(`archive-events: ${EVENTS_PATH} is not a JSON array — aborting.`);
  process.exit(1);
}

let archive = [];
if (fs.existsSync(ARCHIVE_PATH)) {
  archive = JSON.parse(fs.readFileSync(ARCHIVE_PATH, 'utf8'));
  if (!Array.isArray(archive)) {
    console.error(`archive-events: ${ARCHIVE_PATH} exists but is not a JSON array — aborting (will not overwrite).`);
    process.exit(1);
  }
}

const archiveIds = new Set(archive.map(e => e.id));
const keep = [];
let moved = 0;       // newly archived this run
let deduped = 0;     // past events that were already in the archive (removed from events.json only)

for (const e of events) {
  if (isPast(e)) {
    if (archiveIds.has(e.id)) {
      deduped++;
    } else {
      archive.push(e);
      archiveIds.add(e.id);
      moved++;
    }
  } else {
    keep.push(e);
  }
}

if (moved === 0 && deduped === 0) {
  console.log(`archive-events: nothing to archive (${events.length} events all current as of ${TODAY}).`);
  process.exit(0);
}

// Write the archive first (append-merge), then the lean events.json.
fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archive, null, 2) + '\n');
fs.writeFileSync(EVENTS_PATH, JSON.stringify(keep, null, 2) + '\n');

const note = deduped > 0 ? ` (${deduped} already archived, deduped)` : '';
console.log(`archive-events: moved ${moved} past event(s) to ${ARCHIVE_PATH}${note} — archive now holds ${archive.length}. data/events.json: ${events.length} → ${keep.length} (TODAY=${TODAY}).`);
