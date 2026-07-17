import AdvisorySection from "../components/AdvisorySection";
import RepresentationSection from "../components/RepresentationSection";
import DistributeSection from "../components/DistributeSection";
import ManifestoVisibility from "../components/ManifestoVisibility";
import ManifestoSharing from "../components/ManifestoSharing";
import ShareZoomManifesto from "../components/ShareZoomManifesto";
import MissionSection from "../components/MissionSection";
import ScopeSection from "../components/ScopeSection";
import WhySection from "../components/WhySection";
import AboutSection from "../components/AboutSection";
import ComingSection from "../components/ComingSection";
import PricingNav from "../components/PricingNav";
import PricingSection from "../components/PricingSection";
import ChoosePackageSection from "../components/ChoosePackageSection";
import Founding10Section from "../components/Founding10Section";
import MemberSection from "../components/MemberSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { ROADMAP_2027, ROADMAP_2028 } from "../lib/roadmap";
import { bandSlice } from "../sections";

export const MISSION_BAND_IDS = bandSlice("ntlsn-advisory", "ntlsn-member");

/**
 * Lazy band (PR-F code-splitting): the mission & pricing tail (PR-E's ports)
 * — advisory, representation, distribute, the manifesto trio, mission, scope,
 * why, about, the 2027/28 roadmap blocks and the open-core pricing stack.
 * Owns lib/pricing.ts and lib/roadmap.ts. Section rendering is unchanged
 * from the pre-split App.tsx.
 */
export default function MissionBand() {
  return (
    <>
      {MISSION_BAND_IDS.map((id) => {
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
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
