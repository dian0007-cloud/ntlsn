# TASKS.md — NTLSN full-day Claude Code backlog

Sequenced for a full day (or several). Each task has acceptance criteria and a ready-to-paste Claude Code prompt. Work top-to-bottom within an epic; epics 2–4 can interleave once Epic 0 is done. Read `CLAUDE.md` first in every session.

Legend: ⏱ rough effort · 🔴 blocking dependency

---

## EPIC 0 — Foundations (do these first, ~1 hr)

### 0.1 Initialise the repo properly ⏱ 15 min
Git-init, commit the current deploy folder verbatim as the baseline, add `.gitignore`, connect to GitHub, wire Cloudflare Pages (or current host) to deploy from `main`.
**Accept:** `git log` shows a pristine baseline commit; pushing to `main` deploys; rollback is one revert away.
**Prompt:** *"Read CLAUDE.md. Initialise a git repo here, commit everything as 'baseline: production deploy 2026-06-10', create a sensible .gitignore for a static site + node scripts, and write me the exact Cloudflare Pages settings (build command: `node scripts/build-feeds.mjs --out .`, output dir: `/`) to connect this repo."*

### 0.2 JSON Schema + validation for the data layer ⏱ 30 min 🔴 gates all data edits
Write `schemas/event.schema.json` and `schemas/university.schema.json`; add `scripts/validate-data.mjs` (ajv) that fails on bad dates (endDate < date), unknown `uni` ids, duplicate event ids, dead required fields. Wire into `build-feeds.mjs` as a pre-step.
**Accept:** corrupting any field in `data/events.json` makes the build fail with a line-precise error.
**Prompt:** *"Read CLAUDE.md and data/events.json + data/universities.json. Create JSON Schemas for both, a validate-data.mjs using ajv with cross-checks (uni id exists, date ≤ endDate, unique ids, valid URL format, type enum), and call it at the top of build-feeds.mjs. Show me a deliberate failure to prove it works."*

### 0.3 CI pipeline ⏱ 20 min
GitHub Action: on PR → validate data, run build-feeds, run Playwright smoke (added in 4.3 — stub for now), Lighthouse CI on the built page with budgets (perf ≥ 80, a11y ≥ 95).
**Accept:** a PR with an invalid event is red; a clean PR is green with Lighthouse scores in the summary.

---

## EPIC 1 — Source recovery (the strategic one, ~3–4 hrs)

The 912KB minified bundle is unmaintainable and the 12 patch scripts are technical debt with a shelf life. Strangler-fig it: rebuild the source incrementally, using the live site as the visual spec and `data/*.json` as the data layer.

### 1.1 Scaffold the source app ⏱ 45 min
Vite + React + TypeScript + Tailwind, importing `data/*.json` directly. Recreate the shell: nav, hero (LIVE/FREE/OPEN-SOURCE badges), footer, Acknowledgement of Country, section order exactly as the `ntlsn-order` patch script dictates (the canonical order is listed there — extract it).
**Accept:** `npm run dev` renders nav→hero→footer pixel-faithful to production; section ids match so anchors keep working.
**Prompt:** *"Read CLAUDE.md, then read the `ntlsn-order` script inside index.html to extract the canonical section order. Scaffold Vite+React+TS+Tailwind in /src. Build the app shell (nav, hero with the three badges, footer, Acknowledgement) matching production's dark-navy design tokens from CLAUDE.md. Wire data/*.json as the data source."*

### 1.2 Port sections one at a time ⏱ 2–3 hrs (parallelisable across sessions)
Order of value: Events list + Due Soon → Year view → Conferences → Directory/map → PD → Resources → everything else. Each section is one PR. Fold the relevant patch script into the component as you go (e.g. video lightbox becomes a `<VideoLightbox>` component; favicon badges become part of `<ConferenceCard>`; a11y patches become correct markup, then delete the patch).
**Accept:** for each ported section — visually faithful, patch script deleted, axe-core clean, no regression in the unported remainder.

### 1.3 Cutover ⏱ 30 min
When all sections are ported: production build replaces the old bundle; keep old index.html as `legacy.html` for 30 days; bump `sw.js` cache name.
**Accept:** Lighthouse perf improves (target: JS shipped < 350KB); zero patch scripts remain; all 12 behaviours preserved.

---

## EPIC 2 — Features users will feel (~3 hrs, can start before Epic 1 finishes)

### 2.1 Per-event "Add to calendar" ⏱ 45 min
Each event card gets a calendar button: Google Calendar deep-link + a per-event `.ics` download (generate `events/ntlsn-<id>.ics` files in build-feeds, or synthesise client-side as a data: URI). Site-wide "Subscribe to the whole calendar" CTA pointing at `/events.ics` with a small modal explaining Google/Outlook/Apple subscribe steps (webcal:// link variant).
**Accept:** subscribing in Google Calendar shows all 94 events; a single-event add lands with correct dates and the event URL in the description.
**Prompt:** *"Read CLAUDE.md. /events.ics already exists. Add (a) per-event Google Calendar links and per-event ICS download, and (b) a 'Subscribe to sector calendar' modal with platform-specific instructions and a webcal://www.ntlsn.com/events.ics link. Implement as a patch script if Epic 1's Events section isn't ported yet; as a component if it is."*

### 2.2 Search + shareable filters ⏱ 1 hr
Full-text search across title/desc/uni; filters for type, state, network group (Go8/ATN/IRU/RUN/Unaligned), month. Filter state serialised to URL params so a colleague can be sent `ntlsn.com/?type=symposium&state=QLD`.
**Accept:** every filter combination is linkable and restores on load; works with the SPA redirect.

### 2.3 Embeddable widget — the sector-positioning play ⏱ 1 hr
A `widget.js` any university L&T unit can drop on their page: `<script src="https://www.ntlsn.com/widget.js" data-uni="unisq" data-limit="5"></script>` renders that institution's (or the sector's) next N events, styled neutrally, linking back to NTLSN. Reads `/data/events.json` (already CORS-open). Add a "Embed NTLSN on your site" section with copy-paste code.
**Accept:** widget renders standalone on a blank test page; respects `data-uni` and `data-limit`; total widget payload < 15KB.
**Why it matters:** every embed is a backlink and a distribution channel — this is how NTLSN becomes infrastructure rather than a website.

