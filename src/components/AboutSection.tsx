import { universityCount } from "../data";

/**
 * #about — "Built because it didn't exist." (Epic 1.2 PR-E), ported verbatim
 * from the bundle-rendered section (hydrated DOM): founder + co-chair cards,
 * The Gap / The Vision pair, and the Get Involved links. The bundle's
 * corner-flourish / drop-cap decorations are reproduced in styles.css.
 * University counts derive from data (production's lede hardcoded "42" and
 * the Vision card "43" — one of the stale-count drifts the rebuild retires).
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-20 border-y border-white/[0.04] bg-[#271f16]/70 px-4 py-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            Volume XIII
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            About
          </p>
          <h2
            id="about-heading"
            className="mb-6 text-3xl font-bold sm:text-4xl md:text-[42px]"
          >
            Built because it didn&rsquo;t exist.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/50">
            {universityCount} universities. Hundreds of teaching and learning
            events, workshops, and opportunities each year. Zero centralised
            platform to find them. Until now.
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="corner-flourish rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <div className="mb-3 flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal via-[#c66c3f] to-purple text-lg font-bold text-white"
              >
                SD
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  A/Prof Dr Seb Dianati
                </h3>
                <p className="mt-1 text-xs tracking-[0.2em] text-[#a8737f]/70 uppercase">
                  NTLSN Founder
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60">
              Senior Academic Development Consultant, Learning &amp; Teaching
              Futures Unit, UniSQ
            </p>
            <p className="mt-1 text-xs text-white/40">
              BSc(MedChem), BIE(S&amp;T), GDIBA, MBA, EdD, SFHEA
            </p>
            <p className="mt-1 text-xs text-white/40">
              Board Member — Centre for Australian Democracy
            </p>
          </div>

          <div className="corner-flourish rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <div className="mb-3 flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal via-[#c66c3f] to-purple text-lg font-bold text-white"
              >
                KD
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Dr Kashmira Davé
                </h3>
                <p className="mt-1 text-xs tracking-[0.2em] text-[#a8737f]/70 uppercase">
                  NTLSN Co-Chair
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60">
              Senior Lecturer, Academic Development – Digital Education, UNE
            </p>
            <p className="mt-1 text-xs text-white/40">
              PhD, MEd (Research), MEd, MSc(Physics), B.Ed., B.Sc., GradCert
              in HE, PGDCA, TAE, DipPM
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="https://symposium.une.edu.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal/20 bg-teal/10 px-3 py-1.5 text-xs text-teal no-underline transition-colors hover:bg-teal/20"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                UNE T&amp;L Symposium
              </a>
              <a
                href="https://symposium.une.edu.au/symposium/july-2020/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-purple/20 bg-purple/10 px-3 py-1.5 text-xs text-purple no-underline transition-colors hover:bg-purple/20"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Past Symposium Recordings
              </a>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="corner-flourish rounded-xl border border-white/5 bg-white/[0.03] p-6">
            <h3 className="mb-3 text-lg font-bold text-white">The Gap</h3>
            <p className="drop-cap text-sm text-white/50">
              Australian higher education has world-class teaching and
              learning events, but they&rsquo;re scattered across
              institutional websites, mailing lists, and social media. There
              was no single, sector-wide, open platform to discover
              what&rsquo;s happening and when.
            </p>
          </div>
          <div className="corner-flourish rounded-xl border border-white/5 bg-white/[0.03] p-6">
            <h3 className="mb-3 text-lg font-bold text-white">The Vision</h3>
            <p className="text-sm text-white/50">
              An open-source, community-maintained platform that maps the
              entire teaching and learning landscape. Free forever, built for
              the sector, and designed to strengthen the connections between
              educators, researchers, and leaders across all{" "}
              {universityCount} universities.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-teal/20 bg-gradient-to-br from-teal/5 to-[#c66c3f]/5 p-6">
          <h3 className="mb-4 text-lg font-bold text-white">Get Involved</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:dian0007@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 no-underline transition-colors hover:border-white/20 hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </a>
            <a
              href="https://www.unisq.edu.au"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 no-underline transition-colors hover:border-white/20 hover:text-white"
            >
              UniSQ
            </a>
            <a
              href="https://github.com/dian0007-cloud/ntlsn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 no-underline transition-colors hover:border-white/20 hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
