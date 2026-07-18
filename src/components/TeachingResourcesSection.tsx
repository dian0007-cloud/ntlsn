import { useState } from "react";
import {
  filterThemes,
  TEACHING_RESOURCES,
  type TeachingTheme,
} from "../lib/teachingResources";
import SearchField from "./SearchField";
import ViewAllToggle from "./ViewAllToggle";

/** How many theme cards production shows before "View all N themes". */
const COLLAPSED_COUNT = 8;

/**
 * Cross-links into the site's own standalone tool pages — the four the
 * ntlsn-crosslink patch lands in this section today, baked in
 * deterministically (the patch skips blocks that already contain an <a>).
 */
const THEME_TOOL_LINKS: Record<string, { href: string; label: string }> = {
  "Curriculum Design": {
    href: "/constructive-alignment.html",
    label: "Map your alignment",
  },
  "Inclusive Practice": {
    href: "/teaching-hubs.html",
    label: "World teaching hubs",
  },
  "Advance HE & Mentoring": {
    href: "/fellowship-mapper.html",
    label: "Map your fellowship category",
  },
  Microcredentials: {
    href: "/recognition-ledger.html",
    label: "Build a portable credential",
  },
};

/**
 * #teaching-resources — "Teaching Resources from Across the Sector"
 * (TASKS.md 1.2, fifth ported increment).
 *
 * Header (gold "Volume VII-B" kicker, teal "University Resources" badge),
 * search, the "N themes · N resources" count line, the 14 theme tiles
 * (biggest first), the "View all N themes" fold, the inline theme panel with
 * its 184 resource links and the empty-search message are all production's
 * arrangement, driven by lib/teachingResources.ts; every count is derived.
 *
 * NOTE: production currently hides this whole section via a patch-CSS rule
 * (`#teaching-resources,#ntlsn-allinone{display:none!important}`, the same
 * hide-list that covers #ntlsn-conference). The DOM behind it is fully
 * rendered, so it is ported per the Epic 1.2e brief and RENDERED here —
 * flagged for Seb's call at cutover: hiding it again is a one-line change in
 * App.tsx.
 *
 * Deliberate divergences: theme cards are a real <ul> with aria-expanded
 * buttons; tool cross-links sit on their own line inside the card (the
 * patch nests an <a> in a <button> — invalid HTML); the fold defaults to 8
 * tiles as the bundle codes it (a runtime patch left production's DOM
 * pre-expanded to all 14).
 */
export default function TeachingResourcesSection() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [openTheme, setOpenTheme] = useState<string | null>(null);

  const themes = filterThemes(query);
  const resourceTotal = themes.reduce((n, t) => n + t.count, 0);
  const visible = expanded ? themes : themes.slice(0, COLLAPSED_COUNT);
  const open = openTheme
    ? themes.find((t) => t.theme === openTheme) ?? null
    : null;

  return (
    <section
      id="teaching-resources"
      aria-labelledby="teaching-resources-heading"
      className="relative scroll-mt-20 border-y border-white/[0.04] bg-[#271f16]/70 px-4 py-24"
    >
      <div id="reveal-teaching" className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume VII-B
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            University Resources
          </p>
          <h2
            id="teaching-resources-heading"
            className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            Teaching Resources from Across the Sector
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-white/50">
            {TEACHING_RESOURCES.length} curated frameworks, toolkits, and
            guides from across the sector — what are you teaching? Pick a
            theme below, from assessment design to open educational practices.
          </p>
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search resources, institutions, themes — try “first-year”"
          label="Search resources, institutions, themes"
          className="mb-10"
        />

        <p aria-live="polite" className="mb-6 text-center text-xs text-white/30">
          {themes.length} theme{themes.length === 1 ? "" : "s"} ·{" "}
          {resourceTotal} resources
          {query ? ` matching “${query}”` : ""}
        </p>

        <ul className="mb-8 grid list-none grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((t) => (
            <ThemeCard
              key={t.theme}
              theme={t}
              open={openTheme === t.theme}
              onToggle={() =>
                setOpenTheme(openTheme === t.theme ? null : t.theme)
              }
            />
          ))}
        </ul>

        {themes.length > COLLAPSED_COUNT && (
          <ViewAllToggle
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            viewAllLabel={`View all ${themes.length} themes`}
            className="mb-8"
          />
        )}

        {open && (
          <ThemePanel theme={open} onClose={() => setOpenTheme(null)} />
        )}

        {themes.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-white/30">No resources match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** One theme tile — production's card, as an aria-expanded toggle. */
function ThemeCard({
  theme: t,
  open,
  onToggle,
}: {
  theme: TeachingTheme;
  open: boolean;
  onToggle: () => void;
}) {
  const toolLink = THEME_TOOL_LINKS[t.theme];
  return (
    <li
      className={`rounded-xl border transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(78,205,196,0.1)] ${
        open
          ? "border-teal/30 bg-teal/5 ring-1 ring-teal/20"
          : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="teaching-theme-panel"
        onClick={onToggle}
        className="w-full p-5 text-left"
      >
        <span className="mb-3 flex items-start justify-between">
          <span aria-hidden="true" className="text-2xl">
            {t.icon}
          </span>
          <span className="inline-flex items-center rounded-md border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/30">
            {t.count}
          </span>
        </span>
        <span className="mb-1.5 block text-sm leading-tight font-semibold text-white">
          {t.theme}
        </span>
        <span className="line-clamp-2 block text-xs leading-relaxed text-white/35">
          {t.description}
        </span>
        <span className="mt-3 flex items-center gap-1 text-xs text-teal/70">
          {open ? "Collapse ↑" : "Explore →"}
        </span>
      </button>
      {toolLink && (
        <a
          href={toolLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-5 mb-4 inline-block border-b border-dashed border-teal/55 text-xs font-bold whitespace-nowrap text-teal"
        >
          {toolLink.label} →
        </a>
      )}
    </li>
  );
}

/** The inline theme detail panel — each resource row is one external link. */
function ThemePanel({
  theme: t,
  onClose,
}: {
  theme: TeachingTheme;
  onClose: () => void;
}) {
  return (
    <div
      id="teaching-theme-panel"
      className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-3xl">
            {t.icon}
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">{t.theme}</h3>
            <p className="text-sm text-white/40">
              {t.count} resource{t.count === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${t.theme}`}
          className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <ul className="list-none space-y-3">
        {t.resources.map((r) => (
          <li key={r.url + r.name}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-teal/30 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(78,205,196,0.1)]"
            >
              <span className="mb-2 flex items-start justify-between gap-3">
                <span className="flex-1 text-sm leading-tight font-semibold text-white/80 transition-colors group-hover:text-teal">
                  {r.name}
                </span>
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </span>
              <span className="mb-1 block text-xs text-teal/60">
                {r.institution}
              </span>
              <span className="line-clamp-2 block text-xs leading-relaxed text-white/40">
                {r.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
