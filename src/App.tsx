import { lazy } from "react";
import Nav from "./components/Nav";
import Acknowledgement from "./components/Acknowledgement";
import Hero from "./components/Hero";
import NowBanner from "./components/NowBanner";
import StartGrid from "./components/StartGrid";
import FreshToday from "./components/FreshToday";
import Glance from "./components/Glance";
import NetworkSection from "./components/NetworkSection";
import LazyBand from "./components/LazyBand";
import Footer from "./components/Footer";
import { bandSlice } from "./sections";

/**
 * Code-splitting (PR-F, §1.3 budget: initial JS < 350KB): the page below the
 * front door is cut into seven lazy band chunks, each a contiguous slice of
 * SECTION_ORDER rendered by a component in src/bands/. The heavy data
 * modules (talks/frameworks/resourceHub/teachingResources/pathways/pd/
 * pricing/tools/…) are reachable ONLY through their band's dynamic import,
 * so they never land in the initial chunk. LazyBand loads each chunk via
 * IntersectionObserver 1500px ahead of the viewport (or immediately when the
 * URL hash targets an id inside the band) and reserves approximate heights
 * meanwhile, so anchors resolve from first paint and nothing shifts.
 *
 * IMPORTANT: App must never import from src/bands/ statically — that would
 * pull a band (and its data) back into the eager graph. The id slices are
 * re-derived here with the same bandSlice endpoints the bands themselves use.
 */
const BANDS = [
  {
    ids: bandSlice("yearview", "ntlsn-zoom"),
    band: lazy(() => import("./bands/CalendarBand")),
    load: () => import("./bands/CalendarBand"),
  },
  {
    ids: bandSlice("ntlsn-archive", "ntlsn-bestpractice"),
    band: lazy(() => import("./bands/KnowledgeBand")),
    load: () => import("./bands/KnowledgeBand"),
  },
  {
    ids: bandSlice("ntlsn-talkshub", "international-themes"),
    band: lazy(() => import("./bands/TalksBand")),
    load: () => import("./bands/TalksBand"),
  },
  {
    ids: bandSlice("frameworks", "ntlsn-guided"),
    band: lazy(() => import("./bands/FrameworksBand")),
    load: () => import("./bands/FrameworksBand"),
  },
  {
    // PR-G: the 13-section recognition band (all collapsed) is its own
    // chunk, split out of FrameworksBand so the ports never touch the
    // initial budget.
    ids: bandSlice("ntlsn-recognition", "ntlsn-rpcalc"),
    band: lazy(() => import("./bands/RecognitionBand")),
    load: () => import("./bands/RecognitionBand"),
  },
  {
    ids: bandSlice("architecture", "ntlsn-induction").filter(
      (id) => id !== "ntlsn-network",
    ),
    band: lazy(() => import("./bands/FabricBand")),
    load: () => import("./bands/FabricBand"),
  },
  {
    ids: bandSlice("ntlsn-advisory", "ntlsn-member"),
    band: lazy(() => import("./bands/MissionBand")),
    load: () => import("./bands/MissionBand"),
  },
] as const;

/**
 * App shell (TASKS.md 1.1): skip link → nav → Acknowledgement of Country →
 * single <main> containing the hero, the eager front-door band (PR-A:
 * nowbanner/startgrid/freshtoday/glance) and the six lazy bands covering the
 * rest of the canonical ntlsn-order sequence → footer (which owns the
 * static-nav block and the tiered licence bar, PR-F).
 *
 * A11y is built in — no runtime patch scripts: real skip link (2.4.1), one
 * <main> landmark, <a href> anchors with accessible names (2.4.4/4.1.2).
 */
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      <Acknowledgement />
      <main id="main-content">
        {/* Eager: hero + front-door band — everything above/at the fold. */}
        <Hero />
        <NowBanner />
        <StartGrid />
        <FreshToday />
        <Glance />
        {/* Launch: the interactive network graph — promoted to the front of the landing. */}
        <NetworkSection />
        {/* Lazy: the remaining 94 canonical slots, in seven band chunks. */}
        {BANDS.map((b) => (
          <LazyBand key={b.ids[0]} ids={b.ids} band={b.band} load={b.load} />
        ))}
      </main>
      <Footer />
    </>
  );
}
