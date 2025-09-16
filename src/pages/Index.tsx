import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import HomeMainContent from "@/components/home/HomeMainContent";
import RoleSwitcher from "@/components/RoleSwitcher";

const Index = () => {
  const { user } = useAuth();
  const { userRole } = useRoleAccess();
  const navigate = useNavigate();

  const targetPaths: Record<string, string> = {
    admin: "/school-dashboard",
    school_leader: "/school-dashboard",
    school_staff: "/school-dashboard",
    teacher: "/teacher-dashboard",
    parent: "/parent-dashboard",
    student: "/adventure",
  };

  const handleGetStarted = () => {
    if (user && userRole) {
      const targetPath = targetPaths[userRole] || "/adventure";
      navigate(targetPath);
    } else if (user) {
      navigate("/adventure");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <HomeMainContent user={user} onGetStarted={handleGetStarted} />
      {user && (
        <div className="fixed bottom-4 right-4 z-50">
          <RoleSwitcher />
        </div>
      )}
    </div>
  );
};

export default Index;
