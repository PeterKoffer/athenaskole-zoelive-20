
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdaptivePracticeTestPage from "./AdaptivePracticeTestPage";
import LocalizationTestPage from "./pages/LocalizationTestPage";
import DailyProgram from "./pages/DailyProgram";
import LearningPathway from "./pages/LearningPathway";
import GameHub from "./pages/GameHub";
import EducationPage from "./pages/EducationPage";
import SimulationsPage from "./pages/SimulationsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./i18n";

const queryClient = new QueryClient();

function AppContent() {
  usePageTracking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/adaptive-practice-test" element={<AdaptivePracticeTestPage />} />
        <Route path="/localization-test" element={<LocalizationTestPage />} />
        <Route path="/daily-program" element={<ProtectedRoute><DailyProgram /></ProtectedRoute>} />
        <Route path="/learning-pathway" element={<ProtectedRoute><LearningPathway /></ProtectedRoute>} />
        <Route path="/games" element={<GameHub />} />
        <Route path="/education/*" element={<EducationPage />} />
        <Route path="/simulations" element={<SimulationsPage />} />
      </Routes>
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
