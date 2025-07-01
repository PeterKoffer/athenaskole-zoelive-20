
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "@/pages/Index";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilePage from "@/pages/ProfilePage";
import ProgressPage from "@/pages/ProgressPage";
import CommunicationPage from "@/pages/CommunicationPage";
import CalendarPage from "@/pages/CalendarPage";
import GameHubPage from "@/pages/GameHubPage";
import AdminPage from "@/pages/AdminPage";
import ParentPage from "@/pages/ParentPage";
import SchoolAdminPage from "@/pages/SchoolAdminPage";
import TeacherPage from "@/pages/TeacherPage";
import StudentPage from "@/pages/StudentPage";
import AIInsightsPage from "@/pages/AIInsightsPage";
import AdaptiveLearningPage from "@/pages/AdaptiveLearningPage";
import AdaptivePracticeTestPage from "@/pages/AdaptivePracticeTestPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import ScenarioPlayerPage from "@/pages/ScenarioPlayerPage";
import FloatingAITutor from "@/components/FloatingAITutor";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
                <Route path="/communication" element={<ProtectedRoute><CommunicationPage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                <Route path="/games" element={<ProtectedRoute><GameHubPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
                <Route path="/parent" element={<ProtectedRoute requiredRole="parent"><ParentPage /></ProtectedRoute>} />
                <Route path="/school-admin" element={<ProtectedRoute requiredRole="school_admin"><SchoolAdminPage /></ProtectedRoute>} />
                <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><TeacherPage /></ProtectedRoute>} />
                <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentPage /></ProtectedRoute>} />
                <Route path="/ai-insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
                <Route path="/adaptive-learning" element={<ProtectedRoute><AdaptiveLearningPage /></ProtectedRoute>} />
                <Route path="/adaptive-practice-test" element={<ProtectedRoute><AdaptivePracticeTestPage /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
                <Route path="/scenario-player" element={<ProtectedRoute><ScenarioPlayerPage /></ProtectedRoute>} />
              </Routes>
              {/* Global FloatingAITutor - visible on all pages */}
              <FloatingAITutor />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
