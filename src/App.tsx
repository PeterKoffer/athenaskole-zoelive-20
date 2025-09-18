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
import WelcomePage from "./pages/WelcomePage";

import TodaysAdventure from "./features/adventure/pages/TodaysAdventure";
import AdventureRunner from "./features/adventure/pages/AdventureRunner";
import TrainingGroundHome from "./features/training-ground/pages/TrainingGroundHome";
import AdventureManager from "./features/admin/pages/AdventureManager";

import TeacherMyClasses from "./pages/teacher/TeacherMyClasses";
import TeacherStudentProgress from "./pages/teacher/TeacherStudentProgress";
import TeacherSubjectWeighting from "./pages/teacher/TeacherSubjectWeighting";
import TeacherAIPreferences from "./pages/teacher/TeacherAIPreferences";
import TeacherLessonDuration from "./pages/teacher/TeacherLessonDuration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<Index />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sitemap" element={<SiteMapPage />} />

        {/* protected */}
         <Route
           path="/training-ground"
           element={<ProtectedRoute><TrainingGround /></ProtectedRoute>}
         />
         <Route
           path="/training-ground-new"
           element={<ProtectedRoute><TrainingGroundHome /></ProtectedRoute>}
         />
         <Route
           path="/adventure/:adventureId"
           element={<ProtectedRoute><AdventureRunner /></ProtectedRoute>}
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
           path="/admin/adventures"
           element={<ProtectedRoute><AdventureManager /></ProtectedRoute>}
         />
         <Route
           path="/teacher-dashboard/classes"
           element={<ProtectedRoute><TeacherMyClasses /></ProtectedRoute>}
         />
         <Route
           path="/teacher-dashboard/progress"
           element={<ProtectedRoute><TeacherStudentProgress /></ProtectedRoute>}
         />
         <Route
           path="/teacher-dashboard/subject-weighting"
           element={<ProtectedRoute><TeacherSubjectWeighting /></ProtectedRoute>}
         />
         <Route
           path="/teacher-dashboard/ai-preferences"
           element={<ProtectedRoute><TeacherAIPreferences /></ProtectedRoute>}
         />
         <Route
           path="/teacher-dashboard/duration"
           element={<ProtectedRoute><TeacherLessonDuration /></ProtectedRoute>}
         />

        {/* fallback */}
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
