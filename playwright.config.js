// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright smoke config for NTLSN.
 *
 * The production artefact is a single static index.html (~1.8MB) with a minified
 * React bundle + ~200 inline patch scripts. There is no build step, so the suite
 * serves the repo root over a plain static server and drives the real page.
 *
 * NOTE: a local static server (python3 http.server) does NOT apply the production
 * `_headers` (CSP, HSTS, real content-types from Netlify/Cloudflare). It does,
 * however, serve correct content-types for .xml/.ics/.json via its mime map. A
 * clean local console is therefore not a full guarantee of clean production
 * behaviour under real CSP — see PR description for this caveat.
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // single-file page is heavy; one worker keeps memory/CPU bounded
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // python3 is present on both macOS dev machines and ubuntu-latest CI runners.
    // It serves .xml as application/xml, .ics as text/calendar and .json as
    // application/json out of the box — close enough to the prod `_headers`.
    command: 'python3 -m http.server 4321',
    // Playwright requires EITHER port OR url (not both); url also serves as the
    // readiness probe.
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    cwd: __dirname,
  },
});
