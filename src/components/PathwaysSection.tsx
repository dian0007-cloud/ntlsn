import { useState } from "react";
import {
  PATHWAY_MODULE_COUNT,
  PATHWAY_RESOURCE_COUNT,
  PATHWAYS,
  type Pathway,
  type PathwayModule,
  type ResourceType,
} from "../lib/pathways";

/**
 * #pathways — "Guided Learning Pathways" (Epic 1.2 PR-D), a bundle-rendered
 * interactive section ported from the bundle source: pick one of five
 * career-stage pathways, expand its modules, open the curated resources.
 * Search filters the selected pathway's modules by title/description/
 * resource text — the bundle's exact rule. Counts in the header derive from
 * the dataset (126 resources / 5 pathways / 19 modules at extraction).
 *
 * A11y beyond the bundle: pathway tabs and module toggles are real buttons
 * with aria-pressed/aria-expanded; resource type is text, not colour alone.
 */

const TYPE_META: Record<
  ResourceType,
  { emoji: string; badgeClass: string; statColour: string; statLabel: string }
> = {
  read: {
    emoji: "📖",
    badgeClass: "bg-emerald-500/10 text-emerald-400",
    statColour: "#4ADE80",
    statLabel: "Readings",
  },
  watch: {
    emoji: "🎬",
    badgeClass: "bg-red-500/10 text-red-400",
    statColour: "#F87171",
    statLabel: "Videos",
  },
  act: {
    emoji: "🎯",
    badgeClass: "bg-amber-500/10 text-amber-400",
    statColour: "#FBBF24",
    statLabel: "Activities",
  },
};

function resourceCount(p: Pathway): number {
  return p.modules.reduce((sum, m) => sum + m.resources.length, 0);
}

