import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from '@/hooks/useAuth.tsx';

// Imports from 'fix/adaptive-loop-metrics' (our current work)
// HomePage might be superseded by Index for root, but keeping import if used elsewhere or as fallback
import HomePage from './pages/HomePage';
import CurriculumDemo from './components/curriculum/CurriculumDemo';
import GlobalCurriculumExplorer from './components/curriculum/GlobalCurriculumExplorer';
import AdaptiveLearningDemo from './pages/AdaptiveLearningDemo';
// This is the test page we created for Stealth Assessment
import StealthAssessmentTestPage from './pages/StealthAssessmentTestPage';

// Imports from 'main' branch version
import Index from "./pages/Index"; // To be used for root
import TestPage from "./pages/TestPage";
// Note: 'main' also had a StealthAssessmentTest import, we are prioritizing ours: StealthAssessmentTestPage
import SimpleStealthTest from "./pages/SimpleStealthTest";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Root path from 'main' */}
            <Route path="/" element={<Index />} />

            {/* Other routes from 'main' */}
            <Route path="/test" element={<TestPage />} />
            <Route path="/simple-stealth-test" element={<SimpleStealthTest />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Routes from 'fix/adaptive-loop-metrics' (our current work) */}
            <Route path="/curriculum/demo" element={<CurriculumDemo />} />
            <Route path="/curriculum/global" element={<GlobalCurriculumExplorer />} />
            <Route path="/adaptive-learning-demo" element={<AdaptiveLearningDemo />} />

            {/* Our specific test page for Stealth Assessment */}
            <Route path="/stealth-assessment-test" element={<StealthAssessmentTestPage />} />

            {/* If HomePage is still needed for a different path, add it here.
                Otherwise, if Index replaces its functionality, HomePage import can be removed.
                Example: <Route path="/home" element={<HomePage />} />
            */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
