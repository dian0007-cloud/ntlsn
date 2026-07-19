import { useId, useRef, useState } from "react";
import {
  HUB_DOORS,
  JOURNEY_DOORS,
  START_CARDS,
  type JourneyDoor,
  type StartCard,
} from "../lib/frontdoor";

/**
 * #ntlsn-startgrid — "Where would you like to start?" (PR-A "Front door"),
 * plus the two nav satellites the brief folds in as component logic:
 *
 * - the ntlsn-journey Events/Resources doors (production injected them into
 *   the hero; here they open the start section so the PR stays scoped to the
 *   four front-door placeholders — divergence noted in the PR),
 * - the #ntlsn-hubdoors "Explore by area" rail, kept as a sibling <nav>
 *   right after the section exactly where production's self-healing script
 *   parked it (between #ntlsn-startgrid and #ntlsn-freshtoday).
 *
 * The card count in the strapline is START_CARDS.length — production's
 * ntlsn-starthere-card satellite rewrote the hardcoded number the same way
 * after inserting the 38th tile.
 *
 * A11y: disclosure doors are real <button aria-expanded aria-controls>,
 * Escape closes and restores focus (as the patch did); every chip and card
 * is a plain <a href> to a real id or .html file. The icon bob animation is
 * neutralised globally under prefers-reduced-motion (styles.css).
 */
export default function StartGrid() {
  return (
    <>
      <section
        id="ntlsn-startgrid"
        aria-labelledby="startgrid-heading"
        className="relative scroll-mt-20 px-6 py-[54px]"
      >
        <div className="mx-auto max-w-[1180px] text-center">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[3px] text-amber">
            Find your way
          </p>
          <h2
            id="startgrid-heading"
            className="mb-2.5 text-[clamp(26px,4vw,40px)] font-extrabold tracking-[-0.01em] text-white"
          >
            Where would you like to start?
          </h2>
          <p className="mx-auto mb-7 max-w-[640px] text-[15.5px] text-white/50">
            {START_CARDS.length} ways into the commons — tap where you want to
            go.
          </p>

          <JourneyDoors />

          <ul
            role="list"
            className="grid list-none grid-cols-1 gap-[13px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {START_CARDS.map((card, i) => (
              <li key={card.title + card.href} className="flex">
                <StartCardTile card={card} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HubDoorRail />
    </>
  );
}

/* ── Grid tiles ──────────────────────────────────────────────────────────── */

function StartCardTile({ card, index }: { card: StartCard; index: number }) {
  return (
    <a
      href={card.href}
      className={`relative flex w-full flex-col items-center gap-[5px] rounded-2xl border bg-white/[0.025] px-3 py-[22px] text-center transition-[transform,border-color,background-color] duration-150 hover:-translate-y-1 hover:scale-[1.02] hover:border-teal/60 hover:bg-teal/[0.08] motion-reduce:transition-none motion-reduce:hover:transform-none ${
        card.featured ? "border-teal/35" : "border-white/[0.08]"
      }`}
    >
      <span
        aria-hidden="true"
        className="mb-[5px] text-[34px] leading-none motion-safe:animate-[sg-bob_3.2s_ease-in-out_infinite]"
        style={{ animationDelay: `${(index % 8) * 0.22}s` }}
      >
        {card.icon}
      </span>
      <span className="text-[15.5px] font-extrabold leading-tight text-white">
        {card.title}
      </span>
      <span className="text-xs leading-[1.35] text-white/45">{card.desc}</span>
    </a>
  );
}

/* ── Journey doors (ntlsn-journey) ───────────────────────────────────────── */

