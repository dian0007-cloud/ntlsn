import { useState, type FormEvent } from "react";

/**
 * #ntlsn-sap — the National Students-as-Partners Registry (Epic 1.2 PR-G,
 * recognition band). Ported from the production ntlsn-sap-script injector:
 * the six-mode partnership typology, the "what registering earns you" grid
 * and the registration form (POST to the ntlsn-exchange.gs Apps Script
 * endpoint — same `text/plain` no-preflight contract as the share form,
 * `kind:"sap"`, honeypot field `website`, fail-soft).
 *
 * Divergence, documented: the injector's follow-up GET (?kind=sap) appended
 * approved rows to `#ntlsn-sap-l0…l4` boxes that its own markup never
 * created (a leftover from an earlier five-level design) — a no-op in
 * production, so it is not ported.
 */
const EX_ENDPOINT =
  "https://script.google.com/macros/s/AKfycby4vYguJqe-nyuuar6HqaiF6IQ3N-68WsAri1CgK81kTqvDY3I_299AIn_XlcQm8O6S/exec";

const TYPES: ReadonlyArray<[string, string, string]> = [
  [
    "Inclusion",
    "Students belong and are represented; their voice is designed in.",
    "#a0907a",
  ],
  [
    "Consultation",
    "Students advise, and their feedback genuinely shapes decisions.",
    "#8fb081",
  ],
  [
    "Collaboration",
    "Students and staff work side by side on a shared task.",
    "#c66c3f",
  ],
  [
    "Co-design",
    "Students help design curriculum, assessment and resources.",
    "#a8737f",
  ],
  [
    "Co-inquiry",
    "Students and staff research and evaluate teaching together.",
    "#a8737f",
  ],
  [
    "Student-led action",
    "Students lead and hold shared power; student-led change.",
    "#e6a33c",
  ],
];

const INPUT_CLASS =
  "w-full rounded-[9px] border border-white/[0.12] bg-navy px-3 py-[11px] text-[15px] text-white";

