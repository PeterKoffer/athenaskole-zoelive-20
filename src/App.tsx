
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubjectLearningPage from "./pages/SubjectLearningPage";
import AdaptivePracticeTestPage from "./pages/AdaptivePracticeTestPage";
import StudentDashboard from "./pages/StudentDashboard";
import ProfileContainer from "./components/profile/ProfileContainer";

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProfileContainer />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/subject/:subject" element={<SubjectLearningPage />} />
            <Route path="/adaptive-practice-test" element={<AdaptivePracticeTestPage />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
