import { useState, type ReactNode } from "react";
import {
  GRADCERT_INSIGHTS,
  GRADCERT_STATUS_COLOURS,
  GRADCERT_UNIS,
  SOTLMETRICS_FRAMEWORKS,
  SOTLMETRICS_FRONTIER,
} from "../lib/benchmarks";
import {
  INDIGENISING_BAR,
  INDIGENISING_KEYWORDS,
  INDIGENISING_LEVELS,
  PRT_KEYWORDS,
  PRT_PRESENCES,
  PRT_SPECTRUM,
  SAP_BAR,
  SAP_KEYWORDS,
  SAP_QUADRANTS,
  studyMatches,
  type PrtCard,
} from "../lib/benchmarkStudies";

/**
 * #benchmarks — "Mapping the landscape." COMPLETE (Epic 1.2 PR-D, replacing
 * PR-C's BenchmarksPartial): all five sector studies.
 *
 * Studies 1–3 (Students as Partners / Indigenising the Curriculum / Peer
 * Review of Teaching) are the bundle-rendered studies, ported from the
 * bundle source: collapsed to three preview cards until expanded, with the
 * section search force-showing any study whose keyword gate matches — the
 * bundle's exact behaviour.
 *
 * Studies 4–5 (Grad Cert audit / SoTL metrics) were patch-injected into
 * this section (ported in PR-C); they now render in numerical order after
 * studies 1–3 and carry the ntlsn-benchcollapse patch behaviour: header +
 * intro always visible, detail behind a per-study "Expand study →" toggle.
 * As in production, the search does not filter studies 4–5.
 */
export default function BenchmarksSection() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const q = query.trim().toLowerCase();
  const showFull = expanded || q !== "";

  const showSap = studyMatches(SAP_KEYWORDS, q);
  const showIndigenising = studyMatches(INDIGENISING_KEYWORDS, q);
  const showPrt = studyMatches(PRT_KEYWORDS, q);

  return (
    <section
      id="benchmarks"
      aria-labelledby="benchmarks-heading"
      className="relative scroll-mt-20 border-t border-white/[0.03] px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume XII
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Sector Benchmarks
          </p>
          <h2
            id="benchmarks-heading"
            className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            Mapping the landscape.
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-white/50">
            Five sector-wide studies auditing how Australian universities
            approach Students as Partners, Indigenising the Curriculum, Peer
            Review of Teaching, Graduate Certificate availability, and SoTL
            metrics frameworks. Research-informed snapshots grounded in
            peer-reviewed publications: Dianati &amp; Bolt (2025), and
            Dianati et al. (2025).
          </p>
        </div>

        <div className="relative mx-auto mb-10 max-w-2xl">
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
              placeholder="Search benchmarks by dimension or university..."
              aria-label="Search benchmarks by dimension or university"
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

        {showFull ? (
          <>
            {showSap && <SapStudy />}
            {showIndigenising && (
              <>
                <div
                  aria-hidden="true"
                  className="mx-auto mb-20 h-px w-full max-w-xl bg-white/10"
                />
                <IndigenisingStudy />
              </>
            )}
            {showPrt && (
              <>
                <div
                  aria-hidden="true"
                  className="mx-auto my-20 h-px w-full max-w-xl bg-white/10"
                />
                <PrtStudy />
              </>
            )}
            <div className="mx-auto mt-16 max-w-4xl rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <p className="text-xs leading-relaxed text-white/30">
                <strong className="text-white/50">Methodology note:</strong>{" "}
                These studies draw on publicly available information —
                university websites and policy documents — at specific points
                in time. They are indicative snapshots, not definitive
                assessments. Strong practices may exist without public-facing
                web presence. Universities continually develop their
                approaches, and these benchmarks should be viewed as emergent
                and dynamic. CC-BY 4.0 licensed.
              </p>
            </div>
            {!q && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/70"
                >
                  Show less
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <StudyPreview
              number="1"
              accent="bg-teal/20 text-teal"
              title="Students as Partners"
              summary="Benchmarking of 38 Australian universities — SaP practices across four quadrants"
              onExpand={() => setExpanded(true)}
            />
            <StudyPreview
              number="2"
              accent="bg-purple/20 text-purple"
              title="Indigenising the Curriculum"
              summary="Audit of 39 universities — curriculum indigenisation approaches"
              onExpand={() => setExpanded(true)}
            />
            <StudyPreview
              number="3"
              accent="bg-amber-400/20 text-amber-400"
              title="Peer Review of Teaching"
              summary="Comparative study of 6 universities — peer review models & the sophistication paradox"
              onExpand={() => setExpanded(true)}
            />
          </div>
        )}

        <GradCertBench />
        <SotlMetricsBench />
      </div>
    </section>
  );
}

