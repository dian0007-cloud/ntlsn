import {
  formatDateRange,
  typeMeta,
  yearViewMonths,
  type YearViewMonth,
} from "../lib/events";

/** Max compact chips per month before folding into "+N more" (production: 6). */
const CHIP_LIMIT = 6;

/** Legend order lifted from the production legend row. */
const LEGEND_ORDER = [
  "conference",
  "showcase",
  "workshop",
  "symposium",
  "week",
  "webinar",
];

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "2026 at a Glance" / "2026–27 at a Glance" depending on the window span. */
function windowTitle(months: YearViewMonth[]): string {
  const first = months[0].year;
  const last = months[months.length - 1].year;
  if (first === last) return `${first} at a Glance`;
  return `${first}–${String(last).slice(2)} at a Glance`;
}

function MonthBlock({ month }: { month: YearViewMonth }) {
  const shown = month.events.slice(0, CHIP_LIMIT);
  const more = month.events.length - shown.length;
  const headingId = `yearview-m-${month.key}`;
  return (
    <li
      aria-current={month.isCurrent ? "date" : undefined}
      className={`rounded-xl border p-3 ${
        month.isCurrent
          ? "border-teal/30 bg-teal/5"
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <h3
        id={headingId}
        className={`mb-1.5 flex items-baseline gap-2 text-sm font-bold ${
          month.isCurrent ? "text-teal" : "text-white/60"
        }`}
      >
        {month.monthLabel} {month.year}
        {month.isCurrent && (
          <span className="rounded-full border border-teal/40 bg-teal/10 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] text-teal uppercase">
            This month
          </span>
        )}
      </h3>
      {month.events.length > 0 ? (
        <>
          <p className="mb-2 text-2xl font-bold">
            <span className="bg-gradient-to-r from-teal via-[#7C9CFF] to-purple bg-clip-text text-transparent">
              {month.events.length}
            </span>{" "}
            <span className="text-xs font-semibold text-white/40">
              event{month.events.length === 1 ? "" : "s"}
            </span>
          </p>
          <ul className="list-none space-y-1.5" aria-labelledby={headingId}>
            {shown.map((event) => {
              const meta = typeMeta(event.type);
              return (
                <li
                  key={event.id}
                  className="truncate border-l-2 pl-2 text-[11px] leading-snug text-white/60"
                  style={{ borderLeftColor: meta.color }}
                  title={`${event.title} — ${formatDateRange(event)}`}
                >
                  {event.url ? (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal/90 hover:text-teal hover:underline"
                    >
                      {event.title}
                    </a>
                  ) : (
                    event.title
                  )}
                  <span className="sr-only">
                    {" "}
                    ({meta.label}, {formatDateRange(event)})
                  </span>
                </li>
              );
            })}
          </ul>
          {more > 0 && (
            <a
              href="#events"
              className="mt-1.5 inline-block pl-2 text-[10px] font-semibold text-white/40 hover:text-white/70 hover:underline"
            >
              +{more} more in What’s On
            </a>
          )}
        </>
      ) : (
        <p className="text-[11px] leading-snug text-white/30">
          No listed events yet
        </p>
      )}
    </li>
  );
}

/**
 * #yearview — "at a Glance" (TASKS.md 1.2, third ported section).
 *
 * Header treatment is production's: gold "Volume IV" kicker (#C9A962,
 * production-exact — no token), teal "Year View" badge pill, "<year> at a
 * Glance" h2. Month blocks keep production's visual language — month label,
 * big gradient count, up to six truncated event chips with type-coloured
 * left borders and a "+N more" overflow, plus the type legend row below.
 *
 * The body diverges deliberately: production renders only the months that
 * have events (a horizontally scroll-snapped carousel of <button>s, animated
 * by a patch script), sourced from the bundle's stale embedded copy of the
 * data. The rebuild renders a full 12-month grid from the current month
 * onwards, straight from data/events.json via lib/events.ts — every upcoming
 * event lands in exactly one month, empty months say so honestly, and the
 * current month is marked with aria-current="date" plus a visible
 * "This month" pill (never colour alone). Chips with a URL are real links;
 * "+N more" anchors to #events.
 */
export default function YearView() {
  const months = yearViewMonths();
  const total = months.reduce((n, m) => n + m.events.length, 0);
  const typesPresent = new Set(
    months.flatMap((m) => m.events.map((e) => e.type)),
  );
  const legend = [
    ...LEGEND_ORDER.filter((t) => typesPresent.has(t)),
    ...[...typesPresent].filter((t) => !LEGEND_ORDER.includes(t)).sort(),
  ];
  return (
    <section
      id="yearview"
      aria-labelledby="yearview-heading"
      className="relative scroll-mt-20 px-4 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#C9A962] uppercase">
            Volume IV
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Year View
          </p>
          <h2
            id="yearview-heading"
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            {windowTitle(months)}
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            {total} sector events over the next twelve months, month by month.
          </p>
        </div>
        <ol className="grid list-none grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {months.map((month) => (
            <MonthBlock key={month.key} month={month} />
          ))}
        </ol>
        <ul className="mt-6 flex list-none flex-wrap justify-center gap-4">
          {legend.map((type) => {
            const meta = typeMeta(type);
            return (
              <li
                key={type}
                className="flex items-center gap-2 text-sm text-white/50"
              >
                <span
                  aria-hidden="true"
                  className="h-0.5 w-3"
                  style={{ backgroundColor: meta.color }}
                />
                {capitalise(meta.label)}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
