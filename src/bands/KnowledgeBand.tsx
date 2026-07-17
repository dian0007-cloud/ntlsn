import ArchiveSection from "../components/ArchiveSection";
import RepositorySection from "../components/RepositorySection";
import OerSection from "../components/OerSection";
import ResourceHubSection from "../components/ResourceHubSection";
import TeachingResourcesSection from "../components/TeachingResourcesSection";
import BestPracticeSection from "../components/BestPracticeSection";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const KNOWLEDGE_BAND_IDS = bandSlice("ntlsn-archive", "ntlsn-bestpractice");

/**
 * Lazy band (PR-F code-splitting): the knowledge layer — archive, repository,
 * OER, the resource hub, teaching resources and best-practice guides. This
 * band owns the two biggest data modules after talks (lib/resourceHub.ts,
 * lib/teachingResources.ts), which is why it exists as its own chunk.
 * Section rendering is unchanged from the pre-split App.tsx.
 */
export default function KnowledgeBand() {
  return (
    <>
      {KNOWLEDGE_BAND_IDS.map((id) => {
        if (id === "ntlsn-archive") return <ArchiveSection key={id} />;
        if (id === "ntlsn-repository") return <RepositorySection key={id} />;
        if (id === "ntlsn-oer") return <OerSection key={id} />;
        if (id === "resources") return <ResourceHubSection key={id} />;
        // #teaching-resources is fully rendered in the bundle but hidden in
        // production by a patch-CSS hide-list rule. Ported and shown per the
        // 1.2e brief — see the note on TeachingResourcesSection.
        if (id === "teaching-resources") {
          return <TeachingResourcesSection key={id} />;
        }
        if (id === "ntlsn-bestpractice") return <BestPracticeSection key={id} />;
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
