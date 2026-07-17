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
