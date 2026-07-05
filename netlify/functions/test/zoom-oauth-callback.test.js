"use strict";
const { test } = require("node:test");
const assert = require("node:assert");

function load() {
  delete require.cache[require.resolve("../zoom-oauth-callback.js")];
  return require("../zoom-oauth-callback.js");
}
function configure() {
  process.env.ZOOM_CLIENT_ID = "cid";
  process.env.ZOOM_CLIENT_SECRET = "csecret";
  process.env.ZOOM_REDIRECT_URI = "https://www.ntlsn.com/.netlify/functions/zoom-oauth-callback";
}
function withFetch(body, fn) {
  const orig = global.fetch;
  global.fetch = async () => body;
  return fn().finally(() => {
    global.fetch = orig;
  });
}

test("state mismatch → 401 and clears the state cookie", async () => {
  configure();
  const { handler } = load();
  const res = await handler({ queryStringParameters: { code: "c", state: "A" }, headers: { cookie: "ntlsn_zoom_state=B" } });
  assert.strictEqual(res.statusCode, 401);
  assert.ok(res.multiValueHeaders["Set-Cookie"].some((c) => /ntlsn_zoom_state=; .*Max-Age=0/.test(c)));
});

test("unanchored-cookie attack: a differently-named cookie does not satisfy the check", async () => {
  configure();
  const { handler } = load();
  const res = await handler({ queryStringParameters: { code: "c", state: "A" }, headers: { cookie: "x_ntlsn_zoom_state=A" } });
  assert.strictEqual(res.statusCode, 401);
});

test("success → 302 connected, clears the state cookie", async () => {
  configure();
  const { handler } = load();
  await withFetch({ ok: true, json: async () => ({ access_token: "a", refresh_token: "r" }) }, async () => {
    const res = await handler({ queryStringParameters: { code: "c", state: "S" }, headers: { cookie: "ntlsn_zoom_state=S" } });
    assert.strictEqual(res.statusCode, 302);
    assert.match(res.headers.Location, /connected=1/);
    assert.ok(res.multiValueHeaders["Set-Cookie"].some((c) => /ntlsn_zoom_state=; .*Max-Age=0/.test(c)));
  });
});

test("token exchange failure → 502", async () => {
  configure();
  const { handler } = load();
  await withFetch({ ok: false, status: 401, json: async () => ({}) }, async () => {
    const res = await handler({ queryStringParameters: { code: "c", state: "S" }, headers: { cookie: "ntlsn_zoom_state=S" } });
    assert.strictEqual(res.statusCode, 502);
  });
});
