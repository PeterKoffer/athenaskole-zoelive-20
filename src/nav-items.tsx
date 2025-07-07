
import { Home, TestTube, Eye } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <div>Home Page</div>, // Placeholder - you can replace with actual home component
  },
  {
    title: "Adaptive Integration Test",
    to: "/adaptive-integration-test", 
    icon: <TestTube className="h-4 w-4" />,
    page: <div>Adaptive Integration Test</div>, // This will be overridden by the specific route
  },
  {
    title: "Stealth Assessment Test",
    to: "/stealth-assessment-test",
    icon: <Eye className="h-4 w-4" />,
    page: <div>Stealth Assessment Test</div>, // This will be overridden by the specific route
  },
];
