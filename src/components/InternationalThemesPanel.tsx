import { useState, type MouseEvent, type ReactNode } from "react";
import {
  INTERNATIONAL_THEMES,
  INTERNATIONAL_VIDEO_COUNT,
  filterThemeVideos,
  sourcesLine,
  youTubeId,
  type TalkVideo,
} from "../lib/talks";
import SearchField from "./SearchField";

/** Production shows 12 video cards before "Show all N videos ↓". */
const COLLAPSED_COUNT = 12;

/**
 * The bundle's id→lucide-glyph map for the international chip rail —
 * globe, bar chart, lightbulb, graduation cap, trend line, building,
 * monitor — inlined verbatim as JSX.
 */
const CHIP_ICONS: Readonly<Record<string, ReactNode>> = {
  issotl: (
    <ChipSvg>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </ChipSvg>
  ),
  "prog-assess": (
    <ChipSvg>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </ChipSvg>
  ),
  "active-learning": (
    <ChipSvg>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </ChipSvg>
  ),
  "advance-he": (
    <ChipSvg>
      <path d="M22 10v6" />
      <path d="M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
    </ChipSvg>
  ),
  educause: (
    <ChipSvg>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </ChipSvg>
  ),
  "global-centres": (
    <ChipSvg>
      <line x1="3" y1="21" x2="21" y2="21" />
      <path d="M5 21V8l7-4 7 4v13" />
      <line x1="9" y1="21" x2="9" y2="13" />
      <line x1="15" y1="21" x2="15" y2="13" />
    </ChipSvg>
  ),
  "jisc-uk": (
    <ChipSvg>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </ChipSvg>
  ),
};

/** The bundle's chip-label truncation: first 3 words + … when > 30 chars. */
function chipLabel(title: string): string {
  return title.length > 30 ? title.split(" ").slice(0, 3).join(" ") + "…" : title;
}

/**
 * #international-themes — "International SoTL" (Epic 1.2 PR-B): the global
 * curated collection, 7 themes × 83 talks (lib/talks.ts, verbatim from the
 * bundle). Chip rail with the bundle's lucide glyphs and truncated labels,
 * search within the active theme, banner with derived counts, whole-card
 * link grid with the "▶ Watch" affordance, the 12-card fold, and the
 * attribution line.
 *
 * NOTE: the header copy says "across six themes" while the data has seven
 * (Jisc was added after the copy was written). Ported verbatim — fixing
 * production copy is not this PR's call.
 */
