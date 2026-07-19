import EventCard from "./EventCard";
import { upcomingEvents } from "../lib/events";

/**
 * #events — "What's On" (TASKS.md 1.2, first ported section).
 *
 * Header treatment (badge pill, h2, muted subtitle) and the section's
 * navy-tint band (#271f16/70 with hairline borders) are lifted from the
 * production #events section. The body diverges deliberately: production
 * renders a month-calendar widget; the rebuild's first increment is the
 * canonical grid of upcoming event cards, date-ascending, straight from
 * data/events.json (single source of truth — counts are derived, never
 * hardcoded, per CLAUDE.md).
 */
export default function EventsSection() {
  const upcoming = upcomingEvents();
  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="relative scroll-mt-20 border-y border-white/[0.04] bg-[#271f16]/70 px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Events Calendar
          </p>
          <h2 id="events-heading" className="mb-4 text-3xl font-bold md:text-4xl">
            What’s On
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            {upcoming.length} sector events across conferences, showcases,
            workshops, webinars, symposia, and L&amp;T weeks.
          </p>
        </div>
        <ul className="grid list-none gap-3 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((event) => (
            <li key={event.id} className="flex">
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
