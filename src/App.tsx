// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TrainingGround from "./pages/TrainingGround";
import DailyProgramPage from "./pages/DailyProgram";
import SchoolDashboard from "./pages/SchoolDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ProfilePage from "./pages/ProfilePage";
import SiteMapPage from "./pages/SiteMapPage";
import CalendarPage from "./pages/CalendarPage";
import SubjectLearningPage from "./pages/SubjectLearningPage";
import DailyLearningSessionPage from "./pages/DailyLearningSessionPage";
import DailyUniverseLessonPage from "./pages/DailyUniverseLessonPage";

// Subjects
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

const App = () => (
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
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
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
            path="/teacher-dashboard"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
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

          {/* Learning routes */}
          <Route
            path="/learn/:subject"
            element={
              <ProtectedRoute>
                <SubjectLearningPage />
              </ProtectedRoute>
            }
          />
          <Route path="/learn/english" element={<ProtectedRoute><EnglishLearning /></ProtectedRoute>} />
          <Route path="/learn/science" element={<ProtectedRoute><ScienceLearning /></ProtectedRoute>} />
          <Route path="/learn/computer-science" element={<ProtectedRoute><ComputerScienceLearning /></ProtectedRoute>} />
          <Route path="/learn/creative-arts" element={<ProtectedRoute><CreativeArtsLearning /></ProtectedRoute>} />
          <Route path="/learn/music" element={<ProtectedRoute><MusicLearning /></ProtectedRoute>} />
          <Route path="/learn/mental-wellness" element={<ProtectedRoute><MentalWellnessLearning /></ProtectedRoute>} />
          <Route path="/learn/language-lab" element={<ProtectedRoute><LanguageLabLearning /></ProtectedRoute>} />
          <Route path="/learn/history-religion" element={<ProtectedRoute><HistoryReligionLearning /></ProtectedRoute>} />
          <Route path="/learn/geography" element={<ProtectedRoute><GeographyLearning /></ProtectedRoute>} />
          <Route path="/learn/body-lab" element={<ProtectedRoute><BodyLabLearning /></ProtectedRoute>} />
          <Route path="/learn/life-essentials" element={<ProtectedRoute><LifeEssentialsLearning /></ProtectedRoute>} />
          <Route path="/learn/global-geography" element={<ProtectedRoute><GlobalGeographyLearning /></ProtectedRoute>} />
          <Route path="/learn/world-history-religions" element={<ProtectedRoute><WorldHistoryReligionsLearning /></ProtectedRoute>} />

          {/* Daily session routes */}
          <Route path="/daily-session" element={<ProtectedRoute><DailyLearningSessionPage /></ProtectedRoute>} />
          <Route path="/daily-universe-lesson" element={<ProtectedRoute><DailyUniverseLessonPage /></ProtectedRoute>} />

          {/* Generic subject route */}
          <Route path="/subject/:subject" element={<ProtectedRoute><SubjectLearningPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
