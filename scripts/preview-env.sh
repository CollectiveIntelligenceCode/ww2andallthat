#!/usr/bin/env bash
# Adds the Ghost settings and the preview's own address to the Vercel PREVIEW environment.
# Reads values from .env.local (never printed). Run by hand: bash scripts/preview-env.sh
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env.local; set +a

for k in GHOST_URL GHOST_CONTENT_API_KEY GHOST_ADMIN_API_KEY; do
  vercel env add "$k" preview --value "${!k}" --yes
done
vercel env add NEXT_PUBLIC_SITE_URL preview --value "https://ww2-preview-ci.vercel.app" --yes

echo "--- preview env now:"
vercel env ls preview | grep -E "GHOST|SITE_URL" || true
