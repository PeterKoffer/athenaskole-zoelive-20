
import React from 'react';
import { useParams } from 'react-router-dom';
import MathematicsLearningPage from './MathematicsLearningPage';

const SubjectLearningPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  
  if (!subject) {
    return <div>Subject not found</div>;
  }

  // For now, use the working mathematics page for all subjects
  // This fixes the blank page issue while we resolve the complex architecture
  return <MathematicsLearningPage />;
};

export default SubjectLearningPage;
