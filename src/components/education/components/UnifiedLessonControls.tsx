
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward } from 'lucide-react';
import { 
  LessonControlsProps, 
  isQuestionControls, 
  isSessionControls 
} from './interfaces/LessonControlsTypes';

const UnifiedLessonControls = (props: LessonControlsProps) => {
  const { disabled = false, className = '' } = props;

  if (isQuestionControls(props)) {
    const { showResult, selectedAnswer, isLastQuestion, onSubmitAnswer, onNextQuestion } = props;
    
    return (
      <div className={`flex justify-center w-full px-4 sm:px-6 md:px-8 ${className}`}>
        {!showResult ? (
          <Button
            onClick={onSubmitAnswer}
            disabled={selectedAnswer === null || disabled}
            className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg max-w-xs sm:max-w-sm"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={onNextQuestion}
            disabled={disabled}
            className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg max-w-xs sm:max-w-sm"
          >
            {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
          </Button>
        )}
      </div>
    );
  }

  if (isSessionControls(props)) {
    const { isSessionActive, onToggleSession, onNextQuestion, canSkip, showSkip = false } = props;
    
    return (
      <div className={`flex justify-center space-x-4 p-4 bg-gray-900 border-t border-gray-700 ${className}`}>
        <Button 
          onClick={onToggleSession} 
          disabled={disabled}
          className={`${isSessionActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isSessionActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause Session
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Resume Session
            </>
          )}
        </Button>
        
        {showSkip && canSkip && onNextQuestion && (
          <Button 
            onClick={onNextQuestion} 
            variant="outline" 
            disabled={disabled}
            className="border-gray-600 text-slate-950 bg-slate-50"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Question
          </Button>
        )}
      </div>
    );
  }

  return null;
};

export default UnifiedLessonControls;
