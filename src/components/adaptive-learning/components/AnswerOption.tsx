
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerOptionProps {
  option: string;
  index: number;
  hasAnswered: boolean;
  isCorrect: boolean;
  isSelected: boolean;
  isTempSelected: boolean;
  onClick: () => void;
}

const AnswerOption = ({ 
  option, 
  index, 
  hasAnswered, 
  isCorrect, 
  isSelected, 
  isTempSelected, 
  onClick 
}: AnswerOptionProps) => {
  const getOptionStyle = () => {
    let baseStyle = "w-full text-left p-4 rounded-lg border transition-all duration-200 ";
    
    if (hasAnswered) {
      if (isCorrect) {
        baseStyle += "bg-green-900 border-green-600 text-green-100 ";
      } else if (isSelected) {
        baseStyle += "bg-red-900 border-red-600 text-red-100 ";
      } else {
        baseStyle += "bg-gray-700 border-gray-600 text-gray-400 ";
      }
    } else {
      if (isTempSelected) {
        baseStyle += "bg-blue-900 border-blue-600 text-blue-100 ";
      } else {
        baseStyle += "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 ";
      }
    }

    return baseStyle;
  };

  const getOptionIcon = () => {
    if (!hasAnswered) return null;
    
    if (isCorrect) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (isSelected) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    
    return null;
  };

  return (
    <button
      onClick={onClick}
      disabled={hasAnswered}
      className={getOptionStyle()}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-8 h-8 rounded-full bg-gray-600 text-white text-sm font-bold flex items-center justify-center">
            {String.fromCharCode(65 + index)}
          </span>
          <span>{option}</span>
        </div>
        {getOptionIcon()}
      </div>
    </button>
  );
};

export default AnswerOption;
