"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const session = require("../../lib/session");

const SDK_KEY = "sdkkey123";
const SDK_SECRET = "sdksecret456";
const SESSION_SECRET = "session-secret-test";

function load() {
  delete require.cache[require.resolve("../zoom-meeting-signature.js")];
  return require("../zoom-meeting-signature.js");
}
function setup() {
  process.env.ZOOM_SDK_KEY = SDK_KEY;
  process.env.ZOOM_SDK_SECRET = SDK_SECRET;
  process.env.NTLSN_SESSION_SECRET = SESSION_SECRET;
  delete process.env.ZOOM_ALLOWED_MEETINGS;
}
function validSessionCookie(orcid) {
  const now = Math.floor(Date.now() / 1000);
  return session.cookie(session.sign({ orcid: orcid || "0000-0002-1825-0097", exp: now + 3600 }, SESSION_SECRET), 3600).split(";")[0];
}

test("OPTIONS preflight returns 204", async () => {
  setup();
  const { handler } = load();
  const res = await handler({ httpMethod: "OPTIONS", headers: {} });
  assert.strictEqual(res.statusCode, 204);
});

test("503 when SDK creds are unset (not a 200 that hides a broken deploy)", async () => {
  delete process.env.ZOOM_SDK_KEY;
  delete process.env.ZOOM_SDK_SECRET;
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: {}, body: "{}" });
  assert.strictEqual(res.statusCode, 503);
});

test("401 without a valid session — CORS is not the auth boundary", async () => {
  setup();
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: {}, body: JSON.stringify({ meetingNumber: "88812345678" }) });
  assert.strictEqual(res.statusCode, 401);
});

test("403 for a disallowed cross-origin", async () => {
  setup();
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: { origin: "https://evil.example", cookie: validSessionCookie() }, body: JSON.stringify({ meetingNumber: "88812345678" }) });
  assert.strictEqual(res.statusCode, 403);
});

test("400 for a malformed meetingNumber", async () => {
  setup();
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: { cookie: validSessionCookie() }, body: JSON.stringify({ meetingNumber: "not-a-number" }) });
  assert.strictEqual(res.statusCode, 400);
});

test("403 when meetingNumber is not on the allowlist", async () => {
  setup();
  process.env.ZOOM_ALLOWED_MEETINGS = "99999999999";
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: { cookie: validSessionCookie() }, body: JSON.stringify({ meetingNumber: "88812345678" }) });
  assert.strictEqual(res.statusCode, 403);
});

test("rate limit: the 21st mint in a window is rejected with 429", async () => {
  setup();
  const { handler } = load();
  const cookie = validSessionCookie("0000-0009-0009-0009");
  const req = () => handler({ httpMethod: "POST", headers: { origin: "https://www.ntlsn.com", cookie }, body: JSON.stringify({ meetingNumber: "88812345678" }) });
  for (let i = 0; i < 20; i++) {
    const r = await req();
    assert.strictEqual(r.statusCode, 200, `request ${i + 1} should succeed`);
  }
  const over = await req();
  assert.strictEqual(over.statusCode, 429);
});

test("signed-in user gets a role-0 attendee JWT", async () => {
  setup();
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: { origin: "https://www.ntlsn.com", cookie: validSessionCookie("0000-0001-0002-0003") }, body: JSON.stringify({ meetingNumber: "88812345678" }) });
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.strictEqual(body.sdkKey, SDK_KEY);
  const payload = JSON.parse(Buffer.from(body.signature.split(".")[1], "base64url").toString("utf8"));
  assert.strictEqual(payload.role, 0);
  assert.strictEqual(payload.mn, "88812345678");
});
