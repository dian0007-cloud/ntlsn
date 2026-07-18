/**
 * #ntlsn-manifesto-sharing — "Sharing is caring." (Epic 1.2 PR-E). In
 * production an ANONYMOUS bundle-rendered section, positioned by the
 * ntlsn-order regex matcher ({tag:'SECTION',head:1,re:/Sharing is caring/})
 * between the visibility manifesto and the share-your-Zoom band. Assigned
 * this stable id on porting. Copy and the OEP chip row verbatim from the
 * hydrated DOM.
 */
const SHARING_CHIPS: ReadonlyArray<{ label: string; colour: string }> = [
  { label: "Free", colour: "#4ECDC4" },
  { label: "Open", colour: "#7C9CFF" },
  { label: "OEP", colour: "#C57BFF" },
  { label: "OER", colour: "#C9A962" },
];

export default function ManifestoSharing() {
  return (
    <section
      id="ntlsn-manifesto-sharing"
      aria-labelledby="ntlsn-manifesto-sharing-heading"
      className="relative scroll-mt-20 px-4 py-16"
    >
      <div className="mx-auto max-w-[46rem] text-center">
        <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] text-teal uppercase">
          <span aria-hidden="true" className="text-[13px]">
            ♡
          </span>{" "}
          Open Educational Practice
        </p>
        <h2
          id="ntlsn-manifesto-sharing-heading"
          className="mb-[1.1rem] text-3xl leading-[1.1] font-extrabold text-white md:text-[42px]"
        >
          Sharing is caring.
        </h2>
        <p className="mx-auto mb-[1.6rem] max-w-[40rem] text-[1.02rem] leading-[1.7] text-white/55">
          NTLSN exists in the spirit of{" "}
          <strong className="text-white/85">open educational practice</strong>
          . Every event, recording and resource is gathered and shared freely,
          under open Creative Commons licences — so the whole sector can learn
          from itself. No logins. No paywalls.{" "}
          <strong className="text-white/85">Open by default.</strong>
        </p>
        <div className="flex flex-wrap justify-center gap-[0.55rem]">
          {SHARING_CHIPS.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1 rounded-full px-[0.9rem] py-[0.42rem] text-[0.78rem] font-bold tracking-[0.02em]"
              style={{
                color: chip.colour,
                border: `1px solid ${chip.colour}33`,
                background: `${chip.colour}10`,
              }}
            >
              {chip.label}
            </span>
          ))}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-teal/20 bg-teal/[0.06] px-[0.9rem] py-[0.42rem] text-[0.78rem] font-bold tracking-[0.02em] text-teal no-underline"
          >
            CC BY-NC-SA 4.0 ↗
          </a>
        </div>
      </div>
    </section>
  );
}
