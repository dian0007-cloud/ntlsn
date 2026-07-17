import type { RoadmapBlock } from "../lib/roadmap";

/**
 * #ntlsn-coming2027 / #ntlsn-coming2028 — "The road ahead" roadmap bands
 * (Epic 1.2 PR-E). Merged port of ntlsn-comingblocks-script (section +
 * feature-card grid) and the ntlsn-coming2027/2028 header-enrichment
 * scripts. Production's 2027 script live-fetched /data/*.json for its
 * counts; here they derive from the data imports (lib/roadmap.ts), so the
 * numbers can never drift from data/events.json + data/universities.json.
 */
export default function ComingSection({ block }: { block: RoadmapBlock }) {
  const accent = `rgb(${block.colour})`;
  const chipStyles = {
    accent: {
      color: accent,
      background: `rgba(${block.colour},0.12)`,
      border: `1px solid rgba(${block.colour},0.38)`,
    },
    teal: {
      color: "#2DD4BF",
      background: "rgba(45,212,191,0.10)",
      border: "1px solid rgba(45,212,191,0.32)",
    },
    neutral: {
      color: "#CBD8E6",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.12)",
    },
  } as const;

  return (
    <section
      id={block.id}
      aria-labelledby={`${block.id}-heading`}
      className="relative scroll-mt-20 px-6 py-[46px]"
    >
      <div className="mx-auto max-w-[1100px]">
        <p
          className="mb-1.5 text-[11px] font-extrabold tracking-[2px] uppercase"
          style={{ color: accent }}
        >
          {block.eyebrow}
        </p>
        <h2
          id={`${block.id}-heading`}
          className="mb-2 text-[clamp(21px,3vw,29px)] leading-[1.2] font-extrabold tracking-[-0.01em] text-[#E8EEF5]"
        >
          {block.heading}
        </h2>
        <p className="mb-3.5 max-w-[720px] text-[13.5px] leading-relaxed text-[#9FB0C3]">
          {block.lede}
          {block.ledeBold ? (
            <>
              <b className="text-[#CBD8E6]">{block.ledeBold}</b>
              {block.ledeRest}
            </>
          ) : null}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {block.chips.map((chip) => (
            <span
              key={chip.text}
              className="rounded-full px-[11px] py-[5px] text-[11.5px] font-bold"
              style={chipStyles[chip.tone]}
            >
              {chip.text}
            </span>
          ))}
        </div>
        <ul className="grid list-none grid-cols-1 gap-[11px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {block.cards.map((card) => (
            <li
              key={card.title}
              className="rounded-xl border border-white/10 bg-[#0f1f3a] px-3.5 py-[13px]"
            >
              <div className="mb-[5px] flex items-start justify-between gap-2">
                <h3 className="text-[13px] leading-[1.3] font-extrabold text-[#E8EEF5]">
                  {card.title}
                </h3>
                <span
                  className="flex-none rounded-full px-[7px] py-0.5 text-[9px] font-extrabold tracking-[0.5px]"
                  style={{
                    color: accent,
                    background: `rgba(${block.colour},0.14)`,
                    border: `1px solid rgba(${block.colour},0.4)`,
                  }}
                >
                  {block.year}
                </span>
              </div>
              <p className="text-xs leading-normal text-[#9FB0C3]">
                {card.desc}
              </p>
              {card.href ? (
                <a
                  href={`/${card.href}`}
                  className="mt-2.5 inline-block text-[11.5px] font-extrabold tracking-[0.2px] text-teal no-underline"
                  aria-label={`Try it now — ${card.title}`}
                >
                  Try it now →
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
