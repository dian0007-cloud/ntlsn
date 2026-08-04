import { type ReactNode } from "react";
import useCfold from "./useCfold";

/**
 * CollapsibleSection — the cfold decision, resolved (Epic 1.2 PR-G;
 * Collapse v2 moved the engine into useCfold, shared with CollapsibleGroup).
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
 * inside the panel (which is also why group/inner summaries all stay h2 —
 * demoting inner summaries to h3 would put h3 summaries above h2 content).
 *
 * Critical invariant — anchors must NEVER land on closed content: the
 * wrapped children render always (hidden via the collapsed grid row +
 * `inert`, or hidden="until-found" where supported — see useCfold), so every
 * canonical id stays in the DOM (the megamenu existence filter and #anchors
 * keep resolving), and a hash targeting any id in `ids` — on initial load or
 * hashchange — AUTO-OPENS the panel (instantly, no animation) and re-anchors
 * to the target. Find-in-page reveals (beforematch) run the same instant
 * path. Hash beats any stored "closed" state (Collapse v2 persistence:
 * lib/cfoldState.ts).
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
  defaultOpen = false,
  storageKey,
}: {
  /** Canonical section id(s) wrapped inside — hash targets that auto-open. */
  ids: readonly string[];
  /** Summary heading — the wrapped section's production heading language. */
  title: string;
  /** One-line teaser shown under the heading in the summary row. */
  teaser: string;
  children: ReactNode;
  /** Render expanded on first paint (e.g. interactive demo tools). */
  defaultOpen?: boolean;
  /** Persistence key override (defaults to ids[0]) — see lib/cfoldState.ts. */
  storageKey?: string;
}) {
  const cfold = useCfold({ ids, defaultOpen, storageKey });

  return (
    <div className="mx-auto max-w-[92rem] scroll-mt-20 px-6 py-2.5">
      <h2 className="m-0">
        <button
          type="button"
          id={cfold.buttonId}
          aria-expanded={cfold.open}
          aria-controls={cfold.panelId}
          onClick={cfold.toggle}
          className="group flex w-full items-center gap-4 rounded-[14px] border border-white/[0.08] bg-[#2a2218] px-5 py-4 text-left transition-colors hover:border-teal/40"
        >
          <span
            aria-hidden="true"
            className={`flex-none text-[13px] text-teal transition-transform duration-300 ${
              cfold.open ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] leading-snug font-extrabold text-white">
              {title}
            </span>
            <span className="mt-0.5 block truncate text-[12.5px] leading-normal font-normal text-[#a0907a]">
              {teaser}
            </span>
          </span>
          <span className="flex-none text-[10.5px] font-extrabold tracking-[1.2px] text-[#a0907a] uppercase group-hover:text-teal">
            {cfold.open ? "Close" : "Open"}
          </span>
        </button>
      </h2>
      <div
        id={cfold.panelId}
        role="region"
        aria-labelledby={cfold.buttonId}
        inert={cfold.inertClosed}
        onTransitionEnd={cfold.onTransitionEnd}
        className={cfold.panelClass}
      >
        <div ref={cfold.innerRef} className="cfold-inner">
          {children}
        </div>
      </div>
    </div>
  );
}
