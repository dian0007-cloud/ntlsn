import { useEffect, useRef } from "react";

/**
 * #ntlsn-advisory — "Advisory & Alliance · Built in the open. Steered as it
 * grows." (Epic 1.2 PR-E), ported verbatim from the ntlsn-advisory-script
 * patch: international-consultancy card (orbit rings), founder card, and
 * the forming sector/academic circle.
 *
 * CONSENT GATE (carried over from the production script): named advisory
 * cards are NOT rendered until each person confirms public listing — the
 * script's bigCard() renderer existed but was deliberately unused, and the
 * circle is described as "forming" with members "named here as each
 * confirms". Keep it that way until Seb confirms names.
 *
 * Reveal/shimmer/orbit animations live in styles.css (adv-* rules) and are
 * neutralised by the global prefers-reduced-motion block.
 */
const INTL_CHIPS: readonly string[] = [
  "Recognition models",
  "Symposium engine",
  "Quality & readiness",
  "Open data & APIs",
];

function CircleLabel({ text }: { text: string }) {
  return (
    <p className="mb-4 text-center text-xs font-extrabold tracking-[1.5px] text-amber uppercase">
      {text}
    </p>
  );
}

export default function AdvisorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Production's reveal: add .adv-in when the section scrolls into view
  // (threshold .12), with a 2.6s fallback so the cards never stay hidden.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reveal = () => section.classList.add("adv-in");
    const fallback = setTimeout(reveal, 2600);
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            reveal();
            io?.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      io.observe(section);
    } else {
      reveal();
    }
    return () => {
      clearTimeout(fallback);
      io?.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ntlsn-advisory"
      aria-labelledby="ntlsn-advisory-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 py-[38px]"
    >
      <div className="mx-auto mb-9 max-w-[860px] text-center">
        <div
          aria-hidden="true"
          className="adv-bar mx-auto mb-[18px] h-1 w-[120px] rounded-full"
        />
        <p className="mb-[15px] inline-block rounded-full border border-[#8fb081]/40 px-[13px] py-[5px] text-[11px] font-extrabold tracking-[2px] text-[#8fb081] uppercase">
          Advisory &amp; Alliance
        </p>
        <h2
          id="ntlsn-advisory-heading"
          className="mb-[9px] text-[clamp(17px,2.1vw,23px)] leading-[1.2] font-extrabold text-white"
        >
          Built in the open. Steered as it grows.
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-relaxed text-[#bca98f]">
          A free national commons — led by its founder, with an{" "}
          <b className="text-white">advisory circle forming</b> across the
          sector. Members are named here as each confirms.
        </p>
      </div>

      {/* International consultancy — in design */}
      <div
        className="adv-card relative mx-auto max-w-[940px] overflow-hidden rounded-[20px] border border-[#8fb081]/[0.22] px-[22px] py-6 text-center"
        style={{
          animationDelay: "80ms",
          background:
            "radial-gradient(120% 140% at 50% 0%, rgba(143,176,129,0.13), rgba(198,108,63,0.06) 45%, rgba(37,30,21,0) 75%), #251e15",
        }}
      >
        <div
          aria-hidden="true"
          className="adv-orbit pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-[58%] opacity-50"
        >
          <div className="absolute inset-0 rounded-full border border-[#8fb081]/[0.14]" />
          <div className="absolute inset-[80px] rounded-full border border-[#c66c3f]/[0.12]" />
          <div className="absolute inset-[170px] rounded-full border border-purple/10" />
        </div>
        <div className="relative">
          <p className="mb-4 inline-block rounded-full border border-amber/40 px-[13px] py-[5px] text-[10.5px] font-extrabold tracking-[1.6px] text-amber uppercase">
            🌐 International consultancy · In design
          </p>
          <h3 className="mb-[9px] text-[clamp(18px,2.1vw,24px)] leading-[1.15] font-extrabold text-white">
            Take it global.
          </h3>
          <p className="mx-auto mb-5 max-w-[680px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#d9cdb6]">
            Beyond Australia, NTLSN can help institutions and systems abroad
            adopt the same recognition, symposium and quality models.
            International engagements are scoped case by case.
          </p>
          <div className="mb-[22px] flex flex-wrap justify-center gap-[9px]">
            {INTL_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/[0.12] bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#d9cdb6]"
              >
                {chip}
              </span>
            ))}
          </div>
          <a
            href="#ntlsn-network"
            className="inline-block rounded-xl bg-[#8fb081] px-[26px] py-3 text-sm font-extrabold text-[#1f1810] no-underline shadow-[0_8px_26px_rgba(143,176,129,0.28)]"
          >
            Enquire about international engagements →
          </a>
        </div>
      </div>

      {/* Founder */}
      <div className="mt-10">
        <CircleLabel text="Founder" />
        <div className="mx-auto mb-10 max-w-[680px]">
          <div
            className="adv-card rounded-[18px] border border-white/[0.09] bg-[#2a2218] p-[26px] [border-top:3px_solid_#8fb081]"
            style={{ animationDelay: "0ms" }}
          >
            <div className="mb-3.5 flex flex-wrap items-center gap-4">
              <div
                aria-hidden="true"
                className="adv-ava flex h-[66px] w-[66px] flex-none items-center justify-center rounded-full text-[23px] font-extrabold text-[#1f1810] shadow-[0_6px_18px_rgba(0,0,0,0.32)]"
                style={{
                  background: "linear-gradient(135deg,#8fb081,#c66c3f)",
                }}
              >
                SD
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl leading-[1.15] font-extrabold text-white">
                  Associate Professor Seb Dianati
                </h3>
                <p className="mt-[3px] text-[13px] font-bold text-[#8fb081]">
                  Founder &amp; Chair, NTLSN
                </p>
                <p className="mt-0.5 text-[12.5px] font-semibold text-[#b3a48c]">
                  Senior Academic Development Consultant · Learning &amp;
                  Teaching Futures, UniSQ
                </p>
                <p className="mt-[5px] text-[11px] font-semibold tracking-[0.3px] text-[#a0907a]">
                  BSc(MedChem) · BIE(S&amp;T) · GDIBA · MBA · EdD · SFHEA
                </p>
              </div>
            </div>
            <p className="mb-3 text-sm leading-[1.62] text-[#d9cdb6]">
              Author of <i>The Commercialisation of MOOCs</i>; researcher in
              students-as-partners and Indigenous curriculum; elected
              (volunteer) board member of the Centre for Australian
              Democracy. NTLSN grew from that work — a critique of
              commercialised education, made constructive.
            </p>
            <p className="mb-3 border-t border-white/[0.07] pt-2.5 text-[11.5px] leading-[1.55] text-[#97876f]">
              Dianati &amp; Bolt (2025), <i>AJIE</i> — Indigenous knowledge in
              the curriculum.
              <br />
              Dianati, Ashford, Pearson &amp; Williams (2025), <i>IJSaP</i> —
              benchmarking student-partnership models.
            </p>
            <div className="flex flex-wrap gap-[7px]">
              {["SFHEA", "EdD", "Author", "Centre for Australian Democracy"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-[11px] py-1 text-[11px] font-bold text-[#AAB8C8]"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sector & academic circle — forming (names held behind the consent gate) */}
      <div
        className="adv-card mx-auto mb-[18px] max-w-[940px] rounded-2xl border border-[#c66c3f]/[0.22] px-[26px] py-6 text-center"
        style={{
          animationDelay: "240ms",
          background:
            "linear-gradient(120deg, rgba(198,108,63,0.08), rgba(168,115,127,0.06))",
        }}
      >
        <CircleLabel text="Sector & academic circle — forming" />
        <p className="mx-auto mb-3.5 max-w-[680px] text-[14.5px] leading-relaxed text-[#d9cdb6]">
          An advisory circle is forming with open-education and SoTL leaders
          across Australian universities. Each member will be named here as
          they confirm.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <span className="rounded-[10px] border border-white/10 bg-[#2a2218] px-[15px] py-[9px] text-[13px] font-bold text-[#d9cdb6]">
            Open-education &amp; SoTL leaders — named here as each confirms
          </span>
        </div>
      </div>
    </section>
  );
}
