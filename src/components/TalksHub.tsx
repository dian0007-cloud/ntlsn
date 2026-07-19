import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import SectorThemesPanel from "./SectorThemesPanel";
import InternationalThemesPanel from "./InternationalThemesPanel";
import FeaturedTalksPanel from "./FeaturedTalksPanel";
import VideoLightbox, { lightboxEmbedSrc } from "./VideoLightbox";
import type { TalkVideo } from "../lib/talks";

/**
 * The three streams — same ids and labels as the ntlsn-talkshub-script
 * patch's TABS array. The ids are the absorbed sections' canonical anchor
 * ids: each tabpanel below carries its production id, so deep links
 * (#sector-themes, #international-themes, #featured-talks) keep working —
 * arriving on one of them selects its tab (see the hash effect).
 */
const TABS = [
  { id: "sector-themes", label: "From the Sector" },
  { id: "international-themes", label: "International" },
  { id: "featured-talks", label: "Featured" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isTabId = (v: string): v is TabId => TABS.some((t) => t.id === v);

/**
 * #ntlsn-talkshub — the Talks Hub (Epic 1.2 PR-B): the tab shell the
 * ntlsn-talkshub-script patch built by re-parenting #sector-themes,
 * #international-themes and #featured-talks into one section, rebuilt as a
 * real tabbed component. Header, the two CTA pills (learning modules /
 * missed-it) and the three streams are production's arrangement.
 *
 * A11y is built in (WCAG 2.2 AA, no runtime patches): a real
 * role=tablist/tab/tabpanel structure with roving tabindex and
 * Left/Right/Home/End arrow-key navigation (selection follows focus), and
 * the on-site video lightbox (ported from the anonymous lightbox patch) is
 * owned here so every YouTube/Vimeo talk in any tab plays on-site.
 *
 * Not ported (cross-cutting, later PRs): the cfold "node spine" collapse
 * wrapper (ntlsn-collapseall — pending Seb's call, stocktake decision 2)
 * and the sectionstats strip (ntlsn-sectionstats-script, PR-F).
 */
export default function TalksHub() {
  const [active, setActive] = useState<TabId>("sector-themes");
  const [lightbox, setLightbox] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const tabRefs = useRef(new Map<TabId, HTMLButtonElement>());
  const hubRef = useRef<HTMLElement>(null);

  // Deep links into the absorbed sections select their tab (production's
  // hidden-section anchors couldn't even scroll; this lands somewhere
  // sensible, per the PR-B brief).
  useEffect(() => {
    function onHash() {
      const id = window.location.hash.slice(1);
      if (!isTabId(id)) return;
      setActive(id);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      hubRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function onTablistKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const index = TABS.findIndex((t) => t.id === active);
    let next: number;
    switch (e.key) {
      case "ArrowRight":
        next = (index + 1) % TABS.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + TABS.length) % TABS.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = TABS.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const id = TABS[next].id;
    setActive(id);
    tabRefs.current.get(id)?.focus();
  }

  /** Intercept plain left-clicks on YouTube/Vimeo links → on-site lightbox. */
  const onVideoClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, video: TalkVideo) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return; // let new-tab/window gestures behave natively
      const src = lightboxEmbedSrc(video.url);
      if (!src) return; // not YouTube/Vimeo — navigate as normal
      e.preventDefault();
      setLightbox({ src, title: video.title });
    },
    [],
  );

  return (
    <section
      ref={hubRef}
      id="ntlsn-talkshub"
      aria-labelledby="talkshub-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 pt-[54px] pb-2"
    >
      <div className="mx-auto mb-[18px] max-w-[880px] text-center">
        <p className="mb-2.5 text-[11px] font-extrabold tracking-[1.6px] text-teal uppercase">
          Talks &amp; recordings
        </p>
        <h2
          id="talkshub-heading"
          className="mb-1.5 text-[clamp(24px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
        >
          Watch the sector, from the sector.
        </h2>
        <p className="text-sm text-white/60">
          Curated talks &amp; recordings — domestic, international and
          featured. Pick a stream.
        </p>
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5">
          <a
            href="/learning-modules.html"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-teal to-[#c66c3f] px-5 py-2.5 text-[13.5px] font-extrabold text-[#06251f] no-underline"
          >
            <span aria-hidden="true">🎬</span> Turn these into learning
            modules →
          </a>
          <a
            href="/missed-it.html"
            className="inline-flex items-center gap-[7px] rounded-full border border-white/15 bg-[#0f2034] px-[18px] py-2.5 text-[13.5px] font-extrabold text-[#d9cdb6] no-underline"
          >
            <span aria-hidden="true">⏪</span> Catch up on a recent event →
          </a>
        </div>
        <div
          role="tablist"
          aria-label="Talks and recordings streams"
          onKeyDown={onTablistKeyDown}
          className="mt-4 inline-flex flex-wrap justify-center gap-2"
        >
          {TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el);
                  else tabRefs.current.delete(tab.id);
                }}
                type="button"
                role="tab"
                id={`talkstab-${tab.id}`}
                aria-selected={selected}
                aria-controls={tab.id}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
                  selected
                    ? "border-teal bg-teal text-[#06251f]"
                    : "border-white/15 bg-transparent text-[#d9cdb6] hover:border-white/30"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <SectorThemesPanel
        labelledBy="talkstab-sector-themes"
        hidden={active !== "sector-themes"}
        onVideoClick={onVideoClick}
      />
      <InternationalThemesPanel
        labelledBy="talkstab-international-themes"
        hidden={active !== "international-themes"}
        onVideoClick={onVideoClick}
      />
      <FeaturedTalksPanel
        labelledBy="talkstab-featured-talks"
        hidden={active !== "featured-talks"}
      />

      {lightbox && (
        <VideoLightbox
          src={lightbox.src}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
