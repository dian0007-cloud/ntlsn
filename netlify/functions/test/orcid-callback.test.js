"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const session = require("../../lib/session");

const SESSION_SECRET = "session-secret-test";
function load() {
  delete require.cache[require.resolve("../orcid-callback.js")];
  return require("../orcid-callback.js");
}
function configure() {
  process.env.ORCID_CLIENT_ID = "APP-XXXX";
  process.env.ORCID_CLIENT_SECRET = "shh";
  process.env.ORCID_REDIRECT_URI = "https://www.ntlsn.com/.netlify/functions/orcid-callback";
  process.env.NTLSN_SESSION_SECRET = SESSION_SECRET;
  process.env.ORCID_ENV = "production";
}
function withFetch(fn, body) {
  const orig = global.fetch;
  let captured = null;
  global.fetch = async (url, opts) => {
    captured = { url, opts };
    return body;
  };
  return fn(() => captured).finally(() => {
    global.fetch = orig;
  });
}

test("state mismatch → 401 and clears the transient cookies", async () => {
  configure();
  const { handler } = load();
  const res = await handler({ queryStringParameters: { code: "c", state: "A" }, headers: { cookie: "ntlsn_orcid_state=B" } });
  assert.strictEqual(res.statusCode, 401);
  assert.ok(res.multiValueHeaders["Set-Cookie"].some((c) => /ntlsn_orcid_state=; .*Max-Age=0/.test(c)));
});

test("missing state cookie → 401 (fails closed)", async () => {
  configure();
  const { handler } = load();
  const res = await handler({ queryStringParameters: { code: "c", state: "A" }, headers: {} });
  assert.strictEqual(res.statusCode, 401);
});

test("success → mints a signed session cookie, redirects clean, sends PKCE verifier", async () => {
  configure();
  const { handler } = load();
  const tokenResponse = { ok: true, json: async () => ({ orcid: "0000-0002-1825-0097", name: "Josiah Carberry" }) };
  await withFetch(async (getCaptured) => {
    const res = await handler({
      queryStringParameters: { code: "auth-code", state: "S" },
      headers: { cookie: "ntlsn_orcid_state=S; ntlsn_orcid_verifier=VER" },
    });
    assert.strictEqual(res.statusCode, 302);
    assert.strictEqual(res.headers.Location, "/symposium-streaming.html?signed_in=1");
    // PKCE verifier forwarded to ORCID
    assert.match(getCaptured().opts.body.toString(), /code_verifier=VER/);
    // session cookie minted and verifiable
    const setCookies = res.multiValueHeaders["Set-Cookie"];
    const sess = setCookies.find((c) => c.startsWith("ntlsn_session="));
    assert.ok(sess, "session cookie present");
    const token = sess.split(";")[0].split("=")[1];
    const payload = session.verify(token, SESSION_SECRET);
    assert.strictEqual(payload.orcid, "0000-0002-1825-0097");
    // identity is NOT in the redirect URL
    assert.doesNotMatch(res.headers.Location, /orcid=/);
  }, tokenResponse);
});

test("token exchange non-200 → 502", async () => {
  configure();
  const { handler } = load();
  await withFetch(async () => {
    const res = await handler({ queryStringParameters: { code: "c", state: "S" }, headers: { cookie: "ntlsn_orcid_state=S" } });
    assert.strictEqual(res.statusCode, 502);
  }, { ok: false, status: 400, json: async () => ({}) });
});

test("token response without a valid ORCID iD → 502", async () => {
  configure();
  const { handler } = load();
  await withFetch(async () => {
    const res = await handler({ queryStringParameters: { code: "c", state: "S" }, headers: { cookie: "ntlsn_orcid_state=S" } });
    assert.strictEqual(res.statusCode, 502);
  }, { ok: true, json: async () => ({ orcid: "not-an-orcid" }) });
});

test("token-exchange network fault (fetch rejects) → 502 'unreachable'", async () => {
  // Regression for audit v2 L16: the catch arm (vs the !r.ok arm) was untested.
  configure();
  const { handler } = load();
  const orig = global.fetch;
  global.fetch = async () => { throw new Error("ECONNRESET"); };
  try {
    const res = await handler({ queryStringParameters: { code: "c", state: "S" }, headers: { cookie: "ntlsn_orcid_state=S" } });
    assert.strictEqual(res.statusCode, 502);
    assert.match(JSON.parse(res.body).error, /unreachable/);
  } finally {
    global.fetch = orig;
  }
});

test("partially unconfigured (valid state, callback env missing) → 302 to auth_error, clears cookies", async () => {
  // Regression for audit v2 L12: the callback (reached by ORCID's top-level 302) still returned
  // 200 JSON on a partial misconfig, unlike the start endpoint which PR #10 hardened to a 302.
  process.env.ORCID_CLIENT_ID = "APP-XXXX";
  process.env.ORCID_REDIRECT_URI = "https://www.ntlsn.com/.netlify/functions/orcid-callback";
  delete process.env.ORCID_CLIENT_SECRET;
  delete process.env.NTLSN_SESSION_SECRET;
  const { handler } = load();
  const res = await handler({ queryStringParameters: { code: "c", state: "S" }, headers: { cookie: "ntlsn_orcid_state=S" } });
  assert.strictEqual(res.statusCode, 302);
  assert.match(res.headers.Location, /auth_error=orcid_unconfigured/);
  assert.ok(res.multiValueHeaders["Set-Cookie"].some((c) => /ntlsn_orcid_state=; .*Max-Age=0/.test(c)));
});
