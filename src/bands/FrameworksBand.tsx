import FrameworksSection from "../components/FrameworksSection";
import EvidenceSection from "../components/EvidenceSection";
import JournalSection from "../components/JournalSection";
import CapabilitiesSection from "../components/CapabilitiesSection";
import PDSection from "../components/PDSection";
import WaysToGrowSection from "../components/WaysToGrowSection";
import CollapsibleSection from "../components/CollapsibleSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const FRAMEWORKS_BAND_IDS = bandSlice("frameworks", "ntlsn-guided");

/**
 * Lazy band (PR-F code-splitting; slice shortened in PR-G): frameworks,
 * "What the data shows", the journal, the capabilities roadmap, PD &
 * programs and ways-to-grow — plus the run of PORT-HIDDEN "Porting soon"
 * placeholders that travel between them in SECTION_ORDER (prx…copscan,
 * toolkit/guided — Seb keep/kill, stocktake decision 1). The band used to
 * end at ntlsn-rpcalc; the 13-section recognition run is now its own chunk
 * (RecognitionBand, PR-G). Owns lib/frameworks.ts (~97KB) and lib/pd.ts.
 *
 * Collapse hybrid (PR-G): frameworks, evidence and pd stay EXPANDED (core
 * journey); journal, capabilities and ways-to-grow render COLLAPSED.
 */
export default function FrameworksBand() {
  return (
    <>
      {FRAMEWORKS_BAND_IDS.map((id) => {
        if (id === "frameworks") return <FrameworksSection key={id} />;
        if (id === "ntlsn-evidence") return <EvidenceSection key={id} />;
        if (id === "ntlsn-journal") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Critical Learner Partnerships"
              teaser="The open, peer-reviewed journal for staff–student partnership work — read it, cite it, submit to it."
            >
              <JournalSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-capabilities") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Everything NTLSN does — now, and over three years."
              teaser="The full capability map: what is live today and what lands in 2027 and 2028."
            >
              <CapabilitiesSection />
            </CollapsibleSection>
          );
        }
        if (id === "pd") return <PDSection key={id} />;
        if (id === "ntlsn-waystogrow") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Not just PD. Ways to grow."
              teaser="Fellowships, awards, secondments, communities — the growth routes beyond formal PD."
            >
              <WaysToGrowSection />
            </CollapsibleSection>
          );
        }
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
