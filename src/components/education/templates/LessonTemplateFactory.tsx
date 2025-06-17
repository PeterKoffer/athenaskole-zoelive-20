
import React from 'react';
import UniversalLessonTemplate from './UniversalLessonTemplate';

interface LessonTemplateFactoryProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onComplete: () => void;
  onBack: () => void;
}

// This factory can be extended to support different lesson types
const LessonTemplateFactory: React.FC<LessonTemplateFactoryProps> = (props) => {
  // For now, use the universal template for all subjects
  // In the future, we can add subject-specific templates here
  return <UniversalLessonTemplate {...props} />;
};

export default LessonTemplateFactory;
