
import { HomeIcon, TestTube, Globe, Shield, GraduationCap } from "lucide-react";
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import SimpleStealthTest from "./pages/SimpleStealthTest";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";
import AuthPage from "./pages/AuthPage";
import EducationalSimulatorPage from "./pages/EducationalSimulatorPage";
import DailyUniversePage from "./pages/DailyUniversePage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Daily Universe",
    to: "/universe",
    icon: <Globe className="h-4 w-4" />,
    page: <DailyUniversePage />,
  },
  {
    title: "Test",
    to: "/test",
    icon: <TestTube className="h-4 w-4" />,
    page: <TestPage />,
  },
  {
    title: "Simple Stealth Test",
    to: "/simple-stealth-test",
    icon: <Shield className="h-4 w-4" />,
    page: <SimpleStealthTest />,
  },
  {
    title: "Stealth Assessment Test",
    to: "/stealth-assessment-test",
    icon: <Shield className="h-4 w-4" />,
    page: <StealthAssessmentTest />,
  },
  {
    title: "Auth",
    to: "/auth",
    icon: <Shield className="h-4 w-4" />,
    page: <AuthPage />,
  },
  {
    title: "Educational Simulator",
    to: "/educational-simulator",
    icon: <GraduationCap className="h-4 w-4" />,
    page: <EducationalSimulatorPage />,
  },
];
