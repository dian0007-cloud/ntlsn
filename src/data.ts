/**
 * Data layer — imports the repo's canonical JSON directly (CLAUDE.md:
 * data/*.json is the single source of truth; the rebuild re-embeds it at
 * build time instead of patching the old bundle). See vite.config.ts for the
 * server.fs.allow note that makes the parent-directory import work in dev.
 */
import eventsJson from "../data/events.json";
import universitiesJson from "../data/universities.json";

export interface NtlsnEvent {
  id: number;
  title: string;
  uni: string;
  date: string;
  endDate?: string;
  type: string;
  desc: string;
  url: string;
  verified: boolean;
}

export interface University {
  id: string;
  name: string;
  abbr: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  group: "Go8" | "ATN" | "IRU" | "RUN" | "Unaligned" | string;
  tlUrl: string;
  traditionalCountry: string;
}

export const events = eventsJson as NtlsnEvent[];
export const universities = universitiesJson as University[];

/** Live counts — derived from data, never hardcoded in copy (CLAUDE.md). */
export const eventCount = events.length;
export const universityCount = universities.length;
export const verifiedEventCount = events.filter((e) => e.verified).length;
