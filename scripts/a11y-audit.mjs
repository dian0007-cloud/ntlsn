#!/usr/bin/env node
/**
 * NTLSN WCAG 2.2 AA automated audit runner.
 *
 * Loads each target page in a real headless Chromium (Playwright), injects
 * axe-core, and runs axe.run against the WCAG 2.x AA + 2.2 AA + best-practice
 * rule sets. Index.html is a client-rendered React bundle plus ~120 runtime
 * patch scripts, so it MUST be driven by a real browser (jsdom will not execute
 * the bundle's React render or the post-bundle patch scripts). The standalone
 * *.html pages are also driven by the browser so the result reflects what a
 * user actually gets, including any inline boot JS.
 *
 * Usage:
 *   node scripts/a11y-audit.mjs                 # audit the curated sample set
 *   node scripts/a11y-audit.mjs index.html      # audit specific pages
 *   node scripts/a11y-audit.mjs --all           # audit every standalone *.html
 *   node scripts/a11y-audit.mjs --json out.json # write raw results to a file
 *
 * Dev-only tooling (axe-core + playwright are devDependencies). node_modules is
 * gitignored; this script is committed so the audit is re-runnable.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AXE_SRC = fs.readFileSync(
  path.join(ROOT, 'node_modules/axe-core/axe.min.js'),
  'utf8'
);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.ics': 'text/calendar; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
};

// Minimal static server scoped to the repo root.
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(req.url.split('?')[0]);
        let filePath = path.join(ROOT, urlPath);
        if (urlPath === '/' || urlPath.endsWith('/')) filePath = path.join(ROOT, 'index.html');
        // Prevent path traversal outside ROOT.
        const rel = path.relative(ROOT, filePath);
        if (rel.startsWith('..') || path.isAbsolute(rel)) {
          res.writeHead(403); res.end('forbidden'); return;
        }
        try {
          const stat = await fsp.stat(filePath);
          if (stat.isDirectory()) { res.writeHead(301, { location: path.posix.join(urlPath, 'index.html') }); res.end(); return; }
          const data = await fsp.readFile(filePath);
          res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
          res.end(data);
        } catch {
          res.writeHead(404); res.end('not found');
        }
      } catch (e) {
        res.writeHead(500); res.end(String(e));
      }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const RULE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function auditPage(browser, base, pagePath) {
  const browserCtx = await browser.newContext();
  const page = await browserCtx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  const url = base + '/' + pagePath;
  const out = { page: pagePath, url, violations: [], incomplete: [], passes: 0, error: null };
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    // Give the React bundle + runtime patch scripts (and any boot JS on
    // standalone pages) time to settle. networkidle covers async fetches.
    try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch {}
    await page.waitForTimeout(2500); // allow MutationObserver DOM surgery to run
    await page.addScriptTag({ content: AXE_SRC });
    const result = await page.evaluate(async (tags) => {
      // eslint-disable-next-line no-undef
      return await window.axe.run(document, {
        runOnly: { type: 'tag', values: tags },
        resultTypes: ['violations', 'incomplete', 'passes'],
      });
    }, RULE_TAGS);
    out.violations = result.violations.map((v) => ({
      id: v.id, impact: v.impact, help: v.help,
      tags: v.tags.filter((t) => t.startsWith('wcag')),
      nodes: v.nodes.map((n) => ({
        target: n.target, html: (n.html || '').slice(0, 200),
        failureSummary: n.failureSummary,
      })),
    }));
    out.incomplete = result.incomplete.map((v) => ({
      id: v.id, impact: v.impact, help: v.help,
      tags: v.tags.filter((t) => t.startsWith('wcag')),
      nodeCount: v.nodes.length,
      sample: v.nodes.slice(0, 2).map((n) => ({ target: n.target, html: (n.html || '').slice(0, 120) })),
    }));
    out.passes = result.passes.length;
    out.consoleErrors = consoleErrors.slice(0, 6);
  } catch (e) {
    out.error = String(e && e.message ? e.message : e);
  } finally {
    await browserCtx.close();
  }
  return out;
}

// Curated representative sample (TASKS.md 4.1): every page category + the
// explicitly-requested pages (about, accessibility-preflight, whats-on,
// developers, open-badges, recognition-gps).
const SAMPLE = [
  'index.html',
  // homepage-adjacent
  'whats-on.html', 'developers.html', 'open-badges.html', 'recognition-gps.html',
  // about + the a11y tool page (irony check)
  'about.html', 'accessibility-preflight.html',
  // crash-course pages (a few)
  'genai-crash-course.html', 'assessment-crash-course.html', 'feedback-crash-course.html',
  // tool / calculator pages
  'contrast-checker.html', 'rubric-builder.html', 'readability.html', 'sample-size.html', 'grading.html',
  // misc important standalone pages
  'privacy.html', 'widgets.html', 'tools.html', '404.html',
];

function listAllStandalone() {
  return fs.readdirSync(ROOT)
    .filter((f) => f.endsWith('.html'))
    .sort();
}

async function main() {
  const argv = process.argv.slice(2);
  const jsonOutIdx = argv.indexOf('--json');
  let jsonOut = null;
  if (jsonOutIdx !== -1) { jsonOut = argv[jsonOutIdx + 1]; argv.splice(jsonOutIdx, 2); }
  const flags = argv.filter((a) => a.startsWith('--'));
  const positional = argv.filter((a) => !a.startsWith('--'));

  let pages;
  if (flags.includes('--all')) pages = listAllStandalone();
  else if (positional.length) pages = positional;
  else pages = SAMPLE;

  const server = await startServer();
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });

  const results = [];
  for (const p of pages) {
    process.stderr.write(`auditing ${p} ... `);
    const r = await auditPage(browser, base, p);
    process.stderr.write(`${r.error ? 'ERROR' : `${r.violations.length} violations, ${r.incomplete.length} incomplete`}\n`);
    results.push(r);
  }
  await browser.close();
  server.close();

  // ---- Summary printout ----
  let totalViolations = 0;
  const byImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  const ruleCounts = {};
  for (const r of results) {
    for (const v of r.violations) {
      totalViolations++;
      if (byImpact[v.impact] !== undefined) byImpact[v.impact]++;
      ruleCounts[v.id] = (ruleCounts[v.id] || 0) + 1;
    }
  }
  console.log('\n================ NTLSN a11y audit summary ================');
  console.log(`Pages audited: ${results.length}`);
  console.log(`Total violation instances (rule x page): ${totalViolations}`);
  console.log('By impact:', JSON.stringify(byImpact));
  console.log('Top rules:', Object.entries(ruleCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, v]) => `${k}=${v}`).join(', '));
  console.log('=========================================================\n');

  for (const r of results) {
    if (r.error) { console.log(`## ${r.page}  [LOAD ERROR: ${r.error}]`); continue; }
    console.log(`## ${r.page}  — ${r.violations.length} violation(s), ${r.incomplete.length} incomplete, ${r.passes} pass rules`);
    for (const v of r.violations) {
      console.log(`  [${v.impact || '?'}] ${v.id}: ${v.help}  (${v.nodes.length} node(s))  [${v.tags.join(',')}]`);
      for (const n of v.nodes.slice(0, 5)) {
        console.log(`      target: ${JSON.stringify(n.target)}`);
        console.log(`      html:   ${(n.html || '').replace(/\s+/g, ' ').trim()}`);
      }
    }
    for (const v of r.incomplete) {
      console.log(`  [incomplete/${v.impact || '?'}] ${v.id}: ${v.help}  (${v.nodeCount} node(s))  [${v.tags.join(',')}]`);
    }
    console.log('');
  }

  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify({ generatedAt: new Date().toISOString(), ruleTags: RULE_TAGS, results, summary: { pages: results.length, totalViolations, byImpact, ruleCounts } }, null, 2));
    console.log(`Raw results written to ${jsonOut}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
