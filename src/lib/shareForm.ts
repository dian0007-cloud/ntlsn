/**
 * The symposium share-form contract + "Shared across the sector" feed
 * (Epic 1.2 PR-C) — data layer for #ntlsn-zoom, ported from the HARDENED
 * share-form submit handler and the shared-feed patch in production
 * index.html.
 *
 * ⚠ THE POST CONTRACT IS LOAD-BEARING (CLAUDE.md, docs/moderation.md):
 * submissions go as a JSON string in a `text/plain;charset=utf-8` body —
 * deliberately, to avoid a CORS preflight Apps Script cannot answer — to
 * SHARE_ENDPOINT, and land as Pending rows in the moderation Sheet. Do not
 * change the content type, the endpoint, or the body's key order.
 *
 * buildShareBody() reproduces the production handler byte-for-byte:
 *   var obj={}; new FormData(fm).forEach((v,k)=>{obj[k]=v});
 *   obj.title=obj.symposium||obj.title||'';
 *   JSON.stringify(obj)
 * so the body's key order is the form's field DOM order (form-name,
 * bot-field, type, institution, symposium, link, email) with `title`
 * appended last. The component renders its fields in exactly that order.
 */

/** The symposium-share Apps Script endpoint — POST intake + GET feed. */
export const SHARE_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbxPJQHPuXu06x5hFc-XyyyuE0eBU2BL-EiwhqCfhiW_nhuGWBm3dJk-c_q7qTwgcVj_/exec";

/** Thank-you toast copy — verbatim from the handler (shown optimistically,
 * fail-soft: whether or not the POST succeeded — see docs/moderation.md §6,
 * and for honeypot silent-drops so bots never learn they were caught). */
export const SHARE_TOAST_HTML_PREFIX = "✓ ";
export const SHARE_TOAST_STRONG = "Thank you — your symposium is in.";
export const SHARE_TOAST_REST =
  " A moderator will review it and add it to the sector calendar.";

/**
 * Serialise the form exactly like the production handler. Returns the POST
 * body string, or the honeypot sentinel when bot-field is filled.
 */
export function buildShareBody(
  form: HTMLFormElement,
): { kind: "post"; body: string } | { kind: "honeypot" } {
  const obj: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    obj[key] = typeof value === "string" ? value : "";
  });
  obj.title = obj.symposium || obj.title || "";
  if (String(obj["bot-field"] ?? "").trim() !== "") {
    return { kind: "honeypot" };
  }
  return { kind: "post", body: JSON.stringify(obj) };
}

/**
 * The handler's minimal validation — exact rules and messages, in order.
 * Returns the first error message, or null when the submission is valid.
 */
export function validateShare(form: HTMLFormElement): string | null {
  const obj: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    obj[key] = typeof value === "string" ? value : "";
  });
  if (String(obj.type ?? "").trim() === "") {
    return "Please choose what you are sharing.";
  }
  if (String(obj.institution ?? "").trim() === "") {
    return "Please add your institution.";
  }
  if (String(obj.symposium ?? "").trim() === "") {
    return "Please add the symposium or event name.";
  }
  if (!/^https?:\/\/\S+\.\S+/i.test(String(obj.link ?? "").trim())) {
    return "Please paste a full link starting with http:// or https://";
  }
  return null;
}

/** POST the body — fail-soft (the handler's fetch().then(done,done)). */
export async function postShare(body: string): Promise<void> {
  try {
    await fetch(SHARE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
  } catch {
    // Fail-soft by contract: the toast shows regardless (moderation.md §6).
  }
}

// ---------------------------------------------------------------------------
// "Shared across the sector" feed (the GET side of the same endpoint).
// ---------------------------------------------------------------------------

export interface SharedItem {
  title: string;
  institution: string;
  link: string;
  type?: string;
  date?: string;
  /** Go8/ATN/IRU/RUN/Independent — drives the badge colour. */
  network?: string;
}

/** Network badge colours — the shared-feed patch's map (teal fallback). */
export const SHARED_NETWORK_COLOURS: Readonly<Record<string, string>> = {
  Go8: "#c9a962",
  ATN: "#d96650",
  IRU: "#a8737f",
  RUN: "#8fb081",
  Independent: "#8fb081",
};

/**
 * Client-side test-row filter — documented in docs/moderation.md §4: a row
 * is hidden if title+institution+link contains the Rick Astley video id,
 * "will appear here", the standalone word "test", or "delete this row".
 */
export function isTestRow(item: SharedItem): boolean {
  const blob =
    `${item.title ?? ""} ${item.institution ?? ""} ${item.link ?? ""}`.toLowerCase();
  return (
    /dqw4w9wgxcq/.test(blob) ||
    blob.includes("will appear here") ||
    /\btest\b/.test(blob) ||
    blob.includes("delete this row")
  );
}

/** YouTube video id from a shared link, or null — the patch's matcher. */
export function sharedYouTubeId(link: string): string | null {
  const m =
    link.match(/[?&]v=([\w-]{11})/) ?? link.match(/youtu\.be\/([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * Fetch the approved rows, fail-soft. Resolves to the filtered list on
 * success (possibly empty — the section shows its "be the first to share"
 * state), or null on ANY failure (render nothing, exactly like the patch).
 */
export async function fetchShared(
  signal?: AbortSignal,
): Promise<SharedItem[] | null> {
  try {
    const res = await fetch(SHARE_ENDPOINT, { signal });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return (data as SharedItem[]).filter((item) => !isTestRow(item));
  } catch {
    return null;
  }
}
