import { useEffect, useRef } from "react";
import type { University } from "../data";
import { eventsForUni, groupMeta } from "../lib/institutions";
import {
  formatDateRange,
  googleCalendarUrl,
  icsDataUri,
  typeMeta,
} from "../lib/events";

/**
 * Institution detail modal — the production dialog opened from a directory
 * card or a map dot: name + network-group badge, city/state, the
 * traditional-country panel, the canonical Teaching & Learning page link,
 * and the institution's events.
 *
 * The "Located on <traditionalCountry> Country." panel is Acknowledgement
 * data (CLAUDE.md hard rule): it is rendered verbatim from
 * data/universities.json with production's exact respect treatment (gold
 * #c9a962 panel) and must never be dropped, abbreviated or reordered.
 *
 * The T&L link reads `tlUrl` straight from the canonical data — the rebuild
 * is why the stale-embedded-URL class of bug (e.g. ACU's old 404) dies.
 *
 * A11y: native <dialog> via showModal() — real focus containment, Escape to
 * close, focus restored to the opener by the browser; labelled by the
 * institution name; explicit Close button.
 */
export default function InstitutionModal({
  uni,
  onClose,
}: {
  uni: University;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const meta = groupMeta(uni.group);
  const uniEvents = eventsForUni(uni);
  const titleId = `institution-title-${uni.id}`;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Click on the ::backdrop (i.e. the dialog element itself) closes.
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-white/10 bg-[#271f16] p-6 text-white shadow-lg backdrop:bg-black/60"
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          id={titleId}
          className="flex flex-wrap items-center gap-3 text-xl font-bold"
        >
          {uni.name}
          <span
            className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${meta.color}30`, color: meta.color }}
          >
            {uni.group}
          </span>
        </h3>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="shrink-0 rounded-sm p-1 text-white/70 transition-opacity hover:text-white"
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <p className="mt-1 text-sm text-white/50">
        {uni.city}, {uni.state}
      </p>
      <div className="mt-3 rounded-lg border border-[#c9a962]/15 bg-[#c9a962]/5 p-3">
        <p className="text-xs leading-relaxed text-[#c9a962]/70">
          Located on{" "}
          <span className="font-semibold text-[#c9a962]">
            {uni.traditionalCountry}
          </span>{" "}
          Country.
        </p>
      </div>
      <a
        href={uni.tlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-teal hover:underline"
        aria-label={`Teaching & Learning page: ${uni.name}`}
      >
        Teaching &amp; Learning Page →
      </a>
      <div className="mt-4">
        <h4 className="mb-3 text-sm font-semibold text-white/70">
          Events ({uniEvents.length})
        </h4>
        {uniEvents.length > 0 ? (
          <ul className="list-none space-y-2">
            {uniEvents.map((event) => {
              const typeInfo = typeMeta(event.type);
              return (
                <li
                  key={event.id}
                  className="rounded-lg border border-white/5 bg-white/5 p-3"
                >
                  <p className="text-sm font-medium text-white">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    <time dateTime={event.date}>{formatDateRange(event)}</time>
                  </p>
                  <p className="mt-1 text-xs text-white/30">{event.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${typeInfo.color}20`,
                        color: typeInfo.color,
                      }}
                    >
                      {typeInfo.label}
                    </span>
                    {event.verified ? (
                      <span className="inline-flex items-center rounded-md bg-teal/10 px-2.5 py-0.5 text-[10px] font-semibold text-teal">
                        Verified
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center rounded-md bg-amber/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber"
                        title="Date and link not yet human-verified"
                      >
                        Unconfirmed
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal hover:underline"
                        aria-label={`View details: ${event.title}`}
                      >
                        View details →
                      </a>
                    )}
                    <a
                      href={googleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-white/40 transition-colors hover:text-teal"
                      aria-label={`Add to Google Calendar: ${event.title}`}
                    >
                      + Calendar
                    </a>
                    <a
                      href={icsDataUri(event)}
                      download={`ntlsn-${event.id}.ics`}
                      className="text-[10px] text-white/40 transition-colors hover:text-teal"
                      aria-label={`Download .ics calendar file: ${event.title}`}
                    >
                      ⤓ .ics
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xs text-white/40">
            No listed events yet — sector-wide events live in What’s On.
          </p>
        )}
      </div>
    </dialog>
  );
}
