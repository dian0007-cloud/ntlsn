import type { ReactNode } from "react";

/**
 * #ntlsn-principles — "Built on the five principles of good SoTL practice"
 * (Epic 1.2 PR-G, manifesto band). Ported verbatim from the production
 * ntlsn-principles-script injector, including the Felten (2013) citation.
 */
const PRINCIPLES: ReadonlyArray<{
  n: string;
  title: string;
  body: ReactNode;
  colour: string;
  link: string;
  linkText: string;
}> = [
  {
    n: "1",
    title: "Inquiry into student learning",
    body: (
      <>
        Every tool centres how students actually learn — the Peer-Review
        Exchange, Calibration, and a 1,431-work scholarship archive.
      </>
    ),
    colour: "#2DD4BF",
    link: "#ntlsn-coming2027",
    linkText: "Peer-Review Exchange",
  },
  {
    n: "2",
    title: "Grounded in context",
    body: (
      <>
        Framework-personalisation maps to the framework <i>you</i> choose —
        TELAS, AdvanceHE PSF, your own outcomes — and the map honours each
        institution’s and Country’s context.
      </>
    ),
    colour: "#FFB448",
    link: "#ntlsn-capabilities",
    linkText: "Capabilities",
  },
  {
    n: "3",
    title: "Methodologically sound",
    body: (
      <>
        Double-blind peer review, cross-marker calibration, and shared rubric
        &amp; exemplar libraries — rigour by default, not by afterthought.
      </>
    ),
    colour: "#7C9CFF",
    link: "#ntlsn-coming2027",
    linkText: "Calibration Suite",
  },
  {
    n: "4",
    title: "In partnership with students",
    body: (
      <>
        The National Students-as-Partners Registry puts students <i>in</i> the
        work — as partners, not just as data.
      </>
    ),
    colour: "#C57BFF",
    link: "#ntlsn-coming2028",
    linkText: "SaP Registry",
  },
  {
    n: "5",
    title: "Appropriately public",
    body: (
      <>
        A free, open commons — the whole sector’s work, visible to everyone,
        no paywall, in perpetuity. SoTL made genuinely public.
      </>
    ),
    colour: "#4FD1A5",
    link: "#ntlsn-archive",
    linkText: "The open archive",
  },
];

export default function PrinciplesSection() {
  return (
    <section
      id="ntlsn-principles"
      aria-labelledby="ntlsn-principles-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      <div className="mx-auto mb-[34px] max-w-[780px] text-center">
        <div className="mb-[11px] text-[13px] font-bold tracking-[2px] text-[#2DD4BF] uppercase">
          Grounded in the scholarship
        </div>
        <h2
          id="ntlsn-principles-heading"
          className="mb-[13px] text-[clamp(26px,3.6vw,40px)] leading-[1.15] font-extrabold text-white"
        >
          Built on the five principles of good SoTL practice
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-[1.6] text-[#aebfce]">
          NTLSN isn’t a tool bolted onto teaching. By design, the commons
          embodies all five principles of good practice in the Scholarship of
          Teaching and Learning —{" "}
          <b className="text-white">scholarship by design</b>.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {PRINCIPLES.map((p) => (
          <div
            key={p.n}
            className="min-w-[240px] max-w-[340px] flex-1 rounded-[14px] border border-white/[0.08] bg-[#0f1f3a] px-[22px] py-5"
            style={{ borderTop: `3px solid ${p.colour}` }}
          >
            <div className="mb-[9px] flex items-center gap-[11px]">
              <span
                aria-hidden="true"
                className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full text-[14px] font-extrabold"
                style={{
                  background: `${p.colour}1f`,
                  border: `1px solid ${p.colour}`,
                  color: p.colour,
                }}
              >
                {p.n}
              </span>
              <span className="text-[15.5px] leading-[1.2] font-extrabold text-white">
                {p.title}
              </span>
            </div>
            <div className="text-[14px] leading-[1.6] text-[#aebfce]">
              {p.body}
            </div>
            <a
              href={p.link}
              className="mt-[11px] inline-block text-[12.5px] font-bold no-underline"
              style={{ color: p.colour }}
            >
              {p.linkText} →
            </a>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-7 max-w-[740px] text-center text-[12.5px] italic text-[#8aa0b6]">
        After Felten, P. (2013). Principles of Good Practice in SoTL.{" "}
        <i>Teaching &amp; Learning Inquiry: The ISSOTL Journal</i>, 1(1),
        121–125.
      </p>
    </section>
  );
}
