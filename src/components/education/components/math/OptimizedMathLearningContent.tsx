
import EnhancedMathematicsLearningWithTemplate from '../EnhancedMathematicsLearningWithTemplate';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({
  onBackToProgram
}: OptimizedMathLearningContentProps) => {
  return (
    <EnhancedMathematicsLearningWithTemplate
      onBackToProgram={onBackToProgram}
    />
  );
};

export default OptimizedMathLearningContent;
