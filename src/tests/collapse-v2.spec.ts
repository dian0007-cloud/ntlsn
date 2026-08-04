import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Collapse v2 verification (epic1/collapse-v2) — runs against the BUILT src
 * app over `vite preview` (see src/playwright.config.mjs; the root smoke
 * suite covers production and stays untouched).
 *
 * Covers the PR's claimed behaviours end to end:
 *  (a) hash deep-link into a grouped fold opens EVERY layer and anchors;
 *  (b) persistence: user toggles survive reload; hash beats stored closed;
 *      hash-driven opens never write; group/fold storage keys never collide;
 *  (c) find-in-page: closed inners carry hidden="until-found" (the literal
 *      value — React would coerce it to ""), beforematch opens synchronously
 *      at full height (flushSync), nested layers included, and the
 *      unsupported-browser branch keeps inert and never sets the attribute;
 *  (d) zero console errors on load (incl. with storage throwing);
 *  (e) the megamenu still lists ids that now live inside closed groups;
 *  plus reduced-motion settling and the nested-transitionend settle guard.
 */

const AXE_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../node_modules/axe-core/axe.min.js",
);

/** Scroll a canonical id into view and wait until its band has mounted the
 * real section inside a cfold panel (stubs are bare divs with no panel). */
async function mountFold(page: Page, id: string) {
  await page.evaluate((target) => {
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: "auto", block: "center" });
  }, id);
  await page.waitForFunction(
    (target) => !!document.getElementById(target)?.closest(".cfold-inner"),
    id,
  );
}

/** Disclosure layers enclosing an id, innermost first. */
function layersFor(page: Page, id: string) {
  return page.evaluate((target) => {
    const out: Array<{
      expanded: string | null;
      inert: boolean;
      innerHidden: string | null;
      panelHeight: number;
    }> = [];
    let panel = document.getElementById(target)?.closest(".cfold-panel");
    while (panel) {
      const btn = document.getElementById(
        panel.getAttribute("aria-labelledby") ?? "",
      );
      const inner = panel.querySelector(":scope > .cfold-inner");
      out.push({
        expanded: btn?.getAttribute("aria-expanded") ?? null,
        inert: (panel as HTMLElement).inert,
        innerHidden: inner?.getAttribute("hidden") ?? null,
        panelHeight: panel.getBoundingClientRect().height,
      });
      panel = panel.parentElement?.closest(".cfold-panel") ?? null;
    }
    return out;
  }, id);
}

function readStoredMap(page: Page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("ntlsn-cfold-v1") ?? "{}",
      ) as Record<string, string>;
    } catch {
      return {};
    }
  });
}

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // The agent container blocks outbound egress, so the fail-soft external
    // fetches (Apps Script feeds, s2 favicons) surface as blocked-resource
    // noise here. Filter ONLY that class — script errors and console.error
    // calls from our code still fail the test.
    if (/net::ERR_|Failed to load resource/.test(msg.text())) return;
    errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  return errors;
}

test("(d) zero console errors on load", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1 }).first(),
  ).toBeVisible();
  // Let the front door settle (fail-soft feeds abort silently by design).
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test("(a) hash to an id inside the Recognition group opens group + fold and anchors", async ({
  page,
}) => {
  // #ntlsn-natcert: a default-CLOSED fold inside the default-CLOSED group.
  await page.goto("/#ntlsn-natcert");
  await page.waitForFunction(
    () => !!document.getElementById("ntlsn-natcert")?.closest(".cfold-inner"),
  );
  const layers = await layersFor(page, "ntlsn-natcert");
  expect(layers).toHaveLength(2); // fold + group
  for (const layer of layers) {
    expect(layer.expanded).toBe("true");
    expect(layer.inert).toBe(false);
    expect(layer.panelHeight).toBeGreaterThan(100);
  }
  // Anchoring accuracy, not just aria-expanded: the target must sit near the
  // scroll margin (scroll-mt-20 = 80px), not at the collapsed position.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const top = document
            .getElementById("ntlsn-natcert")!
            .getBoundingClientRect().top;
          return top > -5 && top < 200;
        }),
      { timeout: 10_000 },
    )
    .toBe(true);
  // Hash-driven opens must NOT write storage.
  expect(await readStoredMap(page)).toEqual({});
});

