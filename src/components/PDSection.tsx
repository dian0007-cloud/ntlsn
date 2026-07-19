import { useState } from "react";
import {
  filterPd,
  PD_LENSES,
  PD_OPPORTUNITIES,
  PD_TYPE_CHIPS,
  type PdOpportunity,
} from "../lib/pd";
import SearchField from "./SearchField";
import StepLabel from "./StepLabel";
import ViewAllToggle from "./ViewAllToggle";
import { faviconSrc } from "./FaviconBadge";

/** How many cards production shows before "View all N opportunities". */
const COLLAPSED_COUNT = 6;

/**
 * #pd — "What are you looking for?" (TASKS.md 1.2, fifth ported increment).
 *
 * Header (gold "Volume III" kicker, teal "Grow · Connect · Lead" badge),
 * the guided three-step flow (Step 1 format chips, search, Step 2 lens
 * pills, Step 3 card grid), the 73 opportunity cards and the
 * "View all N opportunities" fold are all production's arrangement. The
 * Step labels come from the `ntlsn-gp-style` guided-path patch script,
 * componentised here (the patch's scroll-driven highlight state is not
 * ported — the labels are static waypoints).
 *
 * Filtering is production's exact logic (lib/pd.ts): ONE selection shared
 * by the format chips and the lens pills — a card matches when its type OR
 * its cat equals the selection — plus a search over name/provider/desc.
 *
 * Deliberate divergences: the header count is derived from
 * PD_OPPORTUNITIES.length (production hardcodes "59 ways to grow" against
 * 73 actual cards — stale); cards are a real <ul>; chips carry
 * aria-pressed; the result count is announced politely; and the
 * ntlsn-secstats hero-stat strip patch is not reproduced (cross-cutting
 * patch layer, out of scope for a section port).
 */
export default function PDSection() {
  const [selected, setSelected] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = filterPd(selected, query);
  const visible = expanded ? filtered : filtered.slice(0, COLLAPSED_COUNT);

  return (
    <section
      id="pd"
      aria-labelledby="pd-heading"
      className="relative scroll-mt-20 border-t border-white/[0.03] px-4 py-24"
    >
      <div id="reveal-pd" className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume III
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Grow · Connect · Lead
          </p>
          <h2 id="pd-heading" className="mb-4 text-3xl font-bold md:text-4xl">
            What are you looking for?
          </h2>
          <p className="mx-auto max-w-xl text-white/50">
            Not just PD — communities of practice, fellowships, mentoring,
            programs, toolkits, courses, webinars and more.{" "}
            {PD_OPPORTUNITIES.length} ways to grow, from peak bodies,
            regulators and leading providers. Tell us what you&rsquo;re looking
            for.
          </p>
        </div>

        <StepLabel n={1}>Step 1 · Pick what you&rsquo;re after</StepLabel>
        <div
          role="group"
          aria-label="Filter by format"
          className="mx-auto mb-6 flex max-w-3xl flex-wrap justify-center gap-2"
        >
          {PD_TYPE_CHIPS.map(({ label, type }) => {
            const active = selected === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(active ? "All" : type)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                  active
                    ? "border-[#c66c3f]/40 bg-[#c66c3f]/15 text-[#c66c3f]"
                    : "border-[#c66c3f]/15 text-white/45 hover:border-[#c66c3f]/30 hover:text-white/75"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search PD opportunities — try “SoTL”"
          label="Search PD opportunities"
        />

        <StepLabel n={2}>Step 2 · Through which lens?</StepLabel>
        <div
          role="group"
          aria-label="Filter by provider lens"
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {PD_LENSES.map((lens) => {
            const active = selected === lens;
            return (
              <button
                key={lens}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(lens)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                  active
                    ? "border-teal/30 bg-teal/10 text-teal"
                    : "border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {lens}
              </button>
            );
          })}
        </div>

        <StepLabel n={3}>Step 3 · Here you go</StepLabel>
        <p aria-live="polite" className="sr-only">
          {filtered.length} of {PD_OPPORTUNITIES.length} opportunities shown
        </p>
        <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((o) => (
            <PdCard key={`${o.provider}-${o.name}`} opportunity={o} />
          ))}
        </ul>

        {filtered.length > COLLAPSED_COUNT && (
          <ViewAllToggle
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            viewAllLabel={`View all ${filtered.length} opportunities`}
          />
        )}
      </div>
    </section>
  );
}

/** One opportunity card — production's exact arrangement. */
function PdCard({ opportunity: o }: { opportunity: PdOpportunity }) {
  const favicon = faviconSrc(o.url);
  return (
    <li className="relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:scale-[1.02] hover:border-teal/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_rgba(143, 176, 129,0.15)]">
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-teal via-[#c66c3f] to-purple opacity-40"
      />
      <div className="mb-2 flex items-start justify-between">
        <span className="inline-flex items-center rounded-md border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold">
          {o.type}
        </span>
        <span className="text-[10px] text-white/30">{o.cat}</span>
      </div>
      <h3 className="mb-1 text-sm font-semibold text-white">{o.name}</h3>
      <div className="mb-2 flex items-center gap-1.5">
        {favicon && (
          <span
            aria-hidden="true"
            className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white/90"
          >
            <img
              src={favicon}
              alt=""
              loading="lazy"
              width={12}
              height={12}
              className="h-3 w-3 object-contain"
            />
          </span>
        )}
        <span className="truncate text-xs text-teal/70">{o.provider}</span>
      </div>
      <p className="flex-1 text-xs text-white/40">{o.desc}</p>
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="text-[10px] text-white/30">
          <span>{o.timing}</span> · <span>{o.cost}</span>
        </div>
        <a
          href={o.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Learn more: ${o.name}`}
          className="text-xs text-teal hover:underline"
        >
          Learn more →
        </a>
      </div>
    </li>
  );
}
