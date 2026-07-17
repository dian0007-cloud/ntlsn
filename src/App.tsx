import { Fragment } from "react";
import Nav from "./components/Nav";
import Acknowledgement from "./components/Acknowledgement";
import Hero from "./components/Hero";
import SectionPlaceholder from "./components/SectionPlaceholder";
import EventsSection from "./components/EventsSection";
import ConferencesSection from "./components/ConferencesSection";
import YearView from "./components/YearView";
import MapSection from "./components/MapSection";
import DirectorySection from "./components/DirectorySection";
import PDSection from "./components/PDSection";
import ResourceHubSection from "./components/ResourceHubSection";
import TeachingResourcesSection from "./components/TeachingResourcesSection";
import DueSoon from "./components/DueSoon";
import NowBanner from "./components/NowBanner";
import TalksHub from "./components/TalksHub";
import LatestFeed from "./components/LatestFeed";
import StartGrid from "./components/StartGrid";
import Glance from "./components/Glance";
import FreshToday from "./components/FreshToday";
import SotlGrantsSection from "./components/SotlGrantsSection";
import FrameworksSection from "./components/FrameworksSection";
import EvidenceSection from "./components/EvidenceSection";
import OerSection from "./components/OerSection";
import ArchiveSection from "./components/ArchiveSection";
import RepositorySection from "./components/RepositorySection";
import JournalSection from "./components/JournalSection";
import BestPracticeSection from "./components/BestPracticeSection";
import ZoomShareSection from "./components/ZoomShareSection";
import BenchmarksPartial from "./components/BenchmarksPartial";
import Footer from "./components/Footer";
import { SECTION_ORDER } from "./sections";

/**
 * App shell (TASKS.md 1.1): skip link → nav → Acknowledgement of Country →
 * single <main> containing the hero and every canonical section (exact
 * production ids, exact ntlsn-order sequence) → footer.
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
        <Hero />
        {SECTION_ORDER.filter((id) => id !== "hero").map((id) => {
          // Ported sections replace their placeholders one at a time
          // (TASKS.md 1.2); everything else stays a placeholder.
          // PR-A "Front door" (docs/rebuild-stocktake.md): the four sections
          // between the hero and the year view. StartGrid also renders the
          // #ntlsn-hubdoors rail as its trailing sibling, exactly where the
          // production self-healing script parked it.
          if (id === "ntlsn-nowbanner") return <NowBanner key={id} />;
          if (id === "ntlsn-startgrid") return <StartGrid key={id} />;
          if (id === "ntlsn-freshtoday") return <FreshToday key={id} />;
          if (id === "ntlsn-glance") return <Glance key={id} />;
          if (id === "yearview") return <YearView key={id} />;
          if (id === "events") return <EventsSection key={id} />;
          // PR-C "Knowledge layer" (docs/rebuild-stocktake.md): sotl-grants,
          // frameworks (+gp-fw waypoints) and the evidence section are
          // bundle-rendered ports; oer/archive/repository/journal/
          // bestpractice/zoom are their patch-script injectors translated.
          if (id === "sotl-grants") return <SotlGrantsSection key={id} />;
          if (id === "frameworks") return <FrameworksSection key={id} />;
          if (id === "ntlsn-evidence") return <EvidenceSection key={id} />;
          if (id === "ntlsn-oer") return <OerSection key={id} />;
          if (id === "ntlsn-archive") return <ArchiveSection key={id} />;
          if (id === "ntlsn-repository") return <RepositorySection key={id} />;
          if (id === "ntlsn-journal") return <JournalSection key={id} />;
          if (id === "ntlsn-bestpractice") {
            return <BestPracticeSection key={id} />;
          }
          // #benchmarks is a PARTIAL port: studies 4 & 5 were injected into
          // the bundle's section by the two bench patch scripts (retired by
          // PR-C); studies 1–3 are bundle-rendered and arrive with PR-D.
          if (id === "benchmarks") return <BenchmarksPartial key={id} />;
          // #ntlsn-conference stays a placeholder on purpose: production
          // hides the whole section via CSS (#ntlsn-conference{display:none
          // !important}), so there is nothing live to port yet.
          if (id === "conferences") return <ConferencesSection key={id} />;
          if (id === "map") return <MapSection key={id} />;
          if (id === "directory") return <DirectorySection key={id} />;
          if (id === "pd") return <PDSection key={id} />;
          if (id === "resources") return <ResourceHubSection key={id} />;
          // #teaching-resources is fully rendered in the bundle but hidden
          // in production by a patch-CSS hide-list rule. Ported and shown
          // per the 1.2e brief — see the note on TeachingResourcesSection.
          if (id === "teaching-resources") {
            return <TeachingResourcesSection key={id} />;
          }
          // PR-B "Talks Hub" (docs/rebuild-stocktake.md): #ntlsn-talkshub
          // absorbs sector-themes / international-themes / featured-talks as
          // tabs (as the ntlsn-talkshub-script patch did by DOM surgery).
          // The absorbed ids live on the tabpanels INSIDE the hub, so their
          // standalone SECTION_ORDER slots render nothing — deep links to
          // them land in the hub, which selects the matching tab.
          if (id === "ntlsn-talkshub") return <TalksHub key={id} />;
          if (
            id === "sector-themes" ||
            id === "international-themes" ||
            id === "featured-talks"
          ) {
            return null;
          }
          // #ntlsn-latest — fail-soft Apps Script feed panel: renders the
          // section only if the feed responds (never blocks, never errors).
          if (id === "ntlsn-latest") return <LatestFeed key={id} />;
          if (id === "ntlsn-zoom") {
            // The canonical order (ntlsn-order patch) slots the Due Soon
            // rail between #ntlsn-zoom and #ntlsn-archive — it matches it
            // by /^Due Soon/ text, not id, so it has no SECTION_ORDER row.
            return (
              <Fragment key={id}>
                <ZoomShareSection />
                <DueSoon />
              </Fragment>
            );
          }
          return <SectionPlaceholder key={id} id={id} />;
        })}
      </main>
      <Footer />
    </>
  );
}
