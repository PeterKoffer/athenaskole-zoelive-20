
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

// Import auth provider from the correct location
import { AuthProvider } from "@/hooks/useAuth";

// Import services for debugging
import stealthAssessmentService from "@/services/stealthAssessment/StealthAssessmentService";
import { mockProfileService } from "@/services/learnerProfile/MockProfileService";
import { SupabaseProfileService } from "@/services/learnerProfile/SupabaseProfileService";

// Import simple pages for the working app
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import SimpleStealthTest from "./pages/SimpleStealthTest";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";
import AuthPage from "./pages/AuthPage";
import EducationalSimulatorPage from "./pages/EducationalSimulatorPage";
import DailyUniversePage from "./pages/DailyUniversePage";
import SimulatorPage from "./pages/SimulatorPage";

// Import other components
import ErrorBoundary from "./components/ErrorBoundary";

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

// Expose services to window object for debugging in development mode
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
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/universe" element={<DailyUniversePage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/stealth-assessment-test" element={<StealthAssessmentTest />} />
              <Route path="/simple-stealth-test" element={<SimpleStealthTest />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/educational-simulator" element={<EducationalSimulatorPage />} />
            </Routes>
            
            <Toaster />
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
