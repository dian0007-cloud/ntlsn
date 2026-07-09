// NTLSN — thin wrapper over Netlify Blobs for the streaming pilot's durable state:
//   • zoom-tokens   — per-account encrypted Zoom refresh tokens
//   • zoom-live     — per-meeting LIVE flag (drives the embed)
//   • zoom-registrants — per-registrant PII (deleted on app_deauthorized)
//   • zoom-recordings  — per-account replay links (account-scoped; deleted on deauth)
//   • ratelimit     — best-effort per-user counters (one record per user)
//
// Production uses the GLOBAL store (persists across deploys); previews/branch deploys use a
// DEPLOY-scoped store so pilot/test data never lands in the production namespace. Off Netlify
// (local unit tests) it falls back to an in-memory Map so handlers stay testable with no context.
// @netlify/blobs is ESM; loaded via dynamic import() so it works on the Node 20 runtime too.
"use strict";

const onNetlify = !!(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_DEV);
const isProd = process.env.CONTEXT === "production";

let _blobs = null;
async function blobsMod() {
  if (_blobs === null) {
    try {
      _blobs = await import("@netlify/blobs");
    } catch (_e) {
      _blobs = false;
    }
  }
  return _blobs;
}

// In-memory fallback: storeName -> Map(key -> serialised value)
const _mem = new Map();
function memStore(name) {
  const bucket = (isProd ? "prod:" : "deploy:") + name;
  if (!_mem.has(bucket)) _mem.set(bucket, new Map());
  const m = _mem.get(bucket);
  return {
    async get(key, opt) {
      const v = m.has(key) ? m.get(key) : null;
      if (v == null) return null;
      return opt && opt.type === "json" ? JSON.parse(v) : v;
    },
    async set(key, value) {
      m.set(key, typeof value === "string" ? value : String(value));
    },
    async setJSON(key, value) {
      m.set(key, JSON.stringify(value));
    },
    async delete(key) {
      m.delete(key);
    },
    async list(opts) {
      const prefix = (opts && opts.prefix) || "";
      return { blobs: [...m.keys()].filter((k) => k.startsWith(prefix)).map((k) => ({ key: k, etag: "" })), directories: [] };
    },
  };
}

// Construct a store. Returns { store, durable } where `durable` is TRUE only when a real
// Netlify Blobs store was actually constructed — NOT merely when a NETLIFY* env var is set.
// (The old durable() helper returned onNetlify, which lied whenever Blobs failed to import or
// getStore/getDeployStore threw: store() silently fell back to per-instance _mem while callers
// gating on durability believed they had durable storage — encrypted refresh tokens written to
// ephemeral memory, rate limits enforced per-instance, live state split-brained across
// instances, all masked by healthy 200s. Audit v2 L2.)
async function open(name) {
  if (onNetlify) {
    const mod = await blobsMod();
    if (mod) {
      try {
        const s = isProd
          ? mod.getStore({ name, consistency: "strong" })
          : mod.getDeployStore({ name });
        return { store: s, durable: true };
      } catch (e) {
        // Blobs is configured-ish (a NETLIFY* env var is set) but unusable for this request
        // (missing site/deploy context, bad region, partial import). Surface it so the silent
        // fallback to per-instance _mem is observable — otherwise monitoring sees healthy 200s
        // while durable state is effectively absent.
        console.error("[ntlsn/store] Blobs unavailable — using in-memory fallback for", name, "::", (e && e.message) || e);
      }
    }
  }
  return { store: memStore(name), durable: false };
}

// Back-comat: return just the store object. Use this only from callers that do NOT gate on
// durability (applyEvent writes best-effort; zoom-live reads best-effort; unit tests). Callers
// that decide whether to persist/rate-limit MUST use open() and read the returned `durable`.
async function store(name) {
  return (await open(name)).store;
}

module.exports = { store, open };
