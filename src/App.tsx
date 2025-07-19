import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TrainingGround from "./pages/TrainingGround";
import TodaysProgram from "./pages/TodaysProgram";
import Learn from "./pages/Learn";
import LanguageLearning from "./pages/LanguageLearning";
import AdaptiveLearningSession from "./pages/AdaptiveLearningSession";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/training-ground" element={<TrainingGround />} />
          <Route path="/daily-program" element={<TodaysProgram />} />
          <Route path="/learn/:activityId" element={<Learn />} />
          <Route path="/language-learning" element={<LanguageLearning />} />
          <Route path="/adaptive-learning/:subject/:skillArea/:difficultyLevel" element={<AdaptiveLearningSession />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
