// NTLSN — Zoom app-deauthorized cleanup, shared by the webhook (synchronous) and the scheduled
// sweep (safety-net). Every operation here is IDEMPOTENT (delete/wipe on already-removed keys is a
// no-op), so running it twice — once in the webhook, once in the sweep — is safe and that is the
// point: the webhook acks fast and cleans up synchronously for normal accounts; if its cleanup
// ever times out on a very large account, the sweep finishes the job. (audit v2 M1, Phase 3 #1.)
"use strict";

const { store } = require("./store");

const DELETE_BATCH = 50;

// Delete every key under `prefix` in a store, in bounded-parallel batches so a large account
// can't run the webhook past its wall-clock timeout before Zoom gets its ack. Best-effort.
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
    // best-effort; never fail the caller on cleanup
  }
}

// Clear a deauthorized account's zoom-live entries via the account->meetings index, then drop the
// index entries. Bounded-parallel; best-effort. (audit v2 M2.)
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
    // best-effort
  }
}

// Full Zoom Marketplace data-compliance wipe for a deauthorized account: tokens, registrant PII,
// recording share URLs, and live state. Idempotent — safe to call from both the webhook and the sweep.
async function deauthAccount(acct) {
  await (await store("zoom-tokens")).delete(acct);
  await wipeByPrefix("zoom-registrants", `${acct}:`);
  await wipeByPrefix("zoom-recordings", `${acct}:`);
  await cleanAccountLive(acct);
}

// Tombstone record: lets the scheduled sweep find accounts whose synchronous cleanup may not have
// finished (timeout on a very large account) and finish them. markDeauth("pending") in the webhook
// BEFORE cleanup; markDeauth("done") after. (Phase 3 #1.)
async function markDeauth(acct, status) {
  try {
    await (await store("zoom-deauth")).setJSON(acct, { status, at: Math.floor(Date.now() / 1000) });
  } catch (_e) {
    // best-effort; a tombstone is a safety-net, not a correctness requirement
  }
}

async function getDeauth(acct) {
  try {
    return await (await store("zoom-deauth")).get(acct, { type: "json" });
  } catch (_e) {
    return null;
  }
}

// Accounts whose cleanup is still pending. The sweep processes these in bounded batches.
async function listPendingDeauths() {
  try {
    const s = await store("zoom-deauth");
    const { blobs } = await s.list({ prefix: "" });
    const out = [];
    for (const b of blobs || []) {
      const rec = await s.get(b.key, { type: "json" });
      if (rec && rec.status === "pending") out.push(b.key);
    }
    return out;
  } catch (_e) {
    return [];
  }
}

module.exports = { deauthAccount, markDeauth, getDeauth, listPendingDeauths, wipeByPrefix };
