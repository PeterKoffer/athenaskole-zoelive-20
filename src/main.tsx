
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

// Import auth provider
import { AuthProvider } from "@/hooks/useAuth";

// Import simple pages for the working app
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import SimpleStealthTest from "./pages/SimpleStealthTest";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";
import AuthPage from "./pages/AuthPage";


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

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/stealth-assessment-test" element={<StealthAssessmentTest />} />
              <Route path="/simple-stealth-test" element={<SimpleStealthTest />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
            
            <Toaster />
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
