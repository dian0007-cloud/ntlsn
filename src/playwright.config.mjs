// @ts-check
import { defineConfig } from "@playwright/test";

/**
 * Playwright config for the REBUILD (/src) — separate from the root
 * playwright.config.js on purpose:
 *
 * - The root config + tests/smoke.spec.js target the PRODUCTION static root
 *   over python http.server and must stay untouched and green (rebuild
 *   handoff, convention 5). This config drives the built src app over
 *   `vite preview` instead — the verification bar for src-only PRs
 *   (convention 4).
 * - @playwright/test is a ROOT devDependency (never added to src/package.json
 *   — the src app ships no test deps); Node module resolution walks up from
 *   src/ to the repo root node_modules, so imports resolve without touching
 *   the root package.json.
 * - Chromium comes from the container's shared browser store via
 *   launchOptions.executablePath (no `npx playwright install` in agents).
 *
 * Run from src/: ../node_modules/.bin/playwright test -c playwright.config.mjs
 * (requires a prior `npm run build` — preview serves dist/).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1280, height: 900 },
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    launchOptions: {
      executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    },
  },

  projects: [{ name: "chromium" }],

  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
