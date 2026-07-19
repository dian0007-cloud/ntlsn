/**
 * #ntlsn-natcert — "One module each. A Graduate Certificate the whole sector
 * owns." (Epic 1.2 PR-G, recognition band). Ported verbatim from the
 * production ntlsn-natcert-script injector.
 */
const CHIPS: readonly string[] = [
  "Each university contributes a module",
  "Credit-bearing and badged",
  "Transportable: recognised uni to uni via RPL and My eQuals",
];

export default function NatCertSection() {
  return (
    <section
      id="ntlsn-natcert"
      aria-labelledby="ntlsn-natcert-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[880px] rounded-[18px] border border-white/[0.09] border-t-[3px] border-t-[#8fb081] bg-[#2a2218] px-[30px] py-[34px] text-center">
        <div className="mb-4 inline-block rounded-full border border-[rgba(230,163,60,.4)] px-[13px] py-[5px] text-[10.5px] font-extrabold tracking-[1.6px] text-amber uppercase">
          A national qualification · proposed · in design
        </div>
        <h2
          id="ntlsn-natcert-heading"
          className="mb-3 text-[clamp(23px,3vw,34px)] leading-[1.18] font-extrabold text-white"
        >
          One module each. A Graduate Certificate the whole sector owns.
        </h2>
        <p className="mx-auto mb-[22px] max-w-[680px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#d9cdb6]">
          Right now, micro-learning rarely travels. A module done at one
          university is seldom recognised at another. The idea is simple: every
          university contributes one module, and together the sector holds a
          credit-bearing, badged, transportable Graduate Certificate,
          recognised from one institution to the next.
        </p>
        <div className="mb-[22px] flex flex-wrap items-center justify-center gap-2">
          {["Module", "Module", "Module", "Module"].map((m, i) => (
            <span key={i} className="contents">
              {i > 0 && (
                <span aria-hidden="true" className="font-extrabold text-[#a0907a]">
                  +
                </span>
              )}
              <span className="rounded-lg border border-white/[0.14] bg-white/[0.05] px-[13px] py-[7px] text-[12px] font-bold text-[#d9cdb6]">
                {m}
              </span>
            </span>
          ))}
          <span
            aria-hidden="true"
            className="mx-1 text-[18px] font-extrabold text-[#a0907a]"
          >
            →
          </span>
          <span className="rounded-lg bg-[#8fb081] px-[15px] py-2 text-[13px] font-extrabold text-[#1f1810]">
            Graduate Certificate
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-[rgba(143,176,129,.3)] bg-[rgba(143,176,129,.10)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#d9cdb6]"
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-[680px] text-[12px] leading-[1.5] text-[#a0907a]">
          A proposed model, not yet an accredited award. Accreditation and
          credit recognition would be designed with the institutions and the
          regulator. The sector audit above shows no provider yet offers a
          fully stackable, portable micro-credit Grad Cert. That gap is the
          opening.
        </p>
      </div>
    </section>
  );
}
