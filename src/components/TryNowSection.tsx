import { useMemo, useState } from "react";
import { dayNumber, formatCount, SOTL_WORK_COUNT } from "../lib/frontdoor";
import {
  POPULAR_TOOL_URLS,
  TODAY_ITEMS,
  TOOL_CATEGORIES,
  TRYNOW_TOOLS,
  type Tool,
} from "../lib/tools";

/**
 * #ntlsn-trynow — "The toolkit for academics." (Epic 1.2 PR-D), ported from
 * the ntlsn-trynow-script patch with its satellites folded in:
 * - category chips ("Start here" / six categories / "Everything") with
 *   per-tab counts, exactly as production;
 * - ONE search field — the section's own filter absorbs the redundant
 *   ntlsn-toolsearch-script box (the PR-D brief: fold the toolsearch filter
 *   in as component logic), including its "no tools match" empty state;
 * - the "Today in teaching & learning" daily card (ntlsn-todaycard-script),
 *   same deterministic day-serial rotation; the archive-count tip derives
 *   its number from data instead of production's hardcoded "1,431".
 * Tool links stay the production root-relative .html pages — they survive
 * the §1.3 cutover unchanged.
 */

type TabKey = "pop" | `c${number}` | "all";

const toolsByUrl = new Map<string, Tool>(TRYNOW_TOOLS.map((t) => [t.u, t]));

function categoryTools(index: number): Tool[] {
  return TOOL_CATEGORIES[index].urls
    .map((url) => toolsByUrl.get(url))
    .filter((t): t is Tool => t !== undefined);
}

const UNCATEGORISED = TRYNOW_TOOLS.filter(
  (t) => !TOOL_CATEGORIES.some((c) => c.urls.includes(t.u)),
);

