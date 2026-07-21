/**
 * Placeholder for a not-yet-ported section.
 *
 * Launch suppression: renders as a hidden anchor only — the canonical id stays
 * in the DOM (so #anchors and the megamenu existence filter keep working) but
 * there is NO visible "Porting soon" stub, so the page reads as complete.
 * Flip back to a visible marker post-launch to track remaining port work.
 */
export default function SectionPlaceholder({ id }: { id: string }) {
  return <section id={id} className="hidden" aria-hidden="true" />;
}
