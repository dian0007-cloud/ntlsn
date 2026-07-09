"use strict";
const { test } = require("node:test");
const assert = require("node:assert");

// Audit v2 L18: zoom-oauth-start.js — the Zoom OAuth start endpoint that issues the CSRF state
// cookie and builds the consent URL — had no test file at all (its exact parallel orcid-oauth-start
// is fully covered). Mirrors orcid-oauth-start.test.js.

function load() {
  delete require.cache[require.resolve("../zoom-oauth-start.js")];
  return require("../zoom-oauth-start.js");
}

test("unconfigured → 302 back to the page with a zoom_error flag (no raw JSON)", async () => {
  delete process.env.ZOOM_CLIENT_ID;
  delete process.env.ZOOM_REDIRECT_URI;
  const { handler } = load();
  const res = await handler({ headers: {} });
  assert.strictEqual(res.statusCode, 302);
  assert.match(res.headers.Location, /zoom_error=unconfigured/);
});

test("configured → consent URL on zoom.us with a 32-hex state and an HttpOnly+Secure cookie", async () => {
  process.env.ZOOM_CLIENT_ID = "zoomcid";
  process.env.ZOOM_REDIRECT_URI = "https://www.ntlsn.com/.netlify/functions/zoom-oauth-callback";
  const { handler } = load();
  const res = await handler({ headers: {} });
  assert.strictEqual(res.statusCode, 302);
  assert.match(res.headers.Location, /^https:\/\/zoom\.us\/oauth\/authorize/);
  assert.match(res.headers.Location, /state=[a-f0-9]{32}/);
  // The CSRF state cookie must be unreadable to client JS (HttpOnly) and Secure.
  assert.match(res.headers["Set-Cookie"], /ntlsn_zoom_state=[a-f0-9]{32}; HttpOnly; Secure; SameSite=Lax/);
});
