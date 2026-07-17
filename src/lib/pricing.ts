/**
 * Pricing & packages data (Epic 1.2 PR-E) — extracted from the production
 * patch scripts ntlsn-pricing-script (the 39KB open-core section),
 * ntlsn-pricingnav-script (the slide deck above it) and
 * ntlsn-choosepackage-script (the role cards below it).
 *
 * Copy is production's, word-for-word — the "free forever" front-of-house
 * language is credibility-critical (CLAUDE.md: the site's positioning rests
 * on the LIVE/FREE/OPEN-SOURCE claims). The only edits are COUNTS, which are
 * derived from the canonical data layer instead of hardcoded, exactly as the
 * production scripts fetched /data/*.json at runtime (chips whose number has
 * no canonical dataset in src keep production's literal figure — see the
 * per-chip notes below).
 */
import { eventCount, universityCount } from "../data";
import { formatCount, SOTL_WORK_COUNT } from "./frontdoor";
import { FRAMEWORKS } from "./frameworks";
import { PATHWAY_RESOURCE_COUNT } from "./pathways";
import { INTERNATIONAL_VIDEO_COUNT, SECTOR_VIDEO_COUNT } from "./talks";
import { TEACHING_RESOURCES } from "./teachingResources";

/* ── Portal modal (concept preview) select options ──────────────────────── */

export const PORTAL_TRACKS: readonly string[] = [
  "Assessment & feedback",
  "Authentic & programmatic assessment",
  "Academic integrity",
  "Assurance of learning",
  "Curriculum design",
  "Learning design",
  "Work-integrated learning",
  "Microcredentials & stackable credentials",
  "Students as partners",
  "Student experience",
  "Wellbeing & belonging",
  "First-year experience & transition",
  "Inclusive & accessible practice",
  "Universal Design for Learning (UDL)",
  "Indigenising the curriculum",
  "Indigenous knowledges & pedagogies",
  "Digital & online learning",
  "Technology-enhanced learning",
  "AI in higher education",
  "Learning analytics",
  "Scholarship of teaching & learning (SoTL)",
  "Peer review of teaching",
  "Teaching quality & evaluation",
  "Quality assurance & standards (TEQSA)",
  "Research & impact",
  "Academic development",
  "Teaching philosophy & portfolios",
  "Academic promotion & recognition",
  "Leadership in learning & teaching",
  "Open educational practices (OEP/OER)",
  "Communities of practice & PD",
  "Discipline-specific pedagogy",
  "Other",
];

export const PORTAL_FORMATS: readonly string[] = [
  "20-min paper",
  "Workshop",
  "3³ talk · 9 min",
  "Lightning talk · 5 min",
  "Poster",
];

/* ── Paid tiers (Universities tab) ──────────────────────────────────────── */

export interface TierFeature {
  title: string;
  desc: string;
  /** Anchor or page the feature links to. Absent on the meta row. */
  href?: string;
  /** Force the amber IN DESIGN badge (production's `s:1`). */
  inDesign?: boolean;
  /** Un-linked lead row ("Everything in School, institution-wide"). */
  meta?: boolean;
}

export interface PricingTier {
  name: string;
  blurb: string;
  price: string;
  /** Numeric $k figure, for the "3 years for the price of 2" line. */
  priceK: number;
  colour: string;
  multiplier: string;
  features: readonly TierFeature[];
}

