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

test("a store error degrades fail-safe to live:false AND is logged (observable)", async () => {
  // Regression for audit v2 L14: a blob read error was swallowed into live:false with no
  // server-side trace, conflating a Blobs outage with a genuinely-ended meeting.
  const { handler } = load();
  await (await store("zoom-live")).set("66612345678", "{not json"); // corrupt -> get(type:json) throws
  const orig = console.error;
  let logged = false;
  console.error = () => { logged = true; };
  try {
    const res = await handler({ httpMethod: "GET", queryStringParameters: { meetingNumber: "66612345678" } });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(JSON.parse(res.body).live, false);
    assert.ok(logged, "store error logged server-side");
  } finally {
    console.error = orig;
  }
});
