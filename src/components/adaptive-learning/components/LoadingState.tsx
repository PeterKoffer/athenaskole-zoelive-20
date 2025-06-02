
import { Brain, Sparkles } from "lucide-react";

interface LoadingStateProps {
  subject?: string;
  skillArea?: string;
}

const LoadingState = ({ subject = "general", skillArea = "content" }: LoadingStateProps) => {
  const getLoadingMessage = () => {
    const subjectMap: { [key: string]: string } = {
      'mathematics': 'math problem',
      'english': 'reading comprehension exercise',
      'science': 'science discovery question',
      'creative_writing': 'creative writing prompt'
    };
    
    const subjectType = subjectMap[subject] || 'learning question';
    return `Creating a personalized ${subjectType}...`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-6">
        <Brain className="w-12 h-12 text-lime-400 animate-pulse" />
        <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        AI Learning in Progress
      </h3>
      
      <p className="text-gray-300 mb-4">
        {getLoadingMessage()}
      </p>
      
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        Analyzing your learning patterns and generating content just for you
      </p>
    </div>
  );
};

export default LoadingState;
