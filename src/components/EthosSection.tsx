/**
 * #ntlsn-ethos — "Who doesn't get to partner?" (Epic 1.2 PR-G, manifesto
 * band). Ported verbatim from the production ntlsn-ethos-script injector:
 * the question behind NTLSN, the Students-as-Partners grounding and the
 * founder line.
 */
export default function EthosSection() {
  return (
    <section
      id="ntlsn-ethos"
      aria-labelledby="ntlsn-ethos-heading"
      className="mx-auto max-w-[1100px] scroll-mt-20 px-[22px] py-[66px]"
    >
      <div className="mx-auto max-w-[760px] text-center">
        <div className="mb-[18px] text-[13px] font-extrabold tracking-[2px] text-coral uppercase">
          About · the question behind NTLSN
        </div>
        <h2
          id="ntlsn-ethos-heading"
          className="mb-[18px] text-[clamp(28px,5vw,44px)] leading-[1.15] font-extrabold text-white"
        >
          “Who doesn’t get to partner?”
        </h2>
        <p className="mx-auto mb-[18px] max-w-[660px] text-[17px] leading-[1.65] font-semibold text-[#cbd8e6]">
          Everything on this site says <i>open to everyone</i>. This is the
          question that tests whether that is true — and the one that keeps
          the whole project honest.
        </p>
        <p className="mx-auto mb-4 max-w-[680px] text-[16px] leading-[1.75] text-[#9fb3c8]">
          NTLSN grows out of A/Prof Seb Dianati’s scholarship on{" "}
          <b className="text-[#cbd8e6]">Students as Partners</b>. Partnership
          promises shared authorship of teaching and learning; in practice the
          invitation is uneven. It reaches some students and not others, and
          too rarely the casualised teacher, the regional or under-resourced
          institution, or those whose identities intersect at the margins of
          who universities were built for.
        </p>
        <p className="mx-auto mb-[22px] max-w-[680px] text-[16px] leading-[1.75] text-[#9fb3c8]">
          A free, open commons is one answer. When the sector’s knowledge,
          events and evidence are rationed by neither budget nor status, the
          threshold to take part drops for everyone — which is why the commons
          stays free, forever. First Nations teaching and learning is held
          here as work to learn from, never to rank. The question above is not
          something we have solved; it is the conscience we hold the whole
          project to.
        </p>
        <a
          href="#ntlsn-coming2028"
          className="mb-[22px] inline-block text-[14px] font-bold text-teal no-underline"
        >
          See the national partnership work →
        </a>
        <div className="mx-auto max-w-[540px] border-t border-white/10 pt-4 text-[14px] leading-[1.6] text-[#8aa0b6]">
          Founded by A/Prof Seb Dianati · independent of any single institution
          · grounded in Students as Partners pedagogy and scholarship.
        </div>
      </div>
    </section>
  );
}
