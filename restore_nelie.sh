#!/usr/bin/env bash
set -euo pipefail

COMMIT="${1:?Pass the commit SHA as arg 1}"
VOICE_ID="${2:?Pass your ElevenLabs voiceId as arg 2}"

branch="nelie-restore-$COMMIT"
echo "▶️  Creating branch $branch"
git checkout -b "$branch"

echo "▶️  Listing files in commit to hunt NELIE assets & tutor code..."
FILES=$(git ls-tree -r --name-only "$COMMIT")

# Try to detect likely candidates
NELIE_PNG=$(echo "$FILES" | grep -E '^public/.*/?nelie\.png$|^public/nelie\.png$' || true)
TUTOR_FILE=$(echo "$FILES" | grep -E 'RefactoredFloatingAITutor\.tsx$' || true)
UNIFIED_SPEECH=$(echo "$FILES" | grep -E 'useUnifiedSpeech\.ts(x)?$' || true)

echo "Found:"
echo "  nelie.png:              ${NELIE_PNG:-<not found>}"
echo "  RefactoredFloatingAITutor.tsx: ${TUTOR_FILE:-<not found>}"
echo "  useUnifiedSpeech:       ${UNIFIED_SPEECH:-<not found>}"

# Helper to safely write files from commit
restore_file () {
  local path="$1"
  if [ -z "$path" ]; then return 0; fi
  mkdir -p "$(dirname "$path")"
  git show "$COMMIT:$path" > "$path"
  echo "✅ restored $path"
}

# 1) Restore files
restore_file "$NELIE_PNG"
restore_file "$TUTOR_FILE"
restore_file "$UNIFIED_SPEECH"

# 2) Ensure nelie.png is at public/nelie.png (if it came from another folder)
if [ -n "$NELIE_PNG" ] && [ "$NELIE_PNG" != "public/nelie.png" ]; then
  mkdir -p public
  cp "$NELIE_PNG" public/nelie.png
  git rm -f "$NELIE_PNG" || true
  echo "✅ moved $NELIE_PNG -> public/nelie.png"
fi

# 3) Lock files (.gitattributes + pre-commit)
echo "▶️  Adding .gitattributes lock"
grep -q "public/nelie.png" .gitattributes 2>/dev/null || echo "public/nelie.png -diff -merge" >> .gitattributes

HOOK_DIR=".git/hooks"
mkdir -p "$HOOK_DIR"
cat > "$HOOK_DIR/pre-commit" <<'HOOK'
#!/usr/bin/env bash
set -e
if git diff --cached --name-only | grep -q "^public/nelie.png$"; then
  echo "❌ public/nelie.png er låst. Ændr den kun med Kofoeds godkendelse."
  exit 1
fi
HOOK
chmod +x "$HOOK_DIR/pre-commit"

# 4) Create nelie.lock.ts + nelie.guard.ts
mkdir -p src
HASH=$( (sha256sum public/nelie.png 2>/dev/null || shasum -a 256 public/nelie.png) | awk '{print $1}' )

cat > src/nelie.lock.ts <<LOCK
export const NELIE_LOCK = {
  voiceId: "${VOICE_ID}",
  imageSha256: "${HASH}",
} as const;
LOCK

cat > src/nelie.guard.ts <<'GUARD'
import fs from "fs";
import crypto from "crypto";
import { NELIE_LOCK } from "./nelie.lock";

function sha256(path: string) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

export function assertNELIELocked() {
  if (process.env.NODE_ENV === "test") return; // let tests run faster
  const img = "public/nelie.png";
  if (!fs.existsSync(img)) throw new Error("❌ NELIE: public/nelie.png mangler!");
  const h = sha256(img);
  if (h !== NELIE_LOCK.imageSha256) {
    throw new Error("❌ NELIE-billedet er ændret! Stopper build.");
  }
}
GUARD

# 5) Wire guard ind et sted tidligt (Next.js: next.config.mjs/ts eller en entry; Vite/CRA: main.tsx)
# Vi prøver at injecte i src/main.tsx hvis den findes:
MAIN_FILE=""
for f in src/main.tsx src/main.ts src/index.tsx src/index.ts; do
  [ -f "$f" ] && MAIN_FILE="$f" && break
done

if [ -n "$MAIN_FILE" ]; then
  if ! grep -q "assertNELIELocked" "$MAIN_FILE"; then
    sed -i.bak '1s;^;import { assertNELIELocked } from "./nelie.guard";\nassertNELIELocked();\n;' "$MAIN_FILE" 2>/dev/null || \
    gsed -i '1i import { assertNELIELocked } from "./nelie.guard";\nassertNELIELocked();' "$MAIN_FILE"
    echo "✅ injected nelie.guard in $MAIN_FILE"
  fi
else
  echo "⚠️  Could not auto-inject nelie.guard – add it manually in your earliest entry point."
fi

# 6) Ensure tutor is rendered once globally (simple patch try)
# We try a common file name – adjust if not present.
HOME_FILE=""
for f in src/components/home/HomeMainContent.tsx src/pages/index.tsx src/pages/Index.tsx; do
  [ -f "$f" ] && HOME_FILE="$f" && break
done

if [ -n "$HOME_FILE" ]; then
  # Try to import & render once
  if ! grep -q "RefactoredFloatingAITutor" "$HOME_FILE"; then
    sed -i.bak '1s;^;import RefactoredFloatingAITutor from "@/components/RefactoredFloatingAITutor";\n;' "$HOME_FILE" 2>/dev/null || \
    gsed -i '1i import RefactoredFloatingAITutor from "@/components/RefactoredFloatingAITutor"' "$HOME_FILE"
    # naive inject before last export default return end
    perl -0777 -i -pe 's/(return\s*\([^]*)(\)\s*;?\s*\}\s*$)/$1\n  <RefactoredFloatingAITutor \/>\n$2/s' "$HOME_FILE" || true
    echo "✅ injected RefactoredFloatingAITutor in $HOME_FILE"
  fi
else
  echo "⚠️  Could not auto-add RefactoredFloatingAITutor to a root component – add it manually."
fi

# 7) Remove every other robot component (best-effort)
echo "▶️  Removing other robot components (best-effort)"
TO_REMOVE=$(rg -l "RobotAvatar|NELIEAvatar|FloatingAITutor|🤖" src 2>/dev/null | grep -v "RefactoredFloatingAITutor" || true)
if [ -n "$TO_REMOVE" ]; then
  echo "$TO_REMOVE" | xargs -I {} git rm -f {}
fi

# 8) Commit & done
git add .
git commit -m "Restore NELIE from $COMMIT, lock asset + voice, remove other robots"
echo "✅ Done. Now run your app and verify the RIGHT NELIE is back."
echo "👉 If OK, push & protect:  git push origin $branch"