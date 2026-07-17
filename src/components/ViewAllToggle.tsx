/**
 * "View all N …" / "Show less" fold button — production's exact pill
 * treatment, shared by the PD, Resource Hub and Teaching Resources grids.
 */
export default function ViewAllToggle({
  expanded,
  onToggle,
  viewAllLabel,
  className = "mt-8",
}: {
  expanded: boolean;
  onToggle: () => void;
  /** Collapsed-state label, e.g. "View all 73 opportunities". */
  viewAllLabel: string;
  /** Wrapper margin utilities (production varies mt-8 / mb-8). */
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/70"
      >
        {expanded ? "Show less" : viewAllLabel}
      </button>
    </div>
  );
}
