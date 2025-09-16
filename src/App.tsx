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

        {/* fallback */}
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
