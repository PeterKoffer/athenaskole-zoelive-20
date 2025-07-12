
import { Home, TestTube, Eye, User, Settings } from "lucide-react";
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";
import SimpleStealthTest from "./pages/SimpleStealthTest";
import AuthPage from "./pages/AuthPage";
import PreferencesPage from "./pages/PreferencesPage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
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
  {
    title: "Preferences",
    to: "/preferences",
    icon: <Settings className="h-4 w-4" />,
    page: <PreferencesPage />,
  },
];
