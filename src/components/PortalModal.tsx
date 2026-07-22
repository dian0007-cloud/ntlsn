import { useEffect, useRef, useState } from "react";
import { PORTAL_FORMATS, PORTAL_TRACKS } from "../lib/pricing";

/**
 * The 2027 Submission Portal CONCEPT preview (Epic 1.2 PR-E) — production's
 * openPortal() modal from ntlsn-pricing-script. A demo only: talks are kept
 * in memory for the session, nothing is stored, files are never uploaded
 * (the footer says so, exactly as production did).
 *
 * A11y beyond the patch: real dialog semantics (role=dialog, aria-modal),
 * focus moves to the close button on open, Escape and backdrop-click close,
 * labels are <label htmlFor> rather than styled text.
 */
export interface PortalTalk {
  title: string;
  presenter: string;
  track: string;
  format: string;
  files: number;
}

interface PortalModalProps {
  open: boolean;
  uni: string;
  talks: readonly PortalTalk[];
  onAddTalk: (talk: PortalTalk) => void;
  onRemoveTalk: (index: number) => void;
  onClose: () => void;
}

const FIELD =
  "w-full rounded-[10px] border border-white/[0.18] bg-navy px-3 py-2.5 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-teal/60";
const LABEL =
  "mb-[5px] block text-xs font-bold tracking-[0.5px] text-[#b3a48c] uppercase";

export default function PortalModal({
  open,
  uni,
  talks,
  onAddTalk,
  onRemoveTalk,
  onClose,
}: PortalModalProps) {
  const [title, setTitle] = useState("");
  const [presenter, setPresenter] = useState("");
  const [track, setTrack] = useState<string>(PORTAL_TRACKS[0]);
  const [format, setFormat] = useState<string>(PORTAL_FORMATS[0]);
  const [abstract, setAbstract] = useState("");
  const [fileNames, setFileNames] = useState<readonly string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function addTalk() {
    onAddTalk({ title, presenter, track, format, files: fileNames.length });
    setTitle("");
    setPresenter("");
    setAbstract("");
    setFileNames([]);
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-start justify-center overflow-auto bg-[rgba(25, 20, 14,0.78)] px-3.5 py-7"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="np-portal-heading"
        className="w-full max-w-[640px] rounded-2xl border border-white/[0.12] bg-[#19130d]"
      >
        <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-[22px] py-[18px]">
          <div className="flex-1">
            <h2
              id="np-portal-heading"
              className="text-[19px] font-extrabold text-white"
            >
              Submission portal
            </h2>
            <p className="text-[13px] text-[#b3a48c]">
              {uni || "Your symposium"} · add talks &amp; upload files
            </p>
          </div>
          <span className="rounded-full border border-amber/40 px-2.5 py-1 text-[11px] font-bold tracking-[1px] text-amber">
            CONCEPT
          </span>
          <button
            ref={closeButton}
            type="button"
            aria-label="Close the submission portal preview"
            onClick={onClose}
            className="ml-1.5 cursor-pointer border-0 bg-transparent text-[26px] leading-none text-[#b3a48c]"
          >
            ×
          </button>
        </div>

        <div className="p-[22px]">
          <h3 className="mb-3 text-base font-extrabold text-white">
            Add a talk
          </h3>
          <label htmlFor="np-title" className={LABEL}>
            Title
          </label>
          <input
            id="np-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Authentic assessment in the age of GenAI"
            className={`${FIELD} mb-3`}
          />
          <label htmlFor="np-presenter" className={LABEL}>
            Presenter(s)
          </label>
          <input
            id="np-presenter"
            value={presenter}
            onChange={(e) => setPresenter(e.target.value)}
            placeholder="Add presenters…"
            className={`${FIELD} mb-3`}
          />
          <div className="mb-3 flex flex-wrap gap-2.5">
            <div className="min-w-[180px] flex-1">
              <label htmlFor="np-track" className={LABEL}>
                Track
              </label>
              <select
                id="np-track"
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className={FIELD}
              >
                {PORTAL_TRACKS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[160px] flex-1">
              <label htmlFor="np-format" className={LABEL}>
                Format
              </label>
              <select
                id="np-format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className={FIELD}
              >
                {PORTAL_FORMATS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          <label htmlFor="np-abstract" className={LABEL}>
            Abstract
          </label>
          <textarea
            id="np-abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Your abstract…"
            className={`${FIELD} mb-3 min-h-[72px] resize-y`}
          />
          <label htmlFor="np-files" className={LABEL}>
            Upload files
          </label>
          <input
            id="np-files"
            ref={fileInput}
            type="file"
            multiple
            onChange={(e) => {
              const files = e.currentTarget.files;
              setFileNames(
                files ? Array.from(files).map((f) => f.name) : [],
              );
            }}
            className="mb-1 w-full text-sm text-[#b3a48c]"
          />
          <p className="mb-3.5 text-[13px] text-[#a0907a]">
            {fileNames.length
              ? `${fileNames.length} file(s): ${fileNames.join(", ")} (demo)`
              : ""}
          </p>
          <button
            type="button"
            onClick={addTalk}
            className="cursor-pointer rounded-[10px] border-0 bg-teal px-[18px] py-[11px] text-[15px] font-extrabold text-[#19130d]"
          >
            + Add talk to programme
          </button>

          <div className="mt-4">
            {talks.length === 0 ? (
              <p className="py-1.5 text-sm text-[#a0907a]">
                No talks added yet — add your first above.
              </p>
            ) : (
              <>
                <p className="mt-4 mb-2 text-xs font-bold tracking-[1px] text-[#a0907a] uppercase">
                  Your programme ({talks.length})
                </p>
                <ul className="list-none">
                  {talks.map((talk, i) => (
                    <li
                      key={`${talk.title}-${i}`}
                      className="mb-1.5 flex justify-between gap-2.5 rounded-[10px] border border-white/[0.08] bg-[#2a2218] px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {talk.title || "Untitled talk"}
                        </p>
                        <p className="text-[13px] text-[#b3a48c]">
                          {talk.track} · {talk.format}
                          {talk.presenter ? ` · ${talk.presenter}` : ""}
                          {talk.files ? ` · ${talk.files} file(s)` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${talk.title || "untitled talk"} from the programme`}
                        onClick={() => onRemoveTalk(i)}
                        className="cursor-pointer border-0 bg-transparent text-xl leading-none text-[#a0907a]"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <p className="mt-[18px] border-t border-white/[0.08] pt-3.5 text-[13px] leading-relaxed text-[#a0907a]">
            Concept preview — nothing is stored and files aren&rsquo;t
            uploaded. The real Portal opens to founding institutions in 2027.{" "}
            <a
              href="#ntlsn-coming2028"
              onClick={onClose}
              className="text-teal"
            >
              Register {uni ? `${uni}’s` : "your"} interest →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
