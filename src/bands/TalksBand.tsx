import TalksHub from "../components/TalksHub";
import LatestFeed from "../components/LatestFeed";
import SectionPlaceholder from "../components/SectionPlaceholder";
import { bandSlice } from "../sections";

export const TALKS_BAND_IDS = bandSlice("ntlsn-talkshub", "international-themes");

/**
 * Lazy band (PR-F code-splitting): the Talks Hub and the fail-soft Latest
 * feed. This band owns lib/talks.ts (~90KB of curated talk data), the single
 * biggest data module — the main reason the §1.3 JS budget needs splitting.
 * Section rendering is unchanged from the pre-split App.tsx.
 */
export default function TalksBand() {
  return (
    <>
      {TALKS_BAND_IDS.map((id) => {
        // PR-B "Talks Hub": #ntlsn-talkshub absorbs sector-themes /
        // international-themes / featured-talks as tabs (as the
        // ntlsn-talkshub-script patch did by DOM surgery). The absorbed ids
        // live on the tabpanels INSIDE the hub, so their standalone
        // SECTION_ORDER slots render nothing — deep links to them land in
        // the hub, which selects the matching tab.
        if (id === "ntlsn-talkshub") return <TalksHub key={id} />;
        if (
          id === "sector-themes" ||
          id === "international-themes" ||
          id === "featured-talks"
        ) {
          return null;
        }
        // #ntlsn-latest — fail-soft Apps Script feed panel: renders the
        // section only if the feed responds (never blocks, never errors).
        if (id === "ntlsn-latest") return <LatestFeed key={id} />;
        return <SectionPlaceholder key={id} id={id} />;
      })}
    </>
  );
}
