// NTLSN — authenticated encryption for secrets at rest (Zoom refresh tokens).
// AES-256-GCM. Key from env NTLSN_TOKEN_ENC_KEY: either 64 hex chars (32 bytes) or any
// passphrase (SHA-256-derived to 32 bytes). Ciphertext is base64(iv[12] | tag[16] | ct).
"use strict";

const crypto = require("crypto");

function keyBuf() {
  const k = process.env.NTLSN_TOKEN_ENC_KEY || "";
  if (/^[0-9a-fA-F]{64}$/.test(k)) return Buffer.from(k, "hex");
  if (k) return crypto.createHash("sha256").update(k).digest();
  return null;
}

function encrypt(plaintext) {
  const key = keyBuf();
  if (!key) throw new Error("NTLSN_TOKEN_ENC_KEY not set");
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([c.update(String(plaintext), "utf8"), c.final()]);
  const tag = c.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

function decrypt(b64) {
  const key = keyBuf();
  if (!key) throw new Error("NTLSN_TOKEN_ENC_KEY not set");
  const raw = Buffer.from(String(b64), "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ct = raw.subarray(28);
  const d = crypto.createDecipheriv("aes-256-gcm", key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(ct), d.final()]).toString("utf8");
}

function configured() {
  return !!keyBuf();
}

module.exports = { encrypt, decrypt, configured };
