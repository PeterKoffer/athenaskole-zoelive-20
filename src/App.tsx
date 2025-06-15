
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const DailyProgram = lazy(() => import("@/pages/DailyProgram"));
const SimpleSchoolDashboard = lazy(() => import("@/pages/SimpleSchoolDashboard"));
const TeacherDashboard = lazy(() => import("@/pages/TeacherDashboard"));
const ParentDashboard = lazy(() => import("@/pages/ParentDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Import learning pages
const MathematicsLearning = lazy(() => import("@/components/education/MathematicsLearning"));
const EnglishLearning = lazy(() => import("@/components/education/EnglishLearning"));
const ScienceLearning = lazy(() => import("@/components/education/ScienceLearning"));
const ComputerScienceLearning = lazy(() => import("@/components/education/ComputerScienceLearning"));
const CreativeLearning = lazy(() => import("@/components/education/CreativeLearning"));
const MusicLearning = lazy(() => import("@/components/education/MusicLearning"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen bg-gray-900">
                <Suspense fallback={
                  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h2 className="text-white text-lg font-semibold">Loading...</h2>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/daily-program" element={<DailyProgram />} />
                    <Route path="/school-dashboard" element={<SimpleSchoolDashboard />} />
                    <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                    <Route path="/parent-dashboard" element={<ParentDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/profile" element={<UserProfile />} />
                    
                    {/* Learning routes */}
                    <Route path="/learn/mathematics" element={<MathematicsLearning />} />
                    <Route path="/learn/english" element={<EnglishLearning />} />
                    <Route path="/learn/science" element={<ScienceLearning />} />
                    <Route path="/learn/computer-science" element={<ComputerScienceLearning />} />
                    <Route path="/learn/creative-arts" element={<CreativeLearning />} />
                    <Route path="/learn/music" element={<MusicLearning />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

export default App;
