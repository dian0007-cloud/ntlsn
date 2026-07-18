import { useEffect, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

/**
 * Menu contents — extracted verbatim from the production ntlsn-megamenu-script
 * patch's GROUPS array (labels, targets, group heads and accent colours).
 *
 * Prune notes (PR-F nav parity — every divergence from the patch documented):
 * - `sector-themes`, `international-themes`, `featured-talks`: kept. In the
 *   rebuild these ids live on the tabpanels INSIDE #ntlsn-talkshub, and
 *   TalksHub selects the matching tab on hashchange, so the links resolve
 *   (better than production, where they pointed at display:none sections).
 * - `ntlsn-latest`: kept, but it is fail-soft — the section only exists if
 *   the Apps Script feed responded. The open-time existence filter below
 *   (same behaviour as the patch's `document.getElementById` filter in
 *   fill()) drops the entry automatically when the feed is down.
 * - All remaining targets are ported, visible sections or CLS-reserving
 *   stubs/placeholders with the same ids, so no entry needed re-pointing.
 * - The patch's duplicate "All-in-one bundle" → #pricing entry and CTA are
 *   kept as-is (production parity; #ntlsn-allinone itself is PORT-HIDDEN).
 */
const GROUPS: ReadonlyArray<{
  head: string;
  colour: string;
  items: ReadonlyArray<readonly [label: string, target: string]>;
}> = [
  {
    head: "Available now · the free commons",
    colour: "#8fb081",
    items: [
      ["Home", "hero"],
      ["Free tools & search", "ntlsn-trynow"],
      ["National map", "map"],
      ["Events", "events"],
      ["Conferences", "conferences"],
      ["Year view", "yearview"],
      ["Grants", "sotl-grants"],
      ["Resources", "resources"],
      ["Archive", "ntlsn-archive"],
      ["Best practices", "ntlsn-bestpractice"],
      ["Frameworks", "frameworks"],
      ["Pathways", "pathways"],
      ["Benchmarks", "benchmarks"],
    ],
  },
  {
    head: "Available now · learn & explore",
    colour: "#8fb081",
    items: [
      ["At a glance", "ntlsn-glance"],
      ["Academic Induction", "ntlsn-induction"],
      ["PD & programs", "pd"],
      ["From the sector", "sector-themes"],
      ["International", "international-themes"],
      ["Featured talks", "featured-talks"],
      ["Latest", "ntlsn-latest"],
    ],
  },
  {
    head: "Coming 2027 · symposiums",
    colour: "#e6a33c",
    items: [
      ["The Portal (preview)", "ntlsn-symshow"],
      ["Symposium engine", "ntlsn-coming2027"],
      ["Peer-Review Exchange", "ntlsn-coming2027"],
      ["Calibration suite", "ntlsn-coming2027"],
      ["See all 2027 →", "ntlsn-coming2027"],
    ],
  },
  {
    head: "Coming 2028 · recognition",
    colour: "#c66c3f",
    items: [
      ["Recognition passport", "ntlsn-coming2028"],
      ["Awards & citations", "ntlsn-coming2028"],
      ["Sector interoperability", "ntlsn-coming2028"],
      ["See all 2028 →", "ntlsn-coming2028"],
    ],
  },
  {
    head: "About & join",
    colour: "#b3a48c",
    items: [
      ["About", "about"],
      ["Pricing", "pricing"],
      ["All-in-one bundle", "pricing"],
      ["Roadmap", "ntlsn-capabilities"],
      ["Advisory & alliance", "ntlsn-advisory"],
      ["Get involved", "ntlsn-network"],
    ],
  },
];

const CTAS: ReadonlyArray<{
  label: string;
  target: string;
  primary?: boolean;
}> = [
  { label: "Open the Portal", target: "ntlsn-network", primary: true },
  { label: "Pricing", target: "pricing" },
  { label: "All-in-one bundle", target: "pricing" },
];

/**
 * Full-screen megamenu overlay — the ntlsn-megamenu-script patch rebuilt as a
 * component. One overlay serves desktop AND mobile, exactly as in production
 * (the responsive CSS columns collapse to a single column on small screens).
 *
 * Keyboard/a11y, built in rather than patched on: role=dialog + aria-modal,
 * focus moves to the close button on open, Tab is trapped inside the dialog,
 * Escape closes, and the opener (Nav) restores focus to the trigger button.
 * Links are real <a href="#…"> anchors so link purpose is in the a11y tree
 * (2.4.4); smooth scrolling and its reduced-motion override live in CSS.
 */
export default function MegaMenu({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Open-time existence filter — parity with the patch's fill(): entries
  // whose target id is not in the DOM right now (e.g. #ntlsn-latest when the
  // fail-soft feed is down) simply don't render.
  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(([, target]) => document.getElementById(target)),
  })).filter((g) => g.items.length > 0);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    // Focus trap: cycle within the dialog.
    const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Portalled to <body>, exactly where the patch appended its overlay: the
  // sticky nav's backdrop-filter creates a containing block, so a fixed
  // overlay rendered INSIDE the nav would be trapped in the 64px nav band.
  return createPortal(
    <div
      ref={overlayRef}
      id="ntlsn-megamenu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[99999] overflow-y-auto bg-[rgba(6,12,22,0.975)] backdrop-blur-lg"
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="fixed top-[18px] right-[22px] z-[2] h-[42px] w-[42px] cursor-pointer rounded-[10px] border border-white/10 bg-white/5 text-2xl leading-none text-white/75 hover:bg-white/10"
      >
        &times;
      </button>
      <div
        role="navigation"
        aria-label="Site sections"
        className="mx-auto max-w-[1120px] px-7 py-[60px]"
      >
        <div className="mb-3.5">
          <span className="font-brand text-[23px] font-extrabold text-teal">
            NTLSN
          </span>
          <span className="text-base text-white/40">.com</span>
          <div className="mt-0.5 text-[11.5px] tracking-[0.3px] text-white/30">
            National Teaching &amp; Learning Sector Network
          </div>
        </div>
        <div className="mt-2.5 [column-gap:36px] [columns:3_230px]">
          {groups.map((g) => (
            <div key={g.head} className="mb-6 break-inside-avoid">
              <div
                className="mb-[9px] text-[11px] font-extrabold tracking-[1.6px] uppercase"
                style={{ color: g.colour }}
              >
                {g.head}
              </div>
              {g.items.map(([label, target], i) => (
                <a
                  key={`${target}-${i}`}
                  href={`#${target}`}
                  onClick={onClose}
                  className="block py-[7px] text-[15px] font-semibold text-white/[0.78] no-underline transition-[color,padding-left] duration-200 hover:pl-1.5 hover:text-teal"
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3.5 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          {CTAS.map((cta, i) => (
            <a
              key={`${cta.label}-${i}`}
              href={`#${cta.target}`}
              onClick={onClose}
              className={
                cta.primary
                  ? "inline-block rounded-[11px] bg-[#8fb081] px-[22px] py-[11px] text-sm font-extrabold text-[#1f1810] no-underline"
                  : "inline-block rounded-[11px] border border-white/20 bg-transparent px-[22px] py-[11px] text-sm font-extrabold text-white no-underline"
              }
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
