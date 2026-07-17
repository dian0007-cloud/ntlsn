import { useRef, useState } from "react";
import { loadLtr, searchLtr, type LtrRecord } from "../lib/ltrSearch";
import LtrResultCard from "./LtrResultCard";

/** The patch renders at most 30 cards per view. */
const RENDER_CAP = 30;

/**
 * #ntlsn-bestpractice — "Best Practice Guides" (Epic 1.2 PR-C), ported from
 * the ntlsn-bestpractice-script patch: the Good Practice Report lens on the
 * Sector Archive. Collapsed behind "Browse the N guides" (production's
 * arrangement); opening it lazily fetches data/ltr-bestpractice.json
 * (never bundled, fail-soft) and shows all guides, searchable. The guide
 * count derives from the dataset at build time (__NTLSN_BP_GUIDES__)
 * instead of the patch's hardcoded "80".
 */
export default function BestPracticeSection() {
  const guideCount = __NTLSN_BP_GUIDES__;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LtrRecord[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function runSearch(value: string) {
    loadLtr("/data/ltr-bestpractice.json", (records) => {
      setResults(searchLtr(records, value, { emptyReturnsAll: true }));
    });
  }

  const searching = query.trim() !== "";

  return (
    <section
      id="ntlsn-bestpractice"
      aria-labelledby="ntlsn-bestpractice-heading"
      className="relative scroll-mt-20 px-4 py-16"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="mb-2.5 text-center text-[13px] font-bold tracking-[2px] text-[#4FD1A5] uppercase">
          ◎ Good Practice Reports, resurfaced
        </p>
        <h2
          id="ntlsn-bestpractice-heading"
          className="mb-1.5 text-center text-[clamp(19px,2.4vw,26px)] leading-tight font-extrabold text-white"
        >
          Best Practice Guides
        </h2>
        <p className="mx-auto mb-3.5 max-w-[600px] text-center text-[15px] leading-normal font-medium text-[#CFE9E5]">
          In plain terms: short, evidence-based guides on how to do one
          teaching thing well, written by the teams the sector funded to work
          it out.
        </p>
        <p className="mx-auto mb-2 max-w-[680px] text-center text-[17px] leading-relaxed text-[#9FB3C8]">
          Good Practice Reports from the teams the sector funded — integrity,
          work-integrated learning, assessment, curriculum, transition and
          more.{" "}
          <b className="text-[#CFE9E5]">
            {guideCount} curated guides, 2006–2024, searchable here.
          </b>
        </p>
        <p className="mx-auto mb-[30px] max-w-[620px] text-center text-[13px] leading-relaxed text-[#8AA0B6]">
          A curated lens on the{" "}
          <a href="#ntlsn-archive" className="text-[#9FB3C8] underline">
            Sector Archive
          </a>{" "}
          — everything tagged <i>“best practice”</i> in the{" "}
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

        <button
          type="button"
          aria-expanded={open}
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next) runSearch(query);
          }}
          className="mx-auto mb-4 block cursor-pointer rounded-[10px] bg-[#4FD1A5] px-5 py-[11px] text-sm font-bold text-navy"
        >
          {open ? "Hide the guides ▴" : `Browse the ${guideCount} guides ▾`}
        </button>

        {open && (
          <div className="mx-auto max-w-[760px]">
            <input
              type="text"
              value={query}
              autoComplete="off"
              aria-label="Search best-practice guides"
              placeholder={`Search ${guideCount} best-practice guides… try “assessment”, “academic integrity”, “work integrated”, “curriculum”`}
              onFocus={() => runSearch(query)}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => runSearch(value), 200);
              }}
              className="w-full rounded-xl border border-white/[0.14] bg-navy px-4 py-3.5 text-[17px] text-white outline-none placeholder:text-white/30 focus:border-[#4FD1A5]/50"
            />
            <p
              aria-live="polite"
              className="mx-0.5 my-2.5 text-[13px] leading-snug font-semibold text-[#8AA0B6]"
            >
              {searching && results !== null
                ? `${results.length} result(s) for “${query}”`
                : `${guideCount} guides · 2006–2024 · ${results === null ? "type to search, or browse below" : "showing all"}`}
            </p>
            <ul className="list-none">
              {(results ?? []).slice(0, RENDER_CAP).map((record) => (
                <LtrResultCard
                  key={record.u + record.t}
                  record={record}
                  accent="#4FD1A5"
                  borderClass="border-[#4FD1A5]/[0.18]"
                />
              ))}
            </ul>
            {results !== null && results.length > RENDER_CAP && (
              <p className="p-2 text-center text-[13px] text-[#8AA0B6]">
                Showing {RENDER_CAP} of {results.length} —{" "}
                {searching ? "refine your search" : "search to narrow"}
              </p>
            )}
            {searching && results !== null && results.length === 0 && (
              <p className="p-4 text-center text-[15px] text-[#8AA0B6]">
                No guides match “{query}” — try a broader term, or search the
                full{" "}
                <a href="#ntlsn-archive" className="text-[#4FD1A5]">
                  Sector Archive
                </a>
                .
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
