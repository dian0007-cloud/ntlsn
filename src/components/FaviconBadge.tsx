import { useState } from "react";

/**
 * Organiser favicon badge — the `data-clogo` favicon patch from the
 * production index.html folded into a component (TASKS.md 1.2): a 34px
 * near-white rounded tile holding the organiser's favicon from the Google s2
 * service, keyed by the event URL's hostname (CSP img-src already allows
 * https:). Production requests sz=64 and renders it at 22px, so we do the
 * same.
 *
 * Rendered only when the event has a real external http(s) URL. Decorative by
 * design: alt="" + aria-hidden, loading="lazy", and if the favicon fails to
 * load (offline, blocked, no favicon) the whole tile hides itself instead of
 * showing a broken-image glyph — production's patch leaves the broken glyph;
 * hiding is the deliberate improvement.
 */
export default function FaviconBadge({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false);

  let host: string | null = null;
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        host = parsed.hostname;
      }
    } catch {
      // Not a parseable external URL — no badge.
    }
  }
  if (!host || failed) return null;

  return (
    <span
      aria-hidden="true"
      className="mb-2.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-white/[0.92] shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`}
        alt=""
        loading="lazy"
        width={22}
        height={22}
        className="h-[22px] w-[22px] object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
