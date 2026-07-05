// NTLSN — Zoom Meeting SDK signature (JWT) for the in-browser "watch the symposium" embed.
// REAL logic — generates the exact JWT the Meeting SDK for Web (Component View) needs to join.
// Needs env: ZOOM_SDK_KEY, ZOOM_SDK_SECRET  (from your Zoom *Meeting SDK* app — a SEPARATE
//   registration from the General OAuth app). The SDK Secret NEVER ships to the browser.
//   NTLSN_SESSION_SECRET (to require a signed-in ORCID session before minting).
//   ZOOM_ALLOWED_MEETINGS (optional, comma-separated allowlist of meeting numbers).
// POST { meetingNumber }  ->  { signature, sdkKey }   (attendee-only; host tokens are gated)
// Auth: requires the signed HttpOnly ORCID session cookie — CORS is NOT the auth boundary
//   (browsers enforce it; direct callers ignore it). Audit: docs/backend-audit.md.
"use strict";

const crypto = require("crypto");
const { readCookie } = require("../lib/cookies");
const session = require("../lib/session");
const { store, durable } = require("../lib/store");

// CORS: only NTLSN origins may make a *cross-origin* request. The same-origin page needs no
// ACAO. Disallowed cross-origins are rejected (403) rather than silently served the wrong ACAO.
const ALLOWED = ["https://www.ntlsn.com", "https://ntlsn.com"];
function originOf(event) {
  return (event.headers && (event.headers.origin || event.headers.Origin)) || "";
}
function corsHeaders(origin) {
  const allow = ALLOWED.indexOf(origin) > -1 ? origin : "";
  const h = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  };
  if (allow) h["Access-Control-Allow-Origin"] = allow;
  return h;
}

const b64url = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
const MEETING_RE = /^[0-9]{9,11}$/;

// Rate limit: durable across instances via Blobs (fixed 60s window per signed-in user), with
// an in-memory fallback when Blobs isn't available. Caps a single user minting a flood of join
// tokens; the session gate + allowlist remain the primary controls.
const WINDOW_SECONDS = 60;
const MAX_PER_WINDOW = 20;
const _mem = new Map();
async function rateLimited(orcid) {
  const nowSec = Math.floor(Date.now() / 1000);
  const windowId = Math.floor(nowSec / WINDOW_SECONDS);
  const key = `${orcid}:${windowId}`;
  if (durable()) {
    try {
      const rl = await store("ratelimit");
      const rec = await rl.get(key, { type: "json" });
      const count = (rec && rec.n) || 0;
      if (count >= MAX_PER_WINDOW) return true;
      await rl.setJSON(key, { n: count + 1 });
      return false;
    } catch (_e) {
      // fall through to in-memory
    }
  }
  const arr = (_mem.get(orcid) || []).filter((t) => nowSec - t < WINDOW_SECONDS);
  arr.push(nowSec);
  _mem.set(orcid, arr);
  return arr.length > MAX_PER_WINDOW;
}

exports.handler = async (event) => {
  const origin = originOf(event);
  const CORS = corsHeaders(origin);
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "POST only" }) };

  // Reject cross-origin requests from origins not on the allowlist. (Same-origin requests
  // send no Origin header for same-site POSTs in some browsers, or the page's own origin.)
  if (origin && ALLOWED.indexOf(origin) === -1)
    return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: "origin not allowed" }) };

  const key = process.env.ZOOM_SDK_KEY,
    secret = process.env.ZOOM_SDK_SECRET,
    sessionSecret = process.env.NTLSN_SESSION_SECRET;
  if (!key || !secret)
    return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: "Set ZOOM_SDK_KEY / ZOOM_SDK_SECRET (Zoom Meeting SDK app) to enable the live embed.", configured: false }) };

  // AUTH: require a valid signed-in ORCID session. CORS is not authorization.
  const cookie = (event.headers && (event.headers.cookie || event.headers.Cookie)) || "";
  const user = sessionSecret ? session.verify(readCookie(cookie, session.COOKIE_NAME), sessionSecret) : null;
  if (!user) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: "sign in with ORCID to watch" }) };

  if (await rateLimited(user.orcid || "anon"))
    return { statusCode: 429, headers: CORS, body: JSON.stringify({ error: "rate limited" }) };

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (_e) {}
  const meetingNumber = String(body.meetingNumber || "");
  if (!MEETING_RE.test(meetingNumber))
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "valid meetingNumber required" }) };

  // Optional allowlist: only mint for meetings NTLSN is authorised to stream.
  const allowlist = (process.env.ZOOM_ALLOWED_MEETINGS || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  if (allowlist.length && allowlist.indexOf(meetingNumber) === -1)
    return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: "meeting not streamable" }) };

  // Public watch-embed: only ever mint an ATTENDEE (role 0) signature. Host (role 1) tokens
  // must be gated behind an authenticated host session — never issued from this endpoint.
  const role = 0;
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2; // 2h
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { appKey: key, sdkKey: key, mn: meetingNumber, role, iat, exp, tokenExp: exp };
  const unsigned = `${b64url(header)}.${b64url(payload)}`;
  const signature = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");

  return { statusCode: 200, headers: CORS, body: JSON.stringify({ signature: `${unsigned}.${signature}`, sdkKey: key, configured: true }) };
};
