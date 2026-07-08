"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const enc = require("../../lib/crypto");

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

test("token exchange network fault (fetch rejects) → 502 'unreachable' and clears the state cookie", async () => {
  configure();
  const { handler } = load();
  const orig = global.fetch;
  global.fetch = async () => { throw new Error("ECONNRESET"); };
  try {
    const res = await handler({ queryStringParameters: { code: "c", state: "S" }, headers: { cookie: "ntlsn_zoom_state=S" } });
    assert.strictEqual(res.statusCode, 502);
    assert.match(JSON.parse(res.body).error, /unreachable/);
    assert.ok(res.multiValueHeaders["Set-Cookie"].some((c) => /ntlsn_zoom_state=; .*Max-Age=0/.test(c)), "state cookie cleared on the 502 path too");
  } finally {
    global.fetch = orig;
  }
});

test("persistTenant durable path: encrypts the refresh token, keyed by account_id, round-trips", async () => {
  // Regression for audit v2 M3: the composition fetch /users/me -> account_id -> enc.encrypt ->
  // store.setJSON was never exercised. Drives persistTenant directly with an injected durable
  // store so the at-rest-security path runs under test.
  configure();
  process.env.NTLSN_TOKEN_ENC_KEY = "a".repeat(64);
  const { persistTenant } = load();
  const orig = global.fetch;
  global.fetch = async (url) => {
    if (String(url).includes("/v2/users/me")) return { ok: true, json: async () => ({ account_id: "ACCT-Z", id: "u-1" }) };
    return { ok: false, status: 404 };
  };
  const writes = new Map();
  const fakeOpen = async () => ({
    durable: true,
    store: { setJSON: async (k, v) => { writes.set(k, v); }, get: async () => null },
  });
  try {
    await persistTenant({ access_token: "AT", refresh_token: "secret-refresh", scope: "meeting:read" }, fakeOpen);
  } finally {
    global.fetch = orig;
  }
  assert.ok(writes.has("ACCT-Z"), "keyed by account_id (account_id wins over id)");
  const rec = writes.get("ACCT-Z");
  assert.strictEqual(rec.scope, "meeting:read");
  assert.ok(rec.refresh_token_enc && rec.refresh_token_enc !== "secret-refresh", "stored encrypted, never plaintext");
  assert.strictEqual(enc.decrypt(rec.refresh_token_enc), "secret-refresh", "round-trips through enc.decrypt");
  delete process.env.NTLSN_TOKEN_ENC_KEY;
});
