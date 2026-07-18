# NTLSN moderation runbook — community share-form submissions

**Audience:** the human moderator (Seb). **Scope:** the "Share your symposium" form on www.ntlsn.com, the Google Sheet it feeds, the "Shared across the sector" feed that displays approved rows, and the related (but separate) "Latest from the Sector" auto-aggregated feed. Covers TASKS.md §2.5.

---

## 1. How a submission flows

1. **The form.** The visitor fills in the "Share your symposium" form (`name="symposium-share"`, rendered by the React bundle). Fields: `type` (Symposium / Learning & Teaching Week / Workshop / Other — required), `institution` (required), `symposium` (event name — required), `link` (URL — required), `email` (optional, "so we can thank you"), plus a hidden `form-name` field and a hidden `bot-field` honeypot (the Netlify convention — real humans never see or fill it).
2. **The patch script.** A small inline script in `index.html` (the `symposium-share` submit handler, ~line 136) intercepts the submit, serialises the form fields to JSON (adding `title` = the `symposium` field), and POSTs it with `Content-Type: text/plain;charset=utf-8` to the symposium Google Apps Script endpoint (`https://script.google.com/macros/s/AKfycbxPJQ…/exec`). The `text/plain` body is deliberate — it avoids a CORS preflight that Apps Script cannot answer. **Do not change this contract.**
3. **The Sheet.** The Apps Script appends the submission as a new row in its bound Google Sheet (in Seb's Google Drive — the sheet attached to that `/exec` deployment). New rows land with **Status = Pending**. Nothing is published automatically.
4. **The visitor sees** a toast: "Thank you — your symposium is in. A moderator will review it…". The toast shows whether or not the POST actually succeeded (fail-soft, see §6) — so an empty Sheet does not necessarily mean nobody submitted.

> The symposium backend script itself is not in this repo. It follows the same trusted pattern as `scripts/exchange.gs` (which *is* in the repo and is the reference for the column semantics below): POST → row lands Pending → moderator flips Status → `doGet` serves only approved rows as JSON.

## 2. Approving a submission

1. Open the symposium backend Google Sheet (Drive → the sheet bound to the share-form Apps Script; Extensions → Apps Script shows the code if you need to confirm you're in the right one).
2. Find the new row (Status column reads **Pending**).
3. **Verify before approving:**
   - The link resolves, is the organiser's own page/Zoom/recording, and is not paywalled or login-walled ("no logins" is a public promise on the feed).
   - The title and institution are real and spelt correctly (they display verbatim on the site).
   - The email, if given, stays in the Sheet — **emails never leave the Sheet** and are never served by `doGet`.
4. Set the **Status** cell to **Approved**. Matching is case-insensitive (`'approved'`), but keep it tidy: `Approved`. Any other value — `Pending`, blank, `Rejected`, `Spam` — keeps the row hidden from the site.
5. That's it. No redeploy: the site fetches the endpoint on every page load, so the row appears in "Shared across the sector" within one page refresh (allow a cold-start delay, §6).

**What the site displays** from an approved row: `title`, `institution`, `link`, `type`, `date`, and `network` (Go8/ATN/IRU/RUN/Independent — drives the badge colour). YouTube links get an inline thumbnail and play on-site via the lightbox.

## 3. Rejecting or removing junk

- **Reject:** set Status to `Rejected` (or just leave it `Pending`) — non-approved rows never surface. Prefer a value over deleting so there's an audit trail of what was submitted.
- **Spam/abuse:** delete the row outright if it's clearly bot junk (the honeypot already drops most of it silently — bots that fill `bot-field` are discarded server-side with a fake "ok", so they don't learn they were caught).
- **Un-publish:** to pull an already-approved row, change its Status back to anything other than `Approved`. Gone on next page load.

## 4. Test-row filters (built into the site)

The "Shared across the sector" patch script in `index.html` filters out obvious test rows **client-side**, even if they are marked Approved. A row is hidden if its title + institution + link contains any of:

- `dqw4w9wgxcq` (the Rick Astley test video ID)
- the phrase `will appear here`
- the standalone word `test`
- the phrase `delete this row`

Two implications: (a) you can safely keep a seeded example row in the Sheet if it matches one of these; (b) **a genuine event with "test" as a whole word in its title will never display** — reword the title in the Sheet if that ever happens.

(The separate `scripts/feed-aggregator.gs` has no moderation filters — see §5 — its hygiene is automatic: dedupe by link, broken feeds skipped, a feed that crashes a run is skipped next run, rows older than 150 days pruned.)

## 5. Don't confuse the two feeds

| | "Shared across the sector" | "Latest from the Sector" |
|---|---|---|
| Source | Community share-form submissions | ~35 sector RSS/YouTube/podcast feeds, pulled daily |
| Backend | Symposium Apps Script + Sheet (Status column) | `scripts/feed-aggregator.gs` + its own Sheet ("Feed" tab) |
| Moderation | **Manual — you approve every row** | None — fully automatic; curate by editing `FEED_SOURCES` in the script |

## 6. Rate limits and cold starts

Both Apps Script endpoints are free-tier: slow cold starts (several seconds on first hit) and daily execution/URL-fetch quotas. The site is built to **fail soft** — the fetches never block render, errors are swallowed, and the shared feed simply shows its "be the first to share" empty state if the endpoint is down or slow. Consequences for you:

- A newly approved row may take a slow first load to appear. Refresh once before assuming something is wrong.
- Because the form's thank-you toast shows even when the POST fails, a submission can be lost silently during an outage. If someone says "I submitted but it's not there", ask them to resubmit.
- Never "fix" slowness by making the scripts block render or by loosening CSP.

## 7. Promoting a submission to the events calendar (`verified: true`)

A shared symposium is often also a calendar event. Before adding it to `data/events.json` with `verified: true`:

1. **You (a human) open the URL** and confirm it resolves to the organiser's own page.
2. Confirm the **dates on the organiser's page match** what you're entering (`date`, and `endDate` if multi-day). Never trust the submitted dates alone.
3. Use an existing `type` value (`conference`, `workshop`, `symposium`, `webinar`, …) and a `uni` value that matches `data/universities.json`.
4. Only then set `verified: true`. If any doubt remains, add it as `verified: false` or not at all.
5. Run `node scripts/build-feeds.mjs` to regenerate `events.ics`, `feed.xml`, `events-ld.json` and `sitemap.xml`, and commit the lot.

---

*Related: `scripts/exchange.gs` (reference implementation of the Pending/Approved pattern, PRX & SaP), `scripts/feed-aggregator.gs` (the automatic feed), TASKS.md §2.5.*
