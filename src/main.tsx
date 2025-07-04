
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

// Import all pages and components
import Index from "./pages/Index";
import DailyProgram from "./pages/DailyProgram";
import Auth from "./pages/Auth";
import AdaptiveLearningDemo from "./pages/AdaptiveLearningDemo";
import AdaptiveIntegrationTest from "./pages/AdaptiveIntegrationTest";

// Import learning modules
import MathematicsLearning from "./components/education/MathematicsLearning";
import EnglishLearning from "./components/education/EnglishLearning";
import ScienceLearning from "./components/education/ScienceLearning";
import HistoryReligionLearning from "./components/education/HistoryReligionLearning";
import GeographyLearning from "./components/education/GeographyLearning";
import CreativeLearning from "./components/education/CreativeLearning";
import LifeEssentialsLearning from "./components/education/LifeEssentialsLearning";
import MentalWellnessLearning from "./components/education/MentalWellnessLearning";
import BodyLabLearning from "./components/education/BodyLabLearning";
import ComputerScienceLearning from "./components/education/ComputerScienceLearning";
import MusicLearning from "./components/education/MusicLearning";
import LanguageLabLearning from "./components/education/LanguageLabLearning";
import UniversalLearning from "./components/education/UniversalLearning";
import EnhancedDailyProgram from "./components/daily-program/EnhancedDailyProgram";

// Import other components
import ErrorBoundary from "./components/ErrorBoundary";
import RefactoredFloatingAITutor from "./components/floating-ai-tutor/RefactoredFloatingAITutor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/daily-program" element={<DailyProgram />} />
            <Route path="/enhanced-daily-program" element={<EnhancedDailyProgram />} />
            <Route path="/adaptive-learning-demo" element={<AdaptiveLearningDemo />} />
            <Route path="/adaptive-integration-test" element={<AdaptiveIntegrationTest />} />
            
            {/* Learning module routes */}
            <Route path="/learn/mathematics" element={<MathematicsLearning />} />
            <Route path="/learn/english" element={<EnglishLearning />} />
            <Route path="/learn/science" element={<ScienceLearning />} />
            <Route path="/learn/history-religion" element={<HistoryReligionLearning />} />
            <Route path="/learn/geography" element={<GeographyLearning />} />
            <Route path="/learn/creative-arts" element={<CreativeLearning />} />
            <Route path="/learn/life-essentials" element={<LifeEssentialsLearning />} />
            <Route path="/learn/mental-wellness" element={<MentalWellnessLearning />} />
            <Route path="/learn/body-lab" element={<BodyLabLearning />} />
            <Route path="/learn/computer-science" element={<ComputerScienceLearning />} />
            <Route path="/learn/music" element={<MusicLearning />} />
            <Route path="/learn/language-lab" element={<LanguageLabLearning />} />
            <Route path="/learn/universal" element={<UniversalLearning subject="Universal Learning" skillArea="General Knowledge" />} />
          </Routes>
          
          <RefactoredFloatingAITutor />
          <Toaster />
        </ErrorBoundary>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
