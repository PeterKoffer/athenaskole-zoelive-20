
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isComplete = currentStep >= totalSteps - 1;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm text-gray-300">
        <span>Introduction Progress</span>
        <span>{currentStep + 1} of {totalSteps}</span>
      </div>
      
      <Progress 
        value={progress} 
        className="w-full h-2 bg-gray-700"
      />
      
      {isComplete && (
        <div className="text-center">
          <p className="text-green-400 font-medium">
            ✅ Introduction Complete! Starting lesson...
          </p>
        </div>
      )}
      
      {!isComplete && (
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Nelie will continue automatically...
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
