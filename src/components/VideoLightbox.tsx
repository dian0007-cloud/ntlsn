import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * On-site video lightbox (Epic 1.2 PR-B) — the componentised replacement for
 * the anonymous "NTLSN on-site video lightbox" patch script: plays
 * YouTube/Vimeo links embedded, on the site, instead of navigating away.
 *
 * Production parity: full-screen blurred overlay, "Close ✕" button top-right,
 * 16:9 max-w-[1120px] iframe, backdrop click closes, Escape closes, page
 * scroll locked while open. YouTube goes through youtube-nocookie.com and
 * Vimeo through player.vimeo.com — both already allowed by the CSP
 * frame-src (_headers).
 *
 * A11y beyond the patch (WCAG 2.2 AA, no runtime patches): role=dialog +
 * aria-modal named after the talk, focus moves to the Close button on open,
 * Tab is trapped inside the dialog, and focus returns to the triggering
 * element on close.
 */
export default function VideoLightbox({
  src,
  title,
  onClose,
}: {
  /** Embed URL (youtube-nocookie.com/embed/… or player.vimeo.com/video/…). */
  src: string;
  /** The talk title — names the dialog and the iframe. */
  title: string;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the Close button on open; restore focus to the trigger on close.
  useEffect(() => {
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();
    return () => trigger?.focus();
  }, []);

  // Lock page scroll while open (the patch sets overflow:hidden on <html>).
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, []);

  // Escape closes; Tab is trapped within the dialog.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const focusables = overlay.querySelectorAll<HTMLElement>(
        "button, iframe, [tabindex]:not([tabindex='-1'])",
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === overlay)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${title}`}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#19130d]/95 px-[4vw] py-[6vh] backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="fixed top-[18px] right-[22px] cursor-pointer rounded-[10px] border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
      >
        Close ✕
      </button>
      <div className="aspect-video w-full max-w-[1120px] overflow-hidden rounded-[14px] bg-black shadow-[0_24px_90px_rgba(0,0,0,0.65)]">
        <iframe
          src={src}
          title={title}
          className="block h-full w-full border-0"
          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
          allowFullScreen
        />
      </div>
    </div>,
    document.body,
  );
}

/**
 * Build the lightbox embed URL for a video link, or null if it is not a
 * YouTube/Vimeo link — the patch's exact URL shapes (youtube-nocookie for
 * YouTube, per CSP frame-src).
 */
export function lightboxEmbedSrc(url: string): string | null {
  const yt =
    url.match(/[?&]v=([\w-]{11})/) ??
    url.match(/youtu\.be\/([\w-]{11})/) ??
    url.match(/\/embed\/([\w-]{11})/);
  if (yt) {
    return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
  }
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return null;
}
