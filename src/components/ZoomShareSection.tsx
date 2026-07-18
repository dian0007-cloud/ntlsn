import { useEffect, useRef, useState } from "react";
import {
  buildShareBody,
  fetchShared,
  postShare,
  SHARE_TOAST_REST,
  SHARE_TOAST_STRONG,
  SHARED_NETWORK_COLOURS,
  sharedYouTubeId,
  validateShare,
  type SharedItem,
} from "../lib/shareForm";
import VideoLightbox, { lightboxEmbedSrc } from "./VideoLightbox";

/**
 * #ntlsn-zoom — "Share a live session. The whole sector's invited."
 * (Epic 1.2 PR-C). Three production pieces fold into this one section per
 * the PR-C brief:
 *
 * 1. The live-session helper (ntlsn-zoom-script patch): paste a Zoom/Teams
 *    link → join card + Google Calendar link + .ics download, built
 *    entirely client-side. Nothing is uploaded.
 * 2. The symposium share form — in production a separate anonymous bundle
 *    section ("Share your Zoom — or just your registration form…", ordered
 *    by an ntlsn-order regex matcher near the page tail) with the HARDENED
 *    submit handler patch. Hosted here per the brief; the production tail
 *    section retires when PR-E deletes its matcher. ⚠ The Apps Script POST
 *    contract is byte-for-byte load-bearing — see lib/shareForm.ts and
 *    docs/moderation.md. Field DOM order must not change.
 * 3. The "Shared across the sector" feed (GET side of the same endpoint,
 *    fail-soft): approved rows as cards; YouTube links play on-site via the
 *    lightbox, exactly like production.
 */
