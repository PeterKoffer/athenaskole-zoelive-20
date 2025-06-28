
import React from 'react';
import { useParams } from 'react-router-dom';
import UniversalLearning from '@/components/education/UniversalLearning';

const SubjectLearningPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  
  if (!subject) {
    return <div>Subject not found</div>;
  }

  return <UniversalLearning subject={subject} skillArea="general" />;
};

export default SubjectLearningPage;
