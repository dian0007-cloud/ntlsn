import { type ReactNode } from "react";
import useCfold from "./useCfold";

/**
 * CollapsibleGroup (Collapse v2) — a themed one-row shell that wraps a SET of
 * CollapsibleSections behind a single summary row, so a run of near-identical
 * collapsed rows (Recognition ×13, the mission cluster, the roadmap pair)
 * reads as one entry instead of a wall. Opening the group reveals the inner
 * rows; each inner row stays individually collapsible (nested folds keep
 * their own defaultOpen — e.g. the seven recognition "Try it" tools open
 * INSIDE a closed-by-default group).
 *
 * Same engine as CollapsibleSection (useCfold): APG button+region
 * disclosure, grid-row collapse, hash deep-link auto-open, find-in-page
 * reveal. `ids` must be the group's FULL member list — a contiguous
 * SECTION_ORDER slice within one band — so a hash to ANY member opens the
 * group in the same synchronous mount/hashchange commit as the inner fold
 * (both layers listen to the same event; the inner fold then wins the final
 * two-rAF re-anchor). Nested transitionends are ignored by the target guard
 * in useCfold, so toggling an inner fold can never false-settle the group.
 *
 * Persistence: groups MUST pass a storageKey distinct from every section id
 * (convention "g:<first-id>") — the Recognition group's first member id is
 * ALSO the id of an inner fold, and sharing ids[0] as the key would
 * cross-restore group and fold. See lib/cfoldState.ts.
 *
 * Visual language: same card row as CollapsibleSection, visually
 * distinguished as a GROUP — stronger border, gold accent chevron and a
 * "N sections" count badge. Heading level: the group summary is an <h2> and
 * inner summaries STAY <h2> (flat outline — matching the shipped ~40-row
 * precedent; wrapped sections keep verbatim <h2>s inside their panels, so
 * demoting inner summaries to h3 would invert the outline).
 */
export default function CollapsibleGroup({
  ids,
  storageKey,
  title,
  teaser,
  children,
  defaultOpen = false,
}: {
  /** ALL member section ids, in canonical order — hash targets auto-open. */
  ids: readonly string[];
  /** Persistence key — REQUIRED, must not collide with any section id. */
  storageKey: string;
  title: string;
  teaser: string;
  children: ReactNode;
  defaultOpen?: boolean;
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
          className="group flex w-full items-center gap-4 rounded-[14px] border-2 border-[#c9a962]/35 bg-[#2e2418] px-5 py-4 text-left transition-colors hover:border-[#c9a962]/70"
        >
          <span
            aria-hidden="true"
            className={`flex-none text-[13px] text-[#c9a962] transition-transform duration-300 ${
              cfold.open ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-[15px] leading-snug font-extrabold text-white">
                {title}
              </span>
              <span className="inline-block flex-none rounded-full border border-[#c9a962]/40 px-2 py-px text-[10px] font-extrabold tracking-[0.8px] text-[#c9a962] uppercase">
                {ids.length} sections
              </span>
            </span>
            <span className="mt-0.5 block truncate text-[12.5px] leading-normal font-normal text-[#a0907a]">
              {teaser}
            </span>
          </span>
          <span className="flex-none text-[10.5px] font-extrabold tracking-[1.2px] text-[#a0907a] uppercase group-hover:text-[#c9a962]">
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
