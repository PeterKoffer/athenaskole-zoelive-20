
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { ReactNode, useEffect, useState } from "react";

interface AppLoadingWrapperProps {
  children: ReactNode;
}

const AppLoadingWrapper = ({ children }: AppLoadingWrapperProps) => {
  const { loading: authLoading } = useAuth();
  const { userRole } = useRoleAccess();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after auth is loaded OR after a short delay to prevent flash
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    if (!authLoading) {
      setShowContent(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [authLoading]);

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoadingWrapper;
