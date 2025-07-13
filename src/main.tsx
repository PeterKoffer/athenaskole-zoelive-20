import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { navItems } from "./nav-items";
import stealthAssessmentService from "@/services/stealthAssessment/StealthAssessmentService";
import { mockProfileService } from "@/services/learnerProfile/MockProfileService";
import { SupabaseProfileService } from "@/services/learnerProfile/SupabaseProfileService";
import ProfileDebugButton from "./components/ProfileDebugButton";
import DailyUniversePage from "./pages/DailyUniversePage";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

if (import.meta.env.DEV) {
  const supabaseProfileService = new SupabaseProfileService();
  (window as any).stealthAssessmentService = stealthAssessmentService;
  (window as any).mockProfileService = mockProfileService;
  (window as any).supabaseProfileService = supabaseProfileService;
  
  console.log('🔧 Development mode: Services exposed to window object');
  console.log('📋 Available debug services:');
  console.log('  - window.stealthAssessmentService');
  console.log('  - window.mockProfileService');
  console.log('  - window.supabaseProfileService');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <div className="min-h-screen bg-background">
                  <div className="fixed top-4 right-4 z-50 flex gap-2">
                    <ProfileDebugButton />
                  </div>
                  <div className="container mx-auto p-4">
                    <Routes>
                      {navItems.map(({ to, page }) => (
                        <Route key={to} path={to} element={page} />
                      ))}
                      <Route path="/universe" element={<DailyUniversePage />} />
                      <Route path="/universe/*" element={<DailyUniversePage />} />
                      <Route path="/curriculum/:subject" element={<DailyUniversePage />} />
                      <Route path="/curriculum/:subject/:grade" element={<DailyUniversePage />} />
                      <Route path="/curriculum/:subject/:grade/:topic" element={<DailyUniversePage />} />
                    </Routes>
                  </div>
                </div>
                <Toaster />
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
