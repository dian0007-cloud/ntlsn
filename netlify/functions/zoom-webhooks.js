// NTLSN — Zoom webhook receiver (HMAC-verified, CRC handshake).
// Drives "LIVE now" state + registration confirmations + recording links for
// symposiums streamed through a connected university Zoom account.
//
// THIS LOGIC IS REAL — it verifies Zoom's signature correctly. It only needs:
//   env ZOOM_WEBHOOK_SECRET_TOKEN  (from your Zoom General app → Feature → Event Subscriptions)
// What it does NOT yet do (needs the 2027 token DB): persist per-tenant state.
// See ~/Desktop/NTLSN-symposium-streaming-spec.md.

const crypto = require("crypto");
const CORS = { "Content-Type": "application/json" };

exports.handler = async (event) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "POST only" }) };

  const secret = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
  const raw = event.body || "";
  let msg;
  try { msg = JSON.parse(raw); } catch (e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "bad json" }) };
  }

  // 1) CRC / URL-validation handshake (Zoom sends this when you set the endpoint)
  if (msg.event === "endpoint.url_validation" && msg.payload && msg.payload.plainToken) {
    if (!secret) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "ZOOM_WEBHOOK_SECRET_TOKEN not set" }) };
    const encryptedToken = crypto.createHmac("sha256", secret).update(msg.payload.plainToken).digest("hex");
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ plainToken: msg.payload.plainToken, encryptedToken }) };
  }

  // 2) Signature verification on every real event (secret-token HMAC method)
  if (secret) {
    const ts = event.headers["x-zm-request-timestamp"];
    const sig = event.headers["x-zm-signature"];
    const message = `v0:${ts}:${raw}`;
    const hash = crypto.createHmac("sha256", secret).update(message).digest("hex");
    const expected = `v0=${hash}`;
    const ok = sig && sig.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    // replay protection: reject timestamps older than 5 minutes
    const fresh = ts && Math.abs(Date.now() / 1000 - Number(ts)) < 300;
    if (!ok || !fresh)
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: "bad signature" }) };
  }

  // 3) Route the event (respond 200 FAST; heavy work belongs in a background fn)
  switch (msg.event) {
    case "meeting.started":
    case "webinar.started":
      // TODO(2027 DB): mark this symposium LIVE so the page shows the embed
      break;
    case "meeting.ended":
    case "webinar.ended":
      // TODO(2027 DB): clear LIVE state
      break;
    case "meeting.registration_created":
    case "webinar.registration_created":
      // TODO(2027 DB): store registrant + send confirmation
      break;
    case "recording.completed":
      // TODO(2027): hand off to zoom-recording-fetch (background fn) to publish the replay
      break;
    case "app_deauthorized":
      // TODO(2027 DB): a uni removed us — DELETE all of that tenant's tokens + PII (review requirement)
      break;
    default:
      break;
  }
  return { statusCode: 200, headers: CORS, body: JSON.stringify({ received: msg.event || "unknown" }) };
};
