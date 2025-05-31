
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import DailyProgram from "./pages/DailyProgram";
import AdaptiveLearning from "./pages/AdaptiveLearning";
import NotFound from "./pages/NotFound";
import MathematicsLearning from "./components/education/MathematicsLearning";
import EnglishLearning from "./components/education/EnglishLearning";
import CreativeLearning from "./components/education/CreativeLearning";
import LanguageLearning from "./components/LanguageLearning";
import FloatingAITutor from "./components/FloatingAITutor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/school-dashboard" element={<SchoolDashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/daily-program" element={<DailyProgram />} />
          <Route path="/adaptive-learning" element={<AdaptiveLearning />} />
          <Route path="/learn/matematik" element={<MathematicsLearning />} />
          <Route path="/learn/dansk" element={<EnglishLearning />} />
          <Route path="/learn/engelsk" element={<LanguageLearning />} />
          <Route path="/learn/kreativ" element={<CreativeLearning />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingAITutor />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
