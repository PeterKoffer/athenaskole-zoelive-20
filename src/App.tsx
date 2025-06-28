import AdaptivePracticeTestPage from './pages/AdaptivePracticeTestPage'; // Adjust path if App.tsx is not in src/
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Added useNavigate
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import FloatingAITutor from '@/components/FloatingAITutor';
import GlobalImagePreloader from '@/components/education/components/shared/GlobalImagePreloader';

// Import pages
import Index from '@/pages/Index';
import Profile from '@/pages/Profile'; // Add Profile import
import Auth from '@/pages/Auth'; // Add Auth import
import SchoolDashboard from '@/pages/SchoolDashboard';
import SimpleSchoolDashboard from '@/pages/SimpleSchoolDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import ParentDashboard from '@/pages/ParentDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import DailyProgram from '@/pages/DailyProgram';
import CurriculumDashboard from '@/components/curriculum/CurriculumDashboard';
import SimulationLauncherPage from '@/pages/SimulationLauncherPage'; // Import the new page

// Import new school management pages
import StudentRecordsPage from '@/pages/StudentRecordsPage';
import AcademicReportsPage from '@/pages/AcademicReportsPage';
import AttendanceAnalyticsPage from '@/pages/AttendanceAnalyticsPage';
import ProgressTrackingPage from '@/pages/ProgressTrackingPage';
import TeacherCommunicationsPage from '@/pages/TeacherCommunicationsPage';
import AnnouncementsPage from '@/pages/AnnouncementsPage';

// Import learning components
import AILearningModule from '@/components/adaptive-learning/AILearningModule'; // Added AILearningModule
import LanguageLearning from '@/components/LanguageLearning';
// UniversalLearning and EnhancedMathematicsLearning might be removed if no longer used directly
import MentalWellnessLearning from '@/components/education/MentalWellnessLearning';
import WorldHistoryReligionsLearning from '@/components/education/WorldHistoryReligionsLearning';
import GlobalGeographyLearning from '@/components/education/GlobalGeographyLearning';
import BodyLabLearning from '@/components/education/BodyLabLearning';
import LifeEssentialsLearning from '@/components/education/LifeEssentialsLearning';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Added useNavigate hook

  const handleLessonBack = () => navigate('/student-dashboard'); // Define back handler

  return (
    <>
      <Routes>
          <Route path="/adaptive-practice-test" element={<AdaptivePracticeTestPage />} />
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/school-dashboard" element={<SchoolDashboard />} />
        <Route path="/simple-school-dashboard" element={<SimpleSchoolDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/daily-program" element={<DailyProgram />} />
        <Route path="/curriculum" element={<CurriculumDashboard />} />
        <Route path="/simulations" element={<SimulationLauncherPage />} /> {/* Add route for simulations */}
        
        {/* School management pages */}
        <Route path="/student-records" element={<StudentRecordsPage />} />
        <Route path="/academic-reports" element={<AcademicReportsPage />} />
        <Route path="/attendance-analytics" element={<AttendanceAnalyticsPage />} />
        <Route path="/progress-tracking" element={<ProgressTrackingPage />} />
        <Route path="/teacher-communications" element={<TeacherCommunicationsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        
        {/* Learning activity routes - Rerouted to AILearningModule */}
        <Route path="/learn/mathematics" element={<AILearningModule subject="mathematics" skillArea="general_mathematics" difficultyLevel={2} onBack={handleLessonBack} />} />
        <Route path="/learn/english" element={<AILearningModule subject="english" skillArea="general_english" difficultyLevel={2} onBack={handleLessonBack} />} />
        <Route path="/learn/music" element={<AILearningModule subject="music" skillArea="general_music" difficultyLevel={2} onBack={handleLessonBack} />} />
        <Route path="/learn/science" element={<AILearningModule subject="science" skillArea="general_science" difficultyLevel={2} onBack={handleLessonBack} />} />
        <Route path="/learn/computer-science" element={<AILearningModule subject="computer-science" skillArea="general_programming" difficultyLevel={2} onBack={handleLessonBack} />} />
        <Route path="/learn/creative-arts" element={<AILearningModule subject="creative-arts" skillArea="general_arts" difficultyLevel={2} onBack={handleLessonBack} />} />

        {/* Other learning routes - kept as is for now */}
        <Route path="/learn/mental-wellness" element={<MentalWellnessLearning />} />
        <Route path="/learn/language-lab" element={<LanguageLearning />} />
        <Route path="/learn/world-history-religions" element={<WorldHistoryReligionsLearning />} />
        <Route path="/learn/global-geography" element={<GlobalGeographyLearning />} />
        <Route path="/learn/body-lab" element={<BodyLabLearning />} />
        <Route path="/learn/life-essentials" element={<LifeEssentialsLearning />} />
        <Route path="/learn/spanish" element={<LanguageLearning initialLanguage="spanish" />} />
        <Route path="/learn/french" element={<LanguageLearning initialLanguage="french" />} />
        <Route path="/learn/german" element={<LanguageLearning initialLanguage="german" />} />
        <Route path="/learn/italian" element={<LanguageLearning initialLanguage="italian" />} />
        <Route path="/learn/mandarin" element={<LanguageLearning initialLanguage="mandarin" />} />
      </Routes>
      {user && <FloatingAITutor />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen">
              <GlobalImagePreloader />
              <AppRoutes />
            </div>
            <Toaster />
            <Sonner />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
