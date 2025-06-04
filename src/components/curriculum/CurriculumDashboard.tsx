
import { useState } from 'react';
import { CurriculumStep } from '@/types/curriculum';
import CurriculumStepsOverview from './CurriculumStepsOverview';
import CurriculumManager from './CurriculumManager';

const CurriculumDashboard = () => {
  const [selectedStep, setSelectedStep] = useState<CurriculumStep | null>(null);

  const handleStepSelect = (step: CurriculumStep) => {
    setSelectedStep(step);
  };

  const handleBackToSteps = () => {
    setSelectedStep(null);
  };

  const handleCurriculumComplete = (curriculumId: string) => {
    console.log('Curriculum completed:', curriculumId);
    // Here you would update the curriculum completion status in your database
  };

  if (selectedStep) {
    return (
      <CurriculumManager
        step={selectedStep}
        onBack={handleBackToSteps}
        onCurriculumComplete={handleCurriculumComplete}
      />
    );
  }

  return <CurriculumStepsOverview onStepSelect={handleStepSelect} />;
};

export default CurriculumDashboard;
