/**
 * #ntlsn-induction — "Academic induction · part of the School package"
 * (Epic 1.2 PR-D), ported verbatim from the ntlsn-induction-script patch:
 * a single pointer card that hands off to the School package in #pricing.
 */
export default function InductionSection() {
  return (
    <section
      id="ntlsn-induction"
      aria-labelledby="ntlsn-induction-heading"
      className="relative scroll-mt-20 px-6 py-[34px]"
    >
      <div className="mx-auto max-w-[760px] rounded-2xl border border-white/10 bg-[#0F1F3A] px-[26px] py-[22px] text-center">
        <p className="mb-2 text-[11px] font-extrabold tracking-[2px] text-amber uppercase">
          Academic induction · part of the School package
        </p>
        <h2
          id="ntlsn-induction-heading"
          className="mb-1.5 text-[19px] font-extrabold text-white"
        >
          Induct your new, casual and sessional staff — before the cracks
          appear.
        </h2>
        <p className="mb-3.5 text-[13.5px] leading-relaxed text-[#9FB3C8]">
          A contextualised induction grounded in SoTL and Felten&rsquo;s five
          principles — new to marking, new to teaching, new to academia.
          Details live in the School package below.
        </p>
        <a
          href="#pricing"
          className="inline-block rounded-[10px] bg-teal px-5 py-2.5 text-[13px] font-extrabold text-[#06251F] no-underline"
        >
          See the School package →
        </a>
      </div>
    </section>
  );
}
