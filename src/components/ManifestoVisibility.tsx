/**
 * #ntlsn-manifesto-visibility — "The sector works better when we can see it
 * all." (Epic 1.2 PR-E). In production this is an ANONYMOUS bundle-rendered
 * section — ntlsn-order positions it by regex ({tag:'SECTION',head:1,
 * re:/sector works better when we can see it all/}) right after
 * #ntlsn-distribute. It gains this stable id on porting (stocktake: the
 * anonymous manifesto sections are assigned ids in PR-E).
 *
 * Copy verbatim from the hydrated DOM. Production's "Start exploring →" is a
 * bundle <button> that scrolls to the top of the page (verified by driving
 * it); here it is a real link to #hero — same destination, accessible name.
 */
export default function ManifestoVisibility() {
  return (
    <section
      id="ntlsn-manifesto-visibility"
      aria-labelledby="ntlsn-manifesto-visibility-heading"
      className="relative scroll-mt-20 px-4 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
          Join the Network
        </p>
        <h2
          id="ntlsn-manifesto-visibility-heading"
          className="mb-6 text-3xl font-bold text-white md:text-[42px] md:leading-[1.15]"
        >
          The sector works better when we can see it all.
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg text-white/40">
          NTLSN is free, open-source, and built for everyone in Australian
          higher education. Explore events, find PD, discover resources.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#hero"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal px-8 py-3 text-base font-semibold whitespace-nowrap text-navy no-underline shadow transition-colors hover:bg-teal/90"
          >
            Start exploring →
          </a>
          <a
            href="https://github.com/dian0007-cloud/ntlsn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#c9a962]/30 px-8 py-3 font-medium text-[#c9a962] no-underline transition-colors hover:bg-[#c9a962]/10"
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
