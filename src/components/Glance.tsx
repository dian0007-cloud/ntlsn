import { Fragment } from "react";
import { GLANCE_STAGES } from "../lib/frontdoor";

/**
 * #ntlsn-glance — "NTLSN at a glance / One connected system." (PR-A).
 * Ported from ntlsn-glance-script: four stage cards (free commons → run your
 * own → recognition → connected), each pill a real link, joined by gradient
 * connector lines with a travelling dot (horizontal ≥880px, vertical when
 * stacked — the patch's exact breakpoint). The closing "Free forever" trust
 * pill is the ntlsn-trust-script badge production appends to this section;
 * it ships here as static content so the section is visually complete
 * (the trust script's other badges ride along with their own sections).
 *
 * glancenet-canvas decision (noted per the PR-A brief): production's
 * ntlsn-glancenet script draws a full-viewport, scroll-linked canvas that
 * converges lines onto the year-view month labels. It is purely decorative
 * (aria-hidden, pointer-events:none), reads DOM the rebuild lays out
 * differently, and costs a per-frame rAF loop — so it is NOT ported; the
 * animated connector dots above already carry the "one connected system"
 * metaphor. Revisit only if Seb misses it.
 *
 * The archive pill's count is derived from data/ltr.json (not the hardcoded
 * "1,431"). Reduced motion: the dot animation is neutralised globally.
 */
export default function Glance() {
  return (
    <section
      id="ntlsn-glance"
      aria-labelledby="glance-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      <div className="mx-auto mb-8 max-w-[760px] text-center">
        <p className="mb-[11px] text-[13px] font-bold uppercase tracking-[2px] text-[#8fb081]">
          NTLSN at a glance
        </p>
        <h2
          id="glance-heading"
          className="mb-3 text-[clamp(26px,3.6vw,42px)] font-extrabold leading-[1.13] text-white"
        >
          One connected system.
        </h2>
        <p className="text-[clamp(15px,1.8vw,18px)] leading-relaxed text-[#bca98f]">
          A free commons holds the sector together; tools let you run your
          own; recognition makes the work count; and it all connects, on
          campus and across the country.
        </p>
        <p className="mt-3.5 text-sm font-semibold leading-normal text-[#d9cdb6]">
          New here?{" "}
          <a
            href="/find-your-path.html"
            className="font-extrabold text-[#8fb081] hover:underline"
          >
            Find your path
          </a>{" "}
          — tap a few bubbles and we’ll point you to exactly where to plug in.
        </p>
      </div>

      <div className="flex flex-col items-stretch min-[880px]:flex-row min-[880px]:flex-nowrap">
        {GLANCE_STAGES.map((stageData, idx) => {
          const next = GLANCE_STAGES[idx + 1];
          return (
            <Fragment key={stageData.title}>
              <div
                className="flex min-w-0 flex-1 flex-col rounded-[14px] border border-white/[0.08] bg-[#2a2218] px-4 py-[18px]"
                style={{ borderTop: `3px solid ${stageData.color}` }}
              >
                <p
                  className="text-[10.5px] font-extrabold uppercase tracking-[1px]"
                  style={{ color: stageData.color }}
                >
                  0{idx + 1}
                </p>
                <h3 className="mb-0.5 mt-1 text-[17px] font-extrabold leading-tight text-white">
                  {stageData.title}
                </h3>
                <p className="mb-[13px] text-xs text-[#7e93a8]">{stageData.sub}</p>
                <ul role="list" className="list-none">
                  {stageData.items.map((item) => (
                    <li key={item.label} className="mb-[7px]">
                      <a
                        href={item.href}
                        className="block rounded-[7px] border border-white/[0.08] bg-white/[0.04] px-2.5 py-[7px] text-[12.5px] font-medium leading-[1.3] text-[#d9cdb6] transition-colors hover:border-l-teal hover:bg-teal/[0.12] hover:text-white motion-reduce:transition-none"
                        style={{ borderLeft: `2px solid ${stageData.color}` }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {next && (
                <div
                  aria-hidden="true"
                  className="flex h-[26px] w-full flex-none items-center justify-center min-[880px]:h-auto min-[880px]:w-[30px]"
                >
                  <span
                    className="relative h-full w-0.5 rounded-sm opacity-[0.78] min-[880px]:h-0.5 min-[880px]:w-full"
                    style={{
                      background: `linear-gradient(90deg, ${stageData.color}, ${next.color})`,
                    }}
                  >
                    <span
                      className="absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full motion-safe:animate-[glance-dot-v_2.4s_linear_infinite] min-[880px]:left-0 min-[880px]:top-1/2 min-[880px]:-translate-x-0 min-[880px]:-translate-y-1/2 min-[880px]:motion-safe:animate-[glance-dot-h_2.4s_linear_infinite]"
                      style={{
                        backgroundColor: next.color,
                        boxShadow: `0 0 9px ${next.color}`,
                      }}
                    />
                  </span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      <p className="mx-auto mt-[26px] max-w-[700px] text-center text-[13px] italic text-[#a0907a]">
        Free at the front, sustainable at the back — the commons stays open
        forever; the paid layer funds it, never gates it.
      </p>

      {/* ntlsn-trust-script badge for this section */}
      <p className="mt-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.07] px-4 py-2 text-[13px] text-[#d9cdb6]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 stroke-[#8fb081]"
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Free forever — no logins, no paywalls, no catch.
        </span>
      </p>
    </section>
  );
}
