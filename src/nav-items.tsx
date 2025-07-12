

import { Home, TestTube, Eye, User, Calendar, Settings, Calculator } from "lucide-react";
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";
import SimpleStealthTest from "./pages/SimpleStealthTest";
import AuthPage from "./pages/AuthPage";
import DailyUniversePage from "./pages/DailyUniversePage";
import PreferencesPage from "./pages/PreferencesPage";
import MathPage from "./pages/MathPage";

console.log('PreferencesPage component:', PreferencesPage);

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Daily Universe",
    to: "/universe",
    icon: <Calendar className="h-4 w-4" />,
    page: <DailyUniversePage />,
  },
  {
    title: "Math",
    to: "/math",
    icon: <Calculator className="h-4 w-4" />,
    page: <MathPage />,
  },
  {
    title: "Preferences",
    to: "/preferences",
    icon: <Settings className="h-4 w-4" />,
    page: <PreferencesPage />,
  },
  {
    title: "Authentication",
    to: "/auth",
    icon: <User className="h-4 w-4" />,
    page: <AuthPage />,
  },
  {
    title: "Test Page",
    to: "/test",
    icon: <TestTube className="h-4 w-4" />,
    page: <TestPage />,
  },
  {
    title: "Stealth Assessment Test",
    to: "/stealth-assessment-test",
    icon: <Eye className="h-4 w-4" />,
    page: <StealthAssessmentTest />,
  },
  {
    title: "Simple Stealth Test",
    to: "/simple-stealth-test",
    icon: <Eye className="h-4 w-4" />,
    page: <SimpleStealthTest />,
  },
];
