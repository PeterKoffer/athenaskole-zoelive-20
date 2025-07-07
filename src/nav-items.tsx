
import { Home, TestTube, Eye } from "lucide-react";
import Index from "./pages/Index";
import AdaptiveIntegrationTest from "./pages/AdaptiveIntegrationTest";
import StealthAssessmentTest from "./pages/StealthAssessmentTest";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Adaptive Integration Test",
    to: "/adaptive-integration-test", 
    icon: <TestTube className="h-4 w-4" />,
    page: <AdaptiveIntegrationTest />,
  },
  {
    title: "Stealth Assessment Test",
    to: "/stealth-assessment-test",
    icon: <Eye className="h-4 w-4" />,
    page: <StealthAssessmentTest />,
  },
];
