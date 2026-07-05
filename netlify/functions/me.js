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
  const cookie = (event.headers && (event.headers.cookie || event.headers.Cookie)) || "";
  const payload = secret ? session.verify(readCookie(cookie, session.COOKIE_NAME), secret) : null;

  if (!payload) return { statusCode: 200, headers, body: JSON.stringify({ signedIn: false }) };
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ signedIn: true, orcid: payload.orcid || "", name: payload.name || "" }),
  };
};
