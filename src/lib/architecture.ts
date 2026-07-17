/**
 * #architecture — Sector Architecture data (Epic 1.2 PR-D), extracted
 * verbatim from the production bundle's rendered section: the ATEC feature
 * card (Interim SSP priorities) and the three tiers of regulator / peak
 * body / framework cards. Favicon badges use the Google s2 service, exactly
 * as production (an accepted external dependency — CLAUDE.md).
 */

export interface SspPriority {
  url: string;
  title: string;
  desc: string;
}

export const ATEC_SSP_PRIORITIES: readonly SspPriority[] = [
  {
    "url": "https://www.education.gov.au/australian-universities-accord",
    "title": "Lifelong Learning",
    "desc": "80% of working-age population with Cert III+ by 2050. Upskilling and reskilling pathways central to the Accord vision."
  },
  {
    "url": "https://www.atec.gov.au/what-we-do",
    "title": "Quality Provision",
    "desc": "Stewarding growth in student numbers sustainably. Funding arrangements that support quality and reduce marginally funded places."
  },
  {
    "url": "https://www.atec.gov.au/what-we-do/mission-based-compacts",
    "title": "Mission-Based Compacts",
    "desc": "Individual compacts with each provider aligned to institutional mission and strategic objectives. SSP guides compact development."
  },
  {
    "url": "https://www.education.gov.au/aboriginal-and-torres-strait-islander-higher-education",
    "title": "First Nations",
    "desc": "Dedicated First Nations Commissioner. Equity, access, and culturally responsive provision as cross-cutting priorities."
  }
];

export interface ArchCard {
  url: string;
  /** Favicon domain for the Google s2 badge. */
  domain: string;
  name: string;
  desc: string;
}

export interface ArchTier {
  title: string;
  cards: readonly ArchCard[];
}

export const ARCH_TIERS: readonly ArchTier[] = [
  {
    "title": "Tier 1 — Regulators & Funders",
    "cards": [
      {
        "url": "https://www.education.gov.au/australian-tertiary-education-commission",
        "domain": "www.education.gov.au",
        "name": "ATEC",
        "desc": "Australian Tertiary Education Commission — system steward for HE & VET. Statutory from 2026. Interim SSP released May 2026."
      },
      {
        "url": "https://www.teqsa.gov.au/",
        "domain": "www.teqsa.gov.au",
        "name": "TEQSA",
        "desc": "Tertiary Education Quality and Standards Agency — HE quality assurance."
      },
      {
        "url": "https://www.education.gov.au/",
        "domain": "www.education.gov.au",
        "name": "Dept of Education",
        "desc": "Australian Government Department of Education — policy and funding."
      },
      {
        "url": "https://www.jobsandskills.gov.au/",
        "domain": "www.jobsandskills.gov.au",
        "name": "JSA",
        "desc": "Jobs and Skills Australia — workforce planning and VET-HE articulation."
      }
    ]
  },
  {
    "title": "Tier 2 — Peak Bodies & Networks",
    "cards": [
      {
        "url": "https://www.herdsa.org.au/",
        "domain": "www.herdsa.org.au",
        "name": "HERDSA",
        "desc": "Higher Education Research and Development Society of Australasia."
      },
      {
        "url": "https://ascilite.org/",
        "domain": "ascilite.org",
        "name": "ASCILITE",
        "desc": "Australasian Society for Computers in Learning in Tertiary Education."
      },
      {
        "url": "https://www.caullt.edu.au/",
        "domain": "www.caullt.edu.au",
        "name": "CAULLT",
        "desc": "Council of Australasian University Leaders in Learning and Teaching."
      },
      {
        "url": "https://acode.edu.au/",
        "domain": "acode.edu.au",
        "name": "ACODE",
        "desc": "Australasian Council on Open, Distance and eLearning."
      },
      {
        "url": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
        "domain": "universitiesaustralia.edu.au",
        "name": "AAUTN",
        "desc": "Australian Awards for University Teaching Network."
      },
      {
        "url": "https://advance-he.ac.uk/",
        "domain": "advance-he.ac.uk",
        "name": "Advance HE",
        "desc": "UK-based body operating in Australasia — PSF, Fellowships, Aurora."
      },
      {
        "url": "https://www.universitiesaustralia.edu.au/",
        "domain": "www.universitiesaustralia.edu.au",
        "name": "Universities Australia",
        "desc": "Peak body representing Australia's comprehensive universities."
      },
      {
        "url": "https://www.aitsl.edu.au/",
        "domain": "www.aitsl.edu.au",
        "name": "AITSL",
        "desc": "Australian Institute for Teaching and School Leadership."
      }
    ]
  },
  {
    "title": "Tier 3 — Frameworks & Standards",
    "cards": [
      {
        "url": "https://www.legislation.gov.au/F2021L00488/latest/text",
        "domain": "www.legislation.gov.au",
        "name": "HESF",
        "desc": "Higher Education Standards Framework — the regulatory backbone."
      },
      {
        "url": "https://www.aqf.edu.au/",
        "domain": "www.aqf.edu.au",
        "name": "AQF",
        "desc": "Australian Qualifications Framework — credential levels 1-10."
      },
      {
        "url": "https://advance-he.ac.uk/teaching-and-learning/psf",
        "domain": "advance-he.ac.uk",
        "name": "PSF 2023",
        "desc": "Professional Standards Framework (Advance HE) — global teaching recognition."
      },
      {
        "url": "https://www.education.gov.au/higher-education-publications/national-microcredentials-framework",
        "domain": "www.education.gov.au",
        "name": "Nat'l Microcredentials Framework",
        "desc": "National framework for flexible, stackable credentials."
      },
      {
        "url": "https://acode.edu.au/activities/workshops/inter-institutional-benchmarking-summits/",
        "domain": "acode.edu.au",
        "name": "ACODE Benchmarks",
        "desc": "8 benchmarks for technology-enhanced learning and teaching."
      },
      {
        "url": "https://udlguidelines.cast.org/",
        "domain": "udlguidelines.cast.org",
        "name": "UDL 3.0 (CAST)",
        "desc": "Universal Design for Learning Guidelines 3.0 — engagement, representation, action & expression."
      },
      {
        "url": "https://www.teqsa.gov.au/guides-resources/higher-education-good-practice-hub/gen-ai-knowledge-hub",
        "domain": "www.teqsa.gov.au",
        "name": "TEQSA GenAI Guidance",
        "desc": "Regulatory guidance on generative AI in assessment."
      },
      {
        "url": "https://www.universitiesaustralia.edu.au/policy-submissions/diversity-equity/",
        "domain": "www.universitiesaustralia.edu.au",
        "name": "UA Indigenous Strategy",
        "desc": "Sector-wide strategy for Indigenous participation and knowledges."
      },
      {
        "url": "https://www.education.gov.au/australian-universities-accord/resources/final-report",
        "domain": "www.education.gov.au",
        "name": "Accord Final Report",
        "desc": "Australian Universities Accord (2024) — sector reform recommendations."
      }
    ]
  }
];
