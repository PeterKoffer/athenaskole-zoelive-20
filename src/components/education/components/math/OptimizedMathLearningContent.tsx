
import UnifiedLessonManager from '../UnifiedLessonManager';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({
  onBackToProgram
}: OptimizedMathLearningContentProps) => {
  return (
    <UnifiedLessonManager
      subject="mathematics"
      skillArea="general_math"
      studentName="Student"
      onBackToProgram={onBackToProgram}
    />
  );
};

export default OptimizedMathLearningContent;
