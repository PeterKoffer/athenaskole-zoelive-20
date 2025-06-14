
import { useNavigate } from "react-router-dom";
import { UnifiedLessonProvider } from "./contexts/UnifiedLessonContext";
import { MathLearningContent } from "./components/math/MathLearningContent";

const EnhancedMathematicsLearning = () => {
  const navigate = useNavigate();
  
  const handleLessonComplete = () => {
    navigate('/daily-program');
  };

  const handleBackToProgram = () => {
    navigate('/daily-program');
  };

  return (
    <UnifiedLessonProvider
      subject="mathematics"
      skillArea="general_math"
      gradeLevel={6} // This should come from user profile
      onLessonComplete={handleLessonComplete}
    >
      <MathLearningContent onBackToProgram={handleBackToProgram} />
    </UnifiedLessonProvider>
  );
};

export default EnhancedMathematicsLearning;
