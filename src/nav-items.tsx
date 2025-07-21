
import { Home, Calendar, BookOpen, Gamepad2, Users, Settings, GraduationCap, Music, Palette, Calculator, Globe2, Brain, Sparkles } from "lucide-react";
import Index from "./pages/Index";
import DailyProgramPage from "./pages/DailyProgramPage";
import SimulatorPage from "./pages/SimulatorPage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: Index,
  },
  {
    title: "Daily Program",
    to: "/daily-program",
    icon: <Sparkles className="h-4 w-4" />,
    page: DailyProgramPage,
  },
  {
    title: "Simulator",
    to: "/simulator",
    icon: <Brain className="h-4 w-4" />,
    page: SimulatorPage,
  },
];
