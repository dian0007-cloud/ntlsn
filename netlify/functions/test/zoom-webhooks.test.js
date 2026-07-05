"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const crypto = require("crypto");

const SECRET = "webhook-secret-test";
function load() {
  delete require.cache[require.resolve("../zoom-webhooks.js")];
  return require("../zoom-webhooks.js");
}
function sign(ts, raw) {
  return "v0=" + crypto.createHmac("sha256", SECRET).update(`v0:${ts}:${raw}`).digest("hex");
}

test("POST only", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  const res = await handler({ httpMethod: "GET", headers: {}, body: "" });
  assert.strictEqual(res.statusCode, 405);
});

test("fails closed (500) when the secret is unset — no forged event is accepted", async () => {
  delete process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: {}, body: JSON.stringify({ event: "app_deauthorized" }) });
  assert.strictEqual(res.statusCode, 500);
});

test("CRC handshake returns HMAC(secret, plainToken) for a well-formed token", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  const plainToken = "qgg8vlvZRQOUmovSHkNAcw";
  const res = await handler({ httpMethod: "POST", headers: {}, body: JSON.stringify({ event: "endpoint.url_validation", payload: { plainToken } }) });
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.strictEqual(body.plainToken, plainToken);
  assert.strictEqual(body.encryptedToken, crypto.createHmac("sha256", SECRET).update(plainToken).digest("hex"));
});

test("CRC signing oracle is closed — a plainToken shaped like an event message is rejected", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  const body = JSON.stringify({ event: "recording.completed", payload: {} });
  const ts = Math.floor(Date.now() / 1000);
  const forgedPlainToken = `v0:${ts}:${body}`; // contains colons/braces
  const res = await handler({ httpMethod: "POST", headers: {}, body: JSON.stringify({ event: "endpoint.url_validation", payload: { plainToken: forgedPlainToken } }) });
  assert.strictEqual(res.statusCode, 400);
  assert.match(JSON.parse(res.body).error, /plainToken/);
});

test("valid signature + fresh timestamp is accepted", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  const raw = JSON.stringify({ event: "meeting.started", payload: {} });
  const ts = Math.floor(Date.now() / 1000);
  const res = await handler({ httpMethod: "POST", headers: { "x-zm-request-timestamp": String(ts), "x-zm-signature": sign(ts, raw) }, body: raw });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(JSON.parse(res.body).received, "meeting.started");
});

test("bad signature is rejected (401)", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  const raw = JSON.stringify({ event: "meeting.started" });
  const ts = Math.floor(Date.now() / 1000);
  const res = await handler({ httpMethod: "POST", headers: { "x-zm-request-timestamp": String(ts), "x-zm-signature": "v0=deadbeef" }, body: raw });
  assert.strictEqual(res.statusCode, 401);
});

test("stale timestamp is rejected even with a valid signature", async () => {
  process.env.ZOOM_WEBHOOK_SECRET_TOKEN = SECRET;
  const { handler } = load();
  const raw = JSON.stringify({ event: "meeting.started" });
  const ts = Math.floor(Date.now() / 1000) - 3600; // 1h old
  const res = await handler({ httpMethod: "POST", headers: { "x-zm-request-timestamp": String(ts), "x-zm-signature": sign(ts, raw) }, body: raw });
  assert.strictEqual(res.statusCode, 401);
});
