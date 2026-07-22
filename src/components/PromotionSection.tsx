import { useState } from "react";

/**
 * #ntlsn-promotion — "Your promotion case, mapped." (Epic 1.2 PR-G,
 * recognition band). Ported from the production ntlsn-promotion-script
 * injector: performance/probation/promotion modes, academic levels A–E, the
 * four-domain cards (level descriptors verbatim, with the "NTLSN feeds
 * this" lines) and the gap/building/strong self-rating summary.
 */
const LEVELS: ReadonlyArray<[string, string]> = [
  ["A", "Associate Lecturer"],
  ["B", "Lecturer"],
  ["C", "Senior Lecturer"],
  ["D", "Associate Professor"],
  ["E", "Professor"],
];

const MODES: ReadonlyArray<[string, string, string]> = [
  ["perf", "Performance", "your annual evidence across the four domains"],
  ["prob", "Probation", "what confirmation looks like at your level"],
  ["promo", "Promotion", "the case for your next level"],
];

const DOMAINS: ReadonlyArray<{
  key: string;
  name: string;
  feeds: string;
  L: readonly string[];
}> = [
  {
    key: "teach",
    name: "Teaching",
    feeds: "Peer-Review Exchange, Calibration, Course Quality, Passport, Showcase",
    L: [
      "Emerging teaching profile; implements pedagogy suited to the cohort; assists with course coordination.",
      "Growing teaching profile; designs effective learning and assessment; generates student engagement.",
      "Established, effective teaching; continuous improvement in design; leads courses and cohorts.",
      "Exemplary design that lifts outcomes; introduces novel approaches; leads programs and reform.",
      "Sustained, sector-shaping teaching; transforms outcomes; national and international leadership.",
    ],
  },
  {
    key: "research",
    name: "Research",
    feeds: "SoTL outputs, the open repository, DOIs",
    L: [
      "Produces outputs to discipline norms; participates in funding and translation.",
      "A lead role in some outputs; a developing national profile; contributes to funding.",
      "National recognition and a developing international profile; often leads funding; builds teams.",
      "International recognition; leads significant funding; holds discipline-leadership roles.",
      "A prominent international profile; leads major and cross-disciplinary funding; prestigious service.",
    ],
  },
  {
    key: "super",
    name: "Supervision & researcher development",
    feeds: "Mentoring records, recognition",
    L: [
      "A developing supervision record; active responsible-conduct engagement; contributes to capability.",
      "A developing record; facilitates capability and engagement; effective personal supervision.",
      "An established supervision record; develops capability; leads engagement opportunities.",
      "Sustained supervision success; leads responsible conduct; develops others as supervisors.",
      "An outstanding supervision record; sector leadership in researcher development.",
    ],
  },
  {
    key: "citizen",
    name: "Citizenship & service",
    feeds: "Service & governance, Cross-sector praise (external esteem)",
    L: [
      "Demonstrates values; undertakes service roles; collaborates in external activity.",
      "Effective internal service; pursues external service and engagement; mentors others.",
      "An established service record; evidence of external service; leads through mentoring and wellbeing.",
      "Sustained service impact; external leadership; contributes to governance.",
      "Senior leadership of self and others; significant internal and external service; improves governance.",
    ],
  },
];

type Rating = "" | "gap" | "building" | "strong";

const RATING_META: Record<Exclude<Rating, "">, { label: string; rgb: string; hex: string }> = {
  gap: { label: "Gap", rgb: "159,179,200", hex: "#d9cdb6" },
  building: { label: "Building", rgb: "255,180,72", hex: "#e6a33c" },
  strong: { label: "Strong", rgb: "45,212,191", hex: "#8fb081" },
};

