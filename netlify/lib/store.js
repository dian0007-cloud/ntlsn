// NTLSN — thin wrapper over Netlify Blobs for the streaming pilot's durable state:
//   • zoom-tokens   — per-account encrypted Zoom refresh tokens
//   • zoom-live     — per-meeting LIVE flag (drives the embed)
//   • zoom-registrants — per-registrant PII (deleted on app_deauthorized)
//   • zoom-recordings  — per-meeting replay links
//   • ratelimit     — best-effort durable counters
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

// Return a store instance. Uses Netlify Blobs on the platform, in-memory otherwise.
async function store(name) {
  if (onNetlify) {
    const mod = await blobsMod();
    if (mod) {
      try {
        return isProd ? mod.getStore({ name, consistency: "strong" }) : mod.getDeployStore({ name });
      } catch (_e) {
        // fall through to in-memory
      }
    }
  }
  return memStore(name);
}

// True only when durable Blobs storage is actually available (used to decide whether to
// advertise persistence vs. degrade gracefully).
function durable() {
  return onNetlify;
}

module.exports = { store, durable };
