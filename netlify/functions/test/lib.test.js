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

test("session verify rejects missing / non-numeric exp (never silently non-expiring)", () => {
  const secret = "s";
  // exp:0 is a number but 1970 (past) -> rejected; the old truthiness gate treated 0 as non-expiring.
  assert.strictEqual(session.verify(session.sign({ orcid: "x", exp: 0 }, secret), secret), null);
  // missing exp -> rejected (numeric expiry is mandatory)
  assert.strictEqual(session.verify(session.sign({ orcid: "x" }, secret), secret), null);
  // non-numeric exp -> rejected
  assert.strictEqual(session.verify(session.sign({ orcid: "x", exp: "abc" }, secret), secret), null);
  // sanity: a valid future exp still verifies
  const future = Math.floor(Date.now() / 1000) + 3600;
  const p = session.verify(session.sign({ orcid: "x", exp: future }, secret), secret);
  assert.ok(p && p.orcid === "x", "a valid future-exp token must still verify");
});

test("pkce challenge is deterministic S256 base64url and verifier is >=43 chars", () => {
  const v = createVerifier();
  assert.ok(v.length >= 43);
  assert.match(v, /^[A-Za-z0-9_-]+$/);
  assert.strictEqual(challengeS256("abc"), challengeS256("abc"));
  assert.match(challengeS256(v), /^[A-Za-z0-9_-]+$/);
});
