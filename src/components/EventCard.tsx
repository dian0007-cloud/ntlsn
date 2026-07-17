import type { NtlsnEvent } from "../data";
import {
  formatDateRange,
  googleCalendarUrl,
  icsDataUri,
  typeMeta,
  uniName,
} from "../lib/events";

/**
 * One event card (TASKS.md 1.2). Visual language is production's #events
 * day-detail card: white/[0.02] rounded-xl card, per-type colour dot, 9px
 * type pill at 12.5% tint, teal Verified pill, teal "Details →" link.
 *
 * The per-event "Add to calendar" pills fold the ntlsn-addcal patch script
 * into the component (Google deep-link + client-side .ics data-URI — see
 * lib/events.ts). A11y: the card is an <article> headed by an <h3>; both
 * calendar links carry the event title in their accessible names; verified
 * state is conveyed by text ("Verified" / "Unconfirmed"), never colour alone.
 */
export default function EventCard({ event }: { event: NtlsnEvent }) {
  const meta = typeMeta(event.type);
  return (
    <article
      aria-label={event.title}
      className="group flex w-full gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]"
    >
      <span
        aria-hidden="true"
        className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="text-sm leading-tight font-semibold text-white">
            {event.title}
          </h3>
          <span
            className="inline-flex shrink-0 items-center rounded-md px-2.5 py-0.5 text-[9px] font-semibold"
            style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
          >
            {meta.label}
          </span>
          {event.verified ? (
            <span className="inline-flex shrink-0 items-center rounded-md bg-teal/10 px-2.5 py-0.5 text-[9px] font-semibold text-teal">
              Verified
            </span>
          ) : (
            <span
              className="inline-flex shrink-0 items-center rounded-md bg-amber/10 px-2.5 py-0.5 text-[9px] font-semibold text-amber"
              title="Date and link not yet human-verified"
            >
              Unconfirmed
            </span>
          )}
        </div>
        <p className="text-xs text-white/40">
          {uniName(event)} — {event.desc}
        </p>
        <p className="mt-1 text-[11px] font-medium text-white/50">
          <time dateTime={event.date}>{formatDateRange(event)}</time>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal hover:underline"
              aria-label={`Details: ${event.title}`}
            >
              Details →
            </a>
          )}
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-white/25">Add to calendar:</span>
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-[7px] border border-teal/30 bg-teal/10 px-2 py-1 text-xs font-semibold text-teal transition-colors hover:bg-teal/20"
              aria-label={`Add to Google Calendar: ${event.title}`}
              title={`Add ${event.title} to Google Calendar`}
            >
              <span aria-hidden="true">📅</span> Add to Google
            </a>
            <a
              href={icsDataUri(event)}
              download={`ntlsn-${event.id}.ics`}
              className="inline-flex items-center gap-1 rounded-[7px] border border-teal/30 bg-teal/10 px-2 py-1 text-xs font-semibold text-teal transition-colors hover:bg-teal/20"
              aria-label={`Download .ics calendar file: ${event.title}`}
              title="Download .ics for Apple Calendar or Outlook"
            >
              <span aria-hidden="true">⤓</span> .ics
            </a>
          </span>
        </div>
      </div>
    </article>
  );
}
