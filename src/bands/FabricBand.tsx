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
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const FABRIC_BAND_IDS = bandSlice("architecture", "ntlsn-induction");

/**
 * Lazy band (PR-F code-splitting): the sector fabric — architecture, the
 * national map (+ Unceded Lands caption, owned by MapSection), directory,
 * peak bodies, network, pathways, benchmarks, the First Nations awards
 * benchmark (cultural care — see lib/fnawards.ts), free tools, the symposium
 * showcase and the induction pointer. Owns lib/pathways.ts and lib/tools.ts.
 * Section rendering is unchanged from the pre-split App.tsx.
 */
export default function FabricBand() {
  return (
    <>
      {FABRIC_BAND_IDS.map((id) => {
        if (id === "architecture") return <ArchitectureSection key={id} />;
        if (id === "map") return <MapSection key={id} />;
        if (id === "directory") return <DirectorySection key={id} />;
        if (id === "ntlsn-peakmap") return <PeakMapSection key={id} />;
        if (id === "ntlsn-network") return <NetworkSection key={id} />;
        if (id === "pathways") return <PathwaysSection key={id} />;
        if (id === "benchmarks") return <BenchmarksSection key={id} />;
        if (id === "ntlsn-fnawards") return <FnAwardsSection key={id} />;
        if (id === "ntlsn-trynow") return <TryNowSection key={id} />;
        if (id === "ntlsn-symshow") return <SymShowSection key={id} />;
        if (id === "ntlsn-induction") return <InductionSection key={id} />;
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
