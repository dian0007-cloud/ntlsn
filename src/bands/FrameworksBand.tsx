import FrameworksSection from "../components/FrameworksSection";
import EvidenceSection from "../components/EvidenceSection";
import JournalSection from "../components/JournalSection";
import CapabilitiesSection from "../components/CapabilitiesSection";
import PDSection from "../components/PDSection";
import WaysToGrowSection from "../components/WaysToGrowSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const FRAMEWORKS_BAND_IDS = bandSlice("frameworks", "ntlsn-rpcalc");

/**
 * Lazy band (PR-F code-splitting): frameworks, "What the data shows", the
 * journal, the capabilities roadmap, PD & programs and ways-to-grow — plus
 * the long run of PORT-HIDDEN "Porting soon" placeholders that travel between
 * them in SECTION_ORDER (prx…copscan, toolkit…rpcalc — Seb keep/kill,
 * stocktake decision 1). Owns lib/frameworks.ts (~97KB) and lib/pd.ts.
 * Section rendering is unchanged from the pre-split App.tsx.
 */
export default function FrameworksBand() {
  return (
    <>
      {FRAMEWORKS_BAND_IDS.map((id) => {
        if (id === "frameworks") return <FrameworksSection key={id} />;
        if (id === "ntlsn-evidence") return <EvidenceSection key={id} />;
        if (id === "ntlsn-journal") return <JournalSection key={id} />;
        if (id === "ntlsn-capabilities") return <CapabilitiesSection key={id} />;
        if (id === "pd") return <PDSection key={id} />;
        if (id === "ntlsn-waystogrow") return <WaysToGrowSection key={id} />;
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
