
import { Home, Brain, Sparkles } from "lucide-react";
import Index from "./pages/Index";
import TodaysAdventure from "./features/adventure/pages/TodaysAdventure";
import ConsolidatedSimulatorPage from "./pages/ConsolidatedSimulatorPage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: Index,
  },
  {
    title: "Today's Adventure",
    to: "/adventure",
    icon: <Sparkles className="h-4 w-4" />,
    page: TodaysAdventure,
  },
  {
    title: "Simulator",
    to: "/simulator",
    icon: <Brain className="h-4 w-4" />,
    page: ConsolidatedSimulatorPage,
  },
];
