#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 1 ]]; then
  echo "Brug: $0 <fil1> [fil2 ...]"; exit 1;
fi
for f in "$@"; do
  if git cat-file -e origin/main:"$f" 2>/dev/null; then
    mkdir -p "$(dirname "$f")"
    git checkout origin/main -- "$f"
    echo "ported: $f"
  else
    echo "skip (findes ikke på origin/main): $f"
  fi
done
echo "→ Sanity: createClient("
git grep -nF 'createClient(' -- src || true
echo "→ Sanity: NELIE mounts"
git grep -nF '<NELIE' -- src || true
