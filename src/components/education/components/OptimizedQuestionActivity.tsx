
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSimpleQuestionGeneration } from './hooks/useSimpleQuestionGeneration';

interface OptimizedQuestionActivityProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onComplete: (success: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const OptimizedQuestionActivity = ({
  subject,
  skillArea,
  difficultyLevel,
  onComplete,
  questionNumber,
  totalQuestions
}: OptimizedQuestionActivityProps) => {
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const {
    currentQuestion,
    isLoading,
    error,
    generateQuestion
  } = useSimpleQuestionGeneration(subject, skillArea, difficultyLevel);

  // Timer for question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate question on mount
  useEffect(() => {
    if (!currentQuestion && !isLoading) {
      generateQuestion();
    }
  }, [currentQuestion, isLoading, generateQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
    onComplete(isCorrect);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 border-gray-700 rounded-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-blue-400 rounded-full mx-auto mb-4"></div>
          <h3 className="text-white text-lg font-semibold mb-2">Generating Question</h3>
          <p className="text-gray-400">Creating a personalized question for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center">
        <h3 className="text-white text-lg font-semibold mb-2">Question Generation Error</h3>
        <p className="text-red-300">{error}</p>
        <Button 
          onClick={generateQuestion} 
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="bg-gray-800 border-gray-700 rounded-lg p-8 text-center">
        <h3 className="text-white text-lg font-semibold mb-2">Question Not Available</h3>
        <p className="text-gray-400">Unable to load question content.</p>
        <Button 
          onClick={generateQuestion} 
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-sm">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <div className="text-gray-300 text-sm">
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-6">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start p-4 h-auto ${
              selectedAnswer === index
                ? showResult
                  ? isCorrect
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-red-600 border-red-500 text-white'
                  : 'bg-blue-600 border-blue-500 text-white'
                : showResult && index === currentQuestion.correctAnswer
                ? 'bg-green-600 border-green-500 text-white'
                : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
            }`}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
          >
            <span className="mr-3 font-semibold">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
            {showResult && index === currentQuestion.correctAnswer && (
              <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
            )}
            {showResult && selectedAnswer === index && !isCorrect && (
              <XCircle className="w-5 h-5 ml-auto text-red-400" />
            )}
          </Button>
        ))}
      </div>

      {/* Result and Explanation */}
      {showResult && (
        <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 mr-3" />
            )}
            <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct! Well done!' : 'Incorrect, but keep trying!'}
            </span>
          </div>
          
          {currentQuestion.explanation && (
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2">Explanation:</h4>
              <p className="text-gray-300">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        {!showResult ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3"
          >
            {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OptimizedQuestionActivity;
