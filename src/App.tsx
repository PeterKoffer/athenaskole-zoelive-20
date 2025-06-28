
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import SubjectLearningPage from "./pages/SubjectLearningPage";
import AdaptivePracticeTestPage from "./pages/AdaptivePracticeTestPage";
import SimulationsPage from "./pages/SimulationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subject/:subject" element={<SubjectLearningPage />} />
            <Route path="/adaptive-practice-test" element={<AdaptivePracticeTestPage />} />
            <Route path="/simulations" element={<SimulationsPage />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
