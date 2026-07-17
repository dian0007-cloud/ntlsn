// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * NTLSN Playwright smoke suite (TASKS.md §4.3).
 *
 * Guards the credibility-critical, bundle-dependent behaviour that no other CI
 * check covers: hero LIVE/FREE/OPEN-SOURCE claims, Acknowledgement of Country /
 * Unceded Lands content, ntlsn-order section ordering, a11y patch-script output
 * (skip-link, main landmark), nav + search interaction, add-to-calendar, and the
 * video lightbox. Runs against a locally-served copy of the repo (see
 * playwright.config.js webServer).
 *
 * CAVEAT: the local static server does not apply the production `_headers` CSP,
 * so a clean console locally is not a complete guarantee of clean production
 * behaviour under real CSP.
 */

const BASE = '/';

/**
 * The first-visit "Welcome to NTLSN" region modal (#ntlsn-region-ov, gated on
 * localStorage 'ntlsn_region') intercepts pointer events across the viewport on
 * a fresh load and blocks interaction. For interaction tests we pre-seed that
 * storage key, simulating a returning visitor. We deliberately do NOT suppress
 * the Acknowledgement strip — it is itself asserted verbatim in test (c), and it
 * is fixed to the bottom so it does not interfere with the hero/nav/lightbox
 * interactions exercised here.
 */
async function suppressOverlays(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ntlsn_region', 'au'); // skip welcome modal only
    } catch (e) { /* ignore */ }
  });
}

/**
 * Console-error filter for test (a). The page makes live calls to documented
 * external dependencies (Google Apps Script share/Latest endpoints, Google s2
 * favicons, YouTube/Vimeo, DOAJ/OpenAlex/ORCID/Zoom). In CI these can fail
 * transiently (cold start, rate limit, geo-block) and surface as console
 * errors that are NOT regressions in the bundle. Such environmental noise is
 * filtered out here; genuine JS errors (pageerror) and internal-resource errors
 * always fail the test.
 */
const EXTERNAL_NOISE = [
  /script\.google\.com/i,
  /script\.googleusercontent\.com/i,
  /googleusercontent\.com/i,
  /s2\.googleusercontent\.com/i,
  /www\.google\.com\/s2\//i,
  /youtube\.com|youtu\.be|youtube-nocookie\.com/i,
  /player\.vimeo\.com|vimeo\.com/i,
  /doaj\.org|api\.openalex\.org|pub\.orcid\.org|zoom\.us/i,
  /Failed to fetch/i,
  /net::ERR_/i,
  /NetworkError when attempting to fetch/i,
  /Load failed/i,
];
function isExternalNoise(text) {
  return EXTERNAL_NOISE.some((re) => re.test(text));
}

/** Wait for the async/mutation-driven patch scripts (order, ack, addcal, …) to settle. */
async function settle(page, ms = 6000) {
  await page.waitForTimeout(ms);
}

