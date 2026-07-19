import { useState } from "react";
import { universityCount, type University } from "../data";
import {
  eventsForUni,
  groupMeta,
  searchUniversities,
  STATE_ORDER,
} from "../lib/institutions";
import InstitutionModal from "./InstitutionModal";

/** How many cards production shows before "View all N universities". */
const COLLAPSED_COUNT = 8;

/**
 * #directory — "University Directory" (TASKS.md 1.2, fourth ported section).
 *
 * Header (gold "Volume V" kicker, teal "Directory" badge pill), search field,
 * state filter pills (All + NSW…NT), grid/list view toggle, institution
 * cards and the "View all 43 universities" fold are all production's
 * arrangement. All 43 institutions come from data/universities.json via
 * src/data.ts — canonical data, so every card links to the canonical `tlUrl`
 * (the modal-404 class of bug dies here) and each entry now also shows the
 * abbreviation alongside city/state.
 *
 * Deliberate divergences from production: the section is not wrapped in the
 * ntlsn-cfold collapse or the School-access lock overlay (both are runtime
 * patch layers, not bundle output); search covers the canonical institution
 * fields (name, abbr, city, state, traditional country) rather than the
 * bundle's topic index; cards get a real T&L link alongside the
 * open-details button (production nests everything in one button, leaving
 * tlUrl reachable only via the modal).
 *
 * A11y: results are a real <ul>; each card exposes a button (opens the
 * detail dialog) and an <a> to the T&L page, both keyboard-reachable with
 * accessible names; filter pills carry aria-pressed; the result count is
 * announced via aria-live.
 */
export default function DirectorySection() {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<University | null>(null);

  const filtered = searchUniversities(query).filter(
    (u) => stateFilter === "All" || u.state === stateFilter,
  );
  const isFiltering = query.trim() !== "" || stateFilter !== "All";
  const visible =
    showAll || isFiltering ? filtered : filtered.slice(0, COLLAPSED_COUNT);
  const hidden = filtered.length - visible.length;

  return (
    <section
      id="directory"
      aria-labelledby="directory-heading"
      className="relative scroll-mt-20 border-y border-white/[0.04] bg-[#271f16]/70 px-4 py-24"
    >
      <div id="reveal-directory" className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume V
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Directory
          </p>
          <h2
            id="directory-heading"
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            University Directory
          </h2>
        </div>

        <div className="relative mx-auto mb-6 max-w-2xl">
          <div className="relative flex items-center rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-300 focus-within:border-teal/50 focus-within:bg-white/10 hover:border-white/20">
            <svg
              className="pointer-events-none absolute left-5 h-5 w-5 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities — try “Wurundjeri”"
              aria-label="Search universities"
              className="w-full rounded-2xl bg-transparent py-4 pr-5 pl-14 text-lg text-white outline-none placeholder:text-white/30"
            />
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter by state or territory"
          className="mb-4 flex flex-wrap justify-center gap-2"
        >
          {["All", ...STATE_ORDER].map((state) => {
            const active = stateFilter === state;
            return (
              <button
                key={state}
                type="button"
                aria-pressed={active}
                onClick={() => setStateFilter(state)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                  active
                    ? "border-teal/30 bg-teal/10 text-teal"
                    : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {state}
              </button>
            );
          })}
        </div>

        <div className="mb-8 flex justify-center gap-1">
          <button
            type="button"
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            onClick={() => setView("grid")}
            className={`rounded-lg p-2 ${
              view === "grid"
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            aria-label="List view"
            onClick={() => setView("list")}
            className={`rounded-lg p-2 ${
              view === "list"
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          {filtered.length} of {universityCount} universities shown
        </p>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-white/40">
            No universities match “{query}”
            {stateFilter !== "All" ? ` in ${stateFilter}` : ""}.
          </p>
        ) : view === "grid" ? (
          <ul className="grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((u) => (
              <DirectoryCard key={u.id} uni={u} onOpen={() => setSelected(u)} />
            ))}
          </ul>
        ) : (
          <ul className="mx-auto max-w-3xl list-none space-y-2">
            {visible.map((u) => (
              <DirectoryRow key={u.id} uni={u} onOpen={() => setSelected(u)} />
            ))}
          </ul>
        )}

        {hidden > 0 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/70"
            >
              View all {universityCount} universities
            </button>
          </div>
        )}
      </div>
      {selected && (
        <InstitutionModal uni={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

/** Shared card innards: group badge with production's 12.5%-tint treatment. */
function GroupBadge({ group }: { group: string }) {
  const meta = groupMeta(group);
  return (
    <span
      className="ml-1 inline-flex shrink-0 items-center rounded-md px-2.5 py-0.5 text-[9px] font-semibold"
      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
      title={meta.label}
    >
      {group}
    </span>
  );
}

function eventCountLabel(uni: University): string {
  const n = eventsForUni(uni).length;
  return `${n} event${n === 1 ? "" : "s"}`;
}

function DirectoryCard({
  uni,
  onOpen,
}: {
  uni: University;
  onOpen: () => void;
}) {
  return (
    <li className="group flex flex-col rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all hover:border-white/10 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(78,205,196,0.1)]">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`${uni.name} — details`}
        className="flex-1 text-left"
      >
        <span className="mb-1 flex items-start justify-between">
          <span className="text-sm leading-tight font-semibold text-white transition-colors group-hover:text-teal">
            {uni.name}
          </span>
          <GroupBadge group={uni.group} />
        </span>
        <span className="block text-xs text-white/40">
          {uni.abbr} · {uni.city}, {uni.state}
        </span>
        <span className="mt-1 block text-[10px] text-white/30">
          {eventCountLabel(uni)}
        </span>
      </button>
      <a
        href={uni.tlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-xs text-teal hover:underline"
        aria-label={`Teaching & Learning page: ${uni.name}`}
      >
        T&amp;L page →
      </a>
    </li>
  );
}

function DirectoryRow({
  uni,
  onOpen,
}: {
  uni: University;
  onOpen: () => void;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 transition-all hover:border-white/10 hover:bg-white/[0.05]">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`${uni.name} — details`}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="truncate text-sm font-semibold text-white hover:text-teal">
          {uni.name}
        </span>
        <GroupBadge group={uni.group} />
      </button>
      <span className="text-xs text-white/40">
        {uni.abbr} · {uni.city}, {uni.state}
      </span>
      <span className="text-[10px] text-white/30">{eventCountLabel(uni)}</span>
      <a
        href={uni.tlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-teal hover:underline"
        aria-label={`Teaching & Learning page: ${uni.name}`}
      >
        T&amp;L page →
      </a>
    </li>
  );
}
