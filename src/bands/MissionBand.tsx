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
import AimSection from "../components/AimSection";
import RebalanceSection from "../components/RebalanceSection";
import TogetherSection from "../components/TogetherSection";
import CollapsibleGroup from "../components/CollapsibleGroup";
import CollapsibleSection from "../components/CollapsibleSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { ROADMAP_2027, ROADMAP_2028 } from "../lib/roadmap";
import { eventCount } from "../data";
import { bandSlice } from "../sections";

export const MISSION_BAND_IDS = bandSlice("ntlsn-advisory", "ntlsn-member");

/**
 * The pricing band renders as ONE collapsed group ("Institutional
 * partnerships & pricing" — Seb's PR-G decision): pricingnav + pricing +
 * choosepackage + founding10 + member, plus the four PORT-HIDDEN
 * pricing-adjacent placeholders that travel between them in SECTION_ORDER
 * (allinone/howitworks/byrole/tailored). One contiguous slice, so a hash to
 * ANY of the nine ids auto-opens the group.
 */
const PRICING_GROUP_IDS = bandSlice("ntlsn-pricingnav", "ntlsn-member");

/**
 * Collapse v2 group rosters — each a contiguous SECTION_ORDER slice INSIDE
 * this band (a group must never straddle a band boundary: LazyBand stubs and
 * bandSlice derivation both assume band-local contiguity):
 * - Mission & governance: advisory … distribute, the maximal contiguous
 *   collapsed run before the expanded #ntlsn-manifesto-visibility.
 *   (#ntlsn-manifesto-visibility and #ntlsn-mission stay OUTSIDE, expanded.)
 * - Roadmap: the 2027/2028 blocks (they render HERE, not in FabricBand —
 *   FABRIC_BAND_IDS ends at ntlsn-induction).
 * Storage keys are namespaced "g:…" so they can never collide with a member
 * fold's own key (see lib/cfoldState.ts).
 */
const MISSION_GROUP_IDS = bandSlice("ntlsn-advisory", "ntlsn-distribute");
const ROADMAP_GROUP_IDS = bandSlice("ntlsn-coming2027", "ntlsn-coming2028");

/** The mission-group member folds, unchanged from PR-G — now nested. */
function renderMissionFold(id: string) {
  if (id === "ntlsn-advisory") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title="Built in the open. Steered as it grows."
        teaser="The advisory group: sector voices steering NTLSN as it grows."
      >
        <AdvisorySection />
      </CollapsibleSection>
    );
  }
  if (id === "ntlsn-representation") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title="No single bloc runs it."
        teaser="Governance balanced across Go8, ATN, IRU, RUN and unaligned universities."
      >
        <RepresentationSection />
      </CollapsibleSection>
    );
  }
  if (id === "ntlsn-aim") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title="Connecting the sector — sustainably"
        teaser="Our aim: everything that already exists across the sector, in one free, open place."
      >
        <AimSection />
      </CollapsibleSection>
    );
  }
  if (id === "ntlsn-rebalance") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title="Research has the weight. Teaching holds the load."
        teaser="Rebalancing the sector: putting weight back on teaching and the scholarship of teaching."
      >
        <RebalanceSection />
      </CollapsibleSection>
    );
  }
  if (id === "ntlsn-together") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title="The fringes, connected."
        teaser="SIGs and CoPs — ASCILITE, HERDSA, CAULLT, ACODE and more — joined by one connective layer."
      >
        <TogetherSection />
      </CollapsibleSection>
    );
  }
  if (id === "ntlsn-distribute") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title="NTLSN, everywhere you work."
        teaser="The commons in your LMS, your inbox and your calendar — widgets, digests and open APIs."
      >
        <DistributeSection />
      </CollapsibleSection>
    );
  }
  return <SectionPlaceholder key={id} id={id} />;
}

/** The roadmap-group member folds, unchanged from PR-G — now nested. */
function renderRoadmapFold(id: string) {
  if (id === "ntlsn-coming2027") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title={ROADMAP_2027.heading}
        teaser="The road ahead · 2027 — turning a navigator into something you can run things on."
      >
        <ComingSection block={ROADMAP_2027} />
      </CollapsibleSection>
    );
  }
  if (id === "ntlsn-coming2028") {
    return (
      <CollapsibleSection
        key={id}
        ids={[id]}
        title={ROADMAP_2028.heading}
        teaser="The road ahead · 2028 — making teaching work count wherever an educator goes."
      >
        <ComingSection block={ROADMAP_2028} />
      </CollapsibleSection>
    );
  }
  return <SectionPlaceholder key={id} id={id} />;
}

