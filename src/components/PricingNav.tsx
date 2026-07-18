import { useEffect, useRef, useState } from "react";
import { PRICINGNAV_SLIDES } from "../lib/pricing";

/**
 * #ntlsn-pricingnav — "Everything free. The rest just keeps it that way."
 * (Epic 1.2 PR-E), ported from the ntlsn-pricingnav-script patch: the
 * five-slide deck above #pricing (free-forever first — "The main thing").
 * Production gave it no ntlsn-order row; the script inserted it directly
 * before #pricing, mirrored by its SECTION_ORDER slot.
 *
 * A11y (established PR conventions): the auto-advance pauses on hover AND
 * focus-within, and never starts under prefers-reduced-motion; dots and
 * arrows are real buttons with names; the stage is a labelled group with
 * aria-live so slide changes are announced politely.
 */
export default function PricingNav() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const count = PRICINGNAV_SLIDES.length;
  const go = (i: number) => setCurrent(((i % count) + count) % count);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (paused || reduced) return;
    timer.current = setInterval(
      () => setCurrent((c) => (c + 1) % count),
      6000,
    );
    return () => clearInterval(timer.current);
  }, [paused, count]);

  const slide = PRICINGNAV_SLIDES[current];
  const accent = slide.main ? "#4ECDC4" : "#7C9CFF";

  return (
    <section
      id="ntlsn-pricingnav"
      aria-labelledby="ntlsn-pricingnav-heading"
      className="relative mx-auto max-w-[92rem] scroll-mt-20 px-6 pt-14 pb-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto mb-[18px] max-w-[760px] text-center">
        <p className="mb-2.5 text-[11px] font-extrabold tracking-[1.7px] text-teal uppercase">
          Free for everyone · paid only to sustain it
        </p>
        <h2
          id="ntlsn-pricingnav-heading"
          className="text-[clamp(24px,3.4vw,38px)] leading-[1.14] font-extrabold text-white"
        >
          Everything free. The rest just keeps it that way.
        </h2>
      </div>

      <div
        role="group"
        aria-label={`Slide ${current + 1} of ${count}`}
        aria-live="polite"
        className="relative mx-auto min-h-[230px] max-w-[660px]"
      >
        <a
          href={slide.href}
          className="block rounded-[18px] px-6 py-[26px] text-center no-underline shadow-[0_14px_40px_rgba(0,0,0,0.3)] transition-all duration-200"
          style={{
            background: slide.main
              ? "linear-gradient(180deg,#10362F,#0F2138)"
              : "linear-gradient(180deg,#13294A,#0F2138)",
            border: `1px solid ${slide.main ? "#3A7A6F" : "#2C4A63"}`,
            borderTop: `3px solid ${accent}`,
          }}
        >
          {slide.main ? (
            <span className="mb-3 inline-block rounded-full bg-teal px-[11px] py-[3px] text-[10px] font-extrabold tracking-[1px] text-[#06231F] uppercase">
              The main thing
            </span>
          ) : null}
          <span aria-hidden="true" className="mb-2 block text-[30px]">
            {slide.icon}
          </span>
          <span className="mb-2 block text-[clamp(20px,2.6vw,26px)] font-extrabold text-white">
            {slide.title}
          </span>
          <span className="mx-auto block max-w-[48ch] text-[14.5px] leading-relaxed text-[#AEBFCE]">
            {slide.desc}
          </span>
          <span
            className="mt-3.5 block text-[13px] font-bold"
            style={{ color: accent }}
          >
            {slide.cta} →
          </span>
        </a>
      </div>

      <div className="mt-[18px] flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(current - 1)}
          className="h-[38px] w-[38px] cursor-pointer rounded-full border border-white/[0.12] bg-[#0f1f3a] text-lg text-[#9FB0C3]"
        >
          ‹
        </button>
        <div className="flex items-center gap-[7px]">
          {PRICINGNAV_SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => go(i)}
              className="h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-200"
              style={{
                width: i === current ? 22 : 8,
                background:
                  i === current
                    ? s.main
                      ? "#4ECDC4"
                      : "#7C9CFF"
                    : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(current + 1)}
          className="h-[38px] w-[38px] cursor-pointer rounded-full border border-white/[0.12] bg-[#0f1f3a] text-lg text-[#9FB0C3]"
        >
          ›
        </button>
      </div>
    </section>
  );
}
