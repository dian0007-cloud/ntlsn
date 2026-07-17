/**
 * Sector Benchmarks studies 4 & 5 for #benchmarks (Epic 1.2 PR-C) — the two
 * benchmark cards that production injects into the bundle-rendered Sector
 * Benchmarks section via the ntlsn-gradcert-bench and ntlsn-sotlmetrics-bench
 * patch scripts (the section's studies 1–3 are bundle-rendered and port with
 * PR-D). Data verbatim from those scripts.
 *
 * DE-IDENTIFICATION IS DELIBERATE in the Grad Cert audit: institutions are
 * "Institution 01"–"Institution 31", never named — an availability audit,
 * not a league table. Do not re-identify.
 */

/** [institution label, status, model note] — status y=offers, s=suspended, n=none. */
export type GradCertRow = readonly [string, "y" | "s" | "n", string];

export const GRADCERT_STATUS_COLOURS = {
  y: "#34D399",
  s: "#FFB448",
  n: "#FF6B6B",
} as const;

export const GRADCERT_UNIS: readonly GradCertRow[] = [
  ["Institution 01", "y", "HEA Fellowship pathway"],
  ["Institution 02", "y", "Grad Cert in HE; 24 units; CSP; free for staff"],
  ["Institution 03", "y", "24 CP; staff fee waivers"],
  ["Institution 04", "y", "FULT pathway; 24 UOC"],
  ["Institution 05", "y", "Grad Cert in University Teaching Practice; FHEA"],
  ["Institution 06", "y", "SEDA accredited; 24 CP"],
  ["Institution 07", "y", "HEA Fellowship guidance"],
  ["Institution 08", "y", "Stackable micro-cred model"],
  ["Institution 09", "s", "Suspended 2025-2026"],
  ["Institution 10", "y", "Peer Partnerships model"],
  ["Institution 11", "y", "Cross-sectoral HE/VET/Health"],
  ["Institution 12", "y", "Integrates LLMs; 24 CP"],
  ["Institution 13", "n", "No dedicated Grad Cert found"],
  ["Institution 14", "n", "No dedicated Grad Cert found"],
  ["Institution 15", "y", "Innovative pedagogies; online"],
  ["Institution 16", "y", "Cloud-first; FHEA pathway"],
  ["Institution 17", "y", "Aboriginal learning model"],
  ["Institution 18", "y", "Grad Cert in HE Curriculum, Teaching & Learning"],
  ["Institution 19", "y", "40 CP; micro-credentialed"],
  ["Institution 20", "n", "Merged into another university (2023)"],
  ["Institution 21", "y", "Award-winning; 24 CP"],
  ["Institution 22", "y", "Global perspectives; 18 units"],
  ["Institution 23", "n", "No dedicated Grad Cert found"],
  ["Institution 24", "n", "No dedicated Grad Cert found"],
  ["Institution 25", "n", "No dedicated Grad Cert found"],
  ["Institution 26", "y", "Micro-subjects; CSP"],
  ["Institution 27", "y", "CSP-eligible; 24 CP"],
  ["Institution 28", "n", "No dedicated Grad Cert found"],
  ["Institution 29", "n", "No dedicated Grad Cert found"],
  ["Institution 30", "y", "40 CP; SoTL focus"],
  ["Institution 31", "y", "Fully online; flexible entry"],
];

/** The four insight cards under the Grad Cert audit — verbatim (the last
 * one links to /sector-grad-cert.html in the copy; the component renders
 * that link). */
