
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  disabled?: boolean;
}

const AnswerOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect,
  disabled = false
}: AnswerOptionsProps) => {
  const { speakAsNelie } = useUnifiedSpeech();

  const handleSpeakOption = async (option: string, index: number) => {
    const optionLetter = String.fromCharCode(65 + index);
    await speakAsNelie(`Option ${optionLetter}: ${option}`, true, 'answer-option');
  };

  const getOptionClassName = (index: number) => {
    if (selectedAnswer === index) {
      if (showResult) {
        return selectedAnswer === correctAnswer
          ? 'bg-green-600 border-green-500 text-white'
          : 'bg-red-600 border-red-500 text-white';
      }
      return 'bg-blue-600 border-blue-500 text-white';
    }
    
    if (showResult && index === correctAnswer) {
      return 'bg-green-600 border-green-500 text-white';
    }
    
    return 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
  };

  return (
    <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
      {options.map((option: string, index: number) => (
        <div key={index} className="relative">
          <Button
            variant="outline"
            className={`w-full text-left justify-start p-3 sm:p-4 h-auto transition-all duration-200 text-sm sm:text-base ${getOptionClassName(index)}`}
            onClick={() => !disabled && !showResult && onAnswerSelect(index)}
            disabled={showResult || disabled}
          >
            <span className="mr-2 sm:mr-3 font-semibold text-base sm:text-lg">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="flex-1 break-words pr-10">{option}</span>
            {showResult && index === correctAnswer && (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-green-400 flex-shrink-0" />
            )}
            {showResult && selectedAnswer === index && index !== correctAnswer && (
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-red-400 flex-shrink-0" />
            )}
          </Button>
          
          {/* Speaker icon for each answer option */}
          <button
            onClick={() => handleSpeakOption(option, index)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-90 hover:opacity-100"
            title="Ask Nelie to read this option"
          >
            <CustomSpeakerIcon className="w-3 h-3" size={12} color="#0ea5e9" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnswerOptions;
