// NTLSN — LTI Deep Linking content registry lookup. Reads data/lti-content.json the same
// way lti-platforms.js reads its registry (this deploy's own origin, so Deploy Previews
// see the preview's registry, not production's).
//
// The registry is the ONLY source of truth for what can be deep-linked: the return
// endpoint looks selections up here by id and ignores any client-supplied titles/URLs —
// a picker form can choose from the menu, never write to it.
"use strict";

const ORIGIN = (process.env.DEPLOY_PRIME_URL || process.env.URL || "https://www.ntlsn.com").replace(/\/$/, "");
const TTL_MS = 60 * 1000;
let cache = null; // { at, items }

async function load() {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.items;
  const r = await fetch(ORIGIN + "/data/lti-content.json", { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error("lti-content.json " + r.status);
  const doc = await r.json();
  cache = { at: Date.now(), items: doc.items || [] };
  return cache.items;
}

// Resolves selected ids to registry items — unknown ids are silently dropped, duplicates
// collapse to one, and output order follows the registry (stable, not attacker-ordered).
async function lookupItems(ids) {
  const items = await load();
  const wanted = new Set(Array.isArray(ids) ? ids : []);
  return items.filter((it) => wanted.has(it.id));
}

module.exports = { load, lookupItems };
