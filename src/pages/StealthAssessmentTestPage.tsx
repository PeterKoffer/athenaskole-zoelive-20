import React from 'react';
import AdaptiveLearningAtomRenderer from '@/components/adaptive-learning/AdaptiveLearningAtomRenderer';
import { LearningAtom } from '@/types/learning';
import { InteractionEvent } from '@/types/stealthAssessment';

const StealthAssessmentTestPage: React.FC = () => {
  const mockAtom: LearningAtom = {
    id: 'test-atom-sa-001',
    type: 'challenge', // Or any valid LearningAtomType
    subject: 'Mathematics',
    curriculumObjectiveId: 'g4-math-oa-A-1', // Example objective ID from your mock curriculum
    curriculumObjectiveTitle: 'Interpret a multiplication equation as a comparison.',
    narrativeContext: 'You are helping a shopkeeper understand his sales. He sold 5 apples, and that was 5 times as many as the number of oranges he sold.',
    estimatedMinutes: 5,
    interactionType: 'game', // Or 'puzzle', 'instruction' etc.
    difficulty: 'medium', // The AdaptiveLearningAtomRenderer uses this to pick mock questions
    content: {
      title: 'Multiplicative Comparison Challenge',
      description: 'Solve the problem based on the shopkeeper scenario.',
      // data for the atom, if AdaptiveLearningAtomRenderer expects specific question data here.
      // Currently, AdaptiveLearningAtomRenderer uses its own internal mockQuestions based on difficulty.
    },
    // knowledgeComponentIds: ['g4-math-oa-A-1-kc1', 'g4-math-oa-A-1-kc2'] // Ideally, KCs would be here
  };

  const handleAtomComplete = (performance: any) => {
    console.log('StealthAssessmentTestPage: Atom completed!', performance);
    // Here you could potentially load another atom or end the test session.
  };

  const eventContext = 'adaptive_practice'; // Or any other relevant context

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stealth Assessment Test Page</h1>
      <p>Interact with the learning atom below and observe the console for stealth assessment events.</p>
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
        <AdaptiveLearningAtomRenderer
          atom={mockAtom}
          onComplete={handleAtomComplete}
          eventContext={eventContext}
        />
      </div>
    </div>
  );
};

export default StealthAssessmentTestPage;
