/**
 * Canonical section order — extracted verbatim from the `ntlsn-order` patch
 * script in the production index.html (the ORDER array). Only the
 * id-addressable entries are listed here; the patch script's tag/regex
 * matchers (Due Soon, "What the data shows", Peak Bodies, etc.) address
 * anonymous bundle DOM and will gain ids as their sections are ported
 * (TASKS.md 1.2).
 *
 * Do NOT reorder: anchor compatibility with production depends on these ids
 * appearing in exactly this sequence (see tests/smoke.spec.js test (d)).
 */
export const SECTION_ORDER: readonly string[] = [
  "hero",
  "ntlsn-nowbanner",
  "ntlsn-startgrid",
  "ntlsn-freshtoday",
  "ntlsn-glance",
  "yearview",
  "events",
  "sotl-grants",
  "ntlsn-conference",
  "conferences",
  "ntlsn-zoom",
  "ntlsn-archive",
  "ntlsn-repository",
  "ntlsn-oer",
  "resources",
  "teaching-resources",
  "ntlsn-bestpractice",
  "ntlsn-talkshub",
  "sector-themes",
  "featured-talks",
  "ntlsn-latest",
  "international-themes",
  // "ntlsn-frameworks-stage" was listed here in the production ntlsn-order
  // array but DELETED in PR-E: it is one of the stocktake's three SKIP-DEAD
  // ids — no script ever created an element with that id, so it never
  // rendered in production and nothing can link to it.
  "frameworks",
  // "What the data shows" — bundle-rendered WITHOUT an id in production:
  // ntlsn-order positions it by regex ({tag:'SECTION',head:1,
  // re:/What the data shows/}) right here, after #frameworks, and the
  // ntlsn-evidencefix patch stamps id="ntlsn-evidence" at runtime. The id
  // is canonical in src from PR-C (docs/rebuild-stocktake.md: runtime-id
  // sections gain their ids as they are ported).
  "ntlsn-evidence",
  "ntlsn-prx",
  "ntlsn-calibrate",
  "ntlsn-pairreview",
  "ntlsn-coursecheck",
  "ntlsn-curriculum",
  "ntlsn-diagnostic",
  "ntlsn-academy",
  "ntlsn-itonboard",
  "ntlsn-sprintplan",
  "ntlsn-abstractpreview",
  "ntlsn-evidencelib",
  "ntlsn-mcp",
  "ntlsn-pipeline",
  "ntlsn-policy",
  "ntlsn-dashboard",
  "ntlsn-recovery",
  "ntlsn-eba",
  "ntlsn-copscan",
  "ntlsn-journal",
  "ntlsn-capabilities",
  "pd",
  "ntlsn-waystogrow",
  "ntlsn-toolkit",
  "ntlsn-guided",
  "ntlsn-recognition",
  "ntlsn-showcase",
  "ntlsn-aaut",
  "ntlsn-natcert",
  "ntlsn-confrecognition",
  "ntlsn-passport",
  "ntlsn-pathfinder",
  "ntlsn-consortium",
  "ntlsn-sap",
  "ntlsn-service",
  "ntlsn-praise",
  "ntlsn-promotion",
  "ntlsn-rpcalc",
  "architecture",
  "map",
  "directory",
  "ntlsn-peakmap",
  "ntlsn-network",
  "pathways",
  "ntlsn-scrollconnect",
  "benchmarks",
  "ntlsn-fnawards",
  // "ntlsn-oep" was listed here in production's ntlsn-order but DELETED in
  // PR-E (stocktake SKIP-DEAD): no element with that id was ever created —
  // the OEP story lives in the "Sharing is caring" manifesto and #pricing's
  // $0-forever card instead.
  "ntlsn-whatsavailable",
  "ntlsn-trynow",
  "ntlsn-symshow",
  "ntlsn-principles",
  "ntlsn-ethos",
  "ntlsn-litmus",
  "ntlsn-challenges",
  "ntlsn-induction",
  // "ntlsn-positionality" was listed here in production's ntlsn-order but
  // DELETED in PR-E (stocktake SKIP-DEAD): no script ever rendered it. The
  // founder-positionality story is told by #ntlsn-advisory and #about.
  "ntlsn-advisory",
  "ntlsn-representation",
  "ntlsn-aim",
  "ntlsn-rebalance",
  "ntlsn-together",
  "ntlsn-distribute",
  // ── The manifesto tail (PR-E) ──────────────────────────────────────────
  // Three ANONYMOUS bundle-rendered sections travel here in production —
  // ntlsn-order positions them by regex, not id ({tag:'SECTION',head:1,...}
  // matchers, in this exact sequence after #ntlsn-distribute). They gain
  // stable ids on porting (docs/rebuild-stocktake.md: "assign ids; update
  // SECTION_ORDER + prod ntlsn-order for anchor parity").
  // Matcher /sector works better when we can see it all/ →
  "ntlsn-manifesto-visibility",
  // Matcher /Sharing is caring/ →
  "ntlsn-manifesto-sharing",
  // Matcher /Share your Zoom/ → prose band only; the share FORM it carried
  // in production lives in #ntlsn-zoom (PR-C's ZoomShareSection).
  "ntlsn-sharezoom",
  // Production's fourth matcher here, /University of Southern Queensland/,
  // is one of the stocktake's two DEAD matchers — no section with that
  // heading exists in the hydrated DOM (verified 2026-07-17), so it has no
  // row.
  "ntlsn-mission",
  "ntlsn-scope",
  // #ntlsn-why has NO row in production's ntlsn-order — its patch script
  // positioned it by inserting the section directly before #about. Its slot
  // here mirrors that insertion point.
  "ntlsn-why",
  "about",
  "ntlsn-coming2027",
  "ntlsn-coming2028",
  // #ntlsn-pricingnav also has NO row in production's ntlsn-order — its
  // patch script kept re-inserting the slide deck directly before #pricing.
  // Its slot here mirrors that insertion point.
  "ntlsn-pricingnav",
  "pricing",
  "ntlsn-choosepackage",
  "ntlsn-allinone",
  "ntlsn-howitworks",
  "ntlsn-byrole",
  "ntlsn-tailored",
  "ntlsn-founding10",
  "ntlsn-member",
];

