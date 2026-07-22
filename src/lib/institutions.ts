/**
 * Institution helpers for the Directory + Map sections (TASKS.md 1.2).
 *
 * Network-group colours and long names are production's exact values (read
 * from the live #map filter pills and legend: Go8 rgb(201, 169, 98), ATN
 * rgb(217, 102, 80), IRU rgb(168, 115, 127), RUN rgb(143, 176, 129), Unaligned
 * rgb(143, 176, 129) shown as "Independent"). State pill order is the live
 * #directory filter row.
 */
import { events, universities, type NtlsnEvent, type University } from "../data";

export interface GroupMeta {
  color: string;
  /** Long name, as used by the map's filter pills and legend. */
  label: string;
}

export const GROUP_ORDER = ["Go8", "ATN", "IRU", "RUN", "Unaligned"] as const;

const GROUP_META: Record<string, GroupMeta> = {
  Go8: { color: "#c9a962", label: "Group of Eight" },
  ATN: { color: "#d96650", label: "Australian Technology Network" },
  IRU: { color: "#a8737f", label: "Innovative Research Universities" },
  RUN: { color: "#8fb081", label: "Regional Universities Network" },
  Unaligned: { color: "#8fb081", label: "Independent" },
};

export function groupMeta(group: string): GroupMeta {
  return GROUP_META[group] ?? { color: "#a0907a", label: group };
}

/** State filter order — lifted from the production #directory pill row. */
export const STATE_ORDER = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
] as const;

/**
 * Canonical events for one institution: `event.uni` in data/events.json is
 * the university `id` (sector-wide events use "national" and belong to no
 * single institution). Date-ascending.
 */
export function eventsForUni(uni: University): NtlsnEvent[] {
  return events
    .filter((e) => e.uni === uni.id)
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title),
    );
}

/** Case-insensitive directory search over the canonical institution fields. */
export function searchUniversities(query: string): University[] {
  const q = query.trim().toLowerCase();
  if (!q) return universities;
  return universities.filter((u) =>
    [u.name, u.abbr, u.city, u.state, u.traditionalCountry].some((field) =>
      field.toLowerCase().includes(q),
    ),
  );
}
