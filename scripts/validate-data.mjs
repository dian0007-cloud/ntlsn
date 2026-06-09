#!/usr/bin/env node
/**
 * NTLSN validate-data — guards the data layer so a bad PR can't break the feeds.
 * Dependency-free (no ajv / npm install). Run standalone or imported by build-feeds.
 *
 *   node scripts/validate-data.mjs          # exit 1 on any error
 *
 * Hard errors (fail): missing/wrong-typed required field, unknown uni id,
 *   duplicate event id, bad date format, endDate < date, malformed url.
 * Warnings (don't fail): unusual event type, event entirely in the past.
 */
import fs from 'node:fs';

const KNOWN_TYPES = ['conference', 'symposium', 'workshop', 'webinar', 'seminar',
  'forum', 'summit', 'masterclass', 'roundtable', 'showcase', 'week'];
const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
const GROUPS = ['Go8', 'ATN', 'IRU', 'RUN', 'Unaligned'];
// Valid host values that aren't a single institution (sector-wide events).
const PSEUDO_HOSTS = ['national'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDate = s => DATE_RE.test(s) && !isNaN(new Date(s + 'T00:00:00Z').getTime());

export function validate() {
  const errors = [], warnings = [];
  const E = (m) => errors.push(m), W = (m) => warnings.push(m);

  let unis, events;
  try { unis = JSON.parse(fs.readFileSync('data/universities.json', 'utf8')); }
  catch (e) { return { errors: ['universities.json: ' + e.message], warnings }; }
  try { events = JSON.parse(fs.readFileSync('data/events.json', 'utf8')); }
  catch (e) { return { errors: ['events.json: ' + e.message], warnings }; }

  // --- universities ---
  const uniIds = new Set();
  unis.forEach((u, i) => {
    const at = `universities[${i}] (${u.id || '?'})`;
    for (const f of ['id', 'name', 'abbr', 'city', 'state', 'group', 'tlUrl', 'traditionalCountry'])
      if (typeof u[f] !== 'string' || !u[f].trim()) E(`${at}: missing/empty "${f}"`);
    if (typeof u.lat !== 'number' || typeof u.lng !== 'number') E(`${at}: lat/lng must be numbers`);
    if (u.state && !STATES.includes(u.state)) E(`${at}: invalid state "${u.state}"`);
    if (u.group && !GROUPS.includes(u.group)) E(`${at}: invalid group "${u.group}"`);
    if (uniIds.has(u.id)) E(`${at}: duplicate id`);
    uniIds.add(u.id);
  });

  // --- events ---
  const today = new Date().toISOString().slice(0, 10);
  const ids = new Set();
  events.forEach((e, i) => {
    const at = `events[${i}] (id ${e.id ?? '?'})`;
    if (typeof e.id !== 'number') E(`${at}: id must be a number`);
    else if (ids.has(e.id)) E(`${at}: duplicate id`); else ids.add(e.id);
    if (typeof e.title !== 'string' || !e.title.trim()) E(`${at}: missing/empty "title"`);
    if (typeof e.desc !== 'string' || !e.desc.trim()) E(`${at}: missing/empty "desc"`);
    if (typeof e.verified !== 'boolean') E(`${at}: "verified" must be true/false`);
    if (typeof e.uni !== 'string' || !e.uni.trim()) E(`${at}: missing "uni"`);
    else if (!uniIds.has(e.uni) && !PSEUDO_HOSTS.includes(e.uni)) E(`${at}: uni "${e.uni}" not in universities.json (or PSEUDO_HOSTS)`);
    if (!isDate(e.date)) E(`${at}: "date" must be YYYY-MM-DD (got "${e.date}")`);
    if (e.endDate !== undefined) {
      if (!isDate(e.endDate)) E(`${at}: "endDate" must be YYYY-MM-DD (got "${e.endDate}")`);
      else if (isDate(e.date) && e.endDate < e.date) E(`${at}: endDate (${e.endDate}) before date (${e.date})`);
    }
    if (e.url !== undefined && !/^https?:\/\//.test(e.url)) E(`${at}: "url" must start with http(s):// (got "${e.url}")`);
    if (typeof e.type !== 'string' || !e.type.trim()) E(`${at}: missing "type"`);
    else if (!KNOWN_TYPES.includes(e.type)) W(`${at}: unusual type "${e.type}" (not in known list)`);
    if (isDate(e.date) && (e.endDate || e.date) < today) W(`${at}: "${e.title}" is entirely in the past`);
  });

  return { errors, warnings, counts: { events: events.length, universities: unis.length } };
}

// Run standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors, warnings, counts } = validate();
  warnings.forEach(w => console.warn('⚠️  ' + w));
  if (errors.length) {
    errors.forEach(e => console.error('❌ ' + e));
    console.error(`\nvalidate-data: ${errors.length} error(s), ${warnings.length} warning(s) — FAILED`);
    process.exit(1);
  }
  console.log(`✅ validate-data: ${counts?.events} events, ${counts?.universities} universities valid (${warnings.length} warning(s))`);
}
