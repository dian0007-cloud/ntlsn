"use strict";
const { test } = require("node:test");
const assert = require("node:assert");
const crypto = require("node:crypto");

function loadJwt() {
  delete require.cache[require.resolve("../../lib/lti-jwt")];
  return require("../../lib/lti-jwt");
}
function loadPlatforms() {
  delete require.cache[require.resolve("../../lib/lti-platforms")];
  return require("../../lib/lti-platforms");
}
function loadFn(name) {
  delete require.cache[require.resolve("../" + name)];
  return require("../" + name);
}

// A second, independent RSA keypair standing in for "the platform" in launch tests —
// distinct from NTLSN's own signing key so tests can't accidentally pass by cross-using it.
function genPlatformKeypair() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

// Signs an arbitrary payload as "the platform" would, for launch-endpoint tests.
function signAsPlatform(payload, privateKeyPem, kid) {
  const header = { alg: "RS256", typ: "JWT", kid };
  const signingInput = b64url(Buffer.from(JSON.stringify(header))) + "." + b64url(Buffer.from(JSON.stringify(payload)));
  const sig = crypto.sign("RSA-SHA256", Buffer.from(signingInput), crypto.createPrivateKey(privateKeyPem));
  return signingInput + "." + b64url(sig);
}

function platformJwk(publicKeyPem, kid) {
  const jwk = crypto.createPublicKey(publicKeyPem).export({ format: "jwk" });
  jwk.kid = kid;
  jwk.use = "sig";
  jwk.alg = "RS256";
  return jwk;
}

function withEnv(vars, fn) {
  const orig = {};
  for (const k of Object.keys(vars)) orig[k] = process.env[k];
  Object.assign(process.env, vars);
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const k of Object.keys(vars)) {
        if (orig[k] === undefined) delete process.env[k];
        else process.env[k] = orig[k];
      }
    });
}

function withFetch(map, fn) {
  const orig = global.fetch;
  global.fetch = async (url) => {
    const u = String(url);
    for (const key of Object.keys(map)) {
      if (u.includes(key)) {
        const m = map[key];
        return { ok: m.status ? m.status < 400 : true, status: m.status || 200, json: async () => m.body };
      }
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      global.fetch = orig;
    });
}

function ntlsnKeypairPem() {
  const { privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return privateKey;
}

// --- lib/lti-jwt.js ---------------------------------------------------------

test("lti-jwt: sign + verify round trip with NTLSN's own key", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () => {
    const { sign, publicJwk, verify } = loadJwt();
    const token = sign({ hello: "world", exp: Math.floor(Date.now() / 1000) + 60 });
    const payload = verify(token, publicJwk());
    assert.strictEqual(payload.hello, "world");
  });
});

test("lti-jwt: publicJwk / sign return null / throw when key unconfigured", () => {
  const { publicJwk, sign } = loadJwt();
  assert.strictEqual(publicJwk(), null);
  assert.throws(() => sign({ a: 1 }));
});

test("lti-jwt: tampered signature is rejected", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () => {
    const { sign, publicJwk, verify } = loadJwt();
    const token = sign({ hello: "world", exp: Math.floor(Date.now() / 1000) + 60 });
    const parts = token.split(".");
    parts[1] = Buffer.from(JSON.stringify({ hello: "tampered" })).toString("base64url");
    assert.strictEqual(verify(parts.join("."), publicJwk()), null);
  });
});

test("lti-jwt: alg is pinned to RS256 — a token claiming another alg is rejected even with a valid-looking signature", () => {
  const { verify } = loadJwt();
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ a: 1 })).toString("base64url");
  assert.strictEqual(verify(header + "." + payload + ".", { kty: "RSA", n: "x", e: "AQAB" }), null);
});

test("lti-jwt: expired token is rejected", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () => {
    const { sign, publicJwk, verify } = loadJwt();
    const token = sign({ exp: Math.floor(Date.now() / 1000) - 10 });
    assert.strictEqual(verify(token, publicJwk()), null);
  });
});

test("lti-jwt: malformed token shapes return null, not a throw", () => {
  const { verify } = loadJwt();
  assert.strictEqual(verify("not-a-jwt", {}), null);
  assert.strictEqual(verify(123, {}), null);
  assert.strictEqual(verify("a.b.c", {}), null);
});

