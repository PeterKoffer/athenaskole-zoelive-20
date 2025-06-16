
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleProvider } from "@/contexts/RoleContext";
import Index from "./pages/Index";
import DailyProgram from "./pages/DailyProgram";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AILearning from "./pages/AILearning";
import GameHub from "./pages/GameHub";
import Admin from "./pages/Admin";
import CommunicationCenter from "./pages/CommunicationCenter";
import Analytics from "./pages/Analytics";
import CalendarPage from "./pages/CalendarPage";
import FloatingAITutor from "./components/FloatingAITutor";
import EnhancedMathematicsLearning from "./components/education/EnhancedMathematicsLearning";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/daily-program" element={<DailyProgram />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/*" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/ai-learning" element={<AILearning />} />
                  <Route path="/games" element={<GameHub />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/communication" element={<CommunicationCenter />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/learn/mathematics" element={<EnhancedMathematicsLearning />} />
                </Routes>
                {/* Floating AI Tutor should appear on all pages except auth */}
                <FloatingAITutor />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
