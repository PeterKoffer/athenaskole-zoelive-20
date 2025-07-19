
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import DailyUniversePage from './pages/DailyUniversePage';
import SimulatorPage from './pages/SimulatorPage';
import Auth from './pages/Auth';
import AuthPage from './pages/AuthPage';
import DailyProgram from './pages/DailyProgram';
import DailyProgramPage from './pages/DailyProgramPage';
import UniversePage from './pages/UniversePage';
import TrainingGround from './pages/TrainingGround';
import Index from './pages/Index';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth-page" element={<AuthPage />} />
                <Route path="/daily-universe" element={<DailyUniversePage />} />
                <Route path="/simulator" element={<SimulatorPage />} />
                <Route path="/daily-program" element={<DailyProgram />} />
                <Route path="/daily-program-page" element={<DailyProgramPage />} />
                <Route path="/training-ground" element={<TrainingGround />} />
                <Route path="/universe" element={<UniversePage />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
          <ShadcnToaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
