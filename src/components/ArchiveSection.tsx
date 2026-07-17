import { useRef, useState } from "react";
import { loadLtr, searchLtr, type LtrRecord } from "../lib/ltrSearch";
import LtrResultCard from "./LtrResultCard";

/** The patch caps matching at 400 and rendering at 30. */
const MATCH_CAP = 400;
const RENDER_CAP = 30;

/**
 * #ntlsn-archive — "The Sector Archive" (Epic 1.2 PR-C), ported from the
 * ntlsn-archive-script patch: the rescued Learning & Teaching Repository
 * index. Type-to-search over data/ltr.json — lazily fetched on first
 * focus/input, never bundled (§1.3 JS budget), fail-soft like the patch.
 * The resource count derives from the dataset at build time
 * (__NTLSN_SOTL_WORKS__, already wired in vite.config.ts) instead of the
 * patch's hardcoded "1,431".
 */
export default function ArchiveSection() {
  const workCount = __NTLSN_SOTL_WORKS__.toLocaleString("en-AU");
  const idleMeta = `${workCount} resources · 1994–2025 · type to search`;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LtrRecord[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function runSearch(value: string) {
    loadLtr("/data/ltr.json", (records) => {
      setResults(searchLtr(records, value, { limit: MATCH_CAP }));
    });
  }

  const showingResults = query.trim() !== "" && results !== null;

  return (
    <section
      id="ntlsn-archive"
      aria-labelledby="ntlsn-archive-heading"
      className="relative scroll-mt-20 px-4 py-16"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="mb-2.5 text-center text-[13px] font-bold tracking-[2px] text-amber uppercase">
          ◎ The rescued national repository
        </p>
        <h2
          id="ntlsn-archive-heading"
          className="mb-1.5 text-center text-[clamp(19px,2.4vw,26px)] leading-tight font-extrabold text-white"
        >
          The Sector Archive
        </h2>
        <p className="mb-0 text-center text-[14.5px] leading-normal font-semibold text-[#9FB3C8]">
          Three decades of sector-funded work — resurfaced from the vault.
          <br />
          31 years · {workCount} resources · ALTC &amp; OLT-funded · all
          resurfaced.
        </p>
        <p className="mt-0.5 mb-4 text-center text-[13.5px] font-semibold text-[#9FB3C8]">
          Search your discipline, say nursing, law, engineering or education,
          to see what the sector has already funded and built for it.
        </p>

        {/* The spinning "why reinvent the wheel" wheel — decorative. */}
        <div className="my-1 mb-5 flex flex-col items-center gap-2">
          <svg
            width="86"
            height="86"
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="archive-wheel"
          >
            <defs>
              <linearGradient id="ntlswheel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#4ECDC4" />
                <stop offset=".5" stopColor="#7C9CFF" />
                <stop offset="1" stopColor="#C9A962" />
              </linearGradient>
            </defs>
            <g>
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke="url(#ntlswheel)"
                strokeWidth="5"
              />
              <line
                x1="7"
                y1="50"
                x2="93"
                y2="50"
                stroke="url(#ntlswheel)"
                strokeWidth="3"
                opacity="0.6"
              />
              <line
                x1="50"
                y1="7"
                x2="50"
                y2="93"
                stroke="url(#ntlswheel)"
                strokeWidth="3"
                opacity="0.6"
              />
              <line
                x1="19.6"
                y1="19.6"
                x2="80.4"
                y2="80.4"
                stroke="url(#ntlswheel)"
                strokeWidth="3"
                opacity="0.6"
              />
              <line
                x1="80.4"
                y1="19.6"
                x2="19.6"
                y2="80.4"
                stroke="url(#ntlswheel)"
                strokeWidth="3"
                opacity="0.6"
              />
              <circle cx="50" cy="50" r="8" fill="url(#ntlswheel)" />
            </g>
          </svg>
          <p className="text-[13px] font-semibold text-[#8AA0B6]">
            Why reinvent the wheel? The sector already built it.
          </p>
        </div>

        <p className="mx-auto mb-2 max-w-[680px] text-center text-[17px] leading-relaxed text-[#9FB3C8]">
          Every ALTC and OLT grant, every JUTLP paper, every fellowship
          project — buried in a repository no one could find. Now searchable,
          and live.{" "}
          <b className="text-[#CFE9E5]">
            {workCount} resources, 1994–2025, indexed here.
          </b>
        </p>
        <p className="mx-auto mb-[30px] max-w-[620px] text-center text-[13px] leading-relaxed text-[#8AA0B6]">
          Source:{" "}
          <a
            href="https://ltr.edu.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9FB3C8] underline"
          >
            Learning &amp; Teaching Repository
          </a>
          , Australian Government Department of Education (CC). NTLSN indexes
          titles &amp; authors only — every result links to the full text at
          the Repository.
        </p>

        <div className="mx-auto max-w-[760px]">
          <input
            type="text"
            value={query}
            autoComplete="off"
            aria-label="Search archived resources"
            placeholder={`Search ${workCount} archived resources… try “peer review”, “first year”, “feedback”, “assessment”`}
            onFocus={() => loadLtr("/data/ltr.json", () => {})}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => runSearch(value), 200);
            }}
            className="w-full rounded-xl border border-white/[0.14] bg-navy px-4 py-3.5 text-[17px] text-white outline-none placeholder:text-white/30 focus:border-teal/50"
          />
          <p
            aria-live="polite"
            className="mx-0.5 my-2.5 text-[13px] leading-snug font-semibold text-[#8AA0B6]"
          >
            {showingResults
              ? `${results.length}${results.length >= MATCH_CAP ? "+" : ""} result(s) for “${query}”`
              : idleMeta}
          </p>
          <ul className="list-none">
            {showingResults &&
              results.slice(0, RENDER_CAP).map((record) => (
                <LtrResultCard
                  key={record.u + record.t}
                  record={record}
                  accent="#FFB448"
                  borderClass="border-amber/[0.16]"
                />
              ))}
          </ul>
          {showingResults && results.length > RENDER_CAP && (
            <p className="p-2 text-center text-[13px] text-[#8AA0B6]">
              Showing {RENDER_CAP} of {results.length} — refine your search
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
