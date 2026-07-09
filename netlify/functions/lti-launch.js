// NTLSN — LTI 1.3 launch endpoint. Receives the platform's signed id_token (form_post),
// validates it end-to-end (state, signature via the platform's own JWKS, aud, nonce
// single-use, deployment_id, message type), then — Phase B — renders the content picker:
// a server-rendered checkbox list of data/lti-content.json items that POSTs to
// lti-deeplink-return, which signs the LtiDeepLinkingResponse back to the platform.
//
// The platform's deep_linking_settings claim (deep_link_return_url + opaque data) must
// survive the picker round trip WITHOUT trusting the browser: it's embedded in a
// short-lived session JWT signed with NTLSN's own key, and lti-deeplink-return verifies
// that signature before using any of it. The client carries the token; it can't mint one.
//
// Scope, deliberately: NTLSN supports LtiDeepLinkingRequest ONLY. No LtiResourceLinkRequest,
// no NRPS (roster), no AGS (grades) — this endpoint is structurally incapable of reading
// institutional data because it never asks a platform for any.
"use strict";

const { readCookie, safeEqual } = require("../lib/cookies");
const { verifyWithJwksUrl, sign } = require("../lib/lti-jwt");
const { lookupPlatform } = require("../lib/lti-platforms");
const { load: loadContent } = require("../lib/lti-content");
const { store } = require("../lib/store");

const DEPLOY_ID_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/deployment_id";
const MSG_TYPE_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/message_type";
const DL_SETTINGS_CLAIM = "https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings";
const SESSION_TTL_S = 5 * 60; // picker session JWT lifetime

function decodeUnverified(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  try {
    return {
      header: JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")),
      payload: JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")),
    };
  } catch (_e) {
    return null;
  }
}

// Single-use: the key is deleted on first successful read, so a replayed id_token (same
// nonce) is rejected even if it's still within its TTL window.
async function consumeNonce(nonce) {
  if (!nonce) return false;
  const s = await store("lti-nonce");
  const exp = await s.get(nonce);
  if (!exp) return false;
  await s.delete(nonce);
  return Date.now() <= Number(exp);
}

const html = (title, body) =>
  `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head>` +
  `<body style="font-family:-apple-system,sans-serif;max-width:640px;margin:3rem auto;padding:0 1.5rem">${body}</body></html>`;