export const PRICING_TIERS: readonly PricingTier[] = [
  {
    name: "School",
    blurb: "Head of School — ideal for small schools (<15 academics)",
    price: "$30k",
    priceK: 30,
    colour: "#378ADD",
    multiplier: "Embedded practice support",
    features: [
      {
        title: "Cross-institutional peer review",
        href: "#ntlsn-coming2027",
        desc: "Pair your teachers with reviewers at other universities.",
      },
      {
        title: "Assessment calibration",
        href: "#ntlsn-coming2027",
        desc: "Cross-marker calibration so grades mean the same thing.",
      },
      {
        title: "Course quality & UDL readiness",
        href: "selfcheck.html",
        desc: "Score any course on TELAS and UDL: a spider readiness profile to act on.",
      },
      {
        title: "ATEC readiness",
        href: "#ntlsn-capabilities",
        inDesign: true,
        desc: "Get ready for the Tertiary Education Commission: self-assess against the SSP priorities and mission-based compacts.",
      },
      {
        title: "Rubric and exemplar library",
        href: "#ntlsn-bestpractice",
        desc: `${formatCount(SOTL_WORK_COUNT)} OLT/ALTC works plus curated best practice.`,
      },
      {
        title: "Teaching-recognition passport",
        href: "trp.html",
        desc: "A portable teaching record your staff keep for life.",
      },
      {
        title: "Symposium hosting and abstracts",
        href: "#ntlsn-capabilities",
        inDesign: true,
        desc: "Run your own Teaching and Learning Week on the Portal.",
      },
    ],
  },
  {
    name: "Institution",
    blurb: "DVCA portfolio · whole-of-institution",
    price: "$50k",
    priceK: 50,
    colour: "#7C9CFF",
    multiplier: "Assurance & sector visibility",
    features: [
      {
        title: "Everything in School, institution-wide",
        meta: true,
        desc: "Every School feature, across all faculties and campuses — uncapped students, never pay-per-user. You buy the platform, not seats.",
      },
      {
        title: "Teaching & learning assurance — TEQSA-mapped",
        href: "teqsa-readiness.html",
        desc: "Build evidence for your council & regulator: RAG-rate each faculty against TEQSA, track improvement across years, benchmark against sector. Compliance and confidence in one dashboard.",
      },
      {
        title: "National moderation and calibration",
        href: "#ntlsn-coming2027",
        desc: "Calibrate across the sector, not just in-house.",
      },
      {
        title: "Conference and symposium management",
        href: "#ntlsn-capabilities",
        inDesign: true,
        desc: "Run portfolio-wide events: abstracts, reviews, programs.",
      },
      {
        title: "Calendar sync and embeddable widgets",
        href: "#ntlsn-capabilities",
        desc: "ICS feed plus drop-in widgets for your own site.",
      },
      {
        title: "Sector data and comparison",
        href: "#benchmarks",
        desc: "See where your institution sits in the national picture.",
      },
      {
        title: "Curriculum and assessment mapping",
        href: "#ntlsn-capabilities",
        inDesign: true,
        desc: "Map PLO to CLO to ULO against TELAS, portfolio-wide.",
      },
      {
        title: "Open data export and API",
        href: "#ntlsn-capabilities",
        desc: "Your data out anytime via open MCP/API. No lock-in.",
      },
      {
        title: "Ecosystem integration",
        href: "#ntlsn-capabilities",
        inDesign: true,
        desc: "Connect the systems you already run: Moodle, Blackboard, PeopleSoft, CourseLoop and more.",
      },
      {
        title: "SSO, white-label and dedicated support",
        href: "#ntlsn-capabilities",
        inDesign: true,
        desc: "Single sign-on, your brand, a named contact and SLA.",
      },
    ],
  },
];

/* ── "Why partner" benefit list under the header ────────────────────────── */

export const PRICING_BENEFITS: ReadonlyArray<readonly [string, string]> = [
  [
    "Reach",
    // Production hardcoded "all 42 universities"; src derives the count from
    // data (the established Hero.tsx convention — data/*.json is canonical).
    `Surface your work to all ${universityCount} universities, not just your campus.`,
  ],
  ["Scalability", "One platform that grows from a school to the whole institution."],
  [
    "Promotion",
    "Your events, awards and people, featured across the national network.",
  ],
  [
    "Simplification",
    "Abstracts, registration, recognition and reporting in one place.",
  ],
  ["Streamlining", "Replace scattered spreadsheets, forms and inboxes."],
  [
    "All connected",
    "Every part links to the rest — data flows, nothing re-keyed.",
  ],
];

/* ── $0-forever OEP chip groups ─────────────────────────────────────────────
 * Counts with a canonical dataset in src are derived (universities, events,
 * sector videos = sector + international curated talks, frameworks,
 * university resources, career pathways, best-practice guides, the archive).
 * The rest keep production's literal figures: their sources ("320 SoTL
 * resources", "59 PD opportunities", "43 grants & fellowships", "23
 * conferences", "25 benchmarks", "41 UDL resources", "78 international
 * SoTL") counted production datasets that don't map 1:1 onto a src export —
 * re-derive them when their owning sections settle the numbers. */

const BP_GUIDE_COUNT = __NTLSN_BP_GUIDES__;

export interface OepChipGroup {
  title: string;
  items: readonly string[];
}

