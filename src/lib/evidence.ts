/**
 * "What the data shows" evidence datasets for #ntlsn-evidence (Epic 1.2
 * PR-C) — extracted verbatim from the production bundle
 * (assets/app.b38bc4ca.js): the 25-indicator adoption bar chart, the full
 * data table, the four stat tiles and the L&T Weeks litmus figures.
 *
 * This is Seb's published research (the section credits "Research conducted
 * by A/Prof Seb Dianati, 2022–2026 … CC BY-NC-SA 4.0"), NOT live data-layer
 * material — the numbers are the study's findings and must not be
 * "corrected" against data/universities.json (the study covers 42
 * universities; the directory holds 43 institutions — both are right).
 *
 * Aggregate framing is deliberate throughout: adoption rates across the
 * sector, never a named league table of individual universities.
 */

export interface IndicatorBar {
  label: string;
  /** Confirmed segment width, % of the bar (the bundle's `yes`). */
  yes: number;
  /** Partial segment width, % of the bar (the bundle's `partial`). */
  partial: number;
  /** Displayed adoption rate, % (the bundle's `pct`). */
  pct: number;
}

/** [indicator, yes count, partial count, no count, adoption rate] */
export type IndicatorRow = readonly [string, number, number, number, string];

/** The four headline stat tiles — colour + value + label, verbatim.
 * The 47% tile carries production's data-noredstat neutral colour (the
 * ntlsn-noredstat patch repaints "deficit red" stats #ddd5c4). */
export const EVIDENCE_STATS: ReadonlyArray<{
  value: string;
  label: string;
  colour: string;
}> = [
  { value: "42", label: "Universities Audited", colour: "#8fb081" },
  { value: "25", label: "SoTL Indicators", colour: "#c66c3f" },
  { value: "47%", label: "Adoption Gap", colour: "#ddd5c4" },
  { value: "36%", label: "Lack Portfolio Support", colour: "#FFB347" },
];

export const EVIDENCE_BARS: readonly IndicatorBar[] = [
  {
    "label": "Teaching Awards",
    "yes": 76,
    "partial": 7,
    "pct": 83
  },
  {
    "label": "Short Courses",
    "yes": 79,
    "partial": 2,
    "pct": 81
  },
  {
    "label": "L&T Weeks / Forums",
    "yes": 62,
    "partial": 17,
    "pct": 79
  },
  {
    "label": "Academic Resources",
    "yes": 69,
    "partial": 10,
    "pct": 79
  },
  {
    "label": "OEP / OER Grants",
    "yes": 33,
    "partial": 45,
    "pct": 79
  },
  {
    "label": "Teaching Capability Framework",
    "yes": 52,
    "partial": 24,
    "pct": 76
  },
  {
    "label": "Peer Review of Teaching",
    "yes": 64,
    "partial": 10,
    "pct": 74
  },
  {
    "label": "Communities of Practice",
    "yes": 67,
    "partial": 7,
    "pct": 74
  },
  {
    "label": "Indigenising Curriculum",
    "yes": 52,
    "partial": 21,
    "pct": 74
  },
  {
    "label": "MOOCs",
    "yes": 71,
    "partial": 0,
    "pct": 71
  },
  {
    "label": "Academic Workshops",
    "yes": 57,
    "partial": 10,
    "pct": 67
  },
  {
    "label": "SoTL Framework",
    "yes": 43,
    "partial": 24,
    "pct": 67
  },
  {
    "label": "T&L Innovation Grants",
    "yes": 40,
    "partial": 26,
    "pct": 67
  },
  {
    "label": "Early Assessment in Policy",
    "yes": 57,
    "partial": 7,
    "pct": 64
  },
  {
    "label": "Promotion Support",
    "yes": 38,
    "partial": 24,
    "pct": 62
  },
  {
    "label": "Self-Paced Online PD",
    "yes": 40,
    "partial": 19,
    "pct": 60
  },
  {
    "label": "T&L Newsletter",
    "yes": 43,
    "partial": 17,
    "pct": 60
  },
  {
    "label": "HEA / Advance HE",
    "yes": 52,
    "partial": 7,
    "pct": 60
  },
  {
    "label": "Learning Design Model",
    "yes": 40,
    "partial": 19,
    "pct": 60
  },
  {
    "label": "Case Studies & Exemplars",
    "yes": 45,
    "partial": 10,
    "pct": 55
  },
  {
    "label": "Students as Partners",
    "yes": 40,
    "partial": 14,
    "pct": 55
  },
  {
    "label": "Stackable Academic Dev",
    "yes": 31,
    "partial": 21,
    "pct": 52
  },
  {
    "label": "Academic Mentoring",
    "yes": 31,
    "partial": 17,
    "pct": 48
  },
  {
    "label": "Staff Buyout Programs",
    "yes": 26,
    "partial": 10,
    "pct": 36
  },
  {
    "label": "Academic Portfolio Support",
    "yes": 26,
    "partial": 10,
    "pct": 36
  }
];