export default function ZoomShareSection() {
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function showToast() {
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 5500);
  }

  return (
    <section
      id="ntlsn-zoom"
      aria-labelledby="ntlsn-zoom-heading"
      className="relative scroll-mt-20 px-6 py-[60px]"
    >
      <div className="mx-auto max-w-[720px]">
        <div className="mx-auto mb-6 max-w-[680px] text-center">
          <p className="mb-3.5 inline-flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-teal px-3 py-1 text-[11px] font-extrabold tracking-[1.5px] text-[#1f1810] uppercase">
              ▶ Try it
            </span>
            <span className="rounded-full border border-teal/40 px-[11px] py-1 text-[10.5px] font-extrabold tracking-[1.2px] text-[#d8e0cc] uppercase">
              Free · no login
            </span>
          </p>
          <h2
            id="ntlsn-zoom-heading"
            className="mb-3.5 text-[clamp(32px,4.6vw,54px)] leading-[1.1] font-extrabold text-white"
          >
            Share a live session. The whole sector&rsquo;s invited.
          </h2>
          <p className="text-[clamp(16px,1.9vw,19px)] leading-relaxed text-[#bca98f]">
            Paste your Zoom or Teams link, name it, set a time — we&rsquo;ll
            handle the rest: a clean join card and a one-click calendar
            invite, ready to send to every university. Runs entirely in your
            browser; nothing is uploaded, ever.
          </p>
        </div>

        <div className="mx-auto mt-0.5 mb-5 grid max-w-[680px] grid-cols-1 gap-[9px] sm:grid-cols-3">
          {(
            [
              ["STEP 1", "Share one", "Add your Zoom seminar — title & link."],
              [
                "STEP 2",
                "It joins the sector",
                "Listed for every educator in the shared library.",
              ],
              [
                "STEP 3",
                "Get the sector’s back",
                "Every seminar anyone shares is yours to join. One link in, a sector back.",
              ],
            ] as const
          ).map(([step, title, body]) => (
            <div
              key={step}
              className="rounded-xl border border-white/[0.07] bg-[#0e1c33] px-[13px] py-3 text-center"
            >
              <p className="mb-[5px] text-[10.5px] font-extrabold tracking-[0.6px] text-teal">
                {step}
              </p>
              <p className="mb-[3px] text-[13px] font-extrabold text-white">
                {title}
              </p>
              <p className="text-[11px] leading-snug text-[#b3a48c]">{body}</p>
            </div>
          ))}
        </div>

        <div className="mb-4 rounded-[14px] border border-[#c66c3f]/25 bg-gradient-to-br from-teal/[0.08] to-[#c66c3f]/[0.06] px-5 py-4">
          <p className="mb-[9px] inline-block rounded-full border border-[#c66c3f]/40 px-[11px] py-1 text-[10px] font-extrabold tracking-[1.4px] text-[#c66c3f] uppercase">
            Roadmap · 2027
          </p>
          <p className="mb-[5px] text-base font-bold text-white">
            Institutional Zoom connector
          </p>
          <p className="text-[13.5px] leading-relaxed text-[#bca98f]">
            Today you share links by hand. Next: connect your
            university&rsquo;s Zoom or Teams by API (OAuth) so two
            institutions can{" "}
            <b className="text-[#CCFFEE]">federate live sessions automatically</b>{" "}
            — calendars sync and every partner&rsquo;s seminars land in one
            shared timetable. Needs institutional API access; in design.
          </p>
        </div>

        <LiveSessionBuilder />

        <p className="mx-auto mt-4 max-w-[640px] text-center text-xs leading-normal text-[#a0907a]">
          A client-side helper — it builds the join card, Google Calendar
          link and .ics file in your browser, with no account and no plugin.
          To list your session for the whole sector, use the Share your Zoom
          form below — a Zoom link, a recording, or just your registration
          form all count.
        </p>
      </div>

      {/* ── The share-form band (the bundle's "Sharing Symposiums" section). ── */}
      <div className="mx-auto mt-20 max-w-3xl">
        <div className="mb-16 text-center">
          <p className="mb-2 text-[10px] tracking-[0.3em] text-[#c9a962] uppercase">
            The Invitation
          </p>
          <p className="mb-4 inline-flex items-center rounded-md border border-teal/30 px-2.5 py-0.5 text-xs font-semibold text-teal">
            Sharing Symposiums
          </p>
          <h3 className="mb-6 text-3xl leading-[1.08] font-extrabold sm:text-4xl md:text-[42px]">
            Share your Zoom — or just your registration form. We&rsquo;ll
            handle the rest.
          </h3>
          <p className="mx-auto max-w-3xl text-xl text-white/60">
            Symposiums are quietly disappearing — fewer every year, scattered
            across institutions that rarely see each other&rsquo;s work. So
            let&rsquo;s open the doors: drop your Zoom, your recording, or
            just your registration form — we&rsquo;ll handle the rest, and
            you&rsquo;ll get every other university&rsquo;s in return.
            (Spotted the em dashes? AI adores them — consider this page part
            of your field guide.) You scratch one back; a whole sector
            scratches yours. One portal to view them all.
          </p>
        </div>

        <ShareForm onSubmitted={showToast} />
        <SharedFeed />
      </div>

      {toastVisible && (
        <div
          role="status"
          className="fixed bottom-7 left-1/2 z-[99999] max-w-[90vw] -translate-x-1/2 rounded-[14px] border border-teal/45 bg-[#0e2a2a] px-[22px] py-3.5 text-[15px] font-medium text-[#D7F3EF] shadow-[0_12px_44px_rgba(0,0,0,0.55)]"
        >
          ✓ <strong>{SHARE_TOAST_STRONG}</strong>
          {SHARE_TOAST_REST}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// The live-session helper (ntlsn-zoom-script).
// ---------------------------------------------------------------------------

function pad(n: number): string {
  return (n < 10 ? "0" : "") + n;
}

/** Local floating time in the patch's YYYYMMDDTHHMM00 shape. */
function fmtIcs(dt: Date): string {
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
}

const FIELD =
  "w-full rounded-[9px] border border-white/[0.16] bg-navy px-3 py-[11px] text-sm font-medium text-white outline-none placeholder:text-white/30 focus:border-teal/50";

function LiveSessionBuilder() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [host, setHost] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");

  const trimmedTitle = title.trim();
  const trimmedLink = link.trim();
  const okLink = /^https?:\/\//i.test(trimmedLink);

  let start: Date | null = null;
  let end: Date | null = null;
  let whenText = "Time to be set";
  if (date && time) {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    start = new Date(y, m - 1, d, hh, mm);
    end = new Date(start.getTime() + (parseInt(duration, 10) || 60) * 60000);
    whenText = `${start.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })} · ${start.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  let gcal = "";
  let ics = "";
  if (start && end && trimmedTitle && trimmedLink) {
    const details = `Join: ${trimmedLink}`;
    gcal =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(trimmedTitle)}` +
      `&dates=${fmtIcs(start)}/${fmtIcs(end)}` +
      `&details=${encodeURIComponent(details)}` +
      `&location=${encodeURIComponent(trimmedLink)}`;
    ics =
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//NTLSN//Live Session//EN\r\n" +
      "BEGIN:VEVENT\r\n" +
      `UID:${fmtIcs(start)}-${Math.floor(start.getTime() / 1000)}@ntlsn.com\r\n` +
      `DTSTAMP:${fmtIcs(new Date())}\r\n` +
      `DTSTART:${fmtIcs(start)}\r\nDTEND:${fmtIcs(end)}\r\n` +
      `SUMMARY:${trimmedTitle.replace(/[,;\\]/g, " ")}\r\n` +
      `DESCRIPTION:Join ${trimmedLink}\r\nLOCATION:${trimmedLink}\r\n` +
      `URL:${trimmedLink}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  }

  function downloadIcs() {
    try {
      const blob = new Blob([ics], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${
        trimmedTitle
          .replace(/[^a-z0-9]+/gi, "-")
          .toLowerCase()
          .replace(/^-+|-+$/g, "") || "session"
      }.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch {
      // Fail-soft, like the patch.
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#2a2218] px-[26px] py-6 [border-top:3px_solid_#8fb081]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Session title (e.g. AI in Assessment CoP)"
          aria-label="Session title"
          className={`${FIELD} sm:col-span-3`}
        />
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Meeting link (Zoom, Teams, etc.)"
          aria-label="Meeting link"
          className={`${FIELD} sm:col-span-3`}
        />
        <input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Host or institution (optional)"
          aria-label="Host or institution"
          className={FIELD}
        />
        <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Date"
            className={FIELD}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Time"
            className={FIELD}
          />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            aria-label="Duration"
            className={`${FIELD} col-span-2 sm:col-span-1`}
          >
            <option value="30">30 min</option>
            <option value="60">1 hour</option>
            <option value="90">90 min</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </div>

      <div className="mt-[18px]" aria-live="polite">
        {!trimmedTitle || !trimmedLink ? (
          <p className="p-3.5 text-center text-[12.5px] text-[#a0907a] italic">
            Add a title and a meeting link to build your join card and
            calendar invite.
          </p>
        ) : (
          <div className="rounded-[13px] border border-teal/25 bg-navy px-5 py-[18px]">
            <p className="mb-1 text-[17px] font-extrabold text-white">
              {trimmedTitle}
            </p>
            <p
              className={`text-[12.5px] font-semibold text-teal ${host.trim() ? "mb-[3px]" : "mb-2.5"}`}
            >
              {whenText}
            </p>
            {host.trim() !== "" && (
              <p className="mb-2.5 text-[12.5px] font-medium text-[#b3a48c]">
                Hosted by {host.trim()}
              </p>
            )}
            {!okLink && (
              <p className="mb-2.5 text-xs font-medium text-amber">
                Add a full https:// link to enable the join button.
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {okLink && (
                <a
                  href={trimmedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-[10px] bg-teal px-5 py-[11px] text-sm font-bold text-[#1f1810] no-underline"
                >
                  Join the session →
                </a>
              )}
              {gcal !== "" && (
                <a
                  href={gcal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-[10px] border border-white/[0.18] bg-white/[0.06] px-4 py-[11px] text-[13px] font-bold text-[#d9cdb6] no-underline"
                >
                  Add to Google Calendar
                </a>
              )}
              {ics !== "" && (
                <button
                  type="button"
                  onClick={downloadIcs}
                  className="cursor-pointer rounded-[10px] border border-white/[0.18] bg-white/[0.06] px-4 py-[11px] text-[13px] font-bold text-[#d9cdb6]"
                >
                  Download .ics
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The symposium share form — hardened handler, byte-identical POST contract.
// ---------------------------------------------------------------------------

const SHARE_INPUT =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-teal/60 transition-colors";

function ShareForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Serialise FIRST (the handler's order): the body snapshot decides
    // honeypot vs post before anything else happens.
    const result = buildShareBody(form);

    // Honeypot — Netlify convention: humans never fill bot-field.
    // Pretend success, never POST (bots must not learn they were caught).
    if (result.kind === "honeypot") {
      form.reset();
      onSubmitted();
      return;
    }

    // Minimal validation — safety net; exact production messages.
    const message = validateShare(form);
    if (message !== null) {
      setError(message);
      return;
    }
    setError(null);

    setBusy(true);
    await postShare(result.body);
    // Optimistic + fail-soft by contract: reset and thank regardless.
    setBusy(false);
    form.reset();
    onSubmitted();
  }

  /*
   * ⚠ FIELD ORDER IS THE POST CONTRACT (docs/moderation.md): FormData
   * iterates in DOM order, so the JSON body keys are exactly
   * form-name, bot-field, type, institution, symposium, link, email (+title
   * appended). Do not reorder, rename or remove fields.
   */
  return (
    <form
      name="symposium-share"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="mx-auto mb-16 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left sm:p-8"
    >
      <input type="hidden" name="form-name" value="symposium-share" />
      <p className="hidden">
        <label>
          Leave empty: <input name="bot-field" />
        </label>
      </p>
      <select
        name="type"
        required
        defaultValue=""
        aria-label="What are you sharing?"
        className={`mb-4 ${SHARE_INPUT}`}
      >
        <option value="" disabled>
          What are you sharing?
        </option>
        <option value="Symposium">Symposium</option>
        <option value="Learning & Teaching Week">
          Learning &amp; Teaching Week
        </option>
        <option value="Workshop">Workshop</option>
        <option value="Other">Other resource</option>
      </select>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="institution"
          required
          placeholder="Your institution"
          aria-label="Your institution"
          className={SHARE_INPUT}
        />
        <input
          type="text"
          name="symposium"
          required
          placeholder="Symposium / event name"
          aria-label="Symposium or event name"
          className={SHARE_INPUT}
        />
      </div>
      <input
        type="url"
        name="link"
        required
        placeholder="Zoom, recording, or registration link"
        aria-label="Zoom, recording, or registration link"
        className={`mt-4 ${SHARE_INPUT}`}
      />
      <input
        type="email"
        name="email"
        placeholder="Your email (optional — so we can thank you)"
        aria-label="Your email (optional)"
        className={`mt-4 ${SHARE_INPUT}`}
      />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-teal px-6 py-3 font-semibold text-navy transition-colors hover:bg-teal/90 disabled:opacity-60"
        >
          Share my symposium →
        </button>
        <span className="text-sm text-white/40">
          Free, open, and shared back to every institution.
        </span>
      </div>
      {error !== null && (
        <p role="alert" className="mt-2.5 mb-0 text-sm text-coral">
          {error}
        </p>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------
// "Shared across the sector" — the GET side, fail-soft.
// ---------------------------------------------------------------------------

function SharedFeed() {
  const [items, setItems] = useState<SharedItem[] | null>(null);
  const [playing, setPlaying] = useState<{ src: string; title: string } | null>(
    null,
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchShared(controller.signal).then((result) => {
      if (result) setItems(result);
    });
    return () => controller.abort();
  }, []);

  // Fail-soft: nothing at all until the endpoint answers (like the patch).
  if (items === null) return <div id="shared-feed" className="mt-14" />;

  if (items.length === 0) {
    return (
      <div id="shared-feed" className="mt-14 py-2 text-center">
        <p className="text-[11px] font-bold tracking-[0.25em] text-teal uppercase">
          ● Shared across the sector
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/50">
          No symposiums shared just yet — be the first. Share your Zoom or
          recording and we&rsquo;ll feature it right here for the whole
          sector to watch, no logins.
        </p>
        <button
          type="button"
          onClick={() =>
            document
              .querySelector('form[name="symposium-share"]')
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="mt-4 cursor-pointer rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-navy"
        >
          Be the first to share →
        </button>
      </div>
    );
  }

  return (
    <div id="shared-feed" className="mt-14">
      <div className="mb-[18px] text-center">
        <p className="text-[11px] font-bold tracking-[0.25em] text-teal uppercase">
          ● Shared across the sector
        </p>
        <p className="mt-1.5 text-sm text-white/50">
          {items.length} symposium{items.length === 1 ? "" : "s"} shared by
          the sector — watch them right here, no logins.
        </p>
      </div>
      <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {items.map((item) => {
          const colour = SHARED_NETWORK_COLOURS[item.network ?? ""] ?? "#8fb081";
          const videoId = sharedYouTubeId(item.link);
          const embed = videoId !== null ? lightboxEmbedSrc(item.link) : null;
          // The patch's two bespoke logo thumbnails (site-root SVGs).
          const institution = (item.institution ?? "").trim();
          const logo = /^cqu$/i.test(institution)
            ? {
                src: "/cqu-ttoc.svg",
                alt: "CQUniversity Tertiary Teaching Online Conference",
                box: "h-[94px] bg-[#19332e]",
              }
            : /^une$/i.test(institution) && /symposium/i.test(item.title ?? "")
              ? {
                  src: "/une-lt-symposium.svg",
                  alt: "UNE L&T Symposium",
                  box: "h-[82px] bg-[#0a0f16]",
                }
              : null;
          return (
            <li key={item.link + item.title}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // YouTube plays on-site via the lightbox (the patch's
                  // behaviour); everything else opens normally.
                  if (embed !== null) {
                    e.preventDefault();
                    setPlaying({ src: embed, title: item.title });
                  }
                }}
                className="block rounded-[14px] border border-white/10 bg-white/[0.03] p-4 no-underline transition-colors hover:border-teal/40"
              >
                {logo !== null ? (
                  <span
                    className={`mb-3 flex items-center justify-center rounded-[10px] border border-white/10 px-[18px] py-3 ${logo.box}`}
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </span>
                ) : videoId !== null ? (
                  <span className="relative mb-3 block aspect-video overflow-hidden rounded-[10px] bg-black">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      loading="lazy"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span
                        aria-hidden="true"
                        className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/35 bg-navy/65 text-[15px] text-white"
                      >
                        ▶
                      </span>
                    </span>
                  </span>
                ) : (
                  <span className="mb-3 flex h-[62px] items-center justify-center rounded-[10px] border border-white/[0.08] bg-gradient-to-br from-teal/[0.18] via-[#c66c3f]/[0.12] to-purple/[0.16] text-teal">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 3h20" />
                      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                      <path d="m7 21 5-5 5 5" />
                    </svg>
                  </span>
                )}
                <span className="flex items-center justify-between text-[11px]">
                  <span className="font-bold" style={{ color: colour }}>
                    {item.type || "Symposium"}
                  </span>
                  <span className="text-teal">
                    {videoId !== null ? "▶ Watch here" : "View event →"}
                  </span>
                </span>
                <span className="mt-2 block text-[15px] leading-[1.3] font-semibold text-white">
                  {item.title}
                </span>
                <span className="mt-[3px] block text-[13px] text-white/45">
                  {item.institution}
                  {item.date ? ` · ${item.date}` : ""}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {playing !== null && (
        <VideoLightbox
          src={playing.src}
          title={playing.title}
          onClose={() => setPlaying(null)}
        />
      )}
    </div>
  );
}
