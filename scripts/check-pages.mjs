#!/usr/bin/env node
/**
 * NTLSN check-pages — guards the defect classes the August 2026 browser audit
 * found live on the site. Each check exists because something shipped broken
 * and nothing noticed; the comment on each says what it caught.
 *
 *   node scripts/check-pages.mjs
 *
 * Dependency-free (Node 20+). Static analysis only — no browser, no network —
 * so it is fast enough to run on every push. Exit 1 on any failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);

// index.html is generated (the Vite shell plus a ~1MB legacy bundle) and
// legacy.html is its retained rollback copy. Neither is hand-edited, so a
// finding in them is build output, not a page defect.
const GENERATED = new Set(['index.html', 'legacy.html']);

const pages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith('.html') && !GENERATED.has(f))
  .sort();

if (!pages.length) {
  console.error('check-pages: no root .html pages found — wrong working directory?');
  process.exit(1);
}

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return m ? m[1] : null;
};

for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');

  for (const m of html.matchAll(SCRIPT_RE)) {
    const [, tag, body] = m;
    const type = (attr(tag, 'type') || '').toLowerCase();
    const line = html.slice(0, m.index).split('\n').length;

    // ── 1. Inline scripts must parse. ──────────────────────────────────────
    // sotl-wrapped.html shipped for a month with its entire script dead: a
    // paragraph pasted inside a single-quoted JS string left an unescaped
    // 'Segoe UI' and a raw newline, so nothing on the page ran. The page
    // rendered perfectly, which is precisely why no one noticed.
    if (!type || type === 'text/javascript' || type === 'module') {
      if (attr(tag, 'src') || !body.trim()) continue;
      try {
        // A module may legitimately use import/export at top level.
        new vm.Script(body, { filename: `${page}:${line}`, importModuleDynamically: undefined });
      } catch (err) {
        if (type === 'module' && /import|export/.test(String(err.message))) continue;
        fail(page, `inline <script> at line ${line} does not parse — ${err.message}`);
      }
      continue;
    }

    // ── 2. JSON-LD must parse. ─────────────────────────────────────────────
    // A malformed block is invisible on the page and silently drops the page
    // out of structured-data indexing.
    if (type === 'application/ld+json') {
      try {
        JSON.parse(body);
      } catch (err) {
        fail(page, `JSON-LD at line ${line} does not parse — ${err.message}`);
      }
    }
  }

  // ── 3. Click handlers on non-focusable elements must be keyboard operable. ─
  // 24 crash-course pages bound click to bare <div class="lhead"> accordions
  // with no role, tabindex or keydown, so keyboard and screen-reader visitors
  // could not open lessons 2-4 at all — a WCAG 2.2 SC 2.1.1 (Level A) failure
  // against the AA floor in CLAUDE.md. Fifteen sibling pages already shipped
  // the accessible version; the fix simply never reached the rest.
  for (const sel of ['.lhead', '.ci']) {
    const binds = html.includes(`querySelectorAll('${sel}')`) || html.includes(`querySelectorAll("${sel}")`);
    if (!binds) continue;
    const hasRole = /setAttribute\(\s*['"]role['"]/.test(html);
    const hasTabindex = /setAttribute\(\s*['"]tabindex['"]/.test(html);
    const hasKeydown = /addEventListener\(\s*['"]keydown['"]/.test(html);
    if (!hasRole || !hasTabindex || !hasKeydown) {
      const missing = [!hasRole && 'role', !hasTabindex && 'tabindex', !hasKeydown && 'keydown handler']
        .filter(Boolean)
        .join(', ');
      fail(page, `${sel} controls are bound to click but are not keyboard operable — missing ${missing}`);
    }
  }
}

// ── 4. Cross-page hash links must resolve. ───────────────────────────────────
// icip.html invited people to report a wrong attribution of Country and linked
// to /#share, a fragment that exists nowhere on the homepage: every correction
// landed silently at the top of the page. library-access.html had the same link.
// Homepage ids live in the /src rebuild, so collect them from there.
const srcIds = new Set();
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx?|html)$/.test(entry.name)) {
      const text = fs.readFileSync(p, 'utf8');
      for (const m of text.matchAll(/\bid=["'{]{1,2}([A-Za-z][\w-]*)["'}]{1,2}/g)) srcIds.add(m[1]);
      // sections.ts lists canonical section ids as bare string literals.
      if (entry.name === 'sections.ts') {
        for (const m of text.matchAll(/["']([a-z][\w-]{2,})["']/g)) srcIds.add(m[1]);
      }
    }
  }
};
const srcDir = path.join(ROOT, 'src');
if (fs.existsSync(srcDir)) walk(srcDir);

if (srcIds.size) {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    for (const m of html.matchAll(/href=["']\/#([A-Za-z][\w-]*)["']/g)) {
      if (!srcIds.has(m[1])) {
        const line = html.slice(0, m.index).split('\n').length;
        fail(page, `line ${line}: link to /#${m[1]} — no such id on the homepage`);
      }
    }
  }
} else {
  console.warn('check-pages: /src not found — skipping the homepage-fragment check');
}

console.log(`check-pages: inspected ${pages.length} pages`);
if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error('');
  process.exit(1);
}
console.log('check-pages: no problems found');
