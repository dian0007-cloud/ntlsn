import { useState, type MouseEvent } from "react";
import {
  SECTOR_CHIP_LABELS,
  SECTOR_THEMES,
  SECTOR_VIDEO_COUNT,
  filterThemeVideos,
  sourcesLine,
  youTubeId,
  type TalkVideo,
} from "../lib/talks";
import SearchField from "./SearchField";

/** Production shows 12 video cards before "Show all N videos ↓". */
const COLLAPSED_COUNT = 12;

/**
 * #sector-themes — "From the Sector" (Epic 1.2 PR-B): the domestic curated
 * video collection, 12 themes × 286 talks (lib/talks.ts, verbatim from the
 * bundle). Theme chip rail, search within the active theme (title/note/org,
 * the bundle's rule), gradient theme banner with derived counts and the
 * "Sources:" line, the 2/3-column card grid with in-memory Watch/Save
 * toggles, the 12-card fold, and the CC BY-NC-SA attribution line.
 *
 * Deliberate divergences: the "Personalise Your Experience" 3-question quiz
 * is NOT ported here — it is cross-cutting bundle state (its answers also
 * re-rank the frameworks section), so it belongs to a later PR, not to this
 * tab. The ntlsn-crosslink "Code your SoTL data →" chip is likewise left to
 * the cross-cutting pass (PR-F).
 */
export default function SectorThemesPanel({
  labelledBy,
  hidden,
  onVideoClick,
}: {
  labelledBy: string;
  hidden: boolean;
  /** Opens YouTube/Vimeo links in the on-site lightbox. */
  onVideoClick: (e: MouseEvent<HTMLAnchorElement>, video: TalkVideo) => void;
}) {
  const [activeId, setActiveId] = useState(SECTOR_THEMES[0].id);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set());
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());

  const theme = SECTOR_THEMES.find((t) => t.id === activeId) ?? SECTOR_THEMES[0];
  const videos = filterThemeVideos(theme, query);
  const visible = expanded ? videos : videos.slice(0, COLLAPSED_COUNT);

  function toggle(
    set: ReadonlySet<string>,
    update: (next: ReadonlySet<string>) => void,
    url: string,
  ) {
    const next = new Set(set);
    if (next.has(url)) next.delete(url);
    else next.add(url);
    update(next);
  }

  return (
    <section
      id="sector-themes"
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className="relative scroll-mt-20 border-t border-white/[0.03] px-4 py-24"
    >
      <div id="reveal-themes" className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume VIII
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Emerging Directions
          </p>
          <h3 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            From the Sector
          </h3>
          {/* The ntlsn-secanim pulse doodle — decorative, reduced-motion safe. */}
          <div aria-hidden="true" className="mb-2 flex justify-center">
            <svg width="56" height="56" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="5" fill="#8fb081" />
              <circle
                className="na-pulse"
                cx="32"
                cy="32"
                r="5"
                fill="none"
                stroke="#8fb081"
                strokeWidth="2"
              />
              <circle
                className="na-pulse na-pulse-late"
                cx="32"
                cy="32"
                r="5"
                fill="none"
                stroke="#8fb081"
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="mx-auto max-w-3xl text-lg text-white/50">
            {SECTOR_VIDEO_COUNT} curated talks and recordings from CRADLE,
            ASCILITE, HERDSA, CAULLT, ACODE, TEQSA, WIL Australia, CAUL and
            beyond — a way to learn SoTL from the sector itself, across twelve
            themes. New to a topic? Start watching.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {SECTOR_THEMES.map((t) => (
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
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              <span aria-hidden="true" className="mr-1.5">
                {t.icon}
              </span>
              {SECTOR_CHIP_LABELS[t.id] ?? t.id}
            </button>
          ))}
        </div>

        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search sector theme videos — try “Indigenous pedagogies”"
          label="Search sector theme videos"
        />

        <div>
          <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-teal/10 via-[#c66c3f]/10 to-purple/10 p-6">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="text-4xl">
                {theme.icon}
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold text-white">
                  {theme.title}
                </h4>
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
              <li
                key={v.title + v.url}
                className={`group rounded-xl border p-5 transition-all hover:shadow-[0_0_30px_rgba(78,205,196,0.08)] ${
                  watched.has(v.url)
                    ? "border-teal/10 bg-teal/[0.03]"
                    : "border-white/5 bg-white/[0.03] hover:border-teal/30 hover:bg-white/[0.06]"
                }`}
              >
                <a
                  href={v.url || "#"}
                  target={v.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => onVideoClick(e, v)}
                >
                  <span className="mb-3 flex items-start gap-3">
                    <Thumb url={v.url} />
                    <span className="flex-1 text-sm leading-tight font-semibold text-white/80 group-hover:text-white">
                      {v.title}
                    </span>
                  </span>
                  <span className="mb-3 line-clamp-2 block text-xs leading-relaxed text-white/40">
                    {v.note}
                  </span>
                </a>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-teal/50">
                    {v.org}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={watched.has(v.url)}
                      aria-label={`Mark as watched: ${v.title}`}
                      onClick={() => toggle(watched, setWatched, v.url)}
                      className={`rounded-full px-2 py-0.5 text-[10px] transition-all ${
                        watched.has(v.url)
                          ? "bg-[#c66c3f]/20 text-[#c66c3f]"
                          : "bg-white/5 text-white/20 hover:text-white/40"
                      }`}
                    >
                      {watched.has(v.url) ? "✓ Watched" : "○ Watch"}
                    </button>
                    <button
                      type="button"
                      aria-pressed={saved.has(v.url)}
                      aria-label={`Save for later: ${v.title}`}
                      onClick={() => toggle(saved, setSaved, v.url)}
                      className={`rounded-full px-2 py-0.5 text-[10px] transition-all ${
                        saved.has(v.url)
                          ? "bg-coral/20 text-coral"
                          : "bg-white/5 text-white/20 hover:text-white/40"
                      }`}
                    >
                      {saved.has(v.url) ? "♥ Saved" : "♡ Save"}
                    </button>
                  </div>
                </div>
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
          Multimedia curated from publicly available webinars, seminar
          recordings, and SIG meetings. Thematic synthesis by Dr Seb Dianati.
          All videos remain the intellectual property of their respective
          organisations. CC BY-NC-SA 4.0 applies to the curation and thematic
          analysis only.
        </p>
      </div>
    </section>
  );
}

/** 96px YouTube thumbnail, or the red YouTube glyph when there's no video id. */
function Thumb({ url }: { url: string }) {
  const id = url ? youTubeId(url) : null;
  if (!id) {
    return (
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10"
      >
        <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="relative mt-0.5 block w-24 shrink-0 overflow-hidden rounded-lg"
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
