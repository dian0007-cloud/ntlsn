import { useRef, useState } from "react";

/**
 * #ntlsn-distribute — "Take it with you · NTLSN, everywhere you work."
 * (Epic 1.2 PR-E), ported verbatim from the ntlsn-distribute-script patch
 * (calendar-subscribe + embed-widget cards) with the ntlsn-digest-card
 * satellite folded in as the third grid card, exactly where its script
 * appended it.
 *
 * Digest card state: production ships with BD_USER="" (Buttondown account
 * not yet created), which renders the graceful "Launching soon" card that
 * points at the calendar/RSS. Ported in that same disabled state — when Seb
 * sets up the Buttondown account, add the subscribe form variant here (the
 * production script's BD_USER branch has the exact markup and POST target).
 */
const EMBED_SNIPPET = '<script src="https://ntlsn.com/widget.js" data-limit="5"></script>';

const BTN =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] bg-teal px-3.5 py-2.5 text-sm font-semibold text-navy no-underline";
const GHOST =
  "inline-flex items-center gap-1.5 rounded-[9px] border border-teal/35 px-[13px] py-[9px] text-sm font-semibold text-[#CFE9E5] no-underline";
const CARD =
  "rounded-[18px] border border-teal/[0.18] bg-[#0f1f38] p-7";

export default function DistributeSection() {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copyEmbed() {
    try {
      await navigator.clipboard.writeText(EMBED_SNIPPET);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard unavailable (e.g. permissions) — the snippet stays
         selectable in the <pre> for manual copy. */
    }
  }

  return (
    <section
      id="ntlsn-distribute"
      aria-labelledby="ntlsn-distribute-heading"
      className="relative mx-auto max-w-[1100px] scroll-mt-20 px-6 py-16"
    >
      <p className="mb-2.5 text-center text-[13px] font-bold tracking-[2px] text-teal uppercase">
        Take it with you
      </p>
      <h2
        id="ntlsn-distribute-heading"
        className="mb-3 text-center text-[clamp(28px,4vw,44px)] leading-[1.1] font-extrabold text-white"
      >
        NTLSN, everywhere you work.
      </h2>
      <p className="mx-auto mb-10 max-w-[640px] text-center text-[17px] leading-relaxed text-[#9FB3C8]">
        Subscribe to the sector calendar so new events land in your diary
        automatically — or embed the live &ldquo;what&rsquo;s on&rdquo; list
        on your own L&amp;T page.
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className={CARD}>
          <h3 className="mb-1.5 text-xl leading-[1.2] font-bold text-white">
            📅 Subscribe to the sector calendar
          </h3>
          <p className="mb-[18px] text-[15px] leading-[1.55] text-[#9FB3C8]">
            The sector calendar, auto-updating daily. Add once — new
            symposiums and events appear as they are listed.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a
              className={BTN}
              href="https://calendar.google.com/calendar/render?cid=webcal://ntlsn.com/events.ics"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Google
            </a>
            <a className={GHOST} href="webcal://ntlsn.com/events.ics">
              Apple / Outlook
            </a>
            <a className={GHOST} href="/events.ics" download>
              Download .ics
            </a>
            <a
              className={GHOST}
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
            >
              RSS
            </a>
          </div>
        </div>

        <div className={CARD}>
          <h3 className="mb-1.5 text-xl leading-[1.2] font-bold text-white">
            🔌 Embed NTLSN on your site
          </h3>
          <p className="mb-3.5 text-[15px] leading-[1.55] text-[#9FB3C8]">
            Drop this on any university L&amp;T page to show the
            sector&rsquo;s next events. Add{" "}
            <code className="text-[#CFE9E5]">data-uni=&quot;usq&quot;</code>{" "}
            to filter to your institution.
          </p>
          <pre className="mb-3 overflow-auto rounded-[10px] border border-white/[0.08] bg-navy p-3.5 font-mono text-[13px] leading-normal font-medium wrap-break-word whitespace-pre-wrap text-[#9FE6DD]">
            {EMBED_SNIPPET}
          </pre>
          <button type="button" onClick={copyEmbed} className={BTN}>
            {copied ? "✓ Copied" : "Copy code"}
          </button>
          <p className="mt-3.5 text-[13px] leading-normal text-[#9FB3C8]">
            Also available: an{" "}
            <b className="text-[#CFE9E5]">Acknowledgement of Country</b>{" "}
            widget for your campus —{" "}
            <code className="text-[#9FE6DD] break-all">
              &lt;script src=&quot;https://ntlsn.com/country-widget.js&quot;
              data-uni=&quot;usq&quot;&gt;&lt;/script&gt;
            </code>
          </p>
        </div>

        {/* ntlsn-digest-card — Buttondown disabled (BD_USER="" in prod). */}
        <div className={CARD}>
          <h3 className="mb-1.5 text-xl leading-[1.2] font-bold text-white">
            📬 Weekly email digest
          </h3>
          <p className="mb-4 text-[15px] leading-[1.55] text-[#9FB3C8]">
            A short Monday email — what&rsquo;s on across the sector this
            fortnight, grouped by state.
          </p>
          <p className="mb-3 text-sm leading-normal font-semibold text-[#CFE9E5]">
            Launching soon.
          </p>
          <p className="mb-3.5 text-sm leading-normal text-[#9FB3C8]">
            In the meantime, the same updates are already live — add the
            calendar or follow the RSS above and you&rsquo;ll never miss an
            event.
          </p>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className={BTN}
          >
            Follow the RSS →
          </a>
        </div>
      </div>
    </section>
  );
}