export default function PathwaysSection() {
  const [selectedId, setSelectedId] = useState(PATHWAYS[0].id);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const pathway = PATHWAYS.find((p) => p.id === selectedId) ?? PATHWAYS[0];
  const q = query.trim().toLowerCase();
  const visibleModules = pathway.modules.filter(
    (m) =>
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.resources.some(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q),
      ),
  );

  return (
    <section
      id="pathways"
      aria-labelledby="pathways-heading"
      className="relative scroll-mt-20 px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume X
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Curated Learning
          </p>
          <h2
            id="pathways-heading"
            className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            Guided Learning Pathways
          </h2>
          {/* ntlsn-secanim doodle — decorative pathway arc. */}
          <div aria-hidden="true" className="mb-2 flex justify-center">
            <svg width="56" height="56" viewBox="0 0 64 64">
              <path
                d="M12,46 Q32,10 52,46"
                fill="none"
                stroke="#8fb081"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="46" r="3.4" fill="#c9a962" />
              <circle cx="52" cy="46" r="3.4" fill="#a8737f" />
            </svg>
          </div>
          <p className="mx-auto max-w-3xl text-lg text-white/50">
            {PATHWAY_RESOURCE_COUNT} curated resources across {PATHWAYS.length}{" "}
            career-stage pathways and {PATHWAY_MODULE_COUNT} modules —
            wherever you are in your career, from sessional survival to
            critical pedagogy, SoTL incubation, marking literacy, and teaching
            quality.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {(Object.keys(TYPE_META) as ResourceType[]).map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 text-xs text-white/40"
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${
                    type === "read"
                      ? "bg-emerald-400/60"
                      : type === "watch"
                        ? "bg-red-400/60"
                        : "bg-amber-400/60"
                  }`}
                />{" "}
                {type === "read" ? "Read" : type === "watch" ? "Watch" : "Act"}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mb-6 max-w-2xl">
          <div className="relative flex items-center rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-300 focus-within:border-teal/50 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-teal/10 hover:border-white/20">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-5 h-5 w-5 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pathways and modules..."
              aria-label="Search pathways and modules"
              className="w-full rounded-2xl bg-transparent py-4 pr-14 pl-14 text-lg text-white outline-none placeholder:text-white/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-5 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm text-white/50 transition-colors hover:bg-white/20 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PATHWAYS.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedId(p.id);
                  setOpenModule(null);
                }}
                className={`group relative rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-white/20 bg-white/[0.06] shadow-lg"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <div aria-hidden="true" className="mb-2 text-2xl">
                  {p.icon}
                </div>
                <h3 className="mb-1 text-sm leading-snug font-bold text-white/90">
                  {p.title.length > 35 ? `${p.title.slice(0, 35)}…` : p.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-white/30">
                  {p.target}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px]"
                    style={{
                      backgroundColor: `${p.colour}20`,
                      color: p.colour,
                    }}
                  >
                    {p.modules.length} modules
                  </span>
                  <span className="text-[10px] text-white/20">
                    {resourceCount(p)} items
                  </span>
                </div>
                {active && (
                  <div
                    aria-hidden="true"
                    className="absolute right-4 bottom-0 left-4 h-0.5 rounded-full"
                    style={{ backgroundColor: p.colour }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div>
          <div
            className="mb-8 rounded-xl border border-white/10 p-6"
            style={{
              background: `linear-gradient(135deg, ${pathway.colour}08, transparent)`,
            }}
          >
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="text-4xl">
                {pathway.icon}
              </span>
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-bold">{pathway.title}</h3>
                <p
                  className="mb-3 text-sm font-medium"
                  style={{ color: `${pathway.colour}AA` }}
                >
                  {pathway.subtitle}
                </p>
                <p className="text-sm leading-relaxed text-white/50">
                  {pathway.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center rounded-md border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold"
                style={{ color: pathway.colour }}
              >
                {pathway.modules.length} modules
              </span>
              <span className="inline-flex items-center rounded-md border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/40">
                {resourceCount(pathway)} resources
              </span>
              <span aria-hidden="true" className="text-[10px] text-white/20">
                |
              </span>
              <span className="text-[10px] text-white/30">
                For: {pathway.target}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {visibleModules.map((m) => (
              <ModuleFold
                key={m.id}
                module={m}
                open={openModule === m.id}
                onToggle={() =>
                  setOpenModule(openModule === m.id ? null : m.id)
                }
              />
            ))}
            {visibleModules.length === 0 && (
              <p className="py-6 text-center text-sm text-white/40">
                No modules match “{query}” in this pathway — try another word
                or another pathway.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {(Object.keys(TYPE_META) as ResourceType[]).map((type) => (
              <div key={type} className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: TYPE_META[type].statColour }}
                >
                  {pathway.modules.reduce(
                    (sum, m) =>
                      sum + m.resources.filter((r) => r.type === type).length,
                    0,
                  )}
                </div>
                <div className="mt-0.5 text-[10px] text-white/30">
                  {TYPE_META[type].statLabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-white/20 italic">
          Guided Learning Pathways curated by Dr Seb Dianati from publicly
          available resources, research literature, and sector frameworks.
          All linked content remains the intellectual property of its
          respective authors and organisations. CC BY-NC-SA 4.0 applies to
          the curation and pathway design only.
        </p>
      </div>
    </section>
  );
}

function ModuleFold({
  module,
  open,
  onToggle,
}: {
  module: PathwayModule;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span aria-hidden="true" className="shrink-0 text-xl">
          {module.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-white/90">
            {module.title}
          </span>
          <span className="block text-[11px] text-white/40">
            {module.description}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
            {module.resources.length} items
          </span>
          <svg
            aria-hidden="true"
            className={`h-4 w-4 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t border-white/5 px-4 pb-4">
          <ul className="mt-4 grid list-none gap-3 md:grid-cols-2 lg:grid-cols-3">
            {module.resources.map((r, i) => {
              const meta = TYPE_META[r.type];
              const badge = (
                <span
                  className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${meta.badgeClass}`}
                >
                  <span aria-hidden="true">{meta.emoji}</span> {r.type}
                </span>
              );
              return (
                <li key={`${module.id}-${i}`}>
                  {r.url.startsWith("http") ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block h-full rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start gap-2.5">
                        {badge}
                        <div className="min-w-0">
                          <p className="mb-1 text-sm leading-snug font-medium text-white/80 transition-colors group-hover:text-teal">
                            {r.title}
                          </p>
                          <p className="mb-1.5 text-[10px] leading-relaxed text-white/30">
                            {r.note}
                          </p>
                          <p className="text-[10px] text-white/20">
                            {r.source}
                          </p>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="h-full rounded-lg border border-white/5 bg-white/[0.02] p-3 opacity-60">
                      <div className="flex items-start gap-2.5">
                        {badge}
                        <div className="min-w-0">
                          <p className="mb-1 text-sm leading-snug font-medium text-white/60">
                            {r.title}
                          </p>
                          <p className="mb-1.5 text-[10px] leading-relaxed text-white/30">
                            {r.note}
                          </p>
                          <p className="text-[10px] text-white/20 italic">
                            {r.source} — Coming soon
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