test("(b) toggling a fold persists across reload", async ({ page }) => {
  await page.goto("/");
  await mountFold(page, "ntlsn-archive");
  const archiveBtn = page.getByRole("button", { name: /The Sector Archive/ });
  await expect(archiveBtn).toHaveAttribute("aria-expanded", "false");
  await archiveBtn.click();
  await expect(archiveBtn).toHaveAttribute("aria-expanded", "true");
  expect((await readStoredMap(page))["ntlsn-archive"]).toBe("open");

  await page.reload();
  await mountFold(page, "ntlsn-archive");
  // Restored OPEN in the state initializer — no click this time.
  await expect(
    page.getByRole("button", { name: /The Sector Archive/ }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("(b) hash beats stored 'closed' on both layers, without overwriting it", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "ntlsn-cfold-v1",
      JSON.stringify({
        "g:ntlsn-recognition": "closed",
        "ntlsn-natcert": "closed",
      }),
    );
  });
  await page.goto("/#ntlsn-natcert");
  await page.waitForFunction(
    () => !!document.getElementById("ntlsn-natcert")?.closest(".cfold-inner"),
  );
  const layers = await layersFor(page, "ntlsn-natcert");
  expect(layers).toHaveLength(2);
  for (const layer of layers) expect(layer.expanded).toBe("true");
  // The deep-link open is transient: stored choices stay untouched.
  expect(await readStoredMap(page)).toEqual({
    "g:ntlsn-recognition": "closed",
    "ntlsn-natcert": "closed",
  });
});

test("(b) group and inner fold persist under distinct keys (no cross-restoration)", async ({
  page,
}) => {
  // Open group + inner #ntlsn-recognition fold via hash (writes nothing)…
  await page.goto("/#ntlsn-recognition");
  await page.waitForFunction(
    () =>
      !!document.getElementById("ntlsn-recognition")?.closest(".cfold-inner"),
  );
  // …then explicitly CLOSE the inner fold (user toggle → writes its key).
  const innerBtn = page.getByRole("button", {
    name: /Recognise the work that counts for nothing/,
  });
  await innerBtn.click();
  await expect(innerBtn).toHaveAttribute("aria-expanded", "false");
  let stored = await readStoredMap(page);
  expect(stored["ntlsn-recognition"]).toBe("closed");
  expect(stored["g:ntlsn-recognition"]).toBeUndefined();

  // Reload without the hash: the GROUP must be unaffected (default closed,
  // not restored from the inner fold's key).
  await page.goto("/");
  await mountFold(page, "ntlsn-recognition");
  const groupBtn = page.getByRole("button", {
    name: /Recognition.*13 sections/,
  });
  await expect(groupBtn).toHaveAttribute("aria-expanded", "false");

  // And the other direction: toggling the GROUP must not touch the fold key.
  await groupBtn.click();
  await expect(groupBtn).toHaveAttribute("aria-expanded", "true");
  stored = await readStoredMap(page);
  expect(stored["g:ntlsn-recognition"]).toBe("open");
  expect(stored["ntlsn-recognition"]).toBe("closed");
  // The inner fold restored its own stored 'closed' state.
  await expect(
    page.getByRole("button", {
      name: /Recognise the work that counts for nothing/,
    }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("(c) closed inners carry hidden='until-found' and beforematch opens synchronously at full height", async ({
  page,
}) => {
  await page.goto("/");
  await mountFold(page, "ntlsn-natcert");

  // Regression contract: the attribute must be the literal string
  // "until-found" (React coerces the value to "" — display:none — if it
  // ever owns the attribute), on BOTH nested layers once closed-state
  // marking has settled (~500ms after mount).
  await expect
    .poll(async () => (await layersFor(page, "ntlsn-natcert")).map((l) => l.innerHidden), {
      timeout: 5_000,
    })
    .toEqual(["until-found", "until-found"]);
  // And inert must be OFF in the until-found branch (inert subtrees are
  // ignored by find-in-page).
  for (const layer of await layersFor(page, "ntlsn-natcert")) {
    expect(layer.inert).toBe(false);
  }

  // Dispatch beforematch on every until-found ancestor, outermost first —
  // the UA's revealing algorithm — and measure SYNCHRONOUSLY after dispatch:
  // flushSync must have the panels at full height before control returns to
  // the UA's scroll step, not a frame later.
  const result = await page.evaluate(() => {
    const target = document.getElementById("ntlsn-natcert")!;
    const foldInner = target.closest(".cfold-inner") as HTMLElement;
    const groupInner = foldInner.parentElement!.closest(
      ".cfold-inner",
    ) as HTMLElement;
    groupInner.dispatchEvent(new Event("beforematch"));
    foldInner.dispatchEvent(new Event("beforematch"));
    // Synchronous, same task — no rAF, no await.
    const rect = target.getBoundingClientRect();
    return {
      groupHidden: groupInner.getAttribute("hidden"),
      foldHidden: foldInner.getAttribute("hidden"),
      targetHeight: rect.height,
    };
  });
  expect(result.groupHidden).toBeNull();
  expect(result.foldHidden).toBeNull();
  expect(result.targetHeight).toBeGreaterThan(200);
  for (const layer of await layersFor(page, "ntlsn-natcert")) {
    expect(layer.expanded).toBe("true");
  }
  // Target within reach: scrolling lands it at its real position (i.e. the
  // revealed panel participates in layout). "instant" sidesteps the global
  // CSS scroll-behavior:smooth; poll because neighbouring lazy bands keep
  // mounting during this test and can shift absolute positions.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const el = document.getElementById("ntlsn-natcert")!;
          el.scrollIntoView({ behavior: "instant", block: "start" });
          return el.getBoundingClientRect().top;
        }),
      { timeout: 5_000 },
    )
    .toBeGreaterThan(-5);
  expect(
    await page.evaluate(() =>
      Math.round(
        document.getElementById("ntlsn-natcert")!.getBoundingClientRect().top,
      ),
    ),
  ).toBeLessThan(200);

  // Soft signal only: window.find() is a separate legacy API that does NOT
  // run the until-found revealing algorithm — but after the reveal above it
  // should locate the now-visible panel text.
  const found = await page.evaluate(() =>
    (window as unknown as { find(text: string): boolean }).find(
      "micro-learning rarely travels",
    ),
  );
  expect.soft(found).toBe(true);
});

test("(c) unsupported browsers keep inert and never see hidden='until-found'", async ({
  page,
}) => {
  // Simulate Safari/Firefox: remove the feature-detect surface before any
  // page script runs.
  await page.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (HTMLElement.prototype as any).onbeforematch;
  });
  const errors = trackErrors(page);
  await page.goto("/");
  await mountFold(page, "ntlsn-archive");
  // Give the (gated) closed-state marker its 500ms window to (not) fire.
  await page.waitForTimeout(800);
  const layers = await layersFor(page, "ntlsn-archive");
  expect(layers).toHaveLength(1);
  expect(layers[0].expanded).toBe("false");
  expect(layers[0].inert).toBe(true); // fallback branch: inert as before v2
  expect(layers[0].innerHidden).toBeNull(); // NEVER the attribute (display:none there)
  expect(layers[0].panelHeight).toBe(0);
  // The disclosure still works.
  const btn = page.getByRole("button", { name: /The Sector Archive/ });
  await btn.click();
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  expect(errors).toEqual([]);
});

