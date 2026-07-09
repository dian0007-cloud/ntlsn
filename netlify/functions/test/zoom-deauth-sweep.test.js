"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const { store } = require("../../lib/store");
const { markDeauth, getDeauth } = require("../../lib/deauth");

// Phase 3 #1: the scheduled sweep is the safety-net for a webhook sync-wipe that times out on a
// very large account. Seed a "pending" tombstone + tenant data (as if the webhook didn't finish),
// run the sweep, and confirm it cleans up and marks the tombstone done.

function load() {
  delete require.cache[require.resolve("../zoom-deauth-sweep.js")];
  return require("../zoom-deauth-sweep.js");
}

test("sweep finishes a pending deauth: cleans the account's data and marks the tombstone done", async () => {
  const acct = "SWEEP1";
  await (await store("zoom-tokens")).setJSON(acct, { refresh_token_enc: "x" });
  await (await store("zoom-registrants")).setJSON(`${acct}:88800000000:a@uni.edu`, { email: "a@uni.edu" });
  await markDeauth(acct, "pending");
  assert.strictEqual((await getDeauth(acct)).status, "pending");

  const { handler } = load();
  const res = await handler({});
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(JSON.parse(res.body).processed, 1);

  assert.strictEqual(await (await store("zoom-tokens")).get(acct), null, "tokens cleaned");
  assert.strictEqual((await (await store("zoom-registrants")).list({ prefix: `${acct}:` })).blobs.length, 0, "registrants cleaned");
  assert.strictEqual((await getDeauth(acct)).status, "done", "tombstone marked done");
});

test("sweep with no pending deauths processes nothing", async () => {
  const { handler } = load();
  const res = await handler({});
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(JSON.parse(res.body).processed, 0);
});
