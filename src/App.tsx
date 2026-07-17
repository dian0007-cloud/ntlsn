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
import DueSoon from "./components/DueSoon";
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
          if (id === "yearview") return <YearView key={id} />;
          if (id === "events") return <EventsSection key={id} />;
          // #ntlsn-conference stays a placeholder on purpose: production
          // hides the whole section via CSS (#ntlsn-conference{display:none
          // !important}), so there is nothing live to port yet.
          if (id === "conferences") return <ConferencesSection key={id} />;
          if (id === "map") return <MapSection key={id} />;
          if (id === "directory") return <DirectorySection key={id} />;
          if (id === "ntlsn-zoom") {
            // The canonical order (ntlsn-order patch) slots the Due Soon
            // rail between #ntlsn-zoom and #ntlsn-archive — it matches it
            // by /^Due Soon/ text, not id, so it has no SECTION_ORDER row.
            return (
              <Fragment key={id}>
                <SectionPlaceholder id={id} />
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
