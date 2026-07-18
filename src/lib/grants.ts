/**
 * SoTL Grants & Awards directory for #sotl-grants (Epic 1.2 PR-C) — the
 * funding list (39 opportunities across 16 organisations at extraction time)
 * and the Major SoTL Conferences 2025–2026 grid, extracted verbatim from the
 * production bundle (assets/app.b38bc4ca.js — the `S` grants array literal
 * and its conference cards array). Curated site content hard-coded in the
 * bundle, not data-layer material (CLAUDE.md: data/*.json holds institutions
 * + events only), so it lives here until a curator moves it into the data
 * layer. Counts are derived from these arrays, never hardcoded in copy.
 *
 * The funder "bubbles" row (GRANT_FUNDERS) is the ntlsn-grantbubbles-script
 * satellite folded in: its curated org order plus the three extra lenses
 * that pre-fill the search box. (The other grants satellite in the
 * stocktake, ntlsn-bubblescta-script, is a no-op in production — its body
 * starts with `return;` marked "superseded" — so there is nothing to port.)
 */

export interface GrantOpportunity {
  org: string;
  orgUrl: string;
  name: string;
  amount: string;
  deadline: string;
  details: string;
  url: string;
  /** "Grant" | "Award" | "Fellowship" | "Scholarship" | "Discipline". */
  category: string;
}

export interface GrantConference {
  name: string;
  dates: string;
  location: string;
  deadline: string;
  url: string;
}

/**
 * Category filter chips — production's row. The "Discipline-Specific" label
 * filters the `Discipline` category value.
 */
export const GRANT_CATEGORY_CHIPS: ReadonlyArray<{
  label: string;
  category: string;
}> = [
  { label: "All", category: "All" },
  { label: "Grant", category: "Grant" },
  { label: "Award", category: "Award" },
  { label: "Fellowship", category: "Fellowship" },
  { label: "Scholarship", category: "Scholarship" },
  { label: "Discipline-Specific", category: "Discipline" },
];

/**
 * "Browse by who funds it" bubbles — the grantbubbles satellite's exact
 * list: three query lenses, then every funder in its curated order. Each
 * bubble pre-fills the search query (the satellite drove the bundle's
 * search input the same way).
 */
export const GRANT_FUNDERS: ReadonlyArray<{ label: string; query: string }> = [
  { label: "All", query: "" },
  { label: "Early career", query: "early career" },
  { label: "First Nations", query: "Indigenous" },
  ...[
    "HERDSA",
    "ASCILITE",
    "Advance HE",
    "CAULLT",
    "WIL Australia",
    "CAUL OER",
    "ISSOTL",
    "AAUT",
    "ANZAHPE",
    "AAEE",
    "ATEA",
    "AALL",
    "ANZAM",
    "ANZSWWER",
    "CRANAplus",
    "STP",
  ].map((org) => ({ label: org, query: org })),
];

