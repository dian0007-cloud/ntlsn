import { useRef, useState } from "react";
import { FEATURED_TALKS } from "../lib/featuredTalks";

/**
 * #featured-talks — the "Featured Talks" carousel (Epic 1.2 PR-B), ported
 * from the anonymous "NTLSN Featured Talks carousel" patch script. The
 * bundle rendered this section empty; the patch filled it with a
 * scroll-snap rail of 25 hard-coded YouTube talks (lib/featuredTalks.ts,
 * verbatim) plus round prev/next buttons.
 *
 * Divergence by design (PR-B brief): the patch's cards were plain links to
 * youtube.com; here each card is a click-to-load facade — thumbnail + play
 * button, keyboard-activatable, named after the talk — that swaps in a
 * youtube-nocookie.com iframe only on activation (CSP frame-src already
 * allows it). No third-party requests happen until the visitor asks for
 * the video (the thumbnails stay on img.youtube.com exactly as the patch
 * loaded them).
 */
export default function FeaturedTalksPanel({
  labelledBy,
  hidden,
}: {
  labelledBy: string;
  hidden: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<ReadonlySet<string>>(new Set());

  function scrollTrack(direction: -1 | 1) {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    trackRef.current?.scrollBy({
      left: 620 * direction,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <section
      id="featured-talks"
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className="relative scroll-mt-20 px-4 py-16"
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-[18px] flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.28em] text-teal uppercase">
              ▶ Featured Talks
            </p>
            <h3 className="mt-1 text-[26px] font-extrabold text-white">
              Watch the sector, on the sector
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous featured talks"
              onClick={() => scrollTrack(-1)}
              className="h-10 w-10 cursor-pointer rounded-full border border-white/15 bg-white/5 text-lg text-white transition-colors hover:bg-white/10"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next featured talks"
              onClick={() => scrollTrack(1)}
              className="h-10 w-10 cursor-pointer rounded-full border border-white/15 bg-white/5 text-lg text-white transition-colors hover:bg-white/10"
            >
              ›
            </button>
          </div>
        </div>
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2.5"
        >
          {FEATURED_TALKS.map((talk) => (
            <div
              key={talk.youtubeId}
              className="w-[280px] flex-none snap-start"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                {playing.has(talk.youtubeId) ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${talk.youtubeId}?autoplay=1&rel=0`}
                    title={talk.title}
                    className="block h-full w-full border-0"
                    allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    aria-label={`Play: ${talk.title}`}
                    onClick={() =>
                      setPlaying((prev) =>
                        new Set(prev).add(talk.youtubeId),
                      )
                    }
                    className="group block h-full w-full cursor-pointer"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${talk.youtubeId}/mqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-[#0A1628]/60 text-base text-white transition-colors group-hover:bg-teal/80 group-hover:text-navy"
                      >
                        ▶
                      </span>
                    </span>
                  </button>
                )}
              </div>
              <p className="mt-2.5 line-clamp-2 text-sm leading-[1.35] font-semibold text-white">
                {talk.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
