/**
 * Featured Talks carousel data for the #featured-talks tab (Epic 1.2 PR-B).
 * The hard-coded YouTube id list extracted VERBATIM from the anonymous
 * "NTLSN Featured Talks carousel" patch script in production index.html.
 * Curated by Dr Seb Dianati; the carousel renders these in this order.
 */

export interface FeaturedTalk {
  title: string;
  youtubeId: string;
}

export const FEATURED_TALKS: readonly FeaturedTalk[] = [
  {"title":"AI in Assessment — 5 Innovative Designs","youtubeId":"c-wyQFXtFUk"},
  {"title":"ACODE 90 Workshop: Generative AI and Pedagogies","youtubeId":"xj-A1h7x6UM"},
  {"title":"Mapping Program Learning Outcomes to Assessment Tasks","youtubeId":"XqcX8HpsSyo"},
  {"title":"How to Stop Student Cheating: A Tier List","youtubeId":"LNcuAmDP2cQ"},
  {"title":"Contemporary Approaches to University Teaching (CAUT MOOC Welcome)","youtubeId":"c7vunFSxg3g"},
  {"title":"Sharing Responsibility with Suppliers (Business Ed SIG)","youtubeId":"oXhby9qz0uU"},
  {"title":"What’s Working — The Student Edition","youtubeId":"G1r-OMB8hXY"},
  {"title":"Paulo Freire’s Pedagogy of the Oppressed (Summary)","youtubeId":"vazSwO1MoZ0"},
  {"title":"Design Principles for Human-Centred Learning Analytics","youtubeId":"HbOtLdgetT0"},
  {"title":"OA Week 2024: Open and Accessible — When Open Isn't Enough","youtubeId":"PugMfqJ3HxY"},
  {"title":"Best Practices in Curriculum Design and Planning","youtubeId":"lo3wKdF8Meo"},
  {"title":"2026 QILT Symposium (May 19, 2026)","youtubeId":"bXF3rcB2xiQ"},
  {"title":"Universal Design for Learning (Teaching to diversity)","youtubeId":"qxrA0VVNQ44"},
  {"title":"Harnessing Generative AI to Empower Inclusive Education","youtubeId":"1wSWSSu4itM"},
  {"title":"Universal Design for Learning in Higher Education","youtubeId":"VwA8cQ2xA9o"},
  {"title":"Engaging Students as Partners in Learning","youtubeId":"isa73Gh3uqA"},
  {"title":"STARS Conference vlog - the Psychological Wellbeing in Higher Education Network","youtubeId":"ZObej5HhuOU"},
  {"title":"How a student advisor can guide you (Open Universities Australia)","youtubeId":"Uw4irxlHeKM"},
  {"title":"Designing authentic exam questions (Transforming Assessment)","youtubeId":"cJLVrRUBmQM"},
  {"title":"Partnering With Students on Teaching and Learning","youtubeId":"pPU4ckBBeEU"},
  {"title":"Overview of Programmatic Assessment","youtubeId":"zBKPyCzrqQI"},
  {"title":"Confessions of a Converted Lecturer","youtubeId":"FgcTHfg6GK0"},
  {"title":"How to Get an Advance HE Fellowship (FHEA)","youtubeId":"bxcQMjQXWFM"},
  {"title":"“The Teacher Is Our Best Resource”","youtubeId":"yoVewx7aUiA"},
  {"title":"Teams Within Yale's Poorvu Center","youtubeId":"fmQLhB4xY9s"},
];
