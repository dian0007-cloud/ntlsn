// NTLSN — LTI 1.3 launch endpoint. Receives the platform's signed id_token (form_post),
// validates it end-to-end (state, signature via the platform's own JWKS, aud, nonce
// single-use, deployment_id, message type), and — for Phase A — renders a confirmation
// page proving the pipeline is correct. Phase B replaces this with the real content
// picker + a signed LtiDeepLinkingResponse.
//
// Scope, deliberately: NTLSN supports LtiDeepLinkingRequest ONLY. No LtiResourceLinkRequest,
// no NRPS (roster), no AGS (grades) — this endpoint is structurally incapable of reading
// institutional data because it never asks a platform for any.
"use strict";

const { readCookie, safeEqual } = require("../lib/cookies");
const { verifyWithJwksUrl } = require("../lib/lti-jwt");
const { lookupPlatform } = require("../lib/lti-platforms");
const { store } = require("../lib/store");

const DEPLOY_ID_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/deployment_id";
const MSG_TYPE_CLAIM = "https://purl.imsglobal.org/spec/lti/claim/message_type";

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

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    multiValueHeaders: { "Set-Cookie": ["ntlsn_lti_state=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0"] },
    body: html(
      "LTI launch verified",
      `<h1>LTI launch verified ✓</h1>
       <p><b>Platform:</b> ${esc(platform.name || platform.issuer)}</p>
       <p><b>Deployment:</b> ${esc(deploymentId)}</p>
       <p><b>Message type:</b> ${esc(messageType)}</p>
       <p style="color:#666">The content picker isn't wired up yet (Phase B) — this page confirms the OIDC login + JWT signature-verification pipeline is correct end to end.</p>`
    ),
  };
};
