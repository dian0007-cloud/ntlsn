/**
 * #ntlsn-aim — "Connecting the sector — sustainably" (Epic 1.2 PR-G,
 * manifesto band). Ported verbatim from the production ntlsn-aim injector
 * (the patch inserted it directly before the footer; SECTION_ORDER's
 * canonical row places it between #ntlsn-representation and
 * #ntlsn-rebalance, where the ntlsn-order script positioned it).
 */
export default function AimSection() {
  return (
    <section
      id="ntlsn-aim"
      aria-labelledby="ntlsn-aim-heading"
      className="relative z-10 scroll-mt-20 border-t border-white/[0.06] px-4 py-14"
    >
      <div className="mx-auto max-w-[46rem] text-center">
        <div className="mb-3.5 text-[12px] font-bold tracking-[0.28em] text-teal uppercase">
          ● Our aim
        </div>
        <h2
          id="ntlsn-aim-heading"
          className="mb-3.5 text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-extrabold tracking-[-0.02em] text-white"
        >
          Connecting the sector — sustainably
        </h2>
        <p className="mx-auto text-[1.05rem] leading-[1.7] text-white/[0.62]">
          NTLSN brings together what already exists across Australian higher
          education — events, resources, frameworks and the sector’s own
          voices — into one free, open place.
        </p>
        <p className="mx-auto mt-3.5 text-[1.05rem] leading-[1.7] text-white/[0.62]">
          We hope to grow: from{" "}
          <em className="not-italic text-white">watching</em> the sector, to
          learning <em className="not-italic text-white">from</em> the sector,
          to amplifying it. For now — to keep this free, independent and
          sustainable — we focus on doing one thing well: connecting you to
          what’s already out there.
        </p>
      </div>
    </section>
  );
}
