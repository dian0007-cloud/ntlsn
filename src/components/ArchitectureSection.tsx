import { ARCH_TIERS, ATEC_SSP_PRIORITIES } from "../lib/architecture";

/**
 * #architecture — "Sector Architecture" (Epic 1.2 PR-D), a bundle-rendered
 * section ported from the production DOM: the ATEC feature card (with the
 * Interim SSP priority links) and three tiers of regulator / peak-body /
 * framework cards, every card an external link with a Google-s2 favicon
 * badge exactly as production rendered them. Fully static — no state.
 */
export default function ArchitectureSection() {
  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="relative scroll-mt-20 border-y border-white/[0.04] bg-[#271f16]/70 px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume VI
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Future-Proofing
          </p>
          <h2
            id="architecture-heading"
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            Sector Architecture
          </h2>
          {/* The section's ntlsn-secanim doodle — decorative tier bars. */}
          <div aria-hidden="true" className="mb-2 flex justify-center">
            <svg width="56" height="56" viewBox="0 0 64 64">
              <rect
                className="na-seq"
                x="16"
                y="19"
                width="32"
                height="5"
                rx="2.5"
                fill="#8fb081"
              />
              <rect
                className="na-seq na-seq-d1"
                x="16"
                y="29.5"
                width="32"
                height="5"
                rx="2.5"
                fill="#c9a962"
              />
              <rect
                className="na-seq na-seq-d2"
                x="16"
                y="40"
                width="32"
                height="5"
                rx="2.5"
                fill="#a8737f"
              />
            </svg>
          </div>
          <p className="mx-auto max-w-xl text-white/50">
            The regulators, peak bodies, and frameworks that shape teaching
            &amp; learning — mapped into tiers, so you can find the one
            document that matters most at each level.
          </p>
        </div>

        {/* ATEC feature card */}
        <div className="mb-12 rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/5 to-[#c66c3f]/5 p-6 md:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-sm font-bold text-teal"
            >
              ATEC
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Australian Tertiary Education Commission
              </h3>
              <p className="text-sm text-white/50">
                Statutory from early 2026 · Interim SSP released May 2026
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <h4 className="mb-3 text-sm font-semibold text-[#c9a962]">
              Interim Statement of Strategic Priorities (May 2026)
            </h4>
            <p className="mb-3 text-xs text-white/40">
              The SSP guides foundation mission-based compacts for 2027. Key
              priorities for T&amp;L leaders:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ATEC_SSP_PRIORITIES.map((priority) => (
                <a
                  key={priority.title}
                  href={priority.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-teal/30 hover:bg-white/[0.04]"
                >
                  <p className="mb-1 flex items-center justify-between gap-1 text-[11px] font-medium text-white/70">
                    {priority.title}
                    <span aria-hidden="true" className="text-teal">
                      →
                    </span>
                  </p>
                  <p className="text-[10px] text-white/40">{priority.desc}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.education.gov.au/australian-tertiary-education-commission"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal hover:underline"
            >
              Education.gov.au →
            </a>
            <a
              href="https://www.atec.gov.au/strategy/strategic-priorities-workplan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#c9a962] hover:underline"
            >
              Interim SSP (PDF) →
            </a>
          </div>
        </div>

        <div className="space-y-8">
          {ARCH_TIERS.map((tier) => (
            <div key={tier.title}>
              <h3 className="mb-4 text-lg font-bold text-white">
                {tier.title}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tier.cards.map((card) => (
                  <a
                    key={card.name}
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:scale-[1.02] hover:border-teal/20 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(78,205,196,0.12)]"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-white/90">
                        <img
                          alt=""
                          loading="lazy"
                          className="h-4 w-4 object-contain"
                          src={`https://www.google.com/s2/favicons?domain=${card.domain}&sz=64`}
                        />
                      </div>
                      <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-teal">
                        {card.name}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-white/40">{card.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[10px] text-white/20 italic">
          Architecture informed by: Australian Government. (2024). Australian
          Universities Accord: Final Report. Department of Education.
          Australian Government. (2026). Australian Tertiary Education
          Commission Bill 2025. Parliament of Australia.
        </p>
      </div>
    </section>
  );
}
