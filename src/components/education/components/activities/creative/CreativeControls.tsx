
import { Button } from '@/components/ui/button';

interface CreativeControlsProps {
  currentPrompt: number;
  totalPrompts: number;
  timeRemaining: number;
  canProceed: boolean;
  hasWrittenSomething: boolean;
  onNext: () => void;
  onSkip: () => void;
}

const CreativeControls = ({ 
  currentPrompt, 
  totalPrompts, 
  timeRemaining, 
  canProceed, 
  hasWrittenSomething, 
  onNext, 
  onSkip 
}: CreativeControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-purple-300 text-sm order-2 sm:order-1">
        Phase 5 of 6 • Creative Exploration • {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
        {!hasWrittenSomething && canProceed && (
          <Button
            onClick={onSkip}
            variant="outline"
            className="w-full sm:w-auto border-purple-400 text-purple-200 hover:bg-purple-800"
          >
            Skip This One
          </Button>
        )}
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full sm:w-auto px-6 py-3 text-base font-semibold ${
            canProceed 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          {!canProceed ? 'Listen to Nelie first...' : 
           currentPrompt < totalPrompts - 1 ? 'Next Creative Challenge' : 'Complete Creative Phase'}
        </Button>
      </div>
    </div>
  );
};

export default CreativeControls;
