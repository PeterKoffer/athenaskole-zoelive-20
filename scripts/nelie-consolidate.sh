#!/usr/bin/env bash
set -euo pipefail

echo "→ NELIE konsolidering (UI -> components/NELIE, logic -> services/nelie)"

sed_inplace() {
  if [[ "$(uname)" == "Darwin" ]]; then sed -i '' "$@"; else sed -i "$@"; fi
}
mv_if() {
  local src="$1"; local dst="$2"
  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dst")"
    echo "  mv $src -> $dst"
    git mv "$src" "$dst"
  else
    echo "  (skip) $src findes ikke"
  fi
}

mkdir -p src/components/NELIE src/services/nelie

# UI-filer (flyt det der findes)
mv_if src/components/NELIE.tsx                               src/components/NELIE/NELIE.tsx
mv_if src/components/RefactoredFloatingAITutor.tsx           src/components/NELIE/RefactoredFloatingAITutor.tsx
mv_if src/components/NELIELauncher.tsx                       src/components/NELIE/LauncherButton.tsx
mv_if src/components/SingleNELIE.tsx                         src/components/NELIE/SingleNELIE.tsx
mv_if src/components/home/NELIELauncher.tsx                  src/components/NELIE/LauncherButton.tsx

# Logic-filer
mv_if src/services/NELIESessionGenerator.ts                  src/services/nelie/NELIESessionGenerator.ts
mv_if src/components/education/components/utils/NELIESessionGenerator.ts src/services/nelie/NELIESessionGenerator.alt.ts

# Barrel-exports
cat > src/components/NELIE/index.ts <<'TS'
export { default as NELIE } from "./NELIE";
export { default as SingleNELIE } from "./SingleNELIE";
export { default as LauncherButton } from "./LauncherButton";
TS

cat > src/services/nelie/index.ts <<'TS'
export * from "./NELIESessionGenerator";
TS

# Robust SingleNELIE hvis den mangler
if [[ ! -f src/components/NELIE/SingleNELIE.tsx ]]; then
  cat > src/components/NELIE/SingleNELIE.tsx <<'TSX'
import { useEffect, useRef, useState } from "react";
import NELIE from "./NELIE";
let mounted = false;
export default function SingleNELIE() {
  const alive = useRef(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!mounted) { mounted = true; alive.current = true; setShow(true);
      return () => { alive.current = false; mounted = false; }; }
  }, []);
  if (!show || !alive.current) return null;
  return <NELIE />;
}
TSX
fi

echo "→ Opdaterer imports i hele src…"
while IFS= read -r -d '' f; do
  sed_inplace -E \
    -e 's#@/components/NELIE\.tsx#@/components/NELIE#g' \
    -e 's#@/components/NELIELauncher#@/components/NELIE#' \
    -e 's#@/components/RefactoredFloatingAITutor#@/components/NELIE#' \
    -e 's#@/components/SingleNELIE#@/components/NELIE#' \
    -e 's#@/services/NELIESessionGenerator#@/services/nelie#g' \
    -e 's#@/components/education/components/utils/NELIESessionGenerator#@/services/nelie#g' \
    "$f"
done < <(find src -type f \( -name '*.ts' -o -name '*.tsx' \) -print0)

# Gør App.tsx til eneste mount
if [[ -f src/App.tsx ]]; then
  sed_inplace -E '/import[[:space:]]+RefactoredFloatingAITutor[[:space:]]+from/d' src/App.tsx
  sed_inplace -E '/<RefactoredFloatingAITutor[[:space:]]*\/>/d' src/App.tsx
  sed_inplace -E 's#^import[[:space:]]+NELIE[[:space:]]+from[[:space:]]+"@/components/NELIE";#import { SingleNELIE } from "@/components/NELIE";#' src/App.tsx || true
  sed_inplace -E 's#<NELIE[[:space:]]*/>#<SingleNELIE />#' src/App.tsx || true
  if ! grep -q 'SingleNELIE' src/App.tsx; then
    sed_inplace -E '1,40{s#^import[^\n]*$#&\nimport { SingleNELIE } from "@/components/NELIE";#;b};$a\
import { SingleNELIE } from "@/components/NELIE";' src/App.tsx
  fi
fi

echo "✅ Konsolidering færdig."
