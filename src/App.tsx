
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./components/theme-provider";
import ProfileServiceTest from "./components/ProfileServiceTest";
import ProfileDebugButton from "./components/ProfileDebugButton";
import DailyUniversePage from "./pages/DailyUniversePage";
import { crossOriginHandler, debugCrossOriginIssues } from "./utils/CrossOriginHandler";
import { RequireAuth } from "./components/AuthHandler";

const queryClient = new QueryClient();

// Initialize cross-origin handler and debug utilities in development
if (import.meta.env.DEV) {
  console.log('🔧 Development mode: Cross-origin handler initialized');
  debugCrossOriginIssues();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              {/* Debug tools in top right */}
              <div className="fixed top-4 right-4 z-50 flex gap-2">
                <ProfileDebugButton />
              </div>


              {/* Main content */}
              <div className="container mx-auto p-4">
                <Routes>
                  {navItems.map(({ to, page }) => (
                    <Route key={to} path={to} element={<RequireAuth>{page}</RequireAuth>} />
                  ))}
                  <Route path="/universe" element={<RequireAuth><DailyUniversePage /></RequireAuth>} />
                  <Route path="/universe/*" element={<RequireAuth><DailyUniversePage /></RequireAuth>} />
                  <Route path="/curriculum/:subject" element={<RequireAuth><DailyUniversePage /></RequireAuth>} />
                  <Route path="/curriculum/:subject/:grade" element={<RequireAuth><DailyUniversePage /></RequireAuth>} />
                  <Route path="/curriculum/:subject/:grade/:topic" element={<RequireAuth><DailyUniversePage /></RequireAuth>} />
                  {/* Catch-all route */}
                  <Route path="*" element={<RequireAuth><DailyUniversePage /></RequireAuth>} />
                </Routes>

                {/* Test component for profile service */}
                <div className="mt-8">
                  <ProfileServiceTest />
                </div>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
