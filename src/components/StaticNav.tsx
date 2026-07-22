/**
 * "Explore NTLSN" — the production #ntlsn-static-nav block (a plain-HTML
 * crawlable index of the standalone pages, injected near the end of <body>)
 * rebuilt as a component. Link list, labels and order are verbatim from
 * production; every target is a real .html page in the repo root (no SPA
 * routing — CLAUDE.md). Only /orcid-start.html opens in a new tab, exactly
 * as in production.
 */
const PAGES: ReadonlyArray<
  readonly [label: string, href: string] | readonly [string, string, "blank"]
> = [
  ["About Us", "/about.html"],
  ["Start Here", "/start-here.html"],
  ["What's On", "/whats-on.html"],
  ["Crash Courses", "/crash-courses.html"],
  ["Missed It — recordings", "/missed-it.html"],
  ["Stream your symposium", "/symposium-streaming.html"],
  ["Start with your ORCID", "/orcid-start.html", "blank"],
  ["Your SoTL, Wrapped", "/sotl-wrapped.html"],
  ["Call for Abstracts", "/call-for-abstracts.html"],
  ["See your path", "/orcid-flow.html"],
  ["SoTL Index", "/sotl-index.html"],
  ["Conference Finder", "/conference-finder.html"],
  ["Journal Finder", "/journal-finder.html"],
  ["OA Finder", "/oa-finder.html"],
  ["Open Building Blocks (OER)", "/open-building-blocks.html"],
  ["Learning Modules", "/learning-modules.html"],
  ["Teaching AI Prompts", "/teaching-ai-prompts.html"],
  ["Peer-Review Exchange", "/peer-review-exchange.html"],
  ["Calibration Suite", "/calibration-suite.html"],
  ["Publication Profile", "/publication-profile.html"],
  ["Fellowship Mapper", "/fellowship-mapper.html"],
  ["Narrative CV", "/narrative-cv.html"],
  ["Promotion Case", "/promotion-case.html"],
  ["Recognition Framework", "/recognition-framework.html"],
  ["AAUT Readiness", "/aaut-readiness.html"],
  ["Teaching Recognition Passport", "/trp.html"],
  ["The Sector in 3D", "/network-3d.html"],
  ["Widgets Dashboard", "/widgets.html"],
  ["Leadership", "/leadership.html"],
  ["Sector Grad Cert (in design)", "/sector-grad-cert.html"],
  ["The Portal", "/portal.html"],
  ["Sector Reads", "/sector-reads.html"],
  ["How we handle data", "/privacy.html"],
  ["Symposium-in-a-box", "/symposium.html"],
];

export default function StaticNav() {
  return (
    <div
      id="ntlsn-static-nav"
      role="navigation"
      aria-label="Site pages"
      className="mx-auto max-w-[1100px] px-6 py-[18px] text-left text-[12.5px] leading-[1.9]"
    >
      <div className="mb-2 text-[10.5px] font-bold tracking-[1px] text-[#97876f] uppercase">
        Explore NTLSN
      </div>
      {PAGES.map(([label, href, blank]) => (
        <a
          key={href}
          href={href}
          {...(blank
            ? { target: "_blank", rel: "noopener noreferrer" }
            : null)}
          className="mr-3.5 mb-2 inline-block text-[#a0907a] underline hover:text-white/80"
        >
          {label}
        </a>
      ))}
    </div>
  );
}