export default function PromotionSection() {
  const [curMode, setCurMode] = useState("promo");
  const [curLvl, setCurLvl] = useState(2);
  const [ratings, setRatings] = useState<Record<string, Rating>>({
    teach: "",
    research: "",
    super: "",
    citizen: "",
  });

  const rated = Object.values(ratings).filter(Boolean).length;
  const strong = Object.values(ratings).filter((r) => r === "strong").length;
  const modeMeta = MODES.find((m) => m[0] === curMode);
  const tail =
    strong >= 4
      ? " A strong case is taking shape."
      : strong >= 2
        ? " Building well; focus the weaker domains next."
        : " Early days; the gaps show you where to grow.";

  return (
    <section
      id="ntlsn-promotion"
      aria-labelledby="ntlsn-promotion-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[960px]">
        <div className="mx-auto mb-6 max-w-[740px] text-center">
          <div className="mb-3.5 inline-flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-[rgba(198,108,63,.45)] px-3 py-1 text-[11px] font-extrabold tracking-[1.4px] text-[#c66c3f] uppercase">
              For institutions
            </span>
            <span className="rounded-full border border-[rgba(230,163,60,.4)] px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-amber uppercase">
              Preview · in design · 2028
            </span>
          </div>
          <h2
            id="ntlsn-promotion-heading"
            className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            Your promotion case, mapped.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#bca98f]">
            Performance, probation and promotion ask for the same four domains
            at a higher bar each time. Pick your level and your purpose, see
            what is expected, and rate your evidence. Every NTLSN record feeds
            straight in.
          </p>
        </div>
        <div className="mb-2 flex flex-wrap justify-center gap-2">
          {MODES.map(([id, label]) => {
            const on = id === curMode;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setCurMode(id)}
                className="cursor-pointer rounded-full px-4 py-[7px] text-[12.5px] font-bold transition-colors"
                style={
                  on
                    ? {
                        background: "#c66c3f",
                        color: "#1f1810",
                        border: "1px solid #c66c3f",
                      }
                    : {
                        background: "rgba(255,255,255,.06)",
                        color: "#d9cdb6",
                        border: "1px solid rgba(255,255,255,.14)",
                      }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="mb-4 text-center text-[12.5px] font-semibold text-[#a0907a]">
          {modeMeta?.[2]}
        </div>
        <div className="mb-[9px] text-center text-[10.5px] font-bold tracking-[0.5px] text-[#a0907a] uppercase">
          Your academic level
        </div>
        <div className="mb-5 flex gap-[7px]">
          {LEVELS.map(([code, label], i) => {
            const on = i === curLvl;
            return (
              <button
                key={code}
                type="button"
                title={label}
                aria-pressed={on}
                onClick={() => setCurLvl(i)}
                className="min-w-[54px] flex-1 cursor-pointer rounded-[10px] py-[9px] text-[14px] font-extrabold transition-colors"
                style={
                  on
                    ? {
                        background: "#8fb081",
                        color: "#1f1810",
                        border: "1px solid #8fb081",
                      }
                    : {
                        background: "rgba(255,255,255,.05)",
                        color: "#d9cdb6",
                        border: "1px solid rgba(255,255,255,.14)",
                      }
                }
              >
                {code}
                <span className="mt-[3px] block text-[8.5px] font-semibold tracking-[0.3px] text-[#a0907a] uppercase">
                  {label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5">
          {DOMAINS.map((d) => (
            <div
              key={d.key}
              className="rounded-[13px] border border-white/[0.08] bg-[#2a2218] p-[17px]"
            >
              <div className="mb-1 text-[15px] font-extrabold text-white">
                {d.name}
              </div>
              <div className="min-h-[60px] text-[13px] leading-[1.55] text-[#bca98f]">
                {d.L[curLvl]}
              </div>
              <div className="mt-2.5 mb-[11px] text-[10.5px] leading-[1.4] font-semibold text-[#8fb081]">
                NTLSN feeds this:{" "}
                <span className="font-medium text-[#a0907a]">{d.feeds}</span>
              </div>
              <div className="flex gap-1.5">
                {(Object.keys(RATING_META) as Array<Exclude<Rating, "">>).map(
                  (val) => {
                    const meta = RATING_META[val];
                    const on = ratings[d.key] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setRatings((prev) => ({ ...prev, [d.key]: val }))
                        }
                        className="cursor-pointer rounded-[7px] px-[11px] py-[5px] text-[11px] font-semibold transition-colors"
                        style={
                          on
                            ? {
                                background: `rgba(${meta.rgb},.16)`,
                                border: `1px solid rgb(${meta.rgb})`,
                                color: meta.hex,
                              }
                            : {
                                background: "rgba(255,255,255,.05)",
                                border: "1px solid rgba(255,255,255,.14)",
                                color: "#b3a48c",
                              }
                        }
                      >
                        {meta.label}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-[18px] rounded-[11px] border border-[rgba(143,176,129,.22)] bg-[rgba(143,176,129,.08)] px-4 py-3.5 text-center text-[14px] leading-[1.55] font-semibold text-[#d9cdb6]"
          role="status"
        >
          {!rated ? (
            "Rate your evidence in each domain to see your readiness."
          ) : (
            <>
              <b className="text-[#8fb081]">{strong} of 4</b> domains rated
              strong for{" "}
              <b className="text-white">
                Level {LEVELS[curLvl][0]} · {LEVELS[curLvl][1]}
              </b>{" "}
              ({modeMeta?.[1]}).{tail}
            </>
          )}
        </div>
        <p className="mx-auto mt-4 max-w-[700px] text-center text-[12px] leading-[1.55] text-[#a0907a]">
          A teaching aid mapped to a generic, configurable four-domain
          framework (Levels A to E). Your institution configures its own
          criteria, sets the bar, and makes every decision; NTLSN supplies the
          evidence record. Built for schools in 2028.
        </p>
      </div>
    </section>
  );
}
