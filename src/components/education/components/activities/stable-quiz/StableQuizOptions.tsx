
import { Button } from '@/components/ui/button';

interface StableQuizOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  activityId: string;
}

export const StableQuizOptions = ({ 
  options, 
  selectedAnswer, 
  onAnswerSelect, 
  activityId 
}: StableQuizOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option: string, index: number) => (
        <Button
          key={`${activityId}-option-${index}`}
          onClick={() => {
            console.log(`🖱️ StableQuiz Button ${index} clicked`);
            onAnswerSelect(index);
          }}
          className={`p-6 text-lg h-auto transition-all duration-200 relative z-10 ${
            selectedAnswer === index
              ? 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 text-white font-bold transform scale-105'
              : 'bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white hover:scale-102'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
              {String.fromCharCode(65 + index)}
            </div>
            <span className="text-white font-medium">{option}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};