export const GRANTS: readonly GrantOpportunity[] = [
  {
    "org": "HERDSA",
    "orgUrl": "https://herdsa.org.au/",
    "name": "HERDSA Research Grants",
    "amount": "Up to $5,000 (×10)",
    "deadline": "Annual · opens Dec",
    "details": "One grant prioritised for Indigenous/First Nations applicants.",
    "url": "https://herdsa.org.au/herdsa-grants-scheme",
    "category": "Grant"
  },
  {
    "org": "HERDSA",
    "orgUrl": "https://herdsa.org.au/",
    "name": "Roger Landbeck Fund",
    "amount": "Up to $5,000",
    "deadline": "Every 1–2 yrs",
    "details": "Early career researchers from the Oceania region.",
    "url": "https://herdsa.org.au/roger-landbeck-professional-development-fund",
    "category": "Grant"
  },
  {
    "org": "HERDSA",
    "orgUrl": "https://herdsa.org.au/",
    "name": "Student Conference Grants",
    "amount": "$1,500 (×6)",
    "deadline": "Annual (~Apr)",
    "details": "For HERDSA 2026 Singapore conference.",
    "url": "https://conference.herdsa.org.au/2026/",
    "category": "Scholarship"
  },
  {
    "org": "HERDSA",
    "orgUrl": "https://herdsa.org.au/",
    "name": "Early Career Conference Grants",
    "amount": "$1,500 (×10)",
    "deadline": "Annual (~Apr)",
    "details": "One prioritised for Indigenous/First Nations applicants.",
    "url": "https://conference.herdsa.org.au/2026/",
    "category": "Scholarship"
  },
  {
    "org": "HERDSA",
    "orgUrl": "https://herdsa.org.au/",
    "name": "HERDSA Fellowship",
    "amount": "Recognition",
    "deadline": "Ongoing",
    "details": "Portfolio-based professional recognition scheme.",
    "url": "https://herdsa.org.au/joining-herdsa-fellowship-community",
    "category": "Fellowship"
  },
  {
    "org": "ASCILITE",
    "orgUrl": "https://ascilite.org/",
    "name": "ascilite Research Grants",
    "amount": "$5,000 (×3)",
    "deadline": "Annual",
    "details": "ECR, General Academic, and Professional Staff categories.",
    "url": "https://ascilite.org/get-involved/awards/",
    "category": "Grant"
  },
  {
    "org": "ASCILITE",
    "orgUrl": "https://ascilite.org/",
    "name": "Student Bursary Award",
    "amount": "$1,000 (×3)",
    "deadline": "Annual",
    "details": "Full-time PhD/EdD students + 1-year membership.",
    "url": "https://ascilite.org/awards/student-bursary-award-winners/",
    "category": "Scholarship"
  },
  {
    "org": "ASCILITE",
    "orgUrl": "https://ascilite.org/",
    "name": "Allan Christie Innovation Award",
    "amount": "Recognition",
    "deadline": "Annual · ASCILITE 2026",
    "details": "Research-informed use of technologies for T&L.",
    "url": "https://ascilite.org/get-involved/awards/",
    "category": "Award"
  },
  {
    "org": "ASCILITE",
    "orgUrl": "https://ascilite.org/",
    "name": "Anthology Ed Designer Award",
    "amount": "$1,000",
    "deadline": "Annual · ASCILITE 2026",
    "details": "Professional staff contributions (sponsored by Anthology).",
    "url": "https://ascilite.org/get-involved/awards/",
    "category": "Award"
  },
  {
    "org": "ASCILITE",
    "orgUrl": "https://ascilite.org/",
    "name": "CMALT Australasia",
    "amount": "50% member discount",
    "deadline": "31 Jan/May/Oct",
    "details": "Professional accreditation with ALT UK.",
    "url": "https://ascilite.org/get-involved/cmalt/",
    "category": "Fellowship"
  },
  {
    "org": "WIL Australia",
    "orgUrl": "https://acen.edu.au/",
    "name": "WIL Research Grants",
    "amount": "Up to $10,000",
    "deadline": "Apr (annual)",
    "details": "Staff at member institutions; 12-month projects.",
    "url": "https://acen.edu.au/research-grants/",
    "category": "Grant"
  },
  {
    "org": "WIL Australia",
    "orgUrl": "https://acen.edu.au/",
    "name": "WIL ECR Grants",
    "amount": "$5,000",
    "deadline": "Apr (annual)",
    "details": "Early Career Researchers at member institutions.",
    "url": "https://acen.edu.au/research-grants/",
    "category": "Grant"
  },
  {
    "org": "WIL Australia",
    "orgUrl": "https://acen.edu.au/",
    "name": "WIL Student Scholarships",
    "amount": "$1,500",
    "deadline": "Annual (~May)",
    "details": "Students travelling 60+ km for placement.",
    "url": "https://acen.edu.au/student-scholarships-2/",
    "category": "Scholarship"
  },
  {
    "org": "WIL Australia",
    "orgUrl": "https://acen.edu.au/",
    "name": "WIL Awards",
    "amount": "Recognition",
    "deadline": "Annual conference",
    "details": "Local Hero, Collaboration, Innovation & Excellence.",
    "url": "https://acen.edu.au/wil-awards/",
    "category": "Award"
  },
  {
    "org": "CAULLT",
    "orgUrl": "https://www.caullt.edu.au/",
    "name": "CAULLT Project Grants",
    "amount": "Up to $10,000",
    "deadline": "Annual (~Apr)",
    "details": "Multi-institutional projects prioritised.",
    "url": "https://www.caullt.edu.au/grants/",
    "category": "Grant"
  },
  {
    "org": "CAULLT",
    "orgUrl": "https://www.caullt.edu.au/",
    "name": "Academic Development Awards",
    "amount": "Recognition",
    "deadline": "September",
    "details": "Outstanding academic development practices.",
    "url": "https://www.caullt.edu.au/grants-and-projects/awards/",
    "category": "Award"
  },
  {
    "org": "CAULLT",
    "orgUrl": "https://www.caullt.edu.au/",
    "name": "CAULLT/HERDSA Leadership Award",
    "amount": "Recognition",
    "deadline": "Annual (~Sep)",
    "details": "Outstanding leadership in HE research & development.",
    "url": "https://www.caullt.edu.au/grants-and-projects/awards/",
    "category": "Award"
  },
  {
    "org": "CAUL OER",
    "orgUrl": "https://caul.edu.au/",
    "name": "OER Collaborate Grant",
    "amount": "$10,000",
    "deadline": "EOI (annual)",
    "details": "Collaborative open textbook development.",
    "url": "https://caul.libguides.com/oer-collective-publishing-workflow/initiate/funding",
    "category": "Grant"
  },
  {
    "org": "CAUL OER",
    "orgUrl": "https://caul.edu.au/",
    "name": "OER Collective Support",
    "amount": "In-kind",
    "deadline": "Ongoing",
    "details": "Pressbooks platform, design, editing services.",
    "url": "https://caul.libguides.com/oer-collective-administration/grants-program",
    "category": "Grant"
  },
  {
    "org": "Advance HE",
    "orgUrl": "https://www.advance-he.ac.uk/australasia",
    "name": "Associate Fellow (AFHEA)",
    "amount": "~$292 (member)",
    "deadline": "Ongoing",
    "details": "Or free via accredited institutional scheme.",
    "url": "https://www.advance-he.ac.uk/fellowship",
    "category": "Fellowship"
  },
  {
    "org": "Advance HE",
    "orgUrl": "https://www.advance-he.ac.uk/australasia",
    "name": "Fellow (FHEA)",
    "amount": "~$428 (member)",
    "deadline": "Ongoing",
    "details": "UniSQ LIFT program available.",
    "url": "https://www.advance-he.ac.uk/fellowship",
    "category": "Fellowship"
  },
  {
    "org": "Advance HE",
    "orgUrl": "https://www.advance-he.ac.uk/australasia",
    "name": "Senior Fellow (SFHEA)",
    "amount": "~$643 (member)",
    "deadline": "Ongoing",
    "details": "Leadership in teaching excellence.",
    "url": "https://www.advance-he.ac.uk/fellowship",
    "category": "Fellowship"
  },
  {
    "org": "Advance HE",
    "orgUrl": "https://www.advance-he.ac.uk/australasia",
    "name": "Principal Fellow (PFHEA)",
    "amount": "~$1,072 (member)",
    "deadline": "Ongoing",
    "details": "Strategic leadership in HE teaching.",
    "url": "https://www.advance-he.ac.uk/fellowship",
    "category": "Fellowship"
  },
  {
    "org": "ISSOTL",
    "orgUrl": "https://issotl.com/",
    "name": "Emerging Scholars Fund",
    "amount": "Conference fee waiver",
    "deadline": "Annual",
    "details": "Registered students + 1-year ISSOTL membership.",
    "url": "https://issotl.com/2025/05/13/2025-emerging-scholars-fund/",
    "category": "Scholarship"
  },
  {
    "org": "AAUT",
    "orgUrl": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "name": "Citations for Outstanding Contributions",
    "amount": "Up to 100/yr",
    "deadline": "25 Aug – 10 Sep",
    "details": "Recognising outstanding contributions to student learning.",
    "url": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "category": "Award"
  },
  {
    "org": "AAUT",
    "orgUrl": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "name": "Awards for Programs that Enhance Learning",
    "amount": "Up to 4/yr",
    "deadline": "25 Aug – 10 Sep",
    "details": "Recognising programs enhancing student learning.",
    "url": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "category": "Award"
  },
  {
    "org": "AAUT",
    "orgUrl": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "name": "Awards for Teaching Excellence",
    "amount": "Up to 9/yr",
    "deadline": "25 Aug – 10 Sep",
    "details": "Recognising excellence in university teaching.",
    "url": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "category": "Award"
  },
  {
    "org": "AAUT",
    "orgUrl": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "name": "Australian University Teacher of the Year",
    "amount": "1/yr",
    "deadline": "25 Aug – 10 Sep",
    "details": "Highest individual teaching award in Australian HE.",
    "url": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "category": "Award"
  },
  {
    "org": "ANZAHPE",
    "orgUrl": "https://www.anzahpe.org/",
    "name": "ANZAHPE Research Grants",
    "amount": "$5,000–$10,000",
    "deadline": "Annual (~Sep)",
    "details": "AU/NZ resident, ANZAHPE member. Health sciences education.",
    "url": "https://www.anzahpe.org/Grants",
    "category": "Discipline"
  },
  {
    "org": "CRANAplus",
    "orgUrl": "https://crana.org.au/",
    "name": "CRANAplus Scholarships",
    "amount": "Up to $1,000+",
    "deadline": "Various",
    "details": "Remote/rural nursing education.",
    "url": "https://crana.org.au/professional-support/awards-scholarships-grants",
    "category": "Discipline"
  },
  {
    "org": "STP",
    "orgUrl": "https://teachpsych.org/",
    "name": "STP SoTL Research Grants",
    "amount": "Varies",
    "deadline": "1 November",
    "details": "STP members teaching psychology.",
    "url": "https://teachpsych.org/SoTLGrant",
    "category": "Discipline"
  },
  {
    "org": "STP",
    "orgUrl": "https://teachpsych.org/",
    "name": "STP Instructional Resource Grants",
    "amount": "$1,500 (×5)",
    "deadline": "1 February",
    "details": "APA Division 2 members.",
    "url": "https://teachpsych.org/IRG",
    "category": "Discipline"
  },
  {
    "org": "ANZSWWER",
    "orgUrl": "https://www.anzswwer.org/",
    "name": "ANZSWWER SoLT Grant (Main)",
    "amount": "Up to $5,000",
    "deadline": "31 October",
    "details": "ANZSWWER members; social work/human services education.",
    "url": "https://www.anzswwer.org/solt/",
    "category": "Discipline"
  },
  {
    "org": "ANZSWWER",
    "orgUrl": "https://www.anzswwer.org/",
    "name": "ANZSWWER SoLT Grant (Seeding)",
    "amount": "$1,500",
    "deadline": "31 October",
    "details": "Seeding projects for emerging researchers.",
    "url": "https://www.anzswwer.org/solt/",
    "category": "Discipline"
  },
  {
    "org": "AAEE",
    "orgUrl": "https://aaee.net.au/",
    "name": "AAEE Engineering Education Grants",
    "amount": "Up to $10,000",
    "deadline": "Annual (~Sep)",
    "details": "AAEE members; early/mid-career educators.",
    "url": "https://aaee.net.au/current-grants/",
    "category": "Discipline"
  },
  {
    "org": "ANZAM",
    "orgUrl": "https://www.anzam.org/",
    "name": "ANZAM PELT Grant",
    "amount": "Up to $4,000",
    "deadline": "Annual (~Sep)",
    "details": "ANZAM members; management teaching.",
    "url": "https://www.anzam.org/about/awards/excellence/",
    "category": "Discipline"
  },
  {
    "org": "ATEA",
    "orgUrl": "https://atea.edu.au/",
    "name": "ATEA Awards",
    "amount": "$1,000 + certificate",
    "deadline": "Annual (~May)",
    "details": "Multiple categories including Indigenous education.",
    "url": "https://atea.edu.au/grants-awards/",
    "category": "Discipline"
  },
  {
    "org": "AALL",
    "orgUrl": "https://www.aall.org.au/",
    "name": "AALL Research & Resource Grants",
    "amount": "Up to $8,000",
    "deadline": "Annual (~Sep)",
    "details": "For AALL members — institutional or cross-institutional academic language & learning research and resource development.",
    "url": "https://www.aall.org.au/grants/",
    "category": "Grant"
  },
  {
    "org": "AALL",
    "orgUrl": "https://www.aall.org.au/",
    "name": "AALL Conference Travel Grants",
    "amount": "$1,200 (×10)",
    "deadline": "Rolling / first-come",
    "details": "Travel support for members attending the AALL conference — awarded first-come, first-served.",
    "url": "https://www.aall.org.au/grants/",
    "category": "Grant"
  }
];

