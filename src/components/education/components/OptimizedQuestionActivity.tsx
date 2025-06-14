
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAdvancedQuestionQueue } from '@/hooks/useAdvancedQuestionQueue';
import { UniqueQuestion } from '@/services/globalQuestionUniquenessService';

interface OptimizedQuestionActivityProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onComplete: (wasCorrect: boolean) => void;
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  const {
    currentQuestion,
    getNextQuestion,
    saveQuestionResponse,
    isQueueReady,
    queueSize,
    isPreGenerating
  } = useAdvancedQuestionQueue({
    subject,
    skillArea,
    difficultyLevel,
    maxQueueSize: 3,
    preGenerateOnStart: true
  });

  // Load the first question when queue is ready
  useEffect(() => {
    if (isQueueReady && !currentQuestion) {
      console.log('📚 Loading first question from pre-generated queue');
      getNextQuestion();
      setStartTime(Date.now());
    }
  }, [isQueueReady, currentQuestion, getNextQuestion]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  }, [showResult]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || selectedAnswer === null) return;

    const responseTime = Date.now() - startTime;
    const correct = selectedAnswer === currentQuestion.correct;
    
    setIsCorrect(correct);
    setShowResult(true);

    // Save the response
    await saveQuestionResponse(currentQuestion, selectedAnswer, correct, responseTime);

    // Auto-advance after showing result
    setTimeout(() => {
      onComplete(correct);
    }, 2500);
  }, [currentQuestion, selectedAnswer, startTime, saveQuestionResponse, onComplete]);

  const handleContinue = useCallback(() => {
    // Reset for next question
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(Date.now());
    
    // Get next question from queue (this won't cause loading since it's pre-generated)
    getNextQuestion();
  }, [getNextQuestion]);

  // Show loading only if no question is available and queue isn't ready
  if (!currentQuestion && !isQueueReady) {
    return (
      <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-white">Preparing your questions...</p>
            <p className="text-gray-400 text-sm mt-2">
              {isPreGenerating ? 'Generating questions in advance...' : 'Getting ready...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-red-400">No question available. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-white">Question {questionNumber} of {totalQuestions}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Queue: {queueSize} ready
            </span>
            {isPreGenerating && (
              <span className="text-xs text-blue-400 animate-pulse">
                Generating...
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Question */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 text-left justify-start text-wrap ${
                selectedAnswer === index
                  ? showResult
                    ? isCorrect && selectedAnswer === index
                      ? 'bg-green-600 border-green-500 text-white'
                      : selectedAnswer === index
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-blue-600 border-blue-500 text-white'
                  : showResult && currentQuestion.correct === index
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
            </Button>
          ))}
        </div>

        {/* Result Display */}
        {showResult && (
          <div className={`rounded-lg p-4 ${
            isCorrect ? 'bg-green-900/50 border border-green-600' : 'bg-red-900/50 border border-red-600'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="font-semibold text-white">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {currentQuestion.explanation && (
              <p className="text-gray-300 mt-2">{currentQuestion.explanation}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!showResult && (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none"
          >
            Submit Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedQuestionActivity;
