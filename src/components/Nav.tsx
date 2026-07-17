const NAV_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "What's On", href: "#events" },
  { label: "Conferences", href: "#conferences" },
  { label: "Resources", href: "#resources" },
  { label: "Frameworks", href: "#frameworks" },
  { label: "About", href: "#about" },
];

/**
 * Sticky top nav. Real <a href="#…"> anchors (not JS-scroll buttons like the
 * old bundle) so link purpose is in the accessibility tree from birth
 * (WCAG 2.4.4) — no runtime patch needed.
 */
export default function Nav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-white/5 bg-navy/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a
          href="#hero"
          className="group flex items-center gap-2 rounded-lg px-1"
          aria-label="NTLSN.com — back to top"
        >
          <span className="font-brand text-xl font-bold tracking-tight text-white">
            NTLSN<span className="text-teal">.com</span>
          </span>
          <span
            aria-hidden="true"
            className="mt-1 inline-block h-2 w-2 rounded-full bg-teal transition-shadow group-hover:shadow-[0_0_10px_rgba(78,205,196,0.65)]"
          />
        </a>
        <ul className="flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white sm:px-3 sm:text-sm"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
