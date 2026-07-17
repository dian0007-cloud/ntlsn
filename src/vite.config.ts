import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Data-wiring choice (documented per TASKS.md 1.1 brief):
 * the canonical data layer lives one level up (../data/*.json — see CLAUDE.md,
 * "single source of truth"). We import it directly rather than copying, so the
 * rebuild can never drift from data/*.json. The Vite dev server denies reads
 * outside the project root by default, so we widen server.fs.allow to the repo
 * root. `vite build` inlines the JSON into the bundle, so production output is
 * self-contained and needs no fs access.
 */
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
