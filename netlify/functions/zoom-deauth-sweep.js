// NTLSN — Zoom app_deauthorized sweep (scheduled safety-net). The webhook (zoom-webhooks.js) writes
// a "pending" tombstone on every deauth and runs the synchronous cleanup; if that cleanup ever times
// out on a very large account, the tombstone stays "pending" and THIS function finishes it on the next
// run. Cleanup is idempotent (netlify/lib/deauth.js), so repeating the webhook's work is safe.
// (audit v2 M1, Phase 3 #1.)
//
// To ENABLE the schedule, add to netlify.toml (deliberately left to the maintainer so nothing
// build-breaking ships before review):
//   [functions."zoom-deauth-sweep"]
//     schedule = "*/5 * * * *"
// Until then this function is unit-tested and callable but not cron-triggered; the synchronous wipe
// in the webhook remains the GUARANTEED path, so reliability does not depend on the schedule.
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
