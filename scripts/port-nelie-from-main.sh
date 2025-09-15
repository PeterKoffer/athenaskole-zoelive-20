#!/usr/bin/env bash
set -euo pipefail

echo "→ Ensure on New-core-map"; git branch --show-current

# Create target dirs
mkdir -p src/components/NELIE/{floating,legacy,shared}
mkdir -p src/services/nelie
mkdir -p src/types/nelie

# 1) Image
git checkout origin/main -- public/nelie.png || true

# 2) UI components from main
for p in \
  src/components/NELIE.tsx \
  src/components/RefactoredFloatingAITutor.tsx \
  src/components/daily-program/NeliesTips.tsx \
  src/components/education/components/EnhancedNELIELessonManager.tsx \
  src/components/education/components/NelieAvatarSection.tsx \
  src/components/education/components/NelieIntroduction.tsx \
  src/components/education/components/shared/AskNelieButtons.tsx
do
  git checkout origin/main -- "$p" || true
done

# Stage under new structure (don’t break current SingleNELIE)
test -f src/components/NELIE.tsx && \
  mkdir -p src/components/NELIE && \
  git rm -f --cached src/components/NELIE.tsx || true

if test -f src/components/RefactoredFloatingAITutor.tsx; then
  mkdir -p src/components/NELIE/floating
  git mv -k src/components/RefactoredFloatingAITutor.tsx src/components/NELIE/floating/RefactoredFloatingAITutor.tsx || true
fi

# 3) Services (park as *.main.ts so they’re present but inactive)
for p in \
  src/services/NELIEEngine.ts \
  src/services/NELIESessionGenerator.ts
do
  if git checkout origin/main -- "$p"; then
    base="$(basename "$p" .ts)"
    mkdir -p src/services/nelie
    git mv -k "$p" "src/services/nelie/${base}.main.ts" || mv "$p" "src/services/nelie/${base}.main.ts"
  fi
done

# 4) Types
if git checkout origin/main -- src/types/curriculum/NELIESubjects.ts; then
  mkdir -p src/types/nelie
  git mv -k src/types/curriculum/NELIESubjects.ts src/types/nelie/NELIESubjects.main.ts || mv src/types/curriculum/NELIESubjects.ts src/types/nelie/NELIESubjects.main.ts
fi

# 5) Minimal NELIE index (keeps your app imports stable)
cat > src/components/NELIE/NELIE.tsx <<'TSX'
// src/components/NELIE/NELIE.tsx
import React from "react";
import FloatingNELIE from "./floating/RefactoredFloatingAITutor";
export default function NELIE(){ return <FloatingNELIE />; }
TSX

# 6) Barrel for components if missing
cat > src/components/NELIE/index.ts <<'TS'
export { default as NELIE } from "./NELIE";
export { default as FloatingNELIE } from "./floating/RefactoredFloatingAITutor";
TS

# 7) Safety scans
echo "→ Sanity scan: createClient("
git grep -nF 'createClient(' -- src || true
echo "→ Sanity scan: multiple NELIE mounts"
git grep -nF '<NELIE' -- src || true

echo "✅ Port complete (UI + logic parked as *.main.ts). Commit next."
