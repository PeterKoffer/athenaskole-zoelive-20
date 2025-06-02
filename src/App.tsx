
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DailyProgram from "./pages/DailyProgram";
import UserProfile from "./pages/UserProfile";
import AdaptiveLearning from "./pages/AdaptiveLearning";
import AdminDashboard from "./pages/AdminDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AILearning from "./pages/AILearning";
import NotFound from "./pages/NotFound";

// Education components for specific subjects
import EnglishLearning from "./components/education/EnglishLearning";
import MathematicsLearning from "./components/education/MathematicsLearning";
import CreativeLearning from "./components/education/CreativeLearning";
import ScienceLearning from "./components/education/ScienceLearning";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/daily-program" element={<DailyProgram />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/adaptive-learning" element={<AdaptiveLearning />} />
            <Route path="/ai-learning" element={<AILearning />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/school" element={<SchoolDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            
            {/* Subject-specific learning routes */}
            <Route path="/learn/english" element={<EnglishLearning />} />
            <Route path="/learn/mathematics" element={<MathematicsLearning />} />
            <Route path="/learn/creative_writing" element={<CreativeLearning />} />
            <Route path="/learn/science" element={<ScienceLearning />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
