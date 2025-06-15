
import { useNavigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { UserRole } from "@/types/auth";

// Map each role to the correct dashboard route
const DASHBOARD_MAP: Partial<Record<UserRole, string>> = {
  admin: "/admin-dashboard",
  school_leader: "/school-dashboard",
  school_staff: "/school-dashboard",
  teacher: "/teacher-dashboard",
  student: "/daily-program",
  parent: "/parent-dashboard"
};

const DashboardHomeButton = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  const { userRole } = useRoleAccess();

  const getDashboardRoute = () => {
    if (userRole && DASHBOARD_MAP[userRole]) {
      return DASHBOARD_MAP[userRole]!;
    }
    return "/";
  };

  const handleClick = () => {
    navigate(getDashboardRoute());
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={`text-lime-400 hover:text-white hover:bg-gray-700 ${className}`}
      aria-label="Dashboard"
      title="Go to your dashboard"
    >
      <Home className="w-5 h-5 mr-2" />
      Dashboard
    </Button>
  );
};

export default DashboardHomeButton;
