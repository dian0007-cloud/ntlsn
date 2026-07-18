import { Fragment } from "react";
import YearView from "../components/YearView";
import EventsSection from "../components/EventsSection";
import SotlGrantsSection from "../components/SotlGrantsSection";
import ConferencesSection from "../components/ConferencesSection";
import ZoomShareSection from "../components/ZoomShareSection";
import DueSoon from "../components/DueSoon";
import CollapsibleSection from "../components/CollapsibleSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const CALENDAR_BAND_IDS = bandSlice("yearview", "ntlsn-zoom");

/**
 * Lazy band (PR-F code-splitting): the calendar stack — year view, What's On,
 * SoTL grants, conferences and the Zoom share form (+ Due Soon rail). Section
 * rendering is unchanged from the pre-split App.tsx; only the loading moved.
 */
export default function CalendarBand() {
  return (
    <>
      {CALENDAR_BAND_IDS.map((id) => {
        if (id === "yearview") return <YearView key={id} />;
        if (id === "events") return <EventsSection key={id} />;
        if (id === "sotl-grants") return <SotlGrantsSection key={id} />;
        // #ntlsn-conference stays a placeholder on purpose: production hides
        // the whole section via CSS (#ntlsn-conference{display:none
        // !important}), so there is nothing live to port yet.
        if (id === "conferences") return <ConferencesSection key={id} />;
        if (id === "ntlsn-zoom") {
          // The canonical order (ntlsn-order patch) slots the Due Soon rail
          // between #ntlsn-zoom and #ntlsn-archive — it matches it by
          // /^Due Soon/ text, not id, so it has no SECTION_ORDER row.
          // Collapse hybrid (PR-G): the Zoom share form is tail — collapsed;
          // Due Soon is core journey — expanded, outside the wrapper.
          return (
            <Fragment key={id}>
              <CollapsibleSection
                ids={[id]}
                title="Share a live session. The whole sector’s invited."
                teaser="Share your Zoom or Teams link — or just your registration form — and it goes out to the whole sector."
              >
                <ZoomShareSection />
              </CollapsibleSection>
              <DueSoon />
            </Fragment>
          );
        }
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
