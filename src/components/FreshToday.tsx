import { dailyPick, DAILY_PROMPTS, DAILY_TOOLS } from "../lib/frontdoor";
import {
  formatDay,
  parseDay,
  todayLocal,
  uniAbbr,
  upcomingEvents,
} from "../lib/events";

/**
 * #ntlsn-freshtoday — "Something new every morning." (PR-A "Front door").
 * Ported from ntlsn-freshtoday-script: three daily cards — Next up (the
 * soonest upcoming event), Tool of the day, and Today's prompt.
 *
 * Rotation is deterministic by date (the PR-A brief): the same UTC day
 * serial production used (`Math.floor(Date.now()/864e5)`) picks the tool
 * (mod 10) and prompt (mod 8) once at render. No timers, no aria-live churn:
 * production's ntlsn-freshrotate satellite compressed the cards into an
 * auto-advancing 6-second one-at-a-time strip (to fit the collapsed
 * "node-spine" treatment, which is a deferred Seb decision) — here all three
 * cards render side by side, so nothing auto-updates and reduced-motion has
 * nothing extra to pause (WCAG 2.2.2 satisfied by construction).
 *
 * "Next up" reads data/events.json through the data layer instead of
 * production's runtime fetch — no network, no loading state, no fail-soft
 * branch needed.
 */
export default function FreshToday() {
  const day = formatDay(todayLocal());
  const nextUp = upcomingEvents()[0];
  const tool = dailyPick(DAILY_TOOLS);
  const prompt = dailyPick(DAILY_PROMPTS);

  return (
    <section
      id="ntlsn-freshtoday"
      aria-labelledby="freshtoday-heading"
      className="relative scroll-mt-20 px-6 py-[54px]"
    >
      <div className="mx-auto max-w-[1040px]">
        <div className="mb-6 text-center">
          <p className="mb-[9px] text-xs font-extrabold uppercase tracking-[0.18em] text-teal">
            ✦ Fresh today · {day}
          </p>
          <h2
            id="freshtoday-heading"
            className="mb-2 text-[clamp(24px,3.6vw,36px)] font-extrabold text-white"
          >
            Something new every morning.
          </h2>
          <p className="mx-auto max-w-[50ch] text-[15px] text-white/50">
            Three things worth a minute today — they refresh automatically, on
            their own, every day.
          </p>
        </div>

        <div className="flex flex-wrap items-stretch gap-3.5">
          <FreshCard label="📅 Next up">
            {nextUp ? (
              <a
                href={nextUp.url || "#events"}
                {...(nextUp.url
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group block"
              >
                <span className="block text-[15.5px] font-extrabold leading-[1.3] text-white">
                  {nextUp.title}
                </span>
                <span className="mt-[3px] block text-[13px] text-[#9fb0c3]">
                  {formatDay(parseDay(nextUp.date))} · {uniAbbr(nextUp)}
                </span>
                <span className="mt-[9px] block text-[12.5px] font-bold text-teal group-hover:underline">
                  Details →
                </span>
              </a>
            ) : (
              <a href="#events" className="text-sm text-teal hover:underline">
                Browse the calendar →
              </a>
            )}
          </FreshCard>

          <FreshCard label="🧰 Tool of the day">
            <a href={tool.href} className="group block">
              <span className="block text-base font-extrabold text-white">
                <span aria-hidden="true">{tool.icon}</span> {tool.title}
              </span>
              <span className="mt-[3px] block text-[13px] text-[#9fb0c3]">
                {tool.desc}
              </span>
              <span className="mt-[9px] block text-[12.5px] font-bold text-teal group-hover:underline">
                Open it →
              </span>
            </a>
          </FreshCard>

          <FreshCard label="💡 Today’s prompt">
            <p className="text-[14.5px] font-medium leading-normal text-[#cbd8e6]">
              {prompt}
            </p>
          </FreshCard>
        </div>

        <p className="mt-[18px] text-center text-xs text-white/[0.32]">
          No login, nothing tracked — the date alone decides what’s fresh.
        </p>
      </div>
    </section>
  );
}

function FreshCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[230px] flex-1 rounded-[14px] border border-white/[0.08] bg-white/[0.025] p-[18px]">
      <p className="mb-[9px] text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-amber">
        {label}
      </p>
      {children}
    </div>
  );
}
