import { useEffect, useState } from "react";
import {
  LATEST_TYPE_COLOURS,
  LATEST_TYPE_ICONS,
  cleanSummary,
  fetchLatest,
  whenLabel,
  type LatestItem,
} from "../lib/latestFeed";

/**
 * #ntlsn-latest — "Latest from the Sector" (Epic 1.2 PR-B), ported from the
 * ntlsn-latest-script patch. FAIL-SOFT by contract (CLAUDE.md): the Apps
 * Script feed is rate-limited and slow-cold-start, so this renders NOTHING
 * until (and unless) the fetch succeeds with a non-empty array — no
 * skeleton, no error state, no blocking, exactly like the patch (which only
 * ever created the section after data arrived). Newest first, at most nine
 * cards, at most three per source (lib/latestFeed.ts).
 */
export default function LatestFeed() {
  const [items, setItems] = useState<LatestItem[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetchLatest(controller.signal).then((result) => {
      if (result) setItems(result);
    });
    return () => controller.abort();
  }, []);

  if (!items) return null;

  return (
    <section
      id="ntlsn-latest"
      aria-labelledby="ntlsn-latest-heading"
      className="relative scroll-mt-20 px-4 py-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-[26px] text-center">
          <p className="text-xs font-bold tracking-[0.28em] text-teal uppercase">
            ● Latest from the Sector
          </p>
          <h2
            id="ntlsn-latest-heading"
            className="mt-2.5 mb-2 text-[clamp(1.6rem,3.2vw,2.2rem)] font-extrabold tracking-[-0.02em] text-white"
          >
            Fresh every day, automatically
          </h2>
          <p className="mx-auto max-w-2xl text-base text-white/55">
            New videos, blog posts and notices pulled straight from the
            sector's own channels — updated daily, no logins.
          </p>
        </div>
        <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {items.map((item) => {
            const colour = LATEST_TYPE_COLOURS[item.type] ?? "#8fb081";
            const icon = LATEST_TYPE_ICONS[item.type] ?? "🔗";
            const summary = cleanSummary(item.summary);
            return (
              <li key={item.link}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-4 no-underline transition-all hover:-translate-y-0.5 hover:border-teal/45"
                >
                  <span className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold" style={{ color: colour }}>
                      <span aria-hidden="true">{icon}</span> {item.source}
                    </span>
                    <span className="whitespace-nowrap text-white/40">
                      {whenLabel(item.date)}
                    </span>
                  </span>
                  <span className="text-base leading-[1.35] font-semibold text-white">
                    {item.title}
                  </span>
                  {summary !== "" && (
                    <span className="mt-1.5 text-sm leading-normal text-white/45">
                      {summary.slice(0, 120)}…
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
