// NTLSN — cookie + constant-time helpers shared by the OAuth callbacks.
// Bundled into each function by Netlify's esbuild bundler (required, not a function itself).
"use strict";

const crypto = require("crypto");

// Exact, anchored read of a single cookie from a Cookie header.
// Deliberately NOT a substring/regex match: /ntlsn_orcid_state=([^;]+)/ also
// matches `evil_ntlsn_orcid_state=...`, letting an attacker-planted cookie win
// header order and defeat the double-submit CSRF check. Split on ';' + exact
// name match closes that gap.
function readCookie(header, name) {
  if (!header || typeof header !== "string") return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

// Constant-time string compare. Guards unequal lengths so timingSafeEqual
// (which throws on length mismatch) is safe to call.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

module.exports = { readCookie, safeEqual };
