#!/usr/bin/env bash
# Creates docs/__CONTEXT_SNAPSHOT.md with tree, greps and key files.
set -euo pipefail

BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}
OUT="docs/__CONTEXT_SNAPSHOT.md"
TMP="$(mktemp -d)"

echo "➜ Snapshotting branch: $BRANCH"
git fetch --all --quiet

# List files
if git rev-parse --verify "origin/$BRANCH" >/dev/null 2>&1; then
  git ls-tree -r --name-only "origin/$BRANCH" | sort > "$TMP/all.txt"
else
  git ls-tree -r --name-only "$BRANCH" | sort > "$TMP/all.txt"
fi
grep -E '^src/' "$TMP/all.txt" > "$TMP/src.txt" || true

# Focused grep
FOCUS_PAT='createClient\(|@supabase/supabase-js|ScenarioRunner|ScenarioPlayer|ContentGenerationService|EnhancedContentGenerationService'
> "$TMP/grep.txt"
while read -r p; do
  case "$p" in
    *.ts|*.tsx|*.js|*.jsx|*.json|*.md)
      if git cat-file -e "$BRANCH:$p" 2>/dev/null; then
        git show "$BRANCH:$p" | grep -nE "$FOCUS_PAT" && echo "--- FILE: $p" >> "$TMP/grep.txt"
      fi
      ;;
  esac
done < "$TMP/src.txt" || true

# Key files to embed fully
KEYS=(
  "src/App.tsx"
  "src/features/daily-program/pages/ScenarioRunner.tsx"
  "src/services/supabaseClient.ts"
  "src/services/contentClient.ts"
  "src/content/index.ts"
  "src/services/ContentGenerationService.ts"
  "src/services/content/ContentGenerationService.ts"
  "vite.config.ts"
  "tsconfig.base.json"
  "tsconfig.json"
)

# Write markdown
{
  echo "# Context Snapshot – $BRANCH"
  echo
  echo "## File tree (src/)"
  echo '```'
  sed 's/^/ - /' "$TMP/src.txt"
  echo '```'
  echo
  echo "## Grep focus (createClient, supabase-js, Scenario*, ContentGenerationService)"
  echo '```'
  sed 's/^/ /' "$TMP/grep.txt"
  echo '```'
  echo
  echo "## Key files"
  for f in "${KEYS[@]}"; do
    if git cat-file -e "$BRANCH:$f" 2>/dev/null; then
      echo
      echo "### $f"
      case "$f" in
        *.tsx) lang="tsx" ;; *.ts) lang="ts" ;; *.json) lang="json" ;; *.md) lang="md" ;; *) lang="txt" ;;
      esac
      echo '```'"$lang"
      git show "$BRANCH:$f"
      echo '```'
    fi
  done
} > "$OUT"

echo "✅ Wrote $OUT"
