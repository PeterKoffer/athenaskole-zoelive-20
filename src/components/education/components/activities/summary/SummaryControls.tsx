
import { Button } from '@/components/ui/button';

interface SummaryControlsProps {
  canProceed: boolean;
  onShowAssessment: () => void;
  onContinue: () => void;
}

const SummaryControls = ({ canProceed, onShowAssessment, onContinue }: SummaryControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
      <div className="text-emerald-300 text-sm order-2 sm:order-1">
        Phase 6 of 6 • Summary & Next Steps
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
        <Button
          onClick={onShowAssessment}
          disabled={!canProceed}
          className={`w-full sm:w-auto px-6 py-3 text-base font-semibold ${
            canProceed 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {!canProceed ? 'Listen to Nelie first...' : 'Quick Self-Assessment'}
        </Button>
        
        <Button
          onClick={onContinue}
          disabled={!canProceed}
          className={`w-full sm:w-auto px-6 py-3 text-base font-semibold ${
            canProceed 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {!canProceed ? 'Wait for Nelie...' : 'Complete Lesson'}
        </Button>
      </div>
    </div>
  );
};

export default SummaryControls;
