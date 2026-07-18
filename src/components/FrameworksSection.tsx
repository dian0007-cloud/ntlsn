import { useState } from "react";
import {
  FRAMEWORK_STRANDS,
  FRAMEWORKS,
  filterFrameworks,
  strandCount,
} from "../lib/frameworks";
import { faviconSrc } from "./FaviconBadge";
import StepLabel from "./StepLabel";
import ViewAllToggle from "./ViewAllToggle";

/** Production shows 12 cards before the "+ N more →" fold. */
const COLLAPSED_COUNT = 12;

/**
 * #frameworks — "Sector Frameworks & Policy Documents" (Epic 1.2 PR-C).
 * Bundle-rendered in production: coral "XV · Frameworks" badge, heading,
 * stacked-bars doodle, "280 verified PDFs" lede (count derived here), the
 * strand chip row with per-strand counts, search, the favicon card grid and
 * the "+ N more →" fold.
 *
 * The gp-fw guided path (Step 1 · What are you chasing? / Step 2 · Narrow
 * it down (optional) / Step 3 · Here you go) is componentised as static
 * waypoint labels, same treatment as PDSection's gp-pd port. NOTE the
 * production ntlsn-gp-fw script is currently a silent no-op — it waits for
 * input[placeholder="Search frameworks..."] but the live placeholder is
 * "Search frameworks — try …", so its labels never render on www.ntlsn.com;
 * this port restores the intended guided path (its scroll-step state
 * machine and "show me ↓" skip button are not ported — static waypoints).
 *
 * Deliberate divergences: the cards' "♡ Save" button (bundle-internal saved
 * state, semantics unknown/unported) is omitted; the search placeholder is
 * the static base string (production cycles example terms).
 */
export default function FrameworksSection() {
  const [strand, setStrand] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = filterFrameworks(strand, query);
  const visible = expanded ? filtered : filtered.slice(0, COLLAPSED_COUNT);
  const hidden = filtered.length - visible.length;

  return (
    <section
      id="frameworks"
      aria-labelledby="frameworks-heading"
      className="relative scroll-mt-20 border-t border-white/[0.03] px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="mb-4 inline-block rounded-full border border-coral/20 bg-coral/10 px-3 py-1 text-xs font-semibold tracking-wider text-coral uppercase">
            XV · Frameworks
          </p>
          <h2
            id="frameworks-heading"
            className="mb-3 text-3xl font-bold text-white sm:text-4xl"
          >
            Sector Frameworks &amp; Policy Documents
          </h2>
          {/* Decorative stacked-bars doodle — the ntlsn-secanim treatment. */}
          <div aria-hidden="true" className="mb-3 flex justify-center">
            <svg width="56" height="56" viewBox="0 0 64 64">
              <rect
                className="na-seq"
                x="16"
                y="19"
                width="32"
                height="5"
                rx="2.5"
                fill="#4ECDC4"
              />
              <rect
                className="na-seq na-seq-d1"
                x="16"
                y="29.5"
                width="32"
                height="5"
                rx="2.5"
                fill="#C9A962"
              />
              <rect
                className="na-seq na-seq-d2"
                x="16"
                y="40"
                width="32"
                height="5"
                rx="2.5"
                fill="#C57BFF"
              />
            </svg>
          </div>
          <p className="mx-auto max-w-2xl text-white/40">
            {FRAMEWORKS.length} verified PDFs. Chasing promotion criteria?
            Indigenising your curriculum? Designing assessment? Pick a strand
            below — filtered to exactly what you need.
          </p>
        </div>

        <StepLabel n={1}>Step 1 · What are you chasing?</StepLabel>
        <div
          role="group"
          aria-label="Filter by strand"
          className="mb-4 flex flex-wrap justify-center gap-2"
        >
          {FRAMEWORK_STRANDS.map((value) => {
            const active = strand === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setStrand(value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-coral text-white"
                    : "border border-white/5 bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
                }`}
              >
                {value}
                {value !== "All" && (
                  <span className="ml-1 opacity-50">
                    ({strandCount(value)})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <StepLabel n={2}>Step 2 · Narrow it down (optional)</StepLabel>
        <div className="mx-auto mb-8 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search frameworks — try “first-year”"
            aria-label="Search frameworks"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-coral/40"
          />
        </div>

        <StepLabel n={3}>Step 3 · Here you go</StepLabel>
        <p aria-live="polite" className="sr-only">
          {filtered.length} of {FRAMEWORKS.length} documents shown
        </p>
        <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((doc) => {
            const favicon = faviconSrc(doc.url);
            return (
              <li
                key={doc.url + doc.title}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-coral/20 hover:bg-white/[0.05]"
              >
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <span className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/90"
                    >
                      {favicon && (
                        <img
                          src={favicon}
                          alt=""
                          loading="lazy"
                          width={20}
                          height={20}
                          className="h-5 w-5 object-contain"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-tight font-semibold text-white/80 group-hover:text-white">
                        {doc.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-medium text-coral/60">
                        {doc.org}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-xs text-white/30">
                        {doc.desc}
                      </span>
                    </span>
                  </span>
                </a>
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/30">
                    {doc.category}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-white/40">
            No documents match — try a broader term or another strand.
          </p>
        )}

        {(hidden > 0 || expanded) && (
          <ViewAllToggle
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            viewAllLabel={`+ ${hidden} more →`}
          />
        )}
      </div>
    </section>
  );
}
