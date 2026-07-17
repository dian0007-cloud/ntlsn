/**
 * Front-door content (PR-A of the Epic 1.2 porting stocktake): the curated
 * copy for #ntlsn-nowbanner, #ntlsn-startgrid (+ its journey doors and the
 * #ntlsn-hubdoors rail), #ntlsn-glance and #ntlsn-freshtoday — extracted
 * verbatim from the production patch scripts (ntlsn-nowbanner-script,
 * ntlsn-startgrid-script, ntlsn-starthere-card, ntlsn-journey,
 * ntlsn-hubdoors-script, ntlsn-glance-script, ntlsn-freshtoday-script).
 *
 * Like src/lib/pd.ts, this is curated site content, not data-layer material
 * (CLAUDE.md: data/*.json holds institutions + events only). Counts are never
 * copied from prose — they come from data (universityCount, SOTL_WORK_COUNT)
 * or from array lengths.
 */
import { universityCount } from "../data";

/* ── Live counts ─────────────────────────────────────────────────────────── */

/**
 * Number of works in the rescued SoTL archive (data/ltr.json). Injected at
 * build time by vite.config.ts (define) so the 272KB dataset never enters the
 * bundle just to print its length. Production hardcoded "1,431" in three
 * places; this stays true as the archive grows.
 */
export const SOTL_WORK_COUNT: number = __NTLSN_SOTL_WORKS__;

/** "1,431"-style Australian formatting. */
export function formatCount(n: number): string {
  return n.toLocaleString("en-AU");
}

/**
 * Day serial (UTC), production's `Math.floor(Date.now()/864e5)` — the seed
 * for every "fresh today" pick, so the whole front door rotates in lockstep
 * once a day with no timers and nothing tracked.
 */
export function dayNumber(): number {
  return Math.floor(Date.now() / 864e5);
}

/** Deterministic daily pick from a list. */
export function dailyPick<T>(items: readonly T[], day = dayNumber()): T {
  return items[((day % items.length) + items.length) % items.length];
}

/* ── Start grid ("Where would you like to start?") ───────────────────────── */

export interface StartCard {
  icon: string;
  title: string;
  desc: string;
  href: string;
  /** Teal-ringed tile (production's ntlsn-starthere-card treatment). */
  featured?: boolean;
}

/**
 * The 37 cards from ntlsn-startgrid-script with the "Start Here" tile the
 * ntlsn-starthere-card satellite inserted at position 1 — 38 doors total,
 * counted from this array (the satellite rewrote the "<n> ways into the
 * commons" line the same way).
 *
 * Corrections against production (noted per the PR-A brief):
 * - "Communities & SIGs" pointed at #network, an id the old bundle renders
 *   but SECTION_ORDER does not know; the canonical anchor is #ntlsn-network.
 * - The SoTL-archive and 3D-map descriptions derive their counts from data.
 * - "286 recordings" (Webinars & Talks) has no dataset in this repo to derive
 *   from — kept verbatim from production until the Talks Hub port (PR-B)
 *   gives it a source of truth.
 */
