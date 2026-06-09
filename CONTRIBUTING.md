# Contributing to NTLSN

NTLSN is a shared, sector-owned index. The most valuable contribution is **keeping the events accurate and complete** — and you can do that with a small pull request. Thank you for helping.

---

## Add or update an event (the common case)

You don't need to run any build tools to *propose* an event.

1. Open [`data/events.json`](data/events.json).
2. Add an object following the schema in **[DATA.md](DATA.md)**. Copy an existing entry as a template.
3. Set `"verified": false`. A maintainer will confirm the URL and dates before it goes live.
4. Open a pull request with a one-line summary (e.g. *"Add: ACODE Workshop 91, Sep 2026"*) and a link to the official event page in the PR description.

**Good event entries:**
- Point `url` at the **official** organiser/registration page, not a news article or a PDF.
- Use the host institution's `id` for `uni` (the cross-institution host for sector-wide events).
- Keep `desc` factual and one–two sentences.
- Australian English (organise, programme, centre).

We don't list: paywalled vendor webinars unrelated to the AU L&T sector, internal-only staff events, or anything we can't verify against an organiser page.

---

## What happens after you submit

A maintainer will:
1. Check the `url` resolves and the dates match the organiser's page.
2. Flip `verified` to `true`.
3. Run `node scripts/build-feeds.mjs` to regenerate `events.ics`, `feed.xml`, `sitemap.xml` and the Event JSON-LD.
4. Merge and deploy.

> **Why the `verified` gate?** NTLSN's credibility rests on accurate, checked data — the LIVE / FREE / OPEN-SOURCE promise on the homepage. Unverified entries are held until a human confirms them.

---

## Other contributions

- **Fix a dead link or wrong date:** edit `data/events.json`, open a PR — quickest win.
- **Add an institution:** edit `data/universities.json` per [DATA.md](DATA.md) (include `traditionalCountry`).
- **Code / features:** see [`TASKS.md`](TASKS.md) for the backlog and [`CLAUDE.md`](CLAUDE.md) for the architecture (note: `index.html` is a compiled single-file build — read CLAUDE.md before touching it).

---

## Ground rules

- Be respectful and constructive in issues and reviews.
- Acknowledgement of Country and `traditionalCountry` data are **not decorative** — never strip, abbreviate, or reorder them for layout convenience.
- Content/data contributions are accepted under the project's **CC BY-NC-SA 4.0** licence (see [LICENSE](LICENSE)).

Questions? Open an issue, or reach the maintainers via https://www.ntlsn.com.
