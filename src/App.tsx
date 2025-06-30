import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { RoleProvider } from '@/contexts/RoleContext';
import { Toaster } from '@/components/ui/toaster';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useEffect } from 'react';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import SchoolDashboard from '@/pages/SchoolDashboard';
import SimpleSchoolDashboard from '@/pages/SimpleSchoolDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import ParentDashboard from '@/pages/ParentDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import DailyProgram from '@/pages/DailyProgram';
import CurriculumSystem from '@/pages/CurriculumSystem';

// Education pages
import MathematicsLearning from '@/components/education/MathematicsLearning';
import EnglishLearning from '@/components/education/EnglishLearning';
import ScienceLearning from '@/components/education/ScienceLearning';
import HistoryReligionLearning from '@/components/education/HistoryReligionLearning';
import GeographyLearning from '@/components/education/GeographyLearning';
import MusicLearning from '@/components/education/MusicLearning';
import CreativeArtsLearning from '@/components/education/CreativeArtsLearning';
import ComputerScienceLearning from '@/components/education/ComputerScienceLearning';
import LanguageLabLearning from '@/components/education/LanguageLabLearning';
import BodyLabLearning from '@/components/education/BodyLabLearning';
import MentalWellnessLearning from '@/components/education/MentalWellnessLearning';
import LifeEssentialsLearning from '@/components/education/LifeEssentialsLearning';

const queryClient = new QueryClient();

function AppContent() {
  useAuthRedirect();

  useEffect(() => {
    console.log('Page view:', window.location.pathname);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Dashboard Routes */}
      <Route path="/school-dashboard" element={<SchoolDashboard />} />
      <Route path="/simple-school-dashboard" element={<SimpleSchoolDashboard />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      
      {/* Program Routes */}
      <Route path="/daily-program" element={<DailyProgram />} />
      <Route path="/curriculum" element={<CurriculumSystem />} />
      
      {/* Learning Routes */}
      <Route path="/learn/mathematics" element={<MathematicsLearning />} />
      <Route path="/learn/english" element={<EnglishLearning />} />
      <Route path="/learn/science" element={<ScienceLearning />} />
      <Route path="/learn/history-religion" element={<HistoryReligionLearning />} />
      <Route path="/learn/geography" element={<GeographyLearning />} />
      <Route path="/learn/music" element={<MusicLearning />} />
      <Route path="/learn/creative-arts" element={<CreativeArtsLearning />} />
      <Route path="/learn/computer-science" element={<ComputerScienceLearning />} />
      <Route path="/learn/language-lab" element={<LanguageLabLearning />} />
      <Route path="/learn/body-lab" element={<BodyLabLearning />} />
      <Route path="/learn/mental-wellness" element={<MentalWellnessLearning />} />
      <Route path="/learn/life-essentials" element={<LifeEssentialsLearning />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Index />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <Router>
            <AppContent />
            <Toaster />
          </Router>
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
