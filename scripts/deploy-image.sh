#!/usr/bin/env bash
set -euo pipefail

PROJECT=yphkfkpfdpdmllotpqua
SUPABASE_URL="https://${PROJECT}.supabase.co"

# 1) sanity: ANON must be 209 chars (ish)
if [ -z "${ANON:-}" ]; then
  echo "Set ANON=your_anon_jwt first." >&2; exit 1
fi
c=$(printf '%s' "$ANON" | wc -c | tr -d ' ')
echo "ANON length: $c"

# 2) deploy just the image funcs
supabase functions deploy image-ensure image-service --project-ref "$PROJECT"

# 3) smoke test (same payload your UI uses)
echo "Hitting /image-ensure (proxy -> image-service)…"
curl -sS -X POST "$SUPABASE_URL/functions/v1/image-ensure" \
  -H "content-type: application/json" \
  -H "apikey: $ANON" \
  -H "authorization: Bearer $ANON" \
  -d '{"universeId":"universe-fallback","gradeInt":8,"title":"Today'\''s Program","width":1216,"height":640}' \
  | jq .