import type { ReactNode } from "react";

/**
 * Guided-path step waypoint — the `ntlsn-gp-label` treatment from the
 * production guided-path patch CSS (uppercase tracked label with a 22px
 * numbered ring), shared by #pd (gp-pd) and #frameworks (gp-fw). The ring
 * numeral duplicates the visible "Step N" text, so it is decorative; the
 * patches' scroll-driven step state machine is not ported — these are
 * static waypoints.
 */
export default function StepLabel({
  n,
  children,
}: {
  n: number;
  children: ReactNode;
}) {
  return (
    <p className="mx-auto mb-3 flex max-w-3xl items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-white/40 uppercase">
      <span
        aria-hidden="true"
        className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-white/20 text-[11px] font-bold tracking-normal text-white/50"
      >
        {n}
      </span>
      <span>{children}</span>
    </p>
  );
}
