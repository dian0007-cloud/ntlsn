/**
 * #ntlsn-symshow — the "Coming soon · 2027" symposium showcase band
 * (Epic 1.2 PR-D), verbatim from the production ntlsn-symshow-script patch:
 * four crossfading slides over a muted, looping background video.
 */

export interface SymShowSlide {
  /** Per-slide backdrop (CSS background shorthand layers). */
  bg: string;
  /** Headline. */
  h: string;
  /** Subline. */
  s: string;
}

export const SYMSHOW_SLIDES: readonly SymShowSlide[] = [
  {
    "bg": "radial-gradient(circle at 28% 32%,rgba(78,205,196,.28),transparent 58%),linear-gradient(120deg,#0a1f3a,#0e2e4f 60%,#0a1628)",
    "h": "Forty-two universities. One sector.",
    "s": "Every teaching & learning conference, showcase and symposium — gathered in one open place."
  },
  {
    "bg": "radial-gradient(circle at 72% 38%,rgba(124,156,255,.24),transparent 55%),linear-gradient(120deg,#0a1628,#13243f)",
    "h": "Teaching can feel isolating.",
    "s": "More so after a restructure. You are not the only one rebuilding — and you are not rebuilding alone."
  },
  {
    "bg": "radial-gradient(circle at 40% 60%,rgba(201,169,98,.24),transparent 55%),linear-gradient(120deg,#1a1530,#0e2236)",
    "h": "Share your symposium. See everyone’s.",
    "s": "Belonging, inclusion and connection — a sector that finally sees its own work, free and open to all."
  },
  {
    "bg": "radial-gradient(circle at 60% 42%,rgba(78,205,196,.32),transparent 55%),linear-gradient(120deg,#0a1628,#0e3b3a)",
    "h": "Your people deserve a day for teaching, learning and research.",
    "s": "We come to you — and we make it happen."
  }
];

/** Background video (YouTube, privacy-enhanced host) + its poster frame. */
export const SYMSHOW_VIDEO_ID = "WIZPhelFbsI";
export const SYMSHOW_POSTER =
  "https://i.ytimg.com/vi/WIZPhelFbsI/maxresdefault.jpg";
export const SYMSHOW_EMBED_URL =
  "https://www.youtube-nocookie.com/embed/WIZPhelFbsI?autoplay=1&mute=1&loop=1&playlist=WIZPhelFbsI&controls=0&modestbranding=1&playsinline=1&rel=0&start=14&showinfo=0&disablekb=1";
