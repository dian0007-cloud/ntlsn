/**
 * "Teaching Resources from Across the Sector" data for #teaching-resources —
 * 184 curated university resources across 14 themes, extracted
 * verbatim from the production bundle (assets/app.b38bc4ca.js: the flat
 * resource array plus the theme-emoji and theme-description maps). Curated
 * site content; all counts in the component are derived from here.
 */

export interface TeachingResource {
  name: string;
  institution: string;
  description: string;
  url: string;
  theme: string;
}

export interface TeachingTheme {
  theme: string;
  icon: string;
  description: string;
  resources: TeachingResource[];
  count: number;
}

export const THEME_ICONS: Readonly<Record<string, string>> = {
  "Assessment": "📝",
  "Curriculum Design": "🏗️",
  "Digital Learning": "💻",
  "Academic Development": "🎓",
  "Inclusive Practice": "🤝",
  "Indigenising Curriculum": "🌿",
  "Peer Review of Teaching": "🔍",
  "Students as Partners": "👥",
  "SoTL Ecosystems": "🔬",
  "Early Assessment & PASS": "🎯",
  "Microcredentials": "🏅",
  "Open Educational Practices": "📖",
  "Advance HE & Mentoring": "🧭",
  "Assessment & Feedback": "💬"
};

export const THEME_DESCRIPTIONS: Readonly<Record<string, string>> = {
  "Assessment": "Authentic, formative, and standards-based assessment design",
  "Curriculum Design": "Constructive alignment, program architecture, and learning design",
  "Digital Learning": "Technology-enhanced learning, LMS innovation, and digital pedagogy",
  "Academic Development": "Professional learning, PD frameworks, and scholarly development",
  "Inclusive Practice": "UDL, accessibility, equity, and culturally responsive teaching",
  "Indigenising Curriculum": "First Nations knowledges, cultural safety, and decolonising practice",
  "Peer Review of Teaching": "Collegial review, teaching observation, and feedback frameworks",
  "Students as Partners": "Student partnership, co-creation, and student voice in learning",
  "SoTL Ecosystems": "Research into practice, scholarly communities, and SoTL infrastructure",
  "Early Assessment & PASS": "Early intervention, PASS/PAL programs, and diagnostic assessment",
  "Microcredentials": "Stackable credentials, digital badges, and flexible learning pathways",
  "Open Educational Practices": "OER, open pedagogy, and open access educational resources",
  "Advance HE & Mentoring": "Fellowship, HEA accreditation, mentoring programs, and PSF",
  "Assessment & Feedback": "Feedback design, assessment literacy, and student-centred feedback"
};

