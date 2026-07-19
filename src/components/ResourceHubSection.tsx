import { useState } from "react";
import {
  accessColor,
  filterCollections,
  HUB_ACCESS_FILTERS,
  type HubCollection,
  type HubResource,
  type ResourceAccess,
} from "../lib/resourceHub";
import SearchField from "./SearchField";
import ViewAllToggle from "./ViewAllToggle";

/** How many collection cards production shows before "View all N". */
const COLLAPSED_COUNT = 6;

/**
 * Cross-links into the site's own standalone tool pages. Production injects
 * these via the ntlsn-crosslink patch script (heuristic, budgeted); the one
 * that lands in this section today is baked in deterministically. The patch
 * skips any block that already contains an <a>, so no double-injection.
 */
const COLLECTION_TOOL_LINKS: Record<string, { href: string; label: string }> = {
  "poster-design": { href: "/rubric.html", label: "Build a rubric" },
};

/**
 * #resources — "SoTL Resource Hub" (TASKS.md 1.2, fifth ported increment).
 *
 * Header (gold "Volume VII" kicker, teal "SoTL Resource Hub" badge pill),
 * search, access-filter pills + "⭐ Essential only" toggle, the 12 collection
 * cards, the "View all N collections" fold, the inline collection panel with
 * its 162 resource rows (star, access badge, Verified badge, why-it-matters
 * line, tag chips) and the verification footnote are all production's
 * arrangement, driven by lib/resourceHub.ts. The header count line is
 * derived from the filtered data, exactly as production computes it.
 *
 * Deliberate divergences: collection cards are a real <ul> with
 * aria-expanded buttons controlling the panel; the tool cross-link sits on
 * its own line inside the card (production's patch appends an <a> inside a
 * <button> — invalid HTML we won't reproduce); the Visit link is labelled
 * with the resource title (production labels it with the collection title);
 * and the ntlsn-secstats hero-stat strip patch is not reproduced
 * (cross-cutting patch layer, out of scope for a section port).
 */
