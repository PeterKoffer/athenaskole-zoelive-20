#!/usr/bin/env bash
# Creates docs/__CONTEXT_SNAPSHOT.md with tree, greps and key files.
set -euo pipefail

BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}
OUT="docs/__CONTEXT_SNAPSHOT.md"
TMP="$(mktemp -d)"

echo "➜ Snapshotting branch: $BRANCH"
git fetch --all --quiet

# List all files (repo-wide) and only in src/
git ls-tree -r --name-only "origin/$BRANCH" | sort > "$TMP/all.txt" || {
  echo "Falling back to local branch (no origin/$BRANCH)"; 
  git ls-tree -r --name-only "$BRANCH" | sort > "$TMP/all.txt";
}
grep -E '^src/' "$TMP/all.txt" > "$TMP/src.txt" || true

# Focused greps
FOCUS_PAT='createClient\\(|@supabase/supabase-js|ScenarioRunner|ScenarioPlayer|ContentGenerationService|EnhancedContentGenerationService'
> "$TMP/grep.txt"
while read -r p; do
  # show only small text files
  case "$p" in
    *.ts|*.tsx|*.js|*.jsx|*.json|*.md) 
      git show "$BRANCH:$p" 2>/dev/null | \
      grep -nE "$FOCUS_PAT" && echo "--- FILE: $p" >> "$TMP/grep.txt"
      ;;
  esac
done < "$TMP/src.txt" || true

# Key files to embed fully if present
KEYS=(
  "src/App.tsx"
  "src/features/daily-program/pages/ScenarioRunner.tsx"
  "src/services/supabaseClient.ts"
  "src/services/contentClient.ts"
  "src/content/index.ts"
  "src/services/ContentGenerationService.ts"
  "src/services/content/ContentGenerationService.ts"
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
      echo '```'$(case "$f" in *.tsx) echo tsx ;; *.ts) echo ts ;; *.json) echo json ;; *.md) echo md ;; *) echo txt ;; esac)
      git show "$BRANCH:$f"
      echo '```'
    fi
  done
} > "$OUT"

echo "✅ Wrote $OUT"
