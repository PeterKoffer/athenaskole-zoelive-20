
import { Button } from '@/components/ui/button';

interface StableQuizSubmitButtonProps {
  onSubmit: () => void;
  disabled: boolean;
}

export const StableQuizSubmitButton = ({ onSubmit, disabled }: StableQuizSubmitButtonProps) => {
  return (
    <div className="text-center">
      <Button
        onClick={onSubmit}
        disabled={disabled}
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Submit Answer
      </Button>
    </div>
  );
};
