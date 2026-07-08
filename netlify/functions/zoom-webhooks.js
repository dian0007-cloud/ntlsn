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
const DELETE_BATCH = 50;
// Delete every key under `prefix` in a store, in bounded-parallel batches (Promise.all per
// chunk) so a large account can't run the webhook past its wall-clock timeout before Zoom gets
// its ack (audit v2 M1/L4). Best-effort — errors are swallowed so a storage hiccup never turns
// into a non-200. The full fix offloads this to a Background Function (Phase 3).
async function wipeByPrefix(storeName, prefix) {
  try {
    const s = await store(storeName);
    const { blobs } = await s.list({ prefix });
    const keys = (blobs || []).map((b) => b.key);
    for (let i = 0; i < keys.length; i += DELETE_BATCH) {
      const batch = keys.slice(i, i + DELETE_BATCH);
      await Promise.all(batch.map((k) => s.delete(k).catch(() => {})));
    }
  } catch (_e) {
    // best-effort; never fail the webhook on cleanup
  }
}

// Clear a deauthorized account's zoom-live entries using the account->meetings index written on
// meeting.started (audit v2 M2). zoom-live is keyed by bare meetingNumber and read by zoom-live.js
// with no account context, so the index is the only way to find an account's live meetings. Also
// drops the index entries themselves. Bounded-parallel; best-effort.
async function cleanAccountLive(acct) {
  try {
    const idx = await store("zoom-account-meetings");
    const { blobs } = await idx.list({ prefix: `${acct}:` });
    const meetings = (blobs || []).map((b) => b.key.slice(acct.length + 1)).filter(Boolean);
    if (meetings.length) {
      const live = await store("zoom-live");
      for (let i = 0; i < meetings.length; i += DELETE_BATCH) {
        const batch = meetings.slice(i, i + DELETE_BATCH);
        await Promise.all(batch.map((m) => live.delete(m).catch(() => {})));
      }
    }
    await wipeByPrefix("zoom-account-meetings", `${acct}:`);
  } catch (_e) {
    // best-effort; never fail the webhook on cleanup
  }
}

async function applyEvent(msg) {
  const p = (msg && msg.payload) || {};
  const obj = p.object || {};
  const meeting = obj.id != null ? String(obj.id) : "";
  try {
    switch (msg.event) {
      case "meeting.started":
      case "webinar.started": {
        if (meeting) {
          await (await store("zoom-live")).setJSON(meeting, { live: true, at: obj.start_time || null });
          // Index the meeting under its account so app_deauthorized can also clear zoom-live
          // (audit v2 M2 — zoom-live is otherwise keyed by meeting id with no account link).
          const startAcct = String(p.account_id || "acct");
          await (await store("zoom-account-meetings")).setJSON(`${startAcct}:${meeting}`, { at: obj.start_time || null });
        }
        break;
      }
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
      case "recording.completed": {
        // Account-scoped key so app_deauthorized can find and delete a deauthorized tenant's
        // recording share URLs (audit v2 M2). zoom-recordings has no reader yet, so re-keying
        // is safe; the value shape is unchanged.
        const recAcct = String(p.account_id || "acct");
        if (meeting)
          await (await store("zoom-recordings")).setJSON(`${recAcct}:${meeting}`, {
            share_url: obj.share_url || "", at: Math.floor(Date.now() / 1000),
          });
        break;
      }
      case "app_deauthorized": {
        // A university removed us: delete their tokens, registrant PII, recording share URLs,
        // and live state for that account (Zoom Marketplace data-compliance). zoom-live is
        // recovered via the account->meetings index written on meeting.started (audit v2 M2).
        const acct = String(p.account_id || "");
        if (acct) {
          await (await store("zoom-tokens")).delete(acct);
          await wipeByPrefix("zoom-registrants", `${acct}:`);
          await wipeByPrefix("zoom-recordings", `${acct}:`);
          await cleanAccountLive(acct);
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
  // Compare BYTE lengths, not UTF-16 code-unit lengths: a non-ASCII sig of the same character
  // count encodes to more UTF-8 bytes, which would make timingSafeEqual throw RangeError ->
  // an opaque 500 instead of a clean 401, trivially triggerable by any caller (audit v2 L3).
  const sigBuf = typeof sig === "string" ? Buffer.from(sig) : null;
  const expBuf = Buffer.from(expected);
  const ok = !!(sigBuf && sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf));
  // replay protection: reject timestamps older than 5 minutes (x-zm-request-timestamp is seconds).
  const fresh = ts && Math.abs(Date.now() / 1000 - Number(ts)) < 300;
  if (!ok || !fresh)
    return { statusCode: 401, headers: HEADERS, body: JSON.stringify({ error: "bad signature" }) };

  // 3) Apply the verified event to durable state, then 200 (Zoom needs a fast ack).
  await applyEvent(msg);
  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ received: msg.event || "unknown" }) };
};