export default function InternationalThemesPanel({
  labelledBy,
  hidden,
  onVideoClick,
}: {
  labelledBy: string;
  hidden: boolean;
  /** Opens YouTube/Vimeo links in the on-site lightbox. */
  onVideoClick: (e: MouseEvent<HTMLAnchorElement>, video: TalkVideo) => void;
}) {
  const [activeId, setActiveId] = useState(INTERNATIONAL_THEMES[0].id);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const theme =
    INTERNATIONAL_THEMES.find((t) => t.id === activeId) ??
    INTERNATIONAL_THEMES[0];
  const videos = filterThemeVideos(theme, query);
  const visible = expanded ? videos : videos.slice(0, COLLAPSED_COUNT);

  return (
    <section
      id="international-themes"
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className="relative scroll-mt-20 border-y border-white/[0.04] bg-[#271f16]/70 px-4 py-24"
    >
      <div id="reveal-intl-themes" className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume IX
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Global Perspectives
          </p>
          <h3 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            International SoTL
          </h3>
          {/* The ntlsn-secanim globe doodle — decorative, reduced-motion safe. */}
          <div aria-hidden="true" className="mb-2 flex justify-center">
            <svg width="56" height="56" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="17"
                fill="none"
                stroke="#8fb081"
                strokeWidth="1.6"
                opacity=".55"
              />
              <line
                x1="15"
                y1="32"
                x2="49"
                y2="32"
                stroke="#8fb081"
                strokeWidth="1.3"
                opacity=".4"
              />
              <ellipse
                className="na-spin"
                cx="32"
                cy="32"
                rx="7"
                ry="17"
                fill="none"
                stroke="#8fb081"
                strokeWidth="1.4"
                opacity=".65"
              />
            </svg>
          </div>
          <p className="mx-auto max-w-3xl text-lg text-white/50">
            {INTERNATIONAL_VIDEO_COUNT} curated talks from ISSoTL, Advance HE
            UK, EDUCAUSE, and leading centres at Yale, Oxford, UCL, UBC and
            beyond — bring the world's best SoTL thinking home, across six
            themes.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {INTERNATIONAL_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={t.id === activeId}
              onClick={() => {
                setActiveId(t.id);
                setExpanded(false);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                t.id === activeId
                  ? "bg-teal text-navy shadow-lg shadow-teal/20"
                  : "border border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
              }`}
            >
              <span aria-hidden="true" className="mr-1.5 inline-flex items-center">
                {CHIP_ICONS[t.id] ?? t.icon}
              </span>
              {chipLabel(t.title)}
            </button>
          ))}
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search international videos — try “WIL”"
          label="Search international videos"
        />

        <div>
          <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-teal/5 to-transparent p-6">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="text-3xl">
                {theme.icon}
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold">{theme.title}</h4>
                <p className="mb-3 text-sm font-medium text-teal/70">
                  {theme.subtitle}
                </p>
                <p className="text-sm leading-relaxed text-white/50">
                  {theme.blurb}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-md border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/40">
                {videos.length} videos
              </span>
              <span aria-hidden="true" className="text-[10px] text-white/20">
                |
              </span>
              <span className="text-[10px] text-white/30">
                Sources: {sourcesLine(videos)}
              </span>
            </div>
          </div>

          <ul className="grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((v) => (
              <li key={v.title + v.url}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => onVideoClick(e, v)}
                  className="group block rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-teal/20 hover:bg-white/[0.05]"
                >
                  <span className="flex items-start gap-3">
                    <Thumb url={v.url} />
                    <span className="min-w-0">
                      <span className="mb-1 block text-sm leading-snug font-medium text-white/80 transition-colors group-hover:text-teal">
                        {v.title}
                      </span>
                      <span className="mb-2 block text-[11px] leading-relaxed text-white/30">
                        {v.note}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30">
                          {v.org}
                        </span>
                        <span className="text-[10px] text-teal/40 transition-colors group-hover:text-teal/70">
                          ▶ Watch
                        </span>
                      </span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {videos.length > COLLAPSED_COUNT && (
            <div className="mt-6 text-center">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded(!expanded)}
                className="rounded-full bg-white/5 px-6 py-2 text-sm font-medium text-white/50 transition-all hover:bg-white/10 hover:text-white/70"
              >
                {expanded ? "Show fewer ↑" : `Show all ${videos.length} videos ↓`}
              </button>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-[10px] text-white/20 italic">
          International multimedia curated from publicly available lectures,
          webinars, and institutional recordings. Thematic synthesis by Dr Seb
          Dianati. All videos remain the intellectual property of their
          respective organisations. CC BY-NC-SA 4.0 applies to the curation
          and thematic analysis only.
        </p>
      </div>
    </section>
  );
}

/** Shared 16×16 stroke-icon wrapper for the chip glyphs. */
function ChipSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block align-[-3px]"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** 92px YouTube thumbnail, or the red YouTube glyph when there's no id. */
function Thumb({ url }: { url: string }) {
  const id = youTubeId(url);
  if (!id) {
    return (
      <svg
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-red-500/70"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="relative mt-0.5 block w-[92px] shrink-0 overflow-hidden rounded"
      style={{ aspectRatio: "16/9" }}
    >
      <img
        src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-black/55 text-[10px] text-white">
          ▶
        </span>
      </span>
    </span>
  );
}