/**
 * Contiguous slice of SECTION_ORDER, inclusive of both endpoints. The lazy
 * band components (src/bands/*) and the LazyBand stubs in App.tsx both derive
 * their id lists from this, so band membership can never drift from the
 * canonical order (PR-F code-splitting — §1.3 JS budget).
 */
export function bandSlice(from: string, to: string): readonly string[] {
  const a = SECTION_ORDER.indexOf(from);
  const b = SECTION_ORDER.indexOf(to);
  if (a === -1 || b === -1 || b < a) {
    throw new Error(`bandSlice: bad band ${from}..${to}`);
  }
  return SECTION_ORDER.slice(a, b + 1);
}

/**
 * Approximate rendered heights (px, desktop) for the LazyBand fallback stubs,
 * so lazily-loaded bands reserve roughly the right space and don't cause CLS
 * while their chunk loads. Measured against a local `vite preview` at
 * 1280×720 (2026-07-17); they only need to be roughly right — chunks load
 * ~1500px ahead of the viewport (see LazyBand), so the swap happens off
 * screen. Ids not listed default to the small "Porting soon" placeholder
 * height; the three talks-hub tab ids and #ntlsn-latest render nothing
 * standalone (tabs live INSIDE #ntlsn-talkshub; Latest is fail-soft) so they
 * reserve 0.
 */
/**
 * Collapsed summary-row height (PR-G): every id wrapped in a
 * CollapsibleSection renders as a ~92px card row until opened, so its stub
 * reserves that instead of the old full-section height. Ids folded INSIDE
 * a multi-id group (the pricing run, and Collapse v2's Recognition /
 * Mission & governance / Roadmap CollapsibleGroups) reserve 0 — the group's
 * first id carries the one row.
 *
 * Known, accepted mismatch (Collapse v2 persistence): these are compile-time
 * estimates for the DEFAULT states. A stored "open" group/fold renders
 * taller than its stub reserved; the swap still happens ≥1500px off-screen
 * (LazyBand's IO margin) and native scroll anchoring absorbs above-viewport
 * growth, so the drift is not user-visible. (Grouping actually made the
 * recognition stubs MORE accurate: the seven defaultOpen tools previously
 * under-reserved at 92px each.)
 */
const CFOLD_ROW = 92;