test("(b/d) storage failure (private mode) fails soft: defaults apply, no console errors", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const deny = () => {
      throw new DOMException("denied", "SecurityError");
    };
    Storage.prototype.getItem = deny;
    Storage.prototype.setItem = deny;
  });
  const errors = trackErrors(page);
  await page.goto("/");
  await mountFold(page, "ntlsn-archive");
  const btn = page.getByRole("button", { name: /The Sector Archive/ });
  await expect(btn).toHaveAttribute("aria-expanded", "false"); // defaultOpen fallback
  await btn.click(); // toggle still works for this visit (write swallowed)
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  expect(errors).toEqual([]);
});

test("(e) megamenu still lists ids that now live inside closed groups", async ({
  page,
}) => {
  await page.goto("/");
  // Mount the grouped bands first — the open-time existence filter must
  // resolve grouped ids from INSIDE closed group panels, not just stubs.
  await mountFold(page, "ntlsn-advisory"); // Mission & governance group
  await mountFold(page, "ntlsn-coming2027"); // Roadmap group
  await mountFold(page, "pricing"); // pricing group
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  for (const target of [
    "ntlsn-coming2027", // Roadmap group member
    "ntlsn-coming2028", // Roadmap group member
    "pricing", // pricing group member
    "ntlsn-advisory", // Mission & governance group member
  ]) {
    expect(
      await dialog.locator(`a[href="#${target}"]`).count(),
      `#${target} present in megamenu`,
    ).toBeGreaterThan(0);
  }
});

