/**
 * SoTL Resource Hub data for #resources — 12 collections / 162 resources
 * extracted verbatim from the production bundle (assets/app.b38bc4ca.js, the
 * collections array literal). Curated site content, not data-layer material;
 * header counts are derived from this array, never hardcoded (CLAUDE.md).
 */

export type ResourceAccess =
  | "open"
  | "free"
  | "member"
  | "paywall"
  | "institutional"
  | "freemium";

export interface HubResource {
  id: string;
  title: string;
  url: string;
  description: string;
  whyItMatters: string;
  tags: string[];
  access: ResourceAccess;
  essential: boolean;
  /** "2026-04" = confirmed live April 2026; otherwise "needs-check". */
  verified: string;
  lastUpdated: string;
}

export interface HubCollection {
  id: string;
  title: string;
  icon: string;
  cardFace: string;
  tags: string[];
  resources: HubResource[];
}

/** Access-filter pill order, production's row. */
export const HUB_ACCESS_FILTERS: readonly ("All" | ResourceAccess)[] = [
  "All",
  "open",
  "free",
  "member",
  "paywall",
  "institutional",
  "freemium",
];

/** Badge tint per access level — production's exact ternary. */
export function accessColor(access: ResourceAccess): string {
  return access === "open" || access === "free"
    ? "#4ECDC4"
    : access === "paywall"
      ? "#FF6B6B"
      : "#7C9CFF";
}

