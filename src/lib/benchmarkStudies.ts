/**
 * Sector Benchmarks studies 1–3 for #benchmarks (Epic 1.2 PR-D) — the
 * bundle-rendered studies (Students as Partners / Indigenising the
 * Curriculum / Peer Review of Teaching), content verbatim from the
 * production bundle (assets/app.b38bc4ca.js). They join the PR-C-ported
 * studies 4–5 (src/lib/benchmarks.ts) to complete the section.
 *
 * The per-study keyword lists drive the section search exactly as the
 * bundle did: a study stays visible while the query overlaps its keywords
 * (substring match in either direction).
 */

/** Keyword gate for study 1 — verbatim from the bundle. */
export const SAP_KEYWORDS: readonly string[] = [
  "students as partners",
  "sap",
  "engagement",
  "fragmented",
  "targeted",
  "emancipatory",
  "griffith",
  "ecu",
  "deakin",
  "victoria",
  "uow",
  "une",
  "uts",
  "qut",
  "la trobe",
  "curtin",
  "adelaide",
  "unsw",
  "melbourne",
  "sydney",
  "uq",
  "unisc",
  "wsu",
];

/** Keyword gate for study 2 — verbatim (the bundle stored it dot-joined). */
export const INDIGENISING_KEYWORDS: readonly string[] =
  "indigenis.indigenous.curriculum.yes.no.unimelb.usyd.uq.uow.cqu.curtin.unisa.csu.utas.uts.macquarie.griffith.uwa.adelaide.jcu.wsu.scu.newcastle.uc.deakin.flinders.vu.ecu.monash.anu.qut.rmit.swinburne".split(
    ".",
  );

/** Keyword gate for study 3 — verbatim from the bundle. */
export const PRT_KEYWORDS: readonly string[] = [
  "peer review",
  "prt",
  "teaching",
  "coi",
  "community of inquiry",
  "social presence",
  "cognitive",
  "paradox",
  "sophistication",
  "unisa",
  "adelaide",
  "melbourne",
  "jcu",
  "uq",
  "newcastle",
];

/** The bundle's visibility rule: show while any keyword overlaps the query. */
export function studyMatches(
  keywords: readonly string[],
  query: string,
): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return keywords.some((k) => k.includes(q) || q.includes(k));
}

/* ── Study 1 — Students as Partners ─────────────────────────────────────── */

export interface SapQuadrant {
  title: string;
  n: string;
  /** Definition line. */
  def: string;
  /** Either a trailing note paragraph or chips. */
  note?: string;
  chips?: readonly string[];
  /** Card accent: tailwind-ish key used by the component. */
  tone: "muted" | "amber" | "blue" | "teal";
}

export const SAP_QUADRANTS: readonly SapQuadrant[] = [
  {
    title: "Quadrant 1 — No Engagement",
    n: "n = 19",
    def: "Not evident or limited — SaP may be occurring but has not gained prominence on university websites.",
    note: "Includes 19 universities where no SaP-related content was publicly visible at the time of audit. Strong partnerships may exist without public-facing website promotion.",
    tone: "muted",
  },
  {
    title: "Quadrant 2 — Fragmented",
    n: "n = 9",
    def: "Evident but piecemeal — SaP is visible and acknowledged but not fully integrated into core strategy.",
    chips: ["9 universities"],
    tone: "amber",
  },
  {
    title: "Quadrant 3 — Targeted",
    n: "n = 5",
    def: "Application-specialist clustered — SaP is institutionally embedded with permanent programs, mentoring, and council representation.",
    chips: ["5 universities"],
    tone: "blue",
  },
  {
    title: "Quadrant 4 — Emancipatory",
    n: "n = 3",
    def: "Strategic — SaP is holistic and institution-wide, permeating governance, curriculum, and decision-making as a core component.",
    chips: ["UQ", "UniSC", "WSU"],
    tone: "teal",
  },
];

/**
 * The SaP distribution bar — production's exact widths and labels (the
 * final label prints 8% against an 11% segment width; kept verbatim).
 */
