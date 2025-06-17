
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import FloatingAITutor from '@/components/FloatingAITutor';

// Import pages
import Index from '@/pages/Index';
import SchoolDashboard from '@/pages/SchoolDashboard';
import SimpleSchoolDashboard from '@/pages/SimpleSchoolDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import ParentDashboard from '@/pages/ParentDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import DailyProgram from '@/pages/DailyProgram';
import CurriculumDashboard from '@/components/curriculum/CurriculumDashboard';

// Import new school management pages
import StudentRecordsPage from '@/pages/StudentRecordsPage';
import AcademicReportsPage from '@/pages/AcademicReportsPage';
import AttendanceAnalyticsPage from '@/pages/AttendanceAnalyticsPage';
import ProgressTrackingPage from '@/pages/ProgressTrackingPage';
import TeacherCommunicationsPage from '@/pages/TeacherCommunicationsPage';
import AnnouncementsPage from '@/pages/AnnouncementsPage';

// Import learning components
import EnhancedEnglishLearning from '@/components/education/EnhancedEnglishLearning';
import LanguageLearning from '@/components/LanguageLearning';

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

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/school-dashboard" element={<SchoolDashboard />} />
        <Route path="/simple-school-dashboard" element={<SimpleSchoolDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/daily-program" element={<DailyProgram />} />
        <Route path="/curriculum" element={<CurriculumDashboard />} />
        
        {/* School management pages */}
        <Route path="/student-records" element={<StudentRecordsPage />} />
        <Route path="/academic-reports" element={<AcademicReportsPage />} />
        <Route path="/attendance-analytics" element={<AttendanceAnalyticsPage />} />
        <Route path="/progress-tracking" element={<ProgressTrackingPage />} />
        <Route path="/teacher-communications" element={<TeacherCommunicationsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        
        {/* Learning activity routes */}
        <Route path="/learn/english" element={<EnhancedEnglishLearning />} />
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
