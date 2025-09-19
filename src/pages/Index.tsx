import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useEffect } from "react";
import HomeMainContent from "@/components/home/HomeMainContent";
import RoleSwitcher from "@/components/RoleSwitcher";
import TodaysAdventure from "@/features/adventure/pages/TodaysAdventure";

const Index = () => {
  const { user } = useAuth();
  const { userRole, isManualRoleChange } = useRoleAccess();
  const navigate = useNavigate();

  const targetPaths: Record<string, string> = {
    admin: "/school-dashboard",
    school_leader: "/school-dashboard",
    school_staff: "/school-dashboard",
    teacher: "/teacher-dashboard",
    parent: "/parent-dashboard",
    student: "/adventure",
  };

  // Handle role-based redirects for non-student roles (only if not manually set to student)
  useEffect(() => {
    if (user && userRole && userRole !== 'student' && !isManualRoleChange()) {
      const targetPath = targetPaths[userRole];
      if (targetPath) {
        navigate(targetPath);
      }
    }
  }, [user, userRole, navigate, isManualRoleChange]);

  const handleGetStarted = () => {
    if (user) {
      // Already logged in, no action needed (content will show based on role)
      return;
    } else {
      navigate("/auth");
    }
  };

  // Show adventure content for authenticated students
  if (user && userRole === 'student') {
    return (
      <div className="min-h-screen bg-background">
        <TodaysAdventure />
        <div className="fixed bottom-4 right-4 z-50">
          <RoleSwitcher />
        </div>
      </div>
    );
  }

  // Show welcome content for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <HomeMainContent user={user} onGetStarted={handleGetStarted} />
      </div>
    );
  }

  // Show loading or redirect message for other authenticated users
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
};

export default Index;
