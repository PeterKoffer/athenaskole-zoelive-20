
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
    // Smooth transition - show content after minimal delay to prevent flash
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 50);

    // Show immediately if auth is not loading
    if (!authLoading && userRole !== null) {
      setShowContent(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [authLoading, userRole]);

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-lg font-semibold">Loading NELIE...</h2>
          <p className="text-gray-400 mt-2">Preparing your AI-powered learning experience</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoadingWrapper;
