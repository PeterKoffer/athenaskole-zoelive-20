
import React from 'react';
import { useParams } from 'react-router-dom';
import SimpleMathematicsLearningPage from './SimpleMathematicsLearningPage';

const SubjectLearningPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  
  if (!subject) {
    return <div>Subject not found</div>;
  }

  // Use the simple mathematics page for fast loading
  return <SimpleMathematicsLearningPage />;
};

export default SubjectLearningPage;
