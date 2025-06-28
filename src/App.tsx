
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

import Index from "./pages/Index";
import GameHub from "./pages/GameHub";
import LanguageLearning from "./pages/LanguageLearning";
import ProgressDashboard from "./pages/ProgressDashboard";
import AdaptivePracticeTestPage from "./pages/AdaptivePracticeTestPage";

const queryClient = new QueryClient();

const App = () => {
  console.log('🚀 App component rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/games" element={<GameHub />} />
                <Route path="/language-learning" element={<LanguageLearning />} />
                <Route path="/progress" element={<ProgressDashboard />} />
                <Route path="/adaptive-practice-test" element={<AdaptivePracticeTestPage />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