test("lti-jwt: verifyWithJwksUrl fetches, matches by kid, and caches", async () => {
  const platform = genPlatformKeypair();
  const kid = "platform-key-1";
  const token = signAsPlatform({ sub: "abc", exp: Math.floor(Date.now() / 1000) + 60 }, platform.privateKey, kid);
  let fetchCount = 0;
  const orig = global.fetch;
  global.fetch = async () => {
    fetchCount++;
    return { ok: true, json: async () => ({ keys: [platformJwk(platform.publicKey, kid)] }) };
  };
  try {
    const { verifyWithJwksUrl } = loadJwt();
    const p1 = await verifyWithJwksUrl(token, "https://platform.example/jwks");
    const p2 = await verifyWithJwksUrl(token, "https://platform.example/jwks");
    assert.strictEqual(p1.sub, "abc");
    assert.strictEqual(p2.sub, "abc");
    assert.strictEqual(fetchCount, 1, "second verify with the same kid should hit the cache, not refetch");
  } finally {
    global.fetch = orig;
  }
});

test("lti-jwt: verifyWithJwksUrl refetches once on an unknown kid (key rotation)", async () => {
  const platform = genPlatformKeypair();
  const token = signAsPlatform({ sub: "abc", exp: Math.floor(Date.now() / 1000) + 60 }, platform.privateKey, "new-kid");
  let fetchCount = 0;
  const orig = global.fetch;
  global.fetch = async () => {
    fetchCount++;
    // Every fetch returns the current (rotated) key — simulates the platform having
    // already rotated by the time we ask, so our first (cached-empty) lookup misses.
    return { ok: true, json: async () => ({ keys: [platformJwk(platform.publicKey, "new-kid")] }) };
  };
  try {
    const { verifyWithJwksUrl } = loadJwt();
    const payload = await verifyWithJwksUrl(token, "https://rotating.example/jwks");
    assert.strictEqual(payload.sub, "abc");
    assert.ok(fetchCount >= 1);
  } finally {
    global.fetch = orig;
  }
});

// --- lib/lti-platforms.js ----------------------------------------------------

const SAMPLE_PLATFORMS = {
  platforms: [
    { issuer: "https://moodle.example", clientId: "abc123", authLoginUrl: "https://moodle.example/mod/lti/auth.php", jwksUrl: "https://moodle.example/mod/lti/certs.php", deploymentIds: ["1"], name: "Example Moodle" },
    { issuer: "https://multi.example", clientId: "client-a", authLoginUrl: "https://multi.example/auth", jwksUrl: "https://multi.example/jwks", deploymentIds: ["1"], name: "Multi A" },
    { issuer: "https://multi.example", clientId: "client-b", authLoginUrl: "https://multi.example/auth", jwksUrl: "https://multi.example/jwks", deploymentIds: ["2"], name: "Multi B" },
  ],
};

test("lti-platforms: looks up a single-match issuer without needing a clientId", async () => {
  await withFetch({ "lti-platforms.json": { body: SAMPLE_PLATFORMS } }, async () => {
    const { lookupPlatform } = loadPlatforms();
    const p = await lookupPlatform("https://moodle.example");
    assert.strictEqual(p.name, "Example Moodle");
  });
});

test("lti-platforms: disambiguates by clientId when an issuer has multiple registrations", async () => {
  await withFetch({ "lti-platforms.json": { body: SAMPLE_PLATFORMS } }, async () => {
    const { lookupPlatform } = loadPlatforms();
    assert.strictEqual((await lookupPlatform("https://multi.example", "client-b")).name, "Multi B");
    assert.strictEqual(await lookupPlatform("https://multi.example"), null, "no clientId + multiple matches -> null, not a guess");
  });
});

test("lti-platforms: unknown issuer returns null", async () => {
  await withFetch({ "lti-platforms.json": { body: SAMPLE_PLATFORMS } }, async () => {
    const { lookupPlatform } = loadPlatforms();
    assert.strictEqual(await lookupPlatform("https://unregistered.example"), null);
  });
});

// --- functions/lti-jwks.js ---------------------------------------------------

test("lti-jwks: 503 when unconfigured, valid JWKS shape when configured", async () => {
  const { handler: h1 } = loadFn("lti-jwks");
  const r1 = await h1({ httpMethod: "GET" });
  assert.strictEqual(r1.statusCode, 503);

  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, async () => {
    const { handler } = loadFn("lti-jwks");
    const r2 = await handler({ httpMethod: "GET" });
    assert.strictEqual(r2.statusCode, 200);
    const doc = JSON.parse(r2.body);
    assert.strictEqual(doc.keys.length, 1);
    assert.strictEqual(doc.keys[0].kty, "RSA");
    assert.strictEqual(doc.keys[0].alg, "RS256");
  });
});

