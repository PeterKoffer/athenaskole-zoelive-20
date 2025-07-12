
import React from 'react';
import UniversalLessonTemplate from './UniversalLessonTemplate';

interface LessonTemplateFactoryProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onComplete: () => void;
  onBack: () => void;
}

// This factory now supports comprehensive multi-subject lesson generation
const LessonTemplateFactory: React.FC<LessonTemplateFactoryProps> = (props) => {
  // The Universal template now includes both single-subject and multi-subject options
  return <UniversalLessonTemplate {...props} />;
};

export default LessonTemplateFactory;
