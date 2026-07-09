// NTLSN — signed, HttpOnly session token (HMAC-SHA256 over a compact JSON payload).
// The ORCID callback mints one on a verified sign-in; zoom-meeting-signature requires
// a valid one before minting a Zoom join token. Stateless — no DB needed for the token
// itself. Needs env NTLSN_SESSION_SECRET (any long random string).
"use strict";

const crypto = require("crypto");

const COOKIE_NAME = "ntlsn_session";
const b64url = (s) => Buffer.from(s).toString("base64url");

// token = base64url(JSON payload) + "." + base64url(HMAC(secret, body))
function sign(payload, secret) {
  if (!secret) throw new Error("NTLSN_SESSION_SECRET not set");
  const body = b64url(JSON.stringify(payload));
  const mac = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${mac}`;
}

// Returns the payload if the signature is valid and the token is unexpired, else null.
function verify(token, secret) {
  if (!secret || !token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  const mb = Buffer.from(mac);
  const eb = Buffer.from(expected);
  if (mb.length !== eb.length || !crypto.timingSafeEqual(mb, eb)) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch (_e) {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  // A session token MUST carry a numeric expiry. The MAC already binds the body so an
  // attacker cannot flip their own exp — this guards against a future signer bug: a token
  // minted with exp:0 / a missing exp / a non-numeric exp is REJECTED rather than silently
  // accepted as never-expiring (the old truthiness gate did the opposite — L1, audit v2).
  const exp = payload.exp;
  if (typeof exp !== "number" || !Number.isFinite(exp)) return null;
  if (Math.floor(Date.now() / 1000) > exp) return null;
  return payload;
}

// Serialised Set-Cookie for the session (HttpOnly so client JS can't forge it).
function cookie(token, maxAgeSeconds) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

module.exports = { sign, verify, cookie, COOKIE_NAME };
