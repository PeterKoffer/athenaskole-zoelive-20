
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TrainingGround from "./pages/TrainingGround";
import DailyProgramPage from "./pages/DailyProgramPage";
import DailyUniversePage from "./pages/DailyUniversePage";
import SchoolDashboard from "./pages/SchoolDashboard";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/auth" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Auth />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/training-ground" 
              element={
                <ProtectedRoute>
                  <TrainingGround />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/daily-program" 
              element={
                <ProtectedRoute>
                  <DailyProgramPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/daily-universe" 
              element={
                <ProtectedRoute>
                  <DailyUniversePage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/school-dashboard" 
              element={
                <ProtectedRoute requiredRole="school_leader">
                  <SchoolDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
