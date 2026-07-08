// NTLSN — session probe. Returns the verified ORCID identity from the signed HttpOnly
// session cookie (minted by orcid-callback.js), so the page can show "signed in" state
// without trusting anything in the URL. GET only; same-origin.
// Needs env: NTLSN_SESSION_SECRET.
"use strict";

const { readCookie } = require("../lib/cookies");
const session = require("../lib/session");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (event.httpMethod && event.httpMethod !== "GET")
    return { statusCode: 405, headers, body: JSON.stringify({ error: "GET only" }) };

  const secret = process.env.NTLSN_SESSION_SECRET;
  if (!secret) {
    // A missing session secret is a deploy misconfiguration (env typo / rotation gap), not a
    // normal unsigned-in request. Surface it as 5xx + configured:false so status-code alerting
    // catches it — the old 200 signedIn:false was byte-for-byte identical to the normal case
    // and silently logged everyone out with no signal (audit v2 L11). The page treats non-2xx
    // as "not signed in", so UX degrades gracefully either way.
    return { statusCode: 503, headers, body: JSON.stringify({ signedIn: false, configured: false }) };
  }
  const cookie = (event.headers && (event.headers.cookie || event.headers.Cookie)) || "";
  const payload = session.verify(readCookie(cookie, session.COOKIE_NAME), secret);

  if (!payload) return { statusCode: 200, headers, body: JSON.stringify({ signedIn: false }) };
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ signedIn: true, orcid: payload.orcid || "", name: payload.name || "" }),
  };
};
