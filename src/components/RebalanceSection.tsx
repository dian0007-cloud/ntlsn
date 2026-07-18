/**
 * #ntlsn-rebalance — "Research has the weight. Teaching holds the load."
 * (Epic 1.2 PR-G, manifesto band). Ported verbatim from the production
 * ntlsn-rebalance-script injector; the animated weighting bar's CSS
 * (.rbar/.rseg keyframes, including the injector's own reduced-motion
 * static 60/40 split) lives in styles.css.
 */
export default function RebalanceSection() {
  return (
    <section
      id="ntlsn-rebalance"
      aria-labelledby="ntlsn-rebalance-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[760px] text-center">
        <div className="mb-3 text-[11px] font-extrabold tracking-[2px] text-[#2DD4BF] uppercase">
          Rebalancing the sector
        </div>
        <h2
          id="ntlsn-rebalance-heading"
          className="mb-3 text-[clamp(24px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
        >
          Research has the weight. Teaching holds the load.
        </h2>
        <p className="mx-auto max-w-[640px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#cbd8e6]">
          Every workload model tips the same way. Research is measured and
          rewarded; teaching and the scholarship of teaching carry the sector
          and count for less. NTLSN puts weight back on the other side.
        </p>
        <div className="mx-auto mt-6 max-w-[640px]">
          <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-[#8aa0b6]">
            <span>How the sector weights it today</span>
            <span>After NTLSN</span>
          </div>
          <div className="rbar">
            <div className="rseg rseg-r">Research</div>
            <div className="rseg rseg-t">Teaching &amp; SoTL</div>
          </div>
          <div className="relative h-3.5">
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 h-[9px] w-px bg-white/30"
            />
            <div className="absolute top-[9px] left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#8aa0b6]">
              balance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