export default function SapSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string> = { kind: "sap" };
    ["institution", "program", "level", "url", "name", "email", "website"].forEach(
      (k) => {
        const el = form.elements.namedItem(k) as
          | HTMLInputElement
          | HTMLSelectElement
          | null;
        data[k] = el?.value ?? "";
      },
    );
    setStatus("sending");
    fetch(EX_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data),
    })
      .then(() => {
        setStatus("sent");
        form.reset();
      })
      .catch(() => setStatus("error"));
  };

  return (
    <section
      id="ntlsn-sap"
      aria-labelledby="ntlsn-sap-heading"
      className="mx-auto max-w-[1100px] scroll-mt-20 px-6 pt-6 pb-16"
    >
      <div className="mb-2.5 text-center text-[13px] leading-none font-bold tracking-[2px] text-purple uppercase">
        ◎ National Students-as-Partners Registry
      </div>
      <h2
        id="ntlsn-sap-heading"
        className="mb-3 text-center text-[clamp(26px,3.6vw,40px)] leading-[1.1] font-extrabold text-white"
      >
        Put your student partnership on the map.
      </h2>
      <p className="mx-auto mb-[30px] max-w-[640px] text-center text-[17px] leading-[1.6] text-[#b3a48c]">
        Every university’s Students-as-Partners work is invisible to every
        other university. Register yours so it is visible across the sector —
        and so the students and staff who do the work can both be recognised
        for it.
      </p>
      <div className="mx-auto mb-6 max-w-[880px]">
        <div className="mx-auto mb-4 max-w-[680px] text-center text-[13.5px] leading-[1.6] font-semibold text-[#d9cdb6]">
          Partnership is a repertoire, not a ladder — six ways it shows up,
          from inclusion to student-led action. Each is legitimate; the right
          one depends on your context.
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-[11px]">
          {TYPES.map(([title, body, colour], i) => (
            <div
              key={title}
              className="rounded-[14px] bg-[#2a2218] px-4 py-[15px]"
              style={{
                border: `1px solid ${colour}33`,
                borderTop: `3px solid ${colour}`,
              }}
            >
              <div className="mb-[7px] flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-flex h-[23px] w-[23px] flex-none items-center justify-center rounded-[7px] text-[12px] font-extrabold"
                  style={{ color: colour, background: `${colour}24` }}
                >
                  {i + 1}
                </span>
                <span className="text-[14.5px] font-bold text-white">
                  {title}
                </span>
              </div>
              <div className="text-[12.5px] leading-[1.5] text-[#b3a48c]">
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mb-[18px] max-w-[880px]">
        <div className="mb-[11px] text-center text-[11px] font-bold tracking-[0.6px] text-[#a0907a] uppercase">
          What registering earns you
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[11px] text-center">
          <div className="rounded-[12px] border border-[rgba(143,176,129,.22)] border-l-[3px] border-l-[#8fb081] bg-[rgba(143,176,129,.07)] p-4">
            <div className="mb-[7px] text-[12.5px] font-bold text-[#8fb081]">
              Visibility
            </div>
            <div className="text-[12.5px] leading-[1.5] text-[#d9cdb6]">
              Your partnership appears on the national registry. Peers across
              42 universities see what you are doing — and may reach out.
            </div>
          </div>
          <div className="rounded-[12px] border border-[rgba(168,115,127,.22)] border-l-[3px] border-l-purple bg-[rgba(168,115,127,.07)] p-4">
            <div className="mb-[7px] text-[12.5px] font-bold text-purple">
              Portable evidence
            </div>
            <div className="text-[12.5px] leading-[1.5] text-[#d9cdb6]">
              Partnership work counts for promotion and teaching recognition.
              Add it to a{" "}
              <a
                href="/recognition-navigator.html"
                className="text-teal no-underline"
              >
                cross-sector record
              </a>{" "}
              that travels.
            </div>
          </div>
          <div className="rounded-[12px] border border-[rgba(230,163,60,.22)] border-l-[3px] border-l-amber bg-[rgba(230,163,60,.07)] p-4">
            <div className="mb-[7px] text-[12.5px] font-bold text-amber">
              Recognised hours
            </div>
            <div className="text-[12.5px] leading-[1.5] text-[#d9cdb6]">
              Mentoring, co-design and assessing count toward the{" "}
              <a
                href="/recognition-navigator.html"
                className="text-teal no-underline"
              >
                recognition benchmark
              </a>{" "}
              — and accumulate into verified badges.
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[880px] rounded-[18px] border border-[rgba(168,115,127,.18)] bg-[#2a2218] p-[26px]">
        <div className="mb-3 text-[17px] leading-[1.2] font-bold text-white">
          Register your program
        </div>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3"
        >
          <label className="sr-only" htmlFor="ntlsn-sap-institution">
            Institution
          </label>
          <input
            id="ntlsn-sap-institution"
            name="institution"
            required
            placeholder="Institution"
            className={INPUT_CLASS}
          />
          <label className="sr-only" htmlFor="ntlsn-sap-program">
            Program name
          </label>
          <input
            id="ntlsn-sap-program"
            name="program"
            required
            placeholder="Program name"
            className={INPUT_CLASS}
          />
          <label className="sr-only" htmlFor="ntlsn-sap-level">
            Partnership type
          </label>
          <select id="ntlsn-sap-level" name="level" className={INPUT_CLASS}>
            {TYPES.map(([title]) => (
              <option key={title}>{title}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="ntlsn-sap-url">
            Program URL
          </label>
          <input
            id="ntlsn-sap-url"
            name="url"
            placeholder="Program URL"
            className={INPUT_CLASS}
          />
          <label className="sr-only" htmlFor="ntlsn-sap-name">
            Contact name
          </label>
          <input
            id="ntlsn-sap-name"
            name="name"
            placeholder="Contact name"
            className={INPUT_CLASS}
          />
          <label className="sr-only" htmlFor="ntlsn-sap-email">
            Contact email (kept private)
          </label>
          <input
            id="ntlsn-sap-email"
            name="email"
            type="email"
            placeholder="Contact email (kept private)"
            className={INPUT_CLASS}
          />
          {/* Honeypot — same anti-spam field the patch script posted. */}
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-5000px]"
          />
          <div className="col-span-full flex flex-wrap items-center gap-3.5">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-[9px] bg-purple px-[18px] py-3 text-[15px] leading-none font-semibold text-navy"
            >
              Register →
            </button>
            <span
              className="text-[14px]"
              style={{ color: status === "sent" ? "#7fa66a" : "#b3a48c" }}
              role="status"
            >
              {status === "idle" && "Register yours, see everyone’s."}
              {status === "sending" && "Sending…"}
              {status === "sent" &&
                "✓ Submitted — it appears on the spectrum once approved."}
              {status === "error" && "Something went wrong — please try again."}
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
