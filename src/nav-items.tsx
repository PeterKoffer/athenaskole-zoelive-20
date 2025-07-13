import { Home, BookOpen, Calendar, User, Settings, Calculator, TestTube } from "lucide-react";
import Index from "./pages/Index";
import DailyUniversePage from "./pages/DailyUniversePage";
import ProfilePage from "./pages/ProfilePage";
import PreferencesPage from "./pages/PreferencesPage";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import HomePage from "./pages/HomePage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <HomePage />,
  },
  {
    title: "HomePage",
    to: "/home",
    icon: <Home className="h-4 w-4" />,
    page: <HomePage />,
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
    page: <ProfilePage />,
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
    page: <Auth />,
  },
  {
    title: "Parent Dashboard",
    to: "/parent-dashboard",
    icon: <Users className="h-4 w-4" />,
    page: <ParentDashboard />,
  },
];
