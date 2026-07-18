/**
 * The free-tools directory behind #ntlsn-trynow (Epic 1.2 PR-D) — every
 * tool card, category, "Start here" pick and "Today in teaching & learning"
 * rotation, verbatim from the production ntlsn-trynow-script and
 * ntlsn-todaycard-script patches (HTML entities decoded once, here, so React
 * text nodes render them correctly).
 *
 * The tool links are root-relative .html pages that survive the §1.3
 * cutover unchanged — do NOT rewrite them to routes. The
 * ntlsn-toolsearch-script patch added a second, redundant filter box on top
 * of this section's own search; its behaviour (live text filter + "no tools
 * match" empty state) is folded into the single search here.
 */

export interface Tool {
  /** Emoji icon. */
  i: string;
  /** Tool name. */
  n: string;
  /** One-line description. */
  d: string;
  /** Root-relative URL of the free tool page. */
  u: string;
  /** Badge: "New", "Reference", "Prototype" or "" for none. */
  t: string;
}

export const TRYNOW_TOOLS: readonly Tool[] = [
  {
    "i": "🩺",
    "n": "The NTLSN Teaching Diagnostic",
    "d": "One review across alignment, assessment, accessibility, partnership, quality, SoTL & recognition — for a unit, course or whole program — routing you to the right tool for each gap.",
    "u": "/diagnostic.html",
    "t": "New"
  },
  {
    "i": "🤖",
    "n": "GenAI Assignment Redesign",
    "d": "Paste an assignment — see where AI could do the work, and get concrete moves to make it authentically human.",
    "u": "/assignment-redesign.html",
    "t": "New"
  },
  {
    "i": "✨",
    "n": "AI Prompts for Teaching",
    "d": "A copy-paste prompt library for teaching & SoTL — assessment, alignment, feedback, reflection & portfolios. Use with any AI.",
    "u": "/teaching-ai-prompts.html",
    "t": "New"
  },
  {
    "i": "🎬",
    "n": "Learn from the Sector",
    "d": "Self-paced modules from the sector’s talks — watch, check, read & reflect, track progress. Export any to your LMS as SCORM.",
    "u": "/learning-modules.html",
    "t": "New"
  },
  {
    "i": "🧭",
    "n": "T&L Leadership Pathway",
    "d": "Self-assess six evidence-based leadership capabilities (Scott et al., ALTC) — get a development pathway from coordinator to Associate Dean to sector leader.",
    "u": "/leadership.html",
    "t": "New"
  },
  {
    "i": "⏪",
    "n": "Missed it? Catch up",
    "d": "Recordings, programs & slides from recently-passed sector workshops, webinars & conferences — we point you to where organisers posted them.",
    "u": "/missed-it.html",
    "t": "New"
  },
  {
    "i": "🏫",
    "n": "School T&L Leadership Check",
    "d": "A maturity self-check for Heads of School & ADEs — rate your school’s collective T&L leadership & culture across 7 dimensions, get a prioritised plan.",
    "u": "/school-leadership.html",
    "t": "New"
  },
  {
    "i": "🫶",
    "n": "Casual Teaching Starter Kit",
    "d": "The induction casual & sessional academics should get — first class, marking fairly, feedback, integrity & AI, your rights & pay, with checklists.",
    "u": "/casual-teaching.html",
    "t": "New"
  },
  {
    "i": "📅",
    "n": "Your Academic Year",
    "d": "Set your semester start — get your teaching year as a rhythm (prep, teaching, the breather, the marking crunch) with the right support at each phase.",
    "u": "/academic-year.html",
    "t": "New"
  },
  {
    "i": "🗓️",
    "n": "Active-Learning Session Planner",
    "d": "Turn a class into a minute-by-minute run-sheet — chunks, active moves, a mid-point check.",
    "u": "/session-planner.html",
    "t": "New"
  },
  {
    "i": "📐",
    "n": "ATEC · TEQSA Curriculum QA",
    "d": "Self-check a course against AQF levels, ATEC mission compacts & GenAI-resilience — before it reaches committee.",
    "u": "/atec-curriculum-qa.html",
    "t": "New"
  },
  {
    "i": "🔬",
    "n": "Live SoTL Research Search",
    "d": "Search current teaching & learning research live from OpenAlex (250M+ open works) — the living edge beside the archive.",
    "u": "/research-search.html",
    "t": "New"
  },
  {
    "i": "🎯",
    "n": "Find Your SoTL Conference",
    "d": "Answer three questions — interest, format & timing — and get matched to the right event from the live sector calendar.",
    "u": "/conference-finder.html",
    "t": "New"
  },
  {
    "i": "🔓",
    "n": "Open-Access Finder",
    "d": "Paste any DOI or reference list — get the free, legal open version of each paper, colour-coded by how open it is.",
    "u": "/oa-finder.html",
    "t": "New"
  },
  {
    "i": "✍️",
    "n": "Where to Publish Your SoTL",
    "d": "Find the open-access journal for your teaching scholarship — filtered to the ones that are free to publish in (diamond OA), with author guidelines.",
    "u": "/journal-finder.html",
    "t": "New"
  },
  {
    "i": "📋",
    "n": "Participant Info & Consent Builder",
    "d": "Draft the participant statement & consent form your SoTL study needs for ethics.",
    "u": "/consent-builder.html",
    "t": "New"
  },
  {
    "i": "🧭",
    "n": "Tailored Teaching Induction",
    "d": "A custom onboarding checklist for new staff — by uni type, cohort and delivery mode.",
    "u": "/induction-builder.html",
    "t": "New"
  },
  {
    "i": "👥",
    "n": "Group-Work Designer",
    "d": "Design fair, free-rider-resistant team assessment — mark split, peer factor, scaffolding.",
    "u": "/group-work.html",
    "t": "New"
  },
  {
    "i": "🔁",
    "n": "Feedback → Action Plan",
    "d": "Turn student-survey themes into concrete actions and a ‘you said / we did’ line.",
    "u": "/feedback-action.html",
    "t": "New"
  },
  {
    "i": "🚦",
    "n": "Unit AI-Use Policy Builder",
    "d": "Set a GenAI level per assessment — get a clear student-facing policy to paste in.",
    "u": "/ai-policy.html",
    "t": "New"
  },
  {
    "i": "📐",
    "n": "Test Blueprint",
    "d": "Check your exam covers outcomes at the right Bloom levels — not just recall.",
    "u": "/test-blueprint.html",
    "t": "New"
  },
  {
    "i": "🗣️",
    "n": "Viva / Oral Question Generator",
    "d": "AI-resilient oral-exam prompts — warm-up, authenticity probes, understanding, transfer.",
    "u": "/viva.html",
    "t": "New"
  },
  {
    "i": "📐",
    "n": "AUTC Teaching Criteria Self-Check",
    "d": "Map your evidence to the 7 Australian teaching criteria at your level (A–E).",
    "u": "/autc-criteria.html",
    "t": "New"
  },
  {
    "i": "🎖️",
    "n": "Teaching Promotion Case Builder",
    "d": "Assemble your case across the 7 criteria — claim, evidence, impact, by level.",
    "u": "/promotion-case.html",
    "t": "New"
  },
  {
    "i": "💰",
    "n": "SoTL Grant Pitch Builder",
    "d": "Turn a teaching idea into a fundable pitch — problem, aim, evaluation, dissemination.",
    "u": "/grant-pitch.html",
    "t": "New"
  },
  {
    "i": "🏛️",
    "n": "Program Review Readiness",
    "d": "Get a whole degree review- or accreditation-ready across 9 dimensions.",
    "u": "/program-review.html",
    "t": "New"
  },
  {
    "i": "🤝",
    "n": "Partnership Agreement Builder",
    "d": "Draft a staff–student charter that shares power and names how the student is recognised.",
    "u": "/partnership-agreement.html",
    "t": "New"
  },
  {
    "i": "🧩",
    "n": "Thematic Analysis Starter",
    "d": "Code qualitative data into a codebook + themes — with a Braun & Clarke methods paragraph.",
    "u": "/thematic-analysis.html",
    "t": "New"
  },
  {
    "i": "🌐",
    "n": "World Teaching Hubs",
    "d": "28 verified links to the world’s best teaching centres — CAST/UDL, ADCET, Harvard, Stanford…",
    "u": "/teaching-hubs.html",
    "t": "New"
  },
  {
    "i": "🫧",
    "n": "Find Your SoTL Path",
    "d": "Tap a few bubbles — interests, field, goals — and see exactly where to plug into NTLSN.",
    "u": "/find-your-path.html",
    "t": "New"
  },
  {
    "i": "🎓",
    "n": "Microcredential Designer",
    "d": "Scope a stackable micro-credential — outcomes, hours, assessment, quality markers.",
    "u": "/microcredential.html",
    "t": "New"
  },
  {
    "i": "🔘",
    "n": "MCQ Quality Checker",
    "d": "Flags negative stems, all-of-the-above, cueing & recall-only multiple-choice flaws.",
    "u": "/mcq-checker.html",
    "t": "New"
  },
  {
    "i": "💬",
    "n": "Feedback & Feedforward Builder",
    "d": "Student feedback they can act on — specific, criteria-linked, forward-looking.",
    "u": "/feedback-builder.html",
    "t": "New"
  },
  {
    "i": "📓",
    "n": "Reflective Practice Prompt",
    "d": "A teaching moment + a model (Gibbs/Rolfe/Brookfield) into prompts to write against.",
    "u": "/reflective-prompt.html",
    "t": "New"
  },
  {
    "i": "❓",
    "n": "Research-Question Framer",
    "d": "Turn a teaching problem into a sharp, researchable SoTL question + method.",
    "u": "/research-question.html",
    "t": "New"
  },
  {
    "i": "👥",
    "n": "CoP Starter Kit",
    "d": "Start a teaching Community of Practice — purpose, norms, first agenda, rhythm.",
    "u": "/cop-starter.html",
    "t": "New"
  },
  {
    "i": "🔢",
    "n": "Survey Sample-Size Calculator",
    "d": "How many responses you need — or the margin of error on what you have.",
    "u": "/sample-size.html",
    "t": "New"
  },
  {
    "i": "⚖️",
    "n": "SoTL Ethics-Readiness Self-Check",
    "d": "Negligible, low or higher risk — and what to prep before HREC.",
    "u": "/ethics-check.html",
    "t": "New"
  },
  {
    "i": "📋",
    "n": "Survey & Likert Checker",
    "d": "Paste survey items — flags double-barrelled, leading, vague & biased questions.",
    "u": "/survey-checker.html",
    "t": "New"
  },
  {
    "i": "📄",
    "n": "SoTL Abstract Builder",
    "d": "Five guided moves — assembles your abstract, counts words, checks the parts.",
    "u": "/abstract-builder.html",
    "t": "New"
  },
  {
    "i": "✅",
    "n": "Accessibility Pre-flight",
    "d": "A 10-point check for slides, PDFs & LMS pages — tick, score, get the how-to.",
    "u": "/accessibility-preflight.html",
    "t": "New"
  },
  {
    "i": "🖼️",
    "n": "Alt-text Helper",
    "d": "Write accessible image descriptions — role-based guidance + live length check.",
    "u": "/alt-text-helper.html",
    "t": "New"
  },
  {
    "i": "📝",
    "n": "AI-Use Disclosure Generator",
    "d": "Generate an honest statement of how you used AI — assessments, papers, applications.",
    "u": "/ai-disclosure.html",
    "t": "New"
  },
  {
    "i": "🌗",
    "n": "Colour Contrast Checker",
    "d": "WCAG 2.1 contrast ratio for any text/background — AA & AAA pass/fail, live preview.",
    "u": "/contrast-checker.html",
    "t": "New"
  },
  {
    "i": "🧩",
    "n": "Open Building Blocks",
    "d": "Licence-cleared CC resources you can embed, link or adapt — each with its exact licence — plus a video-embed code generator.",
    "u": "/open-building-blocks.html",
    "t": "New"
  },
  {
    "i": "📖",
    "n": "Readability & Cognitive-Load Check",
    "d": "Paste an assessment brief — instant reading-ease, grade level and load flags.",
    "u": "/readability.html",
    "t": "New"
  },
  {
    "i": "🎯",
    "n": "Learning Outcome Check",
    "d": "Bloom’s level and measurable-verb check for your learning outcomes.",
    "u": "/outcomes.html",
    "t": "New"
  },
  {
    "i": "⏱️",
    "n": "Student Workload Estimator",
    "d": "Estimate a unit’s real student hours against its nominal target.",
    "u": "/workload.html",
    "t": "New"
  },
  {
    "i": "✍️",
    "n": "Marking-Load Estimator",
    "d": "Estimate real marking hours by cohort, assessments and moderation.",
    "u": "/grading.html",
    "t": "New"
  },
  {
    "i": "📋",
    "n": "Peer Observation of Teaching",
    "d": "A developmental observation record to fill and keep — portable evidence.",
    "u": "/peer-observation.html",
    "t": "New"
  },
  {
    "i": "📐",
    "n": "Rubric Builder",
    "d": "Build a criterion-referenced rubric and save it as a PDF.",
    "u": "/rubric.html",
    "t": "New"
  },
  {
    "i": "🛡️",
    "n": "Assessment Mix & AI-Resilience",
    "d": "See your assessment variety and how exposed the marks are to GenAI.",
    "u": "/assessment-mix.html",
    "t": "New"
  },
  {
    "i": "📚",
    "n": "APA 7 Reference Formatter",
    "d": "Turn source details into a formatted APA 7 reference.",
    "u": "/citation.html",
    "t": "New"
  },
  {
    "i": "📊",
    "n": "Course Quality Self-Check",
    "d": "Map a unit to QM, PSF 2023, TEQSA HESF, QILT, JISC & the Accord — coverage and next steps.",
    "u": "/course-quality.html",
    "t": "New"
  },
  {
    "i": "🔗",
    "n": "Constructive Alignment Matrix",
    "d": "Map outcomes ↔ assessment ↔ activities and catch what’s un-assessed, never taught, or evidencing nothing.",
    "u": "/constructive-alignment.html",
    "t": "New"
  },
  {
    "i": "🪜",
    "n": "Programme Curriculum Map (I-D-A)",
    "d": "Map a whole degree — where each outcome is Introduced, Developed & Assured — and catch outcomes never assessed.",
    "u": "/programme-map.html",
    "t": "New"
  },
  {
    "i": "🧮",
    "n": "TELAS & UDL Readiness",
    "d": "Score an online unit against TELAS and Universal Design for Learning.",
    "u": "/selfcheck.html",
    "t": ""
  },
  {
    "i": "🤖",
    "n": "TEQSA Gen AI Readiness",
    "d": "Self-assess an assessment against the GenAI guidance principles.",
    "u": "/teqsa-readiness.html",
    "t": ""
  },
  {
    "i": "🎖️",
    "n": "Teaching Recognition Passport",
    "d": "Build a portable record of your teaching recognition to keep.",
    "u": "/trp.html",
    "t": ""
  },
  {
    "i": "🗺️",
    "n": "Recognition Navigator",
    "d": "Not sure where to start? Tell us your goal — we’ll point you to the right self-check.",
    "u": "/recognition-navigator.html",
    "t": "New"
  },
  {
    "i": "🏅",
    "n": "Recognition Points Calculator",
    "d": "Map your teaching, scholarship, fellowship & leadership into a recognition profile and tier.",
    "u": "/recognition-points.html",
    "t": "New"
  },
  {
    "i": "🎓",
    "n": "Fellowship Category Mapper",
    "d": "Which HEA fellowship category fits — AFHEA, FHEA, SFHEA or PFHEA? Based on the PSF 2023.",
    "u": "/fellowship-mapper.html",
    "t": "New"
  },
  {
    "i": "🗂️",
    "n": "PSF 2023 Evidence Self-Audit",
    "d": "Map your evidence across the 15 PSF Dimensions and find where it’s thin before you write.",
    "u": "/psf-evidence-audit.html",
    "t": "New"
  },
  {
    "i": "🏆",
    "n": "AAUT Award-Readiness",
    "d": "Which national teaching-award pathway fits — and how ready are you?",
    "u": "/aaut-readiness.html",
    "t": "New"
  },
  {
    "i": "🔬",
    "n": "SoTL Self-Placement",
    "d": "Where are you on the scholarship-of-teaching journey, from curious to leading?",
    "u": "/sotl-placement.html",
    "t": "New"
  },
  {
    "i": "✒️",
    "n": "Teaching Philosophy & Narrative Builder",
    "d": "Draft the reflective narrative every fellowship, award & promotion case needs — your words, structured to the PSF.",
    "u": "/philosophy-builder.html",
    "t": "New"
  },
  {
    "i": "🧩",
    "n": "Evidence Cross-Walk",
    "d": "Tick the evidence you hold — see how it counts across fellowship, awards, promotion & SoTL at once.",
    "u": "/evidence-crosswalk.html",
    "t": "New"
  },
  {
    "i": "🪪",
    "n": "Sessional & Casual Recognition",
    "d": "Log the real teaching work casual staff do, build RPL hours, and keep a portable record that follows you.",
    "u": "/sessional-recognition.html",
    "t": "New"
  },
  {
    "i": "💹",
    "n": "Recognition ROI Calculator",
    "d": "Model the retention payback of a recognition scheme — the one-page business case for a DVC.",
    "u": "/recognition-roi.html",
    "t": "New"
  },
  {
    "i": "⚖️",
    "n": "Recognition Credit Framework",
    "d": "The open, versioned model behind the points — what each contribution is worth, its RPL hours, and its provenance.",
    "u": "/recognition-framework.html",
    "t": "Reference"
  },
  {
    "i": "🪙",
    "n": "Portable Recognition Ledger",
    "d": "Export your recognition as a standards-based Open Badges 3.0 credential file you own — portable, not crypto.",
    "u": "/recognition-ledger.html",
    "t": "New"
  },
  {
    "i": "🔎",
    "n": "Credential Checker",
    "d": "Read any Open Badges / Verifiable Credential file: its achievements, alignments, and whether it’s signed or self-asserted.",
    "u": "/credential-checker.html",
    "t": "New"
  },
  {
    "i": "📜",
    "n": "Students-as-Partners Certificate",
    "d": "Generate a partnership certificate, print-ready, in your browser.",
    "u": "/cert.html",
    "t": ""
  },
  {
    "i": "🤝",
    "n": "Student-Partner Contribution Record",
    "d": "Students who partner with staff deserve recognition too — record the work, capabilities & reflection, and keep it.",
    "u": "/student-partnership.html",
    "t": "New"
  },
  {
    "i": "🧭",
    "n": "School Needs Diagnostic",
    "d": "Map a team’s development needs to the right NTLSN tools.",
    "u": "/school-needs-diagnostic.html",
    "t": "Prototype"
  },
  {
    "i": "🪞",
    "n": "Reflective Coach",
    "d": "Structured reflective prompts for your own teaching practice.",
    "u": "/reflective-coach.html",
    "t": "Prototype"
  },
  {
    "i": "🤝",
    "n": "Peer-Review Exchange",
    "d": "Review one, get one — get matched with a colleague at another university for cross-institution, developmental peer review of teaching.",
    "u": "/peer-review-exchange.html",
    "t": "New"
  },
  {
    "i": "🎚️",
    "n": "Calibration Suite",
    "d": "Run the calibration ritual before marking starts — everyone scores the same sample, see the spread, talk until it closes.",
    "u": "/calibration-suite.html",
    "t": "New"
  },
  {
    "i": "🛡️",
    "n": "GenAI Assessment-Readiness",
    "d": "Rate a unit’s exposure to generative AI and get a prioritised, practical plan to make its assessment AI-resilient.",
    "u": "/genai-readiness.html",
    "t": "New"
  },
  {
    "i": "📝",
    "n": "Narrative CV Builder",
    "d": "Write the DORA-aligned narrative CV — the alternative to the publication-list CV — around your teaching scholarship.",
    "u": "/narrative-cv.html",
    "t": "New"
  },
  {
    "i": "📚",
    "n": "Publication Profile",
    "d": "See your open research footprint by journal quartile — a DORA-aware view of where your work actually lands.",
    "u": "/publication-profile.html",
    "t": "New"
  },
  {
    "i": "🎯",
    "n": "Learning Outcome Builder",
    "d": "Write clear, measurable learning outcomes at the right Bloom’s level — verbs, alignment and all.",
    "u": "/outcome-builder.html",
    "t": "New"
  },
  {
    "i": "📖",
    "n": "Reading-Load Calculator",
    "d": "Estimate how long your set readings really take students — and rebalance before week one.",
    "u": "/reading-load.html",
    "t": "New"
  },
  {
    "i": "📆",
    "n": "Assessment Spread Planner",
    "d": "Map your assessment across the semester — spot the bunching and the marking crunch before students hit it.",
    "u": "/assessment-spread.html",
    "t": "New"
  },
  {
    "i": "🏫",
    "n": "School Health & Alignment Audit",
    "d": "A school-level self-audit of teaching health and alignment — where your School is strong, and where to focus.",
    "u": "/school-audit.html",
    "t": "New"
  },
  {
    "i": "👀",
    "n": "Peer Review of Teaching Template",
    "d": "A structured, fillable peer-review-of-teaching template — developmental and strengths-based, ready to use.",
    "u": "/peer-review-teaching.html",
    "t": "New"
  }
];

