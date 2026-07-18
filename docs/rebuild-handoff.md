# Rebuild handoff — state, conventions, and what's next

*Written 2026-07-18 at main `6b89cb9`, for any session (Claude or GLM) continuing
the Epic 1 work. Companion to docs/rebuild-stocktake.md (the section inventory)
and docs/licensing-rationale.md.*

## Where the rebuild stands

Everything below is MERGED to main and verified:

- **Scaffold** (§1.1): Vite + React + TS + Tailwind v4 in `/src`, self-contained
  (own package.json). Canonical section order in `src/sections.ts`.
- **All visible production sections ported** (§1.2): eight port PRs (#54–#58,
  #60–#62, #63–#64), each verified against production's hydrated DOM with
  Playwright; credibility strings (hero badge, Acknowledgement, Unceded Lands,
  "free forever" sentences) asserted verbatim.
- **Cutover mechanics** (#65): code-splitting — initial JS **270KB min / 84KB
  gzip** (budget: <350KB), six lazy band chunks via `LazyBand` (IO + hash
  deep-link), megamenu/nav parity, SEO/PWA head, tiered-licence footer.
- **Collapse hybrid + hidden bands** (#67): `CollapsibleSection` (APG
  disclosure; children stay in DOM, `inert` when closed; hash deep-links
  auto-open). Core journey expanded; tail collapsed. Recognition band (13) and
  Manifesto band (7) resurrected from their injectors, collapsed.
- **build-feeds** now refreshes the inline `ntlsn-events-ld` JSON-LD in BOTH
  `index.html` and `src/index.html` on every run (#66) — on-page Event schema
  can no longer drift.

**Production (`index.html` + patches + `assets/app.*.js`) is untouched by the
rebuild and remains the live site. Cutover (§1.3) is ON HOLD — Seb said "not
sure". Do not flip anything without his explicit go.**

## Decisions already made (do not relitigate)

| Decision | Ruling |
|---|---|
| Events layout | Card grid (no month-calendar widget); calendar visuals live in Year view |
| Hidden bands | Recognition + Manifesto PORTED (collapsed); Premium/2027 (18), pricing-adjacent (5), other (4) PARKED — reachable via legacy.html post-cutover |
| Collapse UX | Hybrid — core expanded, tail collapsed (roster in PR #67 body) |
| Licence | Tiered: MIT code · CC BY 4.0 data/methodology · CC BY-NC-SA 4.0 content · ICIP carve-out (see LICENSE + docs/licensing-rationale.md) |
| teaching-resources | Visible in rebuild; production unchanged |

## Working conventions (follow these exactly)

1. **One branch per PR**, named `epic1/<topic>`, branched from `origin/main`.
   Never stack work on a branch whose PR is open under a review gate.
2. **Worktree isolation** for agents; before committing:
   `git config user.email noreply@anthropic.com && git config user.name Claude`
   (commits from other identities show Unverified and trip the stop-hook).
3. **Touch only `/src`** for rebuild work. Production files change only via
   their own dedicated PRs.
4. **Verification bar** (non-negotiable, every PR): `npx tsc --noEmit` clean;
   `npm run build` clean; Playwright against `vite preview` (chromium at
   `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` via executablePath)
   asserting production heading language, zero page errors, and the specific
   behaviours the PR claims; initial chunk stays <350KB; honest divergences
   listed in the PR body.
5. **Draft PR → CI green (validate/functions/e2e/lighthouse) → merge.**
   The smoke suite tests PRODUCTION files; it should stay green untouched —
   if it reds on a src-only diff, suspect flake, diagnose before rerunning
   (see the nav-scroll de-flake in #62 for the pattern).
6. **Data files**: surgical string edits only — never JSON.parse/stringify a
   canonical file (reformats the whole diff). Run
   `node scripts/build-feeds.mjs` after any data change.
7. **Credibility elements** (Acknowledgement, Unceded Lands, hero claims,
   First Nations content): verbatim, never truncated, flag-don't-edit.
   Aboriginal flag colours only in the Unceded/flag elements.

## Remaining work, in order

1. **Copy re-derivation sweep** (S): the pricing/OEP chips keep production
   literals where no dataset existed (320 SoTL, 59 PD, 43 grants, 23
   conferences, 25 benchmarks, 41 UDL, 78 international) — several NOW have
   datasets in src/lib (grants=39, benchmarks=5 studies, pd=73…). Reconcile:
   derive where a source exists, or correct the literal; document each.
2. **Anonymous-script labelling pass** (S/M): fingerprint the 14 anonymous
   inline scripts in index.html (stocktake §5 last row) so nothing is silently
   dropped at cutover. Output: a table in docs/rebuild-stocktake.md.
3. **Personalise-quiz decision** (Seb): the talkshub quiz re-ranks other
   sections via bundle state — port, redesign, or drop.
4. **§1.3 cutover — ONLY on Seb's explicit go**: wire Organization JSON-LD
   copy; SW registration + cache bump; retarget/duplicate the smoke suite to
   the built src output; ship old index.html as legacy.html (30 days, short
   cache); flip. Checklist detail in docs/rebuild-stocktake.md §7.

## Human-gated (Seb only)

Buttondown account + `BUTTONDOWN_API_KEY` secret (digest sending) · Search
Console sitemap submission · one real-LMS LTI launch · production tlUrl
eyeball · branch-protection required checks.
