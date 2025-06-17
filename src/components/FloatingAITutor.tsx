
import React from 'react';
import RefactoredFloatingAITutor from './floating-ai-tutor/RefactoredFloatingAITutor';

// Ensure only one instance of the floating tutor exists
let floatingTutorInstance: React.ComponentType | null = null;

const FloatingAITutor = () => {
  // Prevent multiple instances
  if (!floatingTutorInstance) {
    floatingTutorInstance = RefactoredFloatingAITutor;
  }

  return <RefactoredFloatingAITutor />;
};

export default FloatingAITutor;
