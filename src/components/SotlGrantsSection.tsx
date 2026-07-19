import { useMemo, useState } from "react";
import {
  GRANT_CATEGORY_CHIPS,
  GRANT_CONFERENCES,
  GRANT_FUNDERS,
  GRANT_ORGS,
  filterGrants,
  type GrantOpportunity,
} from "../lib/grants";
import SearchField from "./SearchField";
import ViewAllToggle from "./ViewAllToggle";

/** Production shows the first two organisation groups before the fold. */
const COLLAPSED_ORGS = 2;

/**
 * #sotl-grants — "SoTL Grants & Awards" (Epic 1.2 PR-C). Bundle-rendered in
 * production; ported with its grantbubbles satellite ("Browse by who funds
 * it" — each bubble pre-fills the search, exactly how the patch drove the
 * bundle's input). Header (gold "Volume XI" kicker, teal "Funding" badge),
 * search, category chips, funder bubbles, the opportunity list grouped by
 * organisation with a two-group fold, the Major SoTL Conferences grid and
 * the membership footnote are production's arrangement; the counts line is
 * derived from the data ("39 opportunities across 16 organisations" at
 * extraction time).
 *
 * Deliberate divergences: the "COMING UP" deadline ticker production
 * injects into this header (ntlsn-duesoon-script's #ntlsn-duesoon-bar) is a
 * cross-section satellite outside this PR's scope — not ported here; the
 * search placeholder is the static base string (production cycles example
 * terms via the ntlsn-searchcycle patch); the ntlsn-bubblescta satellite is
 * a production no-op (nothing to port).
 */