const SECTION_STUB_HEIGHTS: Record<string, number> = {
  yearview: 990,
  events: 3900,
  "sotl-grants": 2100,
  conferences: 1090,
  "ntlsn-zoom": 1000, // collapsed Zoom row + the (expanded) Due Soon rail
  "ntlsn-archive": CFOLD_ROW,
  "ntlsn-repository": CFOLD_ROW,
  "ntlsn-oer": CFOLD_ROW,
  resources: 1270,
  "teaching-resources": CFOLD_ROW,
  "ntlsn-bestpractice": CFOLD_ROW,
  "ntlsn-talkshub": 2070,
  "sector-themes": 0,
  "featured-talks": 0,
  "international-themes": 0,
  "ntlsn-latest": 0,
  frameworks: 1450,
  "ntlsn-evidence": 2540,
  "ntlsn-journal": CFOLD_ROW,
  "ntlsn-capabilities": CFOLD_ROW,
  pd: 1260,
  "ntlsn-waystogrow": CFOLD_ROW,
  // Collapse v2: the recognition band folds behind ONE CollapsibleGroup row
  // ("Recognition", closed by default) — the first id carries the row, the
  // other 12 reserve 0 (their sections render inside the group panel).
  "ntlsn-recognition": CFOLD_ROW,
  "ntlsn-showcase": 0,
  "ntlsn-aaut": 0,
  "ntlsn-natcert": 0,
  "ntlsn-confrecognition": 0,
  "ntlsn-passport": 0,
  "ntlsn-pathfinder": 0,
  "ntlsn-consortium": 0,
  "ntlsn-sap": 0,
  "ntlsn-service": 0,
  "ntlsn-praise": 0,
  "ntlsn-promotion": 0,
  "ntlsn-rpcalc": 0,
  architecture: CFOLD_ROW,
  map: 2010,
  directory: 850,
  "ntlsn-peakmap": CFOLD_ROW,
  "ntlsn-network": CFOLD_ROW,
  pathways: CFOLD_ROW,
  benchmarks: CFOLD_ROW,
  "ntlsn-fnawards": CFOLD_ROW,
  "ntlsn-trynow": CFOLD_ROW,
  "ntlsn-symshow": CFOLD_ROW,
  // PR-G manifesto band — collapsed.
  "ntlsn-principles": CFOLD_ROW,
  "ntlsn-ethos": CFOLD_ROW,
  "ntlsn-litmus": CFOLD_ROW,
  "ntlsn-challenges": CFOLD_ROW,
  "ntlsn-induction": CFOLD_ROW,
  // Collapse v2: the mission cluster (advisory … distribute) folds behind
  // ONE "Mission & governance" CollapsibleGroup row — first id carries it.
  "ntlsn-advisory": CFOLD_ROW,
  "ntlsn-representation": 0,
  "ntlsn-aim": 0,
  "ntlsn-rebalance": 0,
  "ntlsn-together": 0,
  "ntlsn-distribute": 0,
  "ntlsn-manifesto-visibility": 490,
  "ntlsn-manifesto-sharing": CFOLD_ROW,
  "ntlsn-sharezoom": CFOLD_ROW,
  "ntlsn-mission": 410,
  "ntlsn-scope": CFOLD_ROW,
  "ntlsn-why": CFOLD_ROW,
  about: 1070,
  // Collapse v2: the roadmap pair folds behind ONE "Roadmap" group row.
  "ntlsn-coming2027": CFOLD_ROW,
  "ntlsn-coming2028": 0,
  // The pricing group: one collapsed row at its first id; the ids folded
  // inside it reserve 0 (their sections render inside the group panel).
  "ntlsn-pricingnav": CFOLD_ROW,
  pricing: 0,
  "ntlsn-choosepackage": 0,
  "ntlsn-allinone": 0,
  "ntlsn-howitworks": 0,
  "ntlsn-byrole": 0,
  "ntlsn-tailored": 0,
  "ntlsn-founding10": 0,
  "ntlsn-member": 0,
};

/** Fallback-stub height for a section id (see SECTION_STUB_HEIGHTS). */
export function approxSectionHeight(id: string): number {
  // Unlisted ids are un-ported "Porting soon" placeholders (~90px).
  return SECTION_STUB_HEIGHTS[id] ?? 90;
}

/** Human-readable label for a placeholder section, derived from its id. */
export function sectionLabel(id: string): string {
  const special: Record<string, string> = {
    yearview: "Year View",
    events: "What's On",
    "sotl-grants": "SoTL Grants",
    conferences: "Conferences",
    resources: "Resources",
    frameworks: "Frameworks",
    pd: "Professional Development",
    map: "National Map",
    directory: "Directory",
    pathways: "Pathways",
    benchmarks: "Benchmarks",
    about: "About",
    pricing: "Pricing",
    architecture: "Architecture",
    "ntlsn-evidence": "What the Data Shows",
    "ntlsn-oer": "OER",
    "ntlsn-mcp": "MCP",
    "ntlsn-eba": "EBA",
    "ntlsn-aaut": "AAUT",
    "ntlsn-sap": "Students as Partners",
  };
  if (special[id]) return special[id];
  return id
    .replace(/^ntlsn-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
