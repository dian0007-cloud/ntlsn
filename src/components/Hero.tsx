import { useEffect, useRef, useState } from "react";
import { universityCount, eventCount } from "../data";

/**
 * Count-up animation: 0 → target over `duration` ms on mount, easeOutExpo for a
 * lively settle. Instant (no rAF) under prefers-reduced-motion so the final
 * number shows immediately — the a11y-correct way to animate numbers.
 */
function useCountUp(target: number, duration = 1500): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target <= 0) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      setValue(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);
  return value;
}

const fmt = (n: number) => n.toLocaleString("en-AU");

/**
 * Hero — matches production's dark hero: pulsing status pill with the
 * credibility-critical "Live · Free · Open-source" badge (verbatim — asserted
 * in tests/smoke.spec.js test (b)), gradient headline, and live counts
 * derived from data/*.json rather than hardcoded copy (CLAUDE.md).
 *
 * Launch polish (UNE 2026): the headline accent ("Sector Network") uses a
 * vivid amber→coral→sage gradient with a slow shimmer, and the three proof
 * counts count up from 0 on load (reduced-motion: instant). The SoTL works
 * count is the build-time baked total (vite.config.ts), the credibility flex.
 */
export default function Hero() {
  const unis = useCountUp(universityCount);
  const events = useCountUp(eventCount);
  const sotlWorks = useCountUp(__NTLSN_SOTL_WORKS__);

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
          <span className="bg-gradient-to-r from-amber via-coral to-teal bg-clip-text bg-[length:200%_auto] text-transparent animate-hero-shimmer">
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

        {/* Live proof — counts read from data/events.json + data/universities.json,
            animated 0 → total on load (reduced-motion: instant). */}
        <ul className="flex flex-wrap items-center justify-center gap-3" role="list">
          <li className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#d9cdb6]">
            <span className="text-teal tabular-nums">{fmt(unis)}</span>{" "}
            universities mapped
          </li>
          <li className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#d9cdb6]">
            <span className="text-amber tabular-nums">{fmt(events)}</span> live
            sector events
          </li>
          <li className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-[#d9cdb6]">
            <span className="tabular-nums text-[#c9a962]">{fmt(sotlWorks)}</span>{" "}
            indexed SoTL works
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#events"
            className="rounded-full bg-teal px-6 py-3 text-sm font-extrabold text-navy shadow-[0_4px_14px_rgba(143,176,129,0.28)] transition-transform motion-safe:hover:-translate-y-0.5"
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