// ---------------------------------------------------------------------------
// (a) Homepage loads without console errors
// ---------------------------------------------------------------------------
test.describe('Page health', () => {
  test('(a) loads with zero console/page errors after settling', async ({ page }) => {
    const pageErrors = []; // uncaught exceptions — always fail
    const consoleErrors = []; // error-level console messages
    page.on('console', (msg) => {
      // HTTP-level resource failures ("Failed to load resource: … status of 429")
      // carry the URL in msg.location(), not the text — append it so the
      // host-based noise regexes can match external origins.
      if (msg.type() === 'error') consoleErrors.push(`${msg.text()} ${msg.location()?.url || ''}`.trim());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(BASE, { waitUntil: 'load' });
    // Patch scripts run on timers (800/2200/5000ms) and MutationObservers, so
    // wait well past them to catch deferred errors.
    await settle(page, 7000);

    // Uncaught JS exceptions are never acceptable.
    expect(pageErrors, 'uncaught page errors:\n' + pageErrors.join('\n')).toEqual([]);
    // Console errors must be empty once transient external-dependency noise is
    // filtered out (see isExternalNoise).
    const realConsoleErrors = consoleErrors.filter((t) => !isExternalNoise(t));
    expect(realConsoleErrors, 'console errors:\n' + realConsoleErrors.join('\n')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// (b)+(c) Credibility-critical copy: hero badges + Acknowledgement/Unceded Lands
// ---------------------------------------------------------------------------
test.describe('Credibility-critical content', () => {
  test.beforeEach(async ({ page }) => { await suppressOverlays(page); });

  test('(b) hero "Live · Free · Open-source" badge is present verbatim', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);
    // Asserted verbatim so a regression to this credibility-critical copy fails.
    await expect(page.getByText('Live · Free · Open-source', { exact: true })).toHaveCount(1);
  });

  test('(c) Acknowledgement of Country strip renders verbatim', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);
    const strip = page.locator('#ntlsn-ack-strip');
    await expect(strip).toHaveCount(1);
    await expect(strip).toHaveAttribute('aria-label', 'Acknowledgement of Country');
    // Exact wording — do not let this drift.
    await expect(strip).toContainText(
      'NTLSN acknowledges the Traditional Custodians of the lands, waters and skies across Australia on which we live, work, teach and learn — and pays respect to Elders past and present, honouring their continuing connection to Country, knowledge and community.'
    );
  });

  test('(c) "Unceded Lands" caption renders below the map', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);
    const caption = page.locator('#unceded-caption');
    await expect(caption).toHaveCount(1);
    await expect(caption).toContainText('Unceded Lands');
    await expect(caption).toContainText('sovereignty was never ceded');
  });
});

// ---------------------------------------------------------------------------
// (d) ntlsn-order relative section ordering (representative id-addressable subset)
// ---------------------------------------------------------------------------
test.describe('Section ordering (ntlsn-order)', () => {
  test.beforeEach(async ({ page }) => { await suppressOverlays(page); });

  test('(d) representative id-addressable sections appear in canonical order', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);

    // Subset of the ORDER array enforced by the ntlsn-order patch script
    // (extracted from the inline script). Asserted in the order ntlsn-order
    // mandates, so a reorder regression fails the test.
    const canonical = [
      'hero',
      'events',
      'ntlsn-conference',
      'conferences',
      'resources',
      'pd',
      'map',
      'directory',
      'about',
    ];

    // Poll until the DOM order is stable across two reads (reorder is async,
    // mutation-driven) — defensive against a late reorder tick.
    let prev = null;
    for (let i = 0; i < 12; i++) {
      const cur = await page.evaluate((ids) => {
        const hero = document.getElementById('hero');
        if (!hero || !hero.parentElement) return null;
        const parent = hero.parentElement;
        const children = Array.from(parent.children);
        return ids.map((id) => {
          const el = document.getElementById(id);
          return el ? children.indexOf(el) : -1;
        });
      }, canonical);
      if (cur && JSON.stringify(cur) === JSON.stringify(prev)) break;
      prev = cur;
      await page.waitForTimeout(500);
    }

    expect(prev, 'could not read section indices').not.toBeNull();
    // every section must be present in the DOM
    expect(prev.every((idx) => idx >= 0), `missing section(s); indices=${JSON.stringify(prev)}`).toBeTruthy();
    // indices must be strictly ascending, matching canonical order
    for (let i = 1; i < prev.length; i++) {
      expect(prev[i], `${canonical[i]} (${prev[i]}) should follow ${canonical[i - 1]} (${prev[i - 1]})`).toBeGreaterThan(prev[i - 1]);
    }
  });
});

// ---------------------------------------------------------------------------
// (e) skip-link + main landmark (a11y patch-script output)
// ---------------------------------------------------------------------------
test.describe('A11y landmarks', () => {
  test.beforeEach(async ({ page }) => { await suppressOverlays(page); });

  test('(e) skip-link exists and is focusable; main landmark present', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);

    const skip = page.locator('#ntlsn-skiplink');
    await expect(skip).toHaveCount(1);
    await expect(skip).toHaveText('Skip to main content');
    await expect(skip).toHaveAttribute('href', '#hero');
    // It must be focusable (it's an <a href>), and focusing it should reveal it
    // (the patch script moves it into view on :focus).
    await skip.focus();
    await expect(skip).toBeFocused();

    // ntlsn-landmarks marks #root as role="main".
    await expect(page.locator('[role="main"]')).toHaveCount(1);
    await expect(page.locator('#root')).toHaveAttribute('role', 'main');
  });
});

