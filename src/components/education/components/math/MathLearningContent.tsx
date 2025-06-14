
import EnhancedLessonManager from '../EnhancedLessonManager';

interface MathLearningContentProps {
  onBackToProgram: () => void;
}

export const MathLearningContent = ({ onBackToProgram }: MathLearningContentProps) => {
  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-6xl mx-auto">
        <EnhancedLessonManager
          subject="mathematics"
          skillArea="general_math"
          onBackToProgram={onBackToProgram}
        />
      </div>
    </div>
  );
};
