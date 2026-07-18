# NTLSN — WCAG 2.2 AA Accessibility Audit

**Date:** 10 July 2026 · **Auditor:** automated (axe-core) + manual keyboard/landmark trace
**Scope:** all 164 standalone `.html` pages (including `index.html` and `404.html`)
**Standard:** WCAG 2.2 Level AA (axe rule tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`)
**Tooling:** axe-core 4.12 driven by Playwright 1.61 headless Chromium — see *Re-running* below.

> This is the standing reference called for by TASKS.md §4.1. Every count and claim
> below was re-measured against the live repo state on 2026-07-10 (not copied from prior
> notes). Critical/serious findings that were safe and mechanical have already been fixed
> in this PR (see *Fixes applied*); structural index.html issues and the systemic
> landmark gap are logged in the *Remediation backlog* for the Epic 1 source rebuild.

---

## 1. Executive summary

Full automated sweep across **164 pages** (browser-rendered, so `index.html`'s React
bundle + runtime patch scripts are exercised, not just static markup). 0 pages failed to
load. **378 violation instances** (rule × page) before this PR's fixes.

| Severity (axe) | Instances (pre-fix, all 164 pages) |
|---|---|
| Critical | 21 |
| Serious | 48 |
| Moderate | 307 |
| Minor | 2 |
| **Total** | **378** |

**10 pages** passed with zero violations (exemplars to copy structural patterns from):
`aaut-readiness.html`, `fellowship-mapper.html`, `herdsa-2026.html`, `narrative-cv.html`,
`privacy.html`, `psf-evidence-audit.html`, `recognition-framework.html`,
`sector-reads.html`, `start-here.html`, `tools.html`.

### Rule frequency across the 164 pages (pre-fix)

| Rule | Severity | Distinct pages | WCAG 2.2 SC |
|---|---|---|---|
| `region` | moderate | 129 | 1.3.1 / 2.4.1 |
| `landmark-one-main` | moderate | 127 | 1.3.1 / 2.4.1 |
| `color-contrast` | serious | 24 | 1.4.3 (AA) |
| `landmark-contentinfo-is-top-level` | moderate | 20 | 1.3.1 (best practice) |
| `heading-order` | moderate | 19 | 1.3.1 / 2.4.6 |
| `link-in-text-block` | serious | 18 | 1.4.1 Use of Color |
| `select-name` | **critical** | 12 | 3.3.2 / 4.1.2 / 1.3.1 |
| `landmark-banner-is-top-level` | moderate | 11 | 1.3.1 (best practice) |
| `label` | **critical** | 9 | 3.3.2 / 4.1.2 / 1.3.1 |
| `scrollable-region-focusable` | serious | 3 | 2.1.1 Keyboard |
| `target-size` | serious | 2 | 2.5.8 (WCAG 2.2 AA) |
| `empty-table-header` | minor | 2 | 1.3.1 |
| `page-has-heading-one` | moderate | 1 | 1.3.1 / 2.4.6 |
| `nested-interactive` | serious | 1 (`index.html`) | 4.1.2 / 1.3.1 |

### Headline takeaways

1. **The dominant defect is structural, not visual: 129 of 164 pages have content outside
   any landmark, and 127 have no `main` landmark.** Most standalone pages use
   `<div class="wrap">` as their content shell with no `<main>`/`role="main"`. This is the
   single highest-value fix and is highly mechanical (see backlog P1).
2. **All 21 critical violations are unlabelled form controls** (`select-name`, `label`).
   Almost every affected page already has a *visible* label as a sibling — it is just not
   programmatically associated (`for`/`id`). The fix is a one-attribute-per-control edit.
3. **`index.html`'s own a11y patch-script safety net works**, but several of its injected
   elements sit outside the `main` landmark and one (the CC-licence link) failed
   use-of-colour — both addressed or logged here.

---

## 2. index.html — deep dive (client-rendered React bundle + ~120 patch scripts)

`index.html` is a 1.7 MB single-file build: an inline minified React bundle plus **158
inline `<script>`/`<style>` patch elements** (ids `ntlsn-*`; CLAUDE.md documents "~12" but
the real count is far higher). axe was run against the fully-rendered DOM after the patch
scripts had performed their MutationObserver-driven surgery, so the figures reflect what a
user actually experiences.

### 2.1 Automated findings (pre-fix → post-fix)

| axe rule | SC | Severity | Nodes | Status |
|---|---|---|---|---|
| `color-contrast` | 1.4.3 | serious | 11 | **Follow-up** — gold text `text-[#C9A962]/60` and `/40` (Unceded Lands / Acknowledgement area) on navy; classes live in the minified bundle, cannot patch without bundle edits |
| `nested-interactive` | 4.1.2 / 1.3.1 | serious | 8 | **Follow-up** — clickable `<span role="link">` titles (`.cf-t`) embedded inside `<details><summary>` in the collapsible section folders; `<button>` inside `<summary>`. Requires restructuring the `ntlsn-cfold` collapsible patch, not a bundle edit |
| `target-size` | 2.5.8 (2.2 AA) | serious | 6 | **Follow-up** — the `.cf-t` clickable section titles and `.text-white/70` event titles are `< 24px` touch targets; tied to the same collapsible/title patch logic |
| `region` | 1.3.1 / 2.4.1 | moderate | 3 | **Follow-up** — `#ntlsn-cclicence`, `#ntlsn-ack-strip`, and a `body > p` are injected by patch scripts onto `document.body`, outside `#root` (`role=main`) |
| `heading-order` | 1.3.1 / 2.4.6 | moderate | 1 | **Follow-up** — a `Platform` `<h4>` in the footer column appears before any `h3` (bundle markup) |
| `landmark-contentinfo-is-top-level` | 1.3.1 | moderate | 1 | **Follow-up** — the `<footer>` is a child of `#root` (`role=main`) because `ntlsn-order` reorders siblings *before the footer* within `hero.parentNode` (=`#root`) |
| `link-in-text-block` | 1.4.1 | serious | 1 | **FIXED ✅** — the Creative-Commons licence link in `ntlsn-cclicence-script` used `text-decoration:none` and was distinguishable only by its teal colour; changed to `underline` |

Post-fix, `index.html` has **6 remaining rule failures** (all bundle-level or patch-script
structural) — down from 7.

### 2.2 Manual keyboard-navigation & landmark trace (TASKS.md §4.1 manual pass)

Traced by reading the relevant patch-script logic (no live browser tab-through available;
conclusions are about logical soundness after all patch scripts have run, not initial paint).

- **Skip-link (`ntlsn-skip-script`, line ~1949).** Injects `#ntlsn-skiplink` as
  `document.body.firstChild` (so it is the first focusable element), `href="#hero"`, hidden
  at `top:-64px` and slid to `0` on `:focus`. On click it sets `#hero` `tabindex="-1"` and
  calls `.focus()`. Re-built via `setTimeout` (800 ms / 2200 ms) **and** a `MutationObserver`
  on `document.body`, so it survives the bundle's re-renders. **Logically sound.** ✅
- **Focus visibility (`ntlsn-focusvis-css`, line ~2004).** Global
  `:focus-visible{outline:2px solid #2DD4BF !important;outline-offset:2px !important}`.
  The `!important` guarantees it wins over bundle styles. **Sound.** ✅
- **Icon-button labels (`ntlsn-ariaicons-script`, line ~2005).** Adds `aria-label` to
  icon-only `<button>`s by matching their SVG path `d` (carousel dots → "Go to slide N",
  chevrons → "Previous"/"Next", grid/list icons). Re-runs on a throttled `MutationObserver`.
  **Sound but fragile** — it depends on exact SVG-path matching; a bundle icon change would
  silently drop a label. Flag for the rebuild (labels should be authored in markup).
- **Section order (`ntlsn-order`, line ~491).** Defines a canonical `ORDER` array of ~115
  section ids/regexes and re-inserts matched children of `hero.parentNode` before the
  `<footer>`, in `ORDER` sequence (guarded by `moving` flag to avoid observer feedback
  loops, and by a ≥18-targets threshold so it doesn't fire prematurely). Keyboard/DOM focus
  order therefore follows the canonical section order. **Sound.** ✅
- **Landmarks (`ntlsn-landmarks`, line ~5913).** Sets `#root`→`role="main"` and
  `.ntlsn-topnav`/first `nav`→`role="banner"`. **Caveat (logged above):** because the footer
  lives inside `#root`, the implicit `contentinfo` landmark is nested inside `main`, and
  three patch-injected elements (`#ntlsn-cclicence`, `#ntlsn-ack-strip`, `body > p`) are
  appended to `document.body` and therefore fall outside `main`. Fixing this needs either
  moving those injections inside `#root` or wrapping them in a labelled landmark — deferred
  (it risks the DOM-surgery ordering, out of scope for a mechanical fix).

**Net:** focus order, skip-link target, and the main/banner landmark structure are
logically sound after surgery. The remaining index.html issues are the footer-landmark
nesting, three out-of-landmark injected elements, and bundle-level contrast/nesting — all
in the follow-up list, none blocking.

---

## 3. Per-page findings — representative sample (30 pages)

`node count` = number of axe rules failing on that page (pre-fix). "Fixed" = resolved in
this PR; "Follow-up" = logged in §5.

| Page | axe findings (rule:nodes) | Fixed in this PR |
|---|---|---|
| `index.html` | color-contrast:11, nested-interactive:8, target-size:6, region:3, heading-order:1, landmark-contentinfo:1, ~~link-in-text-block:1~~ | link-in-text-block ✅ (rest follow-up — bundle/structural) |
| `about.html` | landmark-one-main:1, region:1 | ✅ added skip-link + `main` landmark; `<img>`s given `loading="lazy"` + `width`/`height` → page now CLEAN |
| `developers.html` | link-in-text-block:5, color-contrast:3, landmark-one-main:1, region:1 | ✅ skip-link + `main` (link/contrast follow-up) |
| `open-badges.html` | landmark-contentinfo:1 | (already had skip-link; pre-existing — follow-up) |
| `whats-on.html` | landmark-contentinfo:1 | (already had skip-link; follow-up) |
| `recognition-gps.html` | heading-order:1 | ✅ skip-link + `id="main"` on existing `<main>` (heading-order follow-up) |
| `accessibility-preflight.html` | region:8, link-in-text-block:2, landmark-one-main:1 | ✅ skip-link + `main` (link follow-up) |
| `contrast-checker.html` | region:10, landmark-one-main:1 | ✅ skip-link + `main` (page now near-clean; banner nesting follow-up) |
| `rubric-builder.html` | region:36, target-size:4, landmark-one-main:1 | ✅ skip-link + `main` + `target-size` fix → page now CLEAN |
| `readability.html` | region:6, landmark-one-main:1 | ✅ skip-link + `main` |
| `tools.html` | (zero violations) | ✅ skip-link + `main` added as preventative (still clean) |
| `privacy.html` | (zero violations) | — (reference pattern: skip-link + `<main>`) |
| `404.html` | region:1, landmark-one-main:1 | follow-up (no `main`) |
| `genai-crash-course.html` | region:17, landmark-one-main:1 | follow-up (no `main`) |
| `assessment-crash-course.html` | region:16, landmark-one-main:1 | follow-up (no `main`) |
| `feedback-crash-course.html` | region:15, landmark-one-main:1 | follow-up (no `main`) |
| `sample-size.html` | ~~label:1~~, region:11, landmark-one-main:1 | ✅ `label` fixed (associated `Population size`/`Responses` labels) |
| `grading.html` | ~~label:7~~, region:1, landmark-one-main:1 | ✅ `label` fixed (`#students`, `#mod`, `#day` via `for=`; `#a1m`–`#a4m` via `aria-label`) |
| `group-work.html` | ~~select-name:4~~, region:9, heading-order:1, landmark-one-main:1 | ✅ `select-name` fixed (4 selects) |
| `session-planner.html` | ~~label:1, select-name:3~~, region:9, landmark-one-main:1 | ✅ `label`+`select-name` fixed |
| `assessment-mix.html` | ~~select-name:5~~, region:1, landmark-one-main:1 | ✅ `select-name` fixed (JS template `aria-label`) |
| `ai-policy.html` | ~~select-name:2~~, color-contrast:2, region:11, landmark-one-main:1 | ✅ `select-name` fixed (JS template `aria-label`) |
| `viva.html` | ~~select-name:3~~, region:8, heading-order:1, landmark-one-main:1 | ✅ `select-name` fixed (4 selects) |
| `induction-builder.html` | ~~select-name:4~~, region:10, heading-order:1, landmark-one-main:1 | ✅ `select-name` fixed (4 selects) |
| `grant-pitch.html` | ~~label:4~~, region:8, color-contrast:1, landmark-one-main:1 | ✅ `label` fixed (`#aim`/`#approach`/`#signif`) |
| `recognition-roi.html` | ~~label:5~~, region:13, landmark-one-main:1 | ✅ `label` fixed (`#hc`/`#sal`/`#to`) |
| `microcredential.html` | ~~label:1~~, region:7, color-contrast:1, landmark-one-main:1 | ✅ `label` fixed (`#hrs`) |
| `trp.html` | ~~select-name:1~~, heading-order:1 | ✅ `select-name` fixed (`#e-cat`) |
| `academic-year.html` | ~~label:2~~, region:8, link-in-text-block:1, landmark-one-main:1 | ✅ `label` fixed (`.lbl` divs → `<label for>`) |
| `widgets.html` | landmark-banner:1, landmark-contentinfo:1 | — (reference pattern) |

---

## 4. Systemic findings (cut across many pages)

- **S-1 No `main` landmark / content outside landmarks (129 + 127 pages).** The standalone
  page template uses `<body><div class="wrap">…</div></body>` with no `<main>`. Fix: add
  `id="main" role="main"` to the `.wrap` div (or wrap content in `<main>`) and prepend a
  skip-link — exactly the pattern already used by `widgets.html`, `whats-on.html`,
  `privacy.html`. This PR applied it to 8 pages; the remaining ~120 are the P1 backlog.
- **S-2 Unlabelled form controls (21 criticals).** Every affected page already shows a
  visible label next to the control but omits the `for`/`id` association (or generates the
  control in JS without a label). Recipe in §5.
- **S-3 Links distinguishable only by colour (18 pages, `link-in-text-block`).** A house
  style of `color:var(--teal);text-decoration:none` on inline links. WCAG 1.4.1 requires a
  non-colour cue (underline). Mechanical to fix globally by adding `text-decoration:underline`
  (or an underline-on-hover + always-underline distinction).
- **S-4 Low-contrast text (24 pages, `color-contrast`).** Mostly placeholder/empty-state
  text (`color:#5d6e82` / `--mut` on navy), `<em>` fill-in placeholders, and the index.html
  gold-on-navy Acknowledgement text. Each needs a per-token colour tweak.

---

## 5. Fixes applied in this PR (verified)

Re-ran axe on the changed pages; confirmed each target finding is resolved.

| File | Change | Verified |
|---|---|---|
| `about.html` | 2 `<img>` → `loading="lazy"` + `width`/`height` (512², 480²); added skip-link + `main` landmark | page now **CLEAN** |
| `index.html` | `ntlsn-cclicence-script`: CC-licence link `text-decoration:none`→`underline` (patch-script edit, **no bundle change**) | `link-in-text-block` **resolved** |
| `accessibility-preflight.html`, `contrast-checker.html`, `tools.html`, `developers.html`, `rubric-builder.html`, `readability.html`, `recognition-gps.html` | skip-link (`.skip` CSS + `<a class="skip" href="#main">`) + `main` landmark (`id="main" role="main"` on `.wrap`, or on existing `<main>` for recognition-gps) | landmark findings resolved; rubric-builder now CLEAN |
| `rubric-builder.html` | `.colrm` remove buttons → `min-width/min-height:24px` (target-size 2.5.8) | `target-size` resolved |
| `group-work.html`, `session-planner.html`, `viva.html`, `induction-builder.html`, `sample-size.html`, `grading.html`, `microcredential.html`, `grant-pitch.html`, `recognition-roi.html`, `trp.html`, `academic-year.html` | associated existing visible `<label>`s with controls via `for="id"`; added `aria-label` where no visible label exists (grading marks inputs); converted `.lbl` divs to `<label>` (academic-year) | all `label`/`select-name` criticals on these pages **resolved** |
| `assessment-mix.html`, `ai-policy.html` | added `aria-label` to the JS template strings that generate selects (one edit per page fixes every generated instance) | `select-name` **resolved** |

**Total: ~21 files changed. Minified bundle untouched; the only `index.html` change is
inside the `ntlsn-cclicence-script` patch script.**

---

## 6. Remediation backlog (prioritised, for the Epic 1 source rebuild)

### P0 — Critical (do next, mechanical)
- **Remaining `label` / `select-name` on JS-generated controls** (no static `for=` possible):
  `atec-curriculum-qa.html` (`.ty` selects), `autc-criteria.html` (`select[data-i]`),
  `test-blueprint.html` (row selects), `recognition-points.html` (recognition selects),
  `student-partnership.html` (`select[data-f="type"]`), `academic-home.html`
  (`#hr_review`/`#hr_service`/`#hr_invited` in the JS template), `oa-finder.html`
  (`#in` textarea — add `aria-label="DOIs to resolve"`). Recipe: add `aria-label="…"` (or a
  `<label for>`) inside the JS template literal that builds the control.

### P1 — High-value, high-volume, mechanical (fixes ~260 violations)
- **Roll the skip-link + `main`-landmark pattern out to the remaining ~120 standalone
  pages** (S-1). Each page: add `.skip` CSS, prepend `<a class="skip" href="#main">Skip to
  content</a>`, and add `id="main" role="main"` to its `.wrap` (mirroring `widgets.html`).
  This single change clears both `region` (129) and `landmark-one-main` (127) for the bulk
  of the site. (In the rebuilt source this becomes a layout component, not a per-page edit.)

### P2 — Serious, systemic
- **`link-in-text-block` (18 pages, S-3):** make inline links non-colour-dependent — add
  `text-decoration:underline` to the standard `a{color:var(--teal)}` rule on each page (or a
  shared stylesheet in the rebuild).
- **`color-contrast` (24 pages, S-4):** raise placeholder/empty-state text from `#5d6e82`
  /`--mut` to ≥ 4.5:1 on navy (e.g. `#9fb3c8`); brighten `<em>` fill-ins; fix the
  index.html gold (`text-[#C9A962]/60`,`/40`) Acknowledgement text in the rebuild.
- **`scrollable-region-focusable` (3 pages):** `consent-builder.html` (`#doc`),
  `interop.html`, `mcp.html` — add `tabindex="0"` (and ideally `role="region"` + a label) to
  scrollable `<pre>`/document containers so keyboard users can scroll them.
- **`target-size` / `nested-interactive` on `index.html`:** rework the `.cf-t` clickable
  section titles and `ntlsn-cfold` collapsible `<summary>` so the title is not an
  interactive element nested inside another (and meets 24 px). Bundle/patch-script
  restructuring — defer to the source rebuild.

### P3 — Moderate polish
- `heading-order` (19 pages) — ensure heading levels step by one (footer `h4` before `h3`,
  etc.). `landmark-contentinfo-is-top-level` / `landmark-banner-is-top-level` (31 pages) —
  move `<footer>`/`<header>` out of `main` in the rebuild layout. `empty-table-header`
  (2 pages) — give the empty `<th>`s text or `aria-label`.

---

## 7. Re-running this audit

Tooling is committed as devDependencies (axe-core + playwright); Chromium is installed via
`npx playwright install chromium`. Runner: `scripts/a11y-audit.mjs`.

```bash
npx playwright install chromium                 # one-time (~95 MB headless Chromium)
node scripts/a11y-audit.mjs                     # curated 20-page representative sample
node scripts/a11y-audit.mjs index.html          # one or more specific pages
node scripts/a11y-audit.mjs --all --json out.json   # full 164-page sweep → machine-readable
```

`index.html` is driven through a real headless browser (load → networkidle → 2.5 s settle
→ axe injected), so the React bundle and every `ntlsn-*` patch script run before axe
evaluates the DOM. Standalone pages are exercised the same way, so any boot JS that builds
form controls is covered.
