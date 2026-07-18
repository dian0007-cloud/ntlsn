import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Data-wiring choice (documented per TASKS.md 1.1 brief):
 * the canonical data layer lives one level up (../data/*.json — see CLAUDE.md,
 * "single source of truth"). We import it directly rather than copying, so the
 * rebuild can never drift from data/*.json. The Vite dev server denies reads
 * outside the project root by default, so we widen server.fs.allow to the repo
 * root. `vite build` inlines the JSON into the bundle, so production output is
 * self-contained and needs no fs access.
 */
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

/**
 * Build-time count of the rescued SoTL archive (data/ltr.json, ~272KB).
 * The front door only ever prints the length ("1,431 SoTL works"), so the
 * count is baked in here rather than importing the whole dataset into the
 * bundle (the §1.3 acceptance budget is JS < 350KB). Declared in globals.d.ts.
 */
const sotlWorkCount = (
  JSON.parse(
    readFileSync(new URL('../data/ltr.json', import.meta.url), 'utf8'),
  ) as unknown[]
).length;

/**
 * Same treatment for the Best Practice Guides count (#ntlsn-bestpractice —
 * data/ltr-bestpractice.json stays out of the bundle; the component fetches
 * it lazily and only the count is baked in).
 */
const bestPracticeCount = (
  JSON.parse(
    readFileSync(
      new URL('../data/ltr-bestpractice.json', import.meta.url),
      'utf8',
    ),
  ) as unknown[]
).length;

/**
 * Archive "Browse by theme" chip counts (PR-D, the ntlsn-archtopics patch):
 * production fetched all of ltr.json up-front just to size 20 chips. Here
 * the counts are computed at build time with the patch's exact matcher
 * (every whitespace-split term a substring of title+authors), so the chips
 * are right at first paint and the 272KB dataset still stays out of the
 * bundle until the user searches.
 */
const ARCHIVE_TOPICS = [
  'Assessment',
  'Feedback',
  'Curriculum',
  'Students as Partners',
  'Work-integrated learning',
  'Academic integrity',
  'First year',
  'Indigenous',
  'Online learning',
  'Blended learning',
  'Peer review',
  'Employability',
  'Inclusive education',
  'Internationalisation',
  'Leadership',
  'Academic development',
  'Reflective practice',
  'Evaluation',
  'Graduate outcomes',
  'Threshold concepts',
];
const ltrRecords = JSON.parse(
  readFileSync(new URL('../data/ltr.json', import.meta.url), 'utf8'),
) as Array<{ t: string; a: string }>;
const archiveTopicCounts = Object.fromEntries(
  ARCHIVE_TOPICS.map((topic) => {
    const terms = topic.toLowerCase().split(/\s+/);
    const count = ltrRecords.filter((record) => {
      const hay = `${record.t} ${record.a}`.toLowerCase();
      return terms.every((term) => hay.includes(term));
    }).length;
    return [topic, count];
  }),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __NTLSN_SOTL_WORKS__: JSON.stringify(sotlWorkCount),
    __NTLSN_BP_GUIDES__: JSON.stringify(bestPracticeCount),
    __NTLSN_ARCH_TOPIC_COUNTS__: JSON.stringify(archiveTopicCounts),
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
