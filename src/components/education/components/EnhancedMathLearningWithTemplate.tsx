
import { useAuth } from '@/hooks/useAuth';
import OptimizedMathLearningContent from './math/OptimizedMathLearningContent';

interface EnhancedMathLearningWithTemplateProps {
  onBackToProgram: () => void;
}

/**
 * Renders the lesson content directly instead of gating with the marketing template.
 * If you ever need the "WorldClassTeachingTemplate" for teachers/admins, re-enable via condition.
 */
const EnhancedMathLearningWithTemplate = ({ onBackToProgram }: EnhancedMathLearningWithTemplateProps) => {
  const { user } = useAuth();

  // Directly show optimized math lesson content for students
  return (
    <OptimizedMathLearningContent onBackToProgram={onBackToProgram} />
  );
};

export default EnhancedMathLearningWithTemplate;
