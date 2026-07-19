/**
 * #ntlsn-together — "The fringes, connected." (Epic 1.2 PR-G, manifesto
 * band). Ported verbatim from the production ntlsn-together-script injector:
 * the ASCILITE/HERDSA/CAULLT/ACODE peak-community cards and the SIG/CoP
 * domain chips.
 */
const NAMED: ReadonlyArray<{ n: string; d: string; u: string }> = [
  {
    n: "ASCILITE",
    d: "Computers in learning in tertiary education",
    u: "https://ascilite.org",
  },
  {
    n: "HERDSA",
    d: "Higher education research & development",
    u: "https://herdsa.org.au",
  },
  {
    n: "CAULLT",
    d: "Leaders in learning & teaching",
    u: "https://caullt.edu.au",
  },
  {
    n: "ACODE",
    d: "Open, distance & e-learning",
    u: "https://www.acode.edu.au",
  },
];

const DOMAINS: readonly string[] = [
  "Academic development",
  "Learning design",
  "Open education",
  "Academic advising",
  "Ed-tech & digital",
  "Educational technology",
  "Assessment",
  "First-year & transition",
  "Scholarship of teaching",
];

export default function TogetherSection() {
  return (
    <section
      id="ntlsn-together"
      aria-labelledby="ntlsn-together-heading"
      className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-16"
    >
      <div className="mx-auto max-w-[880px] text-center">
        <div className="mb-3 text-[11px] font-extrabold tracking-[2px] text-[#8fb081] uppercase">
          Better together · SIGs and CoPs
        </div>
        <h2
          id="ntlsn-together-heading"
          className="mb-3 text-[clamp(24px,3.4vw,38px)] leading-[1.15] font-extrabold text-white"
        >
          The fringes, connected.
        </h2>
        <p className="mx-auto mb-[26px] max-w-[660px] text-[clamp(14.5px,1.7vw,17px)] leading-[1.65] text-[#d9cdb6]">
          Academic development, learning design, open education, academic
          advising, ed-tech: the communities that carry teaching too often
          work apart. NTLSN is the connective layer between them, SIG to SIG,
          CoP to CoP, so the whole sector can find each other.
        </p>
        <p className="mx-auto mt-3 mb-4 max-w-[600px] text-[13.5px] font-semibold text-[#b3a48c]">
          Part of one of these communities? NTLSN connects you to the rest.
        </p>
        <div className="mb-[22px] inline-block rounded-full bg-[#8fb081] px-5 py-[9px] text-[13px] font-extrabold text-[#1f1810]">
          ◎ NTLSN · the connective layer
        </div>
        <div className="mb-[22px] flex flex-wrap justify-center gap-3.5">
          {NAMED.map((c) => (
            <a
              key={c.n}
              href={c.u}
              target="_blank"
              rel="noopener noreferrer"
              className="block min-w-[200px] max-w-[300px] flex-1 rounded-[14px] border border-[rgba(198,108,63,.22)] bg-[#2a2218] px-5 py-[18px] no-underline"
            >
              <div className="mb-1 text-[17px] font-extrabold text-white">
                {c.n}{" "}
                <span aria-hidden="true" className="text-[13px] text-[#c66c3f]">
                  →
                </span>
              </div>
              <div className="text-[13px] leading-[1.5] text-[#b3a48c]">
                {c.d}
              </div>
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-[9px]">
          {DOMAINS.map((domain) => (
            <span
              key={domain}
              className="rounded-full border border-[rgba(143,176,129,.26)] bg-[rgba(143,176,129,.08)] px-[15px] py-[7px] text-[13px] font-semibold text-[#d9cdb6]"
            >
              {domain}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-[26px] max-w-[640px] text-[12.5px] italic text-[#a0907a]">
          Links to the sector’s communities. NTLSN connects them; it does not
          replace them. More SIGs and CoPs added as the network grows.
        </p>
      </div>
    </section>
  );
}
