import { useEffect, useRef, useState } from "react";
import {
  SYMSHOW_EMBED_URL,
  SYMSHOW_POSTER,
  SYMSHOW_SLIDES,
} from "../lib/symshow";

/** Slide auto-advance interval — production's 10s. */
const SLIDE_MS = 10000;

/**
 * #ntlsn-symshow — the "Coming soon · 2027" symposium showcase band
 * (Epic 1.2 PR-D), ported from the ntlsn-symshow-script patch: four
 * crossfading headlines over a muted looping background video
 * (youtube-nocookie), with dot navigation and a pause/play control.
 *
 * Motion policy, exactly as production: under prefers-reduced-motion the
 * iframe is never created (the static poster backdrop stands in), the
 * slide timer never starts, and no toggle button renders — dots still
 * switch slides manually. The iframe also lazy-loads only when the band
 * scrolls into view (the patch's data-ss-src arming script).
 */
export default function SymShowSection() {
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [slide, setSlide] = useState(0);
  const [videoOn, setVideoOn] = useState(true);
  const [armed, setArmed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Auto-advance (never under reduced motion).
  useEffect(() => {
    if (reduceMotion) return;
    timerRef.current = setInterval(
      () => setSlide((s) => (s + 1) % SYMSHOW_SLIDES.length),
      SLIDE_MS,
    );
    return () => clearInterval(timerRef.current);
  }, [reduceMotion]);

  // Lazy-arm the background video when the band becomes visible.
  useEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setArmed(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduceMotion]);

  const goTo = (i: number) => {
    setSlide(i);
    // Production resets the 10s timer on manual navigation.
    if (!reduceMotion && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(
        () => setSlide((s) => (s + 1) % SYMSHOW_SLIDES.length),
        SLIDE_MS,
      );
    }
  };

  return (
    <section
      id="ntlsn-symshow"
      ref={sectionRef}
      aria-label="Symposium showcase — coming 2027"
      className="relative min-h-[clamp(300px,44vh,480px)] w-full scroll-mt-20 overflow-hidden"
    >
      {/* Backdrop: poster always; video only when armed and motion is ok. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden bg-[#1B1430]"
        style={{
          backgroundImage: `url(${SYMSHOW_POSTER})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!reduceMotion && armed && videoOn && (
          <iframe
            title="NTLSN background video"
            src={SYMSHOW_EMBED_URL}
            allow="autoplay; encrypted-media"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[max(56.25vw,100vh)] w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2 border-0"
          />
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg,#211b14 0%,rgba(33, 27, 20,0) 14%,rgba(33, 27, 20,0) 86%,#211b14 100%),radial-gradient(140% 85% at 50% 12%,rgba(230,163,60,.16),transparent 55%),linear-gradient(180deg,rgba(44,28,46,.32) 0%,rgba(50,32,54,.5) 48%,rgba(26,17,32,.76) 100%)",
        }}
      />

      {SYMSHOW_SLIDES.map((s, i) => (
        <div
          key={s.h}
          aria-hidden={i !== slide}
          className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 py-11 text-center transition-opacity duration-[1600ms] ease-in-out"
          style={{ opacity: i === slide ? 1 : 0 }}
        >
          <p
            className="max-w-[920px] text-[clamp(26px,4.2vw,48px)] leading-[1.15] font-extrabold text-white"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,.45)" }}
          >
            {s.h}
          </p>
          <p
            className="mt-3.5 max-w-[700px] text-[clamp(15px,2vw,21px)] leading-normal text-white/85"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,.45)" }}
          >
            {s.s}
          </p>
        </div>
      ))}

      <div className="absolute top-3.5 right-0 left-0 z-[4] text-center">
        <span className="inline-block rounded-[999px] bg-amber px-[15px] py-[5px] text-xs font-extrabold tracking-[2px] text-[#19130d] uppercase shadow-[0_4px_18px_rgba(230,163,60,0.45)]">
          Coming soon · 2027
        </span>
      </div>
      <p className="absolute top-[50px] right-0 left-0 z-[3] text-center text-[11px] font-bold tracking-[2px] text-[#FFF7EB]/85 uppercase [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">
        <span aria-hidden="true" className="text-amber">
          ◆
        </span>{" "}
        An independent teaching &amp; learning commons
      </p>

      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setVideoOn((v) => !v)}
          aria-label={
            videoOn ? "Pause background video" : "Play background video"
          }
          title={videoOn ? "Pause background video" : "Play background video"}
          className="absolute right-4 bottom-3.5 z-[4] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-white/50 bg-[#08121F]/50 text-xs font-bold tracking-[1px] text-white"
        >
          <span aria-hidden="true">{videoOn ? "❚❚" : "▶"}</span>
        </button>
      )}

      <div
        role="group"
        aria-label="Showcase slides"
        className="absolute right-0 bottom-[18px] left-0 z-[2] flex justify-center gap-[9px]"
      >
        {SYMSHOW_SLIDES.map((s, i) => (
          <button
            key={s.h}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1} of ${SYMSHOW_SLIDES.length}`}
            aria-current={i === slide}
            className="h-[9px] w-[9px] cursor-pointer rounded-full transition-[background,transform] duration-300"
            style={{
              background: i === slide ? "#fff" : "rgba(255,255,255,.4)",
              transform: i === slide ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
