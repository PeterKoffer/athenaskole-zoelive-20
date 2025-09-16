
import { Home, Brain, Sparkles } from "lucide-react";
import Index from "./pages/Index";
import DailyPage from "./pages/DailyPage";
import ConsolidatedSimulatorPage from "./pages/ConsolidatedSimulatorPage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: Index,
  },
  {
    title: "Daily Learning",
    to: "/daily",
    icon: <Sparkles className="h-4 w-4" />,
    page: DailyPage,
  },
  {
    title: "Simulator",
    to: "/simulator",
    icon: <Brain className="h-4 w-4" />,
    page: ConsolidatedSimulatorPage,
  },
];
