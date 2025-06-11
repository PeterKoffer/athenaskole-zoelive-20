
import { useNavigate } from "react-router-dom";
import { UnifiedLessonProvider } from "./contexts/UnifiedLessonContext";
import { MathLearningContent } from "./components/math/MathLearningContent";
import { mathActivities } from "./components/math/MathActivitiesData";

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
      subject="Mathematics"
      allActivities={mathActivities}
      onLessonComplete={handleLessonComplete}
    >
      <MathLearningContent onBackToProgram={handleBackToProgram} />
    </UnifiedLessonProvider>
  );
};

export default EnhancedMathematicsLearning;
