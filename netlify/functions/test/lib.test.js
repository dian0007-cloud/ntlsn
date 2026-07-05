"use strict";
const { test } = require("node:test");
const assert = require("node:assert");

const { readCookie, safeEqual } = require("../../lib/cookies");
const session = require("../../lib/session");
const { createVerifier, challengeS256 } = require("../../lib/pkce");

test("readCookie exact-matches the cookie name (not a substring)", () => {
  const header = "evil_ntlsn_orcid_state=ATTACKER; ntlsn_orcid_state=REAL; other=x";
  assert.strictEqual(readCookie(header, "ntlsn_orcid_state"), "REAL");
});

test("readCookie ignores a differently-named cookie that ends in the name", () => {
  const header = "x_ntlsn_zoom_state=ATTACKER";
  assert.strictEqual(readCookie(header, "ntlsn_zoom_state"), null);
});

test("readCookie returns null for missing header / cookie", () => {
  assert.strictEqual(readCookie("", "a"), null);
  assert.strictEqual(readCookie(null, "a"), null);
  assert.strictEqual(readCookie("b=1", "a"), null);
});

test("safeEqual is true only for equal strings and never throws on length mismatch", () => {
  assert.strictEqual(safeEqual("abc", "abc"), true);
  assert.strictEqual(safeEqual("abc", "abd"), false);
  assert.strictEqual(safeEqual("abc", "abcd"), false);
  assert.strictEqual(safeEqual("abc", undefined), false);
});

test("session sign/verify round-trips and rejects tampering", () => {
  const secret = "test-secret-please-ignore";
  const token = session.sign({ orcid: "0000-0002-1825-0097", name: "Josiah", iat: 1, exp: 9999999999 }, secret);
  const p = session.verify(token, secret);
  assert.strictEqual(p.orcid, "0000-0002-1825-0097");
  assert.strictEqual(session.verify(token, "wrong-secret"), null);
  assert.strictEqual(session.verify(token + "x", secret), null);
  assert.strictEqual(session.verify("garbage", secret), null);
  assert.strictEqual(session.verify(token, ""), null);
});

test("session verify rejects an expired token", () => {
  const secret = "s";
  const token = session.sign({ orcid: "x", exp: 1 }, secret); // 1970
  assert.strictEqual(session.verify(token, secret), null);
});

test("pkce challenge is deterministic S256 base64url and verifier is >=43 chars", () => {
  const v = createVerifier();
  assert.ok(v.length >= 43);
  assert.match(v, /^[A-Za-z0-9_-]+$/);
  assert.strictEqual(challengeS256("abc"), challengeS256("abc"));
  assert.match(challengeS256(v), /^[A-Za-z0-9_-]+$/);
});
