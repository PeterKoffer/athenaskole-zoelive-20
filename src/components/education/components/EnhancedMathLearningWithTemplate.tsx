
import { useState } from 'react';
import { useStudentName } from './math/hooks/useStudentName';
import MathLearningIntroduction from './math/MathLearningIntroduction';
import OptimizedMathLearningContent from './math/OptimizedMathLearningContent';

interface EnhancedMathLearningWithTemplateProps {
  onBackToProgram: () => void;
}

const EnhancedMathLearningWithTemplate = ({ onBackToProgram }: EnhancedMathLearningWithTemplateProps) => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const studentName = useStudentName();

  console.log('🎓 EnhancedMathLearningWithTemplate state:', { showIntroduction, studentName });

  const handleIntroductionComplete = () => {
    console.log('🎓 Introduction completed, starting main lesson');
    setShowIntroduction(false);
  };

  // Show introduction first
  if (showIntroduction) {
    return (
      <MathLearningIntroduction 
        onIntroductionComplete={handleIntroductionComplete}
      />
    );
  }

  // Then show main math learning content
  return (
    <OptimizedMathLearningContent 
      onBackToProgram={onBackToProgram} 
    />
  );
};

export default EnhancedMathLearningWithTemplate;