// --- functions/lti-login.js ---------------------------------------------------

test("lti-login: missing required params -> 400", async () => {
  const { handler } = loadFn("lti-login");
  const res = await handler({ httpMethod: "GET", queryStringParameters: {} });
  assert.strictEqual(res.statusCode, 400);
});

test("lti-login: unregistered platform -> 400", async () => {
  await withFetch({ "lti-platforms.json": { body: { platforms: [] } } }, async () => {
    const { handler } = loadFn("lti-login");
    const res = await handler({
      httpMethod: "GET",
      queryStringParameters: { iss: "https://unknown.example", login_hint: "u1", target_link_uri: "https://x" },
    });
    assert.strictEqual(res.statusCode, 400);
  });
});

test("lti-login: valid request redirects to the platform's auth endpoint with state+nonce, sets a SameSite=None state cookie", async () => {
  await withFetch({ "lti-platforms.json": { body: SAMPLE_PLATFORMS } }, async () => {
    const { handler } = loadFn("lti-login");
    const res = await handler({
      httpMethod: "GET",
      queryStringParameters: { iss: "https://moodle.example", login_hint: "u1", target_link_uri: "https://ntlsn.com/lti-picker" },
    });
    assert.strictEqual(res.statusCode, 302);
    const loc = new URL(res.headers.Location);
    assert.strictEqual(loc.origin + loc.pathname, "https://moodle.example/mod/lti/auth.php");
    assert.strictEqual(loc.searchParams.get("client_id"), "abc123");
    assert.ok(loc.searchParams.get("state"));
    assert.ok(loc.searchParams.get("nonce"));
    assert.match(res.multiValueHeaders["Set-Cookie"][0], /^ntlsn_lti_state=.+SameSite=None/);
  });
});

// --- functions/lti-launch.js ---------------------------------------------------

// What a real platform sends in the deep_linking_settings claim — the return URL the
// LtiDeepLinkingResponse must be form_posted to, plus an opaque `data` token to echo back.
const DL_SETTINGS = {
  deep_link_return_url: "https://moodle.example/course/dl-return",
  accept_types: ["link"],
  accept_multiple: true,
  data: "opaque-data-123",
};

// Builds a full, valid launch POST event: signs an id_token as "the platform", stashes the
// matching nonce in the (in-memory, test-mode) store, and sets the matching state cookie —
// i.e. exactly what a real platform + browser round trip would produce.
async function buildLaunchEvent({ platform, kid, nonce, state, extraClaims, deploymentId = "1", messageType = "LtiDeepLinkingRequest", dlSettings = DL_SETTINGS }) {
  const { store } = require("../../lib/store");
  const s = await store("lti-nonce");
  await s.set(nonce, String(Date.now() + 600000));

  const claims = {
    iss: platform.issuer,
    aud: platform.clientId,
    nonce,
    exp: Math.floor(Date.now() / 1000) + 60,
    iat: Math.floor(Date.now() / 1000),
    "https://purl.imsglobal.org/spec/lti/claim/deployment_id": deploymentId,
    "https://purl.imsglobal.org/spec/lti/claim/message_type": messageType,
  };
  if (dlSettings) claims["https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"] = dlSettings;

  const idToken = signAsPlatform(Object.assign(claims, extraClaims), platform._privateKey, kid);

  return {
    httpMethod: "POST",
    headers: { cookie: `ntlsn_lti_state=${state}` },
    body: new URLSearchParams({ id_token: idToken, state }).toString(),
  };
}

function makeTestPlatform() {
  const kp = genPlatformKeypair();
  // Unique per call: lti-jwt.js's JWKS cache is module-level (persists across tests in
  // this process), so reusing a fixed kid across tests with different keypairs would
  // serve a stale cached key from an earlier test and fail signature verification.
  const kid = "test-kid-" + crypto.randomBytes(6).toString("hex");
  return {
    issuer: "https://moodle.example",
    clientId: "abc123",
    authLoginUrl: "https://moodle.example/mod/lti/auth.php",
    jwksUrl: "https://moodle.example/mod/lti/certs.php",
    deploymentIds: ["1"],
    name: "Example Moodle",
    _privateKey: kp.privateKey,
    _publicKey: kp.publicKey,
    kid,
  };
}

