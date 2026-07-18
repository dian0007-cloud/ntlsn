import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent,
} from "react";

/**
 * CollapsibleSection — the cfold decision, resolved (Epic 1.2 PR-G).
 *
 * Production's ntlsn-cfold "node spine" collapsed most of the page behind a
 * runtime patch. The rebuild replaces it with this hybrid: the core journey
 * renders EXPANDED (no wrapper), and the long tail renders inside this
 * wrapper, COLLAPSED by default behind a card-styled summary row (section
 * heading + one-line teaser).
 *
 * Semantics: button + region disclosure (WAI-ARIA APG pattern) rather than
 * <details>/<summary> — chosen because the grid-template-rows 0fr→1fr
 * transition animates smoothly and keyboard behaviour (Enter/Space on a real
 * <button>) is native. The summary is an <h2> so collapsed sections stay in
 * the heading outline; the wrapped section keeps its own verbatim <h2>
 * inside the panel.
 *
 * Critical invariant — anchors must NEVER land on closed content: the
 * wrapped children render always (hidden via the collapsed grid row +
 * `inert`), so every canonical id stays in the DOM (the megamenu existence
 * filter and #anchors keep resolving), and a hash targeting any id in `ids`
 * — on initial load or hashchange — AUTO-OPENS the panel (instantly, no
 * animation) and re-anchors to the target.
 *
 * Motion: the open/close transition is pure CSS (styles.css .cfold-panel);
 * the global prefers-reduced-motion block zeroes it, so reduced-motion users
 * get an instant toggle. While closed (and while animating) the panel inner
 * is overflow:hidden; once the open transition settles, overflow returns to
 * visible so position:sticky content inside (e.g. the litmus scrollytelling)
 * behaves normally.
 */
export default function CollapsibleSection({
  ids,
  title,
  teaser,
  children,
}: {
  /** Canonical section id(s) wrapped inside — hash targets that auto-open. */
  ids: readonly string[];
  /** Summary heading — the wrapped section's production heading language. */
  title: string;
  /** One-line teaser shown under the heading in the summary row. */
  teaser: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // Overflow can only go visible once the opening transition has settled.
  const [settled, setSettled] = useState(false);
  // Instant (transition-less) open, used for hash deep-links.
  const [instant, setInstant] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

  const uid = useId();
  const buttonId = `cfold-btn-${uid}`;
  const panelId = `cfold-panel-${uid}`;

  // Hash deep-link → auto-open + re-anchor (initial load and hashchange).
  useEffect(() => {
    const onHash = () => {
      const target = window.location.hash.slice(1);
      if (!target || !ids.includes(target)) return;
      setInstant(true);
      setOpen(true);
      setSettled(true);
      // Two frames: let the panel lay out at full height, then anchor.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setInstant(false);
          document
            .getElementById(target)
            ?.scrollIntoView({ behavior: "auto", block: "start" });
        });
      });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [ids]);

  // Fallback for a missed transitionend (e.g. reduced motion's 0.01ms
  // transition can slip a frame): settle shortly after opening regardless.
  useEffect(() => {
    if (!open || settled) return;
    const t = setTimeout(() => {
      if (openRef.current) setSettled(true);
    }, 500);
    return () => clearTimeout(t);
  }, [open, settled]);

  const toggle = () => {
    if (open) {
      // Overflow must be hidden again BEFORE the closing animation starts.
      setSettled(false);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "grid-template-rows") return;
    if (openRef.current) setSettled(true);
  };

  return (
    <div className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-2.5">
      <h2 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className="group flex w-full items-center gap-4 rounded-[14px] border border-white/[0.08] bg-[#0f1f3a] px-5 py-4 text-left transition-colors hover:border-teal/40"
        >
          <span
            aria-hidden="true"
            className={`flex-none text-[13px] text-teal transition-transform duration-300 ${
              open ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] leading-snug font-extrabold text-white">
              {title}
            </span>
            <span className="mt-0.5 block truncate text-[12.5px] leading-normal font-normal text-[#8AA0B6]">
              {teaser}
            </span>
          </span>
          <span className="flex-none text-[10.5px] font-extrabold tracking-[1.2px] text-[#8AA0B6] uppercase group-hover:text-teal">
            {open ? "Close" : "Open"}
          </span>
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        onTransitionEnd={onTransitionEnd}
        className={`cfold-panel${open ? " cfold-open" : ""}${
          instant ? " cfold-instant" : ""
        }${settled ? " cfold-settled" : ""}`}
      >
        <div className="cfold-inner">{children}</div>
      </div>
    </div>
  );
}