export const SAP_BAR: ReadonlyArray<{
  width: string;
  title: string;
  label: string;
  className: string;
}> = [
  {
    width: "50%",
    title: "No Engagement: 19",
    label: "No Engagement (50%)",
    className: "bg-white/15",
  },
  {
    width: "25%",
    title: "Fragmented: 9",
    label: "Fragmented (25%)",
    className: "bg-amber-400/50",
  },
  {
    width: "14%",
    title: "Targeted: 5",
    label: "Targeted (14%)",
    className: "bg-[#7C9CFF]/60",
  },
  {
    width: "11%",
    title: "Emancipatory: 3",
    label: "Emancipatory (8%)",
    className: "bg-[#4ECDC4]/70",
  },
];

/* ── Study 2 — Indigenising the Curriculum ──────────────────────────────── */

export interface IndigenisingLevel {
  pct: string;
  label: string;
  def: string;
  /** Chip under the card, or an italic footnote for the "No" card. */
  chip?: string;
  footnote?: string;
  tone: "teal" | "blue" | "amber" | "muted";
}

export const INDIGENISING_LEVELS: readonly IndigenisingLevel[] = [
  {
    pct: "21%",
    label: "Yes",
    def: "Comprehensive, whole-of-university strategic approach with clear policies, dedicated resources, and broad curriculum integration.",
    chip: "10 universities",
    tone: "teal",
  },
  {
    pct: "52%",
    label: "Yes, but",
    def: "Targeted approaches with dedicated programs or departments, but not yet fully integrated university-wide.",
    chip: "9 universities",
    tone: "blue",
  },
  {
    pct: "16%",
    label: "No, but",
    def: "Making strides — specific initiatives, working groups, or faculty-led programs, but lacking a cohesive university-wide strategy.",
    chip: "9 universities",
    tone: "amber",
  },
  {
    pct: "11%",
    label: "No",
    def: "No visible Indigenisation strategy at the time of audit. Focus areas limited to employment, retention, or student success only.",
    footnote:
      "Universities with no publicly visible curriculum Indigenisation initiatives",
    tone: "muted",
  },
];

export const INDIGENISING_BAR: ReadonlyArray<{
  width: string;
  title: string;
  className: string;
}> = [
  { width: "21%", title: "Yes: 21%", className: "bg-[#4ECDC4]/60" },
  { width: "52%", title: "Yes, but: 52%", className: "bg-[#7C9CFF]/50" },
  { width: "16%", title: "No, but: 16%", className: "bg-amber-400/50" },
  { width: "11%", title: "No: 11%", className: "bg-white/15" },
];

/* ── Study 3 — Peer Review of Teaching ──────────────────────────────────── */

export interface PrtCard {
  title: string;
  def: string;
  chips: readonly string[];
  tone: "amber" | "blue" | "teal";
}

/** "A spectrum of institutional approaches". */
export const PRT_SPECTRUM: readonly PrtCard[] = [
  {
    title: "Layered · audit-driven",
    def: "Integrated formative + summative review, explicit criteria, structured documentation.",
    chips: ["UniSA", "Adelaide"],
    tone: "amber",
  },
  {
    title: "Middle ground",
    def: "Reconciling formal assurance with developmental authenticity.",
    chips: ["Melbourne", "Newcastle"],
    tone: "blue",
  },
  {
    title: "Relational · minimalist",
    def: "Flexibility, voluntary participation, mutual trust.",
    chips: ["JCU", "UQ"],
    tone: "teal",
  },
];

/** "Mapped to the three Community of Inquiry presences". */
export const PRT_PRESENCES: readonly PrtCard[] = [
  {
    title: "Social presence",
    def: "Voluntary, confidential, reciprocal, cross-disciplinary — separated from summative evaluation.",
    chips: ["5 peer-review programs"],
    tone: "teal",
  },
  {
    title: "Cognitive presence",
    def: "Sustained reflective cycles, theory-informed feedback, SoTL integration, shared analytic language.",
    chips: ["Melbourne MPRT", "Newcastle", "UQ OCS"],
    tone: "blue",
  },
  {
    title: "Teaching presence",
    def: "Clear frameworks, trained reviewers, explicit criteria, QA alignment — with light scaffolding.",
    chips: ["4 institutional models"],
    tone: "amber",
  },
];
