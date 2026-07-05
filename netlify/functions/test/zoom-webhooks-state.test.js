"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const crypto = require("crypto");
const { store } = require("../../lib/store");

const SECRET = "webhook-secret-test";
function load() {
  delete require.cache[require.resolve("../zoom-webhooks.js")];
  return require("../zoom-webhooks.js");
}
function post(handler, bodyObj) {
  const raw = JSON.stringify(bodyObj);
  const ts = Math.floor(Date.now() / 1000);
  const sig = "v0=" + crypto.createHmac("sha256", SECRET).update(`v0:${ts}:${raw}`).digest("hex");
  return handler({ httpMethod: "POST", headers: { "x-zm-request-timestamp": String(ts), "x-zm-signature": sig }, body: raw });
}

test("meeting.started sets LIVE, meeting.ended clears it", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  await post(handler, { event: "meeting.started", payload: { object: { id: "88812345678" } } });
  let rec = await (await store("zoom-live")).get("88812345678", { type: "json" });
  assert.strictEqual(rec.live, true);
  await post(handler, { event: "meeting.ended", payload: { object: { id: "88812345678" } } });
  rec = await (await store("zoom-live")).get("88812345678", { type: "json" });
  assert.strictEqual(rec.live, false);
});

test("app_deauthorized deletes the tenant's tokens and registrant PII", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  // seed a token + a registrant for account ACCT1
  await (await store("zoom-tokens")).setJSON("ACCT1", { refresh_token_enc: "x" });
  await post(handler, {
    event: "meeting.registration_created",
    payload: { account_id: "ACCT1", object: { id: "88800000000", registrant: { email: "a@uni.edu", first_name: "A" } } },
  });
  let reg = await store("zoom-registrants");
  assert.strictEqual((await reg.list({ prefix: "ACCT1:" })).blobs.length, 1);

  await post(handler, { event: "app_deauthorized", payload: { account_id: "ACCT1" } });
  assert.strictEqual(await (await store("zoom-tokens")).get("ACCT1"), null);
  reg = await store("zoom-registrants");
  assert.strictEqual((await reg.list({ prefix: "ACCT1:" })).blobs.length, 0);
});
