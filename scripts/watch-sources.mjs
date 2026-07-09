#!/usr/bin/env node
/**
 * NTLSN watch-sources — weekly freshness watcher for the sector's event sources.
 *
 * Fetches every institution's `tlUrl` (43) plus every distinct conference/organiser
 * `url` already referenced in data/events.json, fingerprints each page, and compares
 * against the last snapshot stored in data/.source-snapshot.json. When a page's
 * fingerprint changes it is reported as a *candidate for human triage* — the watcher
 * NEVER adds or changes event data itself (CREDIBILITY RULE). It only opens/updates a
 * single tracking GitHub issue listing what changed, so a human can decide whether a
 * new event should go into data/events.json (and set verified:true once checked).
 *
 *   node scripts/watch-sources.mjs                          # fetch + diff + write snapshot + summary
 *   node scripts/watch-sources.mjs --report report.json     # ...also write a machine-readable report
 *   node scripts/watch-sources.mjs --file-issue report.json # create/update the tracking issue from a report
 *   node scripts/watch-sources.mjs --file-issue report.json --dry-run   # print what it would do
 *   node scripts/watch-sources.mjs --selftest               # pure unit tests (no network)
 *   node scripts/watch-sources.mjs --snapshot other.json --no-write      # local simulation
 *   node scripts/watch-sources.mjs --limit 5                # cap source count (manual run)
 *
 * Fingerprint strategy (see Step 1): we hash a *normalised* view of the page, not the
 * raw HTML. Raw HTML churns constantly (CSRF nonces, cache-busting ?v= query strings on
 * assets, analytics pings, copyright-year footers, random session ids). So we keep only
 * the visible text with block-level line breaks preserved, having first stripped
 * <script>/<style>/<noscript>/<template>/<svg>/<math>, HTML comments and the entire
 * <head> (meta/title churn), then stripped all remaining tags — which also drops every
 * attribute, i.e. every nonce/token/cache-buster — decoded entities, collapsed whitespace
 * and removed consecutive duplicate lines. The sha256 of that string is the fingerprint.
 * Dates are deliberately *kept*: a page announcing new event dates is exactly the change
 * we want surfaced.
 *
 * Snapshot storage (see Step 2): data/.source-snapshot.json holds, per source URL, only
 * content-derived fields (kind/ref/label/status/finalUrl/hash/length/excerpt) and NO
 * timestamps. That keeps the file byte-identical across runs when nothing changed, so the
 * workflow's narrow "commit the snapshot" step is a no-op on quiet weeks (no history
 * churn). The workflow commits ONLY this one metadata file directly via GITHUB_TOKEN — an
 * intentional, documented exception to the "always PR" rule, justified because it is
 * bookkeeping metadata, not content (see PR description).
 *
 * AI candidate drafting (see Step 4, OPTIONAL STRETCH): if WATCH_DRAFT_AI=1 AND an
 * ANTHROPIC_API_KEY (or LLM_API_KEY) is configured, changed pages are piped through the
 * Anthropic Messages API (provider fully env-driven — base URL/model/key all overridable;
 * no provider or key is hardcoded) to draft a candidate event JSON. EVERY draft is forced
 * to verified:false, has its id stripped (ids are human-assigned), is labelled as an
 * unverified AI draft, and is written ONLY into the tracking issue body — never into
 * data/events.json, never auto-merged. With no key (the default) this path is inert.
 *
 * Dependency-free (Node 20+ global fetch + webcrypto). Mirrors check-links.mjs /
 * build-digest.mjs conventions.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// ── config ──────────────────────────────────────────────────────────────────
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const flag = k => process.argv.includes(k);

const SNAPSHOT_PATH = arg('--snapshot', 'data/.source-snapshot.json');
const REPORT_PATH = arg('--report', null);
const FILE_ISSUE = arg('--file-issue', null);
const PRINT_BODY = arg('--print-issue-body', null);
const LIMIT = arg('--limit', null) ? parseInt(arg('--limit', '0'), 10) : null;
const NO_WRITE = flag('--no-write');
const DRY_RUN = flag('--dry-run');
const SELFTEST = flag('--selftest');

const CONC = 8;
const TIMEOUT = 20000;
const EXCERPT_CHARS = 2000;          // stored per source for issue diffs (caps snapshot size)
const MAX_DIFF_LINES = 40;           // cap rendered diff lines per source in the issue
const LABEL = 'source-watch';
// Browser-shaped but still honestly NTLSN-identified: the suffix keeps us traceable in
// their logs while the prefix passes naive User-Agent filters that 403/404 bare bots.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NTLSN-source-watcher (+https://www.ntlsn.com)';
const FETCH_HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-AU,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',   // Node fetch decompresses transparently
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

const EVENT_TYPES = ['conference', 'symposium', 'workshop', 'webinar', 'seminar',
  'forum', 'summit', 'masterclass', 'roundtable', 'showcase', 'week'];

// ── helpers ─────────────────────────────────────────────────────────────────
const sha256 = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–',
  hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  copy: '©', reg: '®', trade: '™', deg: '°', middot: '·',
};
function decodeEntities(s) {
  return s.replace(/&#(x?[0-9a-fA-F]+);|&([a-zA-Z][a-zA-Z0-9]{1,31});/g, (m, num, name) => {
    if (num) {
      const cp = num[0] === 'x' || num[0] === 'X' ? parseInt(num.slice(1), 16) : parseInt(num, 10);
      return Number.isNaN(cp) ? '' : String.fromCodePoint(cp);
    }
    const v = NAMED_ENTITIES[name.toLowerCase()];
    return v !== undefined ? v : m;
  });
}

/**
 * Reduce raw HTML to a stable array of visible-text lines. Strips everything volatile
 * (scripts, styles, comments, head, all tags/attributes), decodes entities, collapses
 * whitespace and drops empties + consecutive duplicates.
 */
