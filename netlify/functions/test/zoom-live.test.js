"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const { store } = require("../../lib/store");

function load() {
  delete require.cache[require.resolve("../zoom-live.js")];
  return require("../zoom-live.js");
}

test("GET only", async () => {
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: {} });
  assert.strictEqual(res.statusCode, 405);
});

test("bad meetingNumber → 400", async () => {
  const { handler } = load();
  const res = await handler({ httpMethod: "GET", queryStringParameters: { meetingNumber: "abc" } });
  assert.strictEqual(res.statusCode, 400);
});

test("reports live:false by default and live:true after the store is set", async () => {
  const { handler } = load();
  let res = await handler({ httpMethod: "GET", queryStringParameters: { meetingNumber: "77712345678" } });
  assert.strictEqual(JSON.parse(res.body).live, false);

  await (await store("zoom-live")).setJSON("77712345678", { live: true });
  res = await handler({ httpMethod: "GET", queryStringParameters: { meetingNumber: "77712345678" } });
  const body = JSON.parse(res.body);
  assert.strictEqual(body.live, true);
  assert.strictEqual(body.meetingNumber, "77712345678");
});