// ---------------------------------------------------------------------------
// (f) nav anchors land on correct sections + search input
// ---------------------------------------------------------------------------
test.describe('Navigation + search', () => {
  test.beforeEach(async ({ page }) => { await suppressOverlays(page); });

  test('(f) nav buttons scroll to their target sections', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);

    // Nav is <button> onClick (React scroll), not <a href>. Click each and
    // assert the target section lands inside the viewport.
    for (const [label, id] of [['PD', 'pd'], ['Resources', 'resources'], ['Events', 'events']]) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      const btn = page.getByRole('button', { name: label, exact: true }).first();
      await btn.click();
      await page.waitForTimeout(1200);
      const inView = await page.evaluate((target) => {
        const el = document.getElementById(target);
        if (!el) return { found: false };
        const r = el.getBoundingClientRect();
        return { found: true, top: Math.round(r.top), inViewport: r.top > -120 && r.top < window.innerHeight };
      }, id);
      expect(inView.found, `#${id} not found`).toBeTruthy();
      expect(inView.inViewport, `#${id} not scrolled into view (top=${inView.top})`).toBeTruthy();
    }
  });

  test('(f) hero omnisearch accepts input and shows matching suggestions', async ({ page }) => {
    // NOTE: the dedicated #events search <input> renders with zero width/height in
    // headless Chromium (a bundle quirk), so it is not reliably interactable here.
    // The brief allows the hero omnisearch as the alternative search affordance.
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);

    const heroInput = page.locator('#hero input').first();
    await expect(heroInput).toBeVisible();
    await heroInput.click();
    await heroInput.fill('rubric');
    await page.waitForTimeout(1200);
    // input accepted the typed query
    await expect(heroInput).toHaveValue('rubric');
    // a suggestion/result referencing the query rendered somewhere in #hero
    // (text nodes, not the input's value attribute)
    const heroHasSuggestion = await page.locator('#hero').evaluate((root, q) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent && node.textContent.toLowerCase().includes(q) && node.parentElement && node.parentElement.tagName !== 'INPUT') {
          return true;
        }
      }
      return false;
    }, 'rubric');
    expect(heroHasSuggestion, 'hero omnisearch produced no visible "rubric" suggestion').toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// (g) Add-to-calendar pills present on event/conference cards
// ---------------------------------------------------------------------------
test.describe('Add to calendar', () => {
  test.beforeEach(async ({ page }) => { await suppressOverlays(page); });

  test('(g) ntlsn-addcal injects Add-to-Google + .ics pills on at least one card', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);

    // The addcal script fetches /data/events.json and decorates event links in
    // #events and #conferences. [data-ntcal-ui] marks an injected pill cluster.
    const pills = page.locator('#events [data-ntcal-ui], #conferences [data-ntcal-ui]');
    await expect(pills.first()).toBeAttached();
    // Pills are injected into the DOM but can sit below the fold or behind a
    // hover-revealed affordance, so assert the cluster CONTAINS the link text
    // (DOM-based) rather than viewport-visible. Injection is what we guard here.
    await expect(pills.first()).toContainText('Add to Google');
  });
});