### 2.4 Email digest ⏱ 45 min
Weekly "what's on across the sector" email. Cheapest robust path: Buttondown (or similar) consuming `/feed.xml` RSS-to-email; add a subscribe form section. Alternative: GitHub Action that renders a Monday-morning HTML digest from events.json and posts via an email API.
**Accept:** test subscriber receives a digest containing the next 14 days of events grouped by state.

### 2.5 Submission pipeline hardening ⏱ 45 min
The share form posts to a Google Apps Script. Keep it, but add: client-side validation, honeypot field, optimistic UI you already have, and a documented moderation runbook (`docs/moderation.md`: where the Sheet is, what "approved" means, the test-row filters already coded into the feed script). Stretch: migrate to Cloudflare Pages Functions + Turnstile.
**Accept:** spam-bot submission is silently dropped; legitimate submission appears in the Sheet; runbook exists.

---

## EPIC 3 — Data pipeline & freshness (~2 hrs)

### 3.1 Event-source watcher ⏱ 1.5 hrs
GitHub Action (weekly) that fetches the 43 `tlUrl` pages + the known conference URLs in events.json, diffs against last snapshot, and opens a draft PR / issue listing changed pages so new events can be triaged. Stretch: pipe the diff through the Claude API to draft candidate event JSON (always `verified: false` until human-checked).
**Accept:** action runs green; a simulated page change produces an issue with the diff.

### 3.2 Auto-expiry + archive ⏱ 30 min
Build step moves past events into `data/archive-2026.json` (kept for the "what the data shows" stats), keeps feeds lean, and flags events whose URL now 404s.
**Accept:** an event dated yesterday disappears from feed.xml and JSON-LD but stays in the archive; 404 report appears in build output.

---

## EPIC 4 — Quality, a11y, performance (~2 hrs)

### 4.1 WCAG 2.2 AA audit ⏱ 45 min
Run axe-core + manual keyboard pass over the live page. The runtime a11y patches (skip-link, icon labels, link names, landmarks) paper over root causes — log each finding as a source-fix task for Epic 1.2.
**Accept:** written audit in `docs/a11y-audit.md` with severity, WCAG criterion, and fix location; zero axe critical/serious issues after fixes.

### 4.2 Performance budget ⏱ 45 min
1MB inline HTML is the elephant. Quick wins pre-rebuild: move the bundle to an external `app.js` with `defer` + long-cache immutable filename (drops repeat-visit cost dramatically given `_headers`), lazy-load the map and YouTube iframes (facade pattern), `loading="lazy"` everywhere, preconnect hints.
**Accept:** Lighthouse perf ≥ 85 mobile; repeat-visit transfer < 50KB; no layout shift regressions (CLS < 0.1).

### 4.3 Playwright smoke suite ⏱ 30 min
Nav anchors land on correct sections; search/filter works; share form validates; video lightbox opens and closes with Escape; ICS link returns `text/calendar`; feed.xml parses.
**Accept:** `npx playwright test` green locally and in CI.

---

## EPIC 5 — Sector positioning & open source (~1 hr)

### 5.1 Make "open-source" true ⏱ 30 min
The hero badge says OPEN-SOURCE — the repo should substantiate it. Public GitHub repo, MIT (code) + CC-BY 4.0 (data) dual licence, README with the project's purpose and Acknowledgement, CONTRIBUTING.md (how to submit an event via PR to data/events.json — the schema from 0.2 makes this safe), data dictionary.
**Accept:** a stranger could submit a valid event PR using only the README; licence files present.

### 5.2 SEO & rich results ⏱ 30 min
Submit sitemap to Search Console; validate the Event JSON-LD in the Rich Results test; per-section OG variants; check `feed.xml` and `events.ics` are referenced via `<link rel="alternate">` (already injected — verify post-deploy).
**Accept:** Rich Results test shows valid Event items; Search Console accepts the sitemap.

---

## Suggested day plan

| Block | Tasks |
|---|---|
| Morning 1 | 0.1 → 0.2 → 0.3 |
| Morning 2 | 2.1 (ship a user-visible win early) → 2.2 |
| Midday | 1.1 → start 1.2 (Events + Due Soon sections) |
| Afternoon 1 | 2.3 (embed widget) → 3.2 |
| Afternoon 2 | 4.1 → 4.2 → 4.3 |
| Wrap | 5.1 → 5.2 → 2.4 if time |

Epic 1.2's remaining sections and 3.1 are the multi-day tail.