export const START_CARDS: readonly StartCard[] = [
  {
    icon: "🪪",
    title: "Start with your ORCID",
    desc: "Personalise the commons to your scholarship",
    href: "/orcid-start.html",
  },
  {
    icon: "🫧",
    title: "Start Here",
    desc: "Pick your interests, get your path",
    href: "/start-here.html",
    featured: true,
  },
  {
    icon: "🎁",
    title: "Your SoTL, Wrapped",
    desc: "Your teaching scholarship, told back to you",
    href: "/sotl-wrapped.html",
  },
  {
    icon: "🗓️",
    title: "Events",
    desc: "Conferences, workshops & webinars",
    href: "#events",
  },
  {
    icon: "🎯",
    title: "Conference Search",
    desc: "Find your event in three taps",
    href: "/conference-finder.html",
  },
  {
    icon: "📣",
    title: "Call for Abstracts",
    desc: "Present at the critical student-partnerships conference",
    href: "/call-for-abstracts.html",
  },
  {
    icon: "🧭",
    title: "See your path",
    desc: "Watch the network light up your best next step from your ORCID",
    href: "/orcid-flow.html",
  },
  {
    icon: "🎓",
    title: "Crash Courses",
    desc: "Short PD paths, distilled from the commons",
    href: "/crash-courses.html",
  },
  {
    icon: "📊",
    title: "SoTL Index",
    desc: "A described, DORA-aligned reading of your teaching scholarship",
    href: "/sotl-index.html",
  },
  {
    icon: "📝",
    title: "Narrative CV",
    desc: "The DORA-aligned alternative to the metrics CV",
    href: "/narrative-cv.html",
  },
  {
    icon: "⚖️",
    title: "Responsible Assessment",
    desc: "DORA & the toolkit beyond the impact factor",
    href: "/responsible-assessment.html",
  },
  {
    icon: "🧰",
    title: "Free Tools",
    desc: "In-browser tools, no login",
    href: "#ntlsn-trynow",
  },
  {
    icon: "🧠",
    title: "AI Deployment Guide",
    desc: "Three honest lanes for AI in your teaching",
    href: "/ai-deployment-guide.html",
  },
  {
    icon: "🔌",
    title: "Built to Connect",
    desc: "How institutions plug in: MCP, open data, open standards",
    href: "/interop.html",
  },
  {
    icon: "💰",
    title: "Grants",
    desc: "Funding for your teaching",
    href: "#sotl-grants",
  },
  {
    icon: "🏅",
    title: "Awards & Recognition",
    desc: "Citations · fellowships · AAUT",
    href: "/recognition-navigator.html",
  },
  {
    icon: "📚",
    title: "Resources & Toolkits",
    desc: "Guides, toolkits & templates",
    href: "#resources",
  },
  {
    icon: "🏛️",
    title: "Frameworks",
    desc: "Sector frameworks & policy",
    href: "#frameworks",
  },
  {
    icon: "🔓",
    title: "OER Library",
    desc: "Open educational resources",
    href: "#ntlsn-oer",
  },
  {
    icon: "🏫",
    title: "Schools & Faculties",
    desc: "Plan at the school level",
    href: "/school-package.html",
  },
  {
    icon: "🌱",
    title: "New to Teaching",
    desc: "Casual & new-staff starter kit",
    href: "/casual-teaching.html",
  },
  {
    icon: "🤝",
    title: "Critical Learner Partnerships",
    desc: "Students as partners",
    href: "/critical-learner-partnerships.html",
  },
  {
    icon: "🧭",
    title: "Pathways",
    desc: "Recognition & career",
    href: "#pathways",
  },
  {
    icon: "🌏",
    title: "International & Best Practice",
    desc: "Global, evidenced teaching",
    href: "#ntlsn-bestpractice",
  },
  {
    icon: "🎓",
    title: "Fellowships",
    desc: "HEA, AAUT & citations",
    href: "#pathways",
  },
  {
    icon: "📜",
    title: "Programs & Grad Certs",
    desc: "Stackable, sector-built",
    href: "/sector-grad-cert.html",
  },
  {
    icon: "🧩",
    title: "Microcredentials",
    desc: "Short, stackable credentials",
    href: "/microcredential.html",
  },
  {
    icon: "📺",
    title: "Webinars & Talks",
    desc: "286 recordings from the sector",
    href: "#ntlsn-talkshub",
  },
  {
    icon: "🧑‍🏫",
    title: "Mentoring & Coaching",
    desc: "Grow with the sector",
    href: "#ntlsn-waystogrow",
  },
  {
    icon: "👥",
    title: "Communities & SIGs",
    desc: "SIGs, themes, networks & people",
    href: "#ntlsn-network",
  },
  {
    icon: "🗃️",
    title: "SoTL Archive",
    desc: `${formatCount(SOTL_WORK_COUNT)} funded works, searchable`,
    href: "#ntlsn-archive",
  },
  {
    icon: "📌",
    title: "What’s On",
    desc: "Conferences, calls & CFPs across the sector",
    href: "/whats-on.html",
  },
  {
    icon: "🌐",
    title: "The Sector in 3D",
    desc: `${universityCount} universities, states & alliances in 3D`,
    href: "/network-3d.html",
  },
  {
    icon: "📈",
    title: "Publication Profile",
    desc: "Your open research footprint, in the open",
    href: "/publication-profile.html",
  },
  {
    icon: "🧭",
    title: "Recognition GPS",
    desc: "Map your scholarship to recognition criteria",
    href: "/recognition-gps.html",
  },
  {
    icon: "🎖️",
    title: "Open Badges",
    desc: "Issue a portable, verifiable badge for a milestone",
    href: "/open-badges.html",
  },
  {
    icon: "🇸🇬",
    title: "HERDSA 2026 × NTLSN",
    desc: "The program, threaded into the commons",
    href: "/herdsa-2026.html",
  },
  {
    icon: "📰",
    title: "Sector Reads",
    desc: "The higher-ed feeds worth following",
    href: "/sector-reads.html",
  },
];