export default function SotlGrantsSection() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [funder, setFunder] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const filtered = filterGrants(category, query);
  const groups = useMemo(() => {
    const byOrg = new Map<string, GrantOpportunity[]>();
    for (const grant of filtered) {
      const list = byOrg.get(grant.org);
      if (list) list.push(grant);
      else byOrg.set(grant.org, [grant]);
    }
    return GRANT_ORGS.filter((org) => byOrg.has(org)).map((org) => ({
      org,
      orgUrl: (byOrg.get(org) as GrantOpportunity[])[0].orgUrl,
      grants: byOrg.get(org) as GrantOpportunity[],
    }));
  }, [filtered]);
  const visibleGroups = expanded ? groups : groups.slice(0, COLLAPSED_ORGS);

  return (
    <section
      id="sotl-grants"
      aria-labelledby="sotl-grants-heading"
      className="relative scroll-mt-20 border-y border-white/[0.04] bg-[#271f16]/70 px-4 py-24"
    >
      <div id="reveal-sotl-grants" className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume XI
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Funding
          </p>
          <h2
            id="sotl-grants-heading"
            className="mb-6 text-3xl font-bold sm:text-4xl md:text-[42px]"
          >
            SoTL Grants &amp; Awards
          </h2>
          {/* Decorative rising-bubbles doodle — the ntlsn-secanim treatment. */}
          <div aria-hidden="true" className="mb-4 flex justify-center">
            <svg width="56" height="56" viewBox="0 0 64 64">
              <circle className="na-rise" cx="32" cy="40" r="5" fill="#8fb081" />
              <circle
                className="na-rise na-rise-d1"
                cx="20"
                cy="40"
                r="4"
                fill="#c9a962"
              />
              <circle
                className="na-rise na-rise-d2"
                cx="44"
                cy="40"
                r="4"
                fill="#a8737f"
              />
            </svg>
          </div>
          <p className="mx-auto max-w-3xl text-lg text-white/50">
            Funding and recognition for your SoTL work — grants, fellowships,
            and awards across Australian higher education. What are you
            applying for?
          </p>
        </div>

        <SearchField
          value={query}
          onChange={(value) => {
            setQuery(value);
            setFunder("All");
          }}
          placeholder="Search grants — try “WIL”"
          label="Search grants"
        />

        <div
          role="group"
          aria-label="Filter by opportunity type"
          className="mb-6 flex flex-wrap justify-center gap-1.5"
        >
          {GRANT_CATEGORY_CHIPS.map(({ label, category: value }) => {
            const active = category === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  active
                    ? "bg-teal text-navy"
                    : "border border-white/10 bg-white/5 text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* The grantbubbles satellite: funder bubbles that pre-fill the search. */}
        <div
          role="group"
          aria-label="Browse by who funds it"
          className="mx-auto mb-1 flex max-w-[880px] flex-wrap justify-center gap-2"
        >
          <p className="mb-0.5 w-full text-center text-[11px] font-bold tracking-[1.5px] text-[#a0907a] uppercase">
            Browse by who funds it
          </p>
          {GRANT_FUNDERS.map(({ label, query: funderQuery }) => {
            const active = funder === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFunder(label);
                  setQuery(funderQuery);
                }}
                className={`rounded-full border px-[17px] py-[9px] text-sm font-bold whitespace-nowrap transition-colors ${
                  active
                    ? "border-teal bg-teal/[0.18] text-white"
                    : "border-white/[0.16] bg-white/[0.04] text-[#d9cdb6] hover:border-teal/60 hover:bg-teal/[0.12] hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="mb-6 text-center text-xs text-white/30">
          {filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"}{" "}
          across {groups.length} organisation{groups.length === 1 ? "" : "s"}
        </p>

        <div className="mb-8 space-y-6">
          {visibleGroups.map(({ org, orgUrl, grants }) => (
            <div
              key={org}
              className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3">
                <h3 className="text-sm font-bold text-white">{org}</h3>
                <a
                  href={orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${org} website`}
                  className="text-[10px] text-teal/50 transition-colors hover:text-teal"
                >
                  website ↗
                </a>
                <span
                  aria-hidden="true"
                  className="ml-auto font-mono text-[10px] text-white/20"
                >
                  {grants.length}
                </span>
              </div>
              <ul className="list-none divide-y divide-white/[0.04]">
                {grants.map((grant) => (
                  <li key={grant.name}>
                    <a
                      href={grant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 px-5 py-3 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="mb-0.5 flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-white/80 transition-colors group-hover:text-teal">
                            {grant.name}
                          </span>
                          <span className="shrink-0 rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-white/30">
                            {grant.category === "Discipline"
                              ? "Discipline-Specific"
                              : grant.category}
                          </span>
                        </span>
                        <span className="block truncate text-xs text-white/35">
                          {grant.details}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-xs font-semibold text-teal/70">
                          {grant.amount}
                        </span>
                        <span className="block text-[10px] text-white/30">
                          {grant.deadline}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-white/40">
              No opportunities match — try a broader term or another funder.
            </p>
          )}
        </div>

        {groups.length > COLLAPSED_ORGS && (
          <ViewAllToggle
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            viewAllLabel={`View all ${groups.length} organisations`}
            className="mb-16"
          />
        )}

        <div className="mb-8">
          <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-white">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-purple/20 text-xs text-purple"
            >
              C
            </span>
            Major SoTL Conferences 2025–2026
          </h3>
          <ul className="grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GRANT_CONFERENCES.map((conference) => (
              <li key={conference.name}>
                <a
                  href={conference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                >
                  <h4 className="mb-1 text-sm font-bold text-white/80 transition-colors group-hover:text-teal">
                    {conference.name}
                  </h4>
                  <p className="mb-1 text-xs font-medium text-purple/60">
                    {conference.dates}
                  </p>
                  <p className="text-xs text-white/40">{conference.location}</p>
                  <p className="mt-2 text-[10px] text-white/25">
                    Deadline: {conference.deadline}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-[10px] text-white/20">
          Last updated: April 2026. Most opportunities require membership in
          the relevant professional body.
        </p>
      </div>
    </section>
  );
}
