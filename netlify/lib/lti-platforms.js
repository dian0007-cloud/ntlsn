// NTLSN — LTI 1.3 platform registry lookup. Reads data/lti-platforms.json the same way
// mcp.js reads its data files (CORS-open /data/*.json, this deploy's own origin so Deploy
// Previews see the preview's registry, not production's).
//
// The registry is deliberately plain, PR-reviewable JSON, not a secret store: an LTI
// platform's issuer, client_id, and endpoint URLs are not secrets (verification relies on
// the platform's public JWKS, not a shared secret) — see data/lti-platforms.json.
"use strict";

const ORIGIN = (process.env.DEPLOY_PRIME_URL || process.env.URL || "https://www.ntlsn.com").replace(/\/$/, "");
const TTL_MS = 60 * 1000;
let cache = null; // { at, platforms }

async function load() {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.platforms;
  const r = await fetch(ORIGIN + "/data/lti-platforms.json", { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error("lti-platforms.json " + r.status);
  const doc = await r.json();
  cache = { at: Date.now(), platforms: doc.platforms || [] };
  return cache.platforms;
}

// Matches by issuer; if more than one registration shares an issuer, disambiguates by
// clientId (required in that case — returns null rather than guessing).
async function lookupPlatform(issuer, clientId) {
  const platforms = await load();
  const matches = platforms.filter((p) => p.issuer === issuer);
  if (!matches.length) return null;
  if (matches.length === 1 && !clientId) return matches[0];
  return matches.find((p) => p.clientId === clientId) || null;
}

module.exports = { load, lookupPlatform };