export const OEP_CHIP_GROUPS: readonly OepChipGroup[] = [
  {
    title: "Interoperability & personalisation",
    items: [
      "Open MCP / API",
      "Embeddable widgets",
      "National T&L network",
      "Interactive sector map",
      `${universityCount} universities mapped`,
      "Year-at-a-glance calendar",
      "Weekly digest + ICS feed",
      "Acknowledgement-of-Country widget",
    ],
  },
  {
    title: "Tools for your practice",
    items: [
      "Peer-Review Exchange",
      "Calibration Suite",
      "Course Quality Self-Check",
      "Reflective Coach",
      "School Needs Diagnostic",
      "TEQSA Gen AI Readiness",
      "Teaching Recognition Passport",
      "Students-as-Partners Registry",
    ],
  },
  {
    title: "Resources from the sector",
    items: [
      "320 SoTL resources",
      `${TEACHING_RESOURCES.length} university resources`,
      `${FRAMEWORKS.length} frameworks`,
      `${BP_GUIDE_COUNT} best-practice guides`,
      `${formatCount(SOTL_WORK_COUNT)}-work sector archive`,
      "25 benchmarks",
      "41 UDL resources",
      "78 international SoTL",
      `${SECTOR_VIDEO_COUNT + INTERNATIONAL_VIDEO_COUNT} sector videos`,
    ],
  },
  {
    title: "Events, PD & support",
    items: [
      `${eventCount} sector events`,
      "23 conferences",
      "Watch sector conference recordings",
      "59 PD opportunities",
      "43 grants & fellowships",
      `${PATHWAY_RESOURCE_COUNT} career pathways`,
      "3-year capability roadmap",
    ],
  },
];

/* ── Role router ("Where would you like to start?") ─────────────────────── */

export interface PricingRole {
  icon: string;
  label: string;
  id: string;
  /** Tab the role routes to; undefined routes to the $0 OEP card. */
  tab?: "pt-uni" | "pt-assoc";
  /** Tier card to pulse after routing (Universities tab only). */
  tier?: "School" | "Institution";
}

export const PRICING_ROLES: readonly PricingRole[] = [
  { icon: "🎓", label: "Academic / educator", id: "r-acad" },
  { icon: "🏫", label: "Head of School", id: "r-hos", tab: "pt-uni", tier: "School" },
  { icon: "👥", label: "Associate Head · Faculty", id: "r-fac", tab: "pt-uni", tier: "School" },
  { icon: "🏛", label: "DVC Academic", id: "r-dvc", tab: "pt-uni", tier: "Institution" },
  { icon: "🎩", label: "Dean", id: "r-dean", tab: "pt-uni", tier: "Institution" },
  { icon: "⚖", label: "Peak body · Association", id: "r-assoc", tab: "pt-assoc" },
];

/**
 * Cross-section role hand-off: #ntlsn-choosepackage's cards pre-select a
 * role in #pricing (production's script clicked the matching .pt-role chip
 * 700ms after the anchor jump). A DOM CustomEvent keeps the two components
 * decoupled without global state.
 */
export const PRICING_ROLE_EVENT = "ntlsn:pricing-role";

export function requestPricingRole(roleLabel: string): void {
  window.dispatchEvent(
    new CustomEvent<string>(PRICING_ROLE_EVENT, { detail: roleLabel }),
  );
}

/* ── Symposiums tab packages ────────────────────────────────────────────── */

export interface SympPackage {
  colour: string;
  label: string;
  price: string;
  desc: string;
  premium?: boolean;
}

export const SYMP_PACKAGES: readonly SympPackage[] = [
  {
    colour: "#7C9CFF",
    label: "Registration",
    price: "Included in any plan",
    desc: "Attendee registration, ticketing and check-in for your event.",
  },
  {
    colour: "#7C9CFF",
    label: "Submission",
    price: "Included in any plan",
    desc: "Abstract and paper submission, peer review and programme builder.",
  },
  {
    colour: "#C9A962",
    label: "◆ Morning tea",
    price: "$10k",
    desc: "A catered morning symposium — we open, host and facilitate a half-morning of teaching & learning exchange. Fully catered, no hidden fees.",
  },
  {
    colour: "#C9A962",
    label: "◆ School full day",
    price: "$15k",
    desc: "A facilitated full-day symposium for your school — sessions, introductions and a fully catered break (morning tea included). We run it; you keep full IT control.",
  },
  {
    colour: "#C9A962",
    label: "◆ University-wide · we run it",
    price: "$30k",
    desc: "The founder chairs your whole event end-to-end — opening, between-session facilitation, T&L awards and speeches. Full day, university-wide, morning tea and full catering included. No hidden fees.",
    premium: true,
  },
];

export const SYMP_STEPS: ReadonlyArray<readonly [string, string, string]> = [
  ["1", "Pick your university", "Choose your institution from the map."],
  [
    "2",
    "Register your interest to present",
    "Ask for a slot at your teaching and learning day.",
  ],
  [
    "3",
    "Open to presenting elsewhere?",
    "Tick to be matched to another university’s event too.",
  ],
];

/* ── Associations tab packages ──────────────────────────────────────────── */

