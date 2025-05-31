
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface RegistrationNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const RegistrationNavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit 
}: RegistrationNavigationButtonsProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="text-gray-300 border-gray-600 hover:bg-gray-600"
      >
        Previous
      </Button>
      
      {currentStep < totalSteps - 1 ? (
        <Button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Register Student
        </Button>
      )}
    </div>
  );
};

export default RegistrationNavigationButtons;
