import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useRoleAccess } from "./useRoleAccess";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const { userRole } = useRoleAccess();

  useEffect(() => {
    if (loading || !user) return;

    // Mål pr. rolle (kan justeres senere)
    const targets: Record<string, string> = {
      admin: "/school-dashboard",
      school_leader: "/school-dashboard",
      school_staff: "/school-dashboard",
      teacher: "/teacher-dashboard",
      parent: "/parent-dashboard",
      student: "/daily-program",
      unknown: "/daily-program",
    };

    const target = targets[userRole ?? "unknown"] ?? "/daily-program";

    // Kun auto-redirect fra forsiden, auth, eller legacy /profile
    if (pathname === "/" || pathname === "/auth" || pathname === "/profile") {
      navigate(target, { replace: true });
    }
  }, [loading, user, userRole, navigate, pathname]);
};
