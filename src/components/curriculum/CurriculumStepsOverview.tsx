
import StepCard from './StepCard';
import CurriculumHeader from './CurriculumHeader';
import { useCurriculumSteps } from './useCurriculumSteps';
import { CurriculumStep } from '@/types/curriculum';

interface CurriculumStepsOverviewProps {
  onStepSelect: (step: CurriculumStep) => void;
}

const CurriculumStepsOverview = ({ onStepSelect }: CurriculumStepsOverviewProps) => {
  const { steps, loading, getStepProgress, getTotalCurriculums } = useCurriculumSteps();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading curriculum steps...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CurriculumHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => {
          const progressCount = getStepProgress(step.id);
          const totalCurriculums = getTotalCurriculums(step);

          return (
            <StepCard
              key={step.id}
              step={step}
              progressCount={progressCount}
              totalCurriculums={totalCurriculums}
              onStepSelect={onStepSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumStepsOverview;