/**
 * Lazy band (PR-F code-splitting): the mission & pricing tail (PR-E's ports)
 * — advisory, representation, distribute, the manifesto trio, mission, scope,
 * why, about, the 2027/28 roadmap blocks and the open-core pricing stack.
 * Owns lib/pricing.ts and lib/roadmap.ts.
 *
 * PR-G adds the remaining manifesto-band ports whose canonical slots fall in
 * this slice (aim/rebalance/together) and applies the collapse hybrid:
 * manifesto-visibility, mission and about stay EXPANDED (core journey);
 * everything else here renders COLLAPSED — the pricing run as a single
 * group. Collapse v2 folds the mission cluster and the roadmap pair behind
 * CollapsibleGroup shells (each rendered at its first member's slot; the
 * other member ids render null there — their sections live INSIDE the group
 * panel, in canonical order — mirroring the pricing-group precedent).
 */
export default function MissionBand() {
  return (
    <>
      {MISSION_BAND_IDS.map((id) => {
        // The mission & governance group, at its first id's slot.
        if (id === MISSION_GROUP_IDS[0]) {
          return (
            <CollapsibleGroup
              key={id}
              ids={MISSION_GROUP_IDS}
              storageKey="g:ntlsn-advisory"
              title="Mission & governance"
              teaser="How the commons is steered, balanced and distributed — the mission behind NTLSN."
            >
              {MISSION_GROUP_IDS.map(renderMissionFold)}
            </CollapsibleGroup>
          );
        }
        if (MISSION_GROUP_IDS.includes(id)) return null;
        if (id === "ntlsn-manifesto-visibility") {
          return <ManifestoVisibility key={id} />;
        }
        if (id === "ntlsn-manifesto-sharing") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Sharing is caring."
              teaser="Open Educational Practice: every event, recording and resource shared freely, under open licences."
            >
              <ManifestoSharing />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-sharezoom") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Share your Zoom — or just your registration form. We’ll handle the rest."
              teaser="One link from you; discovery, calendars and the archive handled by the commons."
            >
              <ShareZoomManifesto />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-mission") return <MissionSection key={id} />;
        if (id === "ntlsn-scope") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="A navigator and a connector — not a system of record."
              teaser="Clear on scope: what NTLSN does, what it is not, and why your data stays yours."
            >
              <ScopeSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-why") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="The sector works alone. It doesn’t have to."
              teaser="Why NTLSN exists — the case for a connected sector."
            >
              <WhySection />
            </CollapsibleSection>
          );
        }
        if (id === "about") return <AboutSection key={id} />;
        // The roadmap group, at its first id's slot. Teaser count derived
        // from the events dataset (data.ts — already in the initial chunk),
        // per the copy re-derivation rule: no hardcoded numbers.
        if (id === ROADMAP_GROUP_IDS[0]) {
          return (
            <CollapsibleGroup
              key={id}
              ids={ROADMAP_GROUP_IDS}
              storageKey="g:ntlsn-coming2027"
              title="Roadmap"
              teaser={`The road ahead — what lands in 2027 and 2028, building on the ${eventCount} events already mapped today.`}
            >
              {ROADMAP_GROUP_IDS.map(renderRoadmapFold)}
            </CollapsibleGroup>
          );
        }
        if (ROADMAP_GROUP_IDS.includes(id)) return null;
        // The pricing group: rendered once, at its first id's slot; the
        // remaining group ids render nothing here (their sections live
        // INSIDE the group, in canonical order).
        if (id === "ntlsn-pricingnav") {
          return (
            <CollapsibleSection
              key={id}
              ids={PRICING_GROUP_IDS}
              title="Institutional partnerships & pricing"
              teaser="NTLSN is free for every educator, forever. Institutions can go further — packages, founding partners, membership."
            >
              <PricingNav />
              <PricingSection />
              <ChoosePackageSection />
              {PRICING_GROUP_IDS.filter(
                (gid) =>
                  ![
                    "ntlsn-pricingnav",
                    "pricing",
                    "ntlsn-choosepackage",
                    "ntlsn-founding10",
                    "ntlsn-member",
                  ].includes(gid),
              ).map((gid) => (
                <SectionPlaceholder key={gid} id={gid} />
              ))}
              <Founding10Section />
              <MemberSection />
            </CollapsibleSection>
          );
        }
        if (PRICING_GROUP_IDS.includes(id)) return null;
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
