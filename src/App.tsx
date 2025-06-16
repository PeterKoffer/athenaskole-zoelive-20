
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DailyProgram from "./pages/DailyProgram";
import MathematicsLearning from "./components/education/MathematicsLearning";
import EnglishLearning from "./components/education/EnglishLearning";
import ScienceLearning from "./components/education/ScienceLearning";
import MusicLearning from "./components/education/MusicLearning";
import CreativeArtsLearning from "./components/education/CreativeArtsLearning";
import ComputerScienceLearning from "./components/education/ComputerScienceLearning";
import FloatingAITutor from "./components/FloatingAITutor";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="relative">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/daily-program" element={<DailyProgram />} />
                <Route path="/learn/mathematics" element={<MathematicsLearning />} />
                <Route path="/learn/english" element={<EnglishLearning />} />
                <Route path="/learn/science" element={<ScienceLearning />} />
                <Route path="/learn/music" element={<MusicLearning />} />
                <Route path="/learn/creative-arts" element={<CreativeArtsLearning />} />
                <Route path="/learn/computer-science" element={<ComputerScienceLearning />} />
              </Routes>
              <FloatingAITutor />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
