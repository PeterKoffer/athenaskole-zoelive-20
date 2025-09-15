#!/usr/bin/env bash
set -euo pipefail

BRANCH_ARG="${1:-}"
OUT="docs/__CONTEXT_SNAPSHOT.md"

# Find aktiv branch hvis ikke angivet
current_branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'UNKNOWN')"
branch="${BRANCH_ARG:-$current_branch}"

mkdir -p docs

ts() { date +"%Y-%m-%d %H:%M:%S"; }
hr() { printf '\n---\n\n'; }

section() {
  echo -e "\n## $1\n"
}

snippet() {
  # snippet <file> <pattern> [context]
  local file="$1"; shift
  local pat="$1"; shift
  local ctx="${1:-2}"
  if [[ -f "$file" ]]; then
    echo -e "\n**$file** (around \"$pat\"):\n"
    # macOS-compatible grep/awk:
    awk -v pat="$pat" -v ctx="$ctx" '
      { lines[NR]=$0 }
      $0~pat { for(i=NR-ctx;i<=NR+ctx;i++){ if(i>0&&lines[i]!=""){ printf("%6d  %s\n", i, lines[i]) } } print "" }
    ' "$file" || true
  fi
}

echo "# Repo Context Snapshot" > "$OUT"
echo "_Generated: $(ts)_  |  _Branch: \`$branch\`_" >> "$OUT"
hr >> "$OUT"

{
  section "Git status"
  echo '```bash'
  git branch --show-current || true
  echo
  git --no-pager log -n 3 --oneline || true
  echo '```'

  section "Vite + TS/aliases (vite.config.ts, tsconfig.json)"
  echo '```ts'
  sed -n '1,220p' vite.config.ts 2>/dev/null || true
  echo
  echo "--- tsconfig.json ---"
  sed -n '1,220p' tsconfig.json 2>/dev/null || true
  echo '```'

  section "Routes (src/App.tsx)"
  echo '```tsx'
  sed -n '1,220p' src/App.tsx 2>/dev/null || true
  echo '```'

  section "Supabase client og env"
  echo '```bash'
  git grep -nF 'createClient(' -- src || true
  echo
  ls -la .env* 2>/dev/null || true
  echo '```'
  snippet "src/lib/supabaseClient.ts" "createClient" 4
  snippet "supabase/functions/ai-stream/index.ts" "createClient" 4

  section "NELIE – komponenter og mounts"
  echo '```bash'
  # list alle relevante filer
  git ls-files | grep -i -E 'NELIE|RefactoredFloatingAITutor|floating' || true
  echo
  echo "— Mounts —"
  git grep -nF '<NELIE' -- src || true
  git grep -nF 'SingleNELIE' -- src || true
  echo '```'
  snippet "src/components/SingleNELIE.tsx" "NELIE" 5
  snippet "src/components/NELIE/NELIE.tsx" "FloatingNELIE" 5
  snippet "src/components/NELIE/floating/RefactoredFloatingAITutor.tsx" "export default function" 8

  section "NELIE – services (parkeret fra main som *.main.ts)"
  echo '```bash'
  git ls-files | grep -i -E 'services/nelie|NELIEEngine\.main|NELIESessionGenerator\.main|NELIESubjects\.main' || true
  echo '```'

  section "CSS / index.css (NELIE styles nederst)"
  echo '```css'
  sed -n '1,260p' src/index.css 2>/dev/null || true
  echo '```'

  section "Andre nøglefiler (auth, daily program, training)"
  echo '```tsx'
  echo "--- src/hooks/useAuth.tsx ---"
  sed -n '1,180p' src/hooks/useAuth.tsx 2>/dev/null || true
  echo
  echo "--- src/features/daily-program/pages/DailyProgramPage.tsx ---"
  sed -n '1,220p' src/features/daily-program/pages/DailyProgramPage.tsx 2>/dev/null || true
  echo '```'
} >> "$OUT"

echo "✅ Wrote $OUT"
