import type { ComponentType } from "react";
import CollapsibleSection from "../components/CollapsibleSection";
import RecognitionSection from "../components/RecognitionSection";
import ShowcaseSection from "../components/ShowcaseSection";
import AautSection from "../components/AautSection";
import NatCertSection from "../components/NatCertSection";
import ConfRecognitionSection from "../components/ConfRecognitionSection";
import PassportSection from "../components/PassportSection";
import PathfinderSection from "../components/PathfinderSection";
import ConsortiumSection from "../components/ConsortiumSection";
import SapSection from "../components/SapSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import ServiceSection from "../components/ServiceSection";
import PraiseSection from "../components/PraiseSection";
import PromotionSection from "../components/PromotionSection";
import RpCalcSection from "../components/RpCalcSection";
import { bandSlice } from "../sections";

export const RECOGNITION_BAND_IDS = bandSlice(
  "ntlsn-recognition",
  "ntlsn-rpcalc",
);

/**
 * The interactive "Try it" tools — rendered EXPANDED by default (launch:
 * these are the live-demo moments an L&T audience runs on their phones). The
 * remaining recognition sections are "in design" aspirational content and
 * stay collapsed.
 */
const TOOL_IDS = new Set([
  "ntlsn-aaut", // AAUT Citation self-check
  "ntlsn-passport", // Teaching Recognition Passport
  "ntlsn-pathfinder", // Recognition Pathfinder
  "ntlsn-sap", // Students-as-Partners registry
  "ntlsn-service", // Service tracker
  "ntlsn-promotion", // Promotion case mapper
  "ntlsn-rpcalc", // Recognition-points calculator
]);

/**
 * Lazy band (PR-G): the Recognition band — the 13 PORT-HIDDEN recognition
 * sections Seb kept (stocktake decision 1), ported from their production
 * injector scripts and ALL rendered collapsed inside CollapsibleSection.
 * Split out of FrameworksBand as its own chunk so the ports never touch the
 * initial JS budget.
 *
 * Summary rows use each section's production heading language; teasers are
 * one-line distillations of each section's own copy.
 */
const SECTIONS: ReadonlyArray<{
  id: string;
  title: string;
  teaser: string;
  Body: ComponentType;
}> = [
  {
    id: "ntlsn-recognition",
    title: "Recognise the work that counts for nothing.",
    teaser:
      "A national benchmark for mentoring, assessing and peer review — verified My eQuals badges, portable as RPL. In design · 2027.",
    Body: RecognitionSection,
  },
  {
    id: "ntlsn-showcase",
    title: "Don’t just attend. Walk away credentialed.",
    teaser:
      "One symposium = 40 recognised hours: 8 in the room + 32 in your streams, on a portable My eQuals credential. In design · 2027.",
    Body: ShowcaseSection,
  },
  {
    id: "ntlsn-aaut",
    title: "Ready for an AAUT Citation?",
    teaser:
      "Pick your subcategory, paste a draft, get a report — criteria coverage, your 25-word citation, a plain-English read. Runs in your browser.",
    Body: AautSection,
  },
  {
    id: "ntlsn-natcert",
    title: "One module each. A Graduate Certificate the whole sector owns.",
    teaser:
      "Every university contributes one module — a credit-bearing, badged, transportable Grad Cert. Proposed · in design.",
    Body: NatCertSection,
  },
  {
    id: "ntlsn-confrecognition",
    title: "Don’t just attend. Get recognised for the whole arc.",
    teaser:
      "Proof + a 500-word reflection = recognised hours for every conference, on top of the time in the room. In design · 2027.",
    Body: ConfRecognitionSection,
  },
  {
    id: "ntlsn-passport",
    title: "Your teaching, in a passport that travels.",
    teaser:
      "Preview your Teaching Recognition Passport — portable, verifiable recognition that follows you between institutions. Try it.",
    Body: PassportSection,
  },
  {
    id: "ntlsn-pathfinder",
    title: "Recognise your skills — past, present and emerging.",
    teaser:
      "The Recognition Pathfinder points you to the right tool — plus the Global Academic RPL roadmap for 2029.",
    Body: PathfinderSection,
  },
  {
    id: "ntlsn-consortium",
    title: "From a national commons to an international consortium.",
    teaser:
      "Each country runs its own node, federated through open standards — one node at a time, 2027 to 2030+.",
    Body: ConsortiumSection,
  },
  {
    id: "ntlsn-sap",
    title: "Put your student partnership on the map.",
    teaser:
      "The National Students-as-Partners Registry — six partnership modes, visible across the sector, recognised for staff and students.",
    Body: SapSection,
  },
  {
    id: "ntlsn-service",
    title: "Your service counts too.",
    teaser:
      "Boards, committees, ethics panels, working parties — log the hours that hold a university together in one portable record. Try it.",
    Body: ServiceSection,
  },
  {
    id: "ntlsn-praise",
    title: "Praise that crosses the sector.",
    teaser:
      "Recognise a partner at another university — praise that becomes portable evidence of external esteem. Preview · 2027.",
    Body: PraiseSection,
  },
  {
    id: "ntlsn-promotion",
    title: "Your promotion case, mapped.",
    teaser:
      "Four domains, Levels A–E, performance/probation/promotion — rate your evidence and see your readiness. Preview · 2028.",
    Body: PromotionSection,
  },
  {
    id: "ntlsn-rpcalc",
    title: "Recognition-points calculator",
    teaser:
      "Pick from 30 things academics actually do and watch the RPL hours build toward a My eQuals badge. Try it.",
    Body: RpCalcSection,
  },
];

export default function RecognitionBand() {
  // Render by the canonical slice so band membership can never drift from
  // SECTION_ORDER (same invariant as every other band).
  return (
    <>
      {RECOGNITION_BAND_IDS.map((id) => {
        const entry = SECTIONS.find((s) => s.id === id);
        if (!entry) return <SectionPlaceholder key={id} id={id} />;
        const { title, teaser, Body } = entry;
        return (
          <CollapsibleSection
            key={id}
            ids={[id]}
            title={title}
            teaser={teaser}
            defaultOpen={TOOL_IDS.has(id)}
          >
            <Body />
          </CollapsibleSection>
        );
      })}
    </>
  );
}
