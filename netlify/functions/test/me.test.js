"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const session = require("../../lib/session");

const SESSION_SECRET = "session-secret-test";
function load() {
  delete require.cache[require.resolve("../me.js")];
  return require("../me.js");
}

test("GET only", async () => {
  process.env.NTLSN_SESSION_SECRET = SESSION_SECRET;
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: {} });
  assert.strictEqual(res.statusCode, 405);
});

test("no cookie → signedIn:false", async () => {
  process.env.NTLSN_SESSION_SECRET = SESSION_SECRET;
  const { handler } = load();
  const res = await handler({ httpMethod: "GET", headers: {} });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(JSON.parse(res.body).signedIn, false);
});

test("valid session cookie → signedIn:true with identity", async () => {
  process.env.NTLSN_SESSION_SECRET = SESSION_SECRET;
  const { handler } = load();
  const now = Math.floor(Date.now() / 1000);
  const token = session.sign({ orcid: "0000-0002-1825-0097", name: "Josiah", exp: now + 3600 }, SESSION_SECRET);
  const res = await handler({ httpMethod: "GET", headers: { cookie: session.cookie(token, 3600).split(";")[0] } });
  const body = JSON.parse(res.body);
  assert.strictEqual(body.signedIn, true);
  assert.strictEqual(body.orcid, "0000-0002-1825-0097");
});

test("tampered cookie → signedIn:false", async () => {
  process.env.NTLSN_SESSION_SECRET = SESSION_SECRET;
  const { handler } = load();
  const res = await handler({ httpMethod: "GET", headers: { cookie: "ntlsn_session=forged.value" } });
  assert.strictEqual(JSON.parse(res.body).signedIn, false);
});

test("missing NTLSN_SESSION_SECRET → 503 (misconfig visible, not a silent 200)", async () => {
  // Regression for audit v2 L11: the old 200 signedIn:false on a missing secret was
  // indistinguishable from a normal unsigned-in request and hid the broken deploy from 5xx alerting.
  delete process.env.NTLSN_SESSION_SECRET;
  const { handler } = load();
  const res = await handler({ httpMethod: "GET", headers: {} });
  assert.strictEqual(res.statusCode, 503);
  assert.strictEqual(JSON.parse(res.body).configured, false);
});