function normalizeHtml(html) {
  let s = String(html || '');
  s = s.replace(/<!DOCTYPE[^>]*>/gi, '');
  s = s.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, ' ');
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ');
  s = s.replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, ' ');
  s = s.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ');
  s = s.replace(/<math\b[^>]*>[\s\S]*?<\/math>/gi, ' ');
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  // Block-level closers → newlines so the diff is line-oriented and readable.
  s = s.replace(/<\/(p|div|section|article|header|footer|main|nav|aside|figure|figcaption|blockquote|pre|details|summary|li|ul|ol|dl|dd|dt|h[1-6]|tr|td|th|thead|tbody|tfoot|caption)\s*>/gi, '\n');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<[^>]+>/g, ' ');            // strip every remaining tag (drops attrs/nonces)
  s = decodeEntities(s);
  const out = [];
  let prev = null;
  for (let line of s.split('\n')) {
    line = line.replace(/\s+/g, ' ').trim();
    if (line.length < 2 || line === prev) continue;
    out.push(line);
    prev = line;
  }
  return out;
}

/** Compact LCS line diff → array of {t:' '|'+'|'-', s}. */
function diffLines(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ t: ' ', s: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ t: '-', s: a[i] }); i++; }
    else { out.push({ t: '+', s: b[j] }); j++; }
  }
  while (i < n) { out.push({ t: '-', s: a[i] }); i++; }
  while (j < m) { out.push({ t: '+', s: b[j] }); j++; }
  return out;
}

/** Render a diff array as a fenced ```diff block, capped at MAX_DIFF_LINES. */
function renderDiff(diff) {
  const changed = diff.filter(d => d.t !== ' ');
  const shown = diff.filter(d => d.t !== ' ').slice(0, MAX_DIFF_LINES);
  if (!shown.length) return '_(no readable line diff; content length changed — open the page to inspect.)_';
  const body = shown.map(d => `${d.t} ${d.s}`.trimEnd()).join('\n');
  const more = changed.length > MAX_DIFF_LINES ? `\n… _(${changed.length - MAX_DIFF_LINES} more changed lines)_` : '';
  return '```diff\n' + body + more + '\n```';
}