test("reduced motion: toggles are instant and both layers still settle overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await mountFold(page, "ntlsn-recognition");
  const groupBtn = page.getByRole("button", {
    name: /Recognition.*13 sections/,
  });
  await groupBtn.click();
  await expect(groupBtn).toHaveAttribute("aria-expanded", "true");
  // With a zeroed transition, transitionend can slip — the 500ms fallback
  // must still flip the group inner to overflow:visible (sticky content).
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          // #ntlsn-recognition is an inner fold; its enclosing .cfold-inner
          // one level up is the GROUP's inner.
          const foldInner = document
            .getElementById("ntlsn-recognition")!
            .closest(".cfold-inner")!;
          const groupInner = foldInner.parentElement!.closest(
            ".cfold-inner",
          ) as Element;
          return getComputedStyle(groupInner).overflow;
        }),
      { timeout: 3_000 },
    )
    .toBe("visible");
  // And the inner defaultOpen tools settled too (their own 500ms fallback).
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const toolInner = document
            .getElementById("ntlsn-aaut")!
            .closest(".cfold-inner") as Element;
          return getComputedStyle(toolInner).overflow;
        }),
      { timeout: 3_000 },
    )
    .toBe("visible");
});

test("toggling a fold nested in an open group does not false-settle or close the group", async ({
  page,
}) => {
  await page.goto("/");
  await mountFold(page, "ntlsn-recognition");
  const groupBtn = page.getByRole("button", {
    name: /Recognition.*13 sections/,
  });
  await groupBtn.click();
  await expect(groupBtn).toHaveAttribute("aria-expanded", "true");
  // Wait for the group to settle (overflow:visible on its inner).
  const groupInnerOverflow = () =>
    page.evaluate(() => {
      const foldInner = document
        .getElementById("ntlsn-aaut")!
        .closest(".cfold-inner")!;
      const groupInner = foldInner.parentElement!.closest(
        ".cfold-inner",
      ) as Element;
      return getComputedStyle(groupInner).overflow;
    });
  await expect.poll(groupInnerOverflow, { timeout: 3_000 }).toBe("visible");

  // Close a defaultOpen tool INSIDE the group — its grid-row transitionend
  // bubbles up to the group panel and must be ignored (target guard).
  const toolBtn = page.getByRole("button", {
    name: /Ready for an AAUT Citation/,
  });
  await toolBtn.click();
  await expect(toolBtn).toHaveAttribute("aria-expanded", "false");
  await page.waitForTimeout(700); // let the nested transition run out
  await expect(groupBtn).toHaveAttribute("aria-expanded", "true");
  expect(await groupInnerOverflow()).toBe("visible");
  const groupLayer = (await layersFor(page, "ntlsn-recognition")).at(-1);
  expect(groupLayer?.panelHeight ?? 0).toBeGreaterThan(100);
});

test("axe: grouped bands pass heading/ARIA rules open and closed", async ({
  page,
}) => {
  await page.goto("/");
  await mountFold(page, "ntlsn-recognition");
  await mountFold(page, "ntlsn-advisory");
  await mountFold(page, "ntlsn-coming2027");
  // Open all three groups so axe sees the nested disclosure structure.
  for (const name of [
    /Recognition.*13 sections/,
    /Mission & governance/,
    /^Roadmap/,
  ]) {
    const btn = page.getByRole("button", { name });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
  }
  await page.addScriptTag({ path: AXE_PATH });
  const violations = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axe = (window as any).axe;
    // #ntlsn-network is the EAGER landing network graph (pre-existing,
    // untouched by Collapse v2) — its SVG flags nested-interactive on its
    // own; excluded so this audit stays scoped to the PR's claims.
    const res = await axe.run(
      { exclude: [["#ntlsn-network"]] },
      {
        runOnly: {
          type: "rule",
          values: [
            "heading-order",
            "button-name",
            "aria-allowed-attr",
            "aria-required-attr",
            "aria-valid-attr-value",
            "aria-valid-attr",
            "nested-interactive",
            "aria-hidden-focus",
          ],
        },
      },
    );
    return res.violations.map(
      (v: { id: string; nodes: Array<{ target: unknown }> }) => ({
        id: v.id,
        targets: v.nodes.slice(0, 5).map((n) => n.target),
      }),
    );
  });
  expect(violations).toEqual([]);
});
