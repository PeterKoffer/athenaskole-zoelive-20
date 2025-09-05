// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/hooks/useAuth";
// If you already have this component, keep it. If not, we’ll add it later.
import ProtectedRoute from "@/components/ProtectedRoute";

// PAGES that actually exist in your repo right now:
import Landing from "@/features/shell/pages/Landing";
import Auth from "@/features/auth/pages/Auth";

// ⚠️ NOTE:
// I’m keeping the routing minimal to avoid “file not found” errors.
// We can add TrainingGround, Dashboards, etc. once those files are in place.

const App = () => {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home / Landing */}
            <Route path="/" element={<Landing />} />

            {/* Auth (no guard so you can reach it even when logged out) */}
            <Route path="/auth" element={<Auth />} />

            {/* Example of a guarded route (uncomment when the page exists) */}
            {/*
            <Route
              path="/training-ground"
              element={
                <ProtectedRoute>
                  <TrainingGround />
                </ProtectedRoute>
              }
            />
            */}

            {/* Fallback: unknown routes go home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
};

export default App;
