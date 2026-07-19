/**
 * #ntlsn-founding10 — "Founding cohort · 2027 · 10 places" (Epic 1.2 PR-E),
 * ported verbatim from the ntlsn-founding10-script patch: the half-price-
 * for-life founding offer with the IT-assurance grid and the security-first
 * integration note.
 */
const IT_CARDS: ReadonlyArray<readonly [string, string]> = [
  [
    "Privacy by design",
    "Your institution owns its data. NTLSN indexes and connects the sector; it does not harvest, sell or repurpose your content.",
  ],
  [
    "Standards-based",
    "Built to the protocols your stack already speaks: LTI 1.3 / LTI Advantage, AAF single sign-on, OneRoster, Open Badges 3.0.",
  ],
  [
    "Security first",
    "Every connector is security and protocol reviewed before it goes live. Nothing touches your systems until it meets your bar.",
  ],
  [
    "Hosted responsibly",
    "Hosting and data handling aligned to Australian sector security expectations, reviewed with your IT team, not around them.",
  ],
];

export default function Founding10Section() {
  return (
    <section
      id="ntlsn-founding10"
      aria-labelledby="ntlsn-founding10-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div
        className="mx-auto max-w-[920px] rounded-[20px] border border-[#8fb081]/[0.28] px-[30px] py-[38px]"
        style={{
          background:
            "radial-gradient(120% 140% at 50% 0%, rgba(143,176,129,0.12), rgba(37,30,21,0) 70%), #251e15",
        }}
      >
        <div className="text-center">
          <p className="mb-3.5 inline-block rounded-full border border-amber/40 px-[13px] py-[5px] text-[10.5px] font-extrabold tracking-[1.6px] text-amber uppercase">
            Founding cohort · 2027 · 10 places
          </p>
          <h2
            id="ntlsn-founding10-heading"
            className="mb-2.5 text-[clamp(24px,3.4vw,38px)] leading-[1.14] font-extrabold text-white"
          >
            Be one of the first 10. Half price, for life.
          </h2>
          <p className="mx-auto mb-6 max-w-[660px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#d9cdb6]">
            The first ten universities to join shape the build and lock in{" "}
            <b className="text-white">
              50% off every connector, every year, for as long as they stay
            </b>
            . The founding cohort helps set the standards the rest of the
            sector adopts.
          </p>
        </div>
        <p className="mb-3 text-center text-xs font-bold tracking-[0.4px] text-[#a0907a] uppercase">
          What your IT team will ask, answered
        </p>
        <ul className="mb-[22px] grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {IT_CARDS.map(([head, body]) => (
            <li
              key={head}
              className="rounded-xl border border-white/[0.08] bg-navy px-[18px] py-4"
            >
              <h3 className="mb-1.5 text-sm font-bold text-teal">{head}</h3>
              <p className="text-[13.5px] leading-[1.55] text-[#b3a48c]">
                {body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mb-[22px] rounded-xl border border-amber/[0.22] bg-amber/[0.07] px-4 py-[13px] text-center text-[13px] leading-[1.55] text-[#D8C9A8]">
          We integrate carefully, security first. Connectors are prioritised
          by standards-compliance and security posture, not by market share,
          and any platform under active security review stays on hold until it
          is resolved.
        </p>
        <div className="text-center">
          <a
            href="#ntlsn-network"
            className="inline-block rounded-xl bg-[#8fb081] px-7 py-[13px] text-sm font-extrabold text-[#1f1810] no-underline shadow-[0_8px_26px_rgba(143,176,129,0.28)]"
          >
            Be one of the first 10 →
          </a>
          <p className="mt-2.5 text-[11.5px] text-[#a0907a]">
            Founding terms are indicative and confirmed on signing.
          </p>
        </div>
      </div>
    </section>
  );
}
