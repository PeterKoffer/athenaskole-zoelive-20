
import React from 'react';
import { useParams } from 'react-router-dom';
import SimpleMathLearning from '@/components/education/SimpleMathLearning';

const SubjectLearningPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  
  if (!subject) {
    return <div>Subject not found</div>;
  }

  // For now, show simple math learning for all subjects
  return <SimpleMathLearning />;
};

export default SubjectLearningPage;
