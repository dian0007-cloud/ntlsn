import { useState } from "react";

/**
 * #ntlsn-praise — "Praise that crosses the sector." (Epic 1.2 PR-G,
 * recognition band). Ported from the production ntlsn-praise-script
 * injector: name/university/category-chips/message/from inputs drive the
 * live "Cross-sector praise" preview card. Copy verbatim; sample preview
 * only — nothing is sent from this page (a 2027 feature preview).
 */
const CATS: readonly string[] = [
  "Impact",
  "Above & beyond",
  "Inclusion",
  "Student partnership",
  "Belonging",
  "Teaching excellence",
  "Mentoring",
];

const INPUT_CLASS =
  "w-full rounded-[9px] border border-white/[0.14] bg-navy px-3 py-2.5 text-[14px] text-white";
const LABEL_CLASS =
  "mb-[5px] block text-[11.5px] font-semibold text-[#9fb3c8]";

export default function PraiseSection() {
  const [to, setTo] = useState("");
  const [uni, setUni] = useState("");
  const [msg, setMsg] = useState("");
  const [from, setFrom] = useState("");
  const [cats, setCats] = useState<ReadonlySet<string>>(new Set());

  const toggleCat = (cat: string) => {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const picked = CATS.filter((c) => cats.has(c));
  const toT = to.trim();
  const uniT = uni.trim();
  const msgT = msg.trim();
  const fromT = from.trim();

  return (
    <section
      id="ntlsn-praise"
      aria-labelledby="ntlsn-praise-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[980px]">
        <div className="mx-auto mb-[26px] max-w-[740px] text-center">
          <div className="mb-3.5 inline-flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#2DD4BF] px-3 py-1 text-[11px] font-extrabold tracking-[1.5px] text-[#06243a] uppercase">
              ▶ Try it
            </span>
            <span className="rounded-full border border-[rgba(124,156,255,.45)] px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-[#7C9CFF] uppercase">
              Cross-sector
            </span>
            <span className="rounded-full border border-[rgba(255,180,72,.4)] px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-amber uppercase">
              Preview · in design · 2027
            </span>
          </div>
          <h2
            id="ntlsn-praise-heading"
            className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            Praise that crosses the sector.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.6] text-[#aebfce]">
            Partnership work—teaching redesign, student mentoring, assessment
            co-design, curriculum innovation—happens across universities yet is
            rarely seen beyond the home institution. Recognise a partner at
            another university: tell them, note it to their manager, and add it
            to their teaching-recognition record. Promotion asks you to show
            influence beyond your own institution. Universities run internal
            schemes;{" "}
            <a
              href="#ntlsn-coming2028"
              className="font-semibold text-[#2DD4BF] no-underline"
            >
              NTLSN’s partnership registry
            </a>{" "}
            adds the visibility they cannot, and this tool adds the recognition
            that travels with it.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <div className="grid min-w-[280px] flex-1 gap-[11px]">
            <div>
              <label className={LABEL_CLASS} htmlFor="pr-to">
                Colleague’s name
              </label>
              <input
                id="pr-to"
                placeholder="e.g. Dr Alex Rivera"
                className={INPUT_CLASS}
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="pr-uni">
                Their university
              </label>
              <input
                id="pr-uni"
                placeholder="e.g. a university across the sector"
                className={INPUT_CLASS}
                value={uni}
                onChange={(e) => setUni(e.target.value)}
              />
            </div>
            <fieldset className="m-0 border-0 p-0">
              <legend className={LABEL_CLASS}>What did they do well?</legend>
              <div className="flex flex-wrap gap-[7px]">
                {CATS.map((cat) => {
                  const on = cats.has(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleCat(cat)}
                      className="cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors select-none"
                      style={
                        on
                          ? {
                              background: "rgba(45,212,191,.16)",
                              border: "1px solid rgba(45,212,191,.5)",
                              color: "#eafffb",
                            }
                          : {
                              background: "rgba(255,255,255,.06)",
                              border: "1px solid rgba(255,255,255,.14)",
                              color: "#cbd8e6",
                            }
                      }
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div>
              <label className={LABEL_CLASS} htmlFor="pr-msg">
                In a few words
              </label>
              <textarea
                id="pr-msg"
                rows={3}
                placeholder="Their work changed how I teach. Above and beyond for students across both our universities."
                className={`${INPUT_CLASS} resize-y leading-[1.5]`}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="pr-from">
                From (you)
              </label>
              <input
                id="pr-from"
                placeholder="Your name, optional"
                className={INPUT_CLASS}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
          </div>
          <div className="min-w-[290px] flex-1">
            <div className="rounded-[18px] bg-[linear-gradient(135deg,#2DD4BF,#7C9CFF,#C57BFF)] p-[1.5px]">
              <div className="rounded-[16.5px] bg-[#0c1c34] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-[1.4px] text-[#2DD4BF] uppercase">
                    Cross-sector praise
                  </span>
                  <span aria-hidden="true" className="text-[16px] text-[#7C9CFF]">
                    ◈
                  </span>
                </div>
                <div className="mt-3.5 mb-0.5">
                  <span className="text-[12px] font-semibold text-[#8aa0b6]">
                    To
                  </span>{" "}
                  <span className="text-[17px] font-extrabold text-white">
                    {toT || "a colleague"}
                  </span>
                </div>
                <div className="text-[12.5px] font-semibold text-[#9fb3c8]">
                  {uniT || "their university"}
                </div>
                <div className="my-3">
                  {picked.length ? (
                    picked.map((cat) => (
                      <span
                        key={cat}
                        className="mr-[5px] mb-[5px] inline-block rounded-full bg-[#2DD4BF] px-[9px] py-[3px] text-[10.5px] font-bold text-[#06243a]"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] font-medium text-[#8aa0b6]">
                      Pick what they did well
                    </span>
                  )}
                </div>
                {msgT ? (
                  <div className="text-[14px] leading-[1.55] text-[#eaf2fb]">
                    “{msgT}”
                    {fromT && (
                      <div className="mt-2 text-[12px] font-semibold not-italic text-[#9fb3c8]">
                        — {fromT}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[14px] leading-[1.55] italic text-[#dbe6f0]">
                    Your words of recognition will appear here.
                  </div>
                )}
                <div className="mt-3.5 border-t border-white/[0.08] pt-3 text-[11.5px] leading-[1.7] font-semibold text-[#8aa0b6]">
                  <div>→ Shared with {toT || "your colleague"}</div>
                  <div>→ Noted to their manager, with consent</div>
                  <div>→ Added to their external-esteem record</div>
                </div>
                <div className="mt-2.5 text-[10.5px] font-medium text-[#8aa0b6]">
                  Sample preview. Nothing is sent from here. Sharing in 2027.
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-[22px] max-w-[640px] text-center text-[13.5px] font-semibold text-[#2DD4BF]">
          Most promotion frameworks ask for evidence of esteem and influence
          beyond your own institution. Praise, finally captured.
        </p>
        <p className="mt-[9px] text-center">
          <a
            href="/cert.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold text-[#7C9CFF] no-underline"
          >
            Working with student partners? Generate a partnership certificate →
          </a>
        </p>
        <p className="mx-auto mt-2 max-w-[680px] text-center text-[12px] leading-[1.55] text-[#8aa0b6]">
          NTLSN shares your praise with the colleague and, with their consent,
          their manager, then files it as portable evidence of external
          recognition. A preview of a 2027 feature; nothing is sent from this
          page.
        </p>
      </div>
    </section>
  );
}
