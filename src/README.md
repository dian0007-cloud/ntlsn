# `/src` — NTLSN source rebuild (Epic 1)

The maintainable React source behind the NTLSN homepage. It is the
**strangler-fig replacement** (TASKS.md Epic 1) for the legacy ~912 KB minified
single-file React bundle that originally comprised the whole site.

> **Status: LIVE in production.** The cutover (TASKS.md §1.3) shipped on
> 2026-07-21 via PR #76, with further polish in #78 (network graph promoted to
> the landing) and #80 (residual blues + global constellation background). The
> legacy homepage is preserved at `/legacy.html` for rollback.

## Toolchain

Self-contained under `/src` so it does not collide with the repo-root
`package.json` (whose `build`/`test` scripts serve the static-site +
Netlify-Functions toolchain).

| Piece        | Version  | Notes                                                                 |
| ------------ | -------- | --------------------------------------------------------------------- |
| Vite         | ^6.3.5   | Build + dev server                                                    |
| React        | ^19.1.0  |                                                                      |
| TypeScript   | ^5.8.3   | `tsc --noEmit` gates the build                                        |
| Tailwind CSS | ^4.1.11  | Via the modern `@tailwindcss/vite` plugin (no PostCSS/v3 config)      |
| Node         | 22 LTS   | Pinned in `netlify.toml` (`build.environment.NODE_VERSION = "22"`)    |

## Commands (from `/src`)

```bash
npm install           # first-time only
npm run dev           # Vite dev server (HMR)
npm run build         # tsc --noEmit && vite build  ->  /src/dist
npm run typecheck     # tsc --noEmit
npm run preview       # serve the production build locally
```

From the **repo root**, convenience aliases (added by the P3 scaffold-touch PR):

```bash
npm run dev:src       # = npm --prefix src run dev
npm run build:src     # = npm --prefix src run build   (writes /src/dist only)
```

`npm run build:src` compiles `/src` to `/src/dist` **without touching the repo
root** — it is a local-dev sanity check, distinct from the production cutover
build `scripts/build-src.sh` (see "Deploy" below).

## How production is built (cutover)

`netlify.toml` drives the deploy:

```
[build]
  command = "npm test && bash scripts/build-src.sh"
  publish = "."
```

`scripts/build-src.sh` (TASKS.md §1.3) compiles `/src`, snapshots the previous
homepage to `/legacy.html`, then copies `dist/index.html` and the hashed
`/assets/*` to the repo root so `publish="."` serves the rebuild as the live
homepage. Every legacy standalone page, feed, data endpoint, and Netlify
Function keeps serving untouched from root.

## Data layer

`data/*.json` (one level up) is the single source of truth (see the repo-root
`CLAUDE.md`). It is imported directly rather than copied, so the rebuild can
never drift from the canonical data:

```ts
import eventsJson      from "../data/events.json";
import universitiesJson from "../data/universities.json";
```

`vite.config.ts` widens `server.fs.allow` to the repo root so the dev server can
read `../data/*.json`; `vite build` inlines the JSON into the bundle, so
production output is self-contained. Large datasets (`data/ltr.json`,
`data/ltr-bestpractice.json`) are intentionally kept out of the bundle — only
their counts are baked in at build time via `define`, and the full datasets are
fetched lazily by the components that need them (keeps the shipped JS inside
the §1.3 perf budget).

## Palette

Tailwind v4 theme tokens are declared with `@theme` in `src/styles.css`. The
current palette is the intentional **"Eucalyptus & Clay"** earthy redesign
(PR #71 / #72), NOT the original dark-navy set from earlier CLAUDE.md drafts:

```
--color-navy:   #211b14   (warm dark base — "Eucalyptus bark")
--color-teal:   #8fb081   (sage)
--color-purple: #a8737f   (muted clay-rose)
--color-amber:  #e6a33c
--color-coral:  #d96650
```

The **Aboriginal-flag accent (black / red / yellow)** is used ONLY in the
"Unceded Lands" element (`src/components/UncededCaption.tsx`), per the palette
rule in `CLAUDE.md`.

## Ported sections

All sections from the legacy bundle have been ported as React + TypeScript
components (97 files under `src/components/` plus `src/bands/`). The canonical
section order — extracted verbatim from the production `ntlsn-order` patch
script — lives in `src/sections.ts` and must not be reordered (anchor
compatibility; see `tests/smoke.spec.js` test (d)).

The three credibility-critical shell sections called out by TASKS.md §1.1/§1.2:

| Section                     | Component                              | Verbatim text preserved                                                                          |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Hero (LIVE/FREE/OPEN-SOURCE) | `src/components/Hero.tsx`              | Badge string `Live · Free · Open-source` (middle-dot `·` separators) — asserted in smoke tests   |
| Acknowledgement of Country  | `src/components/Acknowledgement.tsx`   | In-flow acknowledgement near the top of the page (Production id `#ntlsn-ack-strip` retained)     |
| "Unceded Lands" caption     | `src/components/UncededCaption.tsx`    | "Every university mapped here stands on unceded Aboriginal and Torres Strait Islander Country. We pay our respects to Elders past, present and emerging — sovereignty was never ceded." + "Unceded Lands" label (Aboriginal-flag accent) |
| Footer                      | `src/components/Footer.tsx`            | Platform / Discover / Connect / Legal & Policy columns; CC BY-NC-SA 4.0; © 2026 NTLSN line       |

Per `CLAUDE.md`, the hero `LIVE / FREE / OPEN-SOURCE` claims and the
Acknowledgement / "Unceded Lands" elements are **not decorative — never strip,
abbreviate or reorder them for layout convenience.** Wording is copied
character-for-character from the legacy production `index.html` and is asserted
by the Playwright smoke suite (`tests/smoke.spec.js`).

## What remains / where this fits

Epic 1 (§1.1 scaffold, §1.2 port sections, §1.3 cutover) is complete and live.
There is **no separate future "cutover" task** — it has already happened; the
live homepage IS the `/src` rebuild. Ongoing work is incremental refinement of
individual ported sections (see the TASKS.md Epic 1.2 tail and the per-PR
history for detail).
