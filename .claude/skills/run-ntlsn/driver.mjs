#!/usr/bin/env node
/**
 * run-ntlsn driver — launch the NTLSN static site in a headless Chromium and
 * drive it: dismiss the location gate, run a search, and capture screenshots.
 * Prints a JSON summary of what rendered so a future agent
 * can tell at a glance whether the SPA hydrated.
 *
 * NTLSN is a single-file static SPA (index.html, ~1.7 MB, inline React bundle).
 * It renders CLIENT-SIDE, so a plain `curl` only gets the shell — you need a real
 * browser (this script) to see rendered content.
 *
 * PREREQ (once):  npm install playwright-core
 *   and a Chromium on disk. The script auto-detects one in the Playwright cache;
 *   if none is found, get one with:  npx playwright install chromium
 *   (or set PLAYWRIGHT_CHROMIUM=/path/to/chrome to point at any Chromium).
 *
 * USAGE (from the repo root, with the site served — see SKILL.md):
 *   node .claude/skills/run-ntlsn/driver.mjs [opts]
 *     --url <u>      URL to load           (default http://127.0.0.1:8080/)
 *     --query <q>    search term to type   (default "assessment")
 *     --out <dir>    screenshot output dir (default ./run-shots)
 *     --fullpage     also capture a full-page screenshot
 *     --no-drive     just load + screenshot the hero, skip search/filter
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const args = parseArgs(process.argv.slice(2));
const URL = args.url || 'http://127.0.0.1:8080/';
const QUERY = args.query ?? 'assessment';
const OUT = args.out || './run-shots';
fs.mkdirSync(OUT, { recursive: true });

const exe = resolveChromium();
if (!exe) {
  console.error('No Chromium found. Run `npx playwright install chromium` or set PLAYWRIGHT_CHROMIUM.');
  process.exit(2);
}

const consoleErrors = [];
const browser = await chromium.launch({ executablePath: exe, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message.slice(0, 160)));

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  // The inline bundle renders synchronously from embedded data; 2.5s also covers
  // the soft-failing external feed fetches (Google Apps Script). Do NOT use
  // networkidle — those cold-start endpoints will hang it.
  await page.waitForTimeout(2500);

  const heroShot = path.join(OUT, '01-hero.png');
  await page.screenshot({ path: heroShot });

  // Dismiss the location gate ("In Australia" / "Elsewhere" / "Just browsing — skip").
  const skip = page.getByRole('button', { name: 'Just browsing — skip' });
  const gateDismissed = await skip.count() > 0;
  if (gateDismissed) { await skip.click(); await page.waitForTimeout(1200); }
  const homeShot = path.join(OUT, '02-home.png');
  await page.screenshot({ path: homeShot });

  const result = { url: URL, executable: exe, gateDismissed, shots: [heroShot, homeShot], consoleErrors: consoleErrors.length };

  if (args.drive !== false) {
    // Main search box (the one above the fold). Best-effort: a search opens a
    // results dropdown, so don't let a flaky click below abort the whole run.
    try {
      const q = page.locator('input[placeholder*="Search symposiums, events"]').first();
      if (await q.count()) {
        await q.click();
        await q.fill(QUERY);
        await page.waitForTimeout(1800);
        const searchShot = path.join(OUT, '03-search.png');
        await page.screenshot({ path: searchShot });
        result.shots.push(searchShot);
        result.searchTyped = QUERY;
        result.cardsAfterSearch = await page.locator('div[class*="card"]').count();
      } else {
        result.searchError = 'search input not found';
      }
    } catch (e) { result.searchError = String(e.message || e).slice(0, 120); }
  }

  if (args.fullpage) {
    const fp = path.join(OUT, 'fullpage.png');
    await page.screenshot({ path: fp, fullPage: true });
    result.shots.push(fp);
  }

  // Hydration sanity: hero claims + uni-count text that the bundle renders.
  result.hydration = await page.evaluate(() => {
    const t = document.body.innerText;
    const has = s => t.includes(s);
    return {
      links: document.querySelectorAll('a').length,
      buttons: document.querySelectorAll('button').length,
      NTLSN: has('NTLSN'), FREE: has('FREE'), openSource: has('open-source') || has('OPEN-SOURCE'),
      says42: has('42 universities'), says43: has('43 universit'),
    };
  });

  console.log(JSON.stringify(result, null, 2));
  if (consoleErrors.length) { console.log('first console errors:'); consoleErrors.slice(0, 5).forEach(e => console.log('  -', e)); }
} finally {
  await browser.close();
}

// --- helpers -----------------------------------------------------------------

function parseArgs(argv) {
  const out = { drive: true };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--url') out.url = argv[++i];
    else if (k === '--query') out.query = argv[++i];
    else if (k === '--out') out.out = argv[++i];
    else if (k === '--fullpage') out.fullpage = true;
    else if (k === '--no-drive') out.drive = false;
  }
  return out;
}

/** Find a Chromium executable: env override → Playwright cache (macOS, then Linux). */
function resolveChromium() {
  if (process.env.PLAYWRIGHT_CHROMIUM && fs.existsSync(process.env.PLAYWRIGHT_CHROMIUM)) return process.env.PLAYWRIGHT_CHROMIUM;
  const caches = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,                           // CI/cloud containers
    path.join(os.homedir(), 'Library/Caches/ms-playwright'),        // macOS
    path.join(os.homedir(), '.cache/ms-playwright'),                // Linux
  ].filter(Boolean);
  for (const root of caches) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      if (!dir.startsWith('chromium')) continue;
      const base = path.join(root, dir);
      // macOS app bundle
      const macApp = findMacApp(base);
      if (macApp) return macApp;
      // linux chrome binary
      const linuxChrome = path.join(base, 'chrome-linux', 'chrome');
      if (fs.existsSync(linuxChrome)) return linuxChrome;
      const linuxShell = path.join(base, 'chrome-headless-shell-linux', 'chrome-headless-shell');
      if (fs.existsSync(linuxShell)) return linuxShell;
      // Playwright's actual headless-shell layout (chromium_headless_shell-NNNN/chrome-linux/headless_shell)
      const linuxShell2 = path.join(base, 'chrome-linux', 'headless_shell');
      if (fs.existsSync(linuxShell2)) return linuxShell2;
    }
  }
  return null;
}

function findMacApp(base) {
  // headless shell first (cleaner for automation)
  const tryPaths = (rel) => rel.map(r => path.join(base, r)).find(p => fs.existsSync(p));
  return tryPaths([
    'chrome-headless-shell-mac-arm64/chrome-headless-shell',
    'chrome-headless-shell-mac-x64/chrome-headless-shell',
    'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    'chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  ]) || null;
}
