import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { approxSectionHeight } from "../sections";

/**
 * Code-splitting wrapper (PR-F, §1.3 JS budget): mounts a React.lazy band of
 * sections only when it is needed, so the band's chunk — component code AND
 * its big data modules (talks/frameworks/resourceHub/…) — stays off the
 * initial network trace.
 *
 * Load triggers, in order of arrival:
 *  1. IntersectionObserver, 1500px ahead of the viewport — the chunk is in
 *     flight well before the user can scroll to it.
 *  2. The URL hash targeting any id inside the band (initial load or
 *     hashchange) — deep links resolve even from the top of the page. After
 *     the chunk lands we re-anchor to the target, because the estimated stub
 *     heights place it only approximately.
 *
 * Until the chunk mounts, one stub <div> per canonical section id reserves
 * the section's approximate height (approxSectionHeight) and carries its id,
 * so (a) layout doesn't shift when real content lands (the swap happens off
 * screen) and (b) every #anchor and the megamenu's existence filter keep
 * resolving from first paint — exactly what production's always-present DOM
 * provided.
 */
export default function LazyBand({
  ids,
  band: Band,
  load,
}: {
  /** Canonical section ids inside this band, in SECTION_ORDER sequence. */
  ids: readonly string[];
  /** The React.lazy component for the band (created once, at module level). */
  band: LazyExoticComponent<ComponentType>;
  /** The same dynamic import the lazy component wraps (Vite dedupes). */
  load: () => Promise<{ default: ComponentType }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    if (wanted) return;
    const el = ref.current;
    if (!el) return;

    const onHash = () => {
      const target = window.location.hash.slice(1);
      if (!target || !ids.includes(target)) return;
      setWanted(true);
      // The stubs position the target only approximately; once the real band
      // has mounted, re-anchor so the deep link lands on the section itself.
      void load().then(() => {
        requestAnimationFrame(() => {
          document
            .getElementById(target)
            ?.scrollIntoView({ behavior: "auto", block: "start" });
        });
      });
    };
    onHash();
    window.addEventListener("hashchange", onHash);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setWanted(true);
      },
      { rootMargin: "1500px 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, [wanted, ids, load]);

  const stubs = (
    <>
      {ids.map((id) => (
        <div
          key={id}
          id={id}
          className="scroll-mt-20"
          style={{ minHeight: approxSectionHeight(id) }}
        />
      ))}
    </>
  );

  return (
    <div ref={ref}>
      {wanted ? <Suspense fallback={stubs}>{<Band />}</Suspense> : stubs}
    </div>
  );
}