// Curated deep-linkable resources, mocked the same way lti-platforms.json is: the picker
// and the return endpoint must only ever see THESE items, whatever the client claims.
const SAMPLE_CONTENT = {
  items: [
    { id: "rubric-builder", title: "Rubric Builder", description: "Build a marking rubric step by step.", url: "https://www.ntlsn.com/rubric-builder.html" },
    { id: "crash-courses", title: "Crash Courses", description: "Short, self-paced crash courses.", url: "https://www.ntlsn.com/crash-courses.html" },
    { id: "open-badges", title: "Open Badges", description: "Portable teaching-recognition claims.", url: "https://www.ntlsn.com/open-badges.html", icon: "https://www.ntlsn.com/badge-icon.png" },
  ],
};

function launchFetchMap(platform) {
  return {
    "lti-platforms.json": { body: { platforms: [{ issuer: platform.issuer, clientId: platform.clientId, authLoginUrl: platform.authLoginUrl, jwksUrl: platform.jwksUrl, deploymentIds: platform.deploymentIds, name: platform.name }] } },
    "mod/lti/certs.php": { body: { keys: [platformJwk(platform._publicKey, platform.kid)] } },
    "lti-content.json": { body: SAMPLE_CONTENT },
  };
}

test("lti-launch: full valid launch -> 200 picker with content items + a signed session JWT, clears the state cookie", async () => {
  const platform = makeTestPlatform();
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () =>
    withFetch(launchFetchMap(platform), async () => {
      const { handler } = loadFn("lti-launch");
      const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n1", state: "s1" });
      const res = await handler(event);
      assert.strictEqual(res.statusCode, 200);
      assert.match(res.body, /Example Moodle/);
      assert.match(res.body, /Rubric Builder/);
      assert.match(res.body, /Crash Courses/);
      assert.match(res.body, /action="\/\.netlify\/functions\/lti-deeplink-return"/);
      // Hidden session field carries a three-part JWT (signed by NTLSN, verified server-side on return).
      assert.match(res.body, /name="session" value="[^"]+\.[^"]+\.[^"]+"/);
      assert.match(res.multiValueHeaders["Set-Cookie"][0], /Max-Age=0/);
    })
  );
});

test("lti-launch: Deep Linking launch without a usable deep_link_return_url -> 400", async () => {
  const platform = makeTestPlatform();
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () =>
    withFetch(launchFetchMap(platform), async () => {
      const { handler } = loadFn("lti-launch");
      const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n1b", state: "s1b", dlSettings: null });
      const res = await handler(event);
      assert.strictEqual(res.statusCode, 400);
      assert.match(res.body, /deep_link_return_url/);
    })
  );
});

test("lti-launch: signing key unconfigured -> 503 (launch validated but picker session can't be minted)", async () => {
  const platform = makeTestPlatform();
  await withFetch(launchFetchMap(platform), async () => {
    const { handler } = loadFn("lti-launch");
    const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n1c", state: "s1c" });
    const res = await handler(event);
    assert.strictEqual(res.statusCode, 503);
  });
});

test("lti-launch: state cookie mismatch -> 400", async () => {
  const platform = makeTestPlatform();
  await withFetch(launchFetchMap(platform), async () => {
    const { handler } = loadFn("lti-launch");
    const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n2", state: "s2" });
    event.headers.cookie = "ntlsn_lti_state=wrong-state";
    const res = await handler(event);
    assert.strictEqual(res.statusCode, 400);
  });
});

test("lti-launch: nonce is single-use — replaying the same launch is rejected", async () => {
  const platform = makeTestPlatform();
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () =>
    withFetch(launchFetchMap(platform), async () => {
      const { handler } = loadFn("lti-launch");
      const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n3", state: "s3" });
      const first = await handler(event);
      assert.strictEqual(first.statusCode, 200);
      const replay = await handler(event);
      assert.strictEqual(replay.statusCode, 400);
    })
  );
});

test("lti-launch: unregistered deployment_id -> 400", async () => {
  const platform = makeTestPlatform();
  await withFetch(launchFetchMap(platform), async () => {
    const { handler } = loadFn("lti-launch");
    const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n4", state: "s4", deploymentId: "not-registered" });
    const res = await handler(event);
    assert.strictEqual(res.statusCode, 400);
  });
});

test("lti-launch: non-Deep-Linking message type is rejected (out of scope for v1)", async () => {
  const platform = makeTestPlatform();
  await withFetch(launchFetchMap(platform), async () => {
    const { handler } = loadFn("lti-launch");
    const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n5", state: "s5", messageType: "LtiResourceLinkRequest" });
    const res = await handler(event);
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.body, /Deep Linking only/);
  });
});

