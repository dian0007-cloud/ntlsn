/**
 * Event helpers for the rebuilt Events section + Due Soon rail (TASKS.md 1.2).
 *
 * The calendar-link half of this file is the ntlsn-addcal patch script from
 * the production index.html, folded into the source tree (TASKS.md 1.2:
 * "fold the relevant patch script into the component"): same Google Calendar
 * deep-link shape, same RFC 5545 .ics data-URI (UID ntlsn-<id>@ntlsn.com,
 * all-day DTSTART/DTEND with exclusive end, 73-char line folding, LOCATION
 * from universities.json).
 */
import { events, universities, type NtlsnEvent, type University } from "../data";

/* ── Type metadata ─────────────────────────────────────────────────────────
 * Colours are production's exact per-type dot/pill colours (read from the
 * live #events filter row: conferences rgb(78,205,196), showcases
 * rgb(255,215,0), workshops rgb(255,107,107), webinars rgb(255,159,67),
 * symposia rgb(197,123,255), L&T weeks rgb(124,156,255)). */
export interface TypeMeta {
  color: string;
  label: string;
}

const TYPE_META: Record<string, TypeMeta> = {
  conference: { color: "#4ECDC4", label: "conference" },
  showcase: { color: "#FFD700", label: "showcase" },
  workshop: { color: "#FF6B6B", label: "workshop" },
  webinar: { color: "#FF9F43", label: "webinar" },
  symposium: { color: "#C57BFF", label: "symposium" },
  week: { color: "#7C9CFF", label: "L&T week" },
};

export function typeMeta(type: string): TypeMeta {
  return TYPE_META[type] ?? { color: "#8AA0B6", label: type };
}

/* ── University resolution ──────────────────────────────────────────────── */

const uniById = new Map<string, University>(universities.map((u) => [u.id, u]));

/** Resolve an event's `uni` id to the institution, if it is one of the 43. */
export function uniFor(event: NtlsnEvent): University | undefined {
  return uniById.get(event.uni);
}

/** Display name for the organiser ("national", peak bodies etc. pass through). */
export function uniName(event: NtlsnEvent): string {
  return uniFor(event)?.name ?? event.uni;
}

/** Short label for compact contexts (Due Soon rail). */
export function uniAbbr(event: NtlsnEvent): string {
  return uniFor(event)?.abbr ?? event.uni;
}

/** LOCATION string, exactly as the addcal patch built it. */
function eventLocation(event: NtlsnEvent): string {
  const u = uniFor(event);
  if (!u) return "";
  return u.name + (u.city ? ` — ${u.city}, ${u.state}` : "");
}

/* ── Dates (Australian formatting throughout) ───────────────────────────── */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Parse "YYYY-MM-DD" as a local date (no TZ surprises). */
export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Today at local midnight. */
export function todayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toIso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** "20 Aug 2026" */
export function formatDay(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Australian date range: "20 Aug 2026", "25–27 Aug 2026",
 * "30 Sep – 2 Oct 2026", "30 Dec 2026 – 2 Jan 2027".
 */
export function formatDateRange(event: NtlsnEvent): string {
  const start = parseDay(event.date);
  const end = event.endDate ? parseDay(event.endDate) : start;
  if (start.getTime() === end.getTime()) return formatDay(start);
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    return `${start.getDate()}–${end.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${MONTHS[start.getMonth()]} – ${formatDay(end)}`;
  }
  return `${formatDay(start)} – ${formatDay(end)}`;
}

/* ── Selection ──────────────────────────────────────────────────────────── */

/** Upcoming events (still running today or later), date-ascending. */
export function upcomingEvents(today: Date = todayLocal()): NtlsnEvent[] {
  const iso = toIso(today);
  return events
    .filter((e) => (e.endDate || e.date) >= iso)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.endDate || a.date).localeCompare(b.endDate || b.date) ||
        a.title.localeCompare(b.title),
    );
}

/** Whole days until the event starts (0 = starts today). */
export function daysUntil(event: NtlsnEvent, today: Date = todayLocal()): number {
  return Math.round((parseDay(event.date).getTime() - today.getTime()) / 86400000);
}

/** Due Soon rail: the next `limit` events starting within `windowDays`. */
export function dueSoonEvents(
  limit = 5,
  windowDays = 21,
  today: Date = todayLocal(),
): NtlsnEvent[] {
  return upcomingEvents(today)
    .filter((e) => {
      const d = daysUntil(e, today);
      return d >= 0 && d <= windowDays;
    })
    .slice(0, limit);
}

/* ── Calendar links (ported from the ntlsn-addcal patch script) ─────────── */

/** All-day DTEND is exclusive: the day after the last event day, as YYYYMMDD. */
function plusOneCompact(iso: string): string {
  const t = new Date(iso + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + 1);
  return t.toISOString().slice(0, 10).replace(/-/g, "");
}

/** RFC 5545 TEXT escaping. */
function icsEscape(x: string): string {
  return String(x || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** RFC 5545 line folding at 73 octets-ish, surrogate-pair safe. */
function icsFold(s: string): string {
  let out = "";
  while (s.length > 73) {
    let cut = 73;
    if (/[\uD800-\uDBFF]/.test(s.charAt(cut - 1))) cut--;
    out += s.slice(0, cut) + "\r\n ";
    s = s.slice(cut);
  }
  return out + s;
}

/** Google Calendar deep-link for one event. */
export function googleCalendarUrl(event: NtlsnEvent): string {
  const details = (
    (event.desc || "") + (event.url ? "\n\n" + event.url : "")
  ).slice(0, 900);
  let q =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
    encodeURIComponent(event.title) +
    "&dates=" +
    event.date.replace(/-/g, "") +
    "/" +
    plusOneCompact(event.endDate || event.date) +
    "&details=" +
    encodeURIComponent(details);
  const loc = eventLocation(event);
  if (loc) q += "&location=" + encodeURIComponent(loc);
  return q;
}

/** Single-event .ics as a data: URI (client-side download, no server file). */
export function icsDataUri(event: NtlsnEvent): string {
  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const loc = eventLocation(event);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NTLSN//Sector Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:ntlsn-${event.id}@ntlsn.com`,
    "DTSTAMP:" + stamp,
    "DTSTART;VALUE=DATE:" + event.date.replace(/-/g, ""),
    "DTEND;VALUE=DATE:" + plusOneCompact(event.endDate || event.date),
    icsFold("SUMMARY:" + icsEscape(event.title)),
    icsFold(
      "DESCRIPTION:" +
        icsEscape((event.desc || "") + (event.url ? "\n" + event.url : "")),
    ),
    loc ? icsFold("LOCATION:" + icsEscape(loc)) : "",
    event.url ? icsFold("URL:" + event.url) : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n") + "\r\n";
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines);
}
