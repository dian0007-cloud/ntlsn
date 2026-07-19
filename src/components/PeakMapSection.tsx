import { useState } from "react";
import { CAT_Y, PEAK_BODIES, PEAK_CATEGORIES, PEAK_Y } from "../lib/peakmap";

/**
 * #ntlsn-peakmap — "How the peak bodies thread the sector together."
 * (Epic 1.2 PR-D), ported from the ntlsn-peakmap-script patch: each peak
 * body threads to all three sector categories; hovering (or keyboard
 * focusing — an upgrade on the patch's hover-only affordance) a body
 * highlights its edges. Category nodes are real links, as in production
 * (the patch's Institutions anchor pointed at the bundle's hidden #network
 * section — corrected to #ntlsn-network, the section people actually see).
 */
export default function PeakMapSection() {
  const [hot, setHot] = useState<number | null>(null);

  return (
    <section
      id="ntlsn-peakmap"
      aria-labelledby="ntlsn-peakmap-heading"
      className="relative scroll-mt-20 px-6 py-[54px]"
    >
      <div className="mx-auto max-w-[960px]">
        <div className="mb-[18px] text-center">
          <p className="mb-2.5 text-xs font-extrabold tracking-[0.16em] text-teal uppercase">
            ◇ The connective tissue
          </p>
          <h2
            id="ntlsn-peakmap-heading"
            className="mb-2 text-[clamp(24px,3.6vw,36px)] font-extrabold text-white"
          >
            How the peak bodies thread the sector together.
          </h2>
          <p className="mx-auto max-w-[60ch] text-[15px] text-white/55">
            CAULLT, HERDSA and ASCILITE don&rsquo;t sit to one side — each
            one runs through the institutions, the recognition pathways and
            the partnerships. Hover a body to trace its reach.
          </p>
        </div>

        <svg
          viewBox="0 0 880 480"
          className="mx-auto block w-full max-w-[880px]"
          role="img"
          aria-label="Peak bodies connect to institutions, recognition and partnerships"
        >
          {PEAK_BODIES.map((_, p) =>
            PEAK_CATEGORIES.map((_, c) => {
              const on = hot === p;
              const dim = hot !== null && !on;
              return (
                <path
                  key={`${p}-${c}`}
                  d={`M250,${PEAK_Y[p]} C430,${PEAK_Y[p]} 460,${CAT_Y[c]} 640,${CAT_Y[c]}`}
                  fill="none"
                  stroke="#8fb081"
                  strokeOpacity={on ? 0.85 : dim ? 0.06 : 0.18}
                  strokeWidth={on ? 2.4 : dim ? 1.4 : 1.6}
                />
              );
            }),
          )}
          {PEAK_BODIES.map(([name, role], p) => (
            <g
              key={name}
              tabIndex={0}
              role="img"
              aria-label={`${name} — ${role}; threads to institutions, recognition and partnerships`}
              onMouseEnter={() => setHot(p)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(p)}
              onBlur={() => setHot(null)}
            >
              <rect
                x={34}
                y={PEAK_Y[p] - 29}
                width={216}
                height={58}
                rx={13}
                fill={
                  hot === p ? "rgba(78,205,196,.22)" : "rgba(78,205,196,.10)"
                }
                stroke="rgba(78,205,196,.45)"
              />
              <text
                x={142}
                y={PEAK_Y[p] - 3}
                textAnchor="middle"
                fontSize={17}
                fontWeight={800}
                fill="#fff"
              >
                {name}
              </text>
              <text
                x={142}
                y={PEAK_Y[p] + 15}
                textAnchor="middle"
                fontSize={11}
                fill="#b3a48c"
              >
                {role}
              </text>
            </g>
          ))}
          {PEAK_CATEGORIES.map(([emoji, label, href], c) => (
            <a key={label} href={href} aria-label={`${label} — open`}>
              <rect
                x={640}
                y={CAT_Y[c] - 29}
                width={206}
                height={58}
                rx={13}
                fill="rgba(230,163,60,.10)"
                stroke="rgba(230,163,60,.4)"
              />
              <text x={664} y={CAT_Y[c] + 6} fontSize={22} aria-hidden="true">
                {emoji}
              </text>
              <text
                x={698}
                y={CAT_Y[c] + 5}
                fontSize={16}
                fontWeight={800}
                fill="#fff"
              >
                {label}
              </text>
            </a>
          ))}
        </svg>
      </div>
    </section>
  );
}
