import { CHOOSE_PACKAGE_CARDS, requestPricingRole } from "../lib/pricing";

/**
 * #ntlsn-choosepackage — "Bringing it to your school or institution?"
 * (Epic 1.2 PR-E), ported verbatim from the ntlsn-choosepackage-script
 * patch. Each card anchors to #pricing; cards with a role also pre-select
 * the matching chip in the pricing role router (production clicked the
 * .pt-role chip 700ms after the jump — here a CustomEvent does the hand-off,
 * see lib/pricing.ts).
 */
export default function ChoosePackageSection() {
  return (
    <section
      id="ntlsn-choosepackage"
      aria-labelledby="ntlsn-choosepackage-heading"
      className="relative z-10 mx-auto max-w-[92rem] scroll-mt-20 px-6 py-14"
    >
      <div className="mx-auto mb-[30px] max-w-[760px] text-center">
        <p className="mb-2.5 text-[11px] font-extrabold tracking-[2.5px] text-[#c9a962] uppercase">
          ◆ Run your own · founding 2026–27
        </p>
        <h2
          id="ntlsn-choosepackage-heading"
          className="mb-[13px] text-[clamp(26px,3.6vw,40px)] leading-[1.15] font-extrabold text-white"
        >
          Bringing it to your school or institution?
        </h2>
        <p className="text-[clamp(15px,1.8vw,17px)] leading-relaxed text-[#bca98f]">
          The commons stays free forever. When you&rsquo;re ready to{" "}
          <b className="text-white">run your own</b> — tell us who you are,
          and we&rsquo;ll take you to the right package.
        </p>
      </div>
      <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHOOSE_PACKAGE_CARDS.map((card) => (
          <a
            key={card.title}
            href="#pricing"
            onClick={() => {
              if (card.role) requestPricingRole(card.role);
            }}
            className="relative flex flex-col rounded-[15px] border border-white/[0.08] bg-[#2a2218] px-[22px] pt-[22px] pb-5 no-underline transition-[transform,border-color] duration-200 [border-top:3px_solid_#c9a962] hover:-translate-y-[3px] hover:border-[#c9a962]/55"
          >
            <span aria-hidden="true" className="mb-[11px] text-[26px] leading-none">
              {card.icon}
            </span>
            <span className="mb-1.5 text-[17px] font-extrabold text-white">
              {card.title}
            </span>
            <span className="mb-3.5 flex-1 text-[13px] leading-[1.55] text-[#b3a48c]">
              {card.desc}
            </span>
            <span className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-extrabold text-[#c9a962]">
                {card.tier} · {card.price}
              </span>
              <span className="text-[12.5px] font-bold text-teal">
                See the package →
              </span>
            </span>
          </a>
        ))}
      </div>
      <p className="mt-[18px] text-center text-xs text-[#7D8DA0]">
        Founding-cohort rates for the 2026–27 pilots · the free commons needs
        none of it.
      </p>
    </section>
  );
}
