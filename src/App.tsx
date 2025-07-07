
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdaptiveIntegrationTest from "./pages/AdaptiveIntegrationTest";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";
import TestPage from "./pages/TestPage";
import SimpleStealthTest from "./pages/SimpleStealthTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/adaptive-integration-test" element={<AdaptiveIntegrationTest />} />
          <Route path="/stealth-assessment-test" element={<SimpleStealthTest />} />
          <Route path="/stealth-assessment-test-full" element={<StealthAssessmentTest />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
