import { useState } from "react";

/**
 * #ntlsn-aaut — "Ready for an AAUT Citation?" (Epic 1.2 PR-G, recognition
 * band). Ported from the production ntlsn-aaut-script injector: the SC1–SC4
 * subcategory picker (each rewriting the four assessor questions), the
 * 25-word citation counter, the draft report (criteria-keyword coverage,
 * ARI reading grade — the injector's exact formula and keyword lists), the
 * "what assessors look for" tips and the five-award-types chip row. Runs
 * entirely in the browser, stores nothing, not AI — as the production
 * footnote says.
 */
const SC: ReadonlyArray<[string, string]> = [
  ["SC1", "Approaches to teaching and the support of learning"],
  ["SC2", "Development of curricula, resources or services"],
  ["SC3", "Effective assessment practices"],
  ["SC4", "Innovation or leadership"],
];

const SUBJ: ReadonlyArray<[string, string]> = [
  ["have", "the approaches"],
  ["has", "the development of curricula, resources or services"],
  ["have", "the assessment practices"],
  ["has", "the innovation or leadership"],
];

const TAIL: readonly string[] = [
  "positively impacted on student learning, engagement or the overall student experience over no less than three years",
  "gained recognition from colleagues, the institution and/or the broader community",
  "shown creativity, imagination and/or innovation",
  "drawn on the scholarly literature on teaching and learning to inform practice",
];

const MAY: readonly string[] = [
  "Stimulating curiosity and independent learning; empathetic guidance; helping equity cohorts succeed; assessment that enhances learning.",
  "Coherent, imaginative resources; research-led design; an up-to-date command of the field.",
  "Varied and alternative assessment; academic integrity and digital solutions; assessment adapted to diverse needs.",
  "Leadership with broad influence; technology-enhanced teaching; publishing on teaching; shaping the student experience.",
];

type Criterion = [string, string, string, string, readonly string[]];
const CRIT: readonly Criterion[] = [
  [
    "A",
    "Impact on student learning",
    "Sustained positive impact on learning, engagement or experience over 3+ years (2 for Early Career).",
    "Add evidence of impact: outcomes, data and student voice, sustained over three years or more.",
    ["impact", "improv", "increas", "outcome", "result", "retention", "satisfaction", "engagement", "pass rate", "student learning", "evidence", "data", "percent", "%", "sustained", "three year", "3 year", "measur", "gain", "cohort"],
  ],
  [
    "B",
    "Recognition",
    "Recognition from colleagues, the institution and/or the broader community.",
    "Show recognition: peer or institutional adoption, invitations, awards, testimonials, uptake elsewhere.",
    ["recognition", "recognis", "award", "invited", "peer", "colleague", "adopt", "cited", "feedback", "nominat", "testimon", "community", "endorse", "letter", "reference", "widely used", "shared", "keynote"],
  ],
  [
    "C",
    "Creativity and innovation",
    "Creativity, imagination and/or innovation, traditional or technology-based.",
    "Name what was genuinely new or creative in your approach, and why it mattered.",
    ["innovat", "creativ", "novel", "new approach", "redesign", "pioneer", "first to", "original", "reimagin", "technolog", "transform", "experiment", "prototype", "redesigned", "reinvent"],
  ],
  [
    "D",
    "Informed by scholarship",
    "Draws on the scholarly literature on teaching and learning to inform practice.",
    "Cite the SoTL literature that informed your work, and any scholarship you have contributed.",
    ["literature", "scholar", "sotl", "research", "framework", "theory", "evidence-based", "evidence based", "pedagog", "study", "studies", "journal", "publication", "cite", "references", "model of", "peer-reviewed"],
  ],
];