/** Major SoTL Conferences 2025–2026 — production's six cards, verbatim. */
export const GRANT_CONFERENCES: readonly GrantConference[] =
  [
  {
    "name": "CAULLT (annual)",
    "dates": "24 Oct 2025",
    "location": "ACU Melbourne (hybrid)",
    "deadline": "Reg: 12 Oct 2025",
    "url": "https://www.caullt.edu.au/"
  },
  {
    "name": "ISSOTL26",
    "dates": "28–31 Oct 2026",
    "location": "Saskatoon, SK Canada",
    "deadline": "Proposals closed",
    "url": "https://issotl.com/issotl26/"
  },
  {
    "name": "ascilite 2026",
    "dates": "29 Nov – 2 Dec 2026",
    "location": "Rydges South Bank, Brisbane",
    "deadline": "29 Jun 2026",
    "url": "https://2026conference.ascilite.org/"
  },
  {
    "name": "ICED 2026",
    "dates": "24–26 Jun 2026",
    "location": "Salamanca, Spain",
    "deadline": "15 Dec 2025",
    "url": "https://iced26.es/"
  },
  {
    "name": "STARS 2026",
    "dates": "29 Jun – 1 Jul 2026",
    "location": "Sunshine Coast, QLD",
    "deadline": "2 Mar 2026",
    "url": "https://unistars.org/"
  },
  {
    "name": "HERDSA 2026",
    "dates": "6–9 Jul 2026",
    "location": "Singapore",
    "deadline": "Annual (~Apr)",
    "url": "https://conference.herdsa.org.au/2026/"
  }
];

/** Distinct funder organisations, in first-appearance (production) order. */
export const GRANT_ORGS: readonly string[] = [
  ...new Set(GRANTS.map((g) => g.org)),
];

/**
 * Filter the directory — the category chip plus a case-insensitive substring
 * search over org/name/details/amount/category (which is how the
 * grantbubbles lenses like "early career" and "Indigenous" match).
 */
export function filterGrants(
  category: string,
  query: string,
): GrantOpportunity[] {
  const q = query.trim().toLowerCase();
  return GRANTS.filter((g) => {
    if (category !== "All" && g.category !== category) return false;
    if (q === "") return true;
    return [g.org, g.name, g.details, g.amount, g.category]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}