export interface ToolCategory {
  /** Emoji for the category chip. */
  e: string;
  label: string;
  /** Tool URLs in this category (order preserved from production). */
  urls: readonly string[];
}

export const TOOL_CATEGORIES: readonly ToolCategory[] = [
  {
    "e": "🛡️",
    "label": "Assessment & GenAI",
    "urls": [
      "/teaching-ai-prompts.html",
      "/assignment-redesign.html",
      "/assessment-mix.html",
      "/teqsa-readiness.html",
      "/rubric.html",
      "/grading.html",
      "/citation.html",
      "/ai-disclosure.html",
      "/feedback-builder.html",
      "/mcq-checker.html",
      "/group-work.html",
      "/ai-policy.html",
      "/test-blueprint.html",
      "/viva.html",
      "/assessment-spread.html"
    ]
  },
  {
    "e": "🪜",
    "label": "Curriculum & outcomes",
    "urls": [
      "/academic-year.html",
      "/readability.html",
      "/outcomes.html",
      "/workload.html",
      "/constructive-alignment.html",
      "/programme-map.html",
      "/microcredential.html",
      "/session-planner.html",
      "/outcome-builder.html",
      "/reading-load.html"
    ]
  },
  {
    "e": "📊",
    "label": "Quality & standards",
    "urls": [
      "/casual-teaching.html",
      "/school-leadership.html",
      "/course-quality.html",
      "/selfcheck.html",
      "/peer-observation.html",
      "/school-needs-diagnostic.html",
      "/contrast-checker.html",
      "/alt-text-helper.html",
      "/accessibility-preflight.html",
      "/induction-builder.html",
      "/program-review.html",
      "/school-audit.html",
      "/peer-review-teaching.html"
    ]
  },
  {
    "e": "🔬",
    "label": "SoTL & research",
    "urls": [
      "/survey-checker.html",
      "/abstract-builder.html",
      "/sample-size.html",
      "/ethics-check.html",
      "/research-question.html",
      "/reflective-prompt.html",
      "/consent-builder.html",
      "/feedback-action.html",
      "/grant-pitch.html",
      "/thematic-analysis.html",
      "/publication-profile.html"
    ]
  },
  {
    "e": "🎖️",
    "label": "Recognition & fellowship",
    "urls": [
      "/leadership.html",
      "/recognition-navigator.html",
      "/recognition-points.html",
      "/fellowship-mapper.html",
      "/psf-evidence-audit.html",
      "/aaut-readiness.html",
      "/trp.html",
      "/sotl-placement.html",
      "/philosophy-builder.html",
      "/evidence-crosswalk.html",
      "/sessional-recognition.html",
      "/recognition-roi.html",
      "/recognition-framework.html",
      "/recognition-ledger.html",
      "/credential-checker.html",
      "/autc-criteria.html",
      "/promotion-case.html",
      "/narrative-cv.html"
    ]
  },
  {
    "e": "🤝",
    "label": "Partnership & open resources",
    "urls": [
      "/cert.html",
      "/student-partnership.html",
      "/reflective-coach.html",
      "/open-building-blocks.html",
      "/cop-starter.html",
      "/find-your-path.html",
      "/partnership-agreement.html",
      "/teaching-hubs.html"
    ]
  }
];