function JourneyDoors() {
  const [open, setOpen] = useState<JourneyDoor["id"] | null>(null);
  const buttonRefs = useRef<Partial<Record<JourneyDoor["id"], HTMLButtonElement>>>({});
  const baseId = useId();

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) {
      buttonRefs.current[open]?.focus();
      setOpen(null);
    }
  }

  const accents: Record<
    JourneyDoor["id"],
    { door: string; doorOpen: string; title: string; chip: string; panel: string }
  > = {
    events: {
      door: "border-teal/55 hover:bg-teal/10 hover:border-teal",
      doorOpen: "bg-teal/10 border-teal",
      title: "text-teal",
      chip: "border-teal/55 text-teal hover:bg-teal/[0.14]",
      panel: "border-teal/[0.32]",
    },
    resources: {
      door: "border-purple/65 hover:bg-purple/10 hover:border-purple",
      doorOpen: "bg-purple/10 border-purple",
      title: "text-purple",
      chip: "border-purple/70 text-purple hover:bg-purple/[0.14]",
      panel: "border-purple/[0.32]",
    },
  };

  return (
    <div className="mx-auto mb-8 max-w-[840px]" onKeyDown={onKeyDown}>
      <div
        role="group"
        aria-label="Choose your path"
        className="flex flex-wrap justify-center gap-3.5"
      >
        {JOURNEY_DOORS.map((door) => {
          const isOpen = open === door.id;
          const a = accents[door.id];
          return (
            <button
              key={door.id}
              type="button"
              ref={(el) => {
                if (el) buttonRefs.current[door.id] = el;
              }}
              aria-expanded={isOpen}
              aria-controls={`${baseId}-panel-${door.id}`}
              onClick={() => setOpen(isOpen ? null : door.id)}
              className={`max-w-[360px] flex-[1_1_250px] cursor-pointer rounded-2xl border-[1.5px] bg-white/[0.03] px-5 pb-4 pt-[18px] text-center transition-colors motion-reduce:transition-none ${a.door} ${isOpen ? a.doorOpen : ""}`}
            >
              <span
                className={`block text-[21px] font-bold leading-tight tracking-[0.2px] ${a.title}`}
              >
                {door.title}{" "}
                <span
                  aria-hidden="true"
                  className={`inline-block align-[2px] text-[13px] transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </span>
              <span className="mt-[5px] block text-[13.5px] text-white/[0.68]">
                {door.sub}
              </span>
            </button>
          );
        })}
      </div>

      {JOURNEY_DOORS.map((door) => {
        const a = accents[door.id];
        return (
          <div
            key={door.id}
            id={`${baseId}-panel-${door.id}`}
            role="region"
            aria-label={`${door.title} — what are you looking for?`}
            hidden={open !== door.id}
            className={`mx-auto mt-3.5 max-w-[700px] rounded-[14px] border bg-white/[0.03] px-4 pb-[18px] pt-4 motion-safe:animate-[journey-in_0.18s_ease-out] ${a.panel}`}
          >
            <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[1.4px] text-white/[0.72]">
              What are you looking for?
            </p>
            <ul role="list" className="flex list-none flex-wrap justify-center gap-2.5">
              {door.chips.map((chip) => (
                <li key={chip.href}>
                  <a
                    href={chip.href}
                    onClick={() => setOpen(null)}
                    className={`inline-block rounded-full border px-4 py-[9px] text-sm font-semibold leading-tight transition-colors motion-reduce:transition-none ${a.chip}`}
                  >
                    {chip.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <p className="mt-4 text-[13.5px] text-white/55">
        …or make it personal —{" "}
        <a
          href="/orcid-start.html"
          className="rounded text-amber underline underline-offset-[3px] hover:text-[#FFC873]"
        >
          start with your ORCID <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  );
}

/* ── Hub-door rail (ntlsn-hubdoors-script) ───────────────────────────────── */

function HubDoorRail() {
  return (
    <nav
      id="ntlsn-hubdoors"
      aria-label="Explore NTLSN by area"
      className="relative mx-auto mb-2 mt-6 max-w-[980px] px-[18px]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3.5 left-[45px] top-10 w-px bg-gradient-to-b from-teal/0 via-teal/[0.28] to-teal/0"
      />
      <p className="mb-2.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-[2px] text-teal">
        Explore by area
      </p>
      {HUB_DOORS.map((door) => (
        <a
          key={door.href}
          href={door.href}
          className="group relative mb-2.5 flex w-full items-center gap-4 rounded-[14px] border border-white/10 bg-[#2a2218]/[0.72] px-[18px] py-[15px] transition-[border-color,background-color,transform] duration-200 hover:translate-x-0.5 hover:border-teal/50 hover:bg-[#2a2218]/95 motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <span
            aria-hidden="true"
            className="z-[1] h-[15px] w-[15px] flex-none rounded-full border-[1.5px] border-teal/60 bg-[#0b1c33] transition-colors group-hover:bg-teal group-hover:shadow-[0_0_12px_rgba(78,205,196,0.55)] motion-reduce:transition-none"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[15.5px] font-extrabold leading-tight tracking-[-0.01em] text-[#ece5d6]">
              {door.title}
            </span>
            <span className="mt-[3px] block text-[12.5px] leading-[1.45] text-[#a0907a]">
              {door.desc}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="flex-none text-base font-bold text-teal transition-transform group-hover:translate-x-[3px] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          >
            →
          </span>
        </a>
      ))}
    </nav>
  );
}
