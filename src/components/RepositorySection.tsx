import { Fragment } from "react";

/** The four pipeline steps — verbatim from the ntlsn-repository-script patch. */
const STEPS: ReadonlyArray<{
  n: string;
  title: string;
  colour: string;
  body: string;
}> = [
  {
    n: "1",
    title: "Submit",
    colour: "#8fb081",
    body: "To the conference, a symposium, or the Peer-Review Exchange.",
  },
  {
    n: "2",
    title: "Peer-reviewed",
    colour: "#c66c3f",
    body: "Double-blind review by the sector, not a single gatekeeper.",
  },
  {
    n: "3",
    title: "DOI minted",
    colour: "#a8737f",
    body: "A permanent, citable identifier. Now it is official.",
  },
  {
    n: "4",
    title: "Open & indexed",
    colour: "#e6a33c",
    body: "Archived under Creative Commons, harvestable via OAI-PMH, discoverable in CORE, BASE and beyond.",
  },
];

/**
 * #ntlsn-repository — "Present at your own symposium. Get recognised for
 * it." (Epic 1.2 PR-C), ported from the ntlsn-repository-script patch: the
 * symposium & showcase repository roadmap card (in design · 2027). Static
 * content — the four-step pipeline, the example DOI chip, the grey-
 * literature callout and the honest roadmap footnote, all verbatim.
 */
export default function RepositorySection() {
  return (
    <section
      id="ntlsn-repository"
      aria-labelledby="ntlsn-repository-heading"
      className="relative scroll-mt-20 px-4 py-[60px]"
    >
      <div className="mx-auto max-w-[940px]">
        <div className="mx-auto mb-[26px] max-w-[740px] text-center">
          <p className="mb-[13px] inline-block rounded-full border border-amber/40 px-3 py-1 text-[10.5px] font-extrabold tracking-[1.4px] text-amber uppercase">
            Symposium &amp; showcase repository · in design · 2027
          </p>
          <h2
            id="ntlsn-repository-heading"
            className="mb-3 text-[clamp(25px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
          >
            Present at your own symposium. Get recognised for it.
          </h2>
          <p className="text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#d9cdb6]">
            A symposium talk usually disappears when the event ends. Here it
            doesn&rsquo;t: your talk, poster or workshop is peer-reviewed,
            then earns a DOI — the same permanent, citable link a journal
            article gets — so it stays findable, and citable, for good.
          </p>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-2">
          {STEPS.map((step, i) => (
            <Fragment key={step.n}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="flex items-center px-0.5 text-lg text-[#a0907a]"
                >
                  →
                </span>
              )}
              <div
                className="min-w-[180px] flex-1 rounded-[13px] border border-white/[0.08] bg-[#2a2218] px-[17px] py-4"
                style={{ borderTop: `3px solid ${step.colour}` }}
              >
                <p className="mb-[7px] flex items-center gap-[9px]">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-extrabold"
                    style={{
                      background: `${step.colour}22`,
                      borderColor: step.colour,
                      color: step.colour,
                    }}
                  >
                    {step.n}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {step.title}
                  </span>
                </p>
                <p className="text-[12.5px] leading-normal text-[#b3a48c]">
                  {step.body}
                </p>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="mt-[18px] text-center">
          <p className="inline-flex max-w-full flex-wrap items-center justify-center gap-2.5 rounded-xl border border-[#8fb081]/[0.35] bg-navy px-[18px] py-[13px]">
            <span className="text-[10px] font-extrabold tracking-[1.2px] whitespace-nowrap text-[#a0907a] uppercase">
              Your DOI · example
            </span>
            <span className="font-mono text-[clamp(12.5px,2.6vw,15px)] leading-snug font-semibold break-all text-[#8fb081]">
              doi.org/10.5xxxx/ntlsn.2027.0042
            </span>
            <span className="rounded-full bg-[#8fb081] px-2.5 py-1 text-[10.5px] font-extrabold whitespace-nowrap text-[#1f1810]">
              ✓ Citable
            </span>
          </p>
        </div>

        <div className="mt-[18px] rounded-[14px] border border-[#c66c3f]/[0.22] bg-[#c66c3f]/[0.07] px-5 py-4 text-center text-sm leading-relaxed font-medium text-[#d9cdb6]">
          From grey literature to scholarship. The invisible work of teaching,
          and the student-partnership conferences that hold it, made{" "}
          <b className="text-white">official, open, and owned by no single vendor</b>
          . Your own student-partners conference can be published with us, the
          same way.
        </div>

        <p className="mx-auto mt-4 max-w-[700px] text-center text-xs leading-normal text-[#a0907a]">
          <a href="#events" className="text-[#b3a48c] underline">
            Submit to the conference →
          </a>{" "}
          · In design for 2027. DOIs are minted through a registration agency
          (Crossref / DataCite) and OAI-PMH interoperability is on the
          roadmap; today NTLSN indexes and links the sector&rsquo;s open work.
        </p>
      </div>
    </section>
  );
}
