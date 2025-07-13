
import { Home, BookOpen, Calendar, User, Settings, Users } from "lucide-react";
import Index from "./pages/Index";
import DailyUniversePage from "./pages/DailyUniversePage";
import ProfilePage from "./pages/ProfilePage";
import PreferencesPage from "./pages/PreferencesPage";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import HomePage from "./pages/HomePage";
import SchoolDashboard from "./pages/SchoolDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DailyProgramPage from "./pages/DailyProgramPage";

export const navItems = [
  {
    title: "Index",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Home",
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
  {
    title: "School Dashboard",
    to: "/school-dashboard",
    icon: <Users className="h-4 w-4" />,
    page: <SchoolDashboard />,
  },
  {
    title: "Teacher Dashboard", 
    to: "/teacher-dashboard",
    icon: <User className="h-4 w-4" />,
    page: <TeacherDashboard />,
  },
  {
    title: "Admin Dashboard",
    to: "/admin-dashboard", 
    icon: <Settings className="h-4 w-4" />,
    page: <AdminDashboard />,
  },
  {
    title: "Daily Program",
    to: "/daily-program",
    icon: <Calendar className="h-4 w-4" />,
    page: <DailyProgramPage />,
  },
];
