import SimpleMathLearningContent from './SimpleMathLearningContent';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({
  onBackToProgram
}: OptimizedMathLearningContentProps) => {
  return (
    <SimpleMathLearningContent
      onBackToProgram={onBackToProgram}
    />
  );
};

export default OptimizedMathLearningContent;