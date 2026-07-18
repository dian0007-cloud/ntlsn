// NTLSN — minimal RS256 JWT sign/verify for LTI 1.3 (IMS Security Framework).
// Deliberately hand-rolled rather than a JOSE dependency: this codebase's Netlify
// functions are dependency-free by convention (see mcp.js), and RS256-only keeps the
// surface small enough to review directly. Node's own crypto does the actual RSA math —
// this only handles JWT framing (base64url + header/payload) and JWKS plumbing.
//
// Needs env NTLSN_LTI_PRIVATE_KEY: a PEM-encoded PKCS8 RSA private key (generate one
// with scripts/generate-lti-keypair.mjs). Accepts either real newlines or literal "\n".
"use strict";

const crypto = require("crypto");

const b64url = (buf) => Buffer.from(buf).toString("base64url");
const b64urlJSON = (obj) => b64url(Buffer.from(JSON.stringify(obj)));

function loadPrivateKey() {
  let pem = process.env.NTLSN_LTI_PRIVATE_KEY || "";
  if (!pem) return null;
  if (!pem.includes("\n")) pem = pem.replace(/\\n/g, "\n");
  try {
    return crypto.createPrivateKey(pem);
  } catch (_e) {
    return null;
  }
}

// RFC 7638 JWK thumbprint over the fixed {e, kty, n} member set, used as a stable `kid`
// derived from the key itself — no separate id to keep in sync across key rotation.
function thumbprint(jwk) {
  const canonical = JSON.stringify({ e: jwk.e, kty: jwk.kty, n: jwk.n });
  return crypto.createHash("sha256").update(canonical).digest("base64url");
}

// The public half of NTLSN_LTI_PRIVATE_KEY, shaped for a JWKS `keys[]` entry.
// Returns null when unconfigured — callers surface that as 503, not a crash.
function publicJwk() {
  const priv = loadPrivateKey();
  if (!priv) return null;
  const jwk = crypto.createPublicKey(priv).export({ format: "jwk" });
  jwk.kid = thumbprint(jwk);
  jwk.use = "sig";
  jwk.alg = "RS256";
  return jwk;
}

function sign(payload, extraHeader) {
  const priv = loadPrivateKey();
  if (!priv) throw new Error("NTLSN_LTI_PRIVATE_KEY not set");
  const kid = publicJwk().kid;
  const header = Object.assign({ alg: "RS256", typ: "JWT", kid }, extraHeader);
  const signingInput = b64urlJSON(header) + "." + b64urlJSON(payload);
  const sig = crypto.sign("RSA-SHA256", Buffer.from(signingInput), priv);
  return signingInput + "." + b64url(sig);
}

// Verifies signature + exp/iat window against a caller-supplied key (JWK object or PEM
// string) — does NOT check iss/aud/nonce/deployment_id/message_type; those are launch-flow
// decisions the caller makes on the returned payload, not JWT-mechanics concerns.
//
// The algorithm is pinned to RS256 regardless of what the token's own header claims — an
// attacker-controlled "alg" (e.g. flipping to "none" or HS256-with-the-public-key) is the
// classic JWT algorithm-confusion attack; trusting header.alg here would reopen it.
function verify(token, jwkOrPem) {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let header, payload;
  try {
    header = JSON.parse(Buffer.from(h, "base64url").toString("utf8"));
    payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
  } catch (_e) {
    return null;
  }
  if (header.alg !== "RS256") return null;
  let key;
  try {
    key = typeof jwkOrPem === "string" ? crypto.createPublicKey(jwkOrPem) : crypto.createPublicKey({ key: jwkOrPem, format: "jwk" });
  } catch (_e) {
    return null;
  }
  let ok;
  try {
    ok = crypto.verify("RSA-SHA256", Buffer.from(h + "." + p), key, Buffer.from(s, "base64url"));
  } catch (_e) {
    return null;
  }
  if (!ok) return null;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && now > payload.exp) return null;
  if (typeof payload.iat === "number" && payload.iat > now + 300) return null; // 5-min clock-skew tolerance
  return payload;
}

// Fetches and caches a remote JWKS by URL, keyed by kid. On an unknown kid (the platform
// may have rotated keys since our last fetch) it refetches once, bypassing the cache,
// before giving up — a stale cache must never cause a false verification failure.
const jwksCache = new Map(); // url -> { at, keys: Map(kid -> jwk) }
const JWKS_TTL_MS = 10 * 60 * 1000;

async function fetchJwks(url, bypassCache) {
  if (!bypassCache) {
    const hit = jwksCache.get(url);
    if (hit && Date.now() - hit.at < JWKS_TTL_MS) return hit.keys;
  }
  const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error("jwks fetch " + r.status);
  const doc = await r.json();
  const keys = new Map((doc.keys || []).map((k) => [k.kid, k]));
  jwksCache.set(url, { at: Date.now(), keys });
  return keys;
}

async function verifyWithJwksUrl(token, jwksUrl) {
  const parts = String(token).split(".");
  if (parts.length !== 3) return null;
  let header;
  try {
    header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
  } catch (_e) {
    return null;
  }
  if (header.alg !== "RS256" || !header.kid) return null;
  let keys = await fetchJwks(jwksUrl, false);
  let jwk = keys.get(header.kid);
  if (!jwk) {
    keys = await fetchJwks(jwksUrl, true);
    jwk = keys.get(header.kid);
  }
  if (!jwk) return null;
  return verify(token, jwk);
}

module.exports = { publicJwk, sign, verify, verifyWithJwksUrl, loadPrivateKey };
