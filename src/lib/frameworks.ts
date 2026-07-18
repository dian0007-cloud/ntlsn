/**
 * Sector Frameworks & Policy Documents for #frameworks (Epic 1.2 PR-C) —
 * the 280-document directory extracted verbatim from the production bundle
 * (assets/app.b38bc4ca.js). Curated site content hard-coded in the bundle,
 * not data-layer material (CLAUDE.md: data/*.json holds institutions +
 * events only), so it lives here until a curator moves it into the data
 * layer. The header count is derived from FRAMEWORKS.length (production's
 * "280 verified PDFs" copy happens to match the data today — deriving keeps
 * it honest if the list drifts).
 *
 * FRAMEWORK_STRANDS is the bundle's own `ne` strand array, verbatim order.
 * Note it deliberately omits the four stray category values (Grant ×1,
 * Award ×2, Fellowship ×1) that appear only as card tags in production —
 * same behaviour here.
 */

export interface FrameworkDoc {
  title: string;
  org: string;
  desc: string;
  url: string;
  /** Strand, e.g. "Teaching Quality", "Assurance of Learning". */
  category: string;
}

/** Strand chips — the bundle's exact list and order ("All" first). */
export const FRAMEWORK_STRANDS: readonly string[] = [
  "All",
  "Blogs",
  "SoTL Foundations",
  "SoTL Journals",
  "Academic Promotion",
  "Indigenising Curriculum",
  "UDL Frameworks",
  "Students as Partners",
  "Assurance of Learning",
  "Quality Assurance",
  "Student Experience",
  "Regulatory & Policy",
  "Nursing & Midwifery",
  "Global Grants",
  "Microcredentials",
  "Curriculum Design",
  "Teaching Philosophy",
  "Teaching Quality",
  "Research & Impact",
  "Conferences",
  "Learning Design",
];