/** The "Start here" tab — production's POP list, in order. */
export const POPULAR_TOOL_URLS: readonly string[] = [
  "/academic-year.html",
  "/casual-teaching.html",
  "/school-leadership.html",
  "/missed-it.html",
  "/leadership.html",
  "/learning-modules.html",
  "/diagnostic.html",
  "/rubric.html",
  "/assessment-mix.html",
  "/constructive-alignment.html",
  "/course-quality.html",
  "/research-search.html",
  "/recognition-navigator.html",
  "/conference-finder.html",
  "/reflective-coach.html"
];

/**
 * "Today in teaching & learning" daily rotation (ntlsn-todaycard-script).
 * Entries without a link are standalone tips. The archive-count line is
 * derived at runtime (see TryNowSection) instead of production's hardcoded
 * "1,431".
 */
export interface TodayItem {
  t: string;
  u?: string;
  /** Link caption ("Open {c} →"). */
  c?: string;
}

export const TODAY_ITEMS: readonly TodayItem[] = [
  {
    "t": "Turn a class into a timed active-learning run-sheet.",
    "u": "/session-planner.html",
    "c": "the Session Planner"
  },
  {
    "t": "Attention sags after ~12 minutes — build in an active move before then."
  },
  {
    "t": "1,431 sector-funded works, all free to search — no login."
  },
  {
    "t": "Map your evidence to the AdvanceHE fellowship categories.",
    "u": "/fellowship-mapper.html",
    "c": "the Fellowship Mapper"
  },
  {
    "t": "Close the feedback loop: a ‘you said / we did’ line lifts trust and response rates.",
    "u": "/feedback-action.html",
    "c": "Feedback → Action"
  },
  {
    "t": "Check your exam asks students to think, not just recall.",
    "u": "/test-blueprint.html",
    "c": "the Test Blueprint"
  },
  {
    "t": "One short oral question can verify authorship better than any AI-detector.",
    "u": "/viva.html",
    "c": "the Viva Generator"
  },
  {
    "t": "Draft a unit AI-use policy your students can actually follow.",
    "u": "/ai-policy.html",
    "c": "the AI-Policy Builder"
  },
  {
    "t": "Self-check your teaching against the 7 Australian criteria.",
    "u": "/autc-criteria.html",
    "c": "the AUTC Self-Check"
  },
  {
    "t": "The strongest promotion cases triangulate: student data + peer review + reflection.",
    "u": "/promotion-case.html",
    "c": "the Promotion Case Builder"
  },
  {
    "t": "Design fair, free-rider-resistant group work.",
    "u": "/group-work.html",
    "c": "the Group-Work Designer"
  },
  {
    "t": "A theme is a pattern with a point — not just a topic bucket.",
    "u": "/thematic-analysis.html",
    "c": "Thematic Analysis"
  },
  {
    "t": "Recognition is what separates partnership from unpaid help — name it up front.",
    "u": "/partnership-agreement.html",
    "c": "the Partnership Charter"
  },
  {
    "t": "Everything here is free, open-source, and owned by no one."
  }
];
