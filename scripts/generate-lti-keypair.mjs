#!/usr/bin/env node
// One-time setup: generates the RSA keypair NTLSN uses to sign LTI 1.3 Deep Linking
// responses and to publish its JWKS at /.netlify/functions/lti-jwks. Run locally, paste
// the private key into Netlify's NTLSN_LTI_PRIVATE_KEY env var — never commit it, and
// never paste it anywhere but Netlify's env var UI/CLI.
import { generateKeyPairSync } from 'node:crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

console.log('Set this as NTLSN_LTI_PRIVATE_KEY in Netlify (Site settings -> Environment variables).');
console.log('Paste it exactly as printed below — real newlines are fine, Netlify preserves them.\n');
console.log(privateKey);
console.log('(Public key — for reference only. NTLSN derives and serves this automatically');
console.log(' via /.netlify/functions/lti-jwks; you do not need to store it anywhere.)\n');
console.log(publicKey);
