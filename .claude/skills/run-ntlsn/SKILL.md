---
name: run-ntlsn
description: Run, launch, serve, screenshot and drive the NTLSN static site, and validate/rebuild its data layer (events.ics, feed.xml). Use when asked to run, start, open, screenshot, visually verify, or drive NTLSN, or to validate its event/university data and regenerate calendar feeds.
---

# run-ntlsn — launch & drive the NTLSN site

NTLSN is a **single-file static SPA**: `index.html` (~1.7 MB) contains a compiled React bundle plus ~12 small inline patch scripts. There is **no build step for the app** — `index.html` is the deployable artifact. It renders **client-side**, so `curl` only gets the shell; to see rendered content you drive a real browser with `.claude/skills/run-ntlsn/driver.mjs` (Playwright). The only "build" in this repo is data → feed generation (`scripts/build-feeds.mjs`).

Paths below are relative to the **repo root**. Verified on macOS (Node 20.15.1); the serve + node commands are identical on Linux.

## Prerequisites

- **python3** — serves the static files (built in on macOS; `apt-get install python3` on Linux).
- **Node ≥ 20** (verified 20.15.1; at `~/.local/bin/node` off the default PATH on this machine).
- **A Chromium executable**, auto-detected by the driver from the Playwright cache. Acquire once (see Setup).

## Setup (once)

Install the driver's one dependency into the skill dir (keeps `node_modules` scoped here, not at repo root — and `.gitignore` already ignores `node_modules/`):

```bash
npm install --prefix .claude/skills/run-ntlsn
```

Acquire a Chromium if the Playwright cache is empty (`~/Library/Caches/ms-playwright` on macOS, `~/.cache/ms-playwright` on Linux). The bare `npx playwright install chromium` refuses without `playwright` as a project dep, so install the CLI first:

```bash
npm install playwright && npx playwright install chromium
```

(If you already have Chrome installed, skip that and set `PLAYWRIGHT_CHROMIUM=/path/to/chrome` — the driver honours it.)

## Run — agent path (use this)

From the repo root, serve the site on a local port (background it; it blocks):

```bash
python3 -m http.server 8080 --directory .
```

In another shell, drive it — the driver launches headless Chromium, dismisses the location gate, runs a search, captures screenshots, and prints a hydration summary:

```bash
node .claude/skills/run-ntlsn/driver.mjs --out run-shots
```

Flags: `--url` (default `http://127.0.0.1:8080/`), `--query` (search term, default `assessment`), `--out` (shot dir, default `./run-shots`), `--fullpage` (also capture a tall full-page shot), `--no-drive` (just load + hero shot, skip search).

Then **look at the screenshots** (`run-shots/01-hero.png`, `02-home.png`, `03-search.png`) — confirm the hero rendered with the `NTLSN` / `FREE` / `open-source` claims, not a blank/error page. The printed JSON includes `hydration` (link/button counts, claim flags) and `consoleErrors` — a healthy run shows 0 console errors and ~480+ buttons. Known cosmetic quirk: `hydration.says42` and `says43` are both `true` (hero text says "42 universities" while data has 43 — a known stale-count issue, not a regression you introduced).

## Data / dev layer — what PRs actually touch

Most PRs touch `data/events.json` / `data/universities.json` and the feed generators, not the bundle. The layer a PR usually exercises:

```bash
node scripts/validate-data.mjs                 # guards the data layer; exit 1 on hard errors
```

Validates required fields, uni-id references, duplicate ids, date formats, URLs. Prints `✅ validate-data: N events, 43 universities valid (N warning(s))` — the event count drifts continuously as `archive-events.mjs` prunes past events, so never assert a specific number. "Event entirely in the past" warnings are **non-fatal** (expected as the year progresses).

```bash
node scripts/build-feeds.mjs --out /tmp/build-check   # regenerates feeds; also re-validates
```

Emits `events.ics`, `feed.xml`, `sitemap.xml`, `events-ld.json` into `--out` (omit `--out` to write to the repo root). Past events are archived (feed shows upcoming only).

```bash
node scripts/check-links.mjs                   # pings every event URL; exit 1 on confirmed-dead
```

The weekly CI link-checker. Treats 403/429/timeouts as "alive" (bot-blocks), fails only on 404/410/DNS.

## Test (canonical CI path — mirrors `.github/workflows/ci.yml`)

```bash
node scripts/validate-data.mjs && node scripts/build-feeds.mjs --out /tmp/build-check && \
  for f in events.ics feed.xml sitemap.xml events-ld.json; do test -s "/tmp/build-check/$f" || exit 1; done
```

This is exactly what runs on every PR. Green here ≈ the data layer is intact.

## Run — human path

`open index.html` directly **won't** work well — the SPA fetches `/data/*.json`, registers a service worker, and the patch scripts expect same-origin. Serve it (above) and visit `http://127.0.0.1:8080/`. For production deploys, drag the folder onto Netlify's Deploys tab or connect the repo to Cloudflare Pages (`_headers` / `_redirects` are applied by the host).

## Gotchas

- **Client-side render.** `curl http://127.0.0.1:8080/` returns the 1.7 MB shell but NOT rendered content (events, map, cards all come from the inline bundle's JS). Always use the driver to verify rendering.
- **Don't use `waitUntil: 'networkidle'`.** The patch scripts fetch two Google Apps Script endpoints that are cold-start and rate-limited and **fail soft**; `networkidle` hangs. The driver uses `domcontentloaded` + a 2.5 s settle. Same reason the run prints 0 console errors even though those fetches may be failing — they're swallowed.
- **Location gate overlay.** First load shows an "In Australia / Elsewhere / Just browsing — skip" gate that sits above the fold. The driver clicks "Just browsing — skip"; if you script your own flow, dismiss it first or it intercepts clicks.
- **The filter chips are `<div>`, not `<button>`.** `getByRole('button', …)` won't match them, and after a search the results dropdown intercepts pointer events over the rail. The driver deliberately skips the chip click — use the search box (the one above the fold, `placeholder*="Search symposiums, events"`) as your reliable interaction. There's a *second* search box (`placeholder*="institutions, themes"`) that lives in a collapsed section and is not visible without expanding it.
- **Two university counts.** `42 universities` (hero copy) vs `43` (data) — pre-existing, do not "fix" as part of running the app.
- **Acknowledgement of Country / "Unceded Lands"** elements are load-bearing cultural content (see CLAUDE.md) — never strip or reorder them when scripting the DOM.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module 'playwright-core'` | Run `npm install --prefix .claude/skills/run-ntlsn` (the dep lives in the skill dir, not repo root). |
| `No Chromium found` from the driver | Acquire one: `npm install playwright && npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM` to a Chrome path. |
| `npx playwright install chromium` prints a "install your dependencies first" guard | It needs `playwright` as a package — run `npm install playwright` in the same project first (the bare `npx` form refuses without it). |
| `node`/`npm` not found | On this machine they're at `~/.local/bin` (off default PATH): `export PATH="$HOME/.local/bin:$PATH"`. |
| Search step throws "element not visible" | You targeted the collapsed-section search box. Use the above-the-fold one (`placeholder*="Search symposiums, events"`), and dismiss the location gate first. |
| `index.html` looks broken via `file://` | Expected — serve it (`python3 -m http.server`); the SPA needs same-origin for `/data/*` and the service worker. |
