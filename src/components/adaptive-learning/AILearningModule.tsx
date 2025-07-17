
import React from 'react';
import ImprovedLearningSession from './components/ImprovedLearningSession';

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  difficultyLevel?: number;
  onBack: () => void;
}

const AILearningModule = ({ subject, skillArea, onBack }: AILearningModuleProps) => {
  console.log('🤖 AILearningModule rendering for:', { subject, skillArea });
  
  return (
    <ImprovedLearningSession
      subject={subject}
      skillArea={skillArea}
      onBack={onBack}
    />
  );
};

export default AILearningModule;
