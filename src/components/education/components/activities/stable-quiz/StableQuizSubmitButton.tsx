
import { Button } from '@/components/ui/button';

interface StableQuizSubmitButtonProps {
  onSubmit: () => void;
  disabled: boolean;
  className?: string;
}

export const StableQuizSubmitButton = ({ 
  onSubmit, 
  disabled,
  className = ""
}: StableQuizSubmitButtonProps) => {
  console.log('🎯 StableQuizSubmitButton:', { disabled });

  return (
    <div className={`text-center relative z-20 ${className}`}>
      <Button
        onClick={() => {
          if (!disabled) {
            console.log('🖱️ Submit button clicked');
            onSubmit();
          }
        }}
        disabled={disabled}
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative z-20"
      >
        Submit Answer
      </Button>
    </div>
  );
};