export default function TryNowSection() {
  const [tab, setTab] = useState<TabKey>("pop");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const today = useMemo(() => {
    const item = TODAY_ITEMS[dayNumber() % TODAY_ITEMS.length];
    // Derive the archive count (production hardcoded 1,431 in this tip).
    return item.t.startsWith("1,431 sector-funded works")
      ? {
          ...item,
          t: `${formatCount(SOTL_WORK_COUNT)} sector-funded works, all free to search — no login.`,
        }
      : item;
  }, []);

  const searchHits = q
    ? TRYNOW_TOOLS.filter((t) =>
        `${t.n} ${t.d}`.toLowerCase().includes(q),
      )
    : null;

  const tabs: Array<{ key: TabKey; emoji: string; label: string; n: number }> =
    [
      { key: "pop", emoji: "✨", label: "Start here", n: POPULAR_TOOL_URLS.length },
      ...TOOL_CATEGORIES.map((c, i) => ({
        key: `c${i}` as TabKey,
        emoji: c.e,
        label: c.label,
        n: categoryTools(i).length,
      })),
      { key: "all", emoji: "🗂️", label: "Everything", n: TRYNOW_TOOLS.length },
    ];

  return (
    <section
      id="ntlsn-trynow"
      aria-labelledby="ntlsn-trynow-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 pt-10 pb-[30px]"
    >
      <div className="mx-auto mb-[18px] max-w-[760px] text-center">
        <p className="mb-2.5 text-[11px] font-extrabold tracking-[2.5px] text-teal uppercase">
          ● Free tools · no login · use any this minute
        </p>
        <h2
          id="ntlsn-trynow-heading"
          className="mb-[11px] text-[clamp(26px,3.6vw,40px)] leading-[1.15] font-extrabold text-white"
        >
          The toolkit for academics.
        </h2>
        <p className="mb-[18px] text-[clamp(15px,1.8vw,17px)] leading-normal text-[#bca98f]">
          {TRYNOW_TOOLS.length} free tools, no login — pick what you&rsquo;re
          working on, or search. Nothing leaves your browser.
        </p>
        <input
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${TRYNOW_TOOLS.length} tools — try “rubric”, “AI”, “feedback”, “fellowship”…`}
          aria-label={`Search ${TRYNOW_TOOLS.length} free tools`}
          className="w-full max-w-[580px] rounded-xl border border-white/[0.14] bg-[#19130d] px-[18px] py-3.5 text-[15px] text-[#ece5d6] outline-none placeholder:text-white/30 focus:border-teal"
        />
      </div>

      <div
        role="group"
        aria-label="Tool categories"
        className="mx-auto mb-6 flex max-w-[1040px] flex-wrap justify-center gap-[9px]"
      >
        {tabs.map((t) => {
          const active = !q && tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setTab(t.key);
                setQuery("");
              }}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-[999px] border px-[15px] py-2 text-[13px] font-bold whitespace-nowrap transition-colors ${
                active
                  ? "border-teal bg-teal text-[#19130d]"
                  : "border-white/[0.12] bg-white/[0.03] text-[#d9cdb6] hover:border-teal/55 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="text-sm">
                {t.emoji}
              </span>
              <span>{t.label}</span>
              <span className={active ? "opacity-70" : "opacity-50"}>
                {t.n}
              </span>
            </button>
          );
        })}
      </div>

      {/* "Today in teaching & learning" (ntlsn-todaycard satellite). */}
      <div
        className="mx-auto mb-4 max-w-[760px] rounded-[13px] px-[18px] py-3.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(201,169,98,.1), rgba(143, 176, 129,.05))",
          border: "1px solid rgba(201,169,98,.25)",
        }}
      >
        <p className="mb-1.5 text-[10px] font-extrabold tracking-[1.4px] text-[#c9a962] uppercase">
          ◆ Today in teaching &amp; learning
        </p>
        <p
          className={`text-[15px] font-semibold text-white ${today.u ? "mb-2" : ""}`}
        >
          {today.t}
        </p>
        {today.u && (
          <a
            href={today.u}
            className="text-[13px] font-bold text-teal no-underline hover:underline"
          >
            Open {today.c} →
          </a>
        )}
      </div>

      <div className="mx-auto min-h-[120px] max-w-[92rem]">
        {searchHits !== null ? (
          searchHits.length > 0 ? (
            <>
              <p className="mb-3.5 text-center text-[12.5px] font-semibold text-[#97876f]">
                {searchHits.length} tool{searchHits.length === 1 ? "" : "s"}{" "}
                match “{query}”
              </p>
              <ToolGrid tools={searchHits} />
            </>
          ) : (
            <p className="p-[34px] text-center text-[15px] text-[#b3a48c]">
              No tools match “{query}” — try “rubric”, “AI”, “fellowship”…
            </p>
          )
        ) : tab === "all" ? (
          <>
            {TOOL_CATEGORIES.map((c, i) => {
              const tools = categoryTools(i);
              if (tools.length === 0) return null;
              return (
                <div key={c.label}>
                  <h3 className="mt-[26px] mb-3 flex flex-wrap items-center gap-2 text-xs font-extrabold tracking-[1.2px] text-teal uppercase">
                    <span aria-hidden="true" className="text-[15px] opacity-85">
                      {c.e}
                    </span>
                    <span>{c.label}</span>
                    <span className="text-[11.5px] font-semibold tracking-normal normal-case text-[#97876f]">
                      {tools.length}
                    </span>
                  </h3>
                  <ToolGrid tools={tools} />
                </div>
              );
            })}
            {UNCATEGORISED.length > 0 && (
              <div className="mt-[18px]">
                <ToolGrid tools={UNCATEGORISED} />
              </div>
            )}
          </>
        ) : tab === "pop" ? (
          <ToolGrid
            tools={POPULAR_TOOL_URLS.map((u) => toolsByUrl.get(u)).filter(
              (t): t is Tool => t !== undefined,
            )}
          />
        ) : (
          <ToolGrid tools={categoryTools(Number(tab.slice(1)))} />
        )}
      </div>
    </section>
  );
}

function ToolGrid({ tools }: { tools: readonly Tool[] }) {
  return (
    <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[11px]">
      {tools.map((tool) => (
        <li key={tool.u} className="flex">
          <a
            href={tool.u}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex flex-1 flex-col rounded-xl border border-white/[0.08] bg-[#2a2218] px-3.5 py-[13px] no-underline transition-[transform,border-color] duration-150 hover:-translate-y-[3px] hover:border-teal/50"
          >
            {tool.t && (
              <span
                className={`absolute top-3.5 right-3.5 rounded-[5px] px-[7px] py-[3px] text-[9.5px] font-extrabold tracking-[0.5px] uppercase ${
                  tool.t === "New"
                    ? "bg-teal text-navy"
                    : "bg-white/[0.06] text-[#b3a48c]"
                }`}
              >
                {tool.t}
              </span>
            )}
            <span className="mb-[5px] flex items-start gap-[7px] pr-[30px]">
              <span
                aria-hidden="true"
                className="flex-none text-[13.5px] leading-snug opacity-80"
              >
                {tool.i}
              </span>
              <span className="text-[13px] leading-tight font-extrabold text-white">
                {tool.n}
              </span>
            </span>
            <span className="line-clamp-2 flex-1 text-[11.5px] leading-normal text-[#b3a48c]">
              {tool.d}
            </span>
            <span className="mt-2 text-[11px] font-bold text-teal">
              Try it →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