export interface AssocPackage {
  name: string;
  benefit: string;
  tag: "live" | "2028" | "soon";
  href: string;
}

export const ASSOC_PACKAGES: readonly AssocPackage[] = [
  {
    name: "HERDSA",
    benefit:
      "Personalise your PD & fellowship modules — then full LMS–CMS–CRM integration for staff recognition.",
    tag: "2028",
    href: "#ntlsn-capabilities",
  },
  {
    name: "ASCILITE",
    benefit:
      "A technology-enhanced-learning readiness check embedded in the LMS — Moodle, Canvas, D2L, Blackboard.",
    tag: "soon",
    href: "#ntlsn-capabilities",
  },
  {
    name: "ACODE",
    benefit:
      "TELAS & ACODE-benchmark readiness — the self-check, powered for your members.",
    tag: "live",
    href: "selfcheck.html",
  },
  {
    name: "Advance HE",
    benefit:
      "A Fellowship pipeline — the Teaching Recognition Passport mapped to PSF 2023.",
    tag: "live",
    href: "trp.html",
  },
  {
    name: "WIL Australia · ACEN",
    benefit:
      "The Placement Commons — broker work-integrated-learning placements sector-wide.",
    tag: "soon",
    href: "#ntlsn-coming2028",
  },
  {
    name: "ePortfolios Forum",
    benefit:
      "Portfolio interoperability — member eportfolios connected to the TRP & My eQuals.",
    tag: "soon",
    href: "#ntlsn-capabilities",
  },
  {
    name: "Students-as-Partners Network",
    benefit:
      "Host your members’ partnership work on the National SaP Registry.",
    tag: "2028",
    href: "#ntlsn-coming2028",
  },
  {
    name: "CAUL",
    benefit: `An OER connector — surface member OER alongside the ${formatCount(SOTL_WORK_COUNT)}-work national archive.`,
    tag: "live",
    href: "#ntlsn-archive",
  },
];

/* ── #ntlsn-pricingnav slides ───────────────────────────────────────────── */

export interface PricingNavSlide {
  icon: string;
  main?: boolean;
  title: string;
  desc: string;
  cta: string;
  href: string;
}

export const PRICINGNAV_SLIDES: readonly PricingNavSlide[] = [
  {
    icon: "🆓",
    main: true,
    title: "Free for students & staff. Forever.",
    desc: `The whole commons — every tool, the ${formatCount(SOTL_WORK_COUNT)}-work archive, events, frameworks and recognition self-checks. No login, no paywall, no catch. This is the point.`,
    cta: "Start using it",
    href: "#ntlsn-trynow",
  },
  {
    icon: "🏫",
    title: "Bring it to your school.",
    desc: "Everything for one school, one partner — induction, tools, recognition and support, tailored to your size, cohort and delivery mode.",
    cta: "See the school fit",
    href: "#pricing",
  },
  {
    icon: "🏛",
    title: "Roll it out across your institution.",
    desc: "Full deployment with interoperability across your systems and a bespoke build — for the whole institution.",
    cta: "See institutional",
    href: "#pricing",
  },
  {
    icon: "🎓",
    title: "Convene your symposiums.",
    desc: "Host and convene with NTLSN — abstract intake, programmes, and a citable home for the outputs.",
    cta: "See symposiums",
    href: "#events",
  },
  {
    icon: "⭐",
    title: "Be one of the first 10.",
    desc: "Foundation partners get it at half price — for life. A thank-you for backing the commons early.",
    cta: "Founding offer",
    href: "#pricing",
  },
];

/* ── #ntlsn-choosepackage cards ─────────────────────────────────────────── */

export interface ChoosePackageCard {
  icon: string;
  title: string;
  desc: string;
  tier: string;
  price: string;
  /** Role label handed to #pricing's router on click ("" = no hand-off). */
  role: string;
}

export const CHOOSE_PACKAGE_CARDS: readonly ChoosePackageCard[] = [
  {
    icon: "🏫",
    title: "Head of School",
    desc: "Build a culture of teaching, learning and research — especially after a restructure. Ideal for small schools.",
    tier: "School",
    price: "from $30k/yr",
    role: "Head of School",
  },
  {
    icon: "🏛",
    title: "DVC Academic",
    desc: "Whole-of-institution, uncapped — you buy the platform, never pay per seat.",
    tier: "Institution",
    price: "from $50k/yr",
    role: "DVC Academic",
  },
  {
    icon: "🎓",
    title: "Dean · Enterprise",
    desc: "Everything, run for you — the all-in-one. One partner, one relationship, one price.",
    tier: "All-in-one",
    price: "$80k/yr",
    role: "",
  },
];
