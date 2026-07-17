# Epic 1.2 Porting Stocktake — 2026-07-17

*Produced by a full audit: all 99 canonical section ids measured against the
hydrated production DOM; all 172 inline scripts enumerated and attributed
(bundle vs patch); complexity and disposition assigned per section. This is
the working plan to §1.3 cutover readiness.*

## Summary

| | count |
|---|---|
| Canonical ids in SECTION_ORDER | 99 |
| Ported (hero shell, events + Due Soon, conferences, yearview, map, directory, pd, resources, teaching-resources) | 9 ids + rail |
| Unported | 90 |
| — PORT (visible, real content) | 36 |
| — PORT-HIDDEN (built but display:none — Seb keep/kill) | 47 |
| — FOLD-INTO (talkshub tabs + latest feed) | 4 |
| — SKIP-DEAD (never rendered) | 3 (+2 dead order matchers) |
| Live sections lacking canonical ids (gain ids when ported) | 5 |
| Inline scripts | 172 (158 ntlsn-* — 78 section injectors — + 14 anonymous) |

**Key architectural finding:** CLAUDE.md's "~12 patch scripts" is off by an
order of magnitude. Only ~19 sections are bundle-rendered; the rest are
injected by per-section patch scripts. Three cross-cutting scripts define the
production UX: `ntlsn-order` (DOM re-ordering), `ntlsn-collapseall` (the
node-spine collapse), and `ntlsn-condense-style` (a 47-id hide-list — the
master kill switch).

## Port-PR sequence to §1.3 readiness

- **PR-A "Front door":** nowbanner + startgrid + glance + freshtoday
  (+ starthere-card, two-doors/hubdoors/journey rails). Retires ~12 scripts.
- **PR-B "Talks Hub":** talkshub + sector-themes/international-themes/
  featured-talks as tabs + Featured carousel + video lightbox + fail-soft
  latest feed. Retires the whole video stack.
- **PR-C "Knowledge layer":** sotl-grants, frameworks(+gp-fw), oer, archive,
  repository, journal, bestpractice, evidence (+bench injectors), zoom
  share-form (Apps Script POST contract — test moderation end-to-end).
- **PR-D "Sector fabric":** network, peakmap, architecture, pathways,
  benchmarks, fnawards (cultural care), trynow(+toolsearch), capabilities,
  waystogrow, symshow, induction.
- **PR-E "Mission & pricing tail":** about + anonymous manifesto sections
  (assign ids; update SECTION_ORDER + prod ntlsn-order for anchor parity),
  why, advisory, representation, distribute(+digest-card), mission, scope,
  coming2027/28, pricing, choosepackage, founding10, member. Delete the 3
  dead ids + 2 dead matchers here.
- **PR-F "Cross-cutting + hidden-band decision":** CollapsibleSection (cfold)
  decision site-wide, crosslink chips, sectionstats, unicount-from-data, nav
  megamenu, plus whichever PORT-HIDDEN bands Seb keeps.

## Seb decisions required

1. **The 47 PORT-HIDDEN sections** — triage by band, not per section:
   premium/2027 product band (18, incl. ntlsn-evidencelib at 874 els),
   recognition band (13 — open-badges work may resurrect some), manifesto (7),
   pricing-adjacent (5), other (4). Default if undecided: don't port; keep
   reachable via legacy.html for 30 days post-cutover.
2. **The cfold "node spine" collapse UX** — replicate in src or render
   expanded? The single biggest look-and-feel decision; blocks PR-F.

## §1.3 cutover checklist (beyond ports)

- Nav: production nav is static-nav + megamenu patches (bundle's own topnav
  is hidden) — Nav.tsx needs parity, pruned to keep/kill outcomes.
- SEO head: WebSite JSON-LD + ntlsn-events-ld injection point so
  scripts/build-feeds.mjs keeps writing it post-cutover.
- Meta/PWA: manifest link, theme #0A1628, sw registration, bump ntlsn-vN.
- legacy.html: old index.html verbatim, 30 days, short cache.
- _redirects/_headers: no-SPA-fallback rule untouched; /assets long-cache.
- Anchors: the 5 runtime-id sections need ids in src and (transitionally)
  in production's ntlsn-order.
- Smoke suite retarget to built src output; keep credibility assertions.
- Acceptance: JS < 350KB, zero patch scripts, Lighthouse a11y ≥ 95.

## Script disposition summary

- 78 section injectors → die with their section's port
- ~30 satellites → fold into owning components
- 9 cross-cutting → each needs an explicit home in src (order/collapseall/
  condense/crosslink/sectionstats/unicount/tlurl/megamenu+static-nav)
- 4 a11y patches → already componentised in shell; verify parity, delete
- 3 time-boxed banners → NAIDOC pair already expired, delete now
- ~35 cosmetic/fixup + decoration → obsolete by design (port the visual
  result, not the script)
- 14 anonymous scripts → labelling pass required before cutover so none is
  silently dropped

## Honest unknowns

1. ntlsn-latest's rendered markup (network-gated, unverified offline)
2. Individual behaviour of all 14 anonymous scripts
3. Whether dirlock + remaining tlurl hotfix entries are superseded by src/data
4. The cfold decision (Seb)
5. This audit ran against the repo's index.html served locally, not
   www.ntlsn.com — production drift possible.
