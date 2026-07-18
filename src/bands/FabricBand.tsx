import ArchitectureSection from "../components/ArchitectureSection";
import MapSection from "../components/MapSection";
import DirectorySection from "../components/DirectorySection";
import PeakMapSection from "../components/PeakMapSection";
import NetworkSection from "../components/NetworkSection";
import PathwaysSection from "../components/PathwaysSection";
import BenchmarksSection from "../components/BenchmarksSection";
import FnAwardsSection from "../components/FnAwardsSection";
import TryNowSection from "../components/TryNowSection";
import SymShowSection from "../components/SymShowSection";
import InductionSection from "../components/InductionSection";
import PrinciplesSection from "../components/PrinciplesSection";
import EthosSection from "../components/EthosSection";
import LitmusSection from "../components/LitmusSection";
import ChallengesSection from "../components/ChallengesSection";
import CollapsibleSection from "../components/CollapsibleSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const FABRIC_BAND_IDS = bandSlice("architecture", "ntlsn-induction");

/**
 * Lazy band (PR-F code-splitting): the sector fabric — architecture, the
 * national map (+ Unceded Lands caption, owned by MapSection), directory,
 * peak bodies, network, pathways, benchmarks, the First Nations awards
 * benchmark (cultural care — see lib/fnawards.ts), free tools, the symposium
 * showcase and the induction pointer. Owns lib/pathways.ts and lib/tools.ts.
 *
 * PR-G adds the first four manifesto-band ports (principles/ethos/litmus/
 * challenges — their canonical SECTION_ORDER slots fall inside this slice)
 * and applies the collapse hybrid: map + directory stay EXPANDED (core
 * journey); everything else in this slice renders COLLAPSED.
 */
export default function FabricBand() {
  return (
    <>
      {FABRIC_BAND_IDS.map((id) => {
        if (id === "architecture") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Sector Architecture"
              teaser="How the pieces fit: the commons, the standards it runs on, and where your institution plugs in."
            >
              <ArchitectureSection />
            </CollapsibleSection>
          );
        }
        if (id === "map") return <MapSection key={id} />;
        if (id === "directory") return <DirectorySection key={id} />;
        if (id === "ntlsn-peakmap") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="How the peak bodies thread the sector together."
              teaser="ASCILITE, HERDSA, CAULLT, ACODE and more — who convenes what, mapped."
            >
              <PeakMapSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-network") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="A sector that finally connects."
              teaser="Special-interest groups and communities of practice, joined up across universities."
            >
              <NetworkSection />
            </CollapsibleSection>
          );
        }
        if (id === "pathways") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Guided Learning Pathways"
              teaser="Step-by-step routes through the commons — from first steps to leading change."
            >
              <PathwaysSection />
            </CollapsibleSection>
          );
        }
        if (id === "benchmarks") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Mapping the landscape."
              teaser="The sector benchmark studies: what the data shows about how universities support teaching."
            >
              <BenchmarksSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-fnawards") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="First Nations teaching excellence: who recognises it?"
              teaser="A benchmark of how the sector recognises First Nations teaching and learning — held with cultural care."
            >
              <FnAwardsSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-trynow") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="The toolkit for academics."
              teaser="Free tools you can run right now — no logins, everything in your browser."
            >
              <TryNowSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-symshow") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Symposium showcase — coming 2027"
              teaser="Forty-two universities. One sector. Every symposium, gathered in one open place — a first look."
            >
              <SymShowSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-principles") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Built on the five principles of good SoTL practice"
              teaser="Scholarship by design — the commons embodies Felten's five principles of good SoTL practice."
            >
              <PrinciplesSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-ethos") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="“Who doesn’t get to partner?”"
              teaser="The question behind NTLSN — and the conscience the whole project is held to."
            >
              <EthosSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-litmus") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="The litmus test"
              teaser="Today, the sector works alone. Scroll the test: what one connected sector looks like."
            >
              <LitmusSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-challenges") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="The sector is squeezed. Sharing is the affordable response."
              teaser="The sector, right now: the financial strain in four numbers — and where the money is going."
            >
              <ChallengesSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-induction") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Induct your new, casual and sessional staff — before the cracks appear."
              teaser="The induction builder: a ready-to-adapt onboarding pathway for sessional staff."
            >
              <InductionSection />
            </CollapsibleSection>
          );
        }
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
