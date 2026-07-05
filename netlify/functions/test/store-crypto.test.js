"use strict";
const { test } = require("node:test");
const assert = require("node:assert");

const enc = require("../../lib/crypto");
const { store } = require("../../lib/store");

test("crypto: encrypt/decrypt round-trips and is non-deterministic (random IV)", () => {
  process.env.NTLSN_TOKEN_ENC_KEY = "a".repeat(64); // 32 bytes hex
  const a = enc.encrypt("refresh-token-xyz");
  const b = enc.encrypt("refresh-token-xyz");
  assert.notStrictEqual(a, b); // random IV
  assert.strictEqual(enc.decrypt(a), "refresh-token-xyz");
  assert.strictEqual(enc.decrypt(b), "refresh-token-xyz");
});

test("crypto: derives a key from a passphrase too", () => {
  process.env.NTLSN_TOKEN_ENC_KEY = "any long passphrase here";
  const c = enc.encrypt("secret");
  assert.strictEqual(enc.decrypt(c), "secret");
  assert.strictEqual(enc.configured(), true);
});

test("crypto: tampered ciphertext fails the GCM auth tag", () => {
  process.env.NTLSN_TOKEN_ENC_KEY = "a".repeat(64);
  const good = enc.encrypt("secret");
  const raw = Buffer.from(good, "base64");
  raw[raw.length - 1] ^= 0xff; // flip a ciphertext byte
  assert.throws(() => enc.decrypt(raw.toString("base64")));
});

test("crypto: not configured when key is absent", () => {
  delete process.env.NTLSN_TOKEN_ENC_KEY;
  assert.strictEqual(enc.configured(), false);
  assert.throws(() => enc.encrypt("x"));
});

test("store: in-memory fallback supports get/set/setJSON/delete/list(prefix)", async () => {
  const s = await store("test-bucket");
  await s.set("k1", "v1");
  await s.setJSON("k2", { a: 1 });
  assert.strictEqual(await s.get("k1"), "v1");
  assert.deepStrictEqual(await s.get("k2", { type: "json" }), { a: 1 });
  assert.strictEqual(await s.get("missing"), null);
  await s.set("p:one", "1");
  await s.set("p:two", "2");
  const { blobs } = await s.list({ prefix: "p:" });
  assert.strictEqual(blobs.length, 2);
  await s.delete("k1");
  assert.strictEqual(await s.get("k1"), null);
});