function StudyPreview({
  number,
  accent,
  title,
  summary,
  onExpand,
}: {
  number: string;
  accent: string;
  title: string;
  summary: string;
  onExpand: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onExpand}
      className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 text-left transition-all hover:border-teal/30 hover:bg-white/[0.05]"
    >
      <div className="mb-2 flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${accent}`}
        >
          {number}
        </span>
        <span className="text-lg font-bold text-white transition-colors group-hover:text-teal">
          {title}
        </span>
      </div>
      <span className="block text-sm text-white/40">{summary}</span>
      <span className="mt-3 inline-block text-xs text-teal/60">
        Expand study →
      </span>
    </button>
  );
}

function StudyHeading({
  number,
  accent,
  title,
}: {
  number: string;
  accent: string;
  title: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${accent}`}
      >
        {number}
      </span>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
  );
}

/* ── Study 1 — Students as Partners ─────────────────────────────────────── */

const TONE_CARD: Record<string, string> = {
  muted: "border-white/10 bg-white/[0.02]",
  amber: "border-amber-500/20 bg-amber-500/[0.03]",
  blue: "border-[#c66c3f]/20 bg-[#c66c3f]/[0.03]",
  teal: "border-[#8fb081]/30 bg-[#8fb081]/[0.04]",
};
const TONE_DOT: Record<string, string> = {
  muted: "bg-white/20",
  amber: "bg-amber-400/60",
  blue: "bg-[#c66c3f]/60",
  teal: "bg-[#8fb081]/70",
};
const TONE_TITLE: Record<string, string> = {
  muted: "text-white/50",
  amber: "text-amber-300/80",
  blue: "text-[#c66c3f]/80",
  teal: "text-[#8fb081]/90",
};
const TONE_CHIP: Record<string, string> = {
  muted: "border-white/20 text-white/50",
  amber: "border-amber-400/20 text-amber-300/60",
  blue: "border-[#c66c3f]/30 text-[#c66c3f]/70",
  teal: "border-[#8fb081]/30 text-[#8fb081]/80 font-semibold",
};

function SapStudy() {
  return (
    <div className="mb-20">
      <StudyHeading
        number="1"
        accent="bg-teal/20 text-teal"
        title="Students as Partners"
      />
      <p className="mb-1 ml-11 text-sm text-white/40">
        Dianati, S., Ashford, T., Pearson, G., &amp; Williams, E. (2025).{" "}
        <em>International Journal for Students as Partners, 9</em>(1), 74–88.
      </p>
      <a
        href="https://doi.org/10.15173/ijsap.v9i1.5909"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 ml-11 inline-block text-xs text-teal/60 transition-colors hover:text-teal"
      >
        doi.org/10.15173/ijsap.v9i1.5909 ↗
      </a>
      <p className="mb-8 ml-11 max-w-4xl text-sm text-white/60">
        Benchmarking of 38 Australian university websites using critical
        discourse analysis, categorising SaP practices into four quadrants
        adapted from Barrie&rsquo;s (2007) Graduate Attributes framework —
        from no visible engagement to deeply embedded, emancipatory
        partnership.
      </p>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
        {SAP_QUADRANTS.map((quadrant) => (
          <div
            key={quadrant.title}
            className={`rounded-xl border p-5 ${TONE_CARD[quadrant.tone]}`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-block h-3 w-3 rounded-full ${TONE_DOT[quadrant.tone]}`}
              />
              <h4
                className={`text-sm font-bold tracking-wider uppercase ${TONE_TITLE[quadrant.tone]}`}
              >
                {quadrant.title}
              </h4>
              <span className="ml-auto font-mono text-xs text-white/30">
                {quadrant.n}
              </span>
            </div>
            <p className="mb-3 text-xs text-white/40">{quadrant.def}</p>
            {quadrant.note && (
              <p className="text-xs leading-relaxed text-white/20">
                {quadrant.note}
              </p>
            )}
            {quadrant.chips && (
              <div className="flex flex-wrap gap-1.5">
                {quadrant.chips.map((chip) => (
                  <span
                    key={chip}
                    className={`rounded-full border px-2 py-0.5 text-[10px] ${TONE_CHIP[quadrant.tone]}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-5xl">
        <div
          role="img"
          aria-label="Distribution: No Engagement 19, Fragmented 9, Targeted 5, Emancipatory 3"
          className="flex h-3 overflow-hidden rounded-lg"
        >
          {SAP_BAR.map((seg) => (
            <div
              key={seg.label}
              className={seg.className}
              title={seg.title}
              style={{ width: seg.width }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between px-1 text-[10px] text-white/30">
          {SAP_BAR.map((seg) => (
            <span key={seg.label}>{seg.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Study 2 — Indigenising the Curriculum ──────────────────────────────── */

const LEVEL_PCT: Record<string, string> = {
  teal: "text-[#8fb081]",
  blue: "text-[#c66c3f]",
  amber: "text-amber-400",
  muted: "text-white/30",
};
const LEVEL_LABEL: Record<string, string> = {
  teal: "text-[#8fb081]/70",
  blue: "text-[#c66c3f]/70",
  amber: "text-amber-400/70",
  muted: "text-white/30",
};
const LEVEL_CHIP: Record<string, string> = {
  teal: "border-[#8fb081]/20 text-[#8fb081]/60",
  blue: "border-[#c66c3f]/20 text-[#c66c3f]/50",
  amber: "border-amber-400/20 text-amber-400/50",
  muted: "border-white/10 text-white/30",
};

function IndigenisingStudy() {
  return (
    <div>
      <StudyHeading
        number="2"
        accent="bg-purple/20 text-purple"
        title="Indigenising the Curriculum"
      />
      <p className="mb-1 ml-11 text-sm text-white/40">
        Dianati, S. &amp; Bolt, R. (2025).{" "}
        <em>The Australian Journal of Indigenous Education, 54</em>(1).
      </p>
      <a
        href="https://doi.org/10.55146/ajie.v54i1.1073"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 ml-11 inline-block text-xs text-purple/60 transition-colors hover:text-purple"
      >
        doi.org/10.55146/ajie.v54i1.1073 ↗
      </a>
      <p className="mb-8 ml-11 max-w-4xl text-sm text-white/60">
        Audit of 39 Australian university websites benchmarking the extent to
        which Indigenous knowledges are embedded within curricula. Using a
        framework adapted from ACODE benchmarks, institutions were
        categorised across four levels of engagement with curriculum
        Indigenisation.
      </p>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INDIGENISING_LEVELS.map((level) => (
          <div
            key={level.label}
            className={`rounded-xl border p-5 text-center ${TONE_CARD[level.tone]}`}
          >
            <div className={`mb-1 text-3xl font-bold ${LEVEL_PCT[level.tone]}`}>
              {level.pct}
            </div>
            <div
              className={`mb-3 text-xs font-semibold tracking-wider uppercase ${LEVEL_LABEL[level.tone]}`}
            >
              {level.label}
            </div>
            <p
              className={`mb-3 text-[10px] ${level.tone === "muted" ? "text-white/20" : "text-white/40"}`}
            >
              {level.def}
            </p>
            {level.chip && (
              <div className="flex flex-wrap justify-center gap-1">
                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[9px] ${LEVEL_CHIP[level.tone]}`}
                >
                  {level.chip}
                </span>
              </div>
            )}
            {level.footnote && (
              <p className="text-[10px] text-white/15 italic">
                {level.footnote}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-5xl">
        <div
          role="img"
          aria-label="Distribution: Yes 21%, Yes-but 52%, No-but 16%, No 11%"
          className="flex h-3 overflow-hidden rounded-lg"
        >
          {INDIGENISING_BAR.map((seg) => (
            <div
              key={seg.title}
              className={seg.className}
              title={seg.title}
              style={{ width: seg.width }}
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] text-white/25">
          Audited November 2023 · 39 universities · Publicly available
          information only
        </p>
      </div>
    </div>
  );
}

/* ── Study 3 — Peer Review of Teaching ──────────────────────────────────── */

function PrtCardGrid({ cards }: { cards: readonly PrtCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border p-5 ${TONE_CARD[card.tone]}`}
        >
          <h4 className={`mb-1 text-sm font-bold ${TONE_TITLE[card.tone]}`}>
            {card.title}
          </h4>
          <p className="mb-3 text-xs text-white/40">{card.def}</p>
          <div className="flex flex-wrap gap-1.5">
            {card.chips.map((chip) => (
              <span
                key={chip}
                className={`rounded-full border px-2 py-0.5 text-[10px] ${TONE_CHIP[card.tone]}`}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PrtStudy() {
  return (
    <div>
      <StudyHeading
        number="3"
        accent="bg-amber-400/20 text-amber-400"
        title="Peer Review of Teaching"
      />
      <p className="mb-1 ml-11 text-sm text-white/40">
        Dianati, S. (2026).{" "}
        <em>
          Peer review of teaching in Australian universities: the paradox of
          institutional sophistication and developmental authenticity
        </em>
        . Working paper.
      </p>
      <p className="mb-8 ml-11 max-w-4xl text-sm text-white/60">
        Comparative documentary analysis of peer review models at six
        Australian universities — interpreted through the Community of
        Inquiry framework (Garrison et al., 2000). The study reveals a
        paradox: the more institutionally sophisticated and audit-driven a
        peer review system, the more it can erode the collegial trust on
        which authentic professional learning depends.
      </p>
      <div className="mx-auto mb-12 max-w-5xl">
        <p className="mb-3 ml-1 text-xs tracking-wider text-white/40 uppercase">
          A spectrum of institutional approaches
        </p>
        <div
          aria-hidden="true"
          className="mb-4 h-1.5 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(251,191,36,0.5), rgba(198,108,63,0.5), rgba(78,205,196,0.6))",
          }}
        />
        <PrtCardGrid cards={PRT_SPECTRUM} />
      </div>
      <p className="mx-auto mb-3 ml-1 max-w-5xl text-xs tracking-wider text-white/40 uppercase">
        Mapped to the three Community of Inquiry presences
      </p>
      <div className="mx-auto max-w-5xl">
        <PrtCardGrid cards={PRT_PRESENCES} />
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-xs leading-relaxed text-white/30">
        Where teaching presence is strong (dense frameworks, mandated
        cycles), social presence is typically weak — constrained by anxiety
        and compliance. Where social presence is rich (JCU, UQ), the
        continuity needed to sustain cognitive presence and institutional
        memory is often missing. Not a linear continuum, but an unstable
        triadic equilibrium in which gains in one dimension are bought at the
        expense of another.
      </p>
      <div className="mx-auto mt-8 max-w-5xl rounded-xl border border-amber-400/20 bg-amber-500/[0.04] p-6">
        <h4 className="mb-2 text-sm font-bold text-amber-300/90">
          The Newcastle exception
        </h4>
        <p className="text-xs leading-relaxed text-white/50">
          Newcastle&rsquo;s Quality Teaching Model approach to peer review
          (Patfield et al., 2026) is highly sophisticated — yet it produces
          collegiality rather than compliance. Because reciprocal pairs
          complete every step regardless of seniority, and the shared model
          fixes attention on the teaching rather than the teacher,
          vulnerability is distributed and a common vocabulary for critique
          emerges. The problem is not sophistication itself, but the
          displacement of pedagogical substance by procedural form.
        </p>
      </div>
    </div>
  );
}

/* ── Studies 4 & 5 (PR-C ports, now with the benchcollapse behaviour) ───── */

/**
 * Shared card shell for the two injected studies: numbered-circle header +
 * intro always visible; the detail collapses behind "Expand study →"
 * exactly as the ntlsn-benchcollapse patch did in production.
 */
function BenchCard({
  number,
  colour,
  borderClass,
  title,
  intro,
  children,
}: {
  number: string;
  colour: string;
  borderClass: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`mx-auto mt-7 max-w-5xl rounded-[20px] border bg-[#2a2218] p-8 ${borderClass}`}
    >
      <div className="mb-1 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-[35px] w-[35px] flex-none items-center justify-center rounded-full text-[15px] font-semibold"
          style={{ background: `${colour}33`, color: colour }}
        >
          {number}
        </span>
        <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
          {title}
        </h3>
      </div>
      {intro}
      {open && children}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-2.5 cursor-pointer text-[13.5px] font-bold text-teal"
      >
        {open ? "Collapse ↑" : "Expand study →"}
      </button>
    </div>
  );
}

/**
 * Study 4 — "Graduate Certificate in Higher Education" availability audit
 * (the ntlsn-gradcert-bench injector). All figures derive from
 * GRADCERT_UNIS; institutions stay de-identified by design. The injector
 * exposed each institution's model as a hover-only title attribute — here
 * it is also sr-only content, keeping keyboard/screen-reader access
 * (WCAG 2.2 AA floor).
 */
function GradCertBench() {
  const total = GRADCERT_UNIS.length;
  const offering = GRADCERT_UNIS.filter(([, status]) => status !== "n").length;
  const suspended = GRADCERT_UNIS.filter(
    ([, status]) => status === "s",
  ).length;
  const pct = Math.round((offering / total) * 100);
  const pctOf = (key: "y" | "s" | "n") =>
    (GRADCERT_UNIS.filter(([, status]) => status === key).length / total) *
    100;

  return (
    <BenchCard
      number="4"
      colour="#8fb081"
      borderClass="border-teal/[0.18]"
      title="Graduate Certificate in Higher Education"
      intro={
        <p className="mb-5 text-[15px] text-[#b3a48c]">
          Availability audit across {total} Australian universities — who
          offers a dedicated Grad Cert in Higher Education / University
          Learning &amp; Teaching.
        </p>
      }
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-7">
        <div>
          <p className="text-[50px] leading-none font-extrabold text-[#7fa66a]">
            {offering}
            <span className="text-[22px] text-[#a0907a]">/{total}</span>
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-[#b3a48c]">
            offer a Grad Cert ({pct}%) · {suspended} suspended
          </p>
        </div>
        <div className="min-w-60 flex-1">
          <div
            role="img"
            aria-label={`${pctOf("y").toFixed(0)}% offer, ${pctOf("s").toFixed(0)}% suspended, ${pctOf("n").toFixed(0)}% not yet listed`}
            className="my-2.5 mb-1.5 flex h-3.5 overflow-hidden rounded-lg"
          >
            <div style={{ width: `${pctOf("y")}%`, background: "#7fa66a" }} />
            <div style={{ width: `${pctOf("s")}%`, background: "#e6a33c" }} />
            <div style={{ width: `${pctOf("n")}%`, background: "#d96650" }} />
          </div>
          <p className="flex gap-4 text-xs font-semibold text-[#b3a48c]">
            <span>
              <span aria-hidden="true" style={{ color: "#7fa66a" }}>
                ●
              </span>{" "}
              Offers
            </span>
            <span>
              <span aria-hidden="true" style={{ color: "#e6a33c" }}>
                ●
              </span>{" "}
              Suspended
            </span>
            <span>
              <span aria-hidden="true" style={{ color: "#b3a48c" }}>
                ●
              </span>{" "}
              Not yet listed
            </span>
          </p>
        </div>
      </div>
      <ul className="my-5 flex list-none flex-wrap gap-[7px]">
        {GRADCERT_UNIS.map(([institution, status, model]) => (
          <li key={institution}>
            <span
              title={`${institution} — ${model}`}
              className="inline-flex items-center gap-[5px] rounded-[7px] border px-2 py-[5px] text-xs font-semibold text-[#DBE7F0]"
              style={{
                background: `${GRADCERT_STATUS_COLOURS[status]}1f`,
                borderColor: `${GRADCERT_STATUS_COLOURS[status]}55`,
              }}
            >
              <span
                aria-hidden="true"
                className="h-[7px] w-[7px] rounded-full"
                style={{ background: GRADCERT_STATUS_COLOURS[status] }}
              />
              {institution}
              <span className="sr-only"> — {model}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GRADCERT_INSIGHTS.map((insight, i) => (
          <div
            key={insight.title}
            className="rounded-xl border border-white/[0.07] bg-navy p-3.5"
          >
            <h4 className="mb-1.5 text-sm font-bold text-white">
              {insight.title}
            </h4>
            <p className="text-[13px] leading-normal text-[#b3a48c]">
              {insight.body}
              {i === GRADCERT_INSIGHTS.length - 1 && (
                <>
                  {" "}
                  <a
                    href="/sector-grad-cert.html"
                    className="font-bold text-teal no-underline hover:underline"
                  >
                    The sector&rsquo;s answer →
                  </a>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[#a0907a]">
        Hover a university for its model. Source: NTLSN sector availability
        audit, 2026.
      </p>
    </BenchCard>
  );
}

/**
 * Study 5 — "SoTL Metrics & Performance Frameworks" (the
 * ntlsn-sotlmetrics-bench injector): the twelve named institutional
 * frameworks and "The frontier" grid, verbatim copy.
 */
function SotlMetricsBench() {
  return (
    <BenchCard
      number="5"
      colour="#a8737f"
      borderClass="border-purple/[0.18]"
      title="SoTL Metrics & Performance Frameworks"
      intro={
        <p className="mb-[18px] text-[15px] text-[#b3a48c]">
          How leading Australian universities measure and reward teaching
          quality — moving beyond student-satisfaction surveys toward named
          quality cycles, equity-disaggregated analytics and evidence
          triangulation.
        </p>
      }
    >
      <ul className="mb-[22px] list-none">
        {SOTLMETRICS_FRAMEWORKS.map(([university, framework, detail]) => (
          <li
            key={university}
            className="flex flex-wrap items-baseline gap-2.5 border-t border-white/[0.06] py-[11px]"
          >
            <span className="min-w-24 text-sm font-bold text-white">
              {university}
            </span>
            <span className="rounded-md border border-purple/[0.27] bg-purple/[0.12] px-2 py-[3px] text-[11px] font-semibold whitespace-nowrap text-purple">
              {framework}
            </span>
            <span className="min-w-[220px] flex-1 text-[13px] leading-normal text-[#b3a48c]">
              {detail}
            </span>
          </li>
        ))}
      </ul>
      <p className="mb-3 text-xs font-bold tracking-[1.5px] text-purple uppercase">
        The frontier
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SOTLMETRICS_FRONTIER.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/[0.07] bg-navy p-3.5"
          >
            <h4 className="mb-1.5 text-sm font-bold text-white">
              {item.title}
            </h4>
            <p className="text-[13px] leading-normal text-[#b3a48c]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[#a0907a]">
        Synthesised from sector benchmarking of academic-performance
        frameworks across Australian universities. NTLSN, 2026.
      </p>
    </BenchCard>
  );
}
