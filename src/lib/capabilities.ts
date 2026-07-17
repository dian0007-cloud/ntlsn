/**
 * #ntlsn-capabilities — "Everything NTLSN does" roadmap (Epic 1.2 PR-D),
 * verbatim from the production ntlsn-capabilities-script patch. Honest-status
 * copy is deliberate ("every status honest") — do not upgrade 2027–2029
 * items to "live". The SoTL archive card's work count is derived at render
 * time (production hardcoded "1,431").
 */

export interface CapabilityItem {
  /** Item name. */
  n: string;
  /** Description. */
  d: string;
  /** Root-relative tool page — renders a "Try it →" button. */
  t?: string;
  /** On-page anchor — renders a "View on page →" link. */
  j?: string;
}

export interface CapabilityGroup {
  label: string;
  sub: string;
  /** Accent colour. */
  c: string;
  badge: string;
  /** The live band renders expanded; the rest are <details> folds. */
  open?: boolean;
  items: readonly CapabilityItem[];
}

export const CAPABILITY_GROUPS: readonly CapabilityGroup[] = [
  {
    "label": "Open Educational Practice — live now · silent launch at HERDSA 2026",
    "sub": "The free commons, open to everyone today",
    "c": "#4ECDC4",
    "badge": "2026",
    "open": true,
    "items": [
      {
        "n": "National T&L map",
        "d": "All 42 Australian universities, one open map."
      },
      {
        "n": "SoTL archive",
        "d": "The rescued national Learning & Teaching Repository — 1,431 works, free.",
        "j": "#ntlsn-archive"
      },
      {
        "n": "Resource Hub",
        "d": "2,000+ teaching & learning resources, curated."
      },
      {
        "n": "Events & sector calendar",
        "d": "Every symposium, conference and webinar in one feed.",
        "j": "#ntlsn-latest"
      },
      {
        "n": "Best Practices library",
        "d": "Sector-wide, evidence-based teaching practice.",
        "j": "#ntlsn-bestpractice"
      }
    ]
  },
  {
    "label": "2027 — Symposiums & the build",
    "sub": "Run your own symposia and conferences; the back-end build and readiness tools",
    "c": "#FFB448",
    "badge": "2027",
    "items": [
      {
        "n": "Symposium & abstract engine",
        "d": "Run your own conference — registration, abstracts, programme."
      },
      {
        "n": "Pair Review",
        "d": "A focused two-person peer review of teaching.",
        "j": "#ntlsn-coming2027"
      },
      {
        "n": "Curriculum Auditor",
        "d": "Map PLO→CLO→ULO outcomes (API/SDK, TELAS-aligned)."
      },
      {
        "n": "Ecosystem APIs & SDK · LMS",
        "d": "LMS integration via LTI 1.3 — Moodle, Canvas, Blackboard, D2L — plus embeddable widgets and an open API."
      },
      {
        "n": "Single sign-on (AAF)",
        "d": "National sign-on through the Australian Access Federation."
      },
      {
        "n": "School Needs Diagnostic",
        "d": "Map your team’s needs to the tools that close them.",
        "t": "school-needs-diagnostic.html"
      },
      {
        "n": "TEQSA Gen AI Readiness",
        "d": "RAG-rate against TEQSA’s public checklists; export a gap report.",
        "t": "teqsa-readiness.html"
      },
      {
        "n": "Reflective Coach",
        "d": "A Socratic scaffold across seven reflective models.",
        "t": "reflective-coach.html"
      },
      {
        "n": "Course Quality Self-Check",
        "d": "Rate your course against TELAS & UDL — a spider profile.",
        "t": "selfcheck.html"
      },
      {
        "n": "Study Hub Atlas",
        "d": "Every Regional & Suburban University Study Hub, mapped (Accord PA1)."
      },
      {
        "n": "Accord Action Tracker",
        "d": "Who is implementing which Universities Accord priority."
      }
    ]
  },
  {
    "label": "2028 — connected & enterprise-ready",
    "sub": "CRMs, student systems and procurement-grade compliance",
    "c": "#7C9CFF",
    "badge": "2028",
    "items": [
      {
        "n": "CRM & student-system integration",
        "d": "Connect the systems you already run — PeopleSoft, CourseLoop and the edtech stack."
      },
      {
        "n": "WCAG 2.1 AA / VPAT",
        "d": "Accessibility conformance for procurement."
      },
      {
        "n": "Teaching Recognition Passport",
        "d": "A portable teaching record across all 42 universities — credentialed via My eQuals.",
        "t": "trp.html"
      },
      {
        "n": "AI-assisted alignment",
        "d": "Optional, model-agnostic curriculum suggestions (human-decides)."
      }
    ]
  },
  {
    "label": "2029 — the national mesh",
    "sub": "The whole sector, connected",
    "c": "#C57BFF",
    "badge": "2029",
    "items": [
      {
        "n": "The National Mesh",
        "d": "Industry, accreditation bodies and government, integrated."
      },
      {
        "n": "Open-source platform",
        "d": "Owned by the sector — open, exportable, no lock-in."
      }
    ]
  }
];

/** The 2026→2029 timeline row. [year, label, colour, live?] */
export const CAPABILITY_MILESTONES: ReadonlyArray<
  readonly [string, string, string, boolean]
> = [
  ["2026", "Open Educational Practice", "#4ECDC4", true],
  ["2027", "Symposiums & recognition", "#FFB448", false],
  ["2028", "Tools, quality & integration", "#7C9CFF", false],
  ["2029", "The national mesh", "#C57BFF", false],
];