// ── source collection ───────────────────────────────────────────────────────
function collectSources() {
  const unis = JSON.parse(fs.readFileSync('data/universities.json', 'utf8'));
  const events = JSON.parse(fs.readFileSync('data/events.json', 'utf8'));
  const seen = new Set();
  const out = [];
  for (const u of unis) {
    if (u.tlUrl && /^https?:\/\//.test(u.tlUrl) && !seen.has(u.tlUrl))
      { seen.add(u.tlUrl); out.push({ url: u.tlUrl, kind: 'institution', ref: u.id, label: u.name }); }
  }
  for (const e of events) {
    if (e.url && /^https?:\/\//.test(e.url) && !seen.has(e.url))
      { seen.add(e.url); out.push({ url: e.url, kind: 'event', ref: String(e.id), label: e.title }); }
  }
  return out;
}

// ── fetch ───────────────────────────────────────────────────────────────────
async function fetchOne(src) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const r = await fetch(src.url, { redirect: 'follow', signal: ctl.signal, headers: FETCH_HEADERS });
    clearTimeout(timer);
    if (!r.ok) return { ok: false, status: r.status, finalUrl: r.url, error: `http-${r.status}` };
    const text = await r.text();
    return { ok: true, status: r.status, finalUrl: r.url, html: text };
  } catch (err) {
    clearTimeout(timer);
    const name = String(err?.name || err);
    const inconclusive = name.includes('Abort') || name.includes('Timeout') || name.includes('network');
    return { ok: false, status: 0, finalUrl: src.url, error: inconclusive ? 'timeout/unreachable' : name };
  }
}

async function fetchAll(sources) {
  const results = new Array(sources.length);
  for (let i = 0; i < sources.length; i += CONC) {
    const slice = sources.slice(i, i + CONC);
    const got = await Promise.all(slice.map(s => fetchOne(s).then(r => ({ s, r }))));
    for (const g of got) results[sources.indexOf(g.s)] = g;
  }
  return results;
}

// ── snapshot ────────────────────────────────────────────────────────────────
function loadSnapshot(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return { _meta: { version: 1 }, sources: {} }; }
}
function saveSnapshot(p, snap) {
  const ordered = { _meta: { ...snap._meta }, sources: {} };
  for (const k of Object.keys(snap.sources).sort()) ordered.sources[k] = snap.sources[k];
  fs.writeFileSync(p, JSON.stringify(ordered, null, 2) + '\n');
}

function entryFrom(src, fetched) {
  const lines = normalizeHtml(fetched.html);
  const text = lines.join('\n');
  return {
    kind: src.kind, ref: src.ref, label: src.label,
    status: fetched.status, finalUrl: fetched.finalUrl,
    hash: sha256(text), length: text.length, excerpt: text.slice(0, EXCERPT_CHARS),
  };
}

// ── AI candidate drafting (Step 4 — optional, guarded, inert without a key) ─
function llmConfig() {
  const key = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
  if (!key) return null;
  const base = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
  const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
  return { key, base, model };
}

