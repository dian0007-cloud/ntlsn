import {
  EVIDENCE_BARS,
  EVIDENCE_STATS,
  EVIDENCE_TABLE,
  LITMUS,
  rateColour,
} from "../lib/evidence";

/**
 * #ntlsn-evidence — "What the data shows" (Epic 1.2 PR-C). Bundle-rendered
 * in production WITHOUT an id: the ntlsn-order patch positions it by regex
 * ({tag:'SECTION',head:1,re:/What the data shows/}, right after #frameworks)
 * and the ntlsn-evidencefix patch stamps id="ntlsn-evidence" at runtime.
 * Here the id is canonical from birth — see the SECTION_ORDER row.
 *
 * Content is Seb's published research (credit line: CC BY-NC-SA 4.0), with
 * production's post-patch visual result: the "Strengths & Opportunities"
 * block the evidencefix patch hides (display:none) is NOT ported; the
 * ntlsn-noredstat patch's neutral repaint of "deficit red" stats is baked
 * into the colour maps (lib/evidence.ts). Aggregate framing throughout —
 * sector adoption rates, never a named league table (and the study's "42
 * universities" is the research cohort, not the directory count — do not
 * "fix" it against data/universities.json).
 */
export default function EvidenceSection() {
  return (
    <section
      id="ntlsn-evidence"
      aria-labelledby="ntlsn-evidence-heading"
      className="relative scroll-mt-20 bg-gradient-to-b from-[#060D1C] via-navy to-[#060D1C] px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#C9A962] uppercase">
            The Evidence
          </p>
          <h2
            id="ntlsn-evidence-heading"
            className="mb-6 text-3xl font-bold sm:text-4xl"
          >
            What the data shows
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-white/50">
            Original benchmarking across 42 universities and 25 SoTL
            indicators — where the sector leads, and where the gaps still
            are.
          </p>
        </div>

        <ul className="mb-16 grid list-none grid-cols-2 gap-4 md:grid-cols-4">
          {EVIDENCE_STATS.map((stat) => (
            <li
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
            >
              <p
                className="mb-2 text-4xl font-bold md:text-5xl"
                style={{ color: stat.colour }}
              >
                {stat.value}
              </p>
              <p className="text-xs tracking-wider text-white/40 uppercase">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>

        <div className="mb-20">
          <h3 className="mb-2 text-2xl font-bold text-white">
            SoTL Infrastructure Across All 42 Universities
          </h3>
          <p className="mb-8 text-sm text-white/40">
            Adoption rate for each indicator. Green = confirmed, light =
            partial, grey = absent.
          </p>
          <div className="space-y-2.5">
            {EVIDENCE_BARS.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <p className="w-44 shrink-0 truncate text-right text-xs text-white/60 sm:w-52">
                  {bar.label}
                </p>
                <div
                  role="img"
                  aria-label={`${bar.label}: ${bar.pct}% adoption (${bar.yes}% confirmed, ${bar.partial}% partial)`}
                  className="flex h-5 flex-1 overflow-hidden rounded-full bg-white/[0.04]"
                >
                  <div
                    className="h-full rounded-l-full bg-[#2D6A4F]"
                    style={{ width: `${bar.yes}%` }}
                  />
                  <div
                    className="h-full bg-[#95D5B2]"
                    style={{ width: `${bar.partial}%` }}
                  />
                </div>
                <p
                  className="w-10 shrink-0 text-right font-mono text-xs"
                  style={{ color: rateColour(bar.pct) }}
                >
                  {bar.pct}%
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-white/30">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-sm bg-[#2D6A4F]"
              />{" "}
              Confirmed
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-sm bg-[#95D5B2]"
              />{" "}
              Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-sm bg-white/[0.06]"
              />{" "}
              Absent
            </span>
          </div>
        </div>

        <LitmusDonut />

        <div className="mb-20">
          <h3 className="mb-2 text-2xl font-bold text-white">
            Full Data Table
          </h3>
          <p className="mb-6 text-sm text-white/40">
            All 25 indicators ranked by adoption rate across 42 Australian
            universities.
          </p>
          <details className="mt-1">
            <summary className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/70 transition-colors select-none hover:bg-white/10 hover:text-white">
              Show the full data table — {EVIDENCE_TABLE.length} indicators →
            </summary>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/[0.08]">
                    <th
                      scope="col"
                      className="p-3 text-left font-semibold text-white/60"
                    >
                      Indicator
                    </th>
                    <th
                      scope="col"
                      className="w-16 p-3 text-center font-semibold text-teal"
                    >
                      Yes
                    </th>
                    <th
                      scope="col"
                      className="w-16 p-3 text-center font-semibold text-[#95D5B2]"
                    >
                      Partial
                    </th>
                    <th
                      scope="col"
                      className="w-16 p-3 text-center font-semibold text-coral"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="w-20 p-3 text-center font-semibold text-white/60"
                    >
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EVIDENCE_TABLE.map(([indicator, yes, partial, no, rate], i) => (
                    <tr
                      key={indicator}
                      className={i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}
                    >
                      <td className="p-3 text-white/70">{indicator}</td>
                      <td className="p-3 text-center text-teal">{yes}</td>
                      <td className="p-3 text-center text-[#95D5B2]">
                        {partial}
                      </td>
                      {/* "No" counts neutral, not red — the noredstat repaint. */}
                      <td className="p-3 text-center text-[#DBE4EE]">{no}</td>
                      <td
                        className="p-3 text-center font-mono font-bold"
                        style={{ color: rateColour(parseInt(rate, 10)) }}
                      >
                        {rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>

        <div className="mb-16 rounded-2xl border border-[#C9A962]/30 bg-[#C9A962]/[0.04] p-8">
          <div className="flex items-start gap-4">
            <p aria-hidden="true" className="shrink-0 text-3xl">
              ⚖️
            </p>
            <div>
              <h3 className="mb-3 text-lg font-bold text-[#C9A962]">
                The Accord demands connected infrastructure
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                The Australian Universities Accord (2024) envisions a
                connected tertiary system. ATEC—the new Australian Tertiary
                Education Commission—is tasked with quality assurance, funding
                alignment, and cross-institutional benchmarking. TEQSA&rsquo;s
                HESF requires sustained SoTL engagement, not checkbox
                compliance.{" "}
                <a
                  href="/course-quality.html"
                  target="_blank"
                  rel="noopener"
                  className="inline-block border-b border-dashed border-teal/55 text-xs font-bold whitespace-nowrap text-teal no-underline"
                >
                  Quality self-check →
                </a>
              </p>
              <p className="text-sm leading-relaxed text-white/60">
                The data above shows why this matters: the sector&rsquo;s
                teaching and learning infrastructure is fragmented, unevenly
                distributed, and largely invisible. NTLSN provides the shared
                information layer—events, resources, PD, benchmarks—that a
                connected system needs to function.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-white/25">
            Research conducted by A/Prof Seb Dianati, 2022–2026 — a
            sector-wide benchmarking of SoTL infrastructure across 42
            Australian universities. CC BY-NC-SA 4.0.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * "L&T Weeks: The Litmus Test" — the 79% donut. Ring geometry derives from
 * the legend's counts (26 confirmed / 7 partial / 9 none of 42), which
 * reproduces production's hardcoded dash values.
 */
function LitmusDonut() {
  const total = 26 + 7 + 9;
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const confirmedLen = (26 / total) * circumference;
  const partialLen = (7 / total) * circumference;
  return (
    <div className="mb-20">
      <h3 className="mb-2 text-2xl font-bold text-white">
        L&amp;T Weeks: The Litmus Test
      </h3>
      <p className="mb-8 text-sm text-white/40">
        Learning &amp; Teaching Weeks are the most visible expression of
        institutional SoTL commitment. One in five universities has none.
      </p>
      <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
        <svg
          viewBox="0 0 200 200"
          className="h-[300px] w-[300px] shrink-0"
          role="img"
          aria-label={`${LITMUS.pct}% of universities have some form of L&T week`}
        >
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="24"
          />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="#2D6A4F"
            strokeWidth="24"
            strokeDasharray={`${confirmedLen.toFixed(1)} ${(circumference - confirmedLen).toFixed(1)}`}
            strokeDashoffset={circumference / 4}
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="#95D5B2"
            strokeWidth="24"
            strokeDasharray={`${partialLen.toFixed(1)} ${(circumference - partialLen).toFixed(1)}`}
            strokeDashoffset={-(confirmedLen - circumference / 4)}
            strokeLinecap="round"
          />
          <text
            x="100"
            y="92"
            textAnchor="middle"
            fill="white"
            fontSize="32"
            fontWeight="bold"
          >
            {LITMUS.pct}%
          </text>
          <text
            x="100"
            y="116"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="11"
          >
            have some form
          </text>
        </svg>
        <div className="space-y-3 text-sm">
          {LITMUS.legend.map((row) => (
            <p key={row.text} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-sm"
                style={{ background: row.colour }}
              />
              <span className="text-white/70">{row.text}</span>
            </p>
          ))}
          <p className="max-w-xs pt-2 text-xs text-white/30">{LITMUS.note}</p>
        </div>
      </div>
    </div>
  );
}
