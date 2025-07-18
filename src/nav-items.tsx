
import { Home, Calendar, BookOpen, Gamepad2, Users, Settings, GraduationCap, Music, Palette, Calculator, Globe2, Brain, Sparkles } from "lucide-react";
import Index from "./pages/Index";
import DailyUniversePage from "./pages/DailyUniversePage";
import SimulatorPage from "./pages/SimulatorPage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: Index,
  },
  {
    title: "Daily Universe",
    to: "/daily-universe",
    icon: <Sparkles className="h-4 w-4" />,
    page: DailyUniversePage,
  },
  {
    title: "Simulator",
    to: "/simulator",
    icon: <Brain className="h-4 w-4" />,
    page: SimulatorPage,
  },
];