test("lti-launch: tampered id_token payload fails signature verification (iss/aud kept intact so it actually reaches the JWKS check, not just platform lookup)", async () => {
  const platform = makeTestPlatform();
  await withFetch(launchFetchMap(platform), async () => {
    const { handler } = loadFn("lti-launch");
    const event = await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n6", state: "s6" });
    const body = new URLSearchParams(event.body);
    const parts = body.get("id_token").split(".");
    const original = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    // Modify a claim post-signing while keeping iss/aud intact — a real forgery attempt
    // that must reach and fail the JWKS signature check, not just miss platform lookup.
    parts[1] = Buffer.from(JSON.stringify(Object.assign({}, original, { sub: "attacker-injected" }))).toString("base64url");
    body.set("id_token", parts.join("."));
    event.body = body.toString();
    const res = await handler(event);
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.body, /invalid id_token signature/);
  });
});

// --- functions/lti-deeplink-return.js ------------------------------------------

const DL_DATA_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/data";
const DL_ITEMS_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";

// Signs a picker session the way lti-launch.js does — same shape, same key (from env).
function makeSessionJwt(jwtLib, overrides) {
  const now = Math.floor(Date.now() / 1000);
  return jwtLib.sign(
    Object.assign(
      {
        purpose: "lti-dl-session",
        iss: "https://moodle.example",
        clientId: "abc123",
        deploymentId: "1",
        deep_link_return_url: "https://moodle.example/course/dl-return",
        data: "opaque-data-123",
        iat: now,
        exp: now + 300,
      },
      overrides
    )
  );
}

// POST body with repeated `item` keys, as a real multi-checkbox form submit produces.
function returnEvent(session, itemIds, extraFields) {
  const p = new URLSearchParams();
  if (session != null) p.set("session", session);
  for (const id of itemIds || []) p.append("item", id);
  for (const [k, v] of Object.entries(extraFields || {})) p.append(k, v);
  return { httpMethod: "POST", body: p.toString() };
}

test("lti-deeplink-return: non-POST -> 405", async () => {
  const { handler } = loadFn("lti-deeplink-return");
  const res = await handler({ httpMethod: "GET" });
  assert.strictEqual(res.statusCode, 405);
});

test("lti-deeplink-return: tampered session JWT is rejected", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, async () => {
    const jwtLib = loadJwt();
    const parts = makeSessionJwt(jwtLib).split(".");
    // Redirect-the-response attempt: alter the return URL post-signing.
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    claims.deep_link_return_url = "https://evil.example/steal";
    parts[1] = b64url(Buffer.from(JSON.stringify(claims)));
    const { handler } = loadFn("lti-deeplink-return");
    const res = await handler(returnEvent(parts.join("."), ["rubric-builder"]));
    assert.strictEqual(res.statusCode, 400);
  });
});

test("lti-deeplink-return: expired session JWT is rejected", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, async () => {
    const jwtLib = loadJwt();
    const session = makeSessionJwt(jwtLib, { exp: Math.floor(Date.now() / 1000) - 10 });
    const { handler } = loadFn("lti-deeplink-return");
    const res = await handler(returnEvent(session, ["rubric-builder"]));
    assert.strictEqual(res.statusCode, 400);
  });
});

test("lti-deeplink-return: an NTLSN-signed JWT without the picker-session purpose is rejected", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, async () => {
    const jwtLib = loadJwt();
    const notASession = jwtLib.sign({ iss: "abc123", exp: Math.floor(Date.now() / 1000) + 300 });
    const { handler } = loadFn("lti-deeplink-return");
    const res = await handler(returnEvent(notASession, ["rubric-builder"]));
    assert.strictEqual(res.statusCode, 400);
  });
});