// ---------------------------------------------------------------------------
// (h) video lightbox opens and closes with Escape  (TASKS.md §4.3)
// ---------------------------------------------------------------------------
test.describe('Video lightbox', () => {
  test.beforeEach(async ({ page }) => { await suppressOverlays(page); });

  test('(h) clicking a video link opens a lightbox overlay; Escape closes it', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'load' });
    await settle(page);

    const overlayCount = () =>
      // evaluateAll (not evaluate): the locator matches thousands of <div>s;
      // evaluate would trip strict-mode. evaluateAll passes the full array.
      page.locator('div').evaluateAll((els) =>
        els.filter((e) => {
          const s = getComputedStyle(e);
          return s.position === 'fixed' && parseInt(s.zIndex, 10) > 9000 && !!e.querySelector('iframe');
        }).length
      );

    expect(await overlayCount(), 'no lightbox should be open initially').toBe(0);

    // Trigger the lightbox via the first YouTube link. This is a React bundle:
    // some video links sit inside hidden/collapsed cards and the page runs
    // continuous animations, so Playwright's actionability-guarded click/scroll
    // never resolve ("element is not visible" / "not stable"). We dispatch the
    // click programmatically instead — a real DOM click event bubbles to React's
    // root listener and fires the bundle's onClick, which is exactly the
    // behaviour under test (clicking a video link opens the on-site overlay).
    const clicked = await page.evaluate(() => {
      const link = document.querySelector('a[href*="youtube.com/watch"], a[href*="youtu.be/"]');
      if (!link) return false;
      link.click();
      return true;
    });
    expect(clicked, 'no YouTube link found to click').toBeTruthy();
    await page.waitForTimeout(2000);

    expect(await overlayCount(), 'lightbox overlay did not open').toBeGreaterThanOrEqual(1);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    expect(await overlayCount(), 'lightbox did not close on Escape').toBe(0);
  });
});

// ---------------------------------------------------------------------------
// (h) feeds: ICS content-type + feed.xml RSS parse  (TASKS.md §4.3)
// ---------------------------------------------------------------------------
test.describe('Feeds', () => {
  test.beforeEach(async ({ page }) => { await suppressOverlays(page); });

  test('(h) /events.ics resolves with a calendar content-type', async ({ page }) => {
    // Navigate to the served origin first so the relative fetch() below resolves
    // against http://127.0.0.1:4321 (without this, evaluate runs on about:blank
    // and fetch('/events.ics') throws "Failed to parse URL").
    await page.goto(BASE, { waitUntil: 'load' });
    // Fetch + content-type check in the browser context so it reflects what the
    // local static server actually sends (prod `_headers` would also send
    // text/calendar; a generic octet-stream would fail this).
    const info = await page.evaluate(async (url) => {
      const r = await fetch(url);
      const text = await r.text();
      return { status: r.status, ctype: (r.headers.get('content-type') || '').toLowerCase(), body: text };
    }, BASE + 'events.ics');
    expect(info.status).toBe(200);
    expect(info.ctype.startsWith('text/calendar'), `unexpected ics content-type: ${info.ctype}`).toBeTruthy();
    const body = info.body.replace(/\s+/g, ' ');
    expect(body).toContain('BEGIN:VCALENDAR');
    expect(body).toContain('END:VCALENDAR');
  });

  test('(h) /feed.xml parses as well-formed RSS', async ({ page }) => {
    // Navigate to the served origin first so the relative fetch() resolves
    // (see /events.ics test above for rationale).
    await page.goto(BASE, { waitUntil: 'load' });
    const info = await page.evaluate(async (url) => {
      const r = await fetch(url);
      const text = await r.text();
      return { status: r.status, ctype: (r.headers.get('content-type') || '').toLowerCase(), text };
    }, BASE + 'feed.xml');
    expect(info.status).toBe(200);
    expect(info.ctype.includes('xml'), `unexpected feed content-type: ${info.ctype}`).toBeTruthy();
    // Strict XML parse in-browser (DOMParser); a malformed feed surfaces a
    // <parsererror> element instead of throwing.
    const result = await page.evaluate((xml) => {
      const doc = new DOMParser().parseFromString(xml, 'text/xml');
      const parseErr = doc.getElementsByTagName('parsererror');
      if (parseErr.length) return { ok: false, msg: parseErr[0].textContent.slice(0, 200) };
      const channel = doc.querySelector('rss > channel, feed');
      const entries = doc.querySelectorAll('item, entry');
      return { ok: !!channel, hasChannel: !!channel, entryCount: entries.length };
    }, info.text);
    expect(result.ok !== false, `feed.xml is not well-formed XML: ${result.msg || ''}`).toBeTruthy();
    expect(result.hasChannel, 'feed.xml has no rss/channel or feed root').toBeTruthy();
    expect(result.entryCount, 'feed.xml has no entries').toBeGreaterThan(0);
  });
});