export const GRADCERT_INSIGHTS: ReadonlyArray<{ title: string; body: string }> =
  [
    {
      title: "24 CP is the sector standard",
      body: "Most commonly 4 × 6 CP units. UniSQ’s proposed 32 CP sits above the sector median — a volume-of-learning advantage.",
    },
    {
      title: "A clear precedent exists",
      body: "One institution offers 40 CP, explicitly micro-credentialed, with RPL → e-portfolio pathways toward the award.",
    },
    {
      title: "HEA Fellowship increasingly bundled",
      body: "A growing number of universities pair the certificate with Advance HE (Associate/Fellow) recognition.",
    },
    {
      title: "The stackable gap = UniSQ’s opening",
      body: "No provider yet offers a fully stackable 0.25 CP micro-unit model with a free RPL exit — a genuine sector first.",
    },
  ];

/** [university, framework name, what it measures] — study 5, verbatim. */
export type MetricsRow = readonly [string, string, string];

export const SOTLMETRICS_FRAMEWORKS: readonly MetricsRow[] = [
  [
    "La Trobe",
    "PIDREI cycle",
    "Retention gap <5% (equity vs non-equity); 100% peer observation for probationers; $500/FTE teaching-innovation grants",
  ],
  [
    "JCU",
    "Charter of Responsibilities",
    "Completion Equity Index >0.90; Indigenous pass-rate parity; accountability mapped Board → Subject Coordinator",
  ],
  [
    "ACU",
    "Academic Performance Matrix",
    "SoTL contribution required across Levels B–E; teaching excellence explicitly linked to promotion",
  ],
  [
    "Newcastle",
    "Teaching Excellence Strategy",
    "Target 60% staff HEA Fellowship by 2026; <70% pass-rate alerts; Students-as-Partners (tEN)",
  ],
  [
    "Melbourne",
    "Framework for Educational Excellence",
    "Multi-source evidence (educator + student + independent expert); developmental vs evaluative peer review",
  ],
  [
    "UQ",
    "Teaching@UQ partnership",
    "Conceptual-change measures (teacher → student-focused); paid student partners; professional-learning impact",
  ],
  [
    "UNSW",
    "Integrated Curriculum Framework",
    "Constructive alignment audited (every assessment → PLO); hierarchical outcome design",
  ],
  [
    "UTS",
    "PDRI cycle",
    "Seven academic standards; ISO 9001 alignment; KPIs mapped to responsible officers",
  ],
  [
    "Flinders",
    "Professional Learning Benchmarks",
    "Minimum 10 hours of teaching development per academic FTE per year",
  ],
  [
    "Murdoch",
    "Quality Teaching Framework",
    "AUTCAS national-criteria trial; HR and academic processes aligned",
  ],
  [
    "Curtin",
    "Peer Review of Teaching",
    "Trained reviewer pool; external peer review of teaching portfolios",
  ],
  [
    "Notre Dame",
    "Academic Governance Framework",
    "Role specs (VC → Dean); standards oversight separated from teaching oversight",
  ],
];

/** "The frontier" cards — study 5's grid, verbatim. */
export const SOTLMETRICS_FRONTIER: ReadonlyArray<{
  title: string;
  body: string;
}> = [
  {
    title: "Named quality cycles",
    body: "PIDREI · PDRI · PIEI — branded, acronym-driven cycles that force a common vocabulary and 'close the loop'.",
  },
  {
    title: "Equity disaggregation",
    body: "Retention/completion broken down by SES, Indigenous status, disability, First-in-Family and regional cohorts — the KPI is the gap, not the average.",
  },
  {
    title: "Source · Scope · Sphere",
    body: "Robust evidence triangulates personal, peer and student data — student-satisfaction surveys are no longer valid as a standalone metric.",
  },
  {
    title: "AUTCAS career matrix",
    body: "Five levels (A–E) × seven criteria — teaching leadership evidenced with the same rigour as research (grants, impact, peer-reviewed outputs).",
  },
  {
    title: "Programmatic assessment",
    body: "Capability-attainment trajectories tracked across a whole degree, not atomised course pass-rates.",
  },
  {
    title: "From inclusion to governance",
    body: "The frontier metric shifts from % of courses with Indigenous content to % of decisions made by Indigenous authorities.",
  },
];
