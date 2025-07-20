
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
import SchoolDashboard from "./pages/SchoolDashboard";
import ProfilePage from "./pages/ProfilePage";
import SiteMapPage from "./pages/SiteMapPage";
import SubjectLearningPage from "./pages/SubjectLearningPage";

// Import all learning components from new organized structure
import MathematicsLearning from "./components/subjects/mathematics/MathematicsLearning";
import EnglishLearning from "./components/subjects/english/EnglishLearning";
import ScienceLearning from "./components/subjects/science/ScienceLearning";
import ComputerScienceLearning from "./components/subjects/computer-science/ComputerScienceLearning";
import CreativeArtsLearning from "./components/subjects/creative-arts/CreativeArtsLearning";
import MusicLearning from "./components/subjects/music/MusicLearning";
import MentalWellnessLearning from "./components/subjects/mental-wellness/MentalWellnessLearning";
import LanguageLabLearning from "./components/subjects/language-lab/LanguageLabLearning";
import HistoryReligionLearning from "./components/subjects/history-religion/HistoryReligionLearning";
import GeographyLearning from "./components/subjects/geography/GeographyLearning";
import BodyLabLearning from "./components/subjects/body-lab/BodyLabLearning";
import LifeEssentialsLearning from "./components/subjects/life-essentials/LifeEssentialsLearning";
import GlobalGeographyLearning from "./components/subjects/global-geography/GlobalGeographyLearning";
import WorldHistoryReligionsLearning from "./components/subjects/world-history-religions/WorldHistoryReligionsLearning";

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
            <Route path="/site-map" element={<SiteMapPage />} />
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
            
            {/* Learning Routes - All subjects organized by folder structure */}
            <Route 
              path="/learn/mathematics" 
              element={
                <ProtectedRoute>
                  <MathematicsLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/english" 
              element={
                <ProtectedRoute>
                  <EnglishLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/science" 
              element={
                <ProtectedRoute>
                  <ScienceLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/computer-science" 
              element={
                <ProtectedRoute>
                  <ComputerScienceLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/creative-arts" 
              element={
                <ProtectedRoute>
                  <CreativeArtsLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/music" 
              element={
                <ProtectedRoute>
                  <MusicLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/mental-wellness" 
              element={
                <ProtectedRoute>
                  <MentalWellnessLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/language-lab" 
              element={
                <ProtectedRoute>
                  <LanguageLabLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/history-religion" 
              element={
                <ProtectedRoute>
                  <HistoryReligionLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/geography" 
              element={
                <ProtectedRoute>
                  <GeographyLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/body-lab" 
              element={
                <ProtectedRoute>
                  <BodyLabLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/life-essentials" 
              element={
                <ProtectedRoute>
                  <LifeEssentialsLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/global-geography" 
              element={
                <ProtectedRoute>
                  <GlobalGeographyLearning />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learn/world-history-religions" 
              element={
                <ProtectedRoute>
                  <WorldHistoryReligionsLearning />
                </ProtectedRoute>
              }
            />

            {/* Generic subject learning route for any other subjects */}
            <Route 
              path="/learn/:subject" 
              element={
                <ProtectedRoute>
                  <SubjectLearningPage />
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
