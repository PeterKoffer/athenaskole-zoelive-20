
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import DailyProgram from "./pages/DailyProgram";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import MathematicsLearning from "./components/education/MathematicsLearning";
import EnglishLearning from "./components/education/EnglishLearning";
import ScienceLearning from "./components/education/ScienceLearning";
import ComputerScienceLearning from "./components/education/ComputerScienceLearning";
import CreativeArtsLearning from "./components/education/CreativeArtsLearning";
import MusicLearning from "./components/education/MusicLearning";
import MentalWellnessLearning from "./components/education/MentalWellnessLearning";
import LanguageLabLearning from "./components/education/LanguageLabLearning";
import HistoryReligionLearning from "./components/education/HistoryReligionLearning";
import GeographyLearning from "./components/education/GeographyLearning";
import BodyLabLearning from "./components/education/BodyLabLearning";
import LifeEssentialsLearning from "./components/education/LifeEssentialsLearning";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/daily-program" element={<DailyProgram />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Learning Routes */}
            <Route path="/learn/mathematics" element={<MathematicsLearning />} />
            <Route path="/learn/english" element={<EnglishLearning />} />
            <Route path="/learn/science" element={<ScienceLearning />} />
            <Route path="/learn/computer-science" element={<ComputerScienceLearning />} />
            <Route path="/learn/creative-arts" element={<CreativeArtsLearning />} />
            <Route path="/learn/music" element={<MusicLearning />} />
            <Route path="/learn/mental-wellness" element={<MentalWellnessLearning />} />
            <Route path="/learn/language-lab" element={<LanguageLabLearning />} />
            <Route path="/learn/world-history-religions" element={<HistoryReligionLearning />} />
            <Route path="/learn/global-geography" element={<GeographyLearning />} />
            <Route path="/learn/body-lab" element={<BodyLabLearning />} />
            <Route path="/learn/life-essentials" element={<LifeEssentialsLearning />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