const TIPS: ReadonlyArray<[string, string]> = [
  [
    "Three-legged stool",
    "Make a claim, give the evidence, then show the impact on student learning.",
  ],
  [
    "Equal weight",
    "Address all four criteria evenly, and signpost each with a heading.",
  ],
  [
    "Triangulate evidence",
    "Student, peer and industry, qualitative and quantitative. Quotes illustrate; they are not the data.",
  ],
  [
    "Sustained, 3+ years",
    "Show improving impact over three years or more (two for Early Career).",
  ],
  [
    "Write plain English",
    "Assessors will not know your field: say what is new and why it matters.",
  ],
  [
    "Ground it in scholarship",
    "Engage the SoTL literature, more than one or two scholars.",
  ],
];

const AWARDS: readonly string[] = [
  "Citations",
  "Program Awards",
  "Teaching Awards",
  "Teacher of the Year",
  "Career Achievement",
];

const INPUT_CLASS =
  "w-full rounded-[9px] border border-white/[0.14] bg-navy px-3 py-2.5 text-[14px] text-white";

function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export default function AautSection() {
  const [curSC, setCurSC] = useState(0);
  const [cit, setCit] = useState("");
  const [draft, setDraft] = useState("");

  const citWords = wordCount(cit);
  const draftTrim = draft.trim();

  // Report metrics — the injector's exact arithmetic.
  let report: {
    wc: number;
    grade: number;
    strong: number;
    rows: ReadonlyArray<{
      crit: Criterion;
      status: "Addressed" | "Light" | "Not yet";
      colour: string;
    }>;
    rgrade: string;
  } | null = null;
  if (draftTrim) {
    const words = draftTrim.split(/\s+/).filter(Boolean);
    const wc = words.length;
    const sents =
      draftTrim.split(/[.!?]+/).filter((x) => x.trim().length > 0).length || 1;
    const letters = (draftTrim.match(/[A-Za-z]/g) || []).length;
    const ari = 4.71 * (letters / Math.max(wc, 1)) + 0.5 * (wc / sents) - 21.43;
    const grade = Math.max(1, Math.round(ari));
    const low = draftTrim.toLowerCase();
    let strong = 0;
    const rows = CRIT.map((c) => {
      const n = c[4].filter((k) => low.indexOf(k) > -1).length;
      if (n >= 3) {
        strong++;
        return { crit: c, status: "Addressed" as const, colour: "#8fb081" };
      }
      if (n >= 1) return { crit: c, status: "Light" as const, colour: "#e6a33c" };
      return { crit: c, status: "Not yet" as const, colour: "#b3a48c" };
    });
    const rgrade =
      grade <= 12
        ? "clear for a wide audience"
        : grade <= 15
          ? "around early-undergraduate level"
          : "dense; assessors will not know your field, so simplify";
    report = { wc, grade, strong, rows, rgrade };
  }

  const citTrim = cit.trim();
  const firstPerson = /\b(i|my|we|our|me|us)\b/i.test(citTrim);
  const [verb, subject] = SUBJ[curSC];

  return (
    <section
      id="ntlsn-aaut"
      aria-labelledby="ntlsn-aaut-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[1000px]">
        <div className="mx-auto mb-[18px] max-w-[780px] text-center">
          <div className="mb-3.5 inline-flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#8fb081] px-3 py-1 text-[11px] font-extrabold tracking-[1.5px] text-[#1f1810] uppercase">
              ▶ Try it
            </span>
            <span className="rounded-full border border-[rgba(198,108,63,.45)] px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-[#c66c3f] uppercase">
              Runs in your browser
            </span>
          </div>
          <h2
            id="ntlsn-aaut-heading"
            className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            Ready for an AAUT Citation?
          </h2>
          <p className="mb-3 text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#bca98f]">
            Pick your subcategory to see the exact four questions assessors
            ask, paste a draft, and get a report: criteria coverage, your
            25-word citation against the limit, and a plain-English read.
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {AWARDS.map((award, i) => (
              <span
                key={award}
                className="rounded-full px-[11px] py-1 text-[11px] font-bold"
                style={
                  i === 0
                    ? {
                        color: "#1f1810",
                        background: "#8fb081",
                        border: "1px solid #8fb081",
                      }
                    : {
                        color: "#b3a48c",
                        background: "rgba(255,255,255,.05)",
                        border: "1px solid rgba(255,255,255,.12)",
                      }
                }
              >
                {award}
                {i === 0 ? " (this tool)" : ""}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-3.5 flex flex-wrap justify-center gap-[7px]">
          {SC.map(([code, label], i) => {
            const on = i === curSC;
            return (
              <button
                key={code}
                type="button"
                title={label}
                aria-pressed={on}
                onClick={() => setCurSC(i)}
                className="cursor-pointer rounded-full px-[13px] py-1.5 text-[12px] font-bold transition-colors"
                style={
                  on
                    ? {
                        background: "#8fb081",
                        color: "#1f1810",
                        border: "1px solid #8fb081",
                      }
                    : {
                        background: "rgba(255,255,255,.06)",
                        color: "#d9cdb6",
                        border: "1px solid rgba(255,255,255,.14)",
                      }
                }
              >
                {code}
              </button>
            );
          })}
        </div>
        <div className="mb-[18px] rounded-[13px] border border-[rgba(143,176,129,.2)] bg-[#251e15] px-[18px] py-4">
          <div className="mb-2 text-[10.5px] font-bold tracking-[0.5px] text-[#8fb081] uppercase">
            Your four questions for {SC[curSC][0]}, address all, weighted
            evenly
          </div>
          {(["A", "B", "C", "D"] as const).map((letter, k) => (
            <div
              key={letter}
              className="border-b border-white/[0.06] py-1.5 text-[12.5px] leading-[1.5] text-[#d9cdb6]"
            >
              <b className="text-[#8fb081]">Criterion {letter}.</b> How, and to
              what extent, {verb} {subject} {TAIL[k]}?
            </div>
          ))}
          <div className="mt-[9px] text-[11.5px] leading-[1.5] text-[#a0907a]">
            <b className="text-[#b3a48c]">{SC[curSC][0]} may include:</b>{" "}
            {MAY[curSC]}
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <div className="grid min-w-full flex-1 gap-[11px]">
            <div>
              <label
                className="mb-[5px] block text-[11.5px] font-semibold text-[#b3a48c]"
                htmlFor="aa-cit"
              >
                Proposed citation{" "}
                <span className="text-[#a0907a]">(max 25 words, third person)</span>
              </label>
              <input
                id="aa-cit"
                placeholder="For sustained, evidence-led redesign of first-year assessment that..."
                className={INPUT_CLASS}
                value={cit}
                onChange={(e) => setCit(e.target.value)}
              />
              <div
                className="mt-1 text-[11px] font-semibold"
                style={{
                  color:
                    citWords > 25
                      ? "#e6a33c"
                      : citWords > 0
                        ? "#8fb081"
                        : "#a0907a",
                }}
              >
                {citWords} / 25 words
              </div>
            </div>
            <div>
              <label
                className="mb-[5px] block text-[11.5px] font-semibold text-[#b3a48c]"
                htmlFor="aa-draft"
              >
                Your draft{" "}
                <span className="text-[#a0907a]">
                  (your claims, or your first 500 words)
                </span>
              </label>
              <textarea
                id="aa-draft"
                rows={9}
                placeholder="Paste your draft statement here..."
                className={`${INPUT_CLASS} resize-y text-[13.5px] leading-[1.55]`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
          </div>
          <div className="min-w-full flex-1">
            <div className="min-h-[240px] rounded-[14px] border border-white/[0.08] bg-[#2a2218] p-5">
              {!report ? (
                <div className="px-1.5 py-[30px] text-center text-[14px] leading-[1.6] font-semibold text-[#b3a48c]">
                  Paste your draft to get your report: criteria coverage,
                  readability, and what to strengthen.
                </div>
              ) : (
                <>
                  <div className="mb-2.5 text-[10.5px] font-bold tracking-[0.6px] text-[#8fb081] uppercase">
                    Report · focused on {SC[curSC][0]}
                  </div>
                  <div className="mb-3.5 flex flex-wrap gap-3.5">
                    <div>
                      <div className="text-[22px] leading-none font-extrabold text-[#f4efe4]">
                        {report.wc}
                      </div>
                      <div className="text-[11px] font-medium text-[#b3a48c]">
                        words
                      </div>
                    </div>
                    <div>
                      <div className="text-[22px] leading-none font-extrabold text-[#f4efe4]">
                        {report.strong}/4
                      </div>
                      <div className="text-[11px] font-medium text-[#b3a48c]">
                        criteria addressed
                      </div>
                    </div>
                    <div>
                      <div className="text-[22px] leading-none font-extrabold text-[#f4efe4]">
                        ~{report.grade}
                      </div>
                      <div className="text-[11px] font-medium text-[#b3a48c]">
                        reading grade
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 text-[12px] leading-[1.5] text-[#a0907a]">
                    Reading ease: {report.rgrade}.
                  </div>
                  {report.rows.map(({ crit, status, colour }) => (
                    <div
                      key={crit[0]}
                      className="mb-2 rounded-r-[9px] bg-navy px-3 py-2.5"
                      style={{ borderLeft: `3px solid ${colour}` }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[13px] font-bold text-white">
                          {crit[0]}. {crit[1]}
                        </div>
                        <span
                          className="whitespace-nowrap rounded-full px-[9px] py-0.5 text-[10px] font-bold tracking-[0.4px] uppercase"
                          style={{ color: colour, background: `${colour}24` }}
                        >
                          {status}
                        </span>
                      </div>
                      {status !== "Addressed" && (
                        <div className="mt-[5px] text-[12px] leading-[1.45] text-[#b3a48c]">
                          {crit[3]}
                        </div>
                      )}
                    </div>
                  ))}
                  {citTrim && (
                    <div className="mt-3 border-t border-white/[0.08] pt-[11px] text-[12.5px] leading-[1.5] font-medium text-[#d9cdb6]">
                      Citation line:{" "}
                      <b style={{ color: citWords > 25 ? "#e6a33c" : "#8fb081" }}>
                        {citWords}/25 words
                      </b>
                      {citWords > 25 ? " (trim it)." : "."}
                      {firstPerson && (
                        <span className="text-amber">
                          {" "}
                          Use third person, not I/we.
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-[22px]">
          <div className="mb-[11px] text-center text-[10.5px] font-bold tracking-[0.6px] text-[#a0907a] uppercase">
            What assessors look for
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[11px]">
            {TIPS.map(([title, body]) => (
              <div
                key={title}
                className="rounded-[9px] border border-white/[0.08] border-l-[3px] border-l-amber bg-navy px-3 py-[11px]"
              >
                <div className="mb-[3px] text-[12px] font-bold text-[#e6eef6]">
                  {title}
                </div>
                <div className="text-[12px] leading-[1.45] text-[#b3a48c]">
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-[18px] max-w-[760px] text-center text-[12px] leading-[1.55] text-[#a0907a]">
          Five AAUT award types, run by Universities Australia and the AAUTN.
          This self-check covers <b>Citations</b>; Program, Teaching, Teacher
          of the Year and Career Achievement have their own criteria. It runs
          entirely in your browser, stores nothing, and is not AI. NTLSN is
          independent and not affiliated with these bodies. Official{" "}
          <a
            href="https://aautn.org/resources/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8fb081]"
          >
            guidelines, matrix and writing tips
          </a>{" "}
          ·{" "}
          <a
            href="https://universitiesaustralia.edu.au/policy-submissions/teaching-learning-funding/australian-awards-for-university-teaching/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8fb081]"
          >
            Universities Australia AAUT
          </a>
          .
        </p>
      </div>
    </section>
  );
}
