#!/usr/bin/env bash
# scripts/build-src.sh — TASKS.md §1.3 cutover build (strangler-fig).
#
# Netlify publishes the repo root (netlify.toml publish="."). Today the homepage
# entry (index.html + /assets/*) is the legacy single-file React bundle, while the
# maintainable rebuild lives in /src (Vite + React 19 + TypeScript + Tailwind).
#
# This script compiles /src and places its output at the repo root so the PUBLISHED
# homepage IS the rebuild — while every legacy standalone page, feed, data endpoint,
# and Netlify Function keeps serving untouched from root. The legacy homepage is
# preserved as /legacy.html for a 30-day rollback (TASKS.md §1.3).
#
# Nothing else moves:
#   - _headers CSP already allows script-src 'self', so the new hashed
#     /assets/<hash>.js loads without a policy change.
#   - _redirects is untouched: the rebuild is a single homepage (hash anchors,
#     no client-side router), so the multi-page static + real-404s architecture
#     stays exactly as-is (do NOT re-introduce a /* -> /index.html 200 fallback).
#   - There is no sw.js in the repo (CLAUDE.md's service-worker note is stale),
#     so the §1.3 "bump sw.js cache name" step is N/A.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[1.3] preserving legacy homepage as /legacy.html (rollback)"
cp index.html legacy.html

echo "[1.3] building the /src rebuild (tsc --noEmit && vite build)"
cd src
npm ci
npm run build

echo "[1.3] placing SPA output at repo root (strangler-fig)"
cp dist/index.html "$ROOT/index.html"
mkdir -p "$ROOT/assets"
# Merge hashed bundles into root /assets. The legacy app.<hash>.js is retained so
# /legacy.html keeps working as a rollback target.
cp -r dist/assets/. "$ROOT/assets/"

echo "[1.3] cutover build complete — root now serves the rebuild; legacy at /legacy.html"
ls -la "$ROOT/index.html" "$ROOT/legacy.html"
echo "[1.3] homepage bundle(s):"
ls -la "$ROOT"/assets/*.js
