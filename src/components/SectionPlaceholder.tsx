import { sectionLabel } from "../sections";

/**
 * Placeholder for a not-yet-ported section. Carries the EXACT production id
 * (from the ntlsn-order canonical order) so #anchors keep working while
 * sections are ported one at a time (TASKS.md 1.2).
 */
export default function SectionPlaceholder({ id }: { id: string }) {
  return (
    <section
      id={id}
      aria-label={`${sectionLabel(id)} (porting soon)`}
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-6 sm:px-6"
    >
      <div className="rounded-xl border border-dashed border-white/10 px-5 py-4">
        <h2 className="text-sm font-bold text-white/40">{sectionLabel(id)}</h2>
        <p className="mt-1 text-xs text-white/25">Porting soon.</p>
      </div>
    </section>
  );
}
