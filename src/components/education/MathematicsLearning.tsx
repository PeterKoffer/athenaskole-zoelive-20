
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EnhancedMathematicsLearning from "./EnhancedMathematicsLearning";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('🔢 MathematicsLearning component redirecting to enhanced version');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in MathematicsLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔢</div>
          <p className="text-lg">Loading your Mathematics lesson...</p>
        </div>
      </div>
    );
  }

  // Don't render the component if user is not authenticated
  if (!user) {
    return null;
  }

  // Use the enhanced version
  return <EnhancedMathematicsLearning />;
};

export default MathematicsLearning;
