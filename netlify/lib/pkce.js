// NTLSN — PKCE (RFC 7636) helpers for the ORCID authorization-code flow.
// Defence-in-depth on top of the confidential client_secret: binds the auth code
// to the code_verifier stashed in the HttpOnly cookie at /start.
"use strict";

const crypto = require("crypto");

function createVerifier() {
  // 43-128 chars of [A-Za-z0-9-._~]; base64url of 32 random bytes is 43 chars.
  return crypto.randomBytes(32).toString("base64url");
}

function challengeS256(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

module.exports = { createVerifier, challengeS256 };
