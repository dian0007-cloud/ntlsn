/**
 * "Latest from the Sector" feed (#ntlsn-latest, Epic 1.2 PR-B) — data layer
 * for the fail-soft Apps Script GET feed, ported from the ntlsn-latest-script
 * patch in production index.html.
 *
 * Contract (CLAUDE.md, "External dependencies"): the endpoint is rate-limited
 * and slow-cold-start — NEVER block render on it, and fail soft: any error,
 * non-array or empty response means "render nothing". The moderation
 * workflow behind it (Google Sheet review → approved rows) is untouched.
 */

/** The "Latest" Apps Script GET endpoint — verbatim from the patch script. */
export const LATEST_FEED_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbw6njLFaHEJQNVqnanEoQkoMy5DN2G1zJYslgo5bqAGI20Fiidp1VowQx6UDxccBriy/exec";

export interface LatestItem {
  title: string;
  link: string;
  source: string;
  type: string;
  date: string;
  summary?: string;
}

/** Per-type icon — the patch's ICON map (🔗 fallback in the component). */
export const LATEST_TYPE_ICONS: Readonly<Record<string, string>> = {
  video: "🎬",
  blog: "📝",
  news: "📣",
  journal: "📄",
  podcast: "🎧",
};

/** Per-type accent colour — the patch's COL map (teal fallback). */
export const LATEST_TYPE_COLOURS: Readonly<Record<string, string>> = {
  video: "#C57BFF",
  blog: "#4ECDC4",
  news: "#FFB448",
  journal: "#FF6B6B",
  podcast: "#8b9cff",
};

/** Strip feed-scraper artefacts from a summary — the patch's clean(). */
export function cleanSummary(x: string | undefined): string {
  return (x ?? "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&#?[a-z0-9]+;/gi, "")
    .replace(/\bImage\b/g, " ")
    .replace(/Read more\.{0,3}/gi, " ")
    .replace(/^[\s*•\-–]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Relative "when" label — the patch's when(). */
export function whenLabel(date: string): string {
  try {
    const t = new Date(date).getTime();
    const days = Math.floor((Date.now() - t) / 86400000);
    if (!Number.isFinite(days)) return "";
    if (days < 1) return "today";
    if (days < 2) return "1 day ago";
    if (days < 31) return `${days} days ago`;
    return `${Math.floor(days / 30)} mo ago`;
  } catch {
    return "";
  }
}

/**
 * Shape the raw feed: newest first, at most 9 items, at most 3 per source —
 * the patch's exact selection rule.
 */
export function shapeLatest(data: readonly LatestItem[]): LatestItem[] {
  const sorted = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const perSource: Record<string, number> = {};
  const items: LatestItem[] = [];
  for (const item of sorted) {
    if (items.length >= 9) break;
    perSource[item.source] = (perSource[item.source] ?? 0) + 1;
    if (perSource[item.source] <= 3) items.push(item);
  }
  return items;
}

/**
 * Fetch the feed, fail-soft. Resolves to the shaped items on success, or
 * null on ANY failure (network, HTTP error, non-array, empty) — the caller
 * renders nothing in that case. Never throws.
 */
export async function fetchLatest(
  signal?: AbortSignal,
): Promise<LatestItem[] | null> {
  try {
    const res = await fetch(LATEST_FEED_ENDPOINT, { signal });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return shapeLatest(data as LatestItem[]);
  } catch {
    return null;
  }
}
