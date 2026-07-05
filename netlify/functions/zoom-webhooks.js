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
const { store } = require("../lib/store");
const HEADERS = { "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" };

// Persist the verified event into durable state. Best-effort — a storage hiccup must not turn
// into a non-200 (Zoom would retry/disable the endpoint). Meeting id + account id come from the
// standard Zoom payload shape ({ payload: { account_id, object: { id, ... } } }).
async function applyEvent(msg) {
  const p = (msg && msg.payload) || {};
  const obj = p.object || {};
  const meeting = obj.id != null ? String(obj.id) : "";
  try {
    switch (msg.event) {
      case "meeting.started":
      case "webinar.started":
        if (meeting) await (await store("zoom-live")).setJSON(meeting, { live: true, at: obj.start_time || null });
        break;
      case "meeting.ended":
      case "webinar.ended":
        if (meeting) await (await store("zoom-live")).setJSON(meeting, { live: false, at: obj.end_time || null });
        break;
      case "meeting.registration_created":
      case "webinar.registration_created": {
        const r = obj.registrant || {};
        if (meeting && r.email) {
          const key = `${p.account_id || "acct"}:${meeting}:${r.email}`;
          await (await store("zoom-registrants")).setJSON(key, {
            email: r.email, first_name: r.first_name || "", last_name: r.last_name || "",
            join_url: r.join_url || "", at: Math.floor(Date.now() / 1000),
          });
        }
        break;
      }
      case "recording.completed":
        if (meeting)
          await (await store("zoom-recordings")).setJSON(meeting, {
            share_url: obj.share_url || "", at: Math.floor(Date.now() / 1000),
          });
        break;
      case "app_deauthorized": {
        // A university removed us: delete their tokens and every registrant PII record for that
        // account (Zoom Marketplace data-compliance requirement).
        const acct = String(p.account_id || "");
        if (acct) {
          await (await store("zoom-tokens")).delete(acct);
          const reg = await store("zoom-registrants");
          const { blobs } = await reg.list({ prefix: `${acct}:` });
          for (const b of blobs || []) await reg.delete(b.key);
        }
        break;
      }
      default:
        break;
    }
  } catch (_e) {
    // best-effort; never fail the 200 on a storage error
  }
}

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

  // 3) Apply the verified event to durable state, then 200 (Zoom needs a fast ack).
  await applyEvent(msg);
  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ received: msg.event || "unknown" }) };
};
