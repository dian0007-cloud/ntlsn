import ConferenceCard from "./ConferenceCard";
import { upcomingConferences } from "../lib/events";

/**
 * #conferences — "SoTL Sector Conferences" (TASKS.md 1.2, second ported
 * section).
 *
 * Header treatment is production's: gold "The Calendar" kicker (#C9A962 —
 * production-exact, no token exists for it), h2 with the teal "Updated
 * weekly" fresh-badge pill (ntlsn-freshbadge patch, componentised, using the
 * teal token), muted subtitle, then the "The full calendar" mini-label above
 * a 2/3/4-column grid of tiles.
 *
 * The body diverges deliberately: production's grid is a curated list
 * hard-coded in the minified bundle (including overseas conferences and
 * submission-deadline pills that exist nowhere in the data layer). The
 * rebuild renders conference-type events from data/events.json — the single
 * source of truth (CLAUDE.md) — via lib/events.ts, so the count is derived,
 * never hardcoded, and the subtitle drops production's "submission deadlines
 * tracked" claim, which the dataset cannot honour.
 */
export default function ConferencesSection() {
  const conferences = upcomingConferences();
  return (
    <section
      id="conferences"
      aria-labelledby="conferences-heading"
      className="relative scroll-mt-20 px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#C9A962] uppercase">
            The Calendar
          </p>
          <h2
            id="conferences-heading"
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            SoTL Sector Conferences
            <span className="ml-3 inline-block rounded-full border border-teal/40 bg-teal/10 px-3 py-1 align-middle text-[11px] font-bold tracking-[0.05em] whitespace-nowrap text-teal uppercase">
              Updated weekly
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            {conferences.length} major teaching &amp; learning conferences
            across Australasia and the world, drawn from the national dataset.
          </p>
        </div>
        <p className="mt-16 mb-5 text-center text-xs font-bold tracking-[0.25em] text-white/30 uppercase">
          The full calendar
        </p>
        <ul className="grid list-none grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {conferences.map((event) => (
            <li key={event.id} className="flex">
              <ConferenceCard event={event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