export const HUB_COLLECTIONS: readonly HubCollection[] = [
  {
    "id": "sotl-toolkit",
    "title": "SoTL Toolkit for Academic Developers",
    "icon": "📚",
    "cardFace": "A rigorous, current toolkit for academic developers designing, conducting, and publishing SoTL — foundational frameworks, methodology guides, and ethics resources.",
    "tags": [
      "foundations",
      "methodology",
      "ethics",
      "academic-development",
      "essential"
    ],
    "resources": [
      {
        "id": "boyer-1990",
        "title": "Boyer (1990) Scholarship Reconsidered",
        "url": "https://www.wiley.com/en-us/Scholarship+Reconsidered-p-9781118988305",
        "description": "The foundational text that legitimised the scholarship of teaching as parallel to discovery, integration, and application.",
        "whyItMatters": "Essential grounding for any SoTL argument made to institutional leaders.",
        "tags": [
          "foundation",
          "methodology"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2015"
      },
      {
        "id": "hutchings-2000",
        "title": "Hutchings (2000) Opening Lines",
        "url": "https://eric.ed.gov/?id=ED448657",
        "description": "Introduces the four-question taxonomy (what works, what is, visions of the possible, new conceptual frameworks) that still structures SoTL research design.",
        "whyItMatters": "Foundational for structuring SoTL inquiry.",
        "tags": [
          "foundation",
          "methodology"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2000"
      },
      {
        "id": "felten-2013",
        "title": "Felten (2013) Principles of Good Practice in SoTL",
        "url": "https://journalhosting.ucalgary.ca/index.php/TLI/article/view/57375",
        "description": "The canonical five principles: inquiry on student learning, context-sensitive, methodologically sound, publicly shared, grounded in practice.",
        "whyItMatters": "Perfect for induction slides and SoTL workshop framing.",
        "tags": [
          "foundation",
          "methodology",
          "essential"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2013"
      },
      {
        "id": "trigwell-shale-2004",
        "title": "Trigwell & Shale (2004) Student Learning and the Scholarship of University Teaching",
        "url": "https://doi.org/10.1080/0307507042000236407",
        "description": "The SoTL model academic developers use when coaching staff on moving from reflective practice to scholarship.",
        "whyItMatters": "Core coaching resource for academic developers.",
        "tags": [
          "foundation",
          "methodology"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2004"
      },
      {
        "id": "kreber-2013",
        "title": "Kreber (2013) The University and Its Disciplines",
        "url": "https://www.routledge.com/The-University-and-Its-Disciplines/Kreber/p/book/9780415883818",
        "description": "Key reference on the scholarship of teaching across disciplinary domains.",
        "whyItMatters": "Useful for advising discipline leads on SoTL approaches.",
        "tags": [
          "foundation",
          "disciplines"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2013"
      },
      {
        "id": "shulman-2004",
        "title": "Shulman (2004) Teaching as Community Property",
        "url": "https://www.wiley.com/en-us/Teaching+as+Community+Property-p-9780787972011",
        "description": "Articulates the ‘teaching commons’ that academic developers are, in effect, running.",
        "whyItMatters": "Foundational framing for academic development work.",
        "tags": [
          "foundation"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2004"
      },
      {
        "id": "chick-2018",
        "title": "Chick (Ed.) (2018) SoTL in Action",
        "url": "https://styluspub.presswarehouse.com/browse/book/9781620366424/SoTL-in-Action",
        "description": "Best single volume for early-career academic developers — 18 case studies with reflective commentaries.",
        "whyItMatters": "Ideal for new developer induction reading lists.",
        "tags": [
          "foundation",
          "case-studies"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2018"
      },
      {
        "id": "miller-young-yeo-2015",
        "title": "Miller-Young & Yeo (2015) Conceptualizing and Communicating SoTL",
        "url": "https://journalhosting.ucalgary.ca/index.php/TLI/article/view/57382",
        "description": "Practical framework for academic developers who supervise or mentor SoTL projects.",
        "whyItMatters": "Direct application to mentoring and supervision practice.",
        "tags": [
          "foundation",
          "methodology"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2015"
      },
      {
        "id": "divan-2017",
        "title": "Divan et al. (2017) Survey of Research Approaches in SoTL",
        "url": "https://journalhosting.ucalgary.ca/index.php/TLI/article/view/57438",
        "description": "Landscape review showing the dominance of qualitative and mixed methods in SoTL.",
        "whyItMatters": "Useful for methodology coaching sessions.",
        "tags": [
          "methodology",
          "research-methods"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2017"
      },
      {
        "id": "fanghanel-2016",
        "title": "Fanghanel et al. (2016) Defining and Supporting SoTL: A Sector-Wide Study",
        "url": "https://www.advance-he.ac.uk/knowledge-hub/defining-and-supporting-scholarship-teaching-and-learning-sotl-sector-wide-study",
        "description": "Major UK sector report on SoTL infrastructure — arguments translate well to Australian contexts.",
        "whyItMatters": "Evidence base for institutional SoTL strategy.",
        "tags": [
          "foundation",
          "UK",
          "advocacy"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2016"
      },
      {
        "id": "bishop-clark-2012",
        "title": "Bishop-Clark & Dietz-Uhler (2012) Engaging in the Scholarship of Teaching and Learning",
        "url": "https://styluspub.presswarehouse.com/browse/book/9781579227258/Engaging-in-the-Scholarship-of-Teaching-and-Learning",
        "description": "The most practical start-to-finish guide for teaching-focused staff beginning their first SoTL project.",
        "whyItMatters": "Top recommendation for first-time SoTL researchers.",
        "tags": [
          "methodology",
          "getting-started"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2012"
      },
      {
        "id": "maclean-poole-2010",
        "title": "MacLean & Poole (2010) Ethical Considerations for Novices to SoTL",
        "url": "https://journalhosting.ucalgary.ca/index.php/TLI",
        "description": "Foundational text on SoTL ethics — translates directly to Australian NHMRC National Statement considerations.",
        "whyItMatters": "Essential for ethics coaching in SoTL.",
        "tags": [
          "ethics",
          "methodology"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2010"
      },
      {
        "id": "nhmrc-2023",
        "title": "NHMRC National Statement on Ethical Conduct in Human Research (2023)",
        "url": "https://www.nhmrc.gov.au/about-us/publications/national-statement-ethical-conduct-human-research-2023",
        "description": "The Australian ethics framework academic developers must reference when advising on SoTL projects involving students.",
        "whyItMatters": "Mandatory reference for Australian SoTL ethics.",
        "tags": [
          "ethics",
          "AU",
          "regulatory"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2023"
      },
      {
        "id": "martin-2013",
        "title": "Martin (2013) Navigating the IRB: The Ethics of SoTL",
        "url": "https://scholarworks.iu.edu/journals/index.php/josotl",
        "description": "Walks through the tensions between teaching and research ethics approvals.",
        "whyItMatters": "Practical guide for ethics committee navigation.",
        "tags": [
          "ethics"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2013"
      },
      {
        "id": "elon-sotl-guide",
        "title": "Elon University Centre for Engaged Learning SoTL Scholar Guide",
        "url": "https://www.centerforengagedlearning.org/resources/",
        "description": "Modular open guide explicitly designed for academic developers supporting SoTL projects.",
        "whyItMatters": "Ready-to-use workshop resource.",
        "tags": [
          "foundation",
          "getting-started"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "sotl-academic-developers",
    "title": "SoTL for Academic Developers",
    "icon": "🎓",
    "cardFace": "Research, reflection pieces, and communities focused on the distinctive work of academic developers as SoTL scholars — including the meta-SoTL of developing others’ scholarship.",
    "tags": [
      "academic-development",
      "identity",
      "meta-sotl",
      "essential"
    ],
    "resources": [
      {
        "id": "ijad",
        "title": "International Journal for Academic Development (IJAD)",
        "url": "https://www.tandfonline.com/journals/rija20",
        "description": "The journal for academic developer scholarship; IJAD explicitly welcomes SoTL on the practice of academic development itself.",
        "whyItMatters": "Essential subscription target for every developer.",
        "tags": [
          "journal",
          "academic-development"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "iced",
        "title": "ICED — International Consortium for Educational Development",
        "url": "https://icedonline.net/",
        "description": "Peak body linking academic-development networks globally (HERDSA, SEDA, POD, STLHE affiliates).",
        "whyItMatters": "Global network for developers.",
        "tags": [
          "network",
          "international"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "icalld",
        "title": "ICALLD — International Consortium of Academic Language & Learning Developers",
        "url": "https://icalld.wordpress.com/",
        "description": "Global consortium linking academic language and learning (ALL) / learning development networks — AALL (Australia), ATLAANZ (NZ), ALDinHE (UK) and peers.",
        "whyItMatters": "Connects the ALL/LD community worldwide.",
        "tags": [
          "network",
          "international",
          "learning-development"
        ],
        "access": "free",
        "essential": false,
        "verified": "2026-06",
        "lastUpdated": "2026"
      },
      {
        "id": "atlaanz",
        "title": "ATLAANZ — Tertiary Learning Advisors of Aotearoa New Zealand",
        "url": "https://www.atlaanz.org/",
        "description": "NZ professional association for tertiary learning advisors; trans-Tasman sister body to AALL.",
        "whyItMatters": "Cross-Tasman ALL/LD partner.",
        "tags": [
          "NZ",
          "network",
          "learning-development"
        ],
        "access": "open",
        "essential": false,
        "verified": "2026-06",
        "lastUpdated": "2026"
      },
      {
        "id": "aldinhe",
        "title": "ALDinHE — Association for Learning Development in Higher Education (UK)",
        "url": "https://aldinhe.ac.uk/",
        "description": "UK professional body for learning development — community of practice and the Journal of Learning Development in Higher Education (JLDHE).",
        "whyItMatters": "Leading UK learning-development network.",
        "tags": [
          "UK",
          "network",
          "learning-development"
        ],
        "access": "free",
        "essential": false,
        "verified": "2026-06",
        "lastUpdated": "2026"
      },
      {
        "id": "land-2004",
        "title": "Land (2004) Educational Development: Discourse, Identity and Practice",
        "url": "https://www.mheducation.co.uk/educational-development-9780335213030-emea-group",
        "description": "Foundational taxonomy of developer orientations (romantic, vigilant, researcher, interpretive) — still used in developer induction worldwide.",
        "whyItMatters": "Core identity framework for the profession.",
        "tags": [
          "identity",
          "foundation"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2004"
      },
      {
        "id": "sutherland-2018",
        "title": "Sutherland (2018) Holistic Academic Development",
        "url": "https://doi.org/10.1080/1360144X.2018.1524571",
        "description": "Argues for developers to attend to whole-academic-life, not just teaching skills.",
        "whyItMatters": "Reshapes the SoTL agenda for developers.",
        "tags": [
          "identity",
          "academic-development"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2018"
      },
      {
        "id": "kensington-miller-2015",
        "title": "Kensington-Miller et al. (2015) The Chameleon on a Tartan Rug",
        "url": "https://doi.org/10.1080/1360144X.2015.1047373",
        "description": "Influential identity piece — often used in developer induction programs.",
        "whyItMatters": "Essential reading for developer identity work.",
        "tags": [
          "identity",
          "academic-development"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2015"
      },
      {
        "id": "caullt-edp",
        "title": "CAULLT Executive Development Program",
        "url": "https://www.caullt.edu.au/",
        "description": "The Australasian program for new directors of L&T and academic development leadership.",
        "whyItMatters": "Key leadership pathway for AU developers.",
        "tags": [
          "AU",
          "leadership",
          "program"
        ],
        "access": "member",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "kandlbinder-peseta-2009",
        "title": "Kandlbinder & Peseta (2009) Key Concepts in Postgraduate Certificates in HE",
        "url": "https://doi.org/10.1080/13601440802659247",
        "description": "The evidence base for what academic-development curriculum actually contains.",
        "whyItMatters": "Useful when designing your own GradCert programs.",
        "tags": [
          "curriculum",
          "academic-development"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2009"
      },
      {
        "id": "peseta-2017",
        "title": "Peseta, Barrie & McLean (2017) Academic Life in the Measured University",
        "url": "https://www.tandfonline.com/toc/cher20/current",
        "description": "Australian critical sociology of developer work under managerialism.",
        "whyItMatters": "Ammunition for structural advocacy.",
        "tags": [
          "AU",
          "critical",
          "identity"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2017"
      },
      {
        "id": "little-green-2021",
        "title": "Little & Green (2021) Credibility in Educational Development",
        "url": "https://www.tandfonline.com/toc/cher20/current",
        "description": "Empirical account of what gives developers traction with academics: trustworthiness, expertise, and identification.",
        "whyItMatters": "Useful advocacy fuel for developer legitimacy.",
        "tags": [
          "advocacy",
          "identity"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2021"
      },
      {
        "id": "pod-tia",
        "title": "POD Network — To Improve the Academy",
        "url": "https://podnetwork.org/",
        "description": "The sibling of IJAD from the US developer community; practice-rich; Michigan Publishing OA.",
        "whyItMatters": "Free OA developer scholarship.",
        "tags": [
          "journal",
          "US",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "green-little-2013",
        "title": "Green & Little (2013) Academic Development on the Margins",
        "url": "https://doi.org/10.1080/03075079.2011.583640",
        "description": "Frames the structural precarity of developer work.",
        "whyItMatters": "Ammunition for legitimacy arguments.",
        "tags": [
          "advocacy",
          "identity"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2013"
      },
      {
        "id": "seda-pdf",
        "title": "SEDA Professional Development Framework",
        "url": "https://www.seda.ac.uk/",
        "description": "UK credentialing framework specifically for developers — some Australian centres align with it.",
        "whyItMatters": "Alternative recognition pathway.",
        "tags": [
          "UK",
          "framework",
          "recognition"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "brew-2010",
        "title": "Brew (2010) Transforming Academic Practice Through Scholarship",
        "url": "https://doi.org/10.1080/13601441003737618",
        "description": "Australian (Sydney) developer scholar whose arguments for research-teaching integration are canonical.",
        "whyItMatters": "Core AU developer scholarship.",
        "tags": [
          "AU",
          "foundation"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2010"
      },
      {
        "id": "herdsa-fellowship",
        "title": "HERDSA Fellowship Scheme",
        "url": "https://herdsa.org.au/joining-herdsa-fellowship-community",
        "description": "Peer-recognition pathway for experienced developers/teachers in Australasia.",
        "whyItMatters": "Useful for promotion dossiers.",
        "tags": [
          "AU",
          "recognition",
          "fellowship"
        ],
        "access": "member",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "issotl-grand-challenges",
        "title": "ISSOTL Grand Challenges (incl. GC5: Cultures Where SoTL Can Grow)",
        "url": "https://issotl.com/",
        "description": "Live international agenda-setting activity directly relevant to developers building SoTL cultures.",
        "whyItMatters": "Sets the global SoTL research agenda.",
        "tags": [
          "international",
          "advocacy"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      }
    ]
  },
  {
    "id": "presenting-sotl",
    "title": "Presenting SoTL",
    "icon": "🎤",
    "cardFace": "Evidence-informed guides for preparing conference talks, symposium addresses, and in-house showcases — slide design, oral delivery, and accessible presentation craft.",
    "tags": [
      "presentation",
      "oral",
      "slides",
      "accessibility"
    ],
    "resources": [
      {
        "id": "presentation-zen",
        "title": "Presentation Zen (Garr Reynolds)",
        "url": "https://www.presentationzen.com/",
        "description": "The reference aesthetic: fewer words per slide, big visuals, narrative arc.",
        "whyItMatters": "Every developer workshop cites it.",
        "tags": [
          "slides",
          "design"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "duarte",
        "title": "Duarte — Slide:ology and Resonate",
        "url": "https://www.duarte.com/",
        "description": "Structured decision-making for complex data slides; Resonate gives a story framework for persuasive research talks.",
        "whyItMatters": "Advanced slide and narrative craft.",
        "tags": [
          "slides",
          "narrative"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "assertion-evidence",
        "title": "Assertion-Evidence Structure (Michael Alley)",
        "url": "https://www.assertion-evidence.com/",
        "description": "Evidence-based alternative to topic-subtitle slides: one-sentence claim + supporting visual. Strong Penn State research base.",
        "whyItMatters": "Research-backed slide redesign method.",
        "tags": [
          "slides",
          "research-methods"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "tufte-powerpoint",
        "title": "Tufte — The Cognitive Style of PowerPoint",
        "url": "https://www.edwardtufte.com/",
        "description": "The classic critique of slide culture — still required reading for advanced slide coaching.",
        "whyItMatters": "Critical perspective on presentation defaults.",
        "tags": [
          "slides",
          "critical"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2006"
      },
      {
        "id": "gallo-ted",
        "title": "Gallo — Talk Like TED",
        "url": "https://carminegallo.com/",
        "description": "Short, accessible framing of rhetorical devices used in successful TED talks.",
        "whyItMatters": "Accessible delivery coaching resource.",
        "tags": [
          "oral",
          "delivery"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2014"
      },
      {
        "id": "ms-accessibility-checker",
        "title": "Microsoft Accessibility Checker for PowerPoint",
        "url": "https://support.microsoft.com/en-us/office/improve-accessibility-with-the-accessibility-checker",
        "description": "Built-in tool for alt text, contrast, reading order — teach staff to use it before every talk.",
        "whyItMatters": "Practical accessibility tool for all presenters.",
        "tags": [
          "accessibility",
          "tools"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "wcag-quick-ref",
        "title": "WCAG 2.2 Quick Reference for Presenters",
        "url": "https://www.w3.org/WAI/WCAG22/quickref/",
        "description": "Gold standard for contrast ratios, text size, and captioning.",
        "whyItMatters": "Required by many Australian institutional policies.",
        "tags": [
          "accessibility",
          "standards"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2023"
      },
      {
        "id": "aacu-oral-rubric",
        "title": "AAC&U VALUE Rubric — Oral Communication",
        "url": "https://www.aacu.org/initiatives/value-initiative/value-rubrics",
        "description": "Free adaptable rubric for assessing or self-assessing conference presentations.",
        "whyItMatters": "Widely used in AU faculty development.",
        "tags": [
          "rubric",
          "assessment"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "pecha-kucha",
        "title": "Pecha Kucha Method (20 × 20)",
        "url": "https://www.pechakucha.com/",
        "description": "Format increasingly used at HERDSA/ISSOTL to force concise SoTL storytelling: 20 slides, 20 seconds each.",
        "whyItMatters": "Ideal for showcases and lightning talks.",
        "tags": [
          "format",
          "presentation"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "ignite-talks",
        "title": "Ignite Talks Format (5 min, 20 auto-advance)",
        "url": "https://www.ignitetalks.io/",
        "description": "Similar lightning-talk format; good for internal L&T showcases.",
        "whyItMatters": "Low-barrier showcase format.",
        "tags": [
          "format",
          "presentation"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "3mt-uq",
        "title": "Three-Minute Thesis (3MT) — University of Queensland",
        "url": "https://threeminutethesis.uq.edu.au/",
        "description": "Home of 3MT; rules, rubric, and winning-talk archive. Directly applicable to in-house SoTL elevator sessions.",
        "whyItMatters": "Australian innovation now used globally.",
        "tags": [
          "format",
          "AU",
          "presentation"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "hks-oral",
        "title": "Harvard Kennedy School — Communicating Research: Oral Presentations",
        "url": "https://projects.iq.harvard.edu/communicatingresearch",
        "description": "Open set of short videos with rubrics for academic oral delivery.",
        "whyItMatters": "Free high-quality delivery training.",
        "tags": [
          "oral",
          "delivery"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "advance-he-presenting",
        "title": "Advance HE — Presenting Your Teaching & Learning",
        "url": "https://www.advance-he.ac.uk/",
        "description": "Regular webinars on conference prep for Fellowship applicants.",
        "whyItMatters": "Directly relevant to Advance HE Fellowship prep.",
        "tags": [
          "presentation",
          "fellowship"
        ],
        "access": "institutional",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "poster-design",
    "title": "Poster Design for SoTL",
    "icon": "🖼️",
    "cardFace": "Modern, evidence-based poster formats — including the #BetterPoster movement — with templates, rubrics, and accessibility guidance tailored for SoTL conferences.",
    "tags": [
      "poster",
      "visual-design",
      "conference"
    ],
    "resources": [
      {
        "id": "betterposter-osf",
        "title": "Morrison — #BetterPoster Templates (OSF)",
        "url": "https://osf.io/ef53g/",
        "description": "The viral ‘one big finding in plain language’ poster format. PowerPoint templates with CC-BY reuse.",
        "whyItMatters": "The new standard for SoTL poster design.",
        "tags": [
          "poster",
          "template",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2024"
      },
      {
        "id": "betterposter-video",
        "title": "Morrison — #BetterPoster YouTube Explainer",
        "url": "https://www.youtube.com/watch?v=1RwJbhkCA58",
        "description": "20-minute rationale video (over 1M views) — ideal orientation for poster-prep workshops.",
        "whyItMatters": "Workshop-ready video resource.",
        "tags": [
          "poster",
          "video"
        ],
        "access": "free",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2019"
      },
      {
        "id": "mit-better-poster",
        "title": "MIT Communication Lab — Even Better Poster Templates",
        "url": "https://mitcommlab.mit.edu/",
        "description": "MIT’s iteration with improved accessibility and visual hierarchy.",
        "whyItMatters": "Accessibility-improved poster variant.",
        "tags": [
          "poster",
          "template",
          "accessibility"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "ucdavis-poster",
        "title": "UC Davis — Better & Even Better Scientific Posters Guide",
        "url": "https://guides.library.ucdavis.edu/scientific-poster",
        "description": "Side-by-side comparison of poster formats with templates and video tutorials.",
        "whyItMatters": "Comprehensive comparison resource.",
        "tags": [
          "poster",
          "guide"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2024"
      },
      {
        "id": "purrington-poster",
        "title": "Purrington — Designing Conference Posters",
        "url": "https://colinpurrington.com/tips/poster-design/",
        "description": "The detailed, witty reference for traditional scientific posters.",
        "whyItMatters": "Still valuable for comparative context.",
        "tags": [
          "poster",
          "guide"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "sink-betterposter",
        "title": "s-ink.org — Crameri Betterposter Re-implementation",
        "url": "https://s-ink.org/betterposter-poster-template",
        "description": "Accessibility-improved redesign with colour-blind-safe palettes.",
        "whyItMatters": "Inclusive design variant.",
        "tags": [
          "poster",
          "accessibility",
          "template"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2024"
      },
      {
        "id": "canva-education",
        "title": "Canva for Education — Academic Poster Templates",
        "url": "https://www.canva.com/education/",
        "description": "Free for educators; AU universities often have institutional Canva access.",
        "whyItMatters": "Low-barrier design tool for non-designers.",
        "tags": [
          "poster",
          "tools"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "piktochart",
        "title": "Piktochart / Adobe Express Free Tiers",
        "url": "https://piktochart.com/",
        "description": "Alternative visual poster creators useful for non-designers.",
        "whyItMatters": "Additional accessible design options.",
        "tags": [
          "poster",
          "tools"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "unsw-poster-guide",
        "title": "UNSW Poster Design Guide",
        "url": "https://www.student.unsw.edu.au/",
        "description": "AU-hosted poster-design guide aligned to Australian academic conventions.",
        "whyItMatters": "Locally relevant AU resource.",
        "tags": [
          "poster",
          "AU",
          "guide"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "cochrane-betterposter",
        "title": "Cochrane — Better Poster Instructional Video",
        "url": "https://www.youtube.com/results?search_query=cochrane+better+poster",
        "description": "Health-science application of the Morrison format; shows real iteration.",
        "whyItMatters": "Discipline-specific poster example.",
        "tags": [
          "poster",
          "health",
          "video"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "sotl-journals",
    "title": "SoTL Journals",
    "icon": "📝",
    "cardFace": "Target journals for SoTL — flagged for academic-developer fit, open-access status, and typical APCs. Diamond OA options highlighted.",
    "tags": [
      "journal",
      "dissemination",
      "open-access",
      "publication"
    ],
    "resources": [
      {
        "id": "tli",
        "title": "Teaching & Learning Inquiry (TLI) — ISSOTL",
        "url": "https://journalhosting.ucalgary.ca/index.php/TLI",
        "description": "ISSOTL flagship; diamond OA (CC-BY-NC 4.0); JIF 1.7 (Q2). Explicitly pluralist methods.",
        "whyItMatters": "Top-tier SoTL journal, no APC.",
        "tags": [
          "journal",
          "open-access",
          "essential"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "ijad-journal",
        "title": "International Journal for Academic Development (IJAD)",
        "url": "https://www.tandfonline.com/journals/rija20",
        "description": "Routledge/T&F; hybrid OA. The journal for developer scholarship.",
        "whyItMatters": "The developer-specific journal.",
        "tags": [
          "journal",
          "academic-development"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "herd",
        "title": "Higher Education Research & Development (HERD) — HERDSA",
        "url": "https://www.tandfonline.com/toc/cher20/current",
        "description": "Routledge; hybrid; CAUL read-publish applies. Australasian flagship.",
        "whyItMatters": "Premier AU HE research journal.",
        "tags": [
          "journal",
          "AU"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "jutlp",
        "title": "Journal of University Teaching & Learning Practice (JUTLP)",
        "url": "https://ro.uow.edu.au/jutlp/",
        "description": "Wollongong; diamond OA. AU open-access with developer-friendly editorial stance.",
        "whyItMatters": "Free AU publication venue.",
        "tags": [
          "journal",
          "AU",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "ij-sotl",
        "title": "International Journal for the Scholarship of Teaching and Learning (IJ-SoTL)",
        "url": "https://digitalcommons.georgiasouthern.edu/ij-sotl/",
        "description": "Georgia Southern; diamond OA. Welcomes practitioner inquiry.",
        "whyItMatters": "No-APC SoTL journal.",
        "tags": [
          "journal",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "josotl",
        "title": "Journal of the Scholarship of Teaching and Learning (JoSoTL)",
        "url": "https://scholarworks.iu.edu/journals/index.php/josotl",
        "description": "Indiana University; diamond OA. Welcomes developer-led work.",
        "whyItMatters": "Free, developer-friendly.",
        "tags": [
          "journal",
          "open-access"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "cjsotl",
        "title": "Canadian Journal for the Scholarship of Teaching and Learning (CJSoTL)",
        "url": "https://ojs.lib.uwo.ca/index.php/cjsotl_rcacea",
        "description": "Western University; diamond OA; bilingual. Developer-friendly.",
        "whyItMatters": "Trans-Pacific OA option.",
        "tags": [
          "journal",
          "open-access",
          "Canada"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "she",
        "title": "Studies in Higher Education",
        "url": "https://www.tandfonline.com/toc/cshe20/current",
        "description": "Routledge; hybrid. Broader HE research.",
        "whyItMatters": "High-impact generalist HE venue.",
        "tags": [
          "journal"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "tihe",
        "title": "Teaching in Higher Education",
        "url": "https://www.tandfonline.com/toc/cthe20/current",
        "description": "Routledge; hybrid. Critical pedagogy; developer-friendly.",
        "whyItMatters": "Strong critical-pedagogy orientation.",
        "tags": [
          "journal",
          "critical"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "alhe",
        "title": "Active Learning in Higher Education",
        "url": "https://journals.sagepub.com/home/alh",
        "description": "SAGE; hybrid. Applied, pragmatic SoTL.",
        "whyItMatters": "Good fit for practice-based work.",
        "tags": [
          "journal"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "aehe",
        "title": "Assessment & Evaluation in Higher Education",
        "url": "https://www.tandfonline.com/toc/caeh20/current",
        "description": "Routledge; hybrid. For SoTL on assessment specifically.",
        "whyItMatters": "Assessment-focused SoTL venue.",
        "tags": [
          "journal",
          "assessment"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "ieti",
        "title": "Innovations in Education and Teaching International",
        "url": "https://www.tandfonline.com/toc/riie20/current",
        "description": "Routledge; hybrid. SEDA-adjacent; developer-friendly.",
        "whyItMatters": "Developer-oriented teaching innovation.",
        "tags": [
          "journal"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "jpaap",
        "title": "Journal of Perspectives in Applied Academic Practice (JPAAP)",
        "url": "https://jpaap.ac.uk/",
        "description": "Edinburgh Napier; diamond OA. Explicitly for academic developers.",
        "whyItMatters": "OA journal specifically for developers.",
        "tags": [
          "journal",
          "open-access",
          "academic-development"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "compass",
        "title": "Compass: Journal of Learning and Teaching",
        "url": "https://journals.gre.ac.uk/index.php/compass",
        "description": "Greenwich; diamond OA. Short-form practice pieces; low-barrier entry.",
        "whyItMatters": "Good first publication venue.",
        "tags": [
          "journal",
          "open-access"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "asrhe",
        "title": "Advancing Scholarship and Research in Higher Education (ASRHE) — HERDSA",
        "url": "https://www.herdsa.org.au/",
        "description": "HERDSA OA title; developer-friendly.",
        "whyItMatters": "AU open HERDSA publication.",
        "tags": [
          "journal",
          "AU",
          "open-access"
        ],
        "access": "open",
        "essential": false,
        "verified": "2026-04",
        "lastUpdated": "2026"
      }
    ]
  },
  {
    "id": "open-access-preprints",
    "title": "Open Access, Preprints & Rights",
    "icon": "🔓",
    "cardFace": "Preprint servers, open-access pathways, and rights tools that let academic developers maximise SoTL impact without breaking APC budgets.",
    "tags": [
      "open-access",
      "preprint",
      "rights",
      "APC"
    ],
    "resources": [
      {
        "id": "edarxiv",
        "title": "EdArXiv — Education Research Preprints",
        "url": "https://edarxiv.org/",
        "description": "OSF-hosted, free, DOI-assigned preprints specifically for education research.",
        "whyItMatters": "Essential for fast dissemination of AU SoTL.",
        "tags": [
          "preprint",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "socarxiv",
        "title": "SocArXiv",
        "url": "https://socarxiv.org/",
        "description": "Broader social-science preprint server; appropriate for sociological SoTL.",
        "whyItMatters": "Alternative preprint option.",
        "tags": [
          "preprint",
          "open-access"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "psyarxiv",
        "title": "PsyArXiv",
        "url": "https://psyarxiv.com/",
        "description": "For SoTL with psychology-of-learning emphasis.",
        "whyItMatters": "Psychology-of-learning SoTL venue.",
        "tags": [
          "preprint",
          "open-access"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "zenodo",
        "title": "Zenodo",
        "url": "https://zenodo.org/",
        "description": "CERN-hosted generalist repository; accepts conference posters, slides, reports. DOI issued per deposit.",
        "whyItMatters": "Universal deposit option for any SoTL output.",
        "tags": [
          "repository",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "caul-rap",
        "title": "CAUL Read-and-Publish Deals",
        "url": "https://www.caul.edu.au/",
        "description": "Council of Australian University Librarians negotiates APC-free OA with major publishers.",
        "whyItMatters": "Check your institution’s coverage first — may cover T&F, Wiley, Springer.",
        "tags": [
          "AU",
          "open-access",
          "APC"
        ],
        "access": "institutional",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "arc-oa-policy",
        "title": "ARC Open Access Policy (2022)",
        "url": "https://www.arc.gov.au/policies-strategies/policy/arc-open-access-policy",
        "description": "Requires OA deposit within 12 months for ARC-funded work.",
        "whyItMatters": "Mandatory for ARC-funded SoTL.",
        "tags": [
          "AU",
          "policy",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2022"
      },
      {
        "id": "nhmrc-oa",
        "title": "NHMRC Open Access Policy",
        "url": "https://www.nhmrc.gov.au/about-us/resources/open-access-policy",
        "description": "Analogous NHMRC requirement — relevant for health-professions SoTL.",
        "whyItMatters": "Required for NHMRC-funded work.",
        "tags": [
          "AU",
          "policy",
          "open-access"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "cc-chooser",
        "title": "Creative Commons Licence Chooser",
        "url": "https://creativecommons.org/choose/",
        "description": "Essential for academic developers sharing teaching materials and SoTL instruments openly.",
        "whyItMatters": "Right licence choice protects and enables sharing.",
        "tags": [
          "rights",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "doaj",
        "title": "DOAJ — Directory of Open Access Journals",
        "url": "https://doaj.org/",
        "description": "Vet OA journals to avoid predatory publishing; filterable by ‘no APC’.",
        "whyItMatters": "Quality assurance for OA journal selection.",
        "tags": [
          "open-access",
          "quality"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "sherpa-romeo",
        "title": "Sherpa Romeo — Publisher Self-Archiving Policies",
        "url": "https://v2.sherpa.ac.uk/romeo/",
        "description": "Check what version of a paper you can legally deposit in an institutional repository.",
        "whyItMatters": "Essential for green OA compliance.",
        "tags": [
          "rights",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "think-check-submit",
        "title": "Think.Check.Submit",
        "url": "https://thinkchecksubmit.org/",
        "description": "Checklist for avoiding predatory journals when choosing SoTL venues.",
        "whyItMatters": "Protects early-career researchers.",
        "tags": [
          "quality",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "institutional-repos",
        "title": "Institutional Repositories (e.g., UniSQ ePrints, UQ eSpace)",
        "url": "https://eprints.usq.edu.au/",
        "description": "Green-OA route for AU academic developers.",
        "whyItMatters": "Free deposit, institutional visibility.",
        "tags": [
          "AU",
          "open-access",
          "repository"
        ],
        "access": "institutional",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "conference-calendar",
    "title": "Conference Calendar 2026",
    "icon": "📅",
    "cardFace": "Curated annual calendar of SoTL and academic-development conferences — Australian first, then international — with 2026 dates and submission windows.",
    "tags": [
      "conference",
      "calendar",
      "2026"
    ],
    "resources": [
      {
        "id": "herdsa-2026",
        "title": "HERDSA Conference 2026",
        "url": "https://conference.herdsa.org.au/2026/",
        "description": "6–9 July, NUS Singapore. Theme: ‘Re-envisioning Higher Education for Tomorrow’s Learners.’ First HERDSA outside Australasia in 5+ years.",
        "whyItMatters": "Premier Australasian HE research conference.",
        "tags": [
          "conference",
          "AU",
          "international"
        ],
        "access": "member",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "issotl-2026",
        "title": "ISSOTL26",
        "url": "https://issotl.com/issotl26/",
        "description": "28–31 October, Saskatoon, Canada. Theme: ‘Building Bridges: Strengthening Relationships and Networks in SoTL.’",
        "whyItMatters": "The global SoTL conference.",
        "tags": [
          "conference",
          "international"
        ],
        "access": "member",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "ascilite-2026",
        "title": "ASCILITE 2026",
        "url": "https://ascilite.org/",
        "description": "Annual; typically late Nov/early Dec. Technology-enhanced learning focus.",
        "whyItMatters": "Key AU EdTech conference.",
        "tags": [
          "conference",
          "AU"
        ],
        "access": "member",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "stars-2026",
        "title": "STARS Conference 2026",
        "url": "https://unistars.org/",
        "description": "Student transitions, achievement, retention, success. Annual June/July.",
        "whyItMatters": "Student success research community.",
        "tags": [
          "conference",
          "AU"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "acode-2026",
        "title": "ACODE Summit / LTLI",
        "url": "https://acode.edu.au/",
        "description": "Biennial Learning Technologies Leadership Institute + annual summits.",
        "whyItMatters": "Digital learning leadership development.",
        "tags": [
          "conference",
          "AU"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "aaut-2026",
        "title": "AAUT Awards Ceremony",
        "url": "https://www.universitiesaustralia.edu.au/",
        "description": "Annually coordinated by Universities Australia. 2026 round opens second half of 2026.",
        "whyItMatters": "National teaching award recognition.",
        "tags": [
          "awards",
          "AU"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "advance-he-tlc-2026",
        "title": "Advance HE Teaching & Learning Conference 2026",
        "url": "https://www.advance-he.ac.uk/",
        "description": "Annual UK conference; online + in-person.",
        "whyItMatters": "UK-based but increasingly AU-attended.",
        "tags": [
          "conference",
          "UK"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "seda-2026",
        "title": "SEDA Spring & Autumn Conferences",
        "url": "https://www.seda.ac.uk/",
        "description": "Typically May & November. Developer-focused.",
        "whyItMatters": "UK developer community conferences.",
        "tags": [
          "conference",
          "UK"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "iced-2026",
        "title": "ICED 2026",
        "url": "https://iced26.es/",
        "description": "University of Salamanca, Spain. 24–26 June 2026.",
        "whyItMatters": "Peak global educational development event.",
        "tags": [
          "conference",
          "international"
        ],
        "access": "member",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "pod-2026",
        "title": "POD Network Annual Conference",
        "url": "https://podnetwork.org/",
        "description": "Annually mid-November. US developer community.",
        "whyItMatters": "US educational development network.",
        "tags": [
          "conference",
          "US"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "stlhe-2026",
        "title": "STLHE 2026 (Canada)",
        "url": "https://www.stlhe.ca/",
        "description": "Society for Teaching and Learning in Higher Education; annual June.",
        "whyItMatters": "Canadian SoTL community.",
        "tags": [
          "conference",
          "Canada"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "lilly-2026",
        "title": "Lilly Conferences on College & University Teaching",
        "url": "https://celt.miamioh.edu/lillycon/",
        "description": "Multiple per year (Bethesda, Austin, Asheville). US-based.",
        "whyItMatters": "Accessible SoTL conference series.",
        "tags": [
          "conference",
          "US"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "aaee-2026",
        "title": "AAEE 2026 (Australasian Association for Engineering Education)",
        "url": "https://aaee.net.au/",
        "description": "Engineering education focus.",
        "whyItMatters": "Discipline-specific SoTL venue.",
        "tags": [
          "conference",
          "AU",
          "discipline"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "aautn-webinars-2026",
        "title": "AAUT & HERDSA National Webinar Series 2026",
        "url": "https://aautn.edu.au/",
        "description": "Ongoing throughout 2026; celebrates AAUT recipients.",
        "whyItMatters": "Free, AU-specific development.",
        "tags": [
          "webinar",
          "AU",
          "free"
        ],
        "access": "free",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "eurosotl",
        "title": "EuroSoTL",
        "url": "https://eurosotl.eu/",
        "description": "Biennial European SoTL event; 2026 may be off-year.",
        "whyItMatters": "European SoTL community.",
        "tags": [
          "conference",
          "international"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "sotl-advocacy",
    "title": "Advocating for SoTL",
    "icon": "📣",
    "cardFace": "Evidence, frameworks, and worked examples to make the institutional case for SoTL — legitimacy arguments, promotion pathways, workload integration, and impact storytelling.",
    "tags": [
      "advocacy",
      "promotion",
      "workload",
      "legitimacy",
      "essential"
    ],
    "resources": [
      {
        "id": "chalmers-2011",
        "title": "Chalmers (2011) Progress and Challenges to Recognition of SoTL",
        "url": "https://doi.org/10.1080/07294360.2011.536970",
        "description": "Denise Chalmers’ landmark AU paper — the go-to reference for promotion-committee advocacy.",
        "whyItMatters": "Essential for AU institutional advocacy.",
        "tags": [
          "AU",
          "advocacy",
          "promotion"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2011"
      },
      {
        "id": "stes-2010",
        "title": "Stes et al. (2010) Impact of Instructional Development in Higher Education",
        "url": "https://doi.org/10.1016/j.edurev.2009.07.001",
        "description": "Systematic review of academic-development impact — essential for evidence-based advocacy.",
        "whyItMatters": "Hard evidence for development investment.",
        "tags": [
          "advocacy",
          "evidence",
          "systematic-review"
        ],
        "access": "paywall",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2010"
      },
      {
        "id": "graham-2018",
        "title": "Graham (2015, 2018) Career Framework for University Teaching",
        "url": "https://www.teachingframework.com/",
        "description": "Ruth Graham’s framework — widely cited in AU case-making for teaching-focused pathways; used at UNSW, UQ, Monash.",
        "whyItMatters": "Blueprint for teaching career pathways.",
        "tags": [
          "promotion",
          "framework"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2018"
      },
      {
        "id": "parsons-2012",
        "title": "Parsons et al. (2012) Impact of Teaching Development Programmes (HEA)",
        "url": "https://www.advance-he.ac.uk/",
        "description": "UK sector report on what effective academic development looks like.",
        "whyItMatters": "Evidence base for PD program design.",
        "tags": [
          "UK",
          "evidence",
          "advocacy"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2012"
      },
      {
        "id": "advance-he-promotion",
        "title": "Advance HE Teaching-Focused Academic Promotion Case Studies",
        "url": "https://www.advance-he.ac.uk/knowledge-hub",
        "description": "Worked promotion cases from UK and adopted by AU institutions.",
        "whyItMatters": "Model cases for promotion dossiers.",
        "tags": [
          "promotion",
          "UK",
          "case-studies"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "unsw-sea",
        "title": "UNSW Scientia Education Academy",
        "url": "https://www.education.unsw.edu.au/",
        "description": "Exemplary AU institutional model of education-focused recognition.",
        "whyItMatters": "Benchmark AU recognition model.",
        "tags": [
          "AU",
          "recognition",
          "model"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "monash-mea",
        "title": "Monash Education Academy",
        "url": "https://www.monash.edu/learning-teaching/",
        "description": "Monash’s education-focused academic pathway structure.",
        "whyItMatters": "Another AU institutional exemplar.",
        "tags": [
          "AU",
          "recognition",
          "model"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "psf-2023-advocacy",
        "title": "UK Professional Standards Framework (PSF 2023)",
        "url": "https://www.advance-he.ac.uk/teaching-and-learning/psf",
        "description": "The 2023-revised framework behind Fellowship categories — used in AU through institutional accreditation.",
        "whyItMatters": "Global teaching recognition standard.",
        "tags": [
          "framework",
          "recognition",
          "international"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2023"
      },
      {
        "id": "kirkpatrick",
        "title": "Kirkpatrick’s Four Levels of Training Evaluation",
        "url": "https://www.kirkpatrickpartners.com/",
        "description": "The evaluation framework most often adapted for academic-development impact.",
        "whyItMatters": "Standard PD evaluation model.",
        "tags": [
          "evaluation",
          "framework"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2016"
      },
      {
        "id": "guskey-2014",
        "title": "Guskey (2000, 2014) Evaluating Professional Development",
        "url": "https://us.corwin.com/",
        "description": "Five-level PD evaluation model; directly applicable to SoTL program impact evidence.",
        "whyItMatters": "Alternative to Kirkpatrick for PD evaluation.",
        "tags": [
          "evaluation",
          "framework"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2014"
      },
      {
        "id": "hughes-2018",
        "title": "Hughes (2018) Teaching Quality Indicators at an Australian University",
        "url": "https://doi.org/10.1080/07294360.2017.1389853",
        "description": "Practical AU case study for operationalising SoTL recognition.",
        "whyItMatters": "Real-world AU implementation example.",
        "tags": [
          "AU",
          "case-studies",
          "quality"
        ],
        "access": "paywall",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2018"
      },
      {
        "id": "prebble-2004",
        "title": "Prebble et al. (2004) Impact of Student Support Services (NZ MoE)",
        "url": "https://www.educationcounts.govt.nz/",
        "description": "The classic NZ/AU evidence base academic developers cite when arguing for investment.",
        "whyItMatters": "Cross-Tasman evidence for development impact.",
        "tags": [
          "NZ",
          "evidence",
          "advocacy"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2004"
      },
      {
        "id": "ref-impact-cases",
        "title": "REF 2021 Impact Case Studies Database (UK)",
        "url": "https://results2021.ref.ac.uk/",
        "description": "Searchable library of teaching-impact case studies — use as writing models for AU contexts.",
        "whyItMatters": "Model impact narratives.",
        "tags": [
          "UK",
          "impact",
          "case-studies"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2021"
      },
      {
        "id": "kandlbinder-2013",
        "title": "Kandlbinder (2013) Recognition of University Teaching in Australia",
        "url": "https://www.herdsa.org.au/",
        "description": "AU-specific synthesis of teaching recognition mechanisms.",
        "whyItMatters": "Australian recognition landscape.",
        "tags": [
          "AU",
          "recognition",
          "advocacy"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2013"
      }
    ]
  },
  {
    "id": "impact-altmetrics",
    "title": "Impact, Altmetrics & Identity",
    "icon": "📊",
    "cardFace": "Tools for capturing and demonstrating SoTL impact beyond citation counts — altmetrics, scholar profiles, and post-Twitter academic presence.",
    "tags": [
      "impact",
      "altmetrics",
      "identity",
      "social-media"
    ],
    "resources": [
      {
        "id": "orcid",
        "title": "ORCID",
        "url": "https://orcid.org/",
        "description": "The persistent academic identifier. Non-negotiable; required by most publishers and ARC/NHMRC.",
        "whyItMatters": "Essential academic identity infrastructure.",
        "tags": [
          "identity",
          "essential"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "google-scholar-profile",
        "title": "Google Scholar Profile",
        "url": "https://scholar.google.com/",
        "description": "Citation tracking + profile — the most-checked SoTL impact signal.",
        "whyItMatters": "Default scholarly visibility tool.",
        "tags": [
          "identity",
          "impact"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "altmetric-bookmarklet",
        "title": "Altmetric Bookmarklet",
        "url": "https://www.altmetric.com/products/free-tools/bookmarklet/",
        "description": "Free tool that surfaces attention scores (social, policy, news) for any article.",
        "whyItMatters": "Captures non-citation impact.",
        "tags": [
          "impact",
          "altmetrics"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "plumx",
        "title": "PlumX Metrics",
        "url": "https://plumanalytics.com/learn/about-metrics/",
        "description": "Alternative altmetrics dashboard often integrated into institutional Elsevier deals.",
        "whyItMatters": "Institutional altmetrics option.",
        "tags": [
          "impact",
          "altmetrics"
        ],
        "access": "institutional",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "dimensions",
        "title": "Dimensions",
        "url": "https://app.dimensions.ai/",
        "description": "Free-tier access to a major citation+altmetric database; useful for SoTL landscape reviews.",
        "whyItMatters": "Free research intelligence.",
        "tags": [
          "impact",
          "database"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "openalex",
        "title": "OpenAlex",
        "url": "https://openalex.org/",
        "description": "Fully-open citation graph; excellent for tracking OA SoTL reach.",
        "whyItMatters": "Open alternative to Scopus/WoS.",
        "tags": [
          "impact",
          "open-access"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "bluesky",
        "title": "Bluesky Social — Academic Community",
        "url": "https://bsky.app/",
        "description": "Post-Twitter home for many academics; search starter packs for SoTL, HE, AcDev communities.",
        "whyItMatters": "Active academic networking platform.",
        "tags": [
          "social-media",
          "networking"
        ],
        "access": "free",
        "essential": false,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "linkedin",
        "title": "LinkedIn for Academics",
        "url": "https://www.linkedin.com/",
        "description": "Increasingly the default for senior developer networking and thought-leadership sharing.",
        "whyItMatters": "Professional visibility platform.",
        "tags": [
          "social-media",
          "networking"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "mastodon-scholar",
        "title": "Mastodon — scholar.social",
        "url": "https://scholar.social/",
        "description": "Federated alternative for academics; quieter but stable.",
        "whyItMatters": "Privacy-conscious networking option.",
        "tags": [
          "social-media",
          "networking"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "the-conversation",
        "title": "The Conversation AU",
        "url": "https://theconversation.com/au",
        "description": "Editorial platform for academics to publish public-facing pieces — extremely high reach.",
        "whyItMatters": "Ideal SoTL dissemination to public audiences.",
        "tags": [
          "dissemination",
          "AU",
          "impact"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "kudos",
        "title": "Kudos",
        "url": "https://growkudos.com/",
        "description": "Tools for plain-language summaries and dissemination tracking.",
        "whyItMatters": "Helps explain research to broader audiences.",
        "tags": [
          "dissemination",
          "impact"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "researchgate-note",
        "title": "ResearchGate — Caution Notice",
        "url": "https://www.researchgate.net/",
        "description": "Useful for discovery but has a history of copyright takedowns; prefer institutional repository + ORCID.",
        "whyItMatters": "Use with awareness of copyright risks.",
        "tags": [
          "networking",
          "caution"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "au-sotl-ecosystem",
    "title": "Australian SoTL Ecosystem",
    "icon": "🌏",
    "cardFace": "The Australian infrastructure: HERDSA, CAULLT, CADAD, ALTF, state networks, and the legacy OLT/ALTC archive — with current URLs and access routes.",
    "tags": [
      "AU",
      "ecosystem",
      "networks",
      "essential"
    ],
    "resources": [
      {
        "id": "herdsa",
        "title": "HERDSA",
        "url": "https://www.herdsa.org.au/",
        "description": "Australasian peak scholarly society; journal HERD, ASRHE, annual conference, HERDSA Guides, Fellowship scheme, SIGs.",
        "whyItMatters": "The Australasian home of HE scholarship.",
        "tags": [
          "AU",
          "peak-body",
          "essential"
        ],
        "access": "free",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "herdsa-guides",
        "title": "HERDSA Guides (the ‘Yellow Guides’)",
        "url": "https://www.herdsa.org.au/publications",
        "description": "Short, practical guides on topics like online engagement, feedback, assessment.",
        "whyItMatters": "Developer-workshop gold.",
        "tags": [
          "AU",
          "resources",
          "practical"
        ],
        "access": "member",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "caullt",
        "title": "CAULLT",
        "url": "https://www.caullt.edu.au/",
        "description": "Peak body for directors of L&T/academic development; Executive Development Program; position papers.",
        "whyItMatters": "Leadership network for AU developers.",
        "tags": [
          "AU",
          "peak-body",
          "leadership"
        ],
        "access": "member",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "cadad",
        "title": "CADAD",
        "url": "https://cadad.edu.au/",
        "description": "Council of Australian Directors of Academic Development. Benchmarking reports and capability guidance.",
        "whyItMatters": "Developer-specific AU peak body.",
        "tags": [
          "AU",
          "peak-body"
        ],
        "access": "member",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "altf",
        "title": "ALTF — Australian Learning and Teaching Fellows",
        "url": "https://altf.org/",
        "description": "Network of 108+ ALTC/OLT-era Fellows; Legacy Report compiles fellowship projects; expertise search.",
        "whyItMatters": "Living repository of national teaching expertise.",
        "tags": [
          "AU",
          "network",
          "legacy"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "aautn",
        "title": "AAUTN — Australian Awarded University Teachers Network",
        "url": "https://aautn.edu.au/",
        "description": "Network of AAUT recipients; PD recordings incl. award-writing webinars.",
        "whyItMatters": "Mentoring and recognition support.",
        "tags": [
          "AU",
          "network",
          "awards"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "ltr-edu-au",
        "title": "ltr.edu.au — Learning and Teaching Repository",
        "url": "https://ltr.edu.au/",
        "description": "Successor catalogue for OLT/ALTC project outputs. Searchable VuFind interface.",
        "whyItMatters": "The only live searchable index of OLT/ALTC outputs — a unique NTLSN discovery.",
        "tags": [
          "AU",
          "legacy",
          "archive",
          "essential"
        ],
        "access": "open",
        "essential": true,
        "verified": "2026-04",
        "lastUpdated": "unknown"
      },
      {
        "id": "nla-web-archive",
        "title": "NLA Trove / Australian Government Web Archive",
        "url": "https://webarchive.nla.gov.au/",
        "description": "Captures of old olt.gov.au and altc.edu.au sites — the only way to retrieve some decommissioned project pages.",
        "whyItMatters": "Recovery route for legacy SoTL resources.",
        "tags": [
          "AU",
          "legacy",
          "archive"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "teqsa-guidance",
        "title": "TEQSA Guidance Notes",
        "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes",
        "description": "Current suite of guidance notes relevant to SoTL (course design, WIL, research/coursework nexus).",
        "whyItMatters": "Regulatory framework for quality.",
        "tags": [
          "AU",
          "regulatory",
          "quality"
        ],
        "access": "open",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "acode",
        "title": "ACODE",
        "url": "https://acode.edu.au/",
        "description": "Benchmarks for technology-enhanced learning; LTLI leadership program; MoUs with ASCILITE, CAUL, CAUDIT, CADAD.",
        "whyItMatters": "Digital learning benchmarking leader.",
        "tags": [
          "AU",
          "peak-body",
          "digital"
        ],
        "access": "member",
        "essential": false,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "olt-senior-fellows",
        "title": "National Senior Teaching Fellows Reports",
        "url": "https://ltr.edu.au/",
        "description": "OLT-funded strategic fellowships on national priorities — still influential reference material.",
        "whyItMatters": "National-priority SoTL resources.",
        "tags": [
          "AU",
          "legacy",
          "fellowship"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "state-pens",
        "title": "State-Based Promoting Excellence Networks",
        "url": "https://aautn.edu.au/",
        "description": "SANTPEN, QLD PEN, NSW/ACT PEN, VIC PEN — state-level peer networks for AAUT mentoring and local SoTL events.",
        "whyItMatters": "Local peer support networks.",
        "tags": [
          "AU",
          "network",
          "state"
        ],
        "access": "open",
        "essential": false,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "ako-aotearoa",
        "title": "Ako Aotearoa (NZ)",
        "url": "https://ako.ac.nz/",
        "description": "NZ national centre for tertiary teaching excellence with strong trans-Tasman links.",
        "whyItMatters": "Cross-Tasman SoTL partner.",
        "tags": [
          "NZ",
          "network"
        ],
        "access": "open",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "unisq-learning-futures",
        "title": "UniSQ Learning Futures",
        "url": "https://www.unisq.edu.au/",
        "description": "UniSQ’s own academic-development hub.",
        "whyItMatters": "NTLSN founder institution resources.",
        "tags": [
          "AU",
          "UniSQ"
        ],
        "access": "institutional",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "podcasts-blogs",
    "title": "Podcasts, Blogs & Newsletters",
    "icon": "🎧",
    "cardFace": "Ongoing sector conversation — podcasts, blogs, and newsletters academic developers can subscribe to in 30 seconds to stay current on SoTL and HE practice.",
    "tags": [
      "podcast",
      "blog",
      "newsletter",
      "professional-currency"
    ],
    "resources": [
      {
        "id": "teaching-in-higher-ed",
        "title": "Teaching in Higher Ed (Bonni Stachowiak)",
        "url": "https://teachinginhighered.com/",
        "description": "The most widely-recommended SoTL/academic-development podcast; long-running; interview format.",
        "whyItMatters": "Essential listening for developers.",
        "tags": [
          "podcast"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "tea-for-teaching",
        "title": "Tea for Teaching (SUNY Oswego)",
        "url": "https://teaforteaching.com/",
        "description": "Weekly scholarly-yet-accessible podcast on HE teaching research.",
        "whyItMatters": "Accessible SoTL research discussions.",
        "tags": [
          "podcast"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "dead-ideas",
        "title": "Dead Ideas in Teaching and Learning (Columbia CTL)",
        "url": "https://ctl.columbia.edu/",
        "description": "Short-run, high-production podcast challenging HE orthodoxies.",
        "whyItMatters": "Critical perspectives on teaching assumptions.",
        "tags": [
          "podcast",
          "critical"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "issotl-blog",
        "title": "ISSOTL Blog",
        "url": "https://issotl.com/",
        "description": "Practitioner-researcher reflections; a light-weight route into ISSOTL conversations.",
        "whyItMatters": "Direct connection to global SoTL community.",
        "tags": [
          "blog",
          "international"
        ],
        "access": "free",
        "essential": false,
        "verified": "2026-04",
        "lastUpdated": "2026"
      },
      {
        "id": "advance-he-news",
        "title": "Advance HE News & Podcasts",
        "url": "https://www.advance-he.ac.uk/news-and-views",
        "description": "UK sector updates relevant to AU Advance HE-accredited programs.",
        "whyItMatters": "Fellowship-relevant updates.",
        "tags": [
          "blog",
          "UK",
          "fellowship"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "campus-morning-mail",
        "title": "Campus Morning Mail (Australia)",
        "url": "https://campusmorningmail.com.au/",
        "description": "Daily AU HE sector briefing; indispensable for developers tracking policy.",
        "whyItMatters": "The essential AU HE daily briefing.",
        "tags": [
          "newsletter",
          "AU",
          "essential"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "wonkhe",
        "title": "Wonkhe (UK)",
        "url": "https://wonkhe.com/",
        "description": "Sharp UK HE policy and practice commentary; frequent SoTL posts.",
        "whyItMatters": "International policy perspective.",
        "tags": [
          "blog",
          "UK",
          "policy"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "the-campus",
        "title": "Times Higher Education — Campus",
        "url": "https://www.timeshighereducation.com/campus",
        "description": "THE’s practice-focused platform; open to academic-developer contributions.",
        "whyItMatters": "Practitioner-focused HE writing.",
        "tags": [
          "blog",
          "international"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "ihe-teaching",
        "title": "Inside Higher Ed — Teaching Newsletter",
        "url": "https://www.insidehighered.com/",
        "description": "Weekly US-centric teaching newsletter; often relevant themes.",
        "whyItMatters": "US teaching practice trends.",
        "tags": [
          "newsletter",
          "US"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "conversation-education",
        "title": "The Conversation AU — Education",
        "url": "https://theconversation.com/au/education",
        "description": "AU academics’ public-facing SoTL commentary; strong dissemination channel.",
        "whyItMatters": "Public-facing AU education discourse.",
        "tags": [
          "blog",
          "AU",
          "dissemination"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "elon-cel-blog",
        "title": "Elon Centre for Engaged Learning Blog",
        "url": "https://www.centerforengagedlearning.org/blog/",
        "description": "Evidence-led reflections on engaged-learning SoTL.",
        "whyItMatters": "Thoughtful SoTL practice pieces.",
        "tags": [
          "blog"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "vanderbilt-cft",
        "title": "Vanderbilt CFT Blog + SoTL Guide",
        "url": "https://cft.vanderbilt.edu/guides-sub-pages/sotl/",
        "description": "Still the single most-cited SoTL starter guide online.",
        "whyItMatters": "Go-to recommendation for SoTL beginners.",
        "tags": [
          "blog",
          "guide",
          "essential"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  },
  {
    "id": "oer-tools",
    "title": "OER, Tools & Platforms",
    "icon": "🛠️",
    "cardFace": "Software, repositories, and workflows for conducting and disseminating SoTL — reference management, qualitative analysis, survey tools, and OER hubs.",
    "tags": [
      "tools",
      "OER",
      "workflow",
      "qualitative"
    ],
    "resources": [
      {
        "id": "zotero",
        "title": "Zotero",
        "url": "https://www.zotero.org/",
        "description": "Free, open reference manager — preferred by many AU academic developers; group libraries ideal for SoTL teams.",
        "whyItMatters": "Essential research tool.",
        "tags": [
          "tools",
          "reference-management"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "obsidian-notion",
        "title": "Obsidian / Notion — Knowledge Management",
        "url": "https://obsidian.md/",
        "description": "Personal knowledge bases supporting longitudinal SoTL reflection.",
        "whyItMatters": "Supports reflective practice.",
        "tags": [
          "tools",
          "knowledge-management"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "taguette",
        "title": "Taguette — Open-Source QDA",
        "url": "https://www.taguette.org/",
        "description": "Free, open-source qualitative coding tool; viable alternative to NVivo for small projects.",
        "whyItMatters": "Free qualitative analysis.",
        "tags": [
          "tools",
          "qualitative",
          "open-source"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "nvivo",
        "title": "NVivo (Lumivero)",
        "url": "https://lumivero.com/products/nvivo/",
        "description": "Industry-standard QDA tool; most AU institutions have site licences.",
        "whyItMatters": "Standard qualitative analysis tool.",
        "tags": [
          "tools",
          "qualitative"
        ],
        "access": "institutional",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "redcap",
        "title": "REDCap",
        "url": "https://projectredcap.org/",
        "description": "Research-ethics-compliant survey tool; widely available via AU institutional deployments.",
        "whyItMatters": "Ethics-approved data collection.",
        "tags": [
          "tools",
          "survey",
          "ethics"
        ],
        "access": "institutional",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "qualtrics",
        "title": "Qualtrics",
        "url": "https://www.qualtrics.com/",
        "description": "Enterprise survey platform — most AU universities hold site licences.",
        "whyItMatters": "Standard institutional survey tool.",
        "tags": [
          "tools",
          "survey"
        ],
        "access": "institutional",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "osf",
        "title": "Open Science Framework (OSF)",
        "url": "https://osf.io/",
        "description": "Hosts project workflows, preregistrations, and preprints (inc. EdArXiv). CC-licensed by default.",
        "whyItMatters": "Open science infrastructure.",
        "tags": [
          "tools",
          "open-science",
          "repository"
        ],
        "access": "free",
        "essential": true,
        "verified": "needs-check",
        "lastUpdated": "2026"
      },
      {
        "id": "oer-commons",
        "title": "OER Commons",
        "url": "https://www.oercommons.org/",
        "description": "Curated open educational resources collections; SoTL and higher-education filters.",
        "whyItMatters": "OER discovery platform.",
        "tags": [
          "OER",
          "resources"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "merlot",
        "title": "MERLOT",
        "url": "https://www.merlot.org/",
        "description": "Long-running peer-reviewed OER collection across disciplines.",
        "whyItMatters": "Peer-reviewed OER.",
        "tags": [
          "OER",
          "resources"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "openlearn",
        "title": "OpenLearn (Open University UK)",
        "url": "https://www.open.edu/openlearn/",
        "description": "Free short courses relevant to developer upskilling in pedagogy, research methods.",
        "whyItMatters": "Free PD for developers.",
        "tags": [
          "OER",
          "courses"
        ],
        "access": "free",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "pressbooks",
        "title": "Pressbooks — Open Textbook Publishing",
        "url": "https://pressbooks.com/",
        "description": "Platform for developers co-authoring open textbooks with academics (major SoTL dissemination route).",
        "whyItMatters": "Open textbook creation.",
        "tags": [
          "OER",
          "publishing",
          "tools"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      },
      {
        "id": "engagement-tools",
        "title": "Padlet / Mentimeter / Slido",
        "url": "https://padlet.com/",
        "description": "Engagement tools for conference and showcase presentations.",
        "whyItMatters": "Interactive presentation tools.",
        "tags": [
          "tools",
          "presentation",
          "engagement"
        ],
        "access": "freemium",
        "essential": false,
        "verified": "needs-check",
        "lastUpdated": "unknown"
      }
    ]
  }
];

/**
 * Production's filter, verbatim: resources narrowed by access, the
 * essential-only toggle and the search (title/description/tags); collections
 * left with no matching resources drop out.
 */
export function filterCollections(
  query: string,
  access: "All" | ResourceAccess,
  essentialOnly: boolean,
): HubCollection[] {
  const q = query.trim().toLowerCase();
  return HUB_COLLECTIONS.map((c) => ({
    ...c,
    resources: c.resources.filter((r) => {
      if (access !== "All" && r.access !== access) return false;
      if (essentialOnly && !r.essential) return false;
      if (q) {
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    }),
  })).filter((c) => c.resources.length > 0);
}
