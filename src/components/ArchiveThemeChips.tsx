/**
 * "Browse by theme" chip cloud for #ntlsn-archive (Epic 1.2 PR-D), ported
 * from the ntlsn-archtopics-script patch: twenty curated themes, each chip
 * sized by how many archive records match it (√-scaled, the patch's exact
 * formula). Production fetched the whole 272KB dataset up-front to compute
 * the counts; here they are baked in at build time
 * (__NTLSN_ARCH_TOPIC_COUNTS__, vite.config.ts) using the archive's own
 * matcher, so first paint is correct with no fetch. Selecting a chip runs
 * the archive search for that theme.
 */

/** The twenty themes — verbatim from the patch. */
export const ARCHIVE_TOPICS: readonly string[] = [
  "Assessment",
  "Feedback",
  "Curriculum",
  "Students as Partners",
  "Work-integrated learning",
  "Academic integrity",
  "First year",
  "Indigenous",
  "Online learning",
  "Blended learning",
  "Peer review",
  "Employability",
  "Inclusive education",
  "Internationalisation",
  "Leadership",
  "Academic development",
  "Reflective practice",
  "Evaluation",
  "Graduate outcomes",
  "Threshold concepts",
];

export default function ArchiveThemeChips({
  onPick,
}: {
  onPick: (topic: string) => void;
}) {
  const counts = __NTLSN_ARCH_TOPIC_COUNTS__;
  const hi = Math.sqrt(Math.max(1, ...ARCHIVE_TOPICS.map((t) => counts[t] ?? 0)));

  return (
    <div className="mx-auto my-3.5 max-w-[760px]">
      <p className="mb-2 text-center text-[11px] font-bold tracking-[1.5px] text-[#a0907a] uppercase">
        Browse by theme
      </p>
      <div
        role="group"
        aria-label="Browse the archive by theme"
        className="flex flex-wrap justify-center gap-[9px]"
      >
        {ARCHIVE_TOPICS.map((topic) => {
          const n = counts[topic] ?? 0;
          const r = hi > 0 ? Math.sqrt(n) / hi : 0;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => onPick(topic)}
              aria-label={`Search the archive for ${topic} (${n} matches)`}
              className="cursor-pointer rounded-[999px] font-bold whitespace-nowrap text-[#d9cdb6] transition-colors hover:text-white"
              style={{
                fontSize: `${(13 + 12 * r).toFixed(1)}px`,
                padding: `${(7 + 7 * r).toFixed(0)}px ${(13 + 13 * r).toFixed(0)}px`,
                border: `1px solid rgba(198,108,63,${(0.22 + 0.55 * r).toFixed(2)})`,
                background: `rgba(198,108,63,${(0.05 + 0.13 * r).toFixed(2)})`,
              }}
            >
              {topic}
              <span aria-hidden="true" className="ml-1.5 text-[0.78em] font-extrabold opacity-50">
                {n}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
