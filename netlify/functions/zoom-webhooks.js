// NTLSN — Zoom webhook receiver (HMAC-verified, CRC handshake).
// Drives "LIVE now" state + registration confirmations + recording links for
// symposiums streamed through a connected university Zoom account.
//
// THIS LOGIC IS REAL — it verifies Zoom's signature correctly. It needs:
//   env ZOOM_WEBHOOK_SECRET_TOKEN  (from your Zoom General app → Feature → Event Subscriptions)
// The secret is now MANDATORY (fail closed): a missing token rejects every request rather
// than silently accepting forged events. What it does NOT yet do (needs a token store):
// persist per-tenant state. See docs/backend-audit.md.
"use strict";

const crypto = require("crypto");
const HEADERS = { "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" };

// Zoom's CRC plainToken is a short random alphanumeric string. We refuse to HMAC-sign any
// plainToken outside this charset so the CRC response can NEVER equal an event-signature
// message (`v0:<ts>:<body>`, which contains colons/braces) — closing the signing oracle
// where an attacker requests HMAC(secret, "v0:ts:body") via CRC and replays it as a signature.
const PLAINTOKEN_RE = /^[A-Za-z0-9_.-]+$/;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: "POST only" }) };

  const secret = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
  // Fail closed: without the secret we cannot authenticate anything, so accept nothing.
  if (!secret)
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: "ZOOM_WEBHOOK_SECRET_TOKEN not set" }) };

  const raw = event.body || "";
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch (_e) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "bad json" }) };
  }

  // 1) CRC / URL-validation handshake (Zoom sends this when you set the endpoint).
  if (msg.event === "endpoint.url_validation" && msg.payload && msg.payload.plainToken) {
    const plainToken = msg.payload.plainToken;
    if (typeof plainToken !== "string" || !PLAINTOKEN_RE.test(plainToken))
      return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "bad plainToken" }) };
    const encryptedToken = crypto.createHmac("sha256", secret).update(plainToken).digest("hex");
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ plainToken, encryptedToken }) };
  }

  // 2) Signature verification on every real event (secret-token HMAC method).
  const ts = event.headers["x-zm-request-timestamp"];
  const sig = event.headers["x-zm-signature"];
  const message = `v0:${ts}:${raw}`;
  const hash = crypto.createHmac("sha256", secret).update(message).digest("hex");
  const expected = `v0=${hash}`;
  const ok =
    typeof sig === "string" &&
    sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  // replay protection: reject timestamps older than 5 minutes (x-zm-request-timestamp is seconds).
  const fresh = ts && Math.abs(Date.now() / 1000 - Number(ts)) < 300;
  if (!ok || !fresh)
    return { statusCode: 401, headers: HEADERS, body: JSON.stringify({ error: "bad signature" }) };

  // 3) Route the event (respond 200 FAST; heavy work belongs in a background fn).
  switch (msg.event) {
    case "meeting.started":
    case "webinar.started":
      // TODO(token store): mark this symposium LIVE so the page shows the embed
      break;
    case "meeting.ended":
    case "webinar.ended":
      // TODO(token store): clear LIVE state
      break;
    case "meeting.registration_created":
    case "webinar.registration_created":
      // TODO(token store): store registrant + send confirmation
      break;
    case "recording.completed":
      // TODO: hand off to zoom-recording-fetch (background fn) to publish the replay
      break;
    case "app_deauthorized":
      // TODO(token store): a uni removed us — DELETE all of that tenant's tokens + PII (review requirement)
      break;
    default:
      break;
  }
  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ received: msg.event || "unknown" }) };
};
