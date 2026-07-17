import {
  daysUntil,
  dueSoonEvents,
  formatDateRange,
  typeMeta,
  uniAbbr,
} from "../lib/events";

/** "in 3d" pill colour: coral when imminent, amber inside the window. */
function urgency(days: number): string {
  if (days <= 7) return "text-coral";
  if (days <= 21) return "text-amber";
  return "text-teal";
}

function daysLabel(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "in 1d";
  return `in ${days}d`;
}

/**
 * Due Soon rail (TASKS.md 1.2) — the compact band the ntlsn-order patch
 * slots between #ntlsn-zoom and #ntlsn-archive (matched via /^Due Soon/).
 * Shows the next 5 events starting within 21 days, straight from
 * data/events.json. Visual language is production's ticker band (coral →
 * purple → teal gradient wash, pulsing coral dot, uppercase tracked label,
 * "Nd left"-style urgency pill) — but rendered as a static, fully visible
 * rail rather than a rotating one-at-a-time ticker, so it needs no timers
 * and every deadline is keyboard-reachable (WCAG 2.2: no auto-updating
 * content to pause).
 *
 * Renders nothing when no event starts within the window.
 */
export default function DueSoon() {
  const items = dueSoonEvents(5, 21);
  if (items.length === 0) return null;
  return (
    <section
      id="due-soon"
      aria-labelledby="due-soon-heading"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/[0.06] bg-gradient-to-r from-coral/10 via-purple/10 to-teal/10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4">
        <h2
          id="due-soon-heading"
          className="flex shrink-0 items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-coral uppercase"
        >
          <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
          </span>
          Due Soon
        </h2>
        <ul className="flex min-w-0 flex-1 list-none flex-col gap-x-6 gap-y-1.5 md:flex-row md:flex-wrap md:items-center">
          {items.map((event) => {
            const meta = typeMeta(event.type);
            const days = daysUntil(event);
            return (
              <li key={event.id} className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                {event.url ? (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium text-white/80 hover:text-white hover:underline"
                    title={`${event.title} — ${formatDateRange(event)}`}
                  >
                    {event.title}
                  </a>
                ) : (
                  <span
                    className="truncate text-sm font-medium text-white/80"
                    title={`${event.title} — ${formatDateRange(event)}`}
                  >
                    {event.title}
                  </span>
                )}
                <span className="hidden shrink-0 text-xs text-white/30 sm:inline">
                  {uniAbbr(event)}
                </span>
                <span
                  className={`shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold ${urgency(days)}`}
                >
                  {daysLabel(days)}
                </span>
              </li>
            );
          })}
        </ul>
        <a
          href="#events"
          className="shrink-0 text-[10px] font-semibold tracking-wider text-white/40 uppercase transition-colors hover:text-white/70"
        >
          All dates →
        </a>
      </div>
    </section>
  );
}