test("lti-deeplink-return: valid session + selections -> auto-submit form whose JWT is a correct LtiDeepLinkingResponse; unknown ids dropped; client-supplied url/title ignored", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () =>
    withFetch({ "lti-content.json": { body: SAMPLE_CONTENT } }, async () => {
      const jwtLib = loadJwt();
      const session = makeSessionJwt(jwtLib);
      const { handler } = loadFn("lti-deeplink-return");
      // "no-such-item" must be silently dropped; the spoofed title/url fields must be ignored.
      const res = await handler(returnEvent(session, ["rubric-builder", "no-such-item", "open-badges"], { title: "EVIL TITLE", url: "https://evil.example/phish" }));
      assert.strictEqual(res.statusCode, 200);
      assert.match(res.body, /<form method="post" action="https:\/\/moodle\.example\/course\/dl-return">/);
      assert.match(res.body, /document\.forms\[0\]\.submit\(\)/);

      const jwtField = res.body.match(/name="JWT" value="([^"]+)"/);
      assert.ok(jwtField, "response must carry the signed JWT in a hidden field");
      const payload = jwtLib.verify(jwtField[1], jwtLib.publicJwk());
      assert.ok(payload, "response JWT must verify against NTLSN's own public key");
      assert.strictEqual(payload["https://purl.imsglobal.org/spec/lti/claim/message_type"], "LtiDeepLinkingResponse");
      assert.strictEqual(payload["https://purl.imsglobal.org/spec/lti/claim/version"], "1.3.0");
      assert.strictEqual(payload.iss, "abc123", "iss is NTLSN's client_id at the platform");
      assert.strictEqual(payload.aud, "https://moodle.example", "aud is the platform's issuer");
      assert.strictEqual(payload["https://purl.imsglobal.org/spec/lti/claim/deployment_id"], "1");
      assert.strictEqual(payload[DL_DATA_CLAIM], "opaque-data-123", "platform's opaque data must round-trip verbatim");
      assert.ok(payload.nonce);

      const items = payload[DL_ITEMS_CLAIM];
      assert.strictEqual(items.length, 2, "unknown id silently dropped");
      assert.deepStrictEqual(items.map((i) => i.type), ["link", "link"]);
      // Registry values, registry order — nothing from the request body.
      assert.strictEqual(items[0].title, "Rubric Builder");
      assert.strictEqual(items[0].url, "https://www.ntlsn.com/rubric-builder.html");
      assert.strictEqual(items[1].title, "Open Badges");
      assert.strictEqual(items[1].url, "https://www.ntlsn.com/open-badges.html");
      assert.deepStrictEqual(items[1].icon, { url: "https://www.ntlsn.com/badge-icon.png" });
      assert.ok(!JSON.stringify(payload).includes("evil.example"), "client-supplied url/title must not reach the response");
    })
  );
});

test("lti-deeplink-return: zero selections -> empty content_items (spec-correct cancel); no data claim when platform sent none", async () => {
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () =>
    withFetch({ "lti-content.json": { body: SAMPLE_CONTENT } }, async () => {
      const jwtLib = loadJwt();
      const session = makeSessionJwt(jwtLib, { data: undefined });
      const { handler } = loadFn("lti-deeplink-return");
      const res = await handler(returnEvent(session, []));
      assert.strictEqual(res.statusCode, 200);
      const payload = jwtLib.verify(res.body.match(/name="JWT" value="([^"]+)"/)[1], jwtLib.publicJwk());
      assert.deepStrictEqual(payload[DL_ITEMS_CLAIM], []);
      assert.ok(!(DL_DATA_CLAIM in payload), "data claim is echoed only when the platform sent one");
    })
  );
});

// The full Phase B round trip in one pass: real launch -> picker session JWT out of the
// rendered HTML -> return endpoint -> LtiDeepLinkingResponse carrying the launch's `data`.
test("lti round trip: session JWT minted by a real launch drives a valid Deep Linking response", async () => {
  const platform = makeTestPlatform();
  await withEnv({ NTLSN_LTI_PRIVATE_KEY: ntlsnKeypairPem() }, () =>
    withFetch(launchFetchMap(platform), async () => {
      const { handler: launch } = loadFn("lti-launch");
      const launchRes = await launch(await buildLaunchEvent({ platform, kid: platform.kid, nonce: "n7", state: "s7" }));
      assert.strictEqual(launchRes.statusCode, 200);
      const session = launchRes.body.match(/name="session" value="([^"]+)"/)[1];

      const jwtLib = loadJwt();
      const { handler: ret } = loadFn("lti-deeplink-return");
      const res = await ret(returnEvent(session, ["crash-courses"]));
      assert.strictEqual(res.statusCode, 200);
      assert.match(res.body, /action="https:\/\/moodle\.example\/course\/dl-return"/);
      const payload = jwtLib.verify(res.body.match(/name="JWT" value="([^"]+)"/)[1], jwtLib.publicJwk());
      assert.strictEqual(payload[DL_DATA_CLAIM], "opaque-data-123");
      assert.deepStrictEqual(payload[DL_ITEMS_CLAIM], [{ type: "link", url: "https://www.ntlsn.com/crash-courses.html", title: "Crash Courses", text: "Short, self-paced crash courses." }]);
    })
  );
});
