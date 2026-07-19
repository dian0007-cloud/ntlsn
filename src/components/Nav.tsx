import { useRef, useState } from "react";
import MegaMenu from "./MegaMenu";

/**
 * Sticky top nav — production parity (PR-F). In production the bundle's row
 * of topnav links is hidden outright (`.ntlsn-topnav{display:none!important}`,
 * the ntlsn-doors-flash style) and the REAL navigation is the injected
 * megamenu button (ntlsn-megamenu-script) plus the "Explore NTLSN" static-nav
 * block (owned by Footer). So the bar is: brand → GitHub link → menu button,
 * and the menu button opens the full-screen megamenu on desktop and mobile
 * alike, exactly as the patch did. The five inline anchor links the interim
 * shell carried are gone — they had no production equivalent.
 *
 * Focus management: the trigger records itself and takes focus back when the
 * dialog closes (MegaMenu traps focus + closes on Escape).
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-white/5 bg-navy/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a
          href="#hero"
          className="group flex items-center gap-2 rounded-lg px-1"
          aria-label="NTLSN.com — back to top"
        >
          <span className="font-brand text-xl font-bold tracking-tight text-white">
            NTLSN<span className="text-teal">.com</span>
          </span>
          <span
            aria-hidden="true"
            className="mt-1 inline-block h-2 w-2 rounded-full bg-teal transition-shadow group-hover:shadow-[0_0_10px_rgba(143, 176, 129,0.65)]"
          />
        </a>
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/dian0007-cloud/ntlsn"
            rel="noopener noreferrer"
            aria-label="NTLSN on GitHub"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white sm:px-3 sm:text-sm"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-6 w-6 text-white/70"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {open && <MegaMenu onClose={close} />}
    </nav>
  );
}
