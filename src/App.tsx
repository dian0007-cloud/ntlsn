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
import NetworkSection from "./components/NetworkSection";
import PeakMapSection from "./components/PeakMapSection";
import ArchitectureSection from "./components/ArchitectureSection";
import PathwaysSection from "./components/PathwaysSection";
import BenchmarksSection from "./components/BenchmarksSection";
import FnAwardsSection from "./components/FnAwardsSection";
import TryNowSection from "./components/TryNowSection";
import CapabilitiesSection from "./components/CapabilitiesSection";
import WaysToGrowSection from "./components/WaysToGrowSection";
import SymShowSection from "./components/SymShowSection";
import InductionSection from "./components/InductionSection";
import AdvisorySection from "./components/AdvisorySection";
import RepresentationSection from "./components/RepresentationSection";
import DistributeSection from "./components/DistributeSection";
import ManifestoVisibility from "./components/ManifestoVisibility";
import ManifestoSharing from "./components/ManifestoSharing";
import ShareZoomManifesto from "./components/ShareZoomManifesto";
import MissionSection from "./components/MissionSection";
import ScopeSection from "./components/ScopeSection";
import WhySection from "./components/WhySection";
import AboutSection from "./components/AboutSection";
import ComingSection from "./components/ComingSection";
import PricingNav from "./components/PricingNav";
import PricingSection from "./components/PricingSection";
import ChoosePackageSection from "./components/ChoosePackageSection";
import Founding10Section from "./components/Founding10Section";
import MemberSection from "./components/MemberSection";
import Footer from "./components/Footer";
import { ROADMAP_2027, ROADMAP_2028 } from "./lib/roadmap";
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
          // PR-D "Sector fabric" (docs/rebuild-stocktake.md): the network
          // and peak-body visualisations, the bundle-rendered architecture /
          // pathways / benchmarks sections, the First Nations awards
          // benchmark (cultural care — see lib/fnawards.ts), the free-tools
          // directory (+folded toolsearch/todaycard satellites), the
          // capabilities roadmap, ways-to-grow, the symposium showcase and
          // the induction pointer card. #benchmarks is now COMPLETE:
          // studies 1–3 (bundle) join 4–5 (PR-C's patch-injected cards).
          if (id === "ntlsn-network") return <NetworkSection key={id} />;
          if (id === "ntlsn-peakmap") return <PeakMapSection key={id} />;
          if (id === "architecture") return <ArchitectureSection key={id} />;
          if (id === "pathways") return <PathwaysSection key={id} />;
          if (id === "benchmarks") return <BenchmarksSection key={id} />;
          if (id === "ntlsn-fnawards") return <FnAwardsSection key={id} />;
          if (id === "ntlsn-trynow") return <TryNowSection key={id} />;
          if (id === "ntlsn-capabilities") {
            return <CapabilitiesSection key={id} />;
          }
          if (id === "ntlsn-waystogrow") return <WaysToGrowSection key={id} />;
          if (id === "ntlsn-symshow") return <SymShowSection key={id} />;
          if (id === "ntlsn-induction") return <InductionSection key={id} />;
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
          // PR-E "Mission & pricing tail" (docs/rebuild-stocktake.md):
          // advisory/representation/distribute(+digest)/mission/scope/why/
          // founding10/member are patch-injector translations; about and the
          // three manifesto sections (ids assigned on porting — see
          // sections.ts) are bundle ports; coming2027/28 merge the
          // comingblocks grid with the roadmap headers (counts from data);
          // pricingnav + pricing + choosepackage are the open-core stack.
          if (id === "ntlsn-advisory") return <AdvisorySection key={id} />;
          if (id === "ntlsn-representation") {
            return <RepresentationSection key={id} />;
          }
          if (id === "ntlsn-distribute") return <DistributeSection key={id} />;
          if (id === "ntlsn-manifesto-visibility") {
            return <ManifestoVisibility key={id} />;
          }
          if (id === "ntlsn-manifesto-sharing") {
            return <ManifestoSharing key={id} />;
          }
          if (id === "ntlsn-sharezoom") return <ShareZoomManifesto key={id} />;
          if (id === "ntlsn-mission") return <MissionSection key={id} />;
          if (id === "ntlsn-scope") return <ScopeSection key={id} />;
          if (id === "ntlsn-why") return <WhySection key={id} />;
          if (id === "about") return <AboutSection key={id} />;
          if (id === "ntlsn-coming2027") {
            return <ComingSection key={id} block={ROADMAP_2027} />;
          }
          if (id === "ntlsn-coming2028") {
            return <ComingSection key={id} block={ROADMAP_2028} />;
          }
          if (id === "ntlsn-pricingnav") return <PricingNav key={id} />;
          if (id === "pricing") return <PricingSection key={id} />;
          if (id === "ntlsn-choosepackage") {
            return <ChoosePackageSection key={id} />;
          }
          if (id === "ntlsn-founding10") return <Founding10Section key={id} />;
          if (id === "ntlsn-member") return <MemberSection key={id} />;
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