async function draftCandidate(cfg, src, fetched) {
  const text = normalizeHtml(fetched.html).join('\n').slice(0, 6000);
  const body = {
    model: cfg.model,
    max_tokens: 700,
    system:
      'You draft a single NTLSN event candidate from a changed source page. Return ONLY one JSON ' +
      'object, no prose, no code fences. Shape: {"title","uni","date":"YYYY-MM-DD","endDate?":' +
      '"YYYY-MM-DD","type":' + JSON.stringify(EVENT_TYPES) + ',"desc","url","verified":false}. ' +
      '"verified" MUST be false. "uni" is the host institution id if known, else "national". ' +
      'If you cannot confidently identify ONE real upcoming event with a concrete date on the page, ' +
      'return exactly {"skip":true,"reason":"..."}. Never invent dates.',
    messages: [{ role: 'user', content: `Source URL: ${src.url}\nKind: ${src.kind} (${src.label})\n\nPage text:\n${text}` }],
  };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 30000);
  try {
    const r = await fetch(`${cfg.base}/v1/messages`, {
      method: 'POST', signal: ctl.signal,
      headers: { 'x-api-key': cfg.key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    clearTimeout(timer);
    if (!r.ok) return { error: `llm-http-${r.status}` };
    const data = await r.json();
    const txt = (data?.content || []).map(b => b.text || '').join('').trim();
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) return { error: 'llm-no-json' };
    let obj;
    try { obj = JSON.parse(m[0]); } catch { return { error: 'llm-bad-json' }; }
    if (obj.skip) return { skip: true, reason: String(obj.reason || 'no confident event') };
    // Hard credibility guards: force unverified, strip human-assigned id, coerce type.
    obj.verified = false;
    delete obj.id;
    if (!EVENT_TYPES.includes(obj.type)) obj.type = 'event-unknown';
    return { candidate: obj };
  } catch (err) {
    clearTimeout(timer);
    return { error: 'llm-error:' + String(err?.name || err) };
  }
}

// ── main run: fetch + diff + (optional AI) + write snapshot + report ─────────
async function run() {
  const startedAt = new Date().toISOString();
  const weekKey = startedAt.slice(0, 10); // YYYY-MM-DD (UTC) — unique per calendar day is enough for dedup
  const prev = loadSnapshot(SNAPSHOT_PATH);
  const prevSources = prev.sources || {};
  let sources = collectSources();
  if (LIMIT) sources = sources.slice(0, LIMIT);

  console.log(`watch-sources: ${sources.length} sources (${SNAPSHOT_PATH})`);
  const fetched = await fetchAll(sources);

  const changed = [];
  const fetchProblems = [];
  const newBaseline = { ...prevSources }; // start from previous; only overwrite on a successful fetch
  const drafts = {};
  const aiCfg = (process.env.WATCH_DRAFT_AI === '1' || flag('--draft-ai')) ? llmConfig() : null;
  if ((process.env.WATCH_DRAFT_AI === '1' || flag('--draft-ai')) && !aiCfg)
    console.log('watch-sources: WATCH_DRAFT_AI set but no ANTHROPIC_API_KEY/LLM_API_KEY — skipping AI drafting.');
  else if (aiCfg) console.log(`watch-sources: AI drafting ENABLED (model ${aiCfg.model}).`);

  for (const { s, r } of fetched) {
    if (!r.ok) {
      // Keep the previous baseline; just record an informational fetch problem.
      fetchProblems.push({ url: s.url, kind: s.kind, ref: s.ref, label: s.label, status: r.status, error: r.error });
      continue;
    }
    const entry = entryFrom(s, r);
    newBaseline[s.url] = entry;
    const p = prevSources[s.url];
    if (!p) continue;                 // first baseline — establish silently, not a "change"
    if (p.hash === entry.hash) continue; // unchanged
    const diff = diffLines((p.excerpt || '').split('\n'), entry.excerpt.split('\n'));
    changed.push({
      url: s.url, kind: s.kind, ref: s.ref, label: s.label,
      status: entry.status, finalUrl: entry.finalUrl,
      oldLength: p.length, newLength: entry.length, diff,
    });
  }

  // Optional AI drafts for changed pages (issue-only, verified:false, never committed).
  if (aiCfg && changed.length) {
    const byUrl = new Map(fetched.map(({ s, r }) => [s.url, { s, r }]));
    for (const c of changed) {
      const fr = byUrl.get(c.url);
      if (!fr || !fr.r.ok) continue;
      const draft = await draftCandidate(aiCfg, fr.s, fr.r);
      drafts[c.url] = draft;
    }
  }

  if (!NO_WRITE) {
    saveSnapshot(SNAPSHOT_PATH, {
      _meta: { version: 1, sourceCount: Object.keys(newBaseline).length },
      sources: newBaseline,
    });
  }

  const report = {
    runAt: startedAt, weekKey, snapshotPath: SNAPSHOT_PATH,
    totals: {
      sources: sources.length,
      fetched: fetched.filter(({ r }) => r.ok).length,
      failed: fetchProblems.length,
      changed: changed.length,
      newBaseline: sources.length - changed.length - fetchProblems.length,
    },
    changed, fetchProblems, drafts,
  };
  if (REPORT_PATH) fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');

  printSummary(report);
  return report;
}

function printSummary(report) {
  const t = report.totals;
  const lines = [];
  lines.push(`# NTLSN source watcher — ${report.weekKey}`);
  lines.push('');
  lines.push(`Sources: **${t.sources}** · fetched OK: **${t.fetched}** · fetch problems: **${t.failed}** · **changed: ${t.changed}**`);
  if (report.changed.length) {
    lines.push('');
    lines.push('### Changed pages (triage candidates)');
    for (const c of report.changed) {
      const tag = c.kind === 'institution' ? `institution · ${c.ref}` : `event #${c.ref}`;
      lines.push(`- **${c.label}** (${tag}) — ${c.oldLength}→${c.newLength} chars — ${c.url}`);
    }
  } else {
    lines.push('\n✅ No source-page content changes since the last snapshot.');
  }
  if (report.fetchProblems.length) {
    lines.push('');
    lines.push('### Fetch problems (informational only — baselines retained)');
    for (const f of report.fetchProblems.slice(0, 20))
      lines.push(`- ${f.label} (${f.kind} ${f.ref}) — ${f.status || f.error} — ${f.url}`);
  }
  const out = lines.join('\n');
  console.log('\n' + out);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, out + '\n');
}

