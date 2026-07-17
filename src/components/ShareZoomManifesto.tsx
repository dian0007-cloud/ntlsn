/**
 * #ntlsn-sharezoom — "Share your Zoom — or just your registration form.
 * We'll handle the rest." (Epic 1.2 PR-E). In production an ANONYMOUS
 * bundle-rendered section positioned by the ntlsn-order regex matcher
 * ({tag:'SECTION',head:1,re:/Share your Zoom/}); assigned this stable id on
 * porting.
 *
 * IMPORTANT (per the PR-E brief): the share FORM this section carried in
 * production already lives in #ntlsn-zoom (PR-C's ZoomShareSection hosts the
 * hardened Apps Script submit + "Shared across the sector" feed). This
 * component ports only the surrounding manifesto PROSE and hands off to
 * #ntlsn-zoom — do NOT add a second form here.
 */
export default function ShareZoomManifesto() {
  return (
    <section
      id="ntlsn-sharezoom"
      aria-labelledby="ntlsn-sharezoom-heading"
      className="relative scroll-mt-20 px-4 py-20"
      style={{
        background:
          "linear-gradient(rgb(6,13,28) 0%, rgb(10,22,40) 50%, rgb(6,13,28) 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-2 text-[10px] tracking-[0.3em] text-[#C9A962] uppercase">
          The Invitation
        </p>
        <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
          Sharing Symposiums
        </p>
        <h2
          id="ntlsn-sharezoom-heading"
          className="mb-6 text-3xl leading-[1.08] font-extrabold sm:text-4xl md:text-[42px]"
        >
          Share your Zoom — or just your registration form. We&rsquo;ll
          handle the rest.
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-xl text-white/60">
          Symposiums are quietly disappearing — fewer every year, scattered
          across institutions that rarely see each other&rsquo;s work. So
          let&rsquo;s open the doors: drop your Zoom, your recording, or just
          your registration form — we&rsquo;ll handle the rest, and
          you&rsquo;ll get every other university&rsquo;s in return. (Spotted
          the em dashes? AI adores them — consider this page part of your
          field guide.) You scratch one back; a whole sector scratches yours.
          One portal to view them all.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="#ntlsn-zoom"
            className="rounded-xl bg-teal px-6 py-3 font-semibold text-navy no-underline transition-colors hover:bg-teal/90"
          >
            Share my symposium →
          </a>
          <span className="text-sm text-white/40">
            Free, open, and shared back to every institution.
          </span>
        </div>
      </div>
    </section>
  );
}
