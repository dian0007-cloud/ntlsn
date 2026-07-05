"use strict";
const { test } = require("node:test");
const assert = require("node:assert");

function load() {
  delete require.cache[require.resolve("../orcid-oauth-start.js")];
  return require("../orcid-oauth-start.js");
}

test("unconfigured → 302 back to the page with an auth_error flag (no raw JSON)", async () => {
  delete process.env.ORCID_CLIENT_ID;
  delete process.env.ORCID_REDIRECT_URI;
  const { handler } = load();
  const res = await handler({ headers: {} });
  assert.strictEqual(res.statusCode, 302);
  assert.match(res.headers.Location, /auth_error=orcid_unconfigured/);
});

test("configured → consent URL carries PKCE S256 + state, and two HttpOnly cookies are set", async () => {
  process.env.ORCID_CLIENT_ID = "APP-XXXX";
  process.env.ORCID_REDIRECT_URI = "https://www.ntlsn.com/.netlify/functions/orcid-callback";
  process.env.ORCID_ENV = "production";
  const { handler } = load();
  const res = await handler({ headers: {} });
  assert.strictEqual(res.statusCode, 302);
  assert.match(res.headers.Location, /^https:\/\/orcid\.org\/oauth\/authorize/);
  assert.match(res.headers.Location, /code_challenge_method=S256/);
  assert.match(res.headers.Location, /code_challenge=[A-Za-z0-9_-]+/);
  assert.match(res.headers.Location, /state=[a-f0-9]{32}/);
  const cookies = res.multiValueHeaders["Set-Cookie"];
  assert.strictEqual(cookies.length, 2);
  assert.ok(cookies.some((c) => /ntlsn_orcid_state=.*HttpOnly.*Secure/.test(c)));
  assert.ok(cookies.some((c) => /ntlsn_orcid_verifier=.*HttpOnly.*Secure/.test(c)));
});