export const FRAMEWORKS: readonly FrameworkDoc[] = [
  {
    "title": "Teaching Review Program (peer review)",
    "org": "University of Adelaide",
    "desc": "Summative peer review of teaching across ten dimensions, for awards and promotion.",
    "url": "https://www.adelaide.edu.au/learning/recognition/peer-review-of-teaching/teaching-review-program",
    "category": "Teaching Quality"
  },
  {
    "title": "Melbourne Peer Review of Teaching (MPRT)",
    "org": "University of Melbourne",
    "desc": "University-wide peer review mapped to the Framework for Educational Excellence.",
    "url": "https://melbourne-cshe.unimelb.edu.au/awards/MPRT",
    "category": "Teaching Quality"
  },
  {
    "title": "Peer Review of Teaching (PRoT)",
    "org": "James Cook University",
    "desc": "Conversation + observation + reflective feedback, with PRoT forms and guide.",
    "url": "https://www.jcu.edu.au/centre-for-education-and-enhancement/education-strategy/prot",
    "category": "Teaching Quality"
  },
  {
    "title": "VTAS Promoting Excellence Network (PEN)",
    "org": "Monash · UTAS · La Trobe · Swinburne",
    "desc": "Cross-institutional network promoting teaching excellence, grants and recognition across member universities.",
    "url": "https://vtasnetwork.com/",
    "category": "Grant"
  },
  {
    "title": "WAND — WA Network for Dissemination",
    "org": "West Australian universities",
    "desc": "WA network disseminating learning & teaching projects and good practice through sector symposiums and forums.",
    "url": "https://www.wand.edu.au/",
    "category": "Conferences"
  },
  {
    "title": "Te Whatu Kairangi Awardee Community",
    "org": "Ako Aotearoa (NZ)",
    "desc": "Aotearoa New Zealand's national tertiary teaching excellence awards community — awardees, resources and recognition.",
    "url": "https://ako.ac.nz/programmes-and-services/te-whatu-kairangi/awardee-community",
    "category": "Award"
  },
  {
    "title": "3M National Teaching Fellowship",
    "org": "STLHE (Canada)",
    "desc": "Canada's national recognition of excellence in teaching and educational leadership in higher education.",
    "url": "https://stlhe.ca/awards/3m-national-teaching-fellowship/",
    "category": "Fellowship"
  },
  {
    "title": "AAUT Teaching & Learning Breakfast Series (Adelaide 2026)",
    "org": "AAUTN",
    "desc": "Australian Awards for University Teaching Network breakfast series supporting award nominees and citation winners.",
    "url": "https://aautn.org/2026-adelaide-university-aaut-teaching-and-learning-breakfast-series-3/",
    "category": "Award"
  },
  {
    "title": "ANTF Symposium 2026 — Newcastle (UK)",
    "org": "Association of National Teaching Fellows",
    "desc": "UK National Teaching Fellows annual symposium, 12–13 May 2026 at Newcastle University.",
    "url": "https://ntf-association.com/annual-symposia/antf-symposium-2026/",
    "category": "Conferences"
  },
  {
    "title": "Developing & Sustaining the Identities of Educational Leaders",
    "org": "CAULLT",
    "desc": "Final report on developing emerging and established educational leaders.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Developing-and-Sustaining-the-Identities-of-Emerging-and-Established-Educational-Leaders-Leaders-final-report-copy.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Supporting Leadership in Inclusive Assessment Policy & Practice",
    "org": "CAULLT",
    "desc": "Final report on leadership for inclusive assessment policy and practice.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Supporting-leadership-in-inclusive-assessment-policy-and-practice_final-report.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Leading Inclusive Assessment: A Framework",
    "org": "CAULLT",
    "desc": "A framework to guide inclusive assessment practice in higher education.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/Leading-inclusive-assessment-in-higher-education-A-framework-to-guide-inclusive-practice.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Provision of Professional Learning in AU & NZ Universities (Environmental Scan)",
    "org": "CAULLT",
    "desc": "Panther, Samarawickrema & Warburton (2024) scan of professional-learning provision.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/CAULLT-THE-PROVISION-OF-PROFESSIONAL-LEARNING-IN-AUSTRALIAN-AND-NEW-ZEALAND-UNIVERSITIES_-AN-ENVIRONMENTAL-SCAN-Digital-Version-FINAL-1.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Investigating How L&T Leaders Use Student Evaluations (SET)",
    "org": "CAULLT",
    "desc": "Final report on regional-university leaders using SET fairly and effectively.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/CAULLT-final-grant-report-for-publication_Investigating-how-leaders.pdf",
    "category": "Quality Assurance"
  },
  {
    "title": "Student Evaluation of L&T — Good Practice Guide",
    "org": "CAULLT",
    "desc": "Good practice guide for student evaluation of learning and teaching.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/Student-Evaluation-of-Learning-and-Teaching-Final-amended.pdf",
    "category": "Quality Assurance"
  },
  {
    "title": "Technology Enabled Mentoring (TEM) Framework & Short Course",
    "org": "CAULLT",
    "desc": "Final report: a TEM framework and short course for the Australasian HE community.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/final-report-Developing-a-Technology-Enabled-Mentoring-TEM-framework-and-short-course-for-the-Australasian-HE-community.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Taxonomy for Credentialing Australasian University Educators",
    "org": "CAULLT",
    "desc": "A taxonomy for credentialing university educators across Australasia.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Taxonomy-for-Credentialing-Australasian-University-Educators-1687914010-8.pdf",
    "category": "Microcredentials"
  },
  {
    "title": "Credentialing Professional Learning — A Literature Review",
    "org": "CAULLT",
    "desc": "Literature review on credentialing professional learning for university educators.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Credentialing-professional-learning-for-university-educators-A-literature-review.pdf",
    "category": "Microcredentials"
  },
  {
    "title": "Micro-credentialing & Professional Learning in HE",
    "org": "CAULLT",
    "desc": "Presentation on micro-credentialing and professional learning in higher education.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Micro-credentialing-and-Professional-Learning-in-Higher-Education.pdf",
    "category": "Microcredentials"
  },
  {
    "title": "Framing Credentials for HE Educators",
    "org": "CAULLT",
    "desc": "Presentation on framing credentials for higher education educators.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Framing-Credentials-for-Higher-Education-Educators.pdf",
    "category": "Microcredentials"
  },
  {
    "title": "Academic Archetypes",
    "org": "CAULLT",
    "desc": "Final grant report introducing academic archetypes.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/CAULLT-Final-Grant-Report_Academic-Archetypes.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "A Values-Framework & Self-Assessment Tool for Academic Leadership",
    "org": "CAULLT",
    "desc": "Final report: a values framework and self-assessment tool to improve tertiary academic leadership.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/CAULLT-final-grant-report-A-values-framework-and-self-assessment-tool-to-improve-tertiary-academic-leadership.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Towards a Common Australasian HE Micro-credentialing Framework",
    "org": "CAULLT",
    "desc": "Final report toward a common, transferable Australasian micro-credentialing framework.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Towards-A-Common-Transferable-Australasian-Higher-Education-Microcredentialing-Framework_2024-CAULLT-final-grant-report.pdf",
    "category": "Microcredentials"
  },
  {
    "title": "Recognising Academic Development — An Australian Association for Academic Developers",
    "org": "CAULLT",
    "desc": "Concept-testing project report for an Australian association of academic developers.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/An-Australian-Association-for-Academic-Developers-Concept-testing-project-report-final.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "External Peer Review of Assessment — A Guide",
    "org": "CAULLT",
    "desc": "A guide to supporting external referencing of academic standards.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/External_Peer_Review_of_Assessment_FINAL-VERSION_260919.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Wellbeings Lead Wellbeing",
    "org": "CAULLT",
    "desc": "Fotinatos — presentation on wellbeing for senior L&T leaders.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/Fotinatos-Wellbeings-Lead-Well-being-V2-.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "CADAD/HERDSA Survey of PD Needs of Academic Developers",
    "org": "CAULLT",
    "desc": "Survey report on professional-development needs of academic developers.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/CADAD-HERDSA-Survey-of-Professional-Development-Needs-of-Academic-Developers-Report.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Trialling a Peer Assisted Teaching Scheme (PATS)",
    "org": "CAULLT",
    "desc": "Final report on trialling PATS in the Australian tertiary sector.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Final-PATS-CADAD-Report-Feb-2013.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Developing an Academic Director's Professional Identity",
    "org": "CAULLT",
    "desc": "Booklet on developing the professional identity of academic directors.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/AC-Developing-Academic-Directors-Professional-Identity-Booklet.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Supporting Job Design for Academics in Academic Development Units",
    "org": "CAULLT",
    "desc": "Guide for directors on job design for academics in academic development units.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/AcademicJobDesign-Guide-for-Directors-Revised-040215-Version-A.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Professional Standards Framework (PSF 2023)",
    "org": "Advance HE",
    "desc": "Professional Values, Core Knowledge, and Areas of Activity for teaching and supporting learning in higher education.",
    "url": "https://s3.eu-west-2.amazonaws.com/assets.creode.advancehe-document-manager/documents/advance-he/PSF%202023%20-%20Screen%20Reader%20Compatible%20-%20final_1675089549.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "Scholarship Reconsidered: Priorities of the Professoriate",
    "org": "Ernest Boyer / Carnegie Foundation",
    "desc": "Boyer’s foundational 1990 report redefining academic work into four domains: discovery, integration, application, and teaching.",
    "url": "https://depts.washington.edu/gs630/Spring/Boyer.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "Glassick’s Criteria for Scholarship",
    "org": "Academic Pediatrics",
    "desc": "Six criteria for assessing SoTL: clear goals, adequate preparation, appropriate methods, significant results, effective presentation, reflective critique.",
    "url": "https://www.academicpeds.org/wp-content/uploads/2022/03/Glassicks.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "Introduction to the Scholarship of Learning and Teaching",
    "org": "Southern Cross University",
    "desc": "Practical framework defining SoTL vs professional development with exact examples mapping to academic promotion evidence.",
    "url": "https://www.scu.edu.au/media/scu-dep/staff/teaching-and-learning/ctl-document-downloads/pdfs/Introduction-to-SoLT--What-why-how-10-4-24.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "Embedding Reward, Recognition and Promotion in Teaching & Learning",
    "org": "Advance HE",
    "desc": "Multinational research exploring structures, policies, and practices that embed recognition for university educators.",
    "url": "https://www.researchgate.net/publication/389362699_Embedding_reward_recognition_and_promotion_in_teaching_learning",
    "category": "SoTL Foundations"
  },
  {
    "title": "Taking University Teaching Seriously",
    "org": "Grattan Institute",
    "desc": "Influential Australian report mapping growth of teaching-focused appointments and arguing for structural changes to recognition.",
    "url": "https://grattan.edu.au/wp-content/uploads/2013/07/191_Taking-Teaching-Seriously.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "Academic Promotion Procedure",
    "org": "Federation University",
    "desc": "Application requirements, eligibility, and assessment criteria for Teaching Focused and Combined promotion portfolios.",
    "url": "https://policy.federation.edu.au/people_and_culture/procedures/academic_promotion/ch1.pdf",
    "category": "Academic Promotion"
  },
  {
    "title": "Career Development and Promotion Guide",
    "org": "Victoria University",
    "desc": "Defines Teaching Focused Academic category — using SoTL outputs, curriculum leadership, and peer review as promotion evidence.",
    "url": "https://policy.vu.edu.au/download.php?id=237&version=3&associated",
    "category": "Academic Promotion"
  },
  {
    "title": "Higher Education Academic Promotions Policy",
    "org": "Victoria University",
    "desc": "How promotion panels assess merit against the Academic Performance Expectations Framework across Teaching, Research, and combined.",
    "url": "https://policy.vu.edu.au/download.php?id=23&version=4",
    "category": "Academic Promotion"
  },
  {
    "title": "Academic Promotions Guidelines",
    "org": "University of Melbourne",
    "desc": "Integration of Framework for Educational Excellence into promotions, emphasising whole-of-career achievements for education-focused advancement.",
    "url": "https://about.unimelb.edu.au/__data/assets/pdf_file/0032/418496/academic-promotions-guidelines-2024.pdf",
    "category": "Academic Promotion"
  },
  {
    "title": "Criteria for Academic Performance",
    "org": "University of Queensland",
    "desc": "Institutional expectations for teaching, SoTL, and academic leadership — threshold standards for continuing appointments and promotion.",
    "url": "https://policies.uq.edu.au/download.php?id=1414&version=2&associated",
    "category": "Academic Promotion"
  },
  {
    "title": "Promotion of Academic Staff Procedure",
    "org": "University of Queensland",
    "desc": "Procedural steps for promotion applications including assessment relative to academic category (e.g., Teaching Focused).",
    "url": "https://policies.uq.edu.au/download.php?id=267&version=1",
    "category": "Academic Promotion"
  },
  {
    "title": "Academic Staff Promotions Policy",
    "org": "Charles Darwin University",
    "desc": "Teaching Focused Academics must address mandatory T&L areas; rewards sustained contribution and pedagogical leadership to Level E.",
    "url": "https://policies.cdu.edu.au/download.php?id=140&version=1",
    "category": "Academic Promotion"
  },
  {
    "title": "Indigenisation of Curricula",
    "org": "University of Sydney",
    "desc": "Practical guide distinguishing bolt-on Indigenous content from true scholarly Indigenisation — partnerships and addressing staff hesitancy.",
    "url": "https://www.sydney.edu.au/content/dam/intranet/public-documents/ioc-brochure-digital-version.pdf",
    "category": "Indigenising Curriculum"
  },
  {
    "title": "Indigenising Curriculum Mapping Report",
    "org": "University of Queensland",
    "desc": "Staged framework for curriculum mapping across disciplines, from introductory cultural awareness to immersive lived experiences.",
    "url": "https://hass.uq.edu.au/files/78103/Indigenising-curriculum-mapping-report.pdf",
    "category": "Indigenising Curriculum"
  },
  {
    "title": "Embedding an Indigenous Graduate Attribute",
    "org": "UTS",
    "desc": "Governance, phased processes, and dedicated support for embedding an Indigenous graduate attribute across an entire university.",
    "url": "https://opus.lib.uts.edu.au/bitstream/10453/188660/2/Gainsford%20%26%20Attree%202025%20A%20university-wide%20approach%20to%20embedding%20an%20Indigenous%20graduate%20attribute.pdf",
    "category": "Indigenising Curriculum"
  },
  {
    "title": "Indigenising a Business Curriculum",
    "org": "Griffith University",
    "desc": "Designing business curricula that prepare graduates to engage with Indigenous businesses — beyond ‘add Indigenous and stir’.",
    "url": "https://research-repository.griffith.edu.au/server/api/core/bitstreams/16b69f97-c51f-4abc-b02b-cfd8be622cd0/content",
    "category": "Indigenising Curriculum"
  },
  {
    "title": "Decolonising Higher Education: (Re)conceptualising Knowing and Knowledge",
    "org": "University of Newcastle",
    "desc": "Doctoral thesis on epistemic responsibility — shifting the gaze to pedagogical experiences within the White post-colonial university.",
    "url": "https://openresearch.newcastle.edu.au/ndownloader/files/54330479",
    "category": "Indigenising Curriculum"
  },
  {
    "title": "Indigenous Curriculum Resource Project",
    "org": "University of Melbourne",
    "desc": "How Indigenous peoples have responded to Western knowledge production — cultural appropriation, IP, and self-determination in arts.",
    "url": "https://arts-icrp.unimelb.edu.au/static/assets/media/Arts%20and%20Cultural%20Management.pdf",
    "category": "Indigenising Curriculum"
  },
  {
    "title": "Internationalisation of Teaching, Learning, and the Curriculum in Context",
    "org": "James Cook University",
    "desc": "The paradox of categorising Indigenising the curriculum under internationalisation — situating learning within local contexts.",
    "url": "https://researchonline.jcu.edu.au/85803/1/85803.pdf",
    "category": "Indigenising Curriculum"
  },
  {
    "title": "Inclusive Teaching, Learning, and Assessment Practice (UDL)",
    "org": "University of Queensland",
    "desc": "Action-oriented UDL framework mapped to CAST 3.0 guidelines with practical applications for increasing HE accessibility.",
    "url": "https://www.eait.uq.edu.au/files/63494/Inclusive%20teaching%2C%20learning%2C%20and%20assessment%20practice%20%28UDL%20two%20pager%29%281%29.pdf",
    "category": "UDL Frameworks"
  },
  {
    "title": "Universal Design for Learning Framework",
    "org": "Be You (Australia)",
    "desc": "Australian framework informing curriculum adaptations and environmental design for equal participation of every learner.",
    "url": "https://beyou.edu.au/-/media/resources/disability-inclusion-guide/universal-design-for-learning/pdfs/universal-design-for-learning.pdf",
    "category": "UDL Frameworks"
  },
  {
    "title": "UDL Q&A for Higher Education",
    "org": "Elizabethtown College",
    "desc": "How UDL provides flexible, supportive curricula responsive to individual student variability across all cohorts.",
    "url": "https://www.etown.edu/offices/disability/files/Universal-Design-Learning-HigherEdfactsheets.pdf",
    "category": "UDL Frameworks"
  },
  {
    "title": "What is Universal Design for Learning? (Resource Guide)",
    "org": "Saint Louis University",
    "desc": "Pedagogical framework outlining means of representation, expression, and engagement for accessible course design.",
    "url": "https://www.slu.edu/cttl/resources/resource-guides/what-is-universal-design-for-learning.pdf",
    "category": "UDL Frameworks"
  },
  {
    "title": "Five Propositions for Genuine Students as Partners Practice",
    "org": "University of Queensland",
    "desc": "Core propositions challenging traditional hierarchies — shared responsibility and joint ownership for teaching, learning, and assessment.",
    "url": "https://itali.uq.edu.au/files/1038/Five-propositions-for-genuine-students-as-partners-practice.pdf",
    "category": "Students as Partners"
  },
  {
    "title": "Student Engagement Through Partnership Framework",
    "org": "Advance HE",
    "desc": "Foundational framework identifying core areas for partnership: learning, teaching, research, institutional enhancement and governance.",
    "url": "https://www.advance-he.ac.uk/sites/default/files/2020-05/Student%20Engagement%20Through%20Partnership%20Framework.pdf",
    "category": "Students as Partners"
  },
  {
    "title": "Students as Partners Framework",
    "org": "University of Wollongong",
    "desc": "Students as co-creators and active members in university governance, curriculum design, and content delivery.",
    "url": "https://documents.uow.edu.au/content/groups/public/@web/@currentstudents/documents/doc/uow273208.pdf",
    "category": "Students as Partners"
  },
  {
    "title": "A Guide to Working with Students as Partners",
    "org": "University of Chester",
    "desc": "Comprehensive framework: what it means to work with students in curriculum design, research, and governance.",
    "url": "https://www.chester.ac.uk/media/media/documents/guides/PTSK0002046-Students-as-Partners-Guidance-Booklet-2025_WEB.pdf",
    "category": "Students as Partners"
  },
  {
    "title": "Students and Staff as Partners in Australian Higher Education",
    "org": "University of Queensland",
    "desc": "Lived experiences of collaborating in partnership — co-teaching, co-inquiring, and co-designing across disciplines.",
    "url": "https://espace.library.uq.edu.au/view/UQ:598467/UQ598467_OA.pdf",
    "category": "Students as Partners"
  },
  {
    "title": "Towards Partnerships and Growth-Fostering Relationships",
    "org": "JoSoTL",
    "desc": "How SaP frameworks counteract transactional HE models by involving students as meaningful contributors to knowledge production.",
    "url": "https://scholarworks.iu.edu/journals/index.php/josotl/article/download/37375/43938/125001",
    "category": "Students as Partners"
  },
  {
    "title": "Assurance of Learning in Fully Online Credentialled Programs",
    "org": "Dollinger et al.",
    "desc": "Briefing paper distinguishing assessment security from true assurance of learning in online and hybrid credentials.",
    "url": "https://www.researchgate.net/profile/Mollie-Dollinger/publication/398270859_Assurance_of_Learning_in_Fully_Online_Credentialled_Programs_A_Briefing_Paper_for_the_Australian_Higher_Education_Sector/links/692fcbb918a6405a30faa0f3/Assurance-of-Learning-in-Fully-Online-Credentialled-Programs-A-Briefing-Paper-for-the-Australian-Higher-Education-Sector.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Are Academics and Senior Leaders Singing from the Same Hymn Sheet?",
    "org": "Murdoch University",
    "desc": "Challenges of implementing AoL and necessity of continuous improvement when evaluating programmatic student outcomes.",
    "url": "https://researchrepository.murdoch.edu.au/33214/1/assurance%20of%20learning.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Guidance Note: Academic Quality Assurance",
    "org": "TEQSA",
    "desc": "Institutional QA mechanisms, continuous improvement, and fundamental requirements for verifying academic standards.",
    "url": "https://www.teqsa.gov.au/sites/default/files/guidance-note-academic-quality-assurance-v2-2-web.pdf",
    "category": "Quality Assurance"
  },
  {
    "title": "QAA Services for Quality Assurance Authorities",
    "org": "QAA (UK)",
    "desc": "Establishing robust QA frameworks aligned with international standards and developing operational guidelines.",
    "url": "https://www.qaa.ac.uk/docs/qaa/training-and-consultancy/qaa-services-for-quality-assurance-authorities.pdf?sfvrsn=fb82a181_4",
    "category": "Quality Assurance"
  },
  {
    "title": "Consultation: Amendments to Higher Education Standards Framework (2021)",
    "org": "Department of Education",
    "desc": "2026 consultation addressing governance transparency, systemic barriers, and AI responses in the TEQSA Threshold Standards.",
    "url": "https://www.education.gov.au/download/20172/consultation-paper-amendments-higher-education-standards-framework-threshold-standards-2021/44177/document/pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Guidance Note: Research and Research Training",
    "org": "TEQSA",
    "desc": "2025 expectations for maintaining integrity, quality, and supervision of research training.",
    "url": "https://www.teqsa.gov.au/sites/default/files/2025-01/guidance-note-research-and-research-training.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Guidance Note: Admissions (Coursework)",
    "org": "TEQSA",
    "desc": "Regulatory baseline for transparent, equitable, and consistent admissions frameworks.",
    "url": "https://www.teqsa.gov.au/sites/default/files/guidance-note-admissions-coursework-v2-0.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Good Practice Note: Admissions Transparency",
    "org": "TEQSA",
    "desc": "Sector-wide examples of how institutions ensure prospective students make informed choices.",
    "url": "https://www.teqsa.gov.au/sites/default/files/gpn-admissions-transparency-june-2019.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Contemporary Approaches to University Teaching (CAUT) S1 2026",
    "org": "CAULLT",
    "desc": "Framework and module outline for the award-winning, cross-institutional program to develop university educators.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Contemporary-Approaches-to-University-Teaching-Course_S1_2026.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Primary Prevention of Sexual Harm in the University Sector",
    "org": "Universities Australia",
    "desc": "2023 evidence-based frameworks to transform social contexts and eliminate gender-based violence on campuses.",
    "url": "https://universitiesaustralia.edu.au/wp-content/uploads/2023/07/PRIMARY-PREVENTION-OF-SEXUAL-HARM-IN-THE-UNIVERSITY-SECTOR.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "University of Newcastle Assessment Framework",
    "org": "University of Newcastle",
    "desc": "2025 strategic document balancing secure assessment tasks with open, AI-enabled learning across programs.",
    "url": "https://www.newcastle.edu.au/__data/assets/pdf_file/0008/1095884/UON-Assessment-Framework_November-2025.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Guidance Note: Credit and Recognition of Prior Learning",
    "org": "TEQSA",
    "desc": "Threshold expectations for distinguishing entry-level RPL from credit-granting RPL.",
    "url": "https://www.teqsa.gov.au",
    "category": "Regulatory & Policy"
  },
  {
    "title": "AUTCAS Framework Matrices",
    "org": "Australian Universities",
    "desc": "Maps performance indicators across five academic levels (A–E) and seven core criteria to guide promotions.",
    "url": "https://www.unimelb.edu.au",
    "category": "Teaching Quality"
  },
  {
    "title": "Source, Scope, and Sphere Model of Evidence",
    "org": "Advance HE",
    "desc": "Evaluating teaching excellence by triangulating personal reflection, student feedback, and peer observations.",
    "url": "https://www.advance-he.ac.uk",
    "category": "Teaching Quality"
  },
  {
    "title": "UNSW Integrated Curriculum Framework",
    "org": "UNSW",
    "desc": "Implementation of Constructive Alignment where assessment tasks strictly map to program outcomes.",
    "url": "https://www.unsw.edu.au",
    "category": "Teaching Quality"
  },
  {
    "title": "Research Impact Assessment Framework",
    "org": "University of Sydney",
    "desc": "Evaluating research environments, alignment to priorities, and translation of research into societal impact.",
    "url": "https://www.sydney.edu.au/content/dam/corporate/documents/faculty-of-medicine-and-health/research/research-impact-assessment-framework/2024-riaf-data-collection-tools.pdf.coredownload.pdf",
    "category": "Research & Impact"
  },
  {
    "title": "A New Framework for Researcher Assessment",
    "org": "Australia’s Chief Scientist",
    "desc": "2025 report proposing modernised assessment moving beyond publication metrics to assess true quality and impact.",
    "url": "https://www.chiefscientist.gov.au/sites/default/files/2025-02/a_new_framework_for_researcher_assessment.pdf",
    "category": "Research & Impact"
  },
  {
    "title": "Coursework Curriculum Design and Structure Procedure",
    "org": "UniSQ",
    "desc": "Formal procedure defining permissible volume, structural architecture, and modular parameters of award coursework.",
    "url": "https://policy.unisq.edu.au/documents/21131PL/pdf",
    "category": "Microcredentials"
  },
  {
    "title": "Credit and Exemption Procedure",
    "org": "UniSQ",
    "desc": "Institutional rules for advanced standing — strict 50% maximum RPL limit (16 CP) for standard Level 8 Graduate Certificates.",
    "url": "https://policy.unisq.edu.au/documents/131190PL/pdf",
    "category": "Microcredentials"
  },
  {
    "title": "National Microcredentials Framework (NMF Guidelines)",
    "org": "Department of Education",
    "desc": "Federal policy defining microcredentials: mandatory assessment of learning outcomes, transparency, minimum 1-hour volume.",
    "url": "https://www.education.gov.au/download/13591/national-microcredentials-framework/26500/document/pdf",
    "category": "Microcredentials"
  },
  {
    "title": "CDU ULT Handbook Framework",
    "org": "Charles Darwin University",
    "desc": "Leading precedent for modular stackability — 40 CP structure building toward a teaching e-portfolio with FHEA pathway.",
    "url": "https://www.cdu.edu.au",
    "category": "Microcredentials"
  },
  {
    "title": "Guidance for Portability of Australian Microcredentials",
    "org": "Universities Australia",
    "desc": "Three-part standard ensuring verification infrastructure, structural transparency, and consistent units of exchange.",
    "url": "https://www.universitiesaustralia.edu.au",
    "category": "Microcredentials"
  },
  {
    "title": "LIFT Fellowship Scheme",
    "org": "UniSQ / CQU",
    "desc": "Advance HE accredited internal validation allowing direct Fellowship awarding at no cost upon fulfilling portfolio criteria.",
    "url": "https://handbook.cqu.edu.au/vet/courses/view/PDC135853/4252",
    "category": "Microcredentials"
  },
  {
    "title": "Opportunity Through Online Learning Framework",
    "org": "NCSEHE",
    "desc": "Equity research guiding design of flexible, accessible asynchronous pathways for regional, remote, and non-traditional learners.",
    "url": "https://www.ncsehe.edu.au",
    "category": "Microcredentials"
  },
  {
    "title": "Registered Nurse Standards for Practice",
    "org": "NMBA",
    "desc": "Core Australian practice standards for RN competency — critical thinking, therapeutic relationships, comprehensive assessment.",
    "url": "https://www.nursingmidwiferyboard.gov.au/documents/default.aspx?record=WD16%2F19524&dbid=AP&chksum=R5Pkrn8yVpb9bJvtpTRe8w%3D%3D",
    "category": "Nursing & Midwifery"
  },
  {
    "title": "Decision-Making Framework for Nursing and Midwifery",
    "org": "NMBA",
    "desc": "Clinical assessment, ethical decision-making, and safe delegation of practice for Australian nurses and midwives.",
    "url": "https://www.nursingmidwiferyboard.gov.au/codes-guidelines-statements/frameworks.aspx",
    "category": "Nursing & Midwifery"
  },
  {
    "title": "WHO Global Standards for Initial Education of Nurses and Midwives",
    "org": "WHO",
    "desc": "Benchmark for evidence-based, globally relevant nursing and midwifery education and clinical mentorship.",
    "url": "https://iris.who.int/items/a4ae7975-6af0-46db-8df7-e23c5ddbda64",
    "category": "Nursing & Midwifery"
  },
  {
    "title": "AACN Essentials: Core Competencies for Professional Nursing Education",
    "org": "AACN",
    "desc": "Competency-based model mapping ten domains including Quality and Safety, Informatics, and Systems-Based Practice.",
    "url": "https://www.aacnnursing.org/Portals/42/Downloads/Essentials/Essentials-Executive-Summary.pdf",
    "category": "Nursing & Midwifery"
  },
  {
    "title": "SPN Pre-Licensure Core Competencies (Pediatric Nursing)",
    "org": "SPN",
    "desc": "Socio-cultural, developmental, and family-centred communication frameworks for paediatric nursing education.",
    "url": "https://spn.memberclicks.net/assets/docs/About-SPN/SPN%20Pre-Licensure%20Core%20Competencies.pdf",
    "category": "Nursing & Midwifery"
  },
  {
    "title": "Fulbright Scholar Program (Teaching/Research)",
    "org": "Fulbright",
    "desc": "International funding to lecture, conduct pedagogical research, or consult at overseas universities.",
    "url": "https://fulbrightscholars.org/",
    "category": "Global Grants"
  },
  {
    "title": "Spencer Foundation: Small Research Grants in Education",
    "org": "Spencer Foundation",
    "desc": "Grant guidelines for projects focused on improving education through rigorous, intellectually ambitious research.",
    "url": "https://www.spencer.org/grant_types/small-research-grant",
    "category": "Global Grants"
  },
  {
    "title": "Erasmus+ Programme Guide",
    "org": "European Commission",
    "desc": "Definitive guide on funding structures for international cooperation, mobility, and educational innovation in HE.",
    "url": "https://erasmus-plus.ec.europa.eu/erasmus-programme-guide",
    "category": "Global Grants"
  },
  {
    "title": "QILT: Student Experience Survey (SES) National Architecture",
    "org": "QILT",
    "desc": "Primary Australian framework collecting data on Skills Development, Learner Engagement, Teaching Quality, and Student Support.",
    "url": "https://www.qilt.edu.au/surveys/student-experience-survey-(ses)",
    "category": "Student Experience"
  },
  {
    "title": "QILT: Graduate Outcomes Survey (GOS)",
    "org": "QILT",
    "desc": "Assessing how graduates utilise skills and qualifications — short-term labour market outcomes 4-6 months after completion.",
    "url": "https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)",
    "category": "Student Experience"
  },
  {
    "title": "NSSE Conceptual Framework (National Survey of Student Engagement)",
    "org": "NSSE / Indiana University",
    "desc": "International framework measuring engagement via Academic Challenge, Active Learning, and High-Impact Practices.",
    "url": "https://nsse.indiana.edu/nsse/about-nsse/conceptual-framework/index.html",
    "category": "Student Experience"
  },
  {
    "title": "Australasian Survey of Student Engagement (AUSSE)",
    "org": "ACER",
    "desc": "Adaptation of NSSE for Australasian HE — higher-order thinking, career readiness, and general learning outcomes.",
    "url": "https://research.acer.edu.au/ausse/",
    "category": "Student Experience"
  },
  {
    "title": "Teaching and Learning Inquiry",
    "org": "ISSoTL",
    "desc": "SoTL practice and theory — flagship journal of the International Society for the Scholarship of Teaching and Learning.",
    "url": "https://journalhosting.ucalgary.ca/index.php/TLI",
    "category": "SoTL Journals"
  },
  {
    "title": "Higher Education Research & Development",
    "org": "HERDSA",
    "desc": "Leading Australasian journal for HE research — 6 issues per year, research-based scholarship on HE practice.",
    "url": "https://www.tandfonline.com/toc/cher20/current",
    "category": "SoTL Journals"
  },
  {
    "title": "Journal of University Teaching & Learning Practice",
    "org": "University of Wollongong",
    "desc": "Australian-based, practice-focused SoTL journal — open access.",
    "url": "https://ro.uow.edu.au/jutlp/",
    "category": "SoTL Journals"
  },
  {
    "title": "Studies in Higher Education",
    "org": "SRHE",
    "desc": "Policy, institutional management, teaching quality — one of the most cited HE journals globally.",
    "url": "https://www.tandfonline.com/toc/cshe20/current",
    "category": "SoTL Journals"
  },
  {
    "title": "Active Learning in Higher Education",
    "org": "SAGE",
    "desc": "Teaching methods, student engagement, and active learning pedagogies across disciplines.",
    "url": "https://journals.sagepub.com/home/alh",
    "category": "SoTL Journals"
  },
  {
    "title": "Assessment and Evaluation in Higher Education",
    "org": "Taylor & Francis",
    "desc": "Assessment practices, evaluation methods, and feedback design in tertiary education.",
    "url": "https://www.tandfonline.com/toc/caeh20/current",
    "category": "SoTL Journals"
  },
  {
    "title": "International Journal for Academic Development",
    "org": "Taylor & Francis",
    "desc": "Academic and educational development practice — the core journal for academic developers.",
    "url": "https://www.tandfonline.com/toc/rija20/current",
    "category": "SoTL Journals"
  },
  {
    "title": "Teaching in Higher Education",
    "org": "Taylor & Francis",
    "desc": "Critical perspectives on teaching practice in universities.",
    "url": "https://www.tandfonline.com/toc/cthe20/current",
    "category": "SoTL Journals"
  },
  {
    "title": "Australasian Journal of Educational Technology",
    "org": "ASCILITE",
    "desc": "Technology-enhanced learning in tertiary education — ASCILITE’s flagship journal.",
    "url": "https://ajet.org.au/",
    "category": "SoTL Journals"
  },
  {
    "title": "Australian Journal of Indigenous Education",
    "org": "Cambridge University Press",
    "desc": "Indigenous education theory and practice — essential for Indigenising the Curriculum work.",
    "url": "https://www.cambridge.org/core/journals/australian-journal-of-indigenous-education",
    "category": "SoTL Journals"
  },
  {
    "title": "International Journal for Students as Partners (IJSaP)",
    "org": "McMaster University",
    "desc": "Open-access journal on student-staff partnership in learning, teaching & research.",
    "url": "https://mulpress.mcmaster.ca/ijsap/",
    "category": "SoTL Journals"
  },
  {
    "title": "Journal of Teaching & Learning for Graduate Employability",
    "org": "Deakin University",
    "desc": "Open-access journal on employability, work-integrated learning & career development in HE.",
    "url": "https://ojs.deakin.edu.au/index.php/jtlge",
    "category": "SoTL Journals"
  },
  {
    "title": "Student Success",
    "org": "STARS / QUT",
    "desc": "Open-access journal on student success, retention, transition and the first-year experience.",
    "url": "https://studentsuccessjournal.org/",
    "category": "SoTL Journals"
  },
  {
    "title": "Journal of Academic Language & Learning (JALL)",
    "org": "AALL",
    "desc": "Open-access journal of the Association for Academic Language & Learning — ALL practice & research.",
    "url": "https://journal.aall.org.au/",
    "category": "SoTL Journals"
  },
  {
    "title": "QUT Curriculum Design, Approval and Accreditation Policy",
    "org": "QUT",
    "desc": "Institutional framework aligned to HESF threshold standards for curriculum design.",
    "url": "https://mopp.qut.edu.au/download.php?id=82&version=1",
    "category": "Curriculum Design"
  },
  {
    "title": "Bridging the Equivalence Gap in Tertiary Education",
    "org": "CQUniversity",
    "desc": "Equivalent educator practices to bridge the peer-connection gap between online and face-to-face.",
    "url": "https://acquire.cqu.edu.au/ndownloader/files/57079310",
    "category": "Curriculum Design"
  },
  {
    "title": "ESD Curriculum Design Toolkit",
    "org": "Advance HE",
    "desc": "Five-phase approach to integrating UN SDGs into university curricula.",
    "url": "https://www.advance-he.ac.uk/knowledge-hub/education-sustainable-development-curriculum-design-toolkit",
    "category": "Curriculum Design"
  },
  {
    "title": "Embedding Disciplinary Identities in Curriculum Design",
    "org": "QAA (UK)",
    "desc": "Guiding design, evaluation, and delivery of shared interdisciplinary modules.",
    "url": "https://www.qaa.ac.uk/docs/qaa/members/toolkit-embedding-disciplinary-identities-in-curriculum-design.pdf?sfvrsn=3b18bd81_6",
    "category": "Curriculum Design"
  },
  {
    "title": "Curriculum Development Toolkit (Backwards Design)",
    "org": "US Dept of Education",
    "desc": "Backwards design templates for aligning content with overarching objectives.",
    "url": "https://www.ed.gov/sites/ed/files/2023/11/Curriculum-Development-Toolkit.pdf",
    "category": "Curriculum Design"
  },
  {
    "title": "Creating and Using Teaching Philosophy Statements",
    "org": "EKU",
    "desc": "TPS as a bridge between theory and practice — purposeful, reflective scholarly teaching.",
    "url": "https://encompass.eku.edu/cgi/viewcontent.cgi?article=1720&context=jote",
    "category": "Teaching Philosophy"
  },
  {
    "title": "How to Write a Teaching Statement That Sings",
    "org": "OHSU",
    "desc": "Anchoring philosophical declarations into concrete, visualisable classroom practices.",
    "url": "https://www.ohsu.edu/sites/default/files/2019-04/Teaching-Statement-Guidebook.pdf",
    "category": "Teaching Philosophy"
  },
  {
    "title": "Constructivist Strategies in Higher Education",
    "org": "Kennesaw State",
    "desc": "Transition from passive transmission to active meaning-making with applied strategies.",
    "url": "https://digitalcommons.kennesaw.edu/cgi/viewcontent.cgi?article=1032&context=rtt",
    "category": "Teaching Philosophy"
  },
  {
    "title": "Critical Pedagogy Is Too Big to Fail (Ira Shor)",
    "org": "CUNY",
    "desc": "Power dynamics, student resistance, grading contracts — democratising the classroom.",
    "url": "https://wp.stolaf.edu/cila/files/2020/08/Shor-2009-Critical-Pedagogy.pdf",
    "category": "Teaching Philosophy"
  },
  {
    "title": "Critical Pedagogy in the Science Classroom",
    "org": "Antioch University",
    "desc": "Applying critical pedagogy in STEM — dismantling dominance relationships.",
    "url": "https://www.antioch.edu/wp-content/uploads/2017/11/Thiet-2017-FINAL.pdf",
    "category": "Teaching Philosophy"
  },
  {
    "title": "Defining the Scholarship of Teaching and Learning",
    "org": "Iowa State",
    "desc": "Evolution of SoTL definitions (Boyer, Glassick) — baseline criteria for evidence-based pedagogical research.",
    "url": "https://dr.lib.iastate.edu/server/api/core/bitstreams/6114d0cb-f783-439a-9bf5-b84cefdde825/content",
    "category": "SoTL Foundations"
  },
  {
    "title": "Qualitative Inquiry in SoTL Research",
    "org": "Illinois State",
    "desc": "Why qualitative methods are essential to understand the ‘why’ behind learning.",
    "url": "https://ir.library.illinoisstate.edu/cgi/viewcontent.cgi?article=1316&context=tlcsd",
    "category": "SoTL Foundations"
  },
  {
    "title": "Mixed Methods in Educational Research",
    "org": "NCRM (UK)",
    "desc": "Triangulating LMS analytics with student narratives for robust curriculum redesign cases.",
    "url": "https://repository.ncrm.ac.uk/resources/",
    "category": "SoTL Foundations"
  },
  {
    "title": "HERDSA Annual Conference",
    "org": "HERDSA",
    "desc": "Premier Australasian gathering for peer-reviewed SoTL research and pedagogical innovations.",
    "url": "https://herdsa.org.au/",
    "category": "Conferences"
  },
  {
    "title": "ASCILITE 2026 (Brisbane, Nov 29–Dec 2)",
    "org": "ASCILITE",
    "desc": "Educational technologies, digital learning, and AI integration — Brisbane 2026.",
    "url": "https://2026conference.ascilite.org/",
    "category": "Conferences"
  },
  {
    "title": "STARS Conference",
    "org": "STARS",
    "desc": "Student Transitions, Achievement, Retention, and Success — first-year experience and widening participation.",
    "url": "https://unistars.org/",
    "category": "Conferences"
  },
  {
    "title": "TEQSA Annual Conference",
    "org": "TEQSA",
    "desc": "Risk-based quality assurance, regulatory compliance, academic integrity, and GenAI responses.",
    "url": "https://www.teqsaconference.org.au/",
    "category": "Conferences"
  },
  {
    "title": "National Students as Partners Roundtable",
    "org": "SaP Network",
    "desc": "Central forum for co-creating curriculum and university governance with students.",
    "url": "https://itali.uq.edu.au/teaching-guidance/student-partnerships",
    "category": "Conferences"
  },
  {
    "title": "CRADLE International Symposium",
    "org": "CRADLE (Deakin)",
    "desc": "Programmatic assessment, feedback literacy, and secure task design in the GenAI era.",
    "url": "https://blogs.deakin.edu.au/cradle/",
    "category": "Conferences"
  },
  {
    "title": "EPHEA Conference",
    "org": "EPHEA",
    "desc": "Dismantling systemic barriers, applying UDL, and advancing inclusive and decolonial curricula.",
    "url": "https://ephea.org/",
    "category": "Conferences"
  },
  {
    "title": "ANZAHPE Annual Conference",
    "org": "ANZAHPE",
    "desc": "Health professional educators — clinical reasoning, simulation, and workplace-based assessment.",
    "url": "https://www.anzahpe.org/",
    "category": "Conferences"
  },
  {
    "title": "AARE Annual Conference",
    "org": "AARE",
    "desc": "Structural educational theory, qualitative/quantitative methodology, and tertiary policy analysis.",
    "url": "https://www.aare.edu.au/",
    "category": "Conferences"
  },
  {
    "title": "AIEC (Australian International Education Conference)",
    "org": "IDP",
    "desc": "Global student mobility, internationalising curriculum, cross-border partnerships.",
    "url": "https://aiec.idp.com/",
    "category": "Conferences"
  },
  {
    "title": "NAEEA Conference",
    "org": "NAEEA",
    "desc": "Bridging programs, widening participation, and non-traditional student transitions.",
    "url": "https://enablingeducators.org/",
    "category": "Conferences"
  },
  {
    "title": "FLANZ Biennial Conference",
    "org": "FLANZ (NZ)",
    "desc": "Distance education, asynchronous learning design, and hybrid teaching models.",
    "url": "https://flanz.org.nz/",
    "category": "Conferences"
  },
  {
    "title": "ISANA International Education Conference",
    "org": "ISANA",
    "desc": "International student welfare, cultural integration, safety compliance.",
    "url": "https://isana.org.au/",
    "category": "Conferences"
  },
  {
    "title": "EPortfolios Australia Forum",
    "org": "ePortfolios Australia",
    "desc": "Pedagogy, implementation, and platforms for e-portfolio assessment.",
    "url": "https://eportfoliosaustralia.wordpress.com/",
    "category": "Conferences"
  },
  {
    "title": "POD Network Annual Conference",
    "org": "POD Network",
    "desc": "Premier global conference for educational developers and faculty development.",
    "url": "https://podnetwork.org/",
    "category": "Conferences"
  },
  {
    "title": "SEDA Conferences",
    "org": "SEDA (UK)",
    "desc": "Professional certification of university teachers, portfolio mapping, and CPD.",
    "url": "https://www.seda.ac.uk/",
    "category": "Conferences"
  },
  {
    "title": "SRHE International Conference",
    "org": "SRHE",
    "desc": "Sociology, policy architectures, and systemic evolution of HE research.",
    "url": "https://srhe.ac.uk/",
    "category": "Conferences"
  },
  {
    "title": "Australasian Simulation Congress",
    "org": "ASC",
    "desc": "Clinical simulation pedagogy, virtual realities, and structured debriefing.",
    "url": "https://www.simhealth.com.au/",
    "category": "Conferences"
  },
  {
    "title": "Open Education Australasia Symposia",
    "org": "OEA",
    "desc": "Open Educational Practices, OER, and dismantling equity barriers via open textbooks.",
    "url": "https://oercommons.org/",
    "category": "Conferences"
  },
  {
    "title": "AAEE Annual Conference",
    "org": "AAEE",
    "desc": "Discipline-specific SoTL in engineering — project-based learning.",
    "url": "https://aaee.net.au/",
    "category": "Conferences"
  },
  {
    "title": "STLHE Annual Conference",
    "org": "STLHE (Canada)",
    "desc": "Scholarship of teaching, student-faculty co-design, and educational leadership.",
    "url": "https://www.stlhe.ca/",
    "category": "Conferences"
  },
  {
    "title": "HELTASA Co-creation Spaces",
    "org": "HELTASA (South Africa)",
    "desc": "Southern epistemologies, decolonial curriculum re-design, and structural equity.",
    "url": "https://heltasa.org.za/",
    "category": "Conferences"
  },
  {
    "title": "ACSES National Equity Forums",
    "org": "ACSES",
    "desc": "Data-driven interventions for underrepresented cohorts and equity gap metrics.",
    "url": "https://www.acses.edu.au/",
    "category": "Conferences"
  },
  {
    "title": "ABC Learning Design Toolkit",
    "org": "UCL",
    "desc": "Sprint-based visual storyboarding for rapid curriculum transition to blended/online delivery.",
    "url": "https://abc-ld.org/",
    "category": "Learning Design"
  },
  {
    "title": "Carpe Diem Learning Design Methodology",
    "org": "Gilly Salmon",
    "desc": "Team-based agile approach — constructive alignment, e-tivities, rapid prototyping.",
    "url": "https://www.gillysalmon.com/carpe-diem.html",
    "category": "Learning Design"
  },
  {
    "title": "The 7Cs of Learning Design (Conole)",
    "org": "University of Leicester",
    "desc": "Conceptualize, Capture, Communicate, Collaborate, Consider, Combine, Consolidate.",
    "url": "https://www.ascilite.org/conferences/Wellington12/2012/images/custom/conole,_grainne_-_the_7cs.pdf",
    "category": "Learning Design"
  },
  {
    "title": "Quality Matters Higher Education Rubric",
    "org": "Quality Matters",
    "desc": "International rubric for rigorous alignment of objectives, assessment, and materials.",
    "url": "https://www.qualitymatters.org/",
    "category": "Learning Design"
  },
  {
    "title": "Community of Inquiry (CoI) Framework",
    "org": "Athabasca University",
    "desc": "Social, Cognitive, and Teaching Presence as prerequisites for online learning.",
    "url": "https://coi.athabascau.ca/",
    "category": "Learning Design"
  },
  {
    "title": "UDL on Campus (CAST)",
    "org": "CAST",
    "desc": "HE-specific UDL guidelines for syllabus creation, learning design, and digital resources.",
    "url": "https://udloncampus.cast.org/",
    "category": "Learning Design"
  },
  {
    "title": "OLC Quality Scorecard Suite",
    "org": "Online Learning Consortium",
    "desc": "Metrics for evaluating systemic quality of digital learning programs.",
    "url": "https://onlinelearningconsortium.org/consult/olc-quality-scorecard-suite/",
    "category": "Learning Design"
  },
  {
    "title": "Backward Design (Understanding by Design)",
    "org": "Vanderbilt CFT",
    "desc": "Wiggins and McTighe — design starting with desired outcomes rather than content delivery.",
    "url": "https://cft.vanderbilt.edu/guides-sub-pages/understanding-by-design/",
    "category": "Learning Design"
  },
  {
    "title": "ASCILITE Learning Design SIG",
    "org": "ASCILITE",
    "desc": "Collaborative community sharing open-source templates, storyboards, and mapping tools.",
    "url": "https://www.ascilite.org/get-involved/sigs/learning-design-sig/",
    "category": "Learning Design"
  },
  {
    "title": "Enacting Assessment Reform in a Time of AI (2025)",
    "org": "TEQSA",
    "desc": "Pragmatic guidance emphasising structural redesign over detection for programmatic learning assurance.",
    "url": "https://www.teqsa.gov.au/sites/default/files/2025-09/enacting-assessment-reform-in-a-time-of-artificial-intelligence.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Gen AI Strategies for Australian HE: Emerging Practice",
    "org": "TEQSA",
    "desc": "Synthesis of 203 institutional action plans — benchmark your AI governance and risk assessments.",
    "url": "https://www.teqsa.gov.au/sites/default/files/2024-11/Gen-AI-strategies-emerging-practice-toolkit.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Good Practice Note: Addressing Contract Cheating (2nd Ed, 2026)",
    "org": "TEQSA",
    "desc": "Updated directives for mitigating commercial cheating, mapped to HESF 2021.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/good-practice-notes/good-practice-note-addressing-contract-cheating-safeguard-academic-integrity",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Academic Integrity Toolkit (Revised 2026)",
    "org": "TEQSA",
    "desc": "Comprehensive toolkit with new modules on assessment security and GenAI-specific risks.",
    "url": "https://www.teqsa.gov.au/about-us/news-and-events/latest-news/revised-academic-integrity-toolkit-now-available",
    "category": "Regulatory & Policy"
  },
  {
    "title": "UNESCO Guidance for Generative AI in Education and Research",
    "org": "UNESCO",
    "desc": "Global policy framework for human-centred AI adoption — data privacy, IP, cultural diversity.",
    "url": "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research",
    "category": "Regulatory & Policy"
  },
  {
    "title": "UNESCO AI Competency Frameworks",
    "org": "UNESCO",
    "desc": "Progression levels from foundational understanding to critical reflection and co-creation.",
    "url": "https://www.unesco.org/en/digital-education/ai-future-learning",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Gen AI Strategies for Research Training",
    "org": "TEQSA",
    "desc": "Emerging practice toolkit for AI in graduate research and HDR supervision.",
    "url": "https://www.teqsa.gov.au/sites/default/files/2025-06/Gen-AI-strategies-research-training-emerging-practice-toolkit.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Monash GenAI Guidance for Graduate Research",
    "org": "Monash University",
    "desc": "Aligning institutional AI practices with the Australian Code for Responsible Conduct of Research.",
    "url": "https://www.monash.edu/graduate-research/support-and-resources/guidance-on-generative-ai",
    "category": "Regulatory & Policy"
  },
  {
    "title": "ACODE TEL Benchmarks 2024 (2nd Edition)",
    "org": "ACODE",
    "desc": "Eight-dimension self-evaluation framework for institutional digital capacity.",
    "url": "https://acode.edu.au/wp-content/uploads/2024/01/ACODE-TEL-Benchmarks-2024-1.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "TELAS Framework",
    "org": "ASCILITE / TELAS",
    "desc": "Technology-Enhanced Learning Accreditation Standards for institutional digital learning excellence.",
    "url": "https://telas.edu.au/framework/",
    "category": "Teaching Quality"
  },
  {
    "title": "ACODE Annual Report 2024",
    "org": "ACODE",
    "desc": "Sector-wide digital learning trends and benchmarking outcomes.",
    "url": "https://acode.edu.au/wp-content/uploads/2025/03/ACODE-Annual-Report-2024-2.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Embracing AI for Student and Staff Productivity (ACODE Whitepaper)",
    "org": "ACODE",
    "desc": "Workshop outcomes on AI integration for productivity across teaching and administration.",
    "url": "https://open-publishing.org/publications/index.php/APUB/article/view/401",
    "category": "Teaching Quality"
  },
  {
    "title": "Virtual Collaboration and Groupwork in Online Learning",
    "org": "ACODE",
    "desc": "Framework for effective virtual collaboration and assessment in online environments.",
    "url": "https://acode.edu.au/wp-content/uploads/2023/11/Virtual-collaboration.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Assuring Learning in the Age of AI (Torrens Benchmarking Report)",
    "org": "Torrens University",
    "desc": "Strategic insights and sector directions for assurance of learning with AI.",
    "url": "https://torrens.figshare.com/articles/online_resource/Assuring_Learning_in_the_Age_of_AI_Strategic_Insights_and_Sector_Directions-_Preliminary_Benchmarking_Report/30866858",
    "category": "Assurance of Learning"
  },
  {
    "title": "Programmatic Assessment as a Road Trip",
    "org": "HERDSA",
    "desc": "Practical advice for the journey from unit-based to programmatic assessment.",
    "url": "https://herdsa.org.au/herdsa-connect/programmatic-assessment-road-trip-some-advice-journey",
    "category": "Assurance of Learning"
  },
  {
    "title": "Programmatic Assessment for Learning: AMEE Guide No. 174",
    "org": "Flinders University",
    "desc": "A programmatically designed assessment for the purpose of learning.",
    "url": "https://researchnow.flinders.edu.au/en/publications/programmatic-assessment-for-learning-a-programmatically-designed-/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Comparing Apples and Oranges: Transforming Assessment at UNSW with PAL",
    "org": "UNSW",
    "desc": "How UNSW is rebuilding assessment around programmatic assessment for learning.",
    "url": "https://www.education.unsw.edu.au/news-events/news/comparing-apples-and-oranges-programmatic-assessment-learning",
    "category": "Assurance of Learning"
  },
  {
    "title": "From Traditional to Programmatic Assessment in Three (Not So Easy) Steps",
    "org": "MDPI Education",
    "desc": "Practical model for transitioning a program to programmatic assessment.",
    "url": "https://www.mdpi.com/2227-7102/12/7/487",
    "category": "Assurance of Learning"
  },
  {
    "title": "Programmatic Assessment for Learning (PAL) in GP Training",
    "org": "PMC",
    "desc": "Application of a PAL system in general practice training.",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5704621/",
    "category": "Assurance of Learning"
  },
  {
    "title": "An Evaluation of Programmatic Assessment Across Health Programs",
    "org": "PMC",
    "desc": "Contribution analysis of PAL implementation across four Australian dietetic programs.",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12929344/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Using Programmatic Assessment to Design an Integrated Curriculum",
    "org": "ASABE",
    "desc": "Designing an integrated curriculum through programmatic assessment.",
    "url": "https://elibrary.asabe.org/azdez.asp?JID=5&AID=54936&CID=ana2024&T=2",
    "category": "Assurance of Learning"
  },
  {
    "title": "Programmatic Assessment (Topic Hub)",
    "org": "HERDSA",
    "desc": "Curated HERDSA collection on programmatic approaches to assessment.",
    "url": "https://herdsa.org.au/topics/programmatic-assessment",
    "category": "Assurance of Learning"
  },
  {
    "title": "From Vision to Practice: Australasian Symposium on Programmatic Approaches to Assessment",
    "org": "HERDSA",
    "desc": "Wrap-up of the inaugural symposium (ASCILITE & HERDSA Assessment SIGs).",
    "url": "https://herdsa.org.au/herdsa-connect/vision-practice-wrapping-australasian-symposium-programmatic-approaches-assessment",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessments User Guide",
    "org": "Charles Sturt University",
    "desc": "Comprehensive design guide for authentic, scaffolded interactive orals.",
    "url": "https://cdn.csu.edu.au/__data/assets/pdf_file/0003/4352061/Interactive-Oral-Assessments-User-Guide.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessment (How-To)",
    "org": "Charles Sturt University",
    "desc": "CSU's L&T guidance on running interactive oral assessments.",
    "url": "https://www.csu.edu.au/division/learning-teaching/assessments/assessment-types/interactive-oral-assessment",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessments: A Viable Model for COVID-19 and Beyond",
    "org": "Griffith University",
    "desc": "Griffith's pioneering work on interactive orals as authentic assessment.",
    "url": "https://news.griffith.edu.au/2021/06/23/interactive-oral-assessments-a-viable-model-for-covid-19-and-beyond/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessment: Formative and Summative Purposes",
    "org": "Griffith University",
    "desc": "Research on the dual purposes of interactive oral assessment.",
    "url": "https://research-repository.griffith.edu.au/bitstreams/6592fc94-da9f-4a11-913f-80c0e95c1df0/download",
    "category": "Assurance of Learning"
  },
  {
    "title": "When Old Becomes New: Oral Examination as an Online Assessment Tool",
    "org": "Griffith University",
    "desc": "Case study of oral examination as an online assessment tool.",
    "url": "https://research-repository.griffith.edu.au/server/api/core/bitstreams/ced50fd3-3707-4e8d-a1a2-cf212b4e5474/content",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessments",
    "org": "TeachWell Digital, University of Auckland",
    "desc": "Practical TeachWell guidance on interactive oral assessments.",
    "url": "https://teachwell.auckland.ac.nz/assessment/interactive-oral-assessments/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessment: Staff Perceptions, Challenges and Benefits",
    "org": "Taylor & Francis",
    "desc": "Robust, authentic assessment design approach — staff study.",
    "url": "https://www.tandfonline.com/doi/full/10.1080/14703297.2025.2477160",
    "category": "Assurance of Learning"
  },
  {
    "title": "Oral / Viva Voce Assessment Quick Guide",
    "org": "Macquarie University",
    "desc": "Quick guide to designing and running oral (viva voce) assessments.",
    "url": "https://ishare.mq.edu.au/prod/file/56bad8d6-6f58-4830-ae97-67a7f7244706/1/MQ_2023_Oral_Assessment_Quick_Guide_Macquarie_University.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessment: User Guide",
    "org": "Dublin City University",
    "desc": "DCU's user guide for interactive oral assessment.",
    "url": "https://www.dcu.ie/sites/default/files/inline-files/interactive-oral-io-user-guide.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Viva Voce! A Guide to Online Oral Exams",
    "org": "UTS Education Express",
    "desc": "Practical guide to online oral exams at UTS.",
    "url": "https://educationexpress.uts.edu.au/blog/2020/11/12/viva-voce-online-oral-exams/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Orals at Scale: Drawing the Owl",
    "org": "HERDSA",
    "desc": "What happened when we tried to scale interactive orals to large cohorts.",
    "url": "https://herdsa.org.au/herdsa-connect/interactive-orals-scale-what-happened-when-we-tried-draw-owl",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessment (Assessment Design Studio)",
    "org": "Curtin University",
    "desc": "Curtin's Assessment 2030 design studio resource on interactive orals.",
    "url": "https://www.curtin.edu.au/assessment2030/assessment-design-studio/interactive-oral-assessment/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Interactive Oral Assessments: Charting the Course While Holding the Line",
    "org": "ASCILITE",
    "desc": "Blog on balancing authenticity and rigour in interactive orals.",
    "url": "https://blog.ascilite.org/interactive-oral-assessments-charting-the-course-while-holding-the-line/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Show Your Working: Assessment Needs to See the Process, Not Just the Product",
    "org": "HERDSA",
    "desc": "Why assessment should evidence the cognitive process, not only the artefact.",
    "url": "https://herdsa.org.au/herdsa-connect/show-your-working-assessment-needs-see-process-not-just-product",
    "category": "Assurance of Learning"
  },
  {
    "title": "An Assessment Design that Promotes Learning and Academic Integrity",
    "org": "HERDSA",
    "desc": "Designing assessment that builds learning while safeguarding integrity.",
    "url": "https://herdsa.org.au/herdsa-connect/assessment-design-promotes-learning-and-academic-integrity",
    "category": "Assurance of Learning"
  },
  {
    "title": "Giving Voice to Women Students: Oral Assessments for Inclusion and Validity",
    "org": "Deakin University (CRADLE)",
    "desc": "Designing oral assessments to avoid gender bias and protect validity.",
    "url": "https://dro.deakin.edu.au/articles/journal_contribution/Giving_voice_to_women_students_designing_oral_assessments_for_inclusion_and_validity/30536006/1/files/59303378.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assessment for Inclusion Resources",
    "org": "Deakin University (CRADLE)",
    "desc": "Leading assessment for inclusion — open resources for executives and educators.",
    "url": "https://deakin.pressbooks.pub/leadingassessmentinclusion/chapter/executive-leadership-of-assessment/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Surveys Unite: Current Status of Assurance of Learning in Higher Education",
    "org": "HERDSA",
    "desc": "Sector survey on the state of AoL practice in Australian HE.",
    "url": "https://herdsa.org.au/publications/conference-proceedings/research-and-development-higher-education-shape-higher-22",
    "category": "Assurance of Learning"
  },
  {
    "title": "Australian Higher Education Evaluation Through Assurance of Learning",
    "org": "ResearchGate",
    "desc": "Foundational paper on AoL evaluation in Australian universities.",
    "url": "https://www.researchgate.net/publication/277856871_Australian_higher_education_evaluation_through_assurance_of_learning",
    "category": "Assurance of Learning"
  },
  {
    "title": "Business School Accreditation (AACSB)",
    "org": "University of Sydney",
    "desc": "How AACSB accreditation drives assurance of learning in business education.",
    "url": "https://www.sydney.edu.au/business/about/accreditation.html",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assurance of Learning Seminar (AACSB)",
    "org": "AACSB",
    "desc": "AACSB's professional AoL seminar — establishing goals, alignment, rubrics.",
    "url": "https://www.aacsb.edu/events/2026/06/sm2026-june-assurance-of-learning-seminar-i-chiang-mai",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assessing and Assuring Learning: Addressing Skills Deficits in Business",
    "org": "University of Melbourne",
    "desc": "Teachers' reflections on closing the loop in AoL.",
    "url": "https://minerva-access.unimelb.edu.au/bitstreams/c51e1da8-45d3-5e65-bc83-30cee4079c4b/download",
    "category": "Assurance of Learning"
  },
  {
    "title": "Traffic Light Report: A New Technique for Assurance of Learning",
    "org": "Journal of Learning Design",
    "desc": "Mapping assessments to competency standards and Miller's pyramid.",
    "url": "https://www.jld.edu.au/article/view/264.html",
    "category": "Assurance of Learning"
  },
  {
    "title": "Launching the OES Assurance of Learning Positioning Paper",
    "org": "OES",
    "desc": "Connected Assurance: relational, technical and pedagogical assurance.",
    "url": "https://oes.edu.au/oes-assurance-of-learning-positioning-paper/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assessment Principles and Aims",
    "org": "Australian Catholic University",
    "desc": "ACU's curriculum design and quality-assurance assessment principles.",
    "url": "https://staff.acu.edu.au/our_university/centre-for-education-and-innovation/curriculum-design-and-quality-assurance/assessment-design-and-feedback/assessment-principles-and-aims",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assuring Learning at Melbourne",
    "org": "University of Melbourne",
    "desc": "Melbourne's institutional approach to assuring learning.",
    "url": "https://about.unimelb.edu.au/education-melbourne/assuring-learning-at-melbourne",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assuring Learning in the Age of GenAI: Guidelines",
    "org": "University of Melbourne",
    "desc": "Institutional guidelines for assuring learning amid generative AI.",
    "url": "https://about.unimelb.edu.au/__data/assets/pdf_file/0027/460863/Assuring-learning-in-the-age-of-Generative-Artificial-Intelligence-.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "UNSW Engineering Education Specification",
    "org": "UNSW",
    "desc": "Programmatic curriculum alignment to Engineers Australia competencies.",
    "url": "https://www.unsw.edu.au/content/dam/pdfs/engineering/general/resources/2026-03-engineering-education-specifications/BIOMES8621_Engineering%20Specification_2026_Website%20Version.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assessment (Topic Hub)",
    "org": "HERDSA",
    "desc": "Curated HERDSA collection of assessment scholarship and practice.",
    "url": "https://herdsa.org.au/topics/assessment",
    "category": "Assurance of Learning"
  },
  {
    "title": "A Vision for ALL Education in Programmatic Assessment (AALL 2024 Keynote)",
    "org": "AALL / Andrew Kelly",
    "desc": "Reimagining academic language & learning units within programmatic assessment.",
    "url": "https://www.aall.org.au/wp-content/uploads/2024/12/AALL-Symposium-2024-Keynote-A-vision-for-ALL-education-in-programmatic-assessment-Andrew-Kelly.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "CRADLE Guide: Assessing Work-Integrated Learning Programs",
    "org": "Deakin University (CRADLE)",
    "desc": "Guide to assessing WIL — placements, projects and simulations.",
    "url": "https://blogs.deakin.edu.au/cradle/wp-content/uploads/sites/188/2022/11/cradle-wil-assessment-guide.pdf",
    "category": "Assurance of Learning"
  },
  {
    "title": "Find Out How to Create Assessment that Serves Learning (David Boud)",
    "org": "Deakin University (CRADLE)",
    "desc": "CRADLE blog with David Boud on assessment that serves learning.",
    "url": "https://blogs.deakin.edu.au/cradle/find-out-how-to-create-assessment-that-serves-learning-with-david-boud/",
    "category": "Assurance of Learning"
  },
  {
    "title": "The Wicked Problem of AI and Assessment",
    "org": "Deakin University (CRADLE)",
    "desc": "Framing AI and assessment as a wicked problem for the sector.",
    "url": "https://dro.deakin.edu.au/articles/journal_contribution/The_wicked_problem_of_AI_and_assessment/30102100",
    "category": "Assurance of Learning"
  },
  {
    "title": "What Is Shaping Assessment in Higher Education?",
    "org": "Queen Mary University of London",
    "desc": "Global perspective on the forces reshaping assessment.",
    "url": "https://www.qmul.ac.uk/digital-education-studio/news-events/de24/february/digital-education-story4/",
    "category": "Assurance of Learning"
  },
  {
    "title": "AI and Assessment",
    "org": "University of Southern Queensland",
    "desc": "UniSQ guidance on artificial intelligence and assessment.",
    "url": "https://www.unisq.edu.au/current-students/academic",
    "category": "Assurance of Learning"
  },
  {
    "title": "What To Do About Assessments If We Can't Out-Design or Out-Run AI",
    "org": "University of Sydney",
    "desc": "Sydney's Teaching@Sydney on rethinking assessment for the AI era.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/what-to-do-about-assessments-if-we-cant-out-design-or-out-run-ai/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Designing and Securing Assessment",
    "org": "University of Queensland (ITaLI)",
    "desc": "UQ AI Teacher Hub guidance on designing and securing assessment.",
    "url": "https://itali.uq.edu.au/teaching-guidance/ai-teacher-hub/designing-and-securing-assessment",
    "category": "Assurance of Learning"
  },
  {
    "title": "AI for Learning and Assessment",
    "org": "Australian National University",
    "desc": "ANU resources on AI for learning and assessment.",
    "url": "https://learningandteaching.anu.edu.au/resources/ai-for-learning-and-assessment/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Assessment Design Decisions Framework",
    "org": "assessmentdecisions.org",
    "desc": "Sector framework guiding evidence-based assessment design decisions.",
    "url": "http://www.assessmentdecisions.org/",
    "category": "Assurance of Learning"
  },
  {
    "title": "SAGE Assessment Framework",
    "org": "SAGE",
    "desc": "Framework supporting secure, authentic and good-practice assessment.",
    "url": "https://sage-framework.com/",
    "category": "Assurance of Learning"
  },
  {
    "title": "FLIPCurric",
    "org": "flipcurric.edu.au",
    "desc": "National resource for curriculum and assessment standards mapping.",
    "url": "http://flipcurric.edu.au/",
    "category": "Assurance of Learning"
  },
  {
    "title": "HERDSA Connect",
    "org": "HERDSA",
    "desc": "HERDSA's blog — practitioner reflections on teaching, assessment, careers & academic life. New posts most weeks.",
    "url": "https://herdsa.org.au/herdsa-connect",
    "category": "Blogs"
  },
  {
    "title": "Needed Now in Learning & Teaching",
    "org": "@needednowlt",
    "desc": "Practical, research-informed L&T ideas you can use now — concise newsletter & blog.",
    "url": "https://needednowlt.substack.com/",
    "category": "Blogs"
  },
  {
    "title": "CRADLE Blog",
    "org": "Deakin University",
    "desc": "Centre for Research in Assessment & Digital Learning — assessment, feedback, inclusion & GenAI.",
    "url": "https://blogs.deakin.edu.au/cradle/",
    "category": "Blogs"
  },
  {
    "title": "Teaching@Sydney",
    "org": "University of Sydney",
    "desc": "USyd's L&T blog — practical teaching, assessment design & GenAI from Educational Innovation.",
    "url": "https://educational-innovation.sydney.edu.au/teaching@sydney/",
    "category": "Blogs"
  },
  {
    "title": "TELall Blog",
    "org": "ASCILITE",
    "desc": "ASCILITE's blog on technology-enhanced learning, learning design & assessment.",
    "url": "https://blog.ascilite.org/",
    "category": "Blogs"
  },
  {
    "title": "Teche",
    "org": "Macquarie University",
    "desc": "Macquarie's L&T community blog — teaching ideas, edtech and the student experience.",
    "url": "https://teche.mq.edu.au/",
    "category": "Blogs"
  },
  {
    "title": "Transforming Assessment",
    "org": "Transforming Assessment",
    "desc": "Long-running assessment community — webinars, blog posts & resources on assessment in HE.",
    "url": "https://transformingassessment.com/",
    "category": "Blogs"
  },
  {
    "title": "CAULLT News",
    "org": "CAULLT",
    "desc": "Council of Australasian University Leaders in L&T — sector news, leadership & teaching quality.",
    "url": "https://www.caullt.edu.au/news/",
    "category": "Blogs"
  },
  {
    "title": "Transforming Assessment (Webinar Recordings)",
    "org": "Transforming Assessment",
    "desc": "Long-running webinar series on assessment in higher education.",
    "url": "https://transformingassessment.com/webinar_recordings",
    "category": "Assurance of Learning"
  },
  {
    "title": "Transforming Assessment SIG",
    "org": "ASCILITE",
    "desc": "Special interest group advancing assessment scholarship and practice.",
    "url": "https://ascilite.org/get-involved/sigs/transforming-assessment-sig/",
    "category": "Assurance of Learning"
  },
  {
    "title": "Enacting Assessment Reform (Resource Hub)",
    "org": "TEQSA",
    "desc": "TEQSA corporate publication hub on enacting assessment reform.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/corporate-publications/enacting-assessment-reform-time-artificial-intelligence",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Assessment Reform for the Age of Artificial Intelligence (Discussion Paper)",
    "org": "TEQSA",
    "desc": "The 2023 discussion paper that catalysed sector assessment reform.",
    "url": "https://www.teqsa.gov.au/sites/default/files/2023-09/assessment-reform-age-artificial-intelligence-discussion-paper.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Gen AI and Learning Assurance – New Resource",
    "org": "TEQSA",
    "desc": "TEQSA announcement of new learning-assurance guidance.",
    "url": "https://www.teqsa.gov.au/about-us/news-and-events/latest-news/gen-ai-and-learning-assurance-new-resource-available",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Principles for Criteria and Standards in Assessment for Gen AI Use",
    "org": "TEQSA",
    "desc": "Guidance on writing criteria and standards where AI use is permitted.",
    "url": "https://www.teqsa.gov.au/guides-resources/protecting-academic-integrity/academic-integrity-toolkit/risks-academic-integrity-ai/principles-criteria-and-standards-assessment-gen-ai-use",
    "category": "Regulatory & Policy"
  },
  {
    "title": "The AI Assessment Venn: Outcome–Context–Method Framework",
    "org": "TEQSA / RMIT",
    "desc": "RMIT's OCM framework for deciding appropriate AI involvement.",
    "url": "https://www.teqsa.gov.au/sites/default/files/2025-06/AI-assessment-venn-outcome-context-method-framework-RMIT.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Gen AI, Academic Integrity and Assessment Reform (Knowledge Hub)",
    "org": "TEQSA",
    "desc": "TEQSA Gen AI knowledge hub on integrity and assessment reform.",
    "url": "https://www.teqsa.gov.au/guides-resources/higher-education-good-practice-hub/gen-ai-knowledge-hub/gen-ai-academic-integrity-and-assessment-reform",
    "category": "Regulatory & Policy"
  },
  {
    "title": "AAIN Generative AI Guidelines",
    "org": "TEQSA / AAIN",
    "desc": "National academic integrity network guidance on generative AI.",
    "url": "https://www.teqsa.gov.au/sites/default/files/2023-04/aain-generative-ai-guidelines.pdf",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Peer Review of Assessment Network: A Sector-Wide Framework",
    "org": "ResearchGate",
    "desc": "Framework for assuring and calibrating achievement standards across disciplines.",
    "url": "https://www.researchgate.net/publication/344223998_Peer_review_of_assessment_network_A_sector-wide_framework_for_assuring_and_calibrating_achievement_standards_within_and_across_disciplines_and_other_networks",
    "category": "Quality Assurance"
  },
  {
    "title": "External Referencing & Peer Review of Standards (OLT Project)",
    "org": "University of Tasmania",
    "desc": "National project on external referencing and calibration of standards.",
    "url": "https://www.utas.edu.au/curriculum-and-quality/quality/external-referencing/peer-review/olt-project",
    "category": "Quality Assurance"
  },
  {
    "title": "Collective Intelligence on the Job (Margaret Bearman)",
    "org": "Deakin University (CRADLE)",
    "desc": "Insights from the workplace-learning literature.",
    "url": "https://www.youtube.com/watch?v=Fpu-CAcuaC8",
    "category": "Assurance of Learning"
  },
  {
    "title": "CRADLE Suggests: Feedback Strategies to Make a Difference",
    "org": "CRADLE (Deakin)",
    "desc": "Shifting feedback from 'telling' to 'sense-making' and active student implementation.",
    "url": "https://blogs.deakin.edu.au/cradle/wp-content/uploads/sites/188/2022/11/03-cradle-feedback_v21.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "CRADLE Suggests: Assessment and GenAI",
    "org": "CRADLE (Deakin)",
    "desc": "Principles of good assessment design in an AI-ubiquitous environment.",
    "url": "https://blogs.deakin.edu.au/cradle/wp-content/uploads/sites/188/2023/06/CRADLE-Suggests-Assessment-and-genAI.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "CRADLE Suggests: Assessment for Inclusion",
    "org": "CRADLE (Deakin)",
    "desc": "Equitable task design leveraging student diversity and mitigating systemic disadvantage.",
    "url": "https://figshare.com/articles/online_resource/CRADLE_Suggests_Assessment_for_inclusion/22494472",
    "category": "SoTL Foundations"
  },
  {
    "title": "CRADLE Suggests: Feedback and GenAI",
    "org": "CRADLE (Deakin)",
    "desc": "New guide on feedback design when AI is integrated into the learning process.",
    "url": "https://figshare.com/articles/online_resource/CRADLE_Suggests_Feedback_and_GenAI/29580383",
    "category": "SoTL Foundations"
  },
  {
    "title": "CRADLE Resources Compendium 2015-2026",
    "org": "CRADLE (Deakin)",
    "desc": "Complete catalogue of CRADLE's research outputs, guides, and seminar recordings.",
    "url": "https://blogs.deakin.edu.au/cradle/wp-content/uploads/sites/188/2026/02/CRADLE-Resources-2015-2026-Updated-2026-02-11.pdf",
    "category": "SoTL Foundations"
  },
  {
    "title": "VALUE Rubrics (AAC&U)",
    "org": "AAC&U",
    "desc": "16 rubrics for assessing creative thinking, critical thinking, oral communication, teamwork, and more.",
    "url": "https://www.aacu.org/value/rubrics",
    "category": "Teaching Quality"
  },
  {
    "title": "UNSW Digital Assessment Framework",
    "org": "UNSW",
    "desc": "Self-audit checklists validating alignment between assessment tasks and digital delivery.",
    "url": "https://www.education.unsw.edu.au/news-events/news/new-digital-assessment-framework",
    "category": "Teaching Quality"
  },
  {
    "title": "Assessment Design Decisions Framework",
    "org": "OLT / CIT",
    "desc": "Toolkit for surfacing educator assumptions and integrating peer/self-feedback loops.",
    "url": "https://tlu.cit.ie/contentFiles/files/Guide_to_the_Assessment_Design_Decisions_Framework.pdf",
    "category": "Teaching Quality"
  },
  {
    "title": "Critical Interventions Framework Part 3 (CIF 3)",
    "org": "ACSES",
    "desc": "Evidence-based equity programs guiding national expenditure and institutional strategy.",
    "url": "https://www.acses.edu.au/publication/the-critical-interventions-framework-part-3-programs-and-approaches-that-enable-equity-in-higher-education/",
    "category": "Student Experience"
  },
  {
    "title": "ACSES Equity Initiatives Impact Studies Guide",
    "org": "ACSES",
    "desc": "Interventions in bridging programs, peer mentoring, and outreach across the student lifecycle.",
    "url": "https://www.acses.edu.au/app/uploads/2024/03/CIF-3_Equity-Initiatives-Impact-Studies-Guide.pdf",
    "category": "Student Experience"
  },
  {
    "title": "AHRC Guidelines on Equal Access to Digital Goods (2025)",
    "org": "AHRC",
    "desc": "Legal guidance on DDA obligations for digital platforms — WCAG and AS EN 301 549 compliance.",
    "url": "https://humanrights.gov.au/sites/default/files/document/publication/Guidelines-equal-access-digital-goods-services.pdf",
    "category": "UDL Frameworks"
  },
  {
    "title": "ADCET UDL eLearning Program",
    "org": "ADCET",
    "desc": "Free self-paced modules with templates, checklists, and foundational UDL learning design.",
    "url": "https://www.adcet.edu.au/resource/10800/launch-universal-design-for-learning-in-tertiary-education-elearning-training",
    "category": "UDL Frameworks"
  },
  {
    "title": "ADCET Accessible ICT Procurement Guide",
    "org": "ADCET / CAUDIT",
    "desc": "Embedding AS EN 301 549 standards into university purchasing cycles.",
    "url": "https://www.adcet.edu.au/resource/12411/accessibility-by-design-the-acses-insights-report-in-disability-in-higher-education",
    "category": "UDL Frameworks"
  },
  {
    "title": "Leading Inclusive Assessment in HE (CAULLT)",
    "org": "CAULLT",
    "desc": "Flexibility, choice, and culturally informed assessment practices.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/2025/09/Leading-inclusive-assessment-in-higher-education-A-framework-to-guide-inclusive-practice.pdf",
    "category": "Quality Assurance"
  },
  {
    "title": "OER Advocacy Toolkit",
    "org": "CAUL",
    "desc": "Enabling academic librarians to champion OER creation and adoption.",
    "url": "https://caul.edu.au/resource/open-educational-resources-advocacy-toolkit/",
    "category": "Learning Design"
  },
  {
    "title": "OER Capability Toolkit",
    "org": "RMIT",
    "desc": "Interactive modules on open pedagogy, Creative Commons licensing, and equitable assessment.",
    "url": "https://rmit.pressbooks.pub/oercapabilitytoolkit/",
    "category": "Learning Design"
  },
  {
    "title": "Smartcopying Open Education Toolkit",
    "org": "NCU",
    "desc": "Legal guidance for navigating copyright exceptions and CC-BY licences in Australia.",
    "url": "https://smartcopying.edu.au/oer-toolkit-section-1-introduction/",
    "category": "Learning Design"
  },
  {
    "title": "ACEN Interdisciplinary Project-Based WIL Guide",
    "org": "WIL Australia",
    "desc": "Cross-faculty student projects addressing complex industry and community problems.",
    "url": "https://acen.edu.au/resources/interdisciplinary-project-based-work-integrated-learning-the-australian-good-practice-guide/",
    "category": "Learning Design"
  },
  {
    "title": "ACEN Good Practice Guide: Authenticity in WIL",
    "org": "WIL Australia",
    "desc": "Ensuring placements emulate genuine workplace autonomy and consequentiality.",
    "url": "https://acen.edu.au/resources/good-practice-guide-authenticity/",
    "category": "Learning Design"
  },
  {
    "title": "ACEN Good Practice Guide: Preparation in WIL",
    "org": "WIL Australia",
    "desc": "Scaffolding for psychological readiness, ethics, and professional identity before placement.",
    "url": "https://acen.edu.au/resources/good-practice-guide-preparation/",
    "category": "Learning Design"
  },
  {
    "title": "Taxonomy for Credentialing Australasian University Educators",
    "org": "CAULLT",
    "desc": "Unified cross-institutional nomenclature: Associate, Foundation, Advanced Educator.",
    "url": "https://www.caullt.edu.au/wordpress/wp-content/uploads/Taxonomy-for-Credentialing-Australasian-University-Educators-1687914010-8.pdf",
    "category": "Academic Promotion"
  },
  {
    "title": "Advance HE Essential Framework: Embedding Employability",
    "org": "Advance HE",
    "desc": "Curricular mapping tools aligning graduate attributes with evolving labour market demands.",
    "url": "https://www.advance-he.ac.uk/knowledge-hub/essential-frameworks-enhancing-student-success-embedding-employability",
    "category": "Learning Design"
  },
  {
    "title": "Advance HE Essential Framework: Flexible Learning",
    "org": "Advance HE",
    "desc": "Structurally agile, multi-modal programs for non-traditional and time-poor cohorts.",
    "url": "https://www.advance-he.ac.uk/knowledge-hub/essential-frameworks-enhancing-student-success-flexible-learning",
    "category": "Learning Design"
  },
  {
    "title": "HERDSA Guide: Enhancing Online Engagement in HE",
    "org": "HERDSA",
    "desc": "Auditing tools for instructional designers to evaluate virtual classroom participation.",
    "url": "https://herdsa.org.au/publications/guides/enhancing-online-engagement-higher-education",
    "category": "Learning Design"
  },
  {
    "title": "ANZAHPE IPE Resource Centre",
    "org": "ANZAHPE",
    "desc": "Interprofessional education frameworks for collaborative health professional training.",
    "url": "https://www.anzahpe.org/IPE-Resource-Centre",
    "category": "Nursing & Midwifery"
  },
  {
    "title": "TELAS — Technology Enhanced Learning Accreditation Standards",
    "org": "ASCILITE",
    "desc": "Internationally-benchmarked standards (Australia, NZ & Singapore) to assess, assure and accredit the quality of online learning environments — the first sector-recognised credential of its kind.",
    "url": "https://telas.edu.au/",
    "category": "Quality Assurance"
  },
  {
    "title": "Beyond Blended — Rethinking Curriculum & Learning Design",
    "org": "Jisc",
    "desc": "UK framework: six pillars for post-pandemic curriculum and learning design and a shared vocabulary for modes of learning, plus the 'Beyond Blended in Action' pilot across 17 HE providers.",
    "url": "https://www.jisc.ac.uk/guides/beyond-blended-rethinking-curriculum-and-learning-design",
    "category": "Learning Design"
  },
  {
    "title": "Course Design, Learning Outcomes & Assessment",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA's reading of the HESF on course design — outcomes, assessment alignment and constructive design.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-course-design-including-learning-outcomes-and-assessment",
    "category": "Curriculum Design"
  },
  {
    "title": "Scholarship",
    "org": "TEQSA Guidance Note",
    "desc": "How TEQSA interprets the HESF scholarship requirements — staff engagement with advances in field and in teaching.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-scholarship",
    "category": "SoTL Foundations"
  },
  {
    "title": "Technology-Enhanced Learning",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance on the quality and risks of technology-enhanced and online learning under the HESF.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-technology-enhanced-learning",
    "category": "Learning Design"
  },
  {
    "title": "Academic & Research Integrity",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA's expectations for academic and research integrity, including contract-cheating risk.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-academic-and-research-integrity",
    "category": "Regulatory & Policy"
  },
  {
    "title": "Work-Integrated Learning",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance on quality assurance of work-integrated learning placements and partnerships.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-work-integrated-learning",
    "category": "Curriculum Design"
  },
  {
    "title": "Academic Quality Assurance",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA's interpretation of the HESF academic quality-assurance standards.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-academic-quality-assurance",
    "category": "Quality Assurance"
  },
  {
    "title": "Academic Governance",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance on effective academic governance and oversight of teaching quality.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-academic-governance",
    "category": "Quality Assurance"
  },
  {
    "title": "Academic Leadership",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance (beta) on academic leadership for learning and teaching.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-academic-leadership",
    "category": "Teaching Quality"
  },
  {
    "title": "Academic Monitoring, Review & Improvement",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance on monitoring, reviewing and improving courses and teaching.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-academic-monitoring-review-and-improvement",
    "category": "Quality Assurance"
  },
  {
    "title": "Monitoring & Analysis of Student Performance",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance (beta) on using student-performance data to support success.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-monitoring-and-analysis-student-performance",
    "category": "Student Experience"
  },
  {
    "title": "Learning Resources & Educational Support",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance on learning resources and educational support for students.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-learning-resources-and-educational-support",
    "category": "Student Experience"
  },
  {
    "title": "Diversity & Equity",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA's interpretation of the HESF diversity and equity standards.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-diversity-and-equity",
    "category": "Student Experience"
  },
  {
    "title": "Wellbeing & Safety",
    "org": "TEQSA Guidance Note",
    "desc": "TEQSA guidance on student wellbeing and safety obligations.",
    "url": "https://www.teqsa.gov.au/guides-resources/resources/guidance-notes/guidance-note-wellbeing-and-safety",
    "category": "Student Experience"
  },
  {
    "title": "Higher Education Standards Framework (Threshold Standards) 2021",
    "org": "Federal Register of Legislation",
    "desc": "The HESF — the legislated Threshold Standards (under the TEQSA Act) defining the minimum requirements for Australian higher education. The regulatory backbone that every TEQSA guidance note interprets.",
    "url": "https://www.legislation.gov.au/F2021L00488/latest/text",
    "category": "Regulatory & Policy"
  }
];

/** Documents per strand — drives the chip counts, derived from the data. */
export function strandCount(strand: string): number {
  if (strand === "All") return FRAMEWORKS.length;
  return FRAMEWORKS.filter((f) => f.category === strand).length;
}

/**
 * Filter the directory — strand chip plus case-insensitive substring search
 * over title/org/desc/category.
 */
export function filterFrameworks(
  strand: string,
  query: string,
): FrameworkDoc[] {
  const q = query.trim().toLowerCase();
  return FRAMEWORKS.filter((f) => {
    if (strand !== "All" && f.category !== strand) return false;
    if (q === "") return true;
    return [f.title, f.org, f.desc, f.category]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}
