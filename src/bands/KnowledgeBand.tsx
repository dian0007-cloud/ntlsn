import ArchiveSection from "../components/ArchiveSection";
import RepositorySection from "../components/RepositorySection";
import OerSection from "../components/OerSection";
import ResourceHubSection from "../components/ResourceHubSection";
import TeachingResourcesSection from "../components/TeachingResourcesSection";
import BestPracticeSection from "../components/BestPracticeSection";
import CollapsibleSection from "../components/CollapsibleSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const KNOWLEDGE_BAND_IDS = bandSlice("ntlsn-archive", "ntlsn-bestpractice");

/**
 * Lazy band (PR-F code-splitting): the knowledge layer — archive, repository,
 * OER, the resource hub, teaching resources and best-practice guides. This
 * band owns the two biggest data modules after talks (lib/resourceHub.ts,
 * lib/teachingResources.ts), which is why it exists as its own chunk.
 *
 * Collapse hybrid (PR-G): the resource hub (#resources) stays EXPANDED (core
 * journey); archive, repository, OER, teaching-resources and best-practice
 * render COLLAPSED. Counts in the teasers are build-time derived
 * (vite.config.ts define()), never hardcoded.
 */
export default function KnowledgeBand() {
  return (
    <>
      {KNOWLEDGE_BAND_IDS.map((id) => {
        if (id === "ntlsn-archive") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="The Sector Archive"
              teaser={`Search ${__NTLSN_SOTL_WORKS__.toLocaleString("en-AU")} rescued SoTL works — the sector's scholarship, free and open.`}
            >
              <ArchiveSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-repository") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Present at your own symposium. Get recognised for it."
              teaser="The open repository: a DOI and a permanent home for your symposium talk."
            >
              <RepositorySection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-oer") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Search the world’s open library of teaching resources."
              teaser="One search across the big OER libraries — openly licensed, free to adapt."
            >
              <OerSection />
            </CollapsibleSection>
          );
        }
        if (id === "resources") return <ResourceHubSection key={id} />;
        // #teaching-resources is fully rendered in the bundle but hidden in
        // production by a patch-CSS hide-list rule. Ported and shown per the
        // 1.2e brief — see the note on TeachingResourcesSection.
        if (id === "teaching-resources") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Teaching Resources from Across the Sector"
              teaser="Openly licensed guides and toolkits from universities across the country."
            >
              <TeachingResourcesSection />
            </CollapsibleSection>
          );
        }
        if (id === "ntlsn-bestpractice") {
          return (
            <CollapsibleSection
              key={id}
              ids={[id]}
              title="Best Practice Guides"
              teaser={`${__NTLSN_BP_GUIDES__.toLocaleString("en-AU")} curated best-practice guides, drawn from the sector archive.`}
            >
              <BestPracticeSection />
            </CollapsibleSection>
          );
        }
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
