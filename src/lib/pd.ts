/**
 * Professional-development directory for #pd ("What are you looking for?") —
 * the 73-entry opportunities list extracted verbatim from the production
 * bundle (assets/app.b38bc4ca.js, the `Ia` array literal). This is curated
 * site content hard-coded in the bundle, not data-layer material (CLAUDE.md:
 * data/*.json holds institutions + events only), so it lives here in source
 * until a curator moves it into the data layer.
 *
 * NOTE the header copy in production says "59 ways to grow" — stale against
 * these 73 entries. The component derives the count from
 * PD_OPPORTUNITIES.length instead of copying the stale number.
 */

export interface PdOpportunity {
  provider: string;
  name: string;
  /** Format, e.g. "Fellowship", "Community", "Webinar" (Step 1 chips). */
  type: string;
  timing: string;
  cost: string;
  desc: string;
  url: string;
  /** Lens, e.g. "Peak Body", "Regulator" (Step 2 chips). */
  cat: string;
}

/** Step 1 · "Pick what you're after" — label → type value, production's list. */
export const PD_TYPE_CHIPS: ReadonlyArray<{ label: string; type: string }> = [
  { label: "Communities & SIGs", type: "Community" },
  { label: "Fellowships", type: "Fellowship" },
  { label: "Programs", type: "Program" },
  { label: "Mentoring", type: "Mentoring" },
  { label: "Webinars", type: "Webinar" },
  { label: "Courses", type: "Course" },
  { label: "MOOCs", type: "MOOC" },
  { label: "Toolkits", type: "Toolkit" },
  { label: "Frameworks", type: "Framework" },
  { label: "Resources", type: "Resource" },
  { label: "Networks", type: "Network" },
];

/** Step 2 · "Through which lens?" — production's category pill row. */
export const PD_LENSES: readonly string[] = [
  "All",
  "Peak Body",
  "Regulator",
  "AI in HE",
  "Indigenous Knowledges",
  "Assessment & Integrity",
  "International",
  "Other",
];

