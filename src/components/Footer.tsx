import StaticNav from "./StaticNav";

/**
 * Footer — brand block, then the "Explore NTLSN" static-nav (production's
 * #ntlsn-static-nav sat between the bundle footer and the appended licence
 * bar; same relative order here), then the licence bar.
 *
 * The licence bar (#ntlsn-cclicence) is the ntlsn-cclicence patch rebuilt to
 * match the tiered LICENSE at the repo root: MIT (code) · CC BY 4.0 (data)
 * · CC BY-NC-SA 4.0 (content) · the First Nations ICIP carve-out, which is
 * not a licence tier at all — no licence extends to ICIP — and links to
 * /icip.html. The patch's custodianship sentence is kept verbatim.
 */
const TIERS: ReadonlyArray<{ badge: string; label: string; href: string }> = [
  { badge: "MIT", label: "Code", href: "/LICENSE" },
  {
    badge: "CC BY 4.0",
    label: "Data & feeds",
    href: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    badge: "CC BY-NC-SA 4.0",
    label: "Content",
    href: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  { badge: "ICIP", label: "Not licensed — see why", href: "/icip.html" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <p className="font-brand text-lg font-bold text-white">
          NTLSN<span className="text-teal">.com</span>
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-white/50">
          Built in the open — for the whole sector.
        </p>
        <p className="text-xs text-white/40">
          <a
            href="https://github.com/dian0007-cloud/ntlsn"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-2 hover:text-white/70"
          >
            GitHub
          </a>
        </p>
      </div>

      <StaticNav />

      <div
        id="ntlsn-cclicence"
        className="mx-auto mt-[30px] max-w-[900px] border-t border-white/[0.08] px-[22px] pt-6 pb-[34px] text-center"
      >
        <div className="mb-[13px] flex flex-wrap items-center justify-center gap-2">
          {TIERS.map((tier) => (
            <a
              key={tier.badge}
              href={tier.href}
              {...(tier.href.startsWith("http")
                ? { rel: "noopener noreferrer" }
                : null)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 no-underline hover:border-white/30"
            >
              <span className="text-[11px] font-extrabold tracking-[0.5px] text-[#d8e0cc]">
                {tier.badge}
              </span>
              <span className="text-[11px] text-[#a0907a]">{tier.label}</span>
            </a>
          ))}
        </div>
        <div className="mx-auto max-w-[700px] text-xs leading-[1.7] text-[#a0907a]">
          NTLSN is a tiered commons (
          <a
            href="/LICENSE"
            className="text-teal underline"
          >
            full licence
          </a>
          ): code is{" "}
          <a href="/LICENSE" className="text-teal underline">
            MIT
          </a>
          ; open data and feeds are{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            rel="noopener noreferrer"
            className="text-teal underline"
          >
            CC BY 4.0
          </a>
          ; except where noted, original content is shared under a{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            rel="noopener noreferrer"
            className="text-teal underline"
          >
            Creative Commons Attribution&ndash;NonCommercial&ndash;ShareAlike
            4.0 International licence
          </a>
          . Third-party and embedded resources retain their own licences.
          Culturally sensitive Aboriginal and Torres Strait Islander materials
          remain under the custodianship of their communities and are not
          covered by this licence —{" "}
          <a href="/icip.html" className="text-teal underline">
            our ICIP position
          </a>
          .
        </div>
        <div className="mt-[15px] text-[11.5px] text-[#6b7e90]">
          &copy; 2026 NTLSN &mdash; National Teaching and Learning Sector
          Network.
        </div>
      </div>
    </footer>
  );
}
