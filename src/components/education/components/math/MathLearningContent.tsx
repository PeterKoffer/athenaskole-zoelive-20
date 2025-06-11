
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Calculator } from "lucide-react";
import EnhancedLessonManager from "../EnhancedLessonManager";

interface MathLearningContentProps {
  onBackToProgram: () => void;
}

export const MathLearningContent = ({ onBackToProgram }: MathLearningContentProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-16 h-16 text-lime-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading your diverse Mathematics lesson with Nelie...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <EnhancedLessonManager
          subject="Mathematics"
          skillArea="Mixed Math Skills"
          onBackToProgram={onBackToProgram}
        />
      </div>
    </div>
  );
};
