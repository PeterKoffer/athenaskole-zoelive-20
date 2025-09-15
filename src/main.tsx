// DEV ONLY: Suppress random TTS cancel() while we test NELIE
(function () {
  try {
    const s = window.speechSynthesis as any;
    if (s && !s.__NELIE_PATCHED__) {
      const orig = s.cancel.bind(s);
      s.__NELIE_PATCHED__ = true;
      s.__NELIE_ORIG_CANCEL__ = orig;
      (window as any).__NELIE_ALLOW_CANCEL__ = false;
      s.cancel = function () {
        if ((window as any).__NELIE_ALLOW_CANCEL__) return orig();
        console.warn("[NELIE] cancel() suppressed");
        return;
      };
      // Nudge audio/autoplay
      try { s.resume(); } catch {}
    }
  } catch {}
})();
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Antager at AuthProvider eksporteres fra hooks/useAuth.tsx
import { AuthProvider } from "@/hooks/useAuth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