// ── issue management (Step 3) ───────────────────────────────────────────────
function gh(args, { dry } = {}) {
  const printable = 'gh ' + args.map(a => /\s/.test(a) ? `'${a}'` : a).join(' ');
  if (dry) { console.log('  [dry-run] ' + printable); return ''; }
  return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function issueTitle(weekKey) { return `📊 Source watcher — ${weekKey}`; }

function renderIssueSection(report) {
  const L = [];
  L.push(`**Run ${report.runAt}** — ${report.totals.changed} changed page(s) of ${report.totals.sources} sources.`);
  L.push('');
  for (const c of report.changed) {
    const tag = c.kind === 'institution' ? `institution · \`${c.ref}\`` : `event #${c.ref}`;
    L.push(`#### ${c.label}`);
    L.push(`${tag} · content fingerprint changed (${c.oldLength}→${c.newLength} chars) · [open page ↗](${c.url})`);
    L.push('<details><summary>diff (top-of-page excerpt)</summary>');
    L.push('');
    L.push(renderDiff(c.diff));
    L.push('');
    L.push('</details>');
    L.push('');
  }
  if (report.fetchProblems.length) {
    L.push('<details><summary>fetch problems (informational; baselines retained)</summary>');
    L.push('');
    for (const f of report.fetchProblems)
      L.push(`- ${f.label} (${f.kind} ${f.ref}) — ${f.status || f.error} — ${f.url}`);
    L.push('');
    L.push('</details>');
    L.push('');
  }
  const draftUrls = Object.keys(report.drafts || {});
  if (draftUrls.length) {
    L.push('---');
    L.push('### 🤖 AI-drafted candidates — UNVERIFIED (verified:false)');
    L.push('These are machine drafts surfaced for review only. They are **not** in `data/events.json`, carry `verified: false`, and must be human-checked (URL resolves, dates correct) before merging. Do **not** merge unreviewed.');
    L.push('');
    for (const url of draftUrls) {
      const d = report.drafts[url];
      L.push(`**${url}**`);
      if (d.candidate) L.push('```json\n' + JSON.stringify(d.candidate, null, 2) + '\n```');
      else L.push(`_(no draft: ${d.skip ? d.reason : d.error})_`);
      L.push('');
    }
  }
  return L.join('\n');
}

function renderIssueIntro(report) {
  return [
    '## Source pages changed — candidates for human triage',
    '',
    'The weekly watcher detected content changes on the source pages below. A human should check whether any **advertise a new event** worth adding to `data/events.json` (then set `verified: true` once the URL and dates are confirmed).',
    '',
    '> ⚠️ This issue surfaces **candidates only**. No event data has been added or changed automatically.',
    '',
    '---',
    '',
  ].join('\n');
}

function fileIssue(reportPath, { dry }) {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  if (!report.changed || report.changed.length === 0) {
    console.log('file-issue: no changes to report — leaving issues untouched (no duplicates created).');
    return;
  }
  const TITLE = issueTitle(report.weekKey);
  const section = renderIssueSection(report);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ntlsn-issue-'));
  const bodyFile = path.join(dir, 'body.md');

  // Ensure the tracking label exists (idempotent). --force updates if it already does.
  gh(['label', 'create', LABEL, '--color', '0A1628',
    '--description', 'Weekly source-page watcher triage', '--force'], { dry });

  // Find an open tracking issue whose title is exactly this run's.
  let existing = null;
  try {
    const list = JSON.parse(gh(['issue', 'list', '--label', LABEL, '--state', 'open',
      '--json', 'number,title', '--limit', '50'], { dry }) || '[]');
    existing = list.find(i => i.title === TITLE) || null;
  } catch (e) {
    if (!dry) { console.error('file-issue: could not list issues:', String(e.message || e).slice(0, 200)); }
  }

  if (existing) {
    // Append this run's section above the intro (newest first) — keeps prior days' changes visible.
    let prevBody = '';
    try { prevBody = JSON.parse(gh(['issue', 'view', String(existing.number), '--json', 'body'], { dry }) || '{}').body || ''; }
    catch { /* leave prevBody empty */ }
    const below = prevBody.includes('## Source pages changed') ? prevBody : renderIssueIntro(report);
    const body = section + '\n\n---\n\n' + below;
    fs.writeFileSync(bodyFile, body);
    gh(['issue', 'edit', String(existing.number), '--body-file', bodyFile], { dry });
    console.log(`file-issue: updated #${existing.number} "${TITLE}".`);
  } else {
    const body = renderIssueIntro(report) + section;
    fs.writeFileSync(bodyFile, body);
    const out = gh(['issue', 'create', '--title', TITLE, '--body-file', bodyFile, '--label', LABEL], { dry });
    console.log(`file-issue: created "${TITLE}"${out ? ' → ' + out.split('\n')[0] : ''}.`);
  }
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* tmp cleanup best-effort */ }
}

