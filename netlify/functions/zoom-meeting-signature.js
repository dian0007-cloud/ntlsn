// NTLSN — Zoom Meeting SDK signature (JWT) for the in-browser "watch the symposium" embed.
// REAL logic — generates the exact JWT the Meeting SDK for Web (Component View) needs to join.
// Needs env: ZOOM_SDK_KEY, ZOOM_SDK_SECRET  (from your Zoom *Meeting SDK* app — a SEPARATE
//   registration from the General OAuth app). The SDK Secret NEVER ships to the browser.
// POST { meetingNumber, role }  ->  { signature, sdkKey }
// Stateless — no DB required. See ~/Desktop/NTLSN-symposium-streaming-spec.md.

const crypto = require("crypto");
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};
const b64url = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "POST only" }) };

  const key = process.env.ZOOM_SDK_KEY, secret = process.env.ZOOM_SDK_SECRET;
  if (!key || !secret)
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: "Set ZOOM_SDK_KEY / ZOOM_SDK_SECRET (Zoom Meeting SDK app) to enable the live embed.", configured: false }) };

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch (e) {}
  const meetingNumber = String(body.meetingNumber || "");
  const role = Number(body.role || 0); // 0 = attendee, 1 = host
  if (!meetingNumber) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "meetingNumber required" }) };

  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2; // 2h
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { appKey: key, sdkKey: key, mn: meetingNumber, role, iat, exp, tokenExp: exp };
  const unsigned = `${b64url(header)}.${b64url(payload)}`;
  const signature = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");

  return { statusCode: 200, headers: CORS, body: JSON.stringify({ signature: `${unsigned}.${signature}`, sdkKey: key, configured: true }) };
};
