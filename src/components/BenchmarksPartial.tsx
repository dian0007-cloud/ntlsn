import {
  GRADCERT_INSIGHTS,
  GRADCERT_STATUS_COLOURS,
  GRADCERT_UNIS,
  SOTLMETRICS_FRAMEWORKS,
  SOTLMETRICS_FRONTIER,
} from "../lib/benchmarks";
import { sectionLabel } from "../sections";

/**
 * #benchmarks — PARTIAL port (Epic 1.2 PR-C). Production's Sector
 * Benchmarks section holds five studies: 1–3 are bundle-rendered
 * (Students as Partners / Indigenising the Curriculum / Peer Review of
 * Teaching — they port with PR-D "Sector fabric") while 4 and 5 were
 * injected INTO this section by the ntlsn-gradcert-bench and
 * ntlsn-sotlmetrics-bench patch scripts. PR-C retires those two injectors,
 * so their cards live here, inside the #benchmarks section exactly where
 * production parks them, beneath a placeholder note for studies 1–3.
 */
export default function BenchmarksPartial() {
  return (
    <section
      id="benchmarks"
      aria-label={sectionLabel("benchmarks")}
      className="relative scroll-mt-20 border-t border-white/[0.03] px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Studies 1–3 (bundle-rendered) arrive with PR-D. */}
        <div className="mx-auto max-w-4xl rounded-xl border border-dashed border-white/10 px-5 py-4">
          <h2 className="text-sm font-bold text-white/40">
            Sector Benchmarks — studies 1–3
          </h2>
          <p className="mt-1 text-xs text-white/25">Porting soon.</p>
        </div>

        <GradCertBench />
        <SotlMetricsBench />
      </div>
    </section>
  );
}

/**
 * Study 4 — "Graduate Certificate in Higher Education" availability audit
 * (the ntlsn-gradcert-bench injector). All figures derive from
 * GRADCERT_UNIS; institutions stay de-identified by design. The injector
 * exposed each institution's model as a hover-only title attribute — here
 * it is real visible-on-focus content via <abbr title> plus an sr-only
 * rendering, keeping keyboard/screen-reader access (WCAG 2.2 AA floor).
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
    <div className="mx-auto mt-12 max-w-5xl rounded-[20px] border border-teal/[0.18] bg-[#0f1f38] p-8">
      <div className="mb-1 flex items-baseline gap-3">
        <span aria-hidden="true" className="text-xl font-extrabold text-teal">
          4
        </span>
        <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
          Graduate Certificate in Higher Education
        </h3>
      </div>
      <p className="mb-5 text-[15px] text-[#9FB3C8]">
        Availability audit across {total} Australian universities — who offers
        a dedicated Grad Cert in Higher Education / University Learning &amp;
        Teaching.
      </p>
      <div className="mb-1.5 flex flex-wrap items-center gap-7">
        <div>
          <p className="text-[50px] leading-none font-extrabold text-[#34D399]">
            {offering}
            <span className="text-[22px] text-[#8AA0B6]">/{total}</span>
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-[#9FB3C8]">
            offer a Grad Cert ({pct}%) · {suspended} suspended
          </p>
        </div>
        <div className="min-w-60 flex-1">
          <div
            role="img"
            aria-label={`${pctOf("y").toFixed(0)}% offer, ${pctOf("s").toFixed(0)}% suspended, ${pctOf("n").toFixed(0)}% not yet listed`}
            className="my-2.5 mb-1.5 flex h-3.5 overflow-hidden rounded-lg"
          >
            <div
              style={{ width: `${pctOf("y")}%`, background: "#34D399" }}
            />
            <div
              style={{ width: `${pctOf("s")}%`, background: "#FFB448" }}
            />
            <div
              style={{ width: `${pctOf("n")}%`, background: "#FF6B6B" }}
            />
          </div>
          <p className="flex gap-4 text-xs font-semibold text-[#9FB3C8]">
            <span>
              <span aria-hidden="true" style={{ color: "#34D399" }}>
                ●
              </span>{" "}
              Offers
            </span>
            <span>
              <span aria-hidden="true" style={{ color: "#FFB448" }}>
                ●
              </span>{" "}
              Suspended
            </span>
            <span>
              <span aria-hidden="true" style={{ color: "#9FB3C8" }}>
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
            <p className="text-[13px] leading-normal text-[#9FB3C8]">
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
      <p className="mt-4 text-xs text-[#8AA0B6]">
        Hover a university for its model. Source: NTLSN sector availability
        audit, 2026.
      </p>
    </div>
  );
}

/**
 * Study 5 — "SoTL Metrics & Performance Frameworks" (the
 * ntlsn-sotlmetrics-bench injector): the twelve named institutional
 * frameworks and "The frontier" grid, verbatim copy.
 */
function SotlMetricsBench() {
  return (
    <div className="mx-auto mt-7 max-w-5xl rounded-[20px] border border-purple/[0.18] bg-[#0f1f38] p-8">
      <div className="mb-1 flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className="text-xl font-extrabold text-purple"
        >
          5
        </span>
        <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
          SoTL Metrics &amp; Performance Frameworks
        </h3>
      </div>
      <p className="mb-[18px] text-[15px] text-[#9FB3C8]">
        How leading Australian universities measure and reward teaching
        quality — moving beyond student-satisfaction surveys toward named
        quality cycles, equity-disaggregated analytics and evidence
        triangulation.
      </p>
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
            <span className="min-w-[220px] flex-1 text-[13px] leading-normal text-[#9FB3C8]">
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
            <p className="text-[13px] leading-normal text-[#9FB3C8]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[#8AA0B6]">
        Synthesised from sector benchmarking of academic-performance
        frameworks across Australian universities. NTLSN, 2026.
      </p>
    </div>
  );
}
