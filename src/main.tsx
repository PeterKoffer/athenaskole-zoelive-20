
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./hooks/useAuth";
import App from "./App";
import stealthAssessmentService from "@/services/stealthAssessment/StealthAssessmentService";
import { mockProfileService } from "@/services/learnerProfile/MockProfileService";
import { SupabaseProfileService } from "@/services/learnerProfile/SupabaseProfileService";
import ErrorBoundary from "./components/ErrorBoundary";
import JulesIntegration from "./components/JulesIntegration";
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
            <ErrorBoundary>
              <div className="min-h-screen bg-background">
                <JulesIntegration />
                <App />
              </div>
              <Toaster />
            </ErrorBoundary>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
