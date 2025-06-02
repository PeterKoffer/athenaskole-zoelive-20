
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Loader2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const LoadingState = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusMessage = () => {
    if (timeElapsed < 5) return "AI is analyzing your learning profile...";
    if (timeElapsed < 10) return "Creating a personalized math problem...";
    if (timeElapsed < 15) return "Fine-tuning difficulty level...";
    if (timeElapsed < 25) return "Almost ready...";
    return "This is taking longer than expected...";
  };

  const getProgressWidth = () => {
    const progress = Math.min((timeElapsed / 30) * 100, 95);
    return `${progress}%`;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-lime-400 animate-pulse" />
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              {getStatusMessage()}
            </h3>
            <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{timeElapsed}s elapsed</span>
            </p>
          </div>
          <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
            <div 
              className="bg-lime-400 h-2 rounded-full transition-all duration-1000" 
              style={{ width: getProgressWidth() }}
            />
          </div>
          {timeElapsed > 20 && (
            <p className="text-yellow-400 text-xs text-center max-w-sm">
              The AI is working hard to create a perfect question for you. 
              If this continues, we'll use a backup question.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