export default function ResourceHubSection() {
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<"All" | ResourceAccess>("All");
  const [essentialOnly, setEssentialOnly] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const collections = filterCollections(query, access, essentialOnly);
  const resourceTotal = collections.reduce(
    (n, c) => n + c.resources.length,
    0,
  );
  const visible = expanded ? collections : collections.slice(0, COLLAPSED_COUNT);
  const open = openId
    ? collections.find((c) => c.id === openId) ?? null
    : null;

  return (
    <section
      id="resources"
      aria-labelledby="resources-heading"
      className="relative scroll-mt-20 border-t border-white/[0.03] px-4 py-24"
    >
      <div id="reveal-resources" className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume VII
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            SoTL Resource Hub
          </p>
          <h2
            id="resources-heading"
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            SoTL Resource Hub
          </h2>
          <p className="mx-auto max-w-2xl text-white/50">
            {resourceTotal} resources across {collections.length} collections.
            What are you looking for? Foundational frameworks, journals,
            dissemination tools, and sector infrastructure — curated for
            academic developers.
          </p>
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search resources — try “rubrics”"
          label="Search resources"
        />

        <div
          role="group"
          aria-label="Filter by access level"
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {HUB_ACCESS_FILTERS.map((a) => {
            const active = access === a;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={active}
                onClick={() => setAccess(a)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                  active
                    ? "border-teal/30 bg-teal/10 text-teal"
                    : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {a === "All"
                  ? "All Access"
                  : a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={essentialOnly}
            onClick={() => setEssentialOnly(!essentialOnly)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-all ${
              essentialOnly
                ? "border-[#c9a962]/30 bg-[#c9a962]/10 text-[#c9a962]"
                : "border-white/10 text-white/40 hover:text-white/70"
            }`}
          >
            ⭐ Essential only
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          {resourceTotal} resources in {collections.length} collections shown
        </p>

        <ul className="mb-8 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              open={openId === c.id}
              onToggle={() => setOpenId(openId === c.id ? null : c.id)}
            />
          ))}
        </ul>

        {collections.length > COLLAPSED_COUNT && (
          <ViewAllToggle
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            viewAllLabel={`View all ${collections.length} collections`}
            className="mb-8"
          />
        )}

        {open && (
          <CollectionPanel
            collection={open}
            onClose={() => setOpenId(null)}
          />
        )}

        <p className="mt-4 text-[10px] text-white/20 italic">
          Resources marked with a star (⭐) are considered essential.
          Verification status: resources marked &ldquo;Verified&rdquo; were
          confirmed live April 2026. Others are authoritatively known to exist
          but URLs should be re-checked before citation. Compiled by Dr Seb
          Dianati with sector-expert synthesis · experience design with thanks
          to Dr Kashmira Davé.
        </p>
      </div>
    </section>
  );
}

/** One collection tile — production's card, as an aria-expanded toggle. */
function CollectionCard({
  collection: c,
  open,
  onToggle,
}: {
  collection: HubCollection;
  open: boolean;
  onToggle: () => void;
}) {
  const toolLink = COLLECTION_TOOL_LINKS[c.id];
  return (
    <li
      className={`rounded-xl border transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(78,205,196,0.1)] ${
        open
          ? "border-teal/30 bg-teal/5"
          : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="resources-collection-panel"
        onClick={onToggle}
        className="w-full p-5 text-left"
      >
        <span className="mb-3 flex items-start justify-between">
          <span aria-hidden="true" className="text-2xl">
            {c.icon}
          </span>
          <span className="inline-flex items-center rounded-md border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/30">
            {c.resources.length} resources
          </span>
        </span>
        <span className="mb-2 block font-semibold text-white">{c.title}</span>
        <span className="block text-sm text-white/40">{c.cardFace}</span>
        <span className="mt-3 flex flex-wrap gap-1.5">
          {c.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border border-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-white/20"
            >
              {tag}
            </span>
          ))}
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

/** The inline collection detail panel with its resource rows. */
function CollectionPanel({
  collection: c,
  onClose,
}: {
  collection: HubCollection;
  onClose: () => void;
}) {
  return (
    <div
      id="resources-collection-panel"
      className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-3xl">
            {c.icon}
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">{c.title}</h3>
            <p className="text-sm text-white/40">
              {c.resources.length} resources
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${c.title}`}
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
        {c.resources.map((r) => (
          <ResourceRow key={r.id} resource={r} />
        ))}
      </ul>
    </div>
  );
}

/** One resource row inside the collection panel. */
function ResourceRow({ resource: r }: { resource: HubResource }) {
  const tint = accessColor(r.access);
  return (
    <li className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-teal/30 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(78,205,196,0.1)]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-sm font-semibold text-white transition-colors group-hover:text-teal hover:underline"
        >
          {r.title}
        </a>
        <div className="flex shrink-0 items-center gap-2">
          {r.essential && (
            <span className="text-[10px] text-[#c9a962]">
              <span aria-hidden="true">⭐</span>
              <span className="sr-only">Essential</span>
            </span>
          )}
          <span
            className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${tint}1A`, color: tint }}
          >
            {r.access}
          </span>
          {r.verified === "2026-04" && (
            <span className="inline-flex items-center rounded-md bg-teal/10 px-2.5 py-0.5 text-[10px] font-semibold text-teal">
              Verified
            </span>
          )}
        </div>
      </div>
      <p className="mb-1 text-xs text-white/40">{r.description}</p>
      <p className="mb-2 text-xs text-white/30 italic">{r.whyItMatters}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {r.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border border-white/5 px-2.5 py-0.5 text-[8px] font-semibold text-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit: ${r.title}`}
          className="shrink-0 text-xs text-teal hover:underline"
        >
          Visit →
        </a>
      </div>
    </li>
  );
}