/* ── Journey doors (ntlsn-journey, folded into StartGrid) ────────────────── */

export interface JourneyChip {
  label: string;
  href: string;
  /** Off-site page rather than an on-page anchor. */
  external?: boolean;
}

export interface JourneyDoor {
  id: "events" | "resources";
  title: string;
  sub: string;
  chips: readonly JourneyChip[];
}

/**
 * The two-door "What are you looking for?" quick-nav. Production rendered
 * anchor chips as JS-scroll <button>s because the target ids only existed
 * after other patches ran; in source every target id is real DOM, so all
 * chips are plain <a href> (keyboard-native, WCAG 2.4.4 for free).
 */
export const JOURNEY_DOORS: readonly JourneyDoor[] = [
  {
    id: "events",
    title: "Events",
    sub: "What’s on across the sector",
    chips: [
      { label: "Upcoming events", href: "#events" },
      { label: "Past symposium recordings", href: "/missed-it.html", external: true },
      { label: "Stream your symposium", href: "/symposium-streaming.html", external: true },
      { label: "Conferences", href: "#conferences" },
      { label: "Awards & recognition", href: "/aaut-readiness.html", external: true },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    sub: "Tools, frameworks & funding",
    chips: [
      { label: "Grants & funding", href: "#sotl-grants" },
      { label: "Toolkits & tools", href: "#ntlsn-trynow" },
      { label: "Frameworks", href: "#frameworks" },
      { label: "Open educational resources", href: "/open-building-blocks.html", external: true },
      { label: "Crash courses", href: "/crash-courses.html", external: true },
      { label: "Recognition & fellowships", href: "/fellowship-mapper.html", external: true },
    ],
  },
];

/* ── Hub-door rail (ntlsn-hubdoors-script) ───────────────────────────────── */

export interface HubDoor {
  title: string;
  desc: string;
  href: string;
}

/** "Explore by area" — the four-node rail production kept just under the grid. */
export const HUB_DOORS: readonly HubDoor[] = [
  {
    title: "What's On",
    desc: "Symposiums, conferences, webinars and grants — live across the sector.",
    href: "/whats-on.html",
  },
  {
    title: "Tools & Recognition",
    desc: "Free in-browser tools: calibration, curriculum, peer review, recognition pathways.",
    href: "/tools.html",
  },
  {
    title: "Resources & Network",
    desc: "The rescued archive, OER library, frameworks and the national map.",
    href: "/sotl-index.html",
  },
  {
    title: "About & the Plan",
    desc: "Who builds this, the principles it runs on, and the 2027–2028 roadmap.",
    href: "/about.html",
  },
];

/* ── Glance ("One connected system.") ────────────────────────────────────── */

export interface GlanceStage {
  /** Stage accent — production's exact hex, not always a palette token. */
  color: string;
  title: string;
  sub: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}

/**
 * The four stages of ntlsn-glance-script, with every pill's destination
 * pre-resolved from the script's GLMAP lookup + per-stage GLDEF defaults
 * (stage fallbacks were #resources, #ntlsn-coming2027,
 * /recognition-navigator.html, #ntlsn-coming2028 respectively). The archive
 * pill's label carries the live work count instead of production's
 * hardcoded "1,431".
 */
export const GLANCE_STAGES: readonly GlanceStage[] = [
  {
    color: "#2DD4BF",
    title: "The free commons",
    sub: "Free forever · no login",
    items: [
      { label: "National T&L map", href: "#map" },
      { label: `${formatCount(SOTL_WORK_COUNT)}-work archive`, href: "#ntlsn-archive" },
      { label: "Resource Hub", href: "#resources" },
      { label: "Events calendar", href: "#events" },
      { label: "Peer-Review Exchange", href: "#ntlsn-coming2027" },
      { label: "Calibration Suite", href: "#ntlsn-coming2027" },
      { label: "Students-as-Partners", href: "#ntlsn-coming2028" },
      { label: "Best Practices", href: "#ntlsn-bestpractice" },
    ],
  },
  {
    color: "#7C9CFF",
    title: "Run your own",
    sub: "On infrastructure you don’t build",
    items: [
      { label: "Symposium engine", href: "#ntlsn-coming2027" },
      { label: "Curriculum Auditor", href: "#ntlsn-coming2027" },
      { label: "School diagnostic", href: "#ntlsn-coming2027" },
      { label: "TEQSA & UDL readiness", href: "#ntlsn-coming2027" },
      { label: "Framework-personalisation APIs", href: "#ntlsn-coming2027" },
      { label: "Guided learning paths", href: "#pathways" },
      { label: "Course quality self-check", href: "#ntlsn-coming2027" },
      { label: "Embed widgets & API", href: "#ntlsn-coming2027" },
    ],
  },
  {
    color: "#FFB448",
    title: "Recognition",
    sub: "Work that finally counts",
    items: [
      { label: "Showcase credential", href: "/recognition-navigator.html" },
      { label: "Recognition Benchmark", href: "/recognition-navigator.html" },
      { label: "My eQuals badge", href: "#ntlsn-coming2028" },
      { label: "RPL across universities", href: "#ntlsn-coming2028" },
      { label: "Points calculator", href: "/recognition-navigator.html" },
      { label: "Teaching passport", href: "/recognition-navigator.html" },
      { label: "Promotion mapping", href: "/recognition-navigator.html" },
      { label: "Cross-sector praise", href: "/recognition-navigator.html" },
    ],
  },
  {
    color: "#C57BFF",
    title: "On campus & connected",
    sub: "The human face + the whole sector",
    items: [
      { label: "UniSQ Academy", href: "#ntlsn-coming2028" },
      { label: "Academic induction", href: "#ntlsn-induction" },
      { label: "Peak-body partners", href: "#ntlsn-coming2028" },
      { label: "The national mesh", href: "#ntlsn-network" },
      { label: "Sector network map", href: "#ntlsn-network" },
      { label: "Interoperability layer", href: "#ntlsn-coming2028" },
      { label: "International consortium", href: "#ntlsn-coming2028" },
      { label: "Open standards", href: "#ntlsn-coming2028" },
    ],
  },
];

/* ── Fresh today (ntlsn-freshtoday-script) ───────────────────────────────── */

export interface DailyTool {
  icon: string;
  title: string;
  desc: string;
  href: string;
}

/** Tool of the day — production's 10-entry rotation, picked by dayNumber(). */
export const DAILY_TOOLS: readonly DailyTool[] = [
  { icon: "🩺", title: "The NTLSN Teaching Diagnostic", desc: "One review, every angle", href: "/diagnostic.html" },
  { icon: "🎯", title: "Find Your SoTL Conference", desc: "Match to the right event", href: "/conference-finder.html" },
  { icon: "✅", title: "Assessment Mix & AI-Resilience", desc: "Stress-test your assessment", href: "/assessment-mix.html" },
  { icon: "🏅", title: "Recognition Navigator", desc: "Find your recognition path", href: "/recognition-navigator.html" },
  { icon: "🔬", title: "Live SoTL Research Search", desc: "Search 250M+ works", href: "/research-search.html" },
  { icon: "📐", title: "Constructive Alignment Matrix", desc: "Align outcomes & assessment", href: "/constructive-alignment.html" },
  { icon: "🔓", title: "Open-Access Finder", desc: "The free version of any paper", href: "/oa-finder.html" },
  { icon: "✍️", title: "Where to Publish Your SoTL", desc: "Find a diamond-OA journal", href: "/journal-finder.html" },
  { icon: "🪞", title: "Reflective Coach", desc: "A Socratic scaffold", href: "/reflective-coach.html" },
  { icon: "📋", title: "Course Quality Self-Check", desc: "TELAS & UDL readiness", href: "/course-quality.html" },
];

/** Today's reflective prompt — production's 8-entry rotation. */
export const DAILY_PROMPTS: readonly string[] = [
  "What is one thing your students struggled with last week — and what will you change because of it?",
  "Name one assessment a generative AI could complete. What would make it authentically human?",
  "Whose voice is missing from your curriculum? What is one step to include it?",
  "What evidence do you have that your teaching works? Where could you gather more?",
  "If a colleague observed your class tomorrow, what is the one thing you would want them to notice?",
  "A piece of feedback you give often — could it become a rubric or a shared resource?",
  "Which students are you not reaching yet, and what small change might help?",
  "What did you learn from teaching this week that is worth writing down?",
];
