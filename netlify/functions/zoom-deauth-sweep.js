// NTLSN — Zoom app_deauthorized sweep (scheduled safety-net). The webhook (zoom-webhooks.js) writes
// a "pending" tombstone on every deauth and runs the synchronous cleanup; if that cleanup ever times
// out on a very large account, the tombstone stays "pending" and THIS function finishes it on the next
// run. Cleanup is idempotent (netlify/lib/deauth.js), so repeating the webhook's work is safe.
// (audit v2 M1, Phase 3 #1.)
//
// Schedule ENABLED in netlify.toml (every 5 min, "*/5 * * * *"). This is a SAFETY-NET only — the
// synchronous wipe in zoom-webhooks.js is the GUARANTEED path; this just finishes any "pending"
// tombstone left behind when that wipe times out on a large account. Cleanup is idempotent
// (netlify/lib/deauth.js), so repeating the webhook's work is safe. (Phase 3 #1.)
"use strict";

const { deauthAccount, markDeauth, listPendingDeauths } = require("../lib/deauth");

// Bound the work per invocation so a long tail of pending accounts can't stall a single scheduled run.
const MAX_PER_RUN = 10;

exports.handler = async () => {
  const pending = await listPendingDeauths();
  let processed = 0;
  for (const acct of pending.slice(0, MAX_PER_RUN)) {
    await deauthAccount(acct); // idempotent — safe to repeat the webhook's work
    await markDeauth(acct, "done");
    processed++;
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ processed, remaining: Math.max(0, pending.length - processed) }),
  };
};