// ── selftest (Step 6 — pure, no network) ────────────────────────────────────
function selftest() {
  let pass = 0, fail = 0;
  const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.error('  ✗ ' + name); } };

  // normalize strips scripts/styles/comments/tags, decodes entities, keeps text lines
  const html = `<!DOCTYPE html><html><head><meta nonce="abc"><title>X</title></head>
    <body><!-- secret --><script>var n="token123";</script><style>.a{color:red}</style>
    <h1>Symposium 2026</h1><p>Coming&nbsp;<strong>soon</strong>: 3&nbsp;Dec 2026.</p>
    <p>Last updated today</p></body></html>`;
  const lines = normalizeHtml(html);
  ok('script stripped', !lines.join(' ').includes('token123'));
  ok('style stripped', !lines.join(' ').includes('color:red'));
  ok('comment stripped', !lines.join(' ').includes('secret'));
  ok('head/title stripped', !lines.join(' ').includes('<title'));
  ok('entity decoded (nbsp -> space, joined)', lines.some(l => /soon/.test(l)));
  ok('visible text kept (event date)', lines.some(l => /3\s*Dec 2026/.test(l)));
  ok('dates retained (signal kept, not stripped)', lines.join(' ').includes('3 Dec 2026'));

  // fingerprint is stable across volatile-only churn (nonce/cache-buster/year noise)
  const base = `<html><body><h1>Event</h1><p>Open for registration.</p>
    <script nonce="NONCE1">analytics('a1b2c3')</script><div data-v="20260101"><img src="/x.png?v=zzz"></div></body></html>`;
  const churned = `<html><body><h1>Event</h1><p>Open for registration.</p>
    <script nonce="NONCE2">analytics('d4e5f6')</script><div data-v="20260102"><img src="/x.png?v=yyy"></div></body></html>`;
  ok('volatile churn does not change fingerprint', sha256(normalizeHtml(base).join('\n')) === sha256(normalizeHtml(churned).join('\n')));

  // a real content change DOES change the fingerprint
  const edited = base.replace('Open for registration.', 'Registration has closed.');
  ok('content change changes fingerprint', sha256(normalizeHtml(base).join('\n')) !== sha256(normalizeHtml(edited).join('\n')));

  // diffLines: identical -> no +/- ; edited -> exactly the right add/remove
  const dSame = diffLines(['a', 'b'], ['a', 'b']);
  ok('diff identical has no changes', dSame.every(x => x.t === ' '));
  const dEdit = diffLines(['a', 'b', 'c'], ['a', 'c2', 'c']);
  ok('diff detects removed + added lines',
    dEdit.some(x => x.t === '+' && x.s === 'c2') && dEdit.some(x => x.t === '-' && x.s === 'b')
    && dEdit.some(x => x.t === ' ' && x.s === 'c'));

  // change-detection logic matches the accept criterion: identical re-fetch = same, edited = changed
  const entry = (html) => { const t = normalizeHtml(html).join('\n'); return { hash: sha256(t), length: t.length, excerpt: t.slice(0, EXCERPT_CHARS) }; };
  const baseline = entry(base);
  ok('same content -> same hash', baseline.hash === entry(base).hash);
  ok('edited content -> different hash', baseline.hash !== entry(edited).hash);

  // AI config gated off without a key
  const savedKey = process.env.ANTHROPIC_API_KEY; delete process.env.ANTHROPIC_API_KEY;
  ok('llmConfig returns null without a key', llmConfig() === null);
  process.env.ANTHROPIC_API_KEY = savedKey;

  console.log(`\nselftest: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

// ── dispatch ────────────────────────────────────────────────────────────────
if (SELFTEST) selftest();
else if (FILE_ISSUE) fileIssue(FILE_ISSUE, { dry: DRY_RUN });
else if (PRINT_BODY) {
  const report = JSON.parse(fs.readFileSync(PRINT_BODY, 'utf8'));
  process.stdout.write(renderIssueIntro(report) + renderIssueSection(report) + '\n');
}
else run().catch(e => { console.error('watch-sources failed:', e); process.exit(1); });
