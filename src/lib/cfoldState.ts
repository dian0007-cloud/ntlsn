/**
 * cfold persistence (Collapse v2) — remembers explicit user open/close
 * choices for CollapsibleSection / CollapsibleGroup across visits.
 *
 * Storage: one localStorage key holding a JSON map id -> "open" | "closed".
 * Rules (enforced by the callers, documented here as the contract):
 *  - ONLY explicit user toggles write (the toggle click handler) — hash
 *    deep-link opens and find-in-page (beforematch) reveals never write.
 *  - Reads happen in the useState INITIALIZER (never a post-mount setState),
 *    so a restored panel mounts at its final height in one commit — no
 *    closed→open pop, no CLS, and no race with the hash effect.
 *  - Precedence: hash deep-link > stored state > defaultOpen (the hash check
 *    also lives in the initializer, so a stored "closed" can never defeat a
 *    deep link regardless of effect ordering).
 *  - Groups persist under a namespaced key (e.g. "g:ntlsn-recognition"),
 *    NEVER under their first member id — the Recognition group's first id is
 *    also the id of an inner fold, and sharing a key would cross-restore.
 *
 * Failure model: private mode / disabled storage / quota all fail SOFT —
 * every access is wrapped, corrupt JSON is discarded, and the page behaves
 * exactly as if nothing was stored. SSR-safe (typeof window guards),
 * belt-and-braces only: main.tsx uses createRoot, not hydration.
 */

const STORAGE_KEY = "ntlsn-cfold-v1";

type CfoldMap = Record<string, "open" | "closed">;

function readAll(): CfoldMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return {};
    return parsed as CfoldMap;
  } catch {
    return {};
  }
}

/**
 * Stored state for an id: true (open) / false (closed) / undefined (no
 * explicit user choice stored — fall back to defaultOpen).
 */
export function readCfoldState(id: string): boolean | undefined {
  const v = readAll()[id];
  if (v === "open") return true;
  if (v === "closed") return false;
  return undefined;
}

/** Record an explicit user toggle. Call ONLY from the toggle click handler. */
export function writeCfoldState(id: string, open: boolean): void {
  if (typeof window === "undefined") return;
  try {
    const all = readAll();
    all[id] = open ? "open" : "closed";
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Private mode / quota — the toggle still works for this visit.
  }
}
