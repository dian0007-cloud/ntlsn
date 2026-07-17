/**
 * Footer — brand, tiered licence line (LICENSE at repo root: MIT code ·
 * CC BY data · CC BY-NC-SA content) and GitHub link.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <p className="font-brand text-lg font-bold text-white">
          NTLSN<span className="text-teal">.com</span>
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-white/50">
          Built in the open — for the whole sector.
        </p>
        <p className="text-xs text-white/40">
          <a
            href="/LICENSE"
            className="underline decoration-white/20 underline-offset-2 hover:text-white/70"
          >
            MIT code · CC BY data · CC BY-NC-SA content
          </a>
        </p>
        <p className="text-xs text-white/40">
          <a
            href="https://github.com/dian0007-cloud/ntlsn"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-2 hover:text-white/70"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