export const TEACHING_RESOURCES: readonly TeachingResource[] = [
  {
    "name": "Essentials of Contemporary Assessment",
    "institution": "Monash University",
    "description": "A comprehensive professional learning module exploring assessment as learning, for learning, and of learning, designed to promote student agency.",
    "url": "https://www.monash.edu/learning-teaching/resources/mea-modules-r/essentials-of-contemporary-assessment",
    "theme": "Assessment"
  },
  {
    "name": "Programmatic Approaches to Assessment",
    "institution": "Monash University",
    "description": "Strategic resources detailing the PAAIR model and the application of longitudinal, programmatic assessment across the degree curriculum.",
    "url": "https://www.monash.edu/learning-teaching/teachhq/Assessment/PAAIR/programmatic-approaches-to-assessment",
    "theme": "Assessment"
  },
  {
    "name": "Interactive Oral Assessments Guide",
    "institution": "University of Melbourne",
    "description": "A robust framework for designing, implementing, and constructively aligning IOAs to combat academic misconduct and enhance validity.",
    "url": "https://melbourne-cshe.unimelb.edu.au/resources/topics/assessment-and-feedback/specific-help/interactive-oral-assessments",
    "theme": "Assessment"
  },
  {
    "name": "Smart Assessment Design Toolkit",
    "institution": "Western Sydney University",
    "description": "Discipline-specific pedagogical advice and toolkits for designing authentic assessments and structuring alternative assessment formats.",
    "url": "https://www.westernsydney.edu.au/learning-futures/teaching-support/smart-assessment-design-toolkit",
    "theme": "Assessment"
  },
  {
    "name": "EDA Assessment Framework",
    "institution": "Deakin University",
    "description": "The Empowering-Developing-Assuring framework designed to foster cutting-edge educational practices in a GenAI-enabled academic world.",
    "url": "https://dteach.deakin.edu.au/curriculum-design/",
    "theme": "Assessment"
  },
  {
    "name": "Programmatic Assessment in the SCM",
    "institution": "Southern Cross University",
    "description": "Systematic, programmatic guidelines for evaluating student learning across a course using triangulated, cumulative data points.",
    "url": "https://www.scu.edu.au/staff/teaching-and-learning/curriculum-development/assess/",
    "theme": "Assessment"
  },
  {
    "name": "Everyday Innovation in Assessment",
    "institution": "University of Sydney",
    "description": "Educator case studies detailing practical implementations of student co-design and peer-assessed tutorial participation frameworks.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/everyday-innovation-in-assessment/",
    "theme": "Assessment"
  },
  {
    "name": "Power of Group Assessment Workshops",
    "institution": "Australian National University",
    "description": "Guidance and structural methodologies for designing collaborative learning experiences that simulate real-world professional requirements.",
    "url": "https://learningandteaching.anu.edu.au/blog/unlocking-the-power-of-group-assessment/",
    "theme": "Assessment"
  },
  {
    "name": "Assessment Design Principles",
    "institution": "Charles Sturt University",
    "description": "Eleven core university principles ensuring all assessments are valid, authentic, inclusive, explicit, and aligned to professional knowledge.",
    "url": "https://www.csu.edu.au/division/learning-teaching/framework-and-policy/charles-sturt-curriculum-model",
    "theme": "Assessment"
  },
  {
    "name": "Good Practice Guide: Authentic Learning",
    "institution": "Flinders University",
    "description": "A systematic four-step process for designing authentic assessments focused on disciplinary contexts, worthwhile tasks, and student judgement.",
    "url": "https://staff.flinders.edu.au/learning-teaching/good-practice-guides/gpg-student-authentic-learning",
    "theme": "Assessment"
  },
  {
    "name": "Pre-submission Peer Review",
    "institution": "RMIT University",
    "description": "Collaborative frameworks where students provide constructive feedback on peers' drafts prior to final submission, fostering diverse perspectives.",
    "url": "https://learninglab.rmit.edu.au/university-essentials/study-essentials/peer-review-in-assignments/",
    "theme": "Assessment"
  },
  {
    "name": "Self & Peer Assessment (SaPA)",
    "institution": "University of New England",
    "description": "Methodology allowing students to provide qualitative and quantitative feedback on peer contribution in summative team tasks.",
    "url": "https://symposium.une.edu.au/presentation/self-and-peer-assessment-for-summative-team-tasks/",
    "theme": "Assessment"
  },
  {
    "name": "Exams and eAssessment Platform",
    "institution": "University of New England",
    "description": "Technical and administrative platform guidelines for delivering supervised digital assessments and alternative assessments.",
    "url": "https://www.une.edu.au/diged/exams-and-e-assessment",
    "theme": "Assessment"
  },
  {
    "name": "Rules for Using AI in Assessment",
    "institution": "University of Queensland",
    "description": "Centralised resources governing the deployment of generative AI tools and academic integrity frameworks across assessment.",
    "url": "https://itali.uq.edu.au/teaching-guidance/generative-ai-teaching-learning-and-assessment/rules-using-ai-assessment",
    "theme": "Assessment"
  },
  {
    "name": "IOA Implementation Symposium",
    "institution": "University of Melbourne",
    "description": "Symposium proceedings and resources detailing lessons learned from implementing Interactive Oral Assessments across diverse disciplinary contexts.",
    "url": "https://melbourne-cshe.unimelb.edu.au/events/symposia-on-higher-education-research-informed-practice/interactive-oral-assessment",
    "theme": "Assessment"
  },
  {
    "name": "Fundamentals of Programmatic Assessment",
    "institution": "Monash University",
    "description": "Professional learning module providing foundational understanding of programmatic assessment principles using Fink's Taxonomy for cognitive and affective learning mapping.",
    "url": "https://www.monash.edu/learning-teaching/resources/mea-modules-r/programmatic-approaches-to-assessment",
    "theme": "Assessment"
  },
  {
    "name": "Assessment Policy",
    "institution": "La Trobe University",
    "description": "Overarching institutional assessment policy governing assessment design, moderation, and academic integrity standards across all courses and programs.",
    "url": "https://policies.latrobe.edu.au/document/view.php?id=216",
    "theme": "Assessment"
  },
  {
    "name": "Analytics and Assessment Research",
    "institution": "Monash University",
    "description": "Medical Education Research and Quality unit investigating psychometric validation tools for assessing professionalism in pre-clinical students.",
    "url": "https://www.monash.edu/medicine/sphpm/merq/research/research-pillars/analytics-and-assessment",
    "theme": "Assessment"
  },
  {
    "name": "Assessment Resources Hub",
    "institution": "Flinders University",
    "description": "Central assessment hub providing evidence-based guidance on assessment design, moderation, feedback practices, and academic integrity standards.",
    "url": "https://staff.flinders.edu.au/learning-teaching/assessment",
    "theme": "Assessment"
  },
  {
    "name": "DeakinDesign Principles and Practices",
    "institution": "Deakin University",
    "description": "The foundational institutional model of digital education guiding holistic, authentic, and collaboratively integrated learning design.",
    "url": "https://dteach.deakin.edu.au/curriculum-design/deakin-design-principles-and-practices/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Course Design and Constructive Alignment",
    "institution": "Southern Cross University",
    "description": "Practical toolkits, including the CAM spreadsheet, enabling educators to map CLOs to ULOs to ensure rigorous constructive alignment.",
    "url": "https://www.scu.edu.au/staff/teaching-and-learning/curriculum-development/design/course-design/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Visual Methods for Curriculum Design",
    "institution": "Australian National University",
    "description": "Resources detailing visual mapping methodologies (e.g., the ABC method) and tools to analyse the pedagogical mix of learning activities.",
    "url": "https://learningandteaching.anu.edu.au/blog/getting-a-birds-eye-view-of-your-course/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Interprofessional Education Curriculum",
    "institution": "Curtin University",
    "description": "A specialised first-year core curriculum designed to experientially foster collaborative practice across diverse health science disciplines.",
    "url": "https://www.curtin.edu.au/about/learning-teaching/health-sciences/about/interprofessional-education/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Education Framework and CAPs",
    "institution": "Charles Sturt University",
    "description": "Curriculum Architecture Principles developed to align the overarching structure of courses directly with AQF and institutional strategy.",
    "url": "https://www.csu.edu.au/division/learning-teaching/framework-and-policy/education-framework",
    "theme": "Curriculum Design"
  },
  {
    "name": "Australian University Teaching Criteria & Standards",
    "institution": "OLT · Curtin/ECU/Murdoch/Notre Dame/UWA",
    "description": "Seven criteria of quality teaching with indicative standards by academic level (A–E) — the national reference framework for teaching promotion and recognition. CC BY-SA 3.0.",
    "url": "https://uniteachingcriteria.edu.au/",
    "theme": "Academic Development"
  },
  {
    "name": "Curriculum Transformation Model",
    "institution": "University of Wollongong",
    "description": "A comprehensive, strategic approach optimising curriculum structure around transition pedagogy and the embedding of foundational skills.",
    "url": "https://www.uow.edu.au/about/learning-teaching/curriculum-transformation/curriculum-model/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Curriculum Design Accelerator",
    "institution": "Flinders University",
    "description": "Intensive, targeted workshops addressing the integration of Work Integrated Learning (WIL), globalisation, and professional accreditation.",
    "url": "https://staff.flinders.edu.au/learning-teaching/curriculum-design-accelerator",
    "theme": "Curriculum Design"
  },
  {
    "name": "FLIPCurric Toolkit",
    "institution": "Western Sydney University",
    "description": "A specialised toolkit dedicated to facilitating flipped curriculum methodologies, optimising both asynchronous study and face-to-face contact.",
    "url": "https://www.westernsydney.edu.au/learning-futures/teaching-support/smart-assessment-design-toolkit",
    "theme": "Curriculum Design"
  },
  {
    "name": "Curriculum Map (CMAP)",
    "institution": "UNSW Sydney",
    "description": "A centralised digital curriculum mapping application used to track and ensure rigorous academic alignment across programs.",
    "url": "https://cmap.teaching.unsw.edu.au/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Models of Engaged Learning (MELT)",
    "institution": "University of Adelaide",
    "description": "Frameworks featuring six facets of thinking to scaffold complex student cognition and active learning routines across disciplines.",
    "url": "https://melt.adelaide.edu.au/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Block Model Delivery Research",
    "institution": "Victoria University",
    "description": "Systematic pedagogical foundations and five-step design processes of Block delivery to enhance student agency and cohort belonging.",
    "url": "https://vuir.vu.edu.au/47420/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Real World Learning Vision",
    "institution": "Queensland University of Technology",
    "description": "Policy mandating authentic real-world learning, Work Integrated Learning (WIL), and Indigenous perspectives across all QUT courses.",
    "url": "https://mopp.qut.edu.au/document/view.php?id=129",
    "theme": "Curriculum Design"
  },
  {
    "name": "CloudFirst Learning Design",
    "institution": "Deakin University",
    "description": "Default blueprint for online module creation informed by Laurillard's conversational learning theory, optimising student-teacher-peer interactions.",
    "url": "https://cloudfirst.deakin.edu.au/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Four-Component Instructional Design (4C/ID)",
    "institution": "University of Melbourne",
    "description": "Whole-task approach for engineering complex postgraduate curricula to support transfer of cognitive skills into varied real-world contexts.",
    "url": "https://www.unimelb.edu.au/tli/showcase/applying-four-component-instructional-design-to-the-master-of-public-health",
    "theme": "Curriculum Design"
  },
  {
    "name": "Models of Engagement and Assessment",
    "institution": "Charles Sturt University",
    "description": "Structured university-wide approach guaranteeing consistent expectations regarding delivery, engagement, and assessment across all study modalities.",
    "url": "https://www.csu.edu.au/division/learning-teaching/strategic-projects/models-of-engagement",
    "theme": "Curriculum Design"
  },
  {
    "name": "Curriculum and Assessment Resources",
    "institution": "Macquarie University",
    "description": "TECHE teaching development resources focused on curriculum design methodologies and contemporary assessment practices across disciplines.",
    "url": "https://teche.mq.edu.au/teachingdevelopment/curriculum-and-assessment/",
    "theme": "Curriculum Design"
  },
  {
    "name": "Student-Centred Learning Guide",
    "institution": "Flinders University",
    "description": "Good practice guide supporting educators in designing student-centred learning environments that prioritise active engagement and learner autonomy.",
    "url": "https://staff.flinders.edu.au/learning-teaching/good-practice-guides/gpg-student-centered",
    "theme": "Curriculum Design"
  },
  {
    "name": "ACODE Whitepapers and Benchmarks",
    "institution": "ACODE",
    "description": "Peak body reports and benchmarks regarding AI governance, virtual collaboration, learning modalities, and micro-credentialing practices.",
    "url": "https://acode.edu.au/resources/acode-white-papers/",
    "theme": "Digital Learning"
  },
  {
    "name": "Enhancing Canvas Designs Guide",
    "institution": "University of Sydney",
    "description": "Advanced technical guides for utilising flexboxes, padboxes, and responsive grids to significantly improve UX and information design in Canvas.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/enhancing-canvas-designs-using-flexboxes-pad-boxes-feedwind-enhance-canvas-sites/",
    "theme": "Digital Learning"
  },
  {
    "name": "Digital Learning Guidelines (FLO)",
    "institution": "Flinders University",
    "description": "Structural, evidence-based layout guidelines for Flinders Learning Online to ensure visual consistency, reduce cognitive load, and guarantee baseline quality.",
    "url": "https://staff.flinders.edu.au/learning-teaching/digital-learning",
    "theme": "Digital Learning"
  },
  {
    "name": "Open Educational Resources (OER)",
    "institution": "University of Technology Sydney",
    "description": "Explicit strategies and repository links for finding, evaluating, and adopting open textbooks to replace commercial publisher materials.",
    "url": "https://lx.uts.edu.au/resources/use-",
    "theme": "Digital Learning"
  },
  {
    "name": "H5P Interactive Content Guide",
    "institution": "Australian National University",
    "description": "Pedagogical resources on leveraging H5P for formative self-assessment, automated feedback loops, and highly interactive digital engagement.",
    "url": "https://learningandteaching.anu.edu.au/blog/h5p/",
    "theme": "Digital Learning"
  },
  {
    "name": "Learning@Griffith Service Catalogue",
    "institution": "Griffith University",
    "description": "Detailed service parameters outlining the digital learning ecosystem, including Blackboard integration, Turnitin support, and incident management.",
    "url": "https://www.griffith.edu.au/digital-solutions/service-catalogue/learning-teaching-research-technologies/learning-at-griffith",
    "theme": "Digital Learning"
  },
  {
    "name": "Creator Space and Media Room",
    "institution": "University of Western Australia",
    "description": "Dedicated physical and technological facilities designed for the creation of dynamic, high-quality educational video and audio content.",
    "url": "https://www.news.uwa.edu.au/archive/2018040510505/creator-space/",
    "theme": "Digital Learning"
  },
  {
    "name": "QUT Open Press (OER)",
    "institution": "Queensland University of Technology",
    "description": "Open educational resources, texts, and journals to support equitable access to scholarly materials and foster sustainable sharing.",
    "url": "https://www.library.qut.edu.au/openpress/about/",
    "theme": "Digital Learning"
  },
  {
    "name": "Digital Equity in Higher Education",
    "institution": "Griffith University",
    "description": "Research examining the increasing significance of digital equity in higher education and strategies for ensuring equitable access to online learning.",
    "url": "https://research-repository.griffith.edu.au/bitstreams/0c6e457d-2969-45cc-b4c2-454989f067a2/download",
    "theme": "Digital Learning"
  },
  {
    "name": "Centre for Learning and Teaching",
    "institution": "University of the Sunshine Coast",
    "description": "Institutional support centre managing Canvas, Turnitin, and PebblePad ePortfolios to enable robust digital learning ecosystems for students and staff.",
    "url": "https://www.unisc.edu.au/about/learning-and-teaching-at-unisc/learning-and-teaching-support-centre-for-learning-and-teaching",
    "theme": "Digital Learning"
  },
  {
    "name": "Teaching Capabilities Framework",
    "institution": "Charles Sturt University",
    "description": "A sophisticated self-assessment tool allowing staff to gauge their pedagogical progress and explicitly align career planning with university strategy.",
    "url": "https://www.csu.edu.au/division/learning-teaching/framework-and-policy/teaching-capabilities-framework-and-self-assessment-tool",
    "theme": "Academic Development"
  },
  {
    "name": "The Pitch Innovation Scheme",
    "institution": "Monash University",
    "description": "A competitive funding initiative run by the Monash Education Academy supporting the development and scaling of cross-faculty educational innovations.",
    "url": "https://www.monash.edu/learning-teaching/awards-and-recognition/the-pitch-2024",
    "theme": "Academic Development"
  },
  {
    "name": "Education Excellence 3-Minute Story",
    "institution": "Monash University",
    "description": "A streamlined, highly structured developmental pathway assisting educators in translating teaching narratives into formal VC or AAUT award applications.",
    "url": "https://www.monash.edu/learning-teaching/awards-and-recognition/education-excellence-3-minute-story",
    "theme": "Academic Development"
  },
  {
    "name": "Communities of Practice (CoPs)",
    "institution": "University of Western Australia",
    "description": "Multidisciplinary, collaborative groups structurally supported by the Educational Enhancement Unit to share knowledge and drive grassroots teaching innovation.",
    "url": "https://www.news.uwa.edu.au/archive/2019121811796/communities-practice-bring-greater-collaboration-across-campus/",
    "theme": "Academic Development"
  },
  {
    "name": "WATTLE Forum",
    "institution": "University of Wollongong",
    "description": "An annual, high-profile symposium showcasing VC's Learning and Teaching Innovation Grant projects and exploring emerging pedagogies like GenAI.",
    "url": "https://www.uow.edu.au/about/learning-teaching/wattle/forum/",
    "theme": "Academic Development"
  },
  {
    "name": "Citations for Outstanding Contributions",
    "institution": "James Cook University",
    "description": "Rigorous application guidelines and administrative pathways for institutional citations recognising staff impact on student learning and engagement.",
    "url": "https://www.jcu.edu.au/edqs/pd-and-recognition/awards-and-citations/jcu-citations-for-outstanding-contributions-to-student-learning/2024_JCU-Citation-Application-Guidelines_20240319.pdf",
    "theme": "Academic Development"
  },
  {
    "name": "TECHE Blog",
    "institution": "Macquarie University",
    "description": "An institutional learning and teaching community blog sharing curriculum resources, professional learning events, and deep academic insights.",
    "url": "https://teche.mq.edu.au/2023/04/building-the-foundations-for-an-inclusive-teaching-approach-at-mq/",
    "theme": "Academic Development"
  },
  {
    "name": "eVALU8 Survey Procedures",
    "institution": "University of the Sunshine Coast",
    "description": "Institutional procedures governing the standardised student evaluation of courses and teaching to identify areas needing developmental support.",
    "url": "https://www.unisc.edu.au/about/policies-and-procedures/student-evaluation-of-courses-and-teaching-procedures",
    "theme": "Academic Development"
  },
  {
    "name": "Academic Practice Certificate",
    "institution": "James Cook University",
    "description": "Postgraduate subject embedding SoTL and action research directly into academic professional development and critical reflection.",
    "url": "https://handbook.jcu.edu.au/subject/2025/ed5304",
    "theme": "Academic Development"
  },
  {
    "name": "Developing an Academic Portfolio",
    "institution": "University of Technology Sydney",
    "description": "Guidelines advising academics to embed deep critical reflection, documentary evidence, and self-evaluations of impact on student learning.",
    "url": "https://www.uts.edu.au/about/uts-vision/teaching/scholarship-and-research/developing-academic-portfolio",
    "theme": "Academic Development"
  },
  {
    "name": "CAULLT Leadership Network",
    "institution": "CAULLT",
    "description": "The Council of Australasian University Leaders in Learning and Teaching serves as the peak professional body providing strategic direction, grant funding, and community building for academic leaders.",
    "url": "https://www.caullt.edu.au/executive-committee/",
    "theme": "Academic Development"
  },
  {
    "name": "Benchmarking Standards for Academic Development",
    "institution": "CAULLT / Macquarie University",
    "description": "CAULLT-funded project (Harvey, Hamilton & Adam, 2024) establishing evidence-based benchmarking standards from 100 good practice exemplars across 40 Australasian universities. Four criteria, ten standards with descriptors.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Establishing-Benchmarking-Standards-for-Academic-Development-CAULLT-final-grant-report.pdf",
    "theme": "Academic Development"
  },
  {
    "name": "SET Fairness in Regional Universities",
    "institution": "CAULLT / University of the Sunshine Coast",
    "description": "CAULLT-funded project (Crimmins et al., 2024) investigating how L&T leaders at regional universities employ student evaluations of teaching, with a Good Practice Guide for mitigating bias.",
    "url": "https://www.caullt.edu.au/investigating-how-leaders-in-lt-units-across-australian-regional-universities-employ-set-to-ensure-fairness-and-optimise-their-lt-benefit/",
    "theme": "Assessment & Feedback"
  },
  {
    "name": "Hybrid Learning Spaces: Practical Guide",
    "institution": "CAULLT / Southern Cross University",
    "description": "CAULLT-funded practical guide for effective hybrid teaching co-designed with educators and students at regional universities.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/A-practical-guide-to-effective-hybrid-teaching-and-learning-plus-appendices.pdf",
    "theme": "Digital Learning"
  },
  {
    "name": "Australasian HE Microcredentialing Framework",
    "institution": "CAULLT / Navitas",
    "description": "CAULLT-funded project (Saliba et al., 2022) exploring NZ microcredentialing framework alignment to professional learning across 5 Australian institutions and the CAUT MOOC.",
    "url": "https://www.caullt.edu.au/towards-a-common-transferable-australasian-higher-education-micro-credentialing-framework-for-professional-learning-in-teaching-learning-and-leadership/",
    "theme": "Academic Development"
  },
  {
    "name": "L&T Academies: Promoting Excellence",
    "institution": "CAULLT / Curtin University",
    "description": "CAULLT-funded project (Evamy et al.) scoping the role and contributions of Learning and Teaching Academies alongside institutional L&T Centres, with resources for implementation.",
    "url": "https://www.caullt.edu.au/promoting-and-celebrating-excellence-in-learning-and-teaching-a-collaborative-and-cross-institutional-project-exploring-the-role-and-contributions-of-learning-and-teaching-academies/",
    "theme": "Academic Development"
  },
  {
    "name": "AAUT Award Winners",
    "institution": "Monash University",
    "description": "Archive of Australian Awards for University Teaching winners providing benchmarks and exemplars for outstanding contributions to student learning.",
    "url": "https://www.monash.edu/learning-teaching/awards-and-recognition/aaut/aaut-winners",
    "theme": "Academic Development"
  },
  {
    "name": "Science and Society Network Grants",
    "institution": "Deakin University",
    "description": "Interdisciplinary grants program funding evaluations of AI in higher education assessment and co-design approaches to healthcare feedback.",
    "url": "https://scienceandsocietynetwork.deakin.edu.au/grants/",
    "theme": "Academic Development"
  },
  {
    "name": "HERDSA Educational Organisations",
    "institution": "HERDSA",
    "description": "Directory of educational organisations within Australia providing a comprehensive overview of peak bodies, networks, and professional associations supporting higher education.",
    "url": "https://herdsa.org.au/educational-organisations-within-australia",
    "theme": "Academic Development"
  },
  {
    "name": "TEQSA Good Practice Notes",
    "institution": "TEQSA",
    "description": "Searchable collection of good practice notes from the Tertiary Education Quality and Standards Agency guiding institutional compliance and quality assurance.",
    "url": "https://www.teqsa.gov.au/guides-resources/search-resources/good-practice-notes-search?page=9",
    "theme": "Academic Development"
  },
  {
    "name": "BLASST Good Practice Awards",
    "institution": "BLASST",
    "description": "Benchmarking Leadership and Advancement of Standards for Sessional Teaching awards highlighting mentoring programs for sessional staff and HDR students.",
    "url": "https://blasst.edu.au/good-practice/good-practice-awards-2013/",
    "theme": "Academic Development"
  },
  {
    "name": "ACU Professional Societies",
    "institution": "Australian Catholic University",
    "description": "Guide to professional societies for higher education teachers linking institutional academic development to national networks like CAULLT and HERDSA.",
    "url": "https://staff.acu.edu.au/our_university/centre-for-education-and-innovation/scholarly-development-and-recognition/professional-and-scholarly-learning/professional-societies-for-higher-education-teachers",
    "theme": "Academic Development"
  },
  {
    "name": "Designing Inclusive Student Experiences: Advancing Diversity in Higher Education",
    "institution": "AAUT & HERDSA",
    "description": "National webinar (May 2026) on designing inclusive student experiences and advancing diversity in HE — panel chaired by A/Prof Janis Wardrop (UNSW) with panellists from ANU, UTS and JCU.",
    "url": "https://www.youtube.com/watch?v=bIaHIfKBz5g",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Designing More Inclusive Assessment",
    "institution": "University of Melbourne",
    "description": "Comprehensive guidelines based on UDL principles to provide multiple assessment modalities and circumvent the need for reactive disability adjustments.",
    "url": "https://melbourne-cshe.unimelb.edu.au/resources/topics/designing-for-learning/specific-help/designing-more-inclusive-assessment",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Universal Design for Learning Module",
    "institution": "Macquarie University",
    "description": "A self-paced professional learning module focusing extensively on designing, developing, and implementing UDL within everyday teaching practices.",
    "url": "https://teche.mq.edu.au/2023/05/universal-design-for-learning/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Students Explain Digital Accessibility",
    "institution": "University of Technology Sydney",
    "description": "A suite of video resources co-created with Digital Accessibility Ambassadors detailing the lived, practical experience of digital learning barriers.",
    "url": "https://lx.uts.edu.au/blog/2021/04/14/students-explain-stop-speaking-into-a-black-abyss/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Cisco Academy for the Vision Impaired",
    "institution": "Curtin University",
    "description": "A highly specialised IT and networking curriculum utilising advanced adaptive learning methods tailored specifically for vision-impaired students.",
    "url": "https://www.curtin.edu.au/about/learning-teaching/science-engineering/school-of-electrical-engineering-computing-and-mathematical-sciences/the-cisco-academy-for-the-vision-impaired-cavi/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "In the Margins: Cultural Change",
    "institution": "University of Sydney",
    "description": "Educator interviews and resources targeting holistic cultural change and addressing intersectional barriers for diverse student cohorts.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/in-the-margins-creating-cultural-change-in-the-faculty-of-arts-and-social-sciences/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Reasonable Adjustment Guidelines",
    "institution": "Macquarie University",
    "description": "Practical pedagogical guidance on implementing structural adjustments for specific learning needs, such as scribes, additional time, and alternative formats.",
    "url": "https://teche.mq.edu.au/2022/06/inclusive-teaching-reasonable-adjustment-for-learning-needs/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Student Coaching and Belonging",
    "institution": "Monash University",
    "description": "Phone-based student coaching frameworks designed to reduce overwhelm, improve time management, and foster a critical sense of belonging for online cohorts.",
    "url": "https://www.monash.edu/learning-teaching/monash-online/teaching-in-monash-online/improving-students-inclusion-and-connection",
    "theme": "Inclusive Practice"
  },
  {
    "name": "UDL Guidelines 3.0 (CAST)",
    "institution": "CAST",
    "description": "The definitive Universal Design for Learning framework — three principles (Engagement, Representation, Action & Expression) with updated 2024 guidelines for designing flexible, inclusive learning experiences.",
    "url": "https://udlguidelines.cast.org/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "UDL in Tertiary Education Program",
    "institution": "University of Wollongong",
    "description": "Online self-paced program aimed at increasing understanding of Universal Design for Learning development in higher education.",
    "url": "https://ltc.uow.edu.au/hub/article/udl",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Accessible Assessment and Pedagogies",
    "institution": "Queensland University of Technology",
    "description": "Research-driven resources and publications from QUT's Centre for Inclusive Education (C4IE) to proactively design teaching with accessibility in mind.",
    "url": "https://www.qut.edu.au/news?id=201296",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Universal Design for Learning Repository",
    "institution": "ADCET",
    "description": "A national peak repository of podcasts, webinars, and checklists supporting inclusive teaching and UDL across Australian higher education.",
    "url": "https://www.adcet.edu.au/inclusive-teaching/universal-design-for-learning",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Diversity and Inclusion Frameworks",
    "institution": "Swinburne University",
    "description": "Macro-level institutional policies covering intersectional approaches, LGBTIQA+ support, gender affirmation, and cultural safety.",
    "url": "https://www.swinburne.edu.au/about/strategy-initiatives/equity-diversity/diversity-inclusion-strategy-framework/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "TIG Inclusiveness Project",
    "institution": "University of Queensland",
    "description": "Teaching Innovation Grant project dedicated to embedding Indigenous perspectives and inclusiveness practices across higher education curricula.",
    "url": "https://itali.uq.edu.au/advancing-teaching/initiatives/tig-inclusiveness-project",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Culturally Situated Learning Design",
    "institution": "Charles Darwin University",
    "description": "Research-based learning design principles specifically tailored for Indigenous online higher education students, addressing gaps in universal design literature.",
    "url": "https://ris.cdu.edu.au/ws/files/27022269/5561_Article_Text_18678_1_10_20191228.pdf",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Inclusive iLearn Design Examples",
    "institution": "Macquarie University",
    "description": "Practical examples of inclusive learning management system design featuring accessible navigation, consistent layouts, and UDL-informed content structure.",
    "url": "https://teche.mq.edu.au/2023/03/ask-us-what-are-some-good-examples-of-inclusive-ilearn-design/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Videos for Change",
    "institution": "University of Technology Sydney",
    "description": "Project-based learning initiative empowering students to tackle social inclusion issues such as racism, bullying, and youth suicide through multimedia creation.",
    "url": "https://lx.uts.edu.au/",
    "theme": "Inclusive Practice"
  },
  {
    "name": "Indigenising Curriculum Handbook",
    "institution": "University of Queensland",
    "description": "Open textbook detailing pedagogies, community engagements, and discipline-specific resource development for Indigenising the curriculum.",
    "url": "https://web.library.uq.edu.au/stories/indigenising-curriculum-university-queensland-new-open-textbook",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Indigenisation through Governance",
    "institution": "University of Sydney",
    "description": "Framework outlining a tiered strategic approach, utilising First Nations Curriculum Teams and governance bodies with Indigenous representation.",
    "url": "https://www.sydney.edu.au/content/dam/intranet/public-documents/ioc-brochure-digital-version.pdf",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Great Guide to Indigenisation",
    "institution": "CQUniversity",
    "description": "Framework and literature review funded by HEPPP to assist staff in Indigenising the curriculum within specific disciplines.",
    "url": "https://acquire.cqu.edu.au/articles/report/Great_guide_to_Indigenisation_of_the_curriculum/13393868",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Indigenous Strategy 2022-2030",
    "institution": "La Trobe University",
    "description": "Strategy delivering on commitments to Indigenous leadership, self-determination, worldviews, and culturally responsive open educational resources.",
    "url": "https://opal.latrobe.edu.au/ndownloader/files/50133483",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Indigenising Curriculum Guide",
    "institution": "University of Queensland",
    "description": "Institutional framework for embedding Aboriginal and Torres Strait Islander knowledges and perspectives across higher education curricula.",
    "url": "https://itali.uq.edu.au/teaching-guidance/indigenising-curriculum",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Embedding Indigenous Knowledge",
    "institution": "Flinders University",
    "description": "Professional development workshops providing strategies to redesign curricula to respectfully include Indigenous perspectives in learning outcomes.",
    "url": "https://ienrol.flinders.edu.au/index.php/course/ADU",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Moondani Toombadool Centre",
    "institution": "Swinburne University",
    "description": "Institutional centre responsible for decolonising pedagogies and supporting Indigenous employment in teaching across all educational levels.",
    "url": "https://www.swinburne.edu.au/about/strategy-initiatives/learning-teaching-at-swinburne/",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "SoTL in the South Publication",
    "institution": "Western Sydney University",
    "description": "Research exploring the transformative potential of SoTL for advancing Indigenous scholarship and social justice education.",
    "url": "https://researchers.westernsydney.edu.au/en/publications/the-transformative-potential-of-southern-sotl-for-australian-indi/",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Murmuk Djerring Strategy 2023–2027",
    "institution": "University of Melbourne",
    "description": "Progressive Indigenous strategy with IKBE department creating 391 pedagogical resources and seed grants for faculty-focused Indigenisation pilots.",
    "url": "https://www.unimelb.edu.au/reconciliation/murmuk-djerring",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Jindaola On-Country Program",
    "institution": "University of Wollongong",
    "description": "Professional development program driven by six principles (respect, responsibility, reciprocity, regularity, relevance, routine) with on-country faculty learning.",
    "url": "https://www.uow.edu.au/about/learning-teaching/jindaola/",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Mooditj Katitjiny Curriculum Project",
    "institution": "Curtin University",
    "description": "University-wide curriculum Indigenisation through the Centre for Aboriginal Studies, embedding cultural competence in a structured matrix and policy framework.",
    "url": "https://cas.curtin.edu.au/",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Yindyamarra Winhanganha",
    "institution": "Charles Sturt University",
    "description": "Holistic cultural shift anchoring Indigenisation in an ethos-driven framework led by student outcomes, academic involvement, and the Indigenous Board of Studies.",
    "url": "https://www.csu.edu.au/about/university-profile/yindyamarra-winhanganha",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Mudang-Dali To Live Strategy",
    "institution": "Macquarie University",
    "description": "Innovative approach with 15 pedagogical principles and eight methods for embedding Indigenous perspectives, plus a Master of Indigenous Education.",
    "url": "https://www.mq.edu.au/about/about-us",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Gnibi Elders Principles",
    "institution": "Southern Cross University",
    "description": "Guiding Indigenous principles and cultural protocols supporting the first full degree program with Honours dedicated to Indigenous studies in Australia.",
    "url": "https://www.scu.edu.au/gnibi/",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Indigenous Graduate Attributes (IGAs)",
    "institution": "University of Technology Sydney",
    "description": "Innovative development of Indigenous Graduate Attributes embedded across faculties to advance targeted, comprehensive Indigenisation.",
    "url": "https://www.uts.edu.au/",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Indigenisation Benchmarking Study",
    "institution": "UniSQ / CDU",
    "description": "Dianati & Bolt (2025) sector-wide audit of Indigenising practices across 39 Australian universities, benchmarking curriculum embedding levels.",
    "url": "https://doi.org/10.55146/ajie.v54i1.1073",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Indigenising the Curriculum Framework",
    "institution": "University of Canberra",
    "description": "Core institutional policy requiring the explicit integration and assessment of Indigenous cultural capabilities within all major undergraduate programs.",
    "url": "https://policies.canberra.edu.au/document/view-current.php?id=181",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Advance HE Indigenous Knowledges Pathway",
    "institution": "Queensland University of Technology",
    "description": "Formal recognition pathway validating expertise of educators who implement Indigenous perspectives into university curricula.",
    "url": "https://professional-education.qut.edu.au/study/s/product/indigenous-perspectives-and-knowledges-in-learning-teaching/01t8q000000Eu1GAAS",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Indigenising Curriculum Library Repository",
    "institution": "University of Queensland",
    "description": "Extensive centralized library repositories containing practical handbooks, cultural safety modules, and curated disciplinary scholarship reading lists for Indigenisation.",
    "url": "https://web.library.uq.edu.au/study-and-learning-support/resources-and-support-teaching/indigenising-curriculum-resources",
    "theme": "Indigenising Curriculum"
  },
  {
    "name": "Peer Review of Teaching Guidelines",
    "institution": "University of Tasmania",
    "description": "Comprehensive resource offering tools and advice for developmental and formative peer reviews of teaching practice.",
    "url": "https://www.teaching-learning.utas.edu.au/__data/assets/pdf_file/0010/1054/Peer_review_of_teaching_for-Web.pdf",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Peer Observation of Teaching",
    "institution": "University of Queensland",
    "description": "Comprehensive briefing papers and frameworks outlining the developmental, non-punitive, and mutually beneficial nature of peer teaching reviews.",
    "url": "https://itali.uq.edu.au/files/913/Using-peer-observation-to-enhance-teaching-Leeds-University.pdf",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "myEducation Portfolio",
    "institution": "UNSW Sydney",
    "description": "Digital portfolio tool benchmarked against national and international Advanced HE/HEA standards to capture dimensions of effective teaching practice.",
    "url": "https://myeducationportfolio.unsw.edu.au/myeducation-portfolio-and-dimensions-effective-teaching-practice-higher-education-2",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Quality Teaching Model (PRoT)",
    "institution": "University of Newcastle",
    "description": "Evidence-based pedagogical framework for analysing and conducting peer observation with structured pre-observation conversations and reflective feedback.",
    "url": "https://www.newcastle.edu.au/research/centre/teachers-and-teaching/research-projects/quality-teaching-in-higher-education",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Summative Review Guide",
    "institution": "Curtin University",
    "description": "Formal protocols for conducting peer evaluation aligned with institutional Teaching Excellence Criteria for promotion and performance.",
    "url": "https://staffportal-int.curtin.edu.au/wp-content/uploads/2018/05/summative-review-guide.pdf",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Peer Review Case Studies",
    "institution": "Western Sydney University",
    "description": "Authentic, reflective dialogues showcasing the developmental impacts of engaging in the peer review of teaching process.",
    "url": "https://www.westernsydney.edu.au/learning-futures/peer-review-case-studies",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "SoLT Framework",
    "institution": "Southern Cross University",
    "description": "Policy embedding the Scholarship of Teaching and Learning directly into institutional practice and academic career progression.",
    "url": "https://www.scu.edu.au/about/leadership/executive/academic-portfolio-office-apo/scholarship-of-learning-and-teaching/",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Peer Review Module",
    "institution": "Macquarie University",
    "description": "Professional development module exploring buddy systems and qualitative evaluation techniques for peer review of teaching.",
    "url": "https://teche.mq.edu.au/2024/02/peer-review-of-teaching-anyone/",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "9 Dimensions of Teaching",
    "institution": "University of South Australia",
    "description": "Rubric and pre-review worksheets guiding peer review observations against specific teaching indicators including student engagement and feedback.",
    "url": "https://i.unisa.edu.au/contentassets/46b14884d76540eb8fe12e2d732e36bb/nine-9-dimensions_updated-101122.pdf",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "PRoT Systematic Review",
    "institution": "RMIT University",
    "description": "Research identifying the organisational, programmatic, and individual factors driving success in peer reviews of teaching in Australian HE.",
    "url": "https://research-repository.rmit.edu.au/articles/journal_contribution/Peer_review_of_teaching_in_Australian_higher_education_a_systematic_review/27537606",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Murdoch Fellowship Scheme",
    "institution": "Murdoch University",
    "description": "Scheme evaluating candidates' readiness against the UK Professional Standards Framework for Advance HE Associate Fellowship and Fellowship.",
    "url": "https://researchportal.murdoch.edu.au/esploro/activity/professionService/Murdoch-Fellowship-Scheme-Learning-and-Teaching/7655713720007891",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Evaluation of Teaching Framework",
    "institution": "UNSW Sydney",
    "description": "Multi-faceted evaluation approach urging triangulation of peer reviews, learning analytics, programmatic assessment data, and student communications.",
    "url": "https://www.education.unsw.edu.au/news-events/news/evaluation-teaching-flavoursome-experience",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Peer Review of Teaching Hub",
    "institution": "University of Sydney",
    "description": "Comprehensive cross-disciplinary resources supporting structured peer review involving pre-observation meetings, standardized proformas, and reflective post-review dialogues.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/tag/peer-review-of-teaching/",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Peer Review as Evidence",
    "institution": "University of Sydney",
    "description": "Guidelines for using peer review observations as formal evidence of teaching quality within academic portfolios and promotion applications.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/using-peer-review-as-evidence-and-improvement-of-your-teaching/",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "What Peer Review Is Actually Like",
    "institution": "University of Sydney",
    "description": "Authentic practitioner reflections detailing the lived experience of participating in structured peer review of teaching processes across different faculties.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/what-peer-review-for-teaching-is-actually-like/",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "Peer Review of Teaching Program",
    "institution": "Monash University",
    "description": "Institutional peer review framework supporting formative and summative review processes aligned with Monash Education Academy quality standards.",
    "url": "https://www.monash.edu/learning-teaching/awards-and-recognition/peer-review",
    "theme": "Peer Review of Teaching"
  },
  {
    "name": "UQ Student-Staff Partnerships",
    "institution": "University of Queensland",
    "description": "Three-way emancipatory SaP model encompassing Projects, Representation, and Student Voice — students actively shape governance, curriculum, and university policy.",
    "url": "https://employability.uq.edu.au/student-staff-partnerships",
    "theme": "Students as Partners"
  },
  {
    "name": "UNSW Students as Partners",
    "institution": "UNSW Sydney",
    "description": "Targeted SaP practices including Focus Groups, Ambassadors, Consultative Groups, and course Partner Programs permeating the institution.",
    "url": "https://www.teaching.unsw.edu.au/students-as-partners",
    "theme": "Students as Partners"
  },
  {
    "name": "UniSC Students as Partners",
    "institution": "University of the Sunshine Coast",
    "description": "Emancipatory SaP philosophy embedded as continuous institutional business via Student Hub, Senate, Research Committees, Council, and Guild.",
    "url": "https://www.unisc.edu.au/about/learning-and-teaching-at-unisc",
    "theme": "Students as Partners"
  },
  {
    "name": "WSU Partnership & Leadership",
    "institution": "Western Sydney University",
    "description": "Emancipatory SaP model offering formal decision-making authority in teaching, community engagement, and governance through leadership programs.",
    "url": "https://www.westernsydney.edu.au/learning-futures",
    "theme": "Students as Partners"
  },
  {
    "name": "Melbourne Students as Partners",
    "institution": "University of Melbourne",
    "description": "Program showcasing SaP projects focused on student experience, academic skills, and engagement integrated into decision-making and project development.",
    "url": "https://melbourne-cshe.unimelb.edu.au/students-as-partners",
    "theme": "Students as Partners"
  },
  {
    "name": "Sydney Student Resource Development",
    "institution": "University of Sydney",
    "description": "Innovative SaP model utilising student-created learning resources and apps, demonstrating partnership in educational resource development.",
    "url": "https://www.sydney.edu.au/students/",
    "theme": "Students as Partners"
  },
  {
    "name": "Curtin SaP & SDG Integration",
    "institution": "Curtin University",
    "description": "Faculty of Business and Law SaP framework integrating Sustainable Development Goals and providing a formal report card to evaluate partnership impact.",
    "url": "https://students.curtin.edu.au/",
    "theme": "Students as Partners"
  },
  {
    "name": "Adelaide Peer-Assisted Study Sessions",
    "institution": "University of Adelaide",
    "description": "Course Ambassadors and PASS operating alongside the formal curriculum, integrating SaP within the first-year experience.",
    "url": "https://www.adelaide.edu.au/learning/",
    "theme": "Students as Partners"
  },
  {
    "name": "Deakin StudentsasPartners",
    "institution": "Deakin University",
    "description": "Emerging SaP initiative launched in 2022 with annual roundtable participation since 2020, demonstrating growing institutional commitment to partnership.",
    "url": "https://www.deakin.edu.au/students/student-life-and-services/student-leadership-and-representation",
    "theme": "Students as Partners"
  },
  {
    "name": "UTS Student Partnership Agreement",
    "institution": "University of Technology Sydney",
    "description": "Formal governance framework providing structural support for student partnership across university decision-making processes.",
    "url": "https://www.uts.edu.au/current-students",
    "theme": "Students as Partners"
  },
  {
    "name": "International Journal for Students as Partners",
    "institution": "McMaster University (Canada)",
    "description": "Open-access journal publishing scholarship on SaP practices internationally — key resource for Australian SaP researchers and practitioners.",
    "url": "https://mulpress.mcmaster.ca/ijsap",
    "theme": "Students as Partners"
  },
  {
    "name": "SaP Benchmarking Study",
    "institution": "La Trobe University / UniSC",
    "description": "Dianati et al. (2025) sector-wide benchmarking of SaP models across 38 Australian universities using a four-quadrant framework.",
    "url": "https://doi.org/10.15173/ijsap.v9i1.5909",
    "theme": "Students as Partners"
  },
  {
    "name": "Five Propositions for Genuine SaP",
    "institution": "University of Queensland",
    "description": "Essential empirical literature and guiding principles for designing inclusive, ethical, and power-sharing pedagogical partnerships.",
    "url": "https://itali.uq.edu.au/files/1038/Five-propositions-for-genuine-students-as-partners-practice.pdf",
    "theme": "Students as Partners"
  },
  {
    "name": "Student & Staff Partnerships Toolkit",
    "institution": "University of Wollongong",
    "description": "Comprehensive agreement and visual framework outlining six domains of partnership practice to foster inclusive institutional improvement.",
    "url": "https://documents.uow.edu.au/content/groups/public/@web/@pmcd/documents/doc/uow279714.pdf",
    "theme": "Students as Partners"
  },
  {
    "name": "Empowering Students Through SaP",
    "institution": "Griffith University",
    "description": "Peer-reviewed case study demonstrating efficacy of student-generated assessment in increasing engagement and assessment literacy in STEM.",
    "url": "https://research-repository.griffith.edu.au/server/api/core/bitstreams/7f70be16-4d79-48ea-8607-d7fe7af30276/content",
    "theme": "Students as Partners"
  },
  {
    "name": "Student Voice and Partnership Framework",
    "institution": "La Trobe University",
    "description": "Co-designed framework establishing the university Student Council and reciprocal methodologies for consultation and co-design with students.",
    "url": "https://www.latrobe.edu.au/students/opportunities/student-voice-and-partnership/framework",
    "theme": "Students as Partners"
  },
  {
    "name": "Students as Partners Framework",
    "institution": "Curtin University",
    "description": "A formalized institutional spectrum defining student involvement from basic sounding boards to high-level strategic decision-makers.",
    "url": "https://www.curtin.edu.au/students/experience/students-as-partners/students-as-partners-framework/",
    "theme": "Students as Partners"
  },
  {
    "name": "Approaches to Students as Partners",
    "institution": "Deakin University",
    "description": "Practical guidelines for academics detailing how to strategically position student partnerships across different levels of pedagogical agency.",
    "url": "https://blogs.deakin.edu.au/studentsaspartners/2021/11/09/approaches-to-students-as-partners/",
    "theme": "Students as Partners"
  },
  {
    "name": "Students as Partners Initiative",
    "institution": "University of Queensland",
    "description": "Central hub for UQ student-staff partnership initiatives including the Australian Students as Partners Network and collaborative pedagogical research.",
    "url": "https://itali.uq.edu.au/advancing-teaching/initiatives/students-partners",
    "theme": "Students as Partners"
  },
  {
    "name": "What is Students as Partners?",
    "institution": "University of Wollongong",
    "description": "Comprehensive overview explaining the SaP philosophy, frameworks, and six critical domains where student-staff partnerships must thrive at UOW.",
    "url": "https://ltc.uow.edu.au/hub/article/what-is-sap",
    "theme": "Students as Partners"
  },
  {
    "name": "Student and Staff Partnerships",
    "institution": "University of Wollongong",
    "description": "Institutional SaP agreement and governance framework executed between the university executive and the Student Advisory Council across six domains.",
    "url": "https://www.uow.edu.au/about/student-staff-partnerships/",
    "theme": "Students as Partners"
  },
  {
    "name": "Student Voice and Partnership Program",
    "institution": "La Trobe University",
    "description": "Overarching program providing SSAF-funded structural support for the Student Council, student advocacy, and reciprocal consultation methodologies.",
    "url": "https://www.latrobe.edu.au/students/opportunities/student-voice-and-partnership",
    "theme": "Students as Partners"
  },
  {
    "name": "SoTL Guidelines",
    "institution": "University of Melbourne",
    "description": "Foundational definitions distinguishing SoTL from general education research, focusing on scholarly practice applied to specific disciplinary contexts.",
    "url": "https://msd.unimelb.edu.au/belt/research/f/scholarship-of-teaching-and-learning-sotl",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "Framework for SoTL Support",
    "institution": "UNSW Sydney",
    "description": "Four-pillar institutional strategy providing professional development, specialised ethics support, leadership, and dissemination platforms for teaching scholars.",
    "url": "https://www.education.unsw.edu.au/teaching/developing-teaching/sotl-support",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "Researching While Teaching (RWT)",
    "institution": "University of South Australia",
    "description": "Tiered action-research mentoring program transitioning educators from evaluating local practice to publishing global SoTL outcomes in high-impact journals.",
    "url": "https://lo.unisa.edu.au/course/view.php?id=16041&sectionid=601922",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "Scholarship of Learning and Teaching Policy",
    "institution": "International College of Management, Sydney",
    "description": "Institutional policy detailing the management, review, and rigorous governance of scholarship activity via a dedicated central SoLT Committee.",
    "url": "https://policies.icms.edu.au/wp-content/uploads/2021/07/Scholarship-of-Learning-and-Teaching-Framework_20200220.pdf",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "SoTL Professional Development Opportunities",
    "institution": "UNSW Sydney",
    "description": "Directory of SoTL professional development and leadership opportunities including the Teaching Commons series, drop-in mentoring, and ethics advisory panels.",
    "url": "https://www.education.unsw.edu.au/teaching/developing-teaching/sotl-support/sotl-opportunities",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "Human Research Ethics for SoTL",
    "institution": "UNSW Sydney",
    "description": "Guidance on navigating human research ethics approval processes for classroom-based pedagogical research and SoTL projects involving student participants.",
    "url": "https://www.education.unsw.edu.au/news-events/news/human-research-ethics-sotl",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "SoTL as Academic Superpower",
    "institution": "UNSW Sydney",
    "description": "Introductory resources positioning the Scholarship of Teaching and Learning as a strategic pathway for academic career development and pedagogical leadership.",
    "url": "https://www.education.unsw.edu.au/news-events/news/scholarship-teaching-and-learning-your-new-academic-superpower",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "Introduction to SoLT",
    "institution": "Southern Cross University",
    "description": "Foundational resource distinguishing SoLT from basic professional development, outlining the what, why, and how of scholarly approaches to teaching practice.",
    "url": "https://www.scu.edu.au/media/scu-dep/staff/teaching-and-learning/ctl-document-downloads/pdfs/Introduction-to-SoLT--What-why-how-10-4-24.pdf",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "Peer Review Springboard Program",
    "institution": "UNSW Sydney",
    "description": "Program positioning peer review of journals as a springboard for developing advanced scholarship skills and building sector-wide review capacity.",
    "url": "https://www.education.unsw.edu.au/news-events/news/peer-review-program-springboard",
    "theme": "SoTL Ecosystems"
  },
  {
    "name": "Assessment Schedule Policy",
    "institution": "La Trobe University",
    "description": "Strict institutional mandates requiring 10–30% weighted early assessments with comprehensive feedback delivered prior to the teaching census date.",
    "url": "https://policies.latrobe.edu.au/document/view.php?id=363",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "Assessment and Feedback Policy",
    "institution": "University of Wollongong",
    "description": "Regulatory frameworks embedding early, low-stakes formative tasks to identify at-risk students and support first-year academic transitions.",
    "url": "https://policies.uow.edu.au/download.php?id=38&version=5",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "PASS Academic Mentoring Program",
    "institution": "UNSW Sydney",
    "description": "Globally accredited peer-facilitation program statistically proven to boost undergraduate performance by an average of 6–9 marks.",
    "url": "https://www.unsw.edu.au/student/support/services/peer-mentoring/pass",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "Learning & Study Skills Hub (PASS)",
    "institution": "Griffith University",
    "description": "Integrated academic support network deploying senior students to facilitate collaborative inquiry in historically difficult subjects.",
    "url": "https://www.griffith.edu.au/students/learning-study-skills-hub/arts-education-and-law",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "PASS Program Methodologies",
    "institution": "University of South Australia",
    "description": "Guidelines detailing the pedagogical distinction between traditional tutoring and the collaborative, non-remedial design of PASS.",
    "url": "https://lo.unisa.edu.au/course/view.php?id=6929&sectionid=115833",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "Studiosity Writing Feedback+",
    "institution": "University of Newcastle",
    "description": "Ethical AI-powered formative feedback platform providing continuous, asynchronous assessment support without compromising academic integrity.",
    "url": "https://www.newcastle.edu.au/current-students/support/academic/studiosity",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "Assessment Policy and Procedure",
    "institution": "Higher Education Institute",
    "description": "Institutional policy mandating early assessment mechanisms, timely referral pathways, and structured academic integrity frameworks at HEI.",
    "url": "https://hei.nsw.edu.au/wp-content/uploads/2025/06/Assessment-Policy-and-Procedure-V1.1-May-2025.pdf",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "PASS Peer-Assisted Study Sessions",
    "institution": "University of Newcastle",
    "description": "Dedicated peer-assisted study sessions program deploying trained senior students to facilitate collaborative learning in high-attrition courses.",
    "url": "https://www.newcastle.edu.au/current-students/support/academic/peer-assisted-study-sessions",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "Learning and Study Skills Hub",
    "institution": "Griffith University",
    "description": "Central academic support hub integrating PASS, study skills workshops, and discipline-specific learning support across all Griffith faculties.",
    "url": "https://www.griffith.edu.au/students/learning-study-skills-hub",
    "theme": "Early Assessment & PASS"
  },
  {
    "name": "Microcredential Procedures",
    "institution": "University of the Sunshine Coast",
    "description": "Highly precise governance rules defining volume of learning metrics, credit stacking protocols, and distinct approval authorities.",
    "url": "https://www.unisc.edu.au/about/policies-and-procedures/microcredential-procedures",
    "theme": "Microcredentials"
  },
  {
    "name": "Short Course & Microcredential Management",
    "institution": "University of Wollongong",
    "description": "Procedures governing course approval, mandatory summative assessment integration, and the issuance of verifiable digital badges.",
    "url": "https://policies.uow.edu.au/document/view-current.php?id=110",
    "theme": "Microcredentials"
  },
  {
    "name": "Micro-credentials Schedule",
    "institution": "University of Newcastle",
    "description": "Guidelines enforcing minimum unit values and mandatory three-year reviews to ensure financial viability and ongoing industry alignment.",
    "url": "https://policies.newcastle.edu.au/document/view-current.php?id=352",
    "theme": "Microcredentials"
  },
  {
    "name": "Microcredential and Short Course Policy",
    "institution": "University of Canberra",
    "description": "Framework linking short courses to the National Microcredentials Framework and specific professional competency models such as SFIA.",
    "url": "https://policies.canberra.edu.au/download.php?id=455&version=1&associated",
    "theme": "Microcredentials"
  },
  {
    "name": "UWA Plus Micro-credentials",
    "institution": "University of Western Australia",
    "description": "Industry-partnered microcredentials in specialised areas such as Autism Assessment, developed via Cooperative Research Centres.",
    "url": "https://www.uwa.edu.au/study/uwa-plus",
    "theme": "Microcredentials"
  },
  {
    "name": "UC Microcredentials for Workforce",
    "institution": "University of Canberra",
    "description": "Program allowing undergraduates to complete AI-Driven Cybersecurity, Media Literacy, and Policy Making microcredentials as alternatives to standard electives.",
    "url": "https://www.canberra.edu.au/about-uc/media/newsroom/2025/october/uc-rolls-out-microcredentials-to-upskill-students-for-the-workforce",
    "theme": "Microcredentials"
  },
  {
    "name": "Open Educational Practice Grants",
    "institution": "University of Southern Queensland",
    "description": "Internal funding and capability-building initiative supporting staff in creating renewable assessments and open textbooks.",
    "url": "https://oercollective.caul.edu.au/openedaustralasia/chapter/building-a-community-of-open-practitioners/",
    "theme": "Open Educational Practices"
  },
  {
    "name": "Textbook Minimisation Project",
    "institution": "University of South Australia",
    "description": "Institutional initiative eliminating commercial textbook reliance, transitioning to OER and generating $9M in student savings over two years.",
    "url": "https://oercollective.caul.edu.au/designing-learning-experiences/chapter/designing-inclusive-learning-experience-through-open-educational-practices/",
    "theme": "Open Educational Practices"
  },
  {
    "name": "Aligning OEP with Academic Reward",
    "institution": "CAUL OER Collective",
    "description": "Strategic documentation demonstrating how educators can leverage open licenses and global resource analytics to secure academic promotion.",
    "url": "https://oercollective.caul.edu.au/openedaustralasia/chapter/aligning-open-education-programs-with-academic-reward/",
    "theme": "Open Educational Practices"
  },
  {
    "name": "Ecology of Open Educational Practice",
    "institution": "University of Tasmania",
    "description": "PhD research mapping the complex environmental factors, institutional policies, and practitioner fluencies required to sustain open pedagogies.",
    "url": "https://figshare.utas.edu.au/articles/thesis/The_ecology_of_open_educational_practices_in_Australian_higher_education_a_practitioner-focused_mixed_methods_study/26010949",
    "theme": "Open Educational Practices"
  },
  {
    "name": "CAUL Open Educational Resources Program",
    "institution": "CAUL",
    "description": "National peak body program leading sector-wide capability building to publish open textbooks and advance open educational practice across Australasia.",
    "url": "https://caul.edu.au/program/open-educational-resources-program/",
    "theme": "Open Educational Practices"
  },
  {
    "name": "OER Research on Intercultural Communication",
    "institution": "University of Southern Queensland",
    "description": "Peer-reviewed research demonstrating how interactive open textbook materials tackle intercultural communication issues in multi-cultural educational contexts.",
    "url": "https://research.usq.edu.au/download/44a531937c16ca31ca98a38a151b7f2279b7d0a60724ea47658d24c9bc1edef8/416519/85-Article%20Text-845-982-10-20240831.pdf",
    "theme": "Open Educational Practices"
  },
  {
    "name": "Educational Fellowship Scheme (EFS)",
    "institution": "Australian National University",
    "description": "Pioneering Australian institutional pathway supporting staff to achieve globally recognised accreditation via Advance HE.",
    "url": "https://www.anu.edu.au/about/awards-achievements/education-achievements/educational-fellowship-scheme",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "HEA@UQ Program",
    "institution": "University of Queensland",
    "description": "Multi-tiered frameworks guiding academics, professional staff, and HDRs through the rigorous PSF mapping required for Fellowship.",
    "url": "https://itali.uq.edu.au/advancing-teaching/awards-grants-fellowships/hea/hea-uq-program",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Associate Fellow (Indigenous Knowledges)",
    "institution": "Queensland University of Technology",
    "description": "World-first specialist Advance HE pathway recognising expert integration of Indigenous perspectives into university curricula.",
    "url": "https://professional-education.qut.edu.au/study/s/product/associate-fellow-(indigenous-knowledges)-of-the-higher-education-academy/01t8q000000Eu0t",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Academic Mentoring Guide",
    "institution": "UNSW Sydney",
    "description": "Evidence-based, mentee-driven academic mentoring — full guide with goal-setting, frameworks, checklists and reflection worksheets for mentors and mentees (adapted from the Spectrum guide, Cahir, Harvey & Ambler).",
    "url": "https://www.teaching.unsw.edu.au/sites/default/files/u681/Academic%20Mentoring%20at%20UNSW.pdf",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Peer Reviewer of Journals Mentoring",
    "institution": "UNSW Sydney",
    "description": "Specialised training program teaching academics to critically evaluate cross-disciplinary SoTL research manuscripts for peer review.",
    "url": "https://www.education.unsw.edu.au/news-events/news/building-sotl-skills",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Mentoring Support Hub",
    "institution": "University of Sydney",
    "description": "Comprehensive guidelines and resources outlining how to successfully navigate the mentoring relationship as both mentee and mentor.",
    "url": "https://researcher-hub.sydney.edu.au/career-development/mentoring.html",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Advance HE International Recognition",
    "institution": "UNSW Sydney",
    "description": "Resources and institutional support for academics seeking internationally recognized Advance HE Fellowships to validate pedagogical expertise.",
    "url": "https://www.inside.unsw.edu.au/academic-excellence/international-recognition-excellence-in-teaching-and-learning",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "QUT Advance HE Staff Recognition",
    "institution": "Queensland University of Technology",
    "description": "Program recognizing over 100 QUT staff members for international achievements in learning and teaching through Advance HE Fellowship pathways.",
    "url": "https://www.qut.edu.au/news?id=101738",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Early Career Academic Mentoring",
    "institution": "University of Technology Sydney",
    "description": "Structured mentoring program connecting early career academics with experienced mentors to develop teaching capabilities and academic leadership skills.",
    "url": "https://reshub.uts.edu.au/whats-on/news/become-mentor-early-career-academic-mentoring-program",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Mid-Career Academic Mentoring",
    "institution": "University of Technology Sydney",
    "description": "Targeted mentoring initiative for mid-career academics seeking to advance their teaching leadership and scholarly practice in higher education.",
    "url": "https://reshub.uts.edu.au/whats-on/news/mentors-wanted-mid-career-academic-mentoring-0",
    "theme": "Advance HE & Mentoring"
  },
  {
    "name": "Educational Fellowship Scheme (EFS) Details",
    "institution": "Australian National University",
    "description": "Detailed program information for ANU's Educational Fellowship Scheme including application processes, mentoring support, and PSF mapping guidance.",
    "url": "https://learningandteaching.anu.edu.au/development/efs/",
    "theme": "Advance HE & Mentoring"
  }
];

/** Group into themes, biggest first — production's useMemo, verbatim. */
export function teachingThemes(): TeachingTheme[] {
  const byTheme = new Map<string, TeachingResource[]>();
  for (const r of TEACHING_RESOURCES) {
    const list = byTheme.get(r.theme) ?? [];
    list.push(r);
    byTheme.set(r.theme, list);
  }
  return [...byTheme.entries()]
    .map(([theme, resources]) => ({
      theme,
      icon: THEME_ICONS[theme] ?? "📚",
      description: THEME_DESCRIPTIONS[theme] ?? "",
      resources,
      count: resources.length,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Search across name, institution, description and theme (production's
 * predicate); themes left empty drop out.
 */
export function filterThemes(query: string): TeachingTheme[] {
  const q = query.trim().toLowerCase();
  const themes = teachingThemes();
  if (!q) return themes;
  return themes
    .map((t) => {
      const resources = t.resources.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.institution.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.theme.toLowerCase().includes(q),
      );
      return { ...t, resources, count: resources.length };
    })
    .filter((t) => t.resources.length > 0);
}
