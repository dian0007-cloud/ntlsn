import { universityCount } from "../data";

/**
 * #ntlsn-why — "Why NTLSN" (Epic 1.2 PR-E), ported verbatim from the
 * ntlsn-why-script patch. Production gave this section no ntlsn-order row —
 * the script inserted it directly before #about; its SECTION_ORDER slot
 * mirrors that position. The university count derives from data (production
 * hardcoded "42" — the Hero.tsx convention applies).
 */
const WHY_CARDS: ReadonlyArray<readonly [string, string]> = [
  [
    "Open by default",
    "Free, no logins, no paywalls — grounded in the five principles of good SoTL practice.",
  ],
  [
    "Connective, not competitive",
    "A navigator and connector for the whole sector, not another walled platform.",
  ],
  [
    "Sustainable by design",
    "The commons stays free forever; the optional paid layer funds it, and never gates it.",
  ],
];

export default function WhySection() {
  return (
    <section
      id="ntlsn-why"
      aria-labelledby="ntlsn-why-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      <div className="mx-auto max-w-[880px] text-center">
        <p className="mb-3 text-[11px] font-extrabold tracking-[1.7px] text-teal uppercase">
          Why NTLSN
        </p>
        <h2
          id="ntlsn-why-heading"
          className="mb-3.5 text-[clamp(26px,3.6vw,42px)] leading-[1.13] font-extrabold tracking-[-0.01em] text-white"
        >
          The sector works alone. It doesn&rsquo;t have to.
        </h2>
        <p className="mx-auto mb-[13px] max-w-[680px] text-[clamp(15px,1.8vw,18px)] leading-[1.65] text-[#AEBFCE]">
          Australian university teaching is world-class — and almost entirely
          siloed. Every institution solves the same problems behind its own
          walls, while the work that holds learning together carries less
          weight than research and is the first thing cut when budgets
          tighten.
        </p>
        <p className="mx-auto mb-[30px] max-w-[680px] text-[clamp(15px,1.8vw,18px)] leading-[1.65] text-[#CBD8E6]">
          <b className="text-white">NTLSN is the affordable response</b> — a
          free, open commons that connects the fringes: one place to find,
          share and recognise teaching across all {universityCount}{" "}
          universities. Built in the open, owned by no one, sustainable by
          design.
        </p>
        <ul className="mx-auto grid max-w-[780px] list-none grid-cols-1 gap-[13px] text-left sm:grid-cols-3">
          {WHY_CARDS.map(([head, body]) => (
            <li
              key={head}
              className="rounded-[13px] border border-white/[0.09] bg-[#0f1f3a] px-[17px] py-4 [border-top:2px_solid_#4ECDC4]"
            >
              <h3 className="mb-[5px] text-sm font-extrabold text-white">
                {head}
              </h3>
              <p className="text-[12.5px] leading-[1.55] text-[#9FB0C3]">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