/** Full data table — all 25 indicators ranked by adoption rate, verbatim. */
export const EVIDENCE_TABLE: readonly IndicatorRow[] = [
  [
    "Teaching Awards",
    32,
    3,
    7,
    "83%"
  ],
  [
    "Short Courses",
    33,
    1,
    8,
    "81%"
  ],
  [
    "L&T Weeks / Forums",
    26,
    7,
    9,
    "79%"
  ],
  [
    "Academic Resources",
    29,
    4,
    9,
    "79%"
  ],
  [
    "OEP / OER Grants",
    14,
    19,
    9,
    "79%"
  ],
  [
    "Teaching Capability Framework",
    22,
    10,
    10,
    "76%"
  ],
  [
    "Peer Review of Teaching",
    27,
    4,
    11,
    "74%"
  ],
  [
    "Communities of Practice",
    28,
    3,
    11,
    "74%"
  ],
  [
    "Indigenising Curriculum",
    22,
    9,
    11,
    "74%"
  ],
  [
    "MOOCs",
    30,
    0,
    12,
    "71%"
  ],
  [
    "Academic Workshops",
    24,
    4,
    14,
    "67%"
  ],
  [
    "SoTL Framework",
    18,
    10,
    14,
    "67%"
  ],
  [
    "T&L Innovation Grants",
    17,
    11,
    14,
    "67%"
  ],
  [
    "Early Assessment Policy",
    24,
    3,
    15,
    "64%"
  ],
  [
    "Promotion Support",
    16,
    10,
    16,
    "62%"
  ],
  [
    "Self-Paced Online PD",
    17,
    8,
    17,
    "60%"
  ],
  [
    "T&L Newsletter",
    18,
    7,
    17,
    "60%"
  ],
  [
    "HEA / Advance HE",
    22,
    3,
    17,
    "60%"
  ],
  [
    "Learning Design Model",
    17,
    8,
    17,
    "60%"
  ],
  [
    "Case Studies & Exemplars",
    19,
    4,
    19,
    "55%"
  ],
  [
    "Students as Partners",
    17,
    6,
    19,
    "55%"
  ],
  [
    "Stackable Academic Dev",
    13,
    9,
    20,
    "52%"
  ],
  [
    "Academic Mentoring",
    13,
    7,
    22,
    "48%"
  ],
  [
    "Staff Buyout Programs",
    11,
    4,
    27,
    "36%"
  ],
  [
    "Academic Portfolio Support",
    11,
    4,
    27,
    "36%"
  ]
];

/**
 * Rate colour — production's thresholds after the ntlsn-noredstat patch:
 * teal ≥ 67%, amber 50–66%, and the red band repainted neutral #ddd5c4.
 */
export function rateColour(pct: number): string {
  if (pct >= 67) return "#8fb081";
  if (pct >= 50) return "#FBBF24";
  return "#ddd5c4";
}

/** L&T Weeks litmus — the donut's exact figures and legend copy. */
export const LITMUS = {
  pct: 79,
  legend: [
    { colour: "#2D6A4F", text: "26 universities run dedicated L&T events" },
    {
      colour: "#b8cfa0",
      text: "7 partial (e.g. WATLF collective, discontinued)",
    },
    { colour: "rgba(255,255,255,0.1)", text: "9 universities have no L&T week" },
  ],
  note: "Several institutions discontinued their L&T weeks post-2019, including Flinders, Griffith, and Murdoch.",
} as const;
