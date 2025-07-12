
import { Home, BookOpen, Calendar, User, Settings, Calculator, TestTube } from "lucide-react";
import Index from "./pages/Index";
import DailyUniversePage from "./pages/DailyUniversePage";
import Profile from "./pages/Profile";
import PreferencesPage from "./pages/PreferencesPage";
import MathPage from "./pages/MathPage";
import ProfilePage from "./pages/ProfilePage";

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
    to: "/daily-universe",
    icon: <Calendar className="h-4 w-4" />,
    page: <DailyUniversePage />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Preferences",
    to: "/preferences",
    icon: <Settings className="h-4 w-4" />,
    page: <PreferencesPage />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <ProfilePage />,
  },
  {
    title: "Authentication",
    to: "/auth",
    icon: <User className="h-4 w-4" />,
    page: <AuthPage />,
  },
  {
    title: "Simulator",
    to: "/simulator",
    icon: <TestTube className="h-4 w-4" />,
    page: <SimulationsPage />,
  },
  {
    title: "Auth",
    to: "/auth",
    icon: <User className="h-4 w-4" />,
    page: <AuthPage />,
  },
];
