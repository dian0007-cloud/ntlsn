/**
 * Section search box — the rounded-2xl search treatment shared by production's
 * #pd, #resources and #teaching-resources sections (magnifier icon, teal
 * focus ring, live "×" clear button). One component instead of three inline
 * copies; the placeholders are production's live, patch-enhanced strings
 * (e.g. "Search resources — try “rubrics”"), passed in per section.
 */
export default function SearchField({
  value,
  onChange,
  placeholder,
  label,
  className = "mb-6",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Accessible name for the input (and its clear button). */
  label: string;
  /** Outer-wrapper margin utilities (production varies mb-6 / mb-10). */
  className?: string;
}) {
  return (
    <div className={`relative mx-auto max-w-2xl ${className}`}>
      <div className="relative flex items-center rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-300 focus-within:border-teal/50 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-teal/10 hover:border-white/20">
        <svg
          className="pointer-events-none absolute left-5 h-5 w-5 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className="w-full rounded-2xl bg-transparent py-4 pr-14 pl-14 text-lg text-white outline-none placeholder:text-white/30"
        />
        {value !== "" && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Clear: ${label}`}
            className="absolute right-5 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-sm text-white/50 transition-colors hover:bg-white/20 hover:text-white"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
