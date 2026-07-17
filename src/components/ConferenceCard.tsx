import type { NtlsnEvent } from "../data";
import { formatDateRange, uniAbbr, uniFor } from "../lib/events";
import FaviconBadge from "./FaviconBadge";

/**
 * One conference tile (TASKS.md 1.2). Visual language is production's
 * #conferences "full calendar" grid card: whole-card link, rounded-xl
 * white/[0.03] tile with teal hover border, 34px organiser favicon badge
 * (FaviconBadge — the clogo patch componentised), coral uppercase organiser
 * abbreviation, status pill, semibold title, "City · dates" meta line.
 *
 * Deliberate divergence from production's hard-coded tiles: the pill shows
 * the dataset's verified state ("Verified"/"Unconfirmed" — text, never colour
 * alone, matching EventCard) rather than submission-deadline copy, because
 * data/events.json does not carry deadlines. Events without a real URL render
 * as a non-link tile with no favicon (production's curated list is all-links).
 */

function CardBody({ event }: { event: NtlsnEvent }) {
  const city = uniFor(event)?.city;
  return (
    <>
      <FaviconBadge url={event.url} />
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="truncate text-[10px] font-bold tracking-wide text-coral uppercase">
          {uniAbbr(event)}
        </span>
        {event.verified ? (
          <span className="shrink-0 rounded-full bg-teal/10 px-2 py-0.5 text-[10px] whitespace-nowrap text-teal">
            Verified
          </span>
        ) : (
          <span
            className="shrink-0 rounded-full bg-amber/10 px-2 py-0.5 text-[10px] whitespace-nowrap text-amber"
            title="Date and link not yet human-verified"
          >
            Unconfirmed
          </span>
        )}
      </div>
      <h3 className="flex-1 text-sm leading-snug font-semibold text-white">
        {event.title}
      </h3>
      <p className="mt-2 text-[11px] text-white/35">
        {city ? `${city} · ` : ""}
        <time dateTime={event.date}>{formatDateRange(event)}</time>
      </p>
    </>
  );
}

const tileClasses =
  "flex h-full w-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4";

export default function ConferenceCard({ event }: { event: NtlsnEvent }) {
  if (event.url) {
    return (
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${tileClasses} transition-colors hover:border-teal/40`}
      >
        <CardBody event={event} />
      </a>
    );
  }
  return (
    <article className={tileClasses}>
      <CardBody event={event} />
    </article>
  );
}
