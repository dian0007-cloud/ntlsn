/**
 * #ntlsn-waystogrow — "Not just PD. Ways to grow." directory (Epic 1.2
 * PR-D), verbatim from the production ntlsn-waystogrow-script patch: an
 * open directory of independent professional learning. The non-affiliation
 * disclaimer is load-bearing (these organisations do not endorse NTLSN) —
 * never drop it.
 */

export type GrowType = "cop" | "fellow" | "program" | "toolkit";

/** [filter key, chip label] — "all" plus the four types. */
export const GROW_FILTERS: ReadonlyArray<readonly [string, string]> = [
  [
    "all",
    "All"
  ],
  [
    "cop",
    "Communities of practice"
  ],
  [
    "fellow",
    "Fellowships"
  ],
  [
    "program",
    "Programs"
  ],
  [
    "toolkit",
    "Toolkits"
  ]
];

export const GROW_TYPE_LABELS: Record<GrowType, string> = {
  cop: "Community",
  fellow: "Fellowship",
  program: "Program",
  toolkit: "Toolkit",
};

/** [type, name, org kind, description, url, licence ("" = none shown)] */
export type GrowEntry = readonly [
  GrowType,
  string,
  string,
  string,
  string,
  string,
];

export const GROW_ENTRIES: readonly GrowEntry[] = [
  [
    "cop",
    "HERDSA",
    "Peak body",
    "Higher education research, development and teaching across Australasia.",
    "https://herdsa.org.au",
    ""
  ],
  [
    "cop",
    "ASCILITE",
    "Peak body",
    "Technology in tertiary learning and teaching: research, community, conference.",
    "https://ascilite.org",
    ""
  ],
  [
    "cop",
    "ACODE",
    "Peak body",
    "Open and digital education leaders across Australasia.",
    "https://acode.edu.au",
    ""
  ],
  [
    "cop",
    "CAULLT",
    "Peak body",
    "Leaders in university learning, teaching and academic development.",
    "https://caullt.edu.au",
    ""
  ],
  [
    "cop",
    "ISSOTL",
    "International society",
    "The scholarship of teaching and learning as serious intellectual work.",
    "https://issotl.com",
    ""
  ],
  [
    "fellow",
    "Advance HE Fellowships",
    "Advance HE",
    "International teaching recognition, from Associate to Principal Fellow.",
    "https://www.advance-he.ac.uk",
    ""
  ],
  [
    "program",
    "GitHub Education Teacher Training",
    "GitHub",
    "Free, self-paced training to use version control with your students.",
    "https://github.com/github-campus-advisors/Campus-Advisor-Training",
    "MIT"
  ],
  [
    "program",
    "GitHub Campus Advisors",
    "GitHub",
    "A community of educator-leaders, with PD support and conference invitations.",
    "https://education.github.com/advisors",
    ""
  ],
  [
    "toolkit",
    "Assessment Design Engine",
    "CloudPedagogy",
    "Design coherent, AI-aware assessment aligned to outcomes.",
    "https://github.com/cloudpedagogy/cloudpedagogy-assessment-design-engine",
    "MIT"
  ],
  [
    "toolkit",
    "Evidence & QA Pack Generator",
    "CloudPedagogy",
    "Turn your designs into governance-ready evidence packs.",
    "https://github.com/cloudpedagogy/cloudpedagogy-evidence-pack-generator",
    "MIT"
  ],
  [
    "toolkit",
    "Education Agent Skills",
    "Gareth Manning",
    "165 evidence-based pedagogy skills for AI agents.",
    "https://github.com/GarethManning/education-agent-skills",
    "CC BY-SA 4.0"
  ],
  [
    "toolkit",
    "Curricualized",
    "Jake Kaupp",
    "A method for visualising curriculum mapping.",
    "https://github.com/jkaupp/curricualized",
    ""
  ],
  [
    "toolkit",
    "Classroom Export Utility",
    "GitHub Education",
    "Rescue and back up your classroom data when platforms change.",
    "https://github.com/github-education-resources/classroom-export-utility",
    "MIT"
  ],
  [
    "cop",
    "ICED",
    "International consortium",
    "A global network of national educational-development networks; publishes the International Journal for Academic Development.",
    "https://icedonline.net",
    ""
  ],
  [
    "cop",
    "SEDA",
    "UK association",
    "The UK professional association for staff and educational developers: accredited professional development and fellowships.",
    "https://www.seda.ac.uk",
    ""
  ],
  [
    "cop",
    "POD Network",
    "US association",
    "Professional and organisational development in higher education: a large US community of teaching-centre practitioners since 1975.",
    "https://podnetwork.org",
    ""
  ],
  [
    "cop",
    "EuroSoTL",
    "European network",
    "The European network and conference for the scholarship of teaching and learning across disciplines.",
    "https://eurosotl.org",
    ""
  ],
  [
    "cop",
    "ALTF",
    "Australian network",
    "Australian Learning and Teaching Fellows: a network of national fellows advancing teaching across Australian higher education.",
    "https://altf.org",
    ""
  ]
];
