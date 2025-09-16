// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TrainingGround from "./pages/TrainingGround";
import SchoolDashboard from "./pages/SchoolDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import ProfilePage from "./pages/ProfilePage";
import SiteMapPage from "./pages/SiteMapPage";
import CalendarPage from "./pages/CalendarPage";
import SubjectLearningPage from "./pages/SubjectLearningPage";
import DailyLearningSessionPage from "./pages/DailyLearningSessionPage";

import DailyProgramPage from "./pages/DailyProgramPage";
import DailyUniverseLessonPage from "./pages/DailyUniverseLessonPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sitemap" element={<SiteMapPage />} />

        {/* protected */}
        <Route
          path="/training-ground"
          element={<ProtectedRoute><TrainingGround /></ProtectedRoute>}
        />
        <Route
          path="/daily-program"
          element={<ProtectedRoute><DailyProgramPage /></ProtectedRoute>}
        />
        <Route
          path="/daily-universe-lesson"
          element={<ProtectedRoute><DailyUniverseLessonPage /></ProtectedRoute>}
        />
        <Route
          path="/school-dashboard"
          element={<ProtectedRoute><SchoolDashboard /></ProtectedRoute>}
        />
        <Route
          path="/teacher-dashboard"
          element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>}
        />
        <Route
          path="/parent-dashboard"
          element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/calendar"
          element={<ProtectedRoute><CalendarPage /></ProtectedRoute>}
        />
        <Route
          path="/subject/:subject"
          element={<ProtectedRoute><SubjectLearningPage /></ProtectedRoute>}
        />
        <Route
          path="/daily-session"
          element={<ProtectedRoute><DailyLearningSessionPage /></ProtectedRoute>}
        />

        {/* fallback */}
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
