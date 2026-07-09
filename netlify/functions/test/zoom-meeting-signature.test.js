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

test("allowlist: a meeting ON the list is accepted (acceptance, not only rejection)", async () => {
  // Audit v2 L20: the allowlist was tested only for rejection. Pin the acceptance path too.
  setup();
  process.env.ZOOM_ALLOWED_MEETINGS = "88812345678,99999999999";
  const { handler } = load();
  const res = await handler({ httpMethod: "POST", headers: { origin: "https://www.ntlsn.com", cookie: validSessionCookie() }, body: JSON.stringify({ meetingNumber: "88812345678" }) });
  assert.strictEqual(res.statusCode, 200);
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

test("rateLimited durable path: a SINGLE record per orcid (bounded keys), threshold enforced", async () => {
  // Regression for audit v2 L5/L17: the durable branch was untested AND wrote a fresh
  // `${orcid}:${windowId}` key per window with no GC (unbounded growth). Now one record per
  // orcid, overwritten each window. Inject a fake durable store so the branch actually runs.
  const data = new Map();
  const fakeOpen = async () => ({
    durable: true,
    store: {
      get: async (k, opt) => { const v = data.get(k); return v && opt && opt.type === "json" ? JSON.parse(v) : v; },
      setJSON: async (k, v) => { data.set(k, JSON.stringify(v)); },
    },
  });
  const { rateLimited } = load();
  const orcid = "0000-0001-0002-0003";
  for (let i = 0; i < 20; i++) {
    assert.strictEqual(await rateLimited(orcid, fakeOpen), false, `mint ${i + 1} should not be limited`);
  }
  assert.strictEqual(await rateLimited(orcid, fakeOpen), true, "21st mint should be limited");
  assert.strictEqual(data.size, 1, "durable path keeps a SINGLE record per orcid (no per-window keys)");
  assert.ok(data.has(orcid), "keyed by the bare orcid");
});
