import { formatCount, SOTL_WORK_COUNT } from "../lib/frontdoor";
import {
  CAPABILITY_GROUPS,
  CAPABILITY_MILESTONES,
  type CapabilityGroup,
  type CapabilityItem,
} from "../lib/capabilities";

/**
 * #ntlsn-capabilities — "Everything NTLSN does — now, and over three
 * years." (Epic 1.2 PR-D), ported from the ntlsn-capabilities-script patch:
 * the 2026→2029 timeline, the live Open Educational Practice band rendered
 * expanded, and the 2027/2028/2029 bands as native <details> folds exactly
 * as production. The SoTL archive card's work count derives from data
 * (production hardcoded "1,431").
 */
export default function CapabilitiesSection() {
  return (
    <section
      id="ntlsn-capabilities"
      aria-labelledby="ntlsn-capabilities-heading"
      className="mx-auto max-w-[1140px] scroll-mt-20 px-6 py-16"
    >
      <p className="mb-2.5 text-center text-[13px] leading-none font-bold tracking-[2px] text-teal uppercase">
        ◇ Capabilities · 2026 → 2029
      </p>
      <h2
        id="ntlsn-capabilities-heading"
        className="mb-3 text-center text-[clamp(28px,4vw,44px)] leading-[1.1] font-extrabold text-white"
      >
        Everything NTLSN does — now, and over three years.
      </h2>
      <p className="mx-auto mb-2 max-w-[740px] text-center text-[17px] leading-relaxed text-[#9FB3C8]">
        The free commons is <b className="text-[#CFE9E5]">live today.</b> The
        paid tools and integrations build across the next three years. Here
        is the whole map — every status honest.
      </p>
      <p className="mx-auto mb-10 max-w-[660px] text-center text-[13px] leading-relaxed text-[#8AA0B6]">
        “Live” means usable today (some tools are early prototypes).
        2027–2029 is the build roadmap; sequencing follows the sector and
        founding partners.
      </p>

      {/* 2026→2029 timeline */}
      <div className="mx-auto mb-10 max-w-[880px] px-1.5">
        <div className="relative flex items-start justify-between">
          <div
            aria-hidden="true"
            className="absolute top-2 right-[11%] left-[11%] h-0.5 opacity-45"
            style={{
              background:
                "linear-gradient(90deg,#4ECDC4,#FFB448,#7C9CFF,#C57BFF)",
            }}
          />
          {CAPABILITY_MILESTONES.map(([year, label, colour, live]) => (
            <div
              key={year}
              className="relative z-[1] flex-1 px-1 text-center"
            >
              <div
                aria-hidden="true"
                className="mx-auto mb-[9px] h-[18px] w-[18px] rounded-full"
                style={{
                  background: colour,
                  boxShadow: `0 0 0 4px #0C1C34, 0 0 14px ${colour}88`,
                }}
              />
              <p className="text-[17px] font-extrabold text-white">
                {year}
                {live && (
                  <span
                    className="ml-1 rounded px-[5px] py-px align-middle text-[8px] font-extrabold tracking-[1px]"
                    style={{ background: colour, color: "#06121F" }}
                  >
                    LIVE
                  </span>
                )}
              </p>
              <p className="mt-[3px] text-[11.5px] leading-snug font-semibold text-[#9FB3C8]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {CAPABILITY_GROUPS.map((group) =>
        group.open ? (
          <div key={group.badge} className="mb-[30px]">
            <div className="flex flex-wrap items-center gap-3">
              <GroupHeading group={group} />
              <span
                aria-hidden="true"
                className="h-px min-w-[30px] flex-1"
                style={{
                  background: `linear-gradient(90deg, ${group.c}55, transparent)`,
                }}
              />
            </div>
            <GroupGrid group={group} />
          </div>
        ) : (
          <details
            key={group.badge}
            className="group/fold mb-2.5 border-t border-white/[0.07] pt-3.5"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 outline-none [&::-webkit-details-marker]:hidden">
              <GroupHeading group={group} />
              <span aria-hidden="true" className="min-w-[20px] flex-1" />
              <span
                aria-hidden="true"
                className="text-base font-bold transition-transform group-open/fold:rotate-90"
                style={{ color: group.c }}
              >
                ▸
              </span>
            </summary>
            <GroupGrid group={group} />
          </details>
        ),
      )}
    </section>
  );
}

function GroupHeading({ group }: { group: CapabilityGroup }) {
  return (
    <>
      <span
        className="rounded-[999px] px-[11px] py-1 text-[13px] font-extrabold tracking-[1px]"
        style={{ background: group.c, color: "#06121F" }}
      >
        {group.badge}
      </span>
      <span className="text-xl font-extrabold text-white">{group.label}</span>
      <span className="text-sm text-[#7E93A8]">{group.sub}</span>
    </>
  );
}

function GroupGrid({ group }: { group: CapabilityGroup }) {
  return (
    <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
      {group.items.map((item) => (
        <div
          key={item.n}
          className="rounded-xl border border-white/[0.07] bg-[#0F1F38] px-[15px] py-3.5"
          style={{ borderLeft: `3px solid ${group.c}` }}
        >
          <p className="mb-1 text-[15px] font-extrabold text-white">
            {item.n}
          </p>
          <p className="text-[13px] leading-normal text-[#9FB3C8]">
            {itemDescription(item)}
          </p>
          {item.t && (
            <a
              href={`/${item.t}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-[999px] bg-teal px-[18px] py-2 text-[13px] font-extrabold tracking-[0.2px] text-[#06121F] no-underline shadow-[0_4px_14px_rgba(78,205,196,0.28)]"
            >
              Try it →
            </a>
          )}
          {item.j && !item.t && (
            <a
              href={item.j}
              className="mt-2 inline-block text-xs font-bold text-[#9FB3C8] no-underline hover:text-white"
            >
              View on page →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

/** Derive the archive count in the SoTL archive card (was "1,431"). */
function itemDescription(item: CapabilityItem): string {
  if (item.n === "SoTL archive") {
    return `The rescued national Learning & Teaching Repository — ${formatCount(SOTL_WORK_COUNT)} works, free.`;
  }
  return item.d;
}
