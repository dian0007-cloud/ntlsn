import type { ReactNode } from "react";

/**
 * #ntlsn-showcase — "Don't just attend. Walk away credentialed." (Epic 1.2
 * PR-G, recognition band). Ported verbatim from the production
 * ntlsn-showcase-script injector: the 8 + 32 = 40 recognised-hours strip and
 * the three Showcase cards.
 */
const CARDS: ReadonlyArray<{
  tag: string;
  body: ReactNode;
  accent: string;
}> = [
  {
    tag: "40-in-1",
    accent: "#FFB448",
    body: (
      <>
        One symposium = <b className="text-white">40 recognised hours</b>. 8
        hours in the room + 32 hours of associated learning. Real, recorded PD
        — not just a day out.
      </>
    ),
  },
  {
    tag: "Showcase Streams",
    accent: "#2DD4BF",
    body: (
      <>
        The 32 hours are <b className="text-white">yours to design</b> — choose
        your streams, learn on your schedule.{" "}
        <b className="text-white">PD in your time.</b>
      </>
    ),
  },
  {
    tag: "My eQuals credential",
    accent: "#C57BFF",
    body: (
      <>
        A <b className="text-white">verifiable, portable</b> digital credential
        on the rail Australian &amp; NZ universities already use — it travels
        with you, not your institution.
      </>
    ),
  },
];

export default function ShowcaseSection() {
  return (
    <section
      id="ntlsn-showcase"
      aria-labelledby="ntlsn-showcase-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      <div className="mx-auto mb-3.5 max-w-[780px] text-center">
        <div className="mb-[15px] inline-block rounded-full border border-[rgba(255,180,72,.4)] px-[13px] py-[5px] text-[11px] font-extrabold tracking-[2px] text-amber uppercase">
          Showcase · In design · 2027
        </div>
        <h2
          id="ntlsn-showcase-heading"
          className="mb-[13px] text-[clamp(27px,3.8vw,42px)] leading-[1.13] font-extrabold text-white"
        >
          Don’t just attend. Walk away credentialed.
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-[1.6] text-[#aebfce]">
          Communities of practice were the conversation.{" "}
          <b className="text-white">Showcase is the recognition</b> — your work
          seen, your hours counted, your credential portable.
        </p>
      </div>
      <div className="my-6 mb-8 text-center text-[clamp(19px,2.8vw,28px)] leading-[1.5] font-extrabold">
        <span className="text-amber">8</span>{" "}
        <span className="text-[.7em] font-normal text-[#8aa0b6]">
          in the room
        </span>{" "}
        <span className="text-[#8aa0b6]">+</span>{" "}
        <span className="text-[#2DD4BF]">32</span>{" "}
        <span className="text-[.7em] font-normal text-[#8aa0b6]">
          your streams
        </span>{" "}
        <span className="text-[#8aa0b6]">=</span>{" "}
        <span className="text-purple">40</span>{" "}
        <span className="text-[.7em] font-normal text-[#8aa0b6]">
          recognised hours
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-[18px]">
        {CARDS.map((card) => (
          <div
            key={card.tag}
            className="min-w-[250px] max-w-[380px] flex-1 rounded-[14px] border border-white/[0.08] bg-[#0f1f3a] px-6 py-[22px]"
            style={{ borderTop: `3px solid ${card.accent}` }}
          >
            <div
              className="mb-[9px] text-[12px] font-extrabold tracking-[1.5px] uppercase"
              style={{ color: card.accent }}
            >
              {card.tag}
            </div>
            <div className="text-[15px] leading-[1.62] text-[#aebfce]">
              {card.body}
            </div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-7 max-w-[720px] text-center text-[13px] italic text-[#8aa0b6]">
        In design — the My eQuals credential integration is on the 2027
        roadmap. NTLSN issues the verifiable record of structured PD;
        recognition grows as institutions and bodies adopt it.
      </p>
    </section>
  );
}