export const PD_OPPORTUNITIES: readonly PdOpportunity[] = [
  {
    "provider": "HERDSA",
    "name": "Fellowship Program (FHERDSA)",
    "type": "Fellowship",
    "timing": "Annual (applications close ~March)",
    "cost": "Membership required",
    "desc": "Peer-reviewed fellowship recognising commitment to higher education research and development.",
    "url": "https://herdsa.org.au/joining-herdsa-fellowship-community",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "New Scholars Program",
    "type": "Program",
    "timing": "Ongoing",
    "cost": "Subsidised for members",
    "desc": "Mentored research development program for early-career HE researchers.",
    "url": "https://herdsa.org.au/",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Webinar Series",
    "type": "Webinar",
    "timing": "Monthly",
    "cost": "Free (members) / $25",
    "desc": "Monthly webinars on HE research, teaching innovation, and policy.",
    "url": "https://www.herdsa.org.au/herdsa-webinars",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Scholarship of Teaching & Learning (SoTL) SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "A supportive community for those new to and advancing SoTL — dialogue, collaboration and scholarly inquiry into teaching.",
    "url": "https://herdsa.org.au/sig/scholarship-teaching-and-learning",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Assessment Quality SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "Improving assessment & feedback quality in line with the revised HESF and TEQSA re-registration; design, moderation and SoTL outputs.",
    "url": "https://herdsa.org.au/sig/assessment-quality",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Academic Development SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "International network for academic developers — research, practice, resources and leadership across HE.",
    "url": "https://herdsa.org.au/sig/academic-development",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Education-Focused Academic (EFA) SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "Supporting and advocating for education-focused academics — professional identity, career development and recognition.",
    "url": "https://herdsa.org.au/special-interest-groups",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "International Academics SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "Networking, mentorship and research collaboration for international academics working across Australasia.",
    "url": "https://herdsa.org.au/sig/international-academics",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Pedagogy of Belonging & Wellbeing SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "Scholarly work on student belonging and wellbeing — how they enhance learning, engagement and success.",
    "url": "https://herdsa.org.au/sig/pedagogy-student-belonging-and-wellbeing",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Online Engagement in Higher Education SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "The phenomenon of online student engagement — pedagogy, design, presence, analytics and the affordances of edtech.",
    "url": "https://herdsa.org.au/sig/online-engagement-higher-education",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Health Sciences SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "Health science education across coursework programs — authentic learning, WIL and authentic assessment.",
    "url": "https://herdsa.org.au/sig/health-sciences",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "Teaching & Learning in Humanities, Arts & Social Sciences (HASS) SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free (members)",
    "desc": "Championing creativity, connection and belonging in HASS teaching; staff–student partnerships and co-creation.",
    "url": "https://herdsa.org.au/special-interest-groups",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "Community Mentoring Program (CMP)",
    "type": "Mentoring",
    "timing": "Annual cohort",
    "cost": "Membership required",
    "desc": "Research & career mentoring for technology-enhanced learning professionals.",
    "url": "https://ascilite.org/get-involved/community-mentoring-program/",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "Spring into Excellence Research School",
    "type": "Intensive",
    "timing": "September 2026",
    "cost": "~$600 members",
    "desc": "3-day intensive research school at RMIT Melbourne.",
    "url": "https://ascilite.org/get-involved/spring-into-excellence-research-school/",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "TELall SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Special interest group for technology-enhanced learning practitioners.",
    "url": "https://ascilite.org/get-involved/sigs/",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "Open Educational Practice (OEP) SIG",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Special interest group for open education — OER, open pedagogy & open textbooks; runs a public webinar series.",
    "url": "https://ascilite.org/get-involved/sigs/",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "Learning Design SIG (recorded webinars)",
    "type": "Community",
    "timing": "Ongoing · auto-updating playlist",
    "cost": "Free",
    "desc": "ASCILITE Learning Design SIG — every webinar recorded on the SIG YouTube playlist; watch the latest anytime.",
    "url": "https://www.youtube.com/playlist?list=PLETH5KYzFInHNJkp7U7fs01XPyhWf-Fy2",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "ASCILITE Live! Webinars (playlist)",
    "type": "Webinar",
    "timing": "Ongoing · auto-updating playlist",
    "cost": "Free",
    "desc": "ASCILITE Live! webinar series on TEL, assessment and integrity — full recordings playlist.",
    "url": "https://www.youtube.com/playlist?list=PLETH5KYzFInHK8qiM3PGXAVxclQU32rFi",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "Business Education SIG (playlist)",
    "type": "Community",
    "timing": "Ongoing · auto-updating playlist",
    "cost": "Free",
    "desc": "ASCILITE Business Education SIG — GenAI in business education and beyond; full recorded-webinar playlist.",
    "url": "https://www.youtube.com/playlist?list=PLETH5KYzFInGeWmYQYc1tOUV5qCfcowNO",
    "cat": "Peak Body"
  },
  {
    "provider": "Transforming Assessment",
    "name": "Transforming Assessment (webinar archive)",
    "type": "Webinar",
    "timing": "Fortnightly · archived",
    "cost": "Free",
    "desc": "Long-running assessment webinar series — full archive of past events and recordings.",
    "url": "https://transformingassessment.com/events_past.php",
    "cat": "Peak Body"
  },
  {
    "provider": "CAULLT",
    "name": "Leadership Development Grants",
    "type": "Grant",
    "timing": "Annual (closes April)",
    "cost": "Up to $10,000",
    "desc": "Grants supporting collaborative projects in university learning and teaching leadership.",
    "url": "https://www.caullt.edu.au/grants/",
    "cat": "Peak Body"
  },
  {
    "provider": "CAULLT",
    "name": "Emerging Leaders Program",
    "type": "Program",
    "timing": "Annual cohort",
    "cost": "Membership institution",
    "desc": "Development program for emerging L&T leaders in Australian universities.",
    "url": "https://www.caullt.edu.au/professionallearning/contemporary-approaches-to-university-teaching/",
    "cat": "Peak Body"
  },
  {
    "provider": "CAULLT",
    "name": "Webinar Series",
    "type": "Webinar",
    "timing": "Bi-monthly",
    "cost": "Free for members",
    "desc": "Regular webinars on L&T leadership, policy, and practice.",
    "url": "https://www.caullt.edu.au/events-and-learning/",
    "cat": "Peak Body"
  },
  {
    "provider": "ACODE",
    "name": "Benchmarking Program",
    "type": "Benchmarking",
    "timing": "Annual summits",
    "cost": "Membership required",
    "desc": "Inter-institutional benchmarking across 8 areas including TEL and digital learning.",
    "url": "https://acode.edu.au/activities/workshops/inter-institutional-benchmarking-summits",
    "cat": "Peak Body"
  },
  {
    "provider": "ACODE",
    "name": "Learning Technologies Leadership Institute",
    "type": "Institute",
    "timing": "Annual",
    "cost": "~$1,200 members",
    "desc": "Intensive leadership development for digital learning leaders.",
    "url": "https://acode.edu.au/",
    "cat": "Peak Body"
  },
  {
    "provider": "Advance HE",
    "name": "Fellowship (AFHEA/FHEA/SFHEA/PFHEA)",
    "type": "Fellowship",
    "timing": "Rolling applications",
    "cost": "$450-$1,800 AUD",
    "desc": "International recognition of teaching practice aligned to PSF 2023.",
    "url": "https://advance-he.ac.uk/fellowship",
    "cat": "Peak Body"
  },
  {
    "provider": "Advance HE",
    "name": "Elevate Australasia Spotlight Series",
    "type": "Webinar",
    "timing": "Monthly 2026",
    "cost": "Free / subsidised",
    "desc": "Spotlight sessions on AI-enabled assessment, student success, and inclusive learning.",
    "url": "https://advance-he.org/australasia",
    "cat": "Peak Body"
  },
  {
    "provider": "Advance HE",
    "name": "Elevate Pathways Program",
    "type": "Program",
    "timing": "Semester-based",
    "cost": "Varies",
    "desc": "Structured pathways for Fellowship preparation and teaching development.",
    "url": "https://advance-he.org/australasia",
    "cat": "Peak Body"
  },
  {
    "provider": "Advance HE",
    "name": "Aurora Leadership Programme",
    "type": "Program",
    "timing": "Annual",
    "cost": "~$2,500",
    "desc": "Leadership development for women and non-binary staff in HE.",
    "url": "https://advance-he.ac.uk/programmes-events/aurora",
    "cat": "Peak Body"
  },
  {
    "provider": "AAUTN",
    "name": "National Teaching Fellowship Scheme",
    "type": "Fellowship",
    "timing": "Annual",
    "cost": "Free",
    "desc": "Network supporting AAUT award winners and nominees in ongoing development.",
    "url": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "cat": "Peak Body"
  },
  {
    "provider": "AAUTN",
    "name": "TEFAN Cross-Border Conversations",
    "type": "Workshop",
    "timing": "2026 series",
    "cost": "Free",
    "desc": "International conversations on developing national and international profile.",
    "url": "https://events.humanitix.com/acrossborders",
    "cat": "Peak Body"
  },
  {
    "provider": "TEQSA",
    "name": "Good Practice Hub",
    "type": "Resource",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Curated resources on academic integrity, student experience, and quality assurance.",
    "url": "https://www.teqsa.gov.au/guides-resources",
    "cat": "Regulator"
  },
  {
    "provider": "TEQSA",
    "name": "Provider Workshops & Webinars",
    "type": "Webinar",
    "timing": "Quarterly",
    "cost": "Free",
    "desc": "Workshops on regulatory expectations, HESF compliance, and quality frameworks.",
    "url": "https://www.teqsa.gov.au/events",
    "cat": "Regulator"
  },
  {
    "provider": "TEQSA",
    "name": "Academic Integrity Toolkit",
    "type": "Toolkit",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Comprehensive resources on contract cheating, AI, and assessment integrity.",
    "url": "https://www.teqsa.gov.au/guides-resources/higher-education-good-practice-hub",
    "cat": "Regulator"
  },
  {
    "provider": "Universities Australia",
    "name": "AAUT Teaching Criteria & Standards",
    "type": "Framework",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "National teaching criteria used for AAUT awards and institutional promotion standards.",
    "url": "https://www.universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "cat": "Peak Body"
  },
  {
    "provider": "AITSL",
    "name": "Australian Professional Standards for Teachers",
    "type": "Framework",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "National framework for teacher quality (relevant for education faculty).",
    "url": "https://www.aitsl.edu.au/teach/standards",
    "cat": "Regulator"
  },
  {
    "provider": "Microsoft",
    "name": "AI in Higher Education Community",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Community of practice for AI integration in university teaching and learning.",
    "url": "https://learn.microsoft.com/en-us/training/",
    "cat": "AI in HE"
  },
  {
    "provider": "Google",
    "name": "AI for Education",
    "type": "Program",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Tools and training for integrating Google AI into higher education pedagogy.",
    "url": "https://edu.google.com/intl/ALL_au/",
    "cat": "AI in HE"
  },
  {
    "provider": "OpenAI",
    "name": "ChatGPT Educator Resources",
    "type": "Resource",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Guides and prompts for teaching with ChatGPT responsibly.",
    "url": "https://openai.com/chatgpt/",
    "cat": "AI in HE"
  },
  {
    "provider": "Anthropic",
    "name": "Claude for Education",
    "type": "Resource",
    "timing": "Ongoing",
    "cost": "Free tier available",
    "desc": "AI assistant designed for careful, honest, and harmless educational use.",
    "url": "https://www.anthropic.com/education",
    "cat": "AI in HE"
  },
  {
    "provider": "UNESCO",
    "name": "AI Competency Framework for Teachers",
    "type": "Framework",
    "timing": "Released 2024",
    "cost": "Free",
    "desc": "Global framework for developing teacher competencies in AI.",
    "url": "https://www.unesco.org/en/digital-education/ai-future-learning",
    "cat": "AI in HE"
  },
  {
    "provider": "AIATSIS",
    "name": "Core Cultural Learning",
    "type": "Course",
    "timing": "Self-paced",
    "cost": "Free",
    "desc": "Foundation course for understanding Aboriginal and Torres Strait Islander cultures.",
    "url": "https://aiatsis.gov.au/about/what-we-do/core-cultural-learning",
    "cat": "Indigenous Knowledges"
  },
  {
    "provider": "AIATSIS",
    "name": "Indigenous Research Ethics",
    "type": "Course",
    "timing": "Self-paced",
    "cost": "Free",
    "desc": "Ethical research practices involving Aboriginal and Torres Strait Islander peoples.",
    "url": "https://aiatsis.gov.au/research/ethical-research",
    "cat": "Indigenous Knowledges"
  },
  {
    "provider": "Universities Australia",
    "name": "Indigenous Strategy Implementation",
    "type": "Framework",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Resources for implementing UA Indigenous Strategy 2022-2025 in teaching.",
    "url": "https://universitiesaustralia.edu.au/policy-submissions/diversity-equity/indigenous-higher-education/",
    "cat": "Indigenous Knowledges"
  },
  {
    "provider": "TEQSA",
    "name": "GenAI Assessment Guidance",
    "type": "Guidance",
    "timing": "Updated 2024",
    "cost": "Free",
    "desc": "Guidance on generative AI in assessment, academic integrity, and quality.",
    "url": "https://www.teqsa.gov.au/guides-resources/higher-education-good-practice-hub/gen-ai-knowledge-hub",
    "cat": "Assessment & Integrity"
  },
  {
    "provider": "Turnitin",
    "name": "AI Writing Detection & Integrity",
    "type": "Tool",
    "timing": "Ongoing",
    "cost": "Institutional license",
    "desc": "AI detection tools and academic integrity resources for universities.",
    "url": "https://www.turnitin.com/solutions/ai-writing",
    "cat": "Assessment & Integrity"
  },
  {
    "provider": "CRADLE (Deakin)",
    "name": "Feedback Literacy Resources",
    "type": "Resource",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Research-informed resources on feedback design and student feedback literacy.",
    "url": "https://www.deakin.edu.au/cradle",
    "cat": "Assessment & Integrity"
  },
  {
    "provider": "ISSoTL",
    "name": "SoTL Resources & Community",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Membership ~$75 USD",
    "desc": "International community for scholarship of teaching and learning.",
    "url": "https://issotl.com/",
    "cat": "International"
  },
  {
    "provider": "ICED",
    "name": "International Educational Development",
    "type": "Network",
    "timing": "Biennial conference",
    "cost": "Varies",
    "desc": "Global network for educational/academic developers.",
    "url": "https://icedonline.net/",
    "cat": "International"
  },
  {
    "provider": "POD Network",
    "name": "Professional Development Resources",
    "type": "Community",
    "timing": "Annual conference",
    "cost": "Membership ~$150 USD",
    "desc": "US-based network with transferable resources for educational developers.",
    "url": "https://podnetwork.org/",
    "cat": "International"
  },
  {
    "provider": "SEDA (UK)",
    "name": "Professional Development Framework",
    "type": "Framework",
    "timing": "Ongoing",
    "cost": "Varies",
    "desc": "UK Staff & Educational Development Association recognition scheme.",
    "url": "https://www.seda.ac.uk/",
    "cat": "International"
  },
  {
    "provider": "HELTA (NZ)",
    "name": "NZ HE Teaching & Learning",
    "type": "Community",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "New Zealand higher education teaching and learning network.",
    "url": "https://helta.nz/",
    "cat": "International"
  },
  {
    "provider": "Ako Aotearoa",
    "name": "Teaching Excellence Resources",
    "type": "Resource",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "NZ national centre for tertiary teaching excellence.",
    "url": "https://ako.ac.nz/",
    "cat": "International"
  },
  {
    "provider": "Quality Indicators for L&T",
    "name": "QILT Data & Resources",
    "type": "Data",
    "timing": "Annual",
    "cost": "Free",
    "desc": "National student experience and graduate outcomes survey data.",
    "url": "https://www.qilt.edu.au/",
    "cat": "Other"
  },
  {
    "provider": "Australasian JET",
    "name": "Journal of Educational Technology",
    "type": "Journal",
    "timing": "Ongoing",
    "cost": "Open Access",
    "desc": "AJET - open access journal for educational technology research.",
    "url": "https://ajet.org.au/",
    "cat": "Other"
  },
  {
    "provider": "HERDSA",
    "name": "Higher Education Research & Development",
    "type": "Journal",
    "timing": "6 issues/year",
    "cost": "Subscription / OA option",
    "desc": "Leading Australasian journal for HE research.",
    "url": "https://www.tandfonline.com/toc/cher20/current",
    "cat": "Other"
  },
  {
    "provider": "ASCILITE",
    "name": "AJET / ASCILITE Publications",
    "type": "Journal",
    "timing": "Ongoing",
    "cost": "Open Access",
    "desc": "Research publications on technology-enhanced learning.",
    "url": "https://ascilite.org/ajet/",
    "cat": "Other"
  },
  {
    "provider": "OLT/ALTC Legacy",
    "name": "Teaching Quality Resources",
    "type": "Archive",
    "timing": "Historical",
    "cost": "Free",
    "desc": "Legacy resources from the Office for Learning and Teaching.",
    "url": "https://ltr.edu.au/",
    "cat": "Other"
  },
  {
    "provider": "Future Learn / edX / Coursera",
    "name": "HE Teaching MOOCs",
    "type": "MOOC",
    "timing": "Self-paced",
    "cost": "Free / paid cert",
    "desc": "Online courses on university teaching, learning design, and assessment.",
    "url": "https://www.futurelearn.com/subjects/teaching-courses",
    "cat": "Other"
  },
  {
    "provider": "CAULLT",
    "name": "Contemporary Approaches to University Teaching (CAUT) MOOC",
    "type": "MOOC",
    "timing": "Semester-based (Feb-Jun)",
    "cost": "Free",
    "desc": "24-module self-paced MOOC across 4 pathways with digital badges. 800-1000 enrolments per semester. Open worldwide.",
    "url": "https://www.caullt.edu.au/professionallearning/contemporary-approaches-to-university-teaching/",
    "cat": "Peak Body"
  },
  {
    "provider": "CAULLT",
    "name": "Enhancing Program Leadership",
    "type": "Program",
    "timing": "Jun-Aug 2026",
    "cost": "Member institution",
    "desc": "Online 4-module program for Program Directors and Course Leaders. PSF 2023 aligned. Delivered by Advance HE.",
    "url": "https://www.caullt.edu.au/professionallearning/contemporary-approaches-to-university-teaching/",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "SoTL Modules",
    "type": "Course",
    "timing": "Self-paced · returning ~July 2026",
    "cost": "Free (members)",
    "desc": "10 modules across the full SoTL research cycle. Temporarily offline after a Canvas security incident; relaunching on Moodle ~July 2026.",
    "url": "https://herdsa.org.au/news/herdsa-sotl-modules-setting-bar-world-standard-support-scholarship-teaching-and-learning",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "TATAL (Talking About Teaching and Learning)",
    "type": "Community",
    "timing": "Ongoing groups",
    "cost": "Free (members)",
    "desc": "Small-group facilitated collegial discussions leading to Fellowship, SoTL projects, and publications.",
    "url": "https://www.herdsa.org.au/",
    "cat": "Peak Body"
  },
  {
    "provider": "HERDSA",
    "name": "SoTL SIG Meetings & Coffee Chats",
    "type": "Community",
    "timing": "Monthly + fortnightly",
    "cost": "Free (members)",
    "desc": "Monthly online meetings plus fortnightly Coffee and SoTL Chat drop-ins (12-12:45pm AEST).",
    "url": "https://www.herdsa.org.au/special-interest-groups",
    "cat": "Peak Body"
  },
  {
    "provider": "CRADLE (Deakin)",
    "name": "CRADLE Seminar Series",
    "type": "Seminar",
    "timing": "Monthly",
    "cost": "Free",
    "desc": "World-leading series on assessment, digital learning, AI and feedback, preparing graduates for AI.",
    "url": "https://www.deakin.edu.au/cradle",
    "cat": "Assessment & Integrity"
  },
  {
    "provider": "CGHE (Oxford)",
    "name": "AI in Higher Education Webinar Series",
    "type": "Webinar",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "Centre for Global Higher Education. AI products, policy, knowledge production, governance.",
    "url": "https://www.cghe.ac.uk/",
    "cat": "AI in HE"
  },
  {
    "provider": "ICAI",
    "name": "Summer Intensive Webinar Series",
    "type": "Workshop",
    "timing": "May-Jul 2026 (biweekly)",
    "cost": "Free (members) / $100",
    "desc": "5-session series on AI-based challenges, human durable skills, and academic integrity.",
    "url": "https://academicintegrity.org/",
    "cat": "Assessment & Integrity"
  },
  {
    "provider": "University of Melbourne",
    "name": "Ngarrngga Project",
    "type": "Resource",
    "timing": "Ongoing",
    "cost": "Free",
    "desc": "High-quality curriculum resources and PD modules for embedding Aboriginal and Torres Strait Islander knowledge systems.",
    "url": "https://ngarrngga.unimelb.edu.au/",
    "cat": "Indigenous Knowledges"
  },
  {
    "provider": "ASCILITE/ALT",
    "name": "CMALT Australasia",
    "type": "Fellowship",
    "timing": "Rolling applications",
    "cost": "Membership required",
    "desc": "Professional recognition for learning technology practitioners. Associate, CMALT, and Senior CMALT levels.",
    "url": "https://ascilite.org/get-involved/cmalt/",
    "cat": "Peak Body"
  },
  {
    "provider": "ISSoTL",
    "name": "Collaborative Writing Groups",
    "type": "Program",
    "timing": "Apr 2026-Oct 2027",
    "cost": "~$350 USD",
    "desc": "Pre-conference workshops plus online collaboration producing a publishable manuscript for Teaching & Learning Inquiry.",
    "url": "https://issotl.com/",
    "cat": "International"
  },
  {
    "provider": "AAUTN",
    "name": "Mentor Scheme",
    "type": "Mentoring",
    "timing": "Year-round",
    "cost": "Free",
    "desc": "Connects aspiring AAUT nominees with existing award recipients as volunteer mentors.",
    "url": "https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "Women in Professional Leadership (WiPL)",
    "type": "Mentoring",
    "timing": "18-month program · EoIs Feb",
    "cost": "Free (members)",
    "desc": "Mentoring & leadership development for women in learning design, edtech & similar roles (HEW 7+).",
    "url": "https://ascilite.org/get-involved/women-in-professional-leadership-program/",
    "cat": "Peak Body"
  },
  {
    "provider": "ASCILITE",
    "name": "TELedvisors SIG Webinars",
    "type": "Webinar",
    "timing": "Periodic · recorded",
    "cost": "Free (members)",
    "desc": "Webinars for learning designers & educational technologists — watch recordings on the TELedvisors channel.",
    "url": "https://www.youtube.com/@teledvisors",
    "cat": "Peak Body"
  }
];

/**
 * Production's filter, verbatim: one shared selection matches EITHER the
 * lens (cat) OR the format (type), and the search covers name, provider and
 * description.
 */
export function filterPd(
  selected: string,
  query: string,
): PdOpportunity[] {
  const q = query.trim().toLowerCase();
  return PD_OPPORTUNITIES.filter((o) => {
    if (selected !== "All" && o.cat !== selected && o.type !== selected) {
      return false;
    }
    if (q) {
      return (
        o.name.toLowerCase().includes(q) ||
        o.provider.toLowerCase().includes(q) ||
        o.desc.toLowerCase().includes(q)
      );
    }
    return true;
  });
}
