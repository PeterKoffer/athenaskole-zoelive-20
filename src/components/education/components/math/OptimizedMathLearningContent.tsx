import CleanMathLearning from './CleanMathLearning';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({
  onBackToProgram
}: OptimizedMathLearningContentProps) => {
  return (
    <CleanMathLearning
      onBackToProgram={onBackToProgram}
    />
  );
};

export default OptimizedMathLearningContent;