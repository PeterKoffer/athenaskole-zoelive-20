
import React from 'react';
import { useParams } from 'react-router-dom';
import UniversalLearning from '@/components/education/UniversalLearning';
import MathematicsLearningPage from './MathematicsLearningPage';

const SubjectLearningPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  
  if (!subject) {
    return <div>Subject not found</div>;
  }

  // Use our clean mathematics page that works without build errors
  if (subject === 'mathematics') {
    return <MathematicsLearningPage />;
  }

  return <UniversalLearning subject={subject} skillArea="general" />;
};

export default SubjectLearningPage;
