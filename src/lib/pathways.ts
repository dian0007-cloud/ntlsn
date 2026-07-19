/**
 * #pathways — Guided Learning Pathways dataset (Epic 1.2 PR-D), extracted
 * VERBATIM from the production bundle (assets/app.b38bc4ca.js, the `se`
 * array): 5 career-stage pathways × 19 modules × 126 curated resources.
 * Counts in the section copy are always derived from this data, never
 * hardcoded.
 *
 * Curation note (rendered in the section footer): pathways curated by
 * Dr Seb Dianati; linked content remains the IP of its authors;
 * CC BY-NC-SA 4.0 applies to the curation and pathway design only.
 */

export type ResourceType = "read" | "watch" | "act";

export interface PathwayResource {
  type: ResourceType;
  title: string;
  source: string;
  /** External http(s) URL, or "#" for a not-yet-built NTLSN activity
   * (rendered dimmed with "Coming soon", exactly as the bundle did). */
  url: string;
  note: string;
}

export interface PathwayModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  resources: readonly PathwayResource[];
}

export interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  colour: string;
  target: string;
  modules: readonly PathwayModule[];
}

export const PATHWAYS: readonly Pathway[] = [
  {
    "id": "sessional",
    "title": "The Sessional & Casual Academic Survival Guide",
    "subtitle": "Navigate precarious academic work with confidence",
    "description": "Rapid onboarding, building a teaching portfolio with limited time, and understanding the governance structures that shape your work. Designed for casuals, sessionals, and adjuncts who often feel disconnected from institutional support.",
    "icon": "🧭",
    "colour": "#8fb081",
    "target": "Casuals, sessionals, adjuncts, and new teaching staff",
    "modules": [
      {
        "id": "sess-m1",
        "title": "Know Your Baseline: Governance & Standards",
        "description": "Understand the regulatory and institutional landscape that shapes your day-to-day work.",
        "icon": "📋",
        "resources": [
          {
            "type": "read",
            "title": "BLASST Framework — Sessional Staff Standards",
            "source": "BLASST",
            "url": "https://blasst.edu.au/framework/",
            "note": "National benchmarking framework for evaluating quality of sessional teaching. Know your rights and institutional standards."
          },
          {
            "type": "read",
            "title": "TEQSA Good Practice Hub",
            "source": "TEQSA",
            "url": "https://www.teqsa.gov.au/guides-resources/higher-education-good-practice-hub",
            "note": "Central collection of notes and frameworks guiding institutional compliance, academic integrity, and quality assurance."
          },
          {
            "type": "read",
            "title": "Higher Education Standards Framework (HESF)",
            "source": "TEQSA",
            "url": "https://www.legislation.gov.au/F2021L00488/latest/text-2021",
            "note": "The regulatory backbone of Australian higher education. Understand how it impacts your teaching role."
          },
          {
            "type": "watch",
            "title": "TEQSA Talks: Quality in the AI Era",
            "source": "TEQSA",
            "url": "https://www.youtube.com/watch?v=P6AOoJb7reM",
            "note": "Understanding how the regulator views quality assurance in the current landscape."
          },
          {
            "type": "read",
            "title": "ATEC — Australian Tertiary Education Commission",
            "source": "Dept of Education",
            "url": "https://www.education.gov.au/australian-tertiary-education-commission",
            "note": "The new system steward for HE and VET &mdash; interim from 1 July 2025, statutory in 2026 (TEQSA remains the quality regulator). Essential context for all teaching staff."
          },
          {
            "type": "read",
            "title": "Australian Universities Accord Final Report",
            "source": "Dept of Education",
            "url": "https://www.education.gov.au/australian-universities-accord/resources/final-report",
            "note": "The sector reform blueprint. Know the policy environment shaping your career."
          },
          {
            "type": "act",
            "title": "Map your current role to HESF Threshold Standards",
            "source": "NTLSN",
            "url": "#",
            "note": "Practical exercise: identify which HESF standards are most relevant to your tutorial/marking work."
          }
        ]
      },
      {
        "id": "sess-m2",
        "title": "Time-Crunched Teaching",
        "description": "Effective pedagogical strategies when preparation time is limited.",
        "icon": "⏱️",
        "resources": [
          {
            "type": "read",
            "title": "CloudFirst Learning Design",
            "source": "Deakin University",
            "url": "https://www.deakin.edu.au/about-deakin/why-deakin/education-excellence/deakin-learning-futures",
            "note": "Optimising asynchronous vs synchronous engagement using Laurillard's conversational learning theory."
          },
          {
            "type": "read",
            "title": "Models of Engaged Learning (MELT)",
            "source": "University of Adelaide",
            "url": "https://www.adelaide.edu.au/learning/",
            "note": "Six facets of thinking to scaffold complex student cognition and active learning routines."
          },
          {
            "type": "watch",
            "title": "AI-Powered Pedagogy: GenAI as Learning Assistant",
            "source": "ASCILITE",
            "url": "https://www.youtube.com/watch?v=WyEQpRglVWI",
            "note": "Using AI tools to efficiently prepare tutorials and teaching materials."
          },
          {
            "type": "read",
            "title": "FLIPCurric Toolkit",
            "source": "Western Sydney University",
            "url": "https://www.westernsydney.edu.au/learning-futures/teaching-support/smart-assessment-design-toolkit",
            "note": "Flipped curriculum methods to optimise both asynchronous study and face-to-face contact."
          },
          {
            "type": "watch",
            "title": "Active Learning Strategies That Work",
            "source": "HERDSA",
            "url": "https://www.youtube.com/watch?v=oaQKWr0SZAY",
            "note": "Evidence-based techniques for engaging students in tutorial settings."
          },
          {
            "type": "act",
            "title": "The 1-Hour Prep Checklist",
            "source": "NTLSN",
            "url": "#",
            "note": "Template: structure tutorial prep efficiently when only paid for 1 hour of preparation."
          }
        ]
      },
      {
        "id": "sess-m3",
        "title": "Building Your Academic Identity",
        "description": "Portfolio development, professional recognition, and career progression.",
        "icon": "🎯",
        "resources": [
          {
            "type": "read",
            "title": "Developing an Academic Portfolio",
            "source": "University of Technology Sydney",
            "url": "https://www.uts.edu.au/about/uts-vision/teaching/scholarship-and-research/developing-academic-portfolio",
            "note": "Embed deep critical reflection, documentary evidence, and self-evaluations of impact on student learning."
          },
          {
            "type": "read",
            "title": "Advance HE Associate Fellowship (AFHEA)",
            "source": "Advance HE",
            "url": "https://www.advance-he.ac.uk/fellowship/associate-fellowship",
            "note": "Map your casual teaching to the PSF 2023 criteria — the entry-level international recognition."
          },
          {
            "type": "watch",
            "title": "Strategies for Going Public with SoTL",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=CMjA4FkPk2I",
            "note": "Publishing, presenting, and making your teaching scholarship visible."
          },
          {
            "type": "read",
            "title": "Teaching Capabilities Framework",
            "source": "Charles Sturt University",
            "url": "https://www.csu.edu.au/division/learning-teaching/home",
            "note": "Self-assessment tool to gauge pedagogical progress and align career planning with university strategy."
          },
          {
            "type": "read",
            "title": "CMALT Australasia",
            "source": "ASCILITE/ALT",
            "url": "https://ascilite.org/get-involved/cmalt/",
            "note": "Professional recognition for learning technology practitioners. Associate, CMALT, and Senior levels."
          },
          {
            "type": "watch",
            "title": "HERDSA Fellowship: What You Need to Know",
            "source": "HERDSA",
            "url": "https://www.youtube.com/watch?v=SG8o9njC7S0",
            "note": "Peer-reviewed fellowship recognising commitment to HE research and development."
          },
          {
            "type": "act",
            "title": "PSF 2023 Self-Mapping Exercise",
            "source": "NTLSN",
            "url": "#",
            "note": "Map your current teaching activities against the five dimensions of the Professional Standards Framework."
          }
        ]
      },
      {
        "id": "sess-m4",
        "title": "Navigating Institutional Support",
        "description": "Finding communities, mentoring, and advocacy as a sessional.",
        "icon": "🤝",
        "resources": [
          {
            "type": "read",
            "title": "BLASST Good Practice Awards",
            "source": "BLASST",
            "url": "https://blasst.edu.au/resources/",
            "note": "Highlighting mentoring programs for sessional staff and HDR students across institutions."
          },
          {
            "type": "read",
            "title": "HERDSA New Scholars Program",
            "source": "HERDSA",
            "url": "https://www.herdsa.org.au/",
            "note": "Mentored research development program for early-career HE researchers."
          },
          {
            "type": "read",
            "title": "ASCILITE Community Mentoring Program",
            "source": "ASCILITE",
            "url": "https://ascilite.org/get-involved/community-mentoring-program/",
            "note": "12-month mentoring for technology-enhanced learning professionals."
          },
          {
            "type": "watch",
            "title": "Education Focused Academics SIG",
            "source": "HERDSA",
            "url": "https://www.youtube.com/watch?v=1zLcr_7sUwU",
            "note": "How teaching-focused staff can strengthen professional identity through peer learning."
          },
          {
            "type": "read",
            "title": "NTEU Sessional Staff Resources",
            "source": "NTEU",
            "url": "https://www.nteu.org.au/casuals",
            "note": "Union resources on sessional staff rights, pay rates, and superannuation."
          },
          {
            "type": "read",
            "title": "AAUTN Mentor Scheme",
            "source": "AAUTN",
            "url": "https://aautn.edu.au/",
            "note": "Connects aspiring AAUT nominees with existing award recipients as volunteer mentors."
          }
        ]
      }
    ]
  },
  {
    "id": "marker",
    "title": "The First-Time Marker's Toolkit",
    "subtitle": "Demystify grading, calibration, and feedback",
    "description": "From understanding assessment philosophy to writing feedback that students actually read. Everything a new marker, PhD student, or early career academic needs to grade fairly and efficiently — especially when GenAI is in the mix.",
    "icon": "✏️",
    "colour": "#c66c3f",
    "target": "New markers, PhD students, early career academics, tutors",
    "modules": [
      {
        "id": "mark-m1",
        "title": "The Philosophy of Assessment",
        "description": "Why we assess, what makes assessment valid, and how to align tasks with learning outcomes.",
        "icon": "📐",
        "resources": [
          {
            "type": "read",
            "title": "Essentials of Contemporary Assessment",
            "source": "Monash University",
            "url": "https://www.monash.edu/learning-teaching/resources/assessment",
            "note": "Comprehensive module exploring assessment as learning, for learning, and of learning."
          },
          {
            "type": "watch",
            "title": "Assessment Beyond the Individual Unit/Module",
            "source": "CRADLE (Deakin)",
            "url": "https://www.youtube.com/watch?v=n2MPL2BOQH0",
            "note": "Seminar Series 2024 #5 — programmatic assessment design across whole degrees."
          },
          {
            "type": "read",
            "title": "Course Design and Constructive Alignment",
            "source": "Southern Cross University",
            "url": "https://www.scu.edu.au/staff/teaching-and-learning/curriculum-development/design/course-design/",
            "note": "Practical toolkits including the CAM spreadsheet for mapping CLOs to ULOs."
          },
          {
            "type": "read",
            "title": "Assessment Design Principles",
            "source": "Charles Sturt University",
            "url": "https://www.csu.edu.au/division/learning-teaching/home",
            "note": "Eleven core principles ensuring assessments are valid, authentic, inclusive, explicit, and aligned."
          },
          {
            "type": "watch",
            "title": "Fundamentals of Programmatic Assessment",
            "source": "Monash University",
            "url": "https://www.youtube.com/watch?v=bNJZMgxHOmI",
            "note": "Foundational understanding using Fink's Taxonomy for cognitive and affective learning mapping."
          },
          {
            "type": "act",
            "title": "Constructive Alignment Mapping Template",
            "source": "NTLSN",
            "url": "#",
            "note": "Template: map your unit's CLOs → assessment tasks → learning activities to check alignment."
          }
        ]
      },
      {
        "id": "mark-m2",
        "title": "Grading, Calibration, and Rubrics",
        "description": "Standardising marks across teaching teams and building fair rubrics.",
        "icon": "⚖️",
        "resources": [
          {
            "type": "read",
            "title": "Smart Assessment Design Toolkit",
            "source": "Western Sydney University",
            "url": "https://www.westernsydney.edu.au/studysmart/home",
            "note": "Discipline-specific pedagogical advice for designing authentic assessments."
          },
          {
            "type": "read",
            "title": "Pre-submission Peer Review",
            "source": "RMIT University",
            "url": "https://www.rmit.edu.au/students/support-services/study-support",
            "note": "Collaborative frameworks where students provide constructive feedback on peers' drafts."
          },
          {
            "type": "watch",
            "title": "e-Cheating and Assessment Security",
            "source": "ASCILITE / Turnitin",
            "url": "https://www.youtube.com/watch?v=J3pMwCp3sPQ",
            "note": "ASCILITE Live! — best practices for academic integrity in marking."
          },
          {
            "type": "read",
            "title": "Good Practice Guide: Authentic Learning",
            "source": "Flinders University",
            "url": "https://blogs.flinders.edu.au/cilt/",
            "note": "Four-step process for designing authentic assessments focused on disciplinary contexts."
          },
          {
            "type": "read",
            "title": "Assessment Policy",
            "source": "La Trobe University",
            "url": "https://policies.latrobe.edu.au/document/view.php?id=216",
            "note": "Overarching institutional assessment policy governing design, moderation, and academic integrity."
          },
          {
            "type": "act",
            "title": "Rubric Calibration Workshop Guide",
            "source": "NTLSN",
            "url": "#",
            "note": "Step-by-step guide for running a calibration session to standardise marks across a teaching team."
          },
          {
            "type": "watch",
            "title": "Secure Assessment Tasks in a Time of GenAI",
            "source": "CRADLE (Deakin)",
            "url": "https://www.youtube.com/watch?v=v2a_Uh--3aw",
            "note": "New Directions in AI #3 — designing AI-resistant assessment."
          }
        ]
      },
      {
        "id": "mark-m3",
        "title": "Feedback Literacy & Writing Feedback That Feeds Forward",
        "description": "Craft feedback students actually read, understand, and act on.",
        "icon": "💬",
        "resources": [
          {
            "type": "read",
            "title": "Feedback Literacy Resources",
            "source": "CRADLE (Deakin)",
            "url": "https://blogs.deakin.edu.au/cradle/tag/feedback-literacy/",
            "note": "Research-informed resources on feedback design and student feedback literacy."
          },
          {
            "type": "watch",
            "title": "CRADLE Seminar: Preparing Graduates for an AI-Evolving World",
            "source": "CRADLE (Deakin)",
            "url": "https://www.youtube.com/watch?v=oNdZxm1wjQE",
            "note": "Seminar Series 2026 #2 — the FutureFocus emerging professional self."
          },
          {
            "type": "read",
            "title": "Self & Peer Assessment (SaPA)",
            "source": "University of New England",
            "url": "https://policies.une.edu.au/view.current.php?id=00243",
            "note": "Methodology for qualitative and quantitative feedback on peer contribution in team tasks."
          },
          {
            "type": "read",
            "title": "Assessment and Feedback Policy",
            "source": "University of Wollongong",
            "url": "https://www.uow.edu.au/about/learning-teaching/",
            "note": "Embedding early, low-stakes formative tasks to identify at-risk students."
          },
          {
            "type": "watch",
            "title": "ChatGPT Webinar #3 — What Have We Learnt?",
            "source": "CRADLE (Deakin)",
            "url": "https://www.youtube.com/watch?v=hv_PcxjfkCw",
            "note": "Consolidating early lessons from the AI disruption for marking and feedback."
          },
          {
            "type": "act",
            "title": "Feedback Quality Self-Audit Checklist",
            "source": "NTLSN",
            "url": "#",
            "note": "Rate your own feedback against Carless & Boud's (2018) feedback literacy dimensions."
          }
        ]
      },
      {
        "id": "mark-m4",
        "title": "AI, Academic Integrity, and the New Marker",
        "description": "What to do when you suspect GenAI use or contract cheating.",
        "icon": "🤖",
        "resources": [
          {
            "type": "read",
            "title": "Rules for Using AI in Assessment",
            "source": "University of Queensland",
            "url": "https://itali.uq.edu.au/teaching-guidance/teaching-learning-and-assessment-generative-ai",
            "note": "Centralised resources governing AI tools and academic integrity frameworks across assessment."
          },
          {
            "type": "read",
            "title": "TEQSA GenAI Assessment Guidance",
            "source": "TEQSA",
            "url": "https://www.teqsa.gov.au/guides-resources/resources/corporate-publications/enacting-assessment-reform-time-artificial-intelligence",
            "note": "Regulatory guidance on generative AI in assessment from the national regulator."
          },
          {
            "type": "watch",
            "title": "AI in Assessment — 5 Innovative Designs",
            "source": "Transforming Assessment",
            "url": "https://www.youtube.com/watch?v=2R8k88IoaUw",
            "note": "Practical assessment redesigns for the AI era."
          },
          {
            "type": "read",
            "title": "Academic Integrity Toolkit",
            "source": "TEQSA",
            "url": "https://www.teqsa.gov.au/guides-resources/protecting-academic-integrity",
            "note": "Comprehensive resources on contract cheating, AI, and assessment integrity."
          },
          {
            "type": "watch",
            "title": "Assurance of Learning in the Age of AI",
            "source": "ASCILITE",
            "url": "https://www.youtube.com/watch?v=Yz3G7M_5ZXE",
            "note": "Satisfying TEQSA while fostering digital literacy."
          },
          {
            "type": "watch",
            "title": "Entangled Intelligence? Distributed Cognition & AI Agents",
            "source": "CRADLE (Deakin)",
            "url": "https://www.youtube.com/watch?v=c2zBhC2xFEo",
            "note": "Seminar Series 2026 #4 — the performance paradox of AI-assisted learning."
          },
          {
            "type": "act",
            "title": "Academic Integrity Triage Flowchart",
            "source": "NTLSN",
            "url": "#",
            "note": "Decision tree: what to do step-by-step when you suspect AI misuse or contract cheating."
          }
        ]
      }
    ]
  },
  {
    "id": "sotl-new",
    "title": "The \"New to SoTL\" Incubator",
    "subtitle": "From classroom curiosity to published research",
    "description": "Bridging the gap between \"I had a good idea in class\" and \"I am publishing this in a Q1 educational journal.\" A structured on-ramp for academics transitioning from disciplinary research into pedagogical scholarship.",
    "icon": "🔬",
    "colour": "#a8737f",
    "target": "Academics new to SoTL, disciplinary researchers turning to pedagogy",
    "modules": [
      {
        "id": "sotl-m1",
        "title": "What is SoTL (And What is it Not)?",
        "description": "Understanding the distinctive characteristics of the Scholarship of Teaching and Learning.",
        "icon": "🧩",
        "resources": [
          {
            "type": "watch",
            "title": "Scholarship of Teaching and Learning vs. Scholarly Teaching",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=r6XY8Fjs4VQ",
            "note": "The critical distinction between SoTL and scholarly teaching."
          },
          {
            "type": "read",
            "title": "SoTL Guidelines",
            "source": "University of Melbourne",
            "url": "https://melbourne-cshe.unimelb.edu.au/",
            "note": "Foundational definitions distinguishing SoTL from general education research."
          },
          {
            "type": "read",
            "title": "Introduction to SoLT",
            "source": "Southern Cross University",
            "url": "https://www.scu.edu.au/about/leadership/executive/academic-portfolio-office-apo/scholarship-of-learning-and-teaching/",
            "note": "What, why, and how of scholarly approaches to teaching practice."
          },
          {
            "type": "watch",
            "title": "Key Characteristics of SoTL",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=QYQT-EJXIOY",
            "note": "What distinguishes SoTL from good teaching practice."
          },
          {
            "type": "watch",
            "title": "History of the Scholarship of Teaching and Learning",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=N7f2P2M-ghc",
            "note": "From Boyer's 1990 framework to the contemporary global movement."
          },
          {
            "type": "read",
            "title": "SoTL as Academic Superpower",
            "source": "UNSW Sydney",
            "url": "https://www.education.unsw.edu.au/teaching/developing-teaching/sotl-support",
            "note": "Positioning SoTL as a strategic pathway for career development and pedagogical leadership."
          },
          {
            "type": "watch",
            "title": "The Evolution of SoTL (Featuring Lee Shulman)",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=8gXzVr0bVSs",
            "note": "Lee Shulman — the intellectual trajectory from Pedagogical Content Knowledge."
          }
        ]
      },
      {
        "id": "sotl-m2",
        "title": "Designing Your First SoTL Project",
        "description": "Turning classroom friction points into formal research questions.",
        "icon": "📝",
        "resources": [
          {
            "type": "read",
            "title": "SoTL Toolkit for Academic Developers",
            "source": "NTLSN SoTL Hub",
            "url": "#",
            "note": "Foundational frameworks, methodology guides, and ethics resources from the SoTL Hub."
          },
          {
            "type": "read",
            "title": "HERDSA SoTL Modules",
            "source": "HERDSA",
            "url": "https://herdsa.org.au/",
            "note": "10 modules across the full SoTL research cycle. Temporarily offline (Canvas incident) — relaunching on Moodle ~July 2026."
          },
          {
            "type": "watch",
            "title": "Examples of SoTL Projects (Featuring Peter Felten)",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=LZvYzsCR9ck",
            "note": "Concrete examples of what SoTL inquiry looks like in practice."
          },
          {
            "type": "read",
            "title": "Researching While Teaching (RWT)",
            "source": "University of South Australia",
            "url": "https://www.unisa.edu.au/about-unisa/academic-unit/teaching-innovation-unit/",
            "note": "Tiered action-research mentoring: from evaluating local practice to publishing global SoTL."
          },
          {
            "type": "watch",
            "title": "Controversies, Debates, and Tensions in SoTL",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=oTwg5WGe7oE",
            "note": "Disciplinary boundaries, methodological tensions, and legitimacy."
          },
          {
            "type": "act",
            "title": "SoTL Research Question Generator",
            "source": "NTLSN",
            "url": "#",
            "note": "Template: translate a classroom friction point into a formal SoTL research question."
          }
        ]
      },
      {
        "id": "sotl-m3",
        "title": "Ethics and Methodology in the Classroom",
        "description": "Navigating human research ethics when your participants are your own students.",
        "icon": "⚖️",
        "resources": [
          {
            "type": "read",
            "title": "Human Research Ethics for SoTL",
            "source": "UNSW Sydney",
            "url": "https://www.education.unsw.edu.au/teaching/developing-teaching/sotl-support",
            "note": "Navigating human research ethics approval processes for classroom-based pedagogical research."
          },
          {
            "type": "watch",
            "title": "ChatGPT Webinar #4 — What Do Researchers Need to Know?",
            "source": "CRADLE (Deakin)",
            "url": "https://www.youtube.com/watch?v=FbwFJ3DVFRE",
            "note": "Implications for research methodology and ethics in the AI era."
          },
          {
            "type": "read",
            "title": "HERDSA SoTL SIG Meetings & Coffee Chats",
            "source": "HERDSA",
            "url": "https://www.herdsa.org.au/special-interest-groups",
            "note": "Monthly meetings plus fortnightly Coffee and SoTL Chat drop-ins for peer support."
          },
          {
            "type": "read",
            "title": "TATAL (Talking About Teaching and Learning)",
            "source": "HERDSA",
            "url": "https://www.herdsa.org.au/",
            "note": "Small-group facilitated collegial discussions leading to Fellowship, SoTL projects, and publications."
          },
          {
            "type": "watch",
            "title": "Future Directions and Emerging Trends in SoTL",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=4_4qGF8oDa0",
            "note": "Where the global SoTL movement is headed."
          },
          {
            "type": "act",
            "title": "SoTL Methodology Matchmaker",
            "source": "NTLSN",
            "url": "#",
            "note": "Guide: aligning common SoTL questions with Action Research, Phenomenography, Critical Discourse Analysis, etc."
          }
        ]
      },
      {
        "id": "sotl-m4",
        "title": "Funding, Publishing, and Going Public",
        "description": "Grants, target journals, and making your SoTL visible.",
        "icon": "🚀",
        "resources": [
          {
            "type": "read",
            "title": "HERDSA Research Grants",
            "source": "HERDSA",
            "url": "https://herdsa.org.au/herdsa-grants-scheme",
            "note": "Up to $5,000 × 10 grants annually. One prioritised for Indigenous/First Nations applicants."
          },
          {
            "type": "read",
            "title": "CAULLT Project Grants",
            "source": "CAULLT",
            "url": "https://www.caullt.edu.au/grants/",
            "note": "Up to $10,000 for multi-institutional projects."
          },
          {
            "type": "read",
            "title": "Open Access, Preprints & Rights",
            "source": "NTLSN SoTL Hub",
            "url": "#",
            "note": "Preprint servers, open-access pathways, and rights tools for maximising SoTL impact."
          },
          {
            "type": "read",
            "title": "Aligning OEP with Academic Reward",
            "source": "CAUL OER Collective",
            "url": "https://www.caul.edu.au/programs-projects/open-educational-resources",
            "note": "How to leverage open licences and resource analytics for academic promotion."
          },
          {
            "type": "watch",
            "title": "Global Perspectives on SoTL",
            "source": "ISSoTL",
            "url": "https://www.youtube.com/watch?v=8rPb5fpYNNY",
            "note": "Cross-cultural and cross-national approaches to SoTL publication."
          },
          {
            "type": "read",
            "title": "ISSoTL Collaborative Writing Groups",
            "source": "ISSoTL",
            "url": "https://issotl.com/",
            "note": "Pre-conference workshops plus online collaboration producing a publishable manuscript for TLI."
          },
          {
            "type": "act",
            "title": "SoTL Journal Targeting Worksheet",
            "source": "NTLSN",
            "url": "#",
            "note": "Template: match your SoTL project with the best-fit journal based on scope, OA status, and APC."
          }
        ]
      }
    ]
  },
  {
    "id": "critical",
    "title": "Transformative & Critical Pedagogy",
    "subtitle": "Challenge the status quo and push institutional boundaries",
    "description": "Moving beyond standard constructive alignment to explore power, equity, and the systemic structures of higher education. Emancipatory models, decolonial methodologies, and the political economy of EdTech.",
    "icon": "🔥",
    "colour": "#d96650",
    "target": "Experienced educators, academic developers, curriculum designers, critical scholars",
    "modules": [
      {
        "id": "crit-m1",
        "title": "Emancipatory Students as Partners (SaP)",
        "description": "Beyond consultation: students as co-creators of university policy and curriculum.",
        "icon": "🤝",
        "resources": [
          {
            "type": "read",
            "title": "SaP Benchmarking Study — Sector-wide Audit",
            "source": "UniSC / La Trobe",
            "url": "https://doi.org/10.15173/ijsap.v9i1.5909",
            "note": "Dianati et al. (2025) — four-quadrant framework across 38 Australian universities."
          },
          {
            "type": "read",
            "title": "Five Propositions for Genuine SaP",
            "source": "University of Queensland",
            "url": "https://itali.uq.edu.au/teaching-guidance/students-partners",
            "note": "Essential empirical literature and guiding principles for ethical, power-sharing partnerships."
          },
          {
            "type": "watch",
            "title": "Partnering With Students on Teaching and Learning",
            "source": "ISSoTL / Peter Felten",
            "url": "https://www.youtube.com/watch?v=pPU4ckBBeEU",
            "note": "Students as partners in SoTL — Felten's foundational framing."
          },
          {
            "type": "read",
            "title": "UQ Student-Staff Partnerships",
            "source": "University of Queensland",
            "url": "https://itali.uq.edu.au/teaching-guidance/students-partners",
            "note": "Three-way emancipatory SaP model — Projects, Representation, Student Voice."
          },
          {
            "type": "read",
            "title": "WSU Partnership & Leadership",
            "source": "Western Sydney University",
            "url": "https://www.westernsydney.edu.au/studysmart/home",
            "note": "Emancipatory SaP model offering formal decision-making authority to students."
          },
          {
            "type": "read",
            "title": "International Journal for Students as Partners",
            "source": "McMaster University",
            "url": "https://mulpress.mcmaster.ca/ijsap",
            "note": "Open-access journal publishing scholarship on SaP practices internationally."
          },
          {
            "type": "act",
            "title": "SaP Maturity Self-Assessment",
            "source": "NTLSN",
            "url": "#",
            "note": "Rate your institution/course against the four SaP quadrants from Dianati et al. (2025)."
          }
        ]
      },
      {
        "id": "crit-m2",
        "title": "Decolonial Methodologies & Indigenising Curriculum",
        "description": "Moving beyond superficial inclusion toward actively dismantling colonial structures.",
        "icon": "🌏",
        "resources": [
          {
            "type": "read",
            "title": "Indigenising Curriculum Handbook",
            "source": "University of Queensland",
            "url": "https://espace.library.uq.edu.au/view/UQ:5b2fc50",
            "note": "Open textbook: pedagogies, community engagements, and discipline-specific resource development."
          },
          {
            "type": "read",
            "title": "Indigenising the Curriculum Benchmarking Study",
            "source": "UniSQ / CDU",
            "url": "https://doi.org/10.55146/ajie.v54i1.1073",
            "note": "Dianati & Bolt (2025) — sector-wide audit of Indigenising practices across 39 universities."
          },
          {
            "type": "read",
            "title": "Yindyamarra Winhanganha Framework",
            "source": "Charles Sturt University",
            "url": "https://www.csu.edu.au/research/indigenous-australian-studies",
            "note": "Holistic cultural shift anchoring Indigenisation in ethos-driven framework."
          },
          {
            "type": "read",
            "title": "Ngarrngga Project",
            "source": "University of Melbourne",
            "url": "https://ngarrngga.unimelb.edu.au/",
            "note": "High-quality PD modules for embedding Aboriginal and Torres Strait Islander knowledge systems."
          },
          {
            "type": "read",
            "title": "Core Cultural Learning",
            "source": "AIATSIS",
            "url": "https://aiatsis.gov.au/education/core",
            "note": "Foundation course for understanding Aboriginal and Torres Strait Islander cultures."
          },
          {
            "type": "watch",
            "title": "Indigenous Knowledges in Action",
            "source": "HERDSA / AAUT",
            "url": "https://www.youtube.com/watch?v=z1K2CPUQH_M",
            "note": "Practical examples of embedding Indigenous perspectives across disciplines."
          },
          {
            "type": "read",
            "title": "Murmuk Djerring Strategy 2023–2027",
            "source": "University of Melbourne",
            "url": "https://about.unimelb.edu.au/strategy/murmuk-djerring",
            "note": "391 pedagogical resources and seed grants for faculty-focused Indigenisation pilots."
          }
        ]
      },
      {
        "id": "crit-m3",
        "title": "The Political Economy of Digital Learning",
        "description": "Platform capitalism, OER, and resisting the commercialisation of education.",
        "icon": "💡",
        "resources": [
          {
            "type": "read",
            "title": "Digital Equity in Higher Education",
            "source": "Griffith University",
            "url": "https://www.griffith.edu.au/learning-futures",
            "note": "Research on digital equity strategies for ensuring equitable access to online learning."
          },
          {
            "type": "read",
            "title": "Open Educational Practice Grants",
            "source": "University of Southern Queensland",
            "url": "https://policy.unisq.edu.au/",
            "note": "Internal funding supporting renewable assessments and open textbooks."
          },
          {
            "type": "read",
            "title": "Textbook Minimisation Project",
            "source": "University of South Australia",
            "url": "https://www.unisa.edu.au/about-unisa/academic-unit/teaching-innovation-unit/",
            "note": "Institutional initiative generating $9M in student savings by transitioning to OER."
          },
          {
            "type": "read",
            "title": "CAUL Open Educational Resources Program",
            "source": "CAUL",
            "url": "https://www.caul.edu.au/programs-projects/open-educational-resources",
            "note": "National program leading sector-wide capability building to publish open textbooks."
          },
          {
            "type": "watch",
            "title": "Entangled Intelligence? Distributed Cognition & AI Agents",
            "source": "CRADLE (Deakin)",
            "url": "https://www.youtube.com/watch?v=c2zBhC2xFEo",
            "note": "Critical examination of AI-human cognition entanglement and assessment validity."
          },
          {
            "type": "read",
            "title": "Ecology of Open Educational Practice",
            "source": "University of Tasmania",
            "url": "https://figshare.utas.edu.au/",
            "note": "PhD research mapping environmental factors required to sustain open pedagogies."
          },
          {
            "type": "act",
            "title": "OER Audit for Your Course",
            "source": "NTLSN",
            "url": "#",
            "note": "Template: identify commercial textbook dependencies and map to available OER alternatives."
          }
        ]
      }
    ]
  },
  {
    "id": "frameworks",
    "title": "Teaching Frameworks & Quality Standards",
    "subtitle": "The architecture of quality teaching in Australian HE",
    "description": "A comprehensive guide to the frameworks, standards, and quality assurance systems that underpin teaching excellence in Australian higher education. From HESF compliance to Advance HE Fellowships and UDL 3.0.",
    "icon": "🏗️",
    "colour": "#c9a962",
    "target": "All teaching staff, academic developers, quality assurance teams, program directors",
    "modules": [
      {
        "id": "frame-m1",
        "title": "National Regulatory Frameworks",
        "description": "HESF, AQF, TEQSA, and the new ATEC landscape.",
        "icon": "🏛️",
        "resources": [
          {
            "type": "read",
            "title": "Higher Education Standards Framework (HESF) 2021",
            "source": "TEQSA",
            "url": "https://www.legislation.gov.au/F2021L00488/latest/text-2021",
            "note": "The regulatory backbone — seven domains covering student participation, learning environment, teaching, and more."
          },
          {
            "type": "read",
            "title": "Australian Qualifications Framework (AQF)",
            "source": "Dept of Education",
            "url": "https://www.aqf.edu.au/",
            "note": "Credential levels 1–10, defining learning outcomes for every qualification type."
          },
          {
            "type": "read",
            "title": "National Microcredentials Framework",
            "source": "Dept of Education",
            "url": "https://www.education.gov.au/higher-education-publications/resources/national-microcredentials-framework",
            "note": "Framework for flexible, stackable credentials — key Accord recommendation."
          },
          {
            "type": "read",
            "title": "ATEC — Australian Tertiary Education Commission",
            "source": "Dept of Education",
            "url": "https://www.education.gov.au/australian-tertiary-education-commission",
            "note": "The new system steward for HE and VET (TEQSA remains the regulator) &mdash; interim from 1 July 2025, statutory in 2026. Bill passed the Senate 30 March 2026."
          },
          {
            "type": "watch",
            "title": "TEQSA Talks: Deepfakes & Academic Integrity",
            "source": "TEQSA",
            "url": "https://www.youtube.com/watch?v=eJyGnY7dSjU",
            "note": "Regulatory perspectives on emerging integrity threats in assessment."
          },
          {
            "type": "read",
            "title": "Universities Accord Final Report",
            "source": "Dept of Education",
            "url": "https://www.education.gov.au/australian-universities-accord/resources/final-report",
            "note": "The 2024 sector reform blueprint — 47 recommendations reshaping Australian HE."
          }
        ]
      },
      {
        "id": "frame-m2",
        "title": "Professional Standards Framework (PSF 2023)",
        "description": "Advance HE Fellowships and the global benchmark for teaching recognition.",
        "icon": "🎓",
        "resources": [
          {
            "type": "read",
            "title": "Professional Standards Framework 2023",
            "source": "Advance HE",
            "url": "https://www.advance-he.ac.uk/teaching-and-learning/psf",
            "note": "Five dimensions: professional values, core knowledge, areas of activity, and two cross-cutting themes."
          },
          {
            "type": "read",
            "title": "Associate Fellow (AFHEA)",
            "source": "Advance HE",
            "url": "https://www.advance-he.ac.uk/fellowship/associate-fellowship",
            "note": "Entry-level recognition — ideal for casuals and early career academics."
          },
          {
            "type": "read",
            "title": "Fellow (FHEA)",
            "source": "Advance HE",
            "url": "https://www.advance-he.ac.uk/fellowship/fellowship",
            "note": "Standard recognition for academics with a broad understanding of teaching effectiveness."
          },
          {
            "type": "read",
            "title": "Senior Fellow (SFHEA)",
            "source": "Advance HE",
            "url": "https://www.advance-he.ac.uk/fellowship/senior-fellowship",
            "note": "For those with sustained leadership in teaching excellence."
          },
          {
            "type": "read",
            "title": "Principal Fellow (PFHEA)",
            "source": "Advance HE",
            "url": "https://www.advance-he.ac.uk/fellowship/principal-fellowship",
            "note": "Strategic leadership in HE teaching at institutional/sector level."
          },
          {
            "type": "watch",
            "title": "Advance HE Elevate: AI-Enabled Assessment",
            "source": "Advance HE",
            "url": "https://www.youtube.com/watch?v=WyEQpRglVWI",
            "note": "Spotlight session on AI-enabled assessment from the Australasia series."
          },
          {
            "type": "act",
            "title": "PSF 2023 Self-Mapping Workbook",
            "source": "NTLSN",
            "url": "#",
            "note": "Structured workbook: map your teaching practice against all five PSF dimensions."
          }
        ]
      },
      {
        "id": "frame-m3",
        "title": "Universal Design for Learning (UDL 3.0)",
        "description": "CAST's updated framework for designing flexible, inclusive learning experiences.",
        "icon": "♿",
        "resources": [
          {
            "type": "read",
            "title": "UDL Guidelines 3.0",
            "source": "CAST",
            "url": "https://udlguidelines.cast.org/",
            "note": "The definitive UDL framework — engagement, representation, action & expression. Updated 2024."
          },
          {
            "type": "read",
            "title": "Universal Design for Learning Module",
            "source": "Macquarie University",
            "url": "https://www.mq.edu.au/about/about-the-university/governance/university-policies",
            "note": "Self-paced professional learning module for implementing UDL in teaching."
          },
          {
            "type": "read",
            "title": "Designing More Inclusive Assessment",
            "source": "University of Melbourne",
            "url": "https://melbourne-cshe.unimelb.edu.au/",
            "note": "UDL principles applied to provide multiple assessment modalities."
          },
          {
            "type": "read",
            "title": "UDL in Tertiary Education Program",
            "source": "University of Wollongong",
            "url": "https://www.uow.edu.au/about/learning-teaching/",
            "note": "Online self-paced program for increasing understanding of UDL in HE."
          },
          {
            "type": "read",
            "title": "Universal Design for Learning Repository",
            "source": "ADCET",
            "url": "https://www.adcet.edu.au/inclusive-teaching/universal-design-for-learning",
            "note": "National peak repository of podcasts, webinars, and checklists supporting UDL."
          },
          {
            "type": "read",
            "title": "Accessible Assessment and Pedagogies",
            "source": "Queensland University of Technology",
            "url": "https://www.qut.edu.au/about/our-university/faculties-and-schools/faculty-of-creative-industries-education-and-social-justice/research/c4ie",
            "note": "Research-driven resources from QUT's Centre for Inclusive Education (C4IE)."
          },
          {
            "type": "act",
            "title": "UDL 3.0 Course Audit Template",
            "source": "NTLSN",
            "url": "#",
            "note": "Audit your course against the three UDL principles — engagement, representation, action & expression."
          }
        ]
      },
      {
        "id": "frame-m4",
        "title": "AAUT Teaching Criteria & Peer Review",
        "description": "National teaching awards criteria and evidence-based peer review of teaching.",
        "icon": "🏆",
        "resources": [
          {
            "type": "read",
            "title": "AAUT Teaching Criteria & Standards",
            "source": "Universities Australia",
            "url": "https://www.universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/",
            "note": "National criteria used for AAUT awards and institutional promotion standards."
          },
          {
            "type": "read",
            "title": "Peer Review of Teaching Guidelines",
            "source": "University of Tasmania",
            "url": "https://www.utas.edu.au/learning-teaching",
            "note": "Comprehensive tools for developmental and formative peer reviews of teaching practice."
          },
          {
            "type": "read",
            "title": "Peer Observation of Teaching",
            "source": "University of Queensland",
            "url": "https://itali.uq.edu.au/teaching-guidance/peer-review-teaching",
            "note": "Developmental, non-punitive frameworks for peer teaching reviews."
          },
          {
            "type": "read",
            "title": "Quality Teaching Model (PRoT)",
            "source": "University of Newcastle",
            "url": "https://www.newcastle.edu.au/current-staff/teaching-and-learning",
            "note": "Evidence-based pedagogical framework for conducting peer observation."
          },
          {
            "type": "read",
            "title": "Peer Review of Teaching Hub",
            "source": "University of Sydney",
            "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/using-peer-review-as-evidence-and-improvement-of-your-teaching/",
            "note": "Cross-disciplinary resources supporting structured peer review."
          },
          {
            "type": "read",
            "title": "ACODE Benchmarks",
            "source": "ACODE",
            "url": "https://acode.edu.au/",
            "note": "Eight benchmarks for technology-enhanced learning and teaching across Australasia."
          },
          {
            "type": "act",
            "title": "Peer Review Planning Template",
            "source": "NTLSN",
            "url": "#",
            "note": "Pre-observation agreement, observation sheet, and post-review reflection template."
          }
        ]
      }
    ]
  }
];

/** Total curated resources across all pathways (126 at extraction). */
export const PATHWAY_RESOURCE_COUNT = PATHWAYS.reduce(
  (sum, p) => sum + p.modules.reduce((s, m) => s + m.resources.length, 0),
  0,
);

/** Total modules across all pathways (19 at extraction). */
export const PATHWAY_MODULE_COUNT = PATHWAYS.reduce(
  (sum, p) => sum + p.modules.length,
  0,
);