// Claim values come from a JWKS-verified platform, but "verified" means "authentic",
// not "safe to interpolate into HTML" — escape before rendering regardless of source.
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "POST only" };

  let body;
  try {
    body = Object.fromEntries(new URLSearchParams(event.body || ""));
  } catch (_e) {
    return { statusCode: 400, body: "malformed request body" };
  }

  const cookieHeader = (event.headers && (event.headers.cookie || event.headers.Cookie)) || "";
  const cookieState = readCookie(cookieHeader, "ntlsn_lti_state");
  if (!cookieState || !safeEqual(cookieState, body.state || "")) {
    return { statusCode: 400, headers: { "Content-Type": "text/html" }, body: html("Launch failed", "<h1>State mismatch</h1><p>Please retry the launch from your LMS.</p>") };
  }

  const unverified = decodeUnverified(body.id_token);
  if (!unverified) return { statusCode: 400, body: "malformed id_token" };

  let platform;
  try {
    platform = await lookupPlatform(unverified.payload.iss, unverified.payload.aud);
  } catch (e) {
    return { statusCode: 502, body: "platform registry unavailable: " + (e.message || e) };
  }
  if (!platform) return { statusCode: 400, body: "unregistered platform: " + unverified.payload.iss };

  let payload;
  try {
    payload = await verifyWithJwksUrl(body.id_token, platform.jwksUrl);
  } catch (e) {
    return { statusCode: 400, body: "jwks verification failed: " + (e.message || e) };
  }
  if (!payload) return { statusCode: 400, body: "invalid id_token signature" };

  const audOk = payload.aud === platform.clientId || (Array.isArray(payload.aud) && payload.aud.includes(platform.clientId));
  if (!audOk) return { statusCode: 400, body: "aud mismatch" };

  if (!(await consumeNonce(payload.nonce))) {
    return { statusCode: 400, headers: { "Content-Type": "text/html" }, body: html("Launch failed", "<h1>Nonce invalid</h1><p>Expired, unrecognised, or already used — please retry the launch from your LMS.</p>") };
  }

  const deploymentId = payload[DEPLOY_ID_CLAIM];
  if (!deploymentId || !(platform.deploymentIds || []).includes(deploymentId)) {
    return { statusCode: 400, body: "unregistered deployment_id: " + deploymentId };
  }

  const messageType = payload[MSG_TYPE_CLAIM];
  if (messageType !== "LtiDeepLinkingRequest") {
    return { statusCode: 400, body: "unsupported message type: " + messageType + " — NTLSN currently supports Deep Linking only" };
  }

  // Deep Linking requires the platform to say where (and with what opaque `data`) to send
  // the response. A launch without a usable https return URL can't complete the round trip.
  const dlSettings = payload[DL_SETTINGS_CLAIM] || {};
  const returnUrl = dlSettings.deep_link_return_url;
  let returnUrlOk = false;
  try {
    returnUrlOk = new URL(returnUrl).protocol === "https:";
  } catch (_e) {
    /* fall through */
  }
  if (!returnUrlOk) {
    return { statusCode: 400, body: "deep_linking_settings.deep_link_return_url missing or not https" };
  }

  // Round-trip state the return endpoint needs, signed with NTLSN's own key so the
  // browser can carry it but never alter it. `purpose` pins this token to the picker
  // flow — no other NTLSN-signed JWT (e.g. a Deep Linking response) can stand in for it.
  const now = Math.floor(Date.now() / 1000);
  const session = {
    purpose: "lti-dl-session",
    iss: payload.iss,
    clientId: platform.clientId,
    deploymentId,
    deep_link_return_url: returnUrl,
    iat: now,
    exp: now + SESSION_TTL_S,
  };
  if (typeof dlSettings.data === "string" && dlSettings.data) session.data = dlSettings.data;

  let sessionJwt;
  try {
    sessionJwt = sign(session);
  } catch (_e) {
    return { statusCode: 503, body: "LTI signing key not configured" };
  }

  let items;
  try {
    items = await loadContent();
  } catch (e) {
    return { statusCode: 502, body: "content registry unavailable: " + (e.message || e) };
  }

  const list = items
    .map(
      (it) =>
        `<li style="margin:0 0 .75rem"><label style="display:block;cursor:pointer">` +
        `<input type="checkbox" name="item" value="${esc(it.id)}"> <b>${esc(it.title)}</b>` +
        `<br><span style="color:#555">${esc(it.description)}</span></label></li>`
    )
    .join("");

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    multiValueHeaders: { "Set-Cookie": ["ntlsn_lti_state=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0"] },
    body: html(
      "Add NTLSN resources to your course",
      `<h1>Add NTLSN resources</h1>
       <p>Launched from <b>${esc(platform.name || platform.issuer)}</b>. Choose the free, public
       NTLSN resources to add to your course — links only, no student data leaves your LMS.</p>
       <form method="post" action="/.netlify/functions/lti-deeplink-return">
         <input type="hidden" name="session" value="${esc(sessionJwt)}">
         <fieldset style="border:0;padding:0;margin:1.5rem 0">
           <legend style="font-weight:600;margin-bottom:.75rem">Free commons resources</legend>
           <ul style="list-style:none;padding:0;margin:0">${list}</ul>
         </fieldset>
         <button type="submit" style="font-size:1rem;padding:.5rem 1.25rem">Add to course</button>
         <p style="color:#666;font-size:.875rem">Selecting nothing and submitting returns you to your LMS without adding anything.</p>
       </form>`
    ),
  };
};
