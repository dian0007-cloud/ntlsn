import { universityCount, eventCount } from "../data";

/**
 * Hero — matches production's dark-navy hero: pulsing status pill with the
 * credibility-critical "Live · Free · Open-source" badge (verbatim — asserted
 * in tests/smoke.spec.js test (b)), gradient headline, and live counts
 * derived from data/*.json rather than hardcoded copy (CLAUDE.md).
 */
export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden px-4 pb-20 pt-16 text-center sm:pt-24"
    >
      {/* soft background glows, decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[180px] h-[280px] w-[420px] rounded-full bg-purple/10 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[2.6px] text-teal/85">
          National Teaching &amp; Learning Sector Network
        </p>

        {/* Status pill — badge string is credibility-critical, keep verbatim. */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
          </span>
          <span className="text-sm text-white/60">
            Live · Free · Open-source
          </span>
        </div>

        <h1
          id="hero-heading"
          className="mx-auto mb-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          National Teaching &amp; Learning{" "}
          <span className="bg-gradient-to-r from-purple via-[#c66c3f] to-teal bg-clip-text text-transparent">
            Sector Network
          </span>
        </h1>

        <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-[#bca98f] sm:text-xl">
          Every symposium, workshop and PD opportunity across all{" "}
          {universityCount} universities — one page, one portal.
        </p>

        <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-[#a0907a]">
          Free for every educator. No logins, no paywalls. Open-source, owned
          by no one.
        </p>

        {/* Live proof — counts read from data/events.json + data/universities.json */}
        <ul className="flex flex-wrap items-center justify-center gap-3" role="list">
          <li className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#d9cdb6]">
            <span className="text-teal">{universityCount}</span> institutions
            mapped
          </li>
          <li className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#d9cdb6]">
            <span className="text-amber">{eventCount}</span> events on the
            sector calendar
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#events"
            className="rounded-full bg-teal px-6 py-3 text-sm font-extrabold text-navy shadow-[0_4px_14px_rgba(78,205,196,0.28)] transition-transform motion-safe:hover:-translate-y-0.5"
          >
            Explore events →
          </a>
          <a
            href="#resources"
            className="rounded-full border border-purple/50 px-6 py-3 text-sm font-bold text-purple transition-colors hover:bg-purple/10"
          >
            Browse resources
          </a>
        </div>
      </div>
    </section>
  );
}
