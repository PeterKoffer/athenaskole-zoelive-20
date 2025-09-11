#!/usr/bin/env bash
set -euo pipefail

git fetch origin main

OUT="docs/__MAIN_SNAPSHOT.md"
DATE_UTC="$(date -u +'%Y-%m-%d %H:%M UTC')"

echo "# Main snapshot ($DATE_UTC)" > "$OUT"
echo "" >> "$OUT"
echo "> Kilde: origin/main — disse sektioner er det jeg læser først hver dag." >> "$OUT"

while IFS= read -r PATHSPEC; do
  # spring tomme linjer/kommentarer over
  [[ -z "${PATHSPEC// }" ]] && continue
  [[ "$PATHSPEC" =~ ^# ]] && continue

  {
    echo ""
    echo "---"
    echo ""
    echo "## $PATHSPEC"
    echo ""
  } >> "$OUT"

  if git show "origin/main:$PATHSPEC" > /dev/null 2>&1; then
    git show "origin/main:$PATHSPEC" >> "$OUT"
  else
    echo "_(ikke fundet i origin/main)_" >> "$OUT"
  fi
done < docs/READLIST_MAIN.txt

echo ""
echo "Wrote $OUT"
