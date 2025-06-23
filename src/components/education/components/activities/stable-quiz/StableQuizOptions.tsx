
import { Button } from '@/components/ui/button';

interface StableQuizOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  activityId: string;
  disabled?: boolean;
  showResult?: boolean;
  correctAnswer?: number;
}

export const StableQuizOptions = ({ 
  options, 
  selectedAnswer, 
  onAnswerSelect, 
  activityId,
  disabled = false,
  showResult = false,
  correctAnswer = -1
}: StableQuizOptionsProps) => {
  console.log('🎯 StableQuizOptions Debug:', {
    selectedAnswer,
    correctAnswer,
    showResult,
    optionsCount: options.length
  });

  const getButtonClassName = (index: number) => {
    const baseClasses = "p-6 text-lg h-auto transition-all duration-200 relative z-20 border-2";
    
    if (selectedAnswer === index) {
      if (showResult) {
        const isCorrect = selectedAnswer === correctAnswer;
        console.log(`🎯 Button ${index} selected. Correct answer: ${correctAnswer}. Is correct: ${isCorrect}`);
        return isCorrect
          ? `${baseClasses} bg-green-600 hover:bg-green-700 border-green-400 text-white font-bold transform scale-105`
          : `${baseClasses} bg-red-600 hover:bg-red-700 border-red-400 text-white font-bold transform scale-105`;
      }
      return `${baseClasses} bg-blue-600 hover:bg-blue-700 border-blue-400 text-white font-bold transform scale-105`;
    }
    
    if (showResult && index === correctAnswer) {
      return `${baseClasses} bg-green-600 hover:bg-green-700 border-green-400 text-white font-bold`;
    }
    
    return `${baseClasses} bg-gray-700 hover:bg-gray-600 border-gray-500 text-white hover:scale-102`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
      {options.map((option: string, index: number) => (
        <Button
          key={`${activityId}-option-${index}`}
          onClick={() => {
            if (!disabled && !showResult) {
              console.log(`🖱️ StableQuiz Button ${index} clicked`);
              onAnswerSelect(index);
            }
          }}
          disabled={disabled || showResult}
          className={getButtonClassName(index)}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold flex-shrink-0">
              {String.fromCharCode(65 + index)}
            </div>
            <span className="text-white font-medium flex-1 text-left break-words">{option}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};
